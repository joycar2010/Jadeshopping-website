import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Award, Clock, Phone, Mail, MessageCircle, CheckCircle, Star, Wrench } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Service: React.FC = () => {
  const services = [
    {
      icon: Shield,
      title: '质量保证',
      description: '所有商品均提供正品保证，假一赔十',
      details: [
        '权威机构鉴定证书',
        '专业质检团队把关',
        '假货100%退款赔偿',
        '终身真伪鉴定服务'
      ]
    },
    {
      icon: Clock,
      title: '7天无理由退换',
      description: '购买后7天内可无理由退换货',
      details: [
        '商品完好即可退换',
        '免费上门取件服务',
        '快速退款处理',
        '换货免运费'
      ]
    },
    {
      icon: Wrench,
      title: '终身保养',
      description: '免费提供终身保养和维修服务',
      details: [
        '专业清洁保养',
        '免费维修服务',
        '配件更换优惠',
        '保养知识指导'
      ]
    },
    {
      icon: Award,
      title: '品质承诺',
      description: '严格的品质标准，确保每件商品完美',
      details: [
        '多重质检流程',
        '专家团队把关',
        '品质问题包退换',
        '持续品质监控'
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: '客服热线',
      content: '400-888-9999',
      description: '7×24小时专业客服',
      action: 'tel:400-888-9999'
    },
    {
      icon: MessageCircle,
      title: '在线客服',
      content: '即时响应',
      description: '工作时间内即时回复',
      action: '/contact'
    },
    {
      icon: Mail,
      title: '邮件咨询',
      content: 'service@jadeyayun.com',
      description: '24小时内回复',
      action: 'mailto:service@jadeyayun.com'
    }
  ];

  const serviceProcess = [
    {
      step: '01',
      title: '提交申请',
      description: '在线提交售后申请或联系客服'
    },
    {
      step: '02',
      title: '问题诊断',
      description: '专业团队快速诊断问题'
    },
    {
      step: '03',
      title: '解决方案',
      description: '提供最优的解决方案'
    },
    {
      step: '04',
      title: '服务执行',
      description: '快速执行服务方案'
    },
    {
      step: '05',
      title: '满意确认',
      description: '确认服务质量，完成服务'
    }
  ];

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
            <span className="text-gray-900">售后服务</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            售后服务
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们承诺为每一位客户提供优质的售后服务，让您购买无忧，使用放心
          </p>
        </div>

        {/* 服务承诺 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            服务承诺
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {service.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 服务流程 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            服务流程
          </h2>
          <div className="relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {serviceProcess.map((process, index) => (
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            联系我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  {method.content}
                </p>
                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>
                {method.action.startsWith('tel:') || method.action.startsWith('mailto:') ? (
                  <a
                    href={method.action}
                    className="btn-primary"
                  >
                    立即联系
                  </a>
                ) : (
                  <Link
                    to={method.action}
                    className="btn-primary"
                  >
                    立即联系
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 常见售后问题 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            常见售后问题
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                如何申请退换货？
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>1. 登录您的账户，进入"我的订单"</p>
                <p>2. 找到需要退换货的订单，点击"申请退换货"</p>
                <p>3. 选择退换货原因，上传相关图片</p>
                <p>4. 提交申请，等待客服审核</p>
                <p>5. 审核通过后，按照指引寄回商品</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                退款多久能到账？
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>• 支付宝/微信：1-3个工作日</p>
                <p>• 银行卡：3-7个工作日</p>
                <p>• 信用卡：7-15个工作日</p>
                <p>具体到账时间以银行处理为准，如有疑问请联系客服。</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                商品出现质量问题怎么办？
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>如果商品存在质量问题，我们承诺：</p>
                <p>• 免费退换货，承担往返运费</p>
                <p>• 提供同等价值商品更换</p>
                <p>• 如无法更换，全额退款</p>
                <p>• 必要时提供额外补偿</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                如何保养玉石产品？
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>• 避免与硬物碰撞，防止破损</p>
                <p>• 定期用软布轻拭，保持光泽</p>
                <p>• 避免接触化学物品</p>
                <p>• 长期不佩戴时，单独存放</p>
                <p>• 定期到店免费专业保养</p>
              </div>
            </div>
          </div>
        </div>

        {/* 客户评价 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            客户评价
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((review) => (
              <div key={review} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20asian%20customer%20smiling&image_size=square`}
                    alt="客户头像"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">张女士</h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "售后服务非常好，商品有小问题时客服很快就帮我解决了，
                  还提供了免费的保养服务，真的很贴心！"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 服务承诺书 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            我们的承诺
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              玉石雅韵始终坚持"客户至上，服务第一"的原则，我们承诺为每一位客户提供：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">品质保证</h3>
                  <p className="text-gray-600">所有商品均为正品，提供权威鉴定证书</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">快速响应</h3>
                  <p className="text-gray-600">24小时内响应客户问题和需求</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">专业服务</h3>
                  <p className="text-gray-600">专业团队提供全方位的售后支持</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">持续改进</h3>
                  <p className="text-gray-600">不断优化服务流程，提升客户体验</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            相关服务
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/help"
              className="btn-primary"
            >
              帮助中心
            </Link>
            <Link
              to="/returns"
              className="btn-secondary"
            >
              退换货政策
            </Link>
            <Link
              to="/contact"
              className="btn-secondary"
            >
              联系我们
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Service;