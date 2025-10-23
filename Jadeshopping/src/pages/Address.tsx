import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useAddressStore } from '../store/useAddressStore';
import { 
  Search, 
  Package, 
  User,
  Wallet,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  ShoppingCart,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Phone,
  Mail,
  Shield,
  Gift,
  Award,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface FormData {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
}

const Address: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  
  // 状态管理
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedNavItems, setExpandedNavItems] = useState<string[]>(['account']);

  // 检查用户登录状态
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 模拟地址数据
  const mockAddresses: Address[] = [
    {
      id: '1',
      name: '张三',
      phone: '138****8888',
      province: '北京市',
      city: '朝阳区',
      district: '建国门街道',
      detail: '建国路88号SOHO现代城A座1001室',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '139****9999',
      province: '上海市',
      city: '浦东新区',
      district: '陆家嘴街道',
      detail: '陆家嘴金融中心B座2002室',
      isDefault: false
    }
  ];

  useEffect(() => {
    setAddresses(mockAddresses);
  }, []);

  // 左侧导航配置 - 与Orders页面完全一致
  const navigationItems = [
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      items: [
        { id: 'profile', title: '个人资料', link: '/settings' },
        { id: 'address', title: '地址簿', link: '/address', active: true }
      ]
    },
    {
      id: 'assets',
      title: 'My Assets',
      icon: Wallet,
      items: [
        { id: 'coupons', title: '我的优惠券', link: '/settings' },
        { id: 'points', title: '我的积分', link: '/settings' },
        { id: 'wallet', title: '我的钱包', link: '/settings' },
        { id: 'gift-cards', title: '礼品卡', link: '/settings' }
      ]
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: Package,
      items: [
        { id: 'all-orders', title: '所有订单', link: '/orders' },
        { id: 'unpaid-orders', title: '待付款订单', link: '/orders?tab=unpaid' },
        { id: 'processing-orders', title: '处理中订单', link: '/orders?tab=processing' },
        { id: 'shipped-orders', title: '已发货订单', link: '/orders?tab=shipped' },
        { id: 'review-orders', title: '待评价订单', link: '/orders?tab=review' },
        { id: 'return-orders', title: '退货订单', link: '/orders?tab=return' }
      ]
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      icon: Heart,
      items: [
        { id: 'wishlist', title: '心愿单', link: '/favorites' },
        { id: 'recently-viewed', title: '最近浏览', link: '/settings' },
        { id: 'following', title: '关注', link: '/settings' }
      ]
    },
    {
      id: 'service',
      title: 'Customer Service',
      icon: HelpCircle,
      items: [
        { id: 'help-center', title: '帮助中心', link: '/help' },
        { id: 'contact-us', title: '联系我们', link: '/contact' },
        { id: 'live-chat', title: '在线客服', link: '/chat' }
      ]
    },
    {
      id: 'other',
      title: 'Other Services',
      icon: Gift,
      items: [

        { id: 'survey', title: '调查中心', link: '/settings' },
        { id: 'feedback', title: '意见反馈', link: '/settings' }
      ]
    },
    {
      id: 'policy',
      title: 'Policy',
      icon: Shield,
      items: [
        { id: 'shipping', title: '配送政策', link: '/policy/shipping' },
        { id: 'returns', title: '退货政策', link: '/policy/returns' },
        { id: 'privacy', title: '隐私政策', link: '/policy/privacy' },
        { id: 'terms', title: '服务条款', link: '/policy/terms' }
      ]
    }
  ];

  // 省份数据
  const provinces = [
    '北京市', '天津市', '上海市', '重庆市',
    '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
    '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
    '河南省', '湖北省', '湖南省', '广东省', '海南省',
    '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省',
    '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
    '香港特别行政区', '澳门特别行政区', '台湾省'
  ];

  // 导航项展开/折叠
  const toggleNavItem = (itemId: string) => {
    setExpandedNavItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 退出登录
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: FormErrors = {};

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

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const addressData = {
      ...formData,
      id: editingAddress ? editingAddress.id : Date.now().toString()
    };

    if (editingAddress) {
      // 更新地址
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? addressData : addr
      ));
      toast.success('地址更新成功');
    } else {
      // 添加新地址
      setAddresses(prev => [...prev, addressData]);
      toast.success('地址添加成功');
    }

    resetForm();
  };

  // 重置表单
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

  // 编辑地址
  const handleEdit = (address: Address) => {
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

  // 删除地址
  const handleDelete = (addressId: string) => {
    if (confirm('确定要删除这个地址吗？')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast.success('地址删除成功');
    }
  };

  // 设为默认地址
  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    toast.success('默认地址设置成功');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 页头 Header - 与Orders页面完全一致 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex">
        {/* 左侧导航栏 - 与Orders页面完全一致 */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {!sidebarCollapsed && (
            <nav className="px-4 pb-4">
              <div className="space-y-2">
                {navigationItems.map((section) => {
                  const SectionIcon = section.icon;
                  const isExpanded = expandedNavItems.includes(section.id);
                  
                  return (
                    <div key={section.id} className="space-y-1">
                      <button
                        onClick={() => toggleNavItem(section.id)}
                        className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <SectionIcon className="h-5 w-5" />
                          <span className="font-medium">{section.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-8 space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.id}
                              to={item.link}
                              className={`block p-2 text-sm rounded-lg transition-colors ${
                                item.active 
                                  ? 'bg-black text-white' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* 退出登录 */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          )}
        </aside>

        {/* 右侧主内容区 - SHEIN风格的"我的地址簿" */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* 页面标题 - SHEIN风格 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">MY ADDRESS BOOK</h1>
              <p className="text-gray-600 text-center">管理您的收货地址</p>
            </div>

            {/* 添加新地址按钮 - SHEIN风格核心操作 */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                + ADD NEW ADDRESS
              </button>
            </div>

            {/* 地址表单 */}
            {showAddForm && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {editingAddress ? '编辑地址' : '新增地址'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        收货人姓名 *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入收货人姓名"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        手机号码 *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入手机号码"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        省份 *
                      </label>
                      <select
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.province ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">请选择省份</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        城市 *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入城市"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        区县 *
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                          errors.district ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="请输入区县"
                      />
                      {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细地址 *
                    </label>
                    <textarea
                      value={formData.detail}
                      onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.detail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="请输入详细地址，如街道、门牌号、楼层等"
                    />
                    {errors.detail && <p className="text-red-500 text-sm mt-1">{errors.detail}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                      设为默认地址
                    </label>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {editingAddress ? '更新地址' : '保存地址'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 地址列表 - SHEIN风格卡片布局 */}
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">暂无收货地址</h3>
                  <p className="text-gray-500 mb-6">添加您的第一个收货地址</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    添加地址
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                          <span className="text-gray-600">{address.phone}</span>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 bg-black text-white text-xs rounded-full">
                              <Check className="h-3 w-3 mr-1" />
                              默认
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">
                          {address.province} {address.city} {address.district}
                        </p>
                        <p className="text-gray-600">{address.detail}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            设为默认
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Address;