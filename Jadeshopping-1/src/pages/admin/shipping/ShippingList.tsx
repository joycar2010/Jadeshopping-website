import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Printer,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';

const ShippingList: React.FC = () => {
  const {
    shippings,
    shippingsLoading,
    shippingStats,
    shippingStatsLoading,
    shippingFilters,
    fetchShippings,
    fetchShippingStats,
    setShippingFilters,
    resetShippingFilters,
    deleteShipping,
    exportShippingData,
    printShippingLabels
  } = useStore();

  const [selectedShippings, setSelectedShippings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchShippings(shippingFilters);
    fetchShippingStats();
  }, [fetchShippings, fetchShippingStats, shippingFilters]);

  const handleSearch = (value: string) => {
    setShippingFilters({ ...shippingFilters, search: value, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    setShippingFilters({ ...shippingFilters, [key]: value, page: 1 });
  };

  const handleSort = (sortBy: string) => {
    const sortOrder = shippingFilters.sort_by === sortBy && shippingFilters.sort_order === 'asc' ? 'desc' : 'asc';
    setShippingFilters({ ...shippingFilters, sort_by: sortBy, sort_order: sortOrder });
  };

  const handleSelectShipping = (shippingId: string) => {
    setSelectedShippings(prev => 
      prev.includes(shippingId) 
        ? prev.filter(id => id !== shippingId)
        : [...prev, shippingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedShippings.length === shippings.length) {
      setSelectedShippings([]);
    } else {
      setSelectedShippings(shippings.map(s => s.id));
    }
  };

  const handleBatchPrint = async () => {
    if (selectedShippings.length === 0) return;
    await printShippingLabels(selectedShippings);
    setSelectedShippings([]);
  };

  const handleBatchExport = async () => {
    if (selectedShippings.length === 0) return;
    await exportShippingData({ ...shippingFilters, ids: selectedShippings });
  };

  const handleDelete = async (shippingId: string) => {
    if (window.confirm('确定要删除这条发货记录吗？')) {
      await deleteShipping(shippingId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'exception': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">发货管理</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
          <button
            onClick={handleBatchExport}
            disabled={selectedShippings.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            导出
          </button>
          <button
            onClick={handleBatchPrint}
            disabled={selectedShippings.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Printer className="w-4 h-4 mr-2" />
            打印面单
          </button>
        </div>
      </div>

      {/* 统计面板 */}
      {shippingStatsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : shippingStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总发货数</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.total_shippings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">待发货</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.pending_shippings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">配送中</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.shipped_count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已送达</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.delivered_count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">异常</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.exception_count}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索订单号、收货人、运单号..."
              value={shippingFilters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 高级筛选 */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <select
                value={shippingFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部状态</option>
                <option value="pending">待发货</option>
                <option value="shipped">已发货</option>
                <option value="in_transit">配送中</option>
                <option value="delivered">已送达</option>
                <option value="exception">异常</option>
              </select>

              <select
                value={shippingFilters.carrier}
                onChange={(e) => handleFilterChange('carrier', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部物流</option>
                <option value="SF">顺丰速运</option>
                <option value="YTO">圆通速递</option>
                <option value="ZTO">中通快递</option>
                <option value="STO">申通快递</option>
              </select>

              <input
                type="date"
                value={shippingFilters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={shippingFilters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={resetShippingFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  重置筛选
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 发货列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedShippings.length === shippings.length && shippings.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('order_number')}
                >
                  订单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收货人信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  物流信息
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  状态
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  发货时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shippingsLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : shippings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    暂无发货记录
                  </td>
                </tr>
              ) : (
                shippings.map((shipping) => (
                  <tr key={shipping.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedShippings.includes(shipping.id)}
                        onChange={() => handleSelectShipping(shipping.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {shipping.order_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          订单ID: {shipping.order_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <span className="mr-2">{shipping.recipient_name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {shipping.recipient_phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {shipping.recipient_address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {shipping.carrier_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipping.tracking_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          重量: {shipping.weight}kg
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipping.status)}`}>
                        {getStatusText(shipping.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(shipping.created_at).toLocaleDateString()}
                      </div>
                      {shipping.estimated_delivery && (
                        <div className="text-xs text-gray-400">
                          预计: {new Date(shipping.estimated_delivery).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.location.href = `/admin/shipping/${shipping.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/shipping/edit/${shipping.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shipping.id)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {shippings.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={shippingFilters.page === 1}
                onClick={() => setShippingFilters({ ...shippingFilters, page: shippingFilters.page - 1 })}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                上一页
              </button>
              <button
                onClick={() => setShippingFilters({ ...shippingFilters, page: shippingFilters.page + 1 })}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{(shippingFilters.page - 1) * shippingFilters.limit + 1}</span> 到{' '}
                  <span className="font-medium">
                    {Math.min(shippingFilters.page * shippingFilters.limit, shippings.length)}
                  </span>{' '}
                  条记录
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    disabled={shippingFilters.page === 1}
                    onClick={() => setShippingFilters({ ...shippingFilters, page: shippingFilters.page - 1 })}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setShippingFilters({ ...shippingFilters, page: shippingFilters.page + 1 })}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
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

export default ShippingList;