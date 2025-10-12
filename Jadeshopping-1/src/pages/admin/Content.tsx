import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Plus,
  Trash2,
  Image,
  FileText,
  Video,
  Link,
  Calendar,
  User,
  MoreHorizontal,
  Download,
  Upload,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import type { Content, ContentFilters } from '@/types';

// 内容类型标签组件
interface TypeBadgeProps {
  type: Content['type'];
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const typeConfig = {
    banner: { label: '轮播图', color: 'bg-blue-100 text-blue-800', icon: Image },
    article: { label: '文章', color: 'bg-green-100 text-green-800', icon: FileText },
    video: { label: '视频', color: 'bg-purple-100 text-purple-800', icon: Video },
    link: { label: '链接', color: 'bg-yellow-100 text-yellow-800', icon: Link },
    announcement: { label: '公告', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// 内容状态标签组件
interface StatusBadgeProps {
  status: Content['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-800', icon: Clock },
    published: { label: '已发布', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    archived: { label: '已归档', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// 内容表格行组件
interface ContentRowProps {
  content: Content;
  onView: (content: Content) => void;
  onEdit: (content: Content) => void;
  onDelete: (contentId: string) => void;
  onUpdateStatus: (contentId: string, status: Content['status']) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ content, onView, onEdit, onDelete, onUpdateStatus }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {content.thumbnail && (
            <div className="flex-shrink-0 h-10 w-10 mr-3">
              <img
                className="h-10 w-10 rounded-md object-cover"
                src={content.thumbnail}
                alt={content.title}
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {content.title}
            </div>
            <div className="text-sm text-gray-500">
              ID: {content.id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <TypeBadge type={content.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={content.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {content.author || '系统'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(content.createdAt).toLocaleDateString()}
        </div>
        {content.publishedAt && (
          <div className="text-xs text-gray-500">
            发布: {new Date(content.publishedAt).toLocaleDateString()}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {content.viewCount || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onView(content);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  查看详情
                </button>
                <button
                  onClick={() => {
                    onEdit(content);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑内容
                </button>
                {content.status === 'draft' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(content.id, 'published');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    发布内容
                  </button>
                )}
                {content.status === 'published' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(content.id, 'archived');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 w-full text-left"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    归档内容
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('确定要删除这个内容吗？')) {
                      onDelete(content.id);
                    }
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除内容
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// 筛选面板组件
interface FilterPanelProps {
  filters: ContentFilters;
  onFiltersChange: (filters: ContentFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  const typeOptions = [
    { value: 'banner', label: '轮播图' },
    { value: 'article', label: '文章' },
    { value: 'video', label: '视频' },
    { value: 'link', label: '链接' },
    { value: 'announcement', label: '公告' }
  ];

  const statusOptions = [
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
    { value: 'archived', label: '已归档' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">内容类型</label>
          <select
            value={filters.type || ''}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">全部类型</option>
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">发布状态</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">全部状态</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">作者</label>
          <input
            type="text"
            placeholder="作者姓名"
            value={filters.author || ''}
            onChange={(e) => onFiltersChange({ ...filters, author: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>
  );
};

// 内容详情模态框组件
interface ContentDetailModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ content, isOpen, onClose }) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                内容详情
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">标题:</span>
                      <div className="text-sm font-medium">{content.title}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">类型:</span>
                      <div className="text-sm">
                        <TypeBadge type={content.type} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">状态:</span>
                      <div className="text-sm">
                        <StatusBadge status={content.status} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">作者:</span>
                      <div className="text-sm">{content.author || '系统'}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">浏览量:</span>
                      <div className="text-sm">{content.viewCount || 0}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">排序:</span>
                      <div className="text-sm">{content.sortOrder || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 缩略图 */}
              {content.thumbnail && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">缩略图</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="max-w-xs h-auto rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* 内容 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">内容</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  {content.type === 'link' ? (
                    <a
                      href={content.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      {content.content}
                    </a>
                  ) : (
                    <div className="prose max-w-none">
                      {content.content}
                    </div>
                  )}
                </div>
              </div>

              {/* 摘要 */}
              {content.excerpt && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">摘要</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">{content.excerpt}</p>
                  </div>
                </div>
              )}

              {/* 标签 */}
              {content.tags && content.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">标签</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 时间信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">时间信息</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">创建时间:</span>
                      <span className="text-sm">{new Date(content.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">更新时间:</span>
                      <span className="text-sm">{new Date(content.updatedAt).toLocaleString()}</span>
                    </div>
                    {content.publishedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">发布时间:</span>
                        <span className="text-sm">{new Date(content.publishedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 编辑内容模态框组件
interface EditContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contentId: string, data: Partial<Content>) => void;
}

const EditContentModal: React.FC<EditContentModalProps> = ({ content, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Content>>({});

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        type: content.type,
        status: content.status,
        content: content.content,
        excerpt: content.excerpt,
        thumbnail: content.thumbnail,
        author: content.author,
        tags: content.tags,
        sortOrder: content.sortOrder
      });
    }
  }, [content]);

  if (!isOpen || !content) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content.id, formData);
    onClose();
  };

  const typeOptions = [
    { value: 'banner', label: '轮播图' },
    { value: 'article', label: '文章' },
    { value: 'video', label: '视频' },
    { value: 'link', label: '链接' },
    { value: 'announcement', label: '公告' }
  ];

  const statusOptions = [
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
    { value: 'archived', label: '已归档' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  编辑内容
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标题
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        类型
                      </label>
                      <select
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      >
                        {typeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        状态
                      </label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      缩略图URL
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail || ''}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        作者
                      </label>
                      <input
                        type="text"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        排序
                      </label>
                      <input
                        type="number"
                        value={formData.sortOrder || 0}
                        onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标签 (用逗号分隔)
                    </label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="标签1, 标签2, 标签3"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      摘要
                    </label>
                    <textarea
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="内容摘要..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      内容
                    </label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="请输入内容..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Content: React.FC = () => {
  const { 
    adminContents, 
    fetchAdminContents, 
    updateAdminContent,
    deleteAdminContent,
    adminContentsLoading 
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ContentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'viewCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showContentDetail, setShowContentDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAdminContents();
  }, [fetchAdminContents]);

  // 筛选和搜索内容
  const filteredContents = adminContents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || content.type === filters.type;
    const matchesStatus = !filters.status || content.status === filters.status;
    const matchesAuthor = !filters.author || content.author?.toLowerCase().includes(filters.author.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesAuthor;
  });

  // 排序内容
  const sortedContents = [...filteredContents].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 分页
  const totalPages = Math.ceil(sortedContents.length / pageSize);
  const paginatedContents = sortedContents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setShowContentDetail(true);
  };

  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setShowEditModal(true);
  };

  const handleDeleteContent = async (contentId: string) => {
    await deleteAdminContent(contentId);
  };

  const handleUpdateStatus = async (contentId: string, status: Content['status']) => {
    await updateAdminContent(contentId, { status });
  };

  const handleSaveContent = async (contentId: string, data: Partial<Content>) => {
    await updateAdminContent(contentId, data);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            管理网站内容、文章、轮播图和公告
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            批量导入
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            导出内容
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            新建内容
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索标题、内容或作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            筛选
          </button>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="createdAt-desc">最新创建</option>
            <option value="createdAt-asc">最早创建</option>
            <option value="title-asc">标题A-Z</option>
            <option value="title-desc">标题Z-A</option>
            <option value="viewCount-desc">浏览量从高到低</option>
            <option value="viewCount-asc">浏览量从低到高</option>
          </select>
        </div>
      </div>

      {/* 筛选面板 */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* 内容表格 */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  内容信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  浏览量
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminContentsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                      <span className="ml-2 text-gray-500">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedContents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无内容</h3>
                    <p className="mt-1 text-sm text-gray-500">还没有任何内容记录。</p>
                  </td>
                </tr>
              ) : (
                paginatedContents.map((content) => (
                  <ContentRow
                    key={content.id}
                    content={content}
                    onView={handleViewContent}
                    onEdit={handleEditContent}
                    onDelete={handleDeleteContent}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, sortedContents.length)} 条，
                  共 {sortedContents.length} 条记录
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value={10}>10条/页</option>
                  <option value={20}>20条/页</option>
                  <option value={50}>50条/页</option>
                </select>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 内容详情模态框 */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={showContentDetail}
        onClose={() => {
          setShowContentDetail(false);
          setSelectedContent(null);
        }}
      />

      {/* 编辑内容模态框 */}
      <EditContentModal
        content={selectedContent}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedContent(null);
        }}
        onSave={handleSaveContent}
      />
    </div>
  );
};

export default Content;