import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Shield,
  Eye,
  Lock,
  Cookie,
  UserCheck,
  Database,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
  Mail,
  Phone,
  Calendar,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface DataType {
  type: string;
  description: string;
  purpose: string;
  retention: string;
  icon: React.ReactNode;
}

interface UserRight {
  right: string;
  description: string;
  howTo: string;
  icon: React.ReactNode;
}

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('collection');

  const dataTypes: DataType[] = [
    {
      type: '个人身份信息',
      description: '姓名、电话、邮箱、地址等基本信息',
      purpose: '用于订单处理、配送和客户服务',
      retention: '账户存续期间',
      icon: <UserCheck className="w-6 h-6 text-jade-600" />
    },
    {
      type: '交易信息',
      description: '订单记录、购买历史、商品偏好',
      purpose: '处理交易、提供售后服务、改善用户体验',
      retention: '法律要求的最短期限',
      icon: <FileText className="w-6 h-6 text-jade-600" />
    },
    {
      type: '设备信息',
      description: 'IP地址、浏览器类型、设备标识符',
      purpose: '网站安全、性能优化、用户分析',
      retention: '12个月',
      icon: <Globe className="w-6 h-6 text-jade-600" />
    },
    {
      type: '使用数据',
      description: '浏览记录、搜索历史、偏好设置',
      purpose: '个性化推荐、改善服务质量',
      retention: '24个月',
      icon: <Database className="w-6 h-6 text-jade-600" />
    }
  ];

  const userRights: UserRight[] = [
    {
      right: '访问权',
      description: '您有权了解我们收集了您的哪些个人信息',
      howTo: '登录账户查看或联系客服申请',
      icon: <Eye className="w-6 h-6 text-jade-600" />
    },
    {
      right: '更正权',
      description: '您有权要求我们更正不准确的个人信息',
      howTo: '在账户设置中修改或联系客服',
      icon: <Settings className="w-6 h-6 text-jade-600" />
    },
    {
      right: '删除权',
      description: '在特定情况下，您有权要求删除个人信息',
      howTo: '提交书面申请，我们将在30天内处理',
      icon: <AlertTriangle className="w-6 h-6 text-jade-600" />
    },
    {
      right: '限制处理权',
      description: '您有权要求我们限制对您个人信息的处理',
      howTo: '通过客服或邮件提出申请',
      icon: <Lock className="w-6 h-6 text-jade-600" />
    },
    {
      right: '数据可携权',
      description: '您有权以结构化格式获取您的个人信息',
      howTo: '联系客服申请数据导出',
      icon: <Database className="w-6 h-6 text-jade-600" />
    },
    {
      right: '反对权',
      description: '您有权反对我们基于合法利益处理您的信息',
      howTo: '发送邮件至privacy@yushixuan.com',
      icon: <Shield className="w-6 h-6 text-jade-600" />
    }
  ];

  const cookieTypes = [
    {
      name: '必要Cookie',
      description: '网站正常运行所必需的Cookie',
      examples: ['登录状态', '购物车内容', '安全验证'],
      canDisable: false,
      duration: '会话期间'
    },
    {
      name: '功能Cookie',
      description: '记住您的偏好设置，提供个性化体验',
      examples: ['语言偏好', '地区设置', '显示偏好'],
      canDisable: true,
      duration: '12个月'
    },
    {
      name: '分析Cookie',
      description: '帮助我们了解网站使用情况，改善服务',
      examples: ['访问统计', '页面浏览', '用户行为'],
      canDisable: true,
      duration: '24个月'
    },
    {
      name: '营销Cookie',
      description: '用于向您展示相关的广告和推荐',
      examples: ['广告定向', '推荐算法', '营销活动'],
      canDisable: true,
      duration: '12个月'
    }
  ];

  const securityMeasures = [
    {
      measure: '数据加密',
      description: '使用SSL/TLS加密传输，AES-256加密存储',
      icon: <Lock className="w-8 h-8 text-jade-600" />
    },
    {
      measure: '访问控制',
      description: '严格的员工权限管理和访问日志记录',
      icon: <UserCheck className="w-8 h-8 text-jade-600" />
    },
    {
      measure: '安全监控',
      description: '24/7安全监控和异常检测系统',
      icon: <Eye className="w-8 h-8 text-jade-600" />
    },
    {
      measure: '定期审计',
      description: '定期进行安全审计和漏洞扫描',
      icon: <Shield className="w-8 h-8 text-jade-600" />
    },
    {
      measure: '备份恢复',
      description: '多重备份机制和灾难恢复计划',
      icon: <Database className="w-8 h-8 text-jade-600" />
    },
    {
      measure: '员工培训',
      description: '定期的隐私保护和安全意识培训',
      icon: <Users className="w-8 h-8 text-jade-600" />
    }
  ];

  const sections = [
    { id: 'collection', name: '信息收集', icon: <Database className="w-4 h-4" /> },
    { id: 'usage', name: '信息使用', icon: <Settings className="w-4 h-4" /> },
    { id: 'protection', name: '信息保护', icon: <Shield className="w-4 h-4" /> },
    { id: 'cookies', name: 'Cookie政策', icon: <Cookie className="w-4 h-4" /> },
    { id: 'rights', name: '用户权利', icon: <UserCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>隐私政策 - 玉石轩</title>
        <meta name="description" content="玉石轩隐私政策，详细说明我们如何收集、使用和保护您的个人信息" />
        <meta name="keywords" content="隐私政策,个人信息保护,数据安全,Cookie政策" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">隐私政策</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">隐私政策</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们承诺保护您的隐私，本政策详细说明我们如何收集、使用和保护您的个人信息
          </p>
          <div className="mt-4 text-sm text-gray-500">
            最后更新时间：2024年1月1日 | 生效时间：2024年1月1日
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center space-x-1 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-jade-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.icon}
                <span className="ml-2 font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 信息收集 */}
        {activeSection === 'collection' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">我们收集的信息类型</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataTypes.map((data, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {data.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{data.type}</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">包含内容：</p>
                        <p className="text-gray-700 text-sm">{data.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">使用目的：</p>
                        <p className="text-jade-600 text-sm">{data.purpose}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">保存期限：</p>
                        <p className="text-gray-700 text-sm font-medium">{data.retention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">信息收集原则</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• 最小化原则：只收集必要的信息</li>
                    <li>• 透明原则：明确告知收集目的和用途</li>
                    <li>• 合法原则：基于合法理由收集信息</li>
                    <li>• 同意原则：在收集敏感信息前获得您的明确同意</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 信息使用 */}
        {activeSection === 'usage' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">信息使用方式</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">订单处理</h3>
                  <p className="text-gray-600 text-sm">处理您的订单、安排配送、提供售后服务</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">服务改善</h3>
                  <p className="text-gray-600 text-sm">分析用户行为，优化网站功能和用户体验</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">客户沟通</h3>
                  <p className="text-gray-600 text-sm">发送订单更新、促销信息和重要通知</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">安全防护</h3>
                  <p className="text-gray-600 text-sm">防范欺诈行为，保护账户和交易安全</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">个性化推荐</h3>
                  <p className="text-gray-600 text-sm">基于您的偏好提供个性化的商品推荐</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">法律合规</h3>
                  <p className="text-gray-600 text-sm">遵守法律法规要求，配合监管部门调查</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">信息共享限制</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-green-600">我们会共享的情况</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">获得您的明确同意</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">法律法规要求</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">与可信的服务提供商</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">保护用户和公众安全</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-red-600">我们不会做的事</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">出售您的个人信息</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">未经同意的营销推广</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">与不可信第三方共享</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">超出必要范围的使用</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 信息保护 */}
        {activeSection === 'protection' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">安全保护措施</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityMeasures.map((measure, index) => (
                  <div key={index} className="text-center p-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-center mb-4">
                      {measure.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{measure.measure}</h3>
                    <p className="text-gray-600 text-sm">{measure.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">数据安全承诺</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">技术保护</h4>
                      <p className="text-gray-600 text-sm">采用行业领先的加密技术和安全协议</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">人员管理</h4>
                      <p className="text-gray-600 text-sm">严格的员工背景调查和保密协议</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Eye className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">监控审计</h4>
                      <p className="text-gray-600 text-sm">持续的安全监控和定期的安全审计</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">事件响应</h4>
                      <p className="text-gray-600 text-sm">完善的安全事件响应和处理机制</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Database className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">数据备份</h4>
                      <p className="text-gray-600 text-sm">多重备份和灾难恢复保障数据安全</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">合规认证</h4>
                      <p className="text-gray-600 text-sm">通过多项国际安全和隐私认证</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cookie政策 */}
        {activeSection === 'cookies' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookie使用说明</h2>
              <div className="space-y-6">
                {cookieTypes.map((cookie, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Cookie className="w-6 h-6 text-jade-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">{cookie.name}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">保存期限: {cookie.duration}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cookie.canDisable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cookie.canDisable ? '可禁用' : '必需'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{cookie.description}</p>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">包含内容：</p>
                      <div className="flex flex-wrap gap-2">
                        {cookie.examples.map((example, exampleIndex) => (
                          <span key={exampleIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Cookie管理</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">浏览器设置</h4>
                  <p className="text-gray-600 text-sm mb-4">您可以通过浏览器设置管理Cookie：</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">阻止所有Cookie</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">仅允许第一方Cookie</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">删除现有Cookie</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">设置Cookie过期时间</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">网站设置</h4>
                  <p className="text-gray-600 text-sm mb-4">我们提供Cookie偏好设置：</p>
                  <div className="space-y-3">
                    <Button className="w-full bg-jade-600 hover:bg-jade-700 text-white">
                      管理Cookie偏好
                    </Button>
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                      查看Cookie详情
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">重要提醒</h3>
                  <p className="text-amber-700 text-sm">
                    禁用某些Cookie可能会影响网站的正常功能。必要Cookie无法禁用，因为它们对网站运行至关重要。
                    如果您选择禁用功能性或分析性Cookie，某些个性化功能可能无法正常工作。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 用户权利 */}
        {activeSection === 'rights' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">您的隐私权利</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRights.map((right, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {right.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{right.right}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{right.description}</p>
                    <div className="bg-jade-50 rounded-lg p-3">
                      <p className="text-jade-700 text-xs">
                        <strong>如何行使：</strong> {right.howTo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">权利行使流程</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">提交申请</h4>
                    <p className="text-gray-600 text-sm">通过邮件、电话或在线客服提交您的权利行使申请</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">身份验证</h4>
                    <p className="text-gray-600 text-sm">我们会验证您的身份以确保信息安全</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">处理申请</h4>
                    <p className="text-gray-600 text-sm">我们将在30天内处理您的申请并给予回复</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">结果通知</h4>
                    <p className="text-gray-600 text-sm">通过您指定的方式通知处理结果</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">特别说明</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• 某些权利的行使可能受到法律法规的限制</li>
                    <li>• 我们可能需要收取合理的费用来处理重复或过度的申请</li>
                    <li>• 删除某些信息可能影响我们为您提供服务的能力</li>
                    <li>• 如果您对我们的处理结果不满意，可以向相关监管部门投诉</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 联系我们 */}
        <div className="mt-12 bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">隐私问题咨询</h3>
          <p className="text-jade-100 mb-6">如果您对我们的隐私政策有任何疑问，请随时联系我们</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">隐私邮箱</p>
                <p className="text-jade-100 text-sm">privacy@yushixuan.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">客服热线</p>
                <p className="text-jade-100 text-sm">400-888-9999</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">工作时间</p>
                <p className="text-jade-100 text-sm">周一至周日 9:00-21:00</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact">
              <Button className="bg-white text-jade-600 hover:bg-jade-50 px-8 py-3">
                联系我们
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;