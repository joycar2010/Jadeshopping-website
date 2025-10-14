-- 清空数据库中所有表的数据
-- 注意：此脚本会删除所有数据，但保留表结构

-- 禁用外键约束检查
SET session_replication_role = replica;

-- 清空所有表的数据（按依赖关系顺序）
-- 1. 首先清空没有被其他表引用的表
TRUNCATE TABLE admin_audit_logs CASCADE;
TRUNCATE TABLE sync_events CASCADE;
TRUNCATE TABLE content_pages CASCADE;

-- 2. 清空子表（有外键引用其他表的表）
TRUNCATE TABLE admin_sessions CASCADE;
TRUNCATE TABLE admin_logs CASCADE;
TRUNCATE TABLE user_management_actions CASCADE;
TRUNCATE TABLE user_activity_logs CASCADE;
TRUNCATE TABLE shipments CASCADE;
TRUNCATE TABLE order_items CASCADE;

-- 3. 清空中间层表
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE;

-- 4. 清空主表（被其他表引用的表）
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE frontend_users CASCADE;
TRUNCATE TABLE admin_users CASCADE;

-- 重新启用外键约束检查
SET session_replication_role = DEFAULT;

-- 验证所有表都已清空
DO $$
DECLARE
    table_name text;
    row_count integer;
    total_rows integer := 0;
BEGIN
    -- 检查每个表的行数
    FOR table_name IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO row_count;
        IF row_count > 0 THEN
            RAISE NOTICE '表 % 仍有 % 行数据', table_name, row_count;
            total_rows := total_rows + row_count;
        END IF;
    END LOOP;
    
    IF total_rows = 0 THEN
        RAISE NOTICE '✅ 所有表已成功清空';
    ELSE
        RAISE NOTICE '⚠️ 总共还有 % 行数据未清空', total_rows;
    END IF;
END $$;