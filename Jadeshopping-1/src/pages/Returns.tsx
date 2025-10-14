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
import ContentPageWrapper from '@/components/ContentPageWrapper';

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
  return (
    <ContentPageWrapper
      pageKey="returns"
      defaultTitle="Returns & Exchanges - Guaranteed Antiques"
      defaultDescription="Learn about our return and exchange policy for antique purchases. Easy returns within 30 days with professional authentication guarantee."
    >
      {(contentPage, loading) => <ReturnsContent contentPage={contentPage} />}
    </ContentPageWrapper>
  );
};

const ReturnsContent: React.FC<{ contentPage: any }> = ({ contentPage }) => {
  const [activeTab, setActiveTab] = useState('conditions');

  const returnConditions: ReturnCondition[] = [
    {
      icon: <RotateCcw className="w-8 h-8 text-jade-600" />,
      title: '7-Day No-Reason Return',
      description: 'Within 7 days of receipt, items in perfect condition can be returned without reason',
      timeLimit: '7 days',
      applicable: ['All in-stock items', 'Unworn jewelry', 'Complete packaging', 'All accessories included']
    },
    {
      icon: <Shield className="w-8 h-8 text-jade-600" />,
      title: 'Quality Issue Return/Exchange',
      description: 'Items with quality issues can be returned or exchanged within 30 days',
      timeLimit: '30 days',
      applicable: ['Quality defects', 'Does not match description', 'Shipping damage', 'Craftsmanship issues']
    },
    {
      icon: <Package className="w-8 h-8 text-jade-600" />,
      title: 'Size Not Suitable',
      description: 'Jewelry with unsuitable size can be exchanged within 7 days',
      timeLimit: '7 days',
      applicable: ['Bracelet size', 'Ring size', 'Necklace length', 'Pendant size']
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
      title: 'Special Cases',
      description: 'Return/exchange policy for custom items, sale items and other special cases',
      timeLimit: 'Depends on specific item',
      applicable: ['Custom items only for quality issues', 'Sale items not returnable', 'Antique items require professional authentication']
    }
  ];

  const returnSteps: ReturnStep[] = [
    {
      step: 1,
      title: 'Apply for Return/Exchange',
      description: 'Login to your account, click "Apply for Return/Exchange" on the order page, and fill in the reason',
      timeframe: '1 minute',
      icon: <FileText className="w-6 h-6 text-jade-600" />
    },
    {
      step: 2,
      title: 'Customer Service Review',
      description: 'Our customer service team will review your application within 24 hours and confirm return/exchange details',
      timeframe: 'Within 24 hours',
      icon: <CheckCircle className="w-6 h-6 text-jade-600" />
    },
    {
      step: 3,
      title: 'Return Items',
      description: 'Package items safely according to the address and requirements provided by customer service',
      timeframe: '3-5 days',
      icon: <Package className="w-6 h-6 text-jade-600" />
    },
    {
      step: 4,
      title: 'Item Inspection',
      description: 'After we receive the items, we will conduct quality inspection and completeness verification',
      timeframe: '1-2 days',
      icon: <Shield className="w-6 h-6 text-jade-600" />
    },
    {
      step: 5,
      title: 'Processing Complete',
      description: 'Refunds will be credited within 3-7 business days, exchange items will be reshipped',
      timeframe: '3-7 days',
      icon: <CreditCard className="w-6 h-6 text-jade-600" />
    }
  ];

  const qualityIssues = [
    {
      issue: 'Item Damage',
      description: 'Damage, cracks, etc. caused during transportation',
      solution: 'Free return/exchange, shipping costs covered by us',
      compensation: '10% compensation available'
    },
    {
      issue: 'Craftsmanship Defects',
      description: 'Poor carving, improper polishing, loose settings, etc.',
      solution: 'Free reprocessing or replacement',
      compensation: 'Free maintenance service provided'
    },
    {
      issue: 'Material Issues',
      description: 'Material or grade issues that do not match product description',
      solution: 'Full refund or exchange',
      compensation: 'Double price difference compensation'
    },
    {
      issue: 'Size Deviation',
      description: 'Actual size differs from marked size by more than 5%',
      solution: 'Free size adjustment or exchange',
      compensation: 'Free adjustment service'
    }
  ];

  const refundMethods = [
    {
      method: 'Original Payment Method',
      description: 'Refund will be returned to your original payment account',
      timeframe: '3-7 business days',
      note: 'Recommended method, safest and most convenient'
    },
    {
      method: 'Bank Transfer',
      description: 'Refund transferred to your designated bank account',
      timeframe: '1-3 business days',
      note: 'Accurate bank information required'
    },
    {
      method: 'Account Balance',
      description: 'Refund to your account balance, available for next purchase',
      timeframe: 'Instant credit',
      note: 'Convenient and fast, no handling fees'
    }
  ];

  const tabs = [
    { id: 'conditions', name: 'Return Conditions', icon: <Info className="w-4 h-4" /> },
    { id: 'process', name: 'Return Process', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'quality', name: 'Quality Issues', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'refund', name: 'Refund Details', icon: <CreditCard className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Return & Exchange Policy - Jade Emporium</title>
        <meta name="description" content="Jade Emporium return and exchange policy, including return conditions, process, refund details and quality issue handling" />
        <meta name="keywords" content="return policy,refund process,quality issues,after-sales service" />
      </Helmet>

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Return & Exchange Policy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Return & Exchange Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To protect your rights, we provide flexible and convenient return and exchange services
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Applicable Scope:</h4>
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
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Reminders</h3>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Return/exchange items must maintain original packaging, including product labels, certificates, etc.</li>
                    <li>• Custom items do not support returns/exchanges except for quality issues</li>
                    <li>• Antique and collector-grade items require professional authentication before return/exchange</li>
                    <li>• Return/exchange shipping: Quality issues covered by us, other cases covered by customer</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Return/Exchange Process</h2>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Application Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-jade-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Phone Application</h4>
                  <p className="text-gray-600 text-sm">400-888-9999</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-jade-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Online Customer Service</h4>
                  <p className="text-gray-600 text-sm">Instant communication</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-jade-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Online Application</h4>
                  <p className="text-gray-600 text-sm">Login to account</p>
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
                      <p className="text-sm text-gray-500 mb-1">Issue Description:</p>
                      <p className="text-gray-700 text-sm">{issue.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Solution:</p>
                      <p className="text-jade-600 text-sm font-medium">{issue.solution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Additional Compensation:</p>
                      <p className="text-green-600 text-sm font-medium">{issue.compensation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quality Issue Handling Commitment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">100% Responsibility</h4>
                  <p className="text-gray-600 text-sm">Full responsibility for all quality issues</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fast Processing</h4>
                  <p className="text-gray-600 text-sm">24-hour response, 3-day resolution</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Premium Compensation</h4>
                  <p className="text-gray-600 text-sm">Additional compensation and value-added services</p>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Refund Policy Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Refund Scope</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Full product price refund</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Shipping fee refund for quality issues</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Packaging fee refund</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Related tax refund</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Special Cases</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Custom items refundable only for quality issues</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Sale items not eligible for refund</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Orders with coupons refunded at actual paid amount</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Installment payments refunded proportionally</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Us */}
        <div className="mt-12 bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-jade-100 mb-6">Our customer service team is ready to handle all your return and exchange questions</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Customer Service</p>
                <p className="text-jade-100 text-sm">400-888-9999</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Email Support</p>
                <p className="text-jade-100 text-sm">service@yushixuan.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Live Chat</p>
                <p className="text-jade-100 text-sm">Instant communication</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact">
              <Button className="bg-white text-jade-600 hover:bg-jade-50 px-8 py-3">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;