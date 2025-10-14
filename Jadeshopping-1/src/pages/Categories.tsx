import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CategoryCard from '@/components/CategoryCard';
import { CategoryService } from '@/services/productService';
import { Category, CategoryFilters } from '@/types';

const categoryService = new CategoryService();

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    is_featured: undefined,
    sort: 'sort_order',
    order: 'asc',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const result = await categoryService.getCategories();
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError(result.error || 'Failed to load categories');
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 过滤和排序分类
  const filteredCategories = useMemo(() => {
    let result = categories.filter(category => {
      // 搜索过滤
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = category.name.toLowerCase().includes(searchTerm);
        const matchesDescription = category.description?.toLowerCase().includes(searchTerm);
        const matchesTags = category.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
        
        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // 精选过滤
      if (filters.is_featured !== undefined) {
        if (category.is_featured !== filters.is_featured) {
          return false;
        }
      }

      return true;
    });

    // 排序
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sort) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'product_count':
          aValue = a.product_count;
          bValue = b.product_count;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a.sort_order;
          bValue = b.sort_order;
      }

      if (filters.order === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return result;
  }, [categories, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFeaturedFilter = (featured?: boolean) => {
    setFilters(prev => ({ ...prev, is_featured: featured }));
  };

  const handleSortChange = (sort: CategoryFilters['sort'], order: CategoryFilters['order'] = 'asc') => {
    setFilters(prev => ({ ...prev, sort, order }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      is_featured: undefined,
      sort: 'sort_order',
      order: 'asc',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jade-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Categories</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-jade-600 text-white px-6 py-2 rounded-lg hover:bg-jade-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Product Categories - Jade Emporium</title>
        <meta name="description" content="Browse our rich collection of jade categories, including Hetian jade, jadeite, agate and various exquisite jade products" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our carefully curated jade treasures, from traditional Hetian jade to modern jadeite jewelry, each category carries profound cultural heritage
              </p>
            </div>

            {/* 统计信息 */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <div className="text-sm text-blue-700">Total Categories</div>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{categories.filter(c => c.is_featured).length}</div>
                <div className="text-sm text-amber-700">Featured Categories</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{categories.filter(c => c.product_count > 0).length}</div>
                <div className="text-sm text-green-700">Categories with Products</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.product_count, 0) / categories.length) : 0}
                </div>
                <div className="text-sm text-purple-700">Avg Products per Category</div>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选和搜索区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search category names, descriptions or tags..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 筛选按钮 */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleFeaturedFilter(undefined)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                    filters.is_featured === undefined
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFeaturedFilter(true)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                    filters.is_featured === true
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Featured Categories
                </button>
                <button
                  onClick={() => handleFeaturedFilter(false)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                    filters.is_featured === false
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Regular Categories
                </button>
              </div>
            </div>

            {/* 排序和视图选项 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
              {/* 排序选项 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={`${filters.sort}_${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('_') as [CategoryFilters['sort'], CategoryFilters['order']];
                    handleSortChange(sort, order);
                  }}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sort_order_asc">Default Sort</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                  <option value="product_count_desc">Most Products</option>
                  <option value="product_count_asc">Least Products</option>
                  <option value="created_at_desc">Newest First</option>
                  <option value="created_at_asc">Oldest First</option>
                </select>
              </div>

              {/* 视图模式和选项 */}
              <div className="flex items-center gap-4">
                {/* 子分类显示开关 */}
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showSubcategories}
                    onChange={(e) => setShowSubcategories(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Subcategories
                </label>

                {/* 视图模式切换 */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${
                      viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${
                      viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`p-1.5 rounded-md transition-colors duration-200 ${
                      viewMode === 'compact' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Compact View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 清除筛选 */}
            {(filters.search || filters.is_featured !== undefined || filters.sort !== 'sort_order' || filters.order !== 'asc') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* 结果统计 */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Found <span className="font-medium text-gray-900">{filteredCategories.length}</span> categories
              {filters.search && (
                <span>, search keyword: <span className="font-medium text-blue-600">"{filters.search}"</span></span>
              )}
            </p>
          </div>

          {/* 分类列表 */}
          {filteredCategories.length > 0 ? (
            <div className={`
              ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : ''}
              ${viewMode === 'list' ? 'space-y-4' : ''}
              ${viewMode === 'compact' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : ''}
            `}>
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  mode={viewMode}
                  showSubcategories={showSubcategories}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching categories found</h3>
              <p className="text-gray-600 mb-4">
                {filters.search ? 'Try adjusting your search keywords or ' : ''}try adjusting your filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;