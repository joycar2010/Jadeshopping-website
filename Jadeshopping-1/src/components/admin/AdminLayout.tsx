import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  CreditCard,
  Truck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Warehouse,
  BarChart3
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, isAdminAuthenticated, adminLogout, adminNotifications } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 检查管理员权限
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: '仪表板',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin/dashboard'
    },

    {
      id: 'products',
      title: '商品管理',
      icon: <Package className="w-5 h-5" />,
      path: '/admin/products'
    },
    {
      id: 'categories',
      title: '分类管理',
      icon: <FolderTree className="w-5 h-5" />,
      path: '/admin/categories'
    },
    {
      id: 'inventory',
      title: '库存管理',
      icon: <Warehouse className="w-5 h-5" />,
      path: '/admin/inventory'
    },
    {
      id: 'orders',
      title: '订单管理',
      icon: <ShoppingCart className="w-5 h-5" />,
      path: '/admin/orders',
      badge: 5 // 待处理订单数量
    },
    {
      id: 'payments',
      title: '支付管理',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/admin/payments',
      children: [
        {
          id: 'payments-list',
          title: '支付列表',
          icon: <CreditCard className="w-4 h-4" />,
          path: '/admin/payments'
        },
        {
          id: 'payments-refunds',
          title: '退款管理',
          icon: <CreditCard className="w-4 h-4" />,
          path: '/admin/payments/refunds'
        },
        {
          id: 'payments-settings',
          title: '支付配置',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/payments/settings'
        },
        {
          id: 'payments-analytics',
          title: '支付分析',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/admin/payments/analytics'
        }
      ]
    },
    {
      id: 'shipping',
      title: '发货管理',
      icon: <Truck className="w-5 h-5" />,
      path: '/admin/shipping'
    },
    {
      id: 'content',
      title: '内容管理',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/content'
    },
    {
      id: 'settings',
      title: '系统设置',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings'
    }
  ];

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const unreadNotifications = adminNotifications.filter(n => !n.is_read).length;

  // 移除这个检查，因为现在由AdminRoute组件处理认证
  // if (!isAdminAuthenticated) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">翡</span>
            </div>
            <span className="text-xl font-bold text-gray-900">翡翠商城</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={`mr-3 ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.title}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 用户信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {admin?.role === 'super_admin' ? '超级管理员' : '管理员'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="lg:pl-64">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* 搜索框 */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="搜索..."
                />
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-4">
              {/* 通知 */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              {/* 用户菜单 */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {admin?.username}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* 用户下拉菜单 */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
                      <p className="text-xs text-gray-500">{admin?.email}</p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      个人资料
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      系统设置
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;