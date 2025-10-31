import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
        <Link to="/admin">管理首页</Link>
        <Link to="/admin/login">登录</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}