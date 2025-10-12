// 前台用户类型 - 购物网站用户
export interface User {
  id: string;
  email: string;
  full_name: string;
  name: string; // 显示用户名
  username?: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  balance?: number;
  status: 'active' | 'inactive' | 'banned';
  email_verified: boolean; // 邮箱验证状态
  phone_verified: boolean; // 手机验证状态
  registration_source: 'email' | 'phone' | 'social'; // 注册来源
  last_login_at?: string;
  last_login_ip?: string;
  login_count: number; // 登录次数
  created_at: string;
  updated_at: string;
}

// 前台用户资料扩展信息
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 商品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  specifications: Record<string, any>;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  icon?: string;
  color?: string;
  product_count: number;
  is_featured: boolean;
  sort_order: number;
  tags: string[];
  subcategories?: Category[];
  created_at: string;
  updated_at: string;
}

// 分类筛选器
export interface CategoryFilters {
  search?: string;
  parent_id?: string;
  is_featured?: boolean;
  sort?: 'name' | 'product_count' | 'sort_order' | 'created_at';
  order?: 'asc' | 'desc';
}

// 分类统计信息
export interface CategoryStats {
  total_categories: number;
  featured_categories: number;
  categories_with_products: number;
  average_products_per_category: number;
}

// 购物车项目类型
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

// 订单相关类型
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: Product;
}

// 地址类型
export interface ShippingAddress {
  id?: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default?: boolean;
}

// 用户地址类型
export interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// 支付方式类型
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'paypal' | 'apple_pay' | 'google_pay' | 'credit_card' | 'bank_card' | 'balance';
  icon: string;
  description: string;
  enabled: boolean;
  processing_fee?: number;
  min_amount?: number;
  max_amount?: number;
}

// 支付记录类型
export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 结算表单类型
export interface CheckoutForm {
  shipping_address_id: string;
  payment_method: string;
  coupon_code?: string;
  notes?: string;
}

// 订单摘要类型
export interface OrderSummary {
  subtotal: number;
  shipping_fee: number;
  processing_fee_amount: number;
  discount_amount: number;
  total_amount: number;
  items_count: number;
}

// 支付请求类型
export interface PaymentRequest {
  order_id: string;
  payment_method: string;
  amount: number;
  payment_data?: Record<string, any>;
}

// 支付响应类型
export interface PaymentResponse {
  payment_id: string;
  status: 'pending' | 'completed' | 'failed';
  redirect_url?: string;
  transaction_id?: string;
  message?: string;
}

// 余额支付请求类型
export interface BalancePaymentRequest {
  order_id: string;
  amount: number;
  password: string;
}

// 余额支付响应类型
export interface BalancePaymentResponse {
  success: boolean;
  balance: number;
  transaction_id: string;
  message?: string;
}

// 优惠券类型
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

// 收藏夹类型
export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// 分页类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 搜索和筛选类型
export interface ProductFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  sort?: 'price_asc' | 'price_desc' | 'created_at' | 'name';
  search?: string;
}



// 表单类型
// 登录表单类型
export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

// 注册表单类型
export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  username?: string;
  phone?: string;
  agree_terms: boolean;
}

// 用户资料更新表单类型
export interface ProfileUpdateForm {
  full_name: string;
  username?: string;
  phone?: string;
  avatar_url?: string;
}

// 密码修改表单类型
export interface PasswordChangeForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// 认证响应类型
export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

// 认证错误类型
export interface AuthError {
  field?: string;
  message: string;
  code?: string;
}

// 动画相关类型
export interface Position {
  x: number;
  y: number;
}

export interface AnimationData {
  id: string;
  product: Product;
  startPosition: Position;
  endPosition: Position;
  timestamp: number;
}

export interface AnimationState {
  isAnimating: boolean;
  animationQueue: AnimationData[];
  currentAnimation: AnimationData | null;
}

export interface AddToCartAnimationProps {
  isAnimating: boolean;
  productImage: string;
  startPosition: Position;
  endPosition: Position;
  onAnimationComplete: () => void;
}

export interface UseAddToCartAnimationReturn {
  triggerAnimation: (product: Product, clickEvent: React.MouseEvent) => void;
  isAnimating: boolean;
  animationData: AnimationData | null;
  onAnimationComplete: () => void;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  enabled: boolean;
  respectReducedMotion: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 状态管理类型
export interface AppState {
  user: User | null;
  cart: CartItem[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

// 组件 Props 类型
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 路由参数类型
export interface ProductPageParams {
  id: string;
}

export interface OrderPageParams {
  id: string;
}

// 支付凭证类型
export interface PaymentVoucher {
  id: string;
  order_id: string;
  payment_id: string;
  voucher_number: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: 'valid' | 'used' | 'expired' | 'cancelled';
  issued_at: string;
  expires_at?: string;
  used_at?: string;
  metadata?: Record<string, any>;
}

// 交易日志类型
export interface TransactionLog {
  id: string;
  order_id: string;
  payment_id?: string;
  user_id: string;
  action: 'payment_initiated' | 'payment_completed' | 'payment_failed' | 'order_updated' | 'inventory_updated' | 'notification_sent' | 'voucher_generated';
  status: 'success' | 'failed' | 'pending';
  details: Record<string, any>;
  error_message?: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

// 通知类型
export interface Notification {
  id: string;
  user_id: string;
  type: 'payment_success' | 'order_status' | 'system' | 'promotion';
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

// 库存更新记录类型
export interface InventoryUpdate {
  id: string;
  product_id: string;
  order_id: string;
  quantity_changed: number;
  previous_quantity: number;
  new_quantity: number;
  reason: 'order_placed' | 'order_cancelled' | 'manual_adjustment' | 'return_processed';
  created_at: string;
}


// 后台管理员类型 - 系统管理用户
export interface AdminUser {
  id: string;
  username: string; // 管理员用户名（不是邮箱）
  email?: string; // 可选邮箱
  full_name: string; // 真实姓名
  role: AdminRole;
  avatar_url?: string;
  is_active: boolean;
  is_super_admin: boolean; // 是否为超级管理员
  department?: string; // 部门
  position?: string; // 职位
  last_login_at?: string;
  last_login_ip?: string;
  login_count: number;
  failed_login_attempts: number; // 失败登录次数
  locked_until?: string; // 账户锁定到期时间
  password_changed_at: string; // 密码修改时间
  two_factor_enabled: boolean; // 双因子认证
  permissions: Permission[];
  created_at: string;
  updated_at: string;
  created_by?: string; // 创建者ID
}

// 管理员角色类型
export type AdminRole = 'super_admin' | 'admin' | 'operator' | 'finance' | 'customer_service' | 'content_manager';

// 权限类型
export interface Permission {
  id: string;
  name: string; // 权限名称，如 'users.read'
  resource: string; // 资源类型，如 'users', 'products', 'orders'
  action: string; // 操作类型，如 'read', 'write', 'delete'
  description?: string;
  is_system: boolean; // 是否为系统权限（不可删除）
  created_at: string;
}

// 操作日志类型
export interface OperationLog {
  id: string;
  admin_user_id: string;
  admin_username: string;
  action: string; // 操作类型，如 'create_user', 'update_product', 'delete_order'
  resource_type: string; // 资源类型，如 'user', 'product', 'order'
  resource_id?: string; // 资源ID
  description: string; // 操作描述
  ip_address: string;
  user_agent: string;
  request_data?: Record<string, any>; // 请求数据
  response_data?: Record<string, any>; // 响应数据
  status: 'success' | 'failed' | 'error';
  error_message?: string;
  created_at: string;
}

// 角色权限关联
export interface RolePermission {
  id: string;
  admin_user_id: string;
  permission_id: string;
  granted_by: string; // 授权者ID
  granted_at: string;
  expires_at?: string; // 权限过期时间
}

// 管理员登录表单
export interface AdminLoginForm {
  username: string; // 使用用户名而非邮箱登录
  password: string;
  totp_code?: string; // 双因子认证码
  remember_me?: boolean;
}

// 前台用户登录表单
export interface UserLoginForm {
  email: string; // 前台用户使用邮箱登录
  password: string;
  remember_me?: boolean;
}

// 前台用户注册表单
export interface UserRegisterForm {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  phone?: string;
  agree_terms: boolean;
  verification_code?: string; // 邮箱/手机验证码
}

// 管理员认证响应
export interface AdminAuthResponse {
  admin: AdminUser;
  token: string;
  expires_at: string;
}

// 仪表板统计数据
export interface DashboardStats {
  users: {
    total: number;
    new_today: number;
    active_users: number;
    growth_rate: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    revenue: number;
    growth_rate: number;
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
    out_of_stock: number;
  };
  payments: {
    total_revenue: number;
    today_revenue: number;
    pending_amount: number;
    refund_amount: number;
  };
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// 操作日志类型 - 增强版本
export interface OperationLog {
  id: string;
  admin_user_id: string;
  admin_username: string;
  action: string; // 操作类型，如 'create_user', 'update_product', 'delete_order'
  resource_type: string; // 资源类型，如 'user', 'product', 'order'
  resource_id?: string; // 资源ID
  description: string; // 操作描述
  ip_address: string;
  user_agent: string;
  request_data?: Record<string, any>; // 请求数据
  response_data?: Record<string, any>; // 响应数据
  status: 'success' | 'failed' | 'error';
  error_message?: string;
  created_at: string;
}

// 系统设置类型
export interface SystemSettings {
  site_name: string;
  site_description: string;
  site_logo?: string;
  contact_email: string;
  contact_phone?: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_verification_required: boolean;
  max_login_attempts: number;
  session_timeout: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// 筛选参数
export interface FilterParams {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  [key: string]: any;
}



// 商品管理筛选
export interface ProductFilters extends FilterParams {
  category_id?: string;
  price_min?: number;
  price_max?: number;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_active?: boolean;
}

// 订单管理筛选
export interface OrderFilters extends FilterParams {
  status?: Order['status'];
  payment_status?: Order['payment_status'];
  payment_method?: string;
  amount_min?: number;
  amount_max?: number;
}

// 库存预警设置
export interface StockAlert {
  id: string;
  product_id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  alert_level: 'low' | 'critical' | 'out_of_stock';
  created_at: string;
}

// 销售报表数据
export interface SalesReport {
  period: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  top_products: {
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }[];
  payment_methods: {
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }[];
}



// 商品性能统计
export interface ProductPerformance {
  product_id: string;
  product_name: string;
  views: number;
  cart_additions: number;
  purchases: number;
  conversion_rate: number;
  revenue: number;
  profit_margin: number;
}

// 快捷操作类型
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  permission_required?: string;
  badge_count?: number;
}

// 通知类型扩展
export interface AdminNotification extends Notification {
  admin_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'order' | 'user' | 'product' | 'payment';
  action_required: boolean;
  action_url?: string;
}

// 系统健康状态
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory_usage: number;
  cpu_usage: number;
  disk_usage: number;
  database_status: 'connected' | 'disconnected' | 'slow';
  last_backup: string;
  active_sessions: number;
}

// 内容管理类型
export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  status: 'draft' | 'published' | 'archived';
  language: string;
  published_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// 富文本编辑器配置
export interface RichEditorConfig {
  toolbar: string[];
  plugins: string[];
  height: number;
  upload_url?: string;
  max_file_size: number;
  allowed_file_types: string[];
}



// ==================== 商品管理模块类型 ====================

// 商品详细信息（管理员视图）
export interface ProductDetail extends Product {
  views_count: number;
  cart_additions: number;
  purchase_count: number;
  conversion_rate: number;
  profit_margin: number;
  supplier_info?: {
    supplier_id: string;
    supplier_name: string;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
  };
  seo_info?: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    canonical_url?: string;
  };
}

// 商品编辑表单类型
export interface ProductEditForm {
  name: string;
  description: string;
  price: number;
  cost_price?: number;
  sku: string;
  category_id: string;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  stock_quantity: number;
  stock_warning_threshold: number;
  images: ProductImage[];
  specifications: ProductSpecification[];
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords: string[];
  promotional_price?: number;
  promotional_start_date?: string;
  promotional_end_date?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  is_featured: boolean;
  allow_reviews: boolean;
  track_inventory: boolean;
}

// 商品图片类型
export interface ProductImage {
  id?: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  file?: File;
  preview_url?: string;
}

// 商品规格类型
export interface ProductSpecification {
  id?: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'select' | 'color' | 'size';
  options?: string[];
  is_required: boolean;
  sort_order: number;
}

// 商品变体类型（多规格商品）
export interface ProductVariant {
  id?: string;
  sku: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  specifications: Record<string, string>;
  images?: string[];
  is_active: boolean;
}

// 商品分类选择器类型
export interface CategoryOption {
  id: string;
  name: string;
  parent_id?: string;
  level: number;
  path: string;
}

// 商品编辑验证错误类型
export interface ProductEditErrors {
  name?: string;
  description?: string;
  price?: string;
  sku?: string;
  category_id?: string;
  stock_quantity?: string;
  images?: string;
  specifications?: Record<string, string>;
  seo_title?: string;
  seo_description?: string;
}

// 商品保存状态类型
export interface ProductSaveState {
  isDraft: boolean;
  isPublishing: boolean;
  lastSaved?: string;
  hasUnsavedChanges: boolean;
}

// 富文本编辑器配置
export interface RichEditorConfig {
  toolbar: string[];
  plugins: string[];
  height: number;
  upload_url?: string;
  max_file_size: number;
  allowed_file_types: string[];
}

// 图片上传配置
export interface ImageUploadConfig {
  max_file_size: number;
  allowed_types: string[];
  max_images: number;
  compress_quality: number;
  thumbnail_size: {
    width: number;
    height: number;
  };
}

// 商品分类管理
export interface CategoryManagement extends Category {
  product_count: number;
  total_sales: number;
  is_featured: boolean;
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  banner_image?: string;
  created_by: string;
  updated_by: string;
}

// 分类编辑表单
export interface CategoryEditForm {
  name: string;
  description?: string;
  parent_id?: string;
  image?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  banner_image?: string;
  tags?: string[];
}

// 分类筛选器（管理端）
export interface CategoryManagementFilters {
  search?: string;
  parent_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
  has_products?: boolean;
  level?: number;
  sort?: 'name' | 'product_count' | 'sort_order' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
  date_range?: {
    start_date?: string;
    end_date?: string;
  };
}

// 分类树节点
export interface CategoryTreeNode extends CategoryManagement {
  children: CategoryTreeNode[];
  level: number;
  path: string[];
  hasChildren: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
}

// 分类统计信息（管理端）
export interface CategoryManagementStats {
  total_categories: number;
  active_categories: number;
  featured_categories: number;
  categories_with_products: number;
  categories_without_products: number;
  max_level: number;
  average_products_per_category: number;
  total_products: number;
  recent_categories: number; // 最近30天新增
}

// 分类操作日志
export interface CategoryOperationLog {
  id: string;
  category_id: string;
  operation: 'create' | 'update' | 'delete' | 'status_change' | 'move' | 'reorder';
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  operator_id: string;
  operator_name: string;
  created_at: string;
}

// 分类批量操作
export interface CategoryBatchOperation {
  operation: 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'move' | 'reorder';
  category_ids: string[];
  target_parent_id?: string; // for move operation
  new_sort_orders?: { id: string; sort_order: number }[]; // for reorder operation
}

// 分类导入/导出
export interface CategoryImportData {
  name: string;
  description?: string;
  parent_name?: string;
  image_url?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  tags?: string;
}

export interface CategoryExportConfig {
  format: 'csv' | 'excel' | 'json';
  include_subcategories: boolean;
  include_product_count: boolean;
  include_seo_data: boolean;
  include_images: boolean;
  filters?: CategoryManagementFilters;
}

// 分类验证错误
export interface CategoryValidationErrors {
  name?: string;
  description?: string;
  parent_id?: string;
  image?: string;
  sort_order?: string;
  seo_title?: string;
  seo_description?: string;
  general?: string;
}

// 库存管理
export interface InventoryManagement {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  reorder_point: number;
  reorder_quantity: number;
  cost_price: number;
  last_restock_date?: string;
  last_restock_quantity?: number;
  stock_alerts: StockAlert[];
  warehouse_location?: string;
  supplier_id?: string;
}

// 库存调整记录
export interface StockAdjustment {
  id: string;
  product_id: string;
  adjustment_type: 'increase' | 'decrease' | 'correction';
  quantity: number;
  reason: 'restock' | 'damage' | 'theft' | 'return' | 'correction' | 'promotion' | 'other';
  notes?: string;
  reference_number?: string;
  adjusted_by: string;
  approved_by?: string;
  created_at: string;
}

// 库存管理筛选条件
export interface InventoryFilters {
  search?: string;
  category_id?: string;
  status?: 'normal' | 'low_stock' | 'out_of_stock' | 'overstock';
  supplier_id?: string;
  warehouse_location?: string;
  stock_range?: {
    min: number;
    max: number;
  };
  last_updated?: {
    start_date: string;
    end_date: string;
  };
  sort_by?: 'product_name' | 'current_stock' | 'available_stock' | 'last_restock_date' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// 库存统计信息
export interface InventoryStats {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  overstock_count: number;
  total_reserved: number;
  total_available: number;
  reorder_needed: number;
  stock_turnover_rate: number;
  average_stock_level: number;
  monthly_stock_movement: {
    month: string;
    inbound: number;
    outbound: number;
    adjustments: number;
  }[];
}

// 库存预警
export interface StockAlert {
  id: string;
  product_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock' | 'reorder_point';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

// 库存调整表单
export interface InventoryAdjustmentForm {
  product_id: string;
  adjustment_type: 'increase' | 'decrease' | 'correction';
  quantity: number;
  reason: 'restock' | 'damage' | 'theft' | 'return' | 'correction' | 'promotion' | 'other';
  notes?: string;
  reference_number?: string;
  warehouse_location?: string;
  cost_impact?: number;
}

// 批量库存调整
export interface BatchInventoryAdjustment {
  adjustments: InventoryAdjustmentForm[];
  batch_notes?: string;
  approval_required: boolean;
  scheduled_date?: string;
}

// 库存预警规则
export interface InventoryAlertRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    stock_level?: {
      operator: 'less_than' | 'greater_than' | 'equals';
      value: number;
      percentage?: boolean;
    };
    stock_ratio?: {
      operator: 'less_than' | 'greater_than';
      value: number;
    };
    days_since_restock?: number;
    turnover_rate?: {
      operator: 'less_than' | 'greater_than';
      value: number;
    };
  };
  actions: {
    send_email: boolean;
    send_sms: boolean;
    create_task: boolean;
    auto_reorder: boolean;
  };
  recipients: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 库存报告配置
export interface InventoryReportConfig {
  report_type: 'stock_levels' | 'stock_movements' | 'low_stock' | 'valuation' | 'turnover';
  date_range: {
    start_date: string;
    end_date: string;
  };
  filters: InventoryFilters;
  group_by?: 'category' | 'supplier' | 'warehouse' | 'product';
  include_charts: boolean;
  format: 'pdf' | 'excel' | 'csv';
}

// 供应商信息
export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  payment_terms: string;
  lead_time_days: number;
  minimum_order_quantity: number;
  is_active: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

// 仓库信息
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  capacity: number;
  current_utilization: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 库存移动记录
export interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  from_location?: string;
  to_location?: string;
  reference_type: 'order' | 'return' | 'adjustment' | 'transfer' | 'damage';
  reference_id: string;
  cost_per_unit?: number;
  total_cost?: number;
  notes?: string;
  created_by: string;
  created_at: string;
}

// 库存盘点
export interface StockCount {
  id: string;
  count_number: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  count_type: 'full' | 'partial' | 'cycle';
  warehouse_id?: string;
  category_id?: string;
  scheduled_date: string;
  started_at?: string;
  completed_at?: string;
  counted_by: string[];
  approved_by?: string;
  total_products: number;
  discrepancies_found: number;
  total_variance_value: number;
  notes?: string;
  created_at: string;
}

// 库存盘点明细
export interface StockCountDetail {
  id: string;
  stock_count_id: string;
  product_id: string;
  expected_quantity: number;
  counted_quantity: number;
  variance: number;
  variance_value: number;
  reason?: string;
  counted_by: string;
  verified_by?: string;
  created_at: string;
}

// 商品上下架记录
export interface ProductStatusLog {
  id: string;
  product_id: string;
  previous_status: boolean;
  new_status: boolean;
  reason: string;
  changed_by: string;
  created_at: string;
}

// 商品销售统计
export interface ProductSalesStats {
  product_id: string;
  total_sales: number;
  total_revenue: number;
  monthly_sales: {
    month: string;
    sales: number;
    revenue: number;
  }[];
  weekly_sales: {
    week: string;
    sales: number;
    revenue: number;
  }[];
  daily_sales: {
    date: string;
    sales: number;
    revenue: number;
  }[];
  conversion_rate: number;
  average_order_value: number;
  return_rate: number;
  customer_satisfaction: number;
}

// 商品操作日志
export interface ProductOperationLog {
  id: string;
  product_id: string;
  operation: 'create' | 'update' | 'delete' | 'status_change' | 'stock_adjustment' | 'price_change';
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  operator_id: string;
  operator_name: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// ==================== 订单管理模块类型 ====================

// 订单管理筛选器
export interface OrderFilters {
  status?: OrderStatus[];
  payment_status?: PaymentStatus[];
  date_range?: {
    start_date: string;
    end_date: string;
  };
  amount_range?: {
    min_amount: number;
    max_amount: number;
  };
  customer_id?: string;
  customer_name?: string;
  order_number?: string;
  product_id?: string;
  shipping_method?: string;
  payment_method?: string;
  tags?: string[];
  has_notes?: boolean;
  has_after_sales?: boolean;
}

// 订单统计信息
export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  refunded_orders: number;
  total_revenue: number;
  average_order_value: number;
  orders_growth_rate: number;
  revenue_growth_rate: number;
  top_customers: {
    customer_id: string;
    customer_name: string;
    total_orders: number;
    total_spent: number;
  }[];
  top_products: {
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }[];
  daily_stats: {
    date: string;
    orders: number;
    revenue: number;
  }[];
  monthly_stats: {
    month: string;
    orders: number;
    revenue: number;
  }[];
}

// 订单操作类型
export interface OrderOperation {
  type: 'confirm_payment' | 'ship_order' | 'cancel_order' | 'refund_order' | 'add_note' | 'update_address' | 'update_items';
  order_id: string;
  data?: any;
  reason?: string;
  notes?: string;
}

// 批量订单操作
export interface BatchOrderOperation {
  operation: 'ship' | 'cancel' | 'confirm_payment' | 'add_tag' | 'remove_tag' | 'export';
  order_ids: string[];
  data?: any;
  reason?: string;
}

// 订单分析配置
export interface OrderAnalyticsConfig {
  date_range: {
    start_date: string;
    end_date: string;
  };
  group_by: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: ('orders' | 'revenue' | 'average_order_value' | 'conversion_rate')[];
  filters: OrderFilters;
  compare_previous_period: boolean;
}

// 订单打印配置
export interface OrderPrintConfig {
  order_id: string;
  include_customer_info: boolean;
  include_shipping_label: boolean;
  include_invoice: boolean;
  include_packing_slip: boolean;
  paper_size: 'A4' | 'Letter' | 'Thermal';
  orientation: 'portrait' | 'landscape';
}

// 订单状态流转规则
export interface OrderStatusRule {
  from_status: OrderStatus;
  to_status: OrderStatus;
  conditions?: {
    payment_confirmed?: boolean;
    stock_available?: boolean;
    address_verified?: boolean;
  };
  auto_transition?: boolean;
  required_permissions?: string[];
}

// 订单通知配置
export interface OrderNotificationConfig {
  order_id: string;
  notification_type: 'email' | 'sms' | 'push';
  template: string;
  recipients: string[];
  variables: Record<string, any>;
  send_at?: string;
}

// 订单审核记录
export interface OrderAuditLog {
  id: string;
  order_id: string;
  action: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id: string;
  user_name: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// 订单风险评估
export interface OrderRiskAssessment {
  order_id: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: {
    factor: string;
    score: number;
    description: string;
  }[];
  recommended_actions: string[];
  auto_hold: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
}

// 订单履行状态
export interface OrderFulfillmentStatus {
  order_id: string;
  items: {
    product_id: string;
    quantity_ordered: number;
    quantity_fulfilled: number;
    quantity_cancelled: number;
    fulfillment_status: 'pending' | 'partial' | 'fulfilled' | 'cancelled';
  }[];
  overall_status: 'pending' | 'partial' | 'fulfilled' | 'cancelled';
  estimated_fulfillment_date?: string;
  actual_fulfillment_date?: string;
}

// 文章管理
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id: string;
  category_name: string;
  tags: string[];
  author_id: string;
  author_name: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  visibility: 'public' | 'private' | 'password_protected';
  password?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords: string[];
  published_at?: string;
  scheduled_at?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  allow_comments: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// 文章分类
export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  article_count: number;
  created_at: string;
  updated_at: string;
}

// 广告位管理
export interface Advertisement {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'footer' | 'banner' | 'popup' | 'inline';
  type: 'image' | 'html' | 'video';
  content: {
    image_url?: string;
    link_url?: string;
    html_content?: string;
    video_url?: string;
    alt_text?: string;
  };
  targeting: {
    pages: string[];
    user_types: ('guest' | 'registered' | 'premium')[];
    devices: ('desktop' | 'mobile' | 'tablet')[];
    start_date?: string;
    end_date?: string;
  };
  display_rules: {
    max_impressions?: number;
    max_clicks?: number;
    frequency_cap?: number;
  };
  statistics: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversion_rate: number;
  };
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// 页面内容管理
export interface PageContent {
  id: string;
  page_type: 'homepage' | 'about' | 'contact' | 'terms' | 'privacy' | 'custom';
  section_name: string;
  content_type: 'text' | 'image' | 'carousel' | 'video' | 'html';
  content_data: {
    text?: string;
    images?: {
      url: string;
      alt: string;
      link?: string;
      caption?: string;
    }[];
    html?: string;
    video_url?: string;
  };
  display_order: number;
  is_active: boolean;
  language: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

// 轮播图管理
export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  mobile_image_url?: string;
  link_url?: string;
  link_text?: string;
  position: number;
  is_active: boolean;
  display_duration: number;
  animation_type: 'fade' | 'slide' | 'zoom';
  created_at: string;
  updated_at: string;
}

// 媒体文件管理
export interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_type: 'image' | 'video' | 'audio' | 'document';
  dimensions?: {
    width: number;
    height: number;
  };
  alt_text?: string;
  caption?: string;
  uploaded_by: string;
  used_in: {
    type: 'product' | 'article' | 'advertisement' | 'page_content';
    id: string;
    title: string;
  }[];
  created_at: string;
}

// ==================== 通用管理类型 ====================

// 批量操作
export interface BulkOperation {
  action: 'delete' | 'update' | 'export' | 'activate' | 'deactivate';
  target_ids: string[];
  parameters?: Record<string, any>;
}

// 批量操作结果
export interface BulkOperationResult {
  success_count: number;
  failure_count: number;
  errors: {
    id: string;
    error: string;
  }[];
}

// 数据导入配置
export interface ImportConfig {
  file_type: 'csv' | 'excel' | 'json';
  has_header: boolean;
  field_mapping: Record<string, string>;
  validation_rules: Record<string, any>;
  duplicate_handling: 'skip' | 'update' | 'error';
}

// 数据导入结果
export interface ImportResult {
  total_rows: number;
  success_count: number;
  failure_count: number;
  skipped_count: number;
  errors: {
    row: number;
    field?: string;
    error: string;
  }[];
  warnings: {
    row: number;
    field?: string;
    warning: string;
  }[];
}

// 审计日志
export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  performed_by: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// ==================== 支付管理模块类型 ====================

// 支付管理筛选器
export interface PaymentManagementFilters {
  status?: Payment['status'][];
  method?: string[];
  date_range?: {
    start_date: string;
    end_date: string;
  };
  amount_range?: {
    min_amount: number;
    max_amount: number;
  };
  order_id?: string;
  customer_id?: string;
  transaction_id?: string;
  gateway?: string;
  has_refund?: boolean;
  risk_level?: 'low' | 'medium' | 'high';
}

// 支付统计信息
export interface PaymentStats {
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  pending_payments: number;
  refunded_payments: number;
  total_amount: number;
  successful_amount: number;
  refunded_amount: number;
  success_rate: number;
  refund_rate: number;
  average_payment_amount: number;
  payment_growth_rate: number;
  revenue_growth_rate: number;
  top_payment_methods: {
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }[];
  daily_stats: {
    date: string;
    payments: number;
    amount: number;
    success_rate: number;
  }[];
  monthly_stats: {
    month: string;
    payments: number;
    amount: number;
    success_rate: number;
  }[];
  hourly_distribution: {
    hour: number;
    payments: number;
    amount: number;
  }[];
}

// 支付配置
export interface PaymentConfig {
  id: string;
  method: string;
  name: string;
  description?: string;
  is_enabled: boolean;
  is_test_mode: boolean;
  gateway_config: {
    api_key?: string;
    secret_key?: string;
    merchant_id?: string;
    app_id?: string;
    callback_url?: string;
    webhook_url?: string;
    [key: string]: any;
  };
  fee_config: {
    type: 'fixed' | 'percentage' | 'mixed';
    fixed_fee?: number;
    percentage_fee?: number;
    min_fee?: number;
    max_fee?: number;
  };
  limits: {
    min_amount?: number;
    max_amount?: number;
    daily_limit?: number;
    monthly_limit?: number;
  };
  risk_settings: {
    enable_risk_check: boolean;
    max_failed_attempts: number;
    block_duration_minutes: number;
    require_verification_above: number;
  };
  supported_currencies: string[];
  supported_countries: string[];
  processing_time_minutes: number;
  refund_policy: {
    auto_refund_enabled: boolean;
    refund_window_days: number;
    partial_refund_allowed: boolean;
  };
  created_at: string;
  updated_at: string;
}

// 退款请求
export interface RefundRequest {
  id: string;
  payment_id: string;
  order_id: string;
  customer_id: string;
  refund_type: 'full' | 'partial';
  requested_amount: number;
  approved_amount?: number;
  reason: string;
  reason_category: 'customer_request' | 'order_cancelled' | 'product_defect' | 'shipping_issue' | 'duplicate_payment' | 'fraud' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_by: string;
  approved_by?: string;
  processed_by?: string;
  customer_notes?: string;
  internal_notes?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  refund_method: 'original_payment' | 'bank_transfer' | 'store_credit' | 'cash';
  expected_processing_time?: string;
  actual_processing_time?: string;
  gateway_response?: Record<string, any>;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  processed_at?: string;
  completed_at?: string;
}

// 支付分析数据
export interface PaymentAnalytics {
  overview: {
    total_transactions: number;
    total_volume: number;
    success_rate: number;
    average_transaction_value: number;
    growth_rate: number;
  };
  trends: {
    daily: {
      date: string;
      transactions: number;
      volume: number;
      success_rate: number;
    }[];
    weekly: {
      week: string;
      transactions: number;
      volume: number;
      success_rate: number;
    }[];
    monthly: {
      month: string;
      transactions: number;
      volume: number;
      success_rate: number;
    }[];
  };
  payment_methods: {
    method: string;
    transactions: number;
    volume: number;
    success_rate: number;
    average_value: number;
    market_share: number;
  }[];
  geographic_distribution: {
    country: string;
    region?: string;
    transactions: number;
    volume: number;
    success_rate: number;
  }[];
  failure_analysis: {
    reason: string;
    count: number;
    percentage: number;
    impact_amount: number;
  }[];
  customer_segments: {
    segment: string;
    customers: number;
    transactions: number;
    volume: number;
    average_value: number;
  }[];
  risk_metrics: {
    high_risk_transactions: number;
    fraud_detected: number;
    chargebacks: number;
    dispute_rate: number;
  };
}

// 支付风险评估
export interface PaymentRiskAssessment {
  id: string;
  payment_id: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: {
    factor: string;
    score: number;
    weight: number;
    description: string;
  }[];
  recommendations: string[];
  auto_actions: {
    action: 'approve' | 'review' | 'decline' | 'require_verification';
    reason: string;
  }[];
  manual_review_required: boolean;
  reviewed_by?: string;
  review_notes?: string;
  final_decision?: 'approved' | 'declined';
  created_at: string;
  updated_at: string;
}

// 支付网关响应
export interface PaymentGatewayResponse {
  gateway: string;
  transaction_id: string;
  status: 'success' | 'failed' | 'pending' | 'cancelled';
  response_code: string;
  response_message: string;
  raw_response: Record<string, any>;
  processing_time_ms: number;
  fees: {
    gateway_fee: number;
    processing_fee: number;
    total_fee: number;
  };
  created_at: string;
}

// 支付审计日志
export interface PaymentAuditLog {
  id: string;
  payment_id?: string;
  refund_id?: string;
  action: 'payment_created' | 'payment_updated' | 'payment_cancelled' | 'refund_requested' | 'refund_approved' | 'refund_processed' | 'config_updated' | 'manual_intervention';
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  operator_id: string;
  operator_name: string;
  operator_role: string;
  ip_address: string;
  user_agent: string;
  session_id?: string;
  risk_score?: number;
  created_at: string;
}

// 支付通知/Webhook
export interface PaymentWebhook {
  id: string;
  payment_id: string;
  gateway: string;
  event_type: string;
  payload: Record<string, any>;
  signature?: string;
  status: 'received' | 'processing' | 'processed' | 'failed' | 'ignored';
  processing_attempts: number;
  last_attempt_at?: string;
  error_message?: string;
  created_at: string;
  processed_at?: string;
}

// 支付报表配置
export interface PaymentReportConfig {
  id: string;
  name: string;
  description?: string;
  report_type: 'transactions' | 'revenue' | 'refunds' | 'fees' | 'reconciliation' | 'risk_analysis';
  filters: PaymentManagementFilters;
  columns: string[];
  grouping?: {
    field: string;
    interval?: 'hour' | 'day' | 'week' | 'month' | 'year';
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  format: 'csv' | 'excel' | 'pdf' | 'json';
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

// 支付限额规则
export interface PaymentLimitRule {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  rule_type: 'customer' | 'payment_method' | 'global' | 'merchant';
  conditions: {
    customer_tier?: string[];
    payment_methods?: string[];
    countries?: string[];
    time_window?: {
      start_time: string;
      end_time: string;
      days_of_week?: number[];
    };
  };
  limits: {
    single_transaction?: {
      min_amount?: number;
      max_amount?: number;
    };
    daily?: {
      max_amount?: number;
      max_transactions?: number;
    };
    weekly?: {
      max_amount?: number;
      max_transactions?: number;
    };
    monthly?: {
      max_amount?: number;
      max_transactions?: number;
    };
  };
  actions: {
    on_exceed: 'block' | 'require_approval' | 'notify_only';
    notification_recipients?: string[];
  };
  created_at: string;
  updated_at: string;
}

// 支付对账记录
export interface PaymentReconciliation {
  id: string;
  reconciliation_date: string;
  gateway: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'partial';
  total_transactions: number;
  matched_transactions: number;
  unmatched_transactions: number;
  discrepancies: {
    transaction_id: string;
    our_amount: number;
    gateway_amount: number;
    difference: number;
    reason?: string;
  }[];
  gateway_file_url?: string;
  reconciliation_file_url?: string;
  processed_by?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

// 发货管理相关类型
export interface Shipping {
  id: string;
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: {
    province: string;
    city: string;
    district: string;
    address: string;
    postalCode?: string;
  };
  carrier: string;
  trackingNumber?: string;
  status: 'pending' | 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  packageType?: string;
  shippingCost?: number;
  insuranceValue?: number;
  notes?: string;
  trackingHistory?: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

// 物流跟踪事件
export interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
  location?: string;
  operator?: string;
}

// 发货筛选器
export interface ShippingFilters {
  status?: Shipping['status'];
  carrier?: string;
  region?: string;
  dateFrom?: string;
  dateTo?: string;
  orderId?: string;
  trackingNumber?: string;
}

// 发货统计信息
export interface ShippingStats {
  totalShippings: number;
  pendingShippings: number;
  preparingShippings: number;
  shippedShippings: number;
  inTransitShippings: number;
  deliveredShippings: number;
  failedShippings: number;
  returnedShippings: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  totalShippingCost: number;
  dailyStats: {
    date: string;
    shippings: number;
    delivered: number;
    cost: number;
  }[];
  carrierStats: {
    carrier: string;
    shippings: number;
    deliveryRate: number;
    averageTime: number;
    cost: number;
  }[];
}

// 物流公司配置
export interface CarrierConfig {
  id: string;
  name: string;
  code: string;
  logo?: string;
  isActive: boolean;
  apiConfig?: {
    apiKey?: string;
    apiSecret?: string;
    endpoint?: string;
    trackingUrl?: string;
  };
  serviceTypes: {
    code: string;
    name: string;
    description?: string;
    estimatedDays: number;
    isActive: boolean;
  }[];
  supportedRegions: string[];
  pricingRules: {
    basePrice: number;
    weightRules: {
      maxWeight: number;
      pricePerKg: number;
    }[];
    distanceRules: {
      maxDistance: number;
      pricePerKm: number;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

// 发货规则配置
export interface ShippingRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  conditions: {
    orderValue?: {
      min?: number;
      max?: number;
    };
    weight?: {
      min?: number;
      max?: number;
    };
    destination?: {
      provinces?: string[];
      cities?: string[];
      excludeRegions?: string[];
    };
    productCategories?: string[];
    customerTiers?: string[];
  };
  actions: {
    autoSelectCarrier?: string;
    freeShipping?: boolean;
    discountPercentage?: number;
    priorityLevel?: 'low' | 'normal' | 'high' | 'urgent';
    requireSignature?: boolean;
    requireInsurance?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// 运费模板
export interface ShippingTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  calculationMethod: 'weight' | 'volume' | 'quantity' | 'fixed';
  freeShippingThreshold?: number;
  regions: {
    name: string;
    provinces: string[];
    cities?: string[];
    rules: {
      firstUnit: number;
      firstUnitPrice: number;
      additionalUnit: number;
      additionalUnitPrice: number;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

// 发货配置
export interface ShippingConfig {
  id: string;
  autoShipping: boolean;
  defaultCarrier: string;
  defaultPackageType: string;
  requireSignature: boolean;
  requireInsurance: boolean;
  maxInsuranceValue: number;
  businessHours: {
    start: string;
    end: string;
    workdays: number[];
  };
  cutoffTime: string;
  processingDays: number;
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    templates: {
      shipped: string;
      delivered: string;
      failed: string;
    };
  };
  integrations: {
    trackingApi: boolean;
    labelPrinting: boolean;
    batchProcessing: boolean;
  };
  updatedAt: string;
}

// 物流跟踪查询
export interface LogisticsTracking {
  trackingNumber: string;
  carrier: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  lastUpdated: string;
}

// 发货分析配置
export interface ShippingAnalyticsConfig {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: ('shippings' | 'deliveryRate' | 'averageTime' | 'cost' | 'customerSatisfaction')[];
  filters: ShippingFilters;
  comparePreviousPeriod: boolean;
}

// 发货批量操作
export interface BatchShippingOperation {
  operation: 'ship' | 'updateCarrier' | 'updateStatus' | 'printLabels' | 'export' | 'cancel';
  shippingIds: string[];
  data?: any;
  reason?: string;
}

// 发货异常
export interface ShippingException {
  id: string;
  shippingId: string;
  type: 'delivery_failed' | 'address_invalid' | 'package_damaged' | 'customer_unavailable' | 'weather_delay' | 'carrier_issue';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedBy?: string;
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 发货标签打印
export interface ShippingLabel {
  id: string;
  shippingId: string;
  carrier: string;
  labelUrl: string;
  labelFormat: 'PDF' | 'PNG' | 'ZPL' | 'EPL';
  paperSize: 'A4' | 'A5' | '4x6' | '4x8';
  createdAt: string;
}

// 发货成本分析
export interface ShippingCostAnalysis {
  period: string;
  totalCost: number;
  averageCostPerShipment: number;
  costByCarrier: {
    carrier: string;
    cost: number;
    percentage: number;
  }[];
  costByRegion: {
    region: string;
    cost: number;
    percentage: number;
  }[];
  costTrends: {
    date: string;
    cost: number;
    shipments: number;
  }[];
  savingsOpportunities: {
    opportunity: string;
    potentialSavings: number;
    description: string;
  }[];
}

// 发货时效分析
export interface DeliveryTimeAnalysis {
  period: string;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  performanceByCarrier: {
    carrier: string;
    averageTime: number;
    onTimeRate: number;
    totalShipments: number;
  }[];
  performanceByRegion: {
    region: string;
    averageTime: number;
    onTimeRate: number;
    totalShipments: number;
  }[];
  trends: {
    date: string;
    averageTime: number;
    onTimeRate: number;
  }[];
  delayReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
}

// ==================== 内容管理模块类型 ====================

// 内容分类
export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  children?: ContentCategory[];
  level: number;
  sort_order: number;
  is_active: boolean;
  content_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  thumbnail?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// 内容标签
export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  usage_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// 内容编辑历史
export interface ContentHistory {
  id: string;
  content_id: string;
  version: number;
  title: string;
  content: string;
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  edited_by: string;
  edit_reason?: string;
  created_at: string;
}

// 内容评论
export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  comment: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  parent_id?: string;
  replies?: ContentComment[];
  is_pinned: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

// SEO设置
export interface SEOSettings {
  id: string;
  entity_type: 'content' | 'category' | 'tag' | 'page';
  entity_id: string;
  title?: string;
  description?: string;
  keywords?: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots?: string[];
  schema_markup?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 内容分析数据
export interface ContentAnalytics {
  id: string;
  content_id: string;
  date: string;
  views: number;
  unique_views: number;
  likes: number;
  shares: number;
  comments: number;
  bounce_rate: number;
  avg_time_on_page: number;
  traffic_sources: {
    source: string;
    visits: number;
    percentage: number;
  }[];
  devices: {
    device: 'desktop' | 'mobile' | 'tablet';
    visits: number;
    percentage: number;
  }[];
  locations: {
    country: string;
    city?: string;
    visits: number;
  }[];
}

// 内容管理筛选器
export interface ContentManagementFilters {
  type?: Content['type'][];
  status?: Content['status'][];
  category_id?: string[];
  tag_id?: string[];
  author?: string[];
  date_range?: {
    start_date: string;
    end_date: string;
  };
  has_thumbnail?: boolean;
  view_count_range?: {
    min_views: number;
    max_views: number;
  };
  is_featured?: boolean;
  language?: string[];
}

// 内容统计
export interface ContentStats {
  total_contents: number;
  published_contents: number;
  draft_contents: number;
  archived_contents: number;
  total_views: number;
  total_comments: number;
  total_likes: number;
  total_shares: number;
  content_by_type: {
    type: Content['type'];
    count: number;
    percentage: number;
  }[];
  content_by_category: {
    category_id: string;
    category_name: string;
    count: number;
  }[];
  top_authors: {
    author: string;
    content_count: number;
    total_views: number;
  }[];
  recent_activity: {
    date: string;
    created: number;
    published: number;
    updated: number;
  }[];
}

// 内容发布设置
export interface ContentPublishSettings {
  publish_type: 'immediate' | 'scheduled' | 'draft';
  scheduled_at?: string;
  visibility: 'public' | 'private' | 'password' | 'members_only';
  password?: string;
  allow_comments: boolean;
  allow_likes: boolean;
  allow_shares: boolean;
  is_featured: boolean;
  notify_subscribers: boolean;
  social_auto_post: {
    enabled: boolean;
    platforms: ('facebook' | 'twitter' | 'linkedin' | 'instagram')[];
    custom_message?: string;
  };
}

// 富文本编辑器配置
export interface RichEditorConfig {
  toolbar: string[];
  plugins: string[];
  image_upload_url: string;
  max_file_size: number;
  allowed_file_types: string[];
  auto_save: boolean;
  auto_save_interval: number;
  spell_check: boolean;
  word_count: boolean;
}

// 网站地图项
export interface SitemapItem {
  id: string;
  url: string;
  title: string;
  last_modified: string;
  change_frequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  type: 'content' | 'category' | 'tag' | 'page';
  entity_id: string;
  is_indexed: boolean;
}

// SEO分析报告
export interface SEOAnalysisReport {
  id: string;
  entity_type: 'content' | 'category' | 'page';
  entity_id: string;
  score: number;
  issues: {
    type: 'error' | 'warning' | 'info';
    category: 'title' | 'description' | 'keywords' | 'content' | 'images' | 'links';
    message: string;
    suggestion: string;
  }[];
  keywords: {
    keyword: string;
    density: number;
    position: number;
    is_optimal: boolean;
  }[];
  readability: {
    score: number;
    grade_level: string;
    avg_sentence_length: number;
    difficult_words: number;
  };
  performance: {
    load_time: number;
    mobile_friendly: boolean;
    https_enabled: boolean;
    structured_data: boolean;
  };
  created_at: string;
}

// 关键词分析
export interface KeywordAnalysis {
  id: string;
  keyword: string;
  search_volume: number;
  competition: 'low' | 'medium' | 'high';
  cpc: number;
  difficulty: number;
  related_keywords: string[];
  content_suggestions: string[];
  current_ranking?: number;
  target_ranking: number;
  created_at: string;
  updated_at: string;
}

// 内容模板
export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  type: Content['type'];
  template_data: {
    title_template?: string;
    content_template?: string;
    default_tags?: string[];
    default_category?: string;
    seo_template?: Partial<SEOSettings>;
  };
  usage_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// 内容工作流
export interface ContentWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: {
    id: string;
    name: string;
    type: 'review' | 'approval' | 'publish' | 'notify';
    assignee_role: string;
    is_required: boolean;
    auto_advance: boolean;
    order: number;
  }[];
  content_types: Content['type'][];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 内容工作流实例
export interface ContentWorkflowInstance {
  id: string;
  workflow_id: string;
  content_id: string;
  current_step: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  steps_completed: {
    step_id: string;
    completed_by: string;
    completed_at: string;
    notes?: string;
  }[];
  created_at: string;
  updated_at: string;
}

// ==================== 用户管理模块重构 - 新增类型定义 ====================

// 管理员角色详细信息
export interface AdminRoleDetail {
  role: AdminRole;
  name: string;
  description: string;
  permissions: Permission[];
  is_system_role: boolean;
  user_count: number;
}

// 管理员创建表单
export interface AdminCreateForm {
  username: string;
  email?: string;
  full_name: string;
  password: string;
  confirm_password: string;
  role: AdminRole;
  department?: string;
  position?: string;
  permissions: string[];
  is_active: boolean;
  two_factor_enabled: boolean;
}

// 管理员编辑表单
export interface AdminEditForm {
  email?: string;
  full_name: string;
  role: AdminRole;
  department?: string;
  position?: string;
  permissions: string[];
  is_active: boolean;
  two_factor_enabled: boolean;
}

// 管理员密码重置表单
export interface AdminPasswordResetForm {
  current_password?: string;
  new_password: string;
  confirm_password: string;
  force_reset?: boolean;
}

// 角色管理表单
export interface RoleForm {
  name: string;
  description: string;
  permissions: string[];
  is_active: boolean;
}

// 管理员筛选条件
export interface AdminFilters extends FilterParams {
  role?: AdminRole;
  department?: string;
  is_active?: boolean;
  is_super_admin?: boolean;
  last_login_from?: string;
  last_login_to?: string;
  created_from?: string;
  created_to?: string;
}

// 管理员统计数据
export interface AdminStats {
  total_admins: number;
  active_admins: number;
  super_admins: number;
  locked_accounts: number;
  recent_logins: number;
  failed_login_attempts: number;
  role_distribution: {
    role: AdminRole;
    count: number;
    percentage: number;
  }[];
  department_distribution: {
    department: string;
    count: number;
  }[];
}

// 安全设置
export interface SecuritySettings {
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
    password_history: number;
    max_age_days: number;
  };
  login_policy: {
    max_failed_attempts: number;
    lockout_duration_minutes: number;
    session_timeout_minutes: number;
    require_2fa: boolean;
    allow_concurrent_sessions: boolean;
  };
  ip_restrictions: {
    enabled: boolean;
    allowed_ips: string[];
    blocked_ips: string[];
  };
}

// 审计日志筛选
export interface AuditLogFilters extends FilterParams {
  admin_id?: string;
  action?: string;
  resource_type?: string;
  status?: OperationLog['status'];
  ip_address?: string;
  date_from?: string;
  date_to?: string;
}