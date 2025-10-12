import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  mode?: 'grid' | 'list' | 'compact';
  showSubcategories?: boolean;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  mode = 'grid',
  showSubcategories = false,
  className = '',
}) => {
  const baseClasses = 'group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl';
  
  const modeClasses = {
    grid: 'bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-1',
    list: 'bg-white border border-gray-200 hover:bg-gray-50 flex items-center',
    compact: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-md',
  };

  const renderGridMode = () => (
    <Link
      to={`/products?category=${category.id}`}
      className={`${baseClasses} ${modeClasses.grid} ${className} block`}
    >
      {/* 特色标签 */}
      {category.is_featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            精选
          </span>
        </div>
      )}

      {/* 分类图片区域 */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          style={{ backgroundColor: category.color }}
        />
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-jade.svg';
          }}
        />
        
        {/* 图标覆盖层 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <span className="text-4xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            {category.icon}
          </span>
        </div>
      </div>

      {/* 分类信息 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {category.name}
          </h3>
          <span className="text-2xl">{category.icon}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {category.description}
        </p>

        {/* 商品数量 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {category.product_count} 件商品
          </span>
          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
            查看更多
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 标签 */}
        {category.tags && category.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {category.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 子分类预览 */}
      {showSubcategories && category.subcategories && category.subcategories.length > 0 && (
        <div className="px-4 pb-4">
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-2">子分类：</p>
            <div className="flex flex-wrap gap-1">
              {category.subcategories.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  to={`/products?category=${sub.id}`}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sub.name}
                </Link>
              ))}
              {category.subcategories.length > 3 && (
                <span className="text-xs text-gray-400 px-2 py-1">
                  +{category.subcategories.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Link>
  );

  const renderListMode = () => (
    <Link
      to={`/products?category=${category.id}`}
      className={`${baseClasses} ${modeClasses.list} ${className} p-4`}
    >
      {/* 图标 */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden mr-4">
        <div
          className="w-full h-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: category.color + '20' }}
        >
          {category.icon}
        </div>
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {category.name}
          </h3>
          {category.is_featured && (
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
              精选
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {category.product_count} 件商品
          </span>
          {category.tags && category.tags.length > 0 && (
            <div className="flex gap-1">
              {category.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 箭头 */}
      <div className="flex-shrink-0 ml-4">
        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );

  const renderCompactMode = () => (
    <Link
      to={`/products?category=${category.id}`}
      className={`${baseClasses} ${modeClasses.compact} ${className} p-3 block`}
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: category.color + '20' }}
        >
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500">
            {category.product_count} 件商品
          </p>
        </div>
        {category.is_featured && (
          <div className="flex-shrink-0">
            <span className="w-2 h-2 bg-amber-400 rounded-full block"></span>
          </div>
        )}
      </div>
    </Link>
  );

  switch (mode) {
    case 'list':
      return renderListMode();
    case 'compact':
      return renderCompactMode();
    default:
      return renderGridMode();
  }
};

export default CategoryCard;