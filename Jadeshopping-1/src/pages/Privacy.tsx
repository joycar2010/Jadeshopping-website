import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Shield,
  Eye,
  Lock,
  Cookie,
  UserCheck,
  Database,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
  Mail,
  Phone,
  Calendar,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ContentPageWrapper from '@/components/ContentPageWrapper';

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface DataType {
  type: string;
  description: string;
  purpose: string;
  retention: string;
  icon: React.ReactNode;
}

interface UserRight {
  right: string;
  description: string;
  howTo: string;
  icon: React.ReactNode;
}

const Privacy: React.FC = () => {
  return (
    <ContentPageWrapper
      pageKey="privacy"
      defaultTitle="Privacy Policy - Guaranteed Antiques"
      defaultDescription="Learn how Guaranteed Antiques protects your personal information and privacy. Our comprehensive privacy policy explains data collection, usage, and protection measures."
    >
      {(contentPage, loading) => <PrivacyContent contentPage={contentPage} />}
    </ContentPageWrapper>
  );
};

const PrivacyContent: React.FC<{ contentPage: any }> = ({ contentPage }) => {
  const [activeSection, setActiveSection] = useState('collection');

  const dataTypes: DataType[] = [
    {
      type: 'Personal Identity Information',
      description: 'Name, phone, email, address and other basic information',
      purpose: 'For order processing, delivery and customer service',
      retention: 'Duration of account existence',
      icon: <UserCheck className="w-6 h-6 text-jade-600" />
    },
    {
      type: 'Transaction Information',
      description: 'Order records, purchase history, product preferences',
      purpose: 'Process transactions, provide after-sales service, improve user experience',
      retention: 'Minimum period required by law',
      icon: <FileText className="w-6 h-6 text-jade-600" />
    },
    {
      type: 'Device Information',
      description: 'IP address, browser type, device identifiers',
      purpose: 'Website security, performance optimization, user analytics',
      retention: '12 months',
      icon: <Globe className="w-6 h-6 text-jade-600" />
    },
    {
      type: 'Usage Data',
      description: 'Browsing history, search history, preference settings',
      purpose: 'Personalized recommendations, improve service quality',
      retention: '24 months',
      icon: <Database className="w-6 h-6 text-jade-600" />
    }
  ];

  const userRights: UserRight[] = [
    {
      right: 'Right to Access',
      description: 'You have the right to know what personal information we have collected about you',
      howTo: 'Login to your account to view or contact customer service',
      icon: <Eye className="w-6 h-6 text-jade-600" />
    },
    {
      right: 'Right to Rectification',
      description: 'You have the right to request correction of inaccurate personal information',
      howTo: 'Modify in account settings or contact customer service',
      icon: <Settings className="w-6 h-6 text-jade-600" />
    },
    {
      right: 'Right to Erasure',
      description: 'Under certain circumstances, you have the right to request deletion of personal information',
      howTo: 'Submit written request, we will process within 30 days',
      icon: <AlertTriangle className="w-6 h-6 text-jade-600" />
    },
    {
      right: 'Right to Restrict Processing',
      description: 'You have the right to request restriction of processing your personal information',
      howTo: 'Submit request through customer service or email',
      icon: <Lock className="w-6 h-6 text-jade-600" />
    },
    {
      right: 'Right to Data Portability',
      description: 'You have the right to obtain your personal information in a structured format',
      howTo: 'Contact customer service to request data export',
      icon: <Database className="w-6 h-6 text-jade-600" />
    },
    {
      right: 'Right to Object',
      description: 'You have the right to object to our processing of your information based on legitimate interests',
      howTo: 'Send email to privacy@yushixuan.com',
      icon: <Shield className="w-6 h-6 text-jade-600" />
    }
  ];

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'Cookies necessary for the website to function properly',
      examples: ['Login status', 'Shopping cart contents', 'Security verification'],
      canDisable: false,
      duration: 'Session duration'
    },
    {
      name: 'Functional Cookies',
      description: 'Remember your preferences and provide personalized experience',
      examples: ['Language preference', 'Region settings', 'Display preferences'],
      canDisable: true,
      duration: '12 months'
    },
    {
      name: 'Analytics Cookies',
      description: 'Help us understand website usage and improve services',
      examples: ['Visit statistics', 'Page views', 'User behavior'],
      canDisable: true,
      duration: '24 months'
    },
    {
      name: 'Marketing Cookies',
      description: 'Used to show you relevant advertisements and recommendations',
      examples: ['Ad targeting', 'Recommendation algorithms', 'Marketing campaigns'],
      canDisable: true,
      duration: '12 months'
    }
  ];

  const securityMeasures = [
    {
      measure: 'Data Encryption',
      description: 'SSL/TLS encryption for transmission, AES-256 encryption for storage',
      icon: <Lock className="w-8 h-8 text-jade-600" />
    },
    {
      measure: 'Access Control',
      description: 'Strict employee permission management and access logging',
      icon: <UserCheck className="w-8 h-8 text-jade-600" />
    },
    {
      measure: 'Security Monitoring',
      description: '24/7 security monitoring and anomaly detection system',
      icon: <Eye className="w-8 h-8 text-jade-600" />
    },
    {
      measure: 'Regular Audits',
      description: 'Regular security audits and vulnerability scanning',
      icon: <Shield className="w-8 h-8 text-jade-600" />
    },
    {
      measure: 'Backup & Recovery',
      description: 'Multiple backup mechanisms and disaster recovery plans',
      icon: <Database className="w-8 h-8 text-jade-600" />
    },
    {
      measure: 'Staff Training',
      description: 'Regular privacy protection and security awareness training',
      icon: <Users className="w-8 h-8 text-jade-600" />
    }
  ];

  const sections = [
    { id: 'collection', name: 'Information Collection', icon: <Database className="w-4 h-4" /> },
    { id: 'usage', name: 'Information Usage', icon: <Settings className="w-4 h-4" /> },
    { id: 'protection', name: 'Information Protection', icon: <Shield className="w-4 h-4" /> },
    { id: 'cookies', name: 'Cookie Policy', icon: <Cookie className="w-4 h-4" /> },
    { id: 'rights', name: 'User Rights', icon: <UserCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Privacy Policy - Jade Emporium</title>
        <meta name="description" content="Jade Emporium privacy policy, detailing how we collect, use and protect your personal information" />
        <meta name="keywords" content="privacy policy,personal information protection,data security,cookie policy" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Privacy Policy</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to protecting your privacy. This policy details how we collect, use and protect your personal information
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last Updated: January 1, 2024 | Effective Date: January 1, 2024
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center space-x-1 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-jade-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.icon}
                <span className="ml-2 font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Information Collection */}
        {activeSection === 'collection' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Information We Collect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataTypes.map((data, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {data.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{data.type}</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Content Included:</p>
                        <p className="text-gray-700 text-sm">{data.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Purpose of Use:</p>
                        <p className="text-jade-600 text-sm">{data.purpose}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Retention Period:</p>
                        <p className="text-gray-700 text-sm font-medium">{data.retention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Information Collection Principles</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Minimization Principle: Only collect necessary information</li>
                    <li>• Transparency Principle: Clearly inform collection purpose and usage</li>
                    <li>• Legality Principle: Collect information based on legal grounds</li>
                    <li>• Consent Principle: Obtain your explicit consent before collecting sensitive information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Usage */}
        {activeSection === 'usage' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                  <p className="text-gray-600 text-sm">Process your orders, arrange delivery, provide after-sales service</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Improvement</h3>
                  <p className="text-gray-600 text-sm">Analyze user behavior, optimize website functionality and user experience</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Communication</h3>
                  <p className="text-gray-600 text-sm">Send order updates, promotional information and important notifications</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Protection</h3>
                  <p className="text-gray-600 text-sm">Prevent fraudulent activities, protect account and transaction security</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
                  <p className="text-gray-600 text-sm">Provide personalized product recommendations based on your preferences</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Compliance</h3>
                  <p className="text-gray-600 text-sm">Comply with legal requirements, cooperate with regulatory investigations</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Information Sharing Restrictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-green-600">When We Share Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">With your explicit consent</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Legal requirements</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">With trusted service providers</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">To protect user and public safety</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-red-600">What We Will Never Do</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Sell your personal information</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Marketing without consent</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Share with untrusted third parties</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Use beyond necessary scope</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Protection */}
        {activeSection === 'protection' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Protection Measures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityMeasures.map((measure, index) => (
                  <div key={index} className="text-center p-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-center mb-4">
                      {measure.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{measure.measure}</h3>
                    <p className="text-gray-600 text-sm">{measure.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Data Security Commitment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Technical Protection</h4>
                      <p className="text-gray-600 text-sm">Industry-leading encryption technology and security protocols</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Personnel Management</h4>
                      <p className="text-gray-600 text-sm">Strict employee background checks and confidentiality agreements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Eye className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Monitoring & Auditing</h4>
                      <p className="text-gray-600 text-sm">Continuous security monitoring and regular security audits</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Incident Response</h4>
                      <p className="text-gray-600 text-sm">Comprehensive security incident response and handling mechanisms</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Database className="w-6 h-6 text-jade-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Data Backup</h4>
                      <p className="text-gray-600 text-sm">Multiple backups and disaster recovery to ensure data security</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Compliance Certification</h4>
                      <p className="text-gray-600 text-sm">Multiple international security and privacy certifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cookie Policy */}
        {activeSection === 'cookies' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookie Usage Instructions</h2>
              <div className="space-y-6">
                {cookieTypes.map((cookie, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Cookie className="w-6 h-6 text-jade-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">{cookie.name}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Duration: {cookie.duration}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cookie.canDisable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cookie.canDisable ? 'Optional' : 'Required'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{cookie.description}</p>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Content Included:</p>
                      <div className="flex flex-wrap gap-2">
                        {cookie.examples.map((example, exampleIndex) => (
                          <span key={exampleIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Cookie Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Browser Settings</h4>
                  <p className="text-gray-600 text-sm mb-4">You can manage cookies through your browser settings:</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Block all cookies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Allow first-party cookies only</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Delete existing cookies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Set cookie expiration time</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Website Settings</h4>
                  <p className="text-gray-600 text-sm mb-4">We provide cookie preference settings:</p>
                  <div className="space-y-3">
                    <Button className="w-full bg-jade-600 hover:bg-jade-700 text-white">
                      Manage Cookie Preferences
                    </Button>
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                      View Cookie Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Notice</h3>
                  <p className="text-amber-700 text-sm">
                    Disabling certain cookies may affect the normal functionality of the website. Essential cookies cannot be disabled as they are crucial for website operation.
                    If you choose to disable functional or analytical cookies, some personalized features may not work properly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Rights */}
        {activeSection === 'rights' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRights.map((right, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {right.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{right.right}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{right.description}</p>
                    <div className="bg-jade-50 rounded-lg p-3">
                      <p className="text-jade-700 text-xs">
                        <strong>How to Exercise:</strong> {right.howTo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Rights Exercise Process</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Submit Request</h4>
                    <p className="text-gray-600 text-sm">Submit your rights exercise request via email, phone, or online customer service</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Identity Verification</h4>
                    <p className="text-gray-600 text-sm">We will verify your identity to ensure information security</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Process Request</h4>
                    <p className="text-gray-600 text-sm">We will process your request and provide a response within 30 days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-jade-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 mt-1">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Result Notification</h4>
                    <p className="text-gray-600 text-sm">Notify you of the processing results through your specified method</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Special Notes</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• The exercise of certain rights may be subject to legal and regulatory restrictions</li>
                    <li>• We may charge reasonable fees to process repetitive or excessive requests</li>
                    <li>• Deleting certain information may affect our ability to provide services to you</li>
                    <li>• If you are not satisfied with our processing results, you can file a complaint with relevant regulatory authorities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Us */}
        <div className="mt-12 bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Privacy Inquiry</h3>
          <p className="text-jade-100 mb-6">If you have any questions about our privacy policy, please feel free to contact us</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Privacy Email</p>
                <p className="text-jade-100 text-sm">privacy@jadeemporium.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Customer Service</p>
                <p className="text-jade-100 text-sm">1-800-JADE-888</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Business Hours</p>
                <p className="text-jade-100 text-sm">Mon-Sun 9:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/contact">
              <Button className="bg-white text-jade-600 hover:bg-jade-50 px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;