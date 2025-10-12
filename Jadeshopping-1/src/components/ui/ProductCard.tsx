import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AddToCartAnimation } from '@/components/AddToCartAnimation';
import { useAddToCartAnimation } from '@/hooks/useAddToCartAnimation';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  className?: string;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  className,
  viewMode = 'grid',
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const { animationData, triggerAnimation, onAnimationComplete } = useAddToCartAnimation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 只触发动画，动画系统会统一处理添加到购物车的逻辑
    triggerAnimation(product, e);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleImageLoad = () => {
    console.log('ProductCard - Image loaded successfully for product:', product.name, 'src:', product.images[0]);
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('ProductCard - Image failed to load for product:', product.name, 'src:', product.images[0]);
    setImageLoading(false);
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(price);
  };

  const getImageSrc = () => {
    if (imageError) {
      return '/images/placeholder-jade.svg';
    }
    const imageSrc = product.images[0] || '/images/placeholder-jade.svg';
    console.log('ProductCard - Image source for product:', product.name, 'src:', imageSrc);
    return imageSrc;
  };

  // 列表视图布局
  if (viewMode === 'list') {
    return (
      <>
        <Card className={cn('product-card group', className)}>
          <Link to={`/products/${product.id}`} className="block">
            <div className="flex p-4 gap-4">
              {/* 图片区域 */}
              <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                {/* 加载状态指示器 */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-jade-600"></div>
                  </div>
                )}
                
                {/* 图片错误状态 */}
                {imageError && !imageLoading && (
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                
                <img
                  src={getImageSrc()}
                  alt={product.name}
                  className={cn(
                    "product-image w-full h-full object-cover transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                
                {/* 库存状态标签 */}
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <div className="absolute top-1 left-1">
                    <span className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                      仅剩 {product.stock_quantity} 件
                    </span>
                  </div>
                )}
                
                {product.stock_quantity === 0 && (
                  <div className="absolute top-1 left-1">
                    <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                      售罄
                    </span>
                  </div>
                )}
              </div>

              {/* 内容区域 */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-jade-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {product.specifications?.material && (
                    <p className="text-sm text-gray-500 mb-2">
                      材质：{product.specifications.material}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-jade-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleToggleFavorite}
                    >
                      <Heart 
                        className={cn(
                          "h-4 w-4",
                          isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                        )} 
                      />
                    </Button>
                    
                    {product.stock_quantity > 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        加入购物车
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Card>
        
        {/* 添加到购物车动画 */}
        {animationData && (
          <AddToCartAnimation
            product={animationData.product}
            startPosition={animationData.startPosition}
            onComplete={animationData.onComplete}
          />
        )}
      </>
    );
  }

  // 网格视图布局（原有布局）
  return (
    <>
      <Card className={cn('product-card group', className)}>
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative overflow-hidden rounded-t-lg">
            {/* 加载状态指示器 */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jade-600"></div>
                  <span className="text-sm text-gray-500">加载中...</span>
                </div>
              </div>
            )}
            
            {/* 图片错误状态 */}
            {imageError && !imageLoading && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2 text-gray-400">
                  <ImageIcon className="h-12 w-12" />
                  <span className="text-sm">图片加载失败</span>
                </div>
              </div>
            )}
            
            <img
              src={getImageSrc()}
              alt={product.name}
              className={cn(
                "product-image w-full h-48 sm:h-56 object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* 悬浮操作按钮 */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggleFavorite}
                className="bg-white/90 hover:bg-white"
              >
                <Heart 
                  className={cn(
                    "h-4 w-4",
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  )} 
                />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
              
              {product.stock_quantity > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* 库存状态标签 */}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <div className="absolute top-2 left-2">
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  仅剩 {product.stock_quantity} 件
                </span>
              </div>
            )}
            
            {product.stock_quantity === 0 && (
              <div className="absolute top-2 left-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  售罄
                </span>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-jade-600 transition-colors">
              {product.name}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-jade-600">
                  {formatPrice(product.price)}
                </span>
                {product.specifications?.material && (
                  <span className="text-xs text-gray-500">
                    {product.specifications.material}
                  </span>
                )}
              </div>
              
              {product.stock_quantity > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCart}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  加入购物车
                </Button>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
      
      {/* 添加到购物车动画 */}
      {animationData && (
        <AddToCartAnimation
          isAnimating={true}
          productImage={animationData.product.image}
          startPosition={animationData.startPosition}
          endPosition={animationData.endPosition}
          onAnimationComplete={onAnimationComplete}
        />
      )}
    </>
  );
};

export default ProductCard;