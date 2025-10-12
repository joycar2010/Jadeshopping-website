import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { RefundRequest } from '../../../types';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Package,
  FileText,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

// 统计卡片组件
const StatsCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
}> = ({ title, value, change, changeType, icon }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-3 h-3" />;
      case 'decrease': return <TrendingDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm ml-1">{change}</span>
            </div>
          )}
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

// 状态徽章组件
const StatusBadge: React.FC<{ status: RefundRequest['status'] }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: '待审核' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: Check, text: '已批准' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: X, text: '已拒绝' };
      case 'processing':
        return { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, text: '处理中' };
      case 'completed':
        return { color: 'bg-green-100 text-green-800', icon: Check, text: '已完成' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle, text: '未知' };
    }
  };

  const { color, icon: Icon, text } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};

// 退款原因组件
const RefundReasonBadge: React.FC<{ reason: string }> = ({ reason }) => {
  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'customer_request': return 'bg-blue-100 text-blue-800';
      case 'product_defect': return 'bg-red-100 text-red-800';
      case 'shipping_issue': return 'bg-yellow-100 text-yellow-800';
      case 'duplicate_payment': return 'bg-purple-100 text-purple-800';
      case 'fraud': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'customer_request': return '客户申请';
      case 'product_defect': return '产品缺陷';
      case 'shipping_issue': return '物流问题';
      case 'duplicate_payment': return '重复支付';
      case 'fraud': return '欺诈';
      default: return reason;
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getReasonColor(reason)}`}>
      {getReasonText(reason)}
    </span>
  );
};

// 退款行组件
const RefundRow: React.FC<{
  refund: RefundRequest;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ refund, onView, onApprove, onReject }) => {
  const [showActions, setShowActions] = useState(false);

  const formatPrice = (price: number) => `¥${price.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{refund.id}</div>
        <div className="text-sm text-gray-500">订单: #{refund.order_id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{refund.customer_name}</div>
        <div className="text-sm text-gray-500">{refund.customer_email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatPrice(refund.amount)}</div>
        <div className="text-sm text-gray-500">
          原金额: {formatPrice(refund.original_amount)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RefundReasonBadge reason={refund.reason} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={refund.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(refund.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onView(refund.id);
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  查看详情
                </button>
                {refund.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        onApprove(refund.id);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      批准退款
                    </button>
                    <button
                      onClick={() => {
                        onReject(refund.id);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 mr-2" />
                      拒绝退款
                    </button>
                  </>
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
const FilterPanel: React.FC<{
  filters: {
    status: string;
    reason: string;
    dateRange: string;
    amountRange: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">退款原因</label>
          <select
            value={filters.reason}
            onChange={(e) => onFilterChange('reason', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部原因</option>
            <option value="customer_request">客户申请</option>
            <option value="product_defect">产品缺陷</option>
            <option value="shipping_issue">物流问题</option>
            <option value="duplicate_payment">重复支付</option>
            <option value="fraud">欺诈</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日期范围</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>
  );
};

const RefundManagement: React.FC = () => {
  const { 
    refundRequests, 
    fetchRefundRequests, 
    processRefundRequest,
    exportRefundReport 
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    reason: '',
    dateRange: '',
    amountRange: ''
  });
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  useEffect(() => {
    const loadRefunds = async () => {
      setLoading(true);
      await fetchRefundRequests();
      setLoading(false);
    };

    loadRefunds();
  }, [fetchRefundRequests]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      reason: '',
      dateRange: '',
      amountRange: ''
    });
    setSearchTerm('');
  };

  const handleApprove = async (refundId: string) => {
    setProcessing(refundId);
    try {
      await processRefundRequest(refundId, 'approve');
    } catch (error) {
      console.error('批准退款失败:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (refundId: string) => {
    setProcessing(refundId);
    try {
      await processRefundRequest(refundId, 'reject');
    } catch (error) {
      console.error('拒绝退款失败:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleView = (refundId: string) => {
    // 这里可以导航到退款详情页面或打开模态框
    console.log('查看退款详情:', refundId);
  };

  const handleBatchApprove = async () => {
    for (const refundId of selectedRefunds) {
      await handleApprove(refundId);
    }
    setSelectedRefunds([]);
    setShowBatchActions(false);
  };

  const handleExport = async () => {
    try {
      await exportRefundReport({
        format: 'excel',
        filters: filters,
        search: searchTerm
      });
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 筛选和搜索逻辑
  const filteredRefunds = refundRequests.filter(refund => {
    const matchesSearch = !searchTerm || 
      refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.order_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || refund.status === filters.status;
    const matchesReason = !filters.reason || refund.reason === filters.reason;

    return matchesSearch && matchesStatus && matchesReason;
  });

  // 统计数据
  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    totalAmount: refundRequests.reduce((sum, r) => sum + r.amount, 0)
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-3" />
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">退款管理</h1>
            <p className="mt-2 text-gray-600">管理和处理退款申请</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              导出报表
            </button>
            <button
              onClick={() => fetchRefundRequests()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="总退款申请"
          value={stats.total.toString()}
          icon={<FileText className="w-8 h-8" />}
        />
        <StatsCard
          title="待审核"
          value={stats.pending.toString()}
          change="+12%"
          changeType="increase"
          icon={<Clock className="w-8 h-8" />}
        />
        <StatsCard
          title="已批准"
          value={stats.approved.toString()}
          change="+8%"
          changeType="increase"
          icon={<Check className="w-8 h-8" />}
        />
        <StatsCard
          title="退款总额"
          value={`¥${stats.totalAmount.toFixed(2)}`}
          change="-5%"
          changeType="decrease"
          icon={<DollarSign className="w-8 h-8" />}
        />
      </div>

      {/* 筛选面板 */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索退款ID、客户姓名或订单ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {selectedRefunds.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              已选择 {selectedRefunds.length} 项
            </span>
            <button
              onClick={handleBatchApprove}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
            >
              批量批准
            </button>
          </div>
        )}
      </div>

      {/* 退款列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  退款信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  退款金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  退款原因
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无退款申请</h3>
                    <p className="text-gray-500">当前没有符合条件的退款申请</p>
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((refund) => (
                  <RefundRow
                    key={refund.id}
                    refund={refund}
                    onView={handleView}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      {filteredRefunds.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示 <span className="font-medium">1</span> 到{' '}
            <span className="font-medium">{Math.min(10, filteredRefunds.length)}</span> 项，
            共 <span className="font-medium">{filteredRefunds.length}</span> 项
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              上一页
            </button>
            <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;