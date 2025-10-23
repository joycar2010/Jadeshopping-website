import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { 
  Search, 
  Package, 
  Eye, 
  Truck, 
  X, 
  CheckCircle, 
  RotateCcw, 
  ShoppingCart,
  Clock,
  CreditCard,
  Star,
  RefreshCw,
  User,
  Wallet,
  Heart,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Filter,
  MapPin,
  Phone,
  Mail,
  Shield,
  Gift,
  Award,
  Bell,
  Menu
} from 'lucide-react';

// 订单状态枚举
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing', 
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// 订单接口
interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
}

const Orders: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('orders');
  const [expandedNavItems, setExpandedNavItems] = useState<string[]>(['orders']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 检查用户登录状态
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 初始化URL参数
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['all', 'unpaid', 'processing', 'shipped', 'review', 'return'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // 模拟订单数据
  const mockOrders: Order[] = [
    {
      id: 'ORD-2024-001',
      items: [
        {
          id: '1',
          name: '和田玉平安扣吊坠',
          image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20jade%20pendant%20peace%20buckle%20white%20background&image_size=square',
          price: 299,
          quantity: 1
        }
      ],
      totalAmount: 299,
      status: OrderStatus.DELIVERED,
      createdAt: '2024-01-15T10:30:00Z',
      shippingAddress: {
        name: '张三',
        phone: '138****8888',
        address: '北京市朝阳区建国路88号'
      }
    },
    {
      id: 'ORD-2024-002',
      items: [
        {
          id: '2',
          name: '翡翠手镯 冰种',
          image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20jade%20bracelet%20ice%20type%20green%20white%20background&image_size=square',
          price: 1299,
          quantity: 1
        }
      ],
      totalAmount: 1299,
      status: OrderStatus.SHIPPED,
      createdAt: '2024-01-14T15:20:00Z',
      shippingAddress: {
        name: '李四',
        phone: '139****9999',
        address: '上海市浦东新区陆家嘴金融中心'
      }
    }
  ];

  // 订单状态标签配置
  const tabs = [
    { key: 'all', label: 'All orders', count: mockOrders.length },
    { key: 'unpaid', label: 'Unpaid', count: mockOrders.filter(o => o.status === OrderStatus.PENDING).length },
    { key: 'processing', label: 'Processing', count: mockOrders.filter(o => o.status === OrderStatus.PROCESSING).length },
    { key: 'shipped', label: 'Shipped', count: mockOrders.filter(o => o.status === OrderStatus.SHIPPED).length },
    { key: 'review', label: 'Review', count: mockOrders.filter(o => o.status === OrderStatus.DELIVERED).length },
    { key: 'return', label: 'Return', count: mockOrders.filter(o => o.status === OrderStatus.REFUNDED).length }
  ];

  // 左侧导航配置
  const navigationItems = [
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      items: [
        { id: 'profile', title: '个人资料', link: '/settings' },
        { id: 'address', title: '地址簿', link: '/address' }
      ]
    },
    {
      id: 'assets',
      title: 'My Assets',
      icon: Wallet,
      items: [
        { id: 'coupons', title: '我的优惠券', link: '/settings' },
        { id: 'points', title: '我的积分', link: '/settings' },
        { id: 'wallet', title: '我的钱包', link: '/settings' },
        { id: 'gift-cards', title: '礼品卡', link: '/settings' }
      ]
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: Package,
      items: [
        { id: 'all-orders', title: '所有订单', link: '/orders', active: activeTab === 'all' },
        { id: 'unpaid-orders', title: '待付款订单', link: '/orders?tab=unpaid', active: activeTab === 'unpaid' },
        { id: 'processing-orders', title: '处理中订单', link: '/orders?tab=processing', active: activeTab === 'processing' },
        { id: 'shipped-orders', title: '已发货订单', link: '/orders?tab=shipped', active: activeTab === 'shipped' },
        { id: 'review-orders', title: '待评价订单', link: '/orders?tab=review', active: activeTab === 'review' },
        { id: 'return-orders', title: '退货订单', link: '/orders?tab=return', active: activeTab === 'return' }
      ]
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      icon: Heart,
      items: [
        { id: 'wishlist', title: '心愿单', link: '/favorites' },
        { id: 'recently-viewed', title: '最近浏览', link: '/settings' },
        { id: 'following', title: '关注', link: '/settings' }
      ]
    },
    {
      id: 'service',
      title: 'Customer Service',
      icon: HelpCircle,
      items: [
        { id: 'help-center', title: '帮助中心', link: '/help' },
        { id: 'contact-us', title: '联系我们', link: '/contact' },
        { id: 'live-chat', title: '在线客服', link: '/chat' }
      ]
    },
    {
      id: 'other',
      title: 'Other Services',
      icon: Settings,
      items: [

        { id: 'survey', title: '调查中心', link: '/survey' },
        { id: 'feedback', title: '意见反馈', link: '/feedback' }
      ]
    },
    {
      id: 'policy',
      title: 'Policy',
      icon: Shield,
      items: [
        { id: 'shipping', title: '配送政策', link: '/policy/shipping' },
        { id: 'return', title: '退货政策', link: '/policy/return' },
        { id: 'privacy', title: '隐私政策', link: '/policy/privacy' },
        { id: 'terms', title: '服务条款', link: '/policy/terms' }
      ]
    }
  ];

  // 获取订单状态信息
  const getStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      [OrderStatus.PENDING]: { label: '待付款', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [OrderStatus.PROCESSING]: { label: '处理中', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      [OrderStatus.SHIPPED]: { label: '已发货', color: 'bg-purple-100 text-purple-800', icon: Truck },
      [OrderStatus.DELIVERED]: { label: '已送达', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [OrderStatus.CANCELLED]: { label: '已取消', color: 'bg-gray-100 text-gray-800', icon: X },
      [OrderStatus.REFUNDED]: { label: '已退款', color: 'bg-red-100 text-red-800', icon: RotateCcw }
    };
    return statusMap[status];
  };

  // 格式化价格
  const formatPrice = (price: number) => `¥${price.toFixed(2)}`;

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 筛选订单
  const filteredOrders = mockOrders.filter(order => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unpaid' && order.status === OrderStatus.PENDING) ||
      (activeTab === 'processing' && order.status === OrderStatus.PROCESSING) ||
      (activeTab === 'shipped' && order.status === OrderStatus.SHIPPED) ||
      (activeTab === 'review' && order.status === OrderStatus.DELIVERED) ||
      (activeTab === 'return' && order.status === OrderStatus.REFUNDED);

    const matchesSearch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // 处理订单操作
  const handleOrderAction = (order: Order, action: string) => {
    console.log(`处理订单 ${order.id} 的 ${action} 操作`);
  };

  // 切换导航项展开状态
  const toggleNavItem = (itemId: string) => {
    setExpandedNavItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 处理订单状态切换
  const handleTabChange = async (tabKey: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setActiveTab(tabKey);
      
      // 更新URL参数
      if (tabKey === 'all') {
        setSearchParams({});
      } else {
        setSearchParams({ tab: tabKey });
      }
    } catch (err) {
      setError('加载订单数据失败，请重试');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 订单详情模态框
  const OrderDetailModal = () => (
    showOrderDetail && selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowOrderDetail(false)}>
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">订单详情</h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* 订单信息 */}
            <div>
              <h4 className="font-semibold mb-3">订单信息</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">订单号:</span>
                  <span className="font-medium">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">下单时间:</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">订单状态:</span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>
              </div>
            </div>

            {/* 收货地址 */}
            <div>
              <h4 className="font-semibold mb-3">收货地址</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{selectedOrder.shippingAddress.name}</span>
                  <span className="text-gray-600">{selectedOrder.shippingAddress.phone}</span>
                </div>
                <p className="text-gray-700 ml-6">{selectedOrder.shippingAddress.address}</p>
              </div>
            </div>

            {/* 商品列表 */}
            <div>
              <h4 className="font-semibold mb-3">商品清单</h4>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600">数量: {item.quantity}</span>
                        <span className="font-semibold text-red-500">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 费用明细 */}
            <div>
              <h4 className="font-semibold mb-3">费用明细</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总价:</span>
                  <span>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运费:</span>
                  <span>免费</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>实付金额:</span>
                  <span className="text-red-500">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // 物流跟踪模态框
  const TrackingModal = () => (
    showTrackingModal && selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowTrackingModal(false)}>
        <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Package Tracking</h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">商品已送达</div>
                  <div className="text-sm text-gray-600">2024-01-15 14:30</div>
                  <div className="text-sm text-gray-500">您的包裹已由本人签收，感谢您的信任</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">正在派送</div>
                  <div className="text-sm text-gray-600">2024-01-15 08:00</div>
                  <div className="text-sm text-gray-500">快递员正在为您派送，请保持电话畅通</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">运输中</div>
                  <div className="text-sm text-gray-600">2024-01-14 16:20</div>
                  <div className="text-sm text-gray-500">您的包裹正在运输途中</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">已发货</div>
                  <div className="text-sm text-gray-600">2024-01-13 10:15</div>
                  <div className="text-sm text-gray-500">商品已从仓库发出</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 页头 Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex">
        {/* 左侧导航栏 */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {!sidebarCollapsed && (
            <nav className="px-4 pb-4">
              <div className="space-y-2">
                {navigationItems.map((section) => {
                  const SectionIcon = section.icon;
                  const isExpanded = expandedNavItems.includes(section.id);
                  
                  return (
                    <div key={section.id} className="space-y-1">
                      <button
                        onClick={() => toggleNavItem(section.id)}
                        className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <SectionIcon className="h-5 w-5" />
                          <span className="font-medium">{section.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-8 space-y-1">
                          {section.items.map((item) => {
                            // 如果是订单相关链接，使用自定义点击处理
                            if (section.id === 'orders' && item.link.includes('/orders')) {
                              const tabKey = item.link.includes('?tab=') 
                                ? item.link.split('?tab=')[1] 
                                : 'all';
                              
                              return (
                                <a
                                  key={item.id}
                                  href={item.link}
                                  onClick={(e) => handleTabChange(tabKey, e)}
                                  className={`block p-2 text-sm rounded-lg transition-colors cursor-pointer ${
                                    item.active 
                                      ? 'bg-black text-white' 
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  {item.title}
                                </a>
                              );
                            }
                            
                            // 其他链接保持原有的Link组件
                            return (
                              <Link
                                key={item.id}
                                to={item.link}
                                className={`block p-2 text-sm rounded-lg transition-colors ${
                                  item.active 
                                    ? 'bg-black text-white' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {item.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* 退出登录 */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          )}
        </aside>

        {/* 右侧主内容区 */}
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* 页面标题和包裹追踪 */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/orders/packages" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Package</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/orders/deleted" 
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Deleted Orders History
                </Link>
              </div>
            </div>

            {/* 订单状态筛选标签 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                        activeTab === tab.key
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading && activeTab === tab.key && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <span className={isLoading && activeTab === tab.key ? 'opacity-0' : ''}>
                        {tab.label}
                        {tab.count > 0 && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === tab.key ? 'bg-white text-black' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                
                {/* 搜索图标 */}
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="搜索订单号或商品名称..."
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 订单列表或空状态 */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  It is empty here :-(
                </h3>
                <p className="text-gray-500 mb-8">
                  {searchTerm ? '未找到相关订单，请尝试其他搜索关键词' : '您还没有任何订单，快去挑选您喜欢的商品吧！'}
                </p>
                
                {/* 自助查询订单 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Can't find your order?</h4>
                  <p className="text-gray-600 mb-4">Self-service to find order</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      通过邮箱查找
                    </button>
                    <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      通过手机号查找
                    </button>
                    <button className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      联系客服
                    </button>
                  </div>
                </div>
                
                <Link 
                  to="/products" 
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  去购物
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      {/* 订单头部 */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            订单号: {order.id}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-5 w-5" />
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* 商品列表 */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {item.name}
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  数量: {item.quantity}
                                </span>
                                <span className="font-semibold text-red-500">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 订单底部 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-lg font-semibold">
                          总计: <span className="text-red-500">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>查看详情</span>
                          </button>
                          
                          {order.status === OrderStatus.SHIPPED && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowTrackingModal(true);
                              }}
                              className="flex items-center space-x-1 px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Truck className="h-4 w-4" />
                              <span>查看物流</span>
                            </button>
                          )}
                          
                          {order.status === OrderStatus.PENDING && (
                            <button
                              onClick={() => handleOrderAction(order, 'cancel')}
                              className="flex items-center space-x-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <X className="h-4 w-4" />
                              <span>取消订单</span>
                            </button>
                          )}
                          
                          {order.status === OrderStatus.SHIPPED && (
                            <button
                              onClick={() => handleOrderAction(order, 'confirm')}
                              className="flex items-center space-x-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>确认收货</span>
                            </button>
                          )}
                          
                          {order.status === OrderStatus.DELIVERED && (
                            <>
                              <button
                                onClick={() => handleOrderAction(order, 'refund')}
                                className="flex items-center space-x-1 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                              >
                                <RotateCcw className="h-4 w-4" />
                                <span>申请退款</span>
                              </button>
                              <button
                                onClick={() => handleOrderAction(order, 'rebuy')}
                                className="flex items-center space-x-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                <span>再次购买</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 模态框 */}
      <OrderDetailModal />
      <TrackingModal />
    </div>
  );
};

export default Orders;