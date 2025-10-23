import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RotateCcw, Shield, Clock, CheckCircle, AlertTriangle, Info, Phone, Mail, MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';

const Returns: React.FC = () => {
  const [activeTab, setActiveTab] = useState('return');

  const returnConditions = [
    {
      icon: Clock,
      title: '7天无理由退货',
      description: '商品完好，包装完整，可无理由退货',
      details: [
        '商品未使用，标签完整',
        '包装盒、配件齐全',
        '购买凭证完整',
        '非定制商品'
      ]
    },
    {
      icon: Shield,
      title: '质量问题退换',
      description: '商品存在质量问题，支持退换货',
      details: [
        '商品破损、瑕疵',
        '与描述不符',
        '功能异常',
        '材质问题'
      ]
    },
    {
      icon: RotateCcw,
      title: '尺寸不合适',
      description: '尺寸不合适可申请换货',
      details: [
        '首饰尺寸偏大偏小',
        '提供准确尺寸信息',
        '商品无损坏',
        '一次免费换货机会'
      ]
    }
  ];

  const returnProcess = [
    {
      step: '01',
      title: '申请退换货',
      description: '在线提交退换货申请',
      details: [
        '登录账户进入"我的订单"',
        '选择需要退换货的商品',
        '填写退换货原因',
        '上传相关图片证明'
      ]
    },
    {
      step: '02',
      title: '审核处理',
      description: '客服审核退换货申请',
      details: [
        '1-2个工作日内审核',
        '审核通过发送退货地址',
        '不通过会说明原因',
        '可申请人工复审'
      ]
    },
    {
      step: '03',
      title: '寄回商品',
      description: '将商品寄回指定地址',
      details: [
        '使用推荐的快递公司',
        '包装完好，防止损坏',
        '保留快递单号',
        '建议选择保价服务'
      ]
    },
    {
      step: '04',
      title: '商品检验',
      description: '收到商品后进行检验',
      details: [
        '检查商品完整性',
        '核实退换货原因',
        '确认符合退换货条件',
        '1-3个工作日完成检验'
      ]
    },
    {
      step: '05',
      title: '处理完成',
      description: '退款或发送新商品',
      details: [
        '退款：3-7个工作日到账',
        '换货：重新发送新商品',
        '短信通知处理结果',
        '可查询处理进度'
      ]
    }
  ];

  const notReturnableItems = [
    '定制商品（除质量问题外）',
    '已使用或损坏的商品',
    '超过退货期限的商品',
    '无法恢复原状的商品',
    '贴身佩戴类商品（耳钉等）',
    '特价促销商品（标明不可退换）'
  ];

  const refundMethods = [
    {
      method: '原路退回',
      time: '3-7个工作日',
      description: '退款将原路返回到您的付款账户',
      note: '推荐方式，安全快捷'
    },
    {
      method: '银行转账',
      time: '1-3个工作日',
      description: '退款到您指定的银行账户',
      note: '需提供准确的银行信息'
    },
    {
      method: '余额退款',
      time: '即时到账',
      description: '退款到您的账户余额',
      note: '可用于下次购买'
    }
  ];

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
            <span className="text-gray-900">退换货政策</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            退换货政策
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            为了保障您的权益，我们制定了完善的退换货政策，让您购买无忧
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('return')}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'return'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  退货政策
                </button>
                <button
                  onClick={() => setActiveTab('exchange')}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'exchange'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  换货政策
                </button>
                <button
                  onClick={() => setActiveTab('refund')}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'refund'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  退款说明
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 退换货条件 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            退换货条件
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {returnConditions.map((condition, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <condition.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {condition.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {condition.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {condition.details.map((detail, detailIndex) => (
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

        {/* 退换货流程 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            退换货流程
          </h2>
          <div className="space-y-8">
            {returnProcess.map((process, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-6 flex-shrink-0">
                    {process.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">
                        {process.title}
                      </h3>
                      <p className="text-gray-600">
                        {process.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {process.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="mb-16">
          {activeTab === 'return' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                退货政策详情
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    退货时间限制
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 无理由退货：收货后7天内</li>
                    <li>• 质量问题：收货后15天内</li>
                    <li>• 定制商品：仅限质量问题</li>
                    <li>• 特价商品：按商品页面说明</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    退货费用承担
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 无理由退货：客户承担运费</li>
                    <li>• 质量问题：商家承担运费</li>
                    <li>• 错发商品：商家承担运费</li>
                    <li>• 尺寸问题：双方协商</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exchange' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                换货政策详情
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    换货条件
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 尺寸不合适（一次免费换货）</li>
                    <li>• 颜色与描述不符</li>
                    <li>• 商品存在质量问题</li>
                    <li>• 收到错误商品</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    换货说明
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 换货商品需有库存</li>
                    <li>• 价格差异需补齐或退还</li>
                    <li>• 换货时间：3-5个工作日</li>
                    <li>• 换货次数：原则上限一次</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                退款方式说明
              </h2>
              <div className="space-y-6">
                {refundMethods.map((method, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {method.method}
                      </h3>
                      <span className="text-primary-600 font-medium">
                        {method.time}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {method.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {method.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 不支持退换货的商品 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            不支持退换货的商品
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                以下商品不支持无理由退换货
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notReturnableItems.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-blue-700 text-sm">
                  注：即使是不支持无理由退换货的商品，如果存在质量问题，我们仍然支持退换货服务。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            退换货常见问题
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 退货时需要提供什么材料？
              </h3>
              <p className="text-gray-600">
                A: 需要提供订单号、商品照片、退货原因说明。如果是质量问题，
                请提供问题部位的清晰照片。保留好商品包装和配件。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 退款什么时候能到账？
              </h3>
              <p className="text-gray-600">
                A: 我们收到退货商品并确认无误后，会在1-2个工作日内处理退款。
                具体到账时间根据支付方式不同：支付宝/微信1-3天，银行卡3-7天。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 可以换成其他款式吗？
              </h3>
              <p className="text-gray-600">
                A: 可以的，但需要补齐或退还价格差异。如果新款式缺货，
                我们会及时通知您选择其他款式或申请退款。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 定制商品可以退换吗？
              </h3>
              <p className="text-gray-600">
                A: 定制商品由于其特殊性，一般不支持无理由退换货。
                但如果商品存在质量问题或与定制要求不符，我们会负责重新制作或退款。
              </p>
            </div>
          </div>
        </div>

        {/* 联系客服 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            退换货咨询
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                客服热线
              </h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">
                400-888-9999
              </p>
              <p className="text-gray-600 mb-4">
                7×24小时专业服务
              </p>
              <a
                href="tel:400-888-9999"
                className="btn-primary"
              >
                立即拨打
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                在线客服
              </h3>
              <p className="text-lg text-secondary-600 mb-2">
                即时响应
              </p>
              <p className="text-gray-600 mb-4">
                工作时间内即时回复
              </p>
              <Link
                to="/contact"
                className="btn-secondary"
              >
                在线咨询
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                邮件咨询
              </h3>
              <p className="text-lg text-green-600 mb-2">
                service@jadeyayun.com
              </p>
              <p className="text-gray-600 mb-4">
                24小时内回复
              </p>
              <a
                href="mailto:service@jadeyayun.com"
                className="btn-outline"
              >
                发送邮件
              </a>
            </div>
          </div>
        </div>

        {/* 服务承诺 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            我们的承诺
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              玉石雅韵承诺为每一位客户提供公平、透明的退换货服务
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">快速响应，及时处理</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">公平公正，客户至上</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">流程透明，进度可查</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">专业服务，贴心周到</span>
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
              to="/service"
              className="btn-primary"
            >
              售后服务
            </Link>
            <Link
              to="/shipping"
              className="btn-secondary"
            >
              配送说明
            </Link>
            <Link
              to="/help"
              className="btn-secondary"
            >
              帮助中心
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Returns;