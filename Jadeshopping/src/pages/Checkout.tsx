import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Gift, Star, Lock, Shield, Headphones, Package, Search, ChevronRight, Minus, Plus, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

interface ShippingForm {
  country: string;
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  addressFinder: string;
  addressLine1: string;
  addressLine2: string;
  stateProvince: string;
  city: string;
  zipCode: string;
  makeDefault: boolean;
}



const Checkout: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart, updateQuantity } = useCartStore();
  const { user } = useUserStore();
  
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    country: 'United States',
    firstName: user?.name?.split(' ')?.[0] || '',
    lastName: user?.name?.split(' ')?.slice(1).join(' ') || '',
    phoneCountryCode: '+1',
    phoneNumber: user?.phone || '',
    addressFinder: '',
    addressLine1: '',
    addressLine2: '',
    stateProvince: '',
    city: '',
    zipCode: '',
    makeDefault: false,
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('paypal');
  const [couponCode, setCouponCode] = useState<string>('');
  const [giftCardNumber, setGiftCardNumber] = useState<string>('');
  const [giftCardPin, setGiftCardPin] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [giftCardAmount, setGiftCardAmount] = useState<number>(0);
  const [applyMembershipMarkdown, setApplyMembershipMarkdown] = useState<boolean>(false);
  
  // computed totals based on div functionality
  const subtotal = getTotalPrice();
  const membershipDiscount = applyMembershipMarkdown ? 7 : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount - giftCardAmount - membershipDiscount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim();
    if (!code) return;
    // 简单示例：任意非空优惠码给予固定减免
    const discount = Math.min(subtotal, 3);
    setCouponDiscount(Number(discount.toFixed(2)));
  };

  const handleApplyGiftCard = () => {
    const numberValid = giftCardNumber.trim().length >= 8;
    const pinValid = giftCardPin.trim().length >= 4;
    if (!numberValid || !pinValid) return;
    // 示例：礼品卡最高抵扣 10，且不超过当前剩余应付（扣除已应用折扣）
    const remaining = Math.max(0, subtotal - couponDiscount - membershipDiscount);
    const credit = Math.min(10, remaining);
    setGiftCardAmount(Number(credit.toFixed(2)));
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

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <select
                    name="country"
                    value={shippingForm.country}
                    onChange={handleInputChange as any}
                    className="input-field"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
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
                      className="input-field"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                    <select
                      name="phoneCountryCode"
                      value={shippingForm.phoneCountryCode}
                      onChange={handleInputChange as any}
                      className="input-field"
                    >
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+61">AU +61</option>
                      <option value="+86">CN +86</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={shippingForm.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                {/* Address Finder */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ADDRESS FINDER</label>
                  <div className="relative">
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="addressFinder"
                      value={shippingForm.addressFinder}
                      onChange={handleInputChange}
                      className="input-field pl-9"
                      placeholder="Search by postcode, street or address"
                    />
                  </div>
                </div>

                {/* Address Lines */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingForm.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Street name and number, company name"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingForm.addressLine2}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Building/Apartment/Suite no., Unit, Floor, etc (optional)"
                  />
                </div>

                {/* State/Province and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                    <select
                      name="stateProvince"
                      value={shippingForm.stateProvince}
                      onChange={handleInputChange as any}
                      className="input-field"
                    >
                      <option value="">Please Choose Your State/Province</option>
                      <option value="California">California</option>
                      <option value="Texas">Texas</option>
                      <option value="New York">New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="City"
                    />
                  </div>
                </div>

                {/* Zip Code */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post/Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingForm.zipCode}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Post/Zip Code"
                  />
                </div>

                {/* Helper links & Default */}
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={shippingForm.makeDefault}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, makeDefault: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Make Default</span>
                  </label>
                  <div className="space-x-4 text-xs">
                    <button type="button" className="text-gray-600 hover:text-gray-900">General Address Tips</button>
                    <button type="button" className="text-gray-600 hover:text-gray-900">Privacy & Cookie Policy</button>
                  </div>
                </div>

                {/* Security & Privacy */}
                <div className="flex items-start space-x-3 mt-4">
                  <Lock className="h-5 w-5 text-gray-700 mt-0.5" />
                  <p className="text-xs text-gray-600">
                    We maintain industry-standard physical, technical, and administrative measures to safeguard your personal information.
                  </p>
                </div>

                {/* Save */}
                <div className="mt-4">
                  <button type="button" className="w-full bg-black text-white font-semibold py-3 rounded">
                    SAVE
                  </button>
                </div>
              </div>

               {/* Warehouse1 group */}
               <div className="card p-0 overflow-hidden">
                 <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                   <h3 className="text-sm font-semibold text-gray-900">Warehouse1</h3>
                 </div>
                 <div className="p-4">
                   {items.map(item => (
                     <div key={item.id} className="mb-4">
                       <div className="flex items-start">
                         <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-3" />
                         <div className="flex-1">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                               <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                               <span className="text-xs text-red-600">-21%</span>
                               {item.stock && item.stock < 5 && (
                                 <span className="text-xs text-red-600 flex items-center">
                                   <AlertCircle className="h-3 w-3 mr-1" /> almost sold out!
                                 </span>
                               )}
                             </div>
                             <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                           </div>
                           {/* Quantity controls */}
                           <div className="flex items-center mt-2 space-x-2">
                             <button
                               type="button"
                               className="w-6 h-6 border rounded flex items-center justify-center"
                               onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                             >
                               <Minus className="h-4 w-4" />
                             </button>
                             <span className="text-sm">{item.quantity}</span>
                             <button
                               type="button"
                               className="w-6 h-6 border rounded flex items-center justify-center"
                               onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                             >
                               <Plus className="h-4 w-4" />
                             </button>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}

                   {/* Shipping method prompt */}
                   <div className="border-t border-gray-200 pt-3 mt-2">
                     <button type="button" className="w-full flex items-center justify-between text-sm text-gray-900 py-2">
                       <span>PLEASE SELECT A SHIPPING METHOD.</span>
                       <ChevronRight className="h-4 w-4" />
                     </button>
                   </div>

                   {/* Total and On-Time Delivery Service */}
                   <div className="space-y-1 mt-2">
                     <div className="text-sm text-gray-900">Subtotal: ${getTotalPrice().toFixed(2)}</div>
                     <div className="text-sm text-gray-900">
                       On-Time Delivery Service: <span className="font-medium">$0.00</span>
                     </div>
                     <div className="text-xs text-gray-600">500 Points if Late</div>
                   </div>
                 </div>
               </div>

               {/* Payment Method */}
               <div className="card p-6">
                 <div className="flex items-center mb-4">
                   <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
                   <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                 </div>
                 
                 <div className="space-y-3">
                  {/* PayPal */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={selectedPaymentMethod === 'paypal'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">PayPal</span>
                      </div>
                      <span className="text-gray-900 font-medium">PayPal</span>
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-yellow-500 rounded flex items-center justify-center mr-3">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium">Credit/Debit Card</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                          <div className="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                          <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center">M</div>
                          <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">A</div>
                          <div className="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">D</div>
                          <div className="w-6 h-4 bg-gray-600 rounded text-white text-xs flex items-center justify-center">D</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Klarna */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="klarna"
                      checked={selectedPaymentMethod === 'klarna'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-pink-200 rounded flex items-center justify-center mr-3">
                        <span className="text-pink-600 text-xs font-bold">Klarna</span>
                      </div>
                      <span className="text-gray-900 font-medium">Klarna</span>
                    </div>
                  </label>

                  {/* Afterpay */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="afterpay"
                      checked={selectedPaymentMethod === 'afterpay'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-gray-400 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <span className="text-gray-900 font-medium">Afterpay</span>
                    </div>
                  </label>

                  {/* Apple Pay */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="applepay"
                      checked={selectedPaymentMethod === 'applepay'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-black rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">Pay</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium">Apple Pay</span>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                          <div className="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                          <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center">M</div>
                          <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">A</div>
                          <div className="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">D</div>
                          <div className="w-6 h-4 bg-blue-700 rounded text-white text-xs flex items-center justify-center">U</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Pay Later with PayPal */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal-later"
                      checked={selectedPaymentMethod === 'paypal-later'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-xs font-bold">PP</span>
                      </div>
                      <span className="text-gray-900 font-medium">Pay Later with PayPal</span>
                    </div>
                  </label>

                  {/* Affirm */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="affirm"
                      checked={selectedPaymentMethod === 'affirm'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center mr-3">
                        <span className="text-gray-600 text-xs font-bold">affirm</span>
                      </div>
                      <span className="text-gray-900 font-medium">Affirm</span>
                    </div>
                  </label>

                  {/* Cash App Pay */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashapp"
                      checked={selectedPaymentMethod === 'cashapp'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-green-500 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <span className="text-gray-900 font-medium">Cash App Pay (Pay Now)</span>
                    </div>
                  </label>

                  {/* Google Pay */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="googlepay"
                      checked={selectedPaymentMethod === 'googlepay'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-white border rounded flex items-center justify-center mr-3">
                        <span className="text-xs font-bold">G Pay</span>
                      </div>
                      <span className="text-gray-900 font-medium">Google Pay</span>
                    </div>
                  </label>

                  {/* Venmo */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="venmo"
                      checked={selectedPaymentMethod === 'venmo'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">venmo</span>
                      </div>
                      <span className="text-gray-900 font-medium">Venmo</span>
                    </div>
                  </label>

                  {/* Pay in 4 installments (Zip) */}
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="zip"
                      checked={selectedPaymentMethod === 'zip'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-gray-300 rounded flex items-center justify-center mr-3">
                        <span className="text-gray-700 text-xs font-bold">zip</span>
                      </div>
                      <span className="text-gray-900 font-medium">Pay in 4 installments</span>
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
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">运费:</span>
                    <span className="font-medium text-green-600">免费</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">优惠券折扣:</span>
                      <span className="font-medium text-green-600">- {formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  {giftCardAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">礼品卡抵扣:</span>
                      <span className="font-medium text-green-600">- {formatPrice(giftCardAmount)}</span>
                    </div>
                  )}
                  {applyMembershipMarkdown && membershipDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">会员折扣:</span>
                      <span className="font-medium text-green-600">- {formatPrice(membershipDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">应付总额:</span>
                      <span className="text-xl font-bold text-red-500">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 积分奖励板块 */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm font-semibold text-gray-900">Reward 12 Points</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      You could save up to <span className="text-red-500 font-semibold">$5.00</span> on this order!
                    </p>
                    
                    {/* 会员俱乐部信息 */}
                    <div className="bg-white rounded-lg p-3 border border-yellow-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">G</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">Guaranteed antiques CLUB</span>
                        </div>
                        <span className="text-xs text-gray-500">All benefits stackable</span>
                      </div>
                      
                      <div className="text-xs text-orange-600 mb-2">
                        Save $1.62 after joining ×
                      </div>
                      
                      <div className="bg-orange-100 rounded p-2 mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 text-orange-600 mr-1" />
                            <span className="text-xs text-orange-800">Extra 3% OFF</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-orange-800">5 3X Shipping Coupons</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-orange-600 mr-1" />
                          <span className="text-xs text-orange-800">Points Reward</span>
                        </div>
                      </div>
                      
                      <div className="bg-orange-500 text-white py-2 rounded text-xs font-medium flex items-center justify-between px-3">
                        <span>Membership Markdown: $7.00</span>
                        <button type="button" className="underline" onClick={() => setApplyMembershipMarkdown(!applyMembershipMarkdown)}>
                          {applyMembershipMarkdown ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 优惠券输入板块 */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Coupon Code</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="输入优惠券代码"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      onClick={handleApplyCoupon}
                    >
                      APPLY
                    </button>
                  </div>
                </div>

                {/* 礼品卡板块 */}
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <Gift className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Gift Card</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={giftCardNumber}
                        onChange={(e) => setGiftCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={giftCardPin}
                        onChange={(e) => setGiftCardPin(e.target.value)}
                        placeholder="PIN"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        onClick={handleApplyGiftCard}
                      >
                        Apply
                      </button>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        View More ↓
                      </button>
                    </div>
                  </div>
                </div>

                {/* 安全保障信息板块 */}
                <section className="border-t border-gray-200 pt-4 mb-4 space-y-4">
                    {/* Payment Security */}
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">Payment Security</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Guaranteed antiques is committed to protecting your payment information and only shares your credit card information with our payment service providers who safeguard your information.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex space-x-1">
                            <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                            <div className="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                            <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">A</div>
                            <div className="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">D</div>
                            <div className="w-6 h-4 bg-gray-600 rounded text-white text-xs flex items-center justify-center">D</div>
                            <div className="w-6 h-4 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">W</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security & Privacy */}
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">Security & Privacy</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Guaranteed antiques' payment processor partner stores your credit card details by using industry-standard data encryption technology. Guaranteed antiques will not store your actual credit card information.
                        </p>
                        <div className="mt-2">
                          <button className="text-blue-500 hover:text-blue-700 text-xs">
                            Learn more →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Secure Shipment Guarantee */}
                    <div className="flex items-start space-x-3">
                      <Package className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">Secure Shipment Guarantee</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Free exchanges or refunds for lost, returned, or destroyed packages.
                        </p>
                      </div>
                    </div>

                    {/* Customer Support */}
                    <div className="flex items-start space-x-3">
                      <Headphones className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">Customer Support</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          If you have any questions about your order, please contact our Customer Service Platform on our website.
                        </p>
                      </div>
                    </div>
                  </section>

                {/* 底部继续按钮 */}
                <section className="border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3"
                  >
                    CONTINUE
                  </button>
                  
                  <p className="text-center text-xs text-gray-500">
                    By placing this order you agree to Guaranteed antiques'{" "}
                    <button className="text-blue-500 hover:text-blue-700 underline">
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button className="text-blue-500 hover:text-blue-700 underline">
                      Privacy Policy
                    </button>
                  </p>
                </section>

                {/* 原提交按钮 */}
                <div className="border-t border-gray-200 pt-4 mt-4">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;