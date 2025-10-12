import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  Users, 
  Shield, 
  Lock, 
  FileText, 
  Settings as SettingsIcon,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  UserCheck,
  Crown,
  Key
} from 'lucide-react';

// 导入子页面组件
import AdminsList from './settings/AdminsList';
import AdminDetail from './settings/AdminDetail';
import RolesList from './settings/RolesList';
import AuditLogs from './settings/AuditLogs';

// 统计卡片组件
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// 导航项组件
interface NavItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 text-left rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <div className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      {badge && badge > 0 && (
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

// 最近活动项组件
interface ActivityItemProps {
  action: string;
  description: string;
  time: string;
  user: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, description, time, user, type }) => {
  const typeConfig = {
    success: { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" /> },
    warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <AlertTriangle className="w-4 h-4" /> },
    error: { color: 'text-red-600', bg: 'bg-red-100', icon: <AlertTriangle className="w-4 h-4" /> },
    info: { color: 'text-blue-600', bg: 'bg-blue-100', icon: <Activity className="w-4 h-4" /> }
  };

  const config = typeConfig[type];

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
        <div className={config.color}>
          {config.icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{action}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">操作者: {user}</p>
      </div>
    </div>
  );
};

// 主设置页面组件
const SettingsOverview: React.FC = () => {
  const { 
    adminStats,
    adminStatsLoading,
    auditLogs,
    auditLogsLoading,
    fetchAdminStats,
    fetchAuditLogs
  } = useStore();

  useEffect(() => {
    fetchAdminStats();
    fetchAuditLogs({ limit: 10 });
  }, [fetchAdminStats, fetchAuditLogs]);

  // 模拟最近活动数据
  const recentActivities = [
    {
      action: '管理员登录',
      description: '张三 登录了系统',
      time: '2分钟前',
      user: '张三',
      type: 'success' as const
    },
    {
      action: '角色权限修改',
      description: '修改了操作员角色的权限设置',
      time: '15分钟前',
      user: '李四',
      type: 'warning' as const
    },
    {
      action: '新增管理员',
      description: '创建了新的管理员账户 "王五"',
      time: '1小时前',
      user: '管理员',
      type: 'info' as const
    },
    {
      action: '密码重置',
      description: '重置了用户 "赵六" 的密码',
      time: '2小时前',
      user: '张三',
      type: 'warning' as const
    },
    {
      action: '账户锁定',
      description: '锁定了异常登录的管理员账户',
      time: '3小时前',
      user: '系统',
      type: 'error' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* 系统概览 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">系统概览</h2>
        {adminStatsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : adminStats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="总管理员数"
              value={adminStats.total_admins}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="活跃管理员"
              value={adminStats.active_admins}
              icon={<UserCheck className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="在线管理员"
              value={adminStats.online_admins}
              icon={<Activity className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
            />
            <StatsCard
              title="锁定账户"
              value={adminStats.locked_admins}
              icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
              color="bg-red-100"
              trend={{ value: 2, isPositive: false }}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">加载统计数据失败</div>
          </div>
        )}
      </div>

      {/* 快速操作 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">添加管理员</div>
              <div className="text-sm text-gray-500">创建新的管理员账户</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">管理角色</div>
              <div className="text-sm text-gray-500">配置角色和权限</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Lock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">安全设置</div>
              <div className="text-sm text-gray-500">配置安全策略</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">审计日志</div>
              <div className="text-sm text-gray-500">查看系统日志</div>
            </div>
          </button>
        </div>
      </div>

      {/* 最近活动 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近活动</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            查看全部
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {auditLogsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-0">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  action={activity.action}
                  description={activity.description}
                  time={activity.time}
                  user={activity.user}
                  type={activity.type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动记录</h3>
              <p className="text-gray-500">系统中还没有任何活动记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  // 根据当前路径设置活跃状态
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admins')) {
      setActiveSection('admins');
    } else if (path.includes('/roles')) {
      setActiveSection('roles');
    } else if (path.includes('/security')) {
      setActiveSection('security');
    } else if (path.includes('/audit')) {
      setActiveSection('audit');
    } else {
      setActiveSection('overview');
    }
  }, [location.pathname]);

  const navigationItems = [
    {
      id: 'overview',
      label: '系统概览',
      icon: <SettingsIcon className="w-5 h-5" />,
      path: '/admin/settings'
    },
    {
      id: 'admins',
      label: '管理员账户',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/settings/admins'
    },
    {
      id: 'roles',
      label: '角色权限',
      icon: <Shield className="w-5 h-5" />,
      path: '/admin/settings/roles'
    },
    {
      id: 'security',
      label: '安全设置',
      icon: <Lock className="w-5 h-5" />,
      path: '/admin/settings/security'
    },
    {
      id: 'audit',
      label: '审计日志',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/settings/audit',
      badge: 5
    }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    setActiveSection(item.id);
    navigate(item.path);
  };

  return (
    <div className="flex h-full">
      {/* 侧边导航 */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">系统设置</h1>
          <p className="text-sm text-gray-600 mt-1">管理系统配置和权限</p>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeSection === item.id}
              onClick={() => handleNavigation(item)}
              badge={item.badge}
            />
          ))}
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<SettingsOverview />} />
            <Route path="/admins" element={<AdminsList />} />
            <Route path="/admins/:adminId" element={<AdminDetail />} />
            <Route path="/roles" element={<RolesList />} />
            <Route path="/security" element={
              <div className="text-center py-12">
                <Lock className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">安全设置</h3>
                <p className="text-gray-500">此功能正在开发中，敬请期待</p>
              </div>
            } />
            <Route path="/audit" element={<AuditLogs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Settings;