import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  BarChart3,
  Warehouse,
  Users
} from 'lucide-react';
import { InventoryFilters, InventoryManagement } from '@/types';

const InventoryList: React.FC = () => {
  const {
    inventoryItems,
    inventoryStats,
    inventoryFilters,
    inventoryItemsLoading,
    inventoryStatsLoading,
    categories,
    warehouses,
    suppliers,
    fetchInventoryItems,
    fetchInventoryStats,
    fetchCategories,
    fetchWarehouses,
    fetchSuppliers,
    updateInventoryFilters,
    resetInventoryFilters,
    searchInventoryItems,
    batchUpdateInventory,
    deleteInventoryItem
  } = useStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchAdjustmentData, setBatchAdjustmentData] = useState({
    adjustment_type: 'increase' as 'increase' | 'decrease',
    quantity: 0,
    reason: ''
  });

  useEffect(() => {
    fetchInventoryItems(inventoryFilters);
    fetchInventoryStats();
    fetchCategories();
    fetchWarehouses();
    fetchSuppliers();
  }, []);

  const handleSearch = (keyword: string) => {
    updateInventoryFilters({ search: keyword });
    searchInventoryItems(keyword);
  };

  const handleFilterChange = (field: keyof InventoryFilters, value: string) => {
    const newFilters = { ...inventoryFilters, [field]: value };
    updateInventoryFilters(newFilters);
    fetchInventoryItems(newFilters);
  };

  const handleSort = (field: string) => {
    const newOrder = inventoryFilters.sort_by === field && inventoryFilters.sort_order === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...inventoryFilters, sort_by: field, sort_order: newOrder };
    updateInventoryFilters(newFilters);
    fetchInventoryItems(newFilters);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === inventoryItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventoryItems.map(item => item.id));
    }
  };

  const handleBatchAdjustment = async () => {
    if (selectedItems.length === 0) return;

    const adjustmentItems = selectedItems.map(id => ({
      id,
      quantity: batchAdjustmentData.adjustment_type === 'increase' 
        ? inventoryItems.find(item => item.id === id)?.current_stock! + batchAdjustmentData.quantity
        : inventoryItems.find(item => item.id === id)?.current_stock! - batchAdjustmentData.quantity,
      reason: batchAdjustmentData.reason
    }));

    const success = await batchUpdateInventory(adjustmentItems);
    if (success) {
      setShowBatchModal(false);
      setSelectedItems([]);
      setBatchAdjustmentData({ adjustment_type: 'increase', quantity: 0, reason: '' });
      fetchInventoryItems(inventoryFilters);
      fetchInventoryStats();
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('确定要删除这个库存项目吗？')) {
      const success = await deleteInventoryItem(itemId);
      if (success) {
        fetchInventoryItems(inventoryFilters);
        fetchInventoryStats();
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

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">库存管理</h1>
          <p className="text-gray-600 mt-1">管理商品库存，监控库存状态，设置预警规则</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            导入库存
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            导出库存
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      {inventoryStatsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总商品数</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats?.total_products || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">库存总价值</p>
                <p className="text-2xl font-bold text-gray-900">¥{inventoryStats?.total_stock_value?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">低库存商品</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats?.low_stock_count || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">缺货商品</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats?.out_of_stock_count || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <RefreshCw className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">需要补货</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats?.reorder_needed_count || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索商品名称或SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={inventoryFilters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={inventoryFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">所有状态</option>
            <option value="normal">正常</option>
            <option value="low_stock">低库存</option>
            <option value="out_of_stock">缺货</option>
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={inventoryFilters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
          >
            <option value="">所有分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={inventoryFilters.warehouse_id}
            onChange={(e) => handleFilterChange('warehouse_id', e.target.value)}
          >
            <option value="">所有仓库</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
            ))}
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={() => resetInventoryFilters()}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              重置
            </button>
            <button
              onClick={() => fetchInventoryItems(inventoryFilters)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* 批量操作 */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">已选择 {selectedItems.length} 个商品</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                批量调整库存
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消选择
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 库存列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === inventoryItems.length && inventoryItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('product_name')}
                >
                  商品信息
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('current_stock')}
                >
                  当前库存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  可用库存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  预警阈值
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  库存状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  仓库
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  供应商
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('last_updated')}
                >
                  最后更新
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItemsLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : inventoryItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>暂无库存数据</p>
                  </td>
                </tr>
              ) : (
                inventoryItems.filter(item => {
                  const searchTerm = inventoryFilters?.search || '';
                  const statusFilter = inventoryFilters?.status || 'all';
                  const categoryFilter = inventoryFilters?.category_id || 'all';
                  const warehouseFilter = inventoryFilters?.warehouse_id || 'all';
                  
                  const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       item.product_sku.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
                  const matchesCategory = categoryFilter === 'all' || item.category_id === categoryFilter;
                  const matchesWarehouse = warehouseFilter === 'all' || item.warehouse_id === warehouseFilter;
                  
                  return matchesSearch && matchesStatus && matchesCategory && matchesWarehouse;
                }).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                          <div className="text-sm text-gray-500">SKU: {item.product_sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.current_stock}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.available_stock}</div>
                      <div className="text-xs text-gray-500">预留: {item.reserved_stock}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">最小: {item.min_stock_threshold}</div>
                      <div className="text-xs text-gray-500">补货点: {item.reorder_point}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(item.status)}`}>
                        {getStockStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Warehouse className="w-4 h-4 mr-1 text-gray-400" />
                        {item.warehouse_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {item.supplier_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.last_updated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.location.href = `/admin/inventory/${item.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/inventory/adjustment?product=${item.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="调整库存"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 批量调整模态框 */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">批量调整库存</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">调整类型</label>
                <select
                  value={batchAdjustmentData.adjustment_type}
                  onChange={(e) => setBatchAdjustmentData(prev => ({ 
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
                  min="0"
                  value={batchAdjustmentData.quantity}
                  onChange={(e) => setBatchAdjustmentData(prev => ({ 
                    ...prev, 
                    quantity: parseInt(e.target.value) || 0 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入调整数量"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">调整原因</label>
                <textarea
                  value={batchAdjustmentData.reason}
                  onChange={(e) => setBatchAdjustmentData(prev => ({ 
                    ...prev, 
                    reason: e.target.value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="请输入调整原因"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleBatchAdjustment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                确认调整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;