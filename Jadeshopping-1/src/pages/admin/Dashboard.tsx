import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Star
} from 'lucide-react';
import type { DashboardStats } from '@/types';

// 统计卡片组件
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50'
  };

  const [bgColor, textColor, lightBg] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${lightBg}`}>
          <div className={`w-6 h-6 ${textColor}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// 快速操作卡片组件
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 text-left w-full"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <div className="w-6 h-6 text-white">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
};

// 最近活动项组件
interface ActivityItemProps {
  type: 'order' | 'user' | 'product' | 'payment';
  title: string;
  description: string;
  time: string;
  status?: 'success' | 'warning' | 'error';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, title, description, time, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getStatusColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { 
    dashboardStats, 
    dashboardLoading, 
    fetchDashboardStats,
    quickActions,
    fetchQuickActions
  } = useStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchQuickActions();
  }, [fetchDashboardStats, fetchQuickActions]);

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // 如果没有数据，使用默认值
  const stats = dashboardStats && dashboardStats.users && dashboardStats.products && dashboardStats.orders && dashboardStats.payments ? {
    totalUsers: dashboardStats.users.total,
    totalProducts: dashboardStats.products.total,
    totalOrders: dashboardStats.orders.total,
    totalRevenue: dashboardStats.payments.total_revenue,
    monthlyGrowth: {
      users: dashboardStats.users.growth_rate,
      products: 0, // 产品增长率在接口中没有定义，使用0
      orders: dashboardStats.orders.growth_rate,
      revenue: 0 // 收入增长率在接口中没有定义，使用0
    },
    recentOrders: dashboardStats.users.new_today, // 使用新用户数作为最近订单数
    pendingOrders: dashboardStats.orders.pending,
    completedOrders: dashboardStats.orders.completed,
    lowStockProducts: dashboardStats.products.low_stock
  } : {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: {
      users: 0,
      products: 0,
      orders: 0,
      revenue: 0
    },
    recentOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0
  };

  // 模拟最近活动数据
  const recentActivities = [
    {
      type: 'order' as const,
      title: '新订单 #12345',
      description: '用户张三下单购买翡翠手镯',
      time: '5分钟前',
      status: 'success' as const
    },
    {
      type: 'user' as const,
      title: '新用户注册',
      description: '用户李四完成注册',
      time: '15分钟前',
      status: 'success' as const
    },
    {
      type: 'product' as const,
      title: '库存预警',
      description: '翡翠项链库存不足10件',
      time: '30分钟前',
      status: 'warning' as const
    },
    {
      type: 'payment' as const,
      title: '支付完成',
      description: '订单 #12344 支付成功',
      time: '1小时前',
      status: 'success' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600">欢迎回来，管理员</p>
        </div>
        <div className="text-sm text-gray-500">
          最后更新: {new Date().toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="总用户数"
          value={stats.totalUsers.toLocaleString()}
          change={stats.monthlyGrowth.users}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="总商品数"
          value={stats.totalProducts.toLocaleString()}
          change={stats.monthlyGrowth.products}
          icon={<Package className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="总订单数"
          value={stats.totalOrders.toLocaleString()}
          change={stats.monthlyGrowth.orders}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="yellow"
        />
        <StatsCard
          title="总收入"
          value={`¥${stats.totalRevenue.toLocaleString()}`}
          change={stats.monthlyGrowth.revenue}
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* 订单状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">待处理订单</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <p className="text-sm text-gray-600 mt-2">需要及时处理</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">已完成订单</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
          <p className="text-sm text-gray-600 mt-2">本月完成</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">库存预警</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
          <p className="text-sm text-gray-600 mt-2">商品库存不足</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
          <div className="space-y-3">
            <QuickActionCard
              title="添加新商品"
              description="快速添加新的翡翠商品"
              icon={<Package className="w-6 h-6" />}
              onClick={() => window.location.href = '/admin/products/new'}
              color="bg-emerald-500"
            />
            <QuickActionCard
              title="查看订单"
              description="管理和处理客户订单"
              icon={<ShoppingCart className="w-6 h-6" />}
              onClick={() => window.location.href = '/admin/orders'}
              color="bg-blue-500"
            />
            <QuickActionCard
              title="用户管理"
              description="查看和管理用户账户"
              icon={<Users className="w-6 h-6" />}
              onClick={() => window.location.href = '/admin/users'}
              color="bg-purple-500"
            />
            <QuickActionCard
              title="库存管理"
              description="检查和更新商品库存"
              icon={<AlertTriangle className="w-6 h-6" />}
              onClick={() => window.location.href = '/admin/inventory'}
              color="bg-yellow-500"
            />
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                type={activity.type}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                status={activity.status}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 性能指标 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">本月关键指标</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12.5K</p>
            <p className="text-sm text-gray-600">页面浏览量</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3.2%</p>
            <p className="text-sm text-gray-600">转化率</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">平均评分</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">89%</p>
            <p className="text-sm text-gray-600">客户满意度</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;