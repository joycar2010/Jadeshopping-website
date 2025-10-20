import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Grid, List, Search, Filter } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types';

const Favorites: React.FC = () => {
  console.log('Favorites component is rendering'); // 调试信息
  
  const { user } = useUserStore();
  const { favorites, removeFavorite, clearFavorites } = useFavoriteStore();
  const { addToCart } = useCartStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  console.log('User:', user); // 调试信息
  console.log('Favorites:', favorites); // 调试信息

  if (!user) {
    console.log('User not logged in, showing login prompt'); // 调试信息
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-8">登录后查看收藏商品</p>
            <Link to="/login" className="btn-primary">
              去登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // 获取收藏分类
  const categories = ['all', ...new Set(favorites.map(fav => fav.category))];
  const categoryLabels: Record<string, string> = {
    all: '全部',
    jade: '玉石',
    bracelet: '手镯',
    pendant: '吊坠',
    ring: '戒指',
    ornament: '摆件'
  };

  // 筛选收藏商品
  const filteredFavorites = favorites.filter(favorite => {
    const matchesCategory = selectedCategory === 'all' || favorite.category === selectedCategory;
    const matchesSearch = favorite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectItem = (productId: string) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(fav => fav.id));
    }
  };

  const handleBatchRemove = () => {
    if (confirm(`确定要删除选中的 ${selectedItems.length} 个收藏商品吗？`)) {
      selectedItems.forEach(productId => {
        removeFavorite(productId);
      });
      setSelectedItems([]);
      setShowBatchActions(false);
    }
  };

  const handleBatchAddToCart = () => {
    selectedItems.forEach(productId => {
      const favorite = favorites.find(fav => fav.id === productId);
      if (favorite) {
        addToCart(favorite, 1);
      }
    });
    alert(`已将 ${selectedItems.length} 个商品添加到购物车`);
    setSelectedItems([]);
    setShowBatchActions(false);
  };

  const handleAddToCart = (favorite: Product) => {
    addToCart(favorite, 1);
    alert('商品已添加到购物车');
  };

  const ProductCard = ({ favorite }: { favorite: Product }) => (
    <div className="card group relative">
      {showBatchActions && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={selectedItems.includes(favorite.id)}
            onChange={() => handleSelectItem(favorite.id)}
            className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={favorite.images[0]}
          alt={favorite.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* 悬浮操作按钮 */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => removeFavorite(favorite.id)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Heart className="h-4 w-4 fill-current text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/products/${favorite.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-500 transition-colors">
            {favorite.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {favorite.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-red-500">
            {formatPrice(favorite.price)}
          </span>
          <button
            onClick={() => handleAddToCart(favorite)}
            className="flex items-center space-x-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>加购物车</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ favorite }: { favorite: Product }) => (
    <div className="card p-4 flex items-center space-x-4">
      {showBatchActions && (
        <input
          type="checkbox"
          checked={selectedItems.includes(favorite.id)}
          onChange={() => handleSelectItem(favorite.id)}
          className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
        />
      )}
      
      <img
        src={favorite.images[0]}
        alt={favorite.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <Link to={`/products/${favorite.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-500 transition-colors">
            {favorite.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {favorite.description}
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold text-red-500">
            {formatPrice(favorite.price)}
          </span>
          <span className="text-sm text-gray-500">
            分类: {categoryLabels[favorite.category] || favorite.category}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleAddToCart(favorite)}
          className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>加购物车</span>
        </button>
        <button
          onClick={() => removeFavorite(favorite.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的收藏</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              共 {filteredFavorites.length} 件商品
            </span>
            {favorites.length > 0 && (
              <button
                onClick={() => setShowBatchActions(!showBatchActions)}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>{showBatchActions ? '取消批量' : '批量管理'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 批量操作栏 */}
        {showBatchActions && (
          <div className="card p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredFavorites.length && filteredFavorites.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span>全选</span>
                </label>
                <span className="text-gray-600">
                  已选择 {selectedItems.length} 件商品
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBatchAddToCart}
                  disabled={selectedItems.length === 0}
                  className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>批量加购物车</span>
                </button>
                <button
                  onClick={handleBatchRemove}
                  disabled={selectedItems.length === 0}
                  className="flex items-center space-x-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>批量删除</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="搜索收藏商品..."
              />
            </div>
            
            {/* 分类筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 whitespace-nowrap">分类:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field min-w-[120px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 视图切换 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 收藏商品列表 */}
        {filteredFavorites.length === 0 ? (
          <div className="card p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm || selectedCategory !== 'all' ? '未找到相关收藏' : '暂无收藏商品'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? '请尝试其他搜索条件' 
                : '快去收藏您喜欢的玉石商品吧！'
              }
            </p>
            <Link to="/products" className="btn-primary">
              去购物
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredFavorites.map((favorite) => (
              viewMode === 'grid' 
                ? <ProductCard key={favorite.id} favorite={favorite} />
                : <ProductListItem key={favorite.id} favorite={favorite} />
            ))}
          </div>
        )}

        {/* 清空收藏 */}
        {favorites.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                if (confirm('确定要清空所有收藏吗？此操作不可恢复。')) {
                  clearFavorites();
                }
              }}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              清空所有收藏
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;