-- 更新管理员用户表，确保admin用户存在并设置正确的密码哈希
-- 密码：123456 的 bcrypt 哈希值
UPDATE admin_users 
SET password_hash = '$2b$10$kuYaNhfGdFKPVRxpWrZzu.2NvfbNxMYuAg8QO3OEosOK5xVLVPcpu'
WHERE username = 'admin';

-- 如果admin用户不存在，则插入
INSERT INTO admin_users (username, password_hash, email, role, status) 
SELECT 'admin', '$2b$10$kuYaNhfGdFKPVRxpWrZzu.2NvfbNxMYuAg8QO3OEosOK5xVLVPcpu', 'admin@jadestore.com', 'admin', 'active'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');