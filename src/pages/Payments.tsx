import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import AccountSidebar from '../components/AccountSidebar';
import { CreditCard, Plus, Edit, Trash2, Check, User, Wallet, Package, Heart, HelpCircle, Shield, Gift, Award, Crown } from 'lucide-react';

interface PaymentCard {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'other';
  lastFourDigits: string;
  expiryDate: string;
  isDefault: boolean;
}

const Payments: React.FC = () => {
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
        { id: 'payments', title: '支付方式', link: '/payments', active: true }
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
        { id: 'gift-cards', title: '礼品卡', link: '/settings' }
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
        { id: 'recent', title: '最近浏览', link: '/favorites?tab=recent' },
        { id: 'following', title: '关注', link: '/favorites?tab=following' }
      ]
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      icon: HelpCircle,
      items: [
        { id: 'support', title: '帮助与支持', link: '/help' },
        { id: 'contact', title: '联系客服', link: '/contact' },
        { id: 'buyback', title: '回购中心', link: '/buyback' }
      ]
    },
    {
      id: 'other-services',
      title: 'Other Services',
      icon: Gift,
      items: [
        { id: 'free-trial', title: '免费试用', link: '/settings' },
        { id: 'survey', title: '调查中心', link: '/settings' }
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




  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    cardType: 'visa' as const
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaymentCard: PaymentCard = {
      id: Date.now().toString(),
      cardType: newCard.cardType,
      lastFourDigits: newCard.cardNumber.slice(-4),
      expiryDate: newCard.expiryDate,
      isDefault: cards.length === 0 // 第一张卡默认设为默认卡
    };
    
    setCards([...cards, newPaymentCard]);
    setShowAddForm(false);
    setNewCard({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      cardType: 'visa'
    });
  };

  const handleDeleteCard = (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    setCards(updatedCards);
  };

  const handleSetDefault = (id: string) => {
    const updatedCards = cards.map(card => ({
      ...card,
      isDefault: card.id === id
    }));
    setCards(updatedCards);
  };

  const getCardIcon = (cardType: string) => {
    return <CreditCard className="text-xl" />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 页头 Header - 保持与个人中心页面一致 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      </header>

      {/* 主体内容 */}
      <div className="flex">
        {/* 左侧导航栏 */}
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

        {/* 右侧主内容区 - SHEIN 风格的支付选项 */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">MY PAYMENT OPTIONS</h1>
              <p className="text-center text-gray-600">The following payment methods are associated with your account.</p>
            </div>

            {/* 添加新卡片区域（虚线边框） */}
            <div className="border border-dashed border-gray-300 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Cards ({cards.length})</h2>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    <Plus className="mr-2 h-4 w-4" /> ADD A NEW CARD
                  </button>
                )}
              </div>

              {showAddForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Card</h3>
                  <form onSubmit={handleAddCard}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={newCard.cardHolder}
                          onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="ZHANG SAN"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={newCard.expiryDate}
                          onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Security Code</label>
                        <input
                          type="text"
                          value={newCard.cvv}
                          onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="123"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                        <select
                          value={newCard.cardType}
                          onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value as any })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          required
                        >
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                          <option value="amex">American Express</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                      >
                        Save Card
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {cards.length === 0 && !showAddForm ? (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No payment cards added</h3>
                  <p className="text-gray-500 mb-6">Add a card for faster checkout</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    ADD A NEW CARD
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`bg-white border ${card.isDefault ? 'border-black' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="mr-4">
                            {getCardIcon(card.cardType)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {card.cardType.toUpperCase()} **** {card.lastFourDigits}
                            </div>
                            <div className="text-sm text-gray-500">
                              Expires: {card.expiryDate}
                            </div>
                            {card.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 bg-black text-white text-xs rounded-full mt-1">
                                <Check className="h-3 w-3 mr-1" />
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!card.isDefault && (
                            <button
                              onClick={() => handleSetDefault(card.id)}
                              className="p-2 text-gray-600 hover:text-black"
                              title="Set Default"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-600 hover:text-black"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-2 text-gray-600 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 支付安全说明 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Payment Security</h2>
              <p className="text-gray-600 mb-2">• Advanced encryption protects your payment information</p>
              <p className="text-gray-600 mb-2">• Full card numbers are never stored on our systems</p>
              <p className="text-gray-600">• All payments comply with PCI DSS security standards</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payments;