import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

// 从环境变量读取 Supabase 配置，避免硬编码，提升安全性与环境切换能力
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  logger.warn('Supabase 环境变量未配置：请在 .env 设置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。当前已降级为安全的空客户端，调用将返回错误但不影响页面加载。')
}

type QueryResult = Promise<{ data: null; error: Error }>
const makeError = (op: string, table?: string) => new Error(
  table ? `Supabase 未配置，无法执行 ${op} 于表 ${table}` : `Supabase 未配置，无法执行 ${op}`
)

const queryStub = (table: string) => {
  const result: QueryResult = Promise.resolve({ data: null, error: makeError('操作', table) })
  const filterResult = { eq: async () => result, neq: async () => result }
  return {
    upsert: async () => result,
    insert: async () => result,
    delete: () => filterResult,
    select: async () => result,
    eq: async () => result,
    neq: async () => result
  }
}

export const supabase = (isSupabaseConfigured)
  ? createClient<Database>(supabaseUrl as string, supabaseAnonKey as string)
  : { from: (table: string) => queryStub(table) }

// Avatar 存储桶配置（支持私有桶签名 URL 工作流）
export const AVATAR_BUCKET = (import.meta.env.VITE_SUPABASE_AVATAR_BUCKET as string) || 'avatars'
export const AVATAR_BUCKET_PRIVATE = String(import.meta.env.VITE_SUPABASE_AVATAR_PRIVATE || '').toLowerCase() === 'true'

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone?: string
          avatar_url?: string
          birthday?: string
          gender?: string
          points: number
          member_level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string
          avatar_url?: string
          birthday?: string
          gender?: string
          points?: number
          member_level?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          avatar_url?: string
          birthday?: string
          gender?: string
          points?: number
          member_level?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description?: string
          price: number
          original_price?: number
          images: string[]
          category_id?: string
          rating: number
          review_count: number
          sales: number
          stock: number
          specifications: Record<string, any>
          tags: string[]
          is_active: boolean
          is_buyback_eligible: boolean
          buyback_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price: number
          original_price?: number
          images?: string[]
          category_id?: string
          rating?: number
          review_count?: number
          sales?: number
          stock?: number
          specifications?: Record<string, any>
          tags?: string[]
          is_active?: boolean
          is_buyback_eligible?: boolean
          buyback_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number
          images?: string[]
          category_id?: string
          rating?: number
          review_count?: number
          sales?: number
          stock?: number
          specifications?: Record<string, any>
          tags?: string[]
          is_active?: boolean
          is_buyback_eligible?: boolean
          buyback_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: string
          shipping_address: Record<string, any>
          payment_method?: string
          payment_status: string
          tracking_number?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: string
          shipping_address: Record<string, any>
          payment_method?: string
          payment_status?: string
          tracking_number?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          status?: string
          shipping_address?: Record<string, any>
          payment_method?: string
          payment_status?: string
          tracking_number?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          specifications: Record<string, any>
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          specifications?: Record<string, any>
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          specifications?: Record<string, any>
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment?: string
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string
          images?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string
          images?: string[]
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          province: string
          city: string
          district: string
          detail: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          province: string
          city: string
          district: string
          detail: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          province?: string
          city?: string
          district?: string
          detail?: string
          is_default?: boolean
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          name: string
          code: string
          type: string
          discount_value: number
          min_amount: number
          start_date: string
          end_date: string
          usage_limit: number
          used_count: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          type: string
          discount_value: number
          min_amount?: number
          start_date: string
          end_date: string
          usage_limit?: number
          used_count?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          type?: string
          discount_value?: number
          min_amount?: number
          start_date?: string
          end_date?: string
          usage_limit?: number
          used_count?: number
          is_active?: boolean
          created_at?: string
        }
      }
      user_coupons: {
        Row: {
          id: string
          user_id: string
          coupon_id: string
          is_used: boolean
          used_at?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          coupon_id: string
          is_used?: boolean
          used_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          coupon_id?: string
          is_used?: boolean
          used_at?: string
          created_at?: string
        }
      }
      carousel_items: {
        Row: {
          id: string
          title?: string
          image_url: string
          link_url?: string
          sort_order: number
          is_active: boolean
          start_date?: string
          end_date?: string
          created_at: string
        }
        Insert: {
          id?: string
          title?: string
          image_url: string
          link_url?: string
          sort_order?: number
          is_active?: boolean
          start_date?: string
          end_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          image_url?: string
          link_url?: string
          sort_order?: number
          is_active?: boolean
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: string
          is_pinned: boolean
          is_active: boolean
          start_date?: string
          end_date?: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: string
          is_pinned?: boolean
          is_active?: boolean
          start_date?: string
          end_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: string
          is_pinned?: boolean
          is_active?: boolean
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      buyback_applications: {
        Row: {
          id: string
          user_id: string
          product_id: string
          original_order_id?: string
          application_status: string
          purchase_date: string
          purchase_price: number
          purchase_proof_urls: string[]
          certificate_urls: string[]
          product_photos: string[]
          product_videos: string[]
          condition_description?: string
          delivery_method: string
          tracking_number?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          original_order_id?: string
          application_status?: string
          purchase_date: string
          purchase_price: number
          purchase_proof_urls?: string[]
          certificate_urls?: string[]
          product_photos?: string[]
          product_videos?: string[]
          condition_description?: string
          delivery_method?: string
          tracking_number?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          original_order_id?: string
          application_status?: string
          purchase_date?: string
          purchase_price?: number
          purchase_proof_urls?: string[]
          certificate_urls?: string[]
          product_photos?: string[]
          product_videos?: string[]
          condition_description?: string
          delivery_method?: string
          tracking_number?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      site_contents: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          meta_description?: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          meta_description?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          meta_description?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}