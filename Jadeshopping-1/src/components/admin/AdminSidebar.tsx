import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Settings,
  UserCog,
  BarChart3,
  Shield
} from 'lucide-react'

const menuItems = [
  {
    title: '仪表板',
    icon: LayoutDashboard,
    path: '/admin/dashboard'
  },
  {
    title: '用户管理',
    icon: Users,
    path: '/admin/users'
  },
  {
    title: '商品管理',
    icon: Package,
    path: '/admin/products',
    children: [
      { title: '商品列表', path: '/admin/products' },
      { title: '分类管理', path: '/admin/categories' }
    ]
  },
  {
    title: '订单管理',
    icon: ShoppingCart,
    path: '/admin/orders'
  },
  {
    title: '发货管理',
    icon: Truck,
    path: '/admin/shipments'
  },
  {
    title: '内容管理',
    icon: FileText,
    path: '/admin/content'
  },
  {
    title: '操作员管理',
    icon: UserCog,
    path: '/admin/operators'
  },
  {
    title: '系统设置',
    icon: Settings,
    path: '/admin/settings'
  },
  {
    title: '操作日志',
    icon: BarChart3,
    path: '/admin/logs'
  }
]

export default function AdminSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
            <p className="text-sm text-gray-500">Jade Shopping</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <div key={item.path}>
              <NavLink
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.title}
              </NavLink>

              {/* 子菜单 */}
              {item.children && active && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                        location.pathname === child.path
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {child.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>版本 1.0.0</p>
          <p className="mt-1">© 2024 Jade Shopping</p>
        </div>
      </div>
    </div>
  )
}