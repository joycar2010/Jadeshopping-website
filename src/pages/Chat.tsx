import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Phone, Mail, HelpCircle } from 'lucide-react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([
    '您好！欢迎使用在线客服，有什么可以帮您？'
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, `我：${text}`]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold">在线客服 Live Chat</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：联系方式与常见问题入口 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">联系方式</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <span>客服热线：400-000-0000（9:00-21:00）</span></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <span>邮箱：support@example.com</span></div>
                <div className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> <Link className="text-blue-600 hover:underline" to="/help">帮助中心</Link></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">服务说明</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>工作日与节假日均提供在线咨询服务。</li>
                <li>下单、物流、退换等问题可直接留言，我们会尽快回复。</li>
                <li>建议先查看 <Link to="/help" className="text-blue-600 hover:underline">帮助中心</Link> 获取快速指引。</li>
              </ul>
            </div>

            <div className="text-sm text-gray-600">
              <Link to="/settings" className="text-blue-600 hover:underline">返回账户设置</Link>
            </div>
          </div>

          {/* 右侧：简易聊天面板 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b">
                <div className="font-semibold">在线客服</div>
                <div className="text-sm text-gray-500">实时咨询 · 模拟演示（无后端）</div>
              </div>
              <div className="p-4 h-[420px] overflow-y-auto space-y-3 bg-gray-50">
                {messages.map((m, idx) => (
                  <div key={idx} className={`max-w-[80%] p-3 rounded-lg ${m.startsWith('我：') ? 'bg-blue-50 ml-auto' : 'bg-white border'}`}> 
                    {m}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-white flex items-center gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  placeholder="输入消息…"
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={sendMessage}
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  <Send className="h-4 w-4" /> 发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;