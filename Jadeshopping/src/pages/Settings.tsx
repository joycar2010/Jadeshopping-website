import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { 
  Search, 
  Package, 
  Eye, 
  EyeOff,
  X, 
  CheckCircle, 
  ShoppingCart,
  User,
  Wallet,
  Heart,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Shield,
  Gift,
  Award,
  Bell,
  Menu,
  Edit,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  
  // 状态管理
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('account');
  const [expandedNavItems, setExpandedNavItems] = useState<string[]>(['account']);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 检查用户登录状态
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 左侧导航配置
  const navigationItems = [
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      items: [
        { id: 'profile', title: '个人资料', link: '/settings' },
        { id: 'address', title: '地址簿', link: '/address' }
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
      icon: SettingsIcon,
      items: [

        { id: 'survey', title: '调查中心', link: '/survey' },
        { id: 'feedback', title: '意见反馈', link: '/feedback' }
      ]
    },
    {
      id: 'policy',
      title: 'Policy',
      icon: Shield,
      items: [
        { id: 'shipping', title: '配送政策', link: '/policy/shipping' },
        { id: 'return', title: '退货政策', link: '/policy/return' },
        { id: 'privacy', title: '隐私政策', link: '/policy/privacy' },
        { id: 'terms', title: '服务条款', link: '/policy/terms' }
      ]
    }
  ];

  // 切换导航项展开状态
  const toggleNavItem = (itemId: string) => {
    setExpandedNavItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 处理密码修改
  const handlePasswordChange = () => {
    // 这里应该调用API进行密码修改
    console.log('修改密码:', passwordData);
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // 处理账户删除
  const handleDeleteAccount = () => {
    // 这里应该调用API进行账户删除
    console.log('删除账户');
    setShowDeleteModal(false);
  };

  // 处理下载个人信息
  const handleDownloadInfo = () => {
    // 这里应该调用API下载个人信息
    console.log('下载个人信息');
    setShowDownloadModal(false);
  };

  // 密码修改模态框
  const PasswordModal = () => (
    showPasswordModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handlePasswordChange}
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                CHANGE PASSWORD
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // 删除账户确认模态框
  const DeleteModal = () => (
    showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-red-600">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <h4 className="font-semibold text-gray-900">Are you sure?</h4>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>NOTE:</strong> Account will NOT BE RECOVERABLE once deleted.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                DELETE ACCOUNT
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // 下载信息确认模态框
  const DownloadModal = () => (
    showDownloadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDownloadModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Download Your Information</h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                We'll prepare a copy of your personal data for download. This may take a few minutes.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  For security purposes, we may need to verify your identity before processing this request.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDownloadInfo}
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                DOWNLOAD
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后管理账户设置</p>
            <Link to="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页头 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* 页头内容已被移除，保持空的header容器 */}
      </header>

      {/* 主体内容 */}
      <div className="flex">
        {/* 左侧导航栏 */}
        <aside className={`bg-white shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} min-h-screen border-r border-gray-200`}>
          <div className="p-4">
            {/* 菜单切换按钮 */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors mb-6"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            {/* 导航菜单 */}
            <nav className="space-y-2">
              {navigationItems.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedNavItems.includes(section.id);
                
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleNavItem(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        section.id === activeNavItem ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        {!sidebarCollapsed && (
                          <span className="font-medium text-gray-900">{section.title}</span>
                        )}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                    
                    {!sidebarCollapsed && isExpanded && (
                      <div className="ml-8 mt-2 space-y-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.id}
                            to={item.link}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              item.active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
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
            </nav>

            {/* 退出登录 */}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 mt-8 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </aside>

        {/* 右侧主内容区 */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MANAGE MY ACCOUNT</h1>
              <p className="text-gray-600">Manage your account information and security settings</p>
            </div>

            {/* 账户信息管理 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  {/* 邮箱管理 */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-green-600 mt-1">Verified • +100 Points</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        CHANGE
                      </button>
                      <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                        VERIFY NOW
                      </button>
                    </div>
                  </div>

                  {/* 手机号管理 */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone Number</h3>
                        <p className="text-sm text-gray-600">
                          {user.phone || 'Not added'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          You can log in directly with your phone number after binding
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        {user.phone ? 'CHANGE' : 'ADD'}
                      </button>
                    </div>
                  </div>

                  {/* 密码修改 */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      CHANGE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 账户操作 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h2>
                
                <div className="space-y-6">
                  {/* 下载个人信息 */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Download className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">Download Your Information</h3>
                        <p className="text-sm text-gray-600">
                          Get a copy of your personal data
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          We may need to verify your identity for security purposes
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDownloadModal(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      DOWNLOAD
                    </button>
                  </div>

                  {/* 删除账户 */}
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-4">
                      <Trash2 className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-medium text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-700">
                          Permanently delete your account and all data
                        </p>
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          NOTE: Account will NOT BE RECOVERABLE once deleted.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 模态框 */}
      <PasswordModal />
      <DeleteModal />
      <DownloadModal />
    </div>
  );
};

export default Settings;