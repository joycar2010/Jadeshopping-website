import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Tag,
  TrendingUp,
  Users,
  FileText,
  Merge,
  Download,
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react';

interface TagFormProps {
  tag?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    slug: tag?.slug || '',
    description: tag?.description || '',
    color: tag?.color || '#3B82F6',
    is_active: tag?.is_active ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 自动生成 slug
    if (field === 'name' && !tag) {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }

    // 清除错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '标签名称不能为空';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'URL别名不能为空';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'URL别名只能包含小写字母、数字和连字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {tag ? '编辑标签' : '创建标签'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入标签名称"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL别名 *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.slug ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="url-slug"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入标签描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签颜色
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              启用标签
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface MergeTagsModalProps {
  tags: any[];
  onMerge: (sourceTagIds: string[], targetTagId: string) => void;
  onCancel: () => void;
}

const MergeTagsModal: React.FC<MergeTagsModalProps> = ({ tags, onMerge, onCancel }) => {
  const [selectedSourceTags, setSelectedSourceTags] = useState<string[]>([]);
  const [targetTagId, setTargetTagId] = useState('');

  const handleSourceTagToggle = (tagId: string) => {
    setSelectedSourceTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleMerge = () => {
    if (selectedSourceTags.length > 0 && targetTagId) {
      onMerge(selectedSourceTags, targetTagId);
    }
  };

  const availableTargetTags = tags.filter(tag => !selectedSourceTags.includes(tag.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">合并标签</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">选择要合并的标签</h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {tags.map(tag => (
                <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSourceTags.includes(tag.id)}
                    onChange={() => handleSourceTagToggle(tag.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                  <span className="text-sm text-gray-500">({tag.usage_count || 0})</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">选择目标标签</h3>
            <select
              value={targetTagId}
              onChange={(e) => setTargetTagId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">选择目标标签</option>
              {availableTargetTags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name} ({tag.usage_count || 0} 次使用)
                </option>
              ))}
            </select>
          </div>

          {selectedSourceTags.length > 0 && targetTagId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">合并确认</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    将把 {selectedSourceTags.length} 个标签合并到目标标签中，源标签将被删除，此操作不可撤销。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleMerge}
            disabled={selectedSourceTags.length === 0 || !targetTagId}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Merge className="h-4 w-4 mr-2 inline" />
            确认合并
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentTags: React.FC = () => {
  const {
    contentTags,
    contentTagsLoading,
    fetchContentTags,
    createContentTag,
    updateContentTag,
    deleteContentTag,
    mergeContentTags
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    await fetchContentTags();
  };

  // 过滤和排序标签
  const filteredAndSortedTags = contentTags
    .filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tag.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && tag.is_active) ||
                           (filterStatus === 'inactive' && !tag.is_active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'usage_count':
          aValue = a.usage_count || 0;
          bValue = b.usage_count || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleDelete = async (tagId: string) => {
    if (window.confirm('确定要删除这个标签吗？删除后不可恢复。')) {
      await deleteContentTag(tagId);
      await loadTags();
    }
  };

  const handleSaveTag = async (data: any) => {
    try {
      if (editingTag) {
        await updateContentTag(editingTag.id, data);
      } else {
        await createContentTag(data);
      }
      setShowForm(false);
      setEditingTag(null);
      await loadTags();
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTag(null);
  };

  const handleTagSelect = (tagId: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTags.size === filteredAndSortedTags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(filteredAndSortedTags.map(tag => tag.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedTags.size === 0) return;
    
    if (window.confirm(`确定要删除选中的 ${selectedTags.size} 个标签吗？删除后不可恢复。`)) {
      for (const tagId of selectedTags) {
        await deleteContentTag(tagId);
      }
      setSelectedTags(new Set());
      await loadTags();
    }
  };

  const handleMergeTags = async (sourceTagIds: string[], targetTagId: string) => {
    try {
      await mergeContentTags(sourceTagIds, targetTagId);
      setShowMergeModal(false);
      setSelectedTags(new Set());
      await loadTags();
    } catch (error) {
      console.error('Failed to merge tags:', error);
    }
  };

  const handleExportTags = () => {
    const csvContent = [
      ['名称', '别名', '描述', '使用次数', '状态', '创建时间'].join(','),
      ...filteredAndSortedTags.map(tag => [
        tag.name,
        tag.slug,
        tag.description || '',
        tag.usage_count || 0,
        tag.is_active ? '启用' : '禁用',
        tag.created_at || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'content_tags.csv';
    link.click();
  };

  if (contentTagsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">内容标签管理</h1>
          <p className="text-gray-600 mt-1">管理内容标签和使用统计</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportTags}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建标签
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总标签数</p>
              <p className="text-2xl font-bold text-gray-900">{contentTags.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">启用标签</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentTags.filter(tag => tag.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总使用次数</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentTags.reduce((sum, tag) => sum + (tag.usage_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均使用次数</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentTags.length > 0 
                  ? Math.round(contentTags.reduce((sum, tag) => sum + (tag.usage_count || 0), 0) / contentTags.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部状态</option>
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name-asc">名称 A-Z</option>
                <option value="name-desc">名称 Z-A</option>
                <option value="usage_count-desc">使用次数 高-低</option>
                <option value="usage_count-asc">使用次数 低-高</option>
                <option value="created_at-desc">创建时间 新-旧</option>
                <option value="created_at-asc">创建时间 旧-新</option>
              </select>
            </div>

            {selectedTags.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  已选择 {selectedTags.size} 个标签
                </span>
                <button
                  onClick={() => setShowMergeModal(true)}
                  className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <Merge className="h-4 w-4 mr-1 inline" />
                  合并
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1 inline" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 标签列表 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTags.size === filteredAndSortedTags.length && filteredAndSortedTags.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标签
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用次数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTags.has(tag.id)}
                      onChange={() => handleTagSelect(tag.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white mr-3"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                      {tag.slug && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {tag.slug}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {tag.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {tag.usage_count || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tag.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tag.is_active ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-blue-600 hover:text-blue-900"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
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

          {filteredAndSortedTags.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? '没有找到匹配的标签' 
                : '暂无标签，点击上方按钮创建第一个标签'
              }
            </div>
          )}
        </div>
      </div>

      {/* 标签表单弹窗 */}
      {showForm && (
        <TagForm
          tag={editingTag}
          onSave={handleSaveTag}
          onCancel={handleCancelForm}
        />
      )}

      {/* 合并标签弹窗 */}
      {showMergeModal && (
        <MergeTagsModal
          tags={contentTags}
          onMerge={handleMergeTags}
          onCancel={() => setShowMergeModal(false)}
        />
      )}
    </div>
  );
};

export default ContentTags;