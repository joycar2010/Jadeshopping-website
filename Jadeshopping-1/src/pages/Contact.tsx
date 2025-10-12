import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle,
  Copy,
  ExternalLink,
  Headphones,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!form.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }

    if (!form.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!form.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = '请输入有效的手机号码';
    }

    if (!form.subject.trim()) {
      newErrors.subject = '请选择咨询主题';
    }

    if (!form.message.trim()) {
      newErrors.message = '请输入留言内容';
    } else if (form.message.trim().length < 10) {
      newErrors.message = '留言内容至少需要10个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // 模拟提交过程
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-jade-600" />,
      title: '客服热线',
      content: '400-888-9999',
      description: '7×24小时专业客服',
      action: () => window.open('tel:400-888-9999')
    },
    {
      icon: <Mail className="w-6 h-6 text-jade-600" />,
      title: '邮箱咨询',
      content: 'service@yushixuan.com',
      description: '工作日24小时内回复',
      action: () => window.open('mailto:service@yushixuan.com')
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-jade-600" />,
      title: '在线客服',
      content: '立即咨询',
      description: '实时在线解答疑问',
      action: () => alert('在线客服功能开发中...')
    },
    {
      icon: <Smartphone className="w-6 h-6 text-jade-600" />,
      title: 'Facebook客服',
      content: '@YuShiXuan',
      description: '关注我们的Facebook页面',
      action: () => window.open('https://facebook.com/YuShiXuan')
    }
  ];

  const companyInfo = [
    {
      icon: <MapPin className="w-5 h-5 text-jade-600" />,
      title: '公司地址',
      content: '北京市朝阳区建国门外大街1号国贸大厦A座2801室'
    },
    {
      icon: <Phone className="w-5 h-5 text-jade-600" />,
      title: '联系电话',
      content: '400-888-9999 / 010-85698888'
    },
    {
      icon: <Mail className="w-5 h-5 text-jade-600" />,
      title: '邮箱地址',
      content: 'service@yushixuan.com'
    },
    {
      icon: <Clock className="w-5 h-5 text-jade-600" />,
      title: '营业时间',
      content: '周一至周日 9:00-21:00'
    }
  ];

  const faqItems = [
    { question: '如何辨别玉石真伪？', link: '/help/authentication' },
    { question: '退换货政策说明', link: '/help/return-policy' },
    { question: '配送时间和费用', link: '/help/shipping' },
    { question: '售后服务保障', link: '/help/warranty' },
    { question: '会员权益介绍', link: '/help/membership' },

  ];

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>提交成功 - 联系我们 - 玉石轩</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">提交成功！</h2>
            <p className="text-gray-600 mb-6">
              感谢您的留言，我们已收到您的咨询。我们的客服团队将在24小时内与您联系。
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                继续咨询
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>联系我们 - 玉石轩</title>
        <meta name="description" content="联系玉石轩，获得专业的玉石咨询服务。提供多种联系方式，专业客服团队为您解答疑问。" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们致力于为您提供最优质的玉石产品和服务，欢迎随时与我们联系
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 联系表单 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <MessageCircle className="w-6 h-6 text-jade-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">在线咨询</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="请输入您的姓名"
                        className={errors.name ? 'border-red-300' : ''}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        联系电话 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleInputChange}
                        placeholder="请输入您的手机号码"
                        className={errors.phone ? 'border-red-300' : ''}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="请输入您的邮箱地址"
                      className={errors.email ? 'border-red-300' : ''}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      咨询主题 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-transparent ${
                        errors.subject ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择咨询主题</option>
                      <option value="product">产品咨询</option>
                      <option value="order">订单问题</option>
                      <option value="shipping">配送问题</option>
                      <option value="return">退换货</option>
                      <option value="authentication">真伪鉴定</option>
                      <option value="maintenance">保养维护</option>
                      <option value="cooperation">商务合作</option>
                      <option value="other">其他问题</option>
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      留言内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleInputChange}
                      placeholder="请详细描述您的问题或需求，我们将为您提供专业的解答..."
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-transparent resize-none ${
                        errors.message ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                    <p className="mt-1 text-sm text-gray-500">
                      {form.message.length}/500 字符
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        提交咨询
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* 联系信息侧边栏 */}
            <div className="space-y-6">
              {/* 快速联系方式 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">快速联系</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      onClick={method.action}
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-shrink-0 mr-3">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{method.title}</h4>
                        <p className="text-jade-600 font-medium">{method.content}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 公司信息 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">公司信息</h3>
                <div className="space-y-4">
                  {companyInfo.map((info, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{info.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 常见问题 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">常见问题</h3>
                <div className="space-y-2">
                  {faqItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      className="block p-2 text-sm text-gray-600 hover:text-jade-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      {item.question}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 地图和地址信息 */}
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-jade-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">门店位置</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">北京总店</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-jade-600 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">地址</p>
                          <p className="text-gray-600">北京市朝阳区建国门外大街1号国贸大厦A座2801室</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-jade-600 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">电话</p>
                          <p className="text-gray-600">010-85698888</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-jade-600 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">营业时间</p>
                          <p className="text-gray-600">周一至周日 9:00-21:00</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-2">交通指南</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 地铁：1号线、10号线国贸站A口出</li>
                        <li>• 公交：1路、4路、37路国贸站下车</li>
                        <li>• 自驾：国贸大厦地下停车场</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    {/* 地图占位符 */}
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">地图加载中...</p>
                        <p className="text-sm text-gray-400 mt-1">
                          实际项目中可集成百度地图或高德地图
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;