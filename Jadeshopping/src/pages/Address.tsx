import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useAddressStore } from '../store/useAddressStore';
import { Address as AddressType } from '../types';

const Address: React.FC = () => {
  const { user } = useUserStore();
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddressStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后管理收货地址</p>
            <button className="btn-primary">
              去登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入收货人姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码';
    }

    if (!formData.province.trim()) {
      newErrors.province = '请选择省份';
    }

    if (!formData.city.trim()) {
      newErrors.city = '请选择城市';
    }

    if (!formData.district.trim()) {
      newErrors.district = '请选择区县';
    }

    if (!formData.detail.trim()) {
      newErrors.detail = '请输入详细地址';
    } else if (formData.detail.length < 5) {
      newErrors.detail = '详细地址至少5个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const addressData = {
      ...formData,
      userId: user.id
    };

    if (editingAddress) {
      updateAddress(editingAddress.id, addressData);
    } else {
      addAddress(addressData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    });
    setErrors({});
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: AddressType) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = (addressId: string) => {
    if (confirm('确定要删除这个地址吗？')) {
      removeAddress(addressId);
    }
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
  };

  const provinces = [
    '北京市', '天津市', '上海市', '重庆市',
    '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
    '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
    '河南省', '湖北省', '湖南省', '广东省', '海南省',
    '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省',
    '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
    '香港特别行政区', '澳门特别行政区', '台湾省'
  ];

  const AddressForm = () => (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {editingAddress ? '编辑地址' : '新增地址'}
        </h3>
        <button
          onClick={resetForm}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              收货人姓名 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="请输入收货人姓名"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              手机号码 *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="请输入手机号码"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              省份 *
            </label>
            <select
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value, city: '', district: '' })}
              className={`input-field ${errors.province ? 'border-red-500' : ''}`}
            >
              <option value="">请选择省份</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-sm mt-1">{errors.province}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              城市 *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`input-field ${errors.city ? 'border-red-500' : ''}`}
              placeholder="请输入城市"
              disabled={!formData.province}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              区县 *
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className={`input-field ${errors.district ? 'border-red-500' : ''}`}
              placeholder="请输入区县"
              disabled={!formData.city}
            />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">{errors.district}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            详细地址 *
          </label>
          <textarea
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
            className={`input-field ${errors.detail ? 'border-red-500' : ''}`}
            placeholder="请输入详细地址，如街道、门牌号等"
            rows={3}
          />
          {errors.detail && (
            <p className="text-red-500 text-sm mt-1">{errors.detail}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
            设为默认地址
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            {editingAddress ? '保存修改' : '添加地址'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary flex-1"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">收货地址</h1>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span>新增地址</span>
            </button>
          )}
        </div>

        {/* 地址表单 */}
        {showAddForm && <AddressForm />}

        {/* 地址列表 */}
        <div className="space-y-4 mt-6">
          {addresses.length === 0 ? (
            <div className="card p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无收货地址</h3>
              <p className="text-gray-500 mb-6">添加收货地址，让购物更便捷</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                添加地址
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{address.name}</h3>
                      <span className="text-gray-600">{address.phone}</span>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full">
                          默认
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">
                      {address.province} {address.city} {address.district} {address.detail}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>设为默认</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 地址管理提示 */}
        {addresses.length > 0 && (
          <div className="card p-4 mt-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">地址管理提示：</p>
                <ul className="space-y-1 text-blue-600">
                  <li>• 您最多可以添加 10 个收货地址</li>
                  <li>• 默认地址将在下单时自动选中</li>
                  <li>• 请确保地址信息准确，以免影响收货</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;