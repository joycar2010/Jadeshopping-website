import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { OrderService } from '@/services/orderService'
import { realtimeSyncService } from '@/services/realtimeSyncService'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  CreditCard,
  Phone,
  User,
  Calendar,
  RefreshCw,
  RotateCcw,
  Copy,
  ExternalLink,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react'

interface OrderDetail {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  updated_at?: string
  payment_method: string
  shipping_method?: string
  tracking_number?: string
  carrier?: string
  notes?: string
  shipping_fee?: number
  discount_amount?: number
  tax_amount?: number
  order_items: Array<{
    id: string
    product_id: string
    quantity: number
    price: number
    products: {
      id: string
      name: string
      description?: string
      image_url?: string
    }
  }>
  shipping_address?: {
    id: string
    name: string
    phone: string
    province: string
    city: string
    district: string
    address: string
    postal_code?: string
  }
  order_history?: Array<{
    id: string
    status: string
    notes?: string
    created_at: string
  }>
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useStore()
  const orderService = new OrderService()
  
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  
  // 获取订单详情
  const fetchOrderDetail = async (orderId: string) => {
    setOrderDetailLoading(true)
    setError(null)
    
    try {
      const result = await orderService.getOrderById(orderId)
      if (result.success && result.data) {
        setOrderDetail(result.data)
      } else {
        setError(result.error || 'Order not found')
      }
    } catch (err) {
      console.error('Failed to fetch order detail:', err)
      setError('Failed to load order details')
    } finally {
      setOrderDetailLoading(false)
    }
  }

  // 获取订单历史
  const fetchOrderHistory = async (orderId: string) => {
    try {
      const result = await orderService.getOrderHistory(orderId)
      if (result.success && result.data && orderDetail) {
        setOrderDetail(prev => prev ? { ...prev, order_history: result.data } : null)
      }
    } catch (err) {
      console.error('Failed to fetch order history:', err)
    }
  }
  
  useEffect(() => {
    if (id) {
      fetchOrderDetail(id)
      fetchOrderHistory(id)
    }
  }, [id])

  // 设置实时订阅
  useEffect(() => {
    const initializeRealtime = async () => {
      try {
        await realtimeSyncService.initialize({
          onOrderUpdate: (orderUpdate) => {
            console.log('Order updated:', orderUpdate)
            if (orderUpdate.id === id) {
              const statusInfo = orderService.getOrderStatusInfo(orderUpdate.status)
              toast.info(`Order status updated to ${statusInfo.label}`)
              
              // 更新订单详情
              setOrderDetail(prev => prev ? { ...prev, ...orderUpdate } : null)
              
              // 重新获取订单历史
              if (id) {
                fetchOrderHistory(id)
              }
            }
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
            if (payload.eventType === 'UPDATE' && payload.new.id === id) {
              setOrderDetail(prev => prev ? { ...prev, ...payload.new } : null)
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
  }, [id, user?.id])
  
  // 状态映射
  const statusConfig = {
    pending: { 
      label: 'Pending Payment', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Clock,
      description: 'Please complete payment within 24 hours or the order will be automatically cancelled'
    },
    paid: { 
      label: 'Paid', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Package,
      description: 'Payment received, order is being processed'
    },
    processing: { 
      label: 'Processing', 
      color: 'bg-purple-100 text-purple-800 border-purple-200', 
      icon: Package,
      description: 'Your order is being prepared for shipment'
    },
    shipped: { 
      label: 'Shipped', 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      icon: Truck,
      description: 'Your order has been shipped and is on its way'
    },
    delivered: { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      description: 'Order has been delivered successfully'
    },
    completed: { 
      label: 'Completed', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      description: 'Order completed, thank you for your purchase'
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle,
      description: 'Order has been cancelled'
    },
    refunding: { 
      label: 'Refunding', 
      color: 'bg-orange-100 text-orange-800 border-orange-200', 
      icon: AlertCircle,
      description: 'Refund is being processed'
    },
    refunded: { 
      label: 'Refunded', 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      icon: AlertCircle,
      description: 'Refund has been completed'
    }
  }
  
  // 支付方式映射
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
  
  // 格式化日期
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
  
  // 复制订单号
  const copyOrderId = () => {
    if (orderDetail) {
      navigator.clipboard.writeText(orderDetail.order_number)
      toast.success('Order number copied to clipboard')
    }
  }
  
  // 处理取消订单
  const handleCancelOrder = async () => {
    if (!orderDetail || !window.confirm('Are you sure you want to cancel this order?')) return
    
    try {
      const result = await orderService.cancelOrder(orderDetail.id, 'Cancelled by user')
      
      if (result.success) {
        toast.success('Order cancelled successfully')
        fetchOrderDetail(orderDetail.id)
      } else {
        toast.error(result.error || 'Failed to cancel order')
      }
    } catch (err) {
      console.error('Failed to cancel order:', err)
      toast.error('Failed to cancel order')
    }
  }
  
  // 处理重新下单
  const handleReorder = async () => {
    if (!orderDetail || !user?.id) return
    
    try {
      const result = await orderService.reorder(orderDetail.id, user.id)
      
      if (result.success) {
        toast.success('Order created successfully')
        navigate('/orders')
      } else {
        toast.error(result.error || 'Failed to reorder items')
      }
    } catch (err) {
      console.error('Failed to reorder:', err)
      toast.error('Failed to reorder items')
    }
  }

  // 确认收货
  const handleConfirmDelivery = async () => {
    if (!orderDetail || !user?.id) return
    if (!window.confirm('Are you sure you want to confirm delivery?')) return

    try {
      const result = await orderService.confirmDelivery(orderDetail.id, user.id)
      
      if (result.success) {
        toast.success('Delivery confirmed successfully')
        fetchOrderDetail(orderDetail.id)
      } else {
        toast.error(result.error || 'Failed to confirm delivery')
      }
    } catch (err) {
      console.error('Failed to confirm delivery:', err)
      toast.error('Failed to confirm delivery')
    }
  }
  
  if (orderDetailLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading order details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !orderDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[orderDetail.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Link
              to="/orders"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Orders
            </Link>
            
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
                onClick={() => id && fetchOrderDetail(id)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={orderDetailLoading}
              >
                <RefreshCw className={`h-4 w-4 ${orderDetailLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full border ${statusInfo.color}`}>
                <StatusIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">{statusInfo.label}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{orderDetail.order_number}
                </h1>
                <p className="text-gray-600 mt-1">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Order Date</span>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(orderDetail.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Order Number:</span>
              <span className="font-mono text-sm font-medium text-gray-900">{orderDetail.order_number}</span>
              <button
                onClick={copyOrderId}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy order number"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                Payment Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900">{paymentMethodMap[orderDetail.payment_method as keyof typeof paymentMethodMap] || orderDetail.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">¥{(orderDetail.total_amount - (orderDetail.shipping_fee || 0) - (orderDetail.tax_amount || 0) + (orderDetail.discount_amount || 0)).toFixed(2)}</span>
                </div>
                {orderDetail.discount_amount && orderDetail.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-¥{orderDetail.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                {orderDetail.shipping_fee && orderDetail.shipping_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="text-gray-900">¥{orderDetail.shipping_fee.toFixed(2)}</span>
                  </div>
                )}
                {orderDetail.tax_amount && orderDetail.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">¥{orderDetail.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-blue-600">¥{orderDetail.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                Shipping Information
              </h4>
              <div className="space-y-2 text-sm">
                {orderDetail.shipping_address ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipient:</span>
                      <span className="text-gray-900">{orderDetail.shipping_address.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-900">{orderDetail.shipping_address.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="text-gray-900 text-right max-w-xs">
                        {orderDetail.shipping_address.province} {orderDetail.shipping_address.city} {orderDetail.shipping_address.district} {orderDetail.shipping_address.address}
                      </span>
                    </div>
                    {orderDetail.shipping_address.postal_code && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Postal Code:</span>
                        <span className="text-gray-900">{orderDetail.shipping_address.postal_code}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500">No shipping address information</div>
                )}
                
                {orderDetail.shipping_method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="text-gray-900">{orderDetail.shipping_method}</span>
                  </div>
                )}
                
                {orderDetail.tracking_number && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tracking Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-mono text-xs">{orderDetail.tracking_number}</span>
                      <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        {orderDetail.order_history && orderDetail.order_history.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              Order History
            </h3>
            <div className="space-y-4">
              {orderDetail.order_history.map((history, index) => {
                const historyStatusInfo = statusConfig[history.status as keyof typeof statusConfig] || statusConfig.pending
                const HistoryIcon = historyStatusInfo.icon
                
                return (
                  <div key={history.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${historyStatusInfo.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                      <HistoryIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {historyStatusInfo.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(history.created_at)}
                        </p>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Product List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-400" />
            Order Items ({orderDetail.order_items.length} items)
          </h3>
          
          <div className="space-y-4">
            {orderDetail.order_items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.products.image_url || '/placeholder-product.jpg'}
                  alt={item.products.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-gray-900 mb-1">
                    {item.products.name}
                  </h4>
                  {item.products.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {item.products.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">Unit Price: ¥{item.price.toFixed(2)}</span>
                    <span className="text-gray-600">Quantity: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900">
                    ¥{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-end space-x-4">
            {['completed', 'cancelled'].includes(orderDetail.status) && (
              <button
                onClick={handleReorder}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reorder
              </button>
            )}
            
            {orderDetail.status === 'delivered' && (
              <button
                onClick={handleConfirmDelivery}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Delivery
              </button>
            )}
            
            {orderDetail.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail