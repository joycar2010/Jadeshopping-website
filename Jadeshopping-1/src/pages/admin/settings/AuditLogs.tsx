import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';
import { AuditLog, AuditLogFilters } from '@/types';

// 操作类型配置
const actionTypeConfig = {
  create: {
    label: '创建',
    color: 'text-green-600 bg-green-100',
    icon: <CheckCircle className="w-4 h-4" />
  },
  update: {
    label: '更新',
    color: 'text-blue-600 bg-blue-100',
    icon: <Info className="w-4 h-4" />
  },
  delete: {
    label: '删除',
    color: 'text-red-600 bg-red-100',
    icon: <XCircle className="w-4 h-4" />
  },
  login: {
    label: '登录',
    color: 'text-green-600 bg-green-100',
    icon: <User className="w-4 h-4" />
  },
  logout: {
    label: '登出',
    color: 'text-gray-600 bg-gray-100',
    icon: <User className="w-4 h-4" />
  },
  permission: {
    label: '权限变更',
    color: 'text-purple-600 bg-purple-100',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  export: {
    label: '导出',
    color: 'text-orange-600 bg-orange-100',
    icon: <Download className="w-4 h-4" />
  },
  view: {
    label: '查看',
    color: 'text-gray-600 bg-gray-100',
    icon: <Eye className="w-4 h-4" />
  }
};

// 风险级别配置
const riskLevelConfig = {
  low: {
    label: '低风险',
    color: 'text-green-600 bg-green-100'
  },
  medium: {
    label: '中风险',
    color: 'text-yellow-600 bg-yellow-100'
  },
  high: {
    label: '高风险',
    color: 'text-red-600 bg-red-100'
  },
  critical: {
    label: '严重风险',
    color: 'text-red-800 bg-red-200'
  }
};

// 操作类型徽章组件
interface ActionBadgeProps {
  action: string;
}

const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  const config = actionTypeConfig[action as keyof typeof actionTypeConfig] || {
    label: action,
    color: 'text-gray-600 bg-gray-100',
    icon: <Activity className="w-4 h-4" />
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </span>
  );
};

// 风险级别徽章组件
interface RiskBadgeProps {
  level: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const config = riskLevelConfig[level as keyof typeof riskLevelConfig] || {
    label: level,
    color: 'text-gray-600 bg-gray-100'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// 审计日志行组件
interface AuditLogRowProps {
  log: AuditLog;
  onViewDetails: (log: AuditLog) => void;
}

const AuditLogRow: React.FC<AuditLogRowProps> = ({ log, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(log.created_at)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{log.admin_username}</div>
            <div className="text-sm text-gray-500">{log.admin_role}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ActionBadge action={log.action} />
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{log.resource_type}</div>
        {log.resource_id && (
          <div className="text-sm text-gray-500">ID: {log.resource_id}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate" title={log.description}>
          {log.description}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RiskBadge level={log.risk_level} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{log.ip_address}</div>
        <div className="text-sm text-gray-400">{log.user_agent?.substring(0, 30)}...</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onViewDetails(log)}
          className="text-blue-600 hover:text-blue-900"
          title="查看详情"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

// 筛选面板组件
interface FilterPanelProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: AuditLogFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof AuditLogFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">筛选条件</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={onReset}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            重置
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 基础筛选 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              操作类型
            </label>
            <select
              value={filters.action || ''}
              onChange={(e) => handleFilterChange('action', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全部</option>
              {Object.entries(actionTypeConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              风险级别
            </label>
            <select
              value={filters.risk_level || ''}
              onChange={(e) => handleFilterChange('risk_level', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全部</option>
              {Object.entries(riskLevelConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              资源类型
            </label>
            <input
              type="text"
              value={filters.resource_type || ''}
              onChange={(e) => handleFilterChange('resource_type', e.target.value || undefined)}
              placeholder="如: user, admin, product"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 高级筛选 */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  管理员用户名
                </label>
                <input
                  type="text"
                  value={filters.admin_username || ''}
                  onChange={(e) => handleFilterChange('admin_username', e.target.value || undefined)}
                  placeholder="输入管理员用户名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP地址
                </label>
                <input
                  type="text"
                  value={filters.ip_address || ''}
                  onChange={(e) => handleFilterChange('ip_address', e.target.value || undefined)}
                  placeholder="输入IP地址"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开始时间
                </label>
                <input
                  type="datetime-local"
                  value={filters.start_time || ''}
                  onChange={(e) => handleFilterChange('start_time', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  结束时间
                </label>
                <input
                  type="datetime-local"
                  value={filters.end_time || ''}
                  onChange={(e) => handleFilterChange('end_time', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 审计日志详情模态框
interface AuditLogDetailModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

const AuditLogDetailModal: React.FC<AuditLogDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">审计日志详情</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">操作时间</span>
                  <p className="text-sm font-medium text-gray-900">{formatDate(log.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">操作类型</span>
                  <div className="mt-1">
                    <ActionBadge action={log.action} />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">风险级别</span>
                  <div className="mt-1">
                    <RiskBadge level={log.risk_level} />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">资源类型</span>
                  <p className="text-sm font-medium text-gray-900">{log.resource_type}</p>
                </div>
              </div>
            </div>

            {/* 操作者信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">操作者信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">管理员用户名</span>
                  <p className="text-sm font-medium text-gray-900">{log.admin_username}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">管理员角色</span>
                  <p className="text-sm font-medium text-gray-900">{log.admin_role}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">IP地址</span>
                  <p className="text-sm font-medium text-gray-900">{log.ip_address}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">用户代理</span>
                  <p className="text-sm font-medium text-gray-900 break-all">{log.user_agent}</p>
                </div>
              </div>
            </div>

            {/* 操作详情 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">操作详情</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">描述</span>
                  <p className="text-sm text-gray-900 mt-1">{log.description}</p>
                </div>
                {log.resource_id && (
                  <div>
                    <span className="text-sm text-gray-500">资源ID</span>
                    <p className="text-sm font-mono text-gray-900 mt-1">{log.resource_id}</p>
                  </div>
                )}
                {log.details && (
                  <div>
                    <span className="text-sm text-gray-500">详细信息</span>
                    <pre className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主审计日志组件
const AuditLogs: React.FC = () => {
  const {
    auditLogs,
    auditLogsLoading,
    auditLogsPagination,
    fetchAuditLogs,
    exportAuditLogs
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAuditLogs({ ...filters, search: searchTerm });
  }, [filters, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (newFilters: AuditLogFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleExport = async () => {
    try {
      await exportAuditLogs({ ...filters, search: searchTerm });
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  const handleRefresh = () => {
    fetchAuditLogs({ ...filters, search: searchTerm });
  };

  const handlePageChange = (page: number) => {
    fetchAuditLogs({ ...filters, search: searchTerm, page });
  };

  return (
    <div className="space-y-6">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">审计日志</h2>
          <p className="text-sm text-gray-600 mt-1">查看系统操作记录和安全审计信息</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            导出
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索操作描述、管理员用户名、资源类型..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-sm text-gray-500">
          共 {auditLogsPagination?.total || 0} 条记录
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      )}

      {/* 审计日志表格 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {auditLogsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : auditLogs && auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    资源
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    风险级别
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    来源信息
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <AuditLogRow
                    key={log.id}
                    log={log}
                    onViewDetails={setSelectedLog}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无审计日志</h3>
            <p className="text-gray-500">
              {searchTerm || Object.keys(filters).length > 0 
                ? '没有找到符合条件的审计日志' 
                : '系统中还没有审计日志记录'
              }
            </p>
          </div>
        )}
      </div>

      {/* 分页 */}
      {auditLogsPagination && auditLogsPagination.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示第 {((auditLogsPagination.current_page - 1) * auditLogsPagination.per_page) + 1} 到{' '}
            {Math.min(auditLogsPagination.current_page * auditLogsPagination.per_page, auditLogsPagination.total)} 条，
            共 {auditLogsPagination.total} 条记录
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(auditLogsPagination.current_page - 1)}
              disabled={auditLogsPagination.current_page <= 1}
              className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              第 {auditLogsPagination.current_page} 页，共 {auditLogsPagination.total_pages} 页
            </span>
            <button
              onClick={() => handlePageChange(auditLogsPagination.current_page + 1)}
              disabled={auditLogsPagination.current_page >= auditLogsPagination.total_pages}
              className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 审计日志详情模态框 */}
      <AuditLogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default AuditLogs;