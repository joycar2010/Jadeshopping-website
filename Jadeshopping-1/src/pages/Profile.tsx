import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import type { ProfileUpdateForm, PasswordChangeForm } from '@/types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    user, 
    isAuthenticated, 
    updateProfile, 
    changePassword, 
    logout, 
    authLoading, 
    authError,
    clearAuthError,
    favorites,
    cart,
    getUserBalance,
    addBalance,
    deductBalance,
    orders,
    ordersLoading,
    fetchOrders
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'orders' | 'favorites' | 'balance'>('profile');
  
  const [profileForm, setProfileForm] = useState<ProfileUpdateForm>({
    full_name: user?.full_name || '',
    username: user?.username || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 余额管理相关状态
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [balanceLoading, setBalanceLoading] = useState(false);

  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 清除错误信息
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  // 根据URL参数设置活动标签页
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'password', 'orders', 'favorites', 'balance'].includes(tab)) {
      setActiveTab(tab as 'profile' | 'password' | 'orders' | 'favorites' | 'balance');
    }
  }, [searchParams]);

  // 更新表单数据当用户信息变化时
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        username: user.username || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // 获取用户订单数据
  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab, fetchOrders]);

  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileForm.full_name) {
      newErrors.full_name = '请输入姓名';
    } else if (profileForm.full_name.length < 2) {
      newErrors.full_name = '姓名至少2个字符';
    }

    if (profileForm.username && profileForm.username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    }

    if (profileForm.phone && !/^1[3-9]\d{9}$/.test(profileForm.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.current_password) {
      newErrors.current_password = '请输入当前密码';
    }

    if (!passwordForm.new_password) {
      newErrors.new_password = '请输入新密码';
    } else if (passwordForm.new_password.length < 6) {
      newErrors.new_password = '密码长度至少6位';
    }

    if (!passwordForm.confirm_password) {
      newErrors.confirm_password = '请确认新密码';
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    await updateProfile(profileForm);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    const success = await changePassword(passwordForm);
    if (success) {
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // 充值处理
  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      setErrors(prev => ({ ...prev, recharge: '请输入有效的充值金额' }));
      return;
    }
    if (amount > 100000) {
      setErrors(prev => ({ ...prev, recharge: '单次充值金额不能超过10万元' }));
      return;
    }

    setBalanceLoading(true);
    try {
      // 模拟充值API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 调用store的addBalance方法更新余额
      const success = addBalance(amount);
      if (!success) {
        setErrors(prev => ({ ...prev, recharge: '充值失败，请重试' }));
        return;
      }
      
      setShowRechargeModal(false);
      setRechargeAmount('');
      setErrors(prev => ({ ...prev, recharge: '' }));
      alert(`充值成功！已充值 ¥${amount.toLocaleString()}`);
    } catch (error) {
      setErrors(prev => ({ ...prev, recharge: '充值失败，请重试' }));
    } finally {
      setBalanceLoading(false);
    }
  };

  // 提现处理
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const currentBalance = getUserBalance();
    
    if (!amount || amount <= 0) {
      setErrors(prev => ({ ...prev, withdraw: '请输入有效的提现金额' }));
      return;
    }
    if (amount > currentBalance) {
      setErrors(prev => ({ ...prev, withdraw: '提现金额不能超过账户余额' }));
      return;
    }
    if (amount < 10) {
      setErrors(prev => ({ ...prev, withdraw: '最低提现金额为10元' }));
      return;
    }

    setBalanceLoading(true);
    try {
      // 模拟提现API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 扣除余额
      const success = deductBalance(amount);
      if (!success) {
        setErrors(prev => ({ ...prev, withdraw: '提现失败，余额不足' }));
        return;
      }
      
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setErrors(prev => ({ ...prev, withdraw: '' }));
      alert(`提现申请已提交！提现金额 ¥${amount.toLocaleString()}，预计1-3个工作日到账`);
    } catch (error) {
      setErrors(prev => ({ ...prev, withdraw: '提现失败，请重试' }));
    } finally {
      setBalanceLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: '个人信息', icon: '👤' },
    { id: 'password', label: '修改密码', icon: '🔒' },
    { id: 'orders', label: '订单历史', icon: '📦' },
    { id: 'favorites', label: '我的收藏', icon: '❤️' },
    { id: 'balance', label: '账户余额', icon: '💰' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 用户信息头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-emerald-600">👤</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.username && (
                <p className="text-sm text-gray-500">@{user.username}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏导航 */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">个人信息</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                        姓名 *
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={profileForm.full_name}
                        onChange={handleProfileInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.full_name ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                      />
                      {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        用户名
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={profileForm.username}
                        onChange={handleProfileInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.username ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        手机号码
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={handleProfileInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱地址
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">邮箱地址不可修改</p>
                    </div>

                    {authError && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-red-400">⚠️</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              更新失败
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{authError.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {authLoading ? '更新中...' : '保存更改'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">修改密码</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        当前密码 *
                      </label>
                      <input
                        id="current_password"
                        name="current_password"
                        type="password"
                        required
                        value={passwordForm.current_password}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.current_password ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                      />
                      {errors.current_password && (
                        <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                        新密码 *
                      </label>
                      <input
                        id="new_password"
                        name="new_password"
                        type="password"
                        required
                        value={passwordForm.new_password}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.new_password ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                      />
                      {errors.new_password && (
                        <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                        确认新密码 *
                      </label>
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        required
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                      />
                      {errors.confirm_password && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                      )}
                    </div>

                    {authError && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-red-400">⚠️</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              密码修改失败
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{authError.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {authLoading ? '修改中...' : '修改密码'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">订单历史</h2>
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">⏳</div>
                      <p className="text-gray-500">加载订单数据中...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 mb-4">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">订单号：</span>
                              <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status === 'delivered' ? '已送达' :
                                 order.status === 'processing' ? '处理中' :
                                 order.status === 'shipped' ? '已发货' : '未知状态'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>下单时间：{new Date(order.created_at).toLocaleDateString('zh-CN')}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <img
                                  src={item.product.images?.[0] || '/images/placeholder.svg'}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                  <p className="text-sm text-gray-500">数量：{item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">¥{(item.unit_price * item.quantity).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                总计：¥{order.total_amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
                      <p className="text-gray-500 mb-6">您还没有任何订单记录</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        去购物
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">我的收藏</h2>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <img
                            src={product.images?.[0] || '/images/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-emerald-600 font-semibold">¥{product.price}</p>
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="mt-2 w-full px-3 py-1 text-sm bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
                          >
                            查看详情
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏</h3>
                      <p className="text-gray-500 mb-6">您还没有收藏任何商品</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        去逛逛
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'balance' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">账户余额</h2>
                  
                  {/* 余额显示卡片 */}
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm mb-1">当前余额</p>
                        <p className="text-3xl font-bold">¥{getUserBalance().toLocaleString()}</p>
                      </div>
                      <div className="text-4xl opacity-80">💰</div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setShowRechargeModal(true)}
                      className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <span className="text-lg mr-2">💳</span>
                      充值
                    </button>
                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg mr-2">💸</span>
                      提现
                    </button>
                  </div>

                  {/* 余额说明 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">余额说明</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 余额可用于购买商品，方便快捷</li>
                      <li>• 单次充值金额不超过10万元</li>
                      <li>• 提现最低金额为10元，预计1-3个工作日到账</li>
                      <li>• 余额安全由平台保障，请放心使用</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 充值模态框 */}
        {showRechargeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">账户充值</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  充值金额
                </label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => {
                    setRechargeAmount(e.target.value);
                    setErrors(prev => ({ ...prev, recharge: '' }));
                  }}
                  placeholder="请输入充值金额"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.recharge && (
                  <p className="mt-1 text-sm text-red-600">{errors.recharge}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  当前余额: ¥{getUserBalance().toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRechargeModal(false);
                    setRechargeAmount('');
                    setErrors(prev => ({ ...prev, recharge: '' }));
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={balanceLoading}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {balanceLoading ? '充值中...' : '确认充值'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 提现模态框 */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">账户提现</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提现金额
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                    setErrors(prev => ({ ...prev, withdraw: '' }));
                  }}
                  placeholder="请输入提现金额"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.withdraw && (
                  <p className="mt-1 text-sm text-red-600">{errors.withdraw}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  可提现余额: ¥{getUserBalance().toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  最低提现金额10元，预计1-3个工作日到账
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                    setErrors(prev => ({ ...prev, withdraw: '' }));
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={balanceLoading}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {balanceLoading ? '提现中...' : '确认提现'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;