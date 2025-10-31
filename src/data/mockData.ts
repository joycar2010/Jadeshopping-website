import { Product, Category, Order, OrderStatus, ProductQueryParams, ApiResponse, Review, UserSettings } from '../types';

// 产品名称关键词到图片映射（本地SVG占位，避免外链被拦截）
const productKeywordImageMap: Record<string, string> = {
  '和田玉': '/images/hetian.svg',
  '观音': '/images/hetian.svg',
  '翡翠': '/images/jadeite.svg',
  '手镯': '/images/jadeite.svg',
  '玛瑙': '/images/agate.svg',
  '南红': '/images/agate.svg',
  '水晶': '/images/crystal.svg',
  '项链': '/images/crystal.svg'
};

const categoryDefaultImageMap: Record<string, string> = {
  hetian: '/images/hetian.svg',
  jadeite: '/images/jadeite.svg',
  agate: '/images/agate.svg',
  crystal: '/images/crystal.svg'
};

function resolveProductImage(name: string, category?: string): string {
  const text = name || '';
  for (const key of Object.keys(productKeywordImageMap)) {
    if (text.includes(key)) return productKeywordImageMap[key];
  }
  if (category && categoryDefaultImageMap[category]) {
    return categoryDefaultImageMap[category];
  }
  return '/guaranteed-antiques-logo.png';
}

function resolveProductImages(name: string, category?: string): string[] {
  const img = resolveProductImage(name, category);
  // 返回两张图以兼容画廊视图；若需要更多可扩展
  return [img, img];
}

// 商品分类数据
export const getCategoriesData = (): Category[] => [
  {
    id: 'hetian',
    name: '和田玉',
    description: '温润如脂，君子之石',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp'
  },
  {
    id: 'jadeite',
    name: '翡翠',
    description: '翠绿欲滴，富贵吉祥',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp'
  },
  {
    id: 'agate',
    name: '玛瑙',
    description: '色彩斑斓，护身辟邪',
    image: 'https://images.unsplash.com/photo-1578662015928-3dae4c8c8e0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp'
  },
  {
    id: 'crystal',
    name: '水晶',
    description: '晶莹剔透，净化心灵',
    image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp'
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
        '/images/hetian.svg',
        '/images/hetian.svg'
      ],
      category: 'hetian',
      rating: 4.9,
      reviewCount: 156,
      sales: 1256,
      stock: 8,
      specifications: {
        '材质': '新疆和田玉籽料',
        '工艺': '手工雕刻',
        '尺寸': '长3.2cm × 宽2.1cm × 厚0.8cm',
        '重量': '约15g',
        '证书': '国家珠宝玉石质量监督检验中心'
      },
      tags: ['热销', '精品', '收藏'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: '缅甸翡翠手镯',
      description: '天然缅甸翡翠A货手镯，种水俱佳，颜色均匀均匀。内径适中，佩戴舒适，是女性优雅气质的完美体现。',
      price: 8800,
      originalPrice: 9600,
      images: [
        '/images/jadeite.svg',
        '/images/jadeite.svg'
      ],
      category: 'jadeite',
      rating: 4.8,
      reviewCount: 89,
      sales: 892,
      stock: 3,
      specifications: {
        '材质': '缅甸翡翠A货',
        '种水': '糯冰种',
        '颜色': '阳绿',
        '内径': '56-58mm',
        '宽度': '12-15mm',
        '证书': 'GIC珠宝检测中心'
      },
      tags: ['A货', '糯冰种', '阳绿'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-14T15:20:00Z'
    },
    {
      id: '3',
      name: '南红玛瑙戒指',
      description: '精选四川凉山南红玛瑙，色泽红润如血，质地细腻温润。925银镶嵌工艺，设计简约大方，适合日常佩戴。',
      price: 1580,
      originalPrice: 1800,
      images: [
        '/images/agate.svg',
        '/images/agate.svg'
      ],
      category: 'agate',
      rating: 4.7,
      reviewCount: 65,
      sales: 654,
      stock: 12,
      specifications: {
        '材质': '四川凉山南红玛瑙',
        '镶嵌': '925银',
        '戒面尺寸': '12mm × 10mm',
        '戒圈': '可调节',
        '重量': '约8g'
      },
      tags: ['南红', '925银', '可调节'],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-13T09:45:00Z'
    },
    {
      id: '4',
      name: '紫水晶项链',
      description: '巴西天然紫水晶项链，颜色深邃迷人，晶体通透。渐变式设计，层次丰富，佩戴优雅，有助于提升个人魅力。',
      price: 680,
      originalPrice: 800,
      images: [
        '/images/crystal.svg',
        '/images/crystal.svg'
      ],
      category: 'crystal',
      rating: 4.6,
      reviewCount: 42,
      sales: 423,
      stock: 15,
      specifications: {
        '材质': '巴西天然紫水晶',
        '长度': '45cm',
        '珠子大小': '6-12mm渐变',
        '扣子': '925银龙虾扣',
        '重量': '约25g'
      },
      tags: ['天然', '渐变', '巴西'],
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-12T16:30:00Z'
    }
  ];

  // 基于产品名称与分类统一解析图片，避免名称与图片不一致
  const normalizedProducts: Product[] = allProducts.map(p => ({
    ...p,
    images: resolveProductImages(p.name, p.category)
  }));

  // 应用筛选逻辑
  let filteredProducts = normalizedProducts;

  if (params?.category) {
    filteredProducts = filteredProducts.filter(product => product.category === params.category);
  }

  if (params?.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice!);
  }

  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // 应用排序
  if (params?.sort) {
    switch (params.sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        filteredProducts.sort((a, b) => b.sales - a.sales);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // 默认按销量排序
        filteredProducts.sort((a, b) => b.sales - a.sales);
    }
  }

  // 应用分页
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedProducts,
    total: filteredProducts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProducts.length / limit)
  };
};

export const getProductById = (id: string): Product | null => {
  const { data: products } = getProductsData();
  return products.find(product => product.id === id) || null;
};

export const getRelatedProducts = (category: string, excludeId: string): Product[] => {
  const { data: products } = getProductsData({ category });
  return products.filter(product => product.id !== excludeId).slice(0, 4);
};

export const getProductReviews = (productId: string): Review[] => {
  // 模拟评论数据
  return [
    {
      id: '1',
      product_id: productId,
      user_name: '张**',
      userId: 'user1',
      userName: '张**',
      userAvatar: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      comment: '非常满意的一次购买！玉质温润，雕工精细，包装也很用心。客服态度很好，物流也很快。',
      content: '非常满意的一次购买！玉质温润，雕工精细，包装也很用心。客服态度很好，物流也很快。',
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
      ],
      created_at: '2024-01-05T16:45:00Z'
    }
  ];
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
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp',
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
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp',
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
        image: 'https://images.unsplash.com/photo-1578662015928-3dae4c8c8e0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp',
        quantity: 1
      },
      {
        id: '4',
        productId: '4',
        name: '紫水晶项链',
        price: 680,
        image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&fm=webp',
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

// 获取用户订单（统一修正订单项图片为当前产品图）
export const getOrdersData = (userId: string): Order[] => {
  const orders = mockOrders.filter(order => order.userId === userId);
  return orders.map(order => ({
    ...order,
    items: order.items.map(item => {
      const product = getProductById(item.productId);
      const image = product?.images?.[0] || resolveProductImage(item.name);
      return { ...item, image };
    })
  }));
};

// 用户设置数据
export const getUserSettings = (): UserSettings => {
  return {
    notifications: {
      email: true,
      sms: false,
      push: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true
    },
    privacy: {
      profileVisible: true,
      showProfile: true,
      showPurchaseHistory: false,
      allowRecommendations: true
    },
    preferences: {
      language: 'zh-CN',
      currency: 'CNY',
      theme: 'light'
    }
  };
};

export const updateUserSettings = (settings: Partial<UserSettings>): boolean => {
  // 模拟更新用户设置
  return true;
};