import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
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
  RotateCcw
} from 'lucide-react'

const Orders: React.FC = () => {
  const { 
    orders, 
    ordersLoading, 
    fetchOrders, 
    cancelOrder, 
    reorderItems,
    isLoading,
    error,
    setError
  } = useStore()
  
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  useEffect(() => {
    fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
  }, [statusFilter, currentPage, fetchOrders])
  
  // 状态映射
  const statusConfig = {
    pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    processing: { label: '处理中', color: 'bg-blue-100 text-blue-800', icon: Package },
    shipped: { label: '已发货', color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { label: '已送达', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-800', icon: XCircle }
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
  
  // 处理取消订单
  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('确定要取消这个订单吗？')) {
      const success = await cancelOrder(orderId)
      if (success) {
        // 刷新订单列表
        fetchOrders({ status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage })
      }
    }
  }
  
  // 处理重新下单
  const handleReorder = (orderId: string) => {
    reorderItems(orderId)
    // 可以显示成功提示或跳转到购物车
    alert('商品已添加到购物车')
  }
  
  // 过滤订单
  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      return order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    return true
  })
  
  if (ordersLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin text-jade-600" />
              <span className="text-lg text-gray-600">加载订单中...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
          <p className="text-gray-600 mt-2">查看和管理您的所有订单</p>
        </div>
        
        {/* 筛选和搜索 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* 状态筛选 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-jade-500 focus:border-transparent"
              >
                <option value="all">全部状态</option>
                <option value="pending">待支付</option>
                <option value="processing">处理中</option>
                <option value="shipped">已发货</option>
                <option value="delivered">已送达</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
            
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索订单号或商品名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-jade-500 focus:border-transparent w-full md:w-80"
              />
            </div>
          </div>
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
        
        {/* 订单列表 */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
            <p className="text-gray-600 mb-6">您还没有任何订单，快去选购心仪的商品吧！</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              去购物
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* 订单头部 */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">订单号：</span>
                        <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>下单时间：{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 订单内容 */}
                  <div className="px-6 py-4">
                    {/* 商品列表 */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ¥{item.unit_price.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ¥{(item.unit_price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 订单信息 */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4 md:mb-0">
                        <span>支付方式：{paymentMethodMap[order.payment_method as keyof typeof paymentMethodMap] || order.payment_method}</span>
                        <span>收货人：{order.shipping_address.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-900">
                          总计：¥{order.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-end space-x-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleReorder(order.id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-jade-700 bg-jade-50 border border-jade-200 rounded-md hover:bg-jade-100 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          再次购买
                        </button>
                      )}
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isLoading}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {isLoading ? '取消中...' : '取消订单'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {/* 加载更多 */}
        {ordersLoading && orders.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-jade-600" />
              <span className="text-gray-600">加载中...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders