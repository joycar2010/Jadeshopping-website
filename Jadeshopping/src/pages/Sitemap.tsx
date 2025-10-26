import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Sitemap: React.FC = () => {
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
            <span className="text-gray-900">网站地图</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">网站地图</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            快速浏览站点结构，直达您关心的页面
          </p>
        </div>

        {/* 站点分区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 购物与订单 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">购物与订单</h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/" className="hover:text-primary-600">首页</Link></li>
              <li><Link to="/products" className="hover:text-primary-600">商品列表</Link></li>
              <li><Link to="/cart" className="hover:text-primary-600">购物车</Link></li>
              <li><Link to="/checkout" className="hover:text-primary-600">结算</Link></li>
              <li><Link to="/orders" className="hover:text-primary-600">我的订单</Link></li>
              <li><Link to="/favorites" className="hover:text-primary-600">我的收藏</Link></li>
            </ul>
          </div>

          {/* 账户与设置 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">账户与设置</h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/login" className="hover:text-primary-600">登录</Link></li>
              <li><Link to="/address" className="hover:text-primary-600">地址管理</Link></li>
              <li><Link to="/settings" className="hover:text-primary-600">账户设置</Link></li>
              <li><Link to="/payments" className="hover:text-primary-600">支付管理</Link></li>
              <li><Link to="/vip" className="hover:text-primary-600">会员专区</Link></li>
              <li><Link to="/vip/weizun" className="hover:text-primary-600">会员·微尊</Link></li>
            </ul>
          </div>

          {/* 服务与支持 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">服务与支持</h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/help" className="hover:text-primary-600">帮助中心</Link></li>
              <li><Link to="/service" className="hover:text-primary-600">售后服务</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-600">配送说明</Link></li>
              <li><Link to="/returns" className="hover:text-primary-600">退换货政策</Link></li>
            </ul>
          </div>

          {/* 公司与文化 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">公司与文化</h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/about" className="hover:text-primary-600">公司简介</Link></li>
              <li><Link to="/culture" className="hover:text-primary-600">企业文化</Link></li>
              <li><Link to="/history" className="hover:text-primary-600">发展历程</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600">联系我们</Link></li>
            </ul>
          </div>

          {/* 商务合作 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">商务合作</h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/join" className="hover:text-primary-600">加入我们</Link></li>
              <li><Link to="/supplier" className="hover:text-primary-600">供应商合作</Link></li>
              <li><Link to="/wholesale" className="hover:text-primary-600">批发合作</Link></li>
              <li><Link to="/media" className="hover:text-primary-600">媒体合作</Link></li>
            </ul>
          </div>

          {/* 其他 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">其他</h2>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/buyback" className="hover:text-primary-600">玉石回购</Link></li>
              <li><Link to="/link-test" className="hover:text-primary-600">链接测试报告</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;