import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

const Checkout: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    province: '',
    zipCode: ''
  });

  const [selectedPayment, setSelectedPayment] = useState('alipay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 'alipay', name: '支付宝', icon: '💰' },
    { id: 'wechat', name: '微信支付', icon: '💚' },
    { id: 'unionpay', name: '银联支付', icon: '💳' },
  ];

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录');
      return;
    }

    setIsSubmitting(true);
    
    // 模拟提交订单
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 清空购物车
      clearCart();
      
      alert('订单提交成功！我们会尽快为您发货。');
      
      // 这里可以跳转到订单详情页
      // navigate('/orders');
      
    } catch {
      alert('订单提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">购物车是空的</h2>
            <p className="text-gray-500 mb-8">请先添加商品到购物车</p>
            <Link to="/products" className="btn-primary">
              去购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后才能进行结算</p>
            <Link to="/login" className="btn-primary">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Link
          to="/cart"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          返回购物车
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">订单结算</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧表单 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 收货地址 */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-6 w-6 text-primary-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">收货地址</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收货人姓名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingForm.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入收货人姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手机号码 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入手机号码"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      省份 *
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={shippingForm.province}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入省份"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      城市 *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入城市"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细地址 *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入详细地址"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮政编码
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingForm.zipCode}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="请输入邮政编码"
                    />
                  </div>
                </div>
              </div>

              {/* 支付方式 */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">支付方式</h2>
                </div>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 安全保障 */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">安全保障</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>正品保证</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>7天无理由退货</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>全国联保</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧订单摘要 */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  订单摘要
                </h2>
                
                {/* 商品列表 */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* 价格明细 */}
                <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品总数:</span>
                    <span className="font-medium">{getTotalItems()} 件</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品总价:</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">运费:</span>
                    <span className="font-medium text-green-600">免费</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">应付总额:</span>
                      <span className="text-xl font-bold text-red-500">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 提交按钮 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '提交中...' : '提交订单'}
                </button>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  点击"提交订单"表示您同意我们的服务条款
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;