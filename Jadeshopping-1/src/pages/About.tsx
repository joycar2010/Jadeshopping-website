import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Shield, 
  Award, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Star,
  Gem,
  Heart,
  CheckCircle,
  Truck,
  HeadphonesIcon
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: '张明华',
      position: '创始人 & CEO',
      experience: '20年玉石行业经验',
      description: '国家级玉石鉴定师，致力于传承中华玉文化'
    },
    {
      name: '李雅琴',
      position: '首席设计师',
      experience: '15年珠宝设计经验',
      description: '毕业于中央美术学院，擅长传统与现代结合的设计'
    },
    {
      name: '王德福',
      position: '质量总监',
      experience: '18年品控经验',
      description: '严格把控每一件产品的品质，确保客户满意'
    }
  ];

  const achievements = [
    { title: '国家质量认证', description: 'ISO9001质量管理体系认证' },
    { title: '行业领军企业', description: '连续5年获得玉石行业优秀企业奖' },
    { title: '客户信赖品牌', description: '超过10万客户的信赖选择' },
    { title: '专业资质认证', description: '国家珠宝玉石质量监督检验中心认证' }
  ];

  const services = [
    {
      icon: <Shield className="w-8 h-8 text-jade-600" />,
      title: '品质保证',
      description: '每件商品都经过专业鉴定，提供权威证书'
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-jade-600" />,
      title: '专业服务',
      description: '7×24小时客户服务，专业顾问一对一咨询'
    },
    {
      icon: <Truck className="w-8 h-8 text-jade-600" />,
      title: '快速配送',
      description: '全国包邮，48小时内发货，安全包装'
    },
    {
      icon: <Heart className="w-8 h-8 text-jade-600" />,
      title: '售后保障',
      description: '30天无理由退换，终身免费保养服务'
    }
  ];

  return (
    <>
      <Helmet>
        <title>关于我们 - 玉石轩</title>
        <meta name="description" content="了解玉石轩的品牌故事、企业文化和专业团队。我们致力于传承中华玉文化，为客户提供最优质的玉石产品和服务。" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* 头部横幅 */}
        <div className="relative bg-gradient-to-r from-jade-600 to-jade-800 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">关于玉石轩</h1>
            <p className="text-xl md:text-2xl opacity-90">传承千年玉文化，匠心打造每一件精品</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* 公司介绍 */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">品牌故事</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    玉石轩成立于2003年，是一家专注于高品质玉石产品的专业企业。二十年来，我们始终坚持"以玉会友，以诚待人"的经营理念，致力于传承和弘扬中华优秀的玉文化。
                  </p>
                  <p>
                    从最初的小作坊到如今的行业领军企业，玉石轩始终坚持匠心精神，每一件产品都经过严格的选材、精心的设计和细致的加工。我们相信，真正的美来自于对品质的执着追求。
                  </p>
                  <p>
                    未来，我们将继续秉承"传承文化，创新发展"的使命，为更多的玉石爱好者提供优质的产品和服务，让中华玉文化在新时代焕发出更加璀璨的光芒。
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-jade-100 to-jade-200 rounded-2xl p-8 text-center">
                  <Gem className="w-24 h-24 text-jade-600 mx-auto mb-6" />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-jade-600">20+</div>
                      <div className="text-gray-600">年专业经验</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-jade-600">10万+</div>
                      <div className="text-gray-600">满意客户</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-jade-600">1000+</div>
                      <div className="text-gray-600">精品商品</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-jade-600">99%</div>
                      <div className="text-gray-600">客户满意度</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 核心价值观 */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">核心价值观</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">我们的价值观指引着我们的每一个决策和行动</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">诚信为本</h3>
                <p className="text-gray-600">以诚待人，以信立业，建立长久的信任关系</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">品质至上</h3>
                <p className="text-gray-600">严格把控品质，追求完美，不断超越客户期望</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-jade-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">客户至上</h3>
                <p className="text-gray-600">以客户需求为导向，提供贴心周到的服务</p>
              </div>
            </div>
          </section>

          {/* 服务优势 */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">服务优势</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">专业的团队，完善的服务体系，为您提供最优质的购物体验</p>
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

          {/* 团队介绍 */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">专业团队</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">汇聚行业精英，为您提供最专业的服务</p>
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

          {/* 企业荣誉 */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">企业荣誉</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">多年来获得的认证和奖项，见证我们的专业与实力</p>
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

          {/* 联系我们 */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h2>
              <p className="text-gray-600">欢迎随时与我们联系，我们将竭诚为您服务</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">公司地址</h3>
                <p className="text-gray-600 text-sm">北京市朝阳区建国门外大街1号<br />国贸大厦A座2008室</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">联系电话</h3>
                <p className="text-gray-600 text-sm">400-888-9999<br />010-85698888</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">邮箱地址</h3>
                <p className="text-gray-600 text-sm">service@yushixuan.com<br />info@yushixuan.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-jade-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">营业时间</h3>
                <p className="text-gray-600 text-sm">周一至周日<br />9:00 - 21:00</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;