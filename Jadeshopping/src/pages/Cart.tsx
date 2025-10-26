import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ShoppingBag, Lock, ChevronRight, 
  Gift, Truck, AlertCircle, Star, Heart, ShoppingCart,
  CreditCard, Smartphone, Wallet, Shield
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // 计算优惠券节省金额
  const couponSavings = selectedCoupon ? 58.2 : 0;
  const finalTotal = getTotalPrice() - couponSavings;

  // 推荐商品数据
  const recommendedItems = [
    {
      id: 'rec1',
      name: '翡翠手镯',
      price: 899,
      originalPrice: 1299,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=jade%20bracelet%20elegant%20green%20white%20background&image_size=square',
      rating: 4.8,
      reviews: 156,
      discount: '31% OFF'
    },
    {
      id: 'rec2',
      name: '和田玉吊坠',
      price: 599,
      originalPrice: 899,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=jade%20pendant%20white%20elegant%20traditional&image_size=square',
      rating: 4.9,
      reviews: 203,
      discount: '33% OFF'
    },
    {
      id: 'rec3',
      name: '玉石耳环',
      price: 399,
      originalPrice: 599,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=jade%20earrings%20elegant%20green%20jewelry&image_size=square',
      rating: 4.7,
      reviews: 89,
      discount: '33% OFF'
    },
    {
      id: 'rec4',
      name: '玛瑙手串',
      price: 299,
      originalPrice: 499,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=agate%20bracelet%20beads%20traditional%20jewelry&image_size=square',
      rating: 4.6,
      reviews: 124,
      discount: '40% OFF'
    }
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 页头区域 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-bold text-black">
                  JADE ELEGANCE
                </Link>
                {/* 订单进度指示器 */}
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="px-3 py-1 bg-black text-white rounded-full font-medium">购物车</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">下单</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">支付</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">完成</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>安全结算</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">购物车是空的</h2>
            <p className="text-gray-600 mb-8">快去挑选您喜欢的玉石商品吧！</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              去购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页头区域 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-black">
                JADE ELEGANCE
              </Link>
              {/* 订单进度指示器 */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="px-3 py-1 bg-black text-white rounded-full font-medium">购物车</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">下单</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">支付</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">完成</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>安全结算</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 两栏式布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧主内容区 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 优惠券使用区域 */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Gift className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-700">
                      立即使用优惠券可节省 ¥58.2
                    </p>
                    <p className="text-sm text-red-600">限时优惠，不要错过！</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCoupon(selectedCoupon ? null : 'coupon1')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCoupon 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-red-500 border border-red-500 hover:bg-red-50'
                  }`}
                >
                  {selectedCoupon ? '已使用' : '立即使用'}
                </button>
              </div>
            </div>

            {/* 商品列表 - 按仓库分组 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    仓库1 - 玉石精品
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Truck className="h-4 w-4" />
                    <span>符合免费标准配送条件！</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* 商品图片 */}
                      <Link to={`/product/${item.id}`} className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>

                      {/* 商品信息 */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-black transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                        
                        {/* 库存状态 */}
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-lg font-bold text-black">
                            {formatPrice(item.price)}
                          </span>
                          {item.stock < 10 && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              即将售罄
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 数量控制 */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* 小计 */}
                        <div className="text-right min-w-[100px]">
                          <div className="text-lg font-bold text-black">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>

                        {/* 删除按钮 */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 加购商品推荐 */}
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      符合加购商品条件，选择一件享受额外优惠
                    </span>
                  </div>
                  <button className="text-sm text-black font-medium hover:underline">
                    选择 &gt;
                  </button>
                </div>
              </div>

              {/* 商品政策提示 */}
              <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    部分商品不支持退换货/享受折扣优惠
                  </span>
                  <button className="text-sm text-yellow-700 font-medium hover:underline">
                    查看详情 &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧订单摘要区 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  订单摘要
                </h2>
                
                {/* 商品缩略图 */}
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                  {items.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                  {items.length > 4 && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600">
                      +{items.length - 4}
                    </div>
                  )}
                </div>

                {/* 价格明细 */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品总数:</span>
                    <span className="font-medium">{getTotalItems()} 件</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">预估价格:</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  {selectedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">优惠券节省:</span>
                      <span className="font-medium text-green-600">-{formatPrice(couponSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费:</span>
                    <span className="font-medium text-green-600">免费</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">总计:</span>
                      <span className="text-xl font-bold text-black">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 积分奖励 */}
                <div className="bg-yellow-50 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">
                      完成订单可获得 {Math.floor(finalTotal / 10)} 积分
                    </span>
                  </div>
                </div>

                {/* 优惠提示 */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Truck className="h-4 w-4" />
                    <span>免费配送</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>部分商品即将售罄！</span>
                  </div>
                </div>

                {/* 结算按钮 */}
                <Link
                  to="/checkout"
                  className="w-full bg-black text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors text-center block mb-4"
                >
                  立即结算
                </Link>

                {/* We Accept 支付方式板块 */}
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">We Accept</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* VISA */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="px-3 py-1 rounded bg-white">
                          <span className="text-[#1a1f71] font-extrabold text-xl tracking-widest">VISA</span>
                        </div>
                      </div>
                    </div>

                    {/* Mastercard */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="relative w-20 h-10">
                        <div className="absolute left-2 top-1 w-8 h-8 rounded-full bg-[#EB001B] opacity-90"></div>
                        <div className="absolute left-6 top-1 w-8 h-8 rounded-full bg-[#F79E1B] opacity-90"></div>
                      </div>
                    </div>

                    {/* Maestro */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="relative w-20 h-10">
                        <div className="absolute left-2 top-1 w-8 h-8 rounded-full bg-[#EB001B]"></div>
                        <div className="absolute left-6 top-1 w-8 h-8 rounded-full bg-[#00A2E8]"></div>
                      </div>
                    </div>

                    {/* American Express */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="bg-[#2E77BB] text-white font-bold rounded px-3 py-1 text-sm">AMERICAN EXPRESS</div>
                    </div>

                    {/* Discover */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="flex items-center space-x-2">
                        <span className="text-black font-bold">DISCOVER</span>
                        <div className="w-6 h-6 rounded-full bg-[#F7941D]"></div>
                      </div>
                    </div>

                    {/* Diners Club */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-[#3A75C4] text-white flex items-center justify-center font-bold">DC</div>
                        <span className="text-gray-800 font-medium">Diners Club</span>
                      </div>
                    </div>

                    {/* PayPal */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <span className="text-[#003087] font-bold text-lg">PayPal</span>
                    </div>

                    {/* Afterpay */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded bg-[#C6F5D2]">
                        <span className="text-[#071B0C] font-semibold">Afterpay</span>
                      </div>
                    </div>

                    {/* Klarna */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded bg-[#FFB3C7]">
                        <span className="text-[#1A1A1A] font-semibold">Klarna</span>
                      </div>
                    </div>

                    {/* Apple Pay */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded border border-gray-300">
                        <span className="text-black font-bold"> Pay</span>
                      </div>
                    </div>

                    {/* Google Pay */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded border border-gray-300">
                        <span className="text-gray-900 font-bold">G Pay</span>
                      </div>
                    </div>

                    {/* Zip */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded bg-white border text-gray-800 font-bold">zip</div>
                    </div>

                    {/* Venmo */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded bg-[#3D95CE]">
                        <span className="text-white font-bold">venmo</span>
                      </div>
                    </div>

                    {/* Cash App */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="px-3 py-1 rounded bg-[#00C244]">
                        <span className="text-white font-black text-xl">$</span>
                      </div>
                    </div>

                    {/* Affirm */}
                    <div className="flex items-center justify-center bg-white border rounded-lg shadow-sm h-16 p-2 hover:shadow-md hover:scale-[1.02] transition-all">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-t-full border-4 border-b-0 border-[#1E2A5A]"></div>
                        <span className="text-[#1E2A5A] font-bold">affirm</span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        {/* 底部推荐区 */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              你可能想用它来凑单
            </h2>
            <p className="text-gray-600 mb-8">精选商品，提升您的订单价值</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {item.discount}
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(item.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-black">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    </div>
                    
                    <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                      加入购物车
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;