import type { Product, Category, ShippingAddress, User, PaymentMethod, UserAddress, Coupon } from '@/types';

// Mock review data
export interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

// Extended product type to support detail pages
export interface ProductDetail extends Product {
  detailed_description: string;
  reviews: Review[];
  rating: number;
  review_count: number;
  gallery_images: string[];
  related_products: string[];
}

// Mock product category data
export const mockCategories: Category[] = [
  {
    id: 'cat_1',
    name: 'Hetian Jade',
    slug: 'hetian-jade',
    description: 'Xinjiang Hetian jade, warm and lustrous as fat, a millennium-old heritage of premium jade',
    image_url: '/images/categories/hetian-jade.svg',
    icon: '🪨',
    color: '#F5F5DC',
    product_count: 15,
    is_featured: true,
    sort_order: 1,
    tags: ['Lustrous', 'Traditional', 'Collectible', 'Premium'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_1_1',
        name: 'Hetian White Jade',
        slug: 'hetian-white-jade',
        description: 'Pure white jade, warm and lustrous as fat',
        image_url: '/images/categories/hetian-white-jade.svg',
        icon: '⚪',
        color: '#FFFFFF',
        product_count: 8,
        is_featured: true,
        sort_order: 1,
        tags: ['White Jade', 'Pure', 'Classic'],
        parent_id: 'cat_1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_1_2',
        name: 'Hetian Seed Jade',
        slug: 'hetian-seed-jade',
        description: 'Natural seed jade with natural skin color',
        image_url: '/images/categories/hetian-seed-jade.svg',
        icon: '🌰',
        color: '#DEB887',
        product_count: 7,
        is_featured: false,
        sort_order: 2,
        tags: ['Seed Jade', 'Natural', 'Investment'],
        parent_id: 'cat_1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_2',
    name: 'Jadeite',
    slug: 'jadeite',
    description: 'Myanmar jadeite, emerald green and lustrous, the oriental emerald',
    image_url: '/images/categories/jadeite.svg',
    icon: '💚',
    color: '#00FF7F',
    product_count: 12,
    is_featured: true,
    sort_order: 2,
    tags: ['Emerald Green', 'Myanmar', 'Jewelry', 'Fashion'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_2_1',
        name: 'Jadeite Bracelet',
        slug: 'jadeite-bracelet',
        description: 'Classic bracelet, elegant and graceful',
        image_url: '/images/categories/jadeite-bracelet.svg',
        icon: '💍',
        color: '#32CD32',
        product_count: 6,
        is_featured: true,
        sort_order: 1,
        tags: ['Bracelet', 'Classic', 'Women'],
        parent_id: 'cat_2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_2_2',
        name: 'Jadeite Pendant',
        slug: 'jadeite-pendant',
        description: 'Exquisite pendant with auspicious meaning',
        image_url: '/images/categories/jadeite-pendant.svg',
        icon: '🔮',
        color: '#228B22',
        product_count: 6,
        is_featured: false,
        sort_order: 2,
        tags: ['Pendant', 'Exquisite', 'Auspicious'],
        parent_id: 'cat_2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_3',
    name: 'Agate',
    slug: 'agate',
    description: 'Natural agate with colorful patterns and durable texture',
    image_url: '/images/categories/agate.svg',
    icon: '🔴',
    color: '#FF6347',
    product_count: 18,
    is_featured: true,
    sort_order: 3,
    tags: ['Colorful', 'Natural', 'Diverse', 'Decorative'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_3_1',
        name: 'Nanhong Agate',
        slug: 'nanhong-agate',
        description: 'Yunnan Nanhong, red as blood',
        image_url: '/images/categories/nanhong-agate.svg',
        icon: '❤️',
        color: '#DC143C',
        product_count: 10,
        is_featured: true,
        sort_order: 1,
        tags: ['Nanhong', 'Red', 'Yunnan'],
        parent_id: 'cat_3',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_3_2',
        name: 'Zhanguohong Agate',
        slug: 'zhanguohong-agate',
        description: 'Zhanguohong agate with rich layers',
        image_url: '/images/categories/zhanguohong-agate.svg',
        icon: '🟠',
        color: '#FF4500',
        product_count: 8,
        is_featured: false,
        sort_order: 2,
        tags: ['Zhanguohong', 'Layered', 'Historical'],
        parent_id: 'cat_3',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_4',
    name: 'Jasper',
    slug: 'jasper',
    description: 'Deep green jasper, ancient and elegant, the stone of gentlemen',
    image_url: '/images/categories/jasper.svg',
    icon: '🟢',
    color: '#006400',
    product_count: 9,
    is_featured: false,
    sort_order: 4,
    tags: ['Deep Green', 'Ancient', 'Elegant', 'Gentleman'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 'cat_4_1',
        name: 'Xinjiang Jasper',
        slug: 'xinjiang-jasper',
        description: 'Xinjiang jasper with fine texture',
        image_url: '/images/categories/xinjiang-jasper.svg',
        icon: '🌿',
        color: '#2E8B57',
        product_count: 5,
        is_featured: false,
        sort_order: 1,
        tags: ['Xinjiang', 'Fine', 'Traditional'],
        parent_id: 'cat_4',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cat_4_2',
        name: 'Russian Jasper',
        slug: 'russian-jasper',
        description: 'Russian jasper with rich color',
        image_url: '/images/categories/russian-jasper.svg',
        icon: '🍃',
        color: '#228B22',
        product_count: 4,
        is_featured: false,
        sort_order: 2,
        tags: ['Russian', 'Rich', 'Modern'],
        parent_id: 'cat_4',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'cat_5',
    name: 'Celadon Jade',
    slug: 'celadon-jade',
    description: 'Celadon jade with warm luster and elegant color, the choice of scholars',
    image_url: '/images/categories/celadon-jade.svg',
    icon: '🟦',
    color: '#4682B4',
    product_count: 7,
    is_featured: false,
    sort_order: 5,
    tags: ['Celadon', 'Elegant', 'Scholar', 'Refined'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_6',
    name: 'Yellow Jade',
    slug: 'yellow-jade',
    description: 'Precious yellow jade with golden luster, symbolizing wealth and prosperity',
    image_url: '/images/categories/yellow-jade.svg',
    icon: '🟡',
    color: '#FFD700',
    product_count: 5,
    is_featured: true,
    sort_order: 6,
    tags: ['Yellow', 'Precious', 'Wealth', 'Prosperity'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_7',
    name: 'Black Jade',
    slug: 'black-jade',
    description: 'Deep black jade, dark as ink, mysterious and elegant',
    image_url: '/images/categories/black-jade.svg',
    icon: '⚫',
    color: '#2F4F4F',
    product_count: 6,
    is_featured: false,
    sort_order: 7,
    tags: ['Black', 'Deep', 'Mysterious', 'Elegant'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_8',
    name: 'Sugar Jade',
    slug: 'sugar-jade',
    description: 'Sweet sugar jade, brown as sugar, warm and heartwarming',
    image_url: '/images/categories/sugar-jade.svg',
    icon: '🟤',
    color: '#D2691E',
    product_count: 4,
    is_featured: false,
    sort_order: 8,
    tags: ['Sugar Color', 'Sweet', 'Warm', 'Unique'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_9',
    name: 'Xiuyan Jade',
    slug: 'xiuyan-jade',
    description: 'Xiuyan jade with long history, a Chinese treasure',
    image_url: '/images/categories/xiuyan-jade.svg',
    icon: '🟩',
    color: '#90EE90',
    product_count: 8,
    is_featured: false,
    sort_order: 9,
    tags: ['Xiuyan', 'Historical', 'Treasure', 'Traditional'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_10',
    name: 'Dushan Jade',
    slug: 'dushan-jade',
    description: 'Dushan jade with rich colors, a famous jade from Henan',
    image_url: '/images/categories/dushan-jade.svg',
    icon: '🌈',
    color: '#9370DB',
    product_count: 6,
    is_featured: false,
    sort_order: 10,
    tags: ['Dushan', 'Rich', 'Henan', 'Famous'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Category statistics data
export const mockCategoryStats = {
  total_categories: mockCategories.length,
  featured_categories: mockCategories.filter(cat => cat.is_featured).length,
  categories_with_products: mockCategories.filter(cat => cat.product_count > 0).length,
  average_products_per_category: Math.round(
    mockCategories.reduce((sum, cat) => sum + cat.product_count, 0) / mockCategories.length
  ),
};

// Mock review data
export const mockReviews: Record<string, Review[]> = {
  prod_1: [
    {
      id: 'review_1',
      user_name: 'Sarah Zhang',
      user_avatar: '/images/avatars/user1.svg',
      rating: 5,
      comment: 'The Guanyin carving is exquisitely beautiful, the jade is warm and lustrous, very comfortable to wear. The packaging is also very elegant, extremely satisfied!',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'review_2',
      user_name: 'Michael Li',
      rating: 4,
      comment: 'The quality of Hetian jade is excellent, and the craftsmanship is also good, just the price is a bit high.',
      created_at: '2024-01-10T14:20:00Z',
    },
    {
      id: 'review_3',
      user_name: 'Emily Wang',
      rating: 5,
      comment: 'Bought this as a gift for my mother, she loves it very much. The Guanyin design has great meaning, and the jade is very warm and lustrous.',
      created_at: '2024-01-08T16:45:00Z',
    },
  ],
  prod_2: [
    {
      id: 'review_4',
      user_name: 'Grace Chen',
      rating: 5,
      comment: 'The jadeite bracelet has excellent color and transparency, looks beautiful when worn. The seller service is also very good.',
      created_at: '2024-01-12T09:15:00Z',
    },
    {
      id: 'review_5',
      user_name: 'Jennifer Liu',
      rating: 4,
      comment: 'The bracelet quality is good, just the size is slightly large, but I still love it very much.',
      created_at: '2024-01-05T11:30:00Z',
    },
  ],
  prod_3: [
    {
      id: 'review_6',
      user_name: 'David Zhao',
      rating: 5,
      comment: 'The Nanhong agate has excellent color, it is natural, with high collectible value. The packaging is very thoughtful.',
      created_at: '2024-01-18T13:20:00Z',
    },
  ],
  prod_4: [
    {
      id: 'review_7',
      user_name: 'Linda Sun',
      rating: 4,
      comment: 'The peace buckle is finely crafted, the jasper color is deep green, very textured.',
      created_at: '2024-01-14T15:10:00Z',
    },
  ],
  prod_5: [
    {
      id: 'review_8',
      user_name: 'Robert Zhou',
      rating: 5,
      comment: 'The seed material raw stone is of excellent quality, natural skin color, a great choice for collection.',
      created_at: '2024-01-16T12:00:00Z',
    },
  ],
  prod_6: [
    {
      id: 'review_9',
      user_name: 'Helen Wu',
      rating: 5,
      comment: 'The Ruyi pendant is exquisitely carved, the jadeite quality is excellent, and the meaning is very auspicious.',
      created_at: '2024-01-11T10:45:00Z',
    },
  ],
};

// Mock product detail data
export const mockProductDetails: Record<string, ProductDetail> = {
  prod_1: {
    id: 'prod_1',
    name: 'Hetian White Jade Guanyin Pendant',
    description: 'Selected Xinjiang Hetian white jade, hand-carved Guanyin design, symbolizing peace and good fortune. The jade is warm and delicate, with exquisite craftsmanship, perfect for wearing and collecting.',
    detailed_description: `
      <h3>Product Details</h3>
      <p>This Hetian white jade Guanyin pendant is carefully carved from premium Xinjiang Hetian white jade. The Guanyin design is solemn and compassionate, symbolizing peace, good fortune, and protection.</p>
      
      <h4>Material Features</h4>
      <ul>
        <li>Selected Xinjiang Hetian white jade, warm and delicate texture</li>
        <li>Natural jade stone, no artificial coloring</li>
        <li>Durable texture with soft luster</li>
        <li>Excellent value retention and collectible worth</li>
      </ul>
      
      <h4>Craftsmanship</h4>
      <ul>
        <li>Traditional hand-carving techniques</li>
        <li>Vivid and lifelike Guanyin design</li>
        <li>Exquisite attention to detail</li>
        <li>Superior polishing with comfortable feel</li>
      </ul>
      
      <h4>Wearing Recommendations</h4>
      <ul>
        <li>Suitable for daily wear, showcasing taste</li>
        <li>Avoid collision with hard objects</li>
        <li>Regular cleaning and maintenance</li>
        <li>Complements various clothing styles</li>
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
      material: 'Xinjiang Hetian White Jade',
      size: '45mm x 30mm x 8mm',
      weight: '25g',
      craft: 'Hand Carved',
      color: 'White',
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
    name: 'Myanmar Jadeite Bracelet',
    description: 'Natural Myanmar jadeite bracelet with vibrant color and fine texture',
    detailed_description: `
      <h3>Product Details</h3>
      <p>This Myanmar jadeite bracelet is crafted from natural jadeite with vibrant color and fine texture. Jadeite is known as the "King of Jade" and has high collectible value.</p>
      
      <h4>Jadeite Features</h4>
      <ul>
        <li>Natural Myanmar jadeite of superior quality</li>
        <li>Vibrant color with high transparency</li>
        <li>Fine texture with warm touch</li>
        <li>High collectible value</li>
      </ul>
      
      <h4>Craftsmanship</h4>
      <ul>
        <li>Traditional craftsmanship with meticulous workmanship</li>
        <li>Smooth and rounded, comfortable to wear</li>
        <li>Standard size suitable for most people</li>
      </ul>
      
      <h4>Care and Maintenance</h4>
      <ul>
        <li>Avoid collision with hard objects</li>
        <li>Regular cleaning and maintenance</li>
        <li>Avoid contact with chemicals</li>
        <li>Store properly to prevent damage</li>
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
      material: 'Myanmar Natural Jadeite',
      inner_diameter: '58mm',
      width: '12mm',
      thickness: '8mm',
      weight: '45g',
      grade: 'Grade A',
      transparency: 'Semi-transparent',
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
    name: 'Nanhong Agate Raw Stone Ornament',
    description: 'Natural Nanhong agate raw stone with lustrous red color and fine texture. Perfect for collection and decoration with high ornamental value.',
    detailed_description: `
      <h3>Product Details</h3>
      <p>This Nanhong agate raw stone ornament is made from premium Yunnan Baoshan Nanhong agate with lustrous red color and fine texture, making it an excellent piece for collection and decoration.</p>
      
      <h4>Nanhong Features</h4>
      <ul>
        <li>Yunnan Baoshan Nanhong agate</li>
        <li>Natural lustrous red color</li>
        <li>Fine and warm texture</li>
        <li>High collectible value</li>
      </ul>
      
      <h4>Ornamental Value</h4>
      <ul>
        <li>Beautiful natural patterns</li>
        <li>Rich color layers</li>
        <li>Perfect for desk display</li>
        <li>Symbolizes good fortune</li>
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
      material: 'Natural Nanhong Agate',
      size: '120mm x 80mm x 60mm',
      weight: '350g',
      origin: 'Yunnan Baoshan',
      color: 'Red',
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
    name: 'Jasper Peace Buckle',
    description: 'Premium Xinjiang jasper peace buckle symbolizing peace and good fortune. Fine jade texture with deep green color, a traditional auspicious ornament.',
    detailed_description: `
      <h3>Product Details</h3>
      <p>This jasper peace buckle is crafted from premium Xinjiang jasper, symbolizing peace and good fortune, making it a traditional auspicious ornament.</p>
      
      <h4>Jasper Features</h4>
      <ul>
        <li>Premium Xinjiang jasper</li>
        <li>Uniform deep green color</li>
        <li>Fine and warm texture</li>
        <li>Traditional auspicious meaning</li>
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
      material: 'Xinjiang Jasper',
      diameter: '35mm',
      thickness: '6mm',
      weight: '18g',
      color: 'Deep Green',
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
    name: 'Hetian Jade Seed Material Raw Stone',
    description: 'Natural Hetian jade seed material raw stone with natural skin color and warm jade texture. Perfect for carving and collection with high investment value.',
    detailed_description: `
      <h3>Product Details</h3>
      <p>This Hetian jade seed material raw stone comes from Xinjiang Hetian with natural skin color and warm jade texture, making it an excellent choice for carving and collection.</p>
      
      <h4>Seed Material Features</h4>
      <ul>
        <li>Xinjiang Hetian seed material</li>
        <li>Natural beautiful skin color</li>
        <li>Warm and fine jade texture</li>
        <li>High investment and collectible value</li>
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
      material: 'Hetian Jade Seed Material',
      size: '65mm x 45mm x 30mm',
      weight: '120g',
      origin: 'Xinjiang Hetian',
      skin_color: 'Natural Skin Color',
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
    name: 'Jadeite Ruyi Pendant',
    description: 'Myanmar jadeite carved in Ruyi shape, symbolizing wishes come true. Emerald green color with excellent transparency and fine craftsmanship.',
    detailed_description: `
      <h3>Product Details</h3>
      <p>This jadeite Ruyi pendant is carved from Myanmar jadeite in the traditional Ruyi shape, symbolizing wishes come true, making it an excellent piece for wearing and collection.</p>
      
      <h4>Jadeite Features</h4>
      <ul>
        <li>Myanmar natural jadeite</li>
        <li>Vibrant emerald green color</li>
        <li>Excellent transparency</li>
        <li>Ruyi shape with auspicious meaning</li>
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
      material: 'Myanmar Jadeite',
      size: '50mm x 25mm x 10mm',
      weight: '28g',
      craft: 'Hand Carved',
      color: 'Emerald Green',
      grade: 'Grade A',
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

// Mock product data (maintaining backward compatibility)
export const mockProducts: Product[] = Object.values(mockProductDetails);

// Banner carousel data
export const mockBanners = [
  {
    id: 'banner_1',
    title: 'Premium Antiques',
    subtitle: 'Timeless Heritage · Exquisite Craftsmanship',
    image: '/images/banners/hetian-jade-banner.svg',
    link: '/products?category=cat_1',
    buttonText: 'Shop Now',
  },
  {
    id: 'banner_2',
    title: 'Jade Jewelry',
    subtitle: 'Authentic Pieces · Natural Beauty',
    image: '/images/banners/jadeite-jewelry-banner.svg',
    link: '/products?category=cat_2',
    buttonText: 'View Details',
  },
  {
    id: 'banner_3',
    title: 'Collectible Treasures',
    subtitle: 'Rare Finds · Vibrant Colors',
    image: '/images/banners/agate-collection-banner.svg',
    link: '/products?category=cat_3',
    buttonText: 'Explore Collection',
  },
  {
    id: 'banner_4',
    title: 'Artistic Masterpieces',
    subtitle: 'Fine Craftsmanship · Elegant Design',
    image: '/images/banners/jasper-art-banner.svg',
    link: '/products?category=cat_4',
    buttonText: 'Discover Art',
  },
  {
    id: 'banner_5',
    title: 'Cultural Heritage',
    subtitle: 'Ancient Wisdom · Timeless Beauty',
    image: '/images/banners/jade-culture-banner.svg',
    link: '/products',
    buttonText: 'Cultural Legacy',
  },
];

// Mock shipping address data
export const mockAddresses: ShippingAddress[] = [
  {
    id: 'addr_1',
    full_name: 'Zhang San',
    phone: '13800138000',
    street: 'Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue, Chaoyang District',
    city: 'Beijing',
    state: 'Beijing',
    country: 'China',
    postal_code: '100020',
    is_default: true,
  },
  {
    id: 'addr_2',
    full_name: 'Li Si',
    phone: '13900139000',
    street: '20F, Hang Seng Bank Tower, 1000 Lujiazui Ring Road, Pudong New Area',
    city: 'Shanghai',
    state: 'Shanghai',
    country: 'China',
    postal_code: '200120',
    is_default: false,
  },
];



// Mock user data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@jade.com',
    full_name: 'Administrator',
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
    full_name: 'Zhang San',
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
    full_name: 'Li Si',
    username: 'lisi',
    phone: '13700137000',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    balance: 100000,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

// Mock payment method data
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    icon: '💳',
    description: 'Secure payment using PayPal account, supports major global currencies',
    enabled: true,
    processing_fee: 0.035, // 3.5% processing fee
    min_amount: 1,
    max_amount: 50000,
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'apple_pay',
    icon: '🍎',
    description: 'Fast and secure payment using Touch ID or Face ID',
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
    description: 'Fast payment using Google account, secure and convenient',
    enabled: true,
    processing_fee: 0,
    min_amount: 1,
    max_amount: 10000,
  },
  {
    id: 'credit_card',
    name: 'Credit Card Payment',
    type: 'credit_card',
    icon: '💳',
    description: 'Supports major credit cards including Visa, MasterCard, and UnionPay',
    enabled: true,
    processing_fee: 0.025, // 2.5% processing fee
    min_amount: 1,
    max_amount: 100000,
  },
  {
    id: 'bank_card',
    name: 'Bank Card Payment',
    type: 'bank_card',
    icon: '🏦',
    description: 'Supports debit and savings card online payments',
    enabled: true,
    processing_fee: 0.01, // 1% processing fee
    min_amount: 1,
    max_amount: 50000,
  },
  {
    id: 'balance',
    name: 'Balance Payment',
    type: 'balance',
    icon: '💰',
    description: 'Pay with account balance, fast and convenient with no processing fees',
    enabled: true,
    processing_fee: 0,
    min_amount: 0.01,
    max_amount: 999999,
  },
];

// Mock user address data
export const mockUserAddresses: UserAddress[] = [
  {
    id: 'addr_1',
    user_id: '1',
    name: 'Zhang San',
    phone: '13800138000',
    province: 'Beijing',
    city: 'Beijing',
    district: 'Chaoyang District',
    address: 'Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'addr_2',
    user_id: '1',
    name: 'Li Si',
    phone: '13900139000',
    province: 'Shanghai',
    city: 'Shanghai',
    district: 'Pudong New Area',
    address: '20F, Hang Seng Bank Tower, 1000 Lujiazui Ring Road',
    is_default: false,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'addr_3',
    user_id: '1',
    name: 'Wang Wu',
    phone: '13700137000',
    province: 'Guangdong Province',
    city: 'Shenzhen',
    district: 'Nanshan District',
    address: 'No.9988 Shennan Avenue, South District, Science Park',
    is_default: false,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

// Mock coupon data
export const mockCoupons: Coupon[] = [
  {
    id: 'coupon_1',
    code: 'WELCOME10',
    name: 'New User Exclusive',
    description: 'New users get 10% discount coupon upon registration',
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
    name: 'Spend & Save',
    description: 'Save ¥50 on orders over ¥500',
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
    name: 'VIP Exclusive',
    description: 'VIP members enjoy 20% discount',
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

// Mock order data
export const mockOrders: Order[] = [
  {
    id: 'order_001',
    user_id: '1',
    total_amount: 3580,
    status: 'delivered',
    shipping_address: {
      id: 'addr_1',
      full_name: 'Zhang San',
      phone: '13800138000',
      street: 'Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue',
      city: 'Beijing',
      state: 'Beijing',
      country: 'China',
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
          name: 'Hetian White Jade Guanyin Pendant',
          slug: 'hetian-guanyin-pendant',
          description: 'Selected Xinjiang Hetian jade seed material carved Guanyin pendant, symbolizing peace and good fortune',
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
          name: 'Nanhong Agate Bracelet',
          slug: 'nanhong-bracelet',
          description: 'Yunnan Baoshan Nanhong agate bracelet, lustrous red color',
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
      full_name: 'Li Si',
      phone: '13900139000',
      street: '20F, Hang Seng Bank Tower, 1000 Lujiazui Ring Road',
      city: 'Shanghai',
      state: 'Shanghai',
      country: 'China',
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
          name: 'Jadeite Ruyi Pendant',
          slug: 'jadeite-ruyi-pendant',
          description: 'Myanmar natural jadeite Ruyi pendant, emerald green color',
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
      full_name: 'Zhang San',
      phone: '13800138000',
      street: 'Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue',
      city: 'Beijing',
      state: 'Beijing',
      country: 'China',
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
          name: 'Jasper Peace Buckle',
          slug: 'jasper-peace-buckle',
          description: 'Xinjiang jasper peace buckle, symbolizing peace and health',
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
      full_name: 'Wang Wu',
      phone: '13700137000',
      street: 'No.9988 Shennan Avenue, South District, Science Park',
      city: 'Shenzhen',
      state: 'Guangdong Province',
      country: 'China',
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
          name: 'Jadeite Bracelet',
          slug: 'jadeite-bracelet-premium',
          description: 'Myanmar Grade A jadeite bracelet, excellent transparency',
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
      full_name: 'Zhang San',
      phone: '13800138000',
      street: 'Room 1001, Tower A, China World Trade Center, No.1 Jianguomenwai Avenue',
      city: 'Beijing',
      state: 'Beijing',
      country: 'China',
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
          name: 'Hetian Jade Seed Material Raw Stone',
          slug: 'hetian-seed-raw',
          description: 'Xinjiang Hetian jade seed material raw stone, natural skin color',
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

// Mock shipping information
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
    carrier: 'SF Express',
    status: 'delivered',
    estimated_delivery: '2024-01-20T18:00:00Z',
    tracking_history: [
      {
        timestamp: '2024-01-15T10:30:00Z',
        status: 'Order Confirmed',
        location: 'Beijing Warehouse',
        description: 'Your order has been confirmed and is being prepared for shipment',
      },
      {
        timestamp: '2024-01-16T14:20:00Z',
        status: 'Shipped',
        location: 'Beijing Sorting Center',
        description: 'Package has been dispatched from Beijing warehouse',
      },
      {
        timestamp: '2024-01-17T08:45:00Z',
        status: 'In Transit',
        location: 'Beijing Transit Center',
        description: 'Package is in transit',
      },
      {
        timestamp: '2024-01-18T16:30:00Z',
        status: 'Arrived at Destination',
        location: 'Beijing Chaoyang District Service Point',
        description: 'Package has arrived at delivery station',
      },
      {
        timestamp: '2024-01-20T16:45:00Z',
        status: 'Delivered',
        location: 'China World Trade Center Tower A',
        description: 'Package successfully delivered, signed by: Zhang San',
      },
    ],
  },
  {
    order_id: 'order_002',
    tracking_number: 'YTO9876543210',
    carrier: 'YTO Express',
    status: 'in_transit',
    estimated_delivery: '2024-01-24T18:00:00Z',
    tracking_history: [
      {
        timestamp: '2024-01-18T14:20:00Z',
        status: 'Order Confirmed',
        location: 'Shanghai Warehouse',
        description: 'Your order has been confirmed and is being prepared for shipment',
      },
      {
        timestamp: '2024-01-19T10:15:00Z',
        status: 'Shipped',
        location: 'Shanghai Sorting Center',
        description: 'Package has been dispatched from Shanghai warehouse',
      },
      {
        timestamp: '2024-01-22T09:15:00Z',
        status: 'In Transit',
        location: 'Shanghai Pudong Transit Center',
        description: 'Package is in transit, expected delivery today',
      },
    ],
  },
  {
    order_id: 'order_003',
    tracking_number: 'ZTO5555666677',
    carrier: 'ZTO Express',
    status: 'preparing',
    estimated_delivery: '2024-01-28T18:00:00Z',
    tracking_history: [
      {
        timestamp: '2024-01-25T11:45:00Z',
        status: 'Order Confirmed',
        location: 'Beijing Warehouse',
        description: 'Your order has been confirmed and is being prepared for shipment',
      },
    ],
  },
];