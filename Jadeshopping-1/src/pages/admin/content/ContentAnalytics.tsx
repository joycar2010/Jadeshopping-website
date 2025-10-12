import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  Clock,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  trend 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

interface TopContentItemProps {
  content: any;
  rank: number;
  metric: 'views' | 'likes' | 'comments' | 'shares';
}

const TopContentItem: React.FC<TopContentItemProps> = ({ content, rank, metric }) => {
  const getMetricIcon = () => {
    switch (metric) {
      case 'views': return <Eye className="h-4 w-4" />;
      case 'likes': return <Heart className="h-4 w-4" />;
      case 'comments': return <MessageCircle className="h-4 w-4" />;
      case 'shares': return <Share2 className="h-4 w-4" />;
    }
  };

  const getMetricValue = () => {
    switch (metric) {
      case 'views': return content.view_count || 0;
      case 'likes': return content.like_count || 0;
      case 'comments': return content.comment_count || 0;
      case 'shares': return content.share_count || 0;
    }
  };

  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white mr-3 ${
        rank === 1 ? 'bg-yellow-500' :
        rank === 2 ? 'bg-gray-400' :
        rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
      }`}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {content.title}
        </p>
        <p className="text-xs text-gray-500">
          {content.category_name} • {new Date(content.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        {getMetricIcon()}
        <span className="ml-1 font-medium">{getMetricValue().toLocaleString()}</span>
      </div>
    </div>
  );
};

const ContentAnalytics: React.FC = () => {
  const {
    contentAnalytics,
    contentStats,
    contentAnalyticsLoading,
    fetchContentAnalytics,
    fetchContentStats
  } = useStore();

  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    await Promise.all([
      fetchContentAnalytics({ period: dateRange }),
      fetchContentStats({ period: dateRange })
    ]);
  };

  // 模拟数据
  const mockViewsData = [
    { date: '2024-01-01', views: 1200, likes: 45, comments: 12, shares: 8 },
    { date: '2024-01-02', views: 1350, likes: 52, comments: 18, shares: 12 },
    { date: '2024-01-03', views: 1100, likes: 38, comments: 9, shares: 5 },
    { date: '2024-01-04', views: 1450, likes: 61, comments: 22, shares: 15 },
    { date: '2024-01-05', views: 1600, likes: 72, comments: 28, shares: 18 },
    { date: '2024-01-06', views: 1380, likes: 55, comments: 16, shares: 11 },
    { date: '2024-01-07', views: 1520, likes: 68, comments: 24, shares: 14 }
  ];

  const mockCategoryData = [
    { name: '技术文章', value: 35, color: '#3B82F6' },
    { name: '产品介绍', value: 25, color: '#10B981' },
    { name: '行业资讯', value: 20, color: '#F59E0B' },
    { name: '公司动态', value: 15, color: '#EF4444' },
    { name: '其他', value: 5, color: '#8B5CF6' }
  ];

  const mockTopContent = [
    {
      id: '1',
      title: 'React 18 新特性详解',
      category_name: '技术文章',
      created_at: '2024-01-01',
      view_count: 2500,
      like_count: 120,
      comment_count: 45,
      share_count: 32
    },
    {
      id: '2',
      title: '2024年前端开发趋势预测',
      category_name: '行业资讯',
      created_at: '2024-01-02',
      view_count: 2200,
      like_count: 98,
      comment_count: 38,
      share_count: 28
    },
    {
      id: '3',
      title: '新产品发布会回顾',
      category_name: '公司动态',
      created_at: '2024-01-03',
      view_count: 1800,
      like_count: 85,
      comment_count: 32,
      share_count: 25
    },
    {
      id: '4',
      title: 'TypeScript 最佳实践指南',
      category_name: '技术文章',
      created_at: '2024-01-04',
      view_count: 1650,
      like_count: 78,
      comment_count: 29,
      share_count: 22
    },
    {
      id: '5',
      title: '用户体验设计原则',
      category_name: '产品介绍',
      created_at: '2024-01-05',
      view_count: 1500,
      like_count: 72,
      comment_count: 26,
      share_count: 19
    }
  ];

  const mockUserEngagement = [
    { hour: '00:00', users: 120 },
    { hour: '02:00', users: 80 },
    { hour: '04:00', users: 60 },
    { hour: '06:00', users: 100 },
    { hour: '08:00', users: 280 },
    { hour: '10:00', users: 450 },
    { hour: '12:00', users: 520 },
    { hour: '14:00', users: 480 },
    { hour: '16:00', users: 380 },
    { hour: '18:00', users: 320 },
    { hour: '20:00', users: 280 },
    { hour: '22:00', users: 200 }
  ];

  const renderChart = () => {
    const data = mockViewsData;
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedMetric} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['日期', '浏览量', '点赞数', '评论数', '分享数'].join(','),
      ...mockViewsData.map(item => [
        item.date,
        item.views,
        item.likes,
        item.comments,
        item.shares
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `content_analytics_${dateRange}.csv`;
    link.click();
  };

  if (contentAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容分析</h1>
          <p className="text-gray-600 mt-1">查看内容表现和用户互动数据</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="1y">最近1年</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="总浏览量"
          value="125.6K"
          change={12.5}
          trend="up"
          icon={Eye}
          color="bg-blue-500"
        />
        <MetricCard
          title="总点赞数"
          value="8.2K"
          change={8.3}
          trend="up"
          icon={Heart}
          color="bg-red-500"
        />
        <MetricCard
          title="总评论数"
          value="2.1K"
          change={-2.1}
          trend="down"
          icon={MessageCircle}
          color="bg-green-500"
        />
        <MetricCard
          title="总分享数"
          value="1.5K"
          change={15.7}
          trend="up"
          icon={Share2}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 趋势图表 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">内容表现趋势</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="views">浏览量</option>
                  <option value="likes">点赞数</option>
                  <option value="comments">评论数</option>
                  <option value="shares">分享数</option>
                </select>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-1 ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    title="折线图"
                  >
                    <Activity className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-1 ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    title="柱状图"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`p-1 ${chartType === 'area' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    title="面积图"
                  >
                    <Target className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {renderChart()}
          </div>
        </div>

        {/* 分类分布 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">内容分类分布</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '占比']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {mockCategoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门内容排行 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">热门内容排行</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="views">按浏览量</option>
                <option value="likes">按点赞数</option>
                <option value="comments">按评论数</option>
                <option value="shares">按分享数</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {mockTopContent.map((content, index) => (
                <TopContentItem
                  key={content.id}
                  content={content}
                  rank={index + 1}
                  metric={selectedMetric as any}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 用户活跃时段 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">用户活跃时段</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockUserEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 详细统计表格 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">详细统计数据</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  内容标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  浏览量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  点赞数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评论数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分享数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发布时间
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTopContent.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {content.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {content.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.view_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.like_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.comment_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.share_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.created_at).toLocaleDateString()}
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

export default ContentAnalytics;