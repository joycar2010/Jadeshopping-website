import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  User, 
  Package, 
  CreditCard, 
  Gift, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  Star,
  Eye,
  UserPlus,
  Wallet,
  Award,
  Shield,
  Truck,
  RotateCcw,
  FileText,
  Grid3X3,
  Plus,
  Trash2
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useCartStore } from '../store/useCartStore';
import { getProductsData } from '../data/mockData';

const Favorites: React.FC = () => {
  const { user, logout } = useUserStore();
  const { favorites, removeFavorite } = useFavoriteStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'items' | 'boards'>('items');

  // 获取推荐商品
  const recommendedProducts = getProductsData().data.slice(0, 8);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后查看收藏商品</p>
            <Link to="/login" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    // 使用简单的提示而不是alert
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '商品已添加到购物车';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // 左侧导航菜单数据
  const sidebarMenus = [
    {
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'SHEIN CLUB', nameCn: 'VIP会员', path: '/settings', icon: Award },
        { name: 'Profile', nameCn: '个人资料', path: '/settings', icon: User },
        { name: 'Address Book', nameCn: '地址簿', path: '/address', icon: Package }
      ]
    },
    {
      title: 'My Assets',
      titleCn: '我的资产',
      items: [
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/settings', icon: Gift },
        { name: 'My Points', nameCn: '我的积分', path: '/settings', icon: Star },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/settings', icon: Wallet },
        { name: 'Gift Cards', nameCn: '礼品卡', path: '/settings', icon: Gift }
      ]
    },
    {
      title: 'My Orders',
      titleCn: '我的订单',
      items: [
        { name: 'All Orders', nameCn: '所有订单', path: '/orders', icon: Package },
        { name: 'Pending Payment', nameCn: '待付款', path: '/orders?status=pending', icon: CreditCard },
        { name: 'Processing', nameCn: '处理中', path: '/orders?status=processing', icon: Package },
        { name: 'Shipped', nameCn: '已发货', path: '/orders?status=shipped', icon: Truck }
      ]
    },
    {
      title: 'My Favorites',
      titleCn: '我的收藏',
      isActive: true,
      items: [
        { name: 'Wish List', nameCn: '心愿单', path: '/favorites', icon: Heart, isActive: true },
        { name: 'Recently Viewed', nameCn: '最近浏览', path: '/history', icon: Eye },
        { name: 'Follow', nameCn: '关注', path: '/favorites', icon: UserPlus }
      ]
    },
    {
      title: 'Customer Service',
      titleCn: '客户服务',
      items: [
        { name: 'Help Center', nameCn: '帮助中心', path: '/help', icon: HelpCircle },
        { name: 'Contact Us', nameCn: '联系我们', path: '/contact', icon: HelpCircle }
      ]
    },
    {
      title: 'Other Services',
      titleCn: '其他服务',
      items: [

        { name: 'Survey Center', nameCn: '调查中心', path: '/service', icon: FileText }
      ]
    },
    {
      title: 'Policy',
      titleCn: '政策',
      items: [
        { name: 'Shipping', nameCn: '配送政策', path: '/shipping', icon: Truck },
        { name: 'Returns', nameCn: '退货政策', path: '/returns', icon: RotateCcw },
        { name: 'Privacy', nameCn: '隐私政策', path: '/help', icon: Shield }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主体内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* 左侧导航栏 */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* 用户信息头部 */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%20elegant%20person&image_size=square'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">玉石雅韵会员</p>
                  </div>
                </div>
              </div>

              {/* 导航菜单 */}
              <div className="py-2">
                {sidebarMenus.map((menu, menuIndex) => (
                  <div key={menuIndex} className="mb-1">
                    <div className={`px-6 py-3 text-sm font-medium ${menu.isActive ? 'bg-gray-50 text-black' : 'text-gray-600'}`}>
                      {menu.titleCn}
                    </div>
                    <div className="space-y-1">
                      {menu.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          className={`flex items-center justify-between px-8 py-2 text-sm transition-colors ${
                            item.isActive 
                              ? 'bg-black text-white' 
                              : 'text-gray-600 hover:text-black hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.nameCn}</span>
                          </div>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* 退出登录 */}
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="flex items-center justify-between w-full px-6 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut className="h-4 w-4" />
                      <span>退出登录</span>
                    </div>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧主内容区 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* 心愿单标签导航 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('items')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'items'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    ITEMS({favorites.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('boards')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'boards'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    BOARDS(0)
                  </button>
                </div>
              </div>

              {/* 心愿单内容 */}
              <div className="p-8">
                {favorites.length === 0 ? (
                  // 空状态设计
                  <div className="text-center py-16">
                    <div className="mb-8">
                      <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Heart It.</h2>
                      <p className="text-gray-600 mb-2">收藏心仪的玉石珍品，慢慢品味选择。</p>
                      <p className="text-gray-600 mb-8">及时获取缺货商品的补货通知。</p>
                      <Link
                        to="/products"
                        className="inline-block bg-black text-white px-12 py-4 text-lg font-medium hover:bg-gray-800 transition-colors rounded-lg"
                      >
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                ) : (
                  // 收藏商品列表
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <Link to={`/product/${favorite.id}`}>
                            <img
                              src={favorite.images[0]}
                              alt={favorite.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <button
                            onClick={() => removeFavorite(favorite.id)}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <Heart className="h-4 w-4 fill-current text-red-500" />
                          </button>
                          {favorite.originalPrice && favorite.originalPrice > favorite.price && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              -{Math.round((1 - favorite.price / favorite.originalPrice) * 100)}%
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <Link to={`/product/${favorite.id}`}>
                            <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                              {favorite.name}
                            </h3>
                          </Link>
                          <div className="flex items-center space-x-1 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(favorite.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">({favorite.reviewCount})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-black">
                                {formatPrice(favorite.price)}
                              </span>
                              {favorite.originalPrice && favorite.originalPrice > favorite.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(favorite.originalPrice)}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddToCart(favorite)}
                              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {favorite.sales}+ 已售
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* You May Also Like 推荐区域 */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">您可能还喜欢</h2>
                  <Link
                    to="/products"
                    className="flex items-center space-x-1 text-black hover:text-gray-600 transition-colors"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="text-sm font-medium">查看全部</span>
                  </Link>
                </div>

                {/* 分类标签 */}
                <div className="flex space-x-4 mb-6">
                  <span className="px-4 py-2 bg-black text-white text-sm rounded-full">和田玉</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors">翡翠</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors">水晶</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors">玛瑙</span>
                </div>

                {/* 推荐商品网格 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </div>
                        )}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-black">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.sales}+ 已售
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;