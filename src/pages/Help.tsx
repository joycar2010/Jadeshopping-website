import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, HelpCircle, ShoppingCart, CreditCard, Truck, RotateCcw, Shield, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', icon: HelpCircle },
    { id: 'shopping', name: '购物指南', icon: ShoppingCart },
    { id: 'payment', name: '支付问题', icon: CreditCard },
    { id: 'shipping', name: '配送服务', icon: Truck },
    { id: 'returns', name: '退换货', icon: RotateCcw },
    { id: 'account', name: '账户安全', icon: Shield }
  ];

  const faqs = [
    {
      category: 'shopping',
      question: '如何选择适合的玉石产品？',
      answer: '选择玉石产品时，建议您考虑以下几个方面：1）用途（佩戴、收藏、送礼）；2）预算范围；3）个人喜好（颜色、款式、寓意）；4）玉石种类（和田玉、翡翠、岫玉等）。我们的客服专家可以根据您的需求提供专业建议。'
    },
    {
      category: 'shopping',
      question: '如何查看商品的详细信息？',
      answer: '点击商品图片或名称即可进入商品详情页，您可以查看高清图片、详细描述、规格参数、鉴定证书、用户评价等信息。如需了解更多，可联系在线客服。'
    },

    {
      category: 'shipping',
      question: '配送范围和时间？',
      answer: '我们支持全国配送，一般情况下：1）一线城市1-2个工作日；2）二三线城市2-3个工作日；3）偏远地区3-5个工作日。贵重商品采用顺丰快递，并提供保价服务。'
    },
    {
      category: 'shipping',
      question: '如何查询物流信息？',
      answer: '订单发货后，您会收到包含快递单号的短信通知。您可以在"我的订单"中查看物流状态，或直接在快递公司官网查询详细物流信息。'
    },
    {
      category: 'returns',
      question: '退换货政策是什么？',
      answer: '我们提供7天无理由退换货服务（商品需保持原包装完好）。如商品存在质量问题，我们承担往返运费。退款将在收到退货商品后3-5个工作日内处理完成。'
    },
    {
      category: 'returns',
      question: '如何申请退换货？',
      answer: '登录账户，在"我的订单"中找到相应订单，点击"申请退换货"，填写退换货原因，上传相关图片，提交申请。我们会在24小时内审核并联系您。'
    },
    {
      category: 'account',
      question: '如何保护账户安全？',
      answer: '建议您：1）设置复杂密码并定期更换；2）不要在公共场所登录账户；3）及时退出登录；4）开启短信验证；5）如发现异常，立即联系客服。'
    },
    {
      category: 'account',
      question: '忘记密码怎么办？',
      answer: '点击登录页面的"忘记密码"，输入注册手机号，获取验证码后即可重置密码。如手机号已更换，请联系客服协助处理。'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* 面包屑导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              首页
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">帮助中心</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            帮助中心
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            为您提供全面的购物指南和常见问题解答，让您的购物体验更加顺畅
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索您想了解的问题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/contact"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow group"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <Phone className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">联系客服</h3>
            <p className="text-gray-600">专业客服团队为您提供一对一服务</p>
          </Link>

          <Link
            to="/service"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow group"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">售后服务</h3>
            <p className="text-gray-600">完善的售后保障，让您购买无忧</p>
          </Link>

          <Link
            to="/returns"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow group"
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
              <RotateCcw className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">退换货</h3>
            <p className="text-gray-600">7天无理由退换，保障您的权益</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 分类导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">问题分类</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="h-5 w-5 mr-3" />
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                      <HelpCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-7">
                      {faq.answer}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    没有找到相关问题
                  </h3>
                  <p className="text-gray-600 mb-6">
                    请尝试其他关键词或联系我们的客服团队
                  </p>
                  <Link
                    to="/contact"
                    className="btn-primary"
                  >
                    联系客服
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            还有其他问题？
          </h2>
          <p className="text-gray-600 mb-6">
            如果您没有找到想要的答案，我们的专业客服团队随时为您提供帮助
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-primary"
            >
              在线咨询
            </Link>
            <a
              href="tel:400-888-9999"
              className="btn-secondary"
            >
              电话咨询：400-888-9999
            </a>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/shipping"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Truck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">配送说明</h3>
          </Link>
          <Link
            to="/returns"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow"
          >
            <RotateCcw className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">退换货政策</h3>
          </Link>
          <Link
            to="/service"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Shield className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">售后服务</h3>
          </Link>
          <Link
            to="/contact"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Phone className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">联系我们</h3>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;