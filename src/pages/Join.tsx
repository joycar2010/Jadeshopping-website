import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, TrendingUp, Award, Shield, Star, MapPin, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { validateText, DEFAULT_TEXT_MAX } from '../utils/validation';

const Join: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    city: '',
    experience: '',
    investment: '',
    message: ''
  });

  const advantages = [
    {
      icon: Award,
      title: '品牌优势',
      description: '知名玉石品牌，市场认知度高',
      details: [
        '20年品牌历史',
        '全国知名度',
        '优质口碑',
        '专业团队'
      ]
    },
    {
      icon: TrendingUp,
      title: '市场前景',
      description: '玉石市场持续增长，前景广阔',
      details: [
        '市场需求旺盛',
        '消费升级趋势',
        '文化价值认同',
        '投资收藏热潮'
      ]
    },
    {
      icon: Shield,
      title: '政策支持',
      description: '完善的加盟政策和运营支持',
      details: [
        '区域保护政策',
        '价格保护体系',
        '退换货保障',
        '营销支持'
      ]
    },
    {
      icon: Users,
      title: '培训体系',
      description: '专业的培训和持续的运营指导',
      details: [
        '产品知识培训',
        '销售技巧指导',
        '店面管理培训',
        '持续运营支持'
      ]
    }
  ];

  const joinTypes = [
    {
      type: '旗舰店',
      investment: '50-100万',
      area: '200-500㎡',
      location: '核心商圈',
      support: '全方位支持',
      features: [
        '品牌形象店面设计',
        '全系列产品展示',
        '专业销售团队',
        'VIP客户服务',
        '定制服务支持'
      ]
    },
    {
      type: '标准店',
      investment: '20-50万',
      area: '100-200㎡',
      location: '商业街区',
      support: '标准化支持',
      features: [
        '标准店面设计',
        '主要产品线',
        '销售培训',
        '营销支持',
        '库存管理'
      ]
    },
    {
      type: '精品店',
      investment: '10-20万',
      area: '50-100㎡',
      location: '社区商圈',
      support: '基础支持',
      features: [
        '精简店面设计',
        '精选产品',
        '基础培训',
        '促销支持',
        '灵活经营'
      ]
    }
  ];

  const supportServices = [
    {
      title: '选址支持',
      description: '专业团队协助选址评估',
      icon: MapPin
    },
    {
      title: '装修支持',
      description: '统一VI设计，装修指导',
      icon: Award
    },
    {
      title: '培训支持',
      description: '全面的产品和销售培训',
      icon: Users
    },
    {
      title: '营销支持',
      description: '品牌推广和营销活动支持',
      icon: TrendingUp
    },
    {
      title: '供货支持',
      description: '稳定的货源和物流配送',
      icon: Shield
    },
    {
      title: '运营支持',
      description: '持续的运营指导和管理支持',
      icon: Star
    }
  ];

  const joinProcess = [
    {
      step: '01',
      title: '咨询了解',
      description: '了解加盟政策和要求'
    },
    {
      step: '02',
      title: '提交申请',
      description: '填写加盟申请表'
    },
    {
      step: '03',
      title: '资格审核',
      description: '总部审核加盟资格'
    },
    {
      step: '04',
      title: '实地考察',
      description: '到总部实地考察'
    },
    {
      step: '05',
      title: '签订合同',
      description: '签署加盟合作协议'
    },
    {
      step: '06',
      title: '店面筹备',
      description: '选址装修和人员培训'
    },
    {
      step: '07',
      title: '开业运营',
      description: '正式开业和运营支持'
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
    // 邮箱字段：移除邮箱格式校验，仅保留长度限制
    const emailError = validateText(formData.email, { max: DEFAULT_TEXT_MAX });
    if (emailError) {
      alert(`邮箱字段错误：${emailError}`);
      return;
    }
    // 这里处理表单提交逻辑
    console.log('加盟申请提交:', formData);
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
            <span className="text-gray-900">招商加盟</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            招商加盟
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            携手 Guaranteed antiques，共创财富未来。我们诚邀有志之士加入我们的大家庭，共同开拓玉石市场
          </p>
        </div>

        {/* 品牌优势 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            品牌优势
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

        {/* 加盟类型 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            加盟类型
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {joinTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">{type.type}</h3>
                  <p className="text-primary-100">投资金额：{type.investment}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">店面面积</p>
                      <p className="font-semibold text-gray-900">{type.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">选址要求</p>
                      <p className="font-semibold text-gray-900">{type.location}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">支持政策</p>
                    <p className="font-semibold text-primary-600">{type.support}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 mb-3">特色服务：</p>
                    {type.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 支持服务 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            全方位支持服务
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 加盟流程 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            加盟流程
          </h2>
          <div className="relative">
            {/* 连接线 */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-8">
              {joinProcess.map((process, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {process.description}
                  </p>
                  {index < joinProcess.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-6 w-6 text-primary-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 成功案例 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            成功案例
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((caseNum) => (
              <div key={caseNum} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20jade%20jewelry%20store%20interior%20elegant%20display&image_size=landscape_4_3`}
                  alt="成功案例"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    北京王府井旗舰店
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    开业两年来，月均营业额超过50万元，成为当地知名的玉石专卖店。
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-600 font-medium">加盟商：李先生</span>
                    <span className="text-gray-500">2022年开业</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 加盟申请表单 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            立即申请加盟
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入您的姓名"
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
                      placeholder="请输入您的联系电话"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      maxLength={DEFAULT_TEXT_MAX}
                      placeholder="请输入您的邮箱地址"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      公司名称
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入您的公司名称"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      意向城市 *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入意向开店城市"
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      相关经验
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="无经验">无相关经验</option>
                      <option value="零售经验">有零售经验</option>
                      <option value="珠宝经验">有珠宝行业经验</option>
                      <option value="玉石经验">有玉石行业经验</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-2">
                      投资预算 *
                    </label>
                    <select
                      id="investment"
                      name="investment"
                      required
                      value={formData.investment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">请选择投资预算</option>
                      <option value="10-20万">10-20万</option>
                      <option value="20-50万">20-50万</option>
                      <option value="50-100万">50-100万</option>
                      <option value="100万以上">100万以上</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    留言备注
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请描述您的加盟意向、店面情况或其他需要说明的信息"
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
                招商热线
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
                招商邮箱
              </h3>
              <p className="text-lg text-secondary-600 mb-2">
                join@jadeyayun.com
              </p>
              <p className="text-gray-600 mb-4">
                24小时内回复
              </p>
              <a
                href="mailto:join@jadeyayun.com"
                className="btn-secondary"
              >
                发送邮件
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                总部地址
              </h3>
              <p className="text-lg text-green-600 mb-2">
                北京市朝阳区
              </p>
              <p className="text-gray-600 mb-4">
                欢迎实地考察
              </p>
              <Link
                to="/contact"
                className="btn-outline"
              >
                查看详情
              </Link>
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
                Q: 加盟需要什么条件？
              </h3>
              <p className="text-gray-600">
                A: 需要有一定的资金实力、合适的店面位置、认同品牌理念，
                并具备一定的经营管理能力。具体条件会根据不同的加盟类型有所差异。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 加盟费用包含哪些内容？
              </h3>
              <p className="text-gray-600">
                A: 加盟费用包括品牌使用费、装修设计费、首批货款、培训费用等。
                具体费用明细会在签约时详细说明，确保透明公开。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 总部提供哪些支持？
              </h3>
              <p className="text-gray-600">
                A: 我们提供选址指导、装修设计、人员培训、营销支持、
                供货保障、运营指导等全方位支持，确保加盟商成功经营。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 投资回报周期是多长？
              </h3>
              <p className="text-gray-600">
                A: 根据不同地区和经营情况，一般在12-24个月可以收回投资。
                我们会根据市场分析为您提供详细的投资回报预测。
              </p>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            抓住机遇，共创辉煌
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            玉石市场前景广阔，现在正是加入的最佳时机。
            选择 Guaranteed antiques，选择成功的开始。让我们携手共创美好未来！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:400-666-8888"
              className="btn-primary px-8 py-4 text-lg"
            >
              立即咨询
            </a>
            <Link
              to="/contact"
              className="btn-secondary px-8 py-4 text-lg"
            >
              实地考察
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Join;