import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Camera, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后查看个人信息</p>
            <Link to="/login" className="btn-primary">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  const menuItems = [
    { icon: Package, label: '我的订单', path: '/orders', count: 3 },
    { icon: Heart, label: '我的收藏', path: '/favorites', count: 8 },
    { icon: MapPin, label: '收货地址', path: '/address', count: 2 },
    { icon: Settings, label: '账户设置', path: '/settings', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧个人信息 */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              {/* 头像区域 */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              {/* 个人信息编辑 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">个人信息</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-primary-500 hover:text-primary-600"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        姓名
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        手机号
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 btn-primary"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 btn-secondary"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.phone || '未设置'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 退出登录 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  退出登录
                </button>
              </div>
            </div>
          </div>

          {/* 右侧功能菜单 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                        <item.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.label}
                        </h3>
                        {item.count > 0 && (
                          <p className="text-sm text-gray-600">
                            {item.count} 项
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 最近订单 */}
            <div className="mt-8">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">最近订单</h3>
                  <Link
                    to="/orders"
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    查看全部
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* 模拟订单数据 */}
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img
                        src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20jade%20bracelet%20white%20background%20product%20photo&image_size=square"
                        alt="商品"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-900">
                          和田白玉手镯 - 订单 #{order}001
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          2024-01-{10 + order} 下单
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm font-medium text-green-600">
                            已发货
                          </span>
                          <span className="text-lg font-bold text-red-500 ml-auto">
                            ¥{(1200 + order * 100).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm">
                    显示最近3个订单
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;