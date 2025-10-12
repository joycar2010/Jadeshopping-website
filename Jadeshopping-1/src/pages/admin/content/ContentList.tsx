import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Tag,
  User,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  CheckSquare,
  Square,
  Archive,
  Globe,
  Clock,
  TrendingUp,
  FileText,
  Image,
  Video,
  Mic,
  Move,
  Copy,
  Star,
  MessageCircle,
  Share2,
  Heart
} from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  content 
}) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">内容预览</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>作者: {content.author_name}</span>
              <span>分类: {content.category_name}</span>
              <span>发布时间: {new Date(content.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {content.featured_image && (
            <div className="mb-6">
              <img 
                src={content.featured_image} 
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
          
          {content.tags && content.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">标签</h3>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface BatchOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: string[];
  onBatchOperation: (operation: string) => void;
}

const BatchOperationModal: React.FC<BatchOperationModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  onBatchOperation
}) => {
  if (!isOpen) return null;

  const operations = [
    { id: 'publish', name: '批量发布', icon: Globe, color: 'text-green-600' },
    { id: 'draft', name: '设为草稿', icon: FileText, color: 'text-yellow-600' },
    { id: 'archive', name: '批量归档', icon: Archive, color: 'text-gray-600' },
    { id: 'delete', name: '批量删除', icon: Trash2, color: 'text-red-600' },
    { id: 'feature', name: '设为推荐', icon: Star, color: 'text-purple-600' },
    { id: 'unfeature', name: '取消推荐', icon: Star, color: 'text-gray-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            批量操作 ({selectedItems.length} 项)
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-2">
            {operations.map((operation) => (
              <button
                key={operation.id}
                onClick={() => {
                  onBatchOperation(operation.id);
                  onClose();
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg ${operation.color}`}
              >
                <operation.icon className="h-5 w-5 mr-3" />
                {operation.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentList: React.FC = () => {
  const navigate = useNavigate();
  const {
    articles,
    articlesLoading,
    contentCategories,
    contentTags,
    fetchArticles,
    fetchContentCategories,
    fetchContentTags,
    deleteArticle,
    updateArticle
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchArticles(),
      fetchContentCategories(),
      fetchContentTags()
    ]);
  };

  // 模拟数据
  const mockArticles = [
    {
      id: '1',
      title: 'React 18 新特性详解',
      excerpt: '深入了解 React 18 带来的新功能和改进，包括并发渲染、自动批处理等...',
      content: '<p>React 18 是一个重要的版本更新...</p>',
      status: 'published',
      author_name: '张三',
      category_name: '技术文章',
      tags: ['React', 'JavaScript', '前端'],
      featured_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=React%20development%20modern%20interface&image_size=landscape_4_3',
      view_count: 1250,
      like_count: 45,
      comment_count: 12,
      share_count: 8,
      is_featured: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T14:20:00Z',
      published_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: '2024年前端开发趋势预测',
      excerpt: '分析2024年前端开发的主要趋势，包括新框架、工具和最佳实践...',
      content: '<p>2024年前端开发将迎来新的变化...</p>',
      status: 'published',
      author_name: '李四',
      category_name: '行业资讯',
      tags: ['前端', '趋势', '2024'],
      featured_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Frontend%20development%20trends%20futuristic&image_size=landscape_4_3',
      view_count: 980,
      like_count: 32,
      comment_count: 8,
      share_count: 15,
      is_featured: false,
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T16:45:00Z',
      published_at: '2024-01-14T09:15:00Z'
    },
    {
      id: '3',
      title: '新产品发布会回顾',
      excerpt: '回顾我们最新产品发布会的精彩瞬间和重要发布内容...',
      content: '<p>在昨天的产品发布会上...</p>',
      status: 'draft',
      author_name: '王五',
      category_name: '公司动态',
      tags: ['产品', '发布会', '公司'],
      featured_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Product%20launch%20event%20corporate&image_size=landscape_4_3',
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      share_count: 0,
      is_featured: false,
      created_at: '2024-01-13T14:20:00Z',
      updated_at: '2024-01-13T18:30:00Z',
      published_at: null
    },
    {
      id: '4',
      title: 'TypeScript 最佳实践指南',
      excerpt: 'TypeScript 开发中的最佳实践和常见陷阱避免方法...',
      content: '<p>TypeScript 作为 JavaScript 的超集...</p>',
      status: 'scheduled',
      author_name: '赵六',
      category_name: '技术文章',
      tags: ['TypeScript', 'JavaScript', '最佳实践'],
      featured_image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20coding%20best%20practices&image_size=landscape_4_3',
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      share_count: 0,
      is_featured: true,
      created_at: '2024-01-12T11:00:00Z',
      updated_at: '2024-01-12T15:30:00Z',
      published_at: '2024-01-16T09:00:00Z'
    }
  ];

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category_name === selectedCategory;
    const matchesStatus = !selectedStatus || article.status === selectedStatus;
    const matchesAuthor = !selectedAuthor || article.author_name === selectedAuthor;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectAll = () => {
    if (selectedItems.length === sortedArticles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedArticles.map(article => article.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBatchOperation = async (operation: string) => {
    console.log(`执行批量操作: ${operation}`, selectedItems);
    
    switch (operation) {
      case 'publish':
        // 批量发布
        for (const id of selectedItems) {
          await updateArticle(id, { status: 'published', published_at: new Date().toISOString() });
        }
        break;
      case 'draft':
        // 设为草稿
        for (const id of selectedItems) {
          await updateArticle(id, { status: 'draft', published_at: null });
        }
        break;
      case 'archive':
        // 批量归档
        for (const id of selectedItems) {
          await updateArticle(id, { status: 'archived' });
        }
        break;
      case 'delete':
        // 批量删除
        if (window.confirm(`确定要删除选中的 ${selectedItems.length} 项内容吗？`)) {
          for (const id of selectedItems) {
            await deleteArticle(id);
          }
        }
        break;
      case 'feature':
        // 设为推荐
        for (const id of selectedItems) {
          await updateArticle(id, { is_featured: true });
        }
        break;
      case 'unfeature':
        // 取消推荐
        for (const id of selectedItems) {
          await updateArticle(id, { is_featured: false });
        }
        break;
    }
    
    setSelectedItems([]);
    await loadData();
  };

  const handlePreview = (article: any) => {
    setPreviewContent(article);
    setShowPreviewModal(true);
  };

  const handleDragStart = (e: React.DragEvent, articleId: string) => {
    setDraggedItem(articleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetId) {
      console.log(`移动文章 ${draggedItem} 到 ${targetId} 的位置`);
      // 这里实现拖拽排序逻辑
    }
    setDraggedItem(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">已发布</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">草稿</span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">定时发布</span>;
      case 'archived':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">已归档</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">未知</span>;
    }
  };

  const getContentTypeIcon = (article: any) => {
    if (article.featured_image) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  if (articlesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
          <p className="text-gray-600 mt-1">管理网站内容、文章和媒体资源</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/content/analytics')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            数据分析
          </button>
          <button
            onClick={() => navigate('/admin/content/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建内容
          </button>
        </div>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总内容数</p>
              <p className="text-2xl font-bold text-gray-900">{mockArticles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已发布</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockArticles.filter(a => a.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">草稿</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockArticles.filter(a => a.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总浏览量</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockArticles.reduce((sum, a) => sum + a.view_count, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索内容标题或摘要..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有分类</option>
                <option value="技术文章">技术文章</option>
                <option value="行业资讯">行业资讯</option>
                <option value="公司动态">公司动态</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="scheduled">定时发布</option>
                <option value="archived">已归档</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">创建时间</option>
                <option value="updated_at">更新时间</option>
                <option value="published_at">发布时间</option>
                <option value="view_count">浏览量</option>
                <option value="title">标题</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={sortOrder === 'asc' ? '升序' : '降序'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
              
              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </button>
            </div>
          </div>
        </div>

        {/* 批量操作栏 */}
        {selectedItems.length > 0 && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                已选择 {selectedItems.length} 项
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  批量操作
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  取消选择
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 内容列表 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {selectedItems.length === sortedArticles.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数据
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedArticles.map((article) => (
                <tr 
                  key={article.id} 
                  className={`hover:bg-gray-50 ${draggedItem === article.id ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, article.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, article.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSelectItem(article.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {selectedItems.includes(article.id) ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {article.featured_image && (
                        <img 
                          src={article.featured_image} 
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getContentTypeIcon(article)}
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {article.title}
                          </h3>
                          {article.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <Move className="h-4 w-4 text-gray-400 cursor-move" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{article.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{article.author_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.view_count}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {article.like_count}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {article.comment_count}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>创建: {new Date(article.created_at).toLocaleDateString()}</div>
                      {article.published_at && (
                        <div>发布: {new Date(article.published_at).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(article)}
                        className="text-blue-600 hover:text-blue-900"
                        title="预览"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/content/edit/${article.id}`)}
                        className="text-green-600 hover:text-green-900"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/content/${article.id}`)}
                        className="text-purple-600 hover:text-purple-900"
                        title="详情"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('确定要删除这篇内容吗？')) {
                            await deleteArticle(article.id);
                            await loadData();
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到内容</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory || selectedStatus ? 
                '尝试调整搜索条件或筛选器' : 
                '开始创建您的第一篇内容'
              }
            </p>
            {!searchTerm && !selectedCategory && !selectedStatus && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/admin/content/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  创建内容
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 批量操作模态框 */}
      <BatchOperationModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        selectedItems={selectedItems}
        onBatchOperation={handleBatchOperation}
      />

      {/* 内容预览模态框 */}
      <ContentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        content={previewContent}
      />
    </div>
  );
};

export default ContentList;