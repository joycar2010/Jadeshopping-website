import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Award, TrendingUp, Users } from 'lucide-react';
import Footer from '../components/Footer';

const History: React.FC = () => {
  const milestones = [
    {
      year: '2010',
      title: '公司成立',
      description: 'Guaranteed antiques 在北京正式成立，专注于高端玉石的甄选与销售',
      achievements: ['注册资本500万元', '首家实体店开业', '建立供应商网络'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20jade%20store%20opening%20ceremony%20elegant%20interior&image_size=landscape_4_3'
    },
    {
      year: '2012',
      title: '品质认证',
      description: '获得国家珠宝玉石质量监督检验中心认证，建立完善的品质保证体系',
      achievements: ['通过ISO9001质量管理体系认证', '建立专业鉴定实验室', '聘请资深玉石专家'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20jade%20testing%20laboratory%20equipment%20certification&image_size=landscape_4_3'
    },
    {
      year: '2015',
      title: '线上拓展',
      description: '启动电商平台，开启线上线下融合发展模式，服务范围扩展至全国',
      achievements: ['官方网站上线', '移动端APP发布', '全国配送网络建立'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20e-commerce%20platform%20jade%20online%20shopping&image_size=landscape_4_3'
    },
    {
      year: '2018',
      title: '文化传播',
      description: '成立玉文化研究院，致力于玉石文化的研究、传播和教育',
      achievements: ['玉文化研究院成立', '举办首届玉文化节', '出版《玉石鉴赏指南》'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20jade%20culture%20exhibition%20museum%20display&image_size=landscape_4_3'
    },
    {
      year: '2020',
      title: '数字化转型',
      description: '全面推进数字化转型，引入AI技术提升客户体验和运营效率',
      achievements: ['智能推荐系统上线', 'VR虚拟展厅开放', '大数据分析平台建立'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20digital%20jade%20showroom%20virtual%20reality%20technology&image_size=landscape_4_3'
    },
    {
      year: '2022',
      title: '国际合作',
      description: '与国际知名玉石产地建立合作关系，引进世界顶级玉石资源',
      achievements: ['与缅甸翡翠协会签约', '新疆和田玉直采基地', '国际物流体系完善'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=international%20jade%20trade%20cooperation%20handshake%20business&image_size=landscape_4_3'
    },
    {
      year: '2024',
      title: '品牌升级',
      description: '全新品牌形象发布，致力于成为中国玉石行业的领导品牌',
      achievements: ['新品牌VI系统发布', '旗舰店全面升级', '会员体系优化'],
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20jade%20flagship%20store%20modern%20elegant%20design&image_size=landscape_4_3'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">      
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
            <span className="text-gray-900">发展历程</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            发展历程
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            十四年砥砺前行，见证 Guaranteed antiques 从初创企业成长为行业领军品牌的辉煌历程
          </p>
        </div>

        {/* 发展数据 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">14+</div>
            <div className="text-gray-600">发展年份</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">50万+</div>
            <div className="text-gray-600">服务客户</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">20+</div>
            <div className="text-gray-600">行业奖项</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">300%</div>
            <div className="text-gray-600">年均增长</div>
          </div>
        </div>

        {/* 发展时间线 */}
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
          
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                {/* 时间节点 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* 内容卡片 */}
                <div className={`w-full max-w-lg ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl font-bold text-primary-600 mr-4">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {milestone.description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">主要成就：</h4>
                        <ul className="space-y-1">
                          {milestone.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 未来展望 */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">未来展望</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto">
            面向未来，Guaranteed antiques 将继续秉承"传承玉文化，服务玉石爱好者"的使命，
            不断创新发展，致力于成为全球最具影响力的玉石文化传播企业。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">技术创新</h3>
              <p className="text-gray-600 text-sm">
                持续投入研发，运用AI、VR等前沿技术提升客户体验
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">文化传承</h3>
              <p className="text-gray-600 text-sm">
                深入挖掘玉文化内涵，让传统文化在新时代焕发光彩
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">全球布局</h3>
              <p className="text-gray-600 text-sm">
                拓展国际市场，让中华玉文化走向世界舞台
              </p>
            </div>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            了解更多
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="btn-primary"
            >
              公司简介
            </Link>
            <Link
              to="/culture"
              className="btn-secondary"
            >
              企业文化
            </Link>
            <Link
              to="/contact"
              className="btn-secondary"
            >
              联系我们
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default History;