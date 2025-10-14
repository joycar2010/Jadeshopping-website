import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  CartItem, 
  Product, 
  LoginForm,
  RegisterForm,
  ProfileUpdateForm,
  PasswordChangeForm,
  AuthResponse,
  AuthError,
  UserAddress,
  PaymentMethod,
  Order,
  OrderSummary,
  CheckoutForm,
  PaymentRequest,
  PaymentResponse,
  BalancePaymentRequest,
  BalancePaymentResponse,
  Coupon,
  PaymentVoucher,
  TransactionLog,
  Notification,
  InventoryUpdate,
  // Admin types removed
  PaginationParams,
  FilterParams,

  ProductFilters,
  OrderFilters,
  // StockAlert removed
  // SalesReport removed

  // ProductPerformance removed
  // QuickAction removed
  // AdminNotification removed
  // SystemHealth removed
  ContentPage,

  ProductDetail,
  CategoryManagement,
  InventoryManagement,
  StockAdjustment,
  ProductStatusLog,
  OrderDetail,
  OrderTimeline,
  OrderNote,
  AfterSalesService,
  PaymentDetail,
  PaymentMethodConfig,
  ReconciliationRecord,
  RefundRequest,
  ShippingOrder,
  LogisticsProvider,
  DeliveryStatusUpdate,
  ShippingRecord,
  Article,
  ArticleCategory,
  Advertisement,
  PageContent,
  CarouselSlide,
  MediaFile,
  // 新增库存管理相关类型
  InventoryFilters,
  InventoryStats,
  InventoryAdjustmentForm,
  BatchInventoryAdjustment,
  InventoryAlertRule,
  InventoryReportConfig,
  Supplier,
  Warehouse,
  StockMovement,
  StockCount,
  StockCountDetail,
  // 新增发货管理相关类型
  Shipping,
  TrackingEvent,
  ShippingFilters,
  ShippingStats,
  CarrierConfig,
  ShippingRule,
  ShippingTemplate,
  ShippingConfig,
  LogisticsTracking,
  ShippingAnalyticsConfig,
  BatchShippingOperation,
  ShippingException,
  ShippingLabel,
  ShippingCostAnalysis,
  DeliveryTimeAnalysis
} from '@/types';
import { OrderService } from '@/services/orderService';

export interface ShippingInfo {
  id: string;
  order_id: string;
  tracking_number: string;
  carrier: string;
  status: string;
  estimated_delivery: string;
  actual_delivery?: string;
  created_at: string;
  updated_at: string;
}

interface AppStore {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: AuthError | null;

  // 管理员状态 - 增强版本
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminAuthLoading: boolean;
  adminAuthError: AuthError | null;
  
  // 管理员账户管理状态
  allAdmins: AdminUser[];
  allAdminsLoading: boolean;
  selectedAdmin: AdminUser | null;
  adminStats: AdminStats | null;
  adminStatsLoading: boolean;
  adminFilters: AdminFilters;
  
  // 角色和权限管理状态
  adminRoles: AdminRoleDetail[];
  adminRolesLoading: boolean;
  allPermissions: Permission[];
  allPermissionsLoading: boolean;
  rolePermissions: RolePermission[];
  
  // 安全设置状态
  securitySettings: SecuritySettings | null;
  securitySettingsLoading: boolean;
  
  // 审计日志状态
  auditLogs: OperationLog[];
  auditLogsLoading: boolean;
  auditLogFilters: AuditLogFilters;

  // 购物车状态
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;

  // 收藏夹状态
  favorites: string[];

  // 地址和支付方式
  userAddresses: UserAddress[];
  selectedAddress: UserAddress | null;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  currentOrder: Order | null;
  orderSummary: OrderSummary | null;
  appliedCoupon: Coupon | null;

  // 订单状态
  orders: Order[];
  ordersLoading: boolean;
  orderDetail: Order | null;
  orderDetailLoading: boolean;
  shippingInfo: ShippingInfo[];

  // 通用状态
  isLoading: boolean;
  error: string | null;
  checkoutLoading: boolean;
  paymentLoading: boolean;

  // 支付凭证和交易日志
  paymentVouchers: PaymentVoucher[];
  transactionLogs: TransactionLog[];

  // 通知状态
  notifications: Notification[];
  unreadNotificationCount: number;

  // 库存更新
  inventoryUpdates: InventoryUpdate[];

  // 管理员数据状态
  dashboardStats: DashboardStats | null;
  operationLogs: OperationLog[];
  systemSettings: SystemSettings | null;
  stockAlerts: StockAlert[];
  salesReports: SalesReport[];
  productPerformance: ProductPerformance[];
  quickActions: QuickAction[];
  adminNotifications: AdminNotification[];
  systemHealth: SystemHealth | null;
  contentPages: ContentPage[];



  // 商品管理状态
  allProducts: ProductDetail[];
  allProductsLoading: boolean;
  selectedProduct: ProductDetail | null;
  selectedProductLoading: boolean;
  categories: CategoryManagement[];
  categoriesLoading: boolean;
  
  // 分类管理扩展状态
  categoryTree: CategoryTreeNode[];
  categoryTreeLoading: boolean;
  categoryStats: CategoryManagementStats | null;
  categoryStatsLoading: boolean;
  categoryEditForm: CategoryEditForm | null;
  categoryEditLoading: boolean;
  categoryEditErrors: CategoryValidationErrors;
  categoryOperationLogs: CategoryOperationLog[];
  categoryOperationLogsLoading: boolean;
  selectedCategories: string[]; // 用于批量操作
  categoryFilters: CategoryManagementFilters;
  
  inventoryManagement: InventoryManagement[];
  inventoryLoading: boolean;
  stockAdjustments: StockAdjustment[];
  productStatusLogs: ProductStatusLog[];
  productSalesStats: ProductSalesStats | null;
  productSalesStatsLoading: boolean;
  productOperationLogs: ProductOperationLog[];
  productOperationLogsLoading: boolean;
  relatedProducts: ProductDetail[];
  relatedProductsLoading: boolean;

  // 商品编辑状态
  productEditForm: ProductEditForm | null;
  productEditLoading: boolean;
  productEditErrors: ProductEditErrors;
  productImages: ProductImage[];
  productImagesLoading: boolean;
  productSpecifications: ProductSpecification[];
  isDraftSaving: boolean;
  isPublishing: boolean;

  // 订单管理状态
  allOrders: OrderDetail[];
  allOrdersLoading: boolean;
  selectedOrder: OrderDetail | null;
  orderTimeline: OrderTimeline[];
  orderNotes: OrderNote[];
  afterSalesServices: AfterSalesService[];
  afterSalesLoading: boolean;

  // 支付管理状态
  paymentDetails: PaymentDetail[];
  paymentDetailsLoading: boolean;
  selectedPayment: PaymentDetail | null;
  paymentMethodConfigs: PaymentMethodConfig[];
  reconciliationRecords: ReconciliationRecord[];
  reconciliationLoading: boolean;
  refundRequests: RefundRequest[];
  refundRequestsLoading: boolean;

  // 发货管理状态
  shippingOrders: ShippingOrder[];
  shippingOrdersLoading: boolean;
  selectedShippingOrder: ShippingOrder | null;
  logisticsProviders: LogisticsProvider[];
  deliveryStatusUpdates: DeliveryStatusUpdate[];
  shippingRecords: ShippingRecord[];
  shippingRecordsLoading: boolean;

  // 扩展发货管理状态
  shippings: Shipping[];
  shippingsLoading: boolean;
  selectedShipping: Shipping | null;
  shippingFilters: ShippingFilters;
  shippingStats: ShippingStats | null;
  shippingStatsLoading: boolean;
  
  // 物流跟踪相关
  logisticsTracking: LogisticsTracking[];
  trackingEvents: TrackingEvent[];
  trackingLoading: boolean;
  
  // 发货配置相关
  shippingConfig: ShippingConfig | null;
  carrierConfigs: CarrierConfig[];
  shippingRules: ShippingRule[];
  shippingTemplates: ShippingTemplate[];
  configLoading: boolean;
  
  // 发货分析相关
  shippingAnalytics: ShippingAnalyticsConfig | null;
  shippingCostAnalysis: ShippingCostAnalysis | null;
  deliveryTimeAnalysis: DeliveryTimeAnalysis | null;
  analyticsLoading: boolean;
  
  // 发货操作相关
  batchShippingOperation: BatchShippingOperation | null;
  shippingExceptions: ShippingException[];
  shippingLabels: ShippingLabel[];
  operationLoading: boolean;

  // 内容管理状态
  articles: Article[];
  articlesLoading: boolean;
  selectedArticle: Article | null;
  articleCategories: ArticleCategory[];
  advertisements: Advertisement[];
  advertisementsLoading: boolean;
  pageContents: PageContent[];
  pageContentsLoading: boolean;
  carouselSlides: CarouselSlide[];
  mediaFiles: MediaFile[];
  mediaFilesLoading: boolean;

  // 扩展内容管理状态
  contentCategories: ContentCategory[];
  contentCategoriesLoading: boolean;
  selectedContentCategory: ContentCategory | null;
  contentTags: ContentTag[];
  contentTagsLoading: boolean;
  selectedContentTag: ContentTag | null;
  contentHistory: ContentHistory[];
  contentHistoryLoading: boolean;
  contentComments: ContentComment[];
  contentCommentsLoading: boolean;
  contentAnalytics: ContentAnalytics | null;
  contentAnalyticsLoading: boolean;
  contentStats: ContentStats | null;
  contentStatsLoading: boolean;
  seoSettings: SEOSettings | null;
  seoSettingsLoading: boolean;
  sitemapItems: SitemapItem[];
  sitemapLoading: boolean;
  seoAnalysisReport: SEOAnalysisReport | null;
  seoAnalysisLoading: boolean;
  keywordAnalysis: KeywordAnalysis[];
  keywordAnalysisLoading: boolean;
  contentTemplates: ContentTemplate[];
  contentTemplatesLoading: boolean;
  contentWorkflows: ContentWorkflow[];
  contentWorkflowsLoading: boolean;
  contentWorkflowInstances: ContentWorkflowInstance[];
  contentWorkflowInstancesLoading: boolean;
  contentFilters: ContentManagementFilters;
  richEditorConfig: RichEditorConfig | null;
  contentPublishSettings: ContentPublishSettings | null;

  // 库存管理状态
  inventoryItems: InventoryManagement[];
  inventoryItemsLoading: boolean;
  selectedInventoryItem: InventoryManagement | null;
  inventoryFilters: InventoryFilters;
  inventoryStats: InventoryStats | null;
  inventoryStatsLoading: boolean;
  
  // 库存调整相关
  stockAdjustments: StockAdjustment[];
  stockAdjustmentsLoading: boolean;
  inventoryAdjustmentForm: InventoryAdjustmentForm | null;
  adjustmentFormLoading: boolean;
  batchAdjustmentData: BatchInventoryAdjustment | null;
  
  // 库存预警相关
  inventoryAlerts: StockAlert[];
  inventoryAlertsLoading: boolean;
  alertRules: InventoryAlertRule[];
  alertRulesLoading: boolean;
  lowStockItems: InventoryManagement[];
  outOfStockItems: InventoryManagement[];
  
  // 供应商和仓库管理
  suppliers: Supplier[];
  suppliersLoading: boolean;
  warehouses: Warehouse[];
  warehousesLoading: boolean;
  
  // 库存变动记录
  stockMovements: StockMovement[];
  stockMovementsLoading: boolean;
  
  // 库存盘点
  stockCounts: StockCount[];
  stockCountsLoading: boolean;
  selectedStockCount: StockCount | null;
  stockCountDetails: StockCountDetail[];
  
  // 库存报表
  inventoryReports: any[];
  inventoryReportsLoading: boolean;
  reportConfig: InventoryReportConfig | null;

  // 管理员加载状态
  dashboardLoading: boolean;
  operationLogsLoading: boolean;
  systemSettingsLoading: boolean;
  stockAlertsLoading: boolean;
  salesReportsLoading: boolean;

  productPerformanceLoading: boolean;
  contentPagesLoading: boolean;

  // 用户操作
  setUser: (user: User | null) => void;
  logout: () => void;

  // 管理员操作
  setAdmin: (admin: AdminUser | null) => void;
  adminLogin: (credentials: AdminLoginForm) => Promise<boolean>;
  adminLogout: () => void;
  clearAdminAuthError: () => void;

  // 余额操作
  getUserBalance: () => number;
  addBalance: (amount: number) => boolean;
  deductBalance: (amount: number) => boolean;

  // 购物车操作
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // 收藏夹操作
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // 通用操作
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 认证操作
  login: (credentials: LoginForm) => Promise<boolean>;
  register: (userData: RegisterForm) => Promise<boolean>;
  updateProfile: (profileData: ProfileUpdateForm) => Promise<boolean>;
  changePassword: (passwordData: PasswordChangeForm) => Promise<boolean>;
  clearAuthError: () => void;

  // 地址管理
  setUserAddresses: (addresses: UserAddress[]) => void;
  addUserAddress: (address: Omit<UserAddress, 'id' | 'created_at' | 'updated_at'>) => void;
  updateUserAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteUserAddress: (id: string) => void;
  setSelectedAddress: (address: UserAddress | null) => void;
  setDefaultAddress: (id: string) => void;

  // 支付方式管理
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;

  // 订单和支付操作
  calculateOrderSummary: () => OrderSummary;
  applyCoupon: (coupon: Coupon) => boolean;
  removeCoupon: () => void;
  createOrder: (checkoutForm: CheckoutForm) => Promise<Order | null>;
  processPayment: (paymentRequest: PaymentRequest) => Promise<PaymentResponse | null>;
  processBalancePayment: (balanceRequest: BalancePaymentRequest) => Promise<BalancePaymentResponse | null>;

  // 订单管理
  setCurrentOrder: (order: Order | null) => void;
  clearCheckoutData: () => void;

  // 订单历史
  fetchOrders: (filters?: { status?: string; page?: number; limit?: number }) => Promise<void>;
  fetchOrderDetail: (orderId: string) => Promise<void>;
  getShippingInfo: (orderId: string) => ShippingInfo | null;
  cancelOrder: (orderId: string) => Promise<boolean>;
  reorderItems: (orderId: string) => void;
  clearOrderDetail: () => void;
  addOrderToHistory: (order: Order) => void;

  // 支付凭证和交易日志
  generatePaymentVoucher: (orderId: string, paymentId: string, transactionId: string, amount: number, paymentMethod: string) => PaymentVoucher;
  addTransactionLog: (log: Omit<TransactionLog, 'id' | 'timestamp'>) => void;
  updateInventory: (orderId: string, items: { product_id: string; quantity: number }[]) => Promise<boolean>;

  // 通知操作
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  sendPaymentSuccessNotification: (orderId: string, amount: number, paymentMethod: string) => void;

  // 管理员数据获取
  fetchDashboardStats: () => Promise<void>;
  fetchOperationLogs: (params?: PaginationParams & FilterParams) => Promise<void>;
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<boolean>;
  fetchStockAlerts: () => Promise<void>;
  fetchSalesReports: (period: string) => Promise<void>;

  fetchProductPerformance: (params?: FilterParams) => Promise<void>;
  fetchQuickActions: () => Promise<void>;
  fetchAdminNotifications: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  fetchContentPages: (params?: PaginationParams & FilterParams) => Promise<void>;
  createContentPage: (page: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateContentPage: (id: string, page: Partial<ContentPage>) => Promise<boolean>;
  deleteContentPage: (id: string) => Promise<boolean>;


  
  // 管理员账户管理方法
  fetchAllAdmins: (params?: AdminFilters & PaginationParams) => Promise<void>;
  fetchAdminDetail: (adminId: string) => Promise<AdminUser | null>;
  createAdmin: (adminData: AdminCreateForm) => Promise<AdminUser | null>;
  updateAdmin: (adminId: string, adminData: AdminEditForm) => Promise<boolean>;
  deleteAdmin: (adminId: string) => Promise<boolean>;
  resetAdminPassword: (adminId: string, passwordData: AdminPasswordResetForm) => Promise<boolean>;
  toggleAdminStatus: (adminId: string, isActive: boolean) => Promise<boolean>;
  lockAdminAccount: (adminId: string, reason: string) => Promise<boolean>;
  unlockAdminAccount: (adminId: string) => Promise<boolean>;
  
  // 角色和权限管理方法
  fetchAdminRoles: () => Promise<void>;
  fetchAllPermissions: () => Promise<void>;
  updateAdminRole: (adminId: string, role: AdminRole) => Promise<boolean>;
  updateAdminPermissions: (adminId: string, permissionIds: string[]) => Promise<boolean>;
  createCustomRole: (roleData: RoleForm) => Promise<AdminRoleDetail | null>;
  updateCustomRole: (roleId: string, roleData: Partial<RoleForm>) => Promise<boolean>;
  deleteCustomRole: (roleId: string) => Promise<boolean>;
  
  // 安全设置方法
  fetchSecuritySettings: () => Promise<void>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<boolean>;
  
  // 审计日志方法
  fetchAuditLogs: (params?: AuditLogFilters & PaginationParams) => Promise<void>;
  exportAuditLogs: (filters?: AuditLogFilters, format?: 'excel' | 'csv') => Promise<boolean>;
  
  // 管理员统计方法
  fetchAdminStats: () => Promise<void>;

  // 商品管理方法
  fetchAllProducts: (params?: ProductFilters & PaginationParams) => Promise<void>;
  fetchProductDetail: (productId: string) => Promise<ProductDetail | null>;
  fetchProductSalesStats: (productId: string) => Promise<void>;
  fetchProductOperationLogs: (productId: string) => Promise<void>;
  fetchRelatedProducts: (productId: string) => Promise<void>;
  createProduct: (product: Omit<ProductDetail, 'id' | 'created_at' | 'updated_at'>) => Promise<ProductDetail | null>;
  updateProduct: (id: string, product: Partial<ProductDetail>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateProductStatus: (id: string, status: 'active' | 'inactive' | 'draft') => Promise<boolean>;
  adjustProductStock: (productId: string, quantity: number, reason: string) => Promise<boolean>;
  
  // 商品编辑相关方法
  updateProductEditForm: (field: keyof ProductEditForm, value: any) => void;
  initProductEdit: (productId?: string) => Promise<ProductEditForm | null>;
  saveProductDraft: (formData?: ProductEditForm) => Promise<boolean>;
  publishProduct: (formData?: ProductEditForm) => Promise<boolean>;
  validateProductForm: (formData?: Partial<ProductEditForm>) => ProductEditErrors;
  uploadProductImage: (file: File) => Promise<ProductImage | null>;
  deleteProductImage: (imageId: string) => Promise<boolean>;
  reorderProductImages: (images: ProductImage[]) => Promise<boolean>;
  addProductSpecification: (spec: Omit<ProductSpecification, 'id'>) => void;
  updateProductSpecification: (id: string, spec: Partial<ProductSpecification>) => void;
  deleteProductSpecification: (id: string) => void;
  generateProductSKU: (name: string, categoryId: string) => string;
  checkSKUAvailability: (sku: string, excludeId?: string) => Promise<boolean>;
  
  // 分类管理方法
  fetchCategories: () => Promise<void>;
  fetchCategoryTree: () => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  initCategoryEdit: (categoryId?: string) => Promise<CategoryEditForm | null>;
  updateCategoryEditForm: (field: keyof CategoryEditForm, value: any) => void;
  saveCategoryDraft: (formData?: CategoryEditForm) => Promise<boolean>;
  publishCategory: (formData?: CategoryEditForm) => Promise<boolean>;
  validateCategoryForm: (formData?: Partial<CategoryEditForm>) => CategoryValidationErrors;
  createCategory: (category: Omit<CategoryManagement, 'id' | 'created_at' | 'updated_at'>) => Promise<CategoryManagement | null>;
  updateCategory: (id: string, category: Partial<CategoryManagement>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  batchUpdateCategories: (operation: CategoryBatchOperation) => Promise<boolean>;
  uploadCategoryImage: (file: File) => Promise<string | null>;
  fetchCategoryOperationLogs: (categoryId?: string) => Promise<void>;
  setCategoryFilters: (filters: CategoryManagementFilters) => void;
  resetCategoryFilters: () => void;
  toggleCategorySelection: (categoryId: string) => void;
  selectAllCategories: () => void;
  clearCategorySelection: () => void;
  buildCategoryTree: (categories: CategoryManagement[]) => CategoryTreeNode[];
  expandCategoryNode: (nodeId: string) => void;
  collapseCategoryNode: (nodeId: string) => void;
  fetchInventoryManagement: () => Promise<void>;
  adjustStock: (productId: string, adjustment: StockAdjustment) => Promise<boolean>;

  // 订单管理方法
  fetchAllOrders: (params?: OrderFilters & PaginationParams) => Promise<void>;
  fetchOrderDetail: (orderId: string) => Promise<OrderDetail | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  updatePaymentStatus: (orderId: string, status: string) => Promise<boolean>;
  addOrderNote: (orderId: string, note: string) => Promise<boolean>;
  fetchOrderTimeline: (orderId: string) => Promise<void>;
  processAfterSales: (orderId: string, service: Omit<AfterSalesService, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;

  // 支付管理方法
  fetchPaymentDetails: (params?: PaginationParams) => Promise<void>;
  fetchPaymentDetail: (paymentId: string) => Promise<PaymentDetail | null>;
  processRefund: (paymentId: string, amount: number, reason: string) => Promise<boolean>;
  fetchReconciliationRecords: (params?: { start_date?: string; end_date?: string }) => Promise<void>;
  generateReconciliation: (params: { start_date: string; end_date: string; payment_method?: string }) => Promise<boolean>;

  // 发货管理方法
  fetchShippingOrders: (params?: PaginationParams) => Promise<void>;
  fetchShippingOrderDetail: (shippingId: string) => Promise<ShippingOrder | null>;
  updateShippingStatus: (shippingId: string, status: string, trackingNumber?: string) => Promise<boolean>;
  fetchLogisticsProviders: () => Promise<void>;
  createShippingOrder: (orderId: string, shippingData: Omit<ShippingOrder, 'id' | 'created_at'>) => Promise<ShippingOrder | null>;
  printShippingLabel: (shippingId: string) => Promise<boolean>;

  // 扩展发货管理方法
  fetchShippings: (filters?: ShippingFilters) => Promise<void>;
  fetchShippingDetail: (shippingId: string) => Promise<Shipping | null>;
  createShipping: (shipping: Omit<Shipping, 'id' | 'created_at' | 'updated_at'>) => Promise<Shipping | null>;
  updateShipping: (id: string, shipping: Partial<Shipping>) => Promise<boolean>;
  deleteShipping: (id: string) => Promise<boolean>;
  batchUpdateShippings: (operation: BatchShippingOperation) => Promise<boolean>;
  
  // 物流跟踪方法
  fetchLogisticsTracking: (trackingNumber: string, carrier?: string) => Promise<LogisticsTracking | null>;
  updateTrackingEvents: (shippingId: string, events: TrackingEvent[]) => Promise<boolean>;
  fetchTrackingHistory: (shippingId: string) => Promise<TrackingEvent[]>;
  
  // 发货配置方法
  fetchShippingConfig: () => Promise<void>;
  updateShippingConfig: (config: Partial<ShippingConfig>) => Promise<boolean>;
  fetchCarrierConfigs: () => Promise<void>;
  updateCarrierConfig: (carrierId: string, config: Partial<CarrierConfig>) => Promise<boolean>;
  fetchShippingRules: () => Promise<void>;
  createShippingRule: (rule: Omit<ShippingRule, 'id' | 'created_at' | 'updated_at'>) => Promise<ShippingRule | null>;
  updateShippingRule: (id: string, rule: Partial<ShippingRule>) => Promise<boolean>;
  deleteShippingRule: (id: string) => Promise<boolean>;
  fetchShippingTemplates: () => Promise<void>;
  createShippingTemplate: (template: Omit<ShippingTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<ShippingTemplate | null>;
  updateShippingTemplate: (id: string, template: Partial<ShippingTemplate>) => Promise<boolean>;
  deleteShippingTemplate: (id: string) => Promise<boolean>;
  
  // 发货分析方法
  fetchShippingStats: (params?: { start_date?: string; end_date?: string }) => Promise<void>;
  fetchShippingAnalytics: (config: ShippingAnalyticsConfig) => Promise<void>;
  fetchShippingCostAnalysis: (params?: { start_date?: string; end_date?: string }) => Promise<void>;
  fetchDeliveryTimeAnalysis: (params?: { start_date?: string; end_date?: string }) => Promise<void>;
  
  // 发货操作方法
  generateShippingLabel: (shippingId: string) => Promise<ShippingLabel | null>;
  printShippingLabels: (shippingIds: string[]) => Promise<boolean>;
  handleShippingException: (shippingId: string, exception: Omit<ShippingException, 'id' | 'created_at'>) => Promise<boolean>;
  resolveShippingException: (exceptionId: string, resolution: string) => Promise<boolean>;
  exportShippingData: (filters?: ShippingFilters, format?: 'excel' | 'pdf') => Promise<boolean>;
  
  // 发货筛选和状态管理
  setShippingFilters: (filters: ShippingFilters) => void;
  resetShippingFilters: () => void;
  setSelectedShipping: (shipping: Shipping | null) => void;

  // 内容管理方法
  fetchArticles: (params?: PaginationParams) => Promise<void>;
  fetchArticleDetail: (articleId: string) => Promise<Article | null>;
  createArticle: (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => Promise<Article | null>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
  fetchArticleCategories: () => Promise<void>;
  fetchAdvertisements: () => Promise<void>;
  createAdvertisement: (ad: Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>) => Promise<Advertisement | null>;
  updateAdvertisement: (id: string, ad: Partial<Advertisement>) => Promise<boolean>;
  deleteAdvertisement: (id: string) => Promise<boolean>;
  fetchPageContents: () => Promise<void>;
  updatePageContent: (id: string, content: Partial<PageContent>) => Promise<boolean>;
  fetchCarouselSlides: () => Promise<void>;
  createCarouselSlide: (slide: Omit<CarouselSlide, 'id' | 'created_at' | 'updated_at'>) => Promise<CarouselSlide | null>;
  updateCarouselSlide: (id: string, slide: Partial<CarouselSlide>) => Promise<boolean>;
  deleteCarouselSlide: (id: string) => Promise<boolean>;
  uploadMediaFile: (file: File) => Promise<MediaFile | null>;
  deleteMediaFile: (id: string) => Promise<boolean>;

  // 扩展内容管理方法
  fetchContentCategories: (params?: PaginationParams) => Promise<void>;
  createContentCategory: (category: Omit<ContentCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentCategory | null>;
  updateContentCategory: (id: string, category: Partial<ContentCategory>) => Promise<boolean>;
  deleteContentCategory: (id: string) => Promise<boolean>;
  reorderContentCategories: (categories: ContentCategory[]) => Promise<boolean>;
  
  fetchContentTags: (params?: PaginationParams) => Promise<void>;
  createContentTag: (tag: Omit<ContentTag, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentTag | null>;
  updateContentTag: (id: string, tag: Partial<ContentTag>) => Promise<boolean>;
  deleteContentTag: (id: string) => Promise<boolean>;
  mergeContentTags: (sourceTagIds: string[], targetTagId: string) => Promise<boolean>;
  
  fetchContentHistory: (contentId: string) => Promise<void>;
  restoreContentVersion: (contentId: string, versionId: string) => Promise<boolean>;
  
  fetchContentComments: (contentId: string, params?: PaginationParams) => Promise<void>;
  createContentComment: (comment: Omit<ContentComment, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentComment | null>;
  updateContentComment: (id: string, comment: Partial<ContentComment>) => Promise<boolean>;
  deleteContentComment: (id: string) => Promise<boolean>;
  moderateContentComment: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  
  fetchContentAnalytics: (params?: { start_date?: string; end_date?: string }) => Promise<void>;
  fetchContentStats: () => Promise<void>;
  
  fetchSEOSettings: () => Promise<void>;
  updateSEOSettings: (settings: Partial<SEOSettings>) => Promise<boolean>;
  
  fetchSitemap: () => Promise<void>;
  generateSitemap: () => Promise<boolean>;
  
  fetchSEOAnalysis: (url?: string) => Promise<void>;
  fetchKeywordAnalysis: (keywords?: string[]) => Promise<void>;
  
  fetchContentTemplates: () => Promise<void>;
  createContentTemplate: (template: Omit<ContentTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentTemplate | null>;
  updateContentTemplate: (id: string, template: Partial<ContentTemplate>) => Promise<boolean>;
  deleteContentTemplate: (id: string) => Promise<boolean>;
  
  fetchContentWorkflows: () => Promise<void>;
  createContentWorkflow: (workflow: Omit<ContentWorkflow, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentWorkflow | null>;
  updateContentWorkflow: (id: string, workflow: Partial<ContentWorkflow>) => Promise<boolean>;
  deleteContentWorkflow: (id: string) => Promise<boolean>;
  
  fetchContentWorkflowInstances: (contentId?: string) => Promise<void>;
  createContentWorkflowInstance: (instance: Omit<ContentWorkflowInstance, 'id' | 'created_at' | 'updated_at'>) => Promise<ContentWorkflowInstance | null>;
  updateContentWorkflowInstance: (id: string, instance: Partial<ContentWorkflowInstance>) => Promise<boolean>;
  
  setContentFilters: (filters: ContentManagementFilters) => void;
  resetContentFilters: () => void;
  
  initRichEditor: (config?: Partial<RichEditorConfig>) => void;
  updateContentPublishSettings: (settings: Partial<ContentPublishSettings>) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,

      admin: null,
  isAdminAuthenticated: false,
  adminAuthLoading: false,
  adminAuthError: null,
  
  // 管理员账户管理状态初始化
  allAdmins: [],
  allAdminsLoading: false,
  selectedAdmin: null,
  adminStats: null,
  adminStatsLoading: false,
  adminFilters: {
    search: '',
    role: undefined,
    department: undefined,
    is_active: undefined,
    is_super_admin: undefined,
    last_login_from: undefined,
    last_login_to: undefined,
    created_from: undefined,
    created_to: undefined
  },
  
  // 角色和权限管理状态初始化
  adminRoles: [],
  adminRolesLoading: false,
  allPermissions: [],
  allPermissionsLoading: false,
  rolePermissions: [],
  
  // 安全设置状态初始化
  securitySettings: null,
  securitySettingsLoading: false,
  
  // 审计日志状态初始化
  auditLogs: [],
  auditLogsLoading: false,
  auditLogFilters: {
    search: '',
    admin_id: undefined,
    action: undefined,
    resource_type: undefined,
    status: undefined,
    ip_address: undefined,
    date_from: undefined,
    date_to: undefined
  },

      cart: [],
      cartTotal: 0,
      cartItemCount: 0,
      favorites: [],
      userAddresses: [],
      selectedAddress: null,
      paymentMethods: [],
      selectedPaymentMethod: null,
      currentOrder: null,
      orderSummary: null,
      appliedCoupon: null,

      orders: [],
      ordersLoading: false,
      orderDetail: null,
      orderDetailLoading: false,
      shippingInfo: [],

      isLoading: false,
      error: null,
      checkoutLoading: false,
      paymentLoading: false,

      paymentVouchers: [],
      transactionLogs: [],

      notifications: [],
      unreadNotificationCount: 0,

      inventoryUpdates: [],

      dashboardStats: null,
      operationLogs: [],
      systemSettings: null,
      stockAlerts: [],
      salesReports: [],

      productPerformance: [],
      quickActions: [],
      adminNotifications: [],
      systemHealth: null,
      contentPages: [],

      // 用户管理初始状态
      allUsers: [],
  allUsersLoading: false,
  selectedUser: null,
  userPermissions: [],
  loginLogs: [],
  loginLogsLoading: false,
  userActionLogs: [],
  userActionLogsLoading: false,
  
  // 用户管理增强功能初始化
  userStats: null,
  userStatsLoading: false,
  userFiltersEnhanced: {
    search: '',
    status: undefined,
    role: undefined,
    is_active: undefined,
    registration_date_from: undefined,
    registration_date_to: undefined,
    createdAfter: undefined,
    lastLoginAfter: undefined,
    risk_level: undefined,
    tags: [],
    has_orders: undefined,
    total_spent_min: undefined,
    total_spent_max: undefined,
    order_count_min: undefined,
    order_count_max: undefined,
    last_order_from: undefined,
    last_order_to: undefined,
    email_verified: undefined,
    phone_verified: undefined,
    has_complaints: undefined,
    has_refunds: undefined,
    acquisition_source: undefined
  },
  userTags: [],
  userTagsLoading: false,
  userStatusChanges: [],
  batchUserOperations: [],
  batchOperationLoading: false,

      // 商品管理初始状态
      allProducts: [],
      allProductsLoading: false,
      selectedProduct: null,
      selectedProductLoading: false,
      categories: [],
      categoriesLoading: false,
      inventoryManagement: [],
      inventoryLoading: false,
      stockAdjustments: [],
      productStatusLogs: [],
      productSalesStats: null,
      productSalesStatsLoading: false,
      productOperationLogs: [],
      productOperationLogsLoading: false,
      relatedProducts: [],
      relatedProductsLoading: false,

      // 商品编辑状态
      productEditForm: null,
      productEditLoading: false,
      productEditErrors: {},
      productImages: [],
      productImagesLoading: false,
      productSpecifications: [],
      isDraftSaving: false,
      isPublishing: false,

      // 订单管理初始状态
      allOrders: [],
      allOrdersLoading: false,
      selectedOrder: null,
      orderTimeline: [],
      orderNotes: [],
      afterSalesServices: [],
      afterSalesLoading: false,

      // 支付管理初始状态
      paymentDetails: [],
      paymentDetailsLoading: false,
      selectedPayment: null,
      paymentMethodConfigs: [],
      reconciliationRecords: [],
      reconciliationLoading: false,

      // 发货管理初始状态
      shippingOrders: [],
      shippingOrdersLoading: false,
      selectedShippingOrder: null,
      logisticsProviders: [],
      deliveryStatusUpdates: [],
      shippingRecords: [],
      shippingRecordsLoading: false,

      // 扩展发货管理初始状态
      shippings: [],
      shippingsLoading: false,
      selectedShipping: null,
      shippingFilters: {
        search: '',
        status: '',
        carrier: '',
        region: '',
        start_date: '',
        end_date: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        page: 1,
        limit: 20
      },
      shippingStats: null,
      shippingStatsLoading: false,
      
      // 物流跟踪初始状态
      logisticsTracking: [],
      trackingEvents: [],
      trackingLoading: false,
      
      // 发货配置初始状态
      shippingConfig: null,
      carrierConfigs: [],
      shippingRules: [],
      shippingTemplates: [],
      configLoading: false,
      
      // 发货分析初始状态
      shippingAnalytics: null,
      shippingCostAnalysis: null,
      deliveryTimeAnalysis: null,
      analyticsLoading: false,
      
      // 发货操作初始状态
      batchShippingOperation: null,
      shippingExceptions: [],
      shippingLabels: [],
      operationLoading: false,

      // 内容管理初始状态
      articles: [],
      articlesLoading: false,
      selectedArticle: null,
      articleCategories: [],
      advertisements: [],
      advertisementsLoading: false,
      pageContents: [],
      pageContentsLoading: false,
      carouselSlides: [],
      mediaFiles: [],
      mediaFilesLoading: false,

      // 扩展内容管理初始状态
      contentCategories: [],
      contentCategoriesLoading: false,
      selectedContentCategory: null,
      contentTags: [],
      contentTagsLoading: false,
      selectedContentTag: null,
      contentHistory: [],
      contentHistoryLoading: false,
      contentComments: [],
      contentCommentsLoading: false,
      contentAnalytics: null,
      contentAnalyticsLoading: false,
      contentStats: null,
      contentStatsLoading: false,
      seoSettings: null,
      seoSettingsLoading: false,
      sitemapItems: [],
      sitemapLoading: false,
      seoAnalysisReport: null,
      seoAnalysisLoading: false,
      keywordAnalysis: [],
      keywordAnalysisLoading: false,
      contentTemplates: [],
      contentTemplatesLoading: false,
      contentWorkflows: [],
      contentWorkflowsLoading: false,
      contentWorkflowInstances: [],
      contentWorkflowInstancesLoading: false,
      contentFilters: {
        search: '',
        type: '',
        status: '',
        category_id: '',
        tag_id: '',
        author_id: '',
        start_date: '',
        end_date: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        page: 1,
        limit: 20
      },
      richEditorConfig: null,
      contentPublishSettings: null,

      dashboardLoading: false,
      operationLogsLoading: false,
      systemSettingsLoading: false,
      stockAlertsLoading: false,
      salesReportsLoading: false,
      
      productPerformanceLoading: false,
      contentPagesLoading: false,

      // 用户操作实现
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          authError: null,
          cart: [],
          cartTotal: 0,
          cartItemCount: 0,
          favorites: [],
          userAddresses: [],
          selectedAddress: null,
          paymentMethods: [],
          selectedPaymentMethod: null,
          currentOrder: null,
          orderSummary: null,
          appliedCoupon: null,
        });
      },

      // 认证操作实现
      login: async (credentials: LoginForm) => {
        set({ authLoading: true, authError: null });
        
        try {
          // 导入同步服务
          const { syncUserLogin } = await import('../lib/syncService');
          
          // 首先检查硬编码的测试账号
          if (credentials.email === 'user@example.com' && credentials.password === 'password') {
            const user: User = {
              id: '1',
              email: credentials.email,
              username: 'testuser',
              full_name: '测试用户',
              phone: '13800138000',
              avatar: '',
              balance: 1000,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            set({
              user,
              isAuthenticated: true,
              authLoading: false
            });
            
            return true;
          } else if (credentials.email === 'admin@jade.com' && credentials.password === '123456') {
            const user: User = {
              id: 'admin_1',
              email: 'admin@jade.com',
              username: 'admin',
              full_name: '管理员',
              phone: '13800138000',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              balance: 100000,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            };
            
            set({
              user,
              isAuthenticated: true,
              authLoading: false
            });
            
            return true;
          } else if (credentials.email === 'test@qq.com' && credentials.password === '123456') {
            // 新的测试账号
            const user: User = {
              id: 'test_user_1',
              email: 'test@qq.com',
              username: 'testuser',
              full_name: '测试用户',
              phone: '13800138000',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
              balance: 5000,
              created_at: '2024-12-14T00:00:00Z',
              updated_at: '2024-12-14T00:00:00Z',
            };
            
            set({
              user,
              isAuthenticated: true,
              authLoading: false
            });
            
            return true;
          }
          
          // 尝试从 Supabase 数据库验证用户
          const { supabase } = await import('../lib/supabase');
          const { data: dbUser, error } = await supabase
            .from('frontend_users')
            .select('*')
            .eq('email', credentials.email)
            .single();
          
          if (dbUser && !error) {
            // 验证密码哈希
            if (dbUser.password_hash) {
              const bcrypt = await import('bcryptjs');
              const isPasswordValid = await bcrypt.compare(credentials.password, dbUser.password_hash);
              
              if (!isPasswordValid) {
                set({
                  authError: { message: '邮箱或密码错误' },
                  authLoading: false
                });
                return false;
              }
            } else {
              // 如果没有密码哈希，拒绝登录
              set({
                authError: { message: '账户未设置密码，请联系管理员' },
                authLoading: false
              });
              return false;
            }
            
            const user: User = {
              id: dbUser.id,
              email: dbUser.email,
              username: dbUser.username || '',
              full_name: dbUser.full_name || '',
              phone: dbUser.phone || '',
              avatar: dbUser.avatar_url || '',
              balance: 0, // 可以从其他表获取余额信息
              created_at: dbUser.created_at,
              updated_at: dbUser.updated_at,
            };
            
            // 同步登录状态
            await syncUserLogin(user.id);
            
            // 启动实时同步服务
            try {
              const { realtimeSyncService } = await import('../services/realtimeSyncService');
              if (!realtimeSyncService.getSyncStatus().isInitialized) {
                await realtimeSyncService.initialize();
              }
              await realtimeSyncService.syncUserLoginManually(user.id);
            } catch (syncError) {
              console.warn('启动实时同步服务失败:', syncError);
            }
            
            set({
              user,
              isAuthenticated: true,
              authLoading: false
            });
            
            return true;
          }
          
          // 检查 localStorage 中的用户数据（向后兼容）
          const existingUsers = localStorage.getItem('jade-shopping-users');
          if (existingUsers) {
            try {
              const users = JSON.parse(existingUsers);
              const foundUser = users.find((u: any) => u.email === credentials.email);
              
              if (foundUser && foundUser.password === credentials.password) {
                // 创建用户对象（不包含密码）
                const user: User = {
                  id: foundUser.id,
                  email: foundUser.email,
                  username: foundUser.username,
                  full_name: foundUser.full_name,
                  phone: foundUser.phone || '',
                  avatar: foundUser.avatar || '',
                  balance: foundUser.balance || 0,
                  created_at: foundUser.created_at,
                  updated_at: foundUser.updated_at,
                };
                
                // 尝试同步登录状态
                try {
                  await syncUserLogin(user.id);
                } catch (syncError) {
                  console.warn('同步登录状态失败:', syncError);
                }
                
                set({
                  user,
                  isAuthenticated: true,
                  authLoading: false
                });
                
                return true;
              }
            } catch (parseError) {
              console.warn('解析用户数据失败:', parseError);
            }
          }
          
          // 如果没有找到匹配的用户
          set({
            authError: { message: '邮箱或密码错误' },
            authLoading: false
          });
          return false;
        } catch (error) {
          console.error('登录失败:', error);
          set({
            authError: { message: '登录失败，请稍后重试' },
            authLoading: false
          });
          return false;
        }
      },

      register: async (userData: RegisterForm) => {
        set({ authLoading: true, authError: null });
        
        try {
          // 导入同步服务
          const { syncUserRegistration } = await import('../lib/syncService');
          
          // 验证密码一致性
          if (userData.password !== userData.confirmPassword) {
            set({
              authError: { message: '两次输入的密码不一致' },
              authLoading: false
            });
            return false;
          }
          
          // 同步用户注册到 Supabase 数据库
          const syncResult = await syncUserRegistration({
            email: userData.email,
            username: userData.username,
            full_name: userData.full_name,
            phone: userData.phone || '',
            password: userData.password
          });
          
          if (!syncResult.success) {
            set({
              authError: { message: syncResult.error || '注册失败' },
              authLoading: false
            });
            return false;
          }
          
          // 如果同步成功，创建本地用户对象
          const user: User = {
            id: syncResult.user!.id,
            email: syncResult.user!.email,
            username: syncResult.user!.username || userData.username,
            full_name: syncResult.user!.full_name || userData.full_name,
            phone: syncResult.user!.phone || userData.phone || '',
            avatar: syncResult.user!.avatar_url || '',
            balance: 0,
            created_at: syncResult.user!.created_at,
            updated_at: syncResult.user!.updated_at,
          };

          // 启动实时同步服务
          try {
            const { realtimeSyncService } = await import('../services/realtimeSyncService');
            if (!realtimeSyncService.getSyncStatus().isInitialized) {
              await realtimeSyncService.initialize();
            }
          } catch (syncError) {
            console.warn('启动实时同步服务失败:', syncError);
          }

          // 同时保存到本地存储以保持兼容性
          const existingUsers = localStorage.getItem('jade-shopping-users');
          let users = [];
          if (existingUsers) {
            try {
              users = JSON.parse(existingUsers);
            } catch (parseError) {
              console.warn('解析现有用户数据失败:', parseError);
            }
          }
          
          // 创建用户详情对象（用于管理员页面）
          const userDetail = {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            phone: user.phone,
            avatar: user.avatar,
            status: 'active' as const,
            registration_date: user.created_at,
            last_login: user.created_at,
            email_verified: false,
            phone_verified: false,
            total_orders: 0,
            total_spent: 0,
            membership_level: 'bronze' as const,
            tags: ['新用户'],
            permissions: ['user:read', 'order:create'],
            created_at: user.created_at,
            updated_at: user.updated_at
          };
          
          // 保存到本地存储
          users.push(userDetail);
          localStorage.setItem('jade-shopping-users', JSON.stringify(users));
          
          // 更新状态
          set({
            user,
            isAuthenticated: true,
            authLoading: false,
            allUsers: [...users] // 更新用户列表
          });
          
          // 触发自定义事件通知用户列表更新
          window.dispatchEvent(new CustomEvent('userDataUpdated'));
          
          return true;
        } catch (error) {
          console.error('注册失败:', error);
          set({
            authError: { message: '注册失败，请稍后重试' },
            authLoading: false
          });
          return false;
        }
      },

      updateProfile: async (profileData: ProfileUpdateForm) => {
        set({ authLoading: true, authError: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { user } = get();
          if (!user) {
            set({
              authError: { message: '用户未登录' },
              authLoading: false
            });
            return false;
          }
          
          const updatedUser: User = {
            ...user,
            username: profileData.username,
            full_name: profileData.fullName,
            phone: profileData.phone || '',
            updated_at: new Date().toISOString()
          };
          
          set({
            user: updatedUser,
            authLoading: false
          });
          
          return true;
        } catch (error) {
          set({
            authError: { message: '更新失败，请稍后重试' },
            authLoading: false
          });
          return false;
        }
      },

      changePassword: async (passwordData: PasswordChangeForm) => {
        set({ authLoading: true, authError: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (passwordData.currentPassword !== 'password') {
            set({
              authError: { message: '当前密码错误' },
              authLoading: false
            });
            return false;
          }
          
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            set({
              authError: { message: '两次输入的新密码不一致' },
              authLoading: false
            });
            return false;
          }
          
          set({ authLoading: false });
          return true;
        } catch (error) {
          set({
            authError: { message: '密码修改失败，请稍后重试' },
            authLoading: false
          });
          return false;
        }
      },

      clearAuthError: () => {
        set({ authError: null });
      },

      // 余额操作实现
      getUserBalance: () => {
        const { user } = get();
        return user?.balance || 0;
      },

      addBalance: (amount: number) => {
        const { user } = get();
        if (!user) return false;
        
        const updatedUser = {
          ...user,
          balance: user.balance + amount,
          updated_at: new Date().toISOString()
        };
        
        set({ user: updatedUser });
        return true;
      },

      deductBalance: (amount: number) => {
        const { user } = get();
        if (!user || user.balance < amount) return false;
        
        const updatedUser = {
          ...user,
          balance: user.balance - amount,
          updated_at: new Date().toISOString()
        };
        
        set({ user: updatedUser });
        return true;
      },

      // 购物车操作实现
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.product.id === product.id);
        
        let updatedCart: CartItem[];
        
        if (existingItem) {
          updatedCart = cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: `cart_${Date.now()}_${product.id}`,
            product,
            quantity,
            added_at: new Date().toISOString()
          };
          updatedCart = [...cart, newItem];
        }
        
        const cartTotal = updatedCart.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        );
        const cartItemCount = updatedCart.reduce((count, item) => 
          count + item.quantity, 0
        );
        
        set({
          cart: updatedCart,
          cartTotal,
          cartItemCount
        });
      },
      
      removeFromCart: (productId) => {
        const { cart } = get();
        const updatedCart = cart.filter(item => item.product.id !== productId);
        
        const cartTotal = updatedCart.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        );
        const cartItemCount = updatedCart.reduce((count, item) => 
          count + item.quantity, 0
        );
        
        set({
          cart: updatedCart,
          cartTotal,
          cartItemCount
        });
      },
      
      updateCartItemQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const { cart } = get();
        const updatedCart = cart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        
        const cartTotal = updatedCart.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        );
        const cartItemCount = updatedCart.reduce((count, item) => 
          count + item.quantity, 0
        );
        
        set({
          cart: updatedCart,
          cartTotal,
          cartItemCount
        });
      },
      
      clearCart: () => {
        set({
          cart: [],
          cartTotal: 0,
          cartItemCount: 0
        });
      },
      
      // 收藏夹操作实现
      toggleFavorite: (productId) => {
        const { favorites } = get();
        const isFavorited = favorites.includes(productId);
        
        const updatedFavorites = isFavorited
          ? favorites.filter(id => id !== productId)
          : [...favorites, productId];
        
        set({ favorites: updatedFavorites });
      },
      
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.includes(productId);
      },
      
      // 通用操作实现
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setError: (error) => {
        set({ error });
      },

      // 地址管理实现
      setUserAddresses: (addresses) => {
        set({ userAddresses: addresses });
      },

      addUserAddress: (address) => {
        const { userAddresses } = get();
        const newAddress: UserAddress = {
          ...address,
          id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          is_default: userAddresses.length === 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        let updatedAddresses = [...userAddresses, newAddress];
        
        if (newAddress.is_default) {
          updatedAddresses = updatedAddresses.map(addr => 
            addr.id === newAddress.id ? addr : { ...addr, is_default: false }
          );
        }
        
        set({ userAddresses: updatedAddresses });
      },

      updateUserAddress: (id, addressUpdate) => {
        const { userAddresses } = get();
        const updatedAddresses = userAddresses.map(addr =>
          addr.id === id ? { ...addr, ...addressUpdate, updated_at: new Date().toISOString() } : addr
        );
        set({ userAddresses: updatedAddresses });
      },

      deleteUserAddress: (id) => {
        const { userAddresses, selectedAddress } = get();
        const updatedAddresses = userAddresses.filter(addr => addr.id !== id);
        
        const updates: any = { userAddresses: updatedAddresses };
        
        if (selectedAddress?.id === id) {
          updates.selectedAddress = null;
        }
        
        set(updates);
      },

      setSelectedAddress: (address) => {
        set({ selectedAddress: address });
      },

      setDefaultAddress: (id) => {
        const { userAddresses } = get();
        const updatedAddresses = userAddresses.map(addr => ({
          ...addr,
          is_default: addr.id === id,
          updated_at: addr.id === id ? new Date().toISOString() : addr.updated_at
        }));
        set({ userAddresses: updatedAddresses });
      },

      // 支付方式管理实现
      setPaymentMethods: (methods) => {
        set({ paymentMethods: methods });
      },

      setSelectedPaymentMethod: (method) => {
        set({ selectedPaymentMethod: method });
      },

      // 订单和支付操作实现
      calculateOrderSummary: () => {
        const { cart, appliedCoupon } = get();
        
        const subtotal = cart.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        );
        
        const shipping = subtotal > 99 ? 0 : 10;
        const tax = subtotal * 0.1;
        
        let discount = 0;
        if (appliedCoupon) {
          if (appliedCoupon.type === 'percentage') {
            discount = subtotal * (appliedCoupon.value / 100);
          } else {
            discount = appliedCoupon.value;
          }
          
          if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
            discount = appliedCoupon.max_discount;
          }
        }
        
        const total = subtotal + shipping + tax;
        const finalTotal = Math.max(0, total - discount);
        
        const summary: OrderSummary = {
          subtotal,
          shipping,
          tax,
          discount,
          total,
          finalTotal,
          items: cart.length,
          couponCode: appliedCoupon?.code || null
        };
        
        set({ orderSummary: summary });
        return summary;
      },

      applyCoupon: (coupon) => {
        const { cart } = get();
        
        if (cart.length === 0) return false;
        
        if (coupon.min_order_amount) {
          const subtotal = cart.reduce((total, item) => 
            total + (item.product.price * item.quantity), 0
          );
          if (subtotal < coupon.min_order_amount) return false;
        }
        
        const now = new Date();
        const validFrom = new Date(coupon.valid_from);
        const validUntil = new Date(coupon.valid_until);
        
        if (now < validFrom || now > validUntil) return false;
        
        set({ appliedCoupon: coupon });
        return true;
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      createOrder: async (checkoutForm: CheckoutForm) => {
        set({ checkoutLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { cart, user, selectedAddress, selectedPaymentMethod, appliedCoupon } = get();
          
          if (!user || !selectedAddress || !selectedPaymentMethod) {
            throw new Error('缺少必要的订单信息');
          }

          const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const orderSummary = get().calculateOrderSummary();
          
          const order: Order = {
            id: orderId,
            user_id: user.id,
            items: cart.map(item => ({
              product_id: item.product.id,
              product_name: item.product.name,
              product_image: item.product.images[0],
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity
            })),
            total_amount: orderSummary.total,
            discount_amount: orderSummary.discount,
            final_amount: orderSummary.finalTotal,
            status: 'pending',
            payment_status: 'pending',
            shipping_address: selectedAddress,
            payment_method: selectedPaymentMethod,
            coupon_code: appliedCoupon?.code || null,
            notes: checkoutForm.notes || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          set({ 
            currentOrder: order,
            checkoutLoading: false 
          });
          
          return order;
        } catch (error) {
          set({ 
            checkoutLoading: false,
            error: error instanceof Error ? error.message : '创建订单失败'
          });
          return null;
        }
      },

      processPayment: async (paymentRequest: PaymentRequest) => {
        set({ paymentLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const paymentResponse: PaymentResponse = {
            success: true,
            transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: paymentRequest.amount,
            currency: 'CNY',
            status: 'completed',
            payment_method: paymentRequest.payment_method,
            created_at: new Date().toISOString()
          };

          set({ paymentLoading: false });
          return paymentResponse;
        } catch (error) {
          set({ 
            paymentLoading: false,
            error: error instanceof Error ? error.message : '支付处理失败'
          });
          return null;
        }
      },

      processBalancePayment: async (balanceRequest: BalancePaymentRequest) => {
        set({ paymentLoading: true, error: null });
        
        try {
          const { user, deductBalance } = get();
          
          if (!user) {
            throw new Error('用户未登录');
          }

          const success = deductBalance(balanceRequest.amount);
          
          if (!success) {
            throw new Error('余额不足');
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const balanceResponse: BalancePaymentResponse = {
            success: true,
            transaction_id: `bal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: balanceRequest.amount,
            remaining_balance: get().getUserBalance(),
            created_at: new Date().toISOString()
          };

          set({ paymentLoading: false });
          return balanceResponse;
        } catch (error) {
          set({ 
            paymentLoading: false,
            error: error instanceof Error ? error.message : '余额支付失败'
          });
          return null;
        }
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      clearCheckoutData: () => {
        set({
          selectedAddress: null,
          selectedPaymentMethod: null,
          currentOrder: null,
          orderSummary: null,
          appliedCoupon: null,
          checkoutLoading: false,
          paymentLoading: false,
          error: null
        });
      },

      // 订单历史实现
      fetchOrders: async (filters = {}) => {
        set({ ordersLoading: true, error: null });
        
        try {
          const { user } = get();
          if (!user) {
            throw new Error('用户未登录');
          }

          const result = await OrderService.getOrders({
            user_id: user.id,
            status: filters.status,
            page: filters.page || 1,
            limit: filters.limit || 10
          });
          
          set({
            orders: result.orders,
            ordersLoading: false
          });
        } catch (error) {
          set({
            ordersLoading: false,
            error: '获取订单列表失败'
          });
        }
      },
      
      fetchOrderDetail: async (orderId: string) => {
        set({ orderDetailLoading: true, error: null });
        
        try {
          const order = await OrderService.getOrderById(orderId);
          
          if (!order) {
            throw new Error('订单不存在');
          }
          
          set({
            orderDetail: order,
            orderDetailLoading: false
          });
        } catch (error) {
          set({
            orderDetailLoading: false,
            error: error instanceof Error ? error.message : '获取订单详情失败'
          });
        }
      },
      
      getShippingInfo: (orderId: string) => {
        const { shippingInfo } = get();
        return shippingInfo.find(info => info.order_id === orderId) || null;
      },
      
      cancelOrder: async (orderId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { orders, orderDetail } = get();

          const updatedOrders = orders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled' as const, updated_at: new Date().toISOString() }
              : order
          );
          
          const updatedOrderDetail = orderDetail?.id === orderId 
            ? { ...orderDetail, status: 'cancelled' as const, updated_at: new Date().toISOString() }
            : orderDetail;
          
          set({
            orders: updatedOrders,
            orderDetail: updatedOrderDetail,
            isLoading: false 
          });
          
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: '取消订单失败，请稍后重试'
          });
          return false;
        }
      },
      
      reorderItems: async (orderId: string) => {
        try {
          const order = await OrderService.getOrderById(orderId);
          if (!order) return;

          const { addToCart } = get();
          
          order.items.forEach(item => {
            // 这里需要根据实际的Product结构来构造product对象
            // 暂时跳过实现，需要产品服务支持
          });
        } catch (error) {
          console.error('重新下单失败:', error);
        }
      },
      
      clearOrderDetail: () => {
         set({ orderDetail: null });
       },

      addOrderToHistory: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders]
        }));
      },

      // 支付凭证和交易日志实现
      generatePaymentVoucher: (orderId: string, paymentId: string, transactionId: string, amount: number, paymentMethod: string) => {
        const voucher: PaymentVoucher = {
          id: `voucher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          order_id: orderId,
          payment_id: paymentId,
          voucher_number: `V${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          amount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          status: 'valid',
          issued_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1年后过期
          metadata: {
            generated_by: 'system',
            order_reference: orderId
          }
        };
        
        const { paymentVouchers } = get();
        set({ paymentVouchers: [...paymentVouchers, voucher] });
        return voucher;
      },

      addTransactionLog: (log: Omit<TransactionLog, 'id' | 'timestamp'>) => {
        const newLog: TransactionLog = {
          ...log,
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        
        const { transactionLogs } = get();
        set({ transactionLogs: [...transactionLogs, newLog] });
      },

      updateInventory: async (orderId: string, items: { product_id: string; quantity: number }[]) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const { inventoryUpdates, addTransactionLog } = get();
          const updates: InventoryUpdate[] = [];

          items.forEach(item => {
            const update: InventoryUpdate = {
              id: `inv_${Date.now()}_${item.product_id}`,
              product_id: item.product_id,
              order_id: orderId,
              quantity_changed: -item.quantity,
              reason: 'order_placed',
              created_at: new Date().toISOString()
            };
            updates.push(update);
          });
          
          set({ inventoryUpdates: [...inventoryUpdates, ...updates] });

          addTransactionLog({
            order_id: orderId,
            user_id: get().user?.id || '',
            action: 'inventory_updated',
            status: 'success',
            details: {
              items_updated: items.length,
              total_quantity_reduced: items.reduce((sum, item) => sum + item.quantity, 0),
              updates: updates.map(u => ({ product_id: u.product_id, quantity_changed: u.quantity_changed }))
            }
          });
          
          return true;
        } catch (error) {
          const { addTransactionLog } = get();
          addTransactionLog({
            order_id: orderId,
            user_id: get().user?.id || '',
            action: 'inventory_updated',
            status: 'failed',
            details: { error: 'Failed to update inventory' },
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
          return false;
        }
      },

      // 通知操作实现
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString()
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadNotificationCount: state.unreadNotificationCount + 1
        }));
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
          unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1)
        }));
      },

      clearNotifications: () => {
        set({
          notifications: [],
          unreadNotificationCount: 0
        });
      },

      sendPaymentSuccessNotification: (orderId, amount, paymentMethod) => {
        get().addNotification({
          type: 'success',
          title: '支付成功',
          message: `订单 ${orderId} 支付成功，金额：¥${amount}，支付方式：${paymentMethod}`,
          read: false
        });
      },

      // 管理员操作实现
      setAdmin: (admin) => {
        set({ admin, isAdminAuthenticated: !!admin });
      },

      adminLogin: async (credentials) => {
        set({ adminAuthLoading: true, adminAuthError: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (credentials.username === 'admin' && credentials.password === 'admin123') {
            const admin: AdminUser = {
              id: 'admin_1',
              username: credentials.username,
              email: 'admin@example.com',
              full_name: '系统管理员',
              role: 'super_admin',
              avatar_url: '',
              is_active: true,
              is_super_admin: true,
              department: 'IT部门',
              position: '系统管理员',
              last_login_at: new Date().toISOString(),
              last_login_ip: '127.0.0.1',
              login_count: 1,
              failed_login_attempts: 0,
              password_changed_at: new Date().toISOString(),
              two_factor_enabled: false,
              permissions: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system'
            };
            
            // 记录操作日志
            const operationLog: OperationLog = {
              id: `log_${Date.now()}`,
              admin_user_id: admin.id,
              admin_username: admin.username,
              action: 'LOGIN',
              resource_type: 'ADMIN_AUTH',
              resource_id: admin.id,
              description: '管理员登录系统',
              ip_address: '127.0.0.1', // 在实际应用中应该获取真实IP
              user_agent: navigator.userAgent,
              request_data: JSON.stringify({ username: credentials.username }),
              response_data: JSON.stringify({ success: true, admin_id: admin.id }),
              status: 'SUCCESS',
              error_message: null,
              created_at: new Date().toISOString()
            };

            set({ 
              admin, 
              isAdminAuthenticated: true,
              adminAuthLoading: false 
            });

            // 在实际应用中，这里应该将操作日志发送到后端API
            console.log('Admin Operation Log:', operationLog);
            
            return true;
          } else {
            set({
              adminAuthError: { message: '用户名或密码错误' },
              adminAuthLoading: false
            });
            return false;
          }
        } catch (error) {
          set({
            adminAuthError: { message: '登录失败，请稍后重试' },
            adminAuthLoading: false
          });
          return false;
        }
      },

      adminLogout: () => {
        set({
          admin: null,
          isAdminAuthenticated: false,
          adminAuthError: null
        });
      },

      clearAdminAuthError: () => {
        set({ adminAuthError: null });
      },

      // 管理员数据获取实现
      fetchDashboardStats: async () => {
        set({ dashboardLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({
            dashboardStats: {
              totalUsers: 1250,
              totalOrders: 3420,
              totalProducts: 450,
              newUsersToday: 25,
              ordersToday: 67,
              revenueToday: 8500,
              conversionRate: 3.2
            },
            dashboardLoading: false
          });
        } catch (error) {
          set({ dashboardLoading: false });
        }
      },

      fetchOperationLogs: async (params = {}) => {
        set({ operationLogsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({
            operationLogs: [],
            operationLogsLoading: false
          });
        } catch (error) {
          set({ operationLogsLoading: false });
        }
      },

      fetchSystemSettings: async () => {
        set({ systemSettingsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({
            systemSettings: null,
            systemSettingsLoading: false
          });
        } catch (error) {
          set({ systemSettingsLoading: false });
        }
      },

      updateSystemSettings: async (settings) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchStockAlerts: async () => {
        set({ stockAlertsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({
            stockAlerts: [],
            stockAlertsLoading: false
          });
        } catch (error) {
          set({ stockAlertsLoading: false });
        }
      },

      fetchSalesReports: async (period) => {
        set({ salesReportsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({
            salesReports: [],
            salesReportsLoading: false
          });
        } catch (error) {
          set({ salesReportsLoading: false });
        }
      },



      fetchProductPerformance: async (params = {}) => {
        set({ productPerformanceLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({
            productPerformance: [],
            productPerformanceLoading: false
          });
        } catch (error) {
          set({ productPerformanceLoading: false });
        }
      },

      fetchQuickActions: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          set({
            quickActions: [
              { id: '1', title: '添加商品', description: '快速添加新商品', icon: 'Plus', action: 'add_product' },
              { id: '2', title: '处理订单', description: '查看待处理订单', icon: 'Package', action: 'process_orders' },
              { id: '3', title: '用户管理', description: '管理用户账户', icon: 'Users', action: 'manage_users' },
              { id: '4', title: '系统设置', description: '配置系统参数', icon: 'Settings', action: 'system_settings' }
            ]
          });
        } catch (error) {
          // Handle error
        }
      },

      fetchAdminNotifications: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          set({
            adminNotifications: [
              { id: '1', title: '库存警告', message: '商品A库存不足', type: 'warning', read: false, created_at: new Date().toISOString() },
              { id: '2', title: '新订单', message: '收到新订单 #12345', type: 'info', read: false, created_at: new Date().toISOString() },
              { id: '3', title: '系统更新', message: '系统将于今晚维护', type: 'info', read: true, created_at: new Date().toISOString() }
            ]
          });
        } catch (error) {
          // Handle error
        }
      },

      fetchSystemHealth: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({
            systemHealth: {
              status: 'healthy',
              uptime: '99.9%',
              response_time: 120,
              memory_usage: 65,
              cpu_usage: 45,
              disk_usage: 78,
              active_users: 234,
              error_rate: 0.1,
              last_backup: new Date().toISOString(),
              services: [
                { name: 'API服务', status: 'running', response_time: 95 },
                { name: '数据库', status: 'running', response_time: 45 },
                { name: '缓存服务', status: 'running', response_time: 12 },
                { name: '文件存储', status: 'running', response_time: 78 }
              ]
            }
          });
        } catch (error) {
          // Handle error
        }
      },

      fetchContentPages: async (params = {}) => {
        set({ contentPagesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({
            contentPages: [],
            contentPagesLoading: false
          });
        } catch (error) {
          set({ contentPagesLoading: false });
        }
      },

      createContentPage: async (page) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          return true;
        } catch (error) {
          return false;
        }
      },

      updateContentPage: async (id, page) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteContentPage: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          return true;
        } catch (error) {
          return false;
        }
      },

      // 用户管理方法实现
      fetchAllUsers: async (params = {}) => {
        set({ allUsersLoading: true });
        try {
          // 尝试从API获取真实用户数据
          const response = await fetch('/api/admin/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().admin?.token || ''}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            set({ allUsers: data.users || [], allUsersLoading: false });
          } else {
            // 如果API不可用，使用本地存储的用户数据
            const storedUsers = localStorage.getItem('jade-shopping-users');
            if (storedUsers) {
              const users = JSON.parse(storedUsers);
              set({ allUsers: users, allUsersLoading: false });
            } else {
              // 如果没有存储的用户数据，创建一个空数组
              set({ allUsers: [], allUsersLoading: false });
            }
          }
        } catch (error) {
          console.warn('无法获取用户数据，使用本地存储:', error);
          // 尝试从本地存储获取用户数据
          const storedUsers = localStorage.getItem('jade-shopping-users');
          if (storedUsers) {
            try {
              const users = JSON.parse(storedUsers);
              set({ allUsers: users, allUsersLoading: false });
            } catch (parseError) {
              console.error('解析本地用户数据失败:', parseError);
              set({ allUsers: [], allUsersLoading: false });
            }
          } else {
            set({ allUsers: [], allUsersLoading: false });
          }
        }
      },

      fetchUserDetail: async (userId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const user = get().allUsers.find(u => u.id === userId);
          set({ selectedUser: user || null });
          return user || null;
        } catch (error) {
          return null;
        }
      },

      updateUserStatus: async (userId, status) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const users = get().allUsers.map(user => 
            user.id === userId ? { ...user, status, updated_at: new Date().toISOString() } : user
          );
          set({ allUsers: users });
          return true;
        } catch (error) {
          return false;
        }
      },

      updateUserPermissions: async (userId, permissions) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const users = get().allUsers.map(user => 
            user.id === userId ? { ...user, permissions, updated_at: new Date().toISOString() } : user
          );
          set({ allUsers: users });
          return true;
        } catch (error) {
          return false;
        }
      },

      addUser: async (userData) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newUser: UserDetail = {
            ...userData,
            id: Date.now().toString(),
            registration_date: new Date().toISOString(),
            last_login: null,
            email_verified: false,
            phone_verified: false,
            total_orders: 0,
            total_spent: 0,
            membership_level: 'bronze',
            permissions: ['user:read', 'order:create'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // 获取现有用户数据
          const existingUsers = get().allUsers;
          const updatedUsers = [...existingUsers, newUser];
          
          // 更新内存状态
          set({ allUsers: updatedUsers });
          
          // 保存到 localStorage
          try {
            localStorage.setItem('jade-shopping-users', JSON.stringify(updatedUsers));
          } catch (error) {
            console.warn('无法保存用户数据到 localStorage:', error);
          }
          
          // 触发自定义事件通知其他组件
          window.dispatchEvent(new CustomEvent('userDataUpdated', {
            detail: { type: 'add', user: newUser }
          }));
          
          return newUser;
        } catch (error) {
          return null;
        }
      },

      updateUser: async (userId, userData) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const users = get().allUsers.map(user => 
            user.id === userId ? { ...user, ...userData, updated_at: new Date().toISOString() } : user
          );
          set({ allUsers: users });
          return true;
        } catch (error) {
          return false;
        }
      },



      fetchLoginLogs: async (userId) => {
        set({ loginLogsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockLogs: LoginLog[] = [
            {
              id: '1',
              user_id: '1',
              login_time: '2024-01-15T10:30:00Z',
              ip_address: '192.168.1.100',
              user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              location: '北京市',
              device_type: 'desktop',
              success: true
            }
          ];
          set({ loginLogs: mockLogs, loginLogsLoading: false });
        } catch (error) {
          set({ loginLogsLoading: false });
        }
      },

      fetchUserActionLogs: async (userId) => {
        set({ userActionLogsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockLogs: UserActionLog[] = [
            {
              id: '1',
              user_id: '1',
              action: 'login',
              description: '用户登录',
              ip_address: '192.168.1.100',
              user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              created_at: '2024-01-15T10:30:00Z'
            }
          ];
          set({ userActionLogs: mockLogs, userActionLogsLoading: false });
        } catch (error) {
          set({ userActionLogsLoading: false });
        }
      },

      // 用户统计和标签管理方法实现
      fetchUserStats: async () => {
        set({ userStatsLoading: true });
        try {
          // 尝试从API获取统计数据
          const response = await fetch('/api/admin/users/stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().admin?.token || ''}`
            }
          });

          if (response.ok) {
            const stats = await response.json();
            set({ userStats: stats, userStatsLoading: false });
          } else {
            // 如果API不可用，从localStorage获取最新用户数据并计算统计信息
            let users = get().allUsers || [];
            
            // 如果allUsers为空或过时，从localStorage重新加载
            if (users.length === 0) {
              try {
                const storedUsers = localStorage.getItem('jade-shopping-users');
                if (storedUsers) {
                  const parsedUsers = JSON.parse(storedUsers);
                  users = Array.isArray(parsedUsers) ? parsedUsers : [];
                  // 更新store中的allUsers
                  set({ allUsers: users });
                }
              } catch (error) {
                console.warn('无法从localStorage读取用户数据:', error);
                users = [];
              }
            }
            
            const now = new Date();
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            
            const calculatedStats = {
              total_users: users.length,
              active_users: users.filter(u => u.status === 'active').length,
              new_users_this_month: users.filter(u => 
                new Date(u.registration_date) >= thisMonth
              ).length,
              growth_rate: users.length > 0 ? 
                (users.filter(u => new Date(u.registration_date) >= thisMonth).length / users.length * 100) : 0,
              high_risk_users: users.filter(u => u.risk_level === 'high').length,
              average_order_value: users.length > 0 ? 
                users.reduce((sum, u) => sum + (u.total_spent || 0), 0) / users.length : 0,
              top_spending_users: users
                .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
                .slice(0, 5)
                .map(u => ({
                  id: u.id,
                  name: u.full_name,
                  totalSpent: u.total_spent || 0
                })),
              users_by_status: {
                active: users.filter(u => u.status === 'active').length,
                inactive: users.filter(u => u.status === 'inactive').length,
                suspended: users.filter(u => u.status === 'suspended').length,
                banned: users.filter(u => u.status === 'banned').length
              },
              users_by_membership: {
                bronze: users.filter(u => u.membership_level === 'bronze').length,
                silver: users.filter(u => u.membership_level === 'silver').length,
                gold: users.filter(u => u.membership_level === 'gold').length,
                platinum: users.filter(u => u.membership_level === 'platinum').length
              },
              registration_trend: [] // 可以根据需要计算趋势数据
            };
            
            set({ userStats: calculatedStats, userStatsLoading: false });
          }
        } catch (error) {
          console.warn('无法获取用户统计数据，使用计算值:', error);
          // 从localStorage获取最新用户数据并计算统计信息
          let users = get().allUsers || [];
          
          // 如果allUsers为空或过时，从localStorage重新加载
          if (users.length === 0) {
            try {
              const storedUsers = localStorage.getItem('jade-shopping-users');
              if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers);
                users = Array.isArray(parsedUsers) ? parsedUsers : [];
                // 更新store中的allUsers
                set({ allUsers: users });
              }
            } catch (error) {
              console.warn('无法从localStorage读取用户数据:', error);
              users = [];
            }
          }
          
          const now = new Date();
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          const calculatedStats = {
            total_users: users.length,
            active_users: users.filter(u => u.status === 'active').length,
            new_users_this_month: users.filter(u => 
              new Date(u.registration_date) >= thisMonth
            ).length,
            growth_rate: users.length > 0 ? 
              (users.filter(u => new Date(u.registration_date) >= thisMonth).length / users.length * 100) : 0,
            high_risk_users: users.filter(u => u.risk_level === 'high').length,
            average_order_value: users.length > 0 ? 
              users.reduce((sum, u) => sum + (u.total_spent || 0), 0) / users.length : 0,
            top_spending_users: users
              .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
              .slice(0, 5)
              .map(u => ({
                id: u.id,
                name: u.full_name,
                totalSpent: u.total_spent || 0
              })),
            users_by_status: {
              active: users.filter(u => u.status === 'active').length,
              inactive: users.filter(u => u.status === 'inactive').length,
              suspended: users.filter(u => u.status === 'suspended').length,
              banned: users.filter(u => u.status === 'banned').length
            },
            users_by_membership: {
              bronze: users.filter(u => u.membership_level === 'bronze').length,
              silver: users.filter(u => u.membership_level === 'silver').length,
              gold: users.filter(u => u.membership_level === 'gold').length,
              platinum: users.filter(u => u.membership_level === 'platinum').length
            },
            registration_trend: []
          };
          
          set({ userStats: calculatedStats, userStatsLoading: false });
        }
      },

      fetchUserTags: async () => {
        set({ userTagsLoading: true });
        try {
          // 尝试从API获取用户标签数据
          const response = await fetch('/api/admin/users/tags', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().admin?.token || ''}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            set({ userTags: data.tags || [], userTagsLoading: false });
          } else {
            // 如果API不可用，从localStorage获取最新用户数据并生成标签统计
            let allUsers = get().allUsers || [];
            
            // 如果allUsers为空或过时，从localStorage重新加载
            if (allUsers.length === 0) {
              try {
                const storedUsers = localStorage.getItem('jade-shopping-users');
                if (storedUsers) {
                  const parsedUsers = JSON.parse(storedUsers);
                  allUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
                  // 更新store中的allUsers
                  set({ allUsers });
                }
              } catch (error) {
                console.warn('无法从localStorage读取用户数据:', error);
                allUsers = [];
              }
            }
            
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            
            // 计算各类用户数量
            const vipUsers = allUsers.filter(user => user.total_spent > 5000).length;
            const newUsers = allUsers.filter(user => 
              new Date(user.registration_date) > thirtyDaysAgo
            ).length;
            const activeUsers = allUsers.filter(user => 
              user.total_orders > 5 || user.last_login && new Date(user.last_login) > thirtyDaysAgo
            ).length;
            const riskUsers = allUsers.filter(user => 
              user.status === 'suspended' || user.status === 'banned'
            ).length;

            const calculatedTags = [
              {
                id: '1',
                name: 'VIP客户',
                color: '#f59e0b',
                description: '高价值客户（消费>5000元）',
                user_count: vipUsers,
                created_at: '2024-01-01T00:00:00Z'
              },
              {
                id: '2',
                name: '新用户',
                color: '#10b981',
                description: '30天内新注册用户',
                user_count: newUsers,
                created_at: '2024-01-01T00:00:00Z'
              },
              {
                id: '3',
                name: '活跃用户',
                color: '#3b82f6',
                description: '订单数>5或30天内有登录',
                user_count: activeUsers,
                created_at: '2024-01-01T00:00:00Z'
              },
              {
                id: '4',
                name: '风险用户',
                color: '#ef4444',
                description: '被暂停或封禁的用户',
                user_count: riskUsers,
                created_at: '2024-01-01T00:00:00Z'
              }
            ];
            set({ userTags: calculatedTags, userTagsLoading: false });
          }
        } catch (error) {
          console.warn('无法获取用户标签数据，使用计算结果:', error);
          // 从localStorage获取最新用户数据并生成标签统计
          let allUsers = get().allUsers || [];
          
          // 如果allUsers为空或过时，从localStorage重新加载
          if (allUsers.length === 0) {
            try {
              const storedUsers = localStorage.getItem('jade-shopping-users');
              if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers);
                allUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
                // 更新store中的allUsers
                set({ allUsers });
              }
            } catch (error) {
              console.warn('无法从localStorage读取用户数据:', error);
              allUsers = [];
            }
          }
          
          const now = new Date();
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          
          const vipUsers = allUsers.filter(user => user.total_spent > 5000).length;
          const newUsers = allUsers.filter(user => 
            new Date(user.registration_date) > thirtyDaysAgo
          ).length;
          const activeUsers = allUsers.filter(user => 
            user.total_orders > 5 || user.last_login && new Date(user.last_login) > thirtyDaysAgo
          ).length;
          const riskUsers = allUsers.filter(user => 
            user.status === 'suspended' || user.status === 'banned'
          ).length;

          const calculatedTags = [
            {
              id: '1',
              name: 'VIP客户',
              color: '#f59e0b',
              description: '高价值客户（消费>5000元）',
              user_count: vipUsers,
              created_at: '2024-01-01T00:00:00Z'
            },
            {
              id: '2',
              name: '新用户',
              color: '#10b981',
              description: '30天内新注册用户',
              user_count: newUsers,
              created_at: '2024-01-01T00:00:00Z'
            },
            {
              id: '3',
              name: '活跃用户',
              color: '#3b82f6',
              description: '订单数>5或30天内有登录',
              user_count: activeUsers,
              created_at: '2024-01-01T00:00:00Z'
            },
            {
              id: '4',
              name: '风险用户',
              color: '#ef4444',
              description: '被暂停或封禁的用户',
              user_count: riskUsers,
              created_at: '2024-01-01T00:00:00Z'
            }
          ];
          set({ userTags: calculatedTags, userTagsLoading: false });
        }
      },

      createUserTag: async (tag) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const newTag = {
            ...tag,
            id: Date.now().toString(),
            user_count: 0,
            created_at: new Date().toISOString()
          };
          const tags = [...get().userTags, newTag];
          set({ userTags: tags });
          return newTag;
        } catch (error) {
          return null;
        }
      },

      updateUserTag: async (tagId, tag) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const tags = get().userTags.map(t => 
            t.id === tagId ? { ...t, ...tag } : t
          );
          set({ userTags: tags });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteUserTag: async (tagId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const tags = get().userTags.filter(t => t.id !== tagId);
          set({ userTags: tags });
          return true;
        } catch (error) {
          return false;
        }
      },

      addUserTags: async (userId, tagIds) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          // 在实际应用中，这里会更新用户的标签关联
          return true;
        } catch (error) {
          return false;
        }
      },

      removeUserTags: async (userId, tagIds) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          // 在实际应用中，这里会移除用户的标签关联
          return true;
        } catch (error) {
          return false;
        }
      },

      updateUserRiskLevel: async (userId, riskLevel, reason) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const users = get().allUsers.map(user => 
            user.id === userId ? { ...user, risk_level: riskLevel, updated_at: new Date().toISOString() } : user
          );
          set({ allUsers: users });
          return true;
        } catch (error) {
          return false;
        }
      },

      suspendUser: async (userId, duration, reason) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const users = get().allUsers.map(user => 
            user.id === userId ? { 
              ...user, 
              status: 'suspended',
              suspension_end: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString() 
            } : user
          );
          set({ allUsers: users });
          return true;
        } catch (error) {
          return false;
        }
      },

      unsuspendUser: async (userId, reason) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const users = get().allUsers.map(user => 
            user.id === userId ? { 
              ...user, 
              status: 'active',
              suspension_end: null,
              updated_at: new Date().toISOString() 
            } : user
          );
          set({ allUsers: users });
          return true;
        } catch (error) {
          return false;
        }
      },

      batchUpdateUsers: async (operation) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // 在实际应用中，这里会执行批量操作
          return true;
        } catch (error) {
          return false;
        }
      },

      exportUserData: async (filters, format = 'excel') => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // 在实际应用中，这里会生成并下载导出文件
          return true;
        } catch (error) {
          return false;
        }
      },

      // 商品管理方法实现
      fetchAllProducts: async (params = {}) => {
        set({ allProductsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockProducts: ProductDetail[] = [
            {
              id: '1',
              name: '时尚休闲鞋',
              description: '舒适透气的休闲鞋，适合日常穿着',
              price: 299.00,
              original_price: 399.00,
              category_id: '1',
              category_name: '鞋类',
              brand: 'Nike',
              sku: 'SHOE001',
              stock_quantity: 150,
              min_stock: 10,
              max_stock: 500,
              weight: 0.8,
              dimensions: '25x15x10',
              images: ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20casual%20sneakers%20product%20photo&image_size=square'],
              status: 'active',
              is_featured: true,
              tags: ['休闲', '舒适', '透气'],
              attributes: [
                { name: '颜色', value: '黑色' },
                { name: '尺码', value: '42' }
              ],
              seo_title: '时尚休闲鞋 - 舒适透气',
              seo_description: '高品质休闲鞋，舒适透气，适合日常穿着',
              sales_count: 85,
              view_count: 1250,
              rating: 4.5,
              review_count: 32,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:30:00Z'
            }
          ];
          set({ allProducts: mockProducts, allProductsLoading: false });
        } catch (error) {
          set({ allProductsLoading: false });
        }
      },

      fetchProductDetail: async (productId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const product = get().allProducts.find(p => p.id === productId);
          set({ selectedProduct: product || null });
          return product || null;
        } catch (error) {
          return null;
        }
      },

      createProduct: async (product) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newProduct: ProductDetail = {
            ...product,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const products = [...get().allProducts, newProduct];
          set({ allProducts: products });
          return newProduct;
        } catch (error) {
          return null;
        }
      },

      updateProduct: async (id, product) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const products = get().allProducts.map(p => 
            p.id === id ? { ...p, ...product, updated_at: new Date().toISOString() } : p
          );
          set({ allProducts: products });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteProduct: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const products = get().allProducts.filter(p => p.id !== id);
          set({ allProducts: products });
          return true;
        } catch (error) {
          return false;
        }
      },

      updateProductStatus: async (id, status) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const products = get().allProducts.map(p => 
            p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p
          );
          set({ allProducts: products });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchCategories: async () => {
        set({ categoriesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockCategories: CategoryManagement[] = [
            {
              id: '1',
              name: '鞋类',
              description: '各种类型的鞋子',
              parent_id: null,
              level: 1,
              sort_order: 1,
              is_active: true,
              product_count: 25,
              image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=shoes%20category%20icon&image_size=square',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:30:00Z'
            }
          ];
          set({ categories: mockCategories, categoriesLoading: false });
        } catch (error) {
          set({ categoriesLoading: false });
        }
      },

      createCategory: async (category) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newCategory: CategoryManagement = {
            ...category,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const categories = [...get().categories, newCategory];
          set({ categories });
          return newCategory;
        } catch (error) {
          return null;
        }
      },

      updateCategory: async (id, category) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const categories = get().categories.map(c => 
            c.id === id ? { ...c, ...category, updated_at: new Date().toISOString() } : c
          );
          set({ categories });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteCategory: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const categories = get().categories.filter(c => c.id !== id);
          set({ categories });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 新增分类管理方法
      fetchCategoryTree: async () => {
        set({ categoryTreeLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const categories = get().categories;
          const tree = get().buildCategoryTree(categories);
          set({ categoryTree: tree, categoryTreeLoading: false });
        } catch (error) {
          set({ categoryTreeLoading: false });
        }
      },

      fetchCategoryStats: async () => {
        set({ categoryStatsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockStats: CategoryManagementStats = {
            total_categories: 15,
            active_categories: 12,
            inactive_categories: 3,
            categories_with_products: 10,
            empty_categories: 5,
            top_level_categories: 5,
            max_depth: 3,
            total_products: 150,
            avg_products_per_category: 10
          };
          set({ categoryStats: mockStats, categoryStatsLoading: false });
        } catch (error) {
          set({ categoryStatsLoading: false });
        }
      },

      initCategoryEdit: async (categoryId) => {
        set({ categoryEditLoading: true, categoryEditErrors: {} });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (categoryId) {
            // 编辑现有分类
            const category = get().categories.find(c => c.id === categoryId);
            if (category) {
              const form: CategoryEditForm = {
                name: category.name,
                description: category.description || '',
                parent_id: category.parent_id || '',
                sort_order: category.sort_order,
                is_active: category.is_active,
                image: category.image || '',
                seo_title: category.seo_title || '',
                seo_description: category.seo_description || '',
                seo_keywords: category.seo_keywords || '',
                banner_image: category.banner_image || '',
                is_featured: category.is_featured || false
              };
              set({ categoryEditForm: form, categoryEditLoading: false });
              return form;
            }
          } else {
            // 新建分类
            const form: CategoryEditForm = {
              name: '',
              description: '',
              parent_id: '',
              sort_order: 1,
              is_active: true,
              image: '',
              seo_title: '',
              seo_description: '',
              seo_keywords: '',
              banner_image: '',
              is_featured: false
            };
            set({ categoryEditForm: form, categoryEditLoading: false });
            return form;
          }
          
          set({ categoryEditLoading: false });
          return null;
        } catch (error) {
          set({ categoryEditLoading: false });
          return null;
        }
      },

      updateCategoryEditForm: (field, value) => {
        const currentForm = get().categoryEditForm;
        if (currentForm) {
          set({ 
            categoryEditForm: { 
              ...currentForm, 
              [field]: value 
            } 
          });
        }
      },

      saveCategoryDraft: async (formData) => {
        const form = formData || get().categoryEditForm;
        if (!form) return false;

        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // 这里可以保存草稿到本地存储
          return true;
        } catch (error) {
          return false;
        }
      },

      publishCategory: async (formData) => {
        const form = formData || get().categoryEditForm;
        if (!form) return false;

        set({ categoryEditLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const categoryData: Omit<CategoryManagement, 'id' | 'created_at' | 'updated_at'> = {
            name: form.name,
            description: form.description,
            parent_id: form.parent_id || null,
            level: form.parent_id ? 2 : 1, // 简化处理
            sort_order: form.sort_order,
            is_active: form.is_active,
            image: form.image,
            seo_title: form.seo_title,
            seo_description: form.seo_description,
            seo_keywords: form.seo_keywords,
            banner_image: form.banner_image,
            is_featured: form.is_featured,
            product_count: 0,
            total_sales: 0
          };

          const result = await get().createCategory(categoryData);
          set({ categoryEditLoading: false });
          return !!result;
        } catch (error) {
          set({ categoryEditLoading: false });
          return false;
        }
      },

      validateCategoryForm: (formData) => {
        const form = formData || get().categoryEditForm;
        const errors: CategoryValidationErrors = {};

        if (!form) return errors;

        if (!form.name.trim()) {
          errors.name = '分类名称不能为空';
        } else if (form.name.length > 50) {
          errors.name = '分类名称不能超过50个字符';
        }

        if (form.description && form.description.length > 500) {
          errors.description = '分类描述不能超过500个字符';
        }

        if (form.seo_title && form.seo_title.length > 60) {
          errors.seo_title = 'SEO标题不能超过60个字符';
        }

        if (form.seo_description && form.seo_description.length > 160) {
          errors.seo_description = 'SEO描述不能超过160个字符';
        }

        if (form.sort_order < 0) {
          errors.sort_order = '排序值不能为负数';
        }

        set({ categoryEditErrors: errors });
        return errors;
      },

      batchUpdateCategories: async (operation) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const categories = get().categories.map(category => {
            if (operation.category_ids.includes(category.id)) {
              return {
                ...category,
                ...operation.updates,
                updated_at: new Date().toISOString()
              };
            }
            return category;
          });
          
          set({ categories });
          return true;
        } catch (error) {
          return false;
        }
      },

      uploadCategoryImage: async (file) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // 模拟图片上传，返回图片URL
          const imageUrl = `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent('category image')}&image_size=square`;
          return imageUrl;
        } catch (error) {
          return null;
        }
      },

      fetchCategoryOperationLogs: async (categoryId) => {
        set({ categoryOperationLogsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockLogs: CategoryOperationLog[] = [
            {
              id: '1',
              category_id: categoryId || '1',
              operation_type: 'create',
              operation_description: '创建分类',
              operator_id: 'admin1',
              operator_name: '管理员',
              old_value: null,
              new_value: '鞋类',
              created_at: '2024-06-15T10:30:00Z'
            },
            {
              id: '2',
              category_id: categoryId || '1',
              operation_type: 'update',
              operation_description: '更新分类描述',
              operator_id: 'admin1',
              operator_name: '管理员',
              old_value: '鞋子',
              new_value: '各种类型的鞋子',
              created_at: '2024-06-14T14:20:00Z'
            }
          ];
          set({ categoryOperationLogs: mockLogs, categoryOperationLogsLoading: false });
        } catch (error) {
          set({ categoryOperationLogsLoading: false });
        }
      },

      setCategoryFilters: (filters) => {
        set({ categoryFilters: filters });
      },

      resetCategoryFilters: () => {
        set({ 
          categoryFilters: {
            search: '',
            status: 'all',
            parent_id: '',
            is_featured: undefined,
            sort_by: 'sort_order',
            sort_order: 'asc'
          }
        });
      },

      toggleCategorySelection: (categoryId) => {
        const selected = get().selectedCategories;
        const newSelected = selected.includes(categoryId)
          ? selected.filter(id => id !== categoryId)
          : [...selected, categoryId];
        set({ selectedCategories: newSelected });
      },

      selectAllCategories: () => {
        const categoryIds = get().categories.map(c => c.id);
        set({ selectedCategories: categoryIds });
      },

      clearCategorySelection: () => {
        set({ selectedCategories: [] });
      },

      buildCategoryTree: (categories) => {
        const categoryMap = new Map<string, CategoryTreeNode>();
        const rootNodes: CategoryTreeNode[] = [];

        // 创建节点映射
        categories.forEach(category => {
          categoryMap.set(category.id, {
            ...category,
            children: [],
            expanded: false,
            level: category.level
          });
        });

        // 构建树形结构
        categories.forEach(category => {
          const node = categoryMap.get(category.id)!;
          if (category.parent_id) {
            const parent = categoryMap.get(category.parent_id);
            if (parent) {
              parent.children.push(node);
            }
          } else {
            rootNodes.push(node);
          }
        });

        return rootNodes;
      },

      expandCategoryNode: (nodeId) => {
        const updateNode = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
          return nodes.map(node => ({
            ...node,
            expanded: node.id === nodeId ? true : node.expanded,
            children: updateNode(node.children)
          }));
        };
        
        const tree = updateNode(get().categoryTree);
        set({ categoryTree: tree });
      },

      collapseCategoryNode: (nodeId) => {
        const updateNode = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
          return nodes.map(node => ({
            ...node,
            expanded: node.id === nodeId ? false : node.expanded,
            children: updateNode(node.children)
          }));
        };
        
        const tree = updateNode(get().categoryTree);
        set({ categoryTree: tree });
      },

      fetchInventoryManagement: async () => {
        set({ inventoryLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockInventory: InventoryManagement[] = [
            {
              id: '1',
              product_id: '1',
              product_name: '时尚休闲鞋',
              sku: 'SHOE001',
              current_stock: 150,
              reserved_stock: 5,
              available_stock: 145,
              min_stock: 10,
              max_stock: 500,
              reorder_point: 20,
              last_updated: '2024-01-15T10:30:00Z',
              location: '仓库A-01'
            }
          ];
          set({ inventoryManagement: mockInventory, inventoryLoading: false });
        } catch (error) {
          set({ inventoryLoading: false });
        }
      },

      adjustStock: async (productId, adjustment) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const stockAdjustments = [...get().stockAdjustments, adjustment];
          set({ stockAdjustments });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 商品详情页面相关方法
      fetchProductSalesStats: async (productId) => {
        set({ productSalesStatsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockStats: ProductSalesStats = {
            product_id: productId,
            total_sales: 1250,
            total_revenue: 125000,
            monthly_sales: [
              { month: '2024-01', sales: 120, revenue: 12000 },
              { month: '2024-02', sales: 150, revenue: 15000 },
              { month: '2024-03', sales: 180, revenue: 18000 },
              { month: '2024-04', sales: 200, revenue: 20000 },
              { month: '2024-05', sales: 220, revenue: 22000 },
              { month: '2024-06', sales: 250, revenue: 25000 }
            ],
            daily_views: [
              { date: '2024-06-01', views: 45 },
              { date: '2024-06-02', views: 52 },
              { date: '2024-06-03', views: 38 },
              { date: '2024-06-04', views: 61 },
              { date: '2024-06-05', views: 48 }
            ],
            conversion_rate: 0.125,
            average_rating: 4.5,
            total_reviews: 32
          };
          set({ productSalesStats: mockStats, productSalesStatsLoading: false });
          return mockStats;
        } catch (error) {
          set({ productSalesStatsLoading: false });
          return null;
        }
      },

      fetchProductOperationLogs: async (productId) => {
        set({ productOperationLogsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockLogs: ProductOperationLog[] = [
            {
              id: '1',
              product_id: productId,
              operation_type: 'status_change',
              operation_description: '商品状态从"草稿"更改为"在售"',
              operator_id: 'admin1',
              operator_name: '管理员',
              old_value: 'draft',
              new_value: 'active',
              created_at: '2024-06-15T10:30:00Z'
            },
            {
              id: '2',
              product_id: productId,
              operation_type: 'stock_adjustment',
              operation_description: '库存调整：增加50件',
              operator_id: 'admin1',
              operator_name: '管理员',
              old_value: '100',
              new_value: '150',
              created_at: '2024-06-14T14:20:00Z'
            },
            {
              id: '3',
              product_id: productId,
              operation_type: 'price_change',
              operation_description: '价格从¥89.00调整为¥99.00',
              operator_id: 'admin2',
              operator_name: '运营专员',
              old_value: '89.00',
              new_value: '99.00',
              created_at: '2024-06-13T09:15:00Z'
            }
          ];
          set({ productOperationLogs: mockLogs, productOperationLogsLoading: false });
          return mockLogs;
        } catch (error) {
          set({ productOperationLogsLoading: false });
          return [];
        }
      },

      fetchRelatedProducts: async (productId, categoryId) => {
        set({ relatedProductsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 400));
          const allProducts = get().allProducts;
          const relatedProducts = allProducts
            .filter(p => p.id !== productId && p.category_id === categoryId)
            .slice(0, 6);
          set({ relatedProducts, relatedProductsLoading: false });
          return relatedProducts;
        } catch (error) {
          set({ relatedProductsLoading: false });
          return [];
        }
      },

      adjustProductStock: async (productId, adjustment) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const products = get().allProducts.map(p => {
            if (p.id === productId) {
              const newStock = p.stock + adjustment;
              return { 
                ...p, 
                stock: Math.max(0, newStock),
                updated_at: new Date().toISOString()
              };
            }
            return p;
          });
          set({ allProducts: products });
          
          // 更新选中的商品
          const selectedProduct = get().selectedProduct;
          if (selectedProduct && selectedProduct.id === productId) {
            const updatedProduct = products.find(p => p.id === productId);
            set({ selectedProduct: updatedProduct || null });
          }
          
          return true;
        } catch (error) {
          return false;
        }
      },

      // 商品编辑相关方法实现
      updateProductEditForm: (field, value) => {
        const currentForm = get().productEditForm;
        if (currentForm) {
          set({ 
            productEditForm: { 
              ...currentForm, 
              [field]: value 
            } 
          });
        }
      },

      initProductEdit: async (productId) => {
        set({ productEditLoading: true, productEditErrors: {} });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (productId) {
            // 编辑模式：加载现有商品数据
            const product = get().allProducts.find(p => p.id === productId);
            if (product) {
              const editForm: ProductEditForm = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                original_price: product.original_price || product.price,
                cost_price: product.cost_price || 0,
                category_id: product.category_id,
                brand: product.brand || '',
                sku: product.sku,
                stock_quantity: product.stock_quantity,
                min_stock: product.min_stock || 10,
                max_stock: product.max_stock || 1000,
                weight: product.weight || 0,
                dimensions: product.dimensions || '',
                status: product.status,
                is_featured: product.is_featured || false,
                tags: product.tags || [],
                seo_title: product.seo_title || product.name,
                seo_description: product.seo_description || product.description,
                seo_keywords: product.seo_keywords || [],
                promotional_price: product.promotional_price || null,
                promotional_start_date: product.promotional_start_date || null,
                promotional_end_date: product.promotional_end_date || null,
                images: product.images?.map((url, index) => ({
                  id: `img_${index}`,
                  url,
                  alt: product.name,
                  is_main: index === 0,
                  sort_order: index
                })) || [],
                specifications: product.attributes?.map((attr, index) => ({
                  id: `spec_${index}`,
                  name: attr.name,
                  value: attr.value,
                  type: 'text'
                })) || []
              };
              
              set({ 
                productEditForm: editForm,
                productImages: editForm.images,
                productSpecifications: editForm.specifications,
                productEditLoading: false 
              });
              return editForm;
            }
          } else {
            // 新增模式：创建空表单
            const newForm: ProductEditForm = {
              id: '',
              name: '',
              description: '',
              price: 0,
              original_price: 0,
              cost_price: 0,
              category_id: '',
              brand: '',
              sku: '',
              stock_quantity: 0,
              min_stock: 10,
              max_stock: 1000,
              weight: 0,
              dimensions: '',
              status: 'draft',
              is_featured: false,
              tags: [],
              seo_title: '',
              seo_description: '',
              seo_keywords: [],
              promotional_price: null,
              promotional_start_date: null,
              promotional_end_date: null,
              images: [],
              specifications: []
            };
            
            set({ 
              productEditForm: newForm,
              productImages: [],
              productSpecifications: [],
              productEditLoading: false 
            });
            return newForm;
          }
          
          set({ productEditLoading: false });
          return null;
        } catch (error) {
          set({ productEditLoading: false });
          return null;
        }
      },

      saveProductDraft: async (formData) => {
        const currentForm = formData || get().productEditForm;
        if (!currentForm) return false;
        
        set({ isDraftSaving: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const draftData = { ...currentForm, status: 'draft' as const };
          
          if (currentForm.id) {
            // 更新现有草稿
            await get().updateProduct(currentForm.id, draftData);
          } else {
            // 创建新草稿
            const newProduct = await get().createProduct(draftData);
            if (newProduct) {
              set({ productEditForm: { ...currentForm, id: newProduct.id } });
            }
          }
          
          set({ isDraftSaving: false });
          return true;
        } catch (error) {
          set({ isDraftSaving: false });
          return false;
        }
      },

      publishProduct: async (formData) => {
        const currentForm = formData || get().productEditForm;
        if (!currentForm) return false;
        
        set({ isPublishing: true });
        try {
          // 验证表单
          const errors = get().validateProductForm(currentForm);
          if (Object.keys(errors).length > 0) {
            set({ productEditErrors: errors, isPublishing: false });
            return false;
          }

          await new Promise(resolve => setTimeout(resolve, 800));
          
          const publishData = { ...currentForm, status: 'active' as const };
          
          if (currentForm.id) {
            // 更新并发布现有商品
            await get().updateProduct(currentForm.id, publishData);
          } else {
            // 创建并发布新商品
            const newProduct = await get().createProduct(publishData);
            if (newProduct) {
              set({ productEditForm: { ...currentForm, id: newProduct.id } });
            }
          }
          
          set({ isPublishing: false, productEditErrors: {} });
          return true;
        } catch (error) {
          set({ isPublishing: false });
          return false;
        }
      },

      validateProductForm: (formData) => {
        const currentForm = formData || get().productEditForm;
        if (!currentForm) return {};
        
        const errors: ProductEditErrors = {};
        
        if (!currentForm.name?.trim()) {
          errors.name = '商品名称不能为空';
        }
        
        if (!currentForm.description?.trim()) {
          errors.description = '商品描述不能为空';
        }
        
        if (!currentForm.price || currentForm.price <= 0) {
          errors.price = '商品价格必须大于0';
        }
        
        if (!currentForm.category_id) {
          errors.category_id = '请选择商品分类';
        }
        
        if (!currentForm.sku?.trim()) {
          errors.sku = 'SKU不能为空';
        }
        
        if (currentForm.stock_quantity < 0) {
          errors.stock_quantity = '库存数量不能为负数';
        }
        
        if (currentForm.min_stock < 0) {
          errors.min_stock = '最小库存不能为负数';
        }
        
        if (currentForm.max_stock <= currentForm.min_stock) {
          errors.max_stock = '最大库存必须大于最小库存';
        }
        
        set({ productEditErrors: errors });
        return errors;
      },

      uploadProductImage: async (file) => {
        set({ productImagesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 模拟图片上传
          const imageUrl = `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent('product image ' + file.name)}&image_size=square`;
          
          const newImage: ProductImage = {
            id: `img_${Date.now()}`,
            url: imageUrl,
            alt: file.name,
            is_main: get().productImages.length === 0,
            sort_order: get().productImages.length
          };
          
          const updatedImages = [...get().productImages, newImage];
          set({ productImages: updatedImages, productImagesLoading: false });
          
          // 更新表单数据
          const currentForm = get().productEditForm;
          if (currentForm) {
            set({ productEditForm: { ...currentForm, images: updatedImages } });
          }
          
          return newImage;
        } catch (error) {
          set({ productImagesLoading: false });
          return null;
        }
      },

      deleteProductImage: async (imageId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const updatedImages = get().productImages.filter(img => img.id !== imageId);
          
          // 如果删除的是主图，将第一张图片设为主图
          if (updatedImages.length > 0) {
            const hasMainImage = updatedImages.some(img => img.is_main);
            if (!hasMainImage) {
              updatedImages[0].is_main = true;
            }
          }
          
          set({ productImages: updatedImages });
          
          // 更新表单数据
          const currentForm = get().productEditForm;
          if (currentForm) {
            set({ productEditForm: { ...currentForm, images: updatedImages } });
          }
          
          return true;
        } catch (error) {
          return false;
        }
      },

      reorderProductImages: async (images) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const reorderedImages = images.map((img, index) => ({
            ...img,
            sort_order: index,
            is_main: index === 0 ? true : (index === 0 ? img.is_main : false)
          }));
          
          set({ productImages: reorderedImages });
          
          // 更新表单数据
          const currentForm = get().productEditForm;
          if (currentForm) {
            set({ productEditForm: { ...currentForm, images: reorderedImages } });
          }
          
          return true;
        } catch (error) {
          return false;
        }
      },

      addProductSpecification: (spec) => {
        const newSpec: ProductSpecification = {
          ...spec,
          id: `spec_${Date.now()}`
        };
        
        const updatedSpecs = [...get().productSpecifications, newSpec];
        set({ productSpecifications: updatedSpecs });
        
        // 更新表单数据
        const currentForm = get().productEditForm;
        if (currentForm) {
          set({ productEditForm: { ...currentForm, specifications: updatedSpecs } });
        }
      },

      updateProductSpecification: (id, spec) => {
        const updatedSpecs = get().productSpecifications.map(s => 
          s.id === id ? { ...s, ...spec } : s
        );
        set({ productSpecifications: updatedSpecs });
        
        // 更新表单数据
        const currentForm = get().productEditForm;
        if (currentForm) {
          set({ productEditForm: { ...currentForm, specifications: updatedSpecs } });
        }
      },

      deleteProductSpecification: (id) => {
        const updatedSpecs = get().productSpecifications.filter(s => s.id !== id);
        set({ productSpecifications: updatedSpecs });
        
        // 更新表单数据
        const currentForm = get().productEditForm;
        if (currentForm) {
          set({ productEditForm: { ...currentForm, specifications: updatedSpecs } });
        }
      },

      generateProductSKU: (name, categoryId) => {
        const namePrefix = name.substring(0, 3).toUpperCase();
        const categoryPrefix = categoryId.substring(0, 2).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        return `${categoryPrefix}${namePrefix}${timestamp}`;
      },

      checkSKUAvailability: async (sku, excludeId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const existingProduct = get().allProducts.find(p => 
            p.sku === sku && p.id !== excludeId
          );
          
          return !existingProduct;
        } catch (error) {
          return false;
        }
      },

      // 订单管理方法实现
      fetchAllOrders: async (params = {}) => {
        set({ allOrdersLoading: true });
        try {
          const result = await OrderService.getOrders(params);
          set({ allOrders: result.orders, allOrdersLoading: false });
        } catch (error) {
          set({ allOrdersLoading: false });
        }
      },



      updateOrderStatus: async (orderId, status) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const orders = get().allOrders.map(order => 
            order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order
          );
          set({ allOrders: orders });
          return true;
        } catch (error) {
          return false;
        }
      },

      updatePaymentStatus: async (orderId, status) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const orders = get().allOrders.map(order => 
            order.id === orderId ? { ...order, payment_status: status, updated_at: new Date().toISOString() } : order
          );
          set({ allOrders: orders });
          return true;
        } catch (error) {
          return false;
        }
      },

      addOrderNote: async (orderId, note) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const newNote: OrderNote = {
            id: Date.now().toString(),
            order_id: orderId,
            note,
            created_by: 'admin',
            created_at: new Date().toISOString()
          };
          const orderNotes = [...get().orderNotes, newNote];
          set({ orderNotes });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchOrderTimeline: async (orderId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockTimeline: OrderTimeline[] = [
            {
              id: '1',
              order_id: orderId,
              status: 'created',
              description: '订单已创建',
              created_at: '2024-01-15T10:30:00Z',
              created_by: 'system'
            }
          ];
          set({ orderTimeline: mockTimeline });
        } catch (error) {
          // Handle error
        }
      },

      processAfterSales: async (orderId, service) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newService: AfterSalesService = {
            ...service,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const afterSalesServices = [...get().afterSalesServices, newService];
          set({ afterSalesServices });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 支付管理方法实现
      fetchPaymentDetails: async (params = {}) => {
        set({ paymentDetailsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockPayments: PaymentDetail[] = [
            {
              id: '1',
              order_id: '1',
              order_number: 'ORD20240115001',
              user_id: '1',
              user_name: '张三',
              payment_method: 'alipay',
              payment_provider: '支付宝',
              transaction_id: 'TXN20240115001',
              amount: 564.00,
              currency: 'CNY',
              status: 'completed',
              gateway_response: '支付成功',
              fee: 5.64,
              refunded_amount: 0.00,
              created_at: '2024-01-15T10:35:00Z',
              completed_at: '2024-01-15T10:36:00Z'
            }
          ];
          set({ paymentDetails: mockPayments, paymentDetailsLoading: false });
        } catch (error) {
          set({ paymentDetailsLoading: false });
        }
      },

      fetchPaymentDetail: async (paymentId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const payment = get().paymentDetails.find(p => p.id === paymentId);
          set({ selectedPayment: payment || null });
          return payment || null;
        } catch (error) {
          return null;
        }
      },

      processRefund: async (paymentId, amount, reason) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const payments = get().paymentDetails.map(payment => 
            payment.id === paymentId ? { 
              ...payment, 
              refunded_amount: payment.refunded_amount + amount,
              status: payment.amount === payment.refunded_amount + amount ? 'refunded' : 'partial_refund'
            } : payment
          );
          set({ paymentDetails: payments });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchReconciliationRecords: async (params = {}) => {
        set({ reconciliationLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockRecords: ReconciliationRecord[] = [
            {
              id: '1',
              date: '2024-01-15',
              payment_method: 'alipay',
              total_transactions: 125,
              total_amount: 15680.50,
              platform_amount: 15680.50,
              difference: 0.00,
              status: 'matched',
              created_at: '2024-01-15T23:59:59Z'
            }
          ];
          set({ reconciliationRecords: mockRecords, reconciliationLoading: false });
        } catch (error) {
          set({ reconciliationLoading: false });
        }
      },

      generateReconciliation: async (params) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return true;
        } catch (error) {
          return false;
        }
      },

      // 发货管理方法实现
      fetchShippingOrders: async (params = {}) => {
        set({ shippingOrdersLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockShippingOrders: ShippingOrder[] = [
            {
              id: '1',
              order_id: '1',
              order_number: 'ORD20240115001',
              user_name: '张三',
              shipping_address: {
                recipient_name: '张三',
                phone: '13800138001',
                province: '北京市',
                city: '北京市',
                district: '朝阳区',
                street: '建国路88号',
                postal_code: '100000'
              },
              logistics_provider_id: '1',
              logistics_provider_name: '顺丰速运',
              tracking_number: 'SF1234567890',
              shipping_method: 'express',
              estimated_delivery: '2024-01-17T18:00:00Z',
              status: 'shipped',
              weight: 0.8,
              package_count: 1,
              shipping_fee: 15.00,
              created_at: '2024-01-15T14:00:00Z',
              shipped_at: '2024-01-15T16:00:00Z'
            }
          ];
          set({ shippingOrders: mockShippingOrders, shippingOrdersLoading: false });
        } catch (error) {
          set({ shippingOrdersLoading: false });
        }
      },

      fetchShippingOrderDetail: async (shippingId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const shippingOrder = get().shippingOrders.find(s => s.id === shippingId);
          set({ selectedShippingOrder: shippingOrder || null });
          return shippingOrder || null;
        } catch (error) {
          return null;
        }
      },

      updateShippingStatus: async (shippingId, status, trackingNumber) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const shippingOrders = get().shippingOrders.map(order => 
            order.id === shippingId ? { 
              ...order, 
              status, 
              tracking_number: trackingNumber || order.tracking_number,
              shipped_at: status === 'shipped' ? new Date().toISOString() : order.shipped_at
            } : order
          );
          set({ shippingOrders: shippingOrders });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchLogisticsProviders: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockProviders: LogisticsProvider[] = [
            {
              id: '1',
              name: '顺丰速运',
              code: 'SF',
              api_endpoint: 'https://api.sf-express.com',
              is_active: true,
              supported_services: ['express', 'standard'],
              pricing_rules: [],
              created_at: '2024-01-01T00:00:00Z'
            }
          ];
          set({ logisticsProviders: mockProviders });
        } catch (error) {
          // Handle error
        }
      },

      createShippingOrder: async (orderId, shippingData) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newShippingOrder: ShippingOrder = {
            ...shippingData,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
          };
          const shippingOrders = [...get().shippingOrders, newShippingOrder];
          set({ shippingOrders });
          return newShippingOrder;
        } catch (error) {
          return null;
        }
      },

      printShippingLabel: async (shippingId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return true;
        } catch (error) {
          return false;
        }
      },

      // 扩展发货管理方法实现
      fetchShippings: async (filters) => {
        set({ shippingsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockShippings: Shipping[] = [
            {
              id: '1',
              order_id: '1',
              order_number: 'ORD20240115001',
              recipient_name: '张三',
              recipient_phone: '13800138001',
              recipient_address: '北京市朝阳区建国路88号',
              carrier_code: 'SF',
              carrier_name: '顺丰速运',
              tracking_number: 'SF1234567890',
              status: 'shipped',
              weight: 0.8,
              package_count: 1,
              shipping_fee: 15.00,
              estimated_delivery: '2024-01-17T18:00:00Z',
              notes: '请尽快配送',
              created_at: '2024-01-15T14:00:00Z',
              updated_at: '2024-01-15T16:00:00Z'
            }
          ];
          set({ shippings: mockShippings, shippingsLoading: false });
        } catch (error) {
          set({ shippingsLoading: false });
        }
      },

      fetchShippingDetail: async (shippingId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const shipping = get().shippings.find(s => s.id === shippingId);
          set({ selectedShipping: shipping || null });
          return shipping || null;
        } catch (error) {
          return null;
        }
      },

      createShipping: async (shipping) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newShipping: Shipping = {
            ...shipping,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const shippings = [...get().shippings, newShipping];
          set({ shippings });
          return newShipping;
        } catch (error) {
          return null;
        }
      },

      updateShipping: async (id, shipping) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const shippings = get().shippings.map(s => 
            s.id === id ? { ...s, ...shipping, updated_at: new Date().toISOString() } : s
          );
          set({ shippings });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteShipping: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const shippings = get().shippings.filter(s => s.id !== id);
          set({ shippings });
          return true;
        } catch (error) {
          return false;
        }
      },

      batchUpdateShippings: async (operation) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // 批量操作逻辑
          return true;
        } catch (error) {
          return false;
        }
      },

      // 物流跟踪方法实现
      fetchLogisticsTracking: async (trackingNumber, carrier) => {
        set({ trackingLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const mockTracking: LogisticsTracking = {
            id: '1',
            tracking_number: trackingNumber,
            carrier_code: carrier || 'SF',
            carrier_name: '顺丰速运',
            status: 'in_transit',
            current_location: '北京分拣中心',
            estimated_delivery: '2024-01-17T18:00:00Z',
            events: [
              {
                id: '1',
                shipping_id: '1',
                status: 'picked_up',
                location: '北京朝阳区',
                description: '快件已被收取',
                timestamp: '2024-01-15T14:00:00Z',
                operator: '张师傅'
              }
            ],
            created_at: '2024-01-15T14:00:00Z',
            updated_at: new Date().toISOString()
          };
          set({ trackingLoading: false });
          return mockTracking;
        } catch (error) {
          set({ trackingLoading: false });
          return null;
        }
      },

      updateTrackingEvents: async (shippingId, events) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ trackingEvents: events });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchTrackingHistory: async (shippingId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockEvents: TrackingEvent[] = [
            {
              id: '1',
              shipping_id: shippingId,
              status: 'picked_up',
              location: '北京朝阳区',
              description: '快件已被收取',
              timestamp: '2024-01-15T14:00:00Z',
              operator: '张师傅'
            }
          ];
          return mockEvents;
        } catch (error) {
          return [];
        }
      },

      // 发货配置方法实现
      fetchShippingConfig: async () => {
        set({ configLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockConfig: ShippingConfig = {
            id: '1',
            default_carrier: 'SF',
            auto_assign_carrier: true,
            require_signature: false,
            insurance_enabled: true,
            max_package_weight: 30,
            business_hours: {
              start: '09:00',
              end: '18:00'
            },
            holiday_shipping: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
          };
          set({ shippingConfig: mockConfig, configLoading: false });
        } catch (error) {
          set({ configLoading: false });
        }
      },

      updateShippingConfig: async (config) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const currentConfig = get().shippingConfig;
          if (currentConfig) {
            const updatedConfig = { ...currentConfig, ...config, updated_at: new Date().toISOString() };
            set({ shippingConfig: updatedConfig });
          }
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchCarrierConfigs: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockConfigs: CarrierConfig[] = [
            {
              id: '1',
              carrier_code: 'SF',
              carrier_name: '顺丰速运',
              api_endpoint: 'https://api.sf-express.com',
              api_key: 'sf_api_key',
              is_enabled: true,
              supported_services: ['standard', 'express'],
              pricing_rules: [],
              created_at: '2024-01-01T00:00:00Z',
              updated_at: new Date().toISOString()
            }
          ];
          set({ carrierConfigs: mockConfigs });
        } catch (error) {
          // Handle error
        }
      },

      updateCarrierConfig: async (carrierId, config) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const carrierConfigs = get().carrierConfigs.map(c => 
            c.id === carrierId ? { ...c, ...config, updated_at: new Date().toISOString() } : c
          );
          set({ carrierConfigs });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchShippingRules: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockRules: ShippingRule[] = [
            {
              id: '1',
              name: '免费配送规则',
              conditions: {
                min_amount: 99,
                regions: ['北京', '上海', '广州']
              },
              actions: {
                free_shipping: true,
                carrier_preference: 'SF'
              },
              is_active: true,
              priority: 1,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: new Date().toISOString()
            }
          ];
          set({ shippingRules: mockRules });
        } catch (error) {
          // Handle error
        }
      },

      createShippingRule: async (rule) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newRule: ShippingRule = {
            ...rule,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const shippingRules = [...get().shippingRules, newRule];
          set({ shippingRules });
          return newRule;
        } catch (error) {
          return null;
        }
      },

      updateShippingRule: async (id, rule) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const shippingRules = get().shippingRules.map(r => 
            r.id === id ? { ...r, ...rule, updated_at: new Date().toISOString() } : r
          );
          set({ shippingRules });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteShippingRule: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const shippingRules = get().shippingRules.filter(r => r.id !== id);
          set({ shippingRules });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchShippingTemplates: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockTemplates: ShippingTemplate[] = [
            {
              id: '1',
              name: '标准配送模板',
              carrier_code: 'SF',
              service_type: 'standard',
              pricing_rules: [],
              delivery_time: '1-3个工作日',
              is_default: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: new Date().toISOString()
            }
          ];
          set({ shippingTemplates: mockTemplates });
        } catch (error) {
          // Handle error
        }
      },

      createShippingTemplate: async (template) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newTemplate: ShippingTemplate = {
            ...template,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const shippingTemplates = [...get().shippingTemplates, newTemplate];
          set({ shippingTemplates });
          return newTemplate;
        } catch (error) {
          return null;
        }
      },

      updateShippingTemplate: async (id, template) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const shippingTemplates = get().shippingTemplates.map(t => 
            t.id === id ? { ...t, ...template, updated_at: new Date().toISOString() } : t
          );
          set({ shippingTemplates });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteShippingTemplate: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const shippingTemplates = get().shippingTemplates.filter(t => t.id !== id);
          set({ shippingTemplates });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 发货分析方法实现
      fetchShippingStats: async (params) => {
        set({ shippingStatsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const mockStats: ShippingStats = {
            total_shippings: 1250,
            pending_shippings: 45,
            shipped_count: 980,
            delivered_count: 890,
            exception_count: 12,
            average_delivery_time: 2.5,
            on_time_rate: 0.92,
            cost_analysis: {
              total_cost: 18750.50,
              average_cost: 15.00,
              cost_by_carrier: {
                'SF': 12500.00,
                'YTO': 6250.50
              }
            },
            period: {
              start_date: params?.start_date || '2024-01-01',
              end_date: params?.end_date || '2024-01-31'
            }
          };
          set({ shippingStats: mockStats, shippingStatsLoading: false });
        } catch (error) {
          set({ shippingStatsLoading: false });
        }
      },

      fetchShippingAnalytics: async (config) => {
        set({ analyticsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockAnalytics: ShippingAnalyticsConfig = {
            id: '1',
            name: '发货分析配置',
            metrics: ['delivery_time', 'cost_analysis', 'success_rate'],
            chart_types: ['line', 'bar', 'pie'],
            date_range: 30,
            auto_refresh: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
          };
          set({ shippingAnalytics: mockAnalytics, analyticsLoading: false });
        } catch (error) {
          set({ analyticsLoading: false });
        }
      },

      fetchShippingCostAnalysis: async (params) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          const mockCostAnalysis: ShippingCostAnalysis = {
            total_cost: 18750.50,
            average_cost: 15.00,
            cost_by_carrier: {
              'SF': 12500.00,
              'YTO': 6250.50
            },
            cost_by_region: {
              '北京': 5000.00,
              '上海': 4500.00,
              '广州': 4000.00,
              '其他': 5250.50
            },
            cost_trend: [
              { date: '2024-01-01', cost: 580.50 },
              { date: '2024-01-02', cost: 620.00 }
            ],
            period: {
              start_date: params?.start_date || '2024-01-01',
              end_date: params?.end_date || '2024-01-31'
            }
          };
          set({ shippingCostAnalysis: mockCostAnalysis });
        } catch (error) {
          // Handle error
        }
      },

      fetchDeliveryTimeAnalysis: async (params) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          const mockTimeAnalysis: DeliveryTimeAnalysis = {
            average_delivery_time: 2.5,
            on_time_rate: 0.92,
            delivery_time_by_carrier: {
              'SF': 1.8,
              'YTO': 3.2
            },
            delivery_time_by_region: {
              '北京': 1.5,
              '上海': 2.0,
              '广州': 2.2,
              '其他': 3.5
            },
            time_distribution: {
              '1天内': 0.25,
              '2天内': 0.45,
              '3天内': 0.22,
              '3天以上': 0.08
            },
            period: {
              start_date: params?.start_date || '2024-01-01',
              end_date: params?.end_date || '2024-01-31'
            }
          };
          set({ deliveryTimeAnalysis: mockTimeAnalysis });
        } catch (error) {
          // Handle error
        }
      },

      // 发货操作方法实现
      generateShippingLabel: async (shippingId) => {
        set({ operationLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockLabel: ShippingLabel = {
            id: Date.now().toString(),
            shipping_id: shippingId,
            label_url: 'https://example.com/labels/label_' + shippingId + '.pdf',
            format: 'pdf',
            size: 'A4',
            created_at: new Date().toISOString()
          };
          const shippingLabels = [...get().shippingLabels, mockLabel];
          set({ shippingLabels, operationLoading: false });
          return mockLabel;
        } catch (error) {
          set({ operationLoading: false });
          return null;
        }
      },

      printShippingLabels: async (shippingIds) => {
        set({ operationLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          set({ operationLoading: false });
          return true;
        } catch (error) {
          set({ operationLoading: false });
          return false;
        }
      },

      handleShippingException: async (shippingId, exception) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newException: ShippingException = {
            ...exception,
            id: Date.now().toString(),
            shipping_id: shippingId,
            created_at: new Date().toISOString()
          };
          const shippingExceptions = [...get().shippingExceptions, newException];
          set({ shippingExceptions });
          return true;
        } catch (error) {
          return false;
        }
      },

      resolveShippingException: async (exceptionId, resolution) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const shippingExceptions = get().shippingExceptions.map(e => 
            e.id === exceptionId ? { ...e, status: 'resolved', resolution, resolved_at: new Date().toISOString() } : e
          );
          set({ shippingExceptions });
          return true;
        } catch (error) {
          return false;
        }
      },

      exportShippingData: async (filters, format = 'excel') => {
        set({ operationLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          set({ operationLoading: false });
          return true;
        } catch (error) {
          set({ operationLoading: false });
          return false;
        }
      },

      // 发货筛选和状态管理
      setShippingFilters: (filters) => {
        set({ shippingFilters: filters });
      },

      resetShippingFilters: () => {
        set({
          shippingFilters: {
            search: '',
            status: '',
            carrier: '',
            region: '',
            start_date: '',
            end_date: '',
            sort_by: 'created_at',
            sort_order: 'desc',
            page: 1,
            limit: 20
          }
        });
      },

      setSelectedShipping: (shipping) => {
        set({ selectedShipping: shipping });
      },

      // 内容管理方法实现
      fetchArticles: async (params = {}) => {
        set({ articlesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockArticles: Article[] = [
            {
              id: '1',
              title: '春季新品发布',
              slug: 'spring-new-arrivals',
              content: '<p>我们很高兴地宣布春季新品系列正式发布...</p>',
              excerpt: '春季新品系列包含多款时尚单品',
              category_id: '1',
              category_name: '新闻资讯',
              author_id: 'admin1',
              author_name: '管理员',
              featured_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=spring%20fashion%20collection%20banner&image_size=landscape_16_9',
              status: 'published',
              is_featured: true,
              view_count: 1250,
              tags: ['新品', '春季', '时尚'],
              seo_title: '春季新品发布 - 时尚购物网站',
              seo_description: '探索我们最新的春季时尚系列',
              published_at: '2024-01-15T10:00:00Z',
              created_at: '2024-01-14T15:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ articles: mockArticles, articlesLoading: false });
        } catch (error) {
          set({ articlesLoading: false });
        }
      },

      fetchArticleDetail: async (articleId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const article = get().articles.find(a => a.id === articleId);
          set({ selectedArticle: article || null });
          return article || null;
        } catch (error) {
          return null;
        }
      },

      createArticle: async (article) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newArticle: Article = {
            ...article,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const articles = [...get().articles, newArticle];
          set({ articles });
          return newArticle;
        } catch (error) {
          return null;
        }
      },

      updateArticle: async (id, article) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const articles = get().articles.map(a => 
            a.id === id ? { ...a, ...article, updated_at: new Date().toISOString() } : a
          );
          set({ articles });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteArticle: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const articles = get().articles.filter(a => a.id !== id);
          set({ articles });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchArticleCategories: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockCategories: ArticleCategory[] = [
            {
              id: '1',
              name: '新闻资讯',
              description: '最新的公司新闻和行业资讯',
              slug: 'news',
              is_active: true,
              sort_order: 1,
              article_count: 15,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ articleCategories: mockCategories });
        } catch (error) {
          // Handle error
        }
      },

      fetchAdvertisements: async () => {
        set({ advertisementsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockAds: Advertisement[] = [
            {
              id: '1',
              title: '春季大促销',
              description: '全场商品8折优惠',
              image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=spring%20sale%20banner%20advertisement&image_size=landscape_16_9',
              link_url: '/products?sale=spring',
              position: 'homepage_banner',
              start_date: '2024-01-15T00:00:00Z',
              end_date: '2024-03-15T23:59:59Z',
              is_active: true,
              sort_order: 1,
              click_count: 1580,
              created_at: '2024-01-10T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ advertisements: mockAds, advertisementsLoading: false });
        } catch (error) {
          set({ advertisementsLoading: false });
        }
      },

      createAdvertisement: async (ad) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newAd: Advertisement = {
            ...ad,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const advertisements = [...get().advertisements, newAd];
          set({ advertisements });
          return newAd;
        } catch (error) {
          return null;
        }
      },

      updateAdvertisement: async (id, ad) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const advertisements = get().advertisements.map(a => 
            a.id === id ? { ...a, ...ad, updated_at: new Date().toISOString() } : a
          );
          set({ advertisements });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteAdvertisement: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const advertisements = get().advertisements.filter(a => a.id !== id);
          set({ advertisements });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchPageContents: async () => {
        set({ pageContentsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockContents: PageContent[] = [
            {
              id: '1',
              page_key: 'homepage',
              section_key: 'hero',
              title: '欢迎来到时尚购物网站',
              content: '发现最新的时尚趋势和优质商品',
              image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20homepage%20hero%20banner&image_size=landscape_16_9',
              link_url: '/products',
              is_active: true,
              sort_order: 1,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ pageContents: mockContents, pageContentsLoading: false });
        } catch (error) {
          set({ pageContentsLoading: false });
        }
      },

      updatePageContent: async (id, content) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const pageContents = get().pageContents.map(c => 
            c.id === id ? { ...c, ...content, updated_at: new Date().toISOString() } : c
          );
          set({ pageContents });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchCarouselSlides: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockSlides: CarouselSlide[] = [
            {
              id: '1',
              title: '新品上市',
              subtitle: '探索最新时尚趋势',
              image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20carousel%20banner%20new%20arrivals&image_size=landscape_16_9',
              link_url: '/products/new',
              button_text: '立即查看',
              is_active: true,
              sort_order: 1,
              created_at: '2024-01-10T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ carouselSlides: mockSlides });
        } catch (error) {
          // Handle error
        }
      },

      createCarouselSlide: async (slide) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newSlide: CarouselSlide = {
            ...slide,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const carouselSlides = [...get().carouselSlides, newSlide];
          set({ carouselSlides });
          return newSlide;
        } catch (error) {
          return null;
        }
      },

      updateCarouselSlide: async (id, slide) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const carouselSlides = get().carouselSlides.map(s => 
            s.id === id ? { ...s, ...slide, updated_at: new Date().toISOString() } : s
          );
          set({ carouselSlides });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteCarouselSlide: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const carouselSlides = get().carouselSlides.filter(s => s.id !== id);
          set({ carouselSlides });
          return true;
        } catch (error) {
          return false;
        }
      },

      uploadMediaFile: async (file) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockFile: MediaFile = {
            id: Date.now().toString(),
            filename: file.name,
            original_name: file.name,
            file_path: `/uploads/${file.name}`,
            file_url: URL.createObjectURL(file),
            file_size: file.size,
            mime_type: file.type,
            file_type: file.type.startsWith('image/') ? 'image' : 'document',
            uploaded_by: 'admin1',
            created_at: new Date().toISOString()
          };
          const mediaFiles = [...get().mediaFiles, mockFile];
          set({ mediaFiles });
          return mockFile;
        } catch (error) {
          return null;
        }
      },

      deleteMediaFile: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mediaFiles = get().mediaFiles.filter(f => f.id !== id);
          set({ mediaFiles });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 扩展内容管理方法实现
      fetchContentCategories: async (params = {}) => {
        set({ contentCategoriesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockCategories: ContentCategory[] = [
            {
              id: '1',
              name: '新闻资讯',
              slug: 'news',
              description: '最新的公司新闻和行业资讯',
              parent_id: null,
              level: 0,
              sort_order: 1,
              is_active: true,
              content_count: 25,
              seo_title: '新闻资讯 - 时尚购物网站',
              seo_description: '获取最新的时尚资讯和公司动态',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: '产品介绍',
              slug: 'products',
              description: '详细的产品介绍和使用指南',
              parent_id: null,
              level: 0,
              sort_order: 2,
              is_active: true,
              content_count: 18,
              seo_title: '产品介绍 - 时尚购物网站',
              seo_description: '了解我们的产品特色和使用方法',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ contentCategories: mockCategories, contentCategoriesLoading: false });
        } catch (error) {
          set({ contentCategoriesLoading: false });
        }
      },

      createContentCategory: async (category) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newCategory: ContentCategory = {
            ...category,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const contentCategories = [...get().contentCategories, newCategory];
          set({ contentCategories });
          return newCategory;
        } catch (error) {
          return null;
        }
      },

      updateContentCategory: async (id, category) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentCategories = get().contentCategories.map(c => 
            c.id === id ? { ...c, ...category, updated_at: new Date().toISOString() } : c
          );
          set({ contentCategories });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteContentCategory: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const contentCategories = get().contentCategories.filter(c => c.id !== id);
          set({ contentCategories });
          return true;
        } catch (error) {
          return false;
        }
      },

      reorderContentCategories: async (categories) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ contentCategories: categories });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchContentTags: async (params = {}) => {
        set({ contentTagsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockTags: ContentTag[] = [
            {
              id: '1',
              name: '新品',
              slug: 'new-arrivals',
              description: '最新上架的商品',
              color: '#3B82F6',
              usage_count: 45,
              is_active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              name: '热门',
              slug: 'popular',
              description: '热门商品和内容',
              color: '#EF4444',
              usage_count: 32,
              is_active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ contentTags: mockTags, contentTagsLoading: false });
        } catch (error) {
          set({ contentTagsLoading: false });
        }
      },

      createContentTag: async (tag) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newTag: ContentTag = {
            ...tag,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const contentTags = [...get().contentTags, newTag];
          set({ contentTags });
          return newTag;
        } catch (error) {
          return null;
        }
      },

      updateContentTag: async (id, tag) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentTags = get().contentTags.map(t => 
            t.id === id ? { ...t, ...tag, updated_at: new Date().toISOString() } : t
          );
          set({ contentTags });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteContentTag: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const contentTags = get().contentTags.filter(t => t.id !== id);
          set({ contentTags });
          return true;
        } catch (error) {
          return false;
        }
      },

      mergeContentTags: async (sourceTagIds, targetTagId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // 模拟合并标签逻辑
          const contentTags = get().contentTags.filter(t => !sourceTagIds.includes(t.id));
          set({ contentTags });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchContentHistory: async (contentId) => {
        set({ contentHistoryLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockHistory: ContentHistory[] = [
            {
              id: '1',
              content_id: contentId,
              version: 3,
              title: '春季新品发布（修订版）',
              content: '<p>我们很高兴地宣布春季新品系列正式发布...</p>',
              change_summary: '更新了产品描述和价格信息',
              author_id: 'admin1',
              author_name: '管理员',
              created_at: '2024-01-15T14:30:00Z'
            },
            {
              id: '2',
              content_id: contentId,
              version: 2,
              title: '春季新品发布',
              content: '<p>我们很高兴地宣布春季新品系列...</p>',
              change_summary: '修正了错别字',
              author_id: 'admin1',
              author_name: '管理员',
              created_at: '2024-01-15T10:15:00Z'
            }
          ];
          set({ contentHistory: mockHistory, contentHistoryLoading: false });
        } catch (error) {
          set({ contentHistoryLoading: false });
        }
      },

      restoreContentVersion: async (contentId, versionId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // 模拟恢复版本逻辑
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchContentComments: async (contentId, params = {}) => {
        set({ contentCommentsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockComments: ContentComment[] = [
            {
              id: '1',
              content_id: contentId,
              parent_id: null,
              author_id: 'user1',
              author_name: '张三',
              author_email: 'zhangsan@example.com',
              content: '这个新品系列看起来很不错！',
              status: 'approved',
              ip_address: '192.168.1.100',
              user_agent: 'Mozilla/5.0...',
              created_at: '2024-01-15T16:20:00Z',
              updated_at: '2024-01-15T16:20:00Z'
            }
          ];
          set({ contentComments: mockComments, contentCommentsLoading: false });
        } catch (error) {
          set({ contentCommentsLoading: false });
        }
      },

      createContentComment: async (comment) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newComment: ContentComment = {
            ...comment,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const contentComments = [...get().contentComments, newComment];
          set({ contentComments });
          return newComment;
        } catch (error) {
          return null;
        }
      },

      updateContentComment: async (id, comment) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentComments = get().contentComments.map(c => 
            c.id === id ? { ...c, ...comment, updated_at: new Date().toISOString() } : c
          );
          set({ contentComments });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteContentComment: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const contentComments = get().contentComments.filter(c => c.id !== id);
          set({ contentComments });
          return true;
        } catch (error) {
          return false;
        }
      },

      moderateContentComment: async (id, status) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentComments = get().contentComments.map(c => 
            c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c
          );
          set({ contentComments });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchContentAnalytics: async (params = {}) => {
        set({ contentAnalyticsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockAnalytics: ContentAnalytics = {
            overview: {
              total_content: 156,
              published_content: 142,
              draft_content: 14,
              total_views: 45280,
              total_comments: 892,
              total_shares: 234,
              engagement_rate: 12.5
            },
            popular_content: [
              {
                id: '1',
                title: '春季新品发布',
                views: 2580,
                comments: 45,
                shares: 23,
                engagement_rate: 15.2
              }
            ],
            traffic_sources: [
              { source: '直接访问', visits: 12500, percentage: 45.2 },
              { source: '搜索引擎', visits: 8900, percentage: 32.1 },
              { source: '社交媒体', visits: 4200, percentage: 15.2 },
              { source: '其他', visits: 2080, percentage: 7.5 }
            ],
            user_engagement: {
              average_time_on_page: 185,
              bounce_rate: 32.5,
              pages_per_session: 2.8,
              return_visitor_rate: 68.3
            },
            content_performance: {
              daily_views: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                views: Math.floor(Math.random() * 500) + 200,
                unique_visitors: Math.floor(Math.random() * 300) + 150
              })),
              category_performance: [
                { category: '新闻资讯', content_count: 45, total_views: 18500, avg_views: 411 },
                { category: '产品介绍', content_count: 32, total_views: 15200, avg_views: 475 }
              ]
            }
          };
          set({ contentAnalytics: mockAnalytics, contentAnalyticsLoading: false });
        } catch (error) {
          set({ contentAnalyticsLoading: false });
        }
      },

      fetchContentStats: async () => {
        set({ contentStatsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockStats: ContentStats = {
            total_content: 156,
            published_content: 142,
            draft_content: 14,
            scheduled_content: 3,
            archived_content: 8,
            total_categories: 12,
            total_tags: 28,
            total_authors: 5,
            content_by_type: [
              { type: 'article', count: 89, percentage: 57.1 },
              { type: 'page', count: 35, percentage: 22.4 },
              { type: 'announcement', count: 32, percentage: 20.5 }
            ],
            content_by_status: [
              { status: 'published', count: 142, percentage: 91.0 },
              { status: 'draft', count: 14, percentage: 9.0 }
            ],
            monthly_content_creation: Array.from({ length: 12 }, (_, i) => ({
              month: new Date(2024, i, 1).toISOString().split('T')[0].substring(0, 7),
              created: Math.floor(Math.random() * 20) + 5,
              published: Math.floor(Math.random() * 18) + 4
            }))
          };
          set({ contentStats: mockStats, contentStatsLoading: false });
        } catch (error) {
          set({ contentStatsLoading: false });
        }
      },

      fetchSEOSettings: async () => {
        set({ seoSettingsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockSettings: SEOSettings = {
            site_title: '时尚购物网站',
            site_description: '发现最新的时尚趋势，购买优质商品',
            site_keywords: '时尚,购物,服装,配饰,新品',
            default_meta_title: '{title} - 时尚购物网站',
            default_meta_description: '{excerpt}',
            robots_txt: 'User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml',
            google_analytics_id: 'GA-XXXXXXXXX',
            google_search_console_id: 'GSC-XXXXXXXXX',
            facebook_pixel_id: 'FB-XXXXXXXXX',
            structured_data_enabled: true,
            open_graph_enabled: true,
            twitter_card_enabled: true,
            canonical_urls_enabled: true,
            auto_generate_meta: true,
            sitemap_enabled: true,
            sitemap_frequency: 'daily',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          };
          set({ seoSettings: mockSettings, seoSettingsLoading: false });
        } catch (error) {
          set({ seoSettingsLoading: false });
        }
      },

      updateSEOSettings: async (settings) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const currentSettings = get().seoSettings;
          if (currentSettings) {
            const updatedSettings = {
              ...currentSettings,
              ...settings,
              updated_at: new Date().toISOString()
            };
            set({ seoSettings: updatedSettings });
          }
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchSitemap: async () => {
        set({ sitemapLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockSitemap: SitemapItem[] = [
            {
              url: 'https://example.com/',
              lastmod: '2024-01-15T10:00:00Z',
              changefreq: 'daily',
              priority: 1.0,
              type: 'page'
            },
            {
              url: 'https://example.com/products',
              lastmod: '2024-01-15T09:00:00Z',
              changefreq: 'daily',
              priority: 0.9,
              type: 'page'
            }
          ];
          set({ sitemapItems: mockSitemap, sitemapLoading: false });
        } catch (error) {
          set({ sitemapLoading: false });
        }
      },

      generateSitemap: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          // 模拟生成网站地图
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchSEOAnalysis: async (url) => {
        set({ seoAnalysisLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockReport: SEOAnalysisReport = {
            url: url || 'https://example.com/',
            score: 85,
            issues: [
              {
                type: 'warning',
                category: 'meta',
                message: 'Meta description 长度超过建议值',
                suggestion: '建议将 meta description 控制在 150-160 字符内',
                priority: 'medium'
              }
            ],
            recommendations: [
              {
                category: 'content',
                title: '优化标题标签',
                description: '使用更具描述性的 H1 标签',
                priority: 'high',
                impact: 'high'
              }
            ],
            metrics: {
              page_speed: 92,
              mobile_friendly: true,
              ssl_enabled: true,
              meta_title_length: 45,
              meta_description_length: 165,
              h1_count: 1,
              h2_count: 3,
              image_alt_missing: 2,
              internal_links: 15,
              external_links: 3
            },
            created_at: new Date().toISOString()
          };
          set({ seoAnalysisReport: mockReport, seoAnalysisLoading: false });
        } catch (error) {
          set({ seoAnalysisLoading: false });
        }
      },

      fetchKeywordAnalysis: async (keywords) => {
        set({ keywordAnalysisLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockAnalysis: KeywordAnalysis[] = [
            {
              keyword: '时尚购物',
              search_volume: 8900,
              competition: 'medium',
              difficulty: 65,
              cpc: 2.35,
              trend: 'stable',
              ranking_position: 12,
              ranking_url: 'https://example.com/products',
              opportunities: [
                '优化产品页面内容',
                '增加相关长尾关键词'
              ]
            }
          ];
          set({ keywordAnalysis: mockAnalysis, keywordAnalysisLoading: false });
        } catch (error) {
          set({ keywordAnalysisLoading: false });
        }
      },

      fetchContentTemplates: async () => {
        set({ contentTemplatesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockTemplates: ContentTemplate[] = [
            {
              id: '1',
              name: '产品介绍模板',
              description: '用于产品详细介绍的标准模板',
              content_type: 'article',
              template_content: '<h2>产品概述</h2>\n<p>{product_description}</p>\n<h2>产品特色</h2>\n<ul>\n<li>{feature_1}</li>\n<li>{feature_2}</li>\n</ul>',
              variables: ['product_description', 'feature_1', 'feature_2'],
              is_active: true,
              usage_count: 25,
              created_by: 'admin1',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ contentTemplates: mockTemplates, contentTemplatesLoading: false });
        } catch (error) {
          set({ contentTemplatesLoading: false });
        }
      },

      createContentTemplate: async (template) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newTemplate: ContentTemplate = {
            ...template,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const contentTemplates = [...get().contentTemplates, newTemplate];
          set({ contentTemplates });
          return newTemplate;
        } catch (error) {
          return null;
        }
      },

      updateContentTemplate: async (id, template) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentTemplates = get().contentTemplates.map(t => 
            t.id === id ? { ...t, ...template, updated_at: new Date().toISOString() } : t
          );
          set({ contentTemplates });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteContentTemplate: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const contentTemplates = get().contentTemplates.filter(t => t.id !== id);
          set({ contentTemplates });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchContentWorkflows: async () => {
        set({ contentWorkflowsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockWorkflows: ContentWorkflow[] = [
            {
              id: '1',
              name: '文章发布流程',
              description: '标准的文章审核和发布流程',
              steps: [
                {
                  id: 'draft',
                  name: '草稿',
                  description: '创建内容草稿',
                  order: 1,
                  required_roles: ['editor', 'admin'],
                  auto_transition: false
                },
                {
                  id: 'review',
                  name: '审核',
                  description: '内容审核',
                  order: 2,
                  required_roles: ['admin'],
                  auto_transition: false
                },
                {
                  id: 'published',
                  name: '已发布',
                  description: '内容已发布',
                  order: 3,
                  required_roles: ['admin'],
                  auto_transition: true
                }
              ],
              is_active: true,
              created_by: 'admin1',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ contentWorkflows: mockWorkflows, contentWorkflowsLoading: false });
        } catch (error) {
          set({ contentWorkflowsLoading: false });
        }
      },

      createContentWorkflow: async (workflow) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newWorkflow: ContentWorkflow = {
            ...workflow,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const contentWorkflows = [...get().contentWorkflows, newWorkflow];
          set({ contentWorkflows });
          return newWorkflow;
        } catch (error) {
          return null;
        }
      },

      updateContentWorkflow: async (id, workflow) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentWorkflows = get().contentWorkflows.map(w => 
            w.id === id ? { ...w, ...workflow, updated_at: new Date().toISOString() } : w
          );
          set({ contentWorkflows });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteContentWorkflow: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const contentWorkflows = get().contentWorkflows.filter(w => w.id !== id);
          set({ contentWorkflows });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchContentWorkflowInstances: async (contentId) => {
        set({ contentWorkflowInstancesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockInstances: ContentWorkflowInstance[] = [
            {
              id: '1',
              workflow_id: '1',
              content_id: contentId || '1',
              current_step: 'review',
              status: 'in_progress',
              assignee_id: 'admin1',
              assignee_name: '管理员',
              started_at: '2024-01-15T09:00:00Z',
              completed_at: null,
              notes: '等待审核',
              created_at: '2024-01-15T09:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ contentWorkflowInstances: mockInstances, contentWorkflowInstancesLoading: false });
        } catch (error) {
          set({ contentWorkflowInstancesLoading: false });
        }
      },

      createContentWorkflowInstance: async (instance) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newInstance: ContentWorkflowInstance = {
            ...instance,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const contentWorkflowInstances = [...get().contentWorkflowInstances, newInstance];
          set({ contentWorkflowInstances });
          return newInstance;
        } catch (error) {
          return null;
        }
      },

      updateContentWorkflowInstance: async (id, instance) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const contentWorkflowInstances = get().contentWorkflowInstances.map(i => 
            i.id === id ? { ...i, ...instance, updated_at: new Date().toISOString() } : i
          );
          set({ contentWorkflowInstances });
          return true;
        } catch (error) {
          return false;
        }
      },

      setContentFilters: (filters) => {
        set({ contentFilters: filters });
      },

      resetContentFilters: () => {
        set({
          contentFilters: {
            search: '',
            type: '',
            status: '',
            category_id: '',
            tag_id: '',
            author_id: '',
            start_date: '',
            end_date: '',
            sort_by: 'created_at',
            sort_order: 'desc',
            page: 1,
            limit: 20
          }
        });
      },

      initRichEditor: (config) => {
        const defaultConfig: RichEditorConfig = {
          toolbar: ['bold', 'italic', 'underline', 'link', 'image', 'list', 'quote'],
          plugins: ['link', 'image', 'table', 'code'],
          image_upload_enabled: true,
          max_image_size: 5 * 1024 * 1024, // 5MB
          allowed_image_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          auto_save_enabled: true,
          auto_save_interval: 30000, // 30 seconds
          spell_check_enabled: true,
          word_count_enabled: true,
          character_limit: 50000,
          paste_cleanup_enabled: true,
          link_validation_enabled: true,
          custom_styles: []
        };
        set({ richEditorConfig: { ...defaultConfig, ...config } });
      },

      updateContentPublishSettings: (settings) => {
        const currentSettings = get().contentPublishSettings;
        const updatedSettings: ContentPublishSettings = {
          ...currentSettings,
          ...settings
        };
        set({ contentPublishSettings: updatedSettings });
      },

      // 库存管理方法实现
      fetchInventoryItems: async (filters) => {
        set({ inventoryItemsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockInventoryItems: InventoryManagement[] = [
            {
              id: '1',
              product_id: '1',
              product_name: '时尚T恤',
              product_sku: 'TSH001',
              product_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20t-shirt%20product&image_size=square',
              category_id: '1',
              category_name: '服装',
              current_stock: 150,
              reserved_stock: 20,
              available_stock: 130,
              min_stock_threshold: 50,
              max_stock_threshold: 500,
              reorder_point: 75,
              reorder_quantity: 200,
              unit_cost: 25.00,
              total_value: 3750.00,
              warehouse_id: '1',
              warehouse_name: '主仓库',
              supplier_id: '1',
              supplier_name: '时尚供应商',
              last_updated: '2024-01-15T10:00:00Z',
              status: 'normal',
              notes: '热销商品，需要密切关注库存'
            },
            {
              id: '2',
              product_id: '2',
              product_name: '牛仔裤',
              product_sku: 'JNS002',
              product_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=denim%20jeans%20product&image_size=square',
              category_id: '1',
              category_name: '服装',
              current_stock: 30,
              reserved_stock: 5,
              available_stock: 25,
              min_stock_threshold: 40,
              max_stock_threshold: 300,
              reorder_point: 50,
              reorder_quantity: 150,
              unit_cost: 45.00,
              total_value: 1350.00,
              warehouse_id: '1',
              warehouse_name: '主仓库',
              supplier_id: '2',
              supplier_name: '牛仔供应商',
              last_updated: '2024-01-14T15:30:00Z',
              status: 'low_stock',
              notes: '库存偏低，需要补货'
            }
          ];
          
          let filteredItems = mockInventoryItems;
          if (filters) {
            if (filters.status) {
              filteredItems = filteredItems.filter(item => item.status === filters.status);
            }
            if (filters.category_id) {
              filteredItems = filteredItems.filter(item => item.category_id === filters.category_id);
            }
            if (filters.warehouse_id) {
              filteredItems = filteredItems.filter(item => item.warehouse_id === filters.warehouse_id);
            }
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              filteredItems = filteredItems.filter(item => 
                item.product_name.toLowerCase().includes(searchLower) ||
                item.product_sku.toLowerCase().includes(searchLower)
              );
            }
          }
          
          set({ inventoryItems: filteredItems, inventoryItemsLoading: false });
        } catch (error) {
          set({ inventoryItemsLoading: false });
        }
      },

      fetchInventoryStats: async () => {
        set({ inventoryStatsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockStats: InventoryStats = {
            total_products: 150,
            total_stock_value: 125000.00,
            low_stock_count: 15,
            out_of_stock_count: 3,
            normal_stock_count: 132,
            total_reserved: 250,
            total_available: 12750,
            avg_stock_level: 85,
            stock_turnover_rate: 4.2,
            reorder_needed_count: 8
          };
          set({ inventoryStats: mockStats, inventoryStatsLoading: false });
        } catch (error) {
          set({ inventoryStatsLoading: false });
        }
      },

      fetchInventoryItem: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const item = get().inventoryItems.find(i => i.id === id);
          set({ selectedInventoryItem: item || null });
          return item || null;
        } catch (error) {
          return null;
        }
      },

      updateInventoryItem: async (id, data) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const inventoryItems = get().inventoryItems.map(item => 
            item.id === id ? { ...item, ...data, last_updated: new Date().toISOString() } : item
          );
          set({ inventoryItems });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteInventoryItem: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const inventoryItems = get().inventoryItems.filter(item => item.id !== id);
          set({ inventoryItems });
          return true;
        } catch (error) {
          return false;
        }
      },

      batchUpdateInventory: async (items) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const inventoryItems = get().inventoryItems.map(item => {
            const updateItem = items.find(u => u.id === item.id);
            if (updateItem) {
              return {
                ...item,
                current_stock: updateItem.quantity,
                available_stock: updateItem.quantity - item.reserved_stock,
                last_updated: new Date().toISOString(),
                notes: updateItem.reason
              };
            }
            return item;
          });
          set({ inventoryItems });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 库存调整方法
      fetchStockAdjustments: async (filters) => {
        set({ stockAdjustmentsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockAdjustments: StockAdjustment[] = [
            {
              id: '1',
              product_id: '1',
              product_name: '时尚T恤',
              product_sku: 'TSH001',
              adjustment_type: 'increase',
              quantity_before: 120,
              quantity_after: 150,
              adjustment_quantity: 30,
              reason: '新货入库',
              notes: '供应商补货',
              created_by: 'admin1',
              created_by_name: '管理员',
              approved_by: 'admin1',
              approved_by_name: '管理员',
              status: 'approved',
              created_at: '2024-01-15T10:00:00Z',
              approved_at: '2024-01-15T10:30:00Z'
            }
          ];
          set({ stockAdjustments: mockAdjustments, stockAdjustmentsLoading: false });
        } catch (error) {
          set({ stockAdjustmentsLoading: false });
        }
      },

      createStockAdjustment: async (adjustment) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newAdjustment: StockAdjustment = {
            ...adjustment,
            id: Date.now().toString(),
            status: 'pending',
            created_at: new Date().toISOString()
          };
          const stockAdjustments = [...get().stockAdjustments, newAdjustment];
          set({ stockAdjustments });
          return newAdjustment;
        } catch (error) {
          return null;
        }
      },

      approveStockAdjustment: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const stockAdjustments = get().stockAdjustments.map(adj => 
            adj.id === id ? { 
              ...adj, 
              status: 'approved', 
              approved_at: new Date().toISOString(),
              approved_by: 'admin1',
              approved_by_name: '管理员'
            } : adj
          );
          set({ stockAdjustments });
          return true;
        } catch (error) {
          return false;
        }
      },

      rejectStockAdjustment: async (id, reason) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const stockAdjustments = get().stockAdjustments.map(adj => 
            adj.id === id ? { 
              ...adj, 
              status: 'rejected', 
              rejection_reason: reason,
              approved_at: new Date().toISOString(),
              approved_by: 'admin1',
              approved_by_name: '管理员'
            } : adj
          );
          set({ stockAdjustments });
          return true;
        } catch (error) {
          return false;
        }
      },

      initAdjustmentForm: (productId) => {
        const form: InventoryAdjustmentForm = {
          product_id: productId || '',
          adjustment_type: 'increase',
          adjustment_quantity: 0,
          reason: '',
          notes: ''
        };
        set({ inventoryAdjustmentForm: form });
      },

      updateAdjustmentForm: (field, value) => {
        const currentForm = get().inventoryAdjustmentForm;
        if (currentForm) {
          set({ 
            inventoryAdjustmentForm: { 
              ...currentForm, 
              [field]: value 
            } 
          });
        }
      },

      submitAdjustmentForm: async () => {
        const form = get().inventoryAdjustmentForm;
        if (!form) return false;

        set({ adjustmentFormLoading: true });
        try {
          const product = get().inventoryItems.find(p => p.id === form.product_id);
          if (!product) return false;

          const adjustmentData = {
            product_id: form.product_id,
            product_name: product.product_name,
            product_sku: product.product_sku,
            adjustment_type: form.adjustment_type,
            quantity_before: product.current_stock,
            quantity_after: form.adjustment_type === 'increase' 
              ? product.current_stock + form.adjustment_quantity
              : product.current_stock - form.adjustment_quantity,
            adjustment_quantity: form.adjustment_quantity,
            reason: form.reason,
            notes: form.notes,
            created_by: 'admin1',
            created_by_name: '管理员'
          };

          const result = await get().createStockAdjustment(adjustmentData);
          set({ adjustmentFormLoading: false });
          return !!result;
        } catch (error) {
          set({ adjustmentFormLoading: false });
          return false;
        }
      },

      // 库存预警方法
      fetchInventoryAlerts: async () => {
        set({ inventoryAlertsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockAlerts: StockAlert[] = [
            {
              id: '1',
              product_id: '2',
              product_name: '牛仔裤',
              product_sku: 'JNS002',
              alert_type: 'low_stock',
              current_stock: 30,
              threshold: 40,
              message: '库存低于预警阈值',
              severity: 'warning',
              is_read: false,
              created_at: '2024-01-15T08:00:00Z'
            }
          ];
          set({ inventoryAlerts: mockAlerts, inventoryAlertsLoading: false });
        } catch (error) {
          set({ inventoryAlertsLoading: false });
        }
      },

      fetchAlertRules: async () => {
        set({ alertRulesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockRules: InventoryAlertRule[] = [
            {
              id: '1',
              name: '低库存预警',
              description: '当商品库存低于最小阈值时发送预警',
              rule_type: 'low_stock',
              conditions: {
                threshold_type: 'percentage',
                threshold_value: 20,
                categories: [],
                products: []
              },
              actions: {
                email_notification: true,
                system_notification: true,
                auto_reorder: false
              },
              is_active: true,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ alertRules: mockRules, alertRulesLoading: false });
        } catch (error) {
          set({ alertRulesLoading: false });
        }
      },

      createAlertRule: async (rule) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newRule: InventoryAlertRule = {
            ...rule,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const alertRules = [...get().alertRules, newRule];
          set({ alertRules });
          return newRule;
        } catch (error) {
          return null;
        }
      },

      updateAlertRule: async (id, rule) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const alertRules = get().alertRules.map(r => 
            r.id === id ? { ...r, ...rule, updated_at: new Date().toISOString() } : r
          );
          set({ alertRules });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteAlertRule: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const alertRules = get().alertRules.filter(r => r.id !== id);
          set({ alertRules });
          return true;
        } catch (error) {
          return false;
        }
      },

      markAlertAsRead: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          const inventoryAlerts = get().inventoryAlerts.map(alert => 
            alert.id === id ? { ...alert, is_read: true } : alert
          );
          set({ inventoryAlerts });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchLowStockItems: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const lowStockItems = get().inventoryItems.filter(item => item.status === 'low_stock');
          set({ lowStockItems });
        } catch (error) {
          // Handle error
        }
      },

      fetchOutOfStockItems: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const outOfStockItems = get().inventoryItems.filter(item => item.status === 'out_of_stock');
          set({ outOfStockItems });
        } catch (error) {
          // Handle error
        }
      },

      // 供应商管理方法
      fetchSuppliers: async () => {
        set({ suppliersLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockSuppliers: Supplier[] = [
            {
              id: '1',
              name: '时尚供应商',
              code: 'SUP001',
              contact_person: '张经理',
              phone: '13800138001',
              email: 'zhang@fashion-supplier.com',
              address: '广州市天河区时尚大道123号',
              status: 'active',
              rating: 4.5,
              total_orders: 150,
              total_amount: 250000.00,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ suppliers: mockSuppliers, suppliersLoading: false });
        } catch (error) {
          set({ suppliersLoading: false });
        }
      },

      createSupplier: async (supplier) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newSupplier: Supplier = {
            ...supplier,
            id: Date.now().toString(),
            total_orders: 0,
            total_amount: 0,
            rating: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const suppliers = [...get().suppliers, newSupplier];
          set({ suppliers });
          return newSupplier;
        } catch (error) {
          return null;
        }
      },

      updateSupplier: async (id, supplier) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const suppliers = get().suppliers.map(s => 
            s.id === id ? { ...s, ...supplier, updated_at: new Date().toISOString() } : s
          );
          set({ suppliers });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteSupplier: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const suppliers = get().suppliers.filter(s => s.id !== id);
          set({ suppliers });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 仓库管理方法
      fetchWarehouses: async () => {
        set({ warehousesLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockWarehouses: Warehouse[] = [
            {
              id: '1',
              name: '主仓库',
              code: 'WH001',
              address: '深圳市南山区科技园南区',
              manager: '李经理',
              phone: '13900139001',
              email: 'li@warehouse.com',
              capacity: 10000,
              current_usage: 7500,
              status: 'active',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ warehouses: mockWarehouses, warehousesLoading: false });
        } catch (error) {
          set({ warehousesLoading: false });
        }
      },

      createWarehouse: async (warehouse) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newWarehouse: Warehouse = {
            ...warehouse,
            id: Date.now().toString(),
            current_usage: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const warehouses = [...get().warehouses, newWarehouse];
          set({ warehouses });
          return newWarehouse;
        } catch (error) {
          return null;
        }
      },

      updateWarehouse: async (id, warehouse) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const warehouses = get().warehouses.map(w => 
            w.id === id ? { ...w, ...warehouse, updated_at: new Date().toISOString() } : w
          );
          set({ warehouses });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteWarehouse: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const warehouses = get().warehouses.filter(w => w.id !== id);
          set({ warehouses });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 库存变动记录方法
      fetchStockMovements: async (filters) => {
        set({ stockMovementsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockMovements: StockMovement[] = [
            {
              id: '1',
              product_id: '1',
              product_name: '时尚T恤',
              product_sku: 'TSH001',
              movement_type: 'in',
              quantity: 30,
              reference_type: 'purchase',
              reference_id: 'PO001',
              warehouse_id: '1',
              warehouse_name: '主仓库',
              notes: '采购入库',
              created_by: 'admin1',
              created_by_name: '管理员',
              created_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ stockMovements: mockMovements, stockMovementsLoading: false });
        } catch (error) {
          set({ stockMovementsLoading: false });
        }
      },

      createStockMovement: async (movement) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const newMovement: StockMovement = {
            ...movement,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
          };
          const stockMovements = [...get().stockMovements, newMovement];
          set({ stockMovements });
          return newMovement;
        } catch (error) {
          return null;
        }
      },

      // 库存盘点方法
      fetchStockCounts: async () => {
        set({ stockCountsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockCounts: StockCount[] = [
            {
              id: '1',
              title: '2024年1月盘点',
              description: '月度例行盘点',
              warehouse_id: '1',
              warehouse_name: '主仓库',
              status: 'completed',
              total_items: 150,
              counted_items: 150,
              discrepancy_items: 5,
              created_by: 'admin1',
              created_by_name: '管理员',
              started_at: '2024-01-15T09:00:00Z',
              completed_at: '2024-01-15T17:00:00Z',
              created_at: '2024-01-15T08:00:00Z',
              updated_at: '2024-01-15T17:00:00Z'
            }
          ];
          set({ stockCounts: mockCounts, stockCountsLoading: false });
        } catch (error) {
          set({ stockCountsLoading: false });
        }
      },

      createStockCount: async (count) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newCount: StockCount = {
            ...count,
            id: Date.now().toString(),
            status: 'pending',
            total_items: 0,
            counted_items: 0,
            discrepancy_items: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const stockCounts = [...get().stockCounts, newCount];
          set({ stockCounts });
          return newCount;
        } catch (error) {
          return null;
        }
      },

      updateStockCount: async (id, count) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const stockCounts = get().stockCounts.map(c => 
            c.id === id ? { ...c, ...count, updated_at: new Date().toISOString() } : c
          );
          set({ stockCounts });
          return true;
        } catch (error) {
          return false;
        }
      },

      deleteStockCount: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const stockCounts = get().stockCounts.filter(c => c.id !== id);
          set({ stockCounts });
          return true;
        } catch (error) {
          return false;
        }
      },

      fetchStockCountDetails: async (countId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockDetails: StockCountDetail[] = [
            {
              id: '1',
              stock_count_id: countId,
              product_id: '1',
              product_name: '时尚T恤',
              product_sku: 'TSH001',
              system_quantity: 150,
              counted_quantity: 148,
              discrepancy: -2,
              status: 'counted',
              notes: '发现2件破损商品',
              counted_by: 'staff1',
              counted_by_name: '员工A',
              counted_at: '2024-01-15T14:30:00Z'
            }
          ];
          set({ stockCountDetails: mockDetails });
        } catch (error) {
          // Handle error
        }
      },

      updateStockCountDetail: async (id, detail) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const stockCountDetails = get().stockCountDetails.map(d => 
            d.id === id ? { ...d, ...detail } : d
          );
          set({ stockCountDetails });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 库存报表方法
      fetchInventoryReports: async (config) => {
        set({ inventoryReportsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const mockReports = [
            {
              id: '1',
              title: '库存汇总报表',
              type: 'summary',
              data: {
                total_value: 125000,
                total_items: 150,
                categories: [
                  { name: '服装', value: 85000, percentage: 68 },
                  { name: '配饰', value: 40000, percentage: 32 }
                ]
              },
              generated_at: new Date().toISOString()
            }
          ];
          set({ inventoryReports: mockReports, inventoryReportsLoading: false });
        } catch (error) {
          set({ inventoryReportsLoading: false });
        }
      },

      exportInventoryReport: async (config) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // 模拟导出功能
          return true;
        } catch (error) {
          return false;
        }
      },

      // 库存筛选和搜索方法
      updateInventoryFilters: (filters) => {
        const currentFilters = get().inventoryFilters;
        set({ inventoryFilters: { ...currentFilters, ...filters } });
      },

      resetInventoryFilters: () => {
        const defaultFilters: InventoryFilters = {
          search: '',
          status: '',
          category_id: '',
          warehouse_id: '',
          supplier_id: '',
          stock_level: '',
          sort_by: 'product_name',
          sort_order: 'asc',
          page: 1,
          limit: 20
        };
        set({ inventoryFilters: defaultFilters });
      },

      searchInventoryItems: async (keyword) => {
        const filters = { ...get().inventoryFilters, search: keyword };
        await get().fetchInventoryItems(filters);
      },

      // ==================== 支付管理状态 ====================
      paymentManagementStats: null as PaymentStats | null,
      paymentManagementStatsLoading: false,
      paymentConfigs: [] as PaymentConfig[],
      paymentConfigsLoading: false,
      refundRequests: [] as RefundRequest[],
      refundRequestsLoading: false,
      paymentAnalytics: null as PaymentAnalytics | null,
      paymentAnalyticsLoading: false,
      paymentRiskAssessments: [] as PaymentRiskAssessment[],
      paymentAuditLogs: [] as PaymentAuditLog[],
      paymentWebhooks: [] as PaymentWebhook[],
      paymentReportConfigs: [] as PaymentReportConfig[],
      paymentLimitRules: [] as PaymentLimitRule[],
      paymentReconciliations: [] as PaymentReconciliation[],

      // ==================== 支付管理方法 ====================
      
      // 获取支付统计信息
      fetchPaymentStats: async (filters?: PaymentManagementFilters) => {
        set({ paymentManagementStatsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockStats: PaymentStats = {
            total_payments: 1250,
            successful_payments: 1180,
            failed_payments: 45,
            pending_payments: 25,
            refunded_payments: 85,
            total_amount: 125000.00,
            successful_amount: 118000.00,
            refunded_amount: 8500.00,
            success_rate: 94.4,
            refund_rate: 6.8,
            average_payment_amount: 100.00,
            payment_growth_rate: 12.5,
            revenue_growth_rate: 15.2,
            top_payment_methods: [
              { method: '支付宝', count: 520, amount: 52000.00, percentage: 44.1 },
              { method: '微信支付', count: 380, amount: 38000.00, percentage: 32.2 },
              { method: '银行卡', count: 200, amount: 20000.00, percentage: 16.9 },
              { method: '余额支付', count: 80, amount: 8000.00, percentage: 6.8 }
            ],
            daily_stats: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              payments: Math.floor(Math.random() * 50) + 20,
              amount: Math.floor(Math.random() * 5000) + 2000,
              success_rate: Math.floor(Math.random() * 10) + 90
            })),
            monthly_stats: Array.from({ length: 12 }, (_, i) => ({
              month: new Date(2024, i, 1).toISOString().split('T')[0].substring(0, 7),
              payments: Math.floor(Math.random() * 500) + 800,
              amount: Math.floor(Math.random() * 50000) + 80000,
              success_rate: Math.floor(Math.random() * 5) + 92
            })),
            hourly_distribution: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              payments: Math.floor(Math.random() * 30) + 10,
              amount: Math.floor(Math.random() * 3000) + 1000
            }))
          };
          set({ paymentManagementStats: mockStats, paymentManagementStatsLoading: false });
        } catch (error) {
          set({ paymentManagementStatsLoading: false });
        }
      },

      // 获取支付配置
      fetchPaymentConfigs: async () => {
        set({ paymentConfigsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const mockConfigs: PaymentConfig[] = [
            {
              id: '1',
              method: 'alipay',
              name: '支付宝',
              description: '支付宝在线支付',
              is_enabled: true,
              is_test_mode: false,
              gateway_config: {
                app_id: 'app_id_placeholder',
                merchant_id: 'merchant_id_placeholder',
                callback_url: 'https://example.com/callback/alipay',
                webhook_url: 'https://example.com/webhook/alipay'
              },
              fee_config: {
                type: 'percentage',
                percentage_fee: 0.6,
                min_fee: 0.01,
                max_fee: 1000
              },
              limits: {
                min_amount: 0.01,
                max_amount: 50000,
                daily_limit: 100000,
                monthly_limit: 1000000
              },
              risk_settings: {
                enable_risk_check: true,
                max_failed_attempts: 3,
                block_duration_minutes: 30,
                require_verification_above: 1000
              },
              supported_currencies: ['CNY'],
              supported_countries: ['CN'],
              processing_time_minutes: 5,
              refund_policy: {
                auto_refund_enabled: true,
                refund_window_days: 180,
                partial_refund_allowed: true
              },
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              method: 'wechat',
              name: '微信支付',
              description: '微信在线支付',
              is_enabled: true,
              is_test_mode: false,
              gateway_config: {
                app_id: 'wechat_app_id_placeholder',
                merchant_id: 'wechat_merchant_id_placeholder',
                callback_url: 'https://example.com/callback/wechat',
                webhook_url: 'https://example.com/webhook/wechat'
              },
              fee_config: {
                type: 'percentage',
                percentage_fee: 0.6,
                min_fee: 0.01,
                max_fee: 1000
              },
              limits: {
                min_amount: 0.01,
                max_amount: 50000,
                daily_limit: 100000,
                monthly_limit: 1000000
              },
              risk_settings: {
                enable_risk_check: true,
                max_failed_attempts: 3,
                block_duration_minutes: 30,
                require_verification_above: 1000
              },
              supported_currencies: ['CNY'],
              supported_countries: ['CN'],
              processing_time_minutes: 5,
              refund_policy: {
                auto_refund_enabled: true,
                refund_window_days: 180,
                partial_refund_allowed: true
              },
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            }
          ];
          set({ paymentConfigs: mockConfigs, paymentConfigsLoading: false });
        } catch (error) {
          set({ paymentConfigsLoading: false });
        }
      },

      // 更新支付配置
      updatePaymentConfig: async (id: string, config: Partial<PaymentConfig>) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const paymentConfigs = get().paymentConfigs.map(c => 
            c.id === id ? { ...c, ...config, updated_at: new Date().toISOString() } : c
          );
          set({ paymentConfigs });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 获取退款请求
      fetchRefundRequests: async (filters?: { status?: RefundRequest['status']; priority?: RefundRequest['priority'] }) => {
        set({ refundRequestsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockRefunds: RefundRequest[] = [
            {
              id: '1',
              payment_id: 'pay_001',
              order_id: 'ord_001',
              customer_id: 'cust_001',
              refund_type: 'full',
              requested_amount: 299.00,
              reason: '商品质量问题',
              reason_category: 'product_defect',
              status: 'pending',
              priority: 'high',
              requested_by: 'customer',
              customer_notes: '收到的商品有明显瑕疵，要求全额退款',
              refund_method: 'original_payment',
              created_at: '2024-01-15T10:00:00Z',
              updated_at: '2024-01-15T10:00:00Z'
            },
            {
              id: '2',
              payment_id: 'pay_002',
              order_id: 'ord_002',
              customer_id: 'cust_002',
              refund_type: 'partial',
              requested_amount: 50.00,
              approved_amount: 50.00,
              reason: '运费退款',
              reason_category: 'shipping_issue',
              status: 'approved',
              priority: 'medium',
              requested_by: 'customer',
              approved_by: 'admin_001',
              customer_notes: '商品延迟到货，申请运费退款',
              internal_notes: '确认物流延误，同意退还运费',
              refund_method: 'original_payment',
              created_at: '2024-01-14T15:30:00Z',
              updated_at: '2024-01-15T09:00:00Z',
              approved_at: '2024-01-15T09:00:00Z'
            }
          ];
          
          let filteredRefunds = mockRefunds;
          if (filters) {
            if (filters.status) {
              filteredRefunds = filteredRefunds.filter(r => r.status === filters.status);
            }
            if (filters.priority) {
              filteredRefunds = filteredRefunds.filter(r => r.priority === filters.priority);
            }
          }
          
          set({ refundRequests: filteredRefunds, refundRequestsLoading: false });
        } catch (error) {
          set({ refundRequestsLoading: false });
        }
      },

      // 处理退款请求
      processRefundRequest: async (id: string, action: 'approve' | 'reject', data?: { approved_amount?: number; internal_notes?: string }) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const refundRequests = get().refundRequests.map(r => {
            if (r.id === id) {
              const updates: Partial<RefundRequest> = {
                status: action === 'approve' ? 'approved' : 'rejected',
                updated_at: new Date().toISOString(),
                approved_by: 'admin_001'
              };
              
              if (action === 'approve') {
                updates.approved_amount = data?.approved_amount || r.requested_amount;
                updates.approved_at = new Date().toISOString();
              }
              
              if (data?.internal_notes) {
                updates.internal_notes = data.internal_notes;
              }
              
              return { ...r, ...updates };
            }
            return r;
          });
          set({ refundRequests });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 获取支付分析数据
      fetchPaymentAnalytics: async (dateRange?: { start_date: string; end_date: string }) => {
        set({ paymentAnalyticsLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const mockAnalytics: PaymentAnalytics = {
            overview: {
              total_transactions: 1250,
              total_volume: 125000.00,
              success_rate: 94.4,
              average_transaction_value: 100.00,
              growth_rate: 12.5
            },
            trends: {
              daily: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                transactions: Math.floor(Math.random() * 50) + 20,
                volume: Math.floor(Math.random() * 5000) + 2000,
                success_rate: Math.floor(Math.random() * 10) + 90
              })),
              weekly: Array.from({ length: 12 }, (_, i) => ({
                week: `2024-W${String(i + 1).padStart(2, '0')}`,
                transactions: Math.floor(Math.random() * 300) + 200,
                volume: Math.floor(Math.random() * 30000) + 20000,
                success_rate: Math.floor(Math.random() * 5) + 92
              })),
              monthly: Array.from({ length: 12 }, (_, i) => ({
                month: new Date(2024, i, 1).toISOString().split('T')[0].substring(0, 7),
                transactions: Math.floor(Math.random() * 500) + 800,
                volume: Math.floor(Math.random() * 50000) + 80000,
                success_rate: Math.floor(Math.random() * 5) + 92
              }))
            },
            payment_methods: [
              { method: '支付宝', transactions: 520, volume: 52000, success_rate: 95.2, average_value: 100, market_share: 44.1 },
              { method: '微信支付', transactions: 380, volume: 38000, success_rate: 94.8, average_value: 100, market_share: 32.2 },
              { method: '银行卡', transactions: 200, volume: 20000, success_rate: 92.5, average_value: 100, market_share: 16.9 },
              { method: '余额支付', transactions: 80, volume: 8000, success_rate: 98.8, average_value: 100, market_share: 6.8 }
            ],
            geographic_distribution: [
              { country: '中国', region: '广东', transactions: 350, volume: 35000, success_rate: 95.1 },
              { country: '中国', region: '北京', transactions: 280, volume: 28000, success_rate: 94.6 },
              { country: '中国', region: '上海', transactions: 250, volume: 25000, success_rate: 95.6 },
              { country: '中国', region: '江苏', transactions: 200, volume: 20000, success_rate: 93.8 }
            ],
            failure_analysis: [
              { reason: '余额不足', count: 15, percentage: 33.3, impact_amount: 1500 },
              { reason: '网络超时', count: 12, percentage: 26.7, impact_amount: 1200 },
              { reason: '银行卡过期', count: 8, percentage: 17.8, impact_amount: 800 },
              { reason: '密码错误', count: 6, percentage: 13.3, impact_amount: 600 },
              { reason: '其他', count: 4, percentage: 8.9, impact_amount: 400 }
            ],
            customer_segments: [
              { segment: 'VIP客户', customers: 50, transactions: 300, volume: 45000, average_value: 150 },
              { segment: '普通客户', customers: 800, transactions: 800, volume: 60000, average_value: 75 },
              { segment: '新客户', customers: 200, transactions: 150, volume: 20000, average_value: 133 }
            ],
            risk_metrics: {
              high_risk_transactions: 25,
              fraud_detected: 3,
              chargebacks: 2,
              dispute_rate: 0.16
            }
          };
          set({ paymentAnalytics: mockAnalytics, paymentAnalyticsLoading: false });
        } catch (error) {
          set({ paymentAnalyticsLoading: false });
        }
      },

      // 创建支付风险评估
      createPaymentRiskAssessment: async (assessment: Omit<PaymentRiskAssessment, 'id' | 'created_at' | 'updated_at'>) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newAssessment: PaymentRiskAssessment = {
            ...assessment,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const paymentRiskAssessments = [...get().paymentRiskAssessments, newAssessment];
          set({ paymentRiskAssessments });
          return newAssessment;
        } catch (error) {
          return null;
        }
      },

      // 记录支付审计日志
      logPaymentAudit: async (log: Omit<PaymentAuditLog, 'id' | 'created_at'>) => {
        try {
          const newLog: PaymentAuditLog = {
            ...log,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
          };
          const paymentAuditLogs = [...get().paymentAuditLogs, newLog];
          set({ paymentAuditLogs });
          return newLog;
        } catch (error) {
          return null;
        }
      },

      // 处理支付Webhook
      processPaymentWebhook: async (webhook: Omit<PaymentWebhook, 'id' | 'created_at'>) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const newWebhook: PaymentWebhook = {
            ...webhook,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
          };
          const paymentWebhooks = [...get().paymentWebhooks, newWebhook];
          set({ paymentWebhooks });
          return newWebhook;
        } catch (error) {
          return null;
        }
      },

      // 导出支付报表
      exportPaymentReport: async (config: PaymentReportConfig) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          // 模拟生成报表文件
          const reportData = {
            config,
            generated_at: new Date().toISOString(),
            file_url: `/reports/payment_report_${Date.now()}.${config.format}`
          };
          return reportData;
        } catch (error) {
          return null;
        }
      },

      // 创建支付限额规则
      createPaymentLimitRule: async (rule: Omit<PaymentLimitRule, 'id' | 'created_at' | 'updated_at'>) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const newRule: PaymentLimitRule = {
            ...rule,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          const paymentLimitRules = [...get().paymentLimitRules, newRule];
          set({ paymentLimitRules });
          return newRule;
        } catch (error) {
          return null;
        }
      },

      // 更新支付限额规则
      updatePaymentLimitRule: async (id: string, rule: Partial<PaymentLimitRule>) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const paymentLimitRules = get().paymentLimitRules.map(r => 
            r.id === id ? { ...r, ...rule, updated_at: new Date().toISOString() } : r
          );
          set({ paymentLimitRules });
          return true;
        } catch (error) {
          return false;
        }
      },

      // 执行支付对账
      performPaymentReconciliation: async (reconciliation: Omit<PaymentReconciliation, 'id' | 'created_at'>) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          const newReconciliation: PaymentReconciliation = {
            ...reconciliation,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
          };
          const paymentReconciliations = [...get().paymentReconciliations, newReconciliation];
          set({ paymentReconciliations });
          return newReconciliation;
        } catch (error) {
          return null;
        }
      }
    }),
    {
      name: 'jade-shopping-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        favorites: state.favorites,
        userAddresses: state.userAddresses,
        selectedAddress: state.selectedAddress,
        paymentMethods: state.paymentMethods,
        selectedPaymentMethod: state.selectedPaymentMethod,
        orders: state.orders,
        paymentVouchers: state.paymentVouchers,
        transactionLogs: state.transactionLogs,
        notifications: state.notifications,
        admin: state.admin,
        isAdminAuthenticated: state.isAdminAuthenticated
      })
    }
  )
);