import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, Globe, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* 面包屑导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              首页
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">公司简介</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guaranteed antiques - 传承千年玉文化
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            专注于高品质玉石的甄选与销售，致力于传承和弘扬中华玉文化，为每一位玉石爱好者提供最优质的产品和服务
          </p>
        </div>

        {/* 公司介绍 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <img
              src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20jade%20workshop%20traditional%20chinese%20style%20craftsman%20working&image_size=landscape_16_9"
              alt="玉石工坊"
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              关于 Guaranteed antiques
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Guaranteed antiques 成立于2010年，是一家专业从事玉石文化传播和高端玉石销售的企业。我们秉承"以玉会友，以诚待人"的经营理念，致力于为广大玉石爱好者提供最优质的产品和最专业的服务。
              </p>
              <p>
                公司拥有一支经验丰富的专业团队，包括资深的玉石鉴定师、设计师和工艺师。我们与国内外知名玉石产地建立了长期稳定的合作关系，确保每一件产品都具有优良的品质和独特的文化内涵。
              </p>
              <p>
                多年来，我们始终坚持"品质第一，服务至上"的原则，赢得了广大客户的信赖和好评。我们不仅是玉石的销售者，更是玉文化的传承者和推广者。
              </p>
            </div>
          </div>
        </div>

        {/* 核心价值 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            我们的核心价值
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">品质保证</h3>
              <p className="text-gray-600">
                严格的品质控制体系，确保每一件产品都达到最高标准
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">专业团队</h3>
              <p className="text-gray-600">
                资深的玉石专家和工艺师，为您提供专业的指导和服务
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">文化传承</h3>
              <p className="text-gray-600">
                传承千年玉文化，让更多人了解和喜爱玉石文化
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">用心服务</h3>
              <p className="text-gray-600">
                以客户为中心，用心服务每一位玉石爱好者
              </p>
            </div>
          </div>
        </div>

        {/* 发展历程简述 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            发展历程
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">2010</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">公司成立</h3>
              <p className="text-gray-600">
                在北京成立，专注于高端玉石销售
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">2015</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">业务扩展</h3>
              <p className="text-gray-600">
                建立线上销售平台，服务全国客户
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">2024</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">品牌升级</h3>
              <p className="text-gray-600">
                全新品牌形象，致力于成为行业领导者
              </p>
            </div>
          </div>
        </div>

        {/* 联系我们 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            了解更多
          </h2>
          <p className="text-gray-600 mb-8">
            想要了解更多关于 Guaranteed antiques 的信息？欢迎联系我们
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-primary"
            >
              联系我们
            </Link>
            <Link
              to="/history"
              className="btn-secondary"
            >
              发展历程
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;