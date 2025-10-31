import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import AccountSidebar from '../components/AccountSidebar';
import { getProductsData } from '../data/mockData';
import {
  Award,
  Crown,
  Star,
  Gift,
  Truck,
  CreditCard,
  HelpCircle,
  Shield,
  Package,
  Heart,
  Wallet,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Ticket,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const MemberClub: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useUserStore();

  const [expanded, setExpanded] = useState<string[]>(['my-account']);

  const products = useMemo(() => getProductsData().data.slice(0, 8), []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">请先登录</h2>
            <p className="text-gray-600 mb-6">登录后可查看会员俱乐部权益与订阅选项</p>
            <Link to="/login" className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sidebarMenus = [
    {
      id: 'my-account',
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Award, isActive: true },
        { name: 'Profile', nameCn: '个人资料', path: '/settings', icon: Package },
        { name: 'Address Book', nameCn: '地址簿', path: '/address', icon: Package },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/payments', icon: CreditCard }
      ]
    },
    {
      id: 'my-assets',
      title: 'My Assets',
      titleCn: '我的资产',
      items: [
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/coupons', icon: Gift },
        { name: 'My Points', nameCn: '我的积分', path: '/points', icon: Star },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: Wallet },
        { name: 'Gift Cards', nameCn: '礼品卡', path: '/gift-card', icon: Gift }
      ]
    },
    {
      id: 'my-orders',
      title: 'My Orders',
      titleCn: '我的订单',
      items: [
        { name: 'All Orders', nameCn: '所有订单', path: '/orders', icon: Package },
        { name: 'Pending Payment', nameCn: '待付款', path: '/orders?tab=unpaid', icon: CreditCard },
        { name: 'Processing', nameCn: '处理中', path: '/orders?tab=processing', icon: Package },
        { name: 'Shipped', nameCn: '已发货', path: '/orders?tab=shipped', icon: Truck },
        { name: 'Review', nameCn: '待评价', path: '/orders?tab=review', icon: Star },
        { name: 'Return', nameCn: '退货', path: '/orders?tab=return', icon: Truck }
      ]
    },
    {
      id: 'my-favorites',
      title: 'My Favorites',
      titleCn: '我的收藏',
      items: [
        { name: 'Wish List', nameCn: '心愿单', path: '/favorites', icon: Heart },
        { name: 'Recently Viewed', nameCn: '最近浏览', path: '/recently-viewed', icon: Package },
        { name: 'Follow', nameCn: '关注', path: '/follow', icon: Package }
      ]
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      titleCn: '客户服务',
      items: [
        { name: 'Help Center', nameCn: '帮助中心', path: '/help', icon: HelpCircle },
        { name: 'Contact Us', nameCn: '联系我们', path: '/contact', icon: HelpCircle },
        { name: 'Buyback Center', nameCn: '回购中心', path: '/buyback', icon: HelpCircle }
      ]
    },
    {
      id: 'other-services',
      title: 'Other Services',
      titleCn: '其他服务',
      items: [
        { name: 'Survey Center', nameCn: '调查中心', path: '/service', icon: HelpCircle }
      ]
    },
    {
      id: 'policy',
      title: 'Policy',
      titleCn: '政策',
      items: [
        { name: 'Coupon Policy', nameCn: '优惠券政策', path: '/policy/coupons', icon: Gift },
        { name: 'Points Policy', nameCn: '积分政策', path: '/policy/points', icon: Star },
        { name: 'About Wallet', nameCn: '关于钱包', path: '/policy/wallet', icon: Wallet },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/policy/payments', icon: CreditCard },
        { name: 'Shipping', nameCn: '配送政策', path: '/shipping', icon: Truck },
        { name: 'Returns', nameCn: '退货政策', path: '/returns', icon: Truck },
        { name: 'Privacy', nameCn: '隐私政策', path: '/help', icon: Shield }
      ]
    }
  ];

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部页头 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">Member CLUB</span>
            <span className="text-gray-500 text-sm">会员俱乐部</span>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* 左侧导航栏 */}
          <AccountSidebar groups={sidebarMenus} />

          {/* 右侧主内容区 */}
          <main className="flex-1">
            {/* 会员价值概览 */}
            <section className="bg-black text-white rounded-xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm uppercase text-gray-300 mb-2">Expect to save up to</div>
                  <div className="text-4xl font-bold">$2,427.00</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span>Extra 5% OFF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-pink-300" />
                    <span>3X Shipping Coupons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-300" />
                    <span>Points Reward</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 订阅选项 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {[
                { title: 'Quarterly', price: '$2.99', note: 'Special Offer' },
                { title: 'Annual', price: '$8.99', note: 'Best Value' }
              ].map((plan, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-500">CHOOSE YOUR SHEIN CLUB MEMBERSHIP</div>
                      <h3 className="text-xl font-semibold mt-1">{plan.title}</h3>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">{plan.note}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                      JOIN FOR {plan.price}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">点击加入即表示您同意相关条款与条件</p>
                </div>
              ))}
            </section>

            {/* 专属优惠展示 */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Extra 5% OFF</h3>
                <Link to="/products" className="text-sm text-black hover:underline flex items-center gap-1">
                  查看更多 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-gray-600 mb-4">Exclusively for you: Enjoy an extra 5% OFF on 100k+ items!</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((p: any, i: number) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center';
                      }}
                    />
                    <div className="p-3">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-gray-600 text-xs">${p.price.toFixed(2)}</div>
                      <div className="text-xs text-green-600 mt-1">Extra 5% OFF</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 运费优惠券 */}
            <section className="mb-10">
              <h3 className="text-xl font-semibold mb-3">3X Shipping Coupons</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '$4 OFF Orders $15.00+ From SHEIN CLUB', note: 'Shipping Coupon' },
                  { title: '$5 OFF Orders $20.00+ From SHEIN CLUB', note: 'Shipping Coupon' },
                  { title: '$10 OFF Orders $50.00+ From SHEIN CLUB', note: 'Shipping Coupon' }
                ].map((c, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Ticket className="h-5 w-5 text-pink-500" />
                      <div className="font-medium">{c.title}</div>
                    </div>
                    <div className="text-xs text-gray-500">{c.note}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 积分奖励 */}
            <section className="mb-10">
              <h3 className="text-xl font-semibold mb-3">Points Reward</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">Order Requirement</th>
                      <th className="px-4 py-2">Points Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">Any order</td>
                      <td className="px-4 py-2">x2 points</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2">$200+ order</td>
                      <td className="px-4 py-2">x2 points + bonus</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 积分规则以实际活动为准</p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberClub;