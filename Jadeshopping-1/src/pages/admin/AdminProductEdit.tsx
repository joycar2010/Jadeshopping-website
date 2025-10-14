import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Save, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'

interface Category {
  id: string
  name: string
}

interface ProductForm {
  name: string
  description: string
  price: number
  stock: number
  category_id: string
  status: 'draft' | 'active' | 'inactive'
  images: string[]
}

const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { showToast } = useToast()

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    status: 'draft',
    images: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories()
    if (isEdit && id) {
      fetchProduct()
    }
  }, [id, isEdit])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('status', 'active')
        .order('sort_order')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      showToast('error', '获取分类列表失败')
    }
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        stock: data.stock || 0,
        category_id: data.category_id || '',
        status: data.status || 'draft',
        images: data.images || []
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      showToast('error', '获取商品信息失败')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = '商品名称不能为空'
    }

    if (!form.description.trim()) {
      newErrors.description = '商品描述不能为空'
    }

    if (form.price <= 0) {
      newErrors.price = '商品价格必须大于0'
    }

    if (form.stock < 0) {
      newErrors.stock = '库存数量不能为负数'
    }

    if (!form.category_id) {
      newErrors.category_id = '请选择商品分类'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price,
        stock: form.stock,
        category_id: form.category_id,
        status: form.status,
        images: form.images,
        updated_at: new Date().toISOString()
      }

      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)

        if (error) throw error
        showToast('success', '商品更新成功')
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
        showToast('success', '商品创建成功')
      }

      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      showToast('error', isEdit ? '更新失败' : '创建失败', '请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // 这里应该实现图片上传到 Supabase Storage 的逻辑
    // 为了演示，我们使用占位符URL
    const newImages = Array.from(files).map((file, index) => 
      `https://via.placeholder.com/300x300?text=Image${form.images.length + index + 1}`
    )

    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))

    showToast('success', '图片上传成功')
  }

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? '编辑商品' : '新增商品'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? '修改商品信息' : '创建新的商品'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品名称 *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="请输入商品名称"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品描述 *
                  </label>
                  <textarea
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="请输入商品描述"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      商品价格 *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        value={form.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      库存数量 *
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.stock ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={form.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 商品图片 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">商品图片</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {form.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`商品图片 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">上传图片</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  支持 JPG、PNG 格式，建议尺寸 800x800px，最多上传 8 张图片
                </p>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">发布设置</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品分类 *
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={form.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                  >
                    <option value="">请选择分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品状态
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="draft">草稿</option>
                    <option value="active">已上架</option>
                    <option value="inactive">已下架</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? '保存中...' : (isEdit ? '更新商品' : '创建商品')}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminProductEdit