import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react'
import { ProductService } from '@/services/productService'
import ProductCard from '@/components/ui/ProductCard'
import { AddToCartAnimation } from '@/components/AddToCartAnimation'
import { useAddToCartAnimation } from '@/hooks/useAddToCartAnimation'
import { useStore } from '@/store/useStore'
import { realtimeSyncService } from '@/services/realtimeSyncService'
import { toast } from 'sonner'
import type { Product } from '@/types'

// Extended product type to support detail pages
interface ProductDetail extends Product {
  detailed_description: string;
  reviews: any[];
  rating: number;
  review_count: number;
  gallery_images: string[];
  related_products: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [stockWarning, setStockWarning] = useState<string | null>(null)
  
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const { animationData, triggerAnimation, onAnimationComplete } = useAddToCartAnimation()
  
  const productService = new ProductService()

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate('/products')
        return
      }

      try {
        setLoading(true)
        setError(null)

        const result = await productService.getProductById(id)
        
        if (result.success && result.data) {
          // Transform Product to ProductDetail
          const productDetail: ProductDetail = {
            ...result.data,
            detailed_description: result.data.description,
            reviews: [], // TODO: Load reviews from database
            rating: 4.5, // TODO: Calculate from reviews
            review_count: 0, // TODO: Count from reviews
            gallery_images: result.data.images,
            related_products: [] // TODO: Load related products
          }
          setProduct(productDetail)
          
          // 检查库存状态
          if (productDetail.stock_quantity === 0) {
            setStockWarning('This product is currently out of stock')
          } else if (productDetail.stock_quantity <= 5) {
            setStockWarning(`Only ${productDetail.stock_quantity} items left in stock`)
          }
        } else {
          setError('Product not found')
          setTimeout(() => navigate('/products'), 2000)
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Failed to load product')
        setTimeout(() => navigate('/products'), 2000)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, navigate])

  // 设置实时订阅
  useEffect(() => {
    if (!id) return

    const initializeRealtime = async () => {
      try {
        await realtimeSyncService.initialize({
          onProductStockUpdate: (stockUpdate) => {
            if (stockUpdate.id === id) {
              setProduct(prev => prev ? {
                ...prev,
                stock_quantity: stockUpdate.stock_quantity,
                is_available: stockUpdate.is_available
              } : null)
              
              // 更新库存警告
              if (stockUpdate.stock_quantity === 0) {
                setStockWarning('This product is now out of stock')
                toast.error('Product is now out of stock', {
                  duration: 5000,
                  action: {
                    label: 'View Similar',
                    onClick: () => navigate('/products')
                  }
                })
              } else if (stockUpdate.stock_quantity <= 5) {
                setStockWarning(`Only ${stockUpdate.stock_quantity} items left in stock`)
                toast.warning(`Only ${stockUpdate.stock_quantity} items left in stock`, {
                  duration: 4000
                })
              } else {
                setStockWarning(null)
                if (stockUpdate.previous_stock && stockUpdate.previous_stock <= 5) {
                  toast.success('Product is back in stock!')
                }
              }
            }
          },
          onProductUpdate: (updatedProduct) => {
            if (updatedProduct.id === id) {
              setProduct(prev => prev ? {
                ...prev,
                ...updatedProduct,
                detailed_description: updatedProduct.description,
                gallery_images: updatedProduct.images
              } : null)
              toast.info('Product information has been updated', {
                duration: 3000
              })
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

        // 订阅特定产品的库存变化
        await realtimeSyncService.subscribeToProductStock(id, (payload) => {
          console.log('Product stock changed:', payload)
        })
      } catch (error) {
        console.error('Failed to initialize realtime sync:', error)
        setIsConnected(false)
      }
    }

    initializeRealtime()

    return () => {
      realtimeSyncService.unsubscribeAll()
    }
  }, [id, navigate])

  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product?.category_id) return
      
      try {
        const relatedResult = await productService.getProductsByCategory(product.category_id, 4)
        if (relatedResult.success && relatedResult.data) {
          // Filter out current product
          const filtered = relatedResult.data.filter(p => p.id !== id)
          setRelatedProducts(filtered.slice(0, 4))
        }
      } catch (err) {
        console.error('Error loading related products:', err)
      }
    }

    loadRelatedProducts()
  }, [product?.category_id, id])

  // 处理添加到购物车（带库存检查）
  const handleAddToCart = async (event: React.MouseEvent) => {
    if (!product) return

    // 检查库存
    if (product.stock_quantity === 0) {
      toast.error('Product is out of stock')
      return
    }

    if (quantity > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} items available`)
      setQuantity(product.stock_quantity)
      return
    }

    try {
      // 乐观更新库存
      await realtimeSyncService.optimisticStockUpdate(
        product.id,
        -quantity,
        (productId, newStock) => {
          setProduct(prev => prev ? {
            ...prev,
            stock_quantity: newStock,
            is_available: newStock > 0
          } : null)
        }
      )

      // 添加到购物车
      addToCart(product, quantity)
      
      // 触发动画
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      triggerAnimation({
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        productImage: product.image_url || '/placeholder-product.jpg',
        productName: product.name
      })

      toast.success(`Added ${quantity} ${product.name} to cart`)
      setQuantity(1) // 重置数量
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add to cart, please try again')
    }
  }

  // 数量变更处理
  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return
    
    if (newQuantity <= 0) {
      setQuantity(1)
      return
    }
    
    if (newQuantity > product.stock_quantity) {
      toast.warning(`Only ${product.stock_quantity} items available`)
      setQuantity(product.stock_quantity)
      return
    }
    
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jade-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-jade-600 text-white px-6 py-2 rounded-lg hover:bg-jade-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const handleQuantityChangeByDelta = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async (e?: React.MouseEvent) => {
    // 将商品详情转换为Product类型
    const productForCart = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.gallery_images,
      description: product.description,
      category_id: product.category_id,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      specifications: product.specifications
    }
    
    // 如果有点击事件，触发动画
    if (e) {
      triggerAnimation(productForCart, e)
    }
    
    // 乐观更新：先添加到购物车，然后同步到服务器
    try {
      // 先执行本地更新
      addToCart(productForCart, quantity)
      toast.success(`Added ${quantity} item(s) to cart`)
      
      // 使用乐观更新同步到服务器
      await realtimeSyncService.optimisticUpdateWithRetry(
        'cart_items',
        `${product.id}_${Date.now()}`, // 临时ID，实际应该从服务器获取
        {
          product_id: product.id,
          quantity: quantity,
          user_id: 'current_user_id' // 应该从认证状态获取
        },
        () => {
          // 本地更新已经在 addToCart 中完成
        },
        () => {
          // 回滚操作：从购物车移除商品
          toast.error('Failed to add to cart, please try again')
        }
      )
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add to cart')
    }
  }



  const handleToggleFavorite = () => {
    toggleFavorite(product.id)
  }

  const handleShare = () => {
    // TODO: 实现分享逻辑
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 连接状态指示器 */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Live Updates</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>

      {/* 库存警告 */}
      {stockWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700 font-medium">{stockWarning}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-jade-600 hover:text-jade-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 商品图片区域 */}
          <div className="space-y-4">
            {/* 主图 */}
            <div className="aspect-square bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={product.gallery_images[selectedImageIndex] || product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>

            {/* 缩略图 */}
            {product.gallery_images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.gallery_images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-jade-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 商品信息区域 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.review_count} reviews)
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-jade-600 mb-4">
                ¥{product.price.toLocaleString()}
              </div>
            </div>

            {/* 库存状态 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Stock:</span>
              <span className={`text-sm font-medium ${
                product.stock_quantity === 0 
                  ? 'text-red-600' 
                  : product.stock_quantity <= 5 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
              }`}>
                {product.stock_quantity === 0 
                  ? 'Out of Stock' 
                  : `${product.stock_quantity} available`
                }
              </span>
            </div>

            {/* 数量选择 */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChangeByDelta(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-0 focus:ring-0"
                />
                <button
                  onClick={() => handleQuantityChangeByDelta(1)}
                  disabled={quantity >= product.stock_quantity}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-jade-600 text-white px-6 py-3 rounded-lg hover:bg-jade-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  isFavorite(product.id)
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* 产品特性 */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-jade-600" />
                <span className="text-gray-600">Free shipping on orders over ¥99</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-jade-600" />
                <span className="text-gray-600">Authentic Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-jade-600" />
                <span className="text-gray-600">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* 商品详情标签页 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'description', label: 'Description' },
                { key: 'specifications', label: 'Specifications' },
                { key: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-jade-600 text-jade-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.detailed_description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="text-gray-600">{product.category_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Stock:</span>
                    <span className="text-gray-600">{product.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Availability:</span>
                    <span className={`font-medium ${product.is_available ? 'text-green-600' : 'text-red-600'}`}>
                      {product.is_available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* 相关产品 */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  viewMode="grid"
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(relatedProduct.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 图片放大模态框 */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={product.gallery_images[selectedImageIndex] || product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            {product.gallery_images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => 
                    prev === 0 ? product.gallery_images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => 
                    prev === product.gallery_images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 移动端底部固定购买栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex space-x-3">
          <button
            onClick={handleToggleFavorite}
            className={`p-3 rounded-lg border transition-colors ${
              isFavorite(product.id)
                ? 'border-red-300 text-red-600 bg-red-50'
                : 'border-gray-300 text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full bg-jade-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-jade-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.stock_quantity === 0 ? '售罄' : '加入购物车'}</span>
          </button>

        </div>
      </div>
      
      {/* 添加到购物车动画 */}
      {animationData && (
        <AddToCartAnimation
          isAnimating={true}
          productImage={animationData.product.image}
          startPosition={animationData.startPosition}
          endPosition={animationData.endPosition}
          onAnimationComplete={onAnimationComplete}
        />
      )}
    </div>
  )
}

export default ProductDetail