import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  ArrowLeft,
  Package,
  Plus,
  Minus,
  Search,
  Filter,
  Upload,
  Download,
  Check,
  X,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { InventoryManagement, StockAdjustment, BatchInventoryAdjustment } from '@/types';

const InventoryAdjustment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  
  const {
    inventoryItems,
    stockAdjustments,
    inventoryAdjustmentForm,
    batchAdjustmentData,
    inventoryItemsLoading,
    stockAdjustmentsLoading,
    fetchInventoryItems,
    fetchStockAdjustments,
    createStockAdjustment,
    approveStockAdjustment,
    rejectStockAdjustment,
    updateInventoryAdjustmentForm,
    resetInventoryAdjustmentForm,
    batchUpdateInventory
  } = useStore();

  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'history' | 'approval'>('single');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchAdjustments, setBatchAdjustments] = useState<BatchInventoryAdjustment[]>([]);

  useEffect(() => {
    fetchInventoryItems();
    fetchStockAdjustments();
    
    if (productId) {
      setActiveTab('single');
      updateInventoryAdjustmentForm({ product_id: productId });
    }
  }, [productId]);

  const handleSingleAdjustment = async () => {
    if (!inventoryAdjustmentForm.product_id || !inventoryAdjustmentForm.quantity || !inventoryAdjustmentForm.reason) {
      alert('请填写完整的调整信息');
      return;
    }

    const success = await createStockAdjustment(inventoryAdjustmentForm);
    if (success) {
      resetInventoryAdjustmentForm();
      fetchStockAdjustments();
      alert('库存调整申请已提交，等待审批');
    }
  };

  const handleBatchAdjustment = async () => {
    if (batchAdjustments.length === 0) {
      alert('请添加要调整的商品');
      return;
    }

    const success = await batchUpdateInventory(batchAdjustments);
    if (success) {
      setBatchAdjustments([]);
      setShowBatchModal(false);
      fetchInventoryItems();
      fetchStockAdjustments();
      alert('批量库存调整申请已提交');
    }
  };

  const handleApproval = async (adjustmentId: string, action: 'approve' | 'reject') => {
    const success = action === 'approve' 
      ? await approveStockAdjustment(adjustmentId)
      : await rejectStockAdjustment(adjustmentId);
    
    if (success) {
      fetchStockAdjustments();
      alert(`调整申请已${action === 'approve' ? '批准' : '拒绝'}`);
    }
  };

  const addToBatchAdjustment = (item: InventoryManagement) => {
    const existing = batchAdjustments.find(adj => adj.product_id === item.id);
    if (existing) {
      alert('该商品已在批量调整列表中');
      return;
    }

    setBatchAdjustments(prev => [...prev, {
      product_id: item.id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      current_stock: item.current_stock,
      adjustment_type: 'increase',
      quantity: 0,
      reason: '',
      notes: ''
    }]);
  };

  const updateBatchAdjustment = (productId: string, field: keyof BatchInventoryAdjustment, value: any) => {
    setBatchAdjustments(prev => prev.map(adj => 
      adj.product_id === productId ? { ...adj, [field]: value } : adj
    ));
  };

  const removeBatchAdjustment = (productId: string) => {
    setBatchAdjustments(prev => prev.filter(adj => adj.product_id !== productId));
  };

  const filteredInventoryItems = inventoryItems.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdjustments = stockAdjustments.filter(adjustment => {
    if (statusFilter === 'all') return true;
    return adjustment.status === statusFilter;
  });

  const selectedProduct = inventoryAdjustmentForm.product_id 
    ? inventoryItems.find(item => item.id === inventoryAdjustmentForm.product_id)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已批准';
      case 'rejected': return '已拒绝';
      case 'pending': return '待审批';
      default: return '未知';
    }
  };

  const getAdjustmentTypeIcon = (type: string) => {
    switch (type) {
      case 'increase': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAdjustmentTypeText = (type: string) => {
    switch (type) {
      case 'increase': return '增加';
      case 'decrease': return '减少';
      default: return '调整';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/inventory')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回库存列表
          </button>
          <h1 className="text-2xl font-bold text-gray-900">库存调整</h1>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('single')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'single'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              单个调整
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'batch'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              批量调整
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              调整历史
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approval'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              待审批
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* 单个调整 */}
          {activeTab === 'single' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 商品选择 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">选择商品</h3>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="搜索商品名称或SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {inventoryItemsLoading ? (
                      <div className="p-4 space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredInventoryItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => updateInventoryAdjustmentForm({ product_id: item.id })}
                            className={`p-4 cursor-pointer hover:bg-gray-50 ${
                              inventoryAdjustmentForm.product_id === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                                <p className="text-sm text-gray-600">当前库存: {item.current_stock}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'normal' ? 'bg-green-100 text-green-800' :
                                item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.status === 'normal' ? '正常' :
                                 item.status === 'low_stock' ? '低库存' : '缺货'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 调整表单 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">调整信息</h3>
                  
                  {selectedProduct && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">选中商品</h4>
                      <p className="text-sm text-gray-600">商品名称: {selectedProduct.product_name}</p>
                      <p className="text-sm text-gray-600">SKU: {selectedProduct.product_sku}</p>
                      <p className="text-sm text-gray-600">当前库存: {selectedProduct.current_stock}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">调整类型</label>
                    <select
                      value={inventoryAdjustmentForm.adjustment_type}
                      onChange={(e) => updateInventoryAdjustmentForm({ 
                        adjustment_type: e.target.value as 'increase' | 'decrease' 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="increase">增加库存</option>
                      <option value="decrease">减少库存</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">调整数量</label>
                    <input
                      type="number"
                      min="1"
                      value={inventoryAdjustmentForm.quantity}
                      onChange={(e) => updateInventoryAdjustmentForm({ 
                        quantity: parseInt(e.target.value) || 0 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入调整数量"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">调整原因</label>
                    <select
                      value={inventoryAdjustmentForm.reason}
                      onChange={(e) => updateInventoryAdjustmentForm({ reason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">请选择调整原因</option>
                      <option value="purchase">采购入库</option>
                      <option value="sale">销售出库</option>
                      <option value="return">退货入库</option>
                      <option value="damage">损耗出库</option>
                      <option value="inventory">盘点调整</option>
                      <option value="transfer">调拨</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                    <textarea
                      value={inventoryAdjustmentForm.notes}
                      onChange={(e) => updateInventoryAdjustmentForm({ notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="请输入备注信息"
                    />
                  </div>

                  {selectedProduct && inventoryAdjustmentForm.quantity > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        调整后库存: {
                          inventoryAdjustmentForm.adjustment_type === 'increase' 
                            ? selectedProduct.current_stock + inventoryAdjustmentForm.quantity
                            : selectedProduct.current_stock - inventoryAdjustmentForm.quantity
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={resetInventoryAdjustmentForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      重置
                    </button>
                    <button
                      onClick={handleSingleAdjustment}
                      disabled={!inventoryAdjustmentForm.product_id || !inventoryAdjustmentForm.quantity || !inventoryAdjustmentForm.reason}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      提交调整
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 批量调整 */}
          {activeTab === 'batch' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">批量库存调整</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBatchModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加商品
                  </button>
                  <button
                    onClick={handleBatchAdjustment}
                    disabled={batchAdjustments.length === 0}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    提交批量调整
                  </button>
                </div>
              </div>

              {batchAdjustments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无批量调整商品，请点击"添加商品"开始</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            商品信息
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            当前库存
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            调整类型
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            调整数量
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            调整原因
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            调整后库存
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {batchAdjustments.map((adjustment) => (
                          <tr key={adjustment.product_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{adjustment.product_name}</div>
                                <div className="text-sm text-gray-500">SKU: {adjustment.product_sku}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {adjustment.current_stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={adjustment.adjustment_type}
                                onChange={(e) => updateBatchAdjustment(
                                  adjustment.product_id, 
                                  'adjustment_type', 
                                  e.target.value as 'increase' | 'decrease'
                                )}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="increase">增加</option>
                                <option value="decrease">减少</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                min="1"
                                value={adjustment.quantity}
                                onChange={(e) => updateBatchAdjustment(
                                  adjustment.product_id, 
                                  'quantity', 
                                  parseInt(e.target.value) || 0
                                )}
                                className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={adjustment.reason}
                                onChange={(e) => updateBatchAdjustment(
                                  adjustment.product_id, 
                                  'reason', 
                                  e.target.value
                                )}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">选择原因</option>
                                <option value="purchase">采购入库</option>
                                <option value="sale">销售出库</option>
                                <option value="return">退货入库</option>
                                <option value="damage">损耗出库</option>
                                <option value="inventory">盘点调整</option>
                                <option value="transfer">调拨</option>
                                <option value="other">其他</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {adjustment.adjustment_type === 'increase' 
                                ? adjustment.current_stock + adjustment.quantity
                                : adjustment.current_stock - adjustment.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => removeBatchAdjustment(adjustment.product_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 调整历史 */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">调整历史</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部状态</option>
                    <option value="pending">待审批</option>
                    <option value="approved">已批准</option>
                    <option value="rejected">已拒绝</option>
                  </select>
                </div>
              </div>

              {stockAdjustmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredAdjustments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无调整记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAdjustments.map((adjustment) => (
                    <div key={adjustment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getAdjustmentTypeIcon(adjustment.adjustment_type)}
                          <div>
                            <h4 className="font-medium text-gray-900">{adjustment.product_name}</h4>
                            <p className="text-sm text-gray-600">SKU: {adjustment.product_sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(adjustment.status)}`}>
                            {getStatusText(adjustment.status)}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(adjustment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">调整类型:</span>
                          <span className="ml-1 font-medium">{getAdjustmentTypeText(adjustment.adjustment_type)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">数量变化:</span>
                          <span className="ml-1 font-medium">{adjustment.quantity_before} → {adjustment.quantity_after}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">调整原因:</span>
                          <span className="ml-1 font-medium">{adjustment.reason}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">操作人:</span>
                          <span className="ml-1 font-medium">{adjustment.created_by_name}</span>
                        </div>
                      </div>
                      
                      {adjustment.notes && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">备注:</span>
                          <span className="ml-1">{adjustment.notes}</span>
                        </div>
                      )}
                      
                      {adjustment.approved_by_name && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">审批人:</span>
                          <span className="ml-1">{adjustment.approved_by_name}</span>
                          <span className="ml-3 text-gray-500">审批时间:</span>
                          <span className="ml-1">{adjustment.approved_at ? new Date(adjustment.approved_at).toLocaleString() : '-'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 待审批 */}
          {activeTab === 'approval' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">待审批调整</h3>
              
              {stockAdjustmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {stockAdjustments
                    .filter(adjustment => adjustment.status === 'pending')
                    .map((adjustment) => (
                      <div key={adjustment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getAdjustmentTypeIcon(adjustment.adjustment_type)}
                            <div>
                              <h4 className="font-medium text-gray-900">{adjustment.product_name}</h4>
                              <p className="text-sm text-gray-600">SKU: {adjustment.product_sku}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(adjustment.id, 'approve')}
                              className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              批准
                            </button>
                            <button
                              onClick={() => handleApproval(adjustment.id, 'reject')}
                              className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              拒绝
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">调整类型:</span>
                            <span className="ml-1 font-medium">{getAdjustmentTypeText(adjustment.adjustment_type)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">数量变化:</span>
                            <span className="ml-1 font-medium">{adjustment.quantity_before} → {adjustment.quantity_after}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">调整原因:</span>
                            <span className="ml-1 font-medium">{adjustment.reason}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">申请人:</span>
                            <span className="ml-1 font-medium">{adjustment.created_by_name}</span>
                          </div>
                        </div>
                        
                        {adjustment.notes && (
                          <div className="mt-3 text-sm">
                            <span className="text-gray-500">备注:</span>
                            <span className="ml-1">{adjustment.notes}</span>
                          </div>
                        )}
                        
                        <div className="mt-3 text-sm text-gray-500">
                          申请时间: {new Date(adjustment.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  
                  {stockAdjustments.filter(adjustment => adjustment.status === 'pending').length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">暂无待审批的调整申请</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 批量添加商品模态框 */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">添加批量调整商品</h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索商品名称或SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              {inventoryItemsLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredInventoryItems.map((item) => {
                    const isAdded = batchAdjustments.some(adj => adj.product_id === item.id);
                    return (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                          <p className="text-sm text-gray-600">当前库存: {item.current_stock}</p>
                        </div>
                        <button
                          onClick={() => addToBatchAdjustment(item)}
                          disabled={isAdded}
                          className={`px-3 py-1 text-sm rounded ${
                            isAdded 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isAdded ? '已添加' : '添加'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAdjustment;