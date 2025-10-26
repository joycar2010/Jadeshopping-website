import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import {
  Gift,
  Star,
  User,
  Package,
  CreditCard,
  Truck,
  HelpCircle,
  Shield,
  RotateCcw,
  LogOut,
  ChevronRight,
  Wallet,
  Crown
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

interface PointRecord {
  id: string;
  type: 'earned' | 'used' | 'expired';
  title: string; // 例如：订单返积分 / 购物抵扣 / 到期失效
  points: number; // 正数：获得；负数：使用
  date: string; // 2025-11-02 12:00
  expiresSoon?: boolean;
}

const sampleRecords: PointRecord[] = [
  { id: 'p1', type: 'earned', title: '订单返积分', points: 120, date: '2025-11-02 12:00' },
  { id: 'p2', type: 'used', title: '购物抵扣', points: -40, date: '2025-11-05 09:12' },
  { id: 'p3', type: 'expired', title: '到期失效', points: -20, date: '2025-10-31 23:59', expiresSoon: true }
];

const Points: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useUserStore();

  const [tab, setTab] = useState<'all' | 'earned' | 'used' | 'expired'>('all');

  const totalPoints = useMemo(() => {
    return sampleRecords.reduce((sum, r) => sum + r.points, 0);
  }, []);

  const pointsExpiringSoon = useMemo(() => {
    return sampleRecords.filter(r => r.expiresSoon).reduce((sum, r) => sum + Math.abs(r.points), 0);
  }, []);

  const filteredRecords = useMemo(() => {
    if (tab === 'all') return sampleRecords;
    return sampleRecords.filter(r => r.type === tab);
  }, [tab]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-6">登录后管理您的积分</p>
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
      isActive: true,
      items: [
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/coupons', icon: Gift },
        { name: 'My Points', nameCn: '我的积分', path: '/points', icon: Star, isActive: true },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: CreditCard }
      ]
    },
    {
      title: 'My Orders',
      titleCn: '我的订单',
      items: [
        { name: 'All Orders', nameCn: '所有订单', path: '/orders', icon: Package },
        { name: 'Pending Payment', nameCn: '待付款', path: '/orders?status=pending', icon: CreditCard },
        { name: 'Shipped', nameCn: '已发货', path: '/orders?status=shipped', icon: Truck }
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
              {/* 标题与 T&C */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold">MY POINTS</h1>
                <a href="/help#points-terms" className="text-sm text-gray-600 hover:text-black">T&C</a>
              </div>

              {/* 积分概览 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
                  <p className="text-sm text-orange-700">Total Points</p>
                  <p className="text-3xl font-extrabold text-orange-600 mt-2">{Math.max(0, totalPoints)}</p>
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                  <p className="text-sm text-yellow-700">Points expiring soon</p>
                  <p className="text-3xl font-extrabold text-yellow-600 mt-2">{pointsExpiringSoon}</p>
                </div>
              </div>

              {/* 标签页 */}
              <div className="flex items-center gap-2 p-4 border-b">
                {(['all','earned','used','expired'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                      tab === t ? 'bg-black text-white border-black' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'all' ? 'All' : t === 'earned' ? 'Earned' : t === 'used' ? 'Used' : 'Expired'}
                  </button>
                ))}
              </div>

              {/* 列表与空状态 */}
              <div className="p-6">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-16">
                    <Star className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">It is empty here :-(</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecords.map(r => (
                      <div key={r.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                        <div>
                          <p className="text-sm text-gray-900">{r.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{r.date}</p>
                        </div>
                        <div className={`text-sm font-semibold ${r.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {r.points >= 0 ? `+${r.points}` : r.points}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center text-gray-400 text-xs mt-6">— No more content —</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 悬浮 CTA：赚积分/兑换礼品 */}
      <Link
        to="/coupons"
        className="fixed right-6 bottom-6 bg-black text-white rounded-full px-4 py-3 shadow-lg hover:bg-gray-800 inline-flex items-center gap-2"
      >
        <Gift className="h-4 w-4" />
        <span className="text-sm">去领券赚积分</span>
      </Link>
    </div>
  );
};

export default Points;