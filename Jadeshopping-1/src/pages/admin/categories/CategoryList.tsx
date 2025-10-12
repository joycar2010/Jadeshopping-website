import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Star,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { CategoryTreeNode, CategoryManagementFilters } from '../../../types';

const CategoryList: React.FC = () => {
  const {
    categories,
    categoriesLoading,
    categoryTree,
    categoryTreeLoading,
    categoryStats,
    categoryStatsLoading,
    selectedCategories,
    categoryFilters,
    fetchCategories,
    fetchCategoryTree,
    fetchCategoryStats,
    deleteCategory,
    updateCategory,
    batchUpdateCategories,
    setCategoryFilters,
    resetCategoryFilters,
    toggleCategorySelection,
    selectAllCategories,
    clearCategorySelection,
    expandCategoryNode,
    collapseCategoryNode
  } = useStore();

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('tree');

  useEffect(() => {
    fetchCategories();
    fetchCategoryTree();
    fetchCategoryStats();
  }, []);

  const handleSearch = (value: string) => {
    setCategoryFilters({ ...categoryFilters, search: value });
  };

  const handleStatusFilter = (status: string) => {
    setCategoryFilters({ ...categoryFilters, status });
  };

  const handleBatchDelete = async () => {
    if (selectedCategories.length === 0) return;
    
    if (confirm(`确定要删除选中的 ${selectedCategories.length} 个分类吗？`)) {
      for (const categoryId of selectedCategories) {
        await deleteCategory(categoryId);
      }
      clearCategorySelection();
      fetchCategories();
      fetchCategoryTree();
    }
  };

  const handleBatchStatusChange = async (isActive: boolean) => {
    if (selectedCategories.length === 0) return;
    
    await batchUpdateCategories({
      category_ids: selectedCategories,
      updates: { is_active: isActive }
    });
    clearCategorySelection();
    fetchCategories();
    fetchCategoryTree();
  };

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    await updateCategory(categoryId, { is_active: !currentStatus });
    fetchCategories();
    fetchCategoryTree();
  };

  const renderCategoryRow = (category: any, level: number = 0) => (
    <tr key={category.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedCategories.includes(category.id)}
          onChange={() => toggleCategorySelection(category.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="h-8 w-8 rounded-lg object-cover mr-3"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
            <div className="text-sm text-gray-500">{category.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{category.product_count || 0}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{category.sort_order}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => handleToggleStatus(category.id, category.is_active)}
          className="flex items-center"
        >
          {category.is_active ? (
            <ToggleRight className="h-5 w-5 text-green-500" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {category.is_featured && (
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(category.updated_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/categories/${category.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/categories/edit/${category.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              if (confirm('确定要删除这个分类吗？')) {
                deleteCategory(category.id);
                fetchCategories();
                fetchCategoryTree();
              }
            }}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderTreeNode = (node: CategoryTreeNode, level: number = 0) => (
    <React.Fragment key={node.id}>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedCategories.includes(node.id)}
            onChange={() => toggleCategorySelection(node.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {node.children.length > 0 && (
              <button
                onClick={() => node.expanded ? collapseCategoryNode(node.id) : expandCategoryNode(node.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {node.expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {node.image && (
              <img
                src={node.image}
                alt={node.name}
                className="h-8 w-8 rounded-lg object-cover mr-3"
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">{node.name}</div>
              <div className="text-sm text-gray-500">{node.description}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900">{node.product_count || 0}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900">{node.sort_order}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => handleToggleStatus(node.id, node.is_active)}
            className="flex items-center"
          >
            {node.is_active ? (
              <ToggleRight className="h-5 w-5 text-green-500" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {node.is_featured && (
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(node.updated_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Link
              to={`/admin/categories/${node.id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to={`/admin/categories/edit/${node.id}`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                if (confirm('确定要删除这个分类吗？')) {
                  deleteCategory(node.id);
                  fetchCategories();
                  fetchCategoryTree();
                }
              }}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {node.expanded && node.children.map(child => renderTreeNode(child, level + 1))}
    </React.Fragment>
  );

  const filteredCategories = categories.filter(category => {
    if (categoryFilters.search && !category.name.toLowerCase().includes(categoryFilters.search.toLowerCase())) {
      return false;
    }
    if (categoryFilters.status !== 'all') {
      if (categoryFilters.status === 'active' && !category.is_active) return false;
      if (categoryFilters.status === 'inactive' && category.is_active) return false;
    }
    return true;
  });

  if (categoriesLoading || categoryTreeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理商品分类，支持多级分类和批量操作
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增分类
        </Link>
      </div>

      {/* 统计卡片 */}
      {categoryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">总</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">总分类数</dt>
                    <dd className="text-lg font-medium text-gray-900">{categoryStats.total_categories}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">活</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">活跃分类</dt>
                    <dd className="text-lg font-medium text-gray-900">{categoryStats.active_categories}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">商</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">有商品分类</dt>
                    <dd className="text-lg font-medium text-gray-900">{categoryStats.categories_with_products}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">层</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">最大层级</dt>
                    <dd className="text-lg font-medium text-gray-900">{categoryStats.max_depth}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索分类名称..."
                  value={categoryFilters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={categoryFilters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  列表
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    viewMode === 'tree' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  树形
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedCategories.length > 0 && (
                <>
                  <span className="text-sm text-gray-500">
                    已选择 {selectedCategories.length} 项
                  </span>
                  <button
                    onClick={() => handleBatchStatusChange(true)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  >
                    批量启用
                  </button>
                  <button
                    onClick={() => handleBatchStatusChange(false)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    批量禁用
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    批量删除
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  fetchCategories();
                  fetchCategoryTree();
                  fetchCategoryStats();
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 分类表格 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === categories.length && categories.length > 0}
                    onChange={() => {
                      if (selectedCategories.length === categories.length) {
                        clearCategorySelection();
                      } else {
                        selectAllCategories();
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  推荐
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {viewMode === 'tree' 
                ? categoryTree.map(node => renderTreeNode(node))
                : filteredCategories.map(category => renderCategoryRow(category))
              }
            </tbody>
          </table>
        </div>

        {(viewMode === 'list' ? filteredCategories : categoryTree).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">暂无分类数据</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;