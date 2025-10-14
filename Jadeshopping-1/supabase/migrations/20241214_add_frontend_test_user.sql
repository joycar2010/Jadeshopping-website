-- Add password_hash column to frontend_users table for authentication
ALTER TABLE frontend_users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Create index for password_hash column
CREATE INDEX IF NOT EXISTS idx_frontend_users_password_hash ON frontend_users(password_hash);

-- Insert test user with email test@qq.com and password 123456
-- Password hash for '123456' using bcrypt: $2b$10$kuYaNhfGdFKPVRxpWrZzu.2NvfbNxMYuAg8QO3OEosOK5xVLVPcpu
INSERT INTO frontend_users (
    email, 
    username, 
    full_name, 
    phone, 
    status, 
    email_verified, 
    profile_completed,
    password_hash,
    created_at,
    updated_at
)
VALUES (
    'test@qq.com',
    'testuser',
    '测试用户',
    '13800138888',
    'active',
    true,
    true,
    '$2b$10$kuYaNhfGdFKPVRxpWrZzu.2NvfbNxMYuAg8QO3OEosOK5xVLVPcpu',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    status = EXCLUDED.status,
    email_verified = EXCLUDED.email_verified,
    profile_completed = EXCLUDED.profile_completed,
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Insert activity log for the test user registration
INSERT INTO user_activity_logs (user_id, action, details, ip_address, user_agent)
SELECT 
    id,
    'USER_REGISTER',
    '{"registration_method": "admin_created", "device": "system", "test_account": true}'::jsonb,
    '127.0.0.1'::inet,
    'System Admin'
FROM frontend_users
WHERE email = 'test@qq.com';

-- Insert initial login activity for the test user
INSERT INTO user_activity_logs (user_id, action, details, ip_address, user_agent)
SELECT 
    id,
    'USER_LOGIN',
    '{"login_method": "email", "device": "web", "test_account": true}'::jsonb,
    '127.0.0.1'::inet,
    'Test Browser'
FROM frontend_users
WHERE email = 'test@qq.com';