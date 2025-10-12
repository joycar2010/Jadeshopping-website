import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, AlertCircle, Plus, X, Tag, Package, DollarSign, Image as ImageIcon, FileText, Settings, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ImageUpload } from '@/components/ui/ImageUpload';
import type { ProductEditForm, ProductSpecification, ProductImage } from '@/types';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  const {
    productEditForm,
    productEditLoading,
    productEditErrors,
    productImages,
    productImagesLoading,
    productSpecifications,
    isDraftSaving,
    isPublishing,
    categories,
    updateProductEditForm,
    initProductEdit,
    saveProductDraft,
    publishProduct,
    validateProductForm,
    uploadProductImage,
    deleteProductImage,
    reorderProductImages,
    addProductSpecification,
    updateProductSpecification,
    deleteProductSpecification,
    generateProductSKU,
    checkSKUAvailability,
    fetchCategories
  } = useStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'inventory' | 'seo'>('basic');
  const [newSpecification, setNewSpecification] = useState<Partial<ProductSpecification>>({});
  const [showSpecificationForm, setShowSpecificationForm] = useState(false);
  const [skuCheckLoading, setSkuCheckLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    initProductEdit(isEditMode ? id! : undefined);
  }, [id, isEditMode]);

  const handleFormChange = (field: keyof ProductEditForm, value: any) => {
    updateProductEditForm(field, value);
  };

  const handleSKUGenerate = async () => {
    if (productEditForm?.name && productEditForm?.category_id) {
      const sku = await generateProductSKU(productEditForm.name, productEditForm.category_id);
      handleFormChange('sku', sku);
    }
  };

  const handleSKUCheck = async (sku: string) => {
    if (!sku) return;
    setSkuCheckLoading(true);
    try {
      const isAvailable = await checkSKUAvailability(sku);
      if (!isAvailable) {
        // 显示SKU已存在的错误
      }
    } finally {
      setSkuCheckLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<ProductImage | null> => {
    return await uploadProductImage(file);
  };

  const handleImageDelete = async (imageId: string): Promise<boolean> => {
    return await deleteProductImage(imageId);
  };

  const handleImageReorder = async (images: ProductImage[]): Promise<boolean> => {
    return await reorderProductImages(images);
  };

  const handleImageSetMain = (imageId: string) => {
    const updatedImages = productImages.map(img => ({
      ...img,
      is_main: img.id === imageId
    }));
    handleImageReorder(updatedImages);
  };

  const handleAddSpecification = () => {
    if (newSpecification.name && newSpecification.value) {
      addProductSpecification(newSpecification as ProductSpecification);
      setNewSpecification({});
      setShowSpecificationForm(false);
    }
  };

  const handleSaveDraft = async () => {
    const isValid = await validateProductForm();
    if (isValid) {
      await saveProductDraft();
    }
  };

  const handlePublish = async () => {
    const isValid = await validateProductForm();
    if (isValid) {
      await publishProduct();
      navigate('/admin/products');
    }
  };

  const handlePreview = () => {
    // 打开预览窗口或跳转到预览页面
    if (productEditForm?.id) {
      window.open(`/products/${productEditForm.id}`, '_blank');
    }
  };

  if (productEditLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!productEditForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600">无法加载商品信息，请稍后重试</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', name: '基本信息', icon: Package },
    { id: 'images', name: '商品图片', icon: ImageIcon },
    { id: 'inventory', name: '库存规格', icon: Tag },
    { id: 'seo', name: 'SEO设置', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/products')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? '编辑商品' : '新增商品'}
                </h1>
                <p className="text-sm text-gray-500">
                  {isEditMode ? `编辑 ${productEditForm.name}` : '创建新的商品信息'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isEditMode && (
                <button
                  onClick={handlePreview}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  预览
                </button>
              )}
              <button
                onClick={handleSaveDraft}
                disabled={isDraftSaving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isDraftSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                保存草稿
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isPublishing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Package className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? '更新商品' : '发布商品'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧主要内容 */}
          <div className="flex-1">
            {/* 标签页导航 */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                          flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* 基本信息标签页 */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 商品名称 */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          商品名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={productEditForm.name || ''}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入商品名称"
                        />
                        {productEditErrors?.name && (
                          <p className="mt-1 text-sm text-red-600">{productEditErrors.name}</p>
                        )}
                      </div>

                      {/* SKU */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={productEditForm.sku || ''}
                            onChange={(e) => handleFormChange('sku', e.target.value)}
                            onBlur={(e) => handleSKUCheck(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="商品SKU"
                          />
                          <button
                            type="button"
                            onClick={handleSKUGenerate}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          >
                            生成
                          </button>
                        </div>
                        {skuCheckLoading && (
                          <p className="mt-1 text-sm text-gray-500">检查SKU可用性...</p>
                        )}
                        {productEditErrors?.sku && (
                          <p className="mt-1 text-sm text-red-600">{productEditErrors.sku}</p>
                        )}
                      </div>

                      {/* 商品分类 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          商品分类 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={productEditForm.category_id || ''}
                          onChange={(e) => handleFormChange('category_id', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">请选择分类</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {productEditErrors?.category_id && (
                          <p className="mt-1 text-sm text-red-600">{productEditErrors.category_id}</p>
                        )}
                      </div>

                      {/* 销售价格 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          销售价格 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={productEditForm.price || ''}
                            onChange={(e) => handleFormChange('price', parseFloat(e.target.value))}
                            className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        {productEditErrors?.price && (
                          <p className="mt-1 text-sm text-red-600">{productEditErrors.price}</p>
                        )}
                      </div>

                      {/* 成本价格 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          成本价格
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={productEditForm.cost_price || ''}
                            onChange={(e) => handleFormChange('cost_price', parseFloat(e.target.value))}
                            className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* 商品状态 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          商品状态
                        </label>
                        <select
                          value={productEditForm.status || 'draft'}
                          onChange={(e) => handleFormChange('status', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">草稿</option>
                          <option value="active">在售</option>
                          <option value="inactive">下架</option>
                          <option value="out_of_stock">缺货</option>
                        </select>
                      </div>
                    </div>

                    {/* 商品描述 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        商品描述
                      </label>
                      <RichTextEditor
                        value={productEditForm.description || ''}
                        onChange={(value) => handleFormChange('description', value)}
                        placeholder="请输入商品详细描述..."
                      />
                      {productEditErrors?.description && (
                        <p className="mt-1 text-sm text-red-600">{productEditErrors.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 商品图片标签页 */}
                {activeTab === 'images' && (
                  <div>
                    <ImageUpload
                      images={productImages}
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onReorder={handleImageReorder}
                      onSetMain={handleImageSetMain}
                      loading={productImagesLoading}
                      maxImages={10}
                      error={productEditErrors?.images}
                    />
                  </div>
                )}

                {/* 库存规格标签页 */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 库存数量 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          库存数量 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={productEditForm.stock_quantity || ''}
                          onChange={(e) => handleFormChange('stock_quantity', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                        {productEditErrors?.stock_quantity && (
                          <p className="mt-1 text-sm text-red-600">{productEditErrors.stock_quantity}</p>
                        )}
                      </div>

                      {/* 库存预警 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          库存预警阈值
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={productEditForm.low_stock_threshold || ''}
                          onChange={(e) => handleFormChange('low_stock_threshold', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10"
                        />
                      </div>
                    </div>

                    {/* 商品规格 */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">商品规格</h3>
                        <button
                          type="button"
                          onClick={() => setShowSpecificationForm(true)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          添加规格
                        </button>
                      </div>

                      {/* 规格列表 */}
                      <div className="space-y-2">
                        {productSpecifications.map((spec) => (
                          <div key={spec.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{spec.name}:</span>
                              <span className="ml-2 text-gray-600">{spec.value}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteProductSpecification(spec.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* 添加规格表单 */}
                      {showSpecificationForm && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                规格名称
                              </label>
                              <input
                                type="text"
                                value={newSpecification.name || ''}
                                onChange={(e) => setNewSpecification({ ...newSpecification, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="如：颜色、尺寸"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                规格值
                              </label>
                              <input
                                type="text"
                                value={newSpecification.value || ''}
                                onChange={(e) => setNewSpecification({ ...newSpecification, value: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="如：红色、XL"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowSpecificationForm(false);
                                setNewSpecification({});
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                              取消
                            </button>
                            <button
                              type="button"
                              onClick={handleAddSpecification}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                              添加
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO设置标签页 */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO标题
                      </label>
                      <input
                        type="text"
                        value={productEditForm.seo_title || ''}
                        onChange={(e) => handleFormChange('seo_title', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="SEO标题，建议60字符以内"
                        maxLength={60}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {(productEditForm.seo_title || '').length}/60
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO描述
                      </label>
                      <textarea
                        value={productEditForm.seo_description || ''}
                        onChange={(e) => handleFormChange('seo_description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="SEO描述，建议160字符以内"
                        maxLength={160}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {(productEditForm.seo_description || '').length}/160
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        关键词
                      </label>
                      <input
                        type="text"
                        value={productEditForm.seo_keywords || ''}
                        onChange={(e) => handleFormChange('seo_keywords', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="关键词，用逗号分隔"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        商品标签
                      </label>
                      <input
                        type="text"
                        value={productEditForm.tags?.join(', ') || ''}
                        onChange={(e) => handleFormChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="商品标签，用逗号分隔"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="w-full lg:w-80">
            <div className="space-y-6">
              {/* 发布状态 */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">发布状态</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">状态</span>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${productEditForm.status === 'active' ? 'bg-green-100 text-green-800' :
                        productEditForm.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        productEditForm.status === 'out_of_stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {productEditForm.status === 'active' ? '在售' :
                       productEditForm.status === 'inactive' ? '下架' :
                       productEditForm.status === 'out_of_stock' ? '缺货' : '草稿'}
                    </span>
                  </div>
                  {isEditMode && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">创建时间</span>
                        <span className="text-sm text-gray-900">
                          {productEditForm.created_at ? new Date(productEditForm.created_at).toLocaleDateString() : '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">更新时间</span>
                        <span className="text-sm text-gray-900">
                          {productEditForm.updated_at ? new Date(productEditForm.updated_at).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 商品统计 */}
              {isEditMode && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">商品统计</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">浏览次数</span>
                      <span className="text-sm text-gray-900">
                        {productEditForm.view_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">销售数量</span>
                      <span className="text-sm text-gray-900">
                        {productEditForm.sales_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">收藏次数</span>
                      <span className="text-sm text-gray-900">
                        {productEditForm.favorite_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;