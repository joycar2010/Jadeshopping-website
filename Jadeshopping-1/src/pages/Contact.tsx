import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ContentService, type ContentPage, type ContentSection } from '@/services/contentService';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [contentPage, setContentPage] = useState<(ContentPage & { sections: ContentSection[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const contentService = new ContentService();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await contentService.getPageBySlug('contact');
        
        if (result.success && result.data) {
          setContentPage(result.data);
        } else {
          // 使用默认内容作为fallback
          const defaultContent = contentService.getDefaultContent('contact');
          setContentPage(defaultContent);
          console.warn('Using default content for contact page:', result.error);
        }
      } catch (err) {
        console.error('Failed to fetch contact page content:', err);
        setError('Failed to load page content');
        // 使用默认内容作为fallback
        const defaultContent = contentService.getDefaultContent('contact');
        setContentPage(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear corresponding field error
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Please select an inquiry topic';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 使用ContentService提交联系表单
      const result = await contentService.submitContactForm(form);
      
      if (result.success) {
        setIsSubmitted(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        toast.success('Message sent successfully! We will contact you soon.');
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // 渲染内容区块
  const renderSection = (section: ContentSection) => {
    switch (section.section_type) {
      case 'hero':
        return (
          <div key={section.id} className="relative bg-gradient-to-r from-jade-600 to-jade-800 text-white py-20">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{section.title}</h1>
              <p className="text-xl md:text-2xl opacity-90">{section.content}</p>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <section key={section.id} className="mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="text-gray-600 max-w-2xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
              </div>
            </div>
          </section>
        );
      
      case 'contact_info':
        return (
          <section key={section.id} className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title || 'Contact Information'}</h2>
              {section.content && <p className="text-gray-600 max-w-2xl mx-auto">{section.content}</p>}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm">{info.content}</p>
                </div>
              ))}
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-jade-600" />,
      title: 'Customer Service Hotline',
      content: '400-888-9999',
      description: '24/7 professional customer service',
      action: () => window.open('tel:400-888-9999')
    },
    {
      icon: <Mail className="w-6 h-6 text-jade-600" />,
      title: 'Email Consultation',
      content: 'service@jadeshopping.com',
      description: 'Reply within 24 hours on business days',
      action: () => window.open('mailto:service@jadeshopping.com')
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-jade-600" />,
      title: 'Live Chat',
      content: 'Chat Now',
      description: 'Real-time online support',
      action: () => toast.info('Live chat feature coming soon...')
    },
    {
      icon: <Smartphone className="w-6 h-6 text-jade-600" />,
      title: 'Social Media',
      content: '@JadeShopping',
      description: 'Follow our social media',
      action: () => toast.info('Social media links coming soon...')
    }
  ];

  const companyInfo = [
    {
      icon: <MapPin className="w-5 h-5 text-jade-600" />,
      title: 'Company Address',
      content: '1 Jianguomenwai Avenue, Chaoyang District, Beijing, CWTC Tower A, Suite 2801'
    },
    {
      icon: <Phone className="w-5 h-5 text-jade-600" />,
      title: 'Contact Phone',
      content: '400-888-9999 / 010-85698888'
    },
    {
      icon: <Mail className="w-5 h-5 text-jade-600" />,
      title: 'Email Address',
      content: 'service@jadeshopping.com'
    },
    {
      icon: <Clock className="w-5 h-5 text-jade-600" />,
      title: 'Business Hours',
      content: 'Monday to Sunday 9:00 AM - 9:00 PM'
    }
  ];

  const faqItems = [
    { question: 'How to authenticate antiques?', link: '/help/authentication' },
    { question: 'Return and exchange policy', link: '/help/return-policy' },
    { question: 'Shipping time and costs', link: '/help/shipping' },
    { question: 'After-sales service guarantee', link: '/help/warranty' },
    { question: 'Membership benefits', link: '/help/membership' },
  ];

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

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Submission Successful - Contact Us - JadeShopping</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us! We have received your message and will respond within 24 hours.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{contentPage?.meta_title || 'Contact Us - JadeShopping'}</title>
        <meta name="description" content={contentPage?.meta_description || "Contact JadeShopping for professional antique consultation, customer service, and support. Multiple contact methods available for your convenience."} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* 渲染动态内容区块 */}
        {contentPage?.sections?.map(section => renderSection(section))}

        <div className="container mx-auto px-4 py-16">
          {/* Contact Methods */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Methods</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose the most convenient way to contact us</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                  onClick={method.action}
                >
                  <div className="flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-jade-600 font-medium mb-2">{method.content}</p>
                  <p className="text-gray-500 text-sm">{method.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Please enter your full name"
                        className={errors.name ? 'border-red-300' : ''}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="Please enter your email address"
                        className={errors.email ? 'border-red-300' : ''}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleInputChange}
                        placeholder="Please enter your phone number"
                        className={errors.phone ? 'border-red-300' : ''}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Topic *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-jade-500 ${errors.subject ? 'border-red-300' : ''}`}
                      >
                        <option value="">Please select an inquiry topic</option>
                        <option value="product">Product Consultation</option>
                        <option value="order">Order Issues</option>
                        <option value="return">Returns & Exchanges</option>
                        <option value="authentication">Authentication Services</option>
                        <option value="partnership">Business Cooperation</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message Content *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your inquiry in detail..."
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-jade-500 resize-none ${errors.message ? 'border-red-300' : ''}`}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Quick answers to common questions</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow">
                  <a 
                    href={item.link} 
                    className="flex items-center justify-between text-gray-900 hover:text-jade-600 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Contact;