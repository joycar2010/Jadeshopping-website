import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FileText,
  Users,
  Shield,
  Copyright,
  Scale,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail,
  Phone,
  Calendar,
  Gavel,
  UserX,
  UserCheck,
  Building,
  Globe,
  Clock,
  Settings,
  Star,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ContentPageWrapper from '@/components/ContentPageWrapper';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface ServiceTerm {
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}

interface UserResponsibility {
  responsibility: string;
  description: string;
  violations: string[];
  consequences: string;
}

interface PlatformResponsibility {
  area: string;
  description: string;
  commitments: string[];
  limitations: string[];
}

const Terms: React.FC = () => {
  return (
    <ContentPageWrapper
      pageKey="terms"
      defaultTitle="Terms of Service - Guaranteed Antiques"
      defaultDescription="Read our terms of service for using Guaranteed Antiques platform. Understand your rights and responsibilities when purchasing antiques from our store."
    >
      {(contentPage, loading) => <TermsContent contentPage={contentPage} />}
    </ContentPageWrapper>
  );
};

const TermsContent: React.FC<{ contentPage: any }> = ({ contentPage }) => {
  const [activeSection, setActiveSection] = useState('agreement');

  const serviceTerms: ServiceTerm[] = [
    {
      title: 'Service Scope',
      description: 'We provide online display, sales and related services for antique jewelry',
      details: [
        'Product display and detailed information provision',
        'Online ordering and product management',
        'Logistics delivery and after-sales service',
        'Customer consultation and technical support',
        'Product authentication and maintenance guidance'
      ],
      icon: <Globe className="w-6 h-6 text-jade-600" />
    },
    {
      title: 'Service Standards',
      description: 'We are committed to providing high-quality, professional service experience',
      details: [
        '24/7 online customer service support',
        'Professional product authentication and description',
        'Safe and reliable shopping environment',
        'Fast and accurate logistics delivery',
        'Comprehensive after-sales guarantee system'
      ],
      icon: <Star className="w-6 h-6 text-jade-600" />
    },
    {
      title: 'Service Changes',
      description: 'We reserve the right to adjust service content according to business needs',
      details: [
        'Notify major service changes 30 days in advance',
        'Protect users\' legitimate rights and interests from harm',
        'Provide reasonable transition period and alternative solutions',
        'Users have the right to choose to accept or terminate services',
        'Modified terms take effect for all users'
      ],
      icon: <Settings className="w-6 h-6 text-jade-600" />
    }
  ];

  const userResponsibilities: UserResponsibility[] = [
    {
      responsibility: 'Account Security',
      description: 'Users are responsible for protecting their account security',
      violations: ['Leaking account information', 'Allowing others to use account', 'Using weak passwords'],
      consequences: 'Users bear losses from account theft'
    },
    {
      responsibility: 'Truthful Information',
      description: 'Users should provide truthful and accurate personal information',
      violations: ['Providing false information', 'Impersonating others', 'Malicious account registration'],
      consequences: 'Account may be suspended or permanently banned'
    },
    {
      responsibility: 'Legal Use',
      description: 'Users should use our services legally and compliantly',
      violations: ['Malicious website attacks', 'Spreading illegal information', 'Interfering with normal services'],
      consequences: 'Bear corresponding legal responsibilities'
    },

  ];

  const platformResponsibilities: PlatformResponsibility[] = [
    {
      area: 'Product Quality',
      description: 'We are responsible for the quality of products sold',
      commitments: [
        'Ensure product descriptions are truthful and accurate',
        'Provide professional product authentication',
        'Take responsibility for quality issues',
        'Provide comprehensive after-sales service'
      ],
      limitations: [
        'Not liable for losses caused by improper user use',
        'Natural characteristics of natural antiques are not quality issues',
        'Product damage beyond warranty period'
      ]
    },
    {
      area: 'Information Security',
      description: 'We are committed to protecting users\' personal information security',
      commitments: [
        'Use advanced encryption technology',
        'Strict information access control',
        'Regular security audits and updates',
        'Timely security incident response'
      ],
      limitations: [
        'Information leakage caused by force majeure',
        'Information leakage caused by users themselves',
        'Security issues of third-party service providers'
      ]
    },
    {
      area: 'Service Availability',
      description: 'We strive to ensure stable and available services',
      commitments: [
        '99.5% service availability guarantee',
        'Regular system maintenance and upgrades',
        'Fast fault response and repair',
        'Backup systems and emergency plans'
      ],
      limitations: [
        'Planned system maintenance time',
        'Service interruption caused by force majeure',
        'Third-party service dependency issues'
      ]
    }
  ];

  const intellectualProperty = [
    {
      type: 'Trademark Rights',
      description: '"Guaranteed Antiques" and related trademarks are our registered trademarks',
      protection: 'Unauthorized use of our trademark logos is prohibited',
      icon: <Copyright className="w-6 h-6 text-jade-600" />
    },
    {
      type: 'Copyright',
      description: 'Website content, images, text, etc. enjoy copyright',
      protection: 'Unauthorized copying, distribution and commercial use are prohibited',
      icon: <FileText className="w-6 h-6 text-jade-600" />
    },
    {
      type: 'Patent Rights',
      description: 'Our technological innovations and business models are protected by patents',
      protection: 'Infringement of our patent rights is prohibited',
      icon: <Shield className="w-6 h-6 text-jade-600" />
    },
    {
      type: 'Trade Secrets',
      description: 'Business models, customer information, etc. are trade secrets',
      protection: 'Disclosure or improper use of trade secrets is strictly prohibited',
      icon: <Lock className="w-6 h-6 text-jade-600" />
    }
  ];

  const disputeResolution = [
    {
      step: 1,
      title: 'Friendly Negotiation',
      description: 'Both parties should first resolve disputes through friendly negotiation',
      timeframe: '15 business days',
      icon: <Users className="w-6 h-6 text-jade-600" />
    },
    {
      step: 2,
      title: 'Customer Service Mediation',
      description: 'You can apply for mediation by our customer service team',
      timeframe: '10 business days',
      icon: <Phone className="w-6 h-6 text-jade-600" />
    },
    {
      step: 3,
      title: 'Third-Party Arbitration',
      description: 'You can apply for arbitration to relevant arbitration institutions',
      timeframe: 'According to arbitration rules',
      icon: <Scale className="w-6 h-6 text-jade-600" />
    },
    {
      step: 4,
      title: 'Judicial Litigation',
      description: 'You can file a lawsuit with a competent people\'s court',
      timeframe: 'According to legal procedures',
      icon: <Gavel className="w-6 h-6 text-jade-600" />
    }
  ];

  const sections: TermsSection[] = [
    { id: 'agreement', title: 'Service Agreement', icon: <FileText className="w-4 h-4" /> },
    { id: 'user', title: 'User Responsibilities', icon: <Users className="w-4 h-4" /> },
    { id: 'platform', title: 'Platform Responsibilities', icon: <Building className="w-4 h-4" /> },
    { id: 'intellectual', title: 'Intellectual Property', icon: <Copyright className="w-4 h-4" /> },
    { id: 'dispute', title: 'Dispute Resolution', icon: <Scale className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Terms of Service - Guaranteed Antiques</title>
        <meta name="description" content="Guaranteed Antiques Terms of Service, including service agreements, user responsibilities, platform responsibilities, intellectual property and dispute resolution" />
        <meta name="keywords" content="terms of service,user agreement,legal terms,intellectual property,dispute resolution" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Terms of Service</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-jade-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to Guaranteed Antiques services. Please read the following terms carefully. Using our services indicates your agreement to these terms
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: January 1, 2024 | Effective date: January 1, 2024
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
                <span className="ml-2 font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service Agreement */}
        {activeSection === 'agreement' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Agreement Terms</h2>
              <div className="space-y-6">
                {serviceTerms.map((term, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {term.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{term.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{term.description}</p>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Specific Content:</h4>
                      <div className="space-y-1">
                        {term.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-jade-600 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </div>
                        ))}
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
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Agreement Effectiveness</h3>
                  <p className="text-blue-700 text-sm mb-2">
                    These Terms of Service take effect when you register an account or use our services. If you do not agree to these terms, please do not use our services.
                  </p>
                  <p className="text-blue-700 text-sm">
                    We reserve the right to modify these terms at any time. Modified terms will be published on the website and take effect immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Responsibilities */}
        {activeSection === 'user' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Responsibilities and Obligations</h2>
              <div className="space-y-6">
                {userResponsibilities.map((responsibility, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <UserCheck className="w-6 h-6 text-jade-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">{responsibility.responsibility}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{responsibility.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">Prohibited Actions:</h4>
                        <div className="space-y-1">
                          {responsibility.violations.map((violation, violationIndex) => (
                            <div key={violationIndex} className="flex items-center">
                              <UserX className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{violation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-600 mb-2">Consequences of Violation:</h4>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-amber-700 text-sm">{responsibility.consequences}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">User Code of Conduct</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Encouraged Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Honest transactions and timely payments</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Provide truthful reviews and feedback</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Reasonable use of customer service resources</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700 text-sm">Comply with relevant laws and regulations</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">Prohibited Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Malicious reviews or fake evaluations</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Malicious refunds or payment refusal</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Spreading illegal or inappropriate information</span>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">Infringing on others' legitimate rights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Responsibilities */}
        {activeSection === 'platform' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Responsibilities and Commitments</h2>
              <div className="space-y-6">
                {platformResponsibilities.map((responsibility, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Building className="w-6 h-6 text-jade-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">{responsibility.area}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{responsibility.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Our Commitments:</h4>
                        <div className="space-y-1">
                          {responsibility.commitments.map((commitment, commitmentIndex) => (
                            <div key={commitmentIndex} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{commitment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-600 mb-2">Limitation of Liability:</h4>
                        <div className="space-y-1">
                          {responsibility.limitations.map((limitation, limitationIndex) => (
                            <div key={limitationIndex} className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Guarantee</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
                  <p className="text-gray-600 text-sm">Strict quality control and professional authentication</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timely Service</h4>
                  <p className="text-gray-600 text-sm">Quick response and efficient processing</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="w-16 h-16 bg-jade-100 text-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Team</h4>
                  <p className="text-gray-600 text-sm">Experienced professional service team</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intellectual Property */}
        {activeSection === 'intellectual' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property Protection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {intellectualProperty.map((property, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      {property.icon}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">{property.type}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{property.description}</p>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-red-700 text-xs">
                        <strong>Protection Measures:</strong> {property.protection}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Infringement Handling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Discovering Infringement</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm mb-1">Immediately cease infringement</p>
                        <p className="text-gray-500 text-xs">Require the infringing party to immediately stop related activities</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-jade-600 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm mb-1">Send lawyer's letter</p>
                        <p className="text-gray-500 text-xs">Request cessation of infringement through legal channels</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Gavel className="w-5 h-5 text-red-500 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm mb-1">File a lawsuit</p>
                        <p className="text-gray-500 text-xs">Protect rights through judicial channels</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">User Report</h4>
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm mb-3">
                      If you discover any infringement of our intellectual property, please report it promptly:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-jade-600 mr-2" />
                        <span className="text-gray-700 text-sm">legal@guaranteedantiques.com</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-jade-600 mr-2" />
                        <span className="text-gray-700 text-sm">400-888-9999</span>
                      </div>
                    </div>
                    <div className="bg-jade-50 rounded-lg p-3 mt-4">
                      <p className="text-jade-700 text-xs">
                        We will investigate and process the report within 24 hours of receipt
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Resolution */}
        {activeSection === 'dispute' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dispute Resolution Mechanism</h2>
              <div className="space-y-6">
                {disputeResolution.map((step, index) => (
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
                    {index < disputeResolution.length - 1 && (
                      <div className="absolute left-6 mt-12 w-0.5 h-6 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Jurisdiction Court</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Applicable Law</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Applicable laws of the People's Republic of China</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Exclusion of conflict of laws rules</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Subject to the latest effective laws</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Jurisdiction</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">People's Court at the company's domicile</span>
                    </div>
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">People's Court at the place of contract performance</span>
                    </div>
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 text-jade-600 mr-2" />
                      <span className="text-gray-700 text-sm">Court agreed upon by both parties</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Dispute Prevention</h3>
                  <p className="text-blue-700 text-sm mb-2">
                    We recommend users carefully read the relevant terms before using the service, and consult customer service if they have any questions.
                  </p>
                  <p className="text-blue-700 text-sm">
                    Most disputes can be resolved through friendly negotiation, and we are committed to providing users with satisfactory solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Us */}
        <div className="mt-12 bg-gradient-to-r from-jade-600 to-jade-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Legal Affairs Consultation</h3>
          <p className="text-jade-100 mb-6">If you have any questions about the Terms of Service, please contact our legal team</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Legal Email</p>
                <p className="text-jade-100 text-sm">legal@guaranteedantiques.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Legal Hotline</p>
                <p className="text-jade-100 text-sm">400-888-9999 ext. 3</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-medium">Working Hours</p>
                <p className="text-jade-100 text-sm">Monday to Friday 9:00-18:00</p>
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

export default Terms;