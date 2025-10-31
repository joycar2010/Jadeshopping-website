import React from 'react';
import { CreditCard, AlertTriangle } from 'lucide-react';

const PolicyPayments: React.FC = () => {
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
            <CreditCard className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">支付方式</h1>
        </div>
        <p className="text-gray-600 mb-8">列出平台支持的支付渠道、支付限额与手续费标准，保障支付体验与安全。</p>

        {/* 重要提示 */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700 font-semibold">重要条款：支付渠道的可用性、限额及手续费可能因银行或第三方平台政策变化而调整，请以订单支付页实时显示为准。</p>
        </div>

        {/* 条款内容 - 分段编号 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ol className="list-decimal pl-6 space-y-4 text-gray-800 text-base sm:text-lg">
            <li>
              支持的支付渠道：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>银行卡（借记卡/信用卡）、第三方支付（如微信/支付宝等）。</li>
                <li>平台钱包余额、部分合作渠道支付（以页面显示为准）。</li>
              </ol>
            </li>
            <li>
              支付限额：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>单笔与每日限额依各银行与渠道规则确定。</li>
                <li>大额支付可能需要额外验证与风控审核。</li>
              </ol>
            </li>
            <li>
              手续费与成本：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>如产生渠道手续费，会在结算时明确提示。</li>
                <li>使用分期或特殊支付方案可能产生额外费用。</li>
              </ol>
            </li>
            <li>
              支付安全与异常：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>支付过程采用加密与风险控制，保障交易安全。</li>
                <li>若支付失败或重复扣款，请及时联系渠道或平台客服处理。</li>
              </ol>
            </li>
            <li>
              退款与对账：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>退款将按原路或平台钱包余额形式返还，时间依渠道而定。</li>
                <li>订单对账与支付纠纷处理以相关法律法规及合作协议为准。</li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PolicyPayments;