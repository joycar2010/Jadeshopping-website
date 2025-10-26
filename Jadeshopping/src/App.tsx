import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import ProductList from "@/pages/ProductList";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Points from "/src/pages/Points";
import Wallet from "/src/pages/Wallet";
import GiftCard from "/src/pages/GiftCard";
import RequireAuth from "/src/components/RequireAuth";
import VIP from './pages/VIP';
import Buyback from "@/pages/Buyback";

import Orders from "@/pages/Orders";
import Favorites from "@/pages/Favorites";
import Address from "@/pages/Address";
import Settings from "@/pages/Settings";
import Payments from "@/pages/Payments";
import RecentlyViewed from "@/pages/RecentlyViewed";
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
import Follow from "/src/pages/Follow";
import Coupons from "/src/pages/Coupons";
import MemberClub from "/src/pages/MemberClub";
// 新增政策页面组件导入
import PolicyCoupons from "/src/pages/PolicyCoupons";
import PolicyPoints from "/src/pages/PolicyPoints";
import PolicyWallet from "/src/pages/PolicyWallet";
import PolicyPayments from "/src/pages/PolicyPayments";
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
            <Route path="/payments" element={<Payments />} />
            <Route path="/recently-viewed" element={<RecentlyViewed />} />
            <Route path="/follow" element={<Follow />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/points" element={<Points />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/gift-card" element={<GiftCard />} />
            <Route path="/club" element={
              <RequireAuth>
                <MemberClub />
              </RequireAuth>
            } />
            <Route path="/vip" element={
              <RequireAuth>
                <VIP />
              </RequireAuth>
            } />
            <Route path="/buyback" element={<Buyback />} />
            
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

            {/* 政策子分类页面 */}
            <Route path="/policy/coupons" element={<PolicyCoupons />} />
            <Route path="/policy/points" element={<PolicyPoints />} />
            <Route path="/policy/wallet" element={<PolicyWallet />} />
            <Route path="/policy/payments" element={<PolicyPayments />} />
            
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
