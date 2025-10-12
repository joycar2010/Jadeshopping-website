import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminRoute from '@/components/auth/AdminRoute'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import Orders from '@/pages/Orders'
import OrderDetail from '@/pages/OrderDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Categories from '@/pages/Categories'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Help from '@/pages/Help'
import Shipping from '@/pages/Shipping'
import Returns from '@/pages/Returns'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import Sitemap from '@/pages/Sitemap'
// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/Dashboard'

import AdminOrders from '@/pages/admin/Orders'
import ProductsList from '@/pages/admin/products/ProductsList'
import AdminProductDetail from '@/pages/admin/products/ProductDetail'
import ProductEdit from '@/pages/admin/products/ProductEdit'
import CategoryList from '@/pages/admin/categories/CategoryList'
import CategoryDetail from '@/pages/admin/categories/CategoryDetail'
import CategoryEdit from '@/pages/admin/categories/CategoryEdit'
// Inventory pages
import InventoryList from '@/pages/admin/inventory/InventoryList'
import InventoryDetail from '@/pages/admin/inventory/InventoryDetail'
import InventoryAdjustment from '@/pages/admin/inventory/InventoryAdjustment'
import InventoryAlerts from '@/pages/admin/inventory/InventoryAlerts'
// Payment pages
import PaymentsList from '@/pages/admin/payments/PaymentsList'
import PaymentDetail from '@/pages/admin/payments/PaymentDetail'
import PaymentSettings from '@/pages/admin/payments/PaymentSettings'
import RefundManagement from '@/pages/admin/payments/RefundManagement'
import PaymentAnalytics from '@/pages/admin/payments/PaymentAnalytics'
// Shipping pages
import ShippingList from '@/pages/admin/shipping/ShippingList'
import ShippingDetail from '@/pages/admin/shipping/ShippingDetail'
import ShippingEdit from '@/pages/admin/shipping/ShippingEdit'
import LogisticsTracking from '@/pages/admin/shipping/LogisticsTracking'
import ShippingSettings from '@/pages/admin/shipping/ShippingSettings'
import ShippingAnalytics from '@/pages/admin/shipping/ShippingAnalytics'
// Content pages
import ContentList from '@/pages/admin/content/ContentList'
import ContentDetail from '@/pages/admin/content/ContentDetail'
import ContentEdit from '@/pages/admin/content/ContentEdit'
import ContentCategories from '@/pages/admin/content/ContentCategories'
import ContentTags from '@/pages/admin/content/ContentTags'
import ContentAnalytics from '@/pages/admin/content/ContentAnalytics'
import ContentSEO from '@/pages/admin/content/ContentSEO'
// Settings pages
import Settings from '@/pages/admin/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="favorites" element={<div>收藏夹</div>} />
          <Route path="search" element={<div>搜索结果</div>} />
          <Route path="categories" element={<Categories />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help" element={<Help />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="returns" element={<Returns />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="sitemap" element={<Sitemap />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="products/new" element={<ProductEdit />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="categories/edit/:id" element={<CategoryEdit />} />
          <Route path="categories/new" element={<CategoryEdit />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="inventory/:id" element={<InventoryDetail />} />
          <Route path="inventory/adjustment" element={<InventoryAdjustment />} />
          <Route path="inventory/alerts" element={<InventoryAlerts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<PaymentsList />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="payments/settings" element={<PaymentSettings />} />
          <Route path="payments/refunds" element={<RefundManagement />} />
          <Route path="payments/analytics" element={<PaymentAnalytics />} />
          <Route path="shipping" element={<ShippingList />} />
          <Route path="shipping/:id" element={<ShippingDetail />} />
          <Route path="shipping/edit/:id" element={<ShippingEdit />} />
          <Route path="shipping/new" element={<ShippingEdit />} />
          <Route path="shipping/tracking" element={<LogisticsTracking />} />
          <Route path="shipping/settings" element={<ShippingSettings />} />
          <Route path="shipping/analytics" element={<ShippingAnalytics />} />
          <Route path="content" element={<ContentList />} />
          <Route path="content/:id" element={<ContentDetail />} />
          <Route path="content/edit/:id" element={<ContentEdit />} />
          <Route path="content/create" element={<ContentEdit />} />
          <Route path="content/categories" element={<ContentCategories />} />
          <Route path="content/tags" element={<ContentTags />} />
          <Route path="content/analytics" element={<ContentAnalytics />} />
          <Route path="content/seo" element={<ContentSEO />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="reports" element={<div>报表统计页面</div>} />
          <Route path="logs" element={<div>操作日志页面</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
