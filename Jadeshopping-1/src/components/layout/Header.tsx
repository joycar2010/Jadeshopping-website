import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartBounce, setCartBounce] = useState(false);
  const navigate = useNavigate();
  const { cartItemCount, user, isAuthenticated, logout } = useStore();

  // 触发购物车图标弹跳动画
  const triggerCartBounce = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600); // 动画持续时间
  };

  // 暴露给外部调用的方法
  React.useEffect(() => {
    // 监听自定义事件来触发弹跳动画
    const handleCartBounce = () => triggerCartBounce();
    window.addEventListener('cart-bounce', handleCartBounce);
    
    return () => {
      window.removeEventListener('cart-bounce', handleCartBounce);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/', { replace: true });
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        {/* 主导航栏 */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/guaranteed-antiques-logo.png" 
              alt="Guaranteed Antiques" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-jade-600 hidden sm:block">
              Guaranteed Antiques
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-jade-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 搜索框 - 桌面端 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="search"
                placeholder="Search antique products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="w-full"
              />
            </form>
          </div>

          {/* 右侧操作按钮 */}
          <div className="flex items-center space-x-2">
            {/* 搜索按钮 - 移动端 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => {
                // 移动端搜索逻辑
                const query = prompt('Please enter search keywords:');
                if (query?.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                }
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* 收藏夹 */}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/favorites">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Link>
            </Button>

            {/* 购物车 */}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cart" className="relative" data-cart-icon>
                <motion.div
                  animate={cartBounce ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, -5, 0]
                  } : {}}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.div>
                {/* 购物车数量徽章 */}
                {cartItemCount > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-jade-500 text-red-500 text-sm font-bold flex items-center justify-center"
                    animate={cartBounce ? {
                      scale: [1, 1.3, 1],
                    } : {}}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut"
                    }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>

            {/* 用户菜单 */}
            <div className="relative">
              {isAuthenticated && user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-xs text-emerald-600">
                          {user.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.full_name}
                    </span>
                  </Button>

                  {/* 用户下拉菜单 */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Profile
                        </Link>
                        
                        <Link
                          to="/profile?tab=orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-3" />
                          My Orders
                        </Link>
                        
                        <Link
                          to="/profile?tab=favorites"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4 mr-3" />
                          My Favorites
                        </Link>
                        
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                 <Button variant="ghost" size="sm" asChild>
                   <Link to="/login" className="flex items-center">
                     <User className="h-5 w-5" />
                     <span className="sr-only">Login</span>
                   </Link>
                 </Button>
               )}
            </div>

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-base font-medium text-gray-700 hover:text-jade-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* 移动端搜索框 */}
              <form onSubmit={handleSearch} className="pt-4 border-t">
                <Input
                  type="search"
                  placeholder="Search antique products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;