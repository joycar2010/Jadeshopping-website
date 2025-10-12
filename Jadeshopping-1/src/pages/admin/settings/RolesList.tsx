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
  Shield,
  Users,
  Settings,
  Lock,
  Unlock,
  Copy,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Star,
  User
} from 'lucide-react';
import type { AdminRole, Permission } from '@/types';

// 角色类型配置
const roleConfig = {
  super_admin: { 
    label: '超级管理员', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Crown className="w-4 h-4" />,
    description: '拥有系统所有权限，可以管理其他管理员'
  },
  admin: { 
    label: '管理员', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Shield className="w-4 h-4" />,
    description: '拥有大部分管理权限，可以管理用户和内容'
  },
  manager: { 
    label: '经理', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <Star className="w-4 h-4" />,
    description: '拥有部门管理权限，可以管理下属和业务'
  },
  operator: { 
    label: '操作员', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Settings className="w-4 h-4" />,
    description: '拥有基本操作权限，可以处理日常业务'
  },
  viewer: { 
    label: '查看者', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <Eye className="w-4 h-4" />,
    description: '只有查看权限，不能进行修改操作'
  }
};

// 角色卡片组件
interface RoleCardProps {
  role: AdminRole;
  adminCount: number;
  permissions: Permission[];
  onEdit: (role: AdminRole) => void;
  onDelete: (role: AdminRole) => void;
  onViewPermissions: (role: AdminRole) => void;
  onDuplicate: (role: AdminRole) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  adminCount, 
  permissions, 
  onEdit, 
  onDelete, 
  onViewPermissions,
  onDuplicate 
}) => {
  const [showActions, setShowActions] = useState(false);
  const config = roleConfig[role];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.color}`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onViewPermissions(role);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  查看权限
                </button>
                <button
                  onClick={() => {
                    onEdit(role);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑角色
                </button>
                <button
                  onClick={() => {
                    onDuplicate(role);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制角色
                </button>
                {role !== 'super_admin' && (
                  <button
                    onClick={() => {
                      onDelete(role);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除角色
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">管理员数量</span>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{adminCount}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">权限数量</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{permissions.length}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">状态</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              活跃
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(role)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            编辑
          </button>
          <button
            onClick={() => onViewPermissions(role)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Shield className="w-4 h-4 mr-1" />
            权限
          </button>
        </div>
      </div>
    </div>
  );
};

// 权限项组件
interface PermissionItemProps {
  permission: Permission;
  isGranted: boolean;
  onToggle: (permissionId: string, granted: boolean) => void;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ permission, isGranted, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isGranted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {isGranted ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">{permission.name}</h4>
            <p className="text-xs text-gray-500">{permission.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          permission.category === 'system' ? 'bg-purple-100 text-purple-800' :
          permission.category === 'user' ? 'bg-blue-100 text-blue-800' :
          permission.category === 'content' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {permission.category}
        </span>
        <button
          onClick={() => onToggle(permission.id, !isGranted)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isGranted ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isGranted ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    adminRoles,
    adminRolesLoading,
    allPermissions,
    allPermissionsLoading,
    rolePermissions,
    
    fetchAdminRoles,
    fetchAllPermissions,
    fetchRolePermissions,
    updateRolePermissions,
    deleteRole
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // 模拟数据 - 每个角色的管理员数量
  const roleAdminCounts = {
    super_admin: 2,
    admin: 5,
    manager: 8,
    operator: 12,
    viewer: 3
  };

  useEffect(() => {
    fetchAdminRoles();
    fetchAllPermissions();
  }, [fetchAdminRoles, fetchAllPermissions]);

  const handleEdit = (role: AdminRole) => {
    navigate(`/admin/settings/roles/${role}/edit`);
  };

  const handleDelete = async (role: AdminRole) => {
    if (role === 'super_admin') {
      alert('超级管理员角色不能删除');
      return;
    }

    if (window.confirm(`确定要删除 ${roleConfig[role].label} 角色吗？此操作不可撤销。`)) {
      const success = await deleteRole(role);
      if (success) {
        console.log('角色删除成功');
      } else {
        alert('删除角色失败，请重试');
      }
    }
  };

  const handleViewPermissions = async (role: AdminRole) => {
    setSelectedRole(role);
    await fetchRolePermissions(role);
    setShowPermissionsModal(true);
  };

  const handleDuplicate = (role: AdminRole) => {
    navigate(`/admin/settings/roles/add?duplicate=${role}`);
  };

  const handlePermissionToggle = async (permissionId: string, granted: boolean) => {
    if (!selectedRole) return;

    const currentPermissions = rolePermissions[selectedRole] || [];
    let newPermissions: string[];

    if (granted) {
      newPermissions = [...currentPermissions, permissionId];
    } else {
      newPermissions = currentPermissions.filter(id => id !== permissionId);
    }

    const success = await updateRolePermissions(selectedRole, newPermissions);
    if (!success) {
      alert('更新权限失败，请重试');
    }
  };

  // 筛选角色
  const filteredRoles = (adminRoles || []).filter(role => {
    if (!searchTerm) return true;
    const config = roleConfig[role];
    return config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
           config.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (adminRolesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">角色管理</h1>
          <p className="text-gray-600">管理系统中的管理员角色和权限</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/admin/settings/roles/add')}
            className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加角色
          </button>
        </div>
      </div>

      {/* 搜索 */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索角色名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="text-sm text-gray-500">
          共 {filteredRoles.length} 个角色
        </div>
      </div>

      {/* 角色网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <RoleCard
            key={role}
            role={role}
            adminCount={roleAdminCounts[role]}
            permissions={allPermissions?.filter(p => rolePermissions[role]?.includes(p.id)) || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewPermissions={handleViewPermissions}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <Shield className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到角色</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? '尝试调整搜索条件' : '系统中还没有角色'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              清除搜索条件
            </button>
          )}
        </div>
      )}

      {/* 权限管理模态框 */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${roleConfig[selectedRole].color}`}>
                  {roleConfig[selectedRole].icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {roleConfig[selectedRole].label} - 权限管理
                  </h3>
                  <p className="text-sm text-gray-500">{roleConfig[selectedRole].description}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {allPermissionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : allPermissions && allPermissions.length > 0 ? (
                <div className="space-y-0">
                  {allPermissions.map((permission) => (
                    <PermissionItem
                      key={permission.id}
                      permission={permission}
                      isGranted={rolePermissions[selectedRole]?.includes(permission.id) || false}
                      onToggle={handlePermissionToggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无权限</h3>
                  <p className="text-gray-500">系统中还没有定义任何权限</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesList;