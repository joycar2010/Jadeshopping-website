import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Move,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  FolderOpen,
  Folder,
  FileText,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react';

interface CategoryTreeItemProps {
  category: any;
  level: number;
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
}

const CategoryTreeItem: React.FC<CategoryTreeItemProps> = ({
  category,
  level,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMove,
  expandedItems,
  onToggleExpand
}) => {
  const [showActions, setShowActions] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedItems.has(category.id);

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-3 hover:bg-gray-50 border-l-2 ${
          category.is_active ? 'border-green-400' : 'border-gray-200'
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* 展开/收起按钮 */}
        <button
          onClick={() => onToggleExpand(category.id)}
          className="mr-2 p-1 hover:bg-gray-200 rounded"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* 文件夹图标 */}
        <div className="mr-3">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )
          ) : (
            <FileText className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {/* 分类信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium text-gray-900 truncate">
              {category.name}
            </span>
            {category.slug && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {category.slug}
              </span>
            )}
          </div>
          {category.description && (
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {category.description}
            </p>
          )}
        </div>

        {/* 统计信息 */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            {category.content_count || 0}
          </span>
          <span className="flex items-center">
            <BarChart3 className="h-3 w-3 mr-1" />
            {category.view_count || 0}
          </span>
        </div>

        {/* 可见性状态 */}
        <button
          onClick={() => onToggleVisibility(category.id, !category.is_active)}
          className="ml-2 p-1 hover:bg-gray-200 rounded"
          title={category.is_active ? '隐藏分类' : '显示分类'}
        >
          {category.is_active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* 操作按钮 */}
        {showActions && (
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => onMove(category.id, 'up')}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
              title="上移"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => onMove(category.id, 'down')}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
              title="下移"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
            <button
              onClick={() => onEdit(category)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="编辑"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="删除"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* 子分类 */}
      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child: any) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
              onMove={onMove}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryFormProps {
  category?: any;
  parentCategories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: category?.parent_id || '',
    is_active: category?.is_active ?? true,
    sort_order: category?.sort_order || 0,
    seo_title: category?.seo_title || '',
    seo_description: category?.seo_description || '',
    seo_keywords: category?.seo_keywords || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 自动生成 slug
    if (field === 'name' && !category) {
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
      newErrors.name = '分类名称不能为空';
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? '编辑分类' : '创建分类'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入分类名称"
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
              placeholder="请输入分类描述"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                父分类
              </label>
              <select
                value={formData.parent_id}
                onChange={(e) => handleInputChange('parent_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">无父分类</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* SEO 设置 */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO 设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO 标题
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => handleInputChange('seo_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO 标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO 描述
                </label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO 描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关键词
                </label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="关键词，用逗号分隔"
                />
              </div>
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
              启用分类
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
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

const ContentCategories: React.FC = () => {
  const {
    contentCategories,
    contentCategoriesLoading,
    fetchContentCategories,
    createContentCategory,
    updateContentCategory,
    deleteContentCategory,
    reorderContentCategories
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    await fetchContentCategories();
  };

  // 构建树形结构
  const buildCategoryTree = (categories: any[]) => {
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // 创建映射
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // 构建树形结构
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id);
      if (category.parent_id && categoryMap.has(category.parent_id)) {
        categoryMap.get(category.parent_id).children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  };

  // 过滤分类
  const filteredCategories = contentCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryTree = buildCategoryTree(filteredCategories);

  // 获取可作为父分类的分类列表
  const getParentCategoryOptions = () => {
    return contentCategories.filter(cat => 
      !editingCategory || cat.id !== editingCategory.id
    );
  };

  const handleToggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedItems(newExpanded);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('确定要删除这个分类吗？删除后不可恢复。')) {
      await deleteContentCategory(categoryId);
      await loadCategories();
    }
  };

  const handleToggleVisibility = async (categoryId: string, isActive: boolean) => {
    await updateContentCategory(categoryId, { is_active: isActive });
    await loadCategories();
  };

  const handleMove = async (categoryId: string, direction: 'up' | 'down') => {
    // 这里应该实现分类排序逻辑
    console.log(`Move category ${categoryId} ${direction}`);
  };

  const handleSaveCategory = async (data: any) => {
    try {
      if (editingCategory) {
        await updateContentCategory(editingCategory.id, data);
      } else {
        await createContentCategory(data);
      }
      setShowForm(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const addIds = (categories: any[]) => {
      categories.forEach(cat => {
        allIds.add(cat.id);
        if (cat.children) {
          addIds(cat.children);
        }
      });
    };
    addIds(categoryTree);
    setExpandedItems(allIds);
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (contentCategoriesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">内容分类管理</h1>
          <p className="text-gray-600 mt-1">管理内容分类的层级结构和设置</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          创建分类
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总分类数</p>
              <p className="text-2xl font-bold text-gray-900">{contentCategories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">启用分类</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentCategories.filter(cat => cat.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总内容数</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentCategories.reduce((sum, cat) => sum + (cat.content_count || 0), 0)}
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
              <p className="text-sm font-medium text-gray-600">总浏览量</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentCategories.reduce((sum, cat) => sum + (cat.view_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索分类..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={expandAll}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                展开全部
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                收起全部
              </button>
            </div>
          </div>
        </div>

        {/* 分类树 */}
        <div className="divide-y divide-gray-200">
          {categoryTree.length > 0 ? (
            categoryTree.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                level={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
                onMove={handleMove}
                expandedItems={expandedItems}
                onToggleExpand={handleToggleExpand}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? '没有找到匹配的分类' : '暂无分类，点击上方按钮创建第一个分类'}
            </div>
          )}
        </div>
      </div>

      {/* 分类表单弹窗 */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          parentCategories={getParentCategoryOptions()}
          onSave={handleSaveCategory}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default ContentCategories;