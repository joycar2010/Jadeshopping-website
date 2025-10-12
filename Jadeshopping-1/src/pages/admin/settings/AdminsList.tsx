import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  MoreHorizontal,
  Download,
  Upload,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  Clock,
  Activity,
  Users as UsersIcon
} from 'lucide-react';
import type { AdminDetail, AdminFilters, AdminRole } from '@/types';

// 管理员状态标签组件
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'locked';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    active: { label: '活跃', color: 'bg-green-100 text-green-800' },
    inactive: { label: '未激活', color: 'bg-yellow-100 text-yellow-800' },
    locked: { label: '已锁定', color: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// 角色标签组件
interface RoleBadgeProps {
  role: AdminRole;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const roleConfig = {
    super_admin: { label: '超级管理员', color: 'bg-purple-100 text-purple-800' },
    admin: { label: '管理员', color: 'bg-blue-100 text-blue-800' },
    manager: { label: '经理', color: 'bg-green-100 text-green-800' },
    operator: { label: '操作员', color: 'bg-gray-100 text-gray-800' },
    viewer: { label: '查看者', color: 'bg-yellow-100 text-yellow-800' }
  };

  const config = roleConfig[role];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Shield className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// 管理员表格行组件
interface AdminRowProps {
  admin: AdminDetail;
  onEdit: (admin: AdminDetail) => void;
  onDelete: (adminId: string) => void;
  onToggleStatus: (adminId: string, status: 'active' | 'inactive' | 'locked') => void;
  onViewDetails: (adminId: string) => void;
  onResetPassword: (adminId: string) => void;
  isSelected: boolean;
  onSelect: (adminId: string, selected: boolean) => void;
}

const AdminRow: React.FC<AdminRowProps> = ({ 
  admin, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewDetails,
  onResetPassword,
  isSelected,
  onSelect
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(admin.id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {admin.avatar ? (
              <img className="h-10 w-10 rounded-full object-cover" src={admin.avatar} alt={admin.full_name} />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {admin.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{admin.full_name}</div>
            <div className="text-sm text-gray-500">@{admin.username}</div>
            <div className="text-sm text-gray-500">{admin.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RoleBadge role={admin.role} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <StatusBadge status={admin.status} />
          {admin.is_online && (
            <div className="flex items-center text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              在线
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="space-y-1">
          <div>{new Date(admin.created_at).toLocaleDateString('zh-CN')}</div>
          <div className="text-xs">
            {admin.last_login_at ? new Date(admin.last_login_at).toLocaleDateString('zh-CN') : '从未登录'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="space-y-1">
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            {admin.login_count} 次登录
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {admin.last_activity_at ? new Date(admin.last_activity_at).toLocaleDateString('zh-CN') : '无活动'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onViewDetails(admin.id);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  查看详情
                </button>
                <button
                  onClick={() => {
                    onEdit(admin);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑管理员
                </button>
                <button
                  onClick={() => {
                    onResetPassword(admin.id);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Key className="w-4 h-4 mr-2" />
                  重置密码
                </button>
                <button
                  onClick={() => {
                    onToggleStatus(admin.id, admin.status === 'active' ? 'locked' : 'active');
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {admin.status === 'active' ? (
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
                  onClick={() => {
                    onDelete(admin.id);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除管理员
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// 筛选器组件
interface FilterPanelProps {
  filters: AdminFilters;
  onFiltersChange: (filters: AdminFilters) => void;
  onReset: () => void;
  adminRoles: AdminRole[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset, adminRoles }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">未激活</option>
            <option value="locked">已锁定</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
          <select
            value={filters.role || ''}
            onChange={(e) => onFiltersChange({ ...filters, role: e.target.value as AdminRole })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部角色</option>
            <option value="super_admin">超级管理员</option>
            <option value="admin">管理员</option>
            <option value="manager">经理</option>
            <option value="operator">操作员</option>
            <option value="viewer">查看者</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
          <input
            type="date"
            value={filters.created_after || ''}
            onChange={(e) => onFiltersChange({ ...filters, created_after: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">最后登录</label>
          <input
            type="date"
            value={filters.last_login_after || ''}
            onChange={(e) => onFiltersChange({ ...filters, last_login_after: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">在线状态</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.is_online === true}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  is_online: e.target.checked ? true : undefined 
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">仅显示在线</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>
  );
};

// 统计卡片组件
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AdminsList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    // 管理员数据
    allAdmins,
    allAdminsLoading,
    adminStats,
    adminStatsLoading,
    adminFilters,
    
    // 方法
    fetchAllAdmins,
    fetchAdminStats,
    updateAdminStatus,
    deleteAdmin,
    lockAdmin,
    unlockAdmin,
    resetAdminPassword
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AdminFilters>(adminFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAllAdmins();
    fetchAdminStats();
  }, [fetchAllAdmins, fetchAdminStats]);

  // 筛选和搜索管理员
  const filteredAdmins = (allAdmins || []).filter(admin => {
    // 搜索过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!admin.full_name.toLowerCase().includes(searchLower) && 
          !admin.email.toLowerCase().includes(searchLower) &&
          !admin.username.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // 状态过滤
    if (filters.status && admin.status !== filters.status) {
      return false;
    }

    // 角色过滤
    if (filters.role && admin.role !== filters.role) {
      return false;
    }

    // 创建时间过滤
    if (filters.created_after && 
        new Date(admin.created_at) < new Date(filters.created_after)) {
      return false;
    }

    // 最后登录时间过滤
    if (filters.last_login_after && admin.last_login_at && 
        new Date(admin.last_login_at) < new Date(filters.last_login_after)) {
      return false;
    }

    // 在线状态过滤
    if (filters.is_online !== undefined && admin.is_online !== filters.is_online) {
      return false;
    }

    return true;
  });

  // 分页
  const totalPages = Math.ceil(filteredAdmins.length / pageSize);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (admin: AdminDetail) => {
    navigate(`/admin/settings/admins/${admin.id}/edit`);
  };

  const handleViewDetails = (adminId: string) => {
    navigate(`/admin/settings/admins/${adminId}`);
  };

  const handleDelete = async (adminId: string) => {
    if (window.confirm('确定要删除这个管理员吗？此操作不可撤销。')) {
      const success = await deleteAdmin(adminId);
      if (success) {
        console.log('管理员删除成功');
      } else {
        alert('删除管理员失败，请重试');
      }
    }
  };

  const handleToggleStatus = async (adminId: string, status: 'active' | 'inactive' | 'locked') => {
    let success = false;
    
    if (status === 'locked') {
      success = await lockAdmin(adminId);
    } else if (status === 'active') {
      success = await unlockAdmin(adminId);
    } else {
      success = await updateAdminStatus(adminId, status);
    }
    
    if (success) {
      console.log('管理员状态更新成功');
    } else {
      alert('更新管理员状态失败，请重试');
    }
  };

  const handleResetPassword = async (adminId: string) => {
    if (window.confirm('确定要重置这个管理员的密码吗？新密码将通过邮件发送。')) {
      const success = await resetAdminPassword(adminId);
      if (success) {
        alert('密码重置成功，新密码已发送到管理员邮箱');
      } else {
        alert('密码重置失败，请重试');
      }
    }
  };

  const handleSelectAdmin = (adminId: string, selected: boolean) => {
    if (selected) {
      setSelectedAdmins(prev => [...prev, adminId]);
    } else {
      setSelectedAdmins(prev => prev.filter(id => id !== adminId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedAdmins(paginatedAdmins.map(admin => admin.id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      role: undefined,
      created_after: undefined,
      last_login_after: undefined,
      is_online: undefined
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (allAdminsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理员账户</h1>
          <p className="text-gray-600">管理系统中的所有后台管理员账户</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            导出
          </button>
          <button 
            onClick={() => navigate('/admin/settings/admins/add')}
            className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加管理员
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      {adminStats && !adminStatsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="总管理员数"
            value={adminStats.total_admins}
            icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatsCard
            title="活跃管理员"
            value={adminStats.active_admins}
            icon={<Activity className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatsCard
            title="在线管理员"
            value={adminStats.online_admins}
            icon={<UserCheck className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatsCard
            title="锁定账户"
            value={adminStats.locked_admins}
            icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
            color="bg-red-100"
          />
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索管理员姓名、用户名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 text-sm border rounded-md transition-colors ${
              showFilters 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            高级筛选
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          共 {filteredAdmins.length} 个管理员
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          adminRoles={['super_admin', 'admin', 'manager', 'operator', 'viewer']}
        />
      )}

      {/* 管理员表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedAdmins.length === paginatedAdmins.length && paginatedAdmins.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  管理员信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活动统计
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAdmins.map((admin) => (
                <AdminRow
                  key={admin.id}
                  admin={admin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onViewDetails={handleViewDetails}
                  onResetPassword={handleResetPassword}
                  isSelected={selectedAdmins.includes(admin.id)}
                  onSelect={handleSelectAdmin}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, filteredAdmins.length)} 条，
                共 {filteredAdmins.length} 条记录
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="text-sm text-gray-700">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 空状态 */}
      {filteredAdmins.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <UsersIcon className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到管理员</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some(v => v !== undefined && v !== '')
              ? '尝试调整搜索条件或筛选器' 
              : '系统中还没有管理员'}
          </p>
          {(searchTerm || Object.values(filters).some(v => v !== undefined && v !== '')) && (
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              清除筛选条件
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminsList;