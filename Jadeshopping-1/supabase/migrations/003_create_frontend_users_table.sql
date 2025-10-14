-- Create frontend_users table with comprehensive user management features
CREATE TABLE IF NOT EXISTS frontend_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create user_activity_logs table for tracking user activities
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES frontend_users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_management_actions table (for tracking admin actions on users)
CREATE TABLE IF NOT EXISTS user_management_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    frontend_user_id UUID NOT NULL REFERENCES frontend_users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    reason TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_frontend_users_email ON frontend_users(email);
CREATE INDEX IF NOT EXISTS idx_frontend_users_username ON frontend_users(username);
CREATE INDEX IF NOT EXISTS idx_frontend_users_status ON frontend_users(status);
CREATE INDEX IF NOT EXISTS idx_frontend_users_created_at ON frontend_users(created_at);
CREATE INDEX IF NOT EXISTS idx_frontend_users_last_login_at ON frontend_users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_management_actions_admin_user_id ON user_management_actions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_management_actions_frontend_user_id ON user_management_actions(frontend_user_id);
CREATE INDEX IF NOT EXISTS idx_user_management_actions_created_at ON user_management_actions(created_at);

-- Create trigger for updated_at (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_frontend_users_updated_at') THEN
        CREATE TRIGGER update_frontend_users_updated_at 
            BEFORE UPDATE ON frontend_users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert some test users for development
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
    '{"login_method": "email", "device": "web"}'
FROM frontend_users
WHERE email IN ('user1@example.com', 'user2@example.com', 'user5@example.com');

INSERT INTO user_activity_logs (user_id, action, details)
SELECT 
    id,
    'PROFILE_UPDATE',
    '{"fields_updated": ["full_name", "phone"]}'
FROM frontend_users
WHERE email IN ('user1@example.com', 'user5@example.com');