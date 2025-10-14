import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../hooks/useToast'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Globe,
  Zap,
  Target,
  Award,
  Percent,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Treemap
} from 'recharts'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  userGrowth: number
  orderGrowth: number
  revenueGrowth: number
}

interface RecentOrder {
  id: string
  user_name: string
  total_amount: number
  status: string
  created_at: string
}

interface LowStockProduct {
  id: string
  name: string
  stock_quantity: number
  min_stock_level: number
}

interface SalesData {
  date: string
  sales: number
  orders: number
  revenue: number
}

interface OrderStatusData {
  name: string
  value: number
  color: string
}

interface UserGrowthData {
  month: string
  users: number
  newUsers: number
}

interface PerformanceMetric {
  name: string
  value: number
  target: number
  color: string
}

interface CategorySalesData {
  name: string
  value: number
  children?: { name: string; value: number }[]
}

interface RealTimeData {
  activeUsers: number
  onlineOrders: number
  serverLoad: number
  responseTime: number
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    userGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([])
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [categorySalesData, setCategorySalesData] = useState<CategorySalesData[]>([])
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    activeUsers: 0,
    onlineOrders: 0,
    serverLoad: 0,
    responseTime: 0
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const { showToast } = useToast()

  useEffect(() => {
    fetchDashboardData()
    
    // 设置实时数据更新
    const realTimeInterval = setInterval(fetchRealTimeData, 30000) // 每30秒更新一次
    
    return () => {
      clearInterval(realTimeInterval)
    }
  }, [dateRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchStats(),
        fetchRecentOrders(),
        fetchLowStockProducts(),
        fetchSalesData(),
        fetchOrderStatusData(),
        fetchUserGrowthData(),
        fetchPerformanceMetrics(),
        fetchCategorySalesData(),
        fetchRealTimeData()
      ])
    } catch (error) {
      console.error('获取仪表板数据失败:', error)
      showToast('error', '获取仪表板数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    // 获取用户总数
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 获取商品总数
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // 获取订单总数
    const { count: orderCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // 获取总收入
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    // 计算增长率（模拟数据）
    const userGrowth = Math.floor(Math.random() * 20) + 5
    const orderGrowth = Math.floor(Math.random() * 15) + 3
    const revenueGrowth = Math.floor(Math.random() * 25) + 8

    setStats({
      totalUsers: userCount || 0,
      totalProducts: productCount || 0,
      totalOrders: orderCount || 0,
      totalRevenue,
      userGrowth,
      orderGrowth,
      revenueGrowth
    })
  }

  const fetchRecentOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        users (
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    const formattedOrders = data?.map(order => ({
      id: order.id,
      user_name: order.users?.full_name || '未知用户',
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at
    })) || []

    setRecentOrders(formattedOrders)
  }

  const fetchLowStockProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .lt('stock_quantity', 10)
      .order('stock_quantity', { ascending: true })
      .limit(5)

    if (error) throw error

    const formattedProducts = data?.map(product => ({
      id: product.id,
      name: product.name,
      stock_quantity: product.stock_quantity,
      min_stock_level: 10
    })) || []

    setLowStockProducts(formattedProducts)
  }

  const fetchSalesData = async () => {
    // 生成最近7天或30天的销售数据
    const days = dateRange === '7d' ? 7 : 30
    const salesData: SalesData[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // 模拟数据，实际应该从数据库查询
      salesData.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 50) + 20,
        orders: Math.floor(Math.random() * 30) + 10,
        revenue: Math.floor(Math.random() * 10000) + 5000
      })
    }
    
    setSalesData(salesData)
  }

  const fetchOrderStatusData = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('status')

    if (error) throw error

    const statusCounts = data?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const statusData: OrderStatusData[] = [
      { name: '待付款', value: statusCounts.pending || 0, color: '#fbbf24' },
      { name: '已付款', value: statusCounts.paid || 0, color: '#3b82f6' },
      { name: '配送中', value: statusCounts.shipping || 0, color: '#8b5cf6' },
      { name: '已完成', value: statusCounts.completed || 0, color: '#10b981' },
      { name: '已取消', value: statusCounts.cancelled || 0, color: '#ef4444' }
    ]

    setOrderStatusData(statusData.filter(item => item.value > 0))
  }

  const fetchUserGrowthData = async () => {
    // 生成最近6个月的用户增长数据
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        month: date.toLocaleDateString('zh-CN', { month: 'short' }),
        users: Math.floor(Math.random() * 200) + 100,
        newUsers: Math.floor(Math.random() * 50) + 20
      })
    }
    setUserGrowthData(months)
  }

  const fetchPerformanceMetrics = async () => {
    // 模拟性能指标数据
    const metrics: PerformanceMetric[] = [
      { name: '转化率', value: 3.2, target: 4.0, color: '#3b82f6' },
      { name: '客单价', value: 285, target: 300, color: '#10b981' },
      { name: '复购率', value: 28, target: 35, color: '#f59e0b' },
      { name: '满意度', value: 4.6, target: 4.8, color: '#8b5cf6' }
    ]
    setPerformanceMetrics(metrics)
  }

  const fetchCategorySalesData = async () => {
    // 模拟分类销售数据
    const categoryData: CategorySalesData[] = [
      {
        name: '电子产品',
        value: 45000,
        children: [
          { name: '手机', value: 25000 },
          { name: '电脑', value: 15000 },
          { name: '配件', value: 5000 }
        ]
      },
      {
        name: '服装',
        value: 32000,
        children: [
          { name: '男装', value: 18000 },
          { name: '女装', value: 14000 }
        ]
      },
      {
        name: '家居',
        value: 28000,
        children: [
          { name: '家具', value: 18000 },
          { name: '装饰', value: 10000 }
        ]
      },
      {
        name: '图书',
        value: 15000
      }
    ]
    setCategorySalesData(categoryData)
  }

  const fetchRealTimeData = async () => {
    // 模拟实时数据
    setRealTimeData({
      activeUsers: Math.floor(Math.random() * 500) + 200,
      onlineOrders: Math.floor(Math.random() * 50) + 10,
      serverLoad: Math.floor(Math.random() * 30) + 40,
      responseTime: Math.floor(Math.random() * 100) + 150
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-blue-100 text-blue-800',
      'shipping': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      'pending': '待付款',
      'paid': '已付款',
      'shipping': '配送中',
      'completed': '已完成',
      'cancelled': '已取消'
    }
    return texts[status as keyof typeof texts] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和刷新按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600">欢迎回来，这里是您的业务概览</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            刷新数据
          </button>
        </div>
      </div>

      {/* 实时监控卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">在线用户</p>
              <p className="text-2xl font-semibold">{realTimeData.activeUsers}</p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-blue-200" />
                <span className="text-blue-200 text-sm ml-1">实时</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Globe className="w-8 h-8 text-blue-200" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">进行中订单</p>
              <p className="text-2xl font-semibold">{realTimeData.onlineOrders}</p>
              <div className="flex items-center mt-2">
                <Zap className="w-4 h-4 text-green-200" />
                <span className="text-green-200 text-sm ml-1">处理中</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ShoppingCart className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">服务器负载</p>
              <p className="text-2xl font-semibold">{realTimeData.serverLoad}%</p>
              <div className="flex items-center mt-2">
                <BarChart3 className="w-4 h-4 text-purple-200" />
                <span className="text-purple-200 text-sm ml-1">正常</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Activity className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">响应时间</p>
              <p className="text-2xl font-semibold">{realTimeData.responseTime}ms</p>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-orange-200" />
                <span className="text-orange-200 text-sm ml-1">优秀</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Zap className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">总用户数</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+{stats.userGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs 上月</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">商品总数</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 ml-1">稳定增长</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">订单总数</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+{stats.orderGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs 上月</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">总收入</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+{stats.revenueGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs 上月</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 性能指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-500">{metric.name}</h4>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold text-gray-900">
                  {metric.name === '客单价' ? formatCurrency(metric.value) : 
                   metric.name === '满意度' ? metric.value.toFixed(1) : 
                   `${metric.value}${metric.name.includes('率') ? '%' : ''}`}
                </span>
                <span className="text-sm text-gray-500">
                  / {metric.name === '客单价' ? formatCurrency(metric.target) : 
                     metric.name === '满意度' ? metric.target.toFixed(1) : 
                     `${metric.target}${metric.name.includes('率') ? '%' : ''}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    backgroundColor: metric.color
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>进度: {((metric.value / metric.target) * 100).toFixed(1)}%</span>
                <span className={`flex items-center gap-1 ${
                  metric.value >= metric.target ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {metric.value >= metric.target ? <Award className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                  {metric.value >= metric.target ? '已达标' : '待提升'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 销售趋势图 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">销售趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : value,
                  name === 'revenue' ? '收入' : name === 'orders' ? '订单数' : '销售量'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="收入"
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stackId="2" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="订单数"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 订单状态分布 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">订单状态分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 用户增长趋势 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">用户增长趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="总用户"
              />
              <Line 
                type="monotone" 
                dataKey="newUsers" 
                stroke="#10b981" 
                strokeWidth={2}
                name="新增用户"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 每日销售额 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">每日销售额</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 分类销售分析 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">分类销售分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={categorySalesData}
              dataKey="value"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              {categorySalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* 综合数据对比 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">销售与订单综合分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : value,
                  name === 'revenue' ? '收入' : name === 'orders' ? '订单数' : '销售量'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#10b981" name="订单数" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="收入" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 性能指标雷达图 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">关键指标达成率</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceMetrics.map(metric => ({
              ...metric,
              percentage: Math.min((metric.value / metric.target) * 100, 100)
            }))}>
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                clockWise
                dataKey="percentage"
              >
                {performanceMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RadialBar>
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, '达成率']} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 数据表格区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近订单 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">最近订单</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                      <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 库存预警 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">库存预警</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="p-6">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-red-600">
                        库存: {product.stock_quantity} 件
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        库存不足
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">暂无库存预警</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard