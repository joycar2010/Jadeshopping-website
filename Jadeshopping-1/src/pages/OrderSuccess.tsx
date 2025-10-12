import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { CheckCircle, Package, Truck, Home, ShoppingBag, Download, Share2, Copy } from 'lucide-react'

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentOrder, clearCheckoutData } = useStore()
  
  const [copied, setCopied] = useState(false)
  
  // 从路由状态获取订单信息
  const { orderId, paymentMethod, amount } = location.state || {}
  
  useEffect(() => {
    // 如果没有订单信息，跳转回首页
    if (!orderId && !currentOrder) {
      navigate('/')
      return
    }
    
    // 清理结算相关数据
    clearCheckoutData()
  }, [orderId, currentOrder, navigate, clearCheckoutData])

  // 复制订单号
  const handleCopyOrderId = async () => {
    const orderIdToCopy = orderId || currentOrder?.id
    if (orderIdToCopy) {
      try {
        await navigator.clipboard.writeText(orderIdToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('复制失败:', error)
      }
    }
  }

  // 分享订单
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '翡翠商城订单',
        text: `我在翡翠商城成功下单，订单号：${orderId || currentOrder?.id}`,
        url: window.location.href
      })
    } else {
      // 降级处理：复制链接
      handleCopyOrderId()
    }
  }

  const displayOrder = currentOrder || {
    id: orderId,
    total_amount: amount,
    payment_method: paymentMethod
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 成功状态 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">支付成功！</h1>
          <p className="text-lg text-gray-600">您的订单已提交，我们将尽快为您处理</p>
        </div>

        {/* 订单信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">订单详情</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">订单号</span>
                  <div className="flex items-center">
                    <span className="font-mono text-sm text-gray-900 mr-2">
                      {displayOrder.id}
                    </span>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="复制订单号"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    {copied && (
                      <span className="text-xs text-green-600 ml-1">已复制</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">支付方式</span>
                  <span className="text-sm text-gray-900">
                    {paymentMethod || displayOrder.payment_method || '未知'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">支付金额</span>
                  <span className="text-lg font-semibold text-jade-600">
                    ¥{(amount || displayOrder.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">下单时间</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleString('zh-CN')}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">订单状态</span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                    已支付
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">预计发货</span>
                  <span className="text-sm text-gray-900">1-2个工作日</span>
                </div>
              </div>
            </div>
          </div>

          {/* 物流进度 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">订单进度</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 text-center">订单确认</span>
                <span className="text-xs text-green-600">已完成</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                <div className="h-full bg-green-600 w-0"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 text-center">商品打包</span>
                <span className="text-xs text-gray-400">待处理</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 text-center">物流配送</span>
                <span className="text-xs text-gray-400">待发货</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Home className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 text-center">确认收货</span>
                <span className="text-xs text-gray-400">待收货</span>
              </div>
            </div>
          </div>

          {/* 收货地址 */}
          {currentOrder?.shipping_address && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">收货地址</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {currentOrder.shipping_address.name} {currentOrder.shipping_address.phone}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {currentOrder.shipping_address.province} {currentOrder.shipping_address.city} {currentOrder.shipping_address.district}
                    </p>
                    <p className="text-gray-600">{currentOrder.shipping_address.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/orders"
            className="flex items-center justify-center px-4 py-3 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            查看订单
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center px-4 py-3 border border-jade-600 text-jade-600 rounded-lg hover:bg-jade-50 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            继续购物
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享订单
          </button>
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            下载发票
          </button>
        </div>

        {/* 温馨提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">温馨提示</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• 我们将在1-2个工作日内为您发货，请保持手机畅通</p>
            <p>• 您可以在"我的订单"中查看详细的物流信息</p>
            <p>• 收到商品后请仔细检查，如有问题请及时联系客服</p>
            <p>• 支持7天无理由退换，让您购物无忧</p>
          </div>
        </div>

        {/* 客服联系 */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">如有疑问，请联系我们的客服团队</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="tel:400-123-4567" className="text-jade-600 hover:text-jade-700">
              📞 400-123-4567
            </a>
            <a href="mailto:service@jade.com" className="text-jade-600 hover:text-jade-700">
              ✉️ service@jade.com
            </a>
            <span className="text-gray-500">💬 在线客服：9:00-21:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess