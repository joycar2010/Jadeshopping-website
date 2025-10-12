import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Home,
  Package,
  Grid3X3,
  Info,
  Phone,
  LogIn,
  UserPlus,
  User,
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Truck,
  RotateCcw,
  Shield,
  FileText,
  Search,
  Heart,
  ClipboardList,
  CheckCircle,
  Map,
  Calendar,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface SitemapSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: SitemapLink[];
}

interface SitemapLink {
  title: string;
  path: string;
  description: string;
  isExternal?: boolean;
}

const Sitemap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSections, setFilteredSections] = useState<SitemapSection[]>([]);

  const sitemapSections: SitemapSection[] = [
    {
      title: '主要页面',
      description: '网站核心功能页面',
      icon: <Home className="w-6 h-6 text-jade-600" />,
      links: [
        {
          title: '首页',
          path: '/',
          description: '玉石轩官网首页，展示精选玉石商品和最新资讯'
        },
        {
          title: '商品分类',
          path: '/categories',
          description: '按类别浏览玉石商品，包括和田玉、翡翠等'
        },
        {
          title: '商品列表',
          path: '/products',
          description: '浏览所有玉石商品，支持筛选和排序功能'
        },
        {
          title: '关于我们',
          path: '/about',
          description: '了解玉石轩的品牌故事、企业文化和发展历程'
        },
        {
          title: '联系我们',
          path: '/contact',
          description: '获取联系方式、地址信息和在线客服支持'
        }
      ]
    },
    {
      title: '用户中心',
      description: '用户账户相关功能',
      icon: <User className="w-6 h-6 text-jade-600" />,
      links: [
        {
          title: '用户登录',
          path: '/login',
          description: '登录您的玉石轩账户，享受个性化服务'
        },
        {
          title: '用户注册',
          path: '/register',
          description: '注册新账户，成为玉石轩会员'
        },
        {
          title: '个人中心',
          path: '/profile',
          description: '管理个人信息、查看订单历史和收藏夹'
        },
        {
          title: '购物车',
          path: '/cart',
          description: '查看已添加的商品，修改数量或删除商品'
        },

      ]
    },
    {
      title: '订单管理',
      description: '订单相关功能页面',
      icon: <ClipboardList className="w-6 h-6 text-jade-600" />,
      links: [
        {
          title: '订单列表',
          path: '/orders',
          description: '查看所有订单记录，跟踪订单状态'
        },
        {
          title: '收藏夹',
          path: '/favorites',
          description: '管理收藏的玉石商品，快速找到心仪商品'
        },
        {
          title: '搜索结果',
          path: '/search',
          description: '商品搜索结果页面，快速找到所需商品'
        }
      ]
    },
    {
      title: '帮助支持',
      description: '客户服务和帮助信息',
      icon: <HelpCircle className="w-6 h-6 text-jade-600" />,
      links: [
        {
          title: '帮助中心',
          path: '/help',
          description: '常见问题解答、玉石鉴别指南和购买指南'
        },
        {
          title: '配送信息',
          path: '/shipping',
          description: '配送范围、时间、费用说明和物流跟踪'
        },
        {
          title: '退换货政策',
          path: '/returns',
          description: '退换货条件、流程和退款说明'
        }
      ]
    },
    {
      title: '法律条款',
      description: '网站使用条款和政策',
      icon: <FileText className="w-6 h-6 text-jade-600" />,
      links: [
        {
          title: '隐私政策',
          path: '/privacy',
          description: '用户隐私保护政策和数据使用说明'
        },
        {
          title: '服务条款',
          path: '/terms',
          description: '网站使用条款、用户协议和免责声明'
        },
        {
          title: '网站地图',
          path: '/sitemap',
          description: '网站结构导航，快速找到所需页面'
        }
      ]
    }
  ];

  // 搜索功能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredSections([]);
      return;
    }

    const filtered = sitemapSections.map(section => ({
      ...section,
      links: section.links.filter(link => 
        link.title.toLowerCase().includes(query.toLowerCase()) ||
        link.description.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(section => section.links.length > 0);

    setFilteredSections(filtered);
  };

  const displaySections = searchQuery.trim() ? filteredSections : sitemapSections;
  const totalPages = sitemapSections.reduce((total, section) => total + section.links.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>网站地图 - 玉石轩</title>
        <meta name="description" content="玉石轩网站地图，快速导航到所有页面，包括商品浏览、用户中心、帮助支持等功能页面" />
        <meta name="keywords" content="网站地图,导航,玉石商城,页面导航,网站结构" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">网站地图</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Map className="w-12 h-12 text-jade-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">网站地图</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            快速导航到玉石轩的所有页面，找到您需要的功能和信息
          </p>
          
          {/* 统计信息 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-8 h-8 text-jade-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{sitemapSections.length}</div>
              <div className="text-sm text-gray-600">功能分类</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <Grid3X3 className="w-8 h-8 text-jade-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalPages}</div>
              <div className="text-sm text-gray-600">总页面数</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-jade-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">在线服务</div>
            </div>
          </div>
        </div>

        {/* 搜索功能 */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索页面..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 网站地图内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displaySections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* 分类标题 */}
              <div className="bg-gradient-to-r from-jade-50 to-jade-100 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  {section.icon}
                  <div className="ml-3">
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* 链接列表 */}
              <div className="p-6">
                <div className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.path}
                      className="block p-4 rounded-lg border border-gray-100 hover:border-jade-200 hover:bg-jade-50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900 group-hover:text-jade-600 transition-colors">
                              {link.title}
                            </h3>
                            {link.isExternal && (
                              <ExternalLink className="w-4 h-4 text-gray-400 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {link.description}
                          </p>
                          <div className="text-xs text-gray-400 mt-2 font-mono">
                            {link.path}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 搜索无结果 */}
        {searchQuery.trim() && displaySections.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关页面</h3>
            <p className="text-gray-600">
              尝试使用其他关键词搜索，或浏览上方的分类导航
            </p>
          </div>
        )}

        {/* 底部信息 */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">网站地图更新</h3>
            </div>
            <p className="text-gray-600 mb-4">
              本网站地图会定期更新，确保包含所有最新页面和功能
            </p>
            <div className="text-sm text-gray-500">
              最后更新时间：{new Date().toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;