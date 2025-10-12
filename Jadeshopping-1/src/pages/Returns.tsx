import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Package,
  CreditCard,
  Shield,
  ArrowRight,
  Info,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReturnCondition {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeLimit: string;
  applicable: string[];
}

interface ReturnStep {
  step: number;
  title: string;
  description: string;
  timeframe: string;
  icon: React.ReactNode;
}

const Returns: React.FC = () => {
  const [activeTab, setActiveTab] = useState('conditions');

  const returnConditions: ReturnCondition[] = [
    {
      icon: <RotateCcw className="w-8 h-8 text-jade-600" />,
      title: '7天无理由退货',
      description: '收货后7天内，商品完好无损，可申请无理由退货',
      timeLimit: '7天',
      applicable: ['所有现货商品', '未佩戴饰品', '包装完整', '附件齐全']
    },
    {
      icon: <Shield className="w-8 h-8 text-jade-600" />,
      title: '质量问题退换',
      description: '商品存在质量问题，30天内可申请退换货',
      timeLimit: '30天',
      applicable: ['质量缺陷', '与描述不符', '运输损坏', '工艺问题']
    },
    {
      icon: <Package className="w-8 h-8 text-jade-600" />,
      title: '尺寸不合适',
      description: '饰品尺寸不合适，可在7天内申请换货',
      timeLimit: '7天',
      applicable: ['手镯尺寸', '戒指尺寸', '项链长度', '吊坠大小']
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
      title: '特殊情况',
      description: '定制商品、特价商品等特殊情况的退换货政策',
      timeLimit: '具体商品而定',
      applicable: ['定制商品仅质量问题可退', '特价商品不支持退换', '古董商品需专业鉴定']
    }
  ];

  const returnSteps: ReturnStep[] = [
    {
      step: 1,
      title: '申请退换货',
      description: '登录账户，在订单页面点击"申请退换货"，填写退换货原因',
      timeframe: '1分钟',
      icon: <FileText className="w-6 h-6 text-jade-600" />
    },
    {
      step: 2,
      title: '客服审核',
      description: '客服团队会在24小时内审核您的申请，并与您确认退换货详情',
      timeframe: '24小时内',
      icon: <CheckCircle className="w-6 h-6 text-jade-600" />
    },
    {
      step: 3,
      title: '寄回商品',
      description: '按照客服提供的地址和要求，将商品安全包装后寄回',
      timeframe: '3-5天',
      icon: <Package className="w-6 h-6 text-jade-600" />
    },
    {
      step: 4,
      title: '商品检验',
      description: '我们收到商品后，会进行质量检验和完整性确认',
      timeframe: '1-2天',
      icon: <Shield className="w-6 h-6 text-jade-600" />
    },
    {
      step: 5,
      title: '处理完成',
      description: '退款将在3-7个工作日内到账，换货商品将重新发出',
      timeframe: '3-7天',
      icon: <CreditCard className="w-6 h-6 text-jade-600" />
    }
  ];

  const qualityIssues = [
    {
      issue: '商品破损',
      description: '运输过程中造成的破损、裂纹等',
      solution: '免费退换，运费由我们承担',
      compensation: '可获得10%补偿金'
    },
    {
      issue: '工艺缺陷',
      description: '雕工不良、抛光不当、镶嵌松动等',
      solution: '免费重新加工或更换',
      compensation: '提供免费保养服务'
    },
    {
      issue: '材质问题',
      description: '与商品描述不符的材质或等级问题',
      solution: '全额退款或换货',
      compensation: '双倍差价补偿'
    },
    {
      issue: '尺寸偏差',
      description: '实际尺寸与标注尺寸相差超过5%',
      solution: '免费调整尺寸或换货',
      compensation: '免费调整服务'
    }
  ];

  const refundMethods = [
    {
      method: '原路退回',
      description: '退款将原路返回到您的付款账户',
      timeframe: '3-7个工作日',
      note: '推荐方式，最安全便捷'
    },
    {
      method: '银行转账',
      description: '退款转账到您指定的银行账户',
      timeframe: '1-3个工作日',
      note: '需要提供准确的银行信息'
    },
    {
      method: '余额退回',
      description: '退款到您的账户余额，可用于下次购买',
      timeframe: '即时到账',
      note: '方便快捷，无手续费'
    }
  ];

  const tabs = [
    { id: 'conditions', name: '退换条件', icon: <Info className="w-4 h-4" /> },
    { id: 'process', name: '退换流程', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'quality', name: '质量问题', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'refund', name: '退款说明', icon: <CreditCard className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>退换货政策 - 玉石轩</title>
        <meta name="description" content="玉石轩退换货政策，包含退换货条件、流程、退款说明和质量问题处理方式" />
        <meta name="keywords" content="退换货政策,退款流程,质量问题,售后服务" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">退换货政策</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">退换货政策</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            为了保障您的权益，我们提供灵活便捷的退换货服务
          </p>
        </div>

        {/* 标签导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center space-x-1 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-jade-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2 font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 退换条件 */}
        {activeTab === 'conditions' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {returnConditions.map((condition, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    {condition.icon}
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{condition.title}</h3>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 text-jade-600 mr-1" />
                        <span className="text-jade-600 text-sm font-medium">{condition.timeLimit}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{condition.description}</p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">适用范围：</h4>
                    <div className="space-y-1">
                      {condition.applicable.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-jade-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">重要提醒</h3>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• 退换货商品必须保持原包装完整，包括商品标签、证书等</li>
                    <li>• 个人定制商品除质量问题外，不支持退换货</li>
                    <li>• 古董、收藏级商品需要专业机构鉴定后方可退换</li>
                    <li>• 退换货运费：质量问题由我们承担，其他情况由客户承担</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 退换流程 */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">退换货流程</h2>
              <div className="space-y-6">
                {returnSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center mb-2">
                        {step.icon}
                        <h3 className="text-lg font-semibold text-gray-900 ml-2">{step.title}</h3>
                        <span className="ml-auto text-jade-600 text-sm font-medium">{step.timeframe}</span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    {index < returnSteps.length - 1 && (
                      <div className="absolute left-6 mt-12 w-0.5 h-6 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-jade-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速申请通道</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-jade-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">电话申请</h4>
                  <p className="text-gray-600 text-sm">400-888-9999</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-jade-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">在线客服</h4>
                  <p className="text-gray-600 text-sm">即时沟通</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-jade-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">在线申请</h4>
                  <p className="text-gray-600 text-sm">登录账户操作</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 质量问题 */}
        {activeTab === 'quality' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {qualityIssues.map((issue, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{issue.issue}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">问题描述：</p>
                      <p className="text-gray-700 text-sm">{issue.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">解决方案：</p>
                      <p className="text-jade-600 text-sm font-medium">{issue.solution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">额外补偿：</p>
                      <p className="text-green-600 text-sm font-medium">{issue.compensation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">质量问题处理承诺</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">100%负责</h4>
                  <p className="text-gray-600 text-sm">对所有质量问题承担全部责任</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">快速处理</h4>
                  <p className="text-gray-600 text-sm">24小时内响应，3天内解决</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">超值补偿</h4>
                  <p className="text-gray-600 text-sm">提供额外补偿和增值服务</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 退款说明 */}
        {activeTab === 'refund' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {refundMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-6 h-6 text-jade-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{method.method}</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">{method.description}</p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-jade-600 text-sm font-medium">{method.timeframe}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 text-xs">{method.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">退款政策说明</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">退款范围</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">商品价款全额退还</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">质量问题运费退还</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">包装费用退还</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">相关税费退还</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">特殊情况</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">定制商品仅质量问题可退款</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">特价商品不支持退款</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">使用优惠券的订单按实付金额退款</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">分期付款按比例退还</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 联系我们 */}
        <div className="mt-12 bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">需要帮助？</h3>
          <p className="text-jade-100 mb-6">我们的客服团队随时为您处理退换货相关问题</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">客服热线</p>
                <p className="text-jade-100 text-sm">400-888-9999</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">邮箱咨询</p>
                <p className="text-jade-100 text-sm">service@yushixuan.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">在线客服</p>
                <p className="text-jade-100 text-sm">即时沟通</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact">
              <Button className="bg-white text-jade-600 hover:bg-jade-50 px-8 py-3">
                联系客服
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;