import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { 
  ArrowLeft,
  Save,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ShippingFormData {
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  carrier_code: string;
  carrier_name: string;
  tracking_number: string;
  status: string;
  weight: number;
  package_count: number;
  shipping_fee: number;
  estimated_delivery: string;
  notes: string;
}

const ShippingEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedShipping,
    logisticsProviders,
    fetchShippingDetail,
    fetchLogisticsProviders,
    updateShipping,
    createShipping
  } = useStore();

  const [formData, setFormData] = useState<ShippingFormData>({
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    carrier_code: '',
    carrier_name: '',
    tracking_number: '',
    status: 'pending',
    weight: 0,
    package_count: 1,
    shipping_fee: 0,
    estimated_delivery: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    fetchLogisticsProviders();
    if (isEditMode && id) {
      setIsLoading(true);
      fetchShippingDetail(id).finally(() => setIsLoading(false));
    }
  }, [id, isEditMode, fetchShippingDetail, fetchLogisticsProviders]);

  useEffect(() => {
    if (selectedShipping && isEditMode) {
      setFormData({
        recipient_name: selectedShipping.recipient_name,
        recipient_phone: selectedShipping.recipient_phone,
        recipient_address: selectedShipping.recipient_address,
        carrier_code: selectedShipping.carrier_code,
        carrier_name: selectedShipping.carrier_name,
        tracking_number: selectedShipping.tracking_number,
        status: selectedShipping.status,
        weight: selectedShipping.weight,
        package_count: selectedShipping.package_count,
        shipping_fee: selectedShipping.shipping_fee,
        estimated_delivery: selectedShipping.estimated_delivery ? 
          new Date(selectedShipping.estimated_delivery).toISOString().slice(0, 16) : '',
        notes: selectedShipping.notes || ''
      });
    }
  }, [selectedShipping, isEditMode]);

  const handleInputChange = (field: keyof ShippingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCarrierChange = (carrierCode: string) => {
    const carrier = logisticsProviders.find(p => p.code === carrierCode);
    setFormData(prev => ({
      ...prev,
      carrier_code: carrierCode,
      carrier_name: carrier?.name || ''
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = '收货人姓名不能为空';
    }

    if (!formData.recipient_phone.trim()) {
      newErrors.recipient_phone = '收货人电话不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(formData.recipient_phone)) {
      newErrors.recipient_phone = '请输入有效的手机号码';
    }

    if (!formData.recipient_address.trim()) {
      newErrors.recipient_address = '收货地址不能为空';
    }

    if (!formData.carrier_code) {
      newErrors.carrier_code = '请选择物流公司';
    }

    if (!formData.tracking_number.trim()) {
      newErrors.tracking_number = '运单号不能为空';
    }

    if (formData.weight <= 0) {
      newErrors.weight = '重量必须大于0';
    }

    if (formData.package_count <= 0) {
      newErrors.package_count = '包裹数量必须大于0';
    }

    if (formData.shipping_fee < 0) {
      newErrors.shipping_fee = '运费不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        estimated_delivery: formData.estimated_delivery ? 
          new Date(formData.estimated_delivery).toISOString() : undefined
      };

      if (isEditMode && id) {
        await updateShipping(id, submitData);
      } else {
        await createShipping({
          ...submitData,
          order_id: '1', // 这里应该从实际订单中获取
          order_number: 'ORD' + Date.now() // 这里应该从实际订单中获取
        });
      }

      navigate('/admin/shipping');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusOptions = () => [
    { value: 'pending', label: '待发货', color: 'text-yellow-600' },
    { value: 'shipped', label: '已发货', color: 'text-blue-600' },
    { value: 'in_transit', label: '配送中', color: 'text-purple-600' },
    { value: 'delivered', label: '已送达', color: 'text-green-600' },
    { value: 'exception', label: '异常', color: 'text-red-600' }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? '编辑发货' : '新建发货'}
            </h1>
            {isEditMode && selectedShipping && (
              <p className="text-gray-600">订单号: {selectedShipping.order_number}</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 收货人信息 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">收货人信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                收货人姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.recipient_name}
                onChange={(e) => handleInputChange('recipient_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.recipient_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入收货人姓名"
              />
              {errors.recipient_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.recipient_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.recipient_phone}
                onChange={(e) => handleInputChange('recipient_phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.recipient_phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入联系电话"
              />
              {errors.recipient_phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.recipient_phone}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                收货地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.recipient_address}
                onChange={(e) => handleInputChange('recipient_address', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.recipient_address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入详细的收货地址"
              />
              {errors.recipient_address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.recipient_address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 物流信息 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Truck className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">物流信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                物流公司 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.carrier_code}
                onChange={(e) => handleCarrierChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.carrier_code ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">请选择物流公司</option>
                {logisticsProviders.map(provider => (
                  <option key={provider.code} value={provider.code}>
                    {provider.name}
                  </option>
                ))}
              </select>
              {errors.carrier_code && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.carrier_code}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                运单号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tracking_number}
                onChange={(e) => handleInputChange('tracking_number', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.tracking_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入运单号"
              />
              {errors.tracking_number && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.tracking_number}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发货状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {getStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预计送达时间
              </label>
              <input
                type="datetime-local"
                value={formData.estimated_delivery}
                onChange={(e) => handleInputChange('estimated_delivery', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 包裹信息 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Package className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">包裹信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                重量 (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.weight ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.0"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.weight}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                包裹数量 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.package_count}
                onChange={(e) => handleInputChange('package_count', parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.package_count ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1"
              />
              {errors.package_count && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.package_count}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                运费 (¥)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.shipping_fee}
                onChange={(e) => handleInputChange('shipping_fee', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.shipping_fee ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.shipping_fee && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.shipping_fee}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 备注信息 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">备注信息</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              发货备注
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="请输入发货备注信息..."
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/shipping')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingEdit;