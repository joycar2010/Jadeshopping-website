-- 删除所有数据表的SQL脚本 (版本2)
-- 注意：这将完全删除所有表结构和数据，操作不可逆！
-- 执行时间：2024-12-14

-- 使用CASCADE删除所有表，自动处理外键依赖关系
DROP SCHEMA IF EXISTS public CASCADE;

-- 重新创建public schema
CREATE SCHEMA public;

-- 授予必要的权限
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 验证所有表已被删除
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 如果上述查询返回空结果，说明所有表已成功删除