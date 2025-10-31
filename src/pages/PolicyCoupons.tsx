import React from 'react';
import { Gift, AlertTriangle } from 'lucide-react';

const PolicyCoupons: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部法务审核提示 */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">本页面为政策草案，须经法务审核通过后生效。</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 标题区 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded">
            <Gift className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">优惠券政策</h1>
        </div>
        <p className="text-gray-600 mb-8">本政策明确优惠券的获取、使用及有效期等规则，以保障用户权益并规范平台运营。</p>

        {/* 重要提示 */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700 font-semibold">重要条款：优惠券一经发放，除法律法规另有规定外，不可兑现、不可找零，逾期自动失效。</p>
        </div>

        {/* 条款内容 - 分段编号 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ol className="list-decimal pl-6 space-y-4 text-gray-800 text-base sm:text-lg">
            <li>
              获取方式：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>平台活动、会员等级、邀请有礼等渠道。</li>
                <li>特定商品或专区可能附赠优惠券。</li>
                <li>第三方合作或线下活动发放的优惠券以活动规则为准。</li>
              </ol>
            </li>
            <li>
              使用规则：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>每张订单可使用的优惠券数量以页面显示规则为准。</li>
                <li className="font-semibold text-red-600">除非另有说明，优惠券不可叠加使用。</li>
                <li>部分商品或品类可能不支持使用优惠券。</li>
                <li>若发生退货，已使用的优惠券不返还现金，仅按活动规则处理。</li>
              </ol>
            </li>
            <li>
              有效期与区域：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li className="font-semibold text-red-600">优惠券需在有效期内使用，逾期自动失效。</li>
                <li>如无特别说明，优惠券仅限在发放区域内使用。</li>
              </ol>
            </li>
            <li>
              订单金额与门槛：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>满减与折扣类优惠券需满足最低订单金额。</li>
                <li>运费、税费等非商品金额通常不计入门槛（以页面规则为准）。</li>
              </ol>
            </li>
            <li>
              异常与失效处理：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>如遇系统异常导致无法使用，请联系客户服务处理。</li>
                <li>因违规使用或账号风险，平台有权冻结或取消优惠券使用资格。</li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PolicyCoupons;