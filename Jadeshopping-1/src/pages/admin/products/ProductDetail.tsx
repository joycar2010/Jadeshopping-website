import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Package, 
  Plus, 
  Minus,
  Calendar,
  Tag,
  BarChart3,
  TrendingUp,
  Star,
  MessageSquare,
  Activity,
  Users,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [showStockModal, setShowStockModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    selectedProduct,
    selectedProductLoading,
    productSalesStats,
    productSalesStatsLoading,
    productOperationLogs,
    productOperationLogsLoading,
    relatedProducts,
    relatedProductsLoading,
    fetchProductDetail,
    fetchProductSalesStats,
    fetchProductOperationLogs,
    fetchRelatedProducts,
    updateProductStatus,
    adjustProductStock,
    deleteProduct
  } = useStore();

  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
      fetchProductSalesStats(id);
      fetchProductOperationLogs(id);
    }
  }, [id, fetchProductDetail, fetchProductSalesStats, fetchProductOperationLogs]);

  useEffect(() => {
    if (selectedProduct) {
      fetchRelatedProducts(selectedProduct.id, selectedProduct.category_id);
    }
  }, [selectedProduct, fetchRelatedProducts]);

  const handleStatusToggle = async () => {
    if (!selectedProduct) return;
    
    const newStatus = selectedProduct.status === 'active' ? 'inactive' : 'active';
    const success = await updateProductStatus(selectedProduct.id, newStatus);
    
    if (success) {
      toast.success(`商品已${newStatus === 'active' ? '上架' : '下架'}`);
      fetchProductDetail(selectedProduct.id);
    } else {
      toast.error('操作失败，请重试');
    }
  };

  const handleStockAdjustment = async () => {
    if (!selectedProduct || stockAdjustment === 0) return;
    
    const success = await adjustProductStock(selectedProduct.id, stockAdjustment);
    
    if (success) {
      toast.success(`库存调整成功：${stockAdjustment > 0 ? '+' : ''}${stockAdjustment}`);
      setStockAdjustment(0);
      setShowStockModal(false);
      fetchProductDetail(selectedProduct.id);
    } else {
      toast.error('库存调整失败，请重试');
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    if (window.confirm('确定要删除这个商品吗？此操作不可撤销。')) {
      const success = await deleteProduct(selectedProduct.id);
      
      if (success) {
        toast.success('商品删除成功');
        navigate('/admin/products');
      } else {
        toast.error('删除失败，请重试');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'out_of_stock': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '在售';
      case 'inactive': return '下架';
      case 'draft': return '草稿';
      case 'out_of_stock': return '缺货';
      default: return '未知';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  if (selectedProductLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">商品不存在</h2>
          <p className="text-gray-600 mb-4">您访问的商品可能已被删除或不存在</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回商品列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回商品列表
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">商品详情</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/admin/products/edit/${selectedProduct.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                编辑商品
              </button>
              
              <button
                onClick={handleStatusToggle}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedProduct.status === 'active'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedProduct.status === 'active' ? (
                  <><EyeOff className="h-4 w-4 mr-2" /> 下架</>
                ) : (
                  <><Eye className="h-4 w-4 mr-2" /> 上架</>
                )}
              </button>
              
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 商品基本信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 商品图片 */}
              <div className="lg:col-span-1">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 商品图片缩略图 */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto">
                    {selectedProduct.images.map((img, index) => (
                      <div key={index} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 商品基本信息 */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                    <p className="text-gray-600 mb-4">SKU: {selectedProduct.sku}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProduct.status)}`}>
                    {getStatusText(selectedProduct.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">售价</p>
                    <p className="text-2xl font-bold text-blue-600">{formatPrice(selectedProduct.price)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">成本价</p>
                    <p className="text-lg font-semibold text-gray-900">{formatPrice(selectedProduct.cost_price || 0)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">库存</p>
                    <div className="flex items-center space-x-2">
                      <p className={`text-lg font-semibold ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedProduct.stock}
                      </p>
                      <button
                        onClick={() => setShowStockModal(true)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Package className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">销量</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedProduct.sales_count || 0}</p>
                  </div>
                </div>

                {/* 商品描述 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">商品描述</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* 时间信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    创建时间：{formatDate(selectedProduct.created_at)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    更新时间：{formatDate(selectedProduct.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: '概览', icon: BarChart3 },
                { id: 'stats', name: '销售统计', icon: TrendingUp },
                { id: 'logs', name: '操作日志', icon: Activity },
                { id: 'related', name: '相关商品', icon: Tag }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">浏览量</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedProduct.view_count || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCart className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">销售量</p>
                      <p className="text-2xl font-bold text-green-900">{selectedProduct.sales_count || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">总收入</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {formatPrice((selectedProduct.sales_count || 0) * selectedProduct.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Star className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">评分</p>
                      <p className="text-2xl font-bold text-purple-900">{selectedProduct.rating || '暂无'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                {productSalesStatsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">销售统计</h3>
                    {productSalesStats && productSalesStats.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productSalesStats.map((stat, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">{stat.period}</p>
                            <p className="text-xl font-bold text-gray-900">{stat.sales_count} 件</p>
                            <p className="text-sm text-gray-600">{formatPrice(stat.revenue)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">暂无销售数据</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                {productOperationLogsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">操作日志</h3>
                    {productOperationLogs && productOperationLogs.length > 0 ? (
                      <div className="space-y-4">
                        {productOperationLogs.map((log, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              {log.action === 'create' && <CheckCircle className="h-5 w-5 text-green-500" />}
                              {log.action === 'update' && <Edit className="h-5 w-5 text-blue-500" />}
                              {log.action === 'delete' && <XCircle className="h-5 w-5 text-red-500" />}
                              {log.action === 'stock_adjust' && <Package className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{log.description}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(log.created_at)}
                                <span className="mx-2">•</span>
                                <Users className="h-3 w-3 mr-1" />
                                {log.operator}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">暂无操作记录</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'related' && (
              <div>
                {relatedProductsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">相关商品</h3>
                    {relatedProducts && relatedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((product) => (
                          <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>
                              <button
                                onClick={() => navigate(`/admin/products/${product.id}`)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                查看详情
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">暂无相关商品</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 库存调整模态框 */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">调整库存</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前库存：{selectedProduct.stock}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setStockAdjustment(Math.max(stockAdjustment - 1, -selectedProduct.stock))}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <input
                  type="number"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  placeholder="调整数量"
                />
                
                <button
                  onClick={() => setStockAdjustment(stockAdjustment + 1)}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                调整后库存：{selectedProduct.stock + stockAdjustment}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setStockAdjustment(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleStockAdjustment}
                disabled={stockAdjustment === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default ProductDetail;