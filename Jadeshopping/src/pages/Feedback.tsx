import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const Feedback: React.FC = () => {
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
        { id: 'survey', title: '调查中心', link: '/survey' },
        { id: 'feedback', title: '意见反馈', link: '/feedback', active: true }
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

  const [form, setForm] = useState({
    category: '功能建议',
    title: '',
    content: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('请填写标题和详细内容');
      return;
    }
    toast.success('反馈已提交，我们会尽快处理，谢谢！');
    setForm({ category: '功能建议', title: '', content: '', contact: '' });
  };

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
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FEEDBACK</h1>
              <p className="text-gray-600">欢迎提交问题与建议，帮助我们变得更好</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">反馈类型</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>功能建议</option>
                  <option>商品问题</option>
                  <option>订单问题</option>
                  <option>其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="简要描述您的反馈"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详细内容</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-36 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="请尽量详细描述问题或建议"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系方式（可选）</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="邮箱或手机号"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800">
                  提交反馈
                </button>
              </div>
            </form>

            <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" /> 我们通常会在 3 个工作日内回复
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feedback;