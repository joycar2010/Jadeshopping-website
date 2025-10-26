import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import { useUserStore } from '../store/useUserStore';
import {
  User,
  Wallet,
  Package,
  Heart,
  HelpCircle,
  Shield,
  Gift,
  Award,
  Crown,
  FileText,
  Check,
  Clock
} from 'lucide-react';

const Survey: React.FC = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const navigationItems = [
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      items: [
        { id: 'club', title: '会员俱乐部', link: '/club', icon: Award },
        { id: 'vip-weizun', title: 'VIP', link: '/vip', icon: Crown },
        { id: 'profile', title: '个人资料', link: '/settings' },
        { id: 'address', title: '地址簿', link: '/address' },
        { id: 'payments', title: '支付方式', link: '/payments' }
      ]
    },
    {
      id: 'assets',
      title: 'My Assets',
      icon: Wallet,
      items: [
        { id: 'coupons', title: '我的优惠券', link: '/coupons' },
        { id: 'points', title: '我的积分', link: '/points' },
        { id: 'wallet', title: '我的钱包', link: '/wallet' },
        { id: 'gift-cards', title: '礼品卡', link: '/gift-card' }
      ]
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: Package,
      items: [
        { id: 'all-orders', title: '所有订单', link: '/orders' },
        { id: 'unpaid-orders', title: '待付款订单', link: '/orders?tab=unpaid' },
        { id: 'processing-orders', title: '处理中订单', link: '/orders?tab=processing' },
        { id: 'shipped-orders', title: '已发货订单', link: '/orders?tab=shipped' },
        { id: 'review-orders', title: '待评价订单', link: '/orders?tab=review' },
        { id: 'return-orders', title: '退货订单', link: '/orders?tab=return' }
      ]
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      icon: Heart,
      items: [
        { id: 'wishlist', title: '心愿单', link: '/favorites' },
        { id: 'recently-viewed', title: '最近浏览', link: '/recently-viewed' },
        { id: 'following', title: '关注', link: '/follow' }
      ]
    },
    {
      id: 'service',
      title: 'Customer Service',
      icon: HelpCircle,
      items: [
        { id: 'help-center', title: '帮助中心', link: '/help' },
        { id: 'contact-us', title: '联系我们', link: '/contact' },
        { id: 'buyback-center', title: '回购中心', link: '/buyback' }
      ]
    },
    {
      id: 'other',
      title: 'Other Services',
      icon: Gift,
      items: [
        { id: 'survey', title: '调查中心', link: '/survey', active: true },
        { id: 'feedback', title: '意见反馈', link: '/feedback' }
      ]
    },
    {
      id: 'policy',
      title: 'Policy',
      icon: Shield,
      items: [
        { id: 'coupon-policy', title: '优惠券政策', link: '/policy/coupons' },
        { id: 'points-policy', title: '积分政策', link: '/policy/points' },
        { id: 'wallet-policy', title: '关于钱包', link: '/policy/wallet' },
        { id: 'payment-policy', title: '支付方式', link: '/policy/payments' },
        { id: 'shipping', title: '配送政策', link: '/shipping' },
        { id: 'returns', title: '退货政策', link: '/returns' },
        { id: 'privacy', title: '隐私政策', link: '/help' }
      ]
    }
  ];

  const surveys = [
    { id: 's1', title: '购物体验调研', desc: '帮助我们改善整体购物流程', status: '进行中', due: '2025-12-31' },
    { id: 's2', title: '商品满意度问卷', desc: '评价您最近购买的商品质量与服务', status: '未开始', due: '长期有效' },
    { id: 's3', title: '配送与售后体验', desc: '反馈物流速度与售后支持', status: '未开始', due: '长期有效' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      </header>

      <div className="flex">
        <AccountSidebar
          groups={navigationItems.map((section) => ({
            title: section.title,
            items: section.items.map((item) => ({
              name: item.title,
              path: item.link,
              icon: (item as any).icon ?? section.icon,
              isActive: (item as any).active,
            })),
          }))}
        />

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">SURVEY CENTER</h1>
              <p className="text-center text-gray-600">参与问卷调研，帮助我们优化服务与产品</p>
            </div>

            <div className="space-y-4">
              {surveys.map((s) => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-2">{s.desc}</p>
                      <div className="text-sm text-gray-500 flex items-center space-x-4">
                        <span className="inline-flex items-center"><Clock className="h-4 w-4 mr-1" /> 截止：{s.due}</span>
                        <span className="inline-flex items-center"><Check className="h-4 w-4 mr-1" /> 状态：{s.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link to={`/survey/${s.id}`} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">开始/查看</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Survey;