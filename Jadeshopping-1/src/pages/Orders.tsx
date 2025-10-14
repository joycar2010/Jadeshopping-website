import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { OrderService } from '@/services/orderService'
import { realtimeSyncService } from '@/services/realtimeSyncService'
import { toast } from 'sonner'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  RefreshCw,
  ShoppingCart,
  Eye,
  RotateCcw,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  payment_method: string
  shipping_method?: string
  tracking_number?: string
  order_items: Array<{
    id: string
    product_id: string
    quantity: number
    price: number
    products: {
      id: string
      name: string
      image_url?: string
    }
  }>
}

const Orders: React.FC = () => {
  const { user } = useStore()
  const orderService = new OrderService()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isConnected, setIsConnected] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)

  // 获取订单列表
  const fetchOrders = async (filters: { status?: string; page?: number } = {}) => {
    if (!user?.id) return

    setOrdersLoading(true)
    setError(null)
    
    try {
      const result = await orderService.getOrders({
        user_id: user.id,
        status: filters.status,
        limit: 10,
        offset: ((filters.page || 1) - 1) * 10
      })
      
      if (result.success && result.data) {
        setOrders(result.data.orders)
        setTotalOrders(result.data.total)
        setTotalPages(Math.ceil(result.data.total / 10))
      } else {
        setError(result.error || 'Failed to load orders')
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError('Failed to load orders. Please try again.')
    } finally {
      setOrdersLoading(false)
    }
  }

  // 取消订单
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    try {
      const result = await orderService.cancelOrder(orderId, 'Cancelled by user')
      
      if (result.success) {
        toast.success('Order cancelled successfully')
        fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
      } else {
        toast.error(result.error || 'Failed to cancel order')
      }
    } catch (err) {
      console.error('Failed to cancel order:', err)
      toast.error('Failed to cancel order')
    }
  }

  // 重新下单
  const handleReorder = async (orderId: string) => {
    if (!user?.id) return

    try {
      const result = await orderService.reorder(orderId, user.id)
      
      if (result.success) {
        toast.success('Order created successfully')
        // 刷新订单列表
        fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
      } else {
        toast.error(result.error || 'Failed to reorder items')
      }
    } catch (err) {
      console.error('Failed to reorder:', err)
      toast.error('Failed to reorder items')
    }
  }

  // 确认收货
  const handleConfirmDelivery = async (orderId: string) => {
    if (!user?.id) return
    if (!window.confirm('Are you sure you want to confirm delivery?')) return

    try {
      const result = await orderService.confirmDelivery(orderId, user.id)
      
      if (result.success) {
        toast.success('Delivery confirmed successfully')
        fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
      } else {
        toast.error(result.error || 'Failed to confirm delivery')
      }
    } catch (err) {
      console.error('Failed to confirm delivery:', err)
      toast.error('Failed to confirm delivery')
    }
  }
  
  // 设置实时订阅
  useEffect(() => {
    const initializeRealtime = async () => {
      try {
        await realtimeSyncService.initialize({
          onOrderUpdate: (orderUpdate) => {
            // 处理订单状态更新
            console.log('Order updated:', orderUpdate)
            const statusInfo = orderService.getOrderStatusInfo(orderUpdate.status)
            toast.info(`Order ${orderUpdate.order_number || orderUpdate.id} status updated to ${statusInfo.label}`)
            
            // 刷新订单列表
            fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
          },
          onConnectionChange: (connected) => {
            setIsConnected(connected)
            if (connected) {
              toast.success('Real-time updates connected')
            } else {
              toast.warning('Real-time updates disconnected')
            }
          },
          onError: (error) => {
            console.error('Realtime sync error:', error)
            toast.error('Real-time sync error occurred')
            setIsConnected(false)
          }
        })

        // 订阅用户订单变化
        if (user?.id) {
          await realtimeSyncService.subscribeToUserOrders(user.id, (payload) => {
            console.log('User orders changed:', payload)
            // 实时更新订单状态
            if (payload.eventType === 'UPDATE') {
              setOrders(prevOrders => 
                prevOrders.map(order => 
                  order.id === payload.new.id 
                    ? { ...order, ...payload.new }
                    : order
                )
              )
            }
          })
        }
      } catch (error) {
        console.error('Failed to initialize realtime sync:', error)
        setIsConnected(false)
      }
    }

    initializeRealtime()

    return () => {
      realtimeSyncService.unsubscribeAll()
    }
  }, [user?.id])

  useEffect(() => {
    fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
  }, [statusFilter, currentPage, user?.id])
  
  // Status mapping
  const statusConfig = {
    pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    paid: { label: 'Paid', color: 'bg-blue-100 text-blue-800', icon: Package },
    processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    refunding: { label: 'Refunding', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  }
  
  // Payment method mapping
  const paymentMethodMap = {
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay',
    balance: 'Account Balance',
    bank_card: 'Bank Card',
    wechat_pay: 'WeChat Pay',
    alipay: 'Alipay'
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        order.order_number.toLowerCase().includes(searchLower) ||
        order.order_items.some(item => 
          item.products.name.toLowerCase().includes(searchLower)
        )
      )
    }
    return true
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to sign in to view your orders.</p>
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">
                Track and manage your orders ({totalOrders} total)
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}
              
              <button
                onClick={() => fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={ordersLoading}
              >
                <RefreshCw className={`h-4 w-4 ${ordersLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by order number or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunding">Refunding</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {ordersLoading && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading orders...</span>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!ordersLoading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You haven\'t placed any orders yet.'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Start Shopping
            </Link>
          </div>
        )}

        {!ordersLoading && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                        
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusInfo.label}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ¥{order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {paymentMethodMap[order.payment_method as keyof typeof paymentMethodMap] || order.payment_method}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.products.image_url || '/placeholder-product.jpg'}
                              alt={item.products.name}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.products.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ¥{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ¥{(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {order.tracking_number && (
                          <span className="text-sm text-gray-600">
                            Tracking: {order.tracking_number}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        )}
                        
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleConfirmDelivery(order.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm Delivery
                          </button>
                        )}
                        
                        {['completed', 'cancelled'].includes(order.status) && (
                          <button
                            onClick={() => handleReorder(order.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!ordersLoading && filteredOrders.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders