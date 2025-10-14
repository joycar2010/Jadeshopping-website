import { useEffect, useCallback, useState } from 'react'
import { realtimeSyncService } from '@/services/realtimeSyncService'
import type { Product, Order } from '@/types'

interface UseRealtimeSyncOptions {
  onProductStockUpdate?: (product: { id: string; stock_quantity: number; is_available: boolean }) => void
  onOrderStatusUpdate?: (order: { id: string; status: string; updated_at: string }) => void
  onProductUpdate?: (product: Product) => void
  onOrderUpdate?: (order: Order) => void
  onError?: (error: Error) => void
  autoConnect?: boolean
}

interface RealtimeSyncState {
  isConnected: boolean
  isInitialized: boolean
  lastSyncTime?: Date
  error?: string
}

export function useRealtimeSync(options: UseRealtimeSyncOptions = {}) {
  const [syncState, setSyncState] = useState<RealtimeSyncState>({
    isConnected: false,
    isInitialized: false
  })

  const {
    onProductStockUpdate,
    onOrderStatusUpdate,
    onProductUpdate,
    onOrderUpdate,
    onError,
    autoConnect = true
  } = options

  const updateSyncState = useCallback(() => {
    const status = realtimeSyncService.getSyncStatus()
    setSyncState({
      isConnected: status.isConnected,
      isInitialized: status.isInitialized,
      lastSyncTime: status.lastSyncTime,
      error: status.error
    })
  }, [])

  const connect = useCallback(async () => {
    try {
      await realtimeSyncService.initialize({
        onProductStockUpdate,
        onOrderStatusUpdate,
        onProductUpdate,
        onOrderUpdate,
        onError: (error) => {
          onError?.(error)
          updateSyncState()
        }
      })
      updateSyncState()
    } catch (error) {
      console.error('Failed to connect realtime sync:', error)
      onError?.(error instanceof Error ? error : new Error('Connection failed'))
      updateSyncState()
    }
  }, [onProductStockUpdate, onOrderStatusUpdate, onProductUpdate, onOrderUpdate, onError, updateSyncState])

  const disconnect = useCallback(async () => {
    try {
      await realtimeSyncService.unsubscribeAll()
      updateSyncState()
    } catch (error) {
      console.error('Failed to disconnect realtime sync:', error)
      onError?.(error instanceof Error ? error : new Error('Disconnect failed'))
    }
  }, [onError, updateSyncState])

  const reconnect = useCallback(async () => {
    try {
      await realtimeSyncService.reconnect()
      updateSyncState()
    } catch (error) {
      console.error('Failed to reconnect realtime sync:', error)
      onError?.(error instanceof Error ? error : new Error('Reconnect failed'))
      updateSyncState()
    }
  }, [onError, updateSyncState])

  const subscribeToUserOrders = useCallback(async (userId: string, callback: (payload: any) => void) => {
    try {
      await realtimeSyncService.subscribeToUserOrders(userId, callback)
    } catch (error) {
      console.error('Failed to subscribe to user orders:', error)
      onError?.(error instanceof Error ? error : new Error('Subscribe failed'))
    }
  }, [onError])

  const subscribeToProductStock = useCallback(async (productId: string, callback: (payload: any) => void) => {
    try {
      await realtimeSyncService.subscribeToProductStock(productId, callback)
    } catch (error) {
      console.error('Failed to subscribe to product stock:', error)
      onError?.(error instanceof Error ? error : new Error('Subscribe failed'))
    }
  }, [onError])

  const optimisticUpdate = useCallback(async <T>(
    table: string,
    id: string,
    updates: Partial<T>,
    localUpdateCallback: (data: Partial<T>) => void
  ) => {
    try {
      await realtimeSyncService.optimisticUpdate(table, id, updates, localUpdateCallback)
      updateSyncState()
    } catch (error) {
      console.error('Optimistic update failed:', error)
      onError?.(error instanceof Error ? error : new Error('Update failed'))
      updateSyncState()
    }
  }, [onError, updateSyncState])

  // 自动连接
  useEffect(() => {
    if (autoConnect && !syncState.isInitialized) {
      connect()
    }

    return () => {
      if (syncState.isConnected) {
        disconnect()
      }
    }
  }, [autoConnect, syncState.isInitialized, syncState.isConnected, connect, disconnect])

  // 监听网络状态变化
  useEffect(() => {
    const handleOnline = () => {
      if (syncState.isInitialized && !syncState.isConnected) {
        reconnect()
      }
    }

    const handleOffline = () => {
      updateSyncState()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncState.isInitialized, syncState.isConnected, reconnect, updateSyncState])

  return {
    // 状态
    ...syncState,
    isOnline: realtimeSyncService.isOnline(),
    
    // 方法
    connect,
    disconnect,
    reconnect,
    subscribeToUserOrders,
    subscribeToProductStock,
    optimisticUpdate,
    
    // 工具方法
    updateCallbacks: realtimeSyncService.updateCallbacks.bind(realtimeSyncService)
  }
}

export default useRealtimeSync