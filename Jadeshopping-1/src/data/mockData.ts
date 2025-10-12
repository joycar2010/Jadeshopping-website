import type { Product, Category, ShippingAddress, User, PaymentMethod, UserAddress, Coupon } from '@/types';

// 模拟评价数据
export interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

// 扩展商品类型以支持详情页面
export interface ProductDetail extends Product {
  detailed_description: string;
  reviews: Review[];
  rating: number;
  review_count: number;
  gallery_images: string[];
  related_products: string[];
}

// 模拟商品分类数据
export const mockCategories: Category[] = [
  {
    id: 'cat_1',
    name: '和田玉',
    slug: 'hetian-jade',
    description: '新疆和田玉，温润如脂，千年传承的玉石精品',
    image_url: '/images/categories/hetian-jade.svg',
    icon: '🪨',
    color: '#F5F5DC',
    product_count: 15,
    is_featured: true,
    sort_order: 1,
    tags: ['温润', '传统', '收藏', '高端'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_1_1',
        name: '和田白玉',
        slug: 'hetian-white-jade',
        description: '纯净白玉，温润如脂',
        image_url: '/images/categories/hetian-white-jade.svg',
        icon: '⚪',
        color: '#FFFFFF',
        product_count: 8,
        is_featured: true,
        sort_order: 1,
        tags: ['白玉', '纯净', '经典'],
        parent_id: 'cat_1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_1_2',
        name: '和田籽料',
        slug: 'hetian-seed-jade',
        description: '天然籽料，皮色自然',
        image_url: '/images/categories/hetian-seed-jade.svg',
        icon: '🌰',
        color: '#DEB887',
        product_count: 7,
        is_featured: false,
        sort_order: 2,
        tags: ['籽料', '天然', '投资'],
        parent_id: 'cat_1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_2',
    name: '翡翠',
    slug: 'jadeite',
    description: '缅甸翡翠，翠绿欲滴，东方绿宝石',
    image_url: '/images/categories/jadeite.svg',
    icon: '💚',
    color: '#00FF7F',
    product_count: 12,
    is_featured: true,
    sort_order: 2,
    tags: ['翠绿', '缅甸', '珠宝', '时尚'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_2_1',
        name: '翡翠手镯',
        slug: 'jadeite-bracelet',
        description: '经典手镯，优雅大方',
        image_url: '/images/categories/jadeite-bracelet.svg',
        icon: '💍',
        color: '#32CD32',
        product_count: 6,
        is_featured: true,
        sort_order: 1,
        tags: ['手镯', '经典', '女性'],
        parent_id: 'cat_2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_2_2',
        name: '翡翠吊坠',
        slug: 'jadeite-pendant',
        description: '精美吊坠，寓意吉祥',
        image_url: '/images/categories/jadeite-pendant.svg',
        icon: '🔮',
        color: '#228B22',
        product_count: 6,
        is_featured: false,
        sort_order: 2,
        tags: ['吊坠', '精美', '寓意'],
        parent_id: 'cat_2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_3',
    name: '玛瑙',
    slug: 'agate',
    description: '天然玛瑙，色彩斑斓，质地坚韧',
    image_url: '/images/categories/agate.svg',
    icon: '🔴',
    color: '#FF6347',
    product_count: 18,
    is_featured: true,
    sort_order: 3,
    tags: ['色彩', '天然', '多样', '装饰'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_3_1',
        name: '南红玛瑙',
        slug: 'nanhong-agate',
        description: '云南南红，红润如血',
        image_url: '/images/categories/nanhong-agate.svg',
        icon: '❤️',
        color: '#DC143C',
        product_count: 10,
        is_featured: true,
        sort_order: 1,
        tags: ['南红', '红润', '云南'],
        parent_id: 'cat_3',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_3_2',
        name: '战国红玛瑙',
        slug: 'zhanguohong-agate',
        description: '战国红玛瑙，层次丰富',
        image_url: '/images/categories/zhanguohong-agate.svg',
        icon: '🟠',
        color: '#FF4500',
        product_count: 8,
        is_featured: false,
        sort_order: 2,
        tags: ['战国红', '层次', '历史'],
        parent_id: 'cat_3',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_4',
    name: '碧玉',
    slug: 'jasper',
    description: '深绿碧玉，古朴典雅，君子之石',
    image_url: '/images/categories/jasper.svg',
    icon: '🟢',
    color: '#006400',
    product_count: 9,
    is_featured: false,
    sort_order: 4,
    tags: ['深绿', '古朴', '典雅', '君子'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_4_1',
        name: '新疆碧玉',
        slug: 'xinjiang-jasper',
        description: '新疆碧玉，质地细腻',
        image_url: '/images/categories/xinjiang-jasper.svg',
        icon: '🌿',
        color: '#2E8B57',
        product_count: 5,
        is_featured: false,
        sort_order: 1,
        tags: ['新疆', '细腻', '传统'],
        parent_id: 'cat_4',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_4_2',
        name: '俄罗斯碧玉',
        slug: 'russian-jasper',
        description: '俄罗斯碧玉，颜色浓郁',
        image_url: '/images/categories/russian-jasper.svg',
        icon: '🍃',
        color: '#228B22',
        product_count: 4,
        is_featured: false,
        sort_order: 2,
        tags: ['俄罗斯', '浓郁', '现代'],
        parent_id: 'cat_4',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_5',
    name: '青玉',
    slug: 'celadon-jade',
    description: '青玉温润，色泽淡雅，文人雅士之选',
    image_url: '/images/categories/celadon-jade.svg',
    icon: '🟦',
    color: '#4682B4',
    product_count: 7,
    is_featured: false,
    sort_order: 5,
    tags: ['青色', '淡雅', '文人', '雅致'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_6',
    name: '黄玉',
    slug: 'yellow-jade',
    description: '黄玉贵重，金黄色泽，富贵吉祥',
    image_url: '/images/categories/yellow-jade.svg',
    icon: '🟡',
    color: '#FFD700',
    product_count: 5,
    is_featured: true,
    sort_order: 6,
    tags: ['黄色', '贵重', '富贵', '吉祥'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_7',
    name: '墨玉',
    slug: 'black-jade',
    description: '墨玉深沉，黑如墨染，神秘典雅',
    image_url: '/images/categories/black-jade.svg',
    icon: '⚫',
    color: '#2F4F4F',
    product_count: 6,
    is_featured: false,
    sort_order: 7,
    tags: ['黑色', '深沉', '神秘', '典雅'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_8',
    name: '糖玉',
    slug: 'sugar-jade',
    description: '糖玉甜美，色如红糖，温暖人心',
    image_url: '/images/categories/sugar-jade.svg',
    icon: '🟤',
    color: '#D2691E',
    product_count: 4,
    is_featured: false,
    sort_order: 8,
    tags: ['糖色', '甜美', '温暖', '独特'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_9',
    name: '岫玉',
    slug: 'xiuyan-jade',
    description: '岫岩玉石，历史悠久，中华瑰宝',
    image_url: '/images/categories/xiuyan-jade.svg',
    icon: '🟩',
    color: '#90EE90',
    product_count: 8,
    is_featured: false,
    sort_order: 9,
    tags: ['岫岩', '历史', '瑰宝', '传统'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_10',
    name: '独山玉',
    slug: 'dushan-jade',
    description: '独山玉石，色彩丰富，河南名玉',
    image_url: '/images/categories/dushan-jade.svg',
    icon: '🌈',
    color: '#9370DB',
    product_count: 6,
    is_featured: false,
    sort_order: 10,
    tags: ['独山', '丰富', '河南', '名玉'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// 分类统计数据
export const mockCategoryStats = {
  total_categories: mockCategories.length,
  featured_categories: mockCategories.filter(cat => cat.is_featured).length,
  categories_with_products: mockCategories.filter(cat => cat.product_count > 0).length,
  average_products_per_category: Math.round(
    mockCategories.reduce((sum, cat) => sum + cat.product_count, 0) / mockCategories.length
  ),
};

// 模拟评价数据
export const mockReviews: Record<string, Review[]> = {
  prod_1: [
    {
      id: 'review_1',
      user_name: '张女士',
      user_avatar: '/images/avatars/user1.svg',
      rating: 5,
      comment: '观音雕刻得非常精美，玉质温润，佩戴很舒适。包装也很精美，非常满意！',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'review_2',
      user_name: '李先生',
      rating: 4,
      comment: '和田玉的质量很好，雕工也不错，就是价格稍微有点高。',
      created_at: '2024-01-10T14:20:00Z',
    },
    {
      id: 'review_3',
      user_name: '王女士',
      rating: 5,
      comment: '买来送给妈妈的，她很喜欢。观音造型寓意很好，玉质也很温润。',
      created_at: '2024-01-08T16:45:00Z',
    },
  ],
  prod_2: [
    {
      id: 'review_4',
      user_name: '陈女士',
      rating: 5,
      comment: '翡翠手镯颜色很正，水头也很好，戴上手很漂亮。卖家服务也很好。',
      created_at: '2024-01-12T09:15:00Z',
    },
    {
      id: 'review_5',
      user_name: '刘女士',
      rating: 4,
      comment: '手镯质量不错，就是尺寸稍微有点大，不过还是很喜欢的。',
      created_at: '2024-01-05T11:30:00Z',
    },
  ],
  prod_3: [
    {
      id: 'review_6',
      user_name: '赵先生',
      rating: 5,
      comment: '南红玛瑙颜色很正，是天然的，收藏价值很高。包装很用心。',
      created_at: '2024-01-18T13:20:00Z',
    },
  ],
  prod_4: [
    {
      id: 'review_7',
      user_name: '孙女士',
      rating: 4,
      comment: '平安扣做工精细，碧玉的颜色很深绿，很有质感。',
      created_at: '2024-01-14T15:10:00Z',
    },
  ],
  prod_5: [
    {
      id: 'review_8',
      user_name: '周先生',
      rating: 5,
      comment: '籽料原石品质很好，皮色自然，是收藏的好选择。',
      created_at: '2024-01-16T12:00:00Z',
    },
  ],
  prod_6: [
    {
      id: 'review_9',
      user_name: '吴女士',
      rating: 5,
      comment: '如意吊坠雕工精美，翡翠质量很好，寓意也很好。',
      created_at: '2024-01-11T10:45:00Z',
    },
  ],
};

// 模拟商品详情数据
export const mockProductDetails: Record<string, ProductDetail> = {
  prod_1: {
    id: 'prod_1',
    name: '和田白玉观音吊坠',
    description: '精选新疆和田白玉，手工雕刻观音造型，寓意平安吉祥。玉质温润细腻，雕工精美，是佩戴和收藏的佳品。',
    detailed_description: `
      <h3>商品详情</h3>
      <p>这款和田白玉观音吊坠采用优质新疆和田白玉精心雕刻而成，观音造型庄严慈祥，寓意平安吉祥、护佑平安。</p>
      
      <h4>材质特点</h4>
      <ul>
        <li>选用新疆和田白玉，玉质温润细腻</li>
        <li>天然玉石，无人工染色</li>
        <li>质地坚韧，光泽柔和</li>
        <li>具有良好的保值收藏价值</li>
      </ul>
      
      <h4>工艺特色</h4>
      <ul>
        <li>传统手工雕刻工艺</li>
        <li>观音造型生动传神</li>
        <li>细节处理精致入微</li>
        <li>抛光工艺精良，手感舒适</li>
      </ul>
      
      <h4>佩戴建议</h4>
      <ul>
        <li>适合日常佩戴，彰显品味</li>
        <li>避免与硬物碰撞</li>
        <li>定期清洁保养</li>
        <li>可搭配各种服饰风格</li>
      </ul>
    `,
    price: 2888,
    category_id: 'cat_1',
    images: [
      '/images/products/hetian-guanyin-pendant.svg',
    ],
    gallery_images: [
      '/images/products/hetian-guanyin-pendant.svg',
      '/images/products/hetian-guanyin-pendant.svg',
      '/images/products/hetian-guanyin-pendant.svg',
      '/images/products/hetian-guanyin-pendant.svg',
    ],
    specifications: {
      material: '新疆和田白玉',
      size: '45mm x 30mm x 8mm',
      weight: '25g',
      craft: '手工雕刻',
      color: '白色',
      hardness: '6-6.5',
    },
    reviews: mockReviews.prod_1,
    rating: 4.7,
    review_count: 3,
    related_products: ['prod_5', 'prod_4', 'prod_6'],
    is_active: true,
    stock_quantity: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  prod_2: {
    id: 'prod_2',
    name: '缅甸翡翠手镯',
    description: '天然缅甸翡翠手镯，色泽鲜艳，水头充足。内径适中，佩戴舒适，是女性朋友的理想选择。',
    detailed_description: `
      <h3>商品详情</h3>
      <p>这款缅甸翡翠手镯选用天然A货翡翠制作，色泽鲜艳，水头充足，是女性朋友的理想饰品。</p>
      
      <h4>翡翠特点</h4>
      <ul>
        <li>天然缅甸翡翠A货</li>
        <li>颜色鲜艳，水头充足</li>
        <li>质地细腻，透明度高</li>
        <li>具有很高的收藏价值</li>
      </ul>
      
      <h4>工艺特色</h4>
      <ul>
        <li>传统圆条手镯工艺</li>
        <li>内径打磨光滑</li>
        <li>厚度均匀，佩戴舒适</li>
        <li>抛光精细，光泽度高</li>
      </ul>
      
      <h4>佩戴保养</h4>
      <ul>
        <li>适合日常佩戴</li>
        <li>避免剧烈运动时佩戴</li>
        <li>定期用软布擦拭</li>
        <li>避免接触化学物品</li>
      </ul>
    `,
    price: 15800,
    category_id: 'cat_2',
    images: [
      '/images/products/jadeite-bracelet.svg',
    ],
    gallery_images: [
      '/images/products/jadeite-bracelet.svg',
      '/images/products/jadeite-bracelet.svg',
      '/images/products/jadeite-bracelet.svg',
    ],
    specifications: {
      material: '缅甸天然翡翠',
      inner_diameter: '58mm',
      width: '12mm',
      thickness: '8mm',
      weight: '45g',
      grade: 'A货',
      transparency: '半透明',
    },
    reviews: mockReviews.prod_2,
    rating: 4.5,
    review_count: 2,
    related_products: ['prod_6', 'prod_1', 'prod_3'],
    is_active: true,
    stock_quantity: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  prod_3: {
    id: 'prod_3',
    name: '南红玛瑙原石摆件',
    description: '天然南红玛瑙原石，色泽红润，质地细腻。适合收藏和装饰，具有很高的观赏价值。',
    detailed_description: `
      <h3>商品详情</h3>
      <p>这款南红玛瑙原石摆件选用云南保山优质南红玛瑙制作，色泽红润，质地细腻，是收藏和装饰的佳品。</p>
      
      <h4>南红特点</h4>
      <ul>
        <li>云南保山南红玛瑙</li>
        <li>颜色红润自然</li>
        <li>质地细腻温润</li>
        <li>具有很高的收藏价值</li>
      </ul>
      
      <h4>观赏价值</h4>
      <ul>
        <li>天然纹理美观</li>
        <li>色彩层次丰富</li>
        <li>适合案头摆放</li>
        <li>寓意吉祥如意</li>
      </ul>
    `,
    price: 680,
    category_id: 'cat_3',
    images: [
      '/images/products/agate-nanhong-ornament.svg',
    ],
    gallery_images: [
      '/images/products/agate-nanhong-ornament.svg',
      '/images/products/agate-nanhong-ornament.svg',
    ],
    specifications: {
      material: '天然南红玛瑙',
      size: '120mm x 80mm x 60mm',
      weight: '350g',
      origin: '云南保山',
      color: '红色',
      hardness: '6.5-7',
    },
    reviews: mockReviews.prod_3,
    rating: 5.0,
    review_count: 1,
    related_products: ['prod_4', 'prod_1', 'prod_2'],
    is_active: true,
    stock_quantity: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  prod_4: {
    id: 'prod_4',
    name: '碧玉平安扣',
    description: '精选新疆碧玉制作的平安扣，寓意平安如意。玉质细腻，颜色深绿，是传统的吉祥饰品。',
    detailed_description: `
      <h3>商品详情</h3>
      <p>这款碧玉平安扣选用新疆优质碧玉制作，寓意平安如意，是传统的吉祥饰品。</p>
      
      <h4>碧玉特点</h4>
      <ul>
        <li>新疆优质碧玉</li>
        <li>颜色深绿均匀</li>
        <li>质地细腻温润</li>
        <li>传统吉祥寓意</li>
      </ul>
    `,
    price: 1280,
    category_id: 'cat_4',
    images: [
      '/images/products/jasper-peace-buckle.svg',
    ],
    gallery_images: [
      '/images/products/jasper-peace-buckle.svg',
      '/images/products/jasper-peace-buckle.svg',
    ],
    specifications: {
      material: '新疆碧玉',
      diameter: '35mm',
      thickness: '6mm',
      weight: '18g',
      color: '深绿色',
      hardness: '6-6.5',
    },
    reviews: mockReviews.prod_4,
    rating: 4.0,
    review_count: 1,
    related_products: ['prod_1', 'prod_5', 'prod_3'],
    is_active: true,
    stock_quantity: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  prod_5: {
    id: 'prod_5',
    name: '和田玉籽料原石',
    description: '天然和田玉籽料原石，皮色自然，玉质温润。适合雕刻和收藏，具有很高的投资价值。',
    detailed_description: `
      <h3>商品详情</h3>
      <p>这款和田玉籽料原石来自新疆和田，皮色自然，玉质温润，是雕刻和收藏的上佳选择。</p>
      
      <h4>籽料特点</h4>
      <ul>
        <li>新疆和田籽料</li>
        <li>皮色自然美观</li>
        <li>玉质温润细腻</li>
        <li>投资收藏价值高</li>
      </ul>
    `,
    price: 8800,
    category_id: 'cat_1',
    images: [
      '/images/products/hetian-seed-jade.svg',
    ],
    gallery_images: [
      '/images/products/hetian-seed-jade.svg',
      '/images/products/hetian-seed-jade.svg',
    ],
    specifications: {
      material: '和田玉籽料',
      size: '65mm x 45mm x 30mm',
      weight: '120g',
      origin: '新疆和田',
      skin_color: '天然皮色',
      hardness: '6-6.5',
    },
    reviews: mockReviews.prod_5,
    rating: 5.0,
    review_count: 1,
    related_products: ['prod_1', 'prod_4', 'prod_6'],
    is_active: true,
    stock_quantity: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  prod_6: {
    id: 'prod_6',
    name: '翡翠如意吊坠',
    description: '缅甸翡翠雕刻如意造型，寓意心想事成。翠绿色泽，水头充足，雕工精细。',
    detailed_description: `
      <h3>商品详情</h3>
      <p>这款翡翠如意吊坠采用缅甸翡翠雕刻如意造型，寓意心想事成，是佩戴和收藏的佳品。</p>
      
      <h4>翡翠特点</h4>
      <ul>
        <li>缅甸天然翡翠</li>
        <li>翠绿色泽鲜艳</li>
        <li>水头充足透明</li>
        <li>如意造型寓意好</li>
      </ul>
    `,
    price: 4200,
    category_id: 'cat_2',
    images: [
      '/images/products/jadeite-ruyi-pendant.svg',
    ],
    gallery_images: [
      '/images/products/jadeite-ruyi-pendant.svg',
      '/images/products/jadeite-ruyi-pendant.svg',
    ],
    specifications: {
      material: '缅甸翡翠',
      size: '50mm x 25mm x 10mm',
      weight: '28g',
      craft: '手工雕刻',
      color: '翠绿色',
      grade: 'A货',
    },
    reviews: mockReviews.prod_6,
    rating: 5.0,
    review_count: 1,
    related_products: ['prod_2', 'prod_1', 'prod_4'],
    is_active: true,
    stock_quantity: 6,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};

// 模拟商品数据（保持向后兼容）
export const mockProducts: Product[] = Object.values(mockProductDetails);

// 轮播图数据
export const mockBanners = [
  {
    id: 'banner_1',
    title: '和田玉精品',
    subtitle: '千年传承 · 温润如玉',
    image: '/images/banners/hetian-jade-banner.svg',
    link: '/products?category=cat_1',
    buttonText: '立即选购',
  },
  {
    id: 'banner_2',
    title: '翡翠珠宝',
    subtitle: '缅甸精品 · 绿意盎然',
    image: '/images/banners/jadeite-jewelry-banner.svg',
    link: '/products?category=cat_2',
    buttonText: '查看详情',
  },
  {
    id: 'banner_3',
    title: '玛瑙收藏',
    subtitle: '南红精品 · 色泽艳丽',
    image: '/images/banners/agate-collection-banner.svg',
    link: '/products?category=cat_3',
    buttonText: '探索收藏',
  },
  {
    id: 'banner_4',
    title: '碧玉艺术',
    subtitle: '和田碧玉 · 温润典雅',
    image: '/images/banners/jasper-art-banner.svg',
    link: '/products?category=cat_4',
    buttonText: '精品鉴赏',
  },
  {
    id: 'banner_5',
    title: '玉石文化',
    subtitle: '千年传承 · 君子如玉',
    image: '/images/banners/jade-culture-banner.svg',
    link: '/products',
    buttonText: '文化传承',
  },
];

// 模拟收货地址数据
export const mockAddresses: ShippingAddress[] = [
  {
    id: 'addr_1',
    full_name: '张三',
    phone: '13800138000',
    street: '朝阳区建国门外大街1号国贸大厦A座1001室',
    city: '北京市',
    state: '北京市',
    country: '中国',
    postal_code: '100020',
    is_default: true,
  },
  {
    id: 'addr_2',
    full_name: '李四',
    phone: '13900139000',
    street: '浦东新区陆家嘴环路1000号恒生银行大厦20楼',
    city: '上海市',
    state: '上海市',
    country: '中国',
    postal_code: '200120',
    is_default: false,
  },
];



// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@jade.com',
    full_name: '管理员',
    username: 'admin',
    phone: '13800138000',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    balance: 100000,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'user@jade.com',
    full_name: '张三',
    username: 'zhangsan',
    phone: '13900139000',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    balance: 100000,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'test@jade.com',
    full_name: '李四',
    username: 'lisi',
    phone: '13700137000',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    balance: 100000,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

// 模拟支付方式数据
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    icon: '💳',
    description: '使用PayPal账户安全支付，支持全球主要货币',
    enabled: true,
    processing_fee: 0.035, // 3.5%手续费
    min_amount: 1,
    max_amount: 50000,
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'apple_pay',
    icon: '🍎',
    description: '使用Touch ID或Face ID快速安全支付',
    enabled: true,
    processing_fee: 0,
    min_amount: 1,
    max_amount: 10000,
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    type: 'google_pay',
    icon: '🔵',
    description: '使用Google账户快速支付，安全便捷',
    enabled: true,
    processing_fee: 0,
    min_amount: 1,
    max_amount: 10000,
  },
  {
    id: 'credit_card',
    name: '信用卡支付',
    type: 'credit_card',
    icon: '💳',
    description: '支持Visa、MasterCard、银联等主要信用卡',
    enabled: true,
    processing_fee: 0.025, // 2.5%手续费
    min_amount: 1,
    max_amount: 100000,
  },
  {
    id: 'bank_card',
    name: '银行卡支付',
    type: 'bank_card',
    icon: '🏦',
    description: '支持储蓄卡和借记卡在线支付',
    enabled: true,
    processing_fee: 0.01, // 1%手续费
    min_amount: 1,
    max_amount: 50000,
  },
  {
    id: 'balance',
    name: '余额支付',
    type: 'balance',
    icon: '💰',
    description: '使用账户余额支付，快速便捷无手续费',
    enabled: true,
    processing_fee: 0,
    min_amount: 0.01,
    max_amount: 999999,
  },
];

// 模拟用户地址数据
export const mockUserAddresses: UserAddress[] = [
  {
    id: 'addr_1',
    user_id: '1',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '建国门外大街1号国贸大厦A座1001室',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'addr_2',
    user_id: '1',
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    address: '陆家嘴环路1000号恒生银行大厦20楼',
    is_default: false,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'addr_3',
    user_id: '1',
    name: '王五',
    phone: '13700137000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '科技园南区深南大道9988号',
    is_default: false,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

// 模拟优惠券数据
export const mockCoupons: Coupon[] = [
  {
    id: 'coupon_1',
    code: 'WELCOME10',
    name: '新用户专享',
    description: '新用户注册即可获得10%折扣优惠券',
    type: 'percentage',
    value: 10,
    min_order_amount: 100,
    max_discount_amount: 500,
    usage_limit: 1000,
    used_count: 156,
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: '2024-12-31T23:59:59Z',
    is_active: true,
  },
  {
    id: 'coupon_2',
    code: 'SAVE50',
    name: '满减优惠',
    description: '订单满500元立减50元',
    type: 'fixed_amount',
    value: 50,
    min_order_amount: 500,
    usage_limit: 500,
    used_count: 89,
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: '2024-06-30T23:59:59Z',
    is_active: true,
  },
  {
    id: 'coupon_3',
    code: 'VIP20',
    name: 'VIP专享',
    description: 'VIP会员专享20%折扣',
    type: 'percentage',
    value: 20,
    min_order_amount: 1000,
    max_discount_amount: 1000,
    usage_limit: 100,
    used_count: 23,
    valid_from: '2024-01-01T00:00:00Z',
    valid_until: '2024-12-31T23:59:59Z',
    is_active: true,
  },
];

// 模拟订单数据
export const mockOrders: Order[] = [
  {
    id: 'order_001',
    user_id: '1',
    total_amount: 3580,
    status: 'delivered',
    shipping_address: {
      id: 'addr_1',
      full_name: '张三',
      phone: '13800138000',
      street: '建国门外大街1号国贸大厦A座1001室',
      city: '北京市',
      state: '北京市',
      country: '中国',
      postal_code: '100020',
      is_default: true,
    },
    payment_method: 'credit_card',
    payment_status: 'paid',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T16:45:00Z',
    items: [
      {
        id: 'item_001',
        order_id: 'order_001',
        product_id: 'prod_1',
        quantity: 1,
        unit_price: 2880,
        product: {
          id: 'prod_1',
          name: '和田玉观音吊坠',
          slug: 'hetian-guanyin-pendant',
          description: '精选和田玉籽料雕刻观音吊坠，寓意平安吉祥',
          price: 2880,
          category_id: 'cat_1',
          images: ['/images/products/hetian-guanyin-pendant.svg'],
          stock: 5,
          is_featured: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
      {
        id: 'item_002',
        order_id: 'order_001',
        product_id: 'prod_2',
        quantity: 1,
        unit_price: 700,
        product: {
          id: 'prod_2',
          name: '南红玛瑙手串',
          slug: 'nanhong-bracelet',
          description: '云南保山南红玛瑙手串，色泽红润',
          price: 700,
          category_id: 'cat_3',
          images: ['/images/products/nanhong-bracelet.svg'],
          stock: 12,
          is_featured: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
    ],
  },
  {
    id: 'order_002',
    user_id: '1',
    total_amount: 4200,
    status: 'shipped',
    shipping_address: {
      id: 'addr_2',
      full_name: '李四',
      phone: '13900139000',
      street: '陆家嘴环路1000号恒生银行大厦20楼',
      city: '上海市',
      state: '上海市',
      country: '中国',
      postal_code: '200120',
      is_default: false,
    },
    payment_method: 'paypal',
    payment_status: 'paid',
    created_at: '2024-01-18T14:20:00Z',
    updated_at: '2024-01-22T09:15:00Z',
    items: [
      {
        id: 'item_003',
        order_id: 'order_002',
        product_id: 'prod_3',
        quantity: 1,
        unit_price: 4200,
        product: {
          id: 'prod_3',
          name: '翡翠如意吊坠',
          slug: 'jadeite-ruyi-pendant',
          description: '缅甸天然翡翠如意吊坠，翠绿色泽',
          price: 4200,
          category_id: 'cat_2',
          images: ['/images/products/jadeite-ruyi-pendant.svg'],
          stock: 3,
          is_featured: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
    ],
  },
  {
    id: 'order_003',
    user_id: '1',
    total_amount: 1580,
    status: 'processing',
    shipping_address: {
      id: 'addr_1',
      full_name: '张三',
      phone: '13800138000',
      street: '建国门外大街1号国贸大厦A座1001室',
      city: '北京市',
      state: '北京市',
      country: '中国',
      postal_code: '100020',
      is_default: true,
    },
    payment_method: 'balance',
    payment_status: 'paid',
    created_at: '2024-01-25T11:45:00Z',
    updated_at: '2024-01-25T11:45:00Z',
    items: [
      {
        id: 'item_004',
        order_id: 'order_003',
        product_id: 'prod_4',
        quantity: 2,
        unit_price: 790,
        product: {
          id: 'prod_4',
          name: '碧玉平安扣',
          slug: 'jasper-peace-buckle',
          description: '新疆碧玉平安扣，寓意平安健康',
          price: 790,
          category_id: 'cat_4',
          images: ['/images/products/jasper-peace-buckle.svg'],
          stock: 8,
          is_featured: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
    ],
  },
  {
    id: 'order_004',
    user_id: '1',
    total_amount: 6800,
    status: 'pending',
    shipping_address: {
      id: 'addr_3',
      full_name: '王五',
      phone: '13700137000',
      street: '科技园南区深南大道9988号',
      city: '深圳市',
      state: '广东省',
      country: '中国',
      postal_code: '518000',
      is_default: false,
    },
    payment_method: 'apple_pay',
    payment_status: 'pending',
    created_at: '2024-01-28T16:30:00Z',
    updated_at: '2024-01-28T16:30:00Z',
    items: [
      {
        id: 'item_005',
        order_id: 'order_004',
        product_id: 'prod_5',
        quantity: 1,
        unit_price: 6800,
        product: {
          id: 'prod_5',
          name: '翡翠手镯',
          slug: 'jadeite-bracelet-premium',
          description: '缅甸A货翡翠手镯，水头充足',
          price: 6800,
          category_id: 'cat_2',
          images: ['/images/products/jadeite-bracelet-premium.svg'],
          stock: 2,
          is_featured: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
    ],
  },
  {
    id: 'order_005',
    user_id: '1',
    total_amount: 2350,
    status: 'cancelled',
    shipping_address: {
      id: 'addr_1',
      full_name: '张三',
      phone: '13800138000',
      street: '建国门外大街1号国贸大厦A座1001室',
      city: '北京市',
      state: '北京市',
      country: '中国',
      postal_code: '100020',
      is_default: true,
    },
    payment_method: 'credit_card',
    payment_status: 'refunded',
    created_at: '2024-01-10T09:20:00Z',
    updated_at: '2024-01-12T14:30:00Z',
    items: [
      {
        id: 'item_006',
        order_id: 'order_005',
        product_id: 'prod_6',
        quantity: 1,
        unit_price: 2350,
        product: {
          id: 'prod_6',
          name: '和田玉籽料原石',
          slug: 'hetian-seed-raw',
          description: '新疆和田玉籽料原石，皮色自然',
          price: 2350,
          category_id: 'cat_1',
          images: ['/images/products/hetian-seed-raw.svg'],
          stock: 4,
          is_featured: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      },
    ],
  },
];

// 模拟物流信息
export interface ShippingInfo {
  order_id: string;
  tracking_number: string;
  carrier: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'exception';
  estimated_delivery: string;
  tracking_history: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export const mockShippingInfo: ShippingInfo[] = [
  {
    order_id: 'order_001',
    tracking_number: 'SF1234567890',
    carrier: '顺丰速运',
    status: 'delivered',
    estimated_delivery: '2024-01-20T18:00:00Z',
    tracking_history: [
      {
        timestamp: '2024-01-15T10:30:00Z',
        status: '订单确认',
        location: '北京仓库',
        description: '您的订单已确认，正在准备发货',
      },
      {
        timestamp: '2024-01-16T14:20:00Z',
        status: '已发货',
        location: '北京分拣中心',
        description: '包裹已从北京仓库发出',
      },
      {
        timestamp: '2024-01-17T08:45:00Z',
        status: '运输中',
        location: '北京转运中心',
        description: '包裹正在运输途中',
      },
      {
        timestamp: '2024-01-18T16:30:00Z',
        status: '到达目的地',
        location: '北京朝阳区营业点',
        description: '包裹已到达派送网点',
      },
      {
        timestamp: '2024-01-20T16:45:00Z',
        status: '已签收',
        location: '国贸大厦A座',
        description: '包裹已成功签收，签收人：张三',
      },
    ],
  },
  {
    order_id: 'order_002',
    tracking_number: 'YTO9876543210',
    carrier: '圆通速递',
    status: 'in_transit',
    estimated_delivery: '2024-01-24T18:00:00Z',
    tracking_history: [
      {
        timestamp: '2024-01-18T14:20:00Z',
        status: '订单确认',
        location: '上海仓库',
        description: '您的订单已确认，正在准备发货',
      },
      {
        timestamp: '2024-01-19T10:15:00Z',
        status: '已发货',
        location: '上海分拣中心',
        description: '包裹已从上海仓库发出',
      },
      {
        timestamp: '2024-01-22T09:15:00Z',
        status: '运输中',
        location: '上海浦东转运中心',
        description: '包裹正在运输途中，预计今日送达',
      },
    ],
  },
  {
    order_id: 'order_003',
    tracking_number: 'ZTO5555666677',
    carrier: '中通快递',
    status: 'preparing',
    estimated_delivery: '2024-01-28T18:00:00Z',
    tracking_history: [
      {
        timestamp: '2024-01-25T11:45:00Z',
        status: '订单确认',
        location: '北京仓库',
        description: '您的订单已确认，正在准备发货',
      },
    ],
  },
];