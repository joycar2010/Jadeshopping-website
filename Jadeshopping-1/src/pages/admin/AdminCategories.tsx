import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'

interface Category {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  sort_order: number
  product_count: number
  created_at: string
  updated_at: string
}

interface CategoryForm {
  name: string
  description: string
  status: 'active' | 'inactive'
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const [form, setForm] = useState<CategoryForm>({
    name: '',
    description: '',
    status: 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      
      // 获取分类及其商品数量
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products(count)
        `)
        .order('sort_order')

      if (error) throw error

      const categoriesWithCount = data?.map(category => ({
        ...category,
        product_count: category.products?.[0]?.count || 0
      })) || []

      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching categories:', error)
      showToast('error', '获取分类列表失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = '分类名称不能为空'
    }

    if (!form.description.trim()) {
      newErrors.description = '分类描述不能为空'
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

      const categoryData = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        updated_at: new Date().toISOString()
      }

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)

        if (error) throw error
        showToast('success', '分类更新成功')
      } else {
        // 获取最大排序值
        const { data: maxSortData } = await supabase
          .from('categories')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)

        const maxSort = maxSortData?.[0]?.sort_order || 0

        const { error } = await supabase
          .from('categories')
          .insert([{
            ...categoryData,
            sort_order: maxSort + 1
          }])

        if (error) throw error
        showToast('success', '分类创建成功')
      }

      setShowModal(false)
      setEditingCategory(null)
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      showToast('error', editingCategory ? '更新失败' : '创建失败', '请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setForm({
      name: category.name,
      description: category.description,
      status: category.status
    })
    setShowModal(true)
  }

  const handleDelete = async (category: Category) => {
    if (category.product_count > 0) {
      showToast('error', '删除失败', '该分类下还有商品，无法删除')
      return
    }

    if (!confirm(`确定要删除分类"${category.name}"吗？`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)

      if (error) throw error

      showToast('success', '分类删除成功')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      showToast('error', '删除失败', '请稍后重试')
    }
  }

  const handleStatusToggle = async (category: Category) => {
    try {
      const newStatus = category.status === 'active' ? 'inactive' : 'active'
      
      const { error } = await supabase
        .from('categories')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id)

      if (error) throw error

      showToast('success', `分类已${newStatus === 'active' ? '启用' : '禁用'}`)
      fetchCategories()
    } catch (error) {
      console.error('Error updating category status:', error)
      showToast('error', '状态更新失败')
    }
  }

  const handleSortChange = async (category: Category, direction: 'up' | 'down') => {
    try {
      const currentIndex = categories.findIndex(c => c.id === category.id)
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (targetIndex < 0 || targetIndex >= categories.length) {
        return
      }

      const targetCategory = categories[targetIndex]

      // 交换排序值
      const { error: error1 } = await supabase
        .from('categories')
        .update({ sort_order: targetCategory.sort_order })
        .eq('id', category.id)

      const { error: error2 } = await supabase
        .from('categories')
        .update({ sort_order: category.sort_order })
        .eq('id', targetCategory.id)

      if (error1 || error2) throw error1 || error2

      showToast('success', '排序更新成功')
      fetchCategories()
    } catch (error) {
      console.error('Error updating sort order:', error)
      showToast('error', '排序更新失败')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      status: 'active'
    })
    setErrors({})
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingCategory(null)
    resetForm()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '已启用'
      case 'inactive':
        return '已禁用'
      default:
        return '未知'
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <p className="text-gray-600 mt-1">管理商品分类信息</p>
      </div>

      {/* 操作栏 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索分类名称或描述..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">全部状态</option>
            <option value="active">已启用</option>
            <option value="inactive">已禁用</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      {/* 分类列表 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category, index) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {category.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                      {getStatusText(category.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {category.product_count} 个商品
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSortChange(category, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSortChange(category, 'down')}
                        disabled={index === filteredCategories.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(category)}
                        className={`p-2 rounded-lg ${
                          category.status === 'active'
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={category.status === 'active' ? '禁用' : '启用'}
                      >
                        {category.status === 'active' ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">暂无分类数据</div>
          </div>
        )}
      </div>

      {/* 新增/编辑分类模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? '编辑分类' : '新增分类'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类名称 *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入分类名称"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类描述 *
                </label>
                <textarea
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入分类描述"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <option value="active">已启用</option>
                  <option value="inactive">已禁用</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '保存中...' : (editingCategory ? '更新' : '创建')}
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories