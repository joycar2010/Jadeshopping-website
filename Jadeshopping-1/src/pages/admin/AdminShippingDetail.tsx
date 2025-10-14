import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Truck, MapPin, Clock, User, Phone, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorBoundary from '../../components/ErrorBoundary'

interface ShippingDetail {
  id: string
  order_id: string
  tracking_number: string
  carrier: string
  status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'returned'
  shipped_at?: string
  delivered_at?: string
  recipient_name: string
  recipient_phone: string
  recipient_email?: string
  shipping_address: string
  notes?: string
  created_at: string
  updated_at: string
  orders?: {
    id: string
    order_number: string
    total_amount: number
    status: string
  }
}

const AdminShippingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [shipping, setShipping] = useState<ShippingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    if (id) {
      fetchShippingDetail()
    }
  }, [id])

  const fetchShippingDetail = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shipping')
        .select(`
          *,
          orders (
            id,
            order_number,
            total_amount,
            status
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      setShipping(data)
    } catch (error) {
      console.error('Error fetching shipping detail:', error)
      showToast('error', '获取物流详情失败', '请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!shipping) return

    try {
      const updateData: any = { status: newStatus }
      
      if (newStatus === 'shipped' && !shipping.shipped_at) {
        updateData.shipped_at = new Date().toISOString()
      }
      
      if (newStatus === 'delivered' && !shipping.delivered_at) {
        updateData.delivered_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('shipping')
        .update(updateData)
        .eq('id', shipping.id)

      if (error) throw error

      setShipping({ ...shipping, ...updateData })
      showToast('success', '物流状态更新成功')
    } catch (error) {
      console.error('Error updating shipping status:', error)
      showToast('error', '状态更新失败', '请稍后重试')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'in_transit': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'returned': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待发货'
      case 'shipped': return '已发货'
      case 'in_transit': return '运输中'
      case 'delivered': return '已送达'
      case 'returned': return '已退回'
      default: return '未知'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="加载物流详情中..." className="h-64" />
  }

  if (!shipping) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">物流信息不存在</h3>
          <p className="text-gray-500 mb-4">未找到相关的物流记录</p>
          <button
            onClick={() => navigate('/admin/shipping')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            返回物流列表
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/shipping')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">物流详情</h1>
              <p className="text-gray-600">跟踪号: {shipping.tracking_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              className={`px-3 py-2 text-sm font-medium rounded-lg border-0 ${getStatusColor(shipping.status)}`}
              value={shipping.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
            >
              <option value="pending">待发货</option>
              <option value="shipped">已发货</option>
              <option value="in_transit">运输中</option>
              <option value="delivered">已送达</option>
              <option value="returned">已退回</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 物流信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                物流信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    跟踪号
                  </label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                    {shipping.tracking_number}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    承运商
                  </label>
                  <p className="text-sm text-gray-900">{shipping.carrier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    当前状态
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipping.status)}`}>
                    {getStatusText(shipping.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    创建时间
                  </label>
                  <p className="text-sm text-gray-900">{formatDate(shipping.created_at)}</p>
                </div>
                {shipping.shipped_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      发货时间
                    </label>
                    <p className="text-sm text-gray-900">{formatDate(shipping.shipped_at)}</p>
                  </div>
                )}
                {shipping.delivered_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      送达时间
                    </label>
                    <p className="text-sm text-gray-900">{formatDate(shipping.delivered_at)}</p>
                  </div>
                )}
              </div>
              {shipping.notes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    备注
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                    {shipping.notes}
                  </p>
                </div>
              )}
            </div>

            {/* 收件人信息 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                收件人信息
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{shipping.recipient_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{shipping.recipient_phone}</span>
                </div>
                {shipping.recipient_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{shipping.recipient_email}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-900">{shipping.shipping_address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 关联订单 */}
          <div className="space-y-6">
            {shipping.orders && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  关联订单
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      订单号
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {shipping.orders.order_number}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      订单金额
                    </label>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(shipping.orders.total_amount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      订单状态
                    </label>
                    <p className="text-sm text-gray-900">{shipping.orders.status}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/orders/${shipping.orders?.id}`)}
                    className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    查看订单详情
                  </button>
                </div>
              </div>
            )}

            {/* 物流时间线 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                物流时间线
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">物流信息创建</p>
                    <p className="text-xs text-gray-500">{formatDate(shipping.created_at)}</p>
                  </div>
                </div>
                {shipping.shipped_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">商品已发货</p>
                      <p className="text-xs text-gray-500">{formatDate(shipping.shipped_at)}</p>
                    </div>
                  </div>
                )}
                {shipping.delivered_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">商品已送达</p>
                      <p className="text-xs text-gray-500">{formatDate(shipping.delivered_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AdminShippingDetail