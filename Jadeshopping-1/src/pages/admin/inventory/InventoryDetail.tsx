import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  ArrowLeft,
  Package,
  Warehouse,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Settings,
  History,
  BarChart3,
  Calendar,
  DollarSign,
  Info
} from 'lucide-react';
import { InventoryManagement, StockMovement, StockAdjustment } from '@/types';

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    selectedInventoryItem,
    stockMovements,
    stockAdjustments,
    stockMovementsLoading,
    stockAdjustmentsLoading,
    fetchInventoryItem,
    fetchStockMovements,
    fetchStockAdjustments,
    updateInventoryItem
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'adjustments' | 'settings'>('overview');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustment_type: 'increase' as 'increase' | 'decrease',
    quantity: 0,
    reason: '',
    notes: ''
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    min_stock_threshold: 0,
    max_stock_threshold: 0,
    reorder_point: 0,
    reorder_quantity: 0
  });

  useEffect(() => {
    if (id) {
      fetchInventoryItem(id);
      fetchStockMovements({ product_id: id });
      fetchStockAdjustments({ product_id: id });
    }
  }, [id]);

  useEffect(() => {
    if (selectedInventoryItem) {
      setSettingsForm({
        min_stock_threshold: selectedInventoryItem.min_stock_threshold,
        max_stock_threshold: selectedInventoryItem.max_stock_threshold,
        reorder_point: selectedInventoryItem.reorder_point,
        reorder_quantity: selectedInventoryItem.reorder_quantity
      });
    }
  }, [selectedInventoryItem]);

  const handleAdjustment = async () => {
    if (!selectedInventoryItem || adjustmentForm.quantity <= 0) return;

    const newStock = adjustmentForm.adjustment_type === 'increase' 
      ? selectedInventoryItem.current_stock + adjustmentForm.quantity
      : selectedInventoryItem.current_stock - adjustmentForm.quantity;

    if (newStock < 0) {
      alert('调整后库存不能为负数');
      return;
    }

    const success = await updateInventoryItem(selectedInventoryItem.id, {
      current_stock: newStock,
      available_stock: newStock - selectedInventoryItem.reserved_stock,
      last_updated: new Date().toISOString(),
      notes: adjustmentForm.notes
    });

    if (success) {
      setShowAdjustModal(false);
      setAdjustmentForm({ adjustment_type: 'increase', quantity: 0, reason: '', notes: '' });
      if (id) {
        fetchInventoryItem(id);
        fetchStockMovements({ product_id: id });
        fetchStockAdjustments({ product_id: id });
      }
    }
  };

  const handleSettingsUpdate = async () => {
    if (!selectedInventoryItem) return;

    const success = await updateInventoryItem(selectedInventoryItem.id, settingsForm);
    if (success) {
      setShowSettingsModal(false);
      if (id) {
        fetchInventoryItem(id);
      }
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'low_stock': return '低库存';
      case 'out_of_stock': return '缺货';
      default: return '未知';
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'in': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'out': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'in': return '入库';
      case 'out': return '出库';
      default: return '调整';
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

  if (!selectedInventoryItem) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/admin/inventory')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回库存列表
          </button>
        </div>
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedInventoryItem.product_name}</h1>
            <p className="text-gray-600">SKU: {selectedInventoryItem.product_sku}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAdjustModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            调整库存
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            库存设置
          </button>
        </div>
      </div>

      {/* 商品基本信息 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-6">
          <img
            src={selectedInventoryItem.product_image}
            alt={selectedInventoryItem.product_name}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">当前库存</h3>
              <p className="text-2xl font-bold text-gray-900">{selectedInventoryItem.current_stock}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">可用库存</h3>
              <p className="text-2xl font-bold text-green-600">{selectedInventoryItem.available_stock}</p>
              <p className="text-sm text-gray-500">预留: {selectedInventoryItem.reserved_stock}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">库存状态</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStockStatusColor(selectedInventoryItem.status)}`}>
                {getStockStatusText(selectedInventoryItem.status)}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">库存价值</h3>
              <p className="text-2xl font-bold text-gray-900">¥{selectedInventoryItem.total_value.toLocaleString()}</p>
              <p className="text-sm text-gray-500">单价: ¥{selectedInventoryItem.unit_cost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Info className="w-4 h-4 inline mr-2" />
              概览信息
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'movements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              库存变动
            </button>
            <button
              onClick={() => setActiveTab('adjustments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'adjustments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Edit className="w-4 h-4 inline mr-2" />
              调整记录
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              库存设置
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* 概览信息 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Warehouse className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">仓库信息</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">仓库名称</p>
                  <p className="font-medium text-gray-900">{selectedInventoryItem.warehouse_name}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-gray-900">供应商信息</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">供应商名称</p>
                  <p className="font-medium text-gray-900">{selectedInventoryItem.supplier_name}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Package className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-gray-900">分类信息</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">商品分类</p>
                  <p className="font-medium text-gray-900">{selectedInventoryItem.category_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">库存阈值设置</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最小库存阈值</span>
                      <span className="font-medium">{selectedInventoryItem.min_stock_threshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最大库存阈值</span>
                      <span className="font-medium">{selectedInventoryItem.max_stock_threshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">补货点</span>
                      <span className="font-medium">{selectedInventoryItem.reorder_point}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">补货数量</span>
                      <span className="font-medium">{selectedInventoryItem.reorder_quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">其他信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最后更新时间</span>
                      <span className="font-medium">{new Date(selectedInventoryItem.last_updated).toLocaleString()}</span>
                    </div>
                    {selectedInventoryItem.notes && (
                      <div>
                        <span className="text-sm text-gray-600">备注</span>
                        <p className="mt-1 text-sm text-gray-900">{selectedInventoryItem.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 库存变动 */}
          {activeTab === 'movements' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">库存变动记录</h3>
              {stockMovementsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : stockMovements.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无库存变动记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stockMovements.map((movement) => (
                    <div key={movement.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getMovementTypeIcon(movement.movement_type)}
                          <span className="ml-2 font-medium text-gray-900">
                            {getMovementTypeText(movement.movement_type)}
                          </span>
                          <span className="ml-2 text-gray-600">数量: {movement.quantity}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(movement.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>仓库: {movement.warehouse_name}</p>
                        <p>操作人: {movement.created_by_name}</p>
                        {movement.notes && <p>备注: {movement.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 调整记录 */}
          {activeTab === 'adjustments' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">库存调整记录</h3>
              {stockAdjustmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : stockAdjustments.length === 0 ? (
                <div className="text-center py-8">
                  <Edit className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无库存调整记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stockAdjustments.map((adjustment) => (
                    <div key={adjustment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getAdjustmentTypeIcon(adjustment.adjustment_type)}
                          <span className="ml-2 font-medium text-gray-900">
                            {getAdjustmentTypeText(adjustment.adjustment_type)}
                          </span>
                          <span className="ml-2 text-gray-600">
                            {adjustment.quantity_before} → {adjustment.quantity_after}
                          </span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            adjustment.status === 'approved' ? 'bg-green-100 text-green-800' :
                            adjustment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {adjustment.status === 'approved' ? '已批准' :
                             adjustment.status === 'rejected' ? '已拒绝' : '待审批'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(adjustment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>调整原因: {adjustment.reason}</p>
                        <p>操作人: {adjustment.created_by_name}</p>
                        {adjustment.notes && <p>备注: {adjustment.notes}</p>}
                        {adjustment.approved_by_name && (
                          <p>审批人: {adjustment.approved_by_name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 库存设置 */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">库存阈值设置</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">最小库存阈值</label>
                      <input
                        type="number"
                        value={settingsForm.min_stock_threshold}
                        onChange={(e) => setSettingsForm(prev => ({ 
                          ...prev, 
                          min_stock_threshold: parseInt(e.target.value) || 0 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">最大库存阈值</label>
                      <input
                        type="number"
                        value={settingsForm.max_stock_threshold}
                        onChange={(e) => setSettingsForm(prev => ({ 
                          ...prev, 
                          max_stock_threshold: parseInt(e.target.value) || 0 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">补货设置</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">补货点</label>
                      <input
                        type="number"
                        value={settingsForm.reorder_point}
                        onChange={(e) => setSettingsForm(prev => ({ 
                          ...prev, 
                          reorder_point: parseInt(e.target.value) || 0 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">补货数量</label>
                      <input
                        type="number"
                        value={settingsForm.reorder_quantity}
                        onChange={(e) => setSettingsForm(prev => ({ 
                          ...prev, 
                          reorder_quantity: parseInt(e.target.value) || 0 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSettingsUpdate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存设置
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 库存调整模态框 */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">调整库存</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前库存</label>
                <p className="text-lg font-bold text-gray-900">{selectedInventoryItem.current_stock}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">调整类型</label>
                <select
                  value={adjustmentForm.adjustment_type}
                  onChange={(e) => setAdjustmentForm(prev => ({ 
                    ...prev, 
                    adjustment_type: e.target.value as 'increase' | 'decrease' 
                  }))}
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
                  value={adjustmentForm.quantity}
                  onChange={(e) => setAdjustmentForm(prev => ({ 
                    ...prev, 
                    quantity: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入调整数量"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">调整原因</label>
                <input
                  type="text"
                  value={adjustmentForm.reason}
                  onChange={(e) => setAdjustmentForm(prev => ({ 
                    ...prev, 
                    reason: e.target.value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入调整原因"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={adjustmentForm.notes}
                  onChange={(e) => setAdjustmentForm(prev => ({ 
                    ...prev, 
                    notes: e.target.value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="请输入备注信息"
                />
              </div>

              {adjustmentForm.adjustment_type && adjustmentForm.quantity > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    调整后库存: {
                      adjustmentForm.adjustment_type === 'increase' 
                        ? selectedInventoryItem.current_stock + adjustmentForm.quantity
                        : selectedInventoryItem.current_stock - adjustmentForm.quantity
                    }
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleAdjustment}
                disabled={adjustmentForm.quantity <= 0 || !adjustmentForm.reason}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认调整
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 库存设置模态框 */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">库存设置</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最小库存阈值</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.min_stock_threshold}
                  onChange={(e) => setSettingsForm(prev => ({ 
                    ...prev, 
                    min_stock_threshold: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最大库存阈值</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.max_stock_threshold}
                  onChange={(e) => setSettingsForm(prev => ({ 
                    ...prev, 
                    max_stock_threshold: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">补货点</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.reorder_point}
                  onChange={(e) => setSettingsForm(prev => ({ 
                    ...prev, 
                    reorder_point: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">补货数量</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.reorder_quantity}
                  onChange={(e) => setSettingsForm(prev => ({ 
                    ...prev, 
                    reorder_quantity: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSettingsUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDetail;