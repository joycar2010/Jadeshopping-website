-- 清空所有表数据的SQL脚本
-- 注意：这将删除所有数据，但保留表结构
-- 执行时间：2024-12-14

-- 按照外键依赖关系的正确顺序删除数据
-- 首先删除依赖表（子表）的数据，最后删除被依赖表（父表）的数据

-- 1. 删除最底层的依赖表数据
DELETE FROM order_items;
DELETE FROM reviews;

-- 2. 删除中间层表数据
DELETE FROM orders;
DELETE FROM addresses;

-- 3. 删除独立表数据（无外键依赖）
DELETE FROM content_pages;
DELETE FROM coupons;

-- 4. 删除商品数据
DELETE FROM products;

-- 5. 删除分类数据
DELETE FROM categories;

-- 6. 删除用户数据（最后删除，因为其他表可能引用用户）
DELETE FROM users;

-- 重置序列（如果有的话）
-- 注意：UUID类型不需要重置序列

-- 验证所有表已被清空
SELECT 
    schemaname,
    relname as tablename,
    n_tup_ins as inserted_rows,
    n_tup_upd as updated_rows,
    n_tup_del as deleted_rows,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY relname;