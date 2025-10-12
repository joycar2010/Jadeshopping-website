import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Key,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  Shield,
  MapPin,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Settings,
  User,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';
import { AdminDetailEnhanced, AuditLog } from '@/types';
import { UserPermissionAssignment } from './PermissionManagement';

// 状态标签组件
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'locked';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    active: { 
      label: '活跃', 
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="w-4 h-4" />
    },
    inactive: { 
      label: '未激活', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="w-4 h-4" />
    },
    locked: { 
      label: '已锁定', 
      color: 'bg-red-100 text-red-800',
      icon: <XCircle className="w-4 h-4" />
    }
  };

  const config = statusConfig[status];
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </span>
  );
};

// 角色标签组件
interface RoleBadgeProps {
  role: AdminRole;
  size?: 'sm' | 'md' | 'lg';
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const roleConfig = {
    super_admin: { label: '超级管理员', color: 'bg-purple-100 text-purple-800' },
    admin: { label: '管理员', color: 'bg-blue-100 text-blue-800' },
    manager: { label: '经理', color: 'bg-green-100 text-green-800' },
    operator: { label: '操作员', color: 'bg-gray-100 text-gray-800' },
    viewer: { label: '查看者', color: 'bg-yellow-100 text-yellow-800' }
  };

  const config = roleConfig[role];
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      <Shield className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
};

// 信息卡片组件
interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, icon, actions }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon && <div className="mr-3 text-gray-500">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

// 统计项组件
interface StatItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color = 'text-gray-600' }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        {icon && <div className={`mr-2 ${color}`}>{icon}</div>}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
};

// 活动日志项组件
interface ActivityItemProps {
  log: AuditLog;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ log }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <User className="w-4 h-4 text-green-600" />;
      case 'logout':
        return <User className="w-4 h-4 text-gray-600" />;
      case 'create':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'update':
        return <Edit className="w-4 h-4 text-yellow-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'text-green-600';
      case 'logout':
        return 'text-gray-600';
      case 'create':
        return 'text-blue-600';
      case 'update':
        return 'text-yellow-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 mt-1">
        {getActionIcon(log.action)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-900">
            <span className={`font-medium ${getActionColor(log.action)}`}>
              {log.action}
            </span>
            {' '}
            {log.description}
          </p>
          <span className="text-xs text-gray-500">
            {new Date(log.created_at).toLocaleString('zh-CN')}
          </span>
        </div>
        {log.ip_address && (
          <p className="text-xs text-gray-500 mt-1">
            IP: {log.ip_address}
            {log.user_agent && ` • ${log.user_agent.substring(0, 50)}...`}
          </p>
        )}
      </div>
    </div>
  );
};

const AdminDetailPage: React.FC = () => {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const { 
    selectedAdmin,
    selectedAdminLoading,
    auditLogs,
    auditLogsLoading,
    
    fetchAdminById,
    fetchAuditLogs,
    updateAdminStatus,
    deleteAdmin,
    lockAdmin,
    unlockAdmin,
    resetAdminPassword,
    updateAdminPermissions
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'activity' | 'security'>('overview');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  useEffect(() => {
    if (adminId) {
      fetchAdminById(adminId);
      fetchAuditLogs({ admin_id: adminId });
    }
  }, [adminId, fetchAdminById, fetchAuditLogs]);

  const handleEdit = () => {
    navigate(`/admin/settings/admins/${adminId}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    if (window.confirm('确定要删除这个管理员吗？此操作不可撤销。')) {
      const success = await deleteAdmin(selectedAdmin.id);
      if (success) {
        navigate('/admin/settings/admins');
      } else {
        alert('删除管理员失败，请重试');
      }
    }
  };

  const handleToggleStatus = async (status: 'active' | 'inactive' | 'locked') => {
    if (!selectedAdmin) return;
    
    let success = false;
    
    if (status === 'locked') {
      success = await lockAdmin(selectedAdmin.id);
    } else if (status === 'active') {
      success = await unlockAdmin(selectedAdmin.id);
    } else {
      success = await updateAdminStatus(selectedAdmin.id, status);
    }
    
    if (success) {
      console.log('管理员状态更新成功');
    } else {
      alert('更新管理员状态失败，请重试');
    }
  };

  const handleResetPassword = async () => {
    if (!selectedAdmin) return;
    
    if (window.confirm('确定要重置这个管理员的密码吗？新密码将通过邮件发送。')) {
      const success = await resetAdminPassword(selectedAdmin.id);
      if (success) {
        alert('密码重置成功，新密码已发送到管理员邮箱');
      } else {
        alert('密码重置失败，请重试');
      }
    }
  };

  if (selectedAdminLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
          <User className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">管理员不存在</h3>
        <p className="text-gray-500 mb-4">请检查管理员ID是否正确</p>
        <button
          onClick={() => navigate('/admin/settings/admins')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          返回管理员列表
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '基本信息', icon: <User className="w-4 h-4" /> },
    { id: 'permissions', label: '权限管理', icon: <Shield className="w-4 h-4" /> },
    { id: 'activity', label: '活动记录', icon: <Activity className="w-4 h-4" /> },
    { id: 'security', label: '安全设置', icon: <Lock className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/settings/admins')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            返回
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">管理员详情</h1>
            <p className="text-gray-600">查看和管理管理员账户信息</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
            className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showSensitiveInfo ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showSensitiveInfo ? '隐藏敏感信息' : '显示敏感信息'}
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </button>
        </div>
      </div>

      {/* 管理员基本信息卡片 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {selectedAdmin.avatar ? (
                <img 
                  className="h-20 w-20 rounded-full object-cover" 
                  src={selectedAdmin.avatar} 
                  alt={selectedAdmin.full_name} 
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-2xl">
                    {selectedAdmin.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{selectedAdmin.full_name}</h2>
                <StatusBadge status={selectedAdmin.status} size="md" />
                <RoleBadge role={selectedAdmin.role} size="md" />
                {selectedAdmin.is_online && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    在线
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  @{selectedAdmin.username}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {showSensitiveInfo ? selectedAdmin.email : selectedAdmin.email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                </div>
                {selectedAdmin.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {showSensitiveInfo ? selectedAdmin.phone : selectedAdmin.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  创建于 {new Date(selectedAdmin.created_at).toLocaleDateString('zh-CN')}
                </div>
                {selectedAdmin.last_login_at && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    最后登录 {new Date(selectedAdmin.last_login_at).toLocaleString('zh-CN')}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleToggleStatus(selectedAdmin.status === 'active' ? 'locked' : 'active')}
              className={`flex items-center px-3 py-2 text-sm rounded-md ${
                selectedAdmin.status === 'active'
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-green-600 bg-green-50 hover:bg-green-100'
              }`}
            >
              {selectedAdmin.status === 'active' ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  锁定账户
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  解锁账户
                </>
              )}
            </button>
            <button
              onClick={handleResetPassword}
              className="flex items-center px-3 py-2 text-sm text-yellow-600 bg-yellow-50 rounded-md hover:bg-yellow-100"
            >
              <Key className="w-4 h-4 mr-2" />
              重置密码
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除账户
            </button>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <InfoCard title="基本信息" icon={<User className="w-5 h-5" />}>
              <div className="space-y-3">
                <StatItem label="用户名" value={selectedAdmin.username} />
                <StatItem label="全名" value={selectedAdmin.full_name} />
                <StatItem label="邮箱" value={showSensitiveInfo ? selectedAdmin.email : selectedAdmin.email.replace(/(.{2}).*(@.*)/, '$1***$2')} />
                {selectedAdmin.phone && (
                  <StatItem label="电话" value={showSensitiveInfo ? selectedAdmin.phone : selectedAdmin.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')} />
                )}
                <StatItem label="角色" value={<RoleBadge role={selectedAdmin.role} size="sm" />} />
                <StatItem label="状态" value={<StatusBadge status={selectedAdmin.status} size="sm" />} />
              </div>
            </InfoCard>

            {/* 统计信息 */}
            <InfoCard title="活动统计" icon={<BarChart3 className="w-5 h-5" />}>
              <div className="space-y-3">
                <StatItem 
                  label="登录次数" 
                  value={selectedAdmin.login_count} 
                  icon={<Activity className="w-4 h-4" />}
                  color="text-blue-600"
                />
                <StatItem 
                  label="创建时间" 
                  value={new Date(selectedAdmin.created_at).toLocaleDateString('zh-CN')} 
                  icon={<Calendar className="w-4 h-4" />}
                  color="text-green-600"
                />
                <StatItem 
                  label="最后登录" 
                  value={selectedAdmin.last_login_at ? new Date(selectedAdmin.last_login_at).toLocaleString('zh-CN') : '从未登录'} 
                  icon={<Clock className="w-4 h-4" />}
                  color="text-purple-600"
                />
                <StatItem 
                  label="最后活动" 
                  value={selectedAdmin.last_activity_at ? new Date(selectedAdmin.last_activity_at).toLocaleString('zh-CN') : '无记录'} 
                  icon={<Activity className="w-4 h-4" />}
                  color="text-orange-600"
                />
                <StatItem 
                  label="在线状态" 
                  value={selectedAdmin.is_online ? '在线' : '离线'} 
                  icon={selectedAdmin.is_online ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  color={selectedAdmin.is_online ? 'text-green-600' : 'text-gray-600'}
                />
              </div>
            </InfoCard>
          </div>
        )}

        {activeTab === 'permissions' && selectedAdmin && (
          <InfoCard title="权限管理" icon={<Shield className="w-5 h-5" />}>
            <UserPermissionAssignment
              user={selectedAdmin}
              onSave={async (userId, permissions) => {
                try {
                  await updateAdminPermissions(userId, permissions);
                  await fetchAdminById(selectedAdmin.id);
                } catch (error) {
                  console.error('更新权限失败:', error);
                }
              }}
              onCancel={() => setActiveTab('overview')}
            />
          </InfoCard>
        )}

        {activeTab === 'activity' && (
          <InfoCard 
            title="活动记录" 
            icon={<Activity className="w-5 h-5" />}
            actions={
              <button
                onClick={() => fetchAuditLogs({ admin_id: adminId })}
                className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                刷新
              </button>
            }
          >
            {auditLogsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : auditLogs && auditLogs.length > 0 ? (
              <div className="space-y-0">
                {auditLogs.slice(0, 10).map((log) => (
                  <ActivityItem key={log.id} log={log} />
                ))}
                {auditLogs.length > 10 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      查看更多活动记录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动记录</h3>
                <p className="text-gray-500">该管理员还没有任何活动记录</p>
              </div>
            )}
          </InfoCard>
        )}

        {activeTab === 'security' && (
          <InfoCard title="安全设置" icon={<Lock className="w-5 h-5" />}>
            <div className="text-center py-8">
              <Lock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">安全设置功能</h3>
              <p className="text-gray-500">此功能正在开发中，敬请期待</p>
            </div>
          </InfoCard>
        )}
      </div>
    </div>
  );
};

export default AdminDetailPage;