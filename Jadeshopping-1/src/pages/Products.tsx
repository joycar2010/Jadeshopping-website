import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import { mockProducts, mockCategories } from '@/data/mockData'
import { useStore } from '@/store/useStore'
import type { Product } from '@/types'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
type ViewMode = 'grid' | 'list'

const Products: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  const { addToCart, toggleFavorite, isFavorite } = useStore()

  // 从URL参数中获取分类ID并设置初始状态
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  // 筛选和排序商品
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice && product.is_active
    })

    // 排序
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // 保持默认顺序
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, priceRange, sortBy])

  // 分页
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max])
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setPriceRange([0, 20000])
    setSortBy('default')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">玉石精品</h1>
          <p className="text-gray-600">发现千年传承的玉石之美</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏筛选 - 桌面端 */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">筛选条件</h3>
              
              {/* 分类筛选 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">商品分类</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="text-jade-600 focus:ring-jade-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">全部商品</span>
                  </label>
                  {mockCategories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="text-jade-600 focus:ring-jade-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 价格筛选 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">价格区间</h4>
                <div className="space-y-2">
                  {[
                    { label: '全部价格', min: 0, max: 20000 },
                    { label: '￥500以下', min: 0, max: 500 },
                    { label: '￥500-2000', min: 500, max: 2000 },
                    { label: '￥2000-5000', min: 2000, max: 5000 },
                    { label: '￥5000-10000', min: 5000, max: 10000 },
                    { label: '￥10000以上', min: 10000, max: 20000 },
                  ].map(range => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange[0] === range.min && priceRange[1] === range.max}
                        onChange={() => handlePriceRangeChange(range.min, range.max)}
                        className="text-jade-600 focus:ring-jade-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 重置筛选 */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 text-sm text-jade-600 border border-jade-600 rounded-md hover:bg-jade-50 transition-colors"
              >
                重置筛选
              </button>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1">
            {/* 搜索和工具栏 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* 搜索框 */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索商品..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* 移动端筛选按钮 */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    筛选
                  </button>

                  {/* 排序 */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    >
                      <option value="default">默认排序</option>
                      <option value="price-asc">价格从低到高</option>
                      <option value="price-desc">价格从高到低</option>
                      <option value="name-asc">名称A-Z</option>
                      <option value="name-desc">名称Z-A</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* 视图切换 */}
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-jade-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-jade-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 移动端筛选面板 */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 分类筛选 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">商品分类</h4>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    >
                      <option value="all">全部商品</option>
                      {mockCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 价格筛选 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">价格区间</h4>
                    <select
                      value={`${priceRange[0]}-${priceRange[1]}`}
                      onChange={(e) => {
                        const [min, max] = e.target.value.split('-').map(Number)
                        handlePriceRangeChange(min, max)
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    >
                      <option value="0-20000">全部价格</option>
                      <option value="0-500">￥500以下</option>
                      <option value="500-2000">￥500-2000</option>
                      <option value="2000-5000">￥2000-5000</option>
                      <option value="5000-10000">￥5000-10000</option>
                      <option value="10000-20000">￥10000以上</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 商品结果统计 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                共找到 <span className="font-medium text-gray-900">{filteredAndSortedProducts.length}</span> 件商品
              </p>
            </div>

            {/* 商品网格 */}
            {paginatedProducts.length > 0 ? (
              <div className={`grid gap-6 mb-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {paginatedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                    onAddToCart={addToCart}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关商品</h3>
                <p className="text-gray-600 mb-4">请尝试调整筛选条件或搜索关键词</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-jade-600 text-white rounded-md hover:bg-jade-700 transition-colors"
                >
                  重置筛选
                </button>
              </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-jade-600 text-white border-jade-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products