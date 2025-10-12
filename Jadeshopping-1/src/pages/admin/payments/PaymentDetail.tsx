import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { Payment, PaymentRiskAssessment } from '../../../types';
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  FileText,
  Printer,
  Download,
  Shield,
  Activity,
  Eye,
  Edit,
  MoreHorizontal,
  Copy,
  ExternalLink
} from 'lucide-react';

// 状态时间线组件
const StatusTimeline: React.FC<{ payment: Payment }> = ({ payment }) => {
  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: '支付创建', time: payment.created_at, completed: true },
      { status: 'processing', label: '支付处理', time: payment.processing_at, completed: !!payment.processing_at },
      { status: 'completed', label: '支付完成', time: payment.completed_at, completed: !!payment.completed_at }
    ];

    if (payment.status === 'failed') {
      steps.push({ status: 'failed', label: '支付失败', time: payment.failed_at, completed: true });
    }

    if (payment.status === 'refunded') {
      steps.push({ status: 'refunded', label: '已退款', time: payment.refunded_at, completed: true });
    }

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">支付流程</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed 
                ? step.status === 'failed' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.completed ? (
                step.status === 'failed' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </p>
                {step.time && (
                  <p className="text-sm text-gray-500">
                    {new Date(step.time).toLocaleString('zh-CN')}
                  </p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`absolute left-4 mt-8 w-0.5 h-4 ${
                steps[index + 1].completed ? 'bg-green-200' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 风险评估组件
const RiskAssessment: React.FC<{ assessment?: PaymentRiskAssessment }> = ({ assessment }) => {
  if (!assessment) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">风险评估</h3>
        <p className="text-gray-500">暂无风险评估数据</p>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return '低风险';
      case 'medium': return '中风险';
      case 'high': return '高风险';
      default: return '未知';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">风险评估</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">风险等级</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(assessment.risk_level)}`}>
            {getRiskLabel(assessment.risk_level)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">风险分数</span>
          <span className="text-sm text-gray-900">{assessment.risk_score}/100</span>
        </div>
        {assessment.risk_factors && assessment.risk_factors.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700 block mb-2">风险因素</span>
            <ul className="space-y-1">
              {assessment.risk_factors.map((factor, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-2 text-yellow-500" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// 操作日志组件
const ActivityLog: React.FC<{ paymentId: string }> = ({ paymentId }) => {
  const mockLogs = [
    {
      id: '1',
      action: '创建支付',
      user: '系统',
      timestamp: '2024-01-15T10:00:00Z',
      details: '用户发起支付请求'
    },
    {
      id: '2',
      action: '支付处理',
      user: '支付网关',
      timestamp: '2024-01-15T10:01:00Z',
      details: '支付宝网关处理中'
    },
    {
      id: '3',
      action: '支付完成',
      user: '支付网关',
      timestamp: '2024-01-15T10:02:00Z',
      details: '支付成功完成'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">操作日志</h3>
      <div className="space-y-3">
        {mockLogs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <Activity className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{log.details}</p>
              <p className="text-xs text-gray-500 mt-1">操作人: {log.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    payments, 
    fetchPayments,
    updatePaymentStatus,
    processRefundRequest,
    logPaymentAudit
  } = useStore();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    const loadPayment = async () => {
      if (!id) return;
      
      setLoading(true);
      await fetchPayments();
      const foundPayment = payments.find(p => p.id === id);
      setPayment(foundPayment || null);
      setLoading(false);
    };

    loadPayment();
  }, [id, fetchPayments]);

  const handleStatusUpdate = async (newStatus: Payment['status']) => {
    if (!payment) return;

    setProcessing(true);
    try {
      const success = await updatePaymentStatus(payment.id, newStatus);
      if (success) {
        setPayment(prev => prev ? { ...prev, status: newStatus } : null);
        await logPaymentAudit({
          payment_id: payment.id,
          action: `status_update_${newStatus}`,
          user_id: 'admin_001',
          user_name: '管理员',
          details: `支付状态更新为: ${newStatus}`,
          ip_address: '127.0.0.1',
          user_agent: navigator.userAgent
        });
      }
    } catch (error) {
      console.error('更新支付状态失败:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRefund = async () => {
    if (!payment || !refundAmount) return;

    setProcessing(true);
    try {
      const success = await processRefundRequest(payment.id, 'approve', {
        approved_amount: parseFloat(refundAmount),
        internal_notes: refundReason
      });
      
      if (success) {
        setPayment(prev => prev ? { ...prev, status: 'refunded' } : null);
        setShowRefundModal(false);
        setRefundAmount('');
        setRefundReason('');
      }
    } catch (error) {
      console.error('退款处理失败:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => `¥${price.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: Payment['status']) => {
    const texts = {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      failed: '失败',
      cancelled: '已取消',
      refunded: '已退款'
    };
    return texts[status] || status;
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

  if (!payment) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">支付记录不存在</h3>
          <p className="text-gray-500 mb-4">未找到指定的支付记录</p>
          <button
            onClick={() => navigate('/admin/payments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回支付列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/payments')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">支付详情</h1>
              <p className="mt-2 text-gray-600">支付ID: #{payment.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {getStatusText(payment.status)}
            </span>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="打印"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="导出"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧主要信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">支付ID</label>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-900">#{payment.id}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(payment.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      title="复制"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">交易ID</label>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-900">{payment.transaction_id}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(payment.transaction_id)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      title="复制"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">订单ID</label>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-900">#{payment.order_id}</p>
                    <button
                      onClick={() => navigate(`/admin/orders/${payment.order_id}`)}
                      className="ml-2 p-1 text-blue-600 hover:text-blue-800"
                      title="查看订单"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">客户ID</label>
                  <p className="mt-1 text-sm text-gray-900">#{payment.customer_id}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">支付金额</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(payment.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">手续费</label>
                  <p className="mt-1 text-sm text-gray-900">{formatPrice(payment.fee || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">支付方式</label>
                  <p className="mt-1 text-sm text-gray-900">{payment.method}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">创建时间</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(payment.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 支付操作 */}
          {payment.status !== 'completed' && payment.status !== 'refunded' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">支付操作</h3>
              <div className="flex flex-wrap gap-3">
                {payment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('processing')}
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processing ? '处理中...' : '确认支付'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('failed')}
                      disabled={processing}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      标记失败
                    </button>
                  </>
                )}
                {payment.status === 'processing' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={processing}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing ? '处理中...' : '完成支付'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('failed')}
                      disabled={processing}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      标记失败
                    </button>
                  </>
                )}
                {payment.status === 'completed' && (
                  <button
                    onClick={() => setShowRefundModal(true)}
                    disabled={processing}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    申请退款
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 状态时间线 */}
          <StatusTimeline payment={payment} />

          {/* 操作日志 */}
          <ActivityLog paymentId={payment.id} />
        </div>

        {/* 右侧辅助信息 */}
        <div className="space-y-6">
          {/* 风险评估 */}
          <RiskAssessment />

          {/* 支付凭证 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">支付凭证</h3>
            {payment.receipt_url ? (
              <div className="space-y-3">
                <a
                  href={payment.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">支付凭证</p>
                    <p className="text-xs text-gray-500">点击查看详情</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">暂无支付凭证</p>
            )}
          </div>

          {/* 相关信息 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">相关信息</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">网关响应码</span>
                <span className="text-sm font-medium text-gray-900">{payment.gateway_response_code || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">网关消息</span>
                <span className="text-sm font-medium text-gray-900">{payment.gateway_message || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IP地址</span>
                <span className="text-sm font-medium text-gray-900">{payment.ip_address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 退款模态框 */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">申请退款</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">退款金额</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  max={payment.amount}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`最大金额: ${formatPrice(payment.amount)}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">退款原因</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入退款原因..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleRefund}
                disabled={processing || !refundAmount}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {processing ? '处理中...' : '确认退款'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;