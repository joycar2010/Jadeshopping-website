import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import {
  Gift,
  CreditCard,
  Wallet as WalletIcon,
  Star,
  User,
  Package,
  Truck,
  HelpCircle,
  Shield,
  RotateCcw,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Crown
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

const GiftCard: React.FC = () => {
  const { user } = useUserStore();
  const [linkCardOpen, setLinkCardOpen] = useState(false);

  const bestSellers = useMemo(() => (
    [
      { theme: 'Love', value: 25, price: 25, gradient: 'from-pink-400 to-red-500' },
      { theme: "Mother's Day", value: 50, price: 50, gradient: 'from-red-400 to-orange-400' },
      { theme: "Father's Day", value: 100, price: 100, gradient: 'from-orange-400 to-amber-500' },
      { theme: 'Birthday', value: 30, price: 30, gradient: 'from-fuchsia-400 to-pink-500' },
      { theme: 'Festive', value: 75, price: 75, gradient: 'from-rose-400 to-red-600' }
    ]
  ), []);

  const sidebarGroups = [
    {
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Award },
        { name: 'VIP', nameCn: 'VIP', path: '/vip', icon: Crown },
        { name: 'Profile', nameCn: '个人资料', path: '/settings', icon: User },
        { name: 'Address Book', nameCn: '地址簿', path: '/address', icon: Package },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/payments', icon: CreditCard }
      ]
    },
    {
      title: 'My Assets',
      titleCn: '我的资产',
      isActive: true,
      items: [
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/coupons', icon: Gift },
        { name: 'My Points', nameCn: '我的积分', path: '/points', icon: Star },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: WalletIcon },
        { name: 'Gift Cards', nameCn: '礼品卡', path: '/gift-card', icon: CreditCard, isActive: true }
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
      items: [
        { name: 'Wishlist', nameCn: '心愿单', path: '/favorites', icon: Star },
        { name: 'Recently Viewed', nameCn: '最近浏览', path: '/recently-viewed', icon: Sparkles },
        { name: 'Follow', nameCn: '关注', path: '/follow', icon: User }
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
        { name: 'About Wallet', nameCn: '关于钱包', path: '/policy/wallet', icon: WalletIcon },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/policy/payments', icon: CreditCard },
        { name: 'Shipping', nameCn: '配送政策', path: '/shipping', icon: Truck },
        { name: 'Returns', nameCn: '退货政策', path: '/returns', icon: RotateCcw },
        { name: 'Privacy', nameCn: '隐私政策', path: '/help', icon: Shield }
      ]
    },
    {
      title: 'Sign Out',
      titleCn: '退出登录',
      items: [
        { name: 'Sign Out', nameCn: '退出登录', path: '/login', icon: LogOut }
      ]
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">请登录后查看“礼品卡”</h2>
            <p className="text-gray-600 mb-6">登录后可管理余额、绑定卡片与购买推荐</p>
            <Link to="/login" className="inline-flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              前往登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* 左侧导航栏 */}
          <AccountSidebar groups={sidebarGroups} />

          {/* 右侧主内容区 */}
          <div className="flex-1">
            {/* 标题 */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold">GIFT CARD</h1>
              <p className="text-gray-600">礼品卡</p>
            </div>

            {/* 顶部礼品卡信息卡片 */}
            <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-xl text-white p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-2xl font-bold mb-2">Gift Card</div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Flexible Use</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Total Balance</div>
                  <div className="text-3xl font-bold">$0.00</div>
                  <div className="mt-4 flex items-center gap-3 justify-end">
                    <button className="px-3 py-2 rounded-md bg-white/20 text-white border border-white/30 hover:bg-white/30">Check Balance</button>
                    <button
                      className="px-3 py-2 rounded-md bg-white text-red-600 hover:bg-gray-100"
                      onClick={() => setLinkCardOpen(true)}
                    >
                      Link Card
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 绑定卡片弹层（占位） */}
            {linkCardOpen && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-red-700">绑定礼品卡（占位）</div>
                  <button className="text-red-600" onClick={() => setLinkCardOpen(false)}>关闭</button>
                </div>
                <p className="text-sm text-red-700/80 mt-2">此为占位交互。后续可接入真实 API：支持输入卡号与 PIN 进行绑定。</p>
              </div>
            )}

            {/* 畅销礼品卡推荐 */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Best Sellers</div>
                    <div className="text-sm text-gray-500">畅销礼品卡推荐</div>
                  </div>
                </div>
              </div>

              <div className="p-4 overflow-x-auto">
                <div className="flex gap-4 min-w-full">
                  {bestSellers.map((card, idx) => (
                    <div key={idx} className="min-w-[240px] bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className={`h-24 rounded-t-lg bg-gradient-to-br ${card.gradient} relative`}></div>
                      <div className="p-4">
                        <div className="font-semibold">{card.theme} Gift Card</div>
                        <div className="text-sm text-gray-600 mt-1">Value: ${card.value}</div>
                        <div className="text-sm text-gray-600">Price: ${card.price}</div>
                        <div className="mt-3 flex items-center gap-2">
                          <button className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50">Details</button>
                          <button className="px-3 py-1 text-sm rounded-md bg-black text-white hover:bg-gray-800">Buy</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 交易记录占位 */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <div className="font-semibold">Gift Card Activity</div>
                <div className="text-sm text-gray-500">礼品卡交易记录（占位）</div>
              </div>
              <div className="p-6 text-center text-gray-500 text-sm">暂无记录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;