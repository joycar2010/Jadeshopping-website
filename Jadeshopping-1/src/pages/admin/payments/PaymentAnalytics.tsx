import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { PaymentAnalytics as PaymentAnalyticsType } from '../../../types';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Users, 
  AlertTriangle,
  Download, 
  RefreshCw, 
  Calendar, 
  Filter,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  Shield
} from 'lucide-react';

// 统计卡片组件
const StatsCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, change, changeType, icon, color = 'blue' }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-3 h-3" />;
      case 'decrease': return <TrendingDown className="w-3 h-3" />;
      default: return null;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100';
      case 'red': return 'text-red-600 bg-red-100';
      case 'yellow': return 'text-yellow-600 bg-yellow-100';
      case 'purple': return 'text-purple-600 bg-purple-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm ml-1">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// 图表容器组件
const ChartContainer: React.FC<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, children, actions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

// 支付趋势图表
const PaymentTrendChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value: any, name: string) => [
            `¥${value.toLocaleString()}`, 
            name === 'amount' ? '支付金额' : '支付笔数'
          ]}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stackId="1" 
          stroke="#3B82F6" 
          fill="#3B82F6" 
          fillOpacity={0.6}
          name="支付金额"
        />
        <Area 
          type="monotone" 
          dataKey="count" 
          stackId="2" 
          stroke="#10B981" 
          fill="#10B981" 
          fillOpacity={0.6}
          name="支付笔数"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 支付方式分布图表
const PaymentMethodChart: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [`¥${value.toLocaleString()}`, '金额']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// 成功率趋势图表
const SuccessRateChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value: any) => [`${value}%`, '成功率']} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="success_rate" 
          stroke="#10B981" 
          strokeWidth={2}
          name="成功率"
        />
        <Line 
          type="monotone" 
          dataKey="refund_rate" 
          stroke="#EF4444" 
          strokeWidth={2}
          name="退款率"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 异常交易监控
const AnomalyMonitor: React.FC<{ anomalies: any[] }> = ({ anomalies }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-3">
      {anomalies.length === 0 ? (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500">暂无异常交易</p>
        </div>
      ) : (
        anomalies.map((anomaly, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <div>
                  <h4 className="font-medium">{anomaly.type}</h4>
                  <p className="text-sm opacity-75">{anomaly.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{getSeverityText(anomaly.severity)}</span>
                <p className="text-xs opacity-75">{anomaly.time}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const PaymentAnalytics: React.FC = () => {
  const { 
    paymentAnalytics, 
    fetchPaymentAnalytics,
    exportPaymentReport 
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [chartType, setChartType] = useState('trend');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      await fetchPaymentAnalytics();
      setLoading(false);
    };

    loadAnalytics();
  }, [fetchPaymentAnalytics, dateRange]);

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      await exportPaymentReport({
        format,
        date_range: dateRange,
        include_charts: true
      });
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 模拟数据
  const mockTrendData = [
    { date: '01-10', amount: 125000, count: 450 },
    { date: '01-11', amount: 138000, count: 520 },
    { date: '01-12', amount: 142000, count: 480 },
    { date: '01-13', amount: 156000, count: 610 },
    { date: '01-14', amount: 134000, count: 490 },
    { date: '01-15', amount: 168000, count: 650 },
    { date: '01-16', amount: 172000, count: 680 }
  ];

  const mockMethodData = [
    { name: '支付宝', value: 450000 },
    { name: '微信支付', value: 320000 },
    { name: '银联支付', value: 180000 },
    { name: '信用卡', value: 120000 },
    { name: '其他', value: 80000 }
  ];

  const mockSuccessData = [
    { date: '01-10', success_rate: 96.5, refund_rate: 2.1 },
    { date: '01-11', success_rate: 97.2, refund_rate: 1.8 },
    { date: '01-12', success_rate: 95.8, refund_rate: 2.5 },
    { date: '01-13', success_rate: 98.1, refund_rate: 1.2 },
    { date: '01-14', success_rate: 96.9, refund_rate: 1.9 },
    { date: '01-15', success_rate: 97.8, refund_rate: 1.5 },
    { date: '01-16', success_rate: 98.3, refund_rate: 1.1 }
  ];

  const mockAnomalies = [
    {
      type: '异常大额支付',
      description: '单笔支付金额超过日常平均值300%',
      severity: 'high',
      time: '2小时前'
    },
    {
      type: '频繁小额支付',
      description: '同一用户5分钟内进行了15笔小额支付',
      severity: 'medium',
      time: '4小时前'
    },
    {
      type: '异常IP访问',
      description: '来自高风险地区的支付请求',
      severity: 'low',
      time: '6小时前'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-3" />
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">支付分析</h1>
            <p className="mt-2 text-gray-600">支付数据统计与趋势分析</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">今天</option>
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
            </select>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              导出Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              导出PDF
            </button>
            <button
              onClick={() => fetchPaymentAnalytics()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="总支付金额"
          value="¥1,285,000"
          change="+12.5%"
          changeType="increase"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="支付笔数"
          value="3,847"
          change="+8.2%"
          changeType="increase"
          icon={<CreditCard className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="成功率"
          value="97.3%"
          change="+0.8%"
          changeType="increase"
          icon={<Target className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="异常交易"
          value="23"
          change="-15.2%"
          changeType="decrease"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 支付趋势 */}
        <ChartContainer
          title="支付趋势"
          actions={
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="trend">趋势图</option>
              <option value="bar">柱状图</option>
            </select>
          }
        >
          <PaymentTrendChart data={mockTrendData} />
        </ChartContainer>

        {/* 支付方式分布 */}
        <ChartContainer title="支付方式分布">
          <PaymentMethodChart data={mockMethodData} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 成功率趋势 */}
        <ChartContainer title="成功率 & 退款率趋势">
          <SuccessRateChart data={mockSuccessData} />
        </ChartContainer>

        {/* 异常交易监控 */}
        <ChartContainer 
          title="异常交易监控"
          actions={
            <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
              <Eye className="w-4 h-4 mr-1" />
              查看全部
            </button>
          }
        >
          <AnomalyMonitor anomalies={mockAnomalies} />
        </ChartContainer>
      </div>

      {/* 详细数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">支付方式详细统计</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支付方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  交易笔数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  交易金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  成功率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  占比
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🅰️</span>
                    <span className="text-sm font-medium text-gray-900">支付宝</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,523</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥450,000</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    98.2%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥295</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">39.6%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">💬</span>
                    <span className="text-sm font-medium text-gray-900">微信支付</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,089</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥320,000</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    97.8%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥294</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28.1%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🏦</span>
                    <span className="text-sm font-medium text-gray-900">银联支付</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">612</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥180,000</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    95.5%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥294</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;