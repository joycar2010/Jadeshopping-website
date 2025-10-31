-- 后台操作员与登录日志结构
-- 依赖: roles 权限系统 (见 003_create_rbac_system.sql)

CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(120),
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operators_username ON operators(username);

-- 操作员角色关联（独立于网站前台用户）
CREATE TABLE IF NOT EXISTS operator_roles (
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID,
  PRIMARY KEY (operator_id, role_id)
);

-- 登录日志
CREATE TABLE IF NOT EXISTS operator_login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES operators(id) ON DELETE SET NULL,
  username VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL,
  ip VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);