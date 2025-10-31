-- JADESHOPPING 回购业务表创建脚本
-- 创建时间: 2024-12-27
-- 描述: 创建回购申请、评估、定价、交易、争议等回购业务相关表

-- 1. 创建回购申请表 (buyback_applications)
CREATE TABLE buyback_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  original_order_id UUID REFERENCES orders(id),
  application_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, completed, cancelled
  purchase_date DATE NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  purchase_proof_urls TEXT[], -- 购买凭证图片
  certificate_urls TEXT[], -- 鉴定证书图片
  product_photos TEXT[], -- 商品照片
  product_videos TEXT[], -- 商品视频
  condition_description TEXT, -- 商品状态描述
  delivery_method VARCHAR(20) DEFAULT 'mail', -- mail, store
  tracking_number VARCHAR(100), -- 邮寄单号
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建回购申请表索引
CREATE INDEX idx_buyback_applications_user_id ON buyback_applications(user_id);
CREATE INDEX idx_buyback_applications_status ON buyback_applications(application_status);
CREATE INDEX idx_buyback_applications_created_at ON buyback_applications(created_at DESC);
CREATE INDEX idx_buyback_applications_product_id ON buyback_applications(product_id);

-- 2. 创建回购评估表 (buyback_appraisals)
CREATE TABLE buyback_appraisals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES buyback_applications(id) NOT NULL,
  appraiser_id UUID REFERENCES users(id) NOT NULL, -- 鉴定师ID
  appraisal_status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed
  material_quality JSONB, -- 材质品质评估 {种水, 颜色, 纯度}
  craftsmanship_score INTEGER CHECK (craftsmanship_score >= 1 AND craftsmanship_score <= 10), -- 工艺水准评分 1-10
  wear_condition VARCHAR(20), -- excellent, good, fair, poor
  authenticity_verified BOOLEAN DEFAULT false,
  market_price DECIMAL(10,2), -- 市场参考价
  final_quote DECIMAL(10,2), -- 最终报价
  quote_reasoning TEXT, -- 定价依据说明
  appraisal_report_url TEXT, -- 评估报告文件
  video_record_url TEXT, -- 鉴定过程视频
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 创建回购评估表索引
CREATE INDEX idx_buyback_appraisals_application_id ON buyback_appraisals(application_id);
CREATE INDEX idx_buyback_appraisals_appraiser_id ON buyback_appraisals(appraiser_id);
CREATE INDEX idx_buyback_appraisals_status ON buyback_appraisals(appraisal_status);

-- 3. 创建回购定价规则表 (buyback_pricing_rules)
CREATE TABLE buyback_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  min_purchase_price DECIMAL(10,2), -- 最低购买价格
  max_purchase_price DECIMAL(10,2), -- 最高购买价格
  base_percentage DECIMAL(5,2) DEFAULT 90.00, -- 基础回购比例 90%
  quality_adjustments JSONB, -- 品质调整系数
  wear_adjustments JSONB, -- 磨损调整系数
  time_depreciation JSONB, -- 时间折旧系数
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建回购定价规则表索引
CREATE INDEX idx_buyback_pricing_rules_category_id ON buyback_pricing_rules(category_id);
CREATE INDEX idx_buyback_pricing_rules_active ON buyback_pricing_rules(is_active);

-- 4. 创建回购交易表 (buyback_transactions)
CREATE TABLE buyback_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES buyback_applications(id) NOT NULL,
  appraisal_id UUID REFERENCES buyback_appraisals(id) NOT NULL,
  transaction_status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, paid, rejected, returned
  final_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50), -- bank_transfer, alipay, wechat
  payment_account TEXT, -- 收款账户信息
  contract_url TEXT, -- 电子协议文件
  payment_proof_url TEXT, -- 付款凭证
  user_confirmed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建回购交易表索引
CREATE INDEX idx_buyback_transactions_application_id ON buyback_transactions(application_id);
CREATE INDEX idx_buyback_transactions_appraisal_id ON buyback_transactions(appraisal_id);
CREATE INDEX idx_buyback_transactions_status ON buyback_transactions(transaction_status);

-- 5. 创建回购争议表 (buyback_disputes)
CREATE TABLE buyback_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES buyback_applications(id) NOT NULL,
  dispute_type VARCHAR(20) DEFAULT 'price', -- price, quality, authenticity
  user_reason TEXT NOT NULL,
  third_party_institution VARCHAR(255), -- 第三方鉴定机构
  third_party_cost DECIMAL(10,2), -- 第三方鉴定费用
  third_party_result JSONB, -- 第三方鉴定结果
  resolution_status VARCHAR(20) DEFAULT 'pending', -- pending, resolved, escalated
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 创建回购争议表索引
CREATE INDEX idx_buyback_disputes_application_id ON buyback_disputes(application_id);
CREATE INDEX idx_buyback_disputes_type ON buyback_disputes(dispute_type);
CREATE INDEX idx_buyback_disputes_status ON buyback_disputes(resolution_status);

-- 6. 创建网站内容表 (site_contents)
CREATE TABLE site_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建网站内容表索引
CREATE INDEX idx_site_contents_slug ON site_contents(slug);
CREATE INDEX idx_site_contents_published ON site_contents(is_published);

-- 初始化网站内容数据
INSERT INTO site_contents (slug, title, content, meta_description) VALUES
('about', '公司简介', '翡翠雅韵致力于为客户提供最优质的翡翠产品和专业的回购服务。我们拥有专业的鉴定团队和完善的质量保证体系，确保每一件翡翠都经过严格的品质检验。', '翡翠雅韵公司简介'),
('culture', '企业文化', '我们秉承"诚信为本，品质至上"的经营理念，致力于传承中华翡翠文化，为客户提供最优质的产品和服务。我们相信，每一块翡翠都承载着深厚的文化底蕴和美好的寓意。', '翡翠雅韵企业文化'),
('history', '发展历程', '翡翠雅韵成立于2010年，经过十多年的发展，已成为行业内知名的翡翠品牌。我们始终坚持品质第一的原则，不断创新服务模式，为客户提供更好的购物体验。', '翡翠雅韵发展历程'),
('shipping', '配送说明', '我们提供全国范围内的配送服务，支持顺丰快递、EMS等多种配送方式。所有商品均采用专业包装，确保运输安全。一般情况下，订单将在24小时内发货。', '配送说明'),
('returns', '退换货政策', '为保障您的权益，我们提供7天无理由退换货服务。商品必须保持原包装完整，未经使用。退换货运费由买家承担，特殊情况除外。', '退换货政策'),
('buyback_policy', '回购政策', '我们为购买保值专区商品的客户提供专业的回购服务。回购价格基于商品的实际状况、市场价格等因素综合评估。回购流程包括申请、鉴定、定价、交易等环节，确保公平透明。', '回购政策说明');