import { supabase } from '@/lib/supabase'
import type { Product, Order } from '@/types'

interface SyncStatus {
  isInitialized: boolean
  isConnected: boolean
  lastSyncTime?: Date
  error?: string
}

interface ProductStockUpdate {
  id: string
  stock_quantity: number
  is_available: boolean
}

interface OrderStatusUpdate {
  id: string
  status: string
  updated_at: string
}

interface RealtimeCallbacks {
  onProductStockUpdate?: (product: ProductStockUpdate) => void
  onOrderStatusUpdate?: (order: OrderStatusUpdate) => void
  onProductUpdate?: (product: Product) => void
  onOrderUpdate?: (order: Order) => void
  onCartUpdate?: (cartItem: any) => void
  onUserUpdate?: (user: any) => void
  onReviewUpdate?: (review: any) => void
  onError?: (error: Error) => void
  onConnectionChange?: (isConnected: boolean) => void
}

class RealtimeSyncService {
  private syncStatus: SyncStatus = {
    isInitialized: false,
    isConnected: false
  }

  private subscriptions: any[] = []
  private callbacks: RealtimeCallbacks = {}
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  async initialize(callbacks: RealtimeCallbacks = {}): Promise<void> {
    try {
      this.callbacks = callbacks
      
      // 订阅商品表变化（主要关注库存变化）
      await this.subscribeToProductChanges()
      
      // 订阅订单表变化（主要关注状态变化）
      await this.subscribeToOrderChanges()
      
      // 订阅评论表变化
      await this.subscribeToReviewChanges()

      // 订阅购物车变化
      await this.subscribeToCartChanges()

      // 订阅用户信息变化
      await this.subscribeToUserChanges()

      // 监听网络连接状态
      this.setupConnectionMonitoring()

      this.syncStatus.isInitialized = true
      this.syncStatus.isConnected = true
      this.syncStatus.lastSyncTime = new Date()
      this.syncStatus.error = undefined
      this.reconnectAttempts = 0

      this.callbacks.onConnectionChange?.(true)
      console.log('Realtime sync service initialized with enhanced features')
    } catch (error) {
      console.error('Failed to initialize realtime sync service:', error)
      this.syncStatus.error = error instanceof Error ? error.message : 'Unknown error'
      this.callbacks.onError?.(error instanceof Error ? error : new Error('Unknown error'))
      this.callbacks.onConnectionChange?.(false)
      throw error
    }
  }

  private async subscribeToProductChanges(): Promise<void> {
    try {
      const subscription = supabase
        .channel('products_realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'products'
          },
          (payload) => {
            const product = payload.new as Product
            console.log('Product updated:', product)
            
            // 触发商品更新回调
            this.callbacks.onProductUpdate?.(product)
            
            // 如果是库存相关更新，触发库存更新回调
            if (payload.old && (
              payload.old.stock_quantity !== product.stock_quantity ||
              payload.old.is_available !== product.is_available
            )) {
              this.callbacks.onProductStockUpdate?.({
                id: product.id,
                stock_quantity: product.stock_quantity,
                is_available: product.is_available
              })
            }
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error('Failed to subscribe to product changes:', error)
      throw error
    }
  }

  private async subscribeToOrderChanges(): Promise<void> {
    try {
      const subscription = supabase
        .channel('orders_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            const order = payload.new as Order
            console.log('Order changed:', order)
            
            // 触发订单更新回调
            this.callbacks.onOrderUpdate?.(order)
            
            // 如果是状态更新，触发状态更新回调
            if (payload.event === 'UPDATE' && payload.old && payload.old.status !== order.status) {
              this.callbacks.onOrderStatusUpdate?.({
                id: order.id,
                status: order.status,
                updated_at: order.updated_at
              })
            }
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error('Failed to subscribe to order changes:', error)
      throw error
    }
  }

  private async subscribeToReviewChanges(): Promise<void> {
    try {
      const subscription = supabase
        .channel('reviews_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reviews'
          },
          (payload) => {
            console.log('Review changed:', payload)
            this.callbacks.onReviewUpdate?.(payload.new)
            // 可以在这里触发产品评分的重新计算
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error('Failed to subscribe to review changes:', error)
      throw error
    }
  }

  private async subscribeToCartChanges(): Promise<void> {
    try {
      const subscription = supabase
        .channel('cart_items_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items'
          },
          (payload) => {
            console.log('Cart item changed:', payload)
            this.callbacks.onCartUpdate?.(payload.new)
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error('Failed to subscribe to cart changes:', error)
      throw error
    }
  }

  private async subscribeToUserChanges(): Promise<void> {
    try {
      const subscription = supabase
        .channel('users_realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users'
          },
          (payload) => {
            console.log('User updated:', payload)
            this.callbacks.onUserUpdate?.(payload.new)
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error('Failed to subscribe to user changes:', error)
      throw error
    }
  }

  private setupConnectionMonitoring(): void {
    // 监听网络连接状态
    window.addEventListener('online', () => {
      console.log('Network connection restored')
      this.syncStatus.isConnected = true
      this.callbacks.onConnectionChange?.(true)
      this.reconnect().catch(console.error)
    })

    window.addEventListener('offline', () => {
      console.log('Network connection lost')
      this.syncStatus.isConnected = false
      this.callbacks.onConnectionChange?.(false)
    })

    // 监听 Supabase 连接状态
    supabase.realtime.onOpen(() => {
      console.log('Supabase realtime connection opened')
      this.syncStatus.isConnected = true
      this.reconnectAttempts = 0
      this.callbacks.onConnectionChange?.(true)
    })

    supabase.realtime.onClose(() => {
      console.log('Supabase realtime connection closed')
      this.syncStatus.isConnected = false
      this.callbacks.onConnectionChange?.(false)
      this.attemptReconnect()
    })

    supabase.realtime.onError((error) => {
      console.error('Supabase realtime error:', error)
      this.syncStatus.error = error.message
      this.callbacks.onError?.(error)
      this.attemptReconnect()
    })
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1) // 指数退避

    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)
    
    setTimeout(() => {
      this.reconnect().catch(console.error)
    }, delay)
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus }
  }

  // 订阅特定产品的库存变化
  async subscribeToProductStock(productId: string, callback: (payload: any) => void): Promise<void> {
    try {
      const subscription = supabase
        .channel(`product_stock_${productId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
            filter: `id=eq.${productId}`
          },
          (payload) => {
            const product = payload.new as Product
            const oldProduct = payload.old as Product
            
            // 只在库存相关字段变化时触发回调
            if (oldProduct.stock_quantity !== product.stock_quantity || 
                oldProduct.is_available !== product.is_available) {
              callback({
                ...payload,
                stockUpdate: {
                  id: product.id,
                  stock_quantity: product.stock_quantity,
                  is_available: product.is_available,
                  previous_stock: oldProduct.stock_quantity
                }
              })
            }
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error(`Failed to subscribe to product stock for ${productId}:`, error)
    }
  }

  // 订阅用户的订单变化
  async subscribeToUserOrders(userId: string, callback: (payload: any) => void): Promise<void> {
    try {
      const subscription = supabase
        .channel(`user_orders_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            const order = payload.new as Order
            callback({
              ...payload,
              orderUpdate: {
                id: order.id,
                status: order.status,
                total_amount: order.total_amount,
                updated_at: order.updated_at
              }
            })
          }
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error(`Failed to subscribe to user orders for ${userId}:`, error)
    }
  }

  // 订阅购物车变化（针对特定用户）
  async subscribeToUserCart(userId: string, callback: (payload: any) => void): Promise<void> {
    try {
      const subscription = supabase
        .channel(`user_cart_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${userId}`
          },
          callback
        )
        .subscribe()

      this.subscriptions.push(subscription)
    } catch (error) {
      console.error(`Failed to subscribe to user cart for ${userId}:`, error)
    }
  }

  // 乐观更新产品库存
  async optimisticStockUpdate(
    productId: string,
    stockChange: number,
    localUpdateCallback: (productId: string, newStock: number) => void
  ): Promise<void> {
    try {
      // 先获取当前库存
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single()

      if (fetchError) throw fetchError

      const newStock = Math.max(0, product.stock_quantity + stockChange)
      
      // 先执行本地更新
      localUpdateCallback(productId, newStock)

      // 然后同步到服务器
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newStock,
          is_available: newStock > 0
        })
        .eq('id', productId)

      if (error) {
        // 如果服务器更新失败，回滚本地更新
        localUpdateCallback(productId, product.stock_quantity)
        throw error
      }

      this.syncStatus.lastSyncTime = new Date()
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error)
      throw error
    }
  }

  // 乐观更新订单状态
  async optimisticOrderStatusUpdate(
    orderId: string,
    newStatus: string,
    localUpdateCallback: (orderId: string, status: string) => void,
    rollbackCallback?: (orderId: string, originalStatus: string) => void
  ): Promise<void> {
    let originalStatus: string | undefined

    try {
      // 获取原始状态
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single()

      if (fetchError) throw fetchError
      originalStatus = order.status

      // 先执行本地更新
      localUpdateCallback(orderId, newStatus)

      // 然后同步到服务器
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        // 如果服务器更新失败，回滚本地更新
        if (rollbackCallback && originalStatus) {
          rollbackCallback(orderId, originalStatus)
        }
        throw error
      }

      this.syncStatus.lastSyncTime = new Date()
    } catch (error) {
      console.error(`Failed to update order status for ${orderId}:`, error)
      throw error
    }
  }

  async unsubscribeAll(): Promise<void> {
    try {
      for (const subscription of this.subscriptions) {
        await supabase.removeChannel(subscription)
      }
      this.subscriptions = []
      this.syncStatus.isConnected = false
      this.callbacks.onConnectionChange?.(false)
    } catch (error) {
      console.error('Failed to unsubscribe from channels:', error)
    }
  }

  async reconnect(): Promise<void> {
    try {
      console.log('Attempting to reconnect realtime service...')
      await this.unsubscribeAll()
      await this.initialize(this.callbacks)
      console.log('Realtime service reconnected successfully')
    } catch (error) {
      console.error('Failed to reconnect:', error)
      this.syncStatus.error = error instanceof Error ? error.message : 'Reconnection failed'
      this.callbacks.onError?.(error instanceof Error ? error : new Error('Reconnection failed'))
      throw error
    }
  }

  isOnline(): boolean {
    return navigator.onLine && this.syncStatus.isConnected
  }

  // 更新回调函数
  updateCallbacks(callbacks: Partial<RealtimeCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  // 批量订阅多个产品的库存变化
  async subscribeToMultipleProductsStock(
    productIds: string[], 
    callback: (productId: string, stockUpdate: ProductStockUpdate) => void
  ): Promise<void> {
    for (const productId of productIds) {
      await this.subscribeToProductStock(productId, (payload) => {
        if (payload.stockUpdate) {
          callback(productId, payload.stockUpdate)
        }
      })
    }
  }

  // 获取连接统计信息
  getConnectionStats() {
    return {
      isConnected: this.syncStatus.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      lastSyncTime: this.syncStatus.lastSyncTime,
      subscriptionsCount: this.subscriptions.length,
      error: this.syncStatus.error
    }
  }
}

export const realtimeSyncService = new RealtimeSyncService()
export default realtimeSyncService