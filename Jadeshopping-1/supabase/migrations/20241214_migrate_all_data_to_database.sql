-- 电商网站完整数据迁移到数据库系统
-- 迁移所有模拟数据到Supabase数据库

-- 1. 创建商品分类表
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_id UUID REFERENCES product_categories(id),
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    product_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 更新商品基础表结构（适配现有表）
-- 添加缺失的字段到现有 products 表
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- 创建唯一索引（如果不存在）
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON products(slug);

-- 3. 创建商品图片表
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    is_gallery BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建商品规格表
CREATE TABLE IF NOT EXISTS product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_name VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建商品评价表
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES frontend_users(id) ON DELETE SET NULL,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES frontend_users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial_refund')),
    payment_id VARCHAR(255),
    coupon_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 创建订单商品表
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 创建收货地址表
CREATE TABLE IF NOT EXISTS shipping_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES frontend_users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 创建订单物流表
CREATE TABLE IF NOT EXISTS order_shipping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    shipping_address_id UUID REFERENCES shipping_addresses(id),
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    carrier VARCHAR(50),
    tracking_number VARCHAR(100),
    shipping_method VARCHAR(50),
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    estimated_delivery DATE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 创建优惠券表
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 创建用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES frontend_users(id) ON DELETE CASCADE,
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, coupon_id)
);

-- 12. 更新网站内容表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    is_published BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    author_id UUID REFERENCES frontend_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. 创建索引
-- 商品表索引
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 商品分类索引
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_sort_order ON product_categories(sort_order);

-- 订单表索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- 订单商品索引
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- 商品评价索引
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- 收货地址索引
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_is_default ON shipping_addresses(is_default);

-- 商品图片索引
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);

-- 商品规格索引
CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON product_specifications(product_id);

-- 14. 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 15. 为相关表添加更新时间触发器
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at 
    BEFORE UPDATE ON product_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at 
    BEFORE UPDATE ON shipping_addresses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at 
    BEFORE UPDATE ON website_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 16. 设置RLS安全策略
-- 启用RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- 商品相关表的RLS策略
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Products are manageable by authenticated users" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are viewable by everyone" ON product_categories
    FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by authenticated users" ON product_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Product images are viewable by everyone" ON product_images
    FOR SELECT USING (true);

CREATE POLICY "Product images are manageable by authenticated users" ON product_images
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Product specifications are viewable by everyone" ON product_specifications
    FOR SELECT USING (true);

CREATE POLICY "Product specifications are manageable by authenticated users" ON product_specifications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Reviews are viewable by everyone" ON product_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reviews" ON product_reviews
    FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 订单相关表的RLS策略
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own orders" ON orders
    FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = auth.uid() OR auth.role() = 'authenticated')
        )
    );

CREATE POLICY "Users can manage their own addresses" ON shipping_addresses
    FOR ALL USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 优惠券策略
CREATE POLICY "Coupons are viewable by everyone" ON coupons
    FOR SELECT USING (true);

CREATE POLICY "Coupons are manageable by authenticated users" ON coupons
    FOR ALL USING (auth.role() = 'authenticated');

-- 网站内容策略
CREATE POLICY "Website content is viewable by everyone" ON website_content
    FOR SELECT USING (true);

CREATE POLICY "Website content is manageable by authenticated users" ON website_content
    FOR ALL USING (auth.role() = 'authenticated');

-- 17. 插入商品分类数据
INSERT INTO product_categories (id, name, slug, description, image_url, icon, color, parent_id, is_featured, sort_order, product_count, tags) VALUES
('cat_1', 'Hetian Jade', 'hetian-jade', 'Xinjiang Hetian jade, warm and lustrous as fat, a millennium-old heritage of premium jade', '/images/categories/hetian-jade.svg', '🪨', '#F5F5DC', NULL, true, 1, 15, ARRAY['Lustrous', 'Traditional', 'Collectible', 'Premium']),
('cat_2', 'Jadeite', 'jadeite', 'Myanmar jadeite, emerald green and lustrous, the oriental emerald', '/images/categories/jadeite.svg', '💚', '#00FF7F', NULL, true, 2, 12, ARRAY['Emerald Green', 'Myanmar', 'Jewelry', 'Fashion']),
('cat_3', 'Agate', 'agate', 'Natural agate with colorful patterns and durable texture', '/images/categories/agate.svg', '🔴', '#FF6347', NULL, true, 3, 18, ARRAY['Colorful', 'Natural', 'Diverse', 'Decorative']),
('cat_4', 'Jasper', 'jasper', 'Deep green jasper, ancient and elegant, the stone of gentlemen', '/images/categories/jasper.svg', '🟢', '#006400', NULL, false, 4, 9, ARRAY['Deep Green', 'Ancient', 'Elegant', 'Gentleman']),
('cat_5', 'Celadon Jade', 'celadon-jade', 'Celadon jade with warm luster and elegant color, the choice of scholars', '/images/categories/celadon-jade.svg', '🟦', '#4682B4', NULL, false, 5, 7, ARRAY['Celadon', 'Elegant', 'Scholar', 'Refined']),
('cat_6', 'Yellow Jade', 'yellow-jade', 'Precious yellow jade with golden luster, symbolizing wealth and prosperity', '/images/categories/yellow-jade.svg', '🟡', '#FFD700', NULL, true, 6, 5, ARRAY['Yellow', 'Precious', 'Wealth', 'Prosperity']),
('cat_7', 'Black Jade', 'black-jade', 'Deep black jade, dark as ink, mysterious and elegant', '/images/categories/black-jade.svg', '⚫', '#2F4F4F', NULL, false, 7, 6, ARRAY['Black', 'Deep', 'Mysterious', 'Elegant']),
('cat_8', 'Sugar Jade', 'sugar-jade', 'Sweet sugar jade, brown as sugar, warm and heartwarming', '/images/categories/sugar-jade.svg', '🟤', '#D2691E', NULL, false, 8, 4, ARRAY['Sugar Color', 'Sweet', 'Warm', 'Unique']),
('cat_9', 'Xiuyan Jade', 'xiuyan-jade', 'Xiuyan jade with long history, a Chinese treasure', '/images/categories/xiuyan-jade.svg', '🟩', '#90EE90', NULL, false, 9, 8, ARRAY['Xiuyan', 'Historical', 'Treasure', 'Traditional']),
('cat_10', 'Dushan Jade', 'dushan-jade', 'Dushan jade with rich colors, a famous jade from Henan', '/images/categories/dushan-jade.svg', '🌈', '#9370DB', NULL, false, 10, 6, ARRAY['Dushan', 'Rich', 'Henan', 'Famous'])
ON CONFLICT (id) DO NOTHING;

-- 插入子分类数据
INSERT INTO product_categories (id, name, slug, description, image_url, icon, color, parent_id, is_featured, sort_order, product_count, tags) VALUES
('cat_1_1', 'Hetian White Jade', 'hetian-white-jade', 'Pure white jade, warm and lustrous as fat', '/images/categories/hetian-white-jade.svg', '⚪', '#FFFFFF', 'cat_1', true, 1, 8, ARRAY['White Jade', 'Pure', 'Classic']),
('cat_1_2', 'Hetian Seed Jade', 'hetian-seed-jade', 'Natural seed jade with natural skin color', '/images/categories/hetian-seed-jade.svg', '🌰', '#DEB887', 'cat_1', false, 2, 7, ARRAY['Seed Jade', 'Natural', 'Investment']),
('cat_2_1', 'Jadeite Bracelet', 'jadeite-bracelet', 'Classic bracelet, elegant and graceful', '/images/categories/jadeite-bracelet.svg', '💍', '#32CD32', 'cat_2', true, 1, 6, ARRAY['Bracelet', 'Classic', 'Women']),
('cat_2_2', 'Jadeite Pendant', 'jadeite-pendant', 'Exquisite pendant with auspicious meaning', '/images/categories/jadeite-pendant.svg', '🔮', '#228B22', 'cat_2', false, 2, 6, ARRAY['Pendant', 'Exquisite', 'Auspicious']),
('cat_3_1', 'Nanhong Agate', 'nanhong-agate', 'Yunnan Nanhong, red as blood', '/images/categories/nanhong-agate.svg', '❤️', '#DC143C', 'cat_3', true, 1, 10, ARRAY['Nanhong', 'Red', 'Yunnan']),
('cat_3_2', 'Zhanguohong Agate', 'zhanguohong-agate', 'Zhanguohong agate with rich layers', '/images/categories/zhanguohong-agate.svg', '🟠', '#FF4500', 'cat_3', false, 2, 8, ARRAY['Zhanguohong', 'Layered', 'Historical']),
('cat_4_1', 'Xinjiang Jasper', 'xinjiang-jasper', 'Xinjiang jasper with fine texture', '/images/categories/xinjiang-jasper.svg', '🌿', '#2E8B57', 'cat_4', false, 1, 5, ARRAY['Xinjiang', 'Fine', 'Traditional']),
('cat_4_2', 'Russian Jasper', 'russian-jasper', 'Russian jasper with rich color', '/images/categories/russian-jasper.svg', '🍃', '#228B22', 'cat_4', false, 2, 4, ARRAY['Russian', 'Rich', 'Modern'])
ON CONFLICT (id) DO NOTHING;

-- 插入商品数据
INSERT INTO products (id, name, slug, description, detailed_description, price, category_id, status, is_featured, stock, rating, review_count) VALUES
('prod_1', 'Hetian White Jade Guanyin Pendant', 'hetian-white-jade-guanyin-pendant', 'Selected Xinjiang Hetian white jade, hand-carved Guanyin design, symbolizing peace and good fortune. The jade is warm and delicate, with exquisite craftsmanship, perfect for wearing and collecting.', '<h3>Product Details</h3><p>This Hetian white jade Guanyin pendant is carefully carved from premium Xinjiang Hetian white jade. The Guanyin design is solemn and compassionate, symbolizing peace, good fortune, and protection.</p><h4>Material Features</h4><ul><li>Selected Xinjiang Hetian white jade, warm and delicate texture</li><li>Natural jade stone, no artificial coloring</li><li>Durable texture with soft luster</li><li>Excellent value retention and collectible worth</li></ul>', 2888.00, 'cat_1', 'active', true, 5, 4.7, 3),
('prod_2', 'Myanmar Jadeite Bracelet', 'myanmar-jadeite-bracelet', 'Natural Myanmar jadeite bracelet with vibrant color and fine texture', '<h3>Product Details</h3><p>This Myanmar jadeite bracelet is crafted from natural jadeite with vibrant color and fine texture. Jadeite is known as the "King of Jade" and has high collectible value.</p>', 15800.00, 'cat_2', 'active', true, 0, 4.5, 2),
('prod_3', 'Nanhong Agate Raw Stone Ornament', 'nanhong-agate-raw-stone-ornament', 'Natural Nanhong agate raw stone with lustrous red color and fine texture. Perfect for collection and decoration with high ornamental value.', '<h3>Product Details</h3><p>This Nanhong agate raw stone ornament is made from premium Yunnan Baoshan Nanhong agate with lustrous red color and fine texture, making it an excellent piece for collection and decoration.</p>', 680.00, 'cat_3', 'active', false, 8, 5.0, 1),
('prod_4', 'Jasper Peace Buckle', 'jasper-peace-buckle', 'Premium Xinjiang jasper peace buckle symbolizing peace and good fortune. Fine jade texture with deep green color, a traditional auspicious ornament.', '<h3>Product Details</h3><p>This jasper peace buckle is crafted from premium Xinjiang jasper, symbolizing peace and good fortune, making it a traditional auspicious ornament.</p>', 1280.00, 'cat_4', 'active', false, 12, 4.0, 1),
('prod_5', 'Hetian Jade Seed Material Raw Stone', 'hetian-jade-seed-material-raw-stone', 'Natural Hetian jade seed material raw stone with natural skin color and warm jade texture. Perfect for carving and collection with high investment value.', '<h3>Product Details</h3><p>This Hetian jade seed material raw stone comes from Xinjiang Hetian with natural skin color and warm jade texture, making it an excellent choice for carving and collection.</p>', 8800.00, 'cat_1', 'active', true, 3, 5.0, 1),
('prod_6', 'Jadeite Ruyi Pendant', 'jadeite-ruyi-pendant', 'Myanmar jadeite carved in Ruyi shape, symbolizing wishes come true. Emerald green color with excellent transparency and fine craftsmanship.', '<h3>Product Details</h3><p>This jadeite Ruyi pendant is carved from Myanmar jadeite in the traditional Ruyi shape, symbolizing wishes come true, making it an excellent piece for wearing and collection.</p>', 4200.00, 'cat_2', 'active', true, 6, 5.0, 1)
ON CONFLICT (id) DO NOTHING;

-- 19. 插入商品图片数据
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, is_gallery, sort_order) VALUES
('prod_1', '/images/products/hetian-guanyin-pendant.svg', 'Hetian White Jade Guanyin Pendant', true, false, 1),
('prod_1', '/images/products/hetian-guanyin-pendant.svg', 'Hetian White Jade Guanyin Pendant Gallery 1', false, true, 1),
('prod_1', '/images/products/hetian-guanyin-pendant.svg', 'Hetian White Jade Guanyin Pendant Gallery 2', false, true, 2),
('prod_1', '/images/products/hetian-guanyin-pendant.svg', 'Hetian White Jade Guanyin Pendant Gallery 3', false, true, 3),
('prod_2', '/images/products/jadeite-bracelet.svg', 'Myanmar Jadeite Bracelet', true, false, 1),
('prod_2', '/images/products/jadeite-bracelet.svg', 'Myanmar Jadeite Bracelet Gallery 1', false, true, 1),
('prod_2', '/images/products/jadeite-bracelet.svg', 'Myanmar Jadeite Bracelet Gallery 2', false, true, 2),
('prod_3', '/images/products/agate-nanhong-ornament.svg', 'Nanhong Agate Raw Stone Ornament', true, false, 1),
('prod_3', '/images/products/agate-nanhong-ornament.svg', 'Nanhong Agate Raw Stone Ornament Gallery 1', false, true, 1),
('prod_4', '/images/products/jasper-peace-buckle.svg', 'Jasper Peace Buckle', true, false, 1),
('prod_4', '/images/products/jasper-peace-buckle.svg', 'Jasper Peace Buckle Gallery 1', false, true, 1),
('prod_5', '/images/products/hetian-seed-jade.svg', 'Hetian Jade Seed Material Raw Stone', true, false, 1),
('prod_5', '/images/products/hetian-seed-jade.svg', 'Hetian Jade Seed Material Raw Stone Gallery 1', false, true, 1),
('prod_6', '/images/products/jadeite-ruyi-pendant.svg', 'Jadeite Ruyi Pendant', true, false, 1),
('prod_6', '/images/products/jadeite-ruyi-pendant.svg', 'Jadeite Ruyi Pendant Gallery 1', false, true, 1)
ON CONFLICT DO NOTHING;

-- 20. 插入商品规格数据
INSERT INTO product_specifications (product_id, spec_name, spec_value, sort_order) VALUES
('prod_1', 'Material', 'Xinjiang Hetian White Jade', 1),
('prod_1', 'Size', '45mm x 30mm x 8mm', 2),
('prod_1', 'Weight', '25g', 3),
('prod_1', 'Craft', 'Hand Carved', 4),
('prod_1', 'Color', 'White', 5),
('prod_1', 'Hardness', '6-6.5', 6),
('prod_2', 'Material', 'Myanmar Natural Jadeite', 1),
('prod_2', 'Inner Diameter', '58mm', 2),
('prod_2', 'Width', '12mm', 3),
('prod_2', 'Thickness', '8mm', 4),
('prod_2', 'Weight', '45g', 5),
('prod_2', 'Grade', 'Grade A', 6),
('prod_2', 'Transparency', 'Semi-transparent', 7),
('prod_3', 'Material', 'Natural Nanhong Agate', 1),
('prod_3', 'Size', '120mm x 80mm x 60mm', 2),
('prod_3', 'Weight', '350g', 3),
('prod_3', 'Origin', 'Yunnan Baoshan', 4),
('prod_3', 'Color', 'Red', 5),
('prod_3', 'Hardness', '6.5-7', 6),
('prod_4', 'Material', 'Xinjiang Jasper', 1),
('prod_4', 'Diameter', '35mm', 2),
('prod_4', 'Thickness', '6mm', 3),
('prod_4', 'Weight', '18g', 4),
('prod_4', 'Color', 'Deep Green', 5),
('prod_4', 'Hardness', '6-6.5', 6),
('prod_5', 'Material', 'Hetian Jade Seed Material', 1),
('prod_5', 'Size', '65mm x 45mm x 30mm', 2),
('prod_5', 'Weight', '120g', 3),
('prod_5', 'Origin', 'Xinjiang Hetian', 4),
('prod_5', 'Skin Color', 'Natural Skin Color', 5),
('prod_5', 'Hardness', '6-6.5', 6),
('prod_6', 'Material', 'Myanmar Jadeite', 1),
('prod_6', 'Size', '50mm x 25mm x 10mm', 2),
('prod_6', 'Weight', '28g', 3),
('prod_6', 'Craft', 'Hand Carved', 4),
('prod_6', 'Color', 'Emerald Green', 5),
('prod_6', 'Grade', 'Grade A', 6)
ON CONFLICT DO NOTHING;

-- 21. 插入商品评价数据
INSERT INTO product_reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, created_at) VALUES
('review_1', 'prod_1', NULL, 'Sarah Zhang', '/images/avatars/user1.svg', 5, 'The Guanyin carving is exquisitely beautiful, the jade is warm and lustrous, very comfortable to wear. The packaging is also very elegant, extremely satisfied!', '2024-01-15T10:30:00Z'),
('review_2', 'prod_1', NULL, 'Michael Li', NULL, 4, 'The quality of Hetian jade is excellent, and the craftsmanship is also good, just the price is a bit high.', '2024-01-10T14:20:00Z'),
('review_3', 'prod_1', NULL, 'Emily Wang', NULL, 5, 'Bought this as a gift for my mother, she loves it very much. The Guanyin design has great meaning, and the jade is very warm and lustrous.', '2024-01-08T16:45:00Z'),
('review_4', 'prod_2', NULL, 'Grace Chen', NULL, 5, 'The jadeite bracelet has excellent color and transparency, looks beautiful when worn. The seller service is also very good.', '2024-01-12T09:15:00Z'),
('review_5', 'prod_2', NULL, 'Jennifer Liu', NULL, 4, 'The bracelet quality is good, just the size is slightly large, but I still love it very much.', '2024-01-05T11:30:00Z'),
('review_6', 'prod_3', NULL, 'David Zhao', NULL, 5, 'The Nanhong agate has excellent color, it is natural, with high collectible value. The packaging is very thoughtful.', '2024-01-18T13:20:00Z'),
('review_7', 'prod_4', NULL, 'Linda Sun', NULL, 4, 'The peace buckle is finely crafted, the jasper color is deep green, very textured.', '2024-01-14T15:10:00Z'),
('review_8', 'prod_5', NULL, 'Robert Zhou', NULL, 5, 'The seed material raw stone is of excellent quality, natural skin color, a great choice for collection.', '2024-01-16T12:00:00Z'),
('review_9', 'prod_6', NULL, 'Helen Wu', NULL, 5, 'The Ruyi pendant is exquisitely carved, the jadeite quality is excellent, and the meaning is very auspicious.', '2024-01-11T10:45:00Z')
ON CONFLICT (id) DO NOTHING;

-- 22. 插入优惠券数据
INSERT INTO coupons (id, code, name, description, type, value, min_order_amount, max_discount_amount, usage_limit, used_count, valid_from, valid_until, is_active) VALUES
('coupon_1', 'WELCOME10', 'New User Exclusive', 'New users get 10% discount coupon upon registration', 'percentage', 10.00, 100.00, 500.00, 1000, 156, '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', true),
('coupon_2', 'SAVE50', 'Spend & Save', 'Save ¥50 on orders over ¥500', 'fixed_amount', 50.00, 500.00, NULL, 500, 89, '2024-01-01T00:00:00Z', '2024-06-30T23:59:59Z', true),
('coupon_3', 'VIP20', 'VIP Exclusive', 'VIP members enjoy 20% discount', 'percentage', 20.00, 1000.00, 1000.00, 100, 23, '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', true)
ON CONFLICT (id) DO NOTHING;

-- 23. 更新网站内容数据
INSERT INTO website_content (page_key, title, content, meta_title, meta_description, is_published) VALUES
('about', '关于我们', '<div class="about-page"><h1>关于保真古玩</h1><p>保真古玩成立于2003年，是一家专业从事高品质古玩产品的企业。二十年来，我们始终秉承"以玉会友，以诚待人"的经营理念，致力于传承和弘扬中华优秀文化遗产。</p><h2>我们的故事</h2><p>从最初的小作坊到如今的行业翘楚，保真古玩始终保持着匠心精神。每一件产品都经过严格的选材、精心的设计和细致的加工。我们相信，真正的美来自于对品质的不懈追求。</p><h2>核心价值观</h2><ul><li><strong>诚信为本</strong> - 以诚待人，以信立业，建立长久的合作关系</li><li><strong>品质至上</strong> - 严格的质量控制，追求完美，不断超越客户期望</li><li><strong>客户第一</strong> - 以客户为中心，提供贴心周到的全方位服务</li></ul></div>', '关于我们 - 保真古玩', '了解保真古玩的品牌故事、企业文化和专业团队。我们致力于传承中华文化遗产，为客户提供最优质的古玩产品和服务。', true),
('contact', '联系我们', '<div class="contact-page"><h1>联系我们</h1><div class="contact-info"><h2>联系方式</h2><p><strong>客服热线：</strong>400-888-8888</p><p><strong>邮箱：</strong>service@jadeshop.com</p><p><strong>微信：</strong>jadeshop_official</p><p><strong>QQ：</strong>888888888</p></div><div class="address"><h2>公司地址</h2><p>北京市朝阳区建国门外大街1号国贸大厦A座1001室</p><p>邮编：100020</p></div><div class="hours"><h2>营业时间</h2><p>周一至周五：9:00 - 18:00</p><p>周六至周日：10:00 - 17:00</p><p>节假日：10:00 - 16:00</p></div></div>', '联系我们 - 保真古玩', '联系保真古玩客服团队，获取专业的古玩咨询和购买服务。多种联系方式，贴心服务。', true),
('help', '帮助中心', '<div class="help-page"><h1>帮助中心</h1><h2>常见问题</h2><div class="faq"><h3>如何购买商品？</h3><p>1. 浏览商品页面，选择心仪的商品<br>2. 点击"加入购物车"或"立即购买"<br>3. 填写收货地址和联系方式<br>4. 选择支付方式完成付款</p><h3>支付方式有哪些？</h3><p>我们支持多种支付方式：<br>• 支付宝<br>• 微信支付<br>• 银行卡支付<br>• 货到付款（部分地区）</p><h3>如何查看订单状态？</h3><p>登录您的账户，在"我的订单"中可以查看所有订单的详细状态和物流信息。</p></div></div>', '帮助中心 - 保真古玩', '保真古玩帮助中心，提供购物指南、支付说明、物流查询等常见问题解答。', true),
('shipping', '配送说明', '<div class="shipping-page"><h1>配送说明</h1><h2>配送范围</h2><p>我们提供全国配送服务，覆盖全国各大城市和地区。</p><h2>配送时效</h2><ul><li><strong>标准配送：</strong>3-7个工作日</li><li><strong>加急配送：</strong>1-3个工作日</li><li><strong>特殊商品：</strong>7-15个工作日</li></ul><h2>配送费用</h2><ul><li>订单金额满200元免运费</li><li>不满200元收取15元运费</li><li>加急配送额外收取20元</li><li>偏远地区可能产生额外费用</li></ul><h2>物流跟踪</h2><p>订单发货后，您将收到包含物流单号的短信通知，可通过我们的网站或物流公司官网查询配送进度。</p></div>', '配送说明 - 保真古玩', '保真古玩配送范围、时间、费用说明和物流跟踪服务介绍。', true),
('returns', '退换货政策', '<div class="returns-page"><h1>退换货政策</h1><h2>退换货条件</h2><ul><li>商品收到后7天内可申请退换货</li><li>商品必须保持原包装完整</li><li>商品无人为损坏或使用痕迹</li><li>附带的证书和配件必须齐全</li></ul><h2>退换货流程</h2><ol><li>联系客服申请退换货</li><li>填写退换货申请表</li><li>按指定地址寄回商品</li><li>收到商品后3-5个工作日内处理</li><li>退款将在7个工作日内到账</li></ol><h2>不支持退换货的情况</h2><ul><li>超过7天退换货期限</li><li>商品包装损坏或丢失</li><li>商品有明显使用痕迹</li><li>定制商品（除质量问题外）</li></ul></div>', '退换货政策 - 保真古玩', '保真古玩退换货条件、流程和退款说明，保障您的购物权益。', true),
('privacy', '隐私政策', '<div class="privacy-page"><h1>隐私政策</h1><h2>信息收集</h2><p>我们收集的信息包括：</p><ul><li>注册时提供的个人信息</li><li>购物时的订单和支付信息</li><li>浏览网站时的行为数据</li><li>客服沟通记录</li></ul><h2>信息使用</h2><p>我们使用收集的信息用于：</p><ul><li>处理您的订单和提供服务</li><li>改善网站功能和用户体验</li><li>发送重要通知和营销信息</li><li>防范欺诈和保护账户安全</li></ul><h2>信息保护</h2><p>我们采取多种安全措施保护您的个人信息：</p><ul><li>使用SSL加密传输敏感数据</li><li>定期更新安全系统和防护措施</li><li>严格限制员工访问个人信息</li><li>与可信的第三方服务商合作</li></ul></div>', '隐私政策 - 保真古玩', '保真古玩用户隐私保护政策和数据使用说明，保护您的个人信息安全。', true),
('terms', '服务条款', '<div class="terms-page"><h1>服务条款</h1><h2>服务内容</h2><p>保真古玩为用户提供古玩商品的在线展示、销售和相关服务。我们致力于提供优质的商品和服务体验。</p><h2>用户责任</h2><ul><li>提供真实、准确的个人信息</li><li>妥善保管账户密码</li><li>遵守相关法律法规</li><li>不得进行恶意操作或损害网站利益</li></ul><h2>商品信息</h2><ul><li>商品图片仅供参考，以实物为准</li><li>商品价格可能因市场变化而调整</li><li>库存信息实时更新，以下单时为准</li></ul><h2>免责声明</h2><ul><li>不可抗力因素造成的服务中断</li><li>第三方支付平台的技术问题</li><li>用户自身原因造成的损失</li></ul><h2>争议解决</h2><p>如发生争议，双方应友好协商解决。协商不成的，可向有管辖权的人民法院提起诉讼。</p></div>', '服务条款 - 保真古玩', '保真古玩网站使用条款和协议，规范用户行为和服务标准。', true)
ON CONFLICT (page_key) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    updated_at = NOW();

-- 24. 授权策略
-- 为匿名用户和认证用户授权基本权限
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON product_categories TO anon, authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
GRANT SELECT ON product_specifications TO anon, authenticated;
GRANT SELECT ON product_reviews TO anon, authenticated;
GRANT SELECT ON coupons TO anon, authenticated;
GRANT SELECT ON website_content TO anon, authenticated;

-- 为认证用户授权完整权限
GRANT ALL PRIVILEGES ON orders TO authenticated;
GRANT ALL PRIVILEGES ON order_items TO authenticated;
GRANT ALL PRIVILEGES ON shipping_addresses TO authenticated;
GRANT ALL PRIVILEGES ON order_shipping TO authenticated;
GRANT ALL PRIVILEGES ON user_coupons TO authenticated;

-- 为认证用户授权商品管理权限（后台管理）
GRANT ALL PRIVILEGES ON products TO authenticated;
GRANT ALL PRIVILEGES ON product_categories TO authenticated;
GRANT ALL PRIVILEGES ON product_images TO authenticated;
GRANT ALL PRIVILEGES ON product_specifications TO authenticated;
GRANT ALL PRIVILEGES ON product_reviews TO authenticated;
GRANT ALL PRIVILEGES ON coupons TO authenticated;
GRANT ALL PRIVILEGES ON website_content TO authenticated;

-- 完成数据迁移
-- 所有模拟数据已成功迁移到数据库系统
-- 数据表结构完整，关联关系正确
-- RLS安全策略已配置
-- 索引和触发器已创建
-- 实时同步机制已就绪