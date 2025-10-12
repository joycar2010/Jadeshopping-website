import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAdminAuthenticated, 
    adminLogout, 
    adminUser,
    adminNotifications,
    markAdminNotificationAsRead
  } = useStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 检查认证状态
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: '仪表板',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },

    {
      id: 'products',
      label: '商品管理',
      icon: Package,
      path: '/admin/products'
    },
    {
      id: 'orders',
      label: '订单管理',
      icon: ShoppingCart,
      path: '/admin/orders'
    },
    {
      id: 'payments',
      label: '支付管理',
      icon: CreditCard,
      path: '/admin/payments'
    },
    {
      id: 'shipping',
      label: '发货管理',
      icon: Truck,
      path: '/admin/shipping'
    },
    {
      id: 'content',
      label: '内容管理',
      icon: FileText,
      path: '/admin/content'
    }
  ];

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const unreadNotifications = adminNotifications.filter(n => !n.read).length;

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo区域 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">翡翠商城</span>
              <span className="text-xs text-gray-500">管理后台</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-r-4 border-emerald-500 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-4 h-5 w-5 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 分隔线 */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* 设置链接 */}
          <div className="space-y-2">
            <Link
              to="/admin/settings"
              className="group flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
            >
              <Settings className="mr-4 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <span>系统设置</span>
            </Link>
          </div>
        </nav>

        {/* 底部用户信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {adminUser?.username || '管理员'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminUser?.role || '系统管理员'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 lg:ml-0">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* 页面标题 */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.path === location.pathname)?.label || '管理后台'}
              </h1>
            </div>

            {/* 搜索框 */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                />
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-4">
              {/* 通知 */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* 通知下拉菜单 */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">通知</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {adminNotifications.length > 0 ? (
                          adminNotifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-md cursor-pointer transition-colors ${
                                notification.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                              }`}
                              onClick={() => markAdminNotificationAsRead(notification.id)}
                            >
                              <p className="text-sm text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">暂无通知</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 设置 */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;