import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Image,
  Link,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Calendar,
  Globe,
  Tag,
  Folder,
  Settings,
  X,
  Plus,
  Search,
  Clock,
  AlertCircle
} from 'lucide-react';

interface EditorToolbarProps {
  onAction: (action: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onAction }) => {
  const tools = [
    { id: 'bold', icon: Bold, title: '粗体' },
    { id: 'italic', icon: Italic, title: '斜体' },
    { id: 'link', icon: Link, title: '链接' },
    { id: 'image', icon: Image, title: '图片' },
    { id: 'list', icon: List, title: '列表' },
    { id: 'quote', icon: Quote, title: '引用' },
    { id: 'code', icon: Code, title: '代码' }
  ];

  return (
    <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onAction(tool.id)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
          title={tool.title}
        >
          <tool.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

const ContentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const {
    articles,
    contentCategories,
    contentTags,
    richEditorConfig,
    contentPublishSettings,
    fetchArticleDetail,
    createArticle,
    updateArticle,
    fetchContentCategories,
    fetchContentTags,
    initRichEditor,
    updateContentPublishSettings
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    tags: [] as string[],
    status: 'draft',
    featured_image: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    slug: '',
    publish_at: '',
    visibility: 'public',
    allow_comments: true,
    featured: false
  });

  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    initializeEditor();
    loadData();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      loadArticle();
    }
  }, [id, isEdit]);

  const initializeEditor = () => {
    initRichEditor({
      toolbar: ['bold', 'italic', 'underline', 'link', 'image', 'list', 'quote', 'code'],
      plugins: ['link', 'image', 'table', 'code'],
      image_upload_enabled: true,
      auto_save_enabled: true,
      auto_save_interval: 30000
    });
  };

  const loadData = async () => {
    await Promise.all([
      fetchContentCategories(),
      fetchContentTags()
    ]);
  };

  const loadArticle = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      await fetchArticleDetail(id);
      const article = articles.find(a => a.id === id);
      if (article) {
        setFormData({
          title: article.title || '',
          content: article.content || '',
          excerpt: article.excerpt || '',
          category_id: article.category_id || '',
          tags: article.tags || [],
          status: article.status || 'draft',
          featured_image: article.featured_image || '',
          seo_title: article.seo_title || '',
          seo_description: article.seo_description || '',
          seo_keywords: article.seo_keywords || '',
          slug: article.slug || '',
          publish_at: article.publish_at || '',
          visibility: article.visibility || 'public',
          allow_comments: article.allow_comments ?? true,
          featured: article.featured || false
        });
      }
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 自动生成 slug
    if (field === 'title' && !isEdit) {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }

    // 自动生成 SEO 标题和描述
    if (field === 'title' && !formData.seo_title) {
      setFormData(prev => ({
        ...prev,
        seo_title: value
      }));
    }
    if (field === 'excerpt' && !formData.seo_description) {
      setFormData(prev => ({
        ...prev,
        seo_description: value
      }));
    }
  };

  const handleEditorAction = (action: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    let replacement = '';

    switch (action) {
      case 'bold':
        replacement = `**${selectedText || '粗体文本'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || '斜体文本'}*`;
        break;
      case 'link':
        replacement = `[${selectedText || '链接文本'}](URL)`;
        break;
      case 'image':
        replacement = `![${selectedText || '图片描述'}](图片URL)`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || '列表项'}\n- 列表项\n`;
        break;
      case 'quote':
        replacement = `> ${selectedText || '引用内容'}`;
        break;
      case 'code':
        replacement = `\`${selectedText || '代码'}\``;
        break;
    }

    const newContent = 
      editor.value.substring(0, start) + 
      replacement + 
      editor.value.substring(end);
    
    handleInputChange('content', newContent);
    
    // 重新聚焦并设置光标位置
    setTimeout(() => {
      editor.focus();
      const newCursorPos = start + replacement.length;
      editor.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 这里应该实现实际的图片上传逻辑
      const imageUrl = URL.createObjectURL(file);
      handleInputChange('featured_image', imageUrl);
    }
  };

  const handleSave = async (status: string = formData.status) => {
    setSaving(true);
    try {
      const articleData = {
        ...formData,
        status
      };

      if (isEdit && id) {
        await updateArticle(id, articleData);
      } else {
        await createArticle(articleData);
      }

      navigate('/admin/content');
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/content')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            返回列表
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? '编辑内容' : '创建内容'}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? '编辑' : '预览'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Globe className="h-4 w-4 mr-2" />
            {saving ? '发布中...' : '发布'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 主要内容区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {/* 标签页导航 */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {[
                  { id: 'content', name: '内容', icon: Globe },
                  { id: 'seo', name: 'SEO', icon: Search },
                  { id: 'settings', name: '设置', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-3 px-6 border-b-2 font-medium text-sm ${
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

            {/* 标签页内容 */}
            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* 标题 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标题 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入内容标题"
                      required
                    />
                  </div>

                  {/* 内容编辑器 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      内容 *
                    </label>
                    {showPreview ? (
                      <div className="border border-gray-300 rounded-lg min-h-96 p-4 bg-gray-50">
                        <div className="prose max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <EditorToolbar onAction={handleEditorAction} />
                        <textarea
                          ref={editorRef}
                          value={formData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          className="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none"
                          placeholder="请输入内容..."
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* 摘要 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      摘要
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入内容摘要"
                    />
                  </div>

                  {/* 特色图片 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      特色图片
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.featured_image && (
                        <div className="relative">
                          <img
                            src={formData.featured_image}
                            alt="特色图片"
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleInputChange('featured_image', '')}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <Upload className="h-4 w-4 mr-2" />
                        上传图片
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 标题
                    </label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => handleInputChange('seo_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO 标题（建议 50-60 字符）"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      当前长度: {formData.seo_title.length} 字符
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 描述
                    </label>
                    <textarea
                      value={formData.seo_description}
                      onChange={(e) => handleInputChange('seo_description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SEO 描述（建议 150-160 字符）"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      当前长度: {formData.seo_description.length} 字符
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      关键词
                    </label>
                    <input
                      type="text"
                      value={formData.seo_keywords}
                      onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="关键词，用逗号分隔"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="url-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      完整 URL: /content/{formData.slug}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      发布时间
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publish_at}
                      onChange={(e) => handleInputChange('publish_at', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      可见性
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => handleInputChange('visibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="public">公开</option>
                      <option value="private">私有</option>
                      <option value="password">密码保护</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allow_comments}
                        onChange={(e) => handleInputChange('allow_comments', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">允许评论</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">设为推荐</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 发布状态 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">发布状态</h3>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="scheduled">定时发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>

          {/* 分类 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">分类</h3>
            <select
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">选择分类</option>
              {contentCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 标签 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">标签</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              {showTagInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入标签名称"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTag}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowTagInput(false);
                      setNewTag('');
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加标签
                </button>
              )}
            </div>
          </div>

          {/* 自动保存提示 */}
          {richEditorConfig?.auto_save_enabled && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-800">自动保存已启用</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                每 {(richEditorConfig.auto_save_interval || 30000) / 1000} 秒自动保存一次
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentEdit;