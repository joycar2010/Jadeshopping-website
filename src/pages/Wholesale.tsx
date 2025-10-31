import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, TrendingUp, Shield, Users, Award, CheckCircle, Calculator, Phone, Mail, MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';
import { validateText, DEFAULT_TEXT_MAX } from '../utils/validation';

const Wholesale: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessType: '',
    annualVolume: '',
    targetProducts: '',
    region: '',
    experience: '',
    message: ''
  });

  const [priceCalculator, setPriceCalculator] = useState({
    category: '',
    quantity: '',
    grade: ''
  });

  const advantages = [
    {
      icon: Package,
      title: '丰富产品线',
      description: '涵盖各类玉石产品，满足不同市场需求',
      details: [
        '和田玉系列',
        '翡翠系列',
        '玛瑙系列',
        '水晶系列',
        '定制产品'
      ]
    },
    {
      icon: TrendingUp,
      title: '价格优势',
      description: '厂家直供，批发价格更具竞争力',
      details: [
        '无中间商差价',
        '量大价优',
        '阶梯定价',
        '季度返利',
        '年度奖励'
      ]
    },
    {
      icon: Shield,
      title: '品质保证',
      description: '严格质检，确保每件产品品质',
      details: [
        '专业鉴定',
        '质量追溯',
        '退换保障',
        '品质承诺',
        '售后服务'
      ]
    },
    {
      icon: Users,
      title: '专业服务',
      description: '专业团队提供全方位服务支持',
      details: [
        '专属客服',
        '技术支持',
        '市场分析',
        '培训指导',
        '营销支持'
      ]
    }
  ];

  const cooperationTypes = [
    {
      type: '区域代理',
      description: '获得指定区域的独家代理权',
      requirements: [
        '具备一定的资金实力',
        '拥有销售渠道和团队',
        '有玉石行业经验',
        '年销售额不低于500万'
      ],
      benefits: [
        '独家区域保护',
        '最优价格政策',
        '营销支持',
        '培训服务',
        '返利奖励'
      ],
      minOrder: '首批进货不低于50万元'
    },
    {
      type: '经销商',
      description: '成为我们的产品经销商',
      requirements: [
        '有实体店铺或网店',
        '具备销售能力',
        '认同品牌理念',
        '年销售额不低于100万'
      ],
      benefits: [
        '灵活进货',
        '价格优势',
        '产品培训',
        '营销物料',
        '技术支持'
      ],
      minOrder: '首批进货不低于10万元'
    },
    {
      type: '批发客户',
      description: '大宗采购批发合作',
      requirements: [
        '单次采购量较大',
        '有稳定销售渠道',
        '资金实力良好',
        '信誉良好'
      ],
      benefits: [
        '批发价格',
        '快速发货',
        '质量保证',
        '售后服务',
        '定制服务'
      ],
      minOrder: '单次采购不低于5万元'
    }
  ];

  const priceRanges = [
    {
      category: '和田玉',
      grades: [
        { grade: '普通级', price: '200-500元/件', description: '适合大众市场' },
        { grade: '精品级', price: '500-2000元/件', description: '品质优良，性价比高' },
        { grade: '收藏级', price: '2000-10000元/件', description: '高端收藏品质' }
      ]
    },
    {
      category: '翡翠',
      grades: [
        { grade: '普通级', price: '300-800元/件', description: '入门级产品' },
        { grade: '精品级', price: '800-3000元/件', description: '中高端市场' },
        { grade: '收藏级', price: '3000-20000元/件', description: '顶级收藏品' }
      ]
    },
    {
      category: '玛瑙',
      grades: [
        { grade: '普通级', price: '50-200元/件', description: '大众消费' },
        { grade: '精品级', price: '200-800元/件', description: '精美工艺' },
        { grade: '收藏级', price: '800-3000元/件', description: '稀有品种' }
      ]
    }
  ];

  const supportServices = [
    {
      title: '产品培训',
      description: '提供专业的产品知识培训',
      icon: Award,
      details: [
        '玉石知识培训',
        '销售技巧指导',
        '市场分析培训',
        '客户服务培训'
      ]
    },
    {
      title: '营销支持',
      description: '全方位的营销推广支持',
      icon: TrendingUp,
      details: [
        '营销物料提供',
        '广告素材设计',
        '促销活动策划',
        '品牌宣传支持'
      ]
    },
    {
      title: '技术支持',
      description: '专业的技术服务支持',
      icon: Shield,
      details: [
        '产品鉴定指导',
        '保养知识培训',
        '质量问题处理',
        '技术咨询服务'
      ]
    },
    {
      title: '物流配送',
      description: '高效安全的物流服务',
      icon: Package,
      details: [
        '全国配送网络',
        '安全包装保护',
        '快速发货处理',
        '物流跟踪服务'
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculatorChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceCalculator(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 邮箱字段：移除邮箱格式校验，仅保留必填与长度限制
    const emailError = validateText(formData.email, { required: true, min: 1, max: DEFAULT_TEXT_MAX });
    if (emailError) {
      alert(`邮箱字段错误：${emailError}`);
      return;
    }
    console.log('批发合作申请提交:', formData);
    alert('感谢您的申请！我们会在24小时内与您联系。');
  };

  const calculatePrice = () => {
    if (!priceCalculator.category || !priceCalculator.quantity || !priceCalculator.grade) {
      alert('请填写完整信息');
      return;
    }
    
    // 这里可以实现价格计算逻辑
    alert('价格计算功能开发中，请联系客服获取准确报价');
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
            <span className="text-gray-900">批发合作</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            批发合作
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guaranteed antiques 诚邀各地经销商、代理商加入我们的合作伙伴网络，共享玉石文化传承的商业价值
          </p>
        </div>

        {/* 合作优势 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            合作优势
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {advantage.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {advantage.details.map((detail, detailIndex) => (
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
                  <div className="mt-4 inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
                    {type.minOrder}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      合作要求
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

        {/* 价格体系 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            价格体系
          </h2>
          <div className="space-y-8">
            {priceRanges.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.grades.map((grade, gradeIndex) => (
                    <div key={gradeIndex} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {grade.grade}
                        </h4>
                        <div className="text-2xl font-bold text-primary-600 mb-3">
                          {grade.price}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {grade.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              * 以上价格为参考价格，实际价格根据具体产品、数量和合作级别确定
            </p>
            <p className="text-primary-600 font-medium">
              批量采购享受更多优惠，详情请咨询客服
            </p>
          </div>
        </div>

        {/* 价格计算器 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            价格计算器
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <Calculator className="h-8 w-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  快速获取批发报价
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    产品类别
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={priceCalculator.category}
                    onChange={handleCalculatorChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="和田玉">和田玉</option>
                    <option value="翡翠">翡翠</option>
                    <option value="玛瑙">玛瑙</option>
                    <option value="水晶">水晶</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                    产品等级
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={priceCalculator.grade}
                    onChange={handleCalculatorChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="普通级">普通级</option>
                    <option value="精品级">精品级</option>
                    <option value="收藏级">收藏级</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    采购数量
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={priceCalculator.quantity}
                    onChange={handleCalculatorChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入数量"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={calculatePrice}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  计算价格
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  计算结果仅供参考，准确报价请联系客服
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 支持服务 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            支持服务
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-secondary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {service.details.map((detail, detailIndex) => (
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
                      placeholder="请输入公司名称"
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
                      <option value="">请选择</option>
                      <option value="区域代理">区域代理</option>
                      <option value="经销商">经销商</option>
                      <option value="批发客户">批发客户</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                      所在地区
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入所在地区"
                    />
                  </div>
                  <div>
                    <label htmlFor="annualVolume" className="block text-sm font-medium text-gray-700 mb-2">
                      预期年采购量
                    </label>
                    <select
                      id="annualVolume"
                      name="annualVolume"
                      value={formData.annualVolume}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="50万以下">50万以下</option>
                      <option value="50-100万">50-100万</option>
                      <option value="100-300万">100-300万</option>
                      <option value="300-500万">300-500万</option>
                      <option value="500万以上">500万以上</option>
                    </select>
                  </div>
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
                      <option value="1年以下">1年以下</option>
                      <option value="1-3年">1-3年</option>
                      <option value="3-5年">3-5年</option>
                      <option value="5-10年">5-10年</option>
                      <option value="10年以上">10年以上</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="targetProducts" className="block text-sm font-medium text-gray-700 mb-2">
                    目标产品类别
                  </label>
                  <textarea
                    id="targetProducts"
                    name="targetProducts"
                    rows={3}
                    value={formData.targetProducts}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请描述您感兴趣的产品类别"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    补充说明
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请简要介绍您的公司情况、销售渠道、合作意向等"
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
                批发热线
              </h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">
                400-666-8888
              </p>
              <p className="text-gray-600 mb-4">
                工作时间：9:00-18:00
              </p>
              <a
                href="tel:400-666-8888"
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
                批发邮箱
              </h3>
              <p className="text-lg text-secondary-600 mb-2">
                wholesale@jadeyayun.com
              </p>
              <p className="text-gray-600 mb-4">
                24小时内回复
              </p>
              <a
                href="mailto:wholesale@jadeyayun.com"
                className="btn-secondary"
              >
                发送邮件
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                在线客服
              </h3>
              <p className="text-lg text-green-600 mb-2">
                微信客服
              </p>
              <p className="text-gray-600 mb-4">
                扫码添加客服
              </p>
              <button className="btn-outline">
                联系客服
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
                Q: 批发的最低起订量是多少？
              </h3>
              <p className="text-gray-600">
                A: 不同合作类型的起订量不同：批发客户单次采购不低于5万元，
                经销商首批进货不低于10万元，区域代理首批进货不低于50万元。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 批发价格如何确定？
              </h3>
              <p className="text-gray-600">
                A: 批发价格根据产品类别、等级、采购数量和合作级别确定。
                数量越大，价格越优惠。具体价格请联系客服获取报价单。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 是否提供区域保护政策？
              </h3>
              <p className="text-gray-600">
                A: 对于区域代理商，我们提供独家区域保护政策，
                确保代理商在指定区域内的独家经营权。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 如何保证产品质量？
              </h3>
              <p className="text-gray-600">
                A: 我们有严格的质量控制体系，每件产品都经过专业鉴定。
                如有质量问题，支持7天无理由退换货。
              </p>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            携手共赢，共创辉煌
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Guaranteed antiques 期待与您建立长期稳定的合作关系，
            共同开拓玉石市场，分享行业发展红利。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:400-666-8888"
              className="btn-primary px-8 py-4 text-lg"
            >
              立即咨询
            </a>
            <a
              href="mailto:wholesale@jadeyayun.com"
              className="btn-secondary px-8 py-4 text-lg"
            >
              获取报价
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wholesale;