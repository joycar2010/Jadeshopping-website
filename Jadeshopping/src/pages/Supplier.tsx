import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Factory, Shield, TrendingUp, Users, Award, CheckCircle, Upload, FileText, Phone, Mail, Globe } from 'lucide-react';
import Footer from '../components/Footer';

const Supplier: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    businessType: '',
    mainProducts: '',
    experience: '',
    capacity: '',
    certifications: '',
    description: ''
  });

  const requirements = [
    {
      icon: Factory,
      title: '生产能力',
      description: '具备稳定的生产能力和供货保障',
      details: [
        '年产能不低于10万件',
        '生产设备先进',
        '质量控制体系完善',
        '交货期准时率95%以上'
      ]
    },
    {
      icon: Shield,
      title: '资质认证',
      description: '拥有相关的资质证书和认证',
      details: [
        '营业执照齐全',
        'ISO质量认证',
        '产品检测报告',
        '环保资质证书'
      ]
    },
    {
      icon: Award,
      title: '品质标准',
      description: '产品品质符合我们的标准要求',
      details: [
        '原材料优质',
        '工艺精湛',
        '质量稳定',
        '符合行业标准'
      ]
    },
    {
      icon: Users,
      title: '服务能力',
      description: '具备良好的服务意识和能力',
      details: [
        '响应及时',
        '沟通顺畅',
        '售后完善',
        '合作诚信'
      ]
    }
  ];

  const cooperationTypes = [
    {
      type: '原材料供应商',
      description: '提供优质的玉石原材料',
      requirements: [
        '拥有稳定的原材料来源',
        '材料品质优良',
        '价格合理',
        '供货及时'
      ],
      benefits: [
        '长期合作保障',
        '优先采购权',
        '价格优势',
        '技术支持'
      ]
    },
    {
      type: '加工制造商',
      description: '承接玉石产品的加工制造',
      requirements: [
        '先进的加工设备',
        '熟练的技术工人',
        '严格的质量控制',
        '按时交货能力'
      ],
      benefits: [
        '稳定的订单量',
        '技术培训支持',
        '质量改进指导',
        '长期合作关系'
      ]
    },
    {
      type: '设计服务商',
      description: '提供产品设计和创意服务',
      requirements: [
        '专业设计团队',
        '丰富设计经验',
        '创新设计理念',
        '市场敏感度高'
      ],
      benefits: [
        '设计费用保障',
        '版权保护',
        '市场推广支持',
        '品牌合作机会'
      ]
    }
  ];

  const cooperationProcess = [
    {
      step: '01',
      title: '提交申请',
      description: '填写供应商入驻申请表',
      details: '提供公司基本信息、产品介绍、资质证书等材料'
    },
    {
      step: '02',
      title: '资格审核',
      description: '我们对申请材料进行审核',
      details: '审核公司资质、生产能力、产品质量等方面'
    },
    {
      step: '03',
      title: '实地考察',
      description: '安排专业团队实地考察',
      details: '考察生产环境、设备状况、管理水平等'
    },
    {
      step: '04',
      title: '样品测试',
      description: '对产品样品进行测试评估',
      details: '检测产品质量、工艺水平、符合度等'
    },
    {
      step: '05',
      title: '商务谈判',
      description: '就合作条件进行商务谈判',
      details: '确定价格、交期、质量标准、服务要求等'
    },
    {
      step: '06',
      title: '签署协议',
      description: '签署正式的供应商合作协议',
      details: '明确双方权利义务，建立长期合作关系'
    }
  ];

  const benefits = [
    {
      title: '稳定订单',
      description: '提供稳定的订单量，保障供应商收益',
      icon: TrendingUp
    },
    {
      title: '及时付款',
      description: '按约定及时付款，保障资金流',
      icon: CheckCircle
    },
    {
      title: '技术支持',
      description: '提供技术指导和培训支持',
      icon: Award
    },
    {
      title: '品牌合作',
      description: '共享品牌价值，提升市场影响力',
      icon: Shield
    },
    {
      title: '长期合作',
      description: '建立长期稳定的合作关系',
      icon: Users
    },
    {
      title: '市场信息',
      description: '分享市场信息和发展趋势',
      icon: Globe
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('供应商申请提交:', formData);
    alert('感谢您的申请！我们会在3个工作日内与您联系。');
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      {/* 面包屑导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              首页
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">供应商入驻</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            供应商入驻
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们诚邀优质供应商加入我们的合作伙伴网络，共同为客户提供最优质的玉石产品和服务
          </p>
        </div>

        {/* 入驻要求 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            入驻要求
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requirements.map((requirement, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <requirement.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {requirement.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {requirement.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {requirement.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 合作类型 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            合作类型
          </h2>
          <div className="space-y-8">
            {cooperationTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {type.type}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {type.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      入驻要求
                    </h4>
                    <div className="space-y-3">
                      {type.requirements.map((req, reqIndex) => (
                        <div key={reqIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      合作优势
                    </h4>
                    <div className="space-y-3">
                      {type.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 合作流程 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            合作流程
          </h2>
          <div className="space-y-8">
            {cooperationProcess.map((process, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6 flex-shrink-0">
                    {process.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {process.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {process.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {process.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 合作优势 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            合作优势
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 申请表单 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            供应商入驻申请
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      公司名称 *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入公司全称"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                      联系人 *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入联系人姓名"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      联系电话 *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入联系电话"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入邮箱地址"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      公司网站
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入公司网站地址"
                    />
                  </div>
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                      业务类型 *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择业务类型</option>
                      <option value="原材料供应">原材料供应</option>
                      <option value="加工制造">加工制造</option>
                      <option value="设计服务">设计服务</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    公司地址 *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入详细地址"
                  />
                </div>

                <div>
                  <label htmlFor="mainProducts" className="block text-sm font-medium text-gray-700 mb-2">
                    主要产品 *
                  </label>
                  <textarea
                    id="mainProducts"
                    name="mainProducts"
                    required
                    rows={3}
                    value={formData.mainProducts}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请详细描述您的主要产品和服务"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      行业经验
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="1-3年">1-3年</option>
                      <option value="3-5年">3-5年</option>
                      <option value="5-10年">5-10年</option>
                      <option value="10年以上">10年以上</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                      年产能
                    </label>
                    <input
                      type="text"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入年产能"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2">
                    资质证书
                  </label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    rows={2}
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请列出您拥有的相关资质证书"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    公司简介
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请简要介绍您的公司情况、优势特色等"
                  ></textarea>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    附件上传
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>请准备以下材料（可后续补充）：</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>营业执照副本</li>
                      <li>税务登记证</li>
                      <li>组织机构代码证</li>
                      <li>产品质量检测报告</li>
                      <li>ISO质量认证证书</li>
                      <li>公司宣传册或产品目录</li>
                    </ul>
                    <p className="text-primary-600 font-medium">
                      注：材料可发送至邮箱 supplier@jadeyayun.com
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn-primary px-12 py-4 text-lg"
                  >
                    提交申请
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    提交申请后，我们会在3个工作日内与您联系
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            联系我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                采购热线
              </h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">
                400-777-8888
              </p>
              <p className="text-gray-600 mb-4">
                工作时间：9:00-18:00
              </p>
              <a
                href="tel:400-777-8888"
                className="btn-primary"
              >
                立即拨打
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                采购邮箱
              </h3>
              <p className="text-lg text-secondary-600 mb-2">
                supplier@jadeyayun.com
              </p>
              <p className="text-gray-600 mb-4">
                24小时内回复
              </p>
              <a
                href="mailto:supplier@jadeyayun.com"
                className="btn-secondary"
              >
                发送邮件
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                资料下载
              </h3>
              <p className="text-lg text-green-600 mb-2">
                供应商手册
              </p>
              <p className="text-gray-600 mb-4">
                详细合作指南
              </p>
              <button className="btn-outline">
                下载资料
              </button>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            常见问题
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 成为供应商需要什么条件？
              </h3>
              <p className="text-gray-600">
                A: 需要具备合法的经营资质、稳定的生产能力、良好的产品质量、
                完善的质量管理体系，以及诚信的合作态度。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 合作的付款方式是什么？
              </h3>
              <p className="text-gray-600">
                A: 我们支持多种付款方式，包括银行转账、承兑汇票等。
                具体付款周期和方式会在合同中明确约定。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 如何保证订单的稳定性？
              </h3>
              <p className="text-gray-600">
                A: 我们会根据市场需求和供应商能力制定年度采购计划，
                并与优质供应商签署长期合作协议，确保订单稳定。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 对产品质量有什么要求？
              </h3>
              <p className="text-gray-600">
                A: 我们有严格的质量标准和检测流程，所有产品都需要通过质量检测。
                我们也会提供质量改进建议，帮助供应商提升产品质量。
              </p>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            携手共赢，共创未来
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            玉石雅韵致力于与优质供应商建立长期稳定的合作关系，
            共同为客户提供最优质的产品和服务。期待与您的合作！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:400-777-8888"
              className="btn-primary px-8 py-4 text-lg"
            >
              立即咨询
            </a>
            <a
              href="mailto:supplier@jadeyayun.com"
              className="btn-secondary px-8 py-4 text-lg"
            >
              发送邮件
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Supplier;