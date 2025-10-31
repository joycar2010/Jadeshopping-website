-- JADESHOPPING RLS 安全策略设置脚本
-- 创建时间: 2024-12-27
-- 描述: 设置所有表的行级安全策略和权限控制

-- 启用所有表的 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyback_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_configs ENABLE ROW LEVEL SECURITY;

-- 为匿名用户和认证用户授予基础权限
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

GRANT SELECT ON categories TO anon;
GRANT ALL PRIVILEGES ON categories TO authenticated;

GRANT SELECT ON products TO anon;
GRANT ALL PRIVILEGES ON products TO authenticated;

GRANT SELECT ON orders TO anon;
GRANT ALL PRIVILEGES ON orders TO authenticated;

GRANT SELECT ON order_items TO anon;
GRANT ALL PRIVILEGES ON order_items TO authenticated;

GRANT SELECT ON reviews TO anon;
GRANT ALL PRIVILEGES ON reviews TO authenticated;

GRANT SELECT ON favorites TO anon;
GRANT ALL PRIVILEGES ON favorites TO authenticated;

GRANT SELECT ON addresses TO anon;
GRANT ALL PRIVILEGES ON addresses TO authenticated;

GRANT SELECT ON coupons TO anon;
GRANT ALL PRIVILEGES ON coupons TO authenticated;

GRANT SELECT ON user_coupons TO anon;
GRANT ALL PRIVILEGES ON user_coupons TO authenticated;

GRANT SELECT ON carousel_items TO anon;
GRANT ALL PRIVILEGES ON carousel_items TO authenticated;

GRANT SELECT ON announcements TO anon;
GRANT ALL PRIVILEGES ON announcements TO authenticated;

GRANT SELECT ON buyback_applications TO anon;
GRANT ALL PRIVILEGES ON buyback_applications TO authenticated;

GRANT SELECT ON buyback_appraisals TO anon;
GRANT ALL PRIVILEGES ON buyback_appraisals TO authenticated;

GRANT SELECT ON buyback_pricing_rules TO anon;
GRANT ALL PRIVILEGES ON buyback_pricing_rules TO authenticated;

GRANT SELECT ON buyback_transactions TO anon;
GRANT ALL PRIVILEGES ON buyback_transactions TO authenticated;

GRANT SELECT ON buyback_disputes TO anon;
GRANT ALL PRIVILEGES ON buyback_disputes TO authenticated;

GRANT SELECT ON site_contents TO anon;
GRANT ALL PRIVILEGES ON site_contents TO authenticated;

GRANT SELECT ON roles TO anon;
GRANT ALL PRIVILEGES ON roles TO authenticated;

GRANT SELECT ON permissions TO anon;
GRANT ALL PRIVILEGES ON permissions TO authenticated;

GRANT SELECT ON role_permissions TO anon;
GRANT ALL PRIVILEGES ON role_permissions TO authenticated;

GRANT SELECT ON user_roles TO anon;
GRANT ALL PRIVILEGES ON user_roles TO authenticated;

GRANT SELECT ON migration_logs TO anon;
GRANT ALL PRIVILEGES ON migration_logs TO authenticated;

GRANT SELECT ON sync_configs TO anon;
GRANT ALL PRIVILEGES ON sync_configs TO authenticated;

-- 用户表 RLS 策略
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 分类表 RLS 策略（所有用户可查看激活的分类）
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- 商品表 RLS 策略（所有用户可查看激活的商品）
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- 订单表 RLS 策略（用户只能访问自己的订单）
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- 订单项表 RLS 策略（通过订单关联控制访问）
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- 评价表 RLS 策略（用户只能管理自己的评价，所有人可查看）
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- 收藏表 RLS 策略（用户只能管理自己的收藏）
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 地址表 RLS 策略（用户只能管理自己的地址）
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- 优惠券表 RLS 策略（所有用户可查看激活的优惠券）
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true);

-- 用户优惠券表 RLS 策略（用户只能管理自己的优惠券）
CREATE POLICY "Users can view own coupons" ON user_coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own coupons" ON user_coupons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coupons" ON user_coupons
  FOR UPDATE USING (auth.uid() = user_id);

-- 轮播图表 RLS 策略（所有用户可查看激活的轮播图）
CREATE POLICY "Anyone can view active carousel items" ON carousel_items
  FOR SELECT USING (is_active = true);

-- 公告表 RLS 策略（所有用户可查看激活的公告）
CREATE POLICY "Anyone can view active announcements" ON announcements
  FOR SELECT USING (is_active = true);

-- 回购申请表 RLS 策略（用户只能管理自己的回购申请）
CREATE POLICY "Users can view own buyback applications" ON buyback_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own buyback applications" ON buyback_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buyback applications" ON buyback_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- 回购评估表 RLS 策略（鉴定师可查看分配给自己的评估任务）
CREATE POLICY "Appraisers can view assigned appraisals" ON buyback_appraisals
  FOR SELECT USING (auth.uid() = appraiser_id);

CREATE POLICY "Appraisers can create appraisals" ON buyback_appraisals
  FOR INSERT WITH CHECK (auth.uid() = appraiser_id);

CREATE POLICY "Appraisers can update assigned appraisals" ON buyback_appraisals
  FOR UPDATE USING (auth.uid() = appraiser_id);

-- 回购定价规则表 RLS 策略（所有认证用户可查看）
CREATE POLICY "Authenticated users can view pricing rules" ON buyback_pricing_rules
  FOR SELECT USING (auth.role() = 'authenticated');

-- 回购交易表 RLS 策略（用户可查看自己相关的交易）
CREATE POLICY "Users can view own buyback transactions" ON buyback_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM buyback_applications 
      WHERE buyback_applications.id = buyback_transactions.application_id 
      AND buyback_applications.user_id = auth.uid()
    )
  );

-- 回购争议表 RLS 策略（用户可查看自己相关的争议）
CREATE POLICY "Users can view own buyback disputes" ON buyback_disputes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM buyback_applications 
      WHERE buyback_applications.id = buyback_disputes.application_id 
      AND buyback_applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own buyback disputes" ON buyback_disputes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM buyback_applications 
      WHERE buyback_applications.id = buyback_disputes.application_id 
      AND buyback_applications.user_id = auth.uid()
    )
  );

-- 网站内容表 RLS 策略（所有用户可查看已发布的内容）
CREATE POLICY "Anyone can view published content" ON site_contents
  FOR SELECT USING (is_published = true);

-- 角色和权限表 RLS 策略（认证用户可查看）
CREATE POLICY "Authenticated users can view roles" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view permissions" ON permissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view role permissions" ON role_permissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- 用户角色表 RLS 策略（用户可查看自己的角色）
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 系统表 RLS 策略（仅管理员可访问）
CREATE POLICY "Admin can view migration logs" ON migration_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can view sync configs" ON sync_configs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('super_admin', 'admin')
    )
  );