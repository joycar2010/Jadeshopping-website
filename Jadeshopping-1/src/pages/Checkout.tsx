import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { ArrowLeft, MapPin, Plus, Edit, CreditCard, Wallet, Check, Tag } from 'lucide-react'
import { UserService } from '@/services/userService'
import { OrderService } from '@/services/orderService'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/Toast'
import type { UserAddress, PaymentMethod, Coupon } from '@/types'

// 移除mockData导入，使用数据库查询

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { toasts, success, error, removeToast } = useToast()
  const { 
    cart, 
    user,
    userAddresses,
    selectedAddress,
    paymentMethods,
    selectedPaymentMethod,
    orderSummary,
    appliedCoupon,
    checkoutLoading,
    setUserAddresses,
    setSelectedAddress,
    clearCart,
    addOrderToHistory,
    setPaymentMethods,
    setSelectedPaymentMethod,
    calculateOrderSummary,
    applyCoupon,
    removeCoupon,
    createOrder
  } = useStore()

  const [couponCode, setCouponCode] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [loading, setLoading] = useState(true)

  // Get selected cart items
  const selectedCartItems = cart.filter(item => item.quantity > 0)

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (selectedCartItems.length === 0) {
      navigate('/cart')
      return
    }

    // Load user data
    loadUserData()
  }, [selectedCartItems.length, user?.id, navigate])

  const loadUserData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      // Load user addresses from database
      const addresses = await UserService.getUserAddresses(user.id)
      setUserAddresses(addresses)
      
      // Set default address
      const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0]
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      }

      // Mock payment methods - these are usually system-wide configurations
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'balance',
          type: 'balance',
          name: 'Account Balance',
          description: 'Pay with your account balance',
          icon: '💰',
          enabled: true,
          processing_fee: 0
        },
        {
          id: 'alipay',
          type: 'alipay',
          name: 'Alipay',
          description: 'Pay with Alipay',
          icon: '💙',
          enabled: true,
          processing_fee: 0.006
        },
        {
          id: 'wechat',
          type: 'wechat',
          name: 'WeChat Pay',
          description: 'Pay with WeChat Pay',
          icon: '💚',
          enabled: true,
          processing_fee: 0.006
        }
      ]

      // Mock coupons - these should be fetched from database
      const mockCoupons: Coupon[] = [
        {
          id: '1',
          code: 'WELCOME10',
          name: 'Welcome Discount',
          description: '10% off for new users',
          discount_type: 'percentage',
          discount_value: 10,
          min_order_amount: 100,
          max_discount_amount: 50,
          is_active: true,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          usage_limit: 1000,
          used_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      // Set payment methods
      setPaymentMethods(mockPaymentMethods)
      const balancePayment = mockPaymentMethods.find(method => method.type === 'balance')
      if (balancePayment) {
        setSelectedPaymentMethod(balancePayment)
      }

      // Calculate order summary
      calculateOrderSummary()
    } catch (err) {
      console.error('Failed to load user data:', err)
      error('Loading failed', 'Failed to load user data, please refresh and try again')
    } finally {
      setLoading(false)
    }
  }

  // Handle address selection
  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address)
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

  // Apply coupon
  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(c => c.code === couponCode && c.is_active)
    if (coupon) {
      applyCoupon(coupon)
      setCouponCode('')
      setShowCouponInput(false)
      success('Coupon applied', 'Coupon has been applied successfully')
    } else {
      error('Invalid coupon', 'Invalid or expired coupon code')
    }
  }

  // Remove coupon
  const handleRemoveCoupon = () => {
    removeCoupon()
    success('Coupon removed', 'Coupon has been removed')
  }

  // Submit order
  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      error('Please select shipping address', 'Please select a shipping address before submitting the order')
      return
    }

    if (!selectedPaymentMethod) {
      error('Please select payment method', 'Please select a payment method before submitting the order')
      return
    }

    try {
      const orderData = {
        user_id: user!.id,
        items: selectedCartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shipping_address_id: selectedAddress.id,
        payment_method: selectedPaymentMethod.type,
        coupon_code: appliedCoupon?.code,
        total_amount: orderSummary?.total_amount || 0,
        shipping_fee: orderSummary?.shipping_fee || 0,
        discount_amount: orderSummary?.discount_amount || 0
      }

      const order = await OrderService.createOrder(orderData)

      if (order) {
        // 1. Clear all items from current user's cart
        clearCart()
        
        // 2. Sync order data to user center's "My Orders" module
        addOrderToHistory(order)
        
        // 3. Display success message
        success('Order submitted successfully!', 'Your order has been created successfully, redirecting to order details page...')
        
        // Redirect to order success page
        navigate('/order-success', { 
          state: { 
            orderId: order.id, 
            paymentMethod: selectedPaymentMethod.type, 
            amount: orderSummary?.total_amount 
          } 
        })
      }
    } catch (err) {
      console.error('Failed to create order:', err)
      error('Order submission failed', 'An error occurred while creating the order, please check your network connection and try again')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in first</h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-jade-600 text-white font-medium rounded-lg hover:bg-jade-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-jade-600">Shopping Cart</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Confirm Order</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-jade-600" />
                  Shipping Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center text-jade-600 hover:text-jade-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Address
                </button>
              </div>

              {userAddresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No shipping address</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="px-4 py-2 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors"
                  >
                    Add Shipping Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAddresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-jade-600 bg-jade-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-medium text-gray-900">{address.name}</span>
                            <span className="ml-2 text-gray-600">{address.phone}</span>
                            {address.is_default && (
                              <span className="ml-2 px-2 py-1 bg-jade-100 text-jade-600 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {address.province} {address.city} {address.district} {address.address}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedAddress?.id === address.id && (
                            <Check className="w-5 h-5 text-jade-600" />
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product List</h2>
              <div className="space-y-4">
                {selectedCartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-jade-600 font-medium">
                          ¥{item.product.price.toLocaleString()}
                        </span>
                        <span className="text-gray-600">x{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ¥{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-jade-600" />
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.filter(method => method.enabled).map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod?.id === method.id
                        ? 'border-jade-600 bg-jade-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </div>
                      {selectedPaymentMethod?.id === method.id && (
                        <Check className="w-5 h-5 text-jade-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    {method.processing_fee > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        Processing fee: {(method.processing_fee * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Coupon</span>
                  {!appliedCoupon && (
                    <button
                      onClick={() => setShowCouponInput(!showCouponInput)}
                      className="text-jade-600 hover:text-jade-700 text-sm flex items-center"
                    >
                      <Tag className="w-4 h-4 mr-1" />
                      Use Coupon
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon.name}</p>
                      <p className="text-xs text-green-600">{appliedCoupon.code}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : showCouponInput && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-jade-600 text-white rounded-lg hover:bg-jade-700 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ¥{orderSummary?.subtotal?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {(orderSummary?.shipping_fee || 0) === 0 ? 'Free' : `¥${orderSummary?.shipping_fee}`}
                  </span>
                </div>
                {selectedPaymentMethod?.processing_fee && selectedPaymentMethod.processing_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="text-gray-900">
                      ¥{((orderSummary?.subtotal || 0) * selectedPaymentMethod.processing_fee).toFixed(2)}
                    </span>
                  </div>
                )}
                {(orderSummary?.discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">
                      -¥{orderSummary?.discount_amount?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-jade-600">
                      ¥{orderSummary?.total_amount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedPaymentMethod?.type === 'balance' && user && (
                <div className="mb-6 p-3 bg-jade-50 border border-jade-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jade-700">Account Balance</span>
                    <span className="font-medium text-jade-800">
                      ¥{user.balance?.toLocaleString() || '0'}
                    </span>
                  </div>
                  {user.balance && orderSummary?.total_amount && user.balance < orderSummary.total_amount && (
                    <p className="text-xs text-red-600 mt-1">Insufficient balance, please choose another payment method</p>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={
                  checkoutLoading || 
                  !selectedAddress || 
                  !selectedPaymentMethod ||
                  (selectedPaymentMethod?.type === 'balance' && user?.balance && orderSummary?.total_amount && user.balance < orderSummary.total_amount)
                }
                className="w-full py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Submit Order'
                )}
              </button>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>✓ 7-day return policy</p>
                  <p>✓ Authenticity guaranteed</p>
                  <p>✓ Secure payment</p>
                  <p>✓ Fast shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

export default Checkout