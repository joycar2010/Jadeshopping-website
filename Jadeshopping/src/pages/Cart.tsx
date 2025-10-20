import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCartStore();

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">购物车</h1>
          
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">购物车是空的</h2>
            <p className="text-gray-500 mb-8">快去挑选您喜欢的玉石商品吧！</p>
            <Link to="/products" className="btn-primary">
              去购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            购物车 ({getTotalItems()} 件商品)
          </h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            清空购物车
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 商品列表 */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center space-x-4">
                  {/* 商品图片 */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  {/* 商品信息 */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {item.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-lg font-bold text-red-500">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        库存: {item.stock} 件
                      </span>
                    </div>
                  </div>

                  {/* 数量控制 */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 小计 */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                订单摘要
              </h2>
              
              <div className="space-y-3 mb-6">
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
                    <span className="text-lg font-semibold">总计:</span>
                    <span className="text-xl font-bold text-red-500">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full btn-primary text-center block"
                >
                  去结算
                </Link>
                <Link
                  to="/products"
                  className="w-full btn-secondary text-center block"
                >
                  继续购物
                </Link>
              </div>

              {/* 优惠信息 */}
              <div className="mt-6 p-4 bg-jade-50 rounded-lg">
                <h3 className="text-sm font-semibold text-jade-800 mb-2">
                  优惠信息
                </h3>
                <ul className="text-xs text-jade-700 space-y-1">
                  <li>• 满1000元免运费</li>
                  <li>• 新用户首单享9折优惠</li>
                  <li>• 购买3件及以上享8.5折</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;