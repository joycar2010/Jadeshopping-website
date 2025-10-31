import React from 'react';
import { Wallet as WalletIcon, AlertTriangle } from 'lucide-react';

const PolicyWallet: React.FC = () => {
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
            <WalletIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">关于钱包</h1>
        </div>
        <p className="text-gray-600 mb-8">说明钱包的功能、资金安全保障与使用限制，帮助您更好地管理平台资产。</p>

        {/* 重要提示 */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700 font-semibold">重要条款：钱包资金仅用于平台内消费与退款入账，严禁违规用途；异常风险账户可能被冻结。</p>
        </div>

        {/* 条款内容 - 分段编号 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ol className="list-decimal pl-6 space-y-4 text-gray-800 text-base sm:text-lg">
            <li>
              功能说明：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>用于存储退款入账与平台发放的余额。</li>
                <li>支持订单支付、部分活动权益消费。</li>
                <li>账户明细可在“我的钱包”中查询。</li>
              </ol>
            </li>
            <li>
              安全保障：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>采用风控策略与加密措施保障资金安全。</li>
                <li>登录与支付需通过多重验证确保账户安全。</li>
              </ol>
            </li>
            <li>
              使用限制：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li className="font-semibold text-red-600">钱包资金不产生利息，不支持违规转移或套现。</li>
                <li>如账号存在异常或违规行为，平台有权冻结部分功能。</li>
              </ol>
            </li>
            <li>
              异常处理：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>若发现资金异常，请及时联系客服并配合核验。</li>
                <li>经核实的违规交易将被取消并追责。</li>
              </ol>
            </li>
            <li>
              政策调整与生效：
              <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
                <li>平台可能根据业务需要调整钱包规则，并予以公告。</li>
                <li>最新政策以页面发布为准，请持续关注。</li>
              </ol>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PolicyWallet;