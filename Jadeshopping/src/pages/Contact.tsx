import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    alert('感谢您的留言，我们会尽快与您联系！');
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
            <span className="text-gray-900">联系我们</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            联系我们
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们随时为您提供专业的玉石咨询服务，欢迎通过以下方式与我们联系
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 联系信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">联系信息</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">公司地址</h3>
                    <p className="text-gray-600">
                      北京市朝阳区建国门外大街1号<br />
                      国贸大厦A座2808室
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">联系电话</h3>
                    <p className="text-gray-600">
                      客服热线：400-888-9999<br />
                      销售专线：010-8888-8888
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">电子邮箱</h3>
                    <p className="text-gray-600">
                      客服邮箱：service@jadeyayun.com<br />
                      商务合作：business@jadeyayun.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">营业时间</h3>
                    <p className="text-gray-600">
                      周一至周五：9:00 - 18:00<br />
                      周六至周日：10:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>

              {/* 社交媒体 */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">关注我们</h3>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">微信公众号</p>
                    <p className="text-sm text-gray-600">Guaranteed antiques 官方</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 联系表单 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">在线留言</h2>
              
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
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      手机号 *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="请输入您的手机号"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="请输入您的邮箱地址"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    咨询类型 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">请选择咨询类型</option>
                    <option value="product">产品咨询</option>
                    <option value="price">价格咨询</option>
                    <option value="custom">定制服务</option>
                    <option value="after-sales">售后服务</option>
                    <option value="cooperation">商务合作</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    留言内容 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="请详细描述您的需求或问题，我们会尽快为您解答"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    * 为必填项，我们会在24小时内回复您
                  </p>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    发送留言
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 地图区域 */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">公司位置</h2>
              <p className="text-gray-600 mb-6">
                我们位于北京CBD核心区域，交通便利，欢迎您到店参观选购
              </p>
            </div>
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">地图加载中...</p>
                <p className="text-sm text-gray-500 mt-2">
                  北京市朝阳区建国门外大街1号国贸大厦A座2808室
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            常见问题
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                如何鉴别玉石的真伪？
              </h3>
              <p className="text-gray-600">
                我们提供专业的玉石鉴定服务，每件产品都附有权威机构的鉴定证书。
                您也可以通过观察玉石的色泽、透明度、硬度等特征进行初步判断。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-600">
                我们支持微信支付、支付宝、银行卡支付等多种支付方式。
                对于高价值商品，也支持银行转账和分期付款。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                是否提供定制服务？
              </h3>
              <p className="text-gray-600">
                是的，我们提供个性化定制服务。您可以根据自己的喜好和需求，
                定制独一无二的玉石饰品。详情请联系我们的客服人员。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                售后服务如何保障？
              </h3>
              <p className="text-gray-600">
                我们提供完善的售后服务，包括7天无理由退换、终身保养、
                免费清洁等服务。让您购买无忧，使用放心。
              </p>
            </div>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            了解更多
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/help"
              className="btn-primary"
            >
              帮助中心
            </Link>
            <Link
              to="/service"
              className="btn-secondary"
            >
              售后服务
            </Link>
            <Link
              to="/about"
              className="btn-secondary"
            >
              公司简介
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;