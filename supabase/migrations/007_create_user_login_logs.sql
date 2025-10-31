-- 网站注册用户登录日志
CREATE TABLE IF NOT EXISTS user_login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  success BOOLEAN NOT NULL,
  ip VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_created_at ON user_login_logs(created_at DESC);