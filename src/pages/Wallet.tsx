import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Info,
  Clock,
  Award,
  Crown
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import AccountSidebar from '../components/AccountSidebar';

const Wallet: React.FC = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [showWithdrawInfo, setShowWithdrawInfo] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // 会员等级状态与可视化
  type MembershipLevel = 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM';
  const [membershipLevel, setMembershipLevel] = useState<MembershipLevel>('BASIC');
  const [levelLoading, setLevelLoading] = useState(false);
  const [levelError, setLevelError] = useState<string | null>(null);

  const getMembershipVisuals = (level: MembershipLevel) => {
    switch (level) {
      case 'SILVER':
        return { label: '白银会员', Icon: Star, iconClass: 'text-gray-500' };
      case 'GOLD':
        return { label: '黄金会员', Icon: Award, iconClass: 'text-yellow-500' };
      case 'PLATINUM':
        return { label: '铂金会员', Icon: Crown, iconClass: 'text-indigo-500' };
      default:
        return { label: '普通会员', Icon: User, iconClass: 'text-gray-400' };
    }
  };

  const levelVisuals = useMemo(() => getMembershipVisuals(membershipLevel), [membershipLevel]);
  const LevelIcon = levelVisuals.Icon;

  const fetchMembership = async () => {
    if (!user?.id) return;
    setLevelLoading(true);
    setLevelError(null);
    try {
      const res = await fetch(`/api/membership?userId=${encodeURIComponent(user.id)}`);
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      const lvlRaw = (json?.data?.level || json?.level || 'BASIC') as string;
      const lvl = lvlRaw.toUpperCase();
      const allowed = ['BASIC', 'SILVER', 'GOLD', 'PLATINUM'];
      setMembershipLevel(allowed.includes(lvl) ? (lvl as MembershipLevel) : 'BASIC');
    } catch (err) {
      setLevelError('会员等级获取失败');
      setMembershipLevel('BASIC');
    } finally {
      setLevelLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
    const id = setInterval(fetchMembership, 60000);
    return () => clearInterval(id);
  }, [user?.id]);

  const balances = useMemo(() => ({
    total: 0.0,
    unavailableCredit: 0.0,
    availableWithdrawCredit: 0.0
  }), []);

  const history = useMemo(() => ([
    { date: '2025-10-01', type: 'Income', orderNo: '-', amount: '+20.00', status: 'Completed', expire: '-' },
    { date: '2025-09-26', type: 'Expense', orderNo: 'JY20250926001', amount: '-15.00', status: 'Completed', expire: '-' },
    { date: '2025-09-20', type: 'Income', orderNo: '-', amount: '+5.00', status: 'Completed', expire: '-' }
  ]), []);

  const filteredHistory = useMemo(() => {
    if (filterType === 'all') return history;
    if (filterType === 'income') return history.filter(h => h.type === 'Income');
    return history.filter(h => h.type === 'Expense');
  }, [filterType, history]);

  const sidebarGroups = [
    {
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Award, requiresAuth: true },
        { name: 'VIP', nameCn: 'VIP', path: '/vip', icon: Crown, requiresAuth: true },
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
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: WalletIcon, isActive: true },
        { name: 'Gift Cards', nameCn: '礼品卡', path: '/gift-card', icon: CreditCard }
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
        { name: 'Recently Viewed', nameCn: '最近浏览', path: '/recently-viewed', icon: Clock },
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
            <h2 className="text-xl font-semibold mb-2">请登录后查看“我的钱包”</h2>
            <p className="text-gray-600 mb-6">登录后可查看余额与钱包历史记录</p>
            <Link to="/login" className="inline-flex items-center px-4 py-2 bg-black text白 rounded hover:bg-gray-800">
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
              <h1 className="text-2xl font-bold">MY WALLET</h1>
              <p className="text-gray-600">我的钱包</p>
            </div>

            {/* 余额概览 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-600">Total (总余额)</p>
                <p className="text-3xl font-bold mt-2">{balances.total.toFixed(2)}</p>
              </div>

              <div className="bg白 rounded-lg border border-gray-200 p-6">
                <p className="text-sm text-gray-600">Unavailable SHEIN Credit (不可用信用额度)</p>
                <p className="text-lg text-gray-9 mt-1">{balances.unavailableCredit.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Only Applicable for SHEIN Purchase (仅适用于 SHEIN 购物)</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Available Withdraw SHEIN Credit (可提现信用额度)</p>
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => setShowWithdrawInfo(v => !v)}
                    aria-label="提现规则"
                  >
                    <Info className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-lg text-gray-900 mt-1">{balances.availableWithdrawCredit.toFixed(2)}</p>
                {showWithdrawInfo && (
                  <div className="absolute right-4 top-12 z-10 bg-white border border-gray-200 rounded shadow px-3 py-2 text-xs w-64">
                    可提现额度说明：根据订单退款与活动奖励结算，满足条件后可提现；具体规则以平台帮助中心为准。
                  </div>
                )}
              </div>
            </div>

            {/* 过滤器 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded border ${filterType === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-3 py-1 rounded border ${filterType === 'income' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-3 py-1 rounded border ${filterType === 'expense' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}`}
                >
                  Expense
                </button>
              </div>
              <Link to="/contact" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                <HelpCircle className="h-4 w-4" /> Contact us
              </Link>
            </div>

            {/* 钱包历史记录 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5 text-gray-700" />
                  <span className="font-semibold">Wallet History</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">DATE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">TYPE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ORDER NO.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">AMOUNT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">STATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">EXPIRATION TIME</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-gray-500 text-sm">暂无记录</td>
                      </tr>
                    ) : (
                      filteredHistory.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.orderNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.amount}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.status}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.expire}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 text-center text-gray-400 text-xs">— No more content —</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultAvatar = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%20elegant%20person&image_size=square';
export default Wallet;