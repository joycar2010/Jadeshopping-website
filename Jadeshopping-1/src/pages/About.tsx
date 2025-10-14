import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Gem, 
  Shield, 
  Truck, 
  HeadphonesIcon, 
  Award,
  Heart,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { ContentService, type ContentPage, type ContentSection } from '@/services/contentService';

const About: React.FC = () => {
  const [contentPage, setContentPage] = useState<(ContentPage & { sections: ContentSection[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentService = new ContentService();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await contentService.getPageBySlug('about');
        
        if (result.success && result.data) {
          setContentPage(result.data);
        } else {
          // 使用默认内容作为fallback
          const defaultContent = contentService.getDefaultContent('about');
          setContentPage(defaultContent);
          console.warn('Using default content for about page:', result.error);
        }
      } catch (err) {
        console.error('Failed to fetch about page content:', err);
        setError('Failed to load page content');
        // 使用默认内容作为fallback
        const defaultContent = contentService.getDefaultContent('about');
        setContentPage(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const services = [
    {
      icon: <Shield className="w-12 h-12 text-jade-600" />,
      title: "Quality Guarantee",
      description: "Every item is professionally authenticated and comes with an official certificate"
    },
    {
      icon: <Truck className="w-12 h-12 text-jade-600" />,
      title: "Free Shipping",
      description: "Free nationwide shipping for orders over $200, fast and secure delivery"
    },
    {
      icon: <HeadphonesIcon className="w-12 h-12 text-jade-600" />,
      title: "Professional Service",
      description: "24/7 customer service, professional consultation and after-sales support"
    },
    {
      icon: <Award className="w-12 h-12 text-jade-600" />,
      title: "7-Day Returns",
      description: "7-day no-questions-asked return policy, worry-free shopping experience"
    }
  ];

  const teamMembers = [
    {
      name: "Michael Zhang",
      position: "Founder & CEO",
      experience: "20 years of antique industry experience",
      description: "National certified antique appraiser, dedicated to preserving Chinese cultural heritage"
    },
    {
      name: "Sarah Chen",
      position: "Chief Appraiser",
      experience: "15 years of professional appraisal experience",
      description: "Expert in jade and precious stone identification, published multiple academic papers"
    },
    {
      name: "David Wang",
      position: "Operations Director",
      experience: "12 years of e-commerce management experience",
      description: "Responsible for supply chain management and quality control systems"
    }
  ];

  const achievements = [
    {
      title: "National Quality Certification",
      description: "ISO9001 Quality Management System Certification"
    },
    {
      title: "Industry Excellence Award",
      description: "Outstanding Enterprise in Antique Industry 2023"
    },
    {
      title: "Customer Trust Award",
      description: "Most Trusted Online Antique Platform"
    },
    {
      title: "Cultural Heritage Award",
      description: "Outstanding Contribution to Cultural Preservation"
    }
  ];

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
          <section key={section.id} className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-jade-100 to-jade-200 rounded-2xl p-8 text-center">
                  <Gem className="w-24 h-24 text-jade-600 mx-auto mb-6" />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-jade-600">20+</div>
                      <div className="text-gray-600">Years of Experience</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-jade-600">100K+</div>
                      <div className="text-gray-600">Satisfied Customers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-jade-600">1000+</div>
                      <div className="text-gray-600">Premium Products</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-jade-600">99%</div>
                      <div className="text-gray-600">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      
      case 'image':
        return (
          <section key={section.id} className="mb-20">
            {section.title && (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
                {section.content && <p className="text-gray-600 max-w-2xl mx-auto">{section.content}</p>}
              </div>
            )}
            {section.image_url && (
              <div className="max-w-4xl mx-auto">
                <img 
                  src={section.image_url} 
                  alt={section.title || 'Content image'} 
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            )}
          </section>
        );
      
      case 'features':
        return (
          <section key={section.id} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title || 'Core Values'}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{section.content || 'Our values guide every decision and action we take'}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity First</h3>
                <p className="text-gray-600">Treating people with sincerity, building business with trust, establishing lasting relationships</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Supreme</h3>
                <p className="text-gray-600">Strict quality control, pursuing perfection, continuously exceeding customer expectations</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600">Customer-oriented approach, providing thoughtful and comprehensive service</p>
              </div>
            </div>
          </section>
        );
      
      case 'team':
        return (
          <section key={section.id} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title || 'Professional Team'}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{section.content || 'Bringing together industry elites to provide you with the most professional service'}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-jade-400 to-jade-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-1">{member.name}</h3>
                    <p className="text-jade-600 text-center font-medium mb-2">{member.position}</p>
                    <p className="text-sm text-gray-500 text-center mb-3">{member.experience}</p>
                    <p className="text-gray-600 text-sm text-center">{member.description}</p>
                  </div>
                </div>
              ))}
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
    <>
      <Helmet>
        <title>{contentPage?.meta_title || 'About Us - JadeShopping'}</title>
        <meta name="description" content={contentPage?.meta_description || "Learn about JadeShopping's brand story, corporate culture, and professional team. We are dedicated to preserving Chinese cultural heritage and providing the highest quality antique products and services to our customers."} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* 渲染动态内容区块 */}
        {contentPage?.sections?.map(section => renderSection(section))}

        <div className="container mx-auto px-4 py-16">
          {/* Service Advantages */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Advantages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Professional team and comprehensive service system providing you with the finest shopping experience</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Corporate Honors */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Corporate Honors</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Certifications and awards earned over the years, witnessing our professionalism and strength</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Us */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">Feel free to contact us anytime, we are dedicated to serving you</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Company Address</h3>
                <p className="text-gray-600 text-sm">1 Jianguomenwai Avenue<br />Chaoyang District, Beijing<br />CWTC Tower A, Suite 2008</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Phone</h3>
                <p className="text-gray-600 text-sm">400-888-9999<br />010-85698888</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Address</h3>
                <p className="text-gray-600 text-sm">service@jadeshopping.com<br />info@jadeshopping.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600 text-sm">Monday to Sunday<br />9:00 AM - 9:00 PM</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;