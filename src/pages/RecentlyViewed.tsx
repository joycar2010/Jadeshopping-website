import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import AccountSidebar from "../components/AccountSidebar";
import {
  User,
  ShoppingBag as Package,
  Heart,
  Gift,
  CreditCard,
  Truck,
  HelpCircle,
  Eye,
  Star,
  Wallet,
  Crown
} from "lucide-react";

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  // 检查用户登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=%2Frecently-viewed");
    }
  }, [isLoggedIn, navigate]);

  // 左侧统一导航（当前高亮“最近浏览”）
  const sidebarMenus = [
    {
      title: 'My Account',
      titleCn: '我的账户',
      items: [
        { name: 'Member CLUB', nameCn: '会员俱乐部', path: '/club', icon: Star },
        { name: 'VIP', nameCn: 'VIP', path: '/vip', icon: Crown },
        { name: 'Profile', nameCn: '个人资料', path: '/settings', icon: User },
        { name: 'Address Book', nameCn: '地址簿', path: '/address', icon: Package },
        { name: 'Payment Methods', nameCn: '支付方式', path: '/payments', icon: CreditCard }
      ]
    },
    {
      title: 'My Assets',
      titleCn: '我的资产',
      items: [
        { name: 'My Coupons', nameCn: '我的优惠券', path: '/coupons', icon: Gift },
        { name: 'My Points', nameCn: '我的积分', path: '/points', icon: Star },
        { name: 'My Wallet', nameCn: '我的钱包', path: '/wallet', icon: Wallet }
      ]
    },
    {
      title: 'My Orders',
      titleCn: '我的订单',
      items: [
        { name: 'All Orders', nameCn: '所有订单', path: '/orders', icon: Package },
        { name: 'Pending Payment', nameCn: '待付款', path: '/orders?tab=unpaid', icon: CreditCard },
        { name: 'Processing', nameCn: '处理中', path: '/orders?tab=processing', icon: Package },
        { name: 'Shipped', nameCn: '已发货', path: '/orders?tab=shipped', icon: Truck },
        { name: 'Review', nameCn: '待评价', path: '/orders?tab=review', icon: Star },
        { name: 'Return', nameCn: '退货', path: '/orders?tab=return', icon: Gift }
      ]
    },
    {
      title: 'My Favorites',
      titleCn: '我的收藏',
      items: [
        { name: 'Wishlist', nameCn: '心愿单', path: '/favorites', icon: Heart },
        { name: 'Recently Viewed', nameCn: '最近浏览', path: '/recently-viewed', icon: Eye, isActive: true },
        { name: 'Follow', nameCn: '关注', path: '/follow', icon: User }
      ]
    },
    {
      title: 'Customer Service',
      titleCn: '客户服务',
      items: [
        { name: 'Help Center', nameCn: '帮助中心', path: '/help', icon: HelpCircle },
        { name: 'Contact Us', nameCn: '联系我们', path: '/contact', icon: HelpCircle },
        { name: 'Buyback Center', nameCn: '回购中心', path: '/buyback', icon: HelpCircle }
      ]
    }
  ];

  // 这里可以添加获取最近浏览商品的逻辑
  const recentlyViewedItems: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-8">
        {/* 左侧导航栏 */}
        <AccountSidebar groups={sidebarMenus} />

        {/* 右侧内容区 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">RECENTLY VIEWED</h1>

            {/* 空状态UI */}
            {recentlyViewedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Eye className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-lg text-gray-500 mb-6">You have not viewed anything.</p>
                <Link
                  to="/"
                  className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
                >
                  Go Shopping
                </Link>
              </div>
            )}

            {/* 商品列表区域 - 当有浏览记录时显示 */}
            {recentlyViewedItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 这里将渲染商品卡片 */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;