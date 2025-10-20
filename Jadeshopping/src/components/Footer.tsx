import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: '关于我们',
      links: [
        { label: '公司简介', href: '/about' },
        { label: '企业文化', href: '/culture' },
        { label: '发展历程', href: '/history' },
        { label: '联系我们', href: '/contact' }
      ]
    },
    {
      title: '客户服务',
      links: [
        { label: '帮助中心', href: '/help' },
        { label: '售后服务', href: '/service' },
        { label: '配送说明', href: '/shipping' },
        { label: '退换货政策', href: '/returns' }
      ]
    },
    {
      title: '商品分类',
      links: [
        { label: '和田玉', href: '/products' },
        { label: '翡翠', href: '/products' },
        { label: '玛瑙', href: '/products' },
        { label: '水晶', href: '/products' }
      ]
    },
    {
      title: '合作伙伴',
      links: [
        { label: '招商加盟', href: '/join' },
        { label: '供应商入驻', href: '/supplier' },
        { label: '批发合作', href: '/wholesale' },
        { label: '媒体合作', href: '/media' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 品牌信息 */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold text-gradient-white">玉石雅韵</h2>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              传承千年玉石文化，精选优质玉石原料，为您提供最纯正的玉石艺术品。每一件商品都承载着深厚的文化底蕴和精湛的工艺。
            </p>
            
            {/* 联系信息 */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>400-888-9999</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>service@jadeelegance.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>北京市朝阳区玉石文化街88号</span>
              </div>
            </div>
          </div>

          {/* 链接分组 */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 社交媒体和支付方式 */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* 社交媒体 */}
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-sm text-gray-300">关注我们:</span>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="微信"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="微博"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* 支付方式 */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-300">支付方式:</span>
              <div className="flex space-x-3">
                <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                  支付宝
                </div>
                <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                  微信
                </div>
                <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                  银联
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <p>&copy; {currentYear} 玉石雅韵. 保留所有权利.</p>
            </div>
            <div className="flex space-x-6">
              <span className="text-gray-500 cursor-not-allowed">
                隐私政策
              </span>
              <span className="text-gray-500 cursor-not-allowed">
                服务条款
              </span>
              <span className="text-gray-500 cursor-not-allowed">
                网站地图
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>京ICP备12345678号-1 | 京公网安备11010502012345号</p>
            <p className="mt-1">营业执照 | 食品经营许可证 | 出版物经营许可证</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;