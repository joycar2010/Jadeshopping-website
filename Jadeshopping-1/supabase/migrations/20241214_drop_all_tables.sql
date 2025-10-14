-- 删除所有数据表的SQL脚本
-- 注意：这将完全删除所有表结构和数据，操作不可逆！
-- 执行时间：2024-12-14

-- 禁用外键约束检查（如果支持）
SET session_replication_role = replica;

-- 按照外键依赖关系的正确顺序删除表
-- 首先删除依赖表（子表），最后删除被依赖表（父表）

-- 1. 删除最底层的依赖表
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS user_management_actions CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;

-- 2. 删除中间层表
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 3. 删除独立表（无外键依赖）
DROP TABLE IF EXISTS sync_events CASCADE;
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS content_pages CASCADE;

-- 4. 删除父表（被其他表引用的表）
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS frontend_users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 重新启用外键约束检查
SET session_replication_role = DEFAULT;

-- 验证所有表已被删除
-- 查询剩余表的数量
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 如果上述查询返回空结果，说明所有表已成功删除