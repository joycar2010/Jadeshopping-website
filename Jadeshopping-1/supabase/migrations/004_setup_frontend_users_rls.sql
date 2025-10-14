-- Enable Row Level Security for frontend_users table
ALTER TABLE frontend_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_management_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for frontend_users table

-- Admin users can view all frontend users
CREATE POLICY "Admin users can view all frontend users" ON frontend_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- Admin users can insert frontend users
CREATE POLICY "Admin users can insert frontend users" ON frontend_users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- Admin users can update frontend users
CREATE POLICY "Admin users can update frontend users" ON frontend_users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- Admin users can delete frontend users
CREATE POLICY "Admin users can delete frontend users" ON frontend_users
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- RLS Policies for user_activity_logs table

-- Admin users can view all user activity logs
CREATE POLICY "Admin users can view all user activity logs" ON user_activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- Admin users can insert user activity logs
CREATE POLICY "Admin users can insert user activity logs" ON user_activity_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- RLS Policies for user_management_actions table

-- Admin users can view all user management actions
CREATE POLICY "Admin users can view all user management actions" ON user_management_actions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- Admin users can insert user management actions
CREATE POLICY "Admin users can insert user management actions" ON user_management_actions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au
            JOIN admin_sessions admin_sess ON au.id = admin_sess.admin_user_id
            WHERE admin_sess.token = current_setting('request.jwt.claims', true)::json->>'token'
            AND admin_sess.expires_at > NOW()
            AND au.status = 'active'
        )
    );

-- Grant permissions to anon and authenticated roles for basic access
GRANT SELECT ON frontend_users TO anon;
GRANT SELECT ON frontend_users TO authenticated;
GRANT ALL PRIVILEGES ON frontend_users TO authenticated;

GRANT SELECT ON user_activity_logs TO anon;
GRANT SELECT ON user_activity_logs TO authenticated;
GRANT ALL PRIVILEGES ON user_activity_logs TO authenticated;

GRANT SELECT ON user_management_actions TO authenticated;
GRANT ALL PRIVILEGES ON user_management_actions TO authenticated;