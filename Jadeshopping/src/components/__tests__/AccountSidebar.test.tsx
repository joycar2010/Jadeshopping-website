import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AccountSidebar, { SidebarGroup } from '../AccountSidebar';
import { Package, User, Wallet } from 'lucide-react';

const groups: SidebarGroup[] = [
  {
    id: 'account',
    title: 'My Account',
    items: [
      { name: '个人资料', nameCn: '个人资料', path: '/settings', icon: User },
      { name: '地址簿', nameCn: '地址簿', path: '/address', icon: User },
    ],
  },
  {
    id: 'orders',
    title: 'My Orders',
    items: [
      { name: '所有订单', nameCn: '所有订单', path: '/orders', icon: Package },
    ],
  },
  {
    id: 'assets',
    title: 'My Assets',
    items: [
      { name: '我的钱包', nameCn: '我的钱包', path: '/wallet', icon: Wallet },
    ],
  },
];

beforeEach(() => {
  // 清理持久化状态
  localStorage.clear();
});

describe('AccountSidebar', () => {
  it('渲染分组标题与导航项', () => {
    render(
      <MemoryRouter initialEntries={['/']}> 
        <AccountSidebar groups={groups} />
      </MemoryRouter>
    );

    // 分组标题
    const nav = screen.getByRole('navigation', { name: 'Account Navigation' });
    expect(within(nav).getByText('My Account')).toBeInTheDocument();
    expect(within(nav).getByText('My Orders')).toBeInTheDocument();

    // 导航项采用 href 精确匹配，避免文本匹配歧义
    const ordersLink = document.querySelector('a[href="/orders"]');
    const walletLink = document.querySelector('a[href="/wallet"]');
    expect(ordersLink).toBeInTheDocument();
    expect(walletLink).toBeInTheDocument();
  });

  it('折叠状态持久化：预置为折叠后点击可展开', async () => {
    // 预置 orders 分组为折叠
    localStorage.setItem('accountSidebar:collapsedGroups', JSON.stringify(['orders']));

    render(
      <MemoryRouter initialEntries={['/']}> 
        <AccountSidebar groups={groups} />
      </MemoryRouter>
    );

    const ordersHeader = screen.getByText('My Orders');

    // 通过分组容器的 hidden 类判断折叠状态（不依赖CSS渲染）
    const groupContainer = ordersHeader.parentElement?.nextElementSibling as HTMLElement;
    expect(groupContainer).toHaveClass('hidden');

    // 点击分组标题展开
    await userEvent.click(ordersHeader);
    expect(groupContainer).not.toHaveClass('hidden');
  });

  it('激活状态：当路由匹配时高亮', () => {
    render(
      <MemoryRouter initialEntries={['/orders']}> 
        <AccountSidebar groups={groups} />
      </MemoryRouter>
    );

    const ordersLink = document.querySelector('a[href="/orders"]');
    expect(ordersLink).toHaveClass('bg-black');
    expect(ordersLink).toHaveClass('text-white');
  });

  it('国际化：中文环境显示 nameCn', () => {
    // 设置为中文语言环境
    Object.defineProperty(window.navigator, 'language', { value: 'zh-CN', configurable: true });

    render(
      <MemoryRouter initialEntries={['/']}> 
        <AccountSidebar groups={groups} />
      </MemoryRouter>
    );

    // 中文显示断言：在 orders 链接中查找中文文本
    const ordersLink = document.querySelector('a[href="/orders"]') as HTMLElement;
    expect(within(ordersLink).getByText('所有订单')).toBeInTheDocument();
  });
});