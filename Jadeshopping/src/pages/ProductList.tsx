import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { getProductsData, getCategoriesData } from '../data/mockData';
import { Product, Category } from '../types';

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    // 从URL参数获取初始值
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'created_at';
    const search = searchParams.get('search') || '';
    
    setSelectedCategory(category);
    setSortBy(sort);
    setSearchTerm(search);
    
    // 加载数据
    loadData(category, sort, search);
    setCategories(getCategoriesData());
  }, [searchParams]);

  const loadData = (category?: string, sort?: string, search?: string) => {
    setLoading(true);
    const result = getProductsData({
      category: category || undefined,
      sort: sort as 'created_at' | 'price_asc' | 'price_desc' | 'sales' | 'rating',
      limit: 20,
      offset: 0
    });
    
    let filteredProducts = result.data;
    
    // 搜索过滤
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setProducts(filteredProducts);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const updateFilters = (newFilters: { category?: string; sort?: string; search?: string }) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="gradient-jade py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gradient">玉石商品</h1>
          <p className="mt-2 text-gray-600">精选优质玉石，传承千年文化</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏筛选 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                筛选条件
              </h3>
              
              {/* 搜索框 */}
              <form onSubmit={handleSearch} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搜索商品
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="输入商品名称..."
                    className="input pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* 分类筛选 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品分类
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    updateFilters({ category: e.target.value });
                  }}
                  className="input"
                >
                  <option value="">全部分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 排序 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排序方式
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    updateFilters({ sort: e.target.value });
                  }}
                  className="input"
                >
                  <option value="created_at">最新上架</option>
                  <option value="price_asc">价格从低到高</option>
                  <option value="price_desc">价格从高到低</option>
                  <option value="sales">销量排序</option>
                  <option value="rating">评分排序</option>
                </select>
              </div>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">暂无商品</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="card-hover group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="price">{formatPrice(product.price)}</span>
                        <div className="flex items-center">
                          <div className="flex mr-1">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({product.rating})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>销量: {product.sales}</span>
                        <span>库存: {product.stock}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;