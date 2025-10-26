import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import VIP from '../pages/VIP';

import Orders from '../pages/Orders';
import Favorites from '../pages/Favorites';
import Address from '../pages/Address';
import Settings from '../pages/Settings';
import Payments from '../pages/Payments';
import Buyback from '../pages/Buyback';
import NotFound from '../pages/NotFound';
// 公司相关页面
import About from '../pages/About';
import Culture from '../pages/Culture';
import History from '../pages/History';
import Contact from '../pages/Contact';
// 服务相关页面
import Help from '../pages/Help';
import Service from '../pages/Service';
import Shipping from '../pages/Shipping';
import Returns from '../pages/Returns';
// 商务合作页面
import Join from '../pages/Join';
import Supplier from '../pages/Supplier';
import Wholesale from '../pages/Wholesale';
import Media from '../pages/Media';
import LinkTestReport from '../components/LinkTestReport';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'products',
        element: <ProductList />
      },
      {
        path: 'product/:id',
        element: <ProductDetail />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },

      {
        path: 'orders',
        element: <Orders />
      },
      {
        path: 'favorites',
        element: <Favorites />
      },
      {
        path: 'address',
        element: <Address />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'payments',
        element: <Payments />
      },
      {
        path: 'vip',
        element: <VIP />
      },
      {
        path: 'vip/weizun',
        element: <VIP />
      },
      {
        path: 'buyback',
        element: <Buyback />
      },
      // 公司相关页面
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'culture',
        element: <Culture />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      // 服务相关页面
      {
        path: 'help',
        element: <Help />
      },
      {
        path: 'service',
        element: <Service />
      },
      {
        path: 'shipping',
        element: <Shipping />
      },
      {
        path: 'returns',
        element: <Returns />
      },
      // 商务合作页面
      {
        path: 'join',
        element: <Join />
      },
      {
        path: 'supplier',
        element: <Supplier />
      },
      {
        path: 'wholesale',
        element: <Wholesale />
      },
      {
        path: 'media',
        element: <Media />
      },
      // 开发工具页面
      {
        path: 'link-test',
        element: <LinkTestReport />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;