import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Phone, 
  Mail, 
  Home,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { linkTester, LinkTestResult, TestReport } from '../utils/linkTester';

const LinkTestReport: React.FC = () => {
  const [report, setReport] = useState<TestReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'url' | 'loadTime' | 'source'>('url');

  const runTests = async () => {
    setIsLoading(true);
    try {
      const testReport = await linkTester.runAllTests();
      setReport(testReport);
    } catch (error) {
      console.error('测试失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal':
        return <Home className="h-4 w-4 text-blue-500" />;
      case 'external':
        return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case 'tel':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'mailto':
        return <Mail className="h-4 w-4 text-orange-500" />;
      default:
        return <Home className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const filteredResults = report?.results.filter(result => {
    const matchesFilter = filter === 'all' || result.status === filter;
    const matchesSearch = result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'loadTime':
        return (b.loadTime || 0) - (a.loadTime || 0);
      case 'source':
        return a.source.localeCompare(b.source);
      default:
        return a.url.localeCompare(b.url);
    }
  }) || [];

  const exportReport = () => {
    if (!report) return;
    
    const exportData = {
      summary: {
        totalLinks: report.totalLinks,
        passedLinks: report.passedLinks,
        failedLinks: report.failedLinks,
        warningLinks: report.warningLinks,
        testDuration: report.testDuration,
        timestamp: report.timestamp
      },
      results: report.results
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `link-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">链接测试报告</h1>
          <p className="text-gray-600">自动化验证网站所有链接的功能完整性</p>
        </div>

        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <button
              onClick={runTests}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '测试中...' : '开始测试'}
            </button>
            
            {report && (
              <button
                onClick={exportReport}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                导出报告
              </button>
            )}
          </div>
        </div>

        {/* 测试结果概览 */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总链接数</p>
                  <p className="text-2xl font-bold text-gray-900">{report.totalLinks}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ExternalLink className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">通过</p>
                  <p className="text-2xl font-bold text-green-600">{report.passedLinks}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">失败</p>
                  <p className="text-2xl font-bold text-red-600">{report.failedLinks}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">警告</p>
                  <p className="text-2xl font-bold text-yellow-600">{report.warningLinks}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 测试时间信息 */}
        {report && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">测试耗时</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(report.testDuration / 1000).toFixed(2)} 秒
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">测试时间</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(report.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 筛选和搜索 */}
        {report && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 状态筛选 */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全部状态</option>
                  <option value="success">通过</option>
                  <option value="error">失败</option>
                  <option value="warning">警告</option>
                </select>
              </div>

              {/* 排序 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">排序:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="url">URL</option>
                  <option value="loadTime">加载时间</option>
                  <option value="source">来源文件</option>
                </select>
              </div>

              {/* 搜索 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索链接或来源文件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 详细结果列表 */}
        {report && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                测试结果详情 ({filteredResults.length} 项)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      链接
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      来源
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      加载时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      错误信息
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(result.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 break-all">
                            {result.url}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(result.type)}
                          <span className="ml-2 text-sm text-gray-600 capitalize">
                            {result.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.loadTime ? `${result.loadTime.toFixed(0)}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.statusCode && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.statusCode >= 200 && result.statusCode < 300
                              ? 'bg-green-100 text-green-800'
                              : result.statusCode >= 400
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.statusCode}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        {result.error || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!report && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ExternalLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始链接测试</h3>
            <p className="text-gray-600 mb-6">点击上方按钮开始测试网站所有链接的功能完整性</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkTestReport;