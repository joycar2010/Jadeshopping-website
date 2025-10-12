import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { Payment, PaymentManagementFilters } from '../../../types';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  FileText,
  Printer
} from 'lucide-react';

// 状态徽章组件
const StatusBadge: React.FC<{ status: Payment['status'] }> = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: '待处理' },
    processing: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, text: '处理中' },
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: '已完成' },
    failed: { color: 'bg-red-100 text-red-800', icon: XCircle, text: '失败' },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: '已取消' },
    refunded: { color: 'bg-purple-100 text-purple-800', icon: RotateCcw, text: '已退款' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
};

// 支付方式图标组件
const PaymentMethodIcon: React.FC<{ method: string }> = ({ method }) => {
  const getMethodInfo = (method: string) => {
    switch (method.toLowerCase()) {
      case 'alipay':
      case '支付宝':
        return { icon: '💰', color: 'text-blue-600', name: '支付宝' };
      case 'wechat':
      case '微信支付':
        return { icon: '💚', color: 'text-green-600', name: '微信支付' };
      case 'credit_card':
      case '银行卡':
        return { icon: '💳', color: 'text-purple-600', name: '银行卡' };
      case 'balance':
      case '余额支付':
        return { icon: '💰', color: 'text-orange-600', name: '余额支付' };
      default:
        return { icon: '💳', color: 'text-gray-600', name: method };
    }
  };

  const methodInfo = getMethodInfo(method);

  return (
    <div className="flex items-center">
      <span className="text-lg mr-2">{methodInfo.icon}</span>
      <span className={`text-sm font-medium ${methodInfo.color}`}>
        {methodInfo.name}
      </span>
    </div>
  );
};

// 支付行组件
const PaymentRow: React.FC<{ payment: Payment; onViewDetails: (id: string) => void }> = ({ 
  payment, 
  onViewDetails 
}) => {
  const formatPrice = (price: number) => `¥${price.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
        <div className="text-sm text-gray-500">{payment.transaction_id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">订单 #{payment.order_id}</div>
        <div className="text-sm text-gray-500">客户 #{payment.customer_id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatPrice(payment.amount)}</div>
        <div className="text-sm text-gray-500">手续费: {formatPrice(payment.fee || 0)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <PaymentMethodIcon method={payment.method} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={payment.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>{formatDate(payment.created_at)}</div>
        {payment.completed_at && (
          <div className="text-xs text-green-600">
            完成: {formatDate(payment.completed_at)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDetails(payment.id)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
            title="查看详情"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-50"
            title="更多操作"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// 筛选面板组件
const FilterPanel: React.FC<{
  filters: PaymentManagementFilters;
  onFiltersChange: (filters: Partial<PaymentManagementFilters>) => void;
  onReset: () => void;
}> = ({ filters, onFiltersChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">支付状态</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ status: e.target.value as Payment['status'] || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
            <option value="cancelled">已取消</option>
            <option value="refunded">已退款</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">支付方式</label>
          <select
            value={filters.method || ''}
            onChange={(e) => onFiltersChange({ method: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部方式</option>
            <option value="alipay">支付宝</option>
            <option value="wechat">微信支付</option>
            <option value="credit_card">银行卡</option>
            <option value="balance">余额支付</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onFiltersChange({ start_date: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => onFiltersChange({ end_date: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            重置筛选
          </button>
        </div>
        <div className="text-sm text-gray-500">
          找到 {filters.total_count || 0} 条支付记录
        </div>
      </div>
    </div>
  );
};

// 统计卡片组件
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const PaymentsList: React.FC = () => {
  const { 
    payments, 
    paymentsLoading, 
    paymentManagementStats,
    paymentManagementStatsLoading,
    fetchPayments, 
    fetchPaymentStats,
    updatePaymentStatus,
    exportPaymentReport
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PaymentManagementFilters>({});
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPayments(filters);
    fetchPaymentStats(filters);
  }, [filters]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleFiltersChange = (newFilters: Partial<PaymentManagementFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleViewDetails = (paymentId: string) => {
    // 导航到支付详情页面
    window.location.href = `/admin/payments/${paymentId}`;
  };

  const handleBatchExport = async () => {
    const reportConfig = {
      type: 'payments_list' as const,
      format: 'excel' as const,
      filters,
      include_fields: ['id', 'order_id', 'amount', 'method', 'status', 'created_at'],
      date_range: {
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
      }
    };

    const result = await exportPaymentReport(reportConfig);
    if (result) {
      // 模拟下载
      console.log('导出成功:', result.file_url);
    }
  };

  const handleRefresh = () => {
    fetchPayments(filters);
    fetchPaymentStats(filters);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">支付管理</h1>
        <p className="mt-2 text-gray-600">管理和监控所有支付交易</p>
      </div>

      {/* 统计卡片 */}
      {paymentManagementStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="总支付金额"
            value={`¥${paymentManagementStats.total_amount.toLocaleString()}`}
            change={`+${paymentManagementStats.revenue_growth_rate}%`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatsCard
            title="成功支付"
            value={paymentManagementStats.successful_payments.toLocaleString()}
            change={`${paymentManagementStats.success_rate}% 成功率`}
            icon={CheckCircle}
            color="bg-blue-500"
          />
          <StatsCard
            title="待处理支付"
            value={paymentManagementStats.pending_payments.toLocaleString()}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="退款金额"
            value={`¥${paymentManagementStats.refunded_amount.toLocaleString()}`}
            change={`${paymentManagementStats.refund_rate}% 退款率`}
            icon={RotateCcw}
            color="bg-purple-500"
          />
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索支付记录..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={paymentsLoading}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${paymentsLoading ? 'animate-spin' : ''}`} />
            刷新
          </button>
          <button
            onClick={handleBatchExport}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            导出
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      )}

      {/* 支付列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支付信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单信息
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
                  时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-500">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无支付记录</h3>
                      <p className="text-gray-500">当前筛选条件下没有找到支付记录</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {payments.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                上一页
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">1</span> 到 <span className="font-medium">{payments.length}</span> 条，
                  共 <span className="font-medium">{payments.length}</span> 条记录
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    上一页
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    下一页
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsList;