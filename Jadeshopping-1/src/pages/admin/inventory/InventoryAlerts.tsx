import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  ArrowLeft,
  AlertTriangle,
  Bell,
  BellOff,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Mail,
  Smartphone
} from 'lucide-react';
import { StockAlert, InventoryAlertRule, InventoryManagement } from '@/types';

const InventoryAlerts: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    inventoryAlerts,
    alertRules,
    lowStockItems,
    outOfStockItems,
    inventoryAlertsLoading,
    alertRulesLoading,
    lowStockItemsLoading,
    outOfStockItemsLoading,
    fetchInventoryAlerts,
    fetchAlertRules,
    fetchLowStockItems,
    fetchOutOfStockItems,
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
    markAlertAsRead
  } = useStore();

  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'low_stock' | 'out_of_stock'>('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertFilter, setAlertFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<InventoryAlertRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    condition_type: 'low_stock' as 'low_stock' | 'out_of_stock' | 'overstock',
    threshold_value: 0,
    threshold_type: 'quantity' as 'quantity' | 'percentage',
    notification_methods: [] as string[],
    is_active: true,
    category_ids: [] as string[],
    product_ids: [] as string[]
  });

  useEffect(() => {
    fetchInventoryAlerts();
    fetchAlertRules();
    fetchLowStockItems();
    fetchOutOfStockItems();
  }, []);

  const handleCreateRule = async () => {
    if (!ruleForm.name || !ruleForm.threshold_value) {
      alert('请填写完整的规则信息');
      return;
    }

    const success = await createAlertRule(ruleForm);
    if (success) {
      setShowRuleModal(false);
      resetRuleForm();
      fetchAlertRules();
    }
  };

  const handleUpdateRule = async () => {
    if (!editingRule || !ruleForm.name || !ruleForm.threshold_value) {
      alert('请填写完整的规则信息');
      return;
    }

    const success = await updateAlertRule(editingRule.id, ruleForm);
    if (success) {
      setShowRuleModal(false);
      setEditingRule(null);
      resetRuleForm();
      fetchAlertRules();
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('确定要删除这个预警规则吗？')) return;

    const success = await deleteAlertRule(ruleId);
    if (success) {
      fetchAlertRules();
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    const success = await markAlertAsRead(alertId);
    if (success) {
      fetchInventoryAlerts();
    }
  };

  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      description: '',
      condition_type: 'low_stock',
      threshold_value: 0,
      threshold_type: 'quantity',
      notification_methods: [],
      is_active: true,
      category_ids: [],
      product_ids: []
    });
  };

  const openEditModal = (rule: InventoryAlertRule) => {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      description: rule.description,
      condition_type: rule.condition_type,
      threshold_value: rule.threshold_value,
      threshold_type: rule.threshold_type,
      notification_methods: rule.notification_methods,
      is_active: rule.is_active,
      category_ids: rule.category_ids,
      product_ids: rule.product_ids
    });
    setShowRuleModal(true);
  };

  const filteredAlerts = inventoryAlerts.filter(alert => {
    const matchesSearch = alert.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.product_sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = alertFilter === 'all' || 
                         (alertFilter === 'read' && alert.is_read) ||
                         (alertFilter === 'unread' && !alert.is_read);
    return matchesSearch && matchesFilter;
  });

  const filteredLowStockItems = lowStockItems.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOutOfStockItems = outOfStockItems.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'overstock': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'low_stock': return '低库存';
      case 'out_of_stock': return '缺货';
      case 'overstock': return '库存过多';
      default: return '未知';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <TrendingDown className="w-4 h-4" />;
      case 'out_of_stock': return <XCircle className="w-4 h-4" />;
      case 'overstock': return <TrendingDown className="w-4 h-4 rotate-180" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
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
          <h1 className="text-2xl font-bold text-gray-900">库存预警管理</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              fetchInventoryAlerts();
              fetchLowStockItems();
              fetchOutOfStockItems();
            }}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新数据
          </button>
          <button
            onClick={() => setShowRuleModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建预警规则
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总预警数</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">未读预警</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventoryAlerts.filter(alert => !alert.is_read).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">低库存商品</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">缺货商品</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-4 h-4 inline mr-2" />
              预警通知
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              预警规则
            </button>
            <button
              onClick={() => setActiveTab('low_stock')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'low_stock'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-2" />
              低库存商品
            </button>
            <button
              onClick={() => setActiveTab('out_of_stock')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'out_of_stock'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              缺货商品
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* 预警通知 */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">预警通知</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="搜索商品..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={alertFilter}
                    onChange={(e) => setAlertFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">全部预警</option>
                    <option value="unread">未读预警</option>
                    <option value="read">已读预警</option>
                  </select>
                </div>
              </div>

              {inventoryAlertsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无预警通知</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className={`bg-white border rounded-lg p-4 ${
                      !alert.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getAlertTypeIcon(alert.alert_type)}
                          <div>
                            <h4 className="font-medium text-gray-900">{alert.product_name}</h4>
                            <p className="text-sm text-gray-600">SKU: {alert.product_sku}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAlertTypeColor(alert.alert_type)}`}>
                            {getAlertTypeText(alert.alert_type)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(alert.priority)}`}>
                            优先级: {getPriorityText(alert.priority)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!alert.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              标记已读
                            </button>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-2">
                        {alert.message}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">当前库存:</span>
                          <span className="ml-1 font-medium">{alert.current_stock}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">阈值:</span>
                          <span className="ml-1 font-medium">{alert.threshold_value}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">规则:</span>
                          <span className="ml-1 font-medium">{alert.rule_name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">状态:</span>
                          <span className={`ml-1 font-medium ${alert.is_read ? 'text-gray-600' : 'text-blue-600'}`}>
                            {alert.is_read ? '已读' : '未读'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 预警规则 */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">预警规则</h3>
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建规则
                </button>
              </div>

              {alertRulesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : alertRules.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无预警规则，请创建新规则</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alertRules.map((rule) => (
                    <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${rule.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className="text-sm text-gray-500">{rule.is_active ? '启用' : '禁用'}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">条件类型:</span>
                          <span className="font-medium">{getAlertTypeText(rule.condition_type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">阈值:</span>
                          <span className="font-medium">
                            {rule.threshold_value} {rule.threshold_type === 'percentage' ? '%' : '件'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">通知方式:</span>
                          <div className="flex space-x-1">
                            {rule.notification_methods.includes('email') && <Mail className="w-4 h-4 text-blue-600" />}
                            {rule.notification_methods.includes('sms') && <Smartphone className="w-4 h-4 text-green-600" />}
                            {rule.notification_methods.includes('system') && <Bell className="w-4 h-4 text-purple-600" />}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 低库存商品 */}
          {activeTab === 'low_stock' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">低库存商品</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索商品..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {lowStockItemsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredLowStockItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-4" />
                  <p className="text-gray-500">暂无低库存商品</p>
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
                            最小阈值
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            补货点
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            建议补货量
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLowStockItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-red-600">{item.current_stock}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.min_stock_threshold}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.reorder_point}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.reorder_quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => navigate(`/admin/inventory/${item.id}`)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                查看详情
                              </button>
                              <button
                                onClick={() => navigate(`/admin/inventory/adjustment?productId=${item.id}`)}
                                className="text-green-600 hover:text-green-900"
                              >
                                立即补货
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

          {/* 缺货商品 */}
          {activeTab === 'out_of_stock' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">缺货商品</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索商品..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {outOfStockItemsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredOutOfStockItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-4" />
                  <p className="text-gray-500">暂无缺货商品</p>
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
                            缺货时间
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            预留库存
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            建议补货量
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            供应商
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOutOfStockItems.map((item) => (
                          <tr key={item.id} className="bg-red-50">
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(item.last_updated).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-orange-600">{item.reserved_stock}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.reorder_quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.supplier_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => navigate(`/admin/inventory/${item.id}`)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                查看详情
                              </button>
                              <button
                                onClick={() => navigate(`/admin/inventory/adjustment?productId=${item.id}`)}
                                className="text-red-600 hover:text-red-900"
                              >
                                紧急补货
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
        </div>
      </div>

      {/* 预警规则模态框 */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRule ? '编辑预警规则' : '新建预警规则'}
              </h3>
              <button
                onClick={() => {
                  setShowRuleModal(false);
                  setEditingRule(null);
                  resetRuleForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">规则名称</label>
                  <input
                    type="text"
                    value={ruleForm.name}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入规则名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">条件类型</label>
                  <select
                    value={ruleForm.condition_type}
                    onChange={(e) => setRuleForm(prev => ({ 
                      ...prev, 
                      condition_type: e.target.value as 'low_stock' | 'out_of_stock' | 'overstock' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low_stock">低库存</option>
                    <option value="out_of_stock">缺货</option>
                    <option value="overstock">库存过多</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">规则描述</label>
                <textarea
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="请输入规则描述"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">阈值类型</label>
                  <select
                    value={ruleForm.threshold_type}
                    onChange={(e) => setRuleForm(prev => ({ 
                      ...prev, 
                      threshold_type: e.target.value as 'quantity' | 'percentage' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="quantity">数量</option>
                    <option value="percentage">百分比</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    阈值 {ruleForm.threshold_type === 'percentage' ? '(%)' : '(件)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={ruleForm.threshold_value}
                    onChange={(e) => setRuleForm(prev => ({ 
                      ...prev, 
                      threshold_value: parseInt(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入阈值"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">通知方式</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ruleForm.notification_methods.includes('system')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRuleForm(prev => ({ 
                            ...prev, 
                            notification_methods: [...prev.notification_methods, 'system'] 
                          }));
                        } else {
                          setRuleForm(prev => ({ 
                            ...prev, 
                            notification_methods: prev.notification_methods.filter(m => m !== 'system') 
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">系统通知</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ruleForm.notification_methods.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRuleForm(prev => ({ 
                            ...prev, 
                            notification_methods: [...prev.notification_methods, 'email'] 
                          }));
                        } else {
                          setRuleForm(prev => ({ 
                            ...prev, 
                            notification_methods: prev.notification_methods.filter(m => m !== 'email') 
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">邮件通知</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ruleForm.notification_methods.includes('sms')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRuleForm(prev => ({ 
                            ...prev, 
                            notification_methods: [...prev.notification_methods, 'sms'] 
                          }));
                        } else {
                          setRuleForm(prev => ({ 
                            ...prev, 
                            notification_methods: prev.notification_methods.filter(m => m !== 'sms') 
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">短信通知</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ruleForm.is_active}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">启用规则</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRuleModal(false);
                  setEditingRule(null);
                  resetRuleForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={editingRule ? handleUpdateRule : handleCreateRule}
                disabled={!ruleForm.name || !ruleForm.threshold_value}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingRule ? '更新规则' : '创建规则'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;