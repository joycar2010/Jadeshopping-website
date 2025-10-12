import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Truck,
  Clock,
  Shield,
  MapPin,
  Package,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Phone,
  Search,
  Calendar,
  Star
} from 'lucide-react';

interface ShippingZone {
  name: string;
  areas: string[];
  time: string;
  fee: string;
  note?: string;
}

interface ShippingService {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const Shipping: React.FC = () => {
  const shippingZones: ShippingZone[] = [
    {
      name: '一线城市',
      areas: ['北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都', '武汉', '西安'],
      time: '24-48小时',
      fee: '免费配送',
      note: '部分地区支持当日达'
    },
    {
      name: '二线城市',
      areas: ['天津', '重庆', '青岛', '大连', '宁波', '厦门', '福州', '长沙', '郑州', '济南'],
      time: '2-3天',
      fee: '免费配送',
      note: '工作日优先配送'
    },
    {
      name: '三线及其他城市',
      areas: ['全国其他地级市及县级市'],
      time: '3-5天',
      fee: '免费配送',
      note: '偏远地区可能需要额外1-2天'
    },
    {
      name: '港澳台地区',
      areas: ['香港', '澳门', '台湾'],
      time: '5-7天',
      fee: '¥50起',
      note: '需要提供身份证明文件'
    },
    {
      name: '海外地区',
      areas: ['美国', '加拿大', '澳洲', '欧洲', '日韩', '东南亚'],
      time: '7-15天',
      fee: '¥200起',
      note: '具体费用根据重量和目的地计算'
    }
  ];

  const shippingServices: ShippingService[] = [
    {
      icon: <Truck className="w-8 h-8 text-jade-600" />,
      title: '标准配送',
      description: '经济实惠的配送选择，适合大部分订单',
      features: [
        '全国包邮（订单满299元）',
        '专业包装，安全可靠',
        '物流全程跟踪',
        '签收确认服务',
        '配送时间：2-5个工作日'
      ]
    },
    {
      icon: <Clock className="w-8 h-8 text-jade-600" />,
      title: '加急配送',
      description: '更快的配送速度，满足您的紧急需求',
      features: [
        '优先处理和发货',
        '24-48小时送达（限一线城市）',
        '专人配送，安全保障',
        '实时位置跟踪',
        '额外费用：¥30-50'
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-jade-600" />,
      title: '保价配送',
      description: '高价值商品的专业配送服务',
      features: [
        '全程保险保障',
        '专业防震包装',
        '签收时验货服务',
        '丢失损坏全额赔付',
        '保价费用：商品价值的0.5%'
      ]
    },
    {
      icon: <Package className="w-8 h-8 text-jade-600" />,
      title: '自提服务',
      description: '到店自提，节省配送费用',
      features: [
        '门店自提免配送费',
        '专业人员现场验货',
        '提供包装和保养指导',
        '支持预约到店时间',
        '全国20+门店支持'
      ]
    }
  ];

  const packagingFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-jade-600" />,
      title: '防震包装',
      description: '采用专业防震材料，多层保护您的珍贵玉石'
    },
    {
      icon: <Package className="w-6 h-6 text-jade-600" />,
      title: '密封防潮',
      description: '防潮密封包装，确保玉石在运输过程中保持最佳状态'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-jade-600" />,
      title: '品质检验',
      description: '发货前严格质检，确保每件商品都符合品质标准'
    },
    {
      icon: <Star className="w-6 h-6 text-jade-600" />,
      title: '精美包装',
      description: '精美的礼品包装，让您的玉石更显珍贵'
    }
  ];

  const specialItems = [
    {
      category: '大件商品',
      items: ['大型摆件', '石雕作品', '玉石原石'],
      note: '采用木箱包装，物流专线配送，配送时间3-7天',
      fee: '根据重量和体积计算，一般¥50-200'
    },
    {
      category: '定制商品',
      items: ['个人定制饰品', '企业定制礼品', '特殊工艺品'],
      note: '制作完成后48小时内发货，包装更加精美',
      fee: '免费配送，提供专属包装'
    },
    {
      category: '高价值商品',
      items: ['收藏级玉石', '古董玉器', '投资级原石'],
      note: '专人护送，保价配送，支持上门验货',
      fee: '保价费用另计，提供全程保险'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>配送信息 - 玉石轩</title>
        <meta name="description" content="玉石轩配送信息，包含配送范围、时间、费用说明、包装保护措施和物流跟踪服务" />
        <meta name="keywords" content="玉石配送,物流信息,配送费用,包装保护,物流跟踪" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              首页
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">配送信息</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">配送信息</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            专业安全的配送服务，让您的珍贵玉石安全送达
          </p>
        </div>

        {/* 配送范围和时间 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">配送范围与时效</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingZones.map((zone, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-jade-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">覆盖区域：</p>
                    <p className="text-gray-700 text-sm">{zone.areas.join('、')}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-jade-600 mr-2" />
                    <span className="text-sm text-gray-600">配送时间：</span>
                    <span className="text-sm font-medium text-gray-900 ml-1">{zone.time}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-jade-600 mr-2" />
                    <span className="text-sm text-gray-600">配送费用：</span>
                    <span className="text-sm font-medium text-jade-600 ml-1">{zone.fee}</span>
                  </div>
                  {zone.note && (
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500">{zone.note}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 配送服务类型 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">配送服务类型</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  {service.icon}
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 包装保护 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">包装保护措施</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {packagingFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-jade-50 rounded-full mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-jade-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">包装流程</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-gray-700 text-sm">质量检验与清洁</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-gray-700 text-sm">专业防护包装</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-gray-700 text-sm">密封装箱发货</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 物流跟踪 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">物流跟踪服务</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">跟踪方式</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Search className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">官网查询</h4>
                      <p className="text-gray-600 text-sm">登录账户查看订单状态和物流信息</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">短信通知</h4>
                      <p className="text-gray-600 text-sm">关键节点自动发送短信提醒</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">预约配送</h4>
                      <p className="text-gray-600 text-sm">支持预约配送时间，避免无人收货</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">配送状态</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">订单确认 - 正在准备商品</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">商品出库 - 已交付物流公司</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">运输中 - 商品正在配送途中</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">已送达 - 商品已成功送达</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 特殊商品配送 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">特殊商品配送说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.category}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">包含商品：</p>
                    <p className="text-gray-700 text-sm">{item.items.join('、')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">配送说明：</p>
                    <p className="text-gray-700 text-sm">{item.note}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">费用说明：</p>
                    <p className="text-jade-600 text-sm font-medium">{item.fee}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">配送相关问题？</h3>
          <p className="text-jade-100 mb-6">我们的客服团队随时为您解答配送相关的任何问题</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>400-888-9999</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>7×24小时服务</span>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact" className="inline-block bg-white text-jade-600 px-8 py-3 rounded-lg font-medium hover:bg-jade-50 transition-colors">
              联系客服
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;