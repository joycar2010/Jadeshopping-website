import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, Eye, RotateCcw, ShoppingCart, X, MapPin } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { getOrdersData } from '../data/mockData';
import { Order, OrderStatus } from '../types';

const Orders: React.FC = () => {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // 获取订单数据
  const orders = user ? getOrdersData(user.id) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后查看订单信息</p>
            <Link to="/login" className="btn-primary">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.PENDING]: { label: '待付款', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
      [OrderStatus.PAID]: { label: '已付款', color: 'text-blue-600 bg-blue-100', icon: Package },
      [OrderStatus.SHIPPED]: { label: '已发货', color: 'text-purple-600 bg-purple-100', icon: Truck },
      [OrderStatus.DELIVERED]: { label: '已送达', color: 'text-green-600 bg-green-100', icon: CheckCircle },
      [OrderStatus.CANCELLED]: { label: '已取消', color: 'text-red-600 bg-red-100', icon: X },
      [OrderStatus.REFUNDED]: { label: '已退款', color: 'text-gray-600 bg-gray-100', icon: RotateCcw }
    };
    return statusMap[status];
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { key: 'all' as const, label: '全部订单' },
    { key: OrderStatus.PENDING, label: '待付款' },
    { key: OrderStatus.PAID, label: '待发货' },
    { key: OrderStatus.SHIPPED, label: '待收货' },
    { key: OrderStatus.DELIVERED, label: '已完成' },
    { key: OrderStatus.CANCELLED, label: '已取消' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleOrderAction = (order: Order, action: string) => {
    switch (action) {
      case 'cancel':
        if (confirm('确定要取消这个订单吗？')) {
          alert('订单已取消');
        }
        break;
      case 'confirm':
        if (confirm('确认收货吗？')) {
          alert('确认收货成功');
        }
        break;
      case 'refund':
        alert('退款申请已提交，我们会尽快处理');
        break;
      case 'rebuy':
        alert('商品已添加到购物车');
        break;
      default:
        break;
    }
  };

  const OrderDetailModal = () => (
    showOrderDetail && selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowOrderDetail(false)}>
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">订单详情</h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* 订单信息 */}
            <div>
              <h4 className="font-semibold mb-3">订单信息</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">订单号：</span>
                  <span className="font-medium">{selectedOrder.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">下单时间：</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">支付方式：</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-600">订单状态：</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>
              </div>
            </div>

            {/* 收货地址 */}
            <div>
              <h4 className="font-semibold mb-3">收货地址</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">{selectedOrder.shippingAddress.name} {selectedOrder.shippingAddress.phone}</div>
                    <div className="text-gray-600 text-sm mt-1">
                      {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.district} {selectedOrder.shippingAddress.detail}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 商品列表 */}
            <div>
              <h4 className="font-semibold mb-3">商品清单</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600">数量: {item.quantity}</span>
                        <span className="font-medium text-red-500">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 费用明细 */}
            <div>
              <h4 className="font-semibold mb-3">费用明细</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总价：</span>
                  <span>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运费：</span>
                  <span>免运费</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>实付金额：</span>
                  <span className="text-red-500">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const TrackingModal = () => (
    showTrackingModal && selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowTrackingModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">物流跟踪</h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">商品已送达</div>
                  <div className="text-sm text-gray-600">2024-01-15 14:30</div>
                  <div className="text-sm text-gray-500">您的包裹已由本人签收，感谢您的信任</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">正在派送</div>
                  <div className="text-sm text-gray-600">2024-01-15 08:00</div>
                  <div className="text-sm text-gray-500">快递员正在为您派送，请保持电话畅通</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">运输中</div>
                  <div className="text-sm text-gray-600">2024-01-14 16:20</div>
                  <div className="text-sm text-gray-500">您的包裹正在运输途中</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">已发货</div>
                  <div className="text-sm text-gray-600">2024-01-13 10:15</div>
                  <div className="text-sm text-gray-500">商品已从仓库发出</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的订单</h1>

        {/* 搜索框 */}
        <div className="card p-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="搜索订单号或商品名称..."
            />
          </div>
        </div>

        {/* 订单状态标签 */}
        <div className="card p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 订单列表 */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="card p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? '未找到相关订单' : '暂无订单'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? '请尝试其他搜索关键词' : '快去挑选您喜欢的玉石商品吧！'}
              </p>
              <Link to="/products" className="btn-primary">
                去购物
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="card p-6">
                  {/* 订单头部 */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        订单号: {order.id}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-5 w-5" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* 商品列表 */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              数量: {item.quantity}
                            </span>
                            <span className="font-semibold text-red-500">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 订单底部 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-lg font-semibold">
                      总计: <span className="text-red-500">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetail(true);
                        }}
                        className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        <span>查看详情</span>
                      </button>
                      
                      {order.status === OrderStatus.SHIPPED && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowTrackingModal(true);
                          }}
                          className="flex items-center space-x-1 px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50"
                        >
                          <Truck className="h-4 w-4" />
                          <span>查看物流</span>
                        </button>
                      )}
                      
                      {order.status === OrderStatus.PENDING && (
                        <button
                          onClick={() => handleOrderAction(order, 'cancel')}
                          className="flex items-center space-x-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                          <span>取消订单</span>
                        </button>
                      )}
                      
                      {order.status === OrderStatus.SHIPPED && (
                        <button
                          onClick={() => handleOrderAction(order, 'confirm')}
                          className="flex items-center space-x-1 btn-primary"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>确认收货</span>
                        </button>
                      )}
                      
                      {order.status === OrderStatus.DELIVERED && (
                        <>
                          <button
                            onClick={() => handleOrderAction(order, 'refund')}
                            className="flex items-center space-x-1 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span>申请退款</span>
                          </button>
                          <button
                            onClick={() => handleOrderAction(order, 'rebuy')}
                            className="flex items-center space-x-1 btn-primary"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>再次购买</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <OrderDetailModal />
      <TrackingModal />
    </div>
  );
};

export default Orders;