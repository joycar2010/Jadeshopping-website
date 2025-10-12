import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Eye, 
  Star,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { CategoryEditForm } from '../../../types';

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const {
    categories,
    categoryEditForm,
    categoryEditLoading,
    categoryEditErrors,
    initCategoryEdit,
    updateCategoryEditForm,
    saveCategoryDraft,
    publishCategory,
    validateCategoryForm,
    uploadCategoryImage,
    fetchCategories
  } = useStore();

  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    initCategoryEdit(isEditing ? id : undefined);
  }, [id, isEditing]);

  const handleInputChange = (field: keyof CategoryEditForm, value: any) => {
    updateCategoryEditForm(field, value);
  };

  const handleImageUpload = async (file: File, type: 'image' | 'banner') => {
    if (type === 'image') {
      setImageUploading(true);
    } else {
      setBannerUploading(true);
    }

    try {
      const imageUrl = await uploadCategoryImage(file);
      if (imageUrl) {
        handleInputChange(type === 'image' ? 'image' : 'banner_image', imageUrl);
      }
    } catch (error) {
      console.error('图片上传失败:', error);
    } finally {
      if (type === 'image') {
        setImageUploading(false);
      } else {
        setBannerUploading(false);
      }
    }
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    try {
      const success = await saveCategoryDraft();
      if (success) {
        // 可以显示保存成功的提示
      }
    } catch (error) {
      console.error('保存草稿失败:', error);
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handlePublish = async () => {
    const errors = validateCategoryForm();
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsPublishing(true);
    try {
      const success = await publishCategory();
      if (success) {
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('发布失败:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const getParentCategories = () => {
    return categories.filter(cat => 
      cat.level === 1 && (!isEditing || cat.id !== id)
    );
  };

  if (categoryEditLoading || !categoryEditForm) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/categories')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? '编辑分类' : '新增分类'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? '修改分类信息和设置' : '创建新的商品分类'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={isDraftSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isDraftSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            保存草稿
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isPublishing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {isEditing ? '更新分类' : '发布分类'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryEditForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    categoryEditErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入分类名称"
                />
                {categoryEditErrors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {categoryEditErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类描述
                </label>
                <textarea
                  value={categoryEditForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    categoryEditErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入分类描述"
                />
                {categoryEditErrors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {categoryEditErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    父级分类
                  </label>
                  <select
                    value={categoryEditForm.parent_id}
                    onChange={(e) => handleInputChange('parent_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">顶级分类</option>
                    {getParentCategories().map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序值
                  </label>
                  <input
                    type="number"
                    value={categoryEditForm.sort_order}
                    onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      categoryEditErrors.sort_order ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="排序值"
                    min="0"
                  />
                  {categoryEditErrors.sort_order && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {categoryEditErrors.sort_order}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 图片设置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">图片设置</h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              {/* 分类图标 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类图标
                </label>
                <div className="flex items-center space-x-4">
                  {categoryEditForm.image ? (
                    <div className="relative">
                      <img
                        src={categoryEditForm.image}
                        alt="分类图标"
                        className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        onClick={() => handleInputChange('image', '')}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, 'image');
                        }
                      }}
                      className="hidden"
                      id="category-image-upload"
                    />
                    <label
                      htmlFor="category-image-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      {imageUploading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      上传图标
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      建议尺寸：200x200px，支持 JPG、PNG 格式
                    </p>
                  </div>
                </div>
              </div>

              {/* 横幅图片 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  横幅图片
                </label>
                <div className="space-y-4">
                  {categoryEditForm.banner_image ? (
                    <div className="relative">
                      <img
                        src={categoryEditForm.banner_image}
                        alt="横幅图片"
                        className="w-full h-32 rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        onClick={() => handleInputChange('banner_image', '')}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">暂无横幅图片</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, 'banner');
                        }
                      }}
                      className="hidden"
                      id="banner-image-upload"
                    />
                    <label
                      htmlFor="banner-image-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      {bannerUploading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      上传横幅
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      建议尺寸：1200x300px，支持 JPG、PNG 格式
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO设置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">SEO设置</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO标题
                </label>
                <input
                  type="text"
                  value={categoryEditForm.seo_title}
                  onChange={(e) => handleInputChange('seo_title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    categoryEditErrors.seo_title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="SEO标题（建议60字符以内）"
                />
                {categoryEditErrors.seo_title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {categoryEditErrors.seo_title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO描述
                </label>
                <textarea
                  value={categoryEditForm.seo_description}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    categoryEditErrors.seo_description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="SEO描述（建议160字符以内）"
                />
                {categoryEditErrors.seo_description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {categoryEditErrors.seo_description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO关键词
                </label>
                <input
                  type="text"
                  value={categoryEditForm.seo_keywords}
                  onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="多个关键词用逗号分隔"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 分类设置 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">分类设置</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">启用状态</label>
                  <p className="text-xs text-gray-500">控制分类是否在前台显示</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryEditForm.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">推荐分类</label>
                  <p className="text-xs text-gray-500">在首页等位置推荐显示</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryEditForm.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 操作提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">操作提示</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>分类名称是必填项</li>
                    <li>可以设置父级分类创建多级分类</li>
                    <li>排序值越小越靠前显示</li>
                    <li>SEO设置有助于搜索引擎优化</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;