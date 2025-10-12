import React from 'react';
import { useStore } from '@/store/useStore';

interface PermissionControlProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // 是否需要所有权限，默认为false（只需要其中一个）
}

/**
 * 权限控制组件
 * 根据当前管理员的权限决定是否显示子组件
 */
const PermissionControl: React.FC<PermissionControlProps> = ({
  children,
  requiredPermissions,
  fallback = null,
  requireAll = false
}) => {
  const { admin, isAdminAuthenticated } = useStore();

  // 如果未登录，不显示任何内容
  if (!isAdminAuthenticated || !admin) {
    return <>{fallback}</>;
  }

  // 超级管理员拥有所有权限
  if (admin.is_super_admin) {
    return <>{children}</>;
  }

  // 检查权限
  const hasPermission = requireAll
    ? requiredPermissions.every(permission => admin.permissions.includes(permission))
    : requiredPermissions.some(permission => admin.permissions.includes(permission));

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionControl;