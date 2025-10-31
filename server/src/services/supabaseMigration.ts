import 'dotenv/config'
import { getSupabaseServiceClient } from './supabaseClient'

type MigrationResults = {
  categories: boolean
  users: boolean
  products: boolean
  orders: boolean
  reviews: boolean
  carouselItems: boolean
  announcements: boolean
}

function getSupabase() {
  return getSupabaseServiceClient()
}

export async function runSeedMigration(): Promise<MigrationResults> {
  const supabase = getSupabase()
  const now = new Date().toISOString()
  const results: MigrationResults = {
    categories: false,
    users: false,
    products: false,
    orders: false,
    reviews: false,
    carouselItems: false,
    announcements: false,
  }

  console.log('开始执行 Supabase 服务端数据迁移（API）...')

  // 1) Categories
  try {
    const categories = [
      { name: '翡翠', description: '高端玉石之一', image_url: '/images/jadeite.svg', sort_order: 1, is_active: true, created_at: now },
      { name: '和田玉', description: '温润细腻的玉石', image_url: '/images/hetian.svg', sort_order: 2, is_active: true, created_at: now },
      { name: '水晶', description: '多彩透明的晶体', image_url: '/images/crystal.svg', sort_order: 3, is_active: true, created_at: now },
      { name: '玛瑙', description: '纹理独特的玉石', image_url: '/images/agate.svg', sort_order: 4, is_active: true, created_at: now },
    ]
    const { data: catRows, error: catErr } = await supabase
      .from('categories')
      .insert(categories)
      .select('id,name')
    if (catErr) throw catErr
    results.categories = true
    console.log(`分类迁移完成: ${catRows?.length ?? 0} 条`)

    // Map for products
    const categoryNameToId: Record<string, string> = {}
    for (const c of catRows || []) categoryNameToId[c.name as string] = c.id as string

    // 2) Products
    const products = [
      {
        name: 'A货翡翠手镯',
        description: '天然 A 货翡翠手镯，阳绿，圆条',
        price: 1999,
        original_price: 2999,
        images: ['https://images.unsplash.com/photo-1544441892-794166f1e3be?w=800&auto=format&fit=crop'],
        category_id: categoryNameToId['翡翠'],
        rating: 4.8,
        review_count: 0,
        sales: 0,
        stock: 10,
        specifications: {},
        tags: ['手镯','翡翠'],
        is_active: true,
        is_buyback_eligible: false,
        buyback_percentage: 0,
        created_at: now,
        updated_at: now,
      },
      {
        name: '和田玉挂件',
        description: '白玉挂件，雕工精美',
        price: 1299,
        original_price: 1699,
        images: ['https://images.unsplash.com/photo-1565374399600-0bd3d2bf69f8?w=800&auto=format&fit=crop'],
        category_id: categoryNameToId['和田玉'],
        rating: 4.6,
        review_count: 0,
        sales: 0,
        stock: 20,
        specifications: {},
        tags: ['挂件','和田玉'],
        is_active: true,
        is_buyback_eligible: false,
        buyback_percentage: 0,
        created_at: now,
        updated_at: now,
      },
    ]
    const { data: prodRows, error: prodErr } = await supabase
      .from('products')
      .insert(products)
      .select('id,name')
    if (prodErr) throw prodErr
    results.products = true
    console.log(`商品迁移完成: ${prodRows?.length ?? 0} 条`)

    const productNameToId: Record<string, string> = {}
    for (const p of prodRows || []) productNameToId[p.name as string] = p.id as string

    // 3) Users (upsert)
    const user = {
      email: 'test@example.com',
      name: '张三',
      points: 1000,
      member_level: 'gold',
      created_at: now,
      updated_at: now,
    }
    const { data: userRows, error: userErr } = await supabase
      .from('users')
      .upsert([user], { onConflict: 'email' })
      .select('id,email')
    if (userErr) throw userErr
    const userId = userRows?.[0]?.id as string
    results.users = true
    console.log(`用户迁移完成: ${userRows?.length ?? 0} 条（基于 email 去重）`)

    // 4) Orders
    const orders = [
      {
        user_id: userId,
        total_amount: 1999,
        status: 'completed',
        shipping_address: { receiver: '张三', city: '杭州', detail: '西湖区' },
        payment_method: 'wechat',
        payment_status: 'paid',
        tracking_number: null,
        notes: 'order-001',
        created_at: now,
        updated_at: now,
      },
    ]
    const { data: orderRows, error: orderErr } = await supabase
      .from('orders')
      .insert(orders)
      .select('id,notes')
    if (orderErr) throw orderErr
    const orderId = orderRows?.[0]?.id as string
    results.orders = true
    console.log(`订单迁移完成: ${orderRows?.length ?? 0} 条`)

    // 5) Order Items
    const itemRows = [
      {
        order_id: orderId,
        product_id: productNameToId['A货翡翠手镯'],
        quantity: 1,
        price: 1999,
        specifications: {},
      },
    ]
    const { error: orderItemErr } = await supabase
      .from('order_items')
      .insert(itemRows)
    if (orderItemErr) throw orderItemErr
    console.log(`订单项迁移完成: ${itemRows.length} 条`)

    // 6) Reviews
    const reviews = [
      {
        product_id: productNameToId['A货翡翠手镯'],
        user_id: userId,
        rating: 5,
        comment: '非常满意，做工精细！',
        images: [],
        created_at: now,
      },
    ]
    const { error: reviewErr } = await supabase
      .from('reviews')
      .insert(reviews)
    if (reviewErr) throw reviewErr
    results.reviews = true
    console.log(`评价迁移完成: ${reviews.length} 条`)

    // 7) Carousel Items
    const carouselItems = [
      { image_url: '/images/jadeite.svg', sort_order: 1, is_active: true, created_at: now },
      { image_url: '/images/hetian.svg', sort_order: 2, is_active: true, created_at: now },
    ]
    const { error: carouselErr } = await supabase
      .from('carousel_items')
      .insert(carouselItems)
    if (carouselErr) throw carouselErr
    results.carouselItems = true
    console.log(`轮播图迁移完成: ${carouselItems.length} 条`)

    // 8) Announcements
    const announcements = [
      { title: '欢迎上线', content: '玉石雅韵电商平台欢迎您', type: 'info', is_pinned: false, is_active: true, created_at: now },
      { title: '双十一活动', content: '全场满减优惠，限时促销', type: 'promo', is_pinned: true, is_active: true, created_at: now },
    ]
    const { error: annErr } = await supabase
      .from('announcements')
      .insert(announcements)
    if (annErr) throw annErr
    results.announcements = true
    console.log(`公告迁移完成: ${announcements.length} 条`)

    console.log('Supabase 数据迁移完成（API）！')
  } catch (err) {
    console.error('迁移失败:', err)
    // 返回已完成的部分结果，未完成部分保持为 false
  }

  return results
}

export async function clearAllData(): Promise<boolean> {
  const supabase = getSupabase()
  try {
    const tables = [
      'reviews',
      'order_items',
      'orders',
      'products',
      'categories',
      'users',
      'carousel_items',
      'announcements',
    ]
    const NEVER_UUID = '00000000-0000-0000-0000-000000000000'
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', NEVER_UUID)
      if (error) throw error
      console.log(`成功清空表: ${table}`)
    }
    console.log('清空数据完成（API）！')
    return true
  } catch (err) {
    console.error('清空数据失败:', err)
    return false
  }
}