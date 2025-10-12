import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  RefreshCw,
  DollarSign,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  MoreHorizontal,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { Payment, PaymentFilters } from '@/types';

// 支付状态标签组件
interface StatusBadgeProps {
  status: Payment['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    processing: { label: '处理中', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
    completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    failed: { label: '失败', color: 'bg-red-100 text-red-800', icon: XCircle },
    cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    refunded: { label: '已退款', color: 'bg-purple-100 text-purple-800', icon: RefreshCw }
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

// 支付方式图标组件
interface PaymentMethodIconProps {
  method: string;
}

const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ method }) => {
  const getIcon = () => {
    switch (method) {
      case '支付宝':
        return <Smartphone className="h-4 w-4 text-blue-500" />;
      case '微信支付':
        return <Smartphone className="h-4 w-4 text-green-500" />;
      case '银行卡':
        return <CreditCard className="h-4 w-4 text-gray-600" />;
      case '余额支付':
        return <Wallet className="h-4 w-4 text-purple-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center">
      {getIcon()}
      <span className="ml-2 text-sm">{method}</span>
    </div>
  );
};

// 支付记录表格行组件
interface PaymentRowProps {
  payment: Payment;
  onView: (payment: Payment) => void;
  onRefund: (paymentId: string) => void;
}

const PaymentRow: React.FC<PaymentRowProps> = ({ payment, onView, onRefund }) => {
  const [showActions, setShowActions] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price);
  };

  const canRefund = payment.status === 'completed' && !payment.refundedAt;

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
        <div className="text-sm text-gray-500">
          {new Date(payment.createdAt).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{payment.orderId}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatPrice(payment.amount)}
        </div>
        {payment.refundAmount && payment.refundAmount > 0 && (
          <div className="text-xs text-red-600">
            退款: {formatPrice(payment.refundAmount)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <PaymentMethodIcon method={payment.method} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={payment.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {payment.transactionId || '-'}
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
                    onView(payment);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  查看详情
                </button>
                {canRefund && (
                  <button
                    onClick={() => {
                      onRefund(payment.id);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    申请退款
                  </button>
                )}
                <button
                  onClick={() => setShowActions(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  导出记录
                </button>
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
  filters: PaymentFilters;
  onFiltersChange: (filters: PaymentFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  const statusOptions = [
    { value: 'pending', label: '待处理' },
    { value: 'processing', label: '处理中' },
    { value: 'completed', label: '已完成' },
    { value: 'failed', label: '失败' },
    { value: 'cancelled', label: '已取消' },
    { value: 'refunded', label: '已退款' }
  ];

  const paymentMethods = ['支付宝', '微信支付', '银行卡', '余额支付'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支付状态</label>
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
            value={filters.method || ''}
            onChange={(e) => onFiltersChange({ ...filters, method: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">全部方式</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支付金额</label>
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

// 支付详情模态框组件
interface PaymentDetailModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                支付详情 #{payment.id}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">支付ID:</span>
                      <div className="text-sm font-medium">#{payment.id}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">订单ID:</span>
                      <div className="text-sm font-medium">#{payment.orderId}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">支付金额:</span>
                      <div className="text-sm font-medium text-emerald-600">
                        {formatPrice(payment.amount)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">支付方式:</span>
                      <div className="text-sm">
                        <PaymentMethodIcon method={payment.method} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">支付状态:</span>
                      <div className="text-sm">
                        <StatusBadge status={payment.status} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">交易号:</span>
                      <div className="text-sm font-mono">
                        {payment.transactionId || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 时间信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">时间信息</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">创建时间:</span>
                      <span className="text-sm">{new Date(payment.createdAt).toLocaleString()}</span>
                    </div>
                    {payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">支付时间:</span>
                        <span className="text-sm">{new Date(payment.paidAt).toLocaleString()}</span>
                      </div>
                    )}
                    {payment.refundedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">退款时间:</span>
                        <span className="text-sm">{new Date(payment.refundedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 退款信息 */}
              {payment.refundAmount && payment.refundAmount > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">退款信息</h4>
                  <div className="bg-red-50 p-4 rounded-md space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">退款金额:</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatPrice(payment.refundAmount)}
                      </span>
                    </div>
                    {payment.refundReason && (
                      <div>
                        <span className="text-sm text-gray-600">退款原因:</span>
                        <div className="text-sm mt-1">{payment.refundReason}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 备注信息 */}
              {payment.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">备注信息</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">{payment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 统计卡片组件
interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Payments: React.FC = () => {
  const { 
    adminPayments, 
    fetchAdminPayments, 
    refundPayment,
    adminPaymentsLoading 
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  useEffect(() => {
    fetchAdminPayments();
  }, [fetchAdminPayments]);

  // 筛选和搜索支付记录
  const filteredPayments = adminPayments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || payment.status === filters.status;
    const matchesMethod = !filters.method || payment.method === filters.method;
    const matchesAmount = (!filters.minAmount || payment.amount >= filters.minAmount) &&
                         (!filters.maxAmount || payment.amount <= filters.maxAmount);
    
    return matchesSearch && matchesStatus && matchesMethod && matchesAmount;
  });

  // 排序支付记录
  const sortedPayments = [...filteredPayments].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedPayments.length / pageSize);
  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  const handleRefund = async (paymentId: string) => {
    if (confirm('确定要申请退款吗？')) {
      await refundPayment(paymentId);
    }
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  // 计算统计数据
  const stats = {
    totalAmount: adminPayments.reduce((sum, p) => sum + p.amount, 0),
    completedAmount: adminPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    refundedAmount: adminPayments.reduce((sum, p) => sum + (p.refundAmount || 0), 0),
    pendingCount: adminPayments.filter(p => p.status === 'pending').length
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">支付管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            管理所有支付记录和退款处理
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            导出记录
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="总交易金额"
          value={formatPrice(stats.totalAmount)}
          change="+12.5%"
          changeType="increase"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-emerald-500"
        />
        <StatsCard
          title="已完成金额"
          value={formatPrice(stats.completedAmount)}
          change="+8.2%"
          changeType="increase"
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="退款金额"
          value={formatPrice(stats.refundedAmount)}
          change="-2.1%"
          changeType="decrease"
          icon={<RefreshCw className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        <StatsCard
          title="待处理"
          value={stats.pendingCount.toString()}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
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
              placeholder="搜索支付ID、订单ID或交易号..."
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
            <option value="createdAt-desc">最新支付</option>
            <option value="createdAt-asc">最早支付</option>
            <option value="amount-desc">金额从高到低</option>
            <option value="amount-asc">金额从低到高</option>
          </select>
        </div>
      </div>

      {/* 筛选面板 */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* 支付记录表格 */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支付信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支付方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  交易号
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminPaymentsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                      <span className="ml-2 text-gray-500">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无支付记录</h3>
                    <p className="mt-1 text-sm text-gray-500">还没有任何支付记录。</p>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onView={handleViewPayment}
                    onRefund={handleRefund}
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
                  显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, sortedPayments.length)} 条，
                  共 {sortedPayments.length} 条记录
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

      {/* 支付详情模态框 */}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={showPaymentDetail}
        onClose={() => {
          setShowPaymentDetail(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
};

export default Payments;