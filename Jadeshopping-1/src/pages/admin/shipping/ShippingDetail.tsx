import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { 
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  Clock,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Edit,
  Printer,
  Download,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const ShippingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedShipping,
    trackingEvents,
    trackingLoading,
    fetchShippingDetail,
    fetchTrackingHistory,
    updateShipping,
    generateShippingLabel,
    printShippingLabels
  } = useStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchShippingDetail(id);
      fetchTrackingHistory(id);
    }
  }, [id, fetchShippingDetail, fetchTrackingHistory]);

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;
    
    setIsUpdating(true);
    try {
      await updateShipping(id, { 
        status: newStatus,
        notes: statusNote ? `${selectedShipping?.notes || ''}\n${new Date().toLocaleString()}: ${statusNote}` : selectedShipping?.notes
      });
      setShowStatusModal(false);
      setNewStatus('');
      setStatusNote('');
      // 重新获取数据
      fetchShippingDetail(id);
      fetchTrackingHistory(id);
    } catch (error) {
      console.error('更新状态失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintLabel = async () => {
    if (!id) return;
    await printShippingLabels([id]);
  };

  const handleGenerateLabel = async () => {
    if (!id) return;
    await generateShippingLabel(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'exception': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待发货';
      case 'shipped': return '已发货';
      case 'in_transit': return '配送中';
      case 'delivered': return '已送达';
      case 'exception': return '异常';
      default: return '未知';
    }
  };

  const getTrackingStatusIcon = (status: string) => {
    switch (status) {
      case 'picked_up': return <Package className="w-4 h-4 text-blue-600" />;
      case 'in_transit': return <Truck className="w-4 h-4 text-purple-600" />;
      case 'out_for_delivery': return <MapPin className="w-4 h-4 text-orange-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'exception': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrackingStatusText = (status: string) => {
    switch (status) {
      case 'picked_up': return '已揽收';
      case 'in_transit': return '运输中';
      case 'out_for_delivery': return '派送中';
      case 'delivered': return '已签收';
      case 'exception': return '异常';
      default: return '处理中';
    }
  };

  if (!selectedShipping) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/shipping')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回列表
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">发货详情</h1>
            <p className="text-gray-600">订单号: {selectedShipping.order_number}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            更新状态
          </button>
          <button
            onClick={handlePrintLabel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            打印面单
          </button>
          <button
            onClick={() => navigate(`/admin/shipping/edit/${id}`)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 发货基本信息 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">发货信息</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedShipping.status)}`}>
                {getStatusText(selectedShipping.status)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">订单信息</label>
                  <div className="text-sm text-gray-900">
                    <div>订单号: {selectedShipping.order_number}</div>
                    <div>订单ID: {selectedShipping.order_id}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">物流信息</label>
                  <div className="text-sm text-gray-900">
                    <div>物流公司: {selectedShipping.carrier_name}</div>
                    <div>运单号: {selectedShipping.tracking_number}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">包裹信息</label>
                  <div className="text-sm text-gray-900">
                    <div>重量: {selectedShipping.weight}kg</div>
                    <div>包裹数: {selectedShipping.package_count}</div>
                    <div>运费: ¥{selectedShipping.shipping_fee}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时间信息</label>
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      发货时间: {new Date(selectedShipping.created_at).toLocaleString()}
                    </div>
                    {selectedShipping.estimated_delivery && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        预计送达: {new Date(selectedShipping.estimated_delivery).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                {selectedShipping.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedShipping.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 收货人信息 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">收货人信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">姓名:</span>
                  <span className="text-sm text-gray-900 ml-2">{selectedShipping.recipient_name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">电话:</span>
                  <span className="text-sm text-gray-900 ml-2">{selectedShipping.recipient_phone}</span>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">收货地址:</span>
                    <div className="text-sm text-gray-900 mt-1">{selectedShipping.recipient_address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 物流跟踪 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">物流跟踪</h2>
              <button
                onClick={() => fetchTrackingHistory(id!)}
                disabled={trackingLoading}
                className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${trackingLoading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
            
            {trackingLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : trackingEvents.length > 0 ? (
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                        {getTrackingStatusIcon(event.status)}
                      </div>
                      {index < trackingEvents.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mx-auto mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {getTrackingStatusText(event.status)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      {event.location && (
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </p>
                      )}
                      {event.operator && (
                        <p className="text-xs text-gray-500">操作员: {event.operator}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无物流跟踪信息</p>
              </div>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 快速操作 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerateLabel}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                生成面单
              </button>
              <button
                onClick={handlePrintLabel}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Printer className="w-4 h-4 mr-2" />
                打印面单
              </button>
              <button
                onClick={() => window.open(`/admin/shipping/tracking?number=${selectedShipping.tracking_number}`, '_blank')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                物流官网查询
              </button>
            </div>
          </div>

          {/* 相关订单信息 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">相关订单</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">订单号</span>
                  <span className="text-sm text-gray-900">{selectedShipping.order_number}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-gray-700">订单状态</span>
                  <span className="text-sm text-green-600">已支付</span>
                </div>
                <button
                  onClick={() => navigate(`/admin/orders/${selectedShipping.order_id}`)}
                  className="w-full mt-3 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  查看订单详情
                </button>
              </div>
            </div>
          </div>

          {/* 发货历史 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">发货历史</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>创建时间</span>
                  <span>{new Date(selectedShipping.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>最后更新</span>
                  <span>{new Date(selectedShipping.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 状态更新模态框 */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">更新发货状态</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新状态</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">选择状态</option>
                  <option value="pending">待发货</option>
                  <option value="shipped">已发货</option>
                  <option value="in_transit">配送中</option>
                  <option value="delivered">已送达</option>
                  <option value="exception">异常</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="添加状态更新备注..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? '更新中...' : '确认更新'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingDetail;