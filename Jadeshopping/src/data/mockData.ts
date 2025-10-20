import { Product, Category, Order, OrderStatus, ProductQueryParams, ApiResponse, Review, UserSettings } from '../types';

// 商品分类数据
export const getCategoriesData = (): Category[] => [
  {
    id: 'hetian',
    name: '和田玉',
    description: '温润如脂，君子之石',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=white%20hetian%20jade%20carved%20pendant%20with%20traditional%20Chinese%20design&image_size=square'
  },
  {
    id: 'jadeite',
    name: '翡翠',
    description: '翠绿欲滴，富贵吉祥',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20jadeite%20bracelet%20with%20natural%20patterns%20and%20high%20transparency&image_size=square'
  },
  {
    id: 'agate',
    name: '玛瑙',
    description: '色彩斑斓，护身辟邪',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20agate%20beads%20necklace%20with%20natural%20banding%20patterns&image_size=square'
  },
  {
    id: 'crystal',
    name: '水晶',
    description: '晶莹剔透，净化心灵',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=clear%20crystal%20sphere%20with%20rainbow%20reflections%20on%20elegant%20stand&image_size=square'
  }
];

// 商品数据
export const getProductsData = (params?: ProductQueryParams): ApiResponse<Product[]> => {
  const allProducts: Product[] = [
    {
      id: '1',
      name: '和田玉观音吊坠',
      description: '精选新疆和田玉籽料，手工雕刻观音造型，寓意平安吉祥。玉质温润细腻，雕工精美，是佩戴和收藏的佳品。',
      price: 2880,
      originalPrice: 3200,
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=white%20hetian%20jade%20guanyin%20pendant%20with%20detailed%20carving%20and%20gold%20chain&image_size=square',
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=close%20up%20view%20of%20jade%20guanyin%20carving%20details&image_size=square'
      ],
      category: 'hetian',
      rating: 4.9,
      reviewCount: 156,
      sales: 1256,
      stock: 8,
      specifications: {
        '材质': '新疆和田玉籽料',
        '尺寸': '45mm × 28mm × 8mm',
        '重量': '约15g',
        '工艺': '手工雕刻',
        '配链': '18K金项链'
      },
      tags: ['热销', '精品', '手工雕刻'],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      name: '缅甸翡翠手镯',
      description: '缅甸A货翡翠手镯，天然绿色，水头足，种质细腻。经过专业鉴定，品质保证，是女性朋友的最爱。',
      price: 8800,
      originalPrice: 9600,
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20myanmar%20jadeite%20bangle%20with%20natural%20color%20variations&image_size=square',
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=jadeite%20bangle%20transparency%20and%20texture%20close%20up&image_size=square'
      ],
      category: 'jadeite',
      rating: 4.8,
      reviewCount: 89,
      sales: 892,
      stock: 3,
      specifications: {
        '材质': '缅甸A货翡翠',
        '内径': '56-58mm可选',
        '厚度': '12mm',
        '重量': '约45g',
        '证书': '国检证书'
      },
      tags: ['精品', 'A货', '国检证书'],
      createdAt: '2024-01-14T08:00:00Z',
      updatedAt: '2024-01-14T08:00:00Z'
    },
    {
      id: '3',
      name: '南红玛瑙戒指',
      description: '四川凉山南红玛瑙，颜色鲜艳，质地细腻。925银镶嵌，工艺精美，适合日常佩戴。',
      price: 1580,
      originalPrice: 1800,
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=red%20agate%20ring%20with%20silver%20setting%20and%20elegant%20design&image_size=square',
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=south%20red%20agate%20stone%20detail%20with%20natural%20patterns&image_size=square'
      ],
      category: 'agate',
      rating: 4.7,
      reviewCount: 65,
      sales: 654,
      stock: 12,
      specifications: {
        '材质': '四川凉山南红玛瑙',
        '戒托': '925银',
        '戒面尺寸': '12mm × 10mm',
        '戒圈': '可调节',
        '重量': '约8g'
      },
      tags: ['新品', '925银', '可调节'],
      createdAt: '2024-01-13T08:00:00Z',
      updatedAt: '2024-01-13T08:00:00Z'
    },
    {
      id: '4',
      name: '紫水晶项链',
      description: '巴西紫水晶，颜色纯正，透明度高。采用渐变设计，从小到大排列，佩戴效果优雅大方。',
      price: 680,
      originalPrice: 800,
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=purple%20amethyst%20necklace%20with%20graduated%20beads%20and%20silver%20clasp&image_size=square',
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=amethyst%20crystal%20beads%20close%20up%20showing%20clarity&image_size=square'
      ],
      category: 'crystal',
      rating: 4.6,
      reviewCount: 42,
      sales: 423,
      stock: 15,
      specifications: {
        '材质': '巴西紫水晶',
        '长度': '45cm',
        '珠子尺寸': '6-12mm渐变',
        '扣头': '925银',
        '重量': '约25g'
      },
      tags: ['特价', '渐变设计', '巴西产'],
      createdAt: '2024-01-12T08:00:00Z',
      updatedAt: '2024-01-12T08:00:00Z'
    },
    {
      id: '5',
      name: '和田玉平安扣',
      description: '传统平安扣造型，寓意平安如意。选用优质和田玉制作，质地温润，是送礼佳品。',
      price: 1200,
      originalPrice: 1400,
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=white%20hetian%20jade%20safety%20buckle%20pendant%20with%20traditional%20design&image_size=square'
      ],
      category: 'hetian',
      rating: 4.5,
      reviewCount: 78,
      sales: 567,
      stock: 6,
      specifications: {
        '材质': '和田玉',
        '直径': '30mm',
        '厚度': '6mm',
        '重量': '约12g',
        '寓意': '平安如意'
      },
      tags: ['传统', '平安扣', '送礼'],
      createdAt: '2024-01-11T08:00:00Z',
      updatedAt: '2024-01-11T08:00:00Z'
    },
    {
      id: '6',
      name: '翡翠如意吊坠',
      description: '缅甸翡翠雕刻如意造型，工艺精湛，寓意心想事成。配有国检证书，品质保证。',
      price: 3600,
      originalPrice: 4000,
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20jadeite%20ruyi%20pendant%20with%20intricate%20carving&image_size=square'
      ],
      category: 'jadeite',
      rating: 4.7,
      reviewCount: 34,
      sales: 234,
      stock: 4,
      specifications: {
        '材质': '缅甸A货翡翠',
        '尺寸': '40mm × 25mm',
        '重量': '约18g',
        '证书': '国检证书',
        '寓意': '心想事成'
      },
      tags: ['如意', 'A货', '国检'],
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z'
    }
  ];

  let filteredProducts = [...allProducts];

  // 分类筛选
  if (params?.category) {
    filteredProducts = filteredProducts.filter(product => product.category === params.category);
  }

  // 搜索筛选
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  // 价格筛选
  if (params?.minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice!);
  }
  if (params?.maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice!);
  }

  // 排序
  if (params?.sort) {
    switch (params.sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        filteredProducts.sort((a, b) => b.sales - a.sales);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'created_at':
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  // 分页
  const offset = params?.offset || 0;
  const limit = params?.limit || 20;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);

  return {
    success: true,
    data: paginatedProducts,
    total: filteredProducts.length
  };
};

// 获取单个商品详情
export const getProductById = (id: string): Product | null => {
  const { data } = getProductsData();
  return data.find(product => product.id === id) || null;
};

// 获取相关商品推荐
export const getRelatedProducts = (category: string, excludeId: string): Product[] => {
  const { data } = getProductsData({ category });
  return data.filter(product => product.id !== excludeId).slice(0, 4);
};

// 获取商品评价
export const getProductReviews = (productId: string): Review[] => {
  const reviews: Review[] = [
    {
      id: '1',
      product_id: '1',
      user_name: '玉石爱好者',
      rating: 5,
      comment: '非常满意！玉质温润，雕工精美，佩戴效果很好。包装也很精美，是正品。',
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=jade%20pendant%20worn%20on%20neck%20showing%20beautiful%20carving&image_size=square'
      ],
      created_at: '2024-01-08T14:30:00Z'
    },
    {
      id: '2',
      product_id: '1',
      user_name: '收藏家',
      rating: 4,
      comment: '质量不错，就是价格有点贵。但是确实是好东西，值得收藏。',
      images: [],
      created_at: '2024-01-05T10:15:00Z'
    },
    {
      id: '3',
      product_id: '2',
      user_name: '翡翠迷',
      rating: 5,
      comment: '手镯很漂亮，颜色正，水头足。戴上很显气质，朋友们都说好看。',
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20wearing%20green%20jadeite%20bangle%20on%20wrist&image_size=square'
      ],
      created_at: '2024-01-03T16:45:00Z'
    },
    {
      id: '4',
      product_id: '3',
      user_name: '时尚达人',
      rating: 4,
      comment: '戒指很精致，南红的颜色很正。银托做工也不错，日常佩戴很合适。',
      images: [],
      created_at: '2024-01-02T11:20:00Z'
    },
    {
      id: '5',
      product_id: '4',
      user_name: '水晶控',
      rating: 5,
      comment: '紫水晶很纯净，渐变效果很美。项链长度刚好，质量超出预期。',
      images: [
        'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=purple%20amethyst%20necklace%20displayed%20on%20jewelry%20stand&image_size=square'
      ],
      created_at: '2023-12-30T09:10:00Z'
    }
  ];

  return reviews.filter(review => review.product_id === productId);
};

// 订单数据
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    items: [
      {
        id: '1',
        productId: '1',
        name: '和田玉观音吊坠',
        price: 2880,
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=white%20hetian%20jade%20guanyin%20pendant%20with%20detailed%20carving%20and%20gold%20chain&image_size=square',
        quantity: 1
      }
    ],
    totalAmount: 2880,
    status: OrderStatus.DELIVERED,
    shippingAddress: {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '三里屯街道1号',
      isDefault: true
    },
    paymentMethod: '微信支付',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 'ORD002',
    userId: 'user1',
    items: [
      {
        id: '2',
        productId: '2',
        name: '缅甸翡翠手镯',
        price: 8800,
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20myanmar%20jadeite%20bangle%20with%20natural%20color%20variations&image_size=square',
        quantity: 1
      }
    ],
    totalAmount: 8800,
    status: OrderStatus.SHIPPED,
    shippingAddress: {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '三里屯街道1号',
      isDefault: true
    },
    paymentMethod: '支付宝',
    createdAt: '2024-01-12T15:45:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  },
  {
    id: 'ORD003',
    userId: 'user1',
    items: [
      {
        id: '3',
        productId: '3',
        name: '南红玛瑙戒指',
        price: 1580,
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=red%20agate%20ring%20with%20silver%20setting%20and%20elegant%20design&image_size=square',
        quantity: 1
      },
      {
        id: '4',
        productId: '4',
        name: '紫水晶项链',
        price: 680,
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=purple%20amethyst%20necklace%20with%20graduated%20beads%20and%20silver%20clasp&image_size=square',
        quantity: 1
      }
    ],
    totalAmount: 2260,
    status: OrderStatus.PAID,
    shippingAddress: {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '三里屯街道1号',
      isDefault: true
    },
    paymentMethod: '银行卡',
    createdAt: '2024-01-14T20:10:00Z',
    updatedAt: '2024-01-14T20:15:00Z'
  }
];

// 获取订单数据
export const getOrdersData = (userId: string): Order[] => {
  return mockOrders.filter(order => order.userId === userId);
};

// 获取用户设置数据
export const getUserSettings = (): UserSettings => {
  return {
    notifications: {
      orderUpdates: true,
      promotions: false,
      newsletter: false
    },
    privacy: {
      showProfile: false,
      showPurchaseHistory: false
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true
    }
  };
};

// 更新用户设置
export const updateUserSettings = (settings: Partial<UserSettings>): boolean => {
  // 模拟更新用户设置
  console.log('Updating user settings:', settings);
  return true;
};