import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  CreditCard,
  Gift,
  HelpCircle,
  Shield,
  Truck,
  RotateCcw,
  LogOut,
  ChevronRight,
  Heart,
  Eye,
  UserPlus,
  Grid3X3,
  Star,
  Wallet,
  Crown
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import AccountSidebar from '../components/AccountSidebar';
import { getProductsData } from '../data/mockData';

const Follow: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'browsed' | 'purchased'>('following');
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后管理您关注的店铺/品牌</p>
            <Link to="/login" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const recommendedProducts = getProductsData().data.slice(0, 12);

  const stores = [
    { name: 'Rovax', followers: '40K', surge: '73%' },
    { name: 'PANDUOLA CHARM', followers: '171K', surge: '55%' },
    { name: 'SHEGLAM HAIR', followers: '98K', surge: '21%' },
    { name: 'Jade Master', followers: '64K', surge: '34%' },
    { name: 'Crystal House', followers: '87K', surge: '18%' },
    { name: 'Agate Studio', followers: '52K', surge: '12%' }
  ];

  const toggleFollow = (name: string) => {
    setFollowed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const followingCount = Object.values(followed).filter(Boolean).length;

  // 左侧导航菜单数据（与个人中心一致，当前高亮“关注”）
  const sidebarMenus = [
    {
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Star },
        { name: 'VIP', nameCn: 'VIP', path: '/vip', icon: Crown },
        { name: 'Profile', nameCn: '个人资料', path: '/settings', icon: User },
        { name: 'Address Book', nameCn: '地址簿', path: '/address', icon: Package },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/payments', icon: CreditCard }
      ]
    },
    {
      title: 'My Assets',
      titleCn: '我的资产',
      items: [
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/coupons', icon: Gift },
        { name: 'My Points', nameCn: '我的积分', path: '/points', icon: Star },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: Gift }
      ]
    },
    {
      title: 'My Orders',
      titleCn: '我的订单',
      items: [
        { name: 'All Orders', nameCn: '所有订单', path: '/orders', icon: Package },
        { name: 'Pending Payment', nameCn: '待付款', path: '/orders?tab=unpaid', icon: CreditCard },
        { name: 'Processing', nameCn: '处理中', path: '/orders?tab=processing', icon: Package },
        { name: 'Shipped', nameCn: '已发货', path: '/orders?tab=shipped', icon: Truck },
        { name: 'Review', nameCn: '待评价', path: '/orders?tab=review', icon: Star },
        { name: 'Return', nameCn: '退货', path: '/orders?tab=return', icon: RotateCcw }
      ]
    },
    {
      title: 'My Favorites',
      titleCn: '我的收藏',
      isActive: true,
      items: [
        { name: 'Wish List', nameCn: '心愿单', path: '/favorites', icon: Heart },
        { name: 'Recently Viewed', nameCn: '最近浏览', path: '/recently-viewed', icon: Eye },
        { name: 'Follow', nameCn: '关注', path: '/follow', icon: UserPlus, isActive: true }
      ]
    },
    {
      title: 'Customer Service',
      titleCn: '客户服务',
      items: [
        { name: 'Help Center', nameCn: '帮助中心', path: '/help', icon: HelpCircle },
        { name: 'Contact Us', nameCn: '联系我们', path: '/contact', icon: HelpCircle },
        { name: 'Buyback Center', nameCn: '回购中心', path: '/buyback', icon: HelpCircle }
      ]
    },
    {
      title: 'Policy',
      titleCn: '政策',
      items: [
        { name: 'Coupon Policy', nameCn: '优惠券政策', path: '/policy/coupons', icon: Gift },
        { name: 'Points Policy', nameCn: '积分政策', path: '/policy/points', icon: Star },
        { name: 'About Wallet', nameCn: '关于钱包', path: '/policy/wallet', icon: Wallet },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/policy/payments', icon: CreditCard },
        { name: 'Shipping', nameCn: '配送政策', path: '/shipping', icon: Truck },
        { name: 'Returns', nameCn: '退货政策', path: '/returns', icon: RotateCcw },
        { name: 'Privacy', nameCn: '隐私政策', path: '/help', icon: Shield }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* 左侧导航栏 */}
          <AccountSidebar groups={sidebarMenus} />

          {/* 右侧主内容区 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* 关注标签 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('following')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'following'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    FOLLOWING({followingCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('browsed')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'browsed'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    BROWSED(0)
                  </button>
                  <button
                    onClick={() => setActiveTab('purchased')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'purchased'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    PURCHASED(0)
                  </button>
                </div>
              </div>

              {/* 内容区 */}
              <div className="p-8">
                {activeTab === 'following' && followingCount === 0 ? (
                  // 空状态
                  <div className="text-center py-16">
                    <UserPlus className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">关注你喜欢的店铺</h2>
                    <p className="text-gray-600 mb-2">You currently do not have any following store.</p>
                    <p className="text-gray-600 mb-8">发现更多心仪品牌与店铺，开启关注获取更新。</p>
                    <a
                      href="http://localhost:5174/follow"
                      className="inline-block bg-black text-white px-12 py-4 text-lg font-medium hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Go Shopping
                    </a>
                  </div>
                ) : (
                  // 简单显示已关注店铺（本地状态）
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.filter((s) => followed[s.name]).map((store) => (
                      <div key={store.name} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{store.name}</h3>
                            <p className="text-xs text-gray-500">{store.followers} Followers</p>
                          </div>
                          <button
                            onClick={() => toggleFollow(store.name)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                          >
                            Unfollow
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 p-4">
                          {recommendedProducts.slice(0, 3).map((p) => (
                            <img key={`${store.name}-${p.id}`} src={p.images[0]} alt={p.name} className="w-full h-20 object-cover rounded" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 推荐店铺区域 */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                  <Link
                    to="/products"
                    className="flex items-center space-x-1 text-black hover:text-gray-600 transition-colors"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="text-sm font-medium">查看全部</span>
                  </Link>
                </div>

                {/* 推荐店铺卡片网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store, idx) => (
                    <div key={store.name} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(store.name + ' brand logo modern minimal vector')}&image_size=square`}
                            alt={store.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{store.name}</h3>
                            <p className="text-xs text-gray-500">{store.followers} Followers · Surge {store.surge}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFollow(store.name)}
                          className={`px-4 py-2 text-sm rounded font-medium transition-colors ${
                            followed[store.name] ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          {followed[store.name] ? 'Following' : 'Follow'}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-4">
                        {recommendedProducts.slice(idx, idx + 3).map((p) => (
                          <div key={`${store.name}-${p.id}`} className="relative">
                            <img src={p.images[0]} alt={p.name} className="w-full h-24 object-cover rounded" />
                            {p.originalPrice && p.originalPrice > p.price && (
                              <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1 py-[2px] rounded">
                                -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                              </div>
                            )}
                          </div>
                        ))}
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

export default Follow;