import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

/**
 * 后台管理员路由保护组件
 * 用于保护需要管理员权限的页面
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { isAdminAuthenticated, admin } = useStore();
  const location = useLocation();

  // 如果管理员未登录，重定向到管理员登录页面
  if (!isAdminAuthenticated || !admin) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // 检查权限（如果指定了所需权限）
  if (requiredPermissions.length > 0) {
    const hasPermission = admin.is_super_admin || 
      requiredPermissions.every(permission => 
        admin.permissions.includes(permission)
      );

    if (!hasPermission) {
      // 权限不足，可以重定向到无权限页面或显示错误信息
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">访问被拒绝</h3>
            <p className="text-gray-600 mb-4">您没有访问此页面的权限。</p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              返回上一页
            </button>
          </div>
        </div>
      );
    }
  }

  // 管理员已登录且有权限，渲染子组件
  return <>{children}</>;
};

export default AdminRoute;