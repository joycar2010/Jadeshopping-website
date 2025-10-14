-- Insert Mock Data Migration Script
-- This script inserts all mock data from mockData.ts into the database

-- First, let's create temporary variables to store UUIDs for consistent referencing
DO $$
DECLARE
    cat_1_id UUID := gen_random_uuid();
    cat_2_id UUID := gen_random_uuid();
    cat_3_id UUID := gen_random_uuid();
    cat_4_id UUID := gen_random_uuid();
    cat_5_id UUID := gen_random_uuid();
    cat_6_id UUID := gen_random_uuid();
    cat_7_id UUID := gen_random_uuid();
    cat_8_id UUID := gen_random_uuid();
    cat_9_id UUID := gen_random_uuid();
    cat_10_id UUID := gen_random_uuid();
    cat_3_1_id UUID := gen_random_uuid();
    cat_3_2_id UUID := gen_random_uuid();
    cat_4_1_id UUID := gen_random_uuid();
    cat_4_2_id UUID := gen_random_uuid();
    
    prod_1_id UUID := gen_random_uuid();
    prod_2_id UUID := gen_random_uuid();
    prod_3_id UUID := gen_random_uuid();
    prod_4_id UUID := gen_random_uuid();
    prod_5_id UUID := gen_random_uuid();
    prod_6_id UUID := gen_random_uuid();
    
    user_1_id UUID := gen_random_uuid();
    user_2_id UUID := gen_random_uuid();
    user_3_id UUID := gen_random_uuid();
    
    addr_1_id UUID := gen_random_uuid();
    addr_2_id UUID := gen_random_uuid();
    addr_3_id UUID := gen_random_uuid();
    
    coupon_1_id UUID := gen_random_uuid();
    coupon_2_id UUID := gen_random_uuid();
    coupon_3_id UUID := gen_random_uuid();
    
    order_1_id UUID := gen_random_uuid();
    order_2_id UUID := gen_random_uuid();
    order_3_id UUID := gen_random_uuid();
    order_4_id UUID := gen_random_uuid();
    order_5_id UUID := gen_random_uuid();
BEGIN
    -- Insert Categories
    INSERT INTO categories (id, name, slug, description, image_url, icon, color, product_count, is_featured, sort_order, tags, parent_id, created_at, updated_at) VALUES
    -- Main Categories
    (cat_1_id, 'Hetian Jade', 'hetian-jade', 'Premium Hetian jade from Xinjiang, known for its warm texture and cultural significance', '/images/categories/hetian-jade.svg', '💎', '#E8F5E8', 15, true, 1, '["jade", "hetian", "premium", "xinjiang"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_2_id, 'Jadeite', 'jadeite', 'Myanmar jadeite with vibrant colors and excellent transparency', '/images/categories/jadeite.svg', '💚', '#E8F8F5', 12, true, 2, '["jadeite", "myanmar", "emerald", "jewelry"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_3_id, 'Agate', 'agate', 'Beautiful agate stones with rich colors and patterns', '/images/categories/agate.svg', '🔴', '#FFF5F5', 18, true, 3, '["agate", "colorful", "patterns"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_4_id, 'Jasper', 'jasper', 'Natural jasper stones with unique textures and colors', '/images/categories/jasper.svg', '🟤', '#FFF8E1', 10, true, 4, '["jasper", "natural", "texture"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_5_id, 'Celadon Jade', 'celadon-jade', 'Traditional celadon jade with elegant green hues', '/images/categories/celadon-jade.svg', '🟢', '#F0F8F0', 8, false, 5, '["celadon", "traditional", "green"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_6_id, 'Yellow Jade', 'yellow-jade', 'Rare yellow jade with golden luster', '/images/categories/yellow-jade.svg', '🟡', '#FFFBF0', 6, false, 6, '["yellow", "golden", "rare"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_7_id, 'Black Jade', 'black-jade', 'Mysterious black jade with deep color', '/images/categories/black-jade.svg', '⚫', '#F5F5F5', 4, false, 7, '["black", "mysterious", "deep"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_8_id, 'Sugar Jade', 'sugar-jade', 'Sweet sugar jade with natural patterns', '/images/categories/sugar-jade.svg', '🤎', '#FFF8F0', 5, false, 8, '["sugar", "sweet", "patterns"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_9_id, 'Xiuyan Jade', 'xiuyan-jade', 'Traditional Xiuyan jade from Liaoning', '/images/categories/xiuyan-jade.svg', '🟩', '#F0FFF0', 7, false, 9, '["xiuyan", "liaoning", "traditional"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_10_id, 'Dushan Jade', 'dushan-jade', 'Colorful Dushan jade with multiple hues', '/images/categories/dushan-jade.svg', '🌈', '#F8F8FF', 9, false, 10, '["dushan", "colorful", "multiple"]'::jsonb, NULL, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    -- Subcategories for Agate
    (cat_3_1_id, 'Nanhong Agate', 'nanhong-agate', 'Premium Nanhong agate from Yunnan with deep red color', '/images/categories/nanhong-agate.svg', '🔴', '#FFE8E8', 8, true, 31, '["nanhong", "yunnan", "red", "premium"]'::jsonb, cat_3_id, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_3_2_id, 'Zhanguohong Agate', 'zhanguohong-agate', 'Ancient Zhanguohong agate with historical significance', '/images/categories/zhanguohong-agate.svg', '🟤', '#FFF0E8', 5, false, 32, '["zhanguohong", "ancient", "historical"]'::jsonb, cat_3_id, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    -- Subcategories for Jasper
    (cat_4_1_id, 'Xinjiang Jasper', 'xinjiang-jasper', 'High-quality jasper from Xinjiang region', '/images/categories/xinjiang-jasper.svg', '🟫', '#FFF5E8', 6, true, 41, '["xinjiang", "quality", "region"]'::jsonb, cat_4_id, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (cat_4_2_id, 'Russian Jasper', 'russian-jasper', 'Exotic Russian jasper with unique patterns', '/images/categories/russian-jasper.svg', '🟨', '#FFFEF0', 4, false, 42, '["russian", "exotic", "patterns"]'::jsonb, cat_4_id, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

    -- Insert Users (note: users table has 'name' field, not 'full_name' and 'username')
    INSERT INTO users (id, email, name, phone, avatar_url, created_at, updated_at) VALUES
    (user_1_id, 'admin@jade.com', 'Administrator', '13800138000', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (user_2_id, 'user@jade.com', 'Zhang San', '13900139000', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', '2024-01-02T00:00:00Z', '2024-01-02T00:00:00Z'),
    (user_3_id, 'test@jade.com', 'Li Si', '13700137000', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', '2024-01-03T00:00:00Z', '2024-01-03T00:00:00Z');

    -- Insert User Addresses
    INSERT INTO addresses (id, user_id, full_name, phone, street, city, state, country, postal_code, is_default, created_at, updated_at) VALUES
    (addr_1_id, user_1_id, 'Zhang San', '13800138000', 'Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue', 'Beijing', 'Beijing', 'China', '100020', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (addr_2_id, user_1_id, 'Li Si', '13900139000', '20F, Hang Seng Bank Tower, 1000 Lujiazui Ring Road', 'Shanghai', 'Shanghai', 'China', '200120', false, '2024-01-02T00:00:00Z', '2024-01-02T00:00:00Z'),
    (addr_3_id, user_1_id, 'Wang Wu', '13700137000', 'No.9988 Shennan Avenue, South District, Science Park', 'Shenzhen', 'Guangdong Province', 'China', '518000', false, '2024-01-03T00:00:00Z', '2024-01-03T00:00:00Z');

    -- Insert coupons data
INSERT INTO coupons (id, code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, valid_from, valid_until, is_active, created_at, updated_at) VALUES
    (coupon_1_id, 'WELCOME10', 'New User Exclusive', 'New users get 10% discount coupon upon registration', 'percentage', 10, 100, 500, 1000, 156, '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (coupon_2_id, 'SAVE50', 'Spend & Save', 'Save ¥50 on orders over ¥500', 'fixed_amount', 50, 500, NULL, 500, 89, '2024-01-01T00:00:00Z', '2024-06-30T23:59:59Z', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    (coupon_3_id, 'VIP20', 'VIP Exclusive', 'VIP members enjoy 20% discount', 'percentage', 20, 1000, 1000, 100, 23, '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

    -- Insert Products
    INSERT INTO products (id, name, slug, description, detailed_description, price, category_id, images, gallery_images, specifications, rating, review_count, related_products, is_active, stock_quantity, is_featured, created_at, updated_at) VALUES
    (prod_1_id, 'Hetian White Jade Guanyin Pendant', 'hetian-guanyin-pendant', 'Selected Xinjiang Hetian jade seed material carved Guanyin pendant, symbolizing peace and good fortune with exquisite craftsmanship and warm jade texture.', '<h3>Product Details</h3><p>This Hetian white jade Guanyin pendant is carved from selected Xinjiang Hetian jade seed material, symbolizing peace and good fortune, making it an excellent choice for wearing and collection.</p><h4>Jade Features</h4><ul><li>Xinjiang Hetian jade seed material</li><li>Warm and fine jade texture</li><li>Exquisite hand carving craftsmanship</li><li>Guanyin image with auspicious meaning</li></ul>', 2880, cat_1_id, '["/images/products/hetian-guanyin-pendant.svg"]'::jsonb, '["/images/products/hetian-guanyin-pendant.svg", "/images/products/hetian-guanyin-pendant.svg"]'::jsonb, '{"material": "Hetian Jade Seed Material", "size": "45mm x 30mm x 8mm", "weight": "25g", "craft": "Hand Carved", "color": "White", "grade": "Premium"}'::jsonb, 4.8, 5, '[]'::jsonb, true, 5, true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (prod_2_id, 'Myanmar Jadeite Bracelet', 'myanmar-jadeite-bracelet', 'Myanmar Grade A jadeite bracelet with excellent transparency and vibrant green color, perfect for daily wear and collection.', '<h3>Product Details</h3><p>This Myanmar jadeite bracelet is made from Grade A jadeite with excellent transparency and vibrant green color, making it perfect for daily wear and collection.</p><h4>Jadeite Features</h4><ul><li>Myanmar natural jadeite</li><li>Grade A quality certification</li><li>Excellent transparency</li><li>Vibrant emerald green color</li></ul>', 6800, cat_2_id, '["/images/products/myanmar-jadeite-bracelet.svg"]'::jsonb, '["/images/products/myanmar-jadeite-bracelet.svg", "/images/products/myanmar-jadeite-bracelet.svg"]'::jsonb, '{"material": "Myanmar Jadeite", "inner_diameter": "58mm", "width": "12mm", "thickness": "8mm", "weight": "65g", "grade": "Grade A"}'::jsonb, 4.9, 3, '[]'::jsonb, true, 8, true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (prod_3_id, 'Nanhong Agate Raw Stone Ornament', 'nanhong-agate-ornament', 'Yunnan Baoshan Nanhong agate raw stone ornament with natural red color and excellent texture, perfect for collection and display.', '<h3>Product Details</h3><p>This Nanhong agate raw stone ornament comes from Yunnan Baoshan with natural red color and excellent texture, making it perfect for collection and display.</p><h4>Agate Features</h4><ul><li>Yunnan Baoshan origin</li><li>Natural deep red color</li><li>Excellent texture and luster</li><li>High collectible value</li></ul>', 1580, cat_3_1_id, '["/images/products/nanhong-agate-ornament.svg"]'::jsonb, '["/images/products/nanhong-agate-ornament.svg", "/images/products/nanhong-agate-ornament.svg"]'::jsonb, '{"material": "Nanhong Agate", "size": "80mm x 60mm x 40mm", "weight": "180g", "origin": "Yunnan Baoshan", "color": "Deep Red", "hardness": "6.5-7"}'::jsonb, 4.7, 2, '[]'::jsonb, true, 15, false, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (prod_4_id, 'Jasper Peace Buckle', 'jasper-peace-buckle', 'Xinjiang jasper carved peace buckle symbolizing peace and health with traditional Chinese cultural significance.', '<h3>Product Details</h3><p>This jasper peace buckle is carved from Xinjiang jasper in the traditional peace buckle shape, symbolizing peace and health with deep cultural significance.</p><h4>Jasper Features</h4><ul><li>Xinjiang natural jasper</li><li>Traditional peace buckle shape</li><li>Symbolizes peace and health</li><li>Deep cultural significance</li></ul>', 790, cat_4_1_id, '["/images/products/jasper-peace-buckle.svg"]'::jsonb, '["/images/products/jasper-peace-buckle.svg", "/images/products/jasper-peace-buckle.svg"]'::jsonb, '{"material": "Xinjiang Jasper", "diameter": "35mm", "thickness": "6mm", "weight": "18g", "color": "Deep Green", "hardness": "6-6.5"}'::jsonb, 4.0, 1, '[]'::jsonb, true, 12, false, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (prod_5_id, 'Hetian Jade Seed Material Raw Stone', 'hetian-seed-jade', 'Natural Hetian jade seed material raw stone with natural skin color and warm jade texture. Perfect for carving and collection with high investment value.', '<h3>Product Details</h3><p>This Hetian jade seed material raw stone comes from Xinjiang Hetian with natural skin color and warm jade texture, making it an excellent choice for carving and collection.</p><h4>Seed Material Features</h4><ul><li>Xinjiang Hetian seed material</li><li>Natural beautiful skin color</li><li>Warm and fine jade texture</li><li>High investment and collectible value</li></ul>', 8800, cat_1_id, '["/images/products/hetian-seed-jade.svg"]'::jsonb, '["/images/products/hetian-seed-jade.svg", "/images/products/hetian-seed-jade.svg"]'::jsonb, '{"material": "Hetian Jade Seed Material", "size": "65mm x 45mm x 30mm", "weight": "120g", "origin": "Xinjiang Hetian", "skin_color": "Natural Skin Color", "hardness": "6-6.5"}'::jsonb, 5.0, 1, '[]'::jsonb, true, 3, true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (prod_6_id, 'Jadeite Ruyi Pendant', 'jadeite-ruyi-pendant', 'Myanmar jadeite carved in Ruyi shape, symbolizing wishes come true. Emerald green color with excellent transparency and fine craftsmanship.', '<h3>Product Details</h3><p>This jadeite Ruyi pendant is carved from Myanmar jadeite in the traditional Ruyi shape, symbolizing wishes come true, making it an excellent piece for wearing and collection.</p><h4>Jadeite Features</h4><ul><li>Myanmar natural jadeite</li><li>Vibrant emerald green color</li><li>Excellent transparency</li><li>Ruyi shape with auspicious meaning</li></ul>', 4200, cat_2_id, '["/images/products/jadeite-ruyi-pendant.svg"]'::jsonb, '["/images/products/jadeite-ruyi-pendant.svg", "/images/products/jadeite-ruyi-pendant.svg"]'::jsonb, '{"material": "Myanmar Jadeite", "size": "50mm x 25mm x 10mm", "weight": "28g", "craft": "Hand Carved", "color": "Emerald Green", "grade": "Grade A"}'::jsonb, 5.0, 1, '[]'::jsonb, true, 6, true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

    -- Update related products with actual UUIDs
    UPDATE products SET related_products = jsonb_build_array(prod_2_id::text, prod_5_id::text, prod_6_id::text) WHERE id = prod_1_id;
    UPDATE products SET related_products = jsonb_build_array(prod_1_id::text, prod_6_id::text, prod_3_id::text) WHERE id = prod_2_id;
    UPDATE products SET related_products = jsonb_build_array(prod_4_id::text, prod_1_id::text, prod_5_id::text) WHERE id = prod_3_id;
    UPDATE products SET related_products = jsonb_build_array(prod_1_id::text, prod_5_id::text, prod_3_id::text) WHERE id = prod_4_id;
    UPDATE products SET related_products = jsonb_build_array(prod_1_id::text, prod_4_id::text, prod_6_id::text) WHERE id = prod_5_id;
    UPDATE products SET related_products = jsonb_build_array(prod_2_id::text, prod_1_id::text, prod_4_id::text) WHERE id = prod_6_id;

    -- Insert Orders
    INSERT INTO orders (id, user_id, total_amount, status, shipping_address, payment_method, payment_status, created_at, updated_at) VALUES
    (order_1_id, user_1_id, 3580, 'delivered', '{"id": "addr_1", "full_name": "Zhang San", "phone": "13800138000", "street": "Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue", "city": "Beijing", "state": "Beijing", "country": "China", "postal_code": "100020", "is_default": true}'::jsonb, 'credit_card', 'paid', '2024-01-15T10:30:00Z', '2024-01-20T16:45:00Z'),
    (order_2_id, user_1_id, 4200, 'shipped', '{"id": "addr_2", "full_name": "Li Si", "phone": "13900139000", "street": "20F, Hang Seng Bank Tower, 1000 Lujiazui Ring Road", "city": "Shanghai", "state": "Shanghai", "country": "China", "postal_code": "200120", "is_default": false}'::jsonb, 'paypal', 'paid', '2024-01-18T14:20:00Z', '2024-01-22T09:15:00Z'),
    (order_3_id, user_1_id, 1580, 'processing', '{"id": "addr_1", "full_name": "Zhang San", "phone": "13800138000", "street": "Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue", "city": "Beijing", "state": "Beijing", "country": "China", "postal_code": "100020", "is_default": true}'::jsonb, 'balance', 'paid', '2024-01-25T11:45:00Z', '2024-01-25T11:45:00Z'),
    (order_4_id, user_1_id, 6800, 'pending', '{"id": "addr_3", "full_name": "Wang Wu", "phone": "13700137000", "street": "No.9988 Shennan Avenue, South District, Science Park", "city": "Shenzhen", "state": "Guangdong Province", "country": "China", "postal_code": "518000", "is_default": false}'::jsonb, 'apple_pay', 'pending', '2024-01-28T16:30:00Z', '2024-01-28T16:30:00Z'),
    (order_5_id, user_1_id, 2350, 'cancelled', '{"id": "addr_1", "full_name": "Zhang San", "phone": "13800138000", "street": "Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue", "city": "Beijing", "state": "Beijing", "country": "China", "postal_code": "100020", "is_default": true}'::jsonb, 'credit_card', 'refunded', '2024-01-10T09:20:00Z', '2024-01-12T14:30:00Z');

    -- Insert order items data
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
    (gen_random_uuid(), order_1_id, prod_1_id, 1, 2880, 2880, '2024-01-15T10:30:00Z'),
    (gen_random_uuid(), order_1_id, prod_3_id, 1, 700, 700, '2024-01-15T10:30:00Z'),
    (gen_random_uuid(), order_2_id, prod_6_id, 1, 4200, 4200, '2024-01-18T14:20:00Z'),
    (gen_random_uuid(), order_3_id, prod_4_id, 2, 790, 1580, '2024-01-25T11:45:00Z'),
    (gen_random_uuid(), order_4_id, prod_2_id, 1, 6800, 6800, '2024-01-28T16:30:00Z'),
    (gen_random_uuid(), order_5_id, prod_5_id, 1, 2350, 2350, '2024-01-10T09:20:00Z');

    -- Insert Reviews
    INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, comment, images, created_at) VALUES
    (gen_random_uuid(), prod_1_id, user_2_id, 'Li Si', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20woman%20smiling&image_size=square', 5, 'The jade texture is very warm and the carving is exquisite. Very satisfied with this purchase!', '[]'::jsonb, '2024-01-16T10:00:00Z'),
    (gen_random_uuid(), prod_1_id, user_3_id, 'Wang Wu', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20man%20smiling&image_size=square', 5, 'The Guanyin carving is very detailed, and the jade quality is excellent. Highly recommended!', '[]'::jsonb, '2024-01-18T14:30:00Z'),
    (gen_random_uuid(), prod_1_id, user_1_id, 'Zhang San', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20person%20smiling&image_size=square', 5, 'Authentic Hetian jade with beautiful texture. The pendant has great cultural significance.', '[]'::jsonb, '2024-01-20T09:15:00Z'),
    (gen_random_uuid(), prod_1_id, user_2_id, 'Li Si', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20woman%20smiling&image_size=square', 4, 'Good quality jade at reasonable price. The carving could be slightly better but overall satisfied.', '[]'::jsonb, '2024-01-22T16:45:00Z'),
    (gen_random_uuid(), prod_1_id, user_3_id, 'Wang Wu', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20man%20smiling&image_size=square', 5, 'Bought this as a gift and the recipient loved it. Beautiful packaging and excellent quality.', '[]'::jsonb, '2024-01-25T11:20:00Z'),

    (gen_random_uuid(), prod_2_id, user_1_id, 'Zhang San', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20person%20smiling&image_size=square', 5, 'The jadeite color is absolutely beautiful and the transparency is excellent. Worth every penny!', '[]'::jsonb, '2024-01-17T12:00:00Z'),
    (gen_random_uuid(), prod_2_id, user_2_id, 'Li Si', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20woman%20smiling&image_size=square', 5, 'Authentic Myanmar jadeite with certificate. The green color is vibrant and natural.', '[]'::jsonb, '2024-01-19T15:30:00Z'),
    (gen_random_uuid(), prod_2_id, user_3_id, 'Wang Wu', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20man%20smiling&image_size=square', 4, 'The bracelet is beautiful but quite pricey. Quality is good though.', '[]'::jsonb, '2024-01-21T10:45:00Z'),

    (gen_random_uuid(), prod_3_id, user_1_id, 'Zhang San', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20person%20smiling&image_size=square', 5, 'The red color is deep and natural. Perfect for my collection!', '[]'::jsonb, '2024-01-19T13:20:00Z'),
    (gen_random_uuid(), prod_3_id, user_2_id, 'Li Si', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20woman%20smiling&image_size=square', 4, 'Nice piece for collection. The texture is good but could be more lustrous.', '[]'::jsonb, '2024-01-23T16:10:00Z'),

    (gen_random_uuid(), prod_4_id, user_3_id, 'Wang Wu', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20man%20smiling&image_size=square', 4, 'Classic peace buckle design with good jasper quality. Reasonably priced.', '[]'::jsonb, '2024-01-26T14:00:00Z'),

    (gen_random_uuid(), prod_5_id, user_1_id, 'Zhang San', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20person%20smiling&image_size=square', 5, 'Excellent seed material with natural skin. Great for carving or investment.', '[]'::jsonb, '2024-01-24T11:30:00Z'),

    (gen_random_uuid(), prod_6_id, user_2_id, 'Li Si', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20of%20asian%20woman%20smiling&image_size=square', 5, 'The Ruyi shape is perfectly carved and the jadeite quality is top-notch.', '[]'::jsonb, '2024-01-27T09:45:00Z');

    -- Insert Content Pages
    INSERT INTO content_pages (id, page_key, title, content, meta_title, meta_description, is_published, created_at, updated_at) VALUES
    (gen_random_uuid(), 'about', 'About Us', '<h1>About Jade Shopping</h1><p>Welcome to Jade Shopping, your premier destination for authentic Chinese jade and precious stones. With over 20 years of experience in the jade industry, we specialize in bringing you the finest quality Hetian jade, Myanmar jadeite, and other precious stones directly from their sources.</p><h2>Our Mission</h2><p>To preserve and share the beauty of traditional Chinese jade culture while providing authentic, high-quality jade products to collectors and enthusiasts worldwide.</p><h2>Our Expertise</h2><p>Our team consists of certified gemologists and experienced jade artisans who carefully select each piece for its quality, authenticity, and cultural significance.</p>', 'About Jade Shopping', 'Learn about Jade Shopping - your trusted source for authentic Chinese jade and precious stones with over 20 years of expertise.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (gen_random_uuid(), 'contact', 'Contact Us', '<h1>Contact Information</h1><p>We are here to help you with any questions about our jade products or services.</p><h2>Store Location</h2><p>123 Jade Street, Beijing, China 100001</p><h2>Business Hours</h2><p>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 5:00 PM<br>Sunday: Closed</p><h2>Contact Details</h2><p>Phone: +86 10 1234 5678<br>Email: info@jadeshopping.com<br>WeChat: JadeShopping2024</p>', 'Contact Jade Shopping', 'Contact Jade Shopping for inquiries about authentic jade products. Find our store location, hours, and contact information.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (gen_random_uuid(), 'help', 'Help Center', '<h1>Help Center</h1><h2>Frequently Asked Questions</h2><h3>How do I verify jade authenticity?</h3><p>All our jade products come with certificates of authenticity from recognized gemological institutes.</p><h3>What is your return policy?</h3><p>We offer a 30-day return policy for all products in original condition.</p><h3>Do you ship internationally?</h3><p>Yes, we ship worldwide with secure packaging and insurance.</p><h2>Jade Care Instructions</h2><p>Keep your jade clean with soft cloth and avoid harsh chemicals. Store separately to prevent scratching.</p>', 'Help Center - Jade Shopping', 'Find answers to common questions about jade products, authenticity, returns, and care instructions in our help center.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (gen_random_uuid(), 'shipping', 'Shipping Information', '<h1>Shipping & Delivery</h1><h2>Shipping Methods</h2><p>We offer multiple shipping options to meet your needs:</p><ul><li>Standard Shipping (5-7 business days)</li><li>Express Shipping (2-3 business days)</li><li>Overnight Delivery (1 business day)</li></ul><h2>International Shipping</h2><p>We ship to over 50 countries worldwide. International orders may be subject to customs duties and taxes.</p><h2>Packaging</h2><p>All jade products are carefully packaged with protective materials and elegant gift boxes.</p>', 'Shipping Information - Jade Shopping', 'Learn about our shipping options, delivery times, and international shipping policies for jade products.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (gen_random_uuid(), 'returns', 'Returns & Exchanges', '<h1>Returns & Exchanges</h1><h2>Return Policy</h2><p>We want you to be completely satisfied with your purchase. If you are not happy with your jade product, you may return it within 30 days of delivery.</p><h2>Return Conditions</h2><ul><li>Items must be in original condition</li><li>Original packaging and certificates must be included</li><li>Custom or personalized items cannot be returned</li></ul><h2>Return Process</h2><p>Contact our customer service team to initiate a return. We will provide you with a return authorization and shipping label.</p>', 'Returns & Exchanges - Jade Shopping', 'Understand our return and exchange policy for jade products, including conditions and process for returns.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (gen_random_uuid(), 'privacy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Last updated: January 1, 2024</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p><h2>Information Sharing</h2><p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p><h2>Data Security</h2><p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>', 'Privacy Policy - Jade Shopping', 'Read our privacy policy to understand how we collect, use, and protect your personal information when shopping for jade products.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

    (gen_random_uuid(), 'terms', 'Terms of Service', '<h1>Terms of Service</h1><p>Last updated: January 1, 2024</p><h2>Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>Product Information</h2><p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p><h2>Pricing and Payment</h2><p>All prices are subject to change without notice. Payment must be received before products are shipped.</p><h2>Limitation of Liability</h2><p>In no event shall Jade Shopping be liable for any indirect, incidental, special, or consequential damages.</p>', 'Terms of Service - Jade Shopping', 'Read our terms of service to understand the rules and regulations for using our jade shopping website and services.', true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

    -- Update category product counts based on inserted products
    UPDATE categories SET product_count = (
        SELECT COUNT(*) FROM products WHERE category_id = categories.id AND is_active = true
    );

    -- Update parent category product counts (sum of subcategory counts)
    UPDATE categories SET product_count = (
        SELECT COALESCE(SUM(c2.product_count), 0) FROM categories c2 WHERE c2.parent_id = categories.id
    ) WHERE id IN (SELECT DISTINCT parent_id FROM categories WHERE parent_id IS NOT NULL);

END $$;