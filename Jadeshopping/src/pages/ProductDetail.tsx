import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowLeft, ZoomIn, MessageCircle, Truck, Shield, RotateCcw } from 'lucide-react';
import { getProductById, getRelatedProducts, getProductReviews } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';
import { Product, Review } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'specs'>('details');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (id) {
      const productData = getProductById(id);
      setProduct(productData || null);
      
      if (productData) {
        setRelatedProducts(getRelatedProducts(productData.category, id));
        setReviews(getProductReviews(id));
      }
      
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('商品已添加到购物车！');
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const ImageModal = () => (
    showImageModal && product && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
        <div className="max-w-4xl max-h-full p-4">
          <img
            src={product.images[selectedImageIndex]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80&fm=webp';
            }}
          />
        </div>
      </div>
    )
  );

  const ConsultModal = () => (
    showConsultModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowConsultModal(false)}>
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">购买咨询</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">您的问题</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="请描述您想咨询的问题..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">联系方式</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入您的手机号或邮箱"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConsultModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('咨询已提交，我们会尽快回复您！');
                  setShowConsultModal(false);
                }}
                className="flex-1 btn-primary"
              >
                提交咨询
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">商品未找到</h2>
          <Link to="/products" className="btn-primary">
            返回商品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Link
          to="/products"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          返回商品列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 商品图片 */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-jade">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80&fm=webp';
                }}
              />
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
              >
                <ZoomIn className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary-500'
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

          {/* 商品信息 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} 分 ({reviews.length}条评价)
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  销量: {product.sales}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 价格 */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                库存: {product.stock} 件
              </p>
            </div>

            {/* 服务保障 */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600">包邮</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600">正品保证</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-primary-500" />
                <span className="text-sm text-gray-600">7天退换</span>
              </div>
            </div>

            {/* 购买操作 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  数量:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  加入购物车
                </button>
                <Link
                  to="/checkout"
                  className="flex-1 btn-secondary flex items-center justify-center"
                >
                  立即购买
                </Link>
              </div>

              <button
                onClick={() => setShowConsultModal(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>购买咨询</span>
              </button>
            </div>
          </div>
        </div>

        {/* 商品详情、评价、规格 */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                商品详情
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                用户评价 ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'specs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                规格参数
              </button>
            </nav>
          </div>
          
          <div className="py-8">
            {activeTab === 'details' && (
              <div className="card p-8">
                <h3 className="text-xl font-semibold mb-4">商品详情</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">产品特点:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>精选优质玉石原料，质地温润细腻</li>
                      <li>传统工艺与现代技术完美结合</li>
                      <li>每件商品都经过严格质量检测</li>
                      <li>提供专业的售后服务和保养指导</li>
                      <li>支持专业鉴定证书，确保品质</li>
                      <li>精美包装，适合收藏或馈赠</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="card p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {review.user_name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{review.user_name}</span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{review.created_at}</span>
                          </div>
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex space-x-2">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`${review.user_name}的评价图片 ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">暂无评价</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="card p-8">
                <h3 className="text-xl font-semibold mb-6">规格参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 相关商品推荐 */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">相关推荐</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square overflow-hidden rounded-t-xl">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-red-500 font-bold">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageModal />
      <ConsultModal />
    </div>
  );
};

export default ProductDetail;