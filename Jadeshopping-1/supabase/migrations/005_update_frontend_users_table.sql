-- Add missing columns to frontend_users table
ALTER TABLE frontend_users 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add missing columns to user_management_actions table
ALTER TABLE user_management_actions 
ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}';

-- Create user_activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES frontend_users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_activity_logs if not already enabled
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_frontend_users_username ON frontend_users(username);
CREATE INDEX IF NOT EXISTS idx_frontend_users_phone_verified ON frontend_users(phone_verified);
CREATE INDEX IF NOT EXISTS idx_frontend_users_profile_completed ON frontend_users(profile_completed);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action ON user_activity_logs(action);

-- Insert some test users for development (only if they don't exist)
INSERT INTO frontend_users (email, username, full_name, phone, status, email_verified, profile_completed)
VALUES 
    ('user1@example.com', 'user1', '张三', '13800138001', 'active', true, true),
    ('user2@example.com', 'user2', '李四', '13800138002', 'active', true, false),
    ('user3@example.com', 'user3', '王五', '13800138003', 'inactive', false, false),
    ('user4@example.com', 'user4', '赵六', '13800138004', 'suspended', true, true),
    ('user5@example.com', 'user5', '钱七', '13800138005', 'active', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert some activity logs for test users
INSERT INTO user_activity_logs (user_id, action, details)
SELECT 
    id,
    'USER_LOGIN',
    '{"login_method": "email", "device": "web"}'::jsonb
FROM frontend_users
WHERE email IN ('user1@example.com', 'user2@example.com', 'user5@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO user_activity_logs (user_id, action, details)
SELECT 
    id,
    'PROFILE_UPDATE',
    '{"fields_updated": ["full_name", "phone"]}'::jsonb
FROM frontend_users
WHERE email IN ('user1@example.com', 'user5@example.com')
ON CONFLICT DO NOTHING;