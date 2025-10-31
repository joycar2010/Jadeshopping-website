import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Search, Lock, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { locations, getDialCode, getProvincesByCountry, getCitiesByCountryProvince } from '../data/locations';
import { suggestAddresses, AddressSuggestion } from '../lib/addressAutocomplete';

interface ShippingForm {
  country: string;
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phone: string;
  addressFinder?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  zipCode: string;
  makeDefault: boolean;
  name?: string; // 兼容旧字段，提交前合并
}



const Checkout: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart, updateQuantity } = useCartStore();
  const { user } = useUserStore();
  
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    country: 'United States',
    firstName: (user?.name || '').split(' ')[0] || '',
    lastName: (user?.name || '').split(' ').slice(1).join(' ') || '',
    phoneCountryCode: 'US +1',
    phone: user?.phone || '',
    addressFinder: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    zipCode: '',
    makeDefault: false,
    name: user?.name || ''
  });

  // 联动下拉：省份与城市
  const [provinces, setProvinces] = useState<string[]>(getProvincesByCountry(shippingForm.country));
  const [cities, setCities] = useState<string[]>([]);

  // 地址自动完成
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // 国家变化时，更新省份列表与区号
    const p = getProvincesByCountry(shippingForm.country);
    setProvinces(p);
    setShippingForm(prev => ({ ...prev, phoneCountryCode: getDialCode(shippingForm.country) }));
    // 重置省/市选择
    setShippingForm(prev => ({ ...prev, province: '', city: '' }));
  }, [shippingForm.country]);

  useEffect(() => {
    // 省份变化时，更新城市列表
    const nextCities = getCitiesByCountryProvince(shippingForm.country, shippingForm.province);
    setCities(nextCities);
    // 如果当前城市不在列表中，重置
    setShippingForm(prev => (
      nextCities.includes(prev.city) ? prev : { ...prev, city: '' }
    ));
  }, [shippingForm.country, shippingForm.province]);

  useEffect(() => {
    // 地址自动完成 - 简单防抖
    const q = (shippingForm.addressFinder || '').trim();
    if (!q) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsSuggesting(true);
    const timer = setTimeout(async () => {
      const res = await suggestAddresses(q, shippingForm.country);
      setAddressSuggestions(res);
      setShowSuggestions(true);
      setIsSuggesting(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [shippingForm.addressFinder, shippingForm.country]);

  const handleSelectSuggestion = (s: AddressSuggestion) => {
    setShippingForm(prev => ({
      ...prev,
      addressLine1: s.addressLine1,
      province: s.province,
      city: s.city,
      zipCode: s.zipCode || prev.zipCode
    }));
    setShowSuggestions(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('paypal');

  // 订单摘要交互与促销/税费相关状态
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [promotionDiscount, setPromotionDiscount] = useState<number>(0);
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');
  const [showMore, setShowMore] = useState(false);
  const salesTaxRate = 0.08;

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // 数量范围约束（最小1，最大999，受库存约束）
  const clampQty = (q: number, stock?: number) => {
    const max = Math.min(999, stock ?? 999);
    return Math.max(1, Math.min(q, max));
  };

  // 促销与税费计算
  const computeSalesTax = (subtotal: number, discount: number) => {
    const taxable = Math.max(0, subtotal - discount);
    return Math.round(taxable * salesTaxRate * 100) / 100;
  };
  const salesTax = computeSalesTax(getTotalPrice(), promotionDiscount);
  const finalTotal = Math.max(0, getTotalPrice() - promotionDiscount + salesTax);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
      // 简单规则：最高减 ¥5 或 20%（以较小者为准）
      const maxDiscount = 5;
      const calc = Math.min(getTotalPrice() * 0.2, maxDiscount);
      setPromotionDiscount(Number(calc.toFixed(2)));
    }
  };

  const handleApplyGiftCard = () => {
    if ((giftCardNumber || '').trim() && (giftCardPin || '').trim()) {
      // 简单规则：礼品卡叠加减 ¥3
      setPromotionDiscount(prev => Number((prev + 3).toFixed(2)));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name } = target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setShippingForm(prev => ({
      ...prev,
      [name]: value as any
    }));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = [shippingForm.firstName, shippingForm.lastName].filter(Boolean).join(' ');
    setShippingForm(prev => ({ ...prev, name: fullName }));
    // 这里可接入实际保存地址逻辑或 API
    alert('地址已保存');
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
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>

                {/* Location / Country */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <select
                    name="country"
                    value={shippingForm.country}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    {Object.keys(locations).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Phone with country code */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                    <select
                      name="phoneCountryCode"
                      value={shippingForm.phoneCountryCode}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option>US +1</option>
                      <option>CA +1</option>
                      <option>UK +44</option>
                      <option>CN +86</option>
                      <option>AU +61</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                {/* Address Finder */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ADDRESS FINDER</label>
                  <div className="relative">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="addressFinder"
                      value={shippingForm.addressFinder}
                      onChange={handleInputChange}
                      className="input-field w-full pl-10"
                      placeholder="Search by postcode, street or address"
                    />
                  </div>
                </div>

                {/* Address Lines */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingForm.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="Street name and number, company name."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingForm.addressLine2 || ''}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Building/Apartment/Suite no., Unit, Floor, etc (optional)"
                  />
                </div>

                {/* State / City */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                    <select
                      name="province"
                      value={shippingForm.province}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="">Please Choose Your State/Province</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <select
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      required
                      className="input-field w-full"
                    >
                      <option value="">City</option>
                      {cities.map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Zip */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post/Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingForm.zipCode}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="Post/Zip Code"
                  />
                </div>

                {/* Default checkbox & tips */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="makeDefault"
                      checked={shippingForm.makeDefault}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Make Default
                  </label>
                  <div className="space-x-4">
                    <Link to="#" className="text-gray-600 hover:text-gray-800">General Address Tips</Link>
                    <Link to="#" className="text-gray-600 hover:text-gray-800">Privacy & Cookie Policy</Link>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Lock className="h-4 w-4 mr-2" />
                  <span className="text-sm">We maintain industry-standard physical, technical, and administrative measures to safeguard your personal information.</span>
                </div>

                <button onClick={handleSaveAddress} className="btn-primary w-full">SAVE</button>
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

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-2">
                  {/* PayPal */}
                  <label className="flex items-center justify-between p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-900">PayPal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-50 border border-blue-200 text-blue-700">PayPal</span>
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className="flex items-center justify-between p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-900">Credit/Debit Card</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-50 border border-blue-200 text-blue-700">VISA</span>
                      <span className="px-2 py-1 text-xs rounded bg-red-50 border border-red-200 text-red-700">Mastercard</span>
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 border border-blue-200 text-blue-800">AmEx</span>
                      <span className="px-2 py-1 text-xs rounded bg-orange-50 border border-orange-200 text-orange-700">Discover</span>
                      <span className="px-2 py-1 text-xs rounded bg-gray-50 border border-gray-200 text-gray-700">Diners Club</span>
                    </div>
                  </label>

                  {/* Klarna (disabled) */}
                  <label className="flex items-center justify-between p-3 rounded opacity-50 cursor-not-allowed">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentMethod" value="klarna" disabled className="h-4 w-4" />
                      <span className="text-gray-500">Klarna</span>
                    </div>
                  </label>

                  {/* Afterpay (disabled) */}
                  <label className="flex items-center justify-between p-3 rounded opacity-50 cursor-not-allowed">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentMethod" value="afterpay" disabled className="h-4 w-4" />
                      <span className="text-gray-500">Afterpay</span>
                    </div>
                  </label>

                  {/* Apple Pay */}
                  <label className="flex items-center justify-between p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="applepay"
                        checked={paymentMethod === 'applepay'}
                        onChange={() => setPaymentMethod('applepay')}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-900">Apple Pay</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-50 border border-blue-200 text-blue-700">VISA</span>
                      <span className="px-2 py-1 text-xs rounded bg-red-50 border border-red-200 text-red-700">Mastercard</span>
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 border border-blue-200 text-blue-800">AmEx</span>
                      <span className="px-2 py-1 text-xs rounded bg-orange-50 border border-orange-200 text-orange-700">Discover</span>
                      <span className="px-2 py-1 text-xs rounded bg-gray-50 border border-gray-200 text-gray-700">UnionPay</span>
                    </div>
                  </label>

                  {/* Pay Later with PayPal (disabled) */}
                  <label className="flex items-center justify-between p-3 rounded opacity-50 cursor-not-allowed">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentMethod" value="paylater" disabled className="h-4 w-4" />
                      <span className="text-gray-500">Pay Later with PayPal</span>
                      <span className="ml-1 text-gray-400">ⓘ</span>
                    </div>
                  </label>

                  {/* Affirm (disabled) */}
                  <label className="flex items-center justify-between p-3 rounded opacity-50 cursor-not-allowed">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentMethod" value="affirm" disabled className="h-4 w-4" />
                      <span className="text-gray-500">Affirm</span>
                    </div>
                  </label>

                  {/* Cash App Pay (Pay Now) */}
                  <label className="flex items-center justify-between p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cashapp"
                        checked={paymentMethod === 'cashapp'}
                        onChange={() => setPaymentMethod('cashapp')}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-900">Cash App Pay (Pay Now)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">Cash App</span>
                    </div>
                  </label>

                  {/* Google Pay */}
                  <label className="flex items-center justify-between p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="googlepay"
                        checked={paymentMethod === 'googlepay'}
                        onChange={() => setPaymentMethod('googlepay')}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-900">Google Pay</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 border border-gray-300 text-gray-800">GPay</span>
                    </div>
                  </label>

                  {/* Venmo */}
                  <label className="flex items-center justify-between p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="venmo"
                        checked={paymentMethod === 'venmo'}
                        onChange={() => setPaymentMethod('venmo')}
                        className="h-4 w-4"
                      />
                      <span className="text-gray-900">Venmo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-500 text-white">Venmo</span>
                    </div>
                  </label>

                  {/* Zip (disabled) */}
                  <label className="flex items-center justify-between p-3 rounded opacity-50 cursor-not-allowed">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentMethod" value="zip" disabled className="h-4 w-4" />
                      <span className="text-gray-500">Pay in 4 installments</span>
                      <span className="ml-1 text-gray-400">ⓘ</span>
                    </div>
                  </label>
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
                        {/* 数量交互控件 */}
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            type="button"
                            aria-label="decrease quantity"
                            onClick={() => updateQuantity(item.productId, clampQty(item.quantity - 1, item.stock))}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={Math.min(999, item.stock ?? 999)}
                            step={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              if (!Number.isNaN(next)) {
                                updateQuantity(item.productId, clampQty(next, item.stock));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (["e","E","+","-","."," "].includes(e.key)) e.preventDefault();
                            }}
                            onBlur={(e) => {
                              const next = Number(e.target.value);
                              const clamped = clampQty(Number.isNaN(next) ? item.quantity : next, item.stock);
                              if (clamped !== item.quantity) {
                                updateQuantity(item.productId, clamped);
                              }
                            }}
                            className="w-14 text-center border border-gray-300 rounded px-2 py-1 text-xs"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <button
                            type="button"
                            aria-label="increase quantity"
                            onClick={() => updateQuantity(item.productId, clampQty(item.quantity + 1, item.stock))}
                            disabled={item.quantity >= Math.min(999, item.stock ?? 999)}
                            className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <span className="text-[10px] text-gray-400 ml-2">Max: {Math.min(999, item.stock ?? 999)}</span>
                          <span className="text-[11px] text-gray-500 ml-2">{formatPrice(item.price)} / each</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 配送方式提示 */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-6">
                  <p className="text-xs font-medium text-gray-700">PLEASE SELECT A SHIPPING METHOD.</p>
                </div>
                
                {/* 价格明细 */}
                <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品总数:</span>
                    <span className="font-medium">{getTotalItems()} 件</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retail Price:</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>

                  {/* On-Time Delivery Service */}
                  <div className="flex justify-between">
                    <span className="text-gray-700">On-Time Delivery Guarantee:</span>
                    <span className="font-medium">FREE</span>
                  </div>

                  {/* Promotions */}
                  {promotionDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Promotions:</span>
                      <span className="font-medium text-green-600">- {formatPrice(promotionDiscount)}</span>
                    </div>
                  )}

                  {/* Sales Tax */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales Tax:</span>
                    <span className="font-medium">{formatPrice(salesTax)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Order Total:</span>
                      <span className="text-xl font-bold text-red-500">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reward Points */}
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <span className="text-sm font-medium text-yellow-700">🪙 Reward {getTotalItems() * 12} Points</span>
                  <span className="ml-1 text-xs text-gray-400">ⓘ</span>
                </div>

                {/* Coupon Code */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter coupon code"
                    />
                    <button type="button" onClick={handleApplyCoupon} className="btn-secondary">APPLY</button>
                  </div>
                </div>

                {/* Gift Card */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gift Card <span className="text-gray-400 text-xs">ⓘ</span></label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={giftCardNumber}
                      onChange={(e) => setGiftCardNumber(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Card Number"
                    />
                    <input
                      type="text"
                      value={giftCardPin}
                      onChange={(e) => setGiftCardPin(e.target.value)}
                      className="input-field w-28"
                      placeholder="PIN"
                    />
                    <button type="button" onClick={handleApplyGiftCard} className="btn-secondary">APPLY</button>
                  </div>
                </div>

                {/* View More */}
                <button type="button" className="text-sm text-gray-600 hover:text-gray-800 mb-4" onClick={() => setShowMore(v => !v)}>
                  {showMore ? 'View Less' : 'View More'}
                </button>

                {/* CONTINUE 按钮（示例保持禁用态）*/}
                 <button type="button" disabled className="w-full bg-gray-300 text-white font-semibold py-2 rounded">
                   CONTINUE
                 </button>

                 {/* 如图版块：总额与准时送达服务 */}
                 <div className="mt-4 bg-white rounded border border-gray-200">
                   <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm">
                        Total: <span className="font-semibold">$16.40</span>
                      </p>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">On-Time Delivery Service:$0.00</span>
                        <span className="text-xs text-gray-400">ⓘ</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">500 Points if Late</p>
                    </div>
                 </div>

                {/* 说明文字与安全模块 */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By placing this order you agree to our Terms and Conditions and Privacy Policy
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="font-medium text-gray-900">Payment Security</p>
                    <p className="text-gray-600 mt-1">We safeguard your payment information with industry standards.</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-gray-100 border border-gray-300">ID Check</span>
                      <span className="px-2 py-1 rounded bg-gray-100 border border-gray-300">SafePay</span>
                      <span className="px-2 py-1 rounded bg-gray-100 border border-gray-300">VISA</span>
                      <span className="px-2 py-1 rounded bg-gray-100 border border-gray-300">MasterCard</span>
                      <span className="px-2 py-1 rounded bg-gray-100 border border-gray-300">AmEx</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="font-medium text-gray-900">Security & Privacy</p>
                    <p className="text-gray-600 mt-1">We use encryption technology to protect your credit card details.</p>
                    <button type="button" className="text-xs text-primary-600 mt-2">Learn more &gt;</button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="font-medium text-gray-900">Secure Shipment Guarantee</p>
                    <p className="text-gray-600 mt-1">Free exchanges or refunds for lost, returned, or destroyed packages.</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="font-medium text-gray-900">Customer Support</p>
                    <p className="text-gray-600 mt-1">For any questions about your order, please contact us.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;