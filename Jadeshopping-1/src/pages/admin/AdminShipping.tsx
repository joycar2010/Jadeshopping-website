import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, Truck, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'

interface Shipment {
  id: string
  tracking_number: string
  order_id: string
  carrier: string
  status: 'pending' | 'in_transit' | 'delivered' | 'exception'
  shipped_at: string
  estimated_delivery: string
  actual_delivery: string | null
  notes: string
  created_at: string
  updated_at: string
  order: {
    order_number: string
    user: {
      full_name: string
      email: string
    }
    shipping_address: {
      name: string
      address: string
      city: string
      province: string
    }
  }
}

const AdminShipping: React.FC = () => {
  const navigate = useNavigate()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [carrierFilter, setCarrierFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { showToast } = useToast()

  const pageSize = 20

  useEffect(() => {
    fetchShipments()
  }, [currentPage, statusFilter, carrierFilter, searchTerm])

  const fetchShipments = async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('shipments')
        .select(`
          *,
          order:orders(
            order_number,
            user:users(full_name, email),
            shipping_address
          )
        `, { count: 'exact' })

      // 状态筛选
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      // 承运商筛选
      if (carrierFilter !== 'all') {
        query = query.eq('carrier', carrierFilter)
      }

      // 搜索
      if (searchTerm) {
        query = query.or(`tracking_number.ilike.%${searchTerm}%,order.order_number.ilike.%${searchTerm}%`)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

      if (error) throw error

      setShipments(data || [])
      setTotalCount(count || 0)
      setTotalPages(Math.ceil((count || 0) / pageSize))
    } catch (error) {
      console.error('Error fetching shipments:', error)
      showToast('error', '获取发货单列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (shipmentId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // 如果状态是已送达，设置实际送达时间
      if (newStatus === 'delivered') {
        updateData.actual_delivery = new Date().toISOString()
      }

      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', shipmentId)

      if (error) throw error

      showToast('success', '发货状态更新成功')
      fetchShipments()
    } catch (error) {
      console.error('Error updating shipment status:', error)
      showToast('error', '状态更新失败')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'exception':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待发货'
      case 'in_transit':
        return '运输中'
      case 'delivered':
        return '已送达'
      case 'exception':
        return '异常'
      default:
        return '未知'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'in_transit':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'exception':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getCarrierName = (carrier: string) => {
    const carriers: Record<string, string> = {
      'sf': '顺丰速运',
      'yt': '圆通速递',
      'sto': '申通快递',
      'zt': '中通快递',
      'yd': '韵达速递',
      'jd': '京东物流',
      'ems': 'EMS',
      'other': '其他'
    }
    return carriers[carrier] || carrier
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'in_transit'
      case 'in_transit':
        return 'delivered'
      default:
        return null
    }
  }

  const getNextStatusText = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus)
    return nextStatus ? getStatusText(nextStatus) : null
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">发货管理</h1>
        <p className="text-gray-600 mt-1">管理订单发货和物流跟踪</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">总发货单</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">待发货</p>
              <p className="text-2xl font-semibold text-gray-900">
                {shipments.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">运输中</p>
              <p className="text-2xl font-semibold text-gray-900">
                {shipments.filter(s => s.status === 'in_transit').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">已送达</p>
              <p className="text-2xl font-semibold text-gray-900">
                {shipments.filter(s => s.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索快递单号或订单号..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="pending">待发货</option>
            <option value="in_transit">运输中</option>
            <option value="delivered">已送达</option>
            <option value="exception">异常</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
          >
            <option value="all">全部承运商</option>
            <option value="sf">顺丰速运</option>
            <option value="yt">圆通速递</option>
            <option value="sto">申通快递</option>
            <option value="zt">中通快递</option>
            <option value="yd">韵达速递</option>
            <option value="jd">京东物流</option>
            <option value="ems">EMS</option>
            <option value="other">其他</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          创建发货单
        </button>
      </div>

      {/* 发货单列表 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  快递信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收货地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发货时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.tracking_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getCarrierName(shipment.carrier)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.order.order_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shipment.order.user.full_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{shipment.order.shipping_address.name}</div>
                      <div className="text-gray-500">
                        {shipment.order.shipping_address.province} {shipment.order.shipping_address.city}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        {getStatusText(shipment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(shipment.shipped_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/shipping/${shipment.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {getNextStatus(shipment.status) && (
                        <button
                          onClick={() => handleStatusUpdate(shipment.id, getNextStatus(shipment.status)!)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                          title={`更新为${getNextStatusText(shipment.status)}`}
                        >
                          {getNextStatusText(shipment.status)}
                        </button>
                      )}
                      
                      {shipment.status !== 'exception' && shipment.status !== 'delivered' && (
                        <button
                          onClick={() => handleStatusUpdate(shipment.id, 'exception')}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                          title="标记异常"
                        >
                          异常
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shipments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">暂无发货单数据</div>
          </div>
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示第 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, totalCount)} 条，共 {totalCount} 条记录
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2)
              if (page > totalPages) return null
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm border rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminShipping