import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/nav.scss';

// 在开发环境禁用 StrictMode，以避免 React 18 的双渲染导致重复日志
const enableStrictMode = import.meta.env.MODE === 'production' || import.meta.env.VITE_ENABLE_STRICT_MODE === 'true';

ReactDOM.createRoot(document.getElementById('root')!).render(
  enableStrictMode ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);
