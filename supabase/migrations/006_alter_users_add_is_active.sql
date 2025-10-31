-- 为前台网站注册用户增加启用/禁用字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);