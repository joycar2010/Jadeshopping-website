import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Camera, Video, Newspaper, Users, Award, CheckCircle, Download, Phone, Mail, Globe } from 'lucide-react';
import Footer from '../components/Footer';
import { validateText, DEFAULT_TEXT_MAX } from '../utils/validation';

const Media: React.FC = () => {
  const [formData, setFormData] = useState({
    mediaType: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    cooperationType: '',
    projectDescription: '',
    timeline: '',
    budget: '',
    requirements: '',
    message: ''
  });

  const cooperationTypes = [
    {
      type: '品牌宣传合作',
      description: '共同打造品牌形象，提升品牌知名度',
      icon: Award,
      services: [
        '品牌故事策划',
        '形象宣传片制作',
        '广告创意设计',
        '媒体发布推广',
        '品牌活动策划'
      ],
      benefits: [
        '提升品牌影响力',
        '扩大市场知名度',
        '增强品牌价值',
        '建立品牌形象',
        '获得媒体曝光'
      ]
    },
    {
      type: '内容创作合作',
      description: '专业内容创作，传播玉石文化',
      icon: Camera,
      services: [
        '产品摄影服务',
        '视频内容制作',
        '文案策划撰写',
        '图文内容创作',
        '直播内容策划'
      ],
      benefits: [
        '专业内容质量',
        '多平台分发',
        '精准用户触达',
        '提升转化率',
        '建立内容矩阵'
      ]
    },
    {
      type: '活动推广合作',
      description: '联合举办活动，扩大品牌影响',
      icon: Users,
      services: [
        '活动策划执行',
        '媒体邀请协调',
        '现场直播服务',
        '新闻稿撰写',
        '后期宣传推广'
      ],
      benefits: [
        '活动影响力放大',
        '媒体关注度提升',
        '用户参与度增加',
        '品牌曝光最大化',
        '口碑传播效应'
      ]
    },
    {
      type: '新闻报道合作',
      description: '权威媒体报道，建立行业地位',
      icon: Newspaper,
      services: [
        '新闻价值挖掘',
        '专访内容策划',
        '权威媒体发布',
        '行业报告撰写',
        '舆情监测管理'
      ],
      benefits: [
        '权威性背书',
        '行业地位提升',
        '公信力增强',
        '专业形象塑造',
        '长期价值积累'
      ]
    }
  ];

  const mediaPartners = [
    {
      category: '传统媒体',
      partners: [
        '中央电视台',
        '人民日报',
        '新华社',
        '光明日报',
        '经济日报',
        '中国日报'
      ]
    },
    {
      category: '网络媒体',
      partners: [
        '新浪网',
        '搜狐网',
        '网易新闻',
        '腾讯新闻',
        '今日头条',
        '百度百家'
      ]
    },
    {
      category: '行业媒体',
      partners: [
        '珠宝时尚',
        '中国珠宝',
        '玉器杂志',
        '收藏界',
        '艺术品鉴',
        '文玩天下'
      ]
    },
    {
      category: '新媒体平台',
      partners: [
        '微信公众号',
        '微博',
        '抖音',
        '快手',
        '小红书',
        'B站'
      ]
    }
  ];

  const successCases = [
    {
      title: '央视《匠心传承》专题报道',
      description: '与央视合作制作玉石文化传承专题片，展现传统工艺之美',
      results: [
        '全国观众超过5000万',
        '品牌知名度提升300%',
        '销售额增长150%',
        '获得行业权威认可'
      ],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=CCTV%20documentary%20filming%20jade%20craftsmanship%20traditional%20Chinese%20culture&image_size=landscape_4_3'
    },
    {
      title: '人民日报文化版面专访',
      description: '人民日报深度专访，探讨玉石文化在新时代的传承与发展',
      results: [
        '权威媒体背书',
        '行业地位确立',
        '政府关注度提升',
        '文化价值认可'
      ],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=newspaper%20interview%20jade%20culture%20expert%20traditional%20Chinese%20art&image_size=landscape_4_3'
    },
    {
      title: '抖音玉石文化系列短视频',
      description: '与头部MCN机构合作，制作玉石文化科普系列短视频',
      results: [
        '总播放量超过1亿',
        '粉丝增长500万',
        '年轻用户占比70%',
        '品牌年轻化成功'
      ],
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80&fm=webp'
    }
  ];

  const cooperationProcess = [
    {
      step: '01',
      title: '需求沟通',
      description: '深入了解合作需求和目标',
      details: '确定合作类型、预算范围、时间节点等关键信息'
    },
    {
      step: '02',
      title: '方案策划',
      description: '制定详细的合作方案',
      details: '包括创意策划、执行计划、预期效果等'
    },
    {
      step: '03',
      title: '合同签署',
      description: '确定合作条款，签署正式合同',
      details: '明确双方权利义务、付款方式、交付标准等'
    },
    {
      step: '04',
      title: '项目执行',
      description: '按计划执行合作项目',
      details: '专业团队负责项目实施，确保质量和进度'
    },
    {
      step: '05',
      title: '效果监测',
      description: '实时监测项目效果',
      details: '数据分析、效果评估、优化调整'
    },
    {
      step: '06',
      title: '总结优化',
      description: '项目总结和后续优化',
      details: '效果报告、经验总结、长期合作规划'
    }
  ];

  const mediaResources = [
    {
      title: '品牌资料包',
      description: '包含品牌介绍、产品图片、LOGO等',
      size: '25MB',
      format: 'ZIP',
      icon: Download
    },
    {
      title: '高清产品图库',
      description: '精美的产品摄影作品集',
      size: '150MB',
      format: 'JPG/PNG',
      icon: Camera
    },
    {
      title: '企业宣传视频',
      description: '公司形象宣传片和产品介绍视频',
      size: '500MB',
      format: 'MP4',
      icon: Video
    },
    {
      title: '新闻稿模板',
      description: '标准新闻稿格式和内容模板',
      size: '2MB',
      format: 'DOC',
      icon: Newspaper
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
    // 邮箱字段移除格式校验，保留必填与长度限制
    const emailError = validateText(formData.email, { required: true, min: 1, max: DEFAULT_TEXT_MAX });
    if (emailError) {
      alert(`邮箱字段错误：${emailError}`);
      return;
    }
    console.log('媒体合作申请提交:', formData);
    alert('感谢您的申请！我们会在24小时内与您联系。');
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
            <span className="text-gray-900">媒体合作</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            媒体合作
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guaranteed antiques 诚邀各大媒体平台、内容创作者、营销机构等合作伙伴，共同传播玉石文化，创造更大价值
          </p>
        </div>

        {/* 合作类型 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            合作类型
          </h2>
          <div className="space-y-8">
            {cooperationTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <type.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {type.type}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      服务内容
                    </h4>
                    <div className="space-y-3">
                      {type.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600">{service}</span>
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

        {/* 媒体合作伙伴 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            媒体合作伙伴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mediaPartners.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.partners.map((partner, partnerIndex) => (
                    <div key={partnerIndex} className="text-center">
                      <div className="bg-gray-50 rounded-lg py-3 px-4 hover:bg-primary-50 transition-colors">
                        <span className="text-gray-700 font-medium">{partner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 成功案例 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            成功案例
          </h2>
          <div className="space-y-12">
            {successCases.map((case_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {case_.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {case_.description}
                    </p>
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        合作成果：
                      </h4>
                      {case_.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-64 lg:h-auto">
                    <img
                      src={case_.image}
                      alt={case_.title}
                      className="w-full h-full object-cover"
                    />
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

        {/* 媒体资源下载 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            媒体资源下载
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mediaResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <resource.icon className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>大小: {resource.size}</span>
                  <span>格式: {resource.format}</span>
                </div>
                <button className="btn-primary w-full">
                  <Download className="h-4 w-4 mr-2" />
                  下载资源
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              更多媒体资源请联系我们获取
            </p>
            <a
              href="mailto:media@jadeyayun.com"
              className="btn-secondary"
            >
              联系获取更多资源
            </a>
          </div>
        </div>

        {/* 合作申请表单 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            合作申请
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
                      媒体类型 *
                    </label>
                    <select
                      id="mediaType"
                      name="mediaType"
                      required
                      value={formData.mediaType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="传统媒体">传统媒体</option>
                      <option value="网络媒体">网络媒体</option>
                      <option value="行业媒体">行业媒体</option>
                      <option value="新媒体平台">新媒体平台</option>
                      <option value="内容创作者">内容创作者</option>
                      <option value="营销机构">营销机构</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cooperationType" className="block text-sm font-medium text-gray-700 mb-2">
                      合作类型 *
                    </label>
                    <select
                      id="cooperationType"
                      name="cooperationType"
                      required
                      value={formData.cooperationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="品牌宣传合作">品牌宣传合作</option>
                      <option value="内容创作合作">内容创作合作</option>
                      <option value="活动推广合作">活动推广合作</option>
                      <option value="新闻报道合作">新闻报道合作</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      机构名称 *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入机构名称"
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
                      type="text"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      maxLength={DEFAULT_TEXT_MAX}
                      placeholder="请输入邮箱地址"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      官方网站
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入官方网站地址"
                    />
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      项目时间
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="1个月内">1个月内</option>
                      <option value="1-3个月">1-3个月</option>
                      <option value="3-6个月">3-6个月</option>
                      <option value="6个月以上">6个月以上</option>
                      <option value="长期合作">长期合作</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      预算范围
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="10万以下">10万以下</option>
                      <option value="10-30万">10-30万</option>
                      <option value="30-50万">30-50万</option>
                      <option value="50-100万">50-100万</option>
                      <option value="100万以上">100万以上</option>
                      <option value="面议">面议</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    项目描述 *
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    required
                    rows={4}
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请详细描述您的合作项目和目标"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    具体需求
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请说明您的具体需求和期望"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    补充说明
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="其他需要说明的信息"
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn-primary px-12 py-4 text-lg"
                  >
                    提交申请
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    提交申请后，我们会在24小时内与您联系
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
                媒体热线
              </h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">
                400-555-8888
              </p>
              <p className="text-gray-600 mb-4">
                工作时间：9:00-18:00
              </p>
              <a
                href="tel:400-555-8888"
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
                媒体邮箱
              </h3>
              <p className="text-lg text-secondary-600 mb-2">
                media@jadeyayun.com
              </p>
              <p className="text-gray-600 mb-4">
                24小时内回复
              </p>
              <a
                href="mailto:media@jadeyayun.com"
                className="btn-secondary"
              >
                发送邮件
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                媒体中心
              </h3>
              <p className="text-lg text-green-600 mb-2">
                在线媒体资源
              </p>
              <p className="text-gray-600 mb-4">
                新闻稿、图片、视频
              </p>
              <button className="btn-outline">
                访问媒体中心
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
                Q: 如何申请媒体合作？
              </h3>
              <p className="text-gray-600">
                A: 您可以通过填写在线申请表单、发送邮件或直接致电我们的媒体热线。
                我们会在24小时内回复您的合作申请。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 媒体合作的费用如何确定？
              </h3>
              <p className="text-gray-600">
                A: 合作费用根据项目类型、规模、时间周期等因素确定。
                我们会根据您的具体需求提供详细的报价方案。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 是否提供媒体资源包？
              </h3>
              <p className="text-gray-600">
                A: 是的，我们为合作媒体提供完整的资源包，包括品牌介绍、
                高清图片、视频素材、新闻稿模板等。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 合作项目的执行周期是多长？
              </h3>
              <p className="text-gray-600">
                A: 执行周期根据项目复杂度而定，一般从1个月到6个月不等。
                我们也支持长期合作关系的建立。
              </p>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            携手传播玉石文化，共创美好未来
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Guaranteed antiques 期待与更多优秀的媒体伙伴合作，
            共同传播中华玉石文化，让更多人了解和喜爱玉石艺术。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:400-555-8888"
              className="btn-primary px-8 py-4 text-lg"
            >
              立即咨询
            </a>
            <a
              href="mailto:media@jadeyayun.com"
              className="btn-secondary px-8 py-4 text-lg"
            >
              发送合作邮件
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Media;