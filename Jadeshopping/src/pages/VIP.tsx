import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import { useUserStore } from '../store/useUserStore';
import { getProductsData } from '../data/mockData';
import {
  Crown,
  Star,
  Gift,
  Ticket,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Wallet as WalletIcon,
  Package,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';

const VIP: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useUserStore();
  const [expanded, setExpanded] = useState<string[]>(['my-account', 'my-assets', 'my-orders']);

  const products = useMemo(() => getProductsData().data.slice(0, 6), []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">请先登录</h2>
            <p className="text-gray-600 mb-6">登录后可查看 SHEIN VIP 等级与会员权益</p>
            <Link to="/login?redirect=%2Fvip" className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
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
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Crown },
        { name: 'SHEIN VIP', nameCn: 'SHEIN VIP', path: '/vip', icon: Crown, isActive: true },
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
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: WalletIcon },
        { name: 'Gift Cards', nameCn: '礼品卡', path: '/gift-card', icon: CreditCard }
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
        { name: 'Wish List', nameCn: '心愿单', path: '/favorites', icon: Star },
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
      id: 'policy',
      title: 'Policy',
      titleCn: '政策',
      items: [
        { name: 'Coupon Policy', nameCn: '优惠券政策', path: '/policy/coupons', icon: Gift },
        { name: 'Points Policy', nameCn: '积分政策', path: '/policy/points', icon: Star },
        { name: 'About Wallet', nameCn: '关于钱包', path: '/policy/wallet', icon: WalletIcon },
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

  const vipLevel = 'S3';
  const progressPct = 62; // 示例百分比

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部页头 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">SHEIN VIP</span>
            <span className="text-gray-500 text-sm">会员等级与权益</span>
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
            {/* VIP 个人资料卡片与进度 */}
            <section className="bg-black text-white rounded-xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=user'}
                    alt={user?.name}
                    className="w-14 h-14 rounded-full border border-gray-700"
                  />
                  <div>
                    <div className="text-sm uppercase text-gray-300">SHEIN VIP</div>
                    <div className="text-2xl font-bold">{user?.name || 'VIP Member'} · {vipLevel}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">升级进度</div>
                  <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden mt-2">
                    <div
                      className="h-2 bg-yellow-400"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">本月订单 8/10 · 本月消费 $120/$150</div>
                </div>
              </div>
            </section>

            {/* 等级要求 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { level: 'S1', orders: 3, amount: 50 },
                { level: 'S2', orders: 6, amount: 100 },
                { level: 'S3', orders: 10, amount: 150 }
              ].map((req, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">等级 {req.level}</h3>
                  </div>
                  <p className="text-sm text-gray-600">订单数 ≥ {req.orders}</p>
                  <p className="text-sm text-gray-600">消费金额 ≥ ${req.amount}</p>
                </div>
              ))}
            </section>

            {/* 我的奖励 */}
            <section className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">我的奖励 My Rewards</h3>
                <Link to="/points" className="text-sm text-blue-600 hover:underline">Redemption Record</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Star, title: 'Exclusive Icon', desc: '专属图标，展现尊贵身份' },
                  { icon: Gift, title: 'Loyalty Coupon', desc: '忠诚优惠券，下次购物可用' },
                  { icon: Ticket, title: 'Free Trial', desc: '免费试用资格，优先体验新品' },
                  { icon: TrendingUp, title: 'Points Reward', desc: '积分加速，消费返还更多' }
                ].map((reward, idx) => {
                  const Icon = reward.icon as any;
                  return (
                    <div key={idx} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-gray-700" />
                        <span className="font-medium">{reward.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reward.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 专属促销 & 商品推荐 */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">$3-only promotions · Selected Items For You</h3>
                <Link to="/products" className="text-sm text-blue-600 hover:underline">查看更多</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 truncate">{p.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-semibold">${p.price}</span>
                        <Link to={`/product/${p.id}`} className="text-sm text-blue-600 hover:underline">立即查看</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">常见问题 FAQs</h3>
              <div className="space-y-4">
                {[
                  { q: '如何获得/维持 VIP 资格？', a: '根据当月订单数与消费金额达到等级要求即可获得或维持相应等级。具体以平台规则为准。' },
                  { q: 'VIP 奖励何时发放？', a: '每月结算后发放，当月达标的奖励将在次月初到账。' },
                  { q: '是否支持多账户合并？', a: '暂不支持，VIP 资格与奖励仅对应绑定账户。' }
                ].map((faq, idx) => (
                  <div key={idx} className="border-l-4 border-gray-300 pl-4">
                    <p className="font-medium text-gray-900">{faq.q}</p>
                    <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VIP;