import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import ProductList from "@/pages/ProductList";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";

import Orders from "@/pages/Orders";
import Favorites from "@/pages/Favorites";
import Address from "@/pages/Address";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
// 公司相关页面
import About from "@/pages/About";
import Culture from "@/pages/Culture";
import History from "@/pages/History";
import Contact from "@/pages/Contact";
// 服务相关页面
import Help from "@/pages/Help";
import Service from "@/pages/Service";
import Shipping from "@/pages/Shipping";
import Returns from "@/pages/Returns";
// 商务合作页面
import Join from "@/pages/Join";
import Supplier from "@/pages/Supplier";
import Wholesale from "@/pages/Wholesale";
import Media from "@/pages/Media";
// 组件
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* 主要页面 */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />

            <Route path="/orders" element={<Orders />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/address" element={<Address />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* 公司相关页面 */}
            <Route path="/about" element={<About />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/history" element={<History />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* 服务相关页面 */}
            <Route path="/help" element={<Help />} />
            <Route path="/service" element={<Service />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            
            {/* 商务合作页面 */}
            <Route path="/join" element={<Join />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/media" element={<Media />} />
            
            {/* 404页面 - 必须放在最后 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <FloatingCart />
      </div>
    </Router>
  );
}
