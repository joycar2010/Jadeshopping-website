import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Clock, MapPin, Package, Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Footer from '../components/Footer';

const Shipping: React.FC = () => {
  const shippingMethods = [
    {
      icon: Truck,
      name: '标准配送',
      time: '3-5个工作日',
      price: '免费',
      description: '适用于大部分地区，安全可靠',
      features: ['免费配送', '签收确认', '包装精美', '保险保障']
    },
    {
      icon: Clock,
      name: '加急配送',
      time: '1-2个工作日',
      price: '¥20',
      description: '快速送达，适合急需商品',
      features: ['优先处理', '专人配送', '实时跟踪', '当日发货']
    },
    {
      icon: Shield,
      name: '贵重物品专送',
      time: '2-3个工作日',
      price: '¥50',
      description: '高价值商品专用，安全保障',
      features: ['专业包装', '保价运输', '专人护送', '签收拍照']
    }
  ];

  const deliveryAreas = [
    {
      area: '一线城市',
      cities: '北京、上海、广州、深圳',
      time: '1-2个工作日',
      note: '当日下单，次日送达'
    },
    {
      area: '省会城市',
      cities: '各省会城市及重点城市',
      time: '2-3个工作日',
      note: '覆盖全国主要城市'
    },
    {
      area: '地级市',
      cities: '全国地级市及县级市',
      time: '3-5个工作日',
      note: '配送网络覆盖广泛'
    },
    {
      area: '偏远地区',
      cities: '西藏、新疆、内蒙古等',
      time: '5-7个工作日',
      note: '可能需要额外运费'
    }
  ];

  const packagingStandards = [
    {
      icon: Package,
      title: '专业包装',
      description: '采用专业的珠宝包装材料，确保商品安全'
    },
    {
      icon: Shield,
      title: '防震保护',
      description: '多层防震包装，有效防止运输过程中的碰撞'
    },
    {
      icon: CheckCircle,
      title: '密封防潮',
      description: '密封包装，防止潮湿和灰尘影响商品品质'
    },
    {
      icon: Info,
      title: '标识清晰',
      description: '包装上标注易碎品标识，提醒快递员小心处理'
    }
  ];

  const shippingProcess = [
    {
      step: '01',
      title: '订单确认',
      description: '确认订单信息和收货地址',
      time: '下单后1小时内'
    },
    {
      step: '02',
      title: '商品打包',
      description: '专业团队进行商品包装',
      time: '1-2个工作日'
    },
    {
      step: '03',
      title: '发货通知',
      description: '发货后短信通知快递单号',
      time: '发货当日'
    },
    {
      step: '04',
      title: '运输跟踪',
      description: '实时跟踪物流信息',
      time: '运输全程'
    },
    {
      step: '05',
      title: '签收确认',
      description: '客户签收，完成配送',
      time: '送达当日'
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
            <span className="text-gray-900">配送说明</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            配送说明
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们提供安全、快速、专业的配送服务，确保您的珍贵商品安全送达
          </p>
        </div>

        {/* 配送方式 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            配送方式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {method.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <span className="text-2xl font-bold text-primary-600">
                      {method.price}
                    </span>
                    <span className="text-gray-500">
                      {method.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {method.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 配送范围 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            配送范围
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      配送区域
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      覆盖城市
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      配送时间
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      备注
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveryAreas.map((area, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {area.area}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {area.cities}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {area.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {area.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 包装标准 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            包装标准
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packagingStandards.map((standard, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <standard.icon className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {standard.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 配送流程 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            配送流程
          </h2>
          <div className="relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {shippingProcess.map((process, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {process.description}
                  </p>
                  <p className="text-primary-600 text-xs font-medium">
                    {process.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 配送须知 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            配送须知
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  配送时间说明
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 工作日：周一至周五 9:00-18:00</li>
                <li>• 周末配送：周六 9:00-17:00</li>
                <li>• 节假日暂停配送服务</li>
                <li>• 恶劣天气可能影响配送时间</li>
                <li>• 偏远地区配送时间可能延长</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  收货注意事项
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 请确保收货地址准确无误</li>
                <li>• 收货时请当面验货</li>
                <li>• 发现包装破损请拒收</li>
                <li>• 签收前请核对商品数量</li>
                <li>• 保留好快递单据</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  特殊地区说明
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 港澳台地区需要额外运费</li>
                <li>• 海外配送需要单独联系</li>
                <li>• 军事管制区无法配送</li>
                <li>• 部分山区可能无法直达</li>
                <li>• 具体情况请咨询客服</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-purple-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  安全保障
                </h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 全程保价运输</li>
                <li>• 专业包装保护</li>
                <li>• 实时物流跟踪</li>
                <li>• 签收拍照确认</li>
                <li>• 运输保险覆盖</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            配送常见问题
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 什么时候发货？
              </h3>
              <p className="text-gray-600">
                A: 一般情况下，订单确认后1-2个工作日内发货。现货商品当日下单次日发货，
                定制商品根据制作周期确定发货时间。节假日期间发货时间可能延长。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 如何查询物流信息？
              </h3>
              <p className="text-gray-600">
                A: 发货后我们会通过短信发送快递单号，您可以通过快递公司官网或APP查询物流信息。
                也可以在"我的订单"中查看物流跟踪信息。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 配送费用如何计算？
              </h3>
              <p className="text-gray-600">
                A: 订单满299元免运费，不满299元收取15元运费。加急配送和贵重物品专送需要额外收费。
                偏远地区可能产生额外运费，具体费用在下单时显示。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Q: 收货时发现商品有问题怎么办？
              </h3>
              <p className="text-gray-600">
                A: 如果收货时发现包装破损或商品有问题，请立即拒收并联系客服。
                我们会重新为您发货或安排退款。已签收的商品如有问题，请在24小时内联系客服处理。
              </p>
            </div>
          </div>
        </div>

        {/* 联系客服 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            配送问题咨询
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            如有配送相关问题，请随时联系我们的客服团队
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:400-888-9999"
              className="btn-primary"
            >
              客服热线：400-888-9999
            </a>
            <Link
              to="/contact"
              className="btn-secondary"
            >
              在线客服
            </Link>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            相关服务
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/returns"
              className="btn-primary"
            >
              退换货政策
            </Link>
            <Link
              to="/service"
              className="btn-secondary"
            >
              售后服务
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

export default Shipping;