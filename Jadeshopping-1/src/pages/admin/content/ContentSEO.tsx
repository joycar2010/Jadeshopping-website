import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import {
  Globe,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  Target,
  Zap,
  FileText,
  Link,
  Tag,
  Clock,
  Users,
  Activity,
  Award,
  Lightbulb,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

interface SEOScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'error';
  suggestions: string[];
}

const SEOScoreCard: React.FC<SEOScoreCardProps> = ({ 
  title, 
  score, 
  maxScore, 
  status, 
  suggestions 
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertCircle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-2 text-sm font-medium">{score}/{maxScore}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>SEO得分</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              percentage >= 80 ? 'bg-green-500' :
              percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">优化建议</h4>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <Lightbulb className="h-3 w-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface MetaTagFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const MetaTagForm: React.FC<MetaTagFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    page: '',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonical: '',
    robots: 'index,follow'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? '编辑元标签' : '添加元标签'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                页面路径
              </label>
              <input
                type="text"
                value={formData.page}
                onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/about"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                页面标题
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="页面标题"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              页面描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="页面描述，建议150-160字符"
            />
            <p className="text-sm text-gray-500 mt-1">
              当前长度: {formData.description.length}/160
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关键词
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="关键词1, 关键词2, 关键词3"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph 设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG 标题
                </label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="社交媒体分享标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG 图片URL
                </label>
                <input
                  type="url"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG 描述
              </label>
              <textarea
                value={formData.ogDescription}
                onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="社交媒体分享描述"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter 设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter 标题
                </label>
                <input
                  type="text"
                  value={formData.twitterTitle}
                  onChange={(e) => setFormData({ ...formData, twitterTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Twitter 分享标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter 图片URL
                </label>
                <input
                  type="url"
                  value={formData.twitterImage}
                  onChange={(e) => setFormData({ ...formData, twitterImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter 描述
              </label>
              <textarea
                value={formData.twitterDescription}
                onChange={(e) => setFormData({ ...formData, twitterDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Twitter 分享描述"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                规范链接
              </label>
              <input
                type="url"
                value={formData.canonical}
                onChange={(e) => setFormData({ ...formData, canonical: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/canonical-url"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots 设置
              </label>
              <select
                value={formData.robots}
                onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="index,follow">index,follow</option>
                <option value="noindex,follow">noindex,follow</option>
                <option value="index,nofollow">index,nofollow</option>
                <option value="noindex,nofollow">noindex,nofollow</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContentSEO: React.FC = () => {
  const {
    seoSettings,
    sitemapItems,
    seoAnalysisReport,
    keywordAnalysis,
    seoSettingsLoading,
    fetchSEOSettings,
    updateSEOSettings,
    fetchSitemap,
    generateSitemap,
    fetchSEOAnalysis,
    fetchKeywordAnalysis
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [editingMeta, setEditingMeta] = useState<any>(null);

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    await Promise.all([
      fetchSEOSettings(),
      fetchSitemap(),
      fetchSEOAnalysis(),
      fetchKeywordAnalysis()
    ]);
  };

  // 模拟数据
  const mockSEOScores = [
    {
      title: '技术SEO',
      score: 85,
      maxScore: 100,
      status: 'good' as const,
      suggestions: [
        '优化页面加载速度',
        '添加结构化数据',
        '改善移动端体验'
      ]
    },
    {
      title: '内容质量',
      score: 72,
      maxScore: 100,
      status: 'warning' as const,
      suggestions: [
        '增加原创内容',
        '优化关键词密度',
        '改善内容结构'
      ]
    },
    {
      title: '用户体验',
      score: 90,
      maxScore: 100,
      status: 'good' as const,
      suggestions: [
        '优化导航结构',
        '提升页面交互性'
      ]
    },
    {
      title: '外部链接',
      score: 45,
      maxScore: 100,
      status: 'error' as const,
      suggestions: [
        '增加高质量外链',
        '建立合作伙伴关系',
        '提升品牌知名度'
      ]
    }
  ];

  const mockMetaTags = [
    {
      id: '1',
      page: '/',
      title: '首页 - 我的网站',
      description: '这是网站首页的描述，包含主要关键词和业务介绍。',
      keywords: '关键词1, 关键词2, 关键词3',
      status: 'good'
    },
    {
      id: '2',
      page: '/about',
      title: '关于我们',
      description: '了解我们的公司历史、使命和团队。',
      keywords: '关于我们, 公司介绍, 团队',
      status: 'warning'
    },
    {
      id: '3',
      page: '/products',
      title: '产品中心',
      description: '',
      keywords: '',
      status: 'error'
    }
  ];

  const mockKeywords = [
    { keyword: 'React开发', volume: 12000, difficulty: 65, position: 3, trend: 'up' },
    { keyword: 'TypeScript教程', volume: 8500, difficulty: 45, position: 7, trend: 'up' },
    { keyword: '前端框架', volume: 15000, difficulty: 80, position: 12, trend: 'down' },
    { keyword: 'Web开发', volume: 25000, difficulty: 75, position: 8, trend: 'stable' },
    { keyword: 'JavaScript', volume: 50000, difficulty: 90, position: 15, trend: 'up' }
  ];

  const mockSitemapItems = [
    { url: '/', lastmod: '2024-01-15', changefreq: 'daily', priority: 1.0, status: 'indexed' },
    { url: '/about', lastmod: '2024-01-10', changefreq: 'monthly', priority: 0.8, status: 'indexed' },
    { url: '/products', lastmod: '2024-01-12', changefreq: 'weekly', priority: 0.9, status: 'pending' },
    { url: '/contact', lastmod: '2024-01-08', changefreq: 'monthly', priority: 0.7, status: 'indexed' },
    { url: '/blog', lastmod: '2024-01-14', changefreq: 'daily', priority: 0.8, status: 'error' }
  ];

  const handleSaveMetaTag = (data: any) => {
    console.log('保存元标签:', data);
    // 这里应该调用API保存数据
  };

  const handleGenerateSitemap = async () => {
    await generateSitemap();
    // 刷新数据
    await fetchSitemap();
  };

  const handleExportSitemap = () => {
    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mockSitemapItems.map(item => `  <url>
    <loc>https://example.com${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sitemap.xml';
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
      case 'indexed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">良好</span>;
      case 'warning':
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">警告</span>;
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">错误</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">未知</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (seoSettingsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">SEO管理</h1>
          <p className="text-gray-600 mt-1">管理网站SEO设置和优化建议</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadSEOData}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新数据
          </button>
          <button
            onClick={() => setShowMetaForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加元标签
          </button>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'SEO概览', icon: BarChart3 },
            { id: 'meta', name: '元标签管理', icon: Tag },
            { id: 'sitemap', name: '网站地图', icon: Globe },
            { id: 'keywords', name: '关键词分析', icon: Search },
            { id: 'analysis', name: 'SEO分析', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* SEO概览 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockSEOScores.map((score, index) => (
              <SEOScoreCard key={index} {...score} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">SEO检查清单</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { task: '设置网站标题和描述', completed: true },
                    { task: '添加关键词标签', completed: true },
                    { task: '创建网站地图', completed: true },
                    { task: '优化图片Alt标签', completed: false },
                    { task: '设置301重定向', completed: false },
                    { task: '添加结构化数据', completed: false },
                    { task: '优化页面加载速度', completed: false },
                    { task: '设置SSL证书', completed: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-3" />
                      )}
                      <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">最近SEO活动</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { action: '更新首页元标签', time: '2小时前', type: 'update' },
                    { action: '生成新的网站地图', time: '1天前', type: 'create' },
                    { action: '添加产品页面关键词', time: '2天前', type: 'update' },
                    { action: '修复重复内容问题', time: '3天前', type: 'fix' },
                    { action: '优化图片Alt标签', time: '1周前', type: 'update' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        activity.type === 'create' ? 'bg-green-500' :
                        activity.type === 'update' ? 'bg-blue-500' :
                        activity.type === 'fix' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 元标签管理 */}
      {activeTab === 'meta' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">元标签管理</h2>
              <button
                onClick={() => setShowMetaForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加元标签
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    页面路径
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockMetaTags.map((meta) => (
                  <tr key={meta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {meta.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {meta.title || '未设置'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {meta.description || '未设置'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(meta.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingMeta(meta);
                            setShowMetaForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 网站地图 */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">网站地图管理</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleGenerateSitemap}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新生成
                  </button>
                  <button
                    onClick={handleExportSitemap}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    下载XML
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最后修改
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新频率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      优先级
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      索引状态
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockSitemapItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Link className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{item.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastmod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.changefreq}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 关键词分析 */}
      {activeTab === 'keywords' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">关键词分析</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    关键词
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    搜索量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    竞争难度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    当前排名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    趋势
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockKeywords.map((keyword, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              keyword.difficulty >= 80 ? 'bg-red-500' :
                              keyword.difficulty >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${keyword.difficulty}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{keyword.difficulty}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{keyword.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTrendIcon(keyword.trend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEO分析 */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">页面性能分析</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { metric: '页面加载速度', score: 85, unit: '分' },
                    { metric: '移动端友好性', score: 92, unit: '分' },
                    { metric: '内容质量', score: 78, unit: '分' },
                    { metric: '用户体验', score: 88, unit: '分' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{item.metric}</span>
                        <span>{item.score}{item.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.score >= 80 ? 'bg-green-500' :
                            item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">优化建议</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { 
                      priority: 'high', 
                      title: '优化图片压缩', 
                      description: '压缩大尺寸图片可提升页面加载速度' 
                    },
                    { 
                      priority: 'medium', 
                      title: '添加内部链接', 
                      description: '增加相关页面的内部链接提升SEO效果' 
                    },
                    { 
                      priority: 'low', 
                      title: '更新元描述', 
                      description: '部分页面的元描述过短，建议扩展到150字符' 
                    },
                    { 
                      priority: 'high', 
                      title: '修复重复内容', 
                      description: '发现3个页面存在重复内容问题' 
                    }
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        suggestion.priority === 'high' ? 'bg-red-500' :
                        suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 元标签表单模态框 */}
      <MetaTagForm
        isOpen={showMetaForm}
        onClose={() => {
          setShowMetaForm(false);
          setEditingMeta(null);
        }}
        onSave={handleSaveMetaTag}
        initialData={editingMeta}
      />
    </div>
  );
};

export default ContentSEO;