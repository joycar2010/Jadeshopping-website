import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  HelpCircle,
  Shield,
  Gem,
  ShoppingCart,
  Headphones,
  Star,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: '如何辨别玉石的真伪？',
      answer: '辨别玉石真伪需要从多个方面入手：1. 观察颜色和透明度，天然玉石颜色自然，有深浅变化；2. 检查质地，真玉手感温润，假玉通常较轻；3. 听声音，轻敲真玉声音清脆悦耳；4. 看光泽，天然玉石具有油脂光泽或玻璃光泽；5. 检查内部结构，天然玉石内部有天然的纹理和包裹体。建议购买时要求商家提供权威机构的鉴定证书。',
      category: 'identification'
    },
    {
      id: '2',
      question: '玉石如何保养？',
      answer: '玉石保养要点：1. 避免碰撞，玉石硬度虽高但脆性大，避免与硬物碰撞；2. 定期清洁，用软布蘸清水轻拭，避免使用化学清洁剂；3. 避免高温，不要长时间暴露在阳光下或高温环境中；4. 适当佩戴，人体油脂有助于玉石保持润泽；5. 妥善存放，单独存放避免相互摩擦。我们提供终身免费保养服务。',
      category: 'care'
    },
    {
      id: '3',
      question: '如何选择适合的玉石饰品？',
      answer: '选择玉石饰品建议：1. 根据肤色选择，白皙肌肤适合各种颜色，偏黄肌肤选择暖色调玉石；2. 考虑佩戴场合，正式场合选择简约款式，休闲场合可选择个性化设计；3. 注意尺寸，手镯要合适手腕，吊坠大小要与身材协调；4. 选择信誉商家，确保品质和售后服务；5. 了解寓意，不同玉石有不同的文化寓意，选择符合个人喜好的。',
      category: 'purchase'
    },
    {
      id: '4',
      question: '购买后多久发货？',
      answer: '我们承诺：1. 现货商品：付款后24小时内发货；2. 定制商品：7-15个工作日内发货；3. 特殊商品：根据具体情况，会提前告知发货时间；4. 节假日期间可能会有延迟，我们会及时通知；5. 所有订单都会提供物流跟踪号，方便您随时查询物流状态。如有紧急需求，请联系客服安排加急处理。',
      category: 'shipping'
    },

    {
      id: '6',
      question: '不满意可以退货吗？',
      answer: '我们提供灵活的退换货政策：1. 7天无理由退货：收货后7天内，商品完好可无理由退货；2. 质量问题：30天内发现质量问题，免费退换；3. 尺寸不合适：可在7天内申请换货，运费客户承担；4. 定制商品：除质量问题外，一般不支持退换；5. 退款时间：退货确认后3-7个工作日到账。详细政策请查看退换货页面。',
      category: 'return'
    }
  ];

  const categories = [
    { id: 'all', name: '全部问题', count: faqData.length },
    { id: 'identification', name: '玉石鉴别', count: faqData.filter(item => item.category === 'identification').length },
    { id: 'care', name: '保养护理', count: faqData.filter(item => item.category === 'care').length },
    { id: 'purchase', name: '购买指南', count: faqData.filter(item => item.category === 'purchase').length },
    { id: 'shipping', name: '配送相关', count: faqData.filter(item => item.category === 'shipping').length },

    { id: 'return', name: '退换货', count: faqData.filter(item => item.category === 'return').length }
  ];

  const guides: GuideSection[] = [
    {
      id: 'identification',
      title: '玉石鉴别指南',
      icon: <Gem className="w-6 h-6 text-jade-600" />,
      content: [
        '观察颜色：天然玉石颜色自然，有深浅变化和色根',
        '检查透明度：好的玉石透明度适中，过于透明或完全不透明都要谨慎',
        '感受质地：真玉手感温润，密度较大，有一定重量感',
        '听声音：轻敲真玉声音清脆悦耳，假玉声音沉闷',
        '看光泽：天然玉石具有油脂光泽或玻璃光泽，人工合成品光泽较差',
        '检查内部：天然玉石内部有天然纹理、包裹体或棉絮状物质',
        '要求证书：购买时务必要求商家提供权威机构的鉴定证书'
      ]
    },
    {
      id: 'purchase',
      title: '购买指南',
      icon: <ShoppingCart className="w-6 h-6 text-jade-600" />,
      content: [
        '确定预算：根据个人经济能力合理设定购买预算',
        '了解品种：学习不同玉石品种的特点和价值',
        '选择商家：选择有资质、信誉好的正规商家',
        '仔细观察：多角度观察商品，注意颜色、质地、工艺等',
        '询问详情：了解玉石的产地、等级、处理方式等信息',
        '索要证书：要求提供权威机构的鉴定证书',
        '了解售后：确认退换货政策和保养服务'
      ]
    },
    {
      id: 'care',
      title: '保养护理',
      icon: <Shield className="w-6 h-6 text-jade-600" />,
      content: [
        '避免碰撞：玉石虽硬但脆，避免与硬物碰撞或摔落',
        '定期清洁：用软布蘸清水轻拭，避免化学清洁剂',
        '避免高温：不要长时间暴露在阳光下或高温环境',
        '适当佩戴：人体油脂有助于玉石保持润泽光彩',
        '妥善存放：单独存放在软布包装中，避免相互摩擦',
        '定期检查：定期检查镶嵌是否松动，及时维修',
        '专业保养：定期到专业机构进行深度清洁和保养'
      ]
    },
    {
      id: 'service',
      title: '售后服务',
      icon: <Headphones className="w-6 h-6 text-jade-600" />,
      content: [
        '质量保证：所有商品均提供质量保证，支持权威机构复检',
        '退换货服务：7天无理由退货，30天质量问题免费换货',
        '免费保养：提供终身免费清洁和基础保养服务',
        '维修服务：提供专业的维修和翻新服务',
        '鉴定服务：免费提供商品真伪鉴定和价值评估',
        '客服支持：7×24小时客服热线，随时解答您的疑问',
        '物流跟踪：提供全程物流跟踪，确保商品安全送达'
      ]
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqData.filter(item => 
        item.category === selectedCategory &&
        (item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>帮助中心 - 玉石轩</title>
        <meta name="description" content="玉石轩帮助中心，提供玉石鉴别指南、购买指南、保养护理和售后服务等专业帮助信息" />
        <meta name="keywords" content="玉石帮助,玉石鉴别,购买指南,保养护理,售后服务" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">帮助中心</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">帮助中心</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            为您提供专业的玉石知识和贴心的购物指导，让您的玉石之旅更加安心愉快
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="搜索您想了解的问题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 - 分类 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">问题分类</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-jade-50 text-jade-700 border border-jade-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-jade-100 text-jade-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 常见问题 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">常见问题</h2>
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <div className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">没有找到相关问题，请尝试其他关键词</p>
                </div>
              )}
            </div>

            {/* 指南部分 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    {guide.icon}
                    <h3 className="text-xl font-semibold text-gray-900 ml-3">{guide.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {guide.content.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-jade-600 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 联系我们 */}
            <div className="bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">还有其他问题？</h3>
                <p className="text-jade-100">我们的专业客服团队随时为您提供帮助</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Phone className="w-8 h-8 mx-auto mb-3 text-jade-200" />
                  <h4 className="font-semibold mb-1">客服热线</h4>
                  <p className="text-jade-100 text-sm">400-888-9999</p>
                  <p className="text-jade-200 text-xs">7×24小时服务</p>
                </div>
                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto mb-3 text-jade-200" />
                  <h4 className="font-semibold mb-1">邮箱咨询</h4>
                  <p className="text-jade-100 text-sm">service@yushixuan.com</p>
                  <p className="text-jade-200 text-xs">24小时内回复</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3 text-jade-200" />
                  <h4 className="font-semibold mb-1">在线客服</h4>
                  <p className="text-jade-100 text-sm">即时沟通</p>
                  <p className="text-jade-200 text-xs">工作时间在线</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <Link to="/contact">
                  <Button className="bg-white text-jade-600 hover:bg-jade-50 px-8 py-3">
                    联系我们
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;