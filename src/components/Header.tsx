import React, { useState, useRef, useEffect } from 'react';
import Avatar from './ui/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Gift, Truck, Star, ChevronDown, Settings, LogOut, Package, UserCircle, ChevronRight, Grid3X3 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { useLogoStore } from '../store/useLogoStore';

// SHEIN风格的分类数据结构
interface SubCategory {
  name: string;
  path: string;
  image: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface MainCategory {
  id: string;
  name: string;
  path: string;
  subcategories: SubCategory[];
  isNew?: boolean;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartMenu, setShowCartMenu] = useState(false);
  
  const { headerLogoSrc, setHeaderLogo, swapLogos } = useLogoStore();
  
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const cartMenuRef = useRef<HTMLDivElement>(null);
  
  const { getTotalItems, items, totalAmount } = useCartStore();
  const { user, logout } = useUserStore();
  const { locale, toggleLocale } = useLocaleStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string;
    setHeaderLogo(result);
  };
  reader.readAsDataURL(file);
};

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target as Node)) {
        setShowCategoriesMenu(false);
        setActiveCategory(null);
      }
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
        setShowCartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('swapLogo') && !sessionStorage.getItem('logo-swapped')) {
      swapLogos();
      sessionStorage.setItem('logo-swapped', '1');
    }
  }, []);

  // SHEIN风格的分类数据
  const categoriesData: MainCategory[] = [
    {
      id: 'new-in',
      name: '新品上市',
      path: '/products?sort=newest',
      isNew: true,
      subcategories: [
        { name: '和田玉新品', path: '/products?category=hetian&sort=newest', image: '/images/hetian.svg', isNew: true },
        { name: '翡翠新品', path: '/products?category=jadeite&sort=newest', image: '/images/jadeite.svg', isNew: true },
        { name: '水晶新品', path: '/products?category=crystal&sort=newest', image: '/images/crystal.svg', isNew: true },
        { name: '玛瑙新品', path: '/products?category=agate&sort=newest', image: '/images/agate.svg', isNew: true }
      ]
    },
    {
      id: 'sale',
      name: '限时优惠',
      path: '/products?discount=true',
      subcategories: [
        { name: '特价和田玉', path: '/products?category=hetian&discount=true', image: '/images/hetian.svg' },
        { name: '特价翡翠', path: '/products?category=jadeite&discount=true', image: '/images/jadeite.svg' },
        { name: '特价水晶', path: '/products?category=crystal&discount=true', image: '/images/crystal.svg' },
        { name: '特价玛瑙', path: '/products?category=agate&discount=true', image: '/images/agate.svg' }
      ]
    },
    {
      id: 'hetian',
      name: '和田玉',
      path: '/products?category=hetian',
      subcategories: [
        { name: '吊坠', path: '/products?category=hetian&type=pendant', image: '/images/hetian.svg' },
        { name: '手镯', path: '/products?category=hetian&type=bracelet', image: '/images/hetian.svg' },
        { name: '戒指', path: '/products?category=hetian&type=ring', image: '/images/hetian.svg' },
        { name: '摆件', path: '/products?category=hetian&type=ornament', image: '/images/hetian.svg' },
        { name: '原石', path: '/products?category=hetian&type=raw', image: '/images/hetian.svg' }
      ]
    },
    {
      id: 'jadeite',
      name: '翡翠',
      path: '/products?category=jadeite',
      subcategories: [
        { name: '手镯', path: '/products?category=jadeite&type=bracelet', image: '/images/jadeite.svg', isHot: true },
        { name: '吊坠', path: '/products?category=jadeite&type=pendant', image: '/images/jadeite.svg' },
        { name: '戒指', path: '/products?category=jadeite&type=ring', image: '/images/jadeite.svg' },
        { name: '耳饰', path: '/products?category=jadeite&type=earring', image: '/images/jadeite.svg' },
        { name: '摆件', path: '/products?category=jadeite&type=ornament', image: '/images/jadeite.svg' }
      ]
    },
    {
      id: 'crystal',
      name: '水晶',
      path: '/products?category=crystal',
      subcategories: [
        { name: '球体', path: '/products?category=crystal&type=sphere', image: '/images/crystal.svg' },
        { name: '摆件', path: '/products?category=crystal&type=ornament', image: '/images/crystal.svg' },
        { name: '首饰', path: '/products?category=crystal&type=jewelry', image: '/images/crystal.svg' },
        { name: '原石', path: '/products?category=crystal&type=raw', image: '/images/crystal.svg' },
        { name: '手串', path: '/products?category=crystal&type=beads', image: '/images/crystal.svg' }
      ]
    },
    {
      id: 'agate',
      name: '玛瑙',
      path: '/products?category=agate',
      subcategories: [
        { name: '项链', path: '/products?category=agate&type=necklace', image: '/images/agate.svg' },
        { name: '手串', path: '/products?category=agate&type=bracelet', image: '/images/agate.svg' },
        { name: '摆件', path: '/products?category=agate&type=ornament', image: '/images/agate.svg' },
        { name: '原石', path: '/products?category=agate&type=raw', image: '/images/agate.svg' },
        { name: '雕件', path: '/products?category=agate&type=carving', image: '/images/agate.svg' }
      ]
    }
  ];

  // 顶部主导航项
  const topNavItems = [
    { name: '新品上市', path: '/products?sort=newest', isNew: true },
    { name: '热销推荐', path: '/products?sort=sales' },
    { name: '限时优惠', path: '/products?discount=true' },
    { name: '精品收藏', path: '/products?filter=精品' },
    { name: '礼品定制', path: '/products?filter=礼品' },
    { name: '回购中心', path: '/buyback' }
  ];

  const quickFilters = [
    '新品', '热销', '特价', '精品', '收藏', '礼品'
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* 顶部促销横幅 */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-4">
          <Gift className="h-4 w-4" />
          <span>{locale === 'zh' ? '新用户专享：首单立减$100 | 全场包邮 | 7天无理由退换' : 'New users: $100 off first order | Free shipping | 7-day returns'}</span>
          <Truck className="h-4 w-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主导航栏 */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={headerLogoSrc}
              alt="Guaranteed antiques logo"
              className="object-contain h-auto max-w-full"
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                const halfW = Math.max(1, Math.round(img.naturalWidth / 2));
                img.style.width = `${halfW}px`;
                img.style.height = 'auto';
              }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/guaranteed-antiques-logo.png'; }}
            />
            <h1 className="text-xl font-semibold text-gradient">Guaranteed antiques</h1>
          </Link>

          {/* 上传 LOGO */}
          <div className="hidden md:flex items-center gap-3">
            <input
              id="logoUpload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* 搜索框 */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="搜索和田玉、翡翠、玛瑙、水晶..."
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
                    搜索
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-6">
            {/* 收藏 */}
            <Link
              to="/favorites"
              className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm">收藏</span>
            </Link>

            {/* 购物车 */}
            <div 
              className="relative" 
              ref={cartMenuRef}
              onMouseEnter={() => setShowCartMenu(true)}
              onMouseLeave={() => setShowCartMenu(false)}
            >
              <Link
                to="/cart"
                className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="hidden md:block text-sm">购物车</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* 购物车悬停菜单 */}
              {showCartMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-lg border border-gray-200 z-50 w-80">
                  {items.length > 0 ? (
                    <div className="p-4">
                      {/* 购物车标题 */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">购物车</h3>
                        <span className="text-sm text-gray-500">{getTotalItems()} 件商品</span>
                      </div>

                      {/* 商品列表 */}
                      <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">数量: {item.quantity}</span>
                                <span className="text-sm font-semibold text-red-600">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="text-center py-2">
                            <span className="text-sm text-gray-500">还有 {items.length - 3} 件商品...</span>
                          </div>
                        )}
                      </div>

                      {/* 总价 */}
                      <div className="border-t border-gray-100 pt-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-gray-900">总计:</span>
                          <span className="text-lg font-bold text-red-600">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="space-y-2">
                        <Link
                          to="/cart"
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors block"
                        >
                          查看购物车
                        </Link>
                        <Link
                          to="/checkout"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors block"
                        >
                          去结算
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-4">购物车是空的</p>
                      <Link
                        to="/products"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        去购物
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 用户菜单 */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name || '用户头像'}
                    size={32}
                    shape="circle"
                  />
                  <span className="hidden md:block font-medium text-sm">{user.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {/* 用户下拉菜单 */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 py-2 min-w-48 z-50">
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle className="h-4 w-4 mr-3" />
                      个人中心
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <Package className="h-4 w-4 mr-3" />
                      我的订单
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="h-4 w-4 mr-3" />
                      我的收藏
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      账户设置
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="text-sm">登录</span>
              </Link>
            )}

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* SHEIN风格的分类导航栏 */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="flex items-center justify-between py-3">
            {/* 主导航 - SHEIN风格 */}
            <nav className="flex items-center space-x-8">
              {/* Categories 总入口 */}
              <div className="relative" ref={categoriesMenuRef}>
                <button
                  onMouseEnter={() => setShowCategoriesMenu(true)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {/* SHEIN风格的展开式分类菜单 */}
                {showCategoriesMenu && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-lg border border-gray-200 z-50 w-[800px] h-[500px] flex"
                    onMouseEnter={() => setShowCategoriesMenu(true)}
                    onMouseLeave={() => {
                      setShowCategoriesMenu(false);
                      setActiveCategory(null);
                    }}
                  >
                    {/* 左侧一级分类列表 */}
                    <div className="w-1/3 border-r border-gray-100 py-4">
                      {categoriesData.map((category) => (
                        <div
                          key={category.id}
                          className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                            activeCategory === category.id 
                              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                          onMouseEnter={() => setActiveCategory(category.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{category.name}</span>
                            {category.isNew && (
                              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      ))}
                    </div>
                    
                    {/* 右侧二级分类展示 */}
                    <div className="flex-1 p-6">
                      {activeCategory && (
                        <div>
                          {(() => {
                            const category = categoriesData.find(cat => cat.id === activeCategory);
                            if (!category) return null;
                            
                            return (
                              <div>
                                {/* 分类标题和View All */}
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                    <span>{category.name.toUpperCase()}</span>
                                    {category.isNew && (
                                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">NEW IN</span>
                                    )}
                                  </h3>
                                  <Link
                                    to={category.path}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                  >
                                    <Grid3X3 className="h-4 w-4" />
                                    <span>View All</span>
                                  </Link>
                                </div>
                                
                                {/* 图文结合的二级分类网格 */}
                                <div className="grid grid-cols-3 gap-4">
                                  {category.subcategories.map((sub, index) => (
                                    <Link
                                      key={index}
                                      to={sub.path}
                                      className="group flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="relative">
                                        <img
                                          src={sub.image}
                                          alt={sub.name}
                                          className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        {sub.isNew && (
                                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">NEW</span>
                                        )}
                                        {sub.isHot && (
                                          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded-full">HOT</span>
                                        )}
                                      </div>
                                      <span className="text-xs text-gray-700 group-hover:text-blue-600 text-center font-medium">
                                        {sub.name}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      
                      {/* 默认显示 - 当没有选中分类时 */}
                      {!activeCategory && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">悬停左侧分类查看详细内容</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 其他顶部导航项 */}
              {topNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  <span>{item.name}</span>
                  {item.isNew && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* 快速筛选标签 */}
            <div className="flex items-center space-x-4">
              {quickFilters.map((filter, index) => (
                <Link
                  key={index}
                  to={`/products?filter=${filter}`}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  {filter}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-4">
              {/* 移动端搜索 */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="搜索玉石商品..."
                  />
                </div>
              </form>

              {/* 移动端导航 */}
              <nav className="space-y-1">
                {categoriesData.map((category, index) => (
                  <div key={index}>
                    <Link
                      to={category.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && (
                      <div className="pl-6 space-y-1">
                        {category.subcategories.map((sub, subIndex) => (
                          <Link
                            key={subIndex}
                            to={sub.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  to="/buyback"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  回购中心
                </Link>
              </nav>

              {/* 移动端快速链接 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-wrap gap-2 px-4">
                  {quickFilters.map((filter, index) => (
                    <Link
                      key={index}
                      to={`/products?filter=${filter}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      {filter}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;