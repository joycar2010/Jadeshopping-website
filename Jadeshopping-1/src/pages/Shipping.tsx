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
import ContentPageWrapper from '@/components/ContentPageWrapper';

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
  return (
    <ContentPageWrapper
      pageKey="shipping"
      defaultTitle="Shipping Information - Guaranteed Antiques"
      defaultDescription="Learn about our shipping policies, delivery times, and costs for antique purchases. Professional packaging and secure delivery guaranteed."
    >
      {(contentPage, loading) => <ShippingContent contentPage={contentPage} />}
    </ContentPageWrapper>
  );
};

const ShippingContent: React.FC<{ contentPage: any }> = ({ contentPage }) => {
  const shippingZones: ShippingZone[] = [
    {
      name: 'Tier 1 Cities',
      areas: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou', 'Nanjing', 'Suzhou', 'Chengdu', 'Wuhan', 'Xi\'an'],
      time: '24-48 hours',
      fee: 'Free shipping',
      note: 'Same-day delivery available in selected areas'
    },
    {
      name: 'Tier 2 Cities',
      areas: ['Tianjin', 'Chongqing', 'Qingdao', 'Dalian', 'Ningbo', 'Xiamen', 'Fuzhou', 'Changsha', 'Zhengzhou', 'Jinan'],
      time: '2-3 days',
      fee: 'Free shipping',
      note: 'Priority delivery on weekdays'
    },
    {
      name: 'Tier 3 & Other Cities',
      areas: ['Other prefecture-level and county-level cities nationwide'],
      time: '3-5 days',
      fee: 'Free shipping',
      note: 'Remote areas may require an additional 1-2 days'
    },
    {
      name: 'Hong Kong, Macau & Taiwan',
      areas: ['Hong Kong', 'Macau', 'Taiwan'],
      time: '5-7 days',
      fee: 'From $50',
      note: 'Identity documents required'
    },
    {
      name: 'International',
      areas: ['USA', 'Canada', 'Australia', 'Europe', 'Japan & Korea', 'Southeast Asia'],
      time: '7-15 days',
      fee: 'From $200',
      note: 'Specific fees calculated based on weight and destination'
    }
  ];

  const shippingServices: ShippingService[] = [
    {
      icon: <Truck className="w-8 h-8 text-jade-600" />,
      title: 'Standard Shipping',
      description: 'Economical shipping option suitable for most orders',
      features: [
        'Free nationwide shipping (orders over $299)',
        'Professional packaging, safe and reliable',
        'Full logistics tracking',
        'Delivery confirmation service',
        'Delivery time: 2-5 business days'
      ]
    },
    {
      icon: <Clock className="w-8 h-8 text-jade-600" />,
      title: 'Express Shipping',
      description: 'Faster delivery speed to meet your urgent needs',
      features: [
        'Priority processing and shipping',
        '24-48 hour delivery (Tier 1 cities only)',
        'Dedicated delivery, security guaranteed',
        'Real-time location tracking',
        'Additional fee: $30-50'
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-jade-600" />,
      title: 'Insured Shipping',
      description: 'Professional shipping service for high-value items',
      features: [
        'Full insurance coverage',
        'Professional shock-proof packaging',
        'Inspection service upon delivery',
        'Full compensation for loss or damage',
        'Insurance fee: 0.5% of item value'
      ]
    },
    {
      icon: <Package className="w-8 h-8 text-jade-600" />,
      title: 'Store Pickup',
      description: 'Pick up at store to save shipping costs',
      features: [
        'Free pickup at store locations',
        'Professional on-site inspection',
        'Packaging and care guidance provided',
        'Appointment scheduling supported',
        '20+ stores nationwide'
      ]
    }
  ];

  const packagingFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-jade-600" />,
      title: 'Shock-Proof Packaging',
      description: 'Professional shock-proof materials with multi-layer protection for your precious jade'
    },
    {
      icon: <Package className="w-6 h-6 text-jade-600" />,
      title: 'Moisture-Proof Sealing',
      description: 'Moisture-proof sealed packaging ensures jade maintains optimal condition during transport'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-jade-600" />,
      title: 'Quality Inspection',
      description: 'Strict quality control before shipping ensures every item meets quality standards'
    },
    {
      icon: <Star className="w-6 h-6 text-jade-600" />,
      title: 'Elegant Packaging',
      description: 'Beautiful gift packaging makes your jade even more precious'
    }
  ];

  const specialItems = [
    {
      category: 'Large Items',
      items: ['Large ornaments', 'Stone sculptures', 'Jade rough stones'],
      note: 'Wooden crate packaging, dedicated logistics delivery, 3-7 days delivery time',
      fee: 'Calculated by weight and volume, typically $50-200'
    },
    {
      category: 'Custom Items',
      items: ['Personal custom jewelry', 'Corporate custom gifts', 'Special crafts'],
      note: 'Ships within 48 hours after completion, with more elegant packaging',
      fee: 'Free shipping with exclusive packaging'
    },
    {
      category: 'High-Value Items',
      items: ['Collector-grade jade', 'Antique jade', 'Investment-grade rough stones'],
      note: 'Personal escort, insured delivery, door-to-door inspection supported',
      fee: 'Insurance fees calculated separately, full coverage provided'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Shipping Information - Jade Emporium</title>
        <meta name="description" content="Jade Emporium shipping information, including delivery areas, timeframes, fee details, packaging protection and logistics tracking services" />
        <meta name="keywords" content="jade shipping,logistics information,shipping fees,packaging protection,logistics tracking" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Shipping Information</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Shipping Information</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional and secure shipping services to safely deliver your precious jade treasures
          </p>
        </div>

        {/* 配送范围和时间 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Delivery Areas & Timeframes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingZones.map((zone, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-jade-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Coverage Areas:</p>
                    <p className="text-gray-700 text-sm">{zone.areas.join(', ')}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-jade-600 mr-2" />
                    <span className="text-sm text-gray-600">Delivery Time:</span>
                    <span className="text-sm font-medium text-gray-900 ml-1">{zone.time}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-jade-600 mr-2" />
                    <span className="text-sm text-gray-600">Shipping Fee:</span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shipping Service Types</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Packaging Protection</h2>
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
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Packaging Process</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-gray-700 text-sm">Quality inspection & cleaning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-gray-700 text-sm">Professional protective packaging</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-gray-700 text-sm">Sealed boxing & shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 物流跟踪 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Logistics Tracking Service</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tracking Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Search className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Website Inquiry</h4>
                      <p className="text-gray-600 text-sm">Login to your account to view order status and logistics information</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-gray-600 text-sm">Automatic SMS reminders at key milestones</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Scheduled Delivery</h4>
                      <p className="text-gray-600 text-sm">Schedule delivery time to avoid missed deliveries</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">Order Confirmed - Preparing items</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">Shipped - Handed to logistics company</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">In Transit - Items on delivery route</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm">Delivered - Items successfully delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 特殊商品配送 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Special Item Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.category}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Included Items:</p>
                    <p className="text-gray-700 text-sm">{item.items.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Shipping Notes:</p>
                    <p className="text-gray-700 text-sm">{item.note}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fee Details:</p>
                    <p className="text-jade-600 text-sm font-medium">{item.fee}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Shipping Questions?</h3>
          <p className="text-jade-100 mb-6">Our customer service team is ready to answer any shipping-related questions</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>400-888-9999</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>24/7 Service</span>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact" className="inline-block bg-white text-jade-600 px-8 py-3 rounded-lg font-medium hover:bg-jade-50 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;