import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { logger } from '../lib/logger'
import { getCategoriesData, getProductsData, getOrdersData, getProductReviews, getProductById } from '../data/mockData'
import { apiFetch } from '../lib/api'

// 数据迁移工具类
export class DataMigration {
  // 映射缓存：用于在一次迁移中建立关系引用
  static categorySlugToId: Record<string, string> = {}
  static productNameToId: Record<string, string> = {}
  static userEmailToId: Record<string, string> = {}
  static orderNoteToId: Record<string, string> = {}
  
  // 迁移分类数据
  static async migrateCategories() {
    logger.info('开始迁移分类数据...')
    
    try {
      const categories = getCategoriesData()
      
      const categoryData = categories.map(category => ({
        name: category.name,
        description: category.description,
        image_url: category.image,
        parent_id: null, // mock 数据中没有父级分类
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString()
      }))

      // 让数据库生成 UUID 主键，返回插入的 id 和 name
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select('id,name')

      if (error) {
        logger.error('分类数据迁移失败:', error)
        return false
      }

      // 建立 slug -> id 映射（基于原 mock slug 与返回的 name 匹配）
      const nameToId = new Map<string, string>((data || []).map(r => [r.name, r.id]))
      for (const c of categories) {
        const cid = nameToId.get(c.name)
        if (cid) {
          this.categorySlugToId[c.id] = cid
        }
      }

      logger.info(`成功迁移 ${categoryData.length} 个分类，并建立分类映射`)
      return true
    } catch (error) {
      logger.error('分类数据迁移异常:', error)
      return false
    }
  }

  // 迁移商品数据
  static async migrateProducts() {
  logger.info('开始迁移商品数据...')
    
    try {
      const { data: products } = getProductsData()
      
      const productData = products.map(product => ({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        images: product.images,
        category_id: this.categorySlugToId[product.category] || null,
        rating: product.rating,
        review_count: product.reviewCount,
        sales: product.sales,
        stock: product.stock,
        specifications: product.specifications,
        tags: product.tags,
        is_active: true,
        is_buyback_eligible: true, // 默认支持回购
        buyback_percentage: 70, // 默认回购价格为原价的70%
        created_at: product.createdAt,
        updated_at: product.updatedAt
      }))

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select('id,name')

      if (error) {
  logger.error('商品数据迁移失败:', error)
        return false
      }

      // 建立 product name -> id 映射
      for (const row of (data || [])) {
        this.productNameToId[row.name] = row.id
      }

  logger.info(`成功迁移 ${productData.length} 个商品，并建立商品映射`)
      return true
    } catch (error) {
  logger.error('商品数据迁移异常:', error)
      return false
    }
  }

  // 迁移用户数据（创建测试用户）
  static async migrateUsers() {
  logger.info('开始创建测试用户数据...')
    
    try {
      const testUsers = [
        {
          email: 'test@example.com',
          name: '张三',
          phone: '13800138000',
          avatar_url: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          birthday: '1990-01-01',
          gender: 'male',
          points: 1000,
          member_level: 'gold',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      // 基于唯一 email 进行 upsert，避免重复
      const { data, error } = await supabase
        .from('users')
        .upsert(testUsers, { onConflict: 'email' })
        .select('id,email')

      if (error) {
  logger.error('用户数据迁移失败:', error)
        return false
      }

      // 建立 email -> id 映射
      for (const row of (data || [])) {
        this.userEmailToId[row.email] = row.id
      }

  logger.info(`成功创建/更新 ${testUsers.length} 个测试用户，并建立用户映射`)
      return true
    } catch (error) {
  logger.error('用户数据迁移异常:', error)
      return false
    }
  }

  // 迁移订单数据
  static async migrateOrders() {
    logger.info('开始迁移订单数据...')
    
    try {
      const orders = getOrdersData('user1')
      const userId = this.userEmailToId['test@example.com']
      if (!userId) {
        logger.error('订单迁移失败: 未找到测试用户ID，请先成功迁移用户')
        return false
      }
      
      // 先迁移订单主表
      const orderData = orders.map(order => ({
        user_id: userId,
        total_amount: order.totalAmount,
        status: order.status,
        shipping_address: order.shippingAddress,
        payment_method: order.paymentMethod,
        payment_status: 'paid',
        tracking_number: null,
        notes: order.id, // 记录原 mock 订单号以便建立映射
        created_at: order.createdAt,
        updated_at: order.updatedAt
      }))

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id,notes,created_at')

      if (orderError) {
        logger.error('订单数据迁移失败:', orderError)
        return false
      }

      // notes(原订单号) -> id 映射
      for (const row of (orderResult || [])) {
        if (row.notes) this.orderNoteToId[row.notes as string] = row.id as string
      }

      // 再迁移订单项数据
      const orderItemsData = orders.flatMap(order => 
        order.items.map(item => ({
          order_id: this.orderNoteToId[order.id] || null,
          product_id: (() => {
            const p = getProductById(item.productId)
            return p ? this.productNameToId[p.name] || null : null
          })(),
          quantity: item.quantity,
          price: item.price,
          specifications: {}
        }))
      )

      const { data: itemResult, error: itemError } = await supabase
        .from('order_items')
        .insert(orderItemsData)

      if (itemError) {
        logger.error('订单项数据迁移失败:', itemError)
        return false
      }

      logger.info(`成功迁移 ${orderData.length} 个订单和 ${orderItemsData.length} 个订单项`)
      return true
    } catch (error) {
      logger.error('订单数据迁移异常:', error)
      return false
    }
  }

  // 迁移评论数据
  static async migrateReviews() {
  logger.info('开始迁移评论数据...')
    
    try {
      const { data: products } = getProductsData()
      const allReviews = []
      const userId = this.userEmailToId['test@example.com']
      if (!userId) {
        logger.error('评论迁移失败: 未找到测试用户ID，请先成功迁移用户')
        return false
      }

      // 为每个商品获取评论数据
      for (const product of products) {
        const reviews = getProductReviews(product.id)
        allReviews.push(...reviews)
      }

      const reviewData = allReviews.map(review => ({
        product_id: (() => {
          const p = getProductById(review.product_id)
          return p ? this.productNameToId[p.name] || null : null
        })(),
        user_id: userId,
        rating: review.rating,
        comment: review.comment || review.content,
        images: review.images || [],
        created_at: review.created_at
      }))

      if (reviewData.length > 0) {
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData)

        if (error) {
  logger.error('评论数据迁移失败:', error)
          return false
        }

  logger.info(`成功迁移 ${reviewData.length} 个评论`)
      } else {
  logger.info('没有评论数据需要迁移')
      }
      
      return true
    } catch (error) {
  logger.error('评论数据迁移异常:', error)
      return false
    }
  }

  // 迁移轮播图数据
  static async migrateCarouselItems() {
  logger.info('开始迁移轮播图数据...')
    
    try {
      const carouselData = [
        {
          title: '新品上市',
          image_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20jade%20jewelry%20banner%20elegant%20display&image_size=landscape_16_9',
          link_url: '/products?category=hetian',
          sort_order: 1,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后
          created_at: new Date().toISOString()
        },
        {
          title: '翡翠专场',
          image_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=emerald%20jadeite%20collection%20luxury%20banner&image_size=landscape_16_9',
          link_url: '/products?category=jadeite',
          sort_order: 2,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        },
        {
          title: '回购服务',
          image_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=jade%20buyback%20service%20professional%20banner&image_size=landscape_16_9',
          link_url: '/buyback',
          sort_order: 3,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ]

      const { error } = await supabase
        .from('carousel_items')
        .insert(carouselData)

      if (error) {
  logger.error('轮播图数据迁移失败:', error)
        return false
      }

  logger.info(`成功迁移 ${carouselData.length} 个轮播图`)
      return true
    } catch (error) {
  logger.error('轮播图数据迁移异常:', error)
      return false
    }
  }

  // 迁移公告数据
  static async migrateAnnouncements() {
    logger.info('开始迁移公告数据...')
    
    try {
      const announcementData = [
        {
          title: '新用户注册送积分',
          content: '新用户注册即可获得100积分，可用于购买商品时抵扣现金。',
          type: 'promotion',
          is_pinned: true,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        },
        {
          title: '回购服务正式上线',
          content: '我们的回购服务正式上线！支持翡翠、和田玉等珠宝首饰回购，专业鉴定，价格公道。',
          type: 'system',
          is_pinned: false,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        },
        {
          title: '春节期间发货通知',
          content: '春节期间（2月8日-2月18日）暂停发货，2月19日恢复正常发货。给您带来不便，敬请谅解。',
          type: 'notice',
          is_pinned: false,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ]

      const { error } = await supabase
        .from('announcements')
        .insert(announcementData)

      if (error) {
  logger.error('公告数据迁移失败:', error)
        return false
      }

  logger.info(`成功迁移 ${announcementData.length} 个公告`)
      return true
    } catch (error) {
  logger.error('公告数据迁移异常:', error)
      return false
    }
  }

  // 执行完整的数据迁移
  static async runFullMigration() {
    logger.info('开始执行完整数据迁移（改为服务端 API）...')

    const defaultResults = {
      categories: false,
      users: false,
      products: false,
      orders: false,
      reviews: false,
      carouselItems: false,
      announcements: false,
    }

    try {
      const response = await apiFetch<{ ok: boolean; results: typeof defaultResults }>(
        '/api/migrations/run',
        { method: 'POST' }
      )
      const results = response?.results ?? defaultResults
      const successCount = Object.values(results).filter(Boolean).length
      const totalCount = Object.keys(results).length
      logger.summary(`服务端数据迁移完成！成功: ${successCount}/${totalCount}`)
      logger.info('迁移结果(服务端):', results)
      return results
    } catch (error) {
      logger.error('调用服务端数据迁移 API 失败:', error)
      return defaultResults
    }
  }

  // 清空所有数据（用于重新迁移）
  static async clearAllData() {
    logger.info('开始清空所有数据（改为服务端 API）...')
    try {
      const response = await apiFetch<{ ok: boolean }>(
        '/api/migrations/clear',
        { method: 'POST' }
      )
      const ok = Boolean(response?.ok)
      if (ok) {
        logger.summary('所有数据清空完成（服务端）')
      } else {
        logger.error('服务端清空数据返回失败标志')
      }
      return ok
    } catch (error) {
      logger.error('调用服务端清空数据 API 失败:', error)
      return false
    }
  }
}

// 导出便捷方法
export const runDataMigration = () => DataMigration.runFullMigration()
export const clearData = () => DataMigration.clearAllData()