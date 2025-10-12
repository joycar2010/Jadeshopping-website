import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
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
  ExternalLink
} from 'lucide-react'

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { 
    orderDetail, 
    orderDetailLoading, 
    shippingInfo,
    fetchOrderDetail, 
    getShippingInfo,
    cancelOrder, 
    reorderItems,
    clearOrderDetail,
    isLoading,
    error,
    setError
  } = useStore()
  
  useEffect(() => {
    if (id) {
      fetchOrderDetail(id)
      getShippingInfo(id)
    }
    
    return () => {
      clearOrderDetail()
    }
  }, [id, fetchOrderDetail, getShippingInfo, clearOrderDetail])
  
  // 状态映射
  const statusConfig = {
    pending: { 
      label: '待支付', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Clock,
      description: '请尽快完成支付，订单将在24小时后自动取消'
    },
    processing: { 
      label: '处理中', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Package,
      description: '商家正在处理您的订单，请耐心等待'
    },
    shipped: { 
      label: '已发货', 
      color: 'bg-purple-100 text-purple-800 border-purple-200', 
      icon: Truck,
      description: '商品已发货，正在运输途中'
    },
    delivered: { 
      label: '已送达', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      description: '订单已完成，感谢您的购买'
    },
    cancelled: { 
      label: '已取消', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle,
      description: '订单已取消，如有疑问请联系客服'
    }
  }
  
  // 支付方式映射
  const paymentMethodMap = {
    credit_card: '信用卡',
    paypal: 'PayPal',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay',
    balance: '余额支付',
    bank_card: '银行卡'
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
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
      navigator.clipboard.writeText(orderDetail.id)
      alert('订单号已复制到剪贴板')
    }
  }
  
  // 处理取消订单
  const handleCancelOrder = async () => {
    if (orderDetail && window.confirm('确定要取消这个订单吗？')) {
      const success = await cancelOrder(orderDetail.id)
      if (success) {
        // 重新获取订单详情
        fetchOrderDetail(orderDetail.id)
      }
    }
  }
  
  // 处理重新下单
  const handleReorder = () => {
    if (orderDetail) {
      reorderItems(orderDetail.id)
      alert('商品已添加到购物车')
      navigate('/cart')
    }
  }
  
  if (orderDetailLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin text-jade-600" />
              <span className="text-lg text-gray-600">加载订单详情中...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">订单不存在</h3>
            <p className="text-gray-600 mb-6">找不到指定的订单信息</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回订单列表
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  const StatusIcon = statusConfig[orderDetail.status].icon
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center text-jade-600 hover:text-jade-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回订单列表
          </Link>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* 订单状态卡片 */}
        <div className={`bg-white rounded-lg shadow-sm border-2 ${statusConfig[orderDetail.status].color} p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${statusConfig[orderDetail.status].color}`}>
                <StatusIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {statusConfig[orderDetail.status].label}
                </h2>
                <p className="text-gray-600 mt-1">
                  {statusConfig[orderDetail.status].description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span>下单时间</span>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(orderDetail.created_at)}
              </p>
            </div>
          </div>
        </div>
        
        {/* 订单信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">订单信息</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">订单号：</span>
              <span className="font-mono text-sm font-medium text-gray-900">{orderDetail.id}</span>
              <button
                onClick={copyOrderId}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="复制订单号"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                支付信息
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">支付方式：</span>
                  <span className="text-gray-900">
                    {paymentMethodMap[orderDetail.payment_method as keyof typeof paymentMethodMap] || orderDetail.payment_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总额：</span>
                  <span className="text-gray-900">¥{(orderDetail.total_amount - orderDetail.shipping_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运费：</span>
                  <span className="text-gray-900">¥{orderDetail.shipping_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
                  <span className="text-gray-900">实付金额：</span>
                  <span className="text-jade-600">¥{orderDetail.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                收货地址
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{orderDetail.shipping_address.full_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{orderDetail.shipping_address.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-900">
                    {orderDetail.shipping_address.province} {orderDetail.shipping_address.city} {orderDetail.shipping_address.district} {orderDetail.shipping_address.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 物流信息 */}
        {shippingInfo && orderDetail.status !== 'pending' && orderDetail.status !== 'cancelled' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-400" />
                物流信息
              </h3>
              {shippingInfo.tracking_number && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">运单号：</span>
                  <span className="font-mono text-sm font-medium text-gray-900">{shippingInfo.tracking_number}</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">承运商：</span>
                <span className="text-gray-900">{shippingInfo.carrier}</span>
              </div>
              
              {shippingInfo.tracking_events && shippingInfo.tracking_events.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">物流轨迹</h4>
                  <div className="space-y-3">
                    {shippingInfo.tracking_events.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${index === 0 ? 'bg-jade-500' : 'bg-gray-300'}`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(event.timestamp)}</p>
                          {event.location && (
                            <p className="text-xs text-gray-500">{event.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 商品列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-400" />
            商品清单 ({orderDetail.items.length}件)
          </h3>
          
          <div className="space-y-4">
            {orderDetail.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-gray-900 mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.product.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">单价：¥{item.unit_price.toLocaleString()}</span>
                    <span className="text-gray-600">数量：{item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900">
                    ¥{(item.unit_price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            {orderDetail.status === 'delivered' && (
              <button
                onClick={handleReorder}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-jade-700 bg-jade-50 border border-jade-200 rounded-lg hover:bg-jade-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                再次购买
              </button>
            )}
            
            {orderDetail.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5 mr-2" />
                {isLoading ? '取消中...' : '取消订单'}
              </button>
            )}
            
            <Link
              to="/orders"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-jade-600 border border-transparent rounded-lg hover:bg-jade-700 transition-colors"
            >
              返回订单列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail