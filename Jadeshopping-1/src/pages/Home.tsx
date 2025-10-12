import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Gem, Shield, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ProductCard from '@/components/ui/ProductCard';
import { useStore } from '@/store/useStore';
import { mockProducts, mockCategories, mockBanners } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Home: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { addToCart, toggleFavorite, isFavorite } = useStore();

  // 轮播图自动切换
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + mockBanners.length) % mockBanners.length);
  };

  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* 轮播图区域 */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {mockBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentBanner ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 animate-slide-up">
                  {banner.subtitle}
                </p>
                <Button
                  size="lg"
                  className="animate-bounce-gentle"
                  asChild
                >
                  <Link to={banner.link}>
                    {banner.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* 轮播图控制按钮 */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* 轮播图指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {mockBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentBanner ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </section>

      {/* 品牌特色区域 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">精选好玉</h3>
              <p className="text-gray-600 text-sm">严选优质玉石，品质保证</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">品质保障</h3>
              <p className="text-gray-600 text-sm">专业鉴定，假一赔十</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">快速配送</h3>
              <p className="text-gray-600 text-sm">全国包邮，安全送达</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">专业服务</h3>
              <p className="text-gray-600 text-sm">专家团队，贴心服务</p>
            </div>
          </div>
        </div>
      </section>

      {/* 商品分类区域 */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精品分类</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              传承千年玉石文化，汇聚天下美玉精品
            </p>
            <div className="mt-6">
              <Link
                to="/categories"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                查看全部分类
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCategories.filter(cat => cat.is_featured).slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
                  {/* 特色标签 */}
                  {category.is_featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                        精选
                      </span>
                    </div>
                  )}
                  
                  <div className="relative h-48 overflow-hidden">
                    {/* 颜色背景 */}
                    <div
                      className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundColor: category.color }}
                    />
                    
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-jade.svg';
                      }}
                    />
                    
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* 图标覆盖层 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                      <span className="text-4xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        {category.icon}
                      </span>
                    </div>
                    
                    {/* 分类信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold group-hover:text-amber-200 transition-colors duration-200">
                          {category.name}
                        </h3>
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <p className="text-sm opacity-90 line-clamp-2 mb-2">
                        {category.description}
                      </p>
                      
                      {/* 商品数量和标签 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {category.product_count} 件商品
                        </span>
                        {category.tags && category.tags.length > 0 && (
                          <div className="flex gap-1">
                            {category.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 悬停时的额外信息 */}
                  <div className="absolute inset-x-0 bottom-0 bg-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">点击查看商品</span>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* 查看更多按钮 */}
          <div className="text-center mt-12">
            <Link to="/categories">
              <Button 
                variant="outline" 
                size="lg"
                className="group hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
              >
                查看全部分类
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 精选商品区域 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精选商品</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              精心挑选的优质玉石，每一件都是匠心之作
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(product.id)}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                查看更多商品
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 品牌故事区域 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">传承千年玉石文化</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                玉石轩致力于传承和弘扬中华玉石文化，我们精选来自新疆和田、缅甸等地的优质玉石，
                每一件作品都经过严格的品质把控和专业鉴定。
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                从原石挑选到精工雕琢，从设计创意到成品呈现，我们始终坚持匠心品质，
                为您带来最纯正的玉石文化体验。
              </p>
              <Button size="lg" asChild>
                <Link to="/about">
                  了解更多
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20jade%20carving%20workshop%2C%20master%20craftsman%20working%20on%20jade%20sculpture%2C%20cultural%20heritage%2C%20artistic%20craftsmanship&image_size=landscape_4_3"
                alt="玉石雕刻工艺"
                className="w-full rounded-lg shadow-jade-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;