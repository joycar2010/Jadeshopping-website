import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Crown } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

// 与 Wallet 页一致的默认头像占位
const defaultAvatar = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%20elegant%20person&image_size=square';

// 会员等级类型，保持与 Wallet 页一致
type MembershipLevel = 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM';

// 组件 Props，菜单数据通过 props 控制
export interface SidebarItem {
  name: string;
  nameCn?: string;
  path: string;
  icon: React.ComponentType<any>;
  requiresAuth?: boolean;
  isActive?: boolean; // 可选手手激活（将被统一逻辑覆盖）
  disabled?: boolean;
}

export interface SidebarGroup {
  id?: string;
  title: string;
  titleCn?: string;
  items: SidebarItem[];
}

interface AccountSidebarProps {
  groups: SidebarGroup[];
  collapsible?: boolean;
  persistCollapse?: boolean;
  rememberKey?: string;
  loading?: boolean;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ groups, collapsible = true, persistCollapse = true, rememberKey = 'accountSidebar:collapsedGroups', loading = false }) => {
  const { user, isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 折叠状态（持久化）
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>(() => {
    if (!persistCollapse) return [];
    try {
      const raw = localStorage.getItem(rememberKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (persistCollapse) {
      try {
        localStorage.setItem(rememberKey, JSON.stringify(collapsedGroups));
      } catch {}
    }
  }, [collapsedGroups, persistCollapse, rememberKey]);

  // 会员等级状态与可视化（统一管理）
  const [membershipLevel, setMembershipLevel] = useState<MembershipLevel>('BASIC');
  const [levelLoading, setLevelLoading] = useState(false);
  const [levelError, setLevelError] = useState<string | null>(null);

  const getMembershipVisuals = (level: MembershipLevel) => {
    switch (level) {
      case 'PLATINUM':
        return { label: '铂金会员', iconClass: 'text-indigo-600' };
      case 'GOLD':
        return { label: '金牌会员', iconClass: 'text-yellow-500' };
      case 'SILVER':
        return { label: '白银会员', iconClass: 'text-gray-500' };
      default:
        return { label: '普通会员', iconClass: 'text-gray-400' };
    }
  };

  const levelVisuals = useMemo(() => getMembershipVisuals(membershipLevel), [membershipLevel]);

  const fetchMembership = async () => {
    if (!user?.id) return;
    setLevelLoading(true);
    setLevelError(null);
    try {
      const res = await fetch(`/api/membership?userId=${encodeURIComponent(user.id)}`);
      if (!res.ok) throw new Error('Failed to fetch membership');
      const data = await res.json();
      const lvl = (data?.level || 'BASIC') as MembershipLevel;
      setMembershipLevel(['BASIC', 'SILVER', 'GOLD', 'PLATINUM'].includes(lvl) ? lvl : 'BASIC');
    } catch (e: any) {
      setLevelError(e?.message || '网络错误');
      setMembershipLevel('BASIC');
    } finally {
      setLevelLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
    const id = setInterval(fetchMembership, 60000);
    return () => clearInterval(id);
  }, [user?.id]);

  // 统一的激活状态判断逻辑（支持查询参数）
  const isRouteActive = (targetPath?: string) => {
    if (!targetPath) return false;
    const [targetBase, targetQuery] = targetPath.split('?');
    const currentBase = location.pathname;
    const currentQuery = location.search.replace(/^\?/, '');

    if (targetQuery) {
      // 所有查询键必须在当前搜索串中出现（宽松匹配）
      const requiredPairs = targetQuery.split('&').filter(Boolean);
      const hasAllPairs = requiredPairs.every(pair => currentQuery.includes(pair));
      return currentBase === targetBase && hasAllPairs;
    }
    return currentBase === targetBase;
  };

  const localeIsZh = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('zh');

  const toggleGroup = (id: string) => {
    if (!collapsible) return;
    setCollapsedGroups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const preloadPath = (path: string) => {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
      setTimeout(() => document.head.removeChild(link), 10000);
    } catch {}
  };

  // 渲染
  return (
    <div className="account-sidebar w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* 头部用户信息，与 Wallet 页一致 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || defaultAvatar}
              alt={user?.name || 'avatar'}
              className="h-12 w-12 rounded-full object-cover border"
              loading="lazy"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultAvatar; }}
            />
            <div>
              <div className="font-semibold">{user?.name || 'My Account'}</div>
              {levelLoading ? (
                <div className="text-gray-500 text-sm">
                  <span className="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded"></span>
                </div>
              ) : (
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <Crown className={`h-4 w-4 ${levelVisuals.iconClass}`} />
                  <span>{levelVisuals.label}</span>
                </div>
              )}
              {levelError && (
                <div className="text-xs text-red-500 mt-1">等级获取失败，显示默认</div>
              )}
            </div>
          </div>
        </div>

        {/* 导航菜单，与 Wallet 页 nav 完全同构 */}
        <nav className="p-2" role="navigation" aria-label="Account Navigation">
          {groups.map((group, gi) => {
            const groupId = group.id || group.title;
            const isCollapsed = collapsible && collapsedGroups.includes(groupId);
            return (
              <div key={gi} className="mb-3">
                <div
                  className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase nav-group-title cursor-pointer select-none"
                  role={collapsible ? 'button' : undefined}
                  aria-expanded={collapsible ? (!isCollapsed) : undefined}
                  tabIndex={collapsible ? 0 : -1}
                  onClick={() => toggleGroup(groupId)}
                  onKeyDown={(e) => {
                    if (!collapsible) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleGroup(groupId);
                    }
                  }}
                >
                  <span>{group.title}</span>
                  {group.titleCn && <span className="ml-2 text-gray-400">{group.titleCn}</span>}
                </div>
                <div className={`flex flex-col gap-1 ${isCollapsed ? 'hidden' : ''}`}>
                  {group.items.map((item, ii) => {
                    const Icon = (item.icon ?? Crown) as any;
                    const active = item.isActive ?? isRouteActive(item.path);
                    const blocked = (item.requiresAuth && !isLoggedIn) || item.disabled;
                    const displayName = localeIsZh ? (item.nameCn || item.name) : item.name;

                    return (
                      <Link
                        key={ii}
                        to={blocked ? '#' : item.path}
                        onMouseEnter={() => preloadPath(item.path)}
                        onClick={(e) => {
                          if (blocked) {
                            e.preventDefault();
                            navigate(`/login?redirect=${encodeURIComponent(item.path)}`);
                          }
                        }}
                        aria-disabled={blocked}
                        className={`flex items-center justify-between px-3 py-2 rounded-md nav-item ${
                          active ? 'bg-black text-white' : 'hover:bg-gray-50'
                        } ${blocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`nav-icon h-4 w-4 ${active ? 'text-white' : 'text-gray-600'}`} />
                          <span className="text-sm">{displayName}</span>
                          {item.nameCn && !localeIsZh && <span className="text-xs text-gray-500">{item.nameCn}</span>}
                        </div>
                        <ChevronRight className={`h-4 w-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AccountSidebar;