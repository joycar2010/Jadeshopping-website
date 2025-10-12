import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Shield, 
  Users, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';
import { AdminRole, Permission, AdminDetailEnhanced } from '@/types';

// 权限分组配置
const permissionGroups = {
  user_management: {
    label: '用户管理',
    icon: <Users className="w-5 h-5" />,
    permissions: [
      'users.view',
      'users.create', 
      'users.edit',
      'users.delete',
      'users.export',
      'users.import'
    ]
  },
  admin_management: {
    label: '管理员管理',
    icon: <Shield className="w-5 h-5" />,
    permissions: [
      'admins.view',
      'admins.create',
      'admins.edit', 
      'admins.delete',
      'admins.permissions'
    ]
  },
  system_settings: {
    label: '系统设置',
    icon: <Settings className="w-5 h-5" />,
    permissions: [
      'settings.view',
      'settings.edit',
      'settings.security',
      'settings.backup',
      'settings.logs'
    ]
  },
  content_management: {
    label: '内容管理',
    icon: <Edit className="w-5 h-5" />,
    permissions: [
      'content.view',
      'content.create',
      'content.edit',
      'content.delete',
      'content.publish'
    ]
  }
};

// 权限项组件
interface PermissionItemProps {
  permission: Permission;
  isGranted: boolean;
  onToggle: (permissionId: string, granted: boolean) => void;
  disabled?: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
  permission,
  isGranted,
  onToggle,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-gray-900">{permission.name}</h4>
          {permission.is_dangerous && (
            <AlertTriangle className="w-4 h-4 text-red-500" title="危险权限" />
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
      </div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isGranted}
          onChange={(e) => onToggle(permission.id, e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isGranted ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}>
          <span className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${isGranted ? 'translate-x-6' : 'translate-x-1'}
          `} />
        </div>
      </label>
    </div>
  );
};

// 角色权限编辑组件
interface RolePermissionEditorProps {
  role: AdminRole;
  onSave: (role: AdminRole, permissions: string[]) => void;
  onCancel: () => void;
}

const RolePermissionEditor: React.FC<RolePermissionEditorProps> = ({
  role,
  onSave,
  onCancel
}) => {
  const { 
    permissions,
    rolePermissions,
    permissionsLoading,
    fetchPermissions,
    fetchRolePermissions
  } = useStore();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useEffect(() => {
    fetchPermissions();
    fetchRolePermissions(role);
  }, [role]);

  useEffect(() => {
    if (rolePermissions[role]) {
      setSelectedPermissions(rolePermissions[role]);
    }
  }, [rolePermissions, role]);

  const handlePermissionToggle = (permissionId: string, granted: boolean) => {
    setSelectedPermissions(prev => 
      granted 
        ? [...prev, permissionId]
        : prev.filter(id => id !== permissionId)
    );
  };

  const handleSave = () => {
    onSave(role, selectedPermissions);
  };

  const handleReset = () => {
    setSelectedPermissions(rolePermissions[role] || []);
  };

  // 筛选权限
  const filteredPermissions = (permissions || []).filter(permission => {
    const matchesSearch = !searchTerm || 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup === 'all' || 
      Object.entries(permissionGroups).some(([groupKey, group]) => 
        groupKey === selectedGroup && group.permissions.includes(permission.id)
      );
    
    return matchesSearch && matchesGroup;
  });

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            编辑角色权限: {role}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            选择该角色应该拥有的权限
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </button>
          <button
            onClick={onCancel}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-1" />
            保存
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索权限..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">所有权限组</option>
          {Object.entries(permissionGroups).map(([key, group]) => (
            <option key={key} value={key}>{group.label}</option>
          ))}
        </select>
      </div>

      {/* 权限统计 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">
            已选择权限: {selectedPermissions.length} / {permissions?.length || 0}
          </span>
          <div className="flex space-x-4 text-xs text-blue-600">
            <span>危险权限: {selectedPermissions.filter(id => 
              permissions?.find(p => p.id === id)?.is_dangerous
            ).length}</span>
          </div>
        </div>
      </div>

      {/* 权限列表 */}
      <div className="space-y-6">
        {Object.entries(permissionGroups).map(([groupKey, group]) => {
          const groupPermissions = filteredPermissions.filter(permission =>
            group.permissions.includes(permission.id)
          );

          if (groupPermissions.length === 0) return null;

          const groupSelectedCount = groupPermissions.filter(permission =>
            selectedPermissions.includes(permission.id)
          ).length;

          return (
            <div key={groupKey} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {group.icon}
                  <h4 className="font-medium text-gray-900">{group.label}</h4>
                  <span className="text-sm text-gray-500">
                    ({groupSelectedCount}/{groupPermissions.length})
                  </span>
                </div>
                <button
                  onClick={() => {
                    const allSelected = groupPermissions.every(p => 
                      selectedPermissions.includes(p.id)
                    );
                    if (allSelected) {
                      // 取消选择所有
                      setSelectedPermissions(prev => 
                        prev.filter(id => !groupPermissions.some(p => p.id === id))
                      );
                    } else {
                      // 选择所有
                      setSelectedPermissions(prev => [
                        ...prev,
                        ...groupPermissions
                          .filter(p => !prev.includes(p.id))
                          .map(p => p.id)
                      ]);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {groupSelectedCount === groupPermissions.length ? '取消全选' : '全选'}
                </button>
              </div>
              <div className="space-y-2">
                {groupPermissions.map(permission => (
                  <PermissionItem
                    key={permission.id}
                    permission={permission}
                    isGranted={selectedPermissions.includes(permission.id)}
                    onToggle={handlePermissionToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到权限</h3>
          <p className="text-gray-500">
            {searchTerm ? '尝试调整搜索条件' : '系统中还没有权限'}
          </p>
        </div>
      )}
    </div>
  );
};

// 用户权限分配组件
interface UserPermissionAssignmentProps {
  user: AdminDetailEnhanced;
  onSave: (userId: string, permissions: string[]) => void;
  onCancel: () => void;
}

const UserPermissionAssignment: React.FC<UserPermissionAssignmentProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const { 
    permissions,
    permissionsLoading,
    fetchPermissions
  } = useStore();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user.permissions || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handlePermissionToggle = (permissionId: string, granted: boolean) => {
    setSelectedPermissions(prev => 
      granted 
        ? [...prev, permissionId]
        : prev.filter(id => id !== permissionId)
    );
  };

  const handleSave = () => {
    onSave(user.id, selectedPermissions);
  };

  const handleReset = () => {
    setSelectedPermissions(user.permissions || []);
  };

  // 筛选权限
  const filteredPermissions = (permissions || []).filter(permission => {
    const matchesSearch = !searchTerm || 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup === 'all' || 
      Object.entries(permissionGroups).some(([groupKey, group]) => 
        groupKey === selectedGroup && group.permissions.includes(permission.id)
      );
    
    return matchesSearch && matchesGroup;
  });

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            分配用户权限: {user.username}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            为该用户分配特定的系统权限
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </button>
          <button
            onClick={onCancel}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-1" />
            保存
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索权限..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">所有权限组</option>
          {Object.entries(permissionGroups).map(([key, group]) => (
            <option key={key} value={key}>{group.label}</option>
          ))}
        </select>
      </div>

      {/* 权限统计 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">
            已分配权限: {selectedPermissions.length} / {permissions?.length || 0}
          </span>
          <div className="flex space-x-4 text-xs text-blue-600">
            <span>危险权限: {selectedPermissions.filter(id => 
              permissions?.find(p => p.id === id)?.is_dangerous
            ).length}</span>
          </div>
        </div>
      </div>

      {/* 权限列表 */}
      <div className="space-y-6">
        {Object.entries(permissionGroups).map(([groupKey, group]) => {
          const groupPermissions = filteredPermissions.filter(permission =>
            group.permissions.includes(permission.id)
          );

          if (groupPermissions.length === 0) return null;

          const groupSelectedCount = groupPermissions.filter(permission =>
            selectedPermissions.includes(permission.id)
          ).length;

          return (
            <div key={groupKey} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {group.icon}
                  <h4 className="font-medium text-gray-900">{group.label}</h4>
                  <span className="text-sm text-gray-500">
                    ({groupSelectedCount}/{groupPermissions.length})
                  </span>
                </div>
                <button
                  onClick={() => {
                    const allSelected = groupPermissions.every(p => 
                      selectedPermissions.includes(p.id)
                    );
                    if (allSelected) {
                      // 取消选择所有
                      setSelectedPermissions(prev => 
                        prev.filter(id => !groupPermissions.some(p => p.id === id))
                      );
                    } else {
                      // 选择所有
                      setSelectedPermissions(prev => [
                        ...prev,
                        ...groupPermissions
                          .filter(p => !prev.includes(p.id))
                          .map(p => p.id)
                      ]);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {groupSelectedCount === groupPermissions.length ? '取消全选' : '全选'}
                </button>
              </div>
              <div className="space-y-2">
                {groupPermissions.map(permission => (
                  <PermissionItem
                    key={permission.id}
                    permission={permission}
                    isGranted={selectedPermissions.includes(permission.id)}
                    onToggle={handlePermissionToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到权限</h3>
          <p className="text-gray-500">
            {searchTerm ? '尝试调整搜索条件' : '系统中还没有权限'}
          </p>
        </div>
      )}
    </div>
  );
};

export { RolePermissionEditor, UserPermissionAssignment, PermissionItem };
export default { RolePermissionEditor, UserPermissionAssignment };