import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  Search,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Filter,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Phone,
  User
} from 'lucide-react';

interface TrackingFilters {
  tracking_number: string;
  carrier_code: string;
  status: string;
  date_range: string;
  exception_only: boolean;
}

const LogisticsTracking: React.FC = () => {
  const {
    logisticsTracking,
    trackingEvents,
    trackingLoading,
    logisticsProviders,
    shippingStats,
    fetchLogisticsTracking,
    fetchTrackingEvents,
    updateTrackingEvents,
    fetchLogisticsProviders,
    fetchShippingStats
  } = useStore();

  const [filters, setFilters] = useState<TrackingFilters>({
    tracking_number: '',
    carrier_code: '',
    status: '',
    date_range: '',
    exception_only: false
  });

  const [selectedTracking, setSelectedTracking] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogisticsProviders();
    fetchShippingStats();
    handleSearch();
  }, []);

  const handleSearch = async () => {
    if (!filters.tracking_number.trim()) return;
    
    setRefreshing(true);
    try {
      await fetchLogisticsTracking(filters.tracking_number, filters.carrier_code);
      if (filters.tracking_number) {
        await fetchTrackingEvents(filters.tracking_number);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async (trackingNumber: string) => {
    setRefreshing(true);
    try {
      await updateTrackingEvents(trackingNumber);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'picked_up':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'exception':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待揽收',
      picked_up: '已揽收',
      in_transit: '运输中',
      out_for_delivery: '派送中',
      delivered: '已签收',
      exception: '异常',
      returned: '已退回'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      exception: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getCarrierName = (code: string) => {
    const provider = logisticsProviders.find(p => p.code === code);
    return provider?.name || code;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">物流跟踪</h1>
          <p className="text-gray-600">实时查询物流信息和配送状态</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总包裹数</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingStats?.total_packages || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">运输中</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingStats?.in_transit || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已送达</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingStats?.delivered || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">异常包裹</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingStats?.exceptions || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.tracking_number}
                onChange={(e) => setFilters(prev => ({ ...prev, tracking_number: e.target.value }))}
                placeholder="请输入运单号进行查询..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <select
            value={filters.carrier_code}
            onChange={(e) => setFilters(prev => ({ ...prev, carrier_code: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有物流公司</option>
            {logisticsProviders.map(provider => (
              <option key={provider.code} value={provider.code}>
                {provider.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={!filters.tracking_number.trim() || refreshing}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {refreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            查询
          </button>
        </div>

        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有状态</option>
                <option value="pending">待揽收</option>
                <option value="picked_up">已揽收</option>
                <option value="in_transit">运输中</option>
                <option value="out_for_delivery">派送中</option>
                <option value="delivered">已签收</option>
                <option value="exception">异常</option>
              </select>

              <input
                type="date"
                value={filters.date_range}
                onChange={(e) => setFilters(prev => ({ ...prev, date_range: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.exception_only}
                  onChange={(e) => setFilters(prev => ({ ...prev, exception_only: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">仅显示异常</span>
              </label>

              <button
                onClick={() => setFilters({
                  tracking_number: '',
                  carrier_code: '',
                  status: '',
                  date_range: '',
                  exception_only: false
                })}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                重置筛选
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 物流跟踪结果 */}
      {logisticsTracking && (
        <div className="bg-white rounded-lg shadow">
          {/* 基本信息 */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    运单号: {logisticsTracking.tracking_number}
                  </h3>
                  <p className="text-gray-600">
                    {getCarrierName(logisticsTracking.carrier_code)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(logisticsTracking.status)}`}>
                  {getStatusText(logisticsTracking.status)}
                </span>
                <button
                  onClick={() => handleRefresh(logisticsTracking.tracking_number)}
                  disabled={refreshing}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  刷新
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">收货人</p>
                  <p className="font-medium">{logisticsTracking.recipient_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">联系电话</p>
                  <p className="font-medium">{logisticsTracking.recipient_phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">收货地址</p>
                  <p className="font-medium">{logisticsTracking.recipient_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 物流轨迹 */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">物流轨迹</h4>
            {trackingLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">加载中...</span>
              </div>
            ) : trackingEvents.length > 0 ? (
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${
                        index === 0 ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(event.status)}
                      </div>
                      {index < trackingEvents.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{event.description}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDateTime(event.timestamp)}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.operator && (
                        <p className="text-sm text-gray-500 mt-1">
                          操作员: {event.operator}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无物流轨迹信息</p>
              </div>
            )}
          </div>

          {/* 异常处理 */}
          {logisticsTracking.status === 'exception' && (
            <div className="p-6 border-t bg-red-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-900">配送异常</h5>
                  <p className="text-red-700 mt-1">
                    该包裹在配送过程中出现异常，请及时联系物流公司或收货人处理。
                  </p>
                  <div className="mt-3 space-x-3">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      联系物流公司
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                      标记已处理
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 空状态 */}
      {!logisticsTracking && !trackingLoading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">开始物流跟踪</h3>
          <p className="text-gray-600 mb-6">
            请输入运单号查询物流信息和配送状态
          </p>
        </div>
      )}
    </div>
  );
};

export default LogisticsTracking;