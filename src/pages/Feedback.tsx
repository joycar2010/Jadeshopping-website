import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Smile, AlertCircle, HelpCircle, Mail } from 'lucide-react';

const Feedback: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    category: 'site',
    message: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟提交成功
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold">意见反馈 Feedback</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：说明与快捷入口 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">我们重视你的声音</h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-2"><Smile className="h-4 w-4" /> 你的建议将帮助我们持续优化体验。</p>
                <p className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> 若涉及订单或售后，请优先联系在线客服。</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">快捷入口</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> <Link to="/chat" className="text-blue-600 hover:underline">在线客服</Link></li>
                <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> <Link to="/help" className="text-blue-600 hover:underline">帮助中心</Link></li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <Link to="/contact" className="text-blue-600 hover:underline">联系我们</Link></li>
              </ul>
            </div>
          </div>

          {/* 右侧：反馈表单 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">反馈类型</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="site">网站体验</option>
                      <option value="product">商品与库存</option>
                      <option value="order">订单与支付</option>
                      <option value="delivery">物流与配送</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">反馈内容</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 h-36"
                      placeholder="请描述你遇到的问题或建议"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">联系方式（可选）</label>
                    <input
                      type="email"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="邮箱，用于我们回复你（可选）"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">提交后，我们将在1-2个工作日内处理。</p>
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 flex items-center gap-2">
                      <Send className="h-4 w-4" /> 提交反馈
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
                    感谢你的反馈，我们已收到！
                  </div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>如果需要即时沟通，请使用 <Link to="/chat" className="text-blue-600 hover:underline">在线客服</Link>。</p>
                    <p>你也可以前往 <Link to="/help" className="text-blue-600 hover:underline">帮助中心</Link> 查看常见问题。</p>
                  </div>
                  <div className="mt-6">
                    <Link to="/settings" className="text-blue-600 hover:underline">返回账户设置</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;