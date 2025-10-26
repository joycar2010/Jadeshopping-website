import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gift,
  CreditCard,
  User,
  Package,
  Wallet,
  Star,
  HelpCircle,
  Shield,
  Truck,
  RotateCcw,
  LogOut,
  ChevronRight,
  Clock,
  Sparkles,
  Crown
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import AccountSidebar from '../components/AccountSidebar';

interface Coupon {
  id: string;
  percentOff: number; // 30 → 30% OFF
  type: 'SHEIN Saver' | 'SHEIN CLUB' | 'Shipping' | 'Discount';
  title: string; // Sitewide Coupon / Shipping Coupon etc.
  conditions: string; // Orders $9.0+ / No Min. Buy
  cap?: string; // Capped at $10
  scope?: string; // For selected products
  expiry: string; // 2025-11-20 00:40
  status: 'unused' | 'used' | 'expired';
  isNew?: boolean;
  expiresSoon?: boolean;
}

const sampleCoupons: Coupon[] = [
  {
    id: 'c1',
    percentOff: 30,
    type: 'Discount',
    title: 'Sitewide Coupon',
    conditions: 'Orders $9.0+',
    cap: 'Capped at $10',
    scope: 'For selected products',
    expiry: '2025-11-20 00:40',
    status: 'unused',
    isNew: true
  },
  {
    id: 'c2',
    percentOff: 60,
    type: 'Discount',
    title: 'Sitewide Coupon',
    conditions: 'No Min. Buy',
    scope: 'For selected products',
    expiry: '2025-12-01 23:59',
    status: 'unused',
    expiresSoon: true
  },
  {
    id: 'c3',
    percentOff: 20,
    type: 'SHEIN Saver',
    title: 'Saver Exclusive',
    conditions: 'Orders $29.0+',
    scope: 'Saver membership only',
    expiry: '2025-10-31 23:59',
    status: 'unused'
  },
  {
    id: 'c4',
    percentOff: 10,
    type: 'Shipping',
    title: 'Shipping Coupon',
    conditions: 'No Min. Buy',
    scope: 'Standard Shipping',
    expiry: '2025-11-05 12:00',
    status: 'unused'
  },
  {
    id: 'c5',
    percentOff: 15,
    type: 'SHEIN CLUB',
    title: 'Club Discount',
    conditions: 'Orders $19.0+',
    scope: 'Club members',
    expiry: '2025-09-10 00:00',
    status: 'used'
  },
  {
    id: 'c6',
    percentOff: 25,
    type: 'Discount',
    title: 'Festival Coupon',
    conditions: 'Orders $39.0+',
    cap: 'Capped at $20',
    scope: 'Sitewide',
    expiry: '2025-08-15 23:59',
    status: 'expired'
  }
];

const Coupons: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const [statusTab, setStatusTab] = useState<'unused' | 'used' | 'expired'>('unused');
  const [unusedFilter, setUnusedFilter] = useState<
    'all' | 'expiring' | 'new' | 'SHEIN Saver' | 'SHEIN CLUB' | 'Shipping Coupon' | 'Discount Coupon'
  >('all');

  const filteredCoupons = useMemo(() => {
    let list = sampleCoupons.filter(c => c.status === statusTab);
    if (statusTab === 'unused') {
      switch (unusedFilter) {
        case 'expiring':
          list = list.filter(c => c.expiresSoon);
          break;
        case 'new':
          list = list.filter(c => c.isNew);
          break;
        case 'SHEIN Saver':
          list = list.filter(c => c.type === 'SHEIN Saver');
          break;
        case 'SHEIN CLUB':
          list = list.filter(c => c.type === 'SHEIN CLUB');
          break;
        case 'Shipping Coupon':
          list = list.filter(c => c.type === 'Shipping');
          break;
        case 'Discount Coupon':
          list = list.filter(c => c.type === 'Discount');
          break;
        default:
          break;
      }
    }
    return list;
  }, [statusTab, unusedFilter]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后管理您的优惠券</p>
            <Link to="/login" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 左侧导航菜单数据（当前高亮“我的优惠券”）
  const sidebarMenus = [
    {
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Sparkles },
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
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/coupons', icon: Gift, isActive: true },
        { name: 'My Points', nameCn: '我的积分', path: '/points', icon: Star },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: Wallet }
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
              {/* 标题与 T&C 链接 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold">MY COUPONS</h1>
                <a href="/help#coupons-terms" className="text-sm text-gray-600 hover:text-black">T&C</a>
              </div>

              {/* 状态标签 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setStatusTab('unused')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      statusTab === 'unused' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Unused Coupons({sampleCoupons.filter(c => c.status === 'unused').length})
                  </button>
                  <button
                    onClick={() => setStatusTab('used')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      statusTab === 'used' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Used({sampleCoupons.filter(c => c.status === 'used').length})
                  </button>
                  <button
                    onClick={() => setStatusTab('expired')}
                    className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                      statusTab === 'expired' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Expired Coupons({sampleCoupons.filter(c => c.status === 'expired').length})
                  </button>
                </div>
              </div>

              {/* 未使用的二级筛选 */}
              {statusTab === 'unused' && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: 'all', label: 'All' },
                      { key: 'expiring', label: 'Expiring Soon', icon: Clock },
                      { key: 'new', label: 'NEW', icon: Sparkles },
                      { key: 'SHEIN Saver', label: 'SHEIN Saver' },
                      { key: 'SHEIN CLUB', label: 'SHEIN CLUB' },
                      { key: 'Shipping Coupon', label: 'Shipping Coupon' },
                      { key: 'Discount Coupon', label: 'Discount Coupon' }
                    ] as const).map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setUnusedFilter(item.key as any)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          unusedFilter === item.key ? 'bg-black text-white border-black' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {'icon' in item ? React.createElement(item.icon, { className: "h-3 w-3" }) : null}
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 列表与卡片 */}
              <div className="p-6">
                {filteredCoupons.length === 0 ? (
                  <div className="text-center py-16">
                    <Gift className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">暂无符合条件的优惠券</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoupons.map((c) => (
                      <div key={c.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="flex">
                          {/* 左侧折扣区块 */}
                          <div className="w-28 bg-black text-white flex flex-col items-center justify-center p-3">
                            <div className="text-2xl font-bold">{c.percentOff}% OFF</div>
                            <div className="text-[10px] mt-1">{c.title}</div>
                            {c.isNew && (
                              <span className="mt-2 text-[10px] bg-white text-black px-2 py-0.5 rounded-full">NEW</span>
                            )}
                            {c.expiresSoon && (
                              <span className="mt-1 text-[10px] text-yellow-300">Expiring Soon</span>
                            )}
                          </div>
                          {/* 右侧详细信息 */}
                          <div className="flex-1 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-700">Type: {c.type === 'Discount' ? 'Discount Coupon' : c.type === 'Shipping' ? 'Shipping Coupon' : c.type}</p>
                                <p className="text-sm text-gray-700 mt-1">Condition: {c.conditions}</p>
                                {c.cap && <p className="text-sm text-gray-700 mt-1">{c.cap}</p>}
                                {c.scope && <p className="text-sm text-gray-700 mt-1">{c.scope}</p>}
                                <p className="text-xs text-gray-500 mt-1">Expires in {c.expiry}</p>
                              </div>
                              <Link
                                to="/products"
                                className="inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-800 text-sm"
                              >
                                Shop
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 底部无更多提示 */}
                <div className="text-center text-gray-400 text-xs mt-6">— No more content —</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupons;