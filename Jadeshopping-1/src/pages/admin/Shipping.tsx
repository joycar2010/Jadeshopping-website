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
  MapPin,
  User,
  Phone,
  Calendar,
  MoreHorizontal,
  Download,
  Plus,
  Scan,
  FileText,
  Navigation
} from 'lucide-react';
import type { Shipping, ShippingFilters } from '@/types';

// 发货状态标签组件
interface StatusBadgeProps {
  status: Shipping['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { label: '待发货', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    preparing: { label: '备货中', color: 'bg-blue-100 text-blue-800', icon: Package },
    shipped: { label: '已发货', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    in_transit: { label: '运输中', color: 'bg-purple-100 text-purple-800', icon: Navigation },
    delivered: { label: '已送达', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    failed: { label: '配送失败', color: 'bg-red-100 text-red-800', icon: XCircle },
    returned: { label: '已退回', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
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

// 物流公司标签组件
interface CarrierBadgeProps {
  carrier: string;
}

const CarrierBadge: React.FC<CarrierBadgeProps> = ({ carrier }) => {
  const carrierConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    '顺丰速运': { color: 'bg-red-100 text-red-800', icon: <Truck className="w-3 h-3" /> },
    '圆通速递': { color: 'bg-blue-100 text-blue-800', icon: <Truck className="w-3 h-3" /> },
    '中通快递': { color: 'bg-green-100 text-green-800', icon: <Truck className="w-3 h-3" /> },
    '申通快递': { color: 'bg-yellow-100 text-yellow-800', icon: <Truck className="w-3 h-3" /> },
    '韵达速递': { color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-3 h-3" /> },
    '京东物流': { color: 'bg-indigo-100 text-indigo-800', icon: <Truck className="w-3 h-3" /> },
    '邮政EMS': { color: 'bg-gray-100 text-gray-800', icon: <Truck className="w-3 h-3" /> }
  };

  const config = carrierConfig[carrier] || { color: 'bg-gray-100 text-gray-800', icon: <Truck className="w-3 h-3" /> };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{carrier}</span>
    </span>
  );
};

// 发货记录表格行组件
interface ShippingRowProps {
  shipping: Shipping;
  onView: (shipping: Shipping) => void;
  onUpdateStatus: (shippingId: string, status: Shipping['status']) => void;
  onEdit: (shipping: Shipping) => void;
}

const ShippingRow: React.FC<ShippingRowProps> = ({ shipping, onView, onUpdateStatus, onEdit }) => {
  const [showActions, setShowActions] = useState(false);

  const getNextStatus = (currentStatus: Shipping['status']): Shipping['status'] | null => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'shipped',
      shipped: 'in_transit',
      in_transit: 'delivered'
    } as const;
    
    return statusFlow[currentStatus] || null;
  };

  const getNextStatusLabel = (currentStatus: Shipping['status']): string => {
    const labels = {
      pending: '开始备货',
      preparing: '标记已发货',
      shipped: '更新为运输中',
      in_transit: '标记已送达'
    } as const;
    
    return labels[currentStatus] || '';
  };

  const nextStatus = getNextStatus(shipping.status);
  const nextStatusLabel = getNextStatusLabel(shipping.status);

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{shipping.id}</div>
        <div className="text-sm text-gray-500">
          订单: #{shipping.orderId}
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
              {shipping.recipientName}
            </div>
            <div className="text-sm text-gray-500">
              {shipping.recipientPhone}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {shipping.recipientAddress?.province} {shipping.recipientAddress?.city}
        </div>
        <div className="text-xs text-gray-500">
          {shipping.recipientAddress?.district}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <CarrierBadge carrier={shipping.carrier} />
        {shipping.trackingNumber && (
          <div className="text-xs text-gray-500 mt-1 font-mono">
            {shipping.trackingNumber}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={shipping.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {shipping.createdAt ? new Date(shipping.createdAt).toLocaleDateString() : '-'}
        </div>
        {shipping.shippedAt && (
          <div className="text-xs text-gray-500">
            发货: {new Date(shipping.shippedAt).toLocaleDateString()}
          </div>
        )}
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
                    onView(shipping);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  查看详情
                </button>
                <button
                  onClick={() => {
                    onEdit(shipping);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑信息
                </button>
                {nextStatus && (
                  <button
                    onClick={() => {
                      onUpdateStatus(shipping.id, nextStatus);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {nextStatusLabel}
                  </button>
                )}
                {shipping.status === 'in_transit' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(shipping.id, 'failed');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    标记配送失败
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
  filters: ShippingFilters;
  onFiltersChange: (filters: ShippingFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  const statusOptions = [
    { value: 'pending', label: '待发货' },
    { value: 'preparing', label: '备货中' },
    { value: 'shipped', label: '已发货' },
    { value: 'in_transit', label: '运输中' },
    { value: 'delivered', label: '已送达' },
    { value: 'failed', label: '配送失败' },
    { value: 'returned', label: '已退回' }
  ];

  const carriers = ['顺丰速运', '圆通速递', '中通快递', '申通快递', '韵达速递', '京东物流', '邮政EMS'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">发货状态</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">物流公司</label>
          <select
            value={filters.carrier || ''}
            onChange={(e) => onFiltersChange({ ...filters, carrier: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">全部公司</option>
            {carriers.map(carrier => (
              <option key={carrier} value={carrier}>{carrier}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">收货地区</label>
          <input
            type="text"
            placeholder="省市区"
            value={filters.region || ''}
            onChange={(e) => onFiltersChange({ ...filters, region: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
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

// 发货详情模态框组件
interface ShippingDetailModalProps {
  shipping: Shipping | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShippingDetailModal: React.FC<ShippingDetailModalProps> = ({ shipping, isOpen, onClose }) => {
  if (!isOpen || !shipping) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                发货详情 #{shipping.id}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">基本信息</h4>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">发货ID:</span>
                      <span className="text-sm font-medium">#{shipping.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">订单ID:</span>
                      <span className="text-sm font-medium">#{shipping.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">物流公司:</span>
                      <CarrierBadge carrier={shipping.carrier} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">运单号:</span>
                      <span className="text-sm font-mono">{shipping.trackingNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">发货状态:</span>
                      <StatusBadge status={shipping.status} />
                    </div>
                  </div>
                </div>

                {/* 收货信息 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">收货信息</h4>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{shipping.recipientName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{shipping.recipientPhone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-sm">
                        {shipping.recipientAddress?.province} {shipping.recipientAddress?.city} {shipping.recipientAddress?.district}
                        <br />
                        {shipping.recipientAddress?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 时间轴 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">物流轨迹</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="space-y-3">
                    {shipping.trackingHistory && shipping.trackingHistory.length > 0 ? (
                      shipping.trackingHistory.map((track, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {track.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(track.timestamp).toLocaleString()}
                            </div>
                            {track.location && (
                              <div className="text-xs text-gray-500">
                                {track.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        暂无物流轨迹信息
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 时间信息 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">时间信息</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">创建时间:</span>
                    <span className="text-sm">{new Date(shipping.createdAt).toLocaleString()}</span>
                  </div>
                  {shipping.shippedAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">发货时间:</span>
                      <span className="text-sm">{new Date(shipping.shippedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {shipping.deliveredAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">送达时间:</span>
                      <span className="text-sm">{new Date(shipping.deliveredAt).toLocaleString()}</span>
                    </div>
                  )}
                  {shipping.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">预计送达:</span>
                      <span className="text-sm">{new Date(shipping.estimatedDelivery).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 备注信息 */}
            {shipping.notes && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">备注信息</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{shipping.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 编辑发货信息模态框组件
interface EditShippingModalProps {
  shipping: Shipping | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (shippingId: string, data: Partial<Shipping>) => void;
}

const EditShippingModal: React.FC<EditShippingModalProps> = ({ shipping, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Shipping>>({});

  useEffect(() => {
    if (shipping) {
      setFormData({
        carrier: shipping.carrier,
        trackingNumber: shipping.trackingNumber,
        notes: shipping.notes
      });
    }
  }, [shipping]);

  if (!isOpen || !shipping) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(shipping.id, formData);
    onClose();
  };

  const carriers = ['顺丰速运', '圆通速递', '中通快递', '申通快递', '韵达速递', '京东物流', '邮政EMS'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  编辑发货信息
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    物流公司
                  </label>
                  <select
                    value={formData.carrier || ''}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">请选择物流公司</option>
                    {carriers.map(carrier => (
                      <option key={carrier} value={carrier}>{carrier}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    运单号
                  </label>
                  <input
                    type="text"
                    value={formData.trackingNumber || ''}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="请输入运单号"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    备注信息
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="请输入备注信息"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                保存
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Shipping: React.FC = () => {
  const { 
    adminShippings, 
    fetchAdminShippings, 
    updateAdminShipping,
    adminShippingsLoading 
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ShippingFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null);
  const [showShippingDetail, setShowShippingDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAdminShippings();
  }, [fetchAdminShippings]);

  // 筛选和搜索发货记录
  const filteredShippings = adminShippings.filter(shipping => {
    const matchesSearch = shipping.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipping.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipping.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipping.recipientPhone.includes(searchTerm) ||
                         shipping.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || shipping.status === filters.status;
    const matchesCarrier = !filters.carrier || shipping.carrier === filters.carrier;
    const matchesRegion = !filters.region || 
                         shipping.recipientAddress?.province?.includes(filters.region) ||
                         shipping.recipientAddress?.city?.includes(filters.region) ||
                         shipping.recipientAddress?.district?.includes(filters.region);
    
    return matchesSearch && matchesStatus && matchesCarrier && matchesRegion;
  });

  // 排序发货记录
  const sortedShippings = [...filteredShippings].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedShippings.length / pageSize);
  const paginatedShippings = sortedShippings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewShipping = (shipping: Shipping) => {
    setSelectedShipping(shipping);
    setShowShippingDetail(true);
  };

  const handleEditShipping = (shipping: Shipping) => {
    setSelectedShipping(shipping);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async (shippingId: string, status: Shipping['status']) => {
    await updateAdminShipping(shippingId, { status });
  };

  const handleSaveShipping = async (shippingId: string, data: Partial<Shipping>) => {
    await updateAdminShipping(shippingId, data);
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
          <h1 className="text-2xl font-bold text-gray-900">发货管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            管理所有发货记录和物流跟踪
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Scan className="h-4 w-4 mr-2" />
            扫码发货
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            导出记录
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
              placeholder="搜索发货ID、订单ID、收货人或运单号..."
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
            <option value="createdAt-desc">最新发货</option>
            <option value="createdAt-asc">最早发货</option>
            <option value="status-asc">状态排序</option>
          </select>
        </div>
      </div>

      {/* 筛选面板 */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* 发货记录表格 */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发货信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收货人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收货地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  物流信息
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
              {adminShippingsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                      <span className="ml-2 text-gray-500">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedShippings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无发货记录</h3>
                    <p className="mt-1 text-sm text-gray-500">还没有任何发货记录。</p>
                  </td>
                </tr>
              ) : (
                paginatedShippings.map((shipping) => (
                  <ShippingRow
                    key={shipping.id}
                    shipping={shipping}
                    onView={handleViewShipping}
                    onUpdateStatus={handleUpdateStatus}
                    onEdit={handleEditShipping}
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
                  显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, sortedShippings.length)} 条，
                  共 {sortedShippings.length} 条记录
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

      {/* 发货详情模态框 */}
      <ShippingDetailModal
        shipping={selectedShipping}
        isOpen={showShippingDetail}
        onClose={() => {
          setShowShippingDetail(false);
          setSelectedShipping(null);
        }}
      />

      {/* 编辑发货信息模态框 */}
      <EditShippingModal
        shipping={selectedShipping}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedShipping(null);
        }}
        onSave={handleSaveShipping}
      />
    </div>
  );
};

export default Shipping;