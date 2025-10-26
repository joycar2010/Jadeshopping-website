import React from 'react';
import { Star, AlertTriangle } from 'lucide-react';

const PolicyPoints: React.FC = () => {
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
            <Star className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">积分政策</h1>
        </div>
        <p className="text-gray-600 mb-8">本政策明确积分的获取、使用与有效期细则，提升会员体验并规范积分体系。</p>

        {/* 重要提示 */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700 font-semibold">重要条款：积分不具现金属性，不可转让或兑现；平台有权根据活动调整积分规则。</p>
        </div>

        {/* 条款内容 - 分段编号 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ol className="list-decimal pl-6 space-y-4 text-gray-800 text-base sm:text-lg">
            <li>
              积分获取：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>下单完成、评价商品、参与活动等均可能获得积分。</li>
                <li>不同会员等级的积分倍率可能存在差异。</li>
                <li>违规或异常订单将不予计入或会扣减积分。</li>
              </ol>
            </li>
            <li>
              积分使用与兑换：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>积分可抵扣订单金额或兑换指定权益（以页面说明为准）。</li>
                <li className="font-semibold text-red-600">积分使用后不找零，不可撤销。</li>
                <li>部分商品或活动可能不支持积分抵扣。</li>
              </ol>
            </li>
            <li>
              有效期与清零：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>积分需在有效期内使用，过期将自动清零。</li>
                <li>如有特殊活动延长期限，以活动规则为准。</li>
              </ol>
            </li>
            <li>
              账户安全与异常：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>账号安全异常可能导致积分冻结或变更。</li>
                <li>经核实的违规行为平台有权调整或扣减积分。</li>
              </ol>
            </li>
            <li>
              规则调整与生效：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>平台会根据运营情况对积分政策进行调整，并提前公告。</li>
                <li>调整后政策以最新版本为准，请及时关注。</li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PolicyPoints;