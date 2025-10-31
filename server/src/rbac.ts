import { Request, Response, NextFunction } from 'express';

// 将权限键与 Supabase migrations(003_create_rbac_system.sql) 中的定义对齐
// 仅列出后端当前使用到的权限键；其余按需扩展
export const Permissions = {
  // 角色与系统管理
  'roles.read': 'roles.read',
  'roles.write': 'roles.write',
  'system.admin': 'system.admin',
  'system.logs': 'system.logs',

  // 用户与商品等（与 SQL 中保持一致，供未来路由使用）
  'users.read': 'users.read',
  'users.write': 'users.write',
  'users.delete': 'users.delete',

  'products.read': 'products.read',
  'products.write': 'products.write',
  'products.delete': 'products.delete',
  'products.buyback_zone': 'products.buyback_zone',

  'categories.read': 'categories.read',
  'categories.write': 'categories.write',
  'categories.delete': 'categories.delete',

  'orders.read': 'orders.read',
  'orders.write': 'orders.write',
  'orders.delete': 'orders.delete',

  'coupons.read': 'coupons.read',
  'coupons.write': 'coupons.write',

  'content.read': 'content.read',
  'content.write': 'content.write',
  'announcements.write': 'announcements.write',
  'carousel.write': 'carousel.write',
} as const;

export type PermissionKey = keyof typeof Permissions | string;

// 简化示例：从请求对象中解析用户权限（实际应结合 JWT 与数据库）
export function requirePermission(key: PermissionKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPerms: string[] = (req as any).user?.permissions ?? [];
    if (!userPerms.includes(key)) {
      return res.status(403).json({ message: 'Forbidden', required: key });
    }
    next();
  };
}