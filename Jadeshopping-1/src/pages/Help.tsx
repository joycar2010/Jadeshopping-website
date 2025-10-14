import React, { useState, useEffect } from 'react';
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
import { ContentService, type ContentPage, type ContentSection } from '@/services/contentService';

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
  const [contentPage, setContentPage] = useState<(ContentPage & { sections: ContentSection[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const contentService = new ContentService();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取页面内容
        const pageResult = await contentService.getPageBySlug('help');
        
        if (pageResult.success && pageResult.data) {
          setContentPage(pageResult.data);
        } else {
          // 使用默认内容作为fallback
          const defaultContent = contentService.getDefaultContent('help');
          setContentPage(defaultContent);
          console.warn('Using default content for help page:', pageResult.error);
        }

        // 获取FAQ数据
        const faqResult = await contentService.getFAQs();
        if (faqResult.success && faqResult.data) {
          setFaqs(faqResult.data);
        } else {
          // 使用默认FAQ数据
          setFaqs(defaultFAQData);
          console.warn('Using default FAQ data:', faqResult.error);
        }
      } catch (err) {
        console.error('Failed to fetch help page content:', err);
        setError('Failed to load page content');
        // 使用默认内容作为fallback
        const defaultContent = contentService.getDefaultContent('help');
        setContentPage(defaultContent);
        setFaqs(defaultFAQData);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const defaultFAQData: FAQItem[] = [
    {
      id: '1',
      question: 'How to authenticate antiques?',
      answer: 'Authenticating antiques requires multiple approaches: 1. Observe color and transparency - natural antiques have natural colors with depth variations; 2. Check texture - genuine pieces feel smooth and have appropriate weight; 3. Listen to sound - tapping genuine antiques produces clear, pleasant sounds; 4. Examine luster - natural antiques have oil-like or glass-like luster; 5. Check internal structure - natural antiques have natural patterns and inclusions. We recommend requesting authentication certificates from authoritative institutions when purchasing.',
      category: 'identification'
    },
    {
      id: '2',
      question: 'How to care for antiques?',
      answer: 'Antique care essentials: 1. Avoid impacts - antiques are hard but brittle, avoid collision with hard objects; 2. Regular cleaning - use soft cloth with clean water, avoid chemical cleaners; 3. Avoid high temperatures - do not expose to sunlight or high-temperature environments for long periods; 4. Proper wearing - body oils help maintain antique luster; 5. Proper storage - store separately to avoid mutual friction; 6. Regular inspection - check settings for looseness and repair promptly; 7. Professional maintenance - regular deep cleaning and maintenance at professional institutions. We provide lifetime free maintenance service.',
      category: 'care'
    },
    {
      id: '3',
      question: 'How to choose suitable antique jewelry?',
      answer: 'Antique jewelry selection tips: 1. Choose by skin tone - fair skin suits various colors, yellowish skin should choose warm-toned pieces; 2. Consider wearing occasions - formal occasions need simple styles, casual occasions allow personalized designs; 3. Pay attention to size - bracelets should fit wrists, pendant size should coordinate with body type; 4. Choose reputable merchants - ensure quality and after-sales service; 5. Understand meanings - different antiques have different cultural meanings, choose according to personal preferences.',
      category: 'purchase'
    },
    {
      id: '4',
      question: 'How long after purchase will items ship?',
      answer: 'Our shipping commitment: 1. In-stock items: ship within 24 hours after payment; 2. Custom items: ship within 7-15 business days; 3. Special items: shipping time will be communicated in advance based on specific circumstances; 4. Holidays may cause delays, we will notify promptly; 5. All orders include tracking numbers for easy logistics monitoring. For urgent needs, please contact customer service for expedited processing.',
      category: 'shipping'
    },
    {
      id: '6',
      question: 'Can I return if not satisfied?',
      answer: 'We offer flexible return and exchange policies: 1. 7-day no-reason returns: within 7 days of receipt, items in good condition can be returned without reason; 2. Quality issues: free return/exchange within 30 days for quality problems; 3. Size issues: exchange applications within 7 days, customer pays shipping; 4. Custom items: generally no returns/exchanges except for quality issues; 5. Refund time: 3-7 business days after return confirmation. Please see our return policy page for details.',
      category: 'return'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', count: faqs.length },
    { id: 'identification', name: 'Authentication', count: faqs.filter(item => item.category === 'identification').length },
    { id: 'care', name: 'Care & Maintenance', count: faqs.filter(item => item.category === 'care').length },
    { id: 'purchase', name: 'Purchase Guide', count: faqs.filter(item => item.category === 'purchase').length },
    { id: 'shipping', name: 'Shipping', count: faqs.filter(item => item.category === 'shipping').length },
    { id: 'return', name: 'Returns & Exchanges', count: faqs.filter(item => item.category === 'return').length }
  ];

  const guides: GuideSection[] = [
    {
      id: 'identification',
      title: 'Authentication Guide',
      icon: <Gem className="w-6 h-6 text-jade-600" />,
      content: [
        'Observe color: Natural antiques have natural colors with depth variations and color roots',
        'Check transparency: Good antiques have moderate transparency, be cautious of overly transparent or completely opaque pieces',
        'Feel texture: Genuine pieces feel smooth, have higher density, and appropriate weight',
        'Listen to sound: Tapping genuine antiques produces clear, pleasant sounds; fake ones sound dull',
        'Examine luster: Natural antiques have oil-like or glass-like luster; synthetic pieces have poor luster',
        'Check interior: Natural antiques have natural patterns, inclusions, or cotton-like substances',
        'Request certificates: Always ask merchants for authentication certificates from authoritative institutions'
      ]
    },
    {
      id: 'purchase',
      title: 'Purchase Guide',
      icon: <ShoppingCart className="w-6 h-6 text-jade-600" />,
      content: [
        'Set budget: Establish reasonable purchase budget based on personal financial capacity',
        'Learn varieties: Study characteristics and values of different antique types',
        'Choose merchants: Select qualified, reputable, legitimate merchants',
        'Careful observation: Examine items from multiple angles, noting color, texture, craftsmanship',
        'Ask for details: Learn about origin, grade, treatment methods, and other information',
        'Request certificates: Ask for authentication certificates from authoritative institutions',
        'Understand after-sales: Confirm return/exchange policies and maintenance services'
      ]
    },
    {
      id: 'care',
      title: 'Care & Maintenance',
      icon: <Shield className="w-6 h-6 text-jade-600" />,
      content: [
        'Avoid impacts: Antiques are hard but brittle, avoid collision with hard objects or dropping',
        'Regular cleaning: Use soft cloth with clean water, avoid chemical cleaners',
        'Avoid high temperatures: Do not expose to sunlight or high-temperature environments for extended periods',
        'Proper wearing: Body oils help maintain antique luster and brilliance',
        'Proper storage: Store separately in soft cloth packaging to avoid mutual friction',
        'Regular inspection: Check settings for looseness and repair promptly',
        'Professional maintenance: Regular deep cleaning and maintenance at professional institutions'
      ]
    },
    {
      id: 'service',
      title: 'After-Sales Service',
      icon: <Headphones className="w-6 h-6 text-jade-600" />,
      content: [
        'Quality guarantee: All items come with quality assurance, support re-inspection by authoritative institutions',
        'Return/exchange service: 7-day no-reason returns, 30-day free exchange for quality issues',
        'Free maintenance: Lifetime free cleaning and basic maintenance services',
        'Repair service: Professional repair and restoration services',
        'Authentication service: Free authenticity verification and value assessment',
        'Customer support: 24/7 customer service hotline to answer your questions anytime',
        'Logistics tracking: Full logistics tracking to ensure safe delivery'
      ]
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs.filter(item => 
        item.category === selectedCategory &&
        (item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // 渲染内容区块
  const renderSection = (section: ContentSection) => {
    switch (section.section_type) {
      case 'hero':
        return (
          <div key={section.id} className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="w-12 h-12 text-jade-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">{section.title}</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.content}</p>
          </div>
        );
      
      case 'text':
        return (
          <section key={section.id} className="mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="text-gray-600 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
              </div>
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !contentPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-jade-600 text-white rounded-lg hover:bg-jade-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{contentPage?.meta_title || 'Help Center - JadeShopping'}</title>
        <meta name="description" content={contentPage?.meta_description || "JadeShopping Help Center, providing professional help information including antique authentication guides, purchase guides, care & maintenance, and after-sales service"} />
        <meta name="keywords" content="antique help,antique authentication,purchase guide,care maintenance,after-sales service" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-jade-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Help Center</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 渲染动态内容区块 */}
        {contentPage?.sections?.map(section => renderSection(section))}

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full text-lg"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-jade-100 text-jade-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-400">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Need More Help?</h4>
                <div className="space-y-2">
                  <Link
                    to="/contact"
                    className="flex items-center text-sm text-gray-600 hover:text-jade-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                  <a
                    href="tel:400-888-9999"
                    className="flex items-center text-sm text-gray-600 hover:text-jade-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </a>
                  <a
                    href="mailto:service@jadeshopping.com"
                    className="flex items-center text-sm text-gray-600 hover:text-jade-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No questions found matching your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guides Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    {guide.icon}
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{guide.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {guide.content.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle className="w-4 h-4 text-jade-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;