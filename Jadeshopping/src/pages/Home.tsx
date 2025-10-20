import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Shield, Truck, Award } from 'lucide-react';

const Home: React.FC = () => {
  // 轮播图数据
  const bannerSlides = [
    {
      id: 1,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20jade%20jewelry%20display%20with%20soft%20lighting%20and%20traditional%20Chinese%20elements&image_size=landscape_16_9',
      title: '传承千年玉石文化',
      subtitle: '精选优质和田玉，传统工艺与现代设计完美融合',
      buttonText: '立即选购',
      buttonLink: '/products'
    },
    {
      id: 2,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20jadeite%20bracelet%20collection%20on%20silk%20fabric%20with%20elegant%20presentation&image_size=landscape_16_9',
      title: '翡翠臻品荟萃',
      subtitle: '缅甸A货翡翠，每一件都是大自然的馈赠',
      buttonText: '查看详情',
      buttonLink: '/products?category=jadeite'
    },
    {
      id: 3,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20jade%20pendant%20with%20traditional%20Chinese%20carving%20in%20luxury%20gift%20box&image_size=landscape_16_9',
      title: '匠心独运 臻品典藏',
      subtitle: '大师级雕刻工艺，每一件都是独一无二的艺术品',
      buttonText: '探索更多',
      buttonLink: '/products?featured=true'
    }
  ];

  // 商品分类数据
  const categories = [
    {
      id: 1,
      name: '和田玉',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=white%20hetian%20jade%20carved%20pendant%20with%20traditional%20Chinese%20design&image_size=square',
      description: '温润如脂，君子之石',
      link: '/products?category=hetian'
    },
    {
      id: 2,
      name: '翡翠',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20jadeite%20bracelet%20with%20natural%20patterns%20and%20high%20transparency&image_size=square',
      description: '翠绿欲滴，富贵吉祥',
      link: '/products?category=jadeite'
    },
    {
      id: 3,
      name: '玛瑙',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20agate%20beads%20necklace%20with%20natural%20banding%20patterns&image_size=square',
      description: '色彩斑斓，护身辟邪',
      link: '/products?category=agate'
    },
    {
      id: 4,
      name: '水晶',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=clear%20crystal%20sphere%20with%20rainbow%20reflections%20on%20elegant%20stand&image_size=square',
      description: '晶莹剔透，净化心灵',
      link: '/products?category=crystal'
    }
  ];

  // 热销商品数据
  const hotProducts = [
    {
      id: 1,
      name: '和田玉观音吊坠',
      price: 2880,
      originalPrice: 3200,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=white%20hetian%20jade%20guanyin%20pendant%20with%20detailed%20carving%20and%20gold%20chain&image_size=square',
      rating: 4.9,
      sales: 1256,
      tag: '热销'
    },
    {
      id: 2,
      name: '缅甸翡翠手镯',
      price: 8800,
      originalPrice: 9600,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20myanmar%20jadeite%20bangle%20with%20natural%20color%20variations&image_size=square',
      rating: 4.8,
      sales: 892,
      tag: '精品'
    },
    {
      id: 3,
      name: '南红玛瑙戒指',
      price: 1580,
      originalPrice: 1800,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=red%20agate%20ring%20with%20silver%20setting%20and%20elegant%20design&image_size=square',
      rating: 4.7,
      sales: 654,
      tag: '新品'
    },
    {
      id: 4,
      name: '紫水晶项链',
      price: 680,
      originalPrice: 800,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=purple%20amethyst%20necklace%20with%20graduated%20beads%20and%20silver%20clasp&image_size=square',
      rating: 4.6,
      sales: 423,
      tag: '特价'
    }
  ];

  // 品牌优势数据
  const advantages = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: '品质保证',
      description: '每件商品都经过专业鉴定，提供权威证书'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: '安全配送',
      description: '专业包装，保价运输，确保商品安全到达'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: '大师工艺',
      description: '传承古法工艺，融合现代设计理念'
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: '贴心服务',
      description: '7天无理由退换，终身免费保养服务'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 轮播图区域 */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50">
          <img
            src={bannerSlides[0].image}
            alt={bannerSlides[0].title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {bannerSlides[0].title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {bannerSlides[0].subtitle}
            </p>
            <Link
              to={bannerSlides[0].buttonLink}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {bannerSlides[0].buttonText}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 商品分类区域 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">商品分类</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              精选四大类玉石珍品，每一类都承载着深厚的文化底蕴和独特的美学价值
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 热销商品区域 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">热销商品</h2>
              <p className="text-gray-600">精选热销商品，品质保证，值得信赖</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              查看更多
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.tag === '热销' ? 'bg-red-100 text-red-600' :
                      product.tag === '精品' ? 'bg-blue-100 text-blue-600' :
                      product.tag === '新品' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {product.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.sales}+)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-red-600">
                        ¥{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ¥{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 品牌优势区域 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择玉石雅韵</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              专业、诚信、品质，我们致力于为每一位客户提供最优质的玉石产品和服务
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 文化传承区域 */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                传承千年玉石文化
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                玉石在中华文化中有着深厚的历史底蕴，被誉为"石中之王"。我们秉承传统工艺，
                结合现代设计理念，为您呈现最具文化价值和艺术价值的玉石珍品。
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                每一件商品都经过严格筛选，由经验丰富的工艺师精心雕琢，
                确保每一件作品都能体现玉石的天然美感和文化内涵。
              </p>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                了解更多
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20Chinese%20jade%20carving%20workshop%20with%20master%20craftsman%20working%20on%20jade%20sculpture&image_size=landscape_4_3"
                alt="玉石文化传承"
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;