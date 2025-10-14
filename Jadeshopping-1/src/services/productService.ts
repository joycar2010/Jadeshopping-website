import { supabase } from '@/lib/supabase';
import type { Product, Category, ProductDetail, Review } from '@/types';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_at_desc';
  limit?: number;
  offset?: number;
}

export class ProductService {
  // 获取所有产品
  async getProducts(filters: ProductFilters = {}): Promise<{ success: boolean; data?: Product[]; total?: number; error?: string }> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories!inner(*)
        `, { count: 'exact' });

      // 应用过滤条件
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // 排序
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        case 'created_at_desc':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // 分页
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('ProductService.getProducts error:', error);
      return { success: false, error: 'Failed to fetch products' };
    }
  }

  // 根据ID获取产品详情
  async getProductById(id: string): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          reviews(
            id,
            user_name,
            user_avatar,
            rating,
            comment,
            images,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: error.message };
      }

      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      // 获取相关产品
      const { data: relatedProducts } = await supabase
        .from('products')
        .select('id, name, price, image_url, category_id')
        .eq('category_id', product.category_id)
        .neq('id', id)
        .limit(4);

      // 计算评分统计
      const reviews = product.reviews || [];
      const rating = reviews.length > 0 
        ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length 
        : 0;

      return { success: true, data: product };
    } catch (error) {
      console.error('ProductService.getProductById error:', error);
      return { success: false, error: 'Failed to fetch product' };
    }
  }

  // 获取特色产品
  async getFeaturedProducts(limit: number = 8): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured products:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('ProductService.getFeaturedProducts error:', error);
      return { success: false, error: 'Failed to fetch featured products' };
    }
  }

  // 获取热门产品
  async getPopularProducts(limit: number = 8): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*)
        `)
        .order('review_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular products:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('ProductService.getPopularProducts error:', error);
      return { success: false, error: 'Failed to fetch popular products' };
    }
  }

  // 获取分类下的产品
  async getProductsByCategory(categoryId: string, limit?: number): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(*)
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products by category:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('ProductService.getProductsByCategory error:', error);
      return { success: false, error: 'Failed to fetch products by category' };
    }
  }

  // 搜索产品
  static async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*)
        `)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching products:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('ProductService.searchProducts error:', error);
      throw error;
    }
  }

  // 更新产品浏览次数
  static async incrementViewCount(productId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_product_view_count', {
        product_id: productId
      });

      if (error) {
        console.error('Error incrementing view count:', error);
        // 不抛出错误，因为这不是关键功能
      }
    } catch (error) {
      console.error('ProductService.incrementViewCount error:', error);
      // 不抛出错误，因为这不是关键功能
    }
  }

  // 获取产品评论
  static async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('ProductService.getProductReviews error:', error);
      throw error;
    }
  }

  // 添加产品评论
  static async addProductReview(productId: string, review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          ...review
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding product review:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ProductService.addProductReview error:', error);
      throw error;
    }
  }
}

// 分类服务
export class CategoryService {
  // 获取所有分类
  async getCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('CategoryService.getCategories error:', error);
      return { success: false, error: 'Failed to fetch categories' };
    }
  }

  // 获取特色分类
  async getFeaturedCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching featured categories:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('CategoryService.getFeaturedCategories error:', error);
      return { success: false, error: 'Failed to fetch featured categories' };
    }
  }

  // 根据ID获取分类
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('CategoryService.getCategoryById error:', error);
      throw error;
    }
  }

  // 根据slug获取分类
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category by slug:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('CategoryService.getCategoryBySlug error:', error);
      throw error;
    }
  }
}