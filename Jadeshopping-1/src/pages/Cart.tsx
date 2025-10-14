import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Check, Loader2, Wifi, WifiOff } from 'lucide-react'
import { ProductService } from '@/services/productService'
import { realtimeSyncService } from '@/services/realtimeSyncService'
import { toast } from 'sonner'
import type { Product } from '@/types'

const productService = new ProductService();

const Cart: React.FC = () => {
  const navigate = useNavigate()
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    user,
    addOrderToHistory
  } = useStore()
  
  const [selectedItems, setSelectedItems] = useState<string[]>(
    cart.map(item => item.product_id)
  )
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [isConnected, setIsConnected] = useState(true)

  // Calculate total price of selected products
  const selectedTotal = cart
    .filter(item => selectedItems.includes(item.product_id))
    .reduce((total, item) => total + (item.product.price * item.quantity), 0)

  // 运费计算（满99免运费）
  const shippingFee = selectedTotal >= 99 ? 0 : 10

  // 优惠券折扣
  const couponDiscount = appliedCoupon ? selectedTotal * appliedCoupon.discount : 0

  // 最终应付金额
  const finalTotal = selectedTotal + shippingFee - couponDiscount

  // Calculate total quantity of selected products
  const selectedTotalQuantity = cart
    .filter(item => selectedItems.includes(item.product_id))
    .reduce((total, item) => total + item.quantity, 0)

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cart.map(item => item.product_id))
    }
  }

  // 选择/取消选择单个商品
  const handleSelectItem = (productId: string) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId))
    } else {
      setSelectedItems([...selectedItems, productId])
    }
  }

  // 应用优惠券
  const handleApplyCoupon = () => {
    if (couponCode === 'JADE10') {
      setAppliedCoupon({ code: couponCode, discount: 0.1 })
    } else if (couponCode === 'NEWUSER') {
      setAppliedCoupon({ code: couponCode, discount: 0.15 })
    } else {
      alert('优惠券无效')
    }
  }

  // 更新商品数量（带乐观更新）
  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const oldQuantity = cart.find(item => item.product_id === productId)?.quantity || 0
    
    try {
      // 先执行本地更新
      updateCartItemQuantity(productId, newQuantity)
      
      // 使用乐观更新同步到服务器
      await realtimeSyncService.optimisticUpdateWithRetry(
        'cart_items',
        productId,
        {
          product_id: productId,
          quantity: newQuantity,
          user_id: user?.id || 'current_user_id'
        },
        () => {
          // 本地更新已经完成
        },
        () => {
          // 回滚操作
          updateCartItemQuantity(productId, oldQuantity)
          toast.error('Failed to update quantity, please try again')
        }
      )
    } catch (error) {
      console.error('Failed to update cart quantity:', error)
      // 回滚到原始数量
      updateCartItemQuantity(productId, oldQuantity)
      toast.error('Failed to update quantity')
    }
  }

  // 删除选中商品
  const handleDeleteSelected = () => {
    selectedItems.forEach(productId => {
      removeFromCart(productId)
    })
    setSelectedItems([])
  }

  // Cache selected cart product data
  const selectedCartItems = useMemo(() => {
    return cart.filter(item => selectedItems.includes(item.product_id));
  }, [cart, selectedItems]);

  // Validate product data integrity
  const validateCartItems = useCallback((items: typeof selectedCartItems, selectedCount: number) => {
    if (items.length !== selectedCount) {
      return { isValid: false, error: 'Some selected products do not exist in cart' };
    }
    
    const hasInvalidItems = items.some(item => 
      !item.product || 
      !item.product.id || 
      !item.product.name || 
      typeof item.product.price !== 'number' ||
      typeof item.quantity !== 'number' ||
      item.quantity <= 0
    );
    
    if (hasInvalidItems) {
      return { isValid: false, error: 'Selected product data is incomplete' };
    }
    
    return { isValid: true, error: null };
  }, []);

  // Handle checkout
  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert('Please select products to checkout');
      return;
    }

    const validation = validateCartItems(selectedCartItems, selectedItems.length);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (!user) {
      alert('Please login first');
      return;
    }

    try {
      // 创建订单项
      const orderItems = selectedCartItems.map(item => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_id: '', // 将在创建订单时设置
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product.price,
        product: item.product
      }));

      // 计算总金额
      const totalAmount = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

      // 创建模拟订单
      const newOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        total_amount: totalAmount,
        status: 'delivered' as const, // 直接设置为已送达状态
        shipping_address: {
          full_name: user.full_name,
          phone: user.phone || '138****8888',
          street: '默认收货地址',
          city: '北京市',
          state: '北京市',
          country: '中国',
          postal_code: '100000'
        },
        payment_method: 'balance',
        payment_status: 'paid' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: orderItems.map(item => ({ ...item, order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }))
      };

      // 1. 先跳转到支付成功页面
      navigate('/order-success', { 
        state: { 
          order: newOrder,
          message: '订单提交成功！'
        } 
      });

      // 2. 然后处理订单状态并同步至用户中心的"我的订单"模块
      setTimeout(() => {
        addOrderToHistory(newOrder);
      }, 100);

      // 3. 最后清空购物车数据
      setTimeout(() => {
        selectedItems.forEach(productId => {
          removeFromCart(productId);
        });
      }, 200);

    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Order creation failed, please try again later');
    }
  };





  // 设置实时订阅
  useEffect(() => {
    const initializeRealtime = async () => {
      try {
        await realtimeSyncService.initialize({
          onCartUpdate: (cartUpdate) => {
            // 处理购物车更新
            console.log('Cart updated:', cartUpdate)
            toast.info('Cart has been updated', { duration: 3000 })
          },
          onProductStockUpdate: (stockUpdate) => {
            // 检查购物车中是否有该商品
            const cartItem = cart.find(item => item.product_id === stockUpdate.id)
            if (cartItem) {
              if (stockUpdate.stock_quantity === 0) {
                toast.warning(`${cartItem.product.name} is now out of stock`, {
                  duration: 5000,
                  action: {
                    label: 'Remove',
                    onClick: () => removeFromCart(cartItem.product_id)
                  }
                })
              } else if (stockUpdate.stock_quantity < cartItem.quantity) {
                toast.warning(`${cartItem.product.name} stock is low. Only ${stockUpdate.stock_quantity} available`, {
                  duration: 4000,
                  action: {
                    label: 'Update',
                    onClick: () => handleQuantityChange(cartItem.product_id, stockUpdate.stock_quantity)
                  }
                })
              }
            }
          },
          onConnectionChange: (connected) => {
            setIsConnected(connected)
            if (connected) {
              toast.success('Real-time updates connected', { duration: 2000 })
            } else {
              toast.warning('Real-time updates disconnected', { duration: 3000 })
            }
          },
          onError: (error) => {
            console.error('Realtime sync error:', error)
            toast.error('Real-time sync error occurred')
          }
        })

        // 订阅用户购物车变化
        if (user?.id) {
          await realtimeSyncService.subscribeToUserCart(user.id, (payload) => {
            console.log('User cart changed:', payload)
            // 这里可以处理其他设备对购物车的修改
            if (payload.eventType === 'DELETE') {
              toast.info('Item removed from cart on another device')
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Cart updated on another device')
            }
          })
        }

        // 订阅购物车中所有商品的库存变化
        const productIds = cart.map(item => item.product_id)
        if (productIds.length > 0) {
          await realtimeSyncService.subscribeToMultipleProductsStock(productIds, (stockUpdates) => {
            stockUpdates.forEach(update => {
              const cartItem = cart.find(item => item.product_id === update.id)
              if (cartItem && update.stock_quantity < cartItem.quantity) {
                toast.warning(`Stock updated for ${cartItem.product.name}`)
              }
            })
          })
        }
      } catch (error) {
        console.error('Failed to initialize realtime sync:', error)
        setIsConnected(false)
      }
    }

    initializeRealtime()

    return () => {
      realtimeSyncService.unsubscribeAll()
    }
  }, [user?.id, cart, removeFromCart])

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        const result = await productService.getFeaturedProducts(4);
        if (result.success && result.data) {
          setRecommendedProducts(result.data);
        }
      } catch (error) {
        console.error('Failed to load recommended products:', error);
      }
    };

    loadRecommendedProducts();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 面包屑导航 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-jade-600">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">Shopping Cart</span>
            </nav>
          </div>
        </div>

        {/* 空购物车状态 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover our beautiful antique collection</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-jade-600 text-white font-medium rounded-lg hover:bg-jade-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* 推荐商品 */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Recommended for You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-jade-600 font-bold">¥{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 连接状态指示器 */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-yellow-800">
              <WifiOff className="w-4 h-4" />
              <span>Real-time updates disconnected. Cart data may not be current.</span>
            </div>
          </div>
        </div>
      )}

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-jade-600">Home</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">Shopping Cart</span>
            </div>
            
            {/* 实时连接状态 */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs">Live</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs">Offline</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 购物车商品列表 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* 购物车头部 */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Shopping Cart ({cartItemCount} items)
                  </h1>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center text-sm text-jade-600 hover:text-jade-700"
                    >
                      <div className={`w-4 h-4 mr-2 border-2 rounded ${
                        selectedItems.length === cart.length 
                          ? 'bg-jade-600 border-jade-600' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {selectedItems.length === cart.length && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      Select All
                    </button>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleDeleteSelected}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete Selected
                      </button>
                    )}
                    <button
                      onClick={clearCart}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* 选择框 */}
                      <button
                        onClick={() => handleSelectItem(item.product_id)}
                        className="mt-2"
                      >
                        <div className={`w-5 h-5 border-2 rounded ${
                          selectedItems.includes(item.product_id)
                            ? 'bg-jade-600 border-jade-600'
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {selectedItems.includes(item.product_id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </button>

                      {/* 商品图片 */}
                      <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                        <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      </Link>

                      {/* 商品信息 */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="text-lg font-medium text-gray-900 hover:text-jade-600 line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                        <p className="text-lg font-bold text-jade-600 mt-2">
                          ¥{item.product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* 数量控制 */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 小计和删除 */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ¥{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="mt-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 订单摘要栏 */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-jade-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-600 mt-2">
                    Coupon applied: {appliedCoupon.code} (-{(appliedCoupon.discount * 100).toFixed(0)}%)
                  </p>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">¥{selectedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shippingFee === 0 ? 'Free' : `¥${shippingFee}`}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">-¥{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-jade-600">
                      ¥{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Guarantee */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>✓ Free shipping over ¥99</p>
                  <p>✓ 7-day return policy</p>
                  <p>✓ Authenticity guaranteed</p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full py-3 mb-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {selectedItems.length === 0 ? 'Select Items' : `Checkout (${selectedTotalQuantity})`}
              </button>

              {/* Continue Shopping Button */}
              <Link
                to="/products"
                className="w-full py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center border border-yellow-400 text-yellow-600 hover:bg-yellow-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端底部固定栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center text-sm"
            >
              <div className={`w-4 h-4 mr-2 border-2 rounded ${
                selectedItems.length === cart.length 
                  ? 'bg-green-600 border-green-600' 
                  : 'border-gray-300'
              } flex items-center justify-center`}>
                {selectedItems.length === cart.length && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              Select All
            </button>
            <div className="text-sm">
              <span className="text-gray-600">Total: </span>
              <span className="text-lg font-bold text-green-600">
                ¥{finalTotal.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className="px-6 py-2 font-medium rounded-lg transition-all duration-200 flex items-center bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {selectedItems.length === 0 ? 'Select Items' : `Checkout (${selectedTotalQuantity})`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart