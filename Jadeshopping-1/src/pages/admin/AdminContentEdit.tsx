import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  RefreshCw, 
  Globe,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react'

interface ContentPage {
  id: string
  page_key: string
  title: string
  content: string
  metadata: any
  status: 'draft' | 'published'
  updated_at: string
}

const AdminContentEdit: React.FC = () => {
  const { pageKey } = useParams<{ pageKey: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [page, setPage] = useState<ContentPage | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const pageLabels: Record<string, string> = {
    'about': '关于我们',
    'contact': '联系我们', 
    'help': '帮助中心',
    'shipping': '配送说明',
    'returns': '退货政策',
    'privacy': '隐私政策',
    'terms': '服务条款'
  }

  // Quill编辑器配置
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image'
  ]

  useEffect(() => {
    if (pageKey) {
      fetchPage()
    }
  }, [pageKey])

  useEffect(() => {
    // 检测是否有未保存的更改
    if (page) {
      const hasContentChanges = title !== page.title || content !== page.content || status !== page.status
      setHasChanges(hasContentChanges)
    }
  }, [title, content, status, page])

  const fetchPage = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('page_key', pageKey)
        .single()

      if (error) throw error
      
      setPage(data)
      setTitle(data.title)
      setContent(data.content || '')
      setStatus(data.status)
    } catch (error) {
      console.error('获取页面内容失败:', error)
      showToast('error', '获取页面内容失败')
      navigate('/admin/content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!page) return

    try {
      setSaving(true)
      const updateStatus = newStatus || status
      
      const { error } = await supabase
        .from('content_pages')
        .update({
          title,
          content,
          status: updateStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id)

      if (error) throw error

      setPage({ ...page, title, content, status: updateStatus, updated_at: new Date().toISOString() })
      setStatus(updateStatus)
      setHasChanges(false)
      
      showToast('success', `页面已${updateStatus === 'published' ? '发布' : '保存为草稿'}`)
    } catch (error) {
      console.error('保存页面失败:', error)
      showToast('error', '保存页面失败')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = () => {
    handleSave('published')
  }

  const handleSaveDraft = () => {
    handleSave('draft')
  }

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('您有未保存的更改，确定要离开吗？')) {
        navigate('/admin/content')
      }
    } else {
      navigate('/admin/content')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="加载页面内容中..." className="h-64" />
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">页面不存在</h3>
        <p className="text-gray-500 mb-4">请检查页面路径是否正确</p>
        <button
          onClick={() => navigate('/admin/content')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回内容管理
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  编辑页面：{pageLabels[pageKey!] || pageKey}
                </h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    /{pageKey}
                  </span>
                  {page.updated_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      最后更新：{formatDate(page.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  previewMode 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? '编辑模式' : '预览模式'}
              </button>
              
              <button
                onClick={handleSaveDraft}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? '保存中...' : '保存草稿'}
              </button>
              
              <button
                onClick={handlePublish}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                {saving ? '发布中...' : '发布'}
              </button>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">您有未保存的更改</span>
              </div>
            </div>
          )}
        </div>

        {/* 编辑区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!previewMode ? (
            <div className="p-6">
              {/* 标题编辑 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  页面标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入页面标题..."
                />
              </div>

              {/* 内容编辑 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  页面内容
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </div>

              {/* 状态选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  发布状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* 预览模式 */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AdminContentEdit