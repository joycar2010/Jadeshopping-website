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
  RotateCcw
} from 'lucide-react'
import { mockProductDetails, mockProducts, type ProductDetail } from '@/data/mockData'
import ProductCard from '@/components/ui/ProductCard'
import { AddToCartAnimation } from '@/components/AddToCartAnimation'
import { useAddToCartAnimation } from '@/hooks/useAddToCartAnimation'
import { useStore } from '@/store/useStore'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const { animationData, triggerAnimation, onAnimationComplete } = useAddToCartAnimation()

  useEffect(() => {
    if (id && mockProductDetails[id]) {
      setProduct(mockProductDetails[id])
    } else {
      // 如果没有找到商品，跳转到商品列表页
      navigate('/products')
    }
  }, [id, navigate])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jade-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const relatedProducts = product.related_products
    .map(id => mockProducts.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4)

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = (e?: React.MouseEvent) => {
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
    
    // 添加指定数量的商品到购物车
    addToCart(productForCart, quantity)
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
      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-jade-600">
              商品列表
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 商品图片区域 */}
          <div className="space-y-4">
            {/* 主图 */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border relative">
              <img
                src={product.gallery_images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
                onClick={() => setIsImageModalOpen(true)}
              />
              {/* 售罄标签覆盖层 */}
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg">
                    售罄
                  </div>
                </div>
              )}
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
                        ? 'border-jade-500'
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
              <p className="text-gray-600 text-lg">
                {product.description}
              </p>
            </div>

            {/* 评分和评价 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {product.review_count} 条评价
              </span>
            </div>

            {/* 价格 */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-jade-600">
                ¥{product.price.toLocaleString()}
              </span>
            </div>

            {/* 库存状态 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">库存：</span>
              {product.stock_quantity > 0 ? (
                <span className="text-sm font-medium text-green-600">
                  {product.stock_quantity} 件
                </span>
              ) : (
                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-lg">
                  <span className="text-sm font-bold">售罄</span>
                </div>
              )}
            </div>

            {/* 数量选择 */}
            {product.stock_quantity > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">数量：</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-jade-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-jade-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock_quantity === 0 ? '售罄' : '加入购物车'}</span>
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    isFavorite(product.id)
                      ? 'border-red-300 text-red-600 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  <span>{isFavorite(product.id) ? '已收藏' : '收藏'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>
            </div>

            {/* 服务保障 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900">服务保障</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-jade-600" />
                  <span className="text-gray-600">包邮配送</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-jade-600" />
                  <span className="text-gray-600">正品保证</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-jade-600" />
                  <span className="text-gray-600">7天退换</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 商品详情标签页 */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* 标签导航 */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'description', label: '商品详情' },
                { key: 'specifications', label: '规格参数' },
                { key: 'reviews', label: `用户评价 (${product.review_count})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-jade-500 text-jade-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 标签内容 */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.detailed_description }}
              />
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">规格参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key}：</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">用户评价</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)} 分
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.user_avatar ? (
                            <img
                              src={review.user_avatar}
                              alt={review.user_name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {review.user_name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {review.user_name}
                            </span>
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 相关推荐 */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct!.id}
                  product={relatedProduct!}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(relatedProduct!.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 图片放大模态框 */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={product.gallery_images[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            {product.gallery_images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex === 0 
                      ? product.gallery_images.length - 1 
                      : selectedImageIndex - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex === product.gallery_images.length - 1 
                      ? 0 
                      : selectedImageIndex + 1
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