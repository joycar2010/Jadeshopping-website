import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * 前台用户路由保护组件
 * 用于保护需要前台用户登录的页面
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();

  // 如果不需要认证，直接渲染子组件
  if (!requireAuth) {
    return <>{children}</>;
  }

  // 如果需要认证但用户未登录，重定向到登录页面
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // 用户已登录，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;