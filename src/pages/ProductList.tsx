import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { getProductsData, getCategoriesData } from '../data/mockData';
import { apiFetch } from '../lib/api';
import { Product, Category } from '../types';

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  const [priceMinBound, setPriceMinBound] = useState<number>(0);
  const [priceMaxBound, setPriceMaxBound] = useState<number>(100000);

  useEffect(() => {
    // 从URL参数获取初始值
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'created_at';
    const search = searchParams.get('search') || '';
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const minR = searchParams.get('minRating');
    const pageParam = Number(searchParams.get('page') || '1');
    const sizeParam = Number(searchParams.get('pageSize') || '12');
    
    setSelectedCategory(category);
    setSortBy(sort);
    setSearchTerm(search);
    setMinPrice(minP !== null ? Number(minP) : '');
    setMaxPrice(maxP !== null ? Number(maxP) : '');
    setMinRating(minR !== null ? Number(minR) : '');
    setPage(Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1);
    setPageSize([12, 24, 48].includes(sizeParam) ? sizeParam : 12);
    
    // 加载数据
    loadData(category, sort, search, minP ? Number(minP) : undefined, maxP ? Number(maxP) : undefined, minR ? Number(minR) : undefined);
    setCategories(getCategoriesData());
  }, [searchParams]);

  // 价格滑条变化后，防抖更新URL参数并重置到第一页
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({
        minPrice: minPrice === '' ? '' : String(minPrice),
        maxPrice: maxPrice === '' ? '' : String(maxPrice),
        page: 1,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  const loadData = async (
    category?: string,
    sort?: string,
    search?: string,
    minP?: number,
    maxP?: number,
    minR?: number
  ) => {
    setLoading(true);
    try {
      // 后端接口：优先尝试获取真实数据（包含 skus 以便价格与库存映射）
      const params = new URLSearchParams();
      params.set('include', 'skus');
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      if (typeof minP === 'number') params.set('minPrice', String(minP));
      if (typeof maxP === 'number') params.set('maxPrice', String(maxP));
      if (typeof minR === 'number') params.set('minRating', String(minR));
      params.set('page', String(page));
      params.set('limit', String(pageSize));
      const backend = await apiFetch<any>(`/api/products?${params.toString()}`);

      // 本地占位图片解析（与 mockData 保持一致的规则）
      const productKeywordImageMap: Record<string, string> = {
        '和田玉': '/images/hetian.svg',
        '观音': '/images/hetian.svg',
        '翡翠': '/images/jadeite.svg',
        '手镯': '/images/jadeite.svg',
        '玛瑙': '/images/agate.svg',
        '南红': '/images/agate.svg',
        '水晶': '/images/crystal.svg',
        '项链': '/images/crystal.svg'
      };
      const categoryDefaultImageMap: Record<string, string> = {
        hetian: '/images/hetian.svg',
        jadeite: '/images/jadeite.svg',
        agate: '/images/agate.svg',
        crystal: '/images/crystal.svg'
      };
      const resolveImage = (name: string, category?: string): string => {
        const text = name || '';
        for (const key of Object.keys(productKeywordImageMap)) {
          if (text.includes(key)) return productKeywordImageMap[key];
        }
        if (category && categoryDefaultImageMap[category]) return categoryDefaultImageMap[category];
        return '/guaranteed-antiques-logo.png';
      };

      const adapt = (p: any): Product => {
        const firstSku = Array.isArray(p?.skus) && p.skus.length ? p.skus[0] : undefined;
        const stock = Array.isArray(p?.skus)
          ? p.skus.reduce((sum: number, s: any) => sum + (Number(s?.stock ?? 0)), 0)
          : Number(p?.stock ?? 0);
        const catSlug = Array.isArray(p?.categories) && p.categories.length
          ? (p.categories[0]?.category?.slug || p.categories[0]?.category?.name)
          : (category || '');
        const img = resolveImage(p?.name ?? '未命名商品', catSlug || undefined);
        return {
          id: String(p?.id ?? ''),
          name: p?.name ?? '未命名商品',
          description: p?.description ?? '',
          price: Number(firstSku?.price ?? p?.price ?? 0),
          originalPrice: undefined,
          images: [img, img],
          category: catSlug || 'hetian',
          rating: Number(p?.rating ?? 4.8),
          reviewCount: Number(p?.reviewCount ?? 0),
          sales: Number(p?.sales ?? 0),
          stock,
          specifications: {},
          tags: Array.isArray(p?.tags) ? p.tags : [],
          createdAt: p?.createdAt ?? new Date().toISOString(),
          updatedAt: p?.updatedAt ?? new Date().toISOString(),
        } as Product;
      };

      const raw = Array.isArray(backend) ? backend : (backend?.data ?? []);
      let adapted: Product[] = Array.isArray(raw) ? raw.map(adapt) : [];
      setTotal(Array.isArray(backend) ? adapted.length : Number(backend?.total ?? adapted.length));

      // 动态设置价格滑条上下限（来自后端聚合范围）
      const apiMin = Number(backend?.priceMin ?? 0);
      const apiMax = Number(backend?.priceMax ?? 0);
      if (Number.isFinite(apiMin) && Number.isFinite(apiMax) && apiMax >= apiMin) {
        setPriceMinBound(apiMin);
        setPriceMaxBound(apiMax);
        // 边界变化时，必要时夹取当前选择值以避免越界
        setMinPrice(prev => (typeof prev === 'number' ? Math.max(apiMin, Math.min(prev, apiMax)) : prev));
        setMaxPrice(prev => (typeof prev === 'number' ? Math.max(apiMin, Math.min(prev, apiMax)) : prev));
      }

      // 过滤：分类与搜索
      if (category) {
        adapted = adapted.filter(p => p.category === category);
      }
      if (search) {
        adapted = adapted.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // 价格筛选（前端侧；评分筛选交由后端处理）
      if (typeof minP === 'number') {
        adapted = adapted.filter(p => p.price >= minP);
      }
      if (typeof maxP === 'number') {
        adapted = adapted.filter(p => p.price <= maxP);
      }

      // 排序（后端已处理价格/时间排序；这里保持与后端一致或仅在需要时补充）
      switch (sort) {
        case 'rating':
          adapted.sort((a, b) => b.rating - a.rating);
          break;
        case 'sales':
          adapted.sort((a, b) => b.sales - a.sales);
          break;
        default:
          // 价格与最新由后端返回的顺序决定，不再在前端重复排序
          break;
      }

      setProducts(adapted);
    } catch (err) {
      // 回退方案：使用本地 mock 数据，确保页面仍能正常展示
      const result = getProductsData({
        category: category || undefined,
        sort: sort as 'created_at' | 'price_asc' | 'price_desc' | 'sales' | 'rating',
        limit: pageSize,
        page,
        minPrice: typeof minP === 'number' ? minP : undefined,
        maxPrice: typeof maxP === 'number' ? maxP : undefined,
        search: search || undefined
      });
      let filteredProducts = result.data;
      // 回退时也动态计算价格上下限
      if (Array.isArray(filteredProducts) && filteredProducts.length) {
        const prices = filteredProducts.map(p => p.price).filter(p => Number.isFinite(p));
        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceMinBound(min);
          setPriceMaxBound(max);
          setMinPrice(prev => (typeof prev === 'number' ? Math.max(min, Math.min(prev, max)) : prev));
          setMaxPrice(prev => (typeof prev === 'number' ? Math.max(min, Math.min(prev, max)) : prev));
        }
      }
      if (typeof minR === 'number') {
        filteredProducts = filteredProducts.filter(product => product.rating >= minR);
      }
      setProducts(filteredProducts);
      setTotal(Number(result.total ?? filteredProducts.length));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const updateFilters = (newFilters: { category?: string; sort?: string; search?: string; minPrice?: string | number; maxPrice?: string | number; minRating?: string | number; page?: string | number; pageSize?: string | number }) => {
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
                    updateFilters({ category: e.target.value, page: 1 });
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

              {/* 价格区间（滑条） */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">价格区间</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>最低：{typeof minPrice === 'number' ? formatPrice(minPrice) : '不限'}</span>
                    <span>最高：{typeof maxPrice === 'number' ? formatPrice(maxPrice) : '不限'}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={priceMinBound}
                      max={priceMaxBound}
                      step={Math.max(1, Math.round((priceMaxBound - priceMinBound) / 100))}
                      value={typeof minPrice === 'number' ? Math.min(minPrice as number, typeof maxPrice === 'number' ? (maxPrice as number) : priceMaxBound) : priceMinBound}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        const clampedUpper = typeof maxPrice === 'number' ? Math.min(v, maxPrice as number) : v;
                        const clamped = Math.max(priceMinBound, Math.min(clampedUpper, priceMaxBound));
                        setMinPrice(clamped);
                      }}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={priceMinBound}
                      max={priceMaxBound}
                      step={Math.max(1, Math.round((priceMaxBound - priceMinBound) / 100))}
                      value={typeof maxPrice === 'number' ? Math.max(maxPrice as number, typeof minPrice === 'number' ? (minPrice as number) : priceMinBound) : priceMaxBound}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        const clampedLower = typeof minPrice === 'number' ? Math.max(v, minPrice as number) : v;
                        const clamped = Math.max(priceMinBound, Math.min(clampedLower, priceMaxBound));
                        setMaxPrice(clamped);
                      }}
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm text-gray-500 hover:text-primary-600 underline"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        updateFilters({ minPrice: '', maxPrice: '', page: 1 });
                      }}
                    >清空价格</button>
                  </div>
                </div>
              </div>

              {/* 最低评分（星级选择器） */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">最低评分</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1 rounded border text-sm ${minRating === '' ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-white hover:border-primary-500'}`}
                    onClick={() => { setMinRating(''); updateFilters({ minRating: '', page: 1 }); }}
                  >不限</button>
                  {[3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`px-3 py-1 rounded border text-sm flex items-center gap-2 ${minRating === n ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-white hover:border-primary-500'}`}
                      onClick={() => { setMinRating(n); updateFilters({ minRating: n, page: 1 }); }}
                    >
                      <span className="flex">{renderStars(n)}</span>
                      <span>≥ {n} 分</span>
                    </button>
                  ))}
                </div>
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
                    updateFilters({ sort: e.target.value, page: 1 });
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

              {/* 每页数量 */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">每页数量</label>
                <select
                  value={String(pageSize)}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    setPageSize(size);
                    updateFilters({ pageSize: size, page: 1 });
                  }}
                  className="input"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
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
              <>
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
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  共 {total} 件商品，当前第 {page} / {Math.max(1, Math.ceil(total / pageSize))} 页
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn"
                    disabled={page <= 1}
                    onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
                  >上一页</button>
                  <button
                    className="btn"
                    disabled={page >= Math.ceil(total / pageSize)}
                    onClick={() => updateFilters({ page: Math.min(Math.ceil(total / pageSize), page + 1) })}
                  >下一页</button>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;