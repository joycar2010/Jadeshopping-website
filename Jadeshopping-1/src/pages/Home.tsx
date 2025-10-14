import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Gem, Shield, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ProductCard from '@/components/ui/ProductCard';
import { useStore } from '@/store/useStore';
import { ProductService, CategoryService } from '@/services/productService';
import type { Product, Category } from '@/types';
import { cn } from '@/lib/utils';

// Banner data (keeping static for now as it's UI content)
const banners = [
  {
    id: 'banner_1',
    title: 'Premium Antiques',
    subtitle: 'Timeless Heritage · Exquisite Craftsmanship',
    image: '/images/banners/hetian-jade-banner.svg',
    link: '/products?category=cat_1',
    buttonText: 'Shop Now',
  },
  {
    id: 'banner_2',
    title: 'Jade Jewelry',
    subtitle: 'Authentic Pieces · Natural Beauty',
    image: '/images/banners/jadeite-jewelry-banner.svg',
    link: '/products?category=cat_2',
    buttonText: 'View Details',
  },
  {
    id: 'banner_3',
    title: 'Collectible Treasures',
    subtitle: 'Rare Finds · Vibrant Colors',
    image: '/images/banners/agate-collection-banner.svg',
    link: '/products?category=cat_3',
    buttonText: 'Explore Collection',
  },
  {
    id: 'banner_4',
    title: 'Artistic Masterpieces',
    subtitle: 'Fine Craftsmanship · Elegant Design',
    image: '/images/banners/jasper-art-banner.svg',
    link: '/products?category=cat_4',
    buttonText: 'Discover Art',
  },
  {
    id: 'banner_5',
    title: 'Cultural Heritage',
    subtitle: 'Ancient Wisdom · Timeless Beauty',
    image: '/images/banners/jade-culture-banner.svg',
    link: '/products',
    buttonText: 'Cultural Legacy',
  },
];

const productService = new ProductService();
const categoryService = new CategoryService();

const Home: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, toggleFavorite, isFavorite } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load featured products and categories in parallel
        const [productsResult, categoriesResult] = await Promise.all([
          productService.getFeaturedProducts(8),
          categoryService.getFeaturedCategories()
        ]);

        if (productsResult.success && productsResult.data) {
          setFeaturedProducts(productsResult.data);
        } else {
          console.error('Failed to load featured products:', productsResult.error);
          setError(productsResult.error || 'Failed to load featured products');
        }

        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        } else {
          console.error('Failed to load categories:', categoriesResult.error);
        }
      } catch (err) {
        console.error('Error loading home page data:', err);
        setError('Failed to load page data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-advance banner carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 轮播图区域 */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {banners.map((banner, index) => (
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
        
        {/* Banner carousel control buttons */}
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
        
        {/* Banner carousel indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
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

      {/* Brand Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Selection</h3>
              <p className="text-gray-600 text-sm">Carefully selected quality antiques, guaranteed authenticity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">Professional authentication, money-back guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600 text-sm">Free nationwide shipping, secure delivery</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Service</h3>
              <p className="text-gray-600 text-sm">Professional team, personalized service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Preserving ancient cultural heritage, curating the world's finest antiques
            </p>
            <div className="mt-6">
              <Link
                to="/categories"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.filter(cat => cat.is_featured).slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
                  {/* Featured Badge */}
                  {category.is_featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  <div className="relative h-48 overflow-hidden">
                    {/* Color background */}
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
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                      <span className="text-4xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        {category.icon}
                      </span>
                    </div>
                    
                    {/* Category information */}
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
                      
                      {/* Product Count and Tags */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {category.product_count} items
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
                  
                  {/* Hover Additional Info */}
                  <div className="absolute inset-x-0 bottom-0 bg-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Click to view products</span>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* View More Button */}
          <div className="text-center mt-12">
            <Link to="/categories">
              <Button 
                variant="outline" 
                size="lg"
                className="group hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Carefully selected premium antiques, each piece is a masterwork of craftsmanship
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
                View More Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Preserving Ancient Cultural Heritage</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Guaranteed Antiques is dedicated to preserving and promoting ancient cultural heritage. We carefully select 
                premium antiques from around the world, with each piece undergoing rigorous quality control and professional authentication.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From careful selection to expert restoration, from design innovation to final presentation, we maintain 
                the highest standards of craftsmanship to bring you the most authentic cultural heritage experience.
              </p>
              <Button size="lg" asChild>
                <Link to="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=antique%20restoration%20workshop%2C%20master%20craftsman%20working%20on%20ancient%20artifacts%2C%20cultural%20heritage%20preservation%2C%20artistic%20craftsmanship&image_size=landscape_4_3"
                alt="Antique restoration craftsmanship"
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