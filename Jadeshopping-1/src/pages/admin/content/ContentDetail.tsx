import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import {
  ArrowLeft,
  Edit,
  Eye,
  MessageSquare,
  Clock,
  User,
  Calendar,
  Tag,
  Folder,
  BarChart3,
  Share2,
  Heart,
  TrendingUp,
  Globe,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    articles,
    contentHistory,
    contentComments,
    contentAnalytics,
    fetchArticleDetail,
    fetchContentHistory,
    fetchContentComments,
    fetchContentAnalytics,
    moderateContentComment,
    deleteContentComment
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadContentDetail();
    }
  }, [id]);

  const loadContentDetail = async () => {
    setLoading(true);
    try {
      // 获取文章详情
      await fetchArticleDetail(id!);
      const foundArticle = articles.find(a => a.id === id);
      setArticle(foundArticle);

      // 获取相关数据
      await Promise.all([
        fetchContentHistory(id!),
        fetchContentComments(id!),
        fetchContentAnalytics({ content_id: id })
      ]);
    } catch (error) {
      console.error('Failed to load content detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentModerate = async (commentId: string, status: 'approved' | 'rejected' | 'pending') => {
    await moderateContentComment(commentId, status);
  };

  const handleCommentDelete = async (commentId: string) => {
    if (window.confirm('确定要删除这条评论吗？')) {
      await deleteContentComment(commentId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommentStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">内容未找到</h3>
        <p className="text-gray-500">请检查内容ID是否正确</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/content')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            返回列表
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                {article.status === 'published' ? '已发布' : 
                 article.status === 'draft' ? '草稿' :
                 article.status === 'scheduled' ? '定时发布' : '已归档'}
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/admin/content/edit/${id}`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Eye className="h-4 w-4 mr-2" />
            预览
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: '概览', icon: BarChart3 },
            { id: 'content', name: '内容', icon: Globe },
            { id: 'history', name: '历史记录', icon: Clock },
            { id: 'comments', name: '评论', icon: MessageSquare },
            { id: 'seo', name: 'SEO', icon: Search },
            { id: 'analytics', name: '统计', icon: TrendingUp }
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

      {/* 标签页内容 */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 基本信息 */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">标题</label>
                      <p className="mt-1 text-sm text-gray-900">{article.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">状态</label>
                      <span className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                        {article.status === 'published' ? '已发布' : 
                         article.status === 'draft' ? '草稿' :
                         article.status === 'scheduled' ? '定时发布' : '已归档'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">作者</label>
                      <p className="mt-1 text-sm text-gray-900">{article.author}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">分类</label>
                      <div className="mt-1 flex items-center">
                        <Folder className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{article.category}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">创建时间</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(article.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">更新时间</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(article.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 标签 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 摘要 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">摘要</h4>
                  <p className="text-sm text-gray-600">{article.excerpt}</p>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">统计信息</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Eye className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">浏览量</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">2,580</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">评论数</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">45</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Share2 className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">分享数</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">23</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">点赞数</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">156</span>
                    </div>
                  </div>
                </div>

                {/* 最近活动 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">最近活动</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">内容被编辑</p>
                        <p className="text-xs text-gray-500">2小时前</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">新增评论</p>
                        <p className="text-xs text-gray-500">4小时前</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-900">内容被分享</p>
                        <p className="text-xs text-gray-500">1天前</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="p-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">编辑历史</h3>
            <div className="space-y-4">
              {contentHistory.map((history) => (
                <div key={history.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">版本 {history.version}</span>
                      <span className="text-sm text-gray-500">{history.author_name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(history.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      恢复此版本
                    </button>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{history.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{history.change_summary}</p>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {history.content.substring(0, 200)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">评论管理</h3>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                  <option value="">全部状态</option>
                  <option value="approved">已批准</option>
                  <option value="pending">待审核</option>
                  <option value="rejected">已拒绝</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {contentComments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">{comment.author_name}</span>
                        <span className="text-sm text-gray-500">{comment.author_email}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                        <span className={`text-sm font-medium ${getCommentStatusColor(comment.status)}`}>
                          {comment.status === 'approved' ? '已批准' :
                           comment.status === 'pending' ? '待审核' : '已拒绝'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCommentModerate(comment.id, 'approved')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="批准"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleCommentModerate(comment.id, 'rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="拒绝"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="删除"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO 信息</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO 标题</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {article.seo_title || article.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO 描述</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {article.seo_description || article.excerpt}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关键词</label>
                <div className="flex flex-wrap gap-2">
                  {article.seo_keywords?.split(',').map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {keyword.trim()}
                    </span>
                  )) || <span className="text-sm text-gray-500">未设置关键词</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
                  /content/{article.slug || article.id}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">SEO 评分</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-blue-900">75/100</span>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  建议优化：添加更多相关关键词，优化标题长度
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">访问统计</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">总浏览量</p>
                    <p className="text-2xl font-bold text-blue-600">2,580</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">独立访客</p>
                    <p className="text-2xl font-bold text-green-600">1,892</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">平均停留</p>
                    <p className="text-2xl font-bold text-purple-600">3:25</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-900">跳出率</p>
                    <p className="text-2xl font-bold text-orange-600">32%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">访问来源</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">直接访问</span>
                    <span className="text-sm font-medium text-gray-900">45.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">搜索引擎</span>
                    <span className="text-sm font-medium text-gray-900">32.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">社交媒体</span>
                    <span className="text-sm font-medium text-gray-900">15.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">其他</span>
                    <span className="text-sm font-medium text-gray-900">7.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">设备类型</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">桌面端</span>
                    <span className="text-sm font-medium text-gray-900">58.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">移动端</span>
                    <span className="text-sm font-medium text-gray-900">35.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">平板</span>
                    <span className="text-sm font-medium text-gray-900">6.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetail;