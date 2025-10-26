import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Headset, HelpCircle } from 'lucide-react';

const FloatingSupport: React.FC = () => {
  const [open, setOpen] = useState(false);

  return createPortal(
    <div className="fixed top-3 right-3 z-50">
      {!open && (
        <button
          aria-label="在线客服"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800"
        >
          <MessageCircle className="h-5 w-5" /> 在线客服
        </button>
      )}

      {open && (
        <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <Headset className="h-5 w-5" /> 在线客服
            </div>
            <button
              aria-label="关闭"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="p-3 text-sm text-gray-700 space-y-2">
            <p>您好！需要帮助吗？您可以：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                立即 <Link to="/chat" className="text-blue-600 hover:underline">进入在线客服</Link>
              </li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> 查看 <Link to="/help" className="text-blue-600 hover:underline">帮助中心</Link></li>
            </ul>
          </div>
          <div className="p-3 border-t bg-gray-50">
            <Link
              to="/chat"
              className="block w-full text-center bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              立即咨询
            </Link>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default FloatingSupport;