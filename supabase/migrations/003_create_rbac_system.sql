-- JADESHOPPING RBAC 权限控制系统创建脚本
-- 创建时间: 2024-12-27
-- 描述: 创建角色、权限、用户角色关联等权限控制相关表

-- 1. 创建角色表 (roles)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建权限表 (permissions)
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  description TEXT
);

-- 3. 创建角色权限关联表 (role_permissions)
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. 创建用户角色关联表 (user_roles)
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);

-- 5. 创建数据迁移日志表 (migration_logs)
CREATE TABLE migration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0
);

-- 6. 创建数据同步配置表 (sync_configs)
CREATE TABLE sync_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_interval INTEGER DEFAULT 300, -- 秒
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- 初始化角色数据
INSERT INTO roles (name, description) VALUES
('super_admin', '超级管理员，拥有系统所有权限'),
('admin', '系统管理员，拥有大部分管理权限'),
('product_manager', '商品管理员，负责商品和分类管理'),
('order_manager', '订单管理员，负责订单处理和物流'),
('buyback_reviewer', '回购审核员，负责回购申请初审'),
('buyback_appraiser', '回购鉴定师，负责实物鉴定和定价'),
('customer_service', '客服人员，负责用户咨询和售后'),
('marketing_manager', '营销人员，负责优惠券和活动管理'),
('content_editor', '内容编辑，负责网站内容和公告管理');

-- 初始化权限数据
INSERT INTO permissions (name, resource, action, description) VALUES
-- 用户管理权限
('users.read', 'users', 'read', '查看用户信息'),
('users.write', 'users', 'write', '编辑用户信息'),
('users.delete', 'users', 'delete', '删除用户'),

-- 商品管理权限
('products.read', 'products', 'read', '查看商品信息'),
('products.write', 'products', 'write', '编辑商品信息'),
('products.delete', 'products', 'delete', '删除商品'),
('products.buyback_zone', 'products', 'buyback_zone', '管理保值专区商品'),

-- 分类管理权限
('categories.read', 'categories', 'read', '查看商品分类'),
('categories.write', 'categories', 'write', '编辑商品分类'),
('categories.delete', 'categories', 'delete', '删除商品分类'),

-- 订单管理权限
('orders.read', 'orders', 'read', '查看订单信息'),
('orders.write', 'orders', 'write', '处理订单状态'),
('orders.delete', 'orders', 'delete', '删除订单'),

-- 回购管理权限
('buyback.review', 'buyback', 'review', '回购申请审核'),
('buyback.appraise', 'buyback', 'appraise', '回购实物鉴定'),
('buyback.pricing', 'buyback', 'pricing', '回购定价管理'),
('buyback.transaction', 'buyback', 'transaction', '回购交易处理'),
('buyback.dispute', 'buyback', 'dispute', '回购争议处理'),

-- 营销管理权限
('coupons.read', 'coupons', 'read', '查看优惠券'),
('coupons.write', 'coupons', 'write', '管理优惠券'),
('marketing.campaigns', 'marketing', 'campaigns', '营销活动管理'),

-- 内容管理权限
('content.read', 'content', 'read', '查看网站内容'),
('content.write', 'content', 'write', '编辑网站内容'),
('announcements.write', 'announcements', 'write', '发布公告'),
('carousel.write', 'carousel', 'write', '管理轮播图'),

-- 系统管理权限
('system.admin', 'system', 'admin', '系统管理'),
('system.logs', 'system', 'logs', '查看系统日志'),
('system.migration', 'system', 'migration', '数据迁移管理'),
('roles.read', 'roles', 'read', '查看角色权限'),
('roles.write', 'roles', 'write', '管理角色权限');

-- 初始化超级管理员角色权限（拥有所有权限）
INSERT INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'super_admin';

-- 初始化系统管理员角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin' AND p.name IN (
  'users.read', 'users.write',
  'products.read', 'products.write', 'products.buyback_zone',
  'categories.read', 'categories.write',
  'orders.read', 'orders.write',
  'coupons.read', 'coupons.write',
  'content.read', 'content.write',
  'system.logs', 'roles.read'
);

-- 初始化商品管理员角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'product_manager' AND p.name IN (
  'products.read', 'products.write', 'products.buyback_zone',
  'categories.read', 'categories.write'
);

-- 初始化订单管理员角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'order_manager' AND p.name IN (
  'orders.read', 'orders.write',
  'users.read'
);

-- 初始化回购审核员角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'buyback_reviewer' AND p.name IN (
  'buyback.review',
  'products.read',
  'users.read'
);

-- 初始化回购鉴定师角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'buyback_appraiser' AND p.name IN (
  'buyback.appraise',
  'buyback.pricing',
  'buyback.transaction',
  'products.read'
);

-- 初始化客服人员角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'customer_service' AND p.name IN (
  'users.read',
  'orders.read',
  'buyback.dispute'
);

-- 初始化营销人员角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'marketing_manager' AND p.name IN (
  'coupons.read', 'coupons.write',
  'marketing.campaigns',
  'users.read'
);

-- 初始化内容编辑角色权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'content_editor' AND p.name IN (
  'content.read', 'content.write',
  'announcements.write',
  'carousel.write'
);