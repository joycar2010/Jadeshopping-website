import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Gem, Compass, Target, Lightbulb } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Culture: React.FC = () => {
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
            <Link to="/about" className="text-gray-500 hover:text-primary-600">
              公司简介
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">企业文化</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            企业文化
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            传承玉文化精髓，弘扬工匠精神，以诚待人，以玉会友
          </p>
        </div>

        {/* 企业使命 */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">企业使命</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              传承和弘扬中华玉文化，为每一位玉石爱好者提供最优质的产品和最专业的服务，
              让玉石的温润与美好走进千家万户，成为连接传统与现代的文化桥梁。
            </p>
          </div>
        </div>

        {/* 核心价值观 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            核心价值观
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">品质至上</h3>
              <p className="text-gray-600">
                严格甄选每一块玉石，确保品质卓越，让客户买得放心，用得安心
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">诚信经营</h3>
              <p className="text-gray-600">
                以诚待人，以信立业，建立长期稳定的客户关系，赢得市场信赖
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">专业专注</h3>
              <p className="text-gray-600">
                专注玉石领域，不断提升专业水平，为客户提供最权威的指导
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">创新发展</h3>
              <p className="text-gray-600">
                在传承中创新，在创新中发展，让传统玉文化焕发新的活力
              </p>
            </div>
          </div>
        </div>

        {/* 企业愿景 */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">企业愿景</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="text-lg">
                    成为中国最具影响力的玉石文化传播企业，让玉石文化走向世界。
                  </p>
                  <p>
                    我们致力于打造一个集玉石销售、文化传播、教育培训为一体的综合性平台，
                    让更多人了解和喜爱玉石文化，传承中华文明的瑰宝。
                  </p>
                  <p>
                    通过我们的努力，让每一块玉石都承载着深厚的文化内涵，
                    让每一位客户都能感受到玉石的温润与美好。
                  </p>
                </div>
              </div>
              <div className="h-64 lg:h-auto">
                <img
                  src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20jade%20carving%20master%20working%20elegant%20workshop&image_size=landscape_4_3"
                  alt="玉石雕刻大师"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 企业精神 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            企业精神
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">匠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">工匠精神</h3>
              <p className="text-gray-600">
                精益求精，追求完美，每一件作品都是艺术品
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">和</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">和谐共赢</h3>
              <p className="text-gray-600">
                与客户、合作伙伴、员工共同成长，实现多方共赢
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">韵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">文化韵味</h3>
              <p className="text-gray-600">
                传承文化精髓，让每一件产品都充满文化韵味
              </p>
            </div>
          </div>
        </div>

        {/* 员工理念 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            员工理念
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">人才观</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 德才兼备，以德为先</li>
                <li>• 专业能力与文化素养并重</li>
                <li>• 团队协作，共同成长</li>
                <li>• 持续学习，不断进步</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">发展观</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 为员工提供广阔的发展平台</li>
                <li>• 鼓励创新，支持个人成长</li>
                <li>• 建立公平公正的晋升机制</li>
                <li>• 营造和谐温馨的工作环境</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 行动指南 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            文化实践
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            我们的企业文化不仅体现在理念上，更体现在日常的经营实践中。
            每一个决策、每一次服务、每一件产品都承载着我们的文化理念。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="btn-primary"
            >
              了解公司
            </Link>
            <Link
              to="/contact"
              className="btn-secondary"
            >
              加入我们
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Culture;