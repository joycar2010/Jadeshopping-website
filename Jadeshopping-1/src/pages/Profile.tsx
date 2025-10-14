import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';
import AddressManagement from '@/components/AddressManagement';
import type { ProfileUpdateForm, PasswordChangeForm } from '@/types';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      id: string;
      name: string;
      description: string;
      image_url: string;
    };
  }[];
}

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
    deductBalance
  } = useStore();

  // Local state for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'orders' | 'favorites' | 'balance' | 'addresses'>('profile');
  
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
  
  // Balance management related state
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [balanceLoading, setBalanceLoading] = useState(false);

  // If not logged in, redirect to login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error messages
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  // Set active tab based on URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'password', 'orders', 'favorites', 'balance', 'addresses'].includes(tab)) {
      setActiveTab(tab as 'profile' | 'password' | 'orders' | 'favorites' | 'balance' | 'addresses');
    }
  }, [searchParams]);

  // Update form data when user information changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        username: user.username || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Fetch user orders
  const fetchOrders = async () => {
    if (!user?.id) return;
    
    setOrdersLoading(true);
    setOrdersError(null);
    
    try {
      const userOrders = await orderService.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrdersError('Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Get user order data
  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileForm.full_name) {
      newErrors.full_name = 'Please enter your full name';
    } else if (profileForm.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (profileForm.username && profileForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (profileForm.phone && !/^1[3-9]\d{9}$/.test(profileForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.current_password) {
      newErrors.current_password = 'Please enter your current password';
    }

    if (!passwordForm.new_password) {
      newErrors.new_password = 'Please enter your new password';
    } else if (passwordForm.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
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

    // Clear corresponding field error messages
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

    // Clear corresponding field error messages
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

  // Recharge handling
  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      setErrors(prev => ({ ...prev, recharge: 'Please enter a valid recharge amount' }));
      return;
    }
    if (amount > 100000) {
      setErrors(prev => ({ ...prev, recharge: 'Single recharge amount cannot exceed 100,000 yuan' }));
      return;
    }

    setBalanceLoading(true);
    try {
      // 模拟充值API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 调用store的addBalance方法更新余额
      const success = addBalance(amount);
      if (!success) {
        setErrors(prev => ({ ...prev, recharge: 'Recharge failed, please try again' }));
        return;
      }
      
      setShowRechargeModal(false);
      setRechargeAmount('');
      setErrors(prev => ({ ...prev, recharge: '' }));
      alert(`Recharge successful! Recharged ¥${amount.toLocaleString()}`);
    } catch (error) {
      setErrors(prev => ({ ...prev, recharge: 'Recharge failed, please try again' }));
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const currentBalance = getUserBalance();
    
    if (!amount || amount <= 0) {
      setErrors(prev => ({ ...prev, withdraw: 'Please enter a valid withdrawal amount' }));
      return;
    }
    if (amount > currentBalance) {
      setErrors(prev => ({ ...prev, withdraw: 'Withdrawal amount cannot exceed account balance' }));
      return;
    }
    if (amount < 10) {
      setErrors(prev => ({ ...prev, withdraw: 'Minimum withdrawal amount is 10 yuan' }));
      return;
    }

    setBalanceLoading(true);
    try {
      // 模拟提现API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 扣除余额
      const success = deductBalance(amount);
      if (!success) {
        setErrors(prev => ({ ...prev, withdraw: 'Withdrawal failed, insufficient balance' }));
        return;
      }
      
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setErrors(prev => ({ ...prev, withdraw: '' }));
      alert(`Withdrawal request submitted! Withdrawal amount ¥${amount.toLocaleString()}, expected to arrive in 1-3 business days`);
    } catch (error) {
      setErrors(prev => ({ ...prev, withdraw: 'Withdrawal failed, please try again' }));
    } finally {
      setBalanceLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Personal Information', icon: '👤' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'orders', label: 'Order History', icon: '📦' },
    { id: 'favorites', label: 'My Favorites', icon: '❤️' },
    { id: 'balance', label: 'Account Balance', icon: '💰' },
    { id: 'addresses', label: 'Address Management', icon: '📍' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User information header */}
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
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar navigation */}
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

          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
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
                        Username
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
                        Phone Number
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
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email address cannot be modified</p>
                    </div>

                    {authError && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-red-400">⚠️</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Update Failed
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
                        {authLoading ? 'Updating...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password *
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
                        New Password *
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
                        Confirm New Password *
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
                              Password Change Failed
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
                        {authLoading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">⏳</div>
                      <p className="text-gray-500">Loading order data...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 mb-4">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">Order Number:</span>
                              <span className="font-mono text-sm font-medium text-gray-900">{order.order_number}</span>
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
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <img
                                  src={item.products.image_url || '/placeholder-product.jpg'}
                                  alt={item.products.name}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.products.name}</h4>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">¥{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              Total {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                Total: ¥{order.total_amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders</h3>
                      <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">My Favorites</h2>
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
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites</h3>
                      <p className="text-gray-500 mb-6">You haven't favorited any products yet</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'balance' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Balance</h2>
                  
                  {/* Balance display card */}
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm mb-1">Current Balance</p>
                        <p className="text-3xl font-bold">¥{getUserBalance().toLocaleString()}</p>
                      </div>
                      <div className="text-4xl opacity-80">💰</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setShowRechargeModal(true)}
                      className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <span className="text-lg mr-2">💳</span>
                      Recharge
                    </button>
                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg mr-2">💸</span>
                      Withdraw
                    </button>
                  </div>

                  {/* Balance information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Balance Information</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Balance can be used to purchase products, convenient and fast</li>
                      <li>• Single recharge amount cannot exceed 100,000 yuan</li>
                      <li>• Minimum withdrawal amount is 10 yuan, expected to arrive in 1-3 business days</li>
                      <li>• Balance security is guaranteed by the platform, please use with confidence</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && user && (
                <AddressManagement userId={user.id} />
              )}
            </div>
          </div>
        </div>

        {/* Recharge modal */}
        {showRechargeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Recharge</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recharge Amount
                </label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => {
                    setRechargeAmount(e.target.value);
                    setErrors(prev => ({ ...prev, recharge: '' }));
                  }}
                  placeholder="Enter recharge amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.recharge && (
                  <p className="mt-1 text-sm text-red-600">{errors.recharge}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Current Balance: ¥{getUserBalance().toLocaleString()}
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
                  Cancel
                </button>
                <button
                  onClick={handleRecharge}
                  disabled={balanceLoading}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {balanceLoading ? 'Recharging...' : 'Confirm Recharge'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Withdrawal</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                    setErrors(prev => ({ ...prev, withdraw: '' }));
                  }}
                  placeholder="Enter withdrawal amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.withdraw && (
                  <p className="mt-1 text-sm text-red-600">{errors.withdraw}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Available Balance: ¥{getUserBalance().toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum withdrawal amount is 10 yuan, expected to arrive in 1-3 business days
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
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={balanceLoading}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {balanceLoading ? 'Withdrawing...' : 'Confirm Withdrawal'}
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