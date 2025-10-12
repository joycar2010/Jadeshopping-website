import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { ArrowLeft, MapPin, Plus, Edit, CreditCard, Wallet, Check, Tag } from 'lucide-react'
import { mockPaymentMethods, mockUserAddresses, mockCoupons } from '@/data/mockData'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/Toast'

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { toasts, success, error, removeToast } = useToast()
  const { 
    cart, 
    user,
    userAddresses,
    selectedAddress,
    paymentMethods,
    selectedPaymentMethod,
    orderSummary,
    appliedCoupon,
    checkoutLoading,
    setUserAddresses,
    setSelectedAddress,
    clearCart,
    addOrderToHistory,
    setPaymentMethods,
    setSelectedPaymentMethod,
    calculateOrderSummary,
    applyCoupon,
    removeCoupon,
    createOrder
  } = useStore()

  const [couponCode, setCouponCode] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showCouponInput, setShowCouponInput] = useState(false)

  // 获取选中的购物车商品
  const selectedCartItems = cart.filter(item => item.quantity > 0)

  useEffect(() => {
    // 如果购物车为空，跳转回购物车页面
    if (selectedCartItems.length === 0) {
      navigate('/cart')
      return
    }

    // 初始化地址和支付方式数据
    if (userAddresses.length === 0) {
      setUserAddresses(mockUserAddresses)
      const defaultAddress = mockUserAddresses.find(addr => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      }
    }

    if (paymentMethods.length === 0) {
      setPaymentMethods(mockPaymentMethods)
      // 默认选择余额支付
      const balancePayment = mockPaymentMethods.find(method => method.type === 'balance')
      if (balancePayment) {
        setSelectedPaymentMethod(balancePayment)
      }
    }

    // 计算订单摘要
    calculateOrderSummary()
  }, [selectedCartItems.length, userAddresses.length, paymentMethods.length, setUserAddresses, setSelectedAddress, setPaymentMethods, setSelectedPaymentMethod, calculateOrderSummary, navigate])

  // 处理地址选择
  const handleAddressSelect = (address: typeof userAddresses[0]) => {
    setSelectedAddress(address)
  }

  // 处理支付方式选择
  const handlePaymentMethodSelect = (method: typeof paymentMethods[0]) => {
    setSelectedPaymentMethod(method)
  }

  // 应用优惠券
  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(c => c.code === couponCode && c.is_active)
    if (coupon) {
      applyCoupon(coupon)
      setCouponCode('')
      setShowCouponInput(false)
    } else {
      alert('优惠券无效或已过期')
    }
  }

  // 移除优惠券
  const handleRemoveCoupon = () => {
    removeCoupon()
  }

  // 提交订单
  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      error('请选择收货地址', '请先选择一个收货地址后再提交订单')
      return
    }

    if (!selectedPaymentMethod) {
      error('请选择支付方式', '请先选择一种支付方式后再提交订单')
      return
    }

    try {
      const order = await createOrder({
        items: selectedCartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shipping_address: selectedAddress,
        payment_method: selectedPaymentMethod.type,
        coupon_code: appliedCoupon?.code
      })

      if (order) {
        // 1. 清空当前用户的购物车所有商品
        clearCart()
        
        // 2. 将订单数据同步至用户中心的"我的订单"模块
        addOrderToHistory(order)
        
        // 3. 确保订单数据与用户账号正确绑定（已在 createOrder 中处理）
        
        // 4. 显示成功提示信息
        success('订单提交成功！', '您的订单已成功创建，正在跳转到订单详情页面...')
        
        // 跳转到订单成功页面
        navigate('/order-success', { state: { orderId: order.id, paymentMethod: selectedPaymentMethod.type, amount: orderSummary?.total_amount } })
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      error('订单提交失败', '创建订单时发生错误，请检查网络连接后重试')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-jade-600 text-white font-medium rounded-lg hover:bg-jade-700 transition-colors"
          >
            去登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">首页</Link>
            <span className="text-gray-400">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-jade-600">购物车</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">结算</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">确认订单</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-jade-600" />
                  收货地址
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center text-jade-600 hover:text-jade-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新增地址
                </button>
              </div>

              {userAddresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">暂无收货地址</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="px-4 py-2 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
                  >
                    添加收货地址
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAddresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-jade-600 bg-jade-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-medium text-gray-900">{address.name}</span>
                            <span className="ml-2 text-gray-600">{address.phone}</span>
                            {address.is_default && (
                              <span className="ml-2 px-2 py-1 bg-jade-100 text-jade-600 text-xs rounded">
                                默认
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {address.province} {address.city} {address.district} {address.address}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedAddress?.id === address.id && (
                            <Check className="w-5 h-5 text-jade-600" />
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">商品清单</h2>
              <div className="space-y-4">
                {selectedCartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-jade-600 font-medium">
                          ¥{item.product.price.toLocaleString()}
                        </span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ¥{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-jade-600" />
                支付方式
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.filter(method => method.enabled).map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod?.id === method.id
                        ? 'border-jade-600 bg-jade-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </div>
                      {selectedPaymentMethod?.id === method.id && (
                        <Check className="w-5 h-5 text-jade-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    {method.processing_fee > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        手续费: {(method.processing_fee * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">优惠券</span>
                  {!appliedCoupon && (
                    <button
                      onClick={() => setShowCouponInput(!showCouponInput)}
                      className="text-jade-600 hover:text-jade-700 text-sm flex items-center"
                    >
                      <Tag className="w-4 h-4 mr-1" />
                      使用优惠券
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon.name}</p>
                      <p className="text-xs text-green-600">{appliedCoupon.code}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      移除
                    </button>
                  </div>
                ) : showCouponInput && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="请输入优惠券代码"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors text-sm"
                    >
                      使用
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品总价</span>
                  <span className="text-gray-900">
                    ¥{orderSummary?.subtotal?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">运费</span>
                  <span className="text-gray-900">
                    {(orderSummary?.shipping_fee || 0) === 0 ? '免运费' : `¥${orderSummary?.shipping_fee}`}
                  </span>
                </div>
                {selectedPaymentMethod?.processing_fee && selectedPaymentMethod.processing_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">手续费</span>
                    <span className="text-gray-900">
                      ¥{((orderSummary?.subtotal || 0) * selectedPaymentMethod.processing_fee).toFixed(2)}
                    </span>
                  </div>
                )}
                {(orderSummary?.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">优惠券折扣</span>
                    <span className="text-green-600">
                      -¥{orderSummary?.discount_amount?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">应付总额</span>
                    <span className="text-xl font-bold text-jade-600">
                      ¥{orderSummary?.total_amount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedPaymentMethod?.type === 'balance' && user && (
                <div className="mb-6 p-3 bg-jade-50 border border-jade-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jade-700">账户余额</span>
                    <span className="font-medium text-jade-800">
                      ¥{user.balance?.toLocaleString() || '0'}
                    </span>
                  </div>
                  {user.balance && orderSummary?.total_amount && user.balance < orderSummary.total_amount && (
                    <p className="text-xs text-red-600 mt-1">余额不足，请选择其他支付方式</p>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={
                  checkoutLoading || 
                  !selectedAddress || 
                  !selectedPaymentMethod ||
                  (selectedPaymentMethod?.type === 'balance' && user?.balance && orderSummary?.total_amount && user.balance < orderSummary.total_amount)
                }
                className="w-full py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    处理中...
                  </>
                ) : (
                  '提交订单'
                )}
              </button>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>✓ 7天无理由退换</p>
                  <p>✓ 正品保证</p>
                  <p>✓ 安全支付</p>
                  <p>✓ 快速发货</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast 通知 */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

export default Checkout