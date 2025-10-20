// 商品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  sales: number;
  stock: number;
  specifications: Record<string, string>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 商品分类类型
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  children?: Category[];
}

// 购物车商品类型
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  specifications?: Record<string, string>;
  description?: string;
  stock?: number;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: Address[];
  birthday?: string;
  gender?: string;
  createdAt: string;
}

// 地址类型
export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 订单类型
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// 订单商品类型
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  specifications?: Record<string, string>;
}

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 商品查询参数类型
export interface ProductQueryParams extends PaginationParams {
  category?: string;
  search?: string;
  sort?: 'created_at' | 'price_asc' | 'price_desc' | 'sales' | 'rating';
  minPrice?: number;
  maxPrice?: number;
}

// 用户状态类型
export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// 购物车状态类型
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// 评价类型
export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

// 收藏类型
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

// 收藏状态类型
export interface FavoriteState {
  favorites: (Product & { addedAt: string })[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
  getFavoritesByCategory: (category: string) => (Product & { addedAt: string })[];
  getFavoritesCount: () => number;
}

// 地址状态类型
export interface AddressState {
  addresses: Address[];
  defaultAddress: Address | null;
  addAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAddress: (id: string, address: Partial<Omit<Address, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getAddressesByUserId: (userId: string) => Address[];
}

// 用户设置类型
export interface UserSettings {
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  privacy: {
    showProfile: boolean;
    showPurchaseHistory: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginNotifications: boolean;
  };
}