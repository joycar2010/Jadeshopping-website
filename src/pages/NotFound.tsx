import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-jade flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">页面未找到</h1>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full btn-primary flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            返回首页
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full btn-secondary flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回上一页
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>如果您认为这是一个错误，请联系我们的客服团队</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;