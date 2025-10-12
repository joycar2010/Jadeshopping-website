import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Download,
  RefreshCw
} from 'lucide-react';
import type { Order, OrderFilters } from '@/types';

// 订单状态标签组件
interface StatusBadgeProps {
  status: Order['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { label: '待付款', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    paid: { label: '已付款', color: 'bg-blue-100 text-blue-800', icon: DollarSign },
    processing: { label: '处理中', color: 'bg-purple-100 text-purple-800', icon: Package },
    shipped: { label: '已发货', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    delivered: { label: '已送达', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-800', icon: XCircle },
    refunded: { label: '已退款', color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// 订单表格行组件
interface OrderRowProps {
  order: Order;
  onView: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onView, onUpdateStatus }) => {
  const [showActions, setShowActions] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price);
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = {
      pending: 'paid',
      paid: 'processing',
      processing: 'shipped',
      shipped: 'delivered'
    } as const;
    
    return statusFlow[currentStatus] || null;
  };

  const getNextStatusLabel = (currentStatus: Order['status']): string => {
    const labels = {
      pending: '标记已付款',
      paid: '开始处理',
      processing: '标记已发货',
      shipped: '标记已送达'
    } as const;
    
    return labels[currentStatus] || '';
  };

  const nextStatus = getNextStatus(order.status);
  const nextStatusLabel = getNextStatusLabel(order.status);

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
        <div className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {order.shippingAddress?.name || '未知用户'}
            </div>
            <div className="text-sm text-gray-500">
              {order.shippingAddress?.phone || ''}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {order.items.length} 件商品
        </div>
        <div className="text-xs text-gray-500">
          {order.items.slice(0, 2).map(item => item.productName).join(', ')}
          {order.items.length > 2 && '...'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatPrice(order.total)}
        </div>
        <div className="text-xs text-gray-500">
          {order.paymentMethod}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {order.shippingAddress?.province} {order.shippingAddress?.city}
        </div>
        <div className="text-xs text-gray-500">
          {order.shippingAddress?.district}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onView(order);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  查看详情
                </button>
                {nextStatus && (
                  <button
                    onClick={() => {
                      onUpdateStatus(order.id, nextStatus);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {nextStatusLabel}
                  </button>
                )}
                {order.status === 'pending' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(order.id, 'cancelled');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    取消订单
                  </button>
                )}
                {(order.status === 'paid' || order.status === 'processing') && (
                  <button
                    onClick={() => {
                      onUpdateStatus(order.id, 'refunded');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    申请退款
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// 筛选面板组件
interface FilterPanelProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  const statusOptions = [
    { value: 'pending', label: '待付款' },
    { value: 'paid', label: '已付款' },
    { value: 'processing', label: '处理中' },
    { value: 'shipped', label: '已发货' },
    { value: 'delivered', label: '已送达' },
    { value: 'cancelled', label: '已取消' },
    { value: 'refunded', label: '已退款' }
  ];

  const paymentMethods = ['支付宝', '微信支付', '银行卡', '余额支付'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">订单状态</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">全部状态</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支付方式</label>
          <select
            value={filters.paymentMethod || ''}
            onChange={(e) => onFiltersChange({ ...filters, paymentMethod: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">全部方式</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">订单金额</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="最低金额"
              value={filters.minAmount || ''}
              onChange={(e) => onFiltersChange({ ...filters, minAmount: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="最高金额"
              value={filters.maxAmount || ''}
              onChange={(e) => onFiltersChange({ ...filters, maxAmount: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>
  );
};

// 订单详情模态框组件
interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                订单详情 #{order.id}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 订单信息 */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">订单信息</h4>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">订单号:</span>
                      <span className="text-sm font-medium">#{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">创建时间:</span>
                      <span className="text-sm">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">订单状态:</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">支付方式:</span>
                      <span className="text-sm">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* 收货地址 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">收货地址</h4>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{order.shippingAddress?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{order.shippingAddress?.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-sm">
                        {order.shippingAddress?.province} {order.shippingAddress?.city} {order.shippingAddress?.district}
                        <br />
                        {order.shippingAddress?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 商品列表 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">商品列表</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatPrice(item.price)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">商品小计:</span>
                      <span className="text-sm">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">运费:</span>
                      <span className="text-sm">{formatPrice(order.shipping)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">优惠:</span>
                        <span className="text-sm text-red-600">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-sm text-gray-900">订单总计:</span>
                      <span className="text-lg text-emerald-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders: React.FC = () => {
  const { 
    adminOrders, 
    fetchAdminOrders, 
    updateAdminOrder,
    adminOrdersLoading 
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'total' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  // 筛选和搜索订单
  const filteredOrders = adminOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress?.phone?.includes(searchTerm);
    
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentMethod = !filters.paymentMethod || order.paymentMethod === filters.paymentMethod;
    const matchesAmount = (!filters.minAmount || order.total >= filters.minAmount) &&
                         (!filters.maxAmount || order.total <= filters.maxAmount);
    
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesAmount;
  });

  // 排序订单
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 分页
  const totalPages = Math.ceil(sortedOrders.length / pageSize);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    await updateAdminOrder(orderId, { status });
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            管理所有订单状态和处理流程
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            导出订单
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索订单号、客户姓名或手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </button>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="createdAt-desc">最新订单</option>
            <option value="createdAt-asc">最早订单</option>
            <option value="total-desc">金额从高到低</option>
            <option value="total-asc">金额从低到高</option>
          </select>
        </div>
      </div>

      {/* 筛选面板 */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* 订单表格 */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收货地址
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminOrdersLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                      <span className="ml-2 text-gray-500">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无订单</h3>
                    <p className="mt-1 text-sm text-gray-500">还没有任何订单记录。</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, sortedOrders.length)} 条，
                  共 {sortedOrders.length} 条记录
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value={10}>10条/页</option>
                  <option value={20}>20条/页</option>
                  <option value={50}>50条/页</option>
                </select>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 订单详情模态框 */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={showOrderDetail}
        onClose={() => {
          setShowOrderDetail(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Orders;