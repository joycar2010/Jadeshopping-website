import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { CheckCircle, Package, Truck, Home, ShoppingBag, Download, Share2, Copy, Info, MessageCircle, Phone } from 'lucide-react'

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentOrder, clearCheckoutData } = useStore()
  
  const [copied, setCopied] = useState(false)
  
  // Get order information from route state
  const { orderId, paymentMethod, amount } = location.state || {}
  
  useEffect(() => {
    // If no order information, redirect to homepage
    if (!orderId && !currentOrder) {
      navigate('/')
      return
    }
    
    // Clear checkout related data
    clearCheckoutData()
  }, [orderId, currentOrder, navigate, clearCheckoutData])

  // Copy order ID
  const handleCopyOrderId = async () => {
    const orderIdToCopy = orderId || currentOrder?.id
    if (orderIdToCopy) {
      try {
        await navigator.clipboard.writeText(orderIdToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Copy failed:', error)
      }
    }
  }

  // Share order
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Guaranteed Antiques Order',
        text: `I successfully placed an order at Guaranteed Antiques, Order ID: ${orderId || currentOrder?.id}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy link
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
        {/* Success Status */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Your order has been submitted and we will process it as soon as possible</p>
        </div>

        {/* Order Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Order ID</span>
                  <div className="flex items-center">
                    <span className="font-mono text-sm text-gray-900 mr-2">
                      {displayOrder.id}
                    </span>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy Order ID"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    {copied && (
                      <span className="text-xs text-green-600 ml-1">Copied</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm text-gray-900">
                    {paymentMethod || displayOrder.payment_method || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Amount</span>
                  <span className="text-lg font-semibold text-jade-600">
                    ¥{(amount || displayOrder.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Order Time</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Order Status</span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                    Paid
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expected Shipping</span>
                  <span className="text-sm text-gray-900">1-2 business days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Progress */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Progress</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600 text-center">Order Confirmed</span>
                <span className="text-xs text-green-600">Completed</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                <div className="h-full bg-green-600 w-0"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 text-center">Packaging</span>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 text-center">Shipping</span>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Home className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 text-center">Delivery</span>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {currentOrder?.shipping_address && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/orders"
            className="flex items-center justify-center px-4 py-3 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            View Orders
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center px-4 py-3 border border-jade-600 text-jade-600 rounded-lg hover:bg-jade-50 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Order
          </button>
          <button
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
          </button>
        </div>

        {/* Helpful Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Helpful Tips
          </h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              <span>We will ship your order within 1-2 business days. Please keep your phone accessible</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              <span>You can view detailed shipping information in "My Orders"</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              <span>Please inspect your items carefully upon receipt. Contact customer service if you have any issues</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              <span>We support 7-day returns for your peace of mind</span>
            </div>
          </div>
        </div>

        {/* Customer Service */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Customer Service
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>If you have any questions, please contact our customer service team:</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-jade-600" />
                <span>400-888-8888</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-jade-600" />
                <span>Online Support: 9:00-21:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess