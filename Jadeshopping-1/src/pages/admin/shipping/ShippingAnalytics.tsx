import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsFilters {
  date_range: string;
  carrier_code: string;
  region: string;
  status: string;
}

const ShippingAnalytics: React.FC = () => {
  const {
    shippingAnalytics,
    shippingCostAnalysis,
    deliveryTimeAnalysis,
    shippingStats,
    logisticsProviders,
    analyticsLoading,
    fetchShippingAnalytics,
    fetchShippingCostAnalysis,
    fetchDeliveryTimeAnalysis,
    fetchShippingStats,
    fetchLogisticsProviders,
    exportShippingData
  } = useStore();

  const [filters, setFilters] = useState<AnalyticsFilters>({
    date_range: '30',
    carrier_code: '',
    region: '',
    status: ''
  });

  const [activeChart, setActiveChart] = useState<'volume' | 'cost' | 'time' | 'success'>('volume');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogisticsProviders();
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchShippingAnalytics(filters),
        fetchShippingCostAnalysis(filters),
        fetchDeliveryTimeAnalysis(filters),
        fetchShippingStats()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      await exportShippingData(filters, format);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 模拟数据
  const volumeData = [
    { month: '1月', shipped: 1200, delivered: 1150, exceptions: 50 },
    { month: '2月', shipped: 1400, delivered: 1320, exceptions: 80 },
    { month: '3月', shipped: 1600, delivered: 1520, exceptions: 80 },
    { month: '4月', shipped: 1800, delivered: 1700, exceptions: 100 },
    { month: '5月', shipped: 2000, delivered: 1900, exceptions: 100 },
    { month: '6月', shipped: 2200, delivered: 2100, exceptions: 100 }
  ];

  const costData = [
    { carrier: '顺丰', cost: 15000, volume: 800, avgCost: 18.75 },
    { carrier: '圆通', cost: 8000, volume: 600, avgCost: 13.33 },
    { carrier: '中通', cost: 7200, volume: 650, avgCost: 11.08 },
    { carrier: '申通', cost: 6800, volume: 580, avgCost: 11.72 },
    { carrier: '韵达', cost: 7500, volume: 620, avgCost: 12.10 }
  ];

  const timeData = [
    { carrier: '顺丰', avgTime: 1.2, onTime: 95 },
    { carrier: '圆通', avgTime: 2.8, onTime: 88 },
    { carrier: '中通', avgTime: 2.5, onTime: 90 },
    { carrier: '申通', avgTime: 3.1, onTime: 85 },
    { carrier: '韵达', avgTime: 2.9, onTime: 87 }
  ];

  const regionData = [
    { name: '华东', value: 35, color: '#3B82F6' },
    { name: '华南', value: 25, color: '#10B981' },
    { name: '华北', value: 20, color: '#F59E0B' },
    { name: '西南', value: 12, color: '#EF4444' },
    { name: '其他', value: 8, color: '#8B5CF6' }
  ];

  const trendData = [
    { date: '06-01', cost: 12000, volume: 850, avgCost: 14.12 },
    { date: '06-08', cost: 13500, volume: 920, avgCost: 14.67 },
    { date: '06-15', cost: 14200, volume: 980, avgCost: 14.49 },
    { date: '06-22', cost: 15800, volume: 1100, avgCost: 14.36 },
    { date: '06-29', cost: 16500, volume: 1150, avgCost: 14.35 }
  ];

  const getCarrierName = (code: string) => {
    const provider = logisticsProviders.find(p => p.code === code);
    return provider?.name || code;
  };

  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">发货分析</h1>
          <p className="text-gray-600">发货数据统计与分析报表</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
          <button
            onClick={loadAnalyticsData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                时间范围
              </label>
              <select
                value={filters.date_range}
                onChange={(e) => setFilters(prev => ({ ...prev, date_range: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">最近7天</option>
                <option value="30">最近30天</option>
                <option value="90">最近90天</option>
                <option value="365">最近一年</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                物流公司
              </label>
              <select
                value={filters.carrier_code}
                onChange={(e) => setFilters(prev => ({ ...prev, carrier_code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有物流公司</option>
                {logisticsProviders.map(provider => (
                  <option key={provider.code} value={provider.code}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地区
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有地区</option>
                <option value="east">华东</option>
                <option value="south">华南</option>
                <option value="north">华北</option>
                <option value="southwest">西南</option>
                <option value="northwest">西北</option>
                <option value="northeast">东北</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有状态</option>
                <option value="shipped">已发货</option>
                <option value="in_transit">运输中</option>
                <option value="delivered">已送达</option>
                <option value="exception">异常</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总发货量</p>
              <p className="text-2xl font-bold text-gray-900">
                {shippingStats?.total_shipped || 12800}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">成功率</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(shippingStats?.success_rate || 94.2)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+2.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均时效</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryTimeAnalysis?.average_delivery_time || 2.3}天
              </p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">-0.2天</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总成本</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(shippingCostAnalysis?.total_cost || 54500)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 ml-1">+8.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图表选择器 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'volume', label: '发货量趋势', icon: BarChart3 },
              { id: 'cost', label: '成本分析', icon: DollarSign },
              { id: 'time', label: '时效分析', icon: Clock },
              { id: 'success', label: '成功率分析', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeChart === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* 发货量趋势 */}
          {activeChart === 'volume' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">发货量趋势</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span>已发货</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span>已送达</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                    <span>异常</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="shipped" fill="#3B82F6" name="已发货" />
                    <Bar dataKey="delivered" fill="#10B981" name="已送达" />
                    <Bar dataKey="exceptions" fill="#EF4444" name="异常" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 成本分析 */}
          {activeChart === 'cost' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">物流成本分析</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-4">各物流公司成本对比</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="carrier" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'cost' ? formatCurrency(value as number) : value,
                        name === 'cost' ? '总成本' : name === 'volume' ? '发货量' : '平均成本'
                      ]} />
                      <Bar dataKey="cost" fill="#3B82F6" name="总成本" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-4">成本趋势</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'cost' ? formatCurrency(value as number) : 
                        name === 'avgCost' ? formatCurrency(value as number) : value,
                        name === 'cost' ? '总成本' : name === 'volume' ? '发货量' : '平均成本'
                      ]} />
                      <Line type="monotone" dataKey="cost" stroke="#3B82F6" name="总成本" />
                      <Line type="monotone" dataKey="avgCost" stroke="#10B981" name="平均成本" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 时效分析 */}
          {activeChart === 'time' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">配送时效分析</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-4">各物流公司平均时效</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="carrier" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'avgTime' ? `${value}天` : `${value}%`,
                        name === 'avgTime' ? '平均时效' : '准时率'
                      ]} />
                      <Bar dataKey="avgTime" fill="#F59E0B" name="平均时效(天)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-4">准时率对比</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="carrier" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, '准时率']} />
                      <Bar dataKey="onTime" fill="#10B981" name="准时率(%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 成功率分析 */}
          {activeChart === 'success' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">配送成功率分析</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-4">地区分布</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <h4 className="text-md font-medium text-gray-700 mb-4">成功率趋势</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[85, 100]} />
                      <Tooltip formatter={(value, name) => [
                        `${((value as number / (value as number + 50)) * 100).toFixed(1)}%`,
                        '成功率'
                      ]} />
                      <Area 
                        type="monotone" 
                        dataKey="delivered" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                        name="成功率"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 详细数据表格 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">物流公司表现详情</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  物流公司
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发货量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  成功率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均时效
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  总成本
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均成本
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  异常率
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costData.map((item, index) => (
                <tr key={item.carrier} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.carrier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {timeData[index]?.onTime || 90}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {timeData[index]?.avgTime || 2.5}天
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.avgCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (100 - (timeData[index]?.onTime || 90)) < 5 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(100 - (timeData[index]?.onTime || 90)).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShippingAnalytics;