import React, { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'

// 路由级按需加载（代码分割）
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/admin/Users'))
const Products = lazy(() => import('./pages/admin/Products'))
const Members = lazy(() => import('./pages/admin/Members'))
const Marketing = lazy(() => import('./pages/admin/Marketing'))
const Orders = lazy(() => import('./pages/admin/Orders'))
const Buyback = lazy(() => import('./pages/admin/Buyback'))
const Payments = lazy(() => import('./pages/admin/Payments'))
const Shipping = lazy(() => import('./pages/admin/Shipping'))
const Services = lazy(() => import('./pages/admin/Services'))
const Operators = lazy(() => import('./pages/admin/Operators'))
const Logs = lazy(() => import('./pages/admin/Logs'))
const Login = lazy(() => import('./pages/Login'))

export const router = createBrowserRouter([
  { path: '/admin/login', element: (
    <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
      <Login />
    </Suspense>
  ) },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '/admin', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Dashboard />
        </Suspense>
      ) },
      { path: '/admin/users', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Users />
        </Suspense>
      ) },
      { path: '/admin/products', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Products />
        </Suspense>
      ) },
      { path: '/admin/members', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Members />
        </Suspense>
      ) },
      { path: '/admin/marketing', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Marketing />
        </Suspense>
      ) },
      { path: '/admin/orders', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Orders />
        </Suspense>
      ) },
      { path: '/admin/buyback', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Buyback />
        </Suspense>
      ) },
      { path: '/admin/payments', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Payments />
        </Suspense>
      ) },
      { path: '/admin/shipping', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Shipping />
        </Suspense>
      ) },
      { path: '/admin/services', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Services />
        </Suspense>
      ) },
      { path: '/admin/operators', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Operators />
        </Suspense>
      ) },
      { path: '/admin/logs', element: (
        <Suspense fallback={<div style={{ padding: 24 }}>加载中…</div>}>
          <Logs />
        </Suspense>
      ) },
    ],
  },
  { path: '*', element: <div style={{ padding: 24 }}>404 Not Found</div> },
])