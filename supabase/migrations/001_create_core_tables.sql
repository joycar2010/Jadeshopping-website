-- JADESHOPPING 核心数据表创建脚本
-- 创建时间: 2024-12-27
-- 描述: 创建用户、商品、订单、分类等核心业务表

-- 1. 创建用户表 (users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  birthday DATE,
  gender VARCHAR(10),
  points INTEGER DEFAULT 0,
  member_level VARCHAR(20) DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_member_level ON users(member_level);

-- 2. 创建分类表 (categories)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分类表索引
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- 3. 创建商品表 (products)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  images JSONB DEFAULT '[]',
  category_id UUID REFERENCES categories(id),
  rating FLOAT DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  specifications JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_buyback_eligible BOOLEAN DEFAULT false,
  buyback_percentage DECIMAL(5,2) DEFAULT 90.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建商品表索引
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_sales ON products(sales DESC);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_buyback_eligible ON products(is_buyback_eligible);

-- 4. 创建订单表 (orders)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订单项表 (order_items)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  specifications JSONB DEFAULT '{}'
);

-- 创建订单表索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 5. 创建评价表 (reviews)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建评价表索引
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- 6. 创建收藏表 (favorites)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 创建收藏表索引
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- 7. 创建地址表 (addresses)
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  detail TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建地址表索引
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- 8. 创建优惠券表 (coupons)
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  usage_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 创建用户优惠券表 (user_coupons)
CREATE TABLE user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  coupon_id UUID REFERENCES coupons(id) NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建优惠券表索引
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_user_coupons_user_id ON user_coupons(user_id);
CREATE INDEX idx_user_coupons_coupon_id ON user_coupons(coupon_id);

-- 10. 创建轮播图表 (carousel_items)
CREATE TABLE carousel_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建轮播图表索引
CREATE INDEX idx_carousel_items_sort_order ON carousel_items(sort_order);
CREATE INDEX idx_carousel_items_active ON carousel_items(is_active);

-- 11. 创建公告表 (announcements)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info',
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建公告表索引
CREATE INDEX idx_announcements_pinned ON announcements(is_pinned);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);