import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  ToggleLeft,
  ToggleRight,
  Package,
  TrendingUp,
  Calendar,
  User,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    categories,
    allProducts,
    categoryOperationLogs,
    categoryOperationLogsLoading,
    fetchCategories,
    fetchAllProducts,
    fetchCategoryOperationLogs,
    deleteCategory,
    updateCategory
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'logs'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchAllProducts();
      fetchCategoryOperationLogs(id);
    }
  }, [id]);

  const category = categories.find(c => c.id === id);
  const categoryProducts = allProducts.filter(p => p.category_id === id);

  const filteredProducts = categoryProducts.filter(product => {
    if (productSearch && !product.name.toLowerCase().includes(productSearch.toLowerCase())) {
      return false;
    }
    if (productFilter !== 'all') {
      if (productFilter === 'active' && product.status !== 'active') return false;
      if (productFilter === 'inactive' && product.status === 'active') return false;
      if (productFilter === 'draft' && product.status !== 'draft') return false;
    }
    return true;
  });

  const handleToggleStatus = async () => {
    if (!category) return;
    
    const success = await updateCategory(category.id, { 
      is_active: !category.is_active 
    });
    
    if (success) {
      fetchCategories();
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    
    if (confirm(`确定要删除分类"${category.name}"吗？此操作不可恢复。`)) {
      const success = await deleteCategory(category.id);
      if (success) {
        navigate('/admin/categories');
      }
    }
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 mb-2">分类不存在</div>
          <Link
            to="/admin/categories"
            className="text-blue-600 hover:text-blue-800"
          >
            返回分类列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/categories')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {category.name}
                {category.is_featured && (
                  <Star className="h-5 w-5 text-yellow-500 fill-current ml-2" />
                )}
              </h1>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
              category.is_active
                ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {category.is_active ? (
              <ToggleRight className="h-4 w-4 mr-2" />
            ) : (
              <ToggleLeft className="h-4 w-4 mr-2" />
            )}
            {category.is_active ? '已启用' : '已禁用'}
          </button>

          <Link
            to={`/admin/categories/edit/${category.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </button>
        </div>
      </div>

      {/* 分类信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">商品数量</dt>
                  <dd className="text-lg font-medium text-gray-900">{category.product_count || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">总销量</dt>
                  <dd className="text-lg font-medium text-gray-900">{category.total_sales || 0}</dd>
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
                  <span className="text-white text-sm font-medium">级</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">分类级别</dt>
                  <dd className="text-lg font-medium text-gray-900">第 {category.level} 级</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">创建时间</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {new Date(category.created_at).toLocaleDateString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分类详细信息 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">分类信息</h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">分类ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{category.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">排序值</dt>
              <dd className="mt-1 text-sm text-gray-900">{category.sort_order}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">父级分类</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {category.parent_id ? (
                  <Link
                    to={`/admin/categories/${category.parent_id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {categories.find(c => c.id === category.parent_id)?.name || '未知'}
                  </Link>
                ) : (
                  '顶级分类'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">状态</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.is_active ? '启用' : '禁用'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">SEO标题</dt>
              <dd className="mt-1 text-sm text-gray-900">{category.seo_title || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">SEO关键词</dt>
              <dd className="mt-1 text-sm text-gray-900">{category.seo_keywords || '-'}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">SEO描述</dt>
              <dd className="mt-1 text-sm text-gray-900">{category.seo_description || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 横幅图片 */}
      {category.banner_image && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">横幅图片</h3>
          </div>
          <div className="px-6 py-4">
            <img
              src={category.banner_image}
              alt="分类横幅"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* 标签页 */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              商品列表 ({categoryProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              操作日志
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* 商品搜索和筛选 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="搜索商品..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">全部状态</option>
                    <option value="active">在售</option>
                    <option value="inactive">下架</option>
                    <option value="draft">草稿</option>
                  </select>
                </div>

                <Link
                  to={`/admin/products/new?category=${category.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  添加商品
                </Link>
              </div>

              {/* 商品列表 */}
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          商品信息
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          价格
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          库存
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
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
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.images[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  SKU: {product.sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">¥{product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.stock}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.status === 'active' ? '在售' : 
                               product.status === 'draft' ? '草稿' : '下架'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.updated_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/products/${product.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">该分类下暂无商品</div>
                  <Link
                    to={`/admin/products/new?category=${category.id}`}
                    className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    添加第一个商品
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              {categoryOperationLogsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : categoryOperationLogs.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {categoryOperationLogs.map((log, logIdx) => (
                      <li key={log.id}>
                        <div className="relative pb-8">
                          {logIdx !== categoryOperationLogs.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <User className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-900">
                                    {log.operator_name}
                                  </span>{' '}
                                  {log.operation_description}
                                </p>
                                {log.old_value && log.new_value && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                                      {log.old_value}
                                    </span>
                                    {' → '}
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                      {log.new_value}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(log.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500">暂无操作日志</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;