import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { OperationLog } from '@/types';
import { Search, Filter, Calendar, User, Activity, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface OperationLogViewerProps {
  userId?: string; // 如果提供，则只显示特定用户的操作日志
  adminId?: string; // 如果提供，则只显示特定管理员的操作日志
  maxHeight?: string; // 最大高度，默认为 '400px'
}

const OperationLogViewer: React.FC<OperationLogViewerProps> = ({
  userId,
  adminId,
  maxHeight = '400px'
}) => {
  const { operationLogs, fetchOperationLogs, operationLogsLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchOperationLogs({ userId, adminId });
  }, [fetchOperationLogs, userId, adminId]);

  // 过滤操作日志
  const filteredLogs = operationLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesStatus = !statusFilter || log.status === statusFilter;
    
    const matchesDateRange = (!dateRange.start || new Date(log.created_at) >= new Date(dateRange.start)) &&
                            (!dateRange.end || new Date(log.created_at) <= new Date(dateRange.end));
    
    return matchesSearch && matchesAction && matchesStatus && matchesDateRange;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    const actionColors: { [key: string]: string } = {
      'USER_CREATE': 'bg-green-100 text-green-800',
      'USER_UPDATE': 'bg-blue-100 text-blue-800',
      'USER_DELETE': 'bg-red-100 text-red-800',
      'USER_STATUS_UPDATE': 'bg-yellow-100 text-yellow-800',
      'USER_PERMISSION_UPDATE': 'bg-purple-100 text-purple-800',
      'LOGIN': 'bg-gray-100 text-gray-800',
      'LOGOUT': 'bg-gray-100 text-gray-800'
    };
    return actionColors[action] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">操作日志</h3>
        
        {/* 搜索和过滤器 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索描述、管理员或资源ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有操作</option>
            <option value="USER_CREATE">创建用户</option>
            <option value="USER_UPDATE">更新用户</option>
            <option value="USER_DELETE">删除用户</option>
            <option value="USER_STATUS_UPDATE">状态更新</option>
            <option value="USER_PERMISSION_UPDATE">权限更新</option>
            <option value="LOGIN">登录</option>
            <option value="LOGOUT">登出</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">所有状态</option>
            <option value="SUCCESS">成功</option>
            <option value="ERROR">错误</option>
            <option value="WARNING">警告</option>
          </select>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 操作日志列表 */}
      <div className="overflow-auto" style={{ maxHeight }}>
        {operationLogsLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无操作日志
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(log.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-gray-600">
                          by {log.admin_username}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{log.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>资源: {log.resource_type} - {log.resource_id}</div>
                        <div>IP: {log.ip_address}</div>
                        {log.error_message && (
                          <div className="text-red-600">错误: {log.error_message}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>{formatDate(log.created_at)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationLogViewer;