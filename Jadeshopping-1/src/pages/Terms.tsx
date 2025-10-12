import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FileText,
  Users,
  Shield,
  Copyright,
  Scale,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  Phone,
  Calendar,
  Gavel,
  UserX,
  Building,
  Globe,
  Clock,
  Settings,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ServiceTerm {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}

interface UserResponsibility {
  responsibility: string;
  description: string;
  violations: string[];
  consequences: string;
}

interface PlatformResponsibility {
  area: string;
  description: string;
  commitments: string[];
  limitations: string[];
}

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  const serviceTerms: ServiceTerm[] = [
    {
      title: '服务范围',
      description: '我们提供玉石珠宝的在线展示、销售和相关服务',
      details: [
        '商品展示和详细信息提供',
        '在线订购和商品管理',
        '物流配送和售后服务',
        '客户咨询和技术支持',
        '商品鉴定和保养指导'
      ],
      icon: <Globe className="w-6 h-6 text-jade-600" />
    },
    {
      title: '服务标准',
      description: '我们承诺提供高质量、专业的服务体验',
      details: [
        '7×24小时在线客服支持',
        '专业的商品鉴定和描述',
        '安全可靠的购物环境',
        '快速准确的物流配送',
        '完善的售后保障体系'
      ],
      icon: <Star className="w-6 h-6 text-jade-600" />
    },
    {
      title: '服务变更',
      description: '我们保留根据业务需要调整服务内容的权利',
      details: [
        '提前30天通知重大服务变更',
        '保障用户的合法权益不受损害',
        '提供合理的过渡期和替代方案',
        '用户有权选择接受或终止服务',
        '变更后的条款对所有用户生效'
      ],
      icon: <Settings className="w-6 h-6 text-jade-600" />
    }
  ];

  const userResponsibilities: UserResponsibility[] = [
    {
      responsibility: '账户安全',
      description: '用户有责任保护自己的账户安全',
      violations: ['泄露账户信息', '允许他人使用账户', '使用弱密码'],
      consequences: '账户被盗用的损失由用户承担'
    },
    {
      responsibility: '真实信息',
      description: '用户应提供真实、准确的个人信息',
      violations: ['提供虚假信息', '冒用他人身份', '恶意注册账户'],
      consequences: '账户可能被暂停或永久封禁'
    },
    {
      responsibility: '合法使用',
      description: '用户应合法合规地使用我们的服务',
      violations: ['恶意攻击网站', '传播违法信息', '干扰正常服务'],
      consequences: '承担相应的法律责任'
    },

  ];

  const platformResponsibilities: PlatformResponsibility[] = [
    {
      area: '商品质量',
      description: '我们对销售商品的质量负责',
      commitments: [
        '确保商品描述真实准确',
        '提供专业的商品鉴定',
        '承担质量问题的责任',
        '提供完善的售后服务'
      ],
      limitations: [
        '不承担用户使用不当造成的损失',
        '天然玉石的天然特征不属于质量问题',
        '超出保修期的商品损坏'
      ]
    },
    {
      area: '信息安全',
      description: '我们承诺保护用户的个人信息安全',
      commitments: [
        '采用先进的加密技术',
        '严格的信息访问控制',
        '定期的安全审计和更新',
        '及时的安全事件响应'
      ],
      limitations: [
        '不可抗力导致的信息泄露',
        '用户自身原因造成的信息泄露',
        '第三方服务商的安全问题'
      ]
    },
    {
      area: '服务可用性',
      description: '我们努力确保服务的稳定可用',
      commitments: [
        '99.5%的服务可用性保障',
        '定期的系统维护和升级',
        '快速的故障响应和修复',
        '备用系统和应急预案'
      ],
      limitations: [
        '计划内的系统维护时间',
        '不可抗力导致的服务中断',
        '第三方服务依赖的问题'
      ]
    }
  ];

  const intellectualProperty = [
    {
      type: '商标权',
      description: '"玉石轩"及相关商标为我们的注册商标',
      protection: '未经授权不得使用我们的商标标识',
      icon: <Copyright className="w-6 h-6 text-jade-600" />
    },
    {
      type: '著作权',
      description: '网站内容、图片、文字等享有著作权',
      protection: '禁止未经授权的复制、传播和商业使用',
      icon: <FileText className="w-6 h-6 text-jade-600" />
    },
    {
      type: '专利权',
      description: '我们的技术创新和商业模式受专利保护',
      protection: '禁止侵犯我们的专利权益',
      icon: <Shield className="w-6 h-6 text-jade-600" />
    },
    {
      type: '商业秘密',
      description: '商业模式、客户信息等属于商业秘密',
      protection: '严禁泄露或不当使用商业秘密',
      icon: <Lock className="w-6 h-6 text-jade-600" />
    }
  ];

  const disputeResolution = [
    {
      step: 1,
      title: '友好协商',
      description: '双方应首先通过友好协商解决争议',
      timeframe: '15个工作日',
      icon: <Users className="w-6 h-6 text-jade-600" />
    },
    {
      step: 2,
      title: '客服调解',
      description: '可申请我们的客服团队进行调解',
      timeframe: '10个工作日',
      icon: <Phone className="w-6 h-6 text-jade-600" />
    },
    {
      step: 3,
      title: '第三方仲裁',
      description: '可向相关仲裁机构申请仲裁',
      timeframe: '按仲裁规则',
      icon: <Scale className="w-6 h-6 text-jade-600" />
    },
    {
      step: 4,
      title: '司法诉讼',
      description: '可向有管辖权的人民法院提起诉讼',
      timeframe: '按法律程序',
      icon: <Gavel className="w-6 h-6 text-jade-600" />
    }
  ];

  const sections: TermsSection[] = [
    { id: 'agreement', title: '服务协议', icon: <FileText className="w-4 h-4" /> },
    { id: 'user', title: '用户责任', icon: <Users className="w-4 h-4" /> },
    { id: 'platform', title: '平台责任', icon: <Building className="w-4 h-4" /> },
    { id: 'intellectual', title: '知识产权', icon: <Copyright className="w-4 h-4" /> },
    { id: 'dispute', title: '争议解决', icon: <Scale className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>服务条款 - 玉石轩</title>
        <meta name="description" content="玉石轩服务条款，包含服务协议、用户责任、平台责任、知识产权和争议解决等内容" />
        <meta name="keywords" content="服务条款,用户协议,法律条款,知识产权,争议解决" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">服务条款</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">服务条款</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            欢迎使用玉石轩服务，请仔细阅读以下条款，使用我们的服务即表示您同意这些条款
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
                <span className="ml-2 font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 服务协议 */}
        {activeSection === 'agreement' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">服务协议条款</h2>
              <div className="space-y-6">
                {serviceTerms.map((term, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {term.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{term.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{term.description}</p>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">具体内容：</h4>
                      <div className="space-y-1">
                        {term.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-jade-600 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </div>
                        ))}
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
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">协议生效</h3>
                  <p className="text-blue-700 text-sm mb-2">
                    本服务条款自您注册账户或使用我们的服务时生效。如果您不同意这些条款，请不要使用我们的服务。
                  </p>
                  <p className="text-blue-700 text-sm">
                    我们保留随时修改这些条款的权利，修改后的条款将在网站上公布并立即生效。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 用户责任 */}
        {activeSection === 'user' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">用户责任与义务</h2>
              <div className="space-y-6">
                {userResponsibilities.map((responsibility, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <UserCheck className="w-6 h-6 text-jade-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">{responsibility.responsibility}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{responsibility.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">禁止行为：</h4>
                        <div className="space-y-1">
                          {responsibility.violations.map((violation, violationIndex) => (
                            <div key={violationIndex} className="flex items-center">
                              <UserX className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{violation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-600 mb-2">违约后果：</h4>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-amber-700 text-sm">{responsibility.consequences}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">用户行为准则</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">鼓励的行为</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">诚信交易，按时付款</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">提供真实的评价和反馈</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">合理使用客服资源</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">遵守相关法律法规</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">禁止的行为</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">恶意差评或虚假评价</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">恶意退款或拒付</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">传播违法违规信息</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">侵犯他人合法权益</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 平台责任 */}
        {activeSection === 'platform' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">平台责任与承诺</h2>
              <div className="space-y-6">
                {platformResponsibilities.map((responsibility, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Building className="w-6 h-6 text-jade-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">{responsibility.area}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{responsibility.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">我们的承诺：</h4>
                        <div className="space-y-1">
                          {responsibility.commitments.map((commitment, commitmentIndex) => (
                            <div key={commitmentIndex} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{commitment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-600 mb-2">责任限制：</h4>
                        <div className="space-y-1">
                          {responsibility.limitations.map((limitation, limitationIndex) => (
                            <div key={limitationIndex} className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">服务保障</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">质量保障</h4>
                  <p className="text-gray-600 text-sm">严格的质量控制和专业鉴定</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">及时服务</h4>
                  <p className="text-gray-600 text-sm">快速响应和高效处理</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">专业团队</h4>
                  <p className="text-gray-600 text-sm">经验丰富的专业服务团队</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 知识产权 */}
        {activeSection === 'intellectual' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">知识产权保护</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {intellectualProperty.map((property, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {property.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{property.type}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{property.description}</p>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-red-700 text-xs">
                        <strong>保护措施：</strong> {property.protection}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">侵权处理</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">发现侵权行为</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm mb-1">立即停止侵权行为</p>
                        <p className="text-gray-500 text-xs">要求侵权方立即停止相关行为</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm mb-1">发送律师函</p>
                        <p className="text-gray-500 text-xs">通过法律途径要求停止侵权</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Gavel className="w-5 h-5 text-red-500 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm mb-1">提起诉讼</p>
                        <p className="text-gray-500 text-xs">通过司法途径维护权益</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">用户举报</h4>
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm mb-3">
                      如果您发现侵犯我们知识产权的行为，请及时举报：
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-jade-600 mr-2" />
                        <span className="text-gray-700 text-sm">legal@yushixuan.com</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-jade-600 mr-2" />
                        <span className="text-gray-700 text-sm">400-888-9999</span>
                      </div>
                    </div>
                    <div className="bg-jade-50 rounded-lg p-3 mt-4">
                      <p className="text-jade-700 text-xs">
                        我们将在收到举报后24小时内进行调查处理
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 争议解决 */}
        {activeSection === 'dispute' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">争议解决机制</h2>
              <div className="space-y-6">
                {disputeResolution.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center mb-2">
                        {step.icon}
                        <h3 className="text-lg font-semibold text-gray-900 ml-2">{step.title}</h3>
                        <span className="ml-auto text-jade-600 text-sm font-medium">{step.timeframe}</span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    {index < disputeResolution.length - 1 && (
                      <div className="absolute left-6 mt-12 w-0.5 h-6 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">管辖法院</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">法律适用</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">适用中华人民共和国法律</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">排除冲突法规则的适用</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">以最新有效的法律为准</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">管辖权</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">公司所在地人民法院</span>
                    </div>
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">合同履行地人民法院</span>
                    </div>
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">双方协商确定的法院</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">争议预防</h3>
                  <p className="text-blue-700 text-sm mb-2">
                    我们建议用户在使用服务前仔细阅读相关条款，如有疑问及时咨询客服。
                  </p>
                  <p className="text-blue-700 text-sm">
                    大多数争议都可以通过友好协商解决，我们致力于为用户提供满意的解决方案。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 联系我们 */}
        <div className="mt-12 bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">法律事务咨询</h3>
          <p className="text-jade-100 mb-6">如果您对服务条款有任何疑问，请联系我们的法务团队</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">法务邮箱</p>
                <p className="text-jade-100 text-sm">legal@yushixuan.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">法务热线</p>
                <p className="text-jade-100 text-sm">400-888-9999 转 3</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">工作时间</p>
                <p className="text-jade-100 text-sm">周一至周五 9:00-18:00</p>
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

export default Terms;