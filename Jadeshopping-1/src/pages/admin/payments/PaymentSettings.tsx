import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { PaymentConfig, PaymentLimitRule } from '../../../types';
import { 
  Settings, 
  CreditCard, 
  Shield, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit,
  Check,
  X,
  Info,
  Key,
  Globe,
  Zap,
  Lock
} from 'lucide-react';

// 支付方式配置组件
const PaymentMethodConfig: React.FC<{
  config: PaymentConfig;
  onUpdate: (config: PaymentConfig) => void;
}> = ({ config, onUpdate }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(config);

  const handleSave = () => {
    onUpdate(editedConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedConfig(config);
    setIsEditing(false);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'alipay': return '🅰️';
      case 'wechat': return '💬';
      case 'unionpay': return '🏦';
      case 'credit_card': return '💳';
      default: return '💰';
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'alipay': return '支付宝';
      case 'wechat': return '微信支付';
      case 'unionpay': return '银联支付';
      case 'credit_card': return '信用卡';
      default: return method;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getMethodIcon(config.method)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {getMethodName(config.method)}
            </h3>
            <p className="text-sm text-gray-500">
              {config.enabled ? '已启用' : '已禁用'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEditing ? editedConfig.enabled : config.enabled}
              onChange={(e) => {
                if (isEditing) {
                  setEditedConfig(prev => ({ ...prev, enabled: e.target.checked }));
                } else {
                  onUpdate({ ...config, enabled: e.target.checked });
                }
              }}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              (isEditing ? editedConfig.enabled : config.enabled) 
                ? 'bg-blue-600' 
                : 'bg-gray-200'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                (isEditing ? editedConfig.enabled : config.enabled) 
                  ? 'translate-x-5' 
                  : 'translate-x-0'
              }`} />
            </div>
          </label>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Edit className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API密钥
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={isEditing ? editedConfig.api_key : config.api_key}
                onChange={(e) => isEditing && setEditedConfig(prev => ({ ...prev, api_key: e.target.value }))}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
                placeholder="请输入API密钥"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商户ID
            </label>
            <input
              type="text"
              value={isEditing ? editedConfig.merchant_id : config.merchant_id}
              onChange={(e) => isEditing && setEditedConfig(prev => ({ ...prev, merchant_id: e.target.value }))}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isEditing ? 'bg-gray-50' : ''
              }`}
              placeholder="请输入商户ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              手续费率 (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={isEditing ? editedConfig.fee_rate : config.fee_rate}
              onChange={(e) => isEditing && setEditedConfig(prev => ({ ...prev, fee_rate: parseFloat(e.target.value) }))}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isEditing ? 'bg-gray-50' : ''
              }`}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最小手续费 (元)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={isEditing ? editedConfig.min_fee : config.min_fee}
              onChange={(e) => isEditing && setEditedConfig(prev => ({ ...prev, min_fee: parseFloat(e.target.value) }))}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isEditing ? 'bg-gray-50' : ''
              }`}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            回调地址
          </label>
          <input
            type="url"
            value={isEditing ? editedConfig.callback_url : config.callback_url}
            onChange={(e) => isEditing && setEditedConfig(prev => ({ ...prev, callback_url: e.target.value }))}
            readOnly={!isEditing}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? 'bg-gray-50' : ''
            }`}
            placeholder="https://your-domain.com/payment/callback"
          />
        </div>

        {config.settings && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              其他设置
            </label>
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(config.settings, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 限额规则组件
const LimitRuleCard: React.FC<{
  rule: PaymentLimitRule;
  onUpdate: (rule: PaymentLimitRule) => void;
  onDelete: (id: string) => void;
}> = ({ rule, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(rule);

  const handleSave = () => {
    onUpdate(editedRule);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRule(rule);
    setIsEditing(false);
  };

  const getRuleTypeText = (type: string) => {
    switch (type) {
      case 'daily': return '每日限额';
      case 'monthly': return '每月限额';
      case 'single': return '单笔限额';
      case 'user_daily': return '用户每日限额';
      case 'user_monthly': return '用户每月限额';
      default: return type;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-gray-900">
            {getRuleTypeText(rule.rule_type)}
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEditing ? editedRule.enabled : rule.enabled}
              onChange={(e) => {
                if (isEditing) {
                  setEditedRule(prev => ({ ...prev, enabled: e.target.checked }));
                } else {
                  onUpdate({ ...rule, enabled: e.target.checked });
                }
              }}
              className="sr-only"
            />
            <div className={`w-8 h-4 rounded-full transition-colors ${
              (isEditing ? editedRule.enabled : rule.enabled) 
                ? 'bg-blue-600' 
                : 'bg-gray-200'
            }`}>
              <div className={`w-3 h-3 bg-white rounded-full shadow transform transition-transform ${
                (isEditing ? editedRule.enabled : rule.enabled) 
                  ? 'translate-x-4' 
                  : 'translate-x-0'
              }`} />
            </div>
          </label>
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(rule.id)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            最大金额 (元)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={isEditing ? editedRule.max_amount : rule.max_amount}
            onChange={(e) => isEditing && setEditedRule(prev => ({ ...prev, max_amount: parseFloat(e.target.value) }))}
            readOnly={!isEditing}
            className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              !isEditing ? 'bg-gray-50' : ''
            }`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            最大次数
          </label>
          <input
            type="number"
            min="0"
            value={isEditing ? editedRule.max_count : rule.max_count}
            onChange={(e) => isEditing && setEditedRule(prev => ({ ...prev, max_count: parseInt(e.target.value) }))}
            readOnly={!isEditing}
            className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              !isEditing ? 'bg-gray-50' : ''
            }`}
          />
        </div>
      </div>

      {rule.description && (
        <p className="text-xs text-gray-500 mt-2">{rule.description}</p>
      )}
    </div>
  );
};

const PaymentSettings: React.FC = () => {
  const { 
    paymentConfigs, 
    paymentLimitRules,
    fetchPaymentConfigs, 
    updatePaymentConfig,
    fetchPaymentLimitRules,
    createPaymentLimitRule,
    updatePaymentLimitRule,
    deletePaymentLimitRule
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('methods');
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [newRule, setNewRule] = useState({
    rule_type: 'daily',
    max_amount: 0,
    max_count: 0,
    enabled: true,
    description: ''
  });

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      await Promise.all([
        fetchPaymentConfigs(),
        fetchPaymentLimitRules()
      ]);
      setLoading(false);
    };

    loadSettings();
  }, [fetchPaymentConfigs, fetchPaymentLimitRules]);

  const handleConfigUpdate = async (config: PaymentConfig) => {
    setSaving(true);
    try {
      await updatePaymentConfig(config.id, config);
    } catch (error) {
      console.error('更新配置失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRuleUpdate = async (rule: PaymentLimitRule) => {
    try {
      await updatePaymentLimitRule(rule.id, rule);
    } catch (error) {
      console.error('更新限额规则失败:', error);
    }
  };

  const handleRuleDelete = async (ruleId: string) => {
    if (confirm('确定要删除这个限额规则吗？')) {
      try {
        await deletePaymentLimitRule(ruleId);
      } catch (error) {
        console.error('删除限额规则失败:', error);
      }
    }
  };

  const handleCreateRule = async () => {
    try {
      await createPaymentLimitRule(newRule);
      setNewRule({
        rule_type: 'daily',
        max_amount: 0,
        max_count: 0,
        enabled: true,
        description: ''
      });
      setShowNewRuleForm(false);
    } catch (error) {
      console.error('创建限额规则失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-3" />
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">支付配置</h1>
            <p className="mt-2 text-gray-600">管理支付方式、限额规则和安全设置</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => Promise.all([fetchPaymentConfigs(), fetchPaymentLimitRules()])}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('methods')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'methods'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            支付方式
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'limits'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            限额规则
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            安全设置
          </button>
        </nav>
      </div>

      {/* 支付方式配置 */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">配置说明</h3>
                <p className="text-sm text-blue-700 mt-1">
                  请确保API密钥和商户ID的准确性，错误的配置可能导致支付失败。
                  修改配置后建议进行测试支付以确保正常工作。
                </p>
              </div>
            </div>
          </div>

          {paymentConfigs.map((config) => (
            <PaymentMethodConfig
              key={config.id}
              config={config}
              onUpdate={handleConfigUpdate}
            />
          ))}
        </div>
      )}

      {/* 限额规则 */}
      {activeTab === 'limits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">限额规则</h2>
              <p className="text-sm text-gray-600 mt-1">设置支付限额以控制风险</p>
            </div>
            <button
              onClick={() => setShowNewRuleForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加规则
            </button>
          </div>

          {showNewRuleForm && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">新建限额规则</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    规则类型
                  </label>
                  <select
                    value={newRule.rule_type}
                    onChange={(e) => setNewRule(prev => ({ ...prev, rule_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">每日限额</option>
                    <option value="monthly">每月限额</option>
                    <option value="single">单笔限额</option>
                    <option value="user_daily">用户每日限额</option>
                    <option value="user_monthly">用户每月限额</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最大金额 (元)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newRule.max_amount}
                    onChange={(e) => setNewRule(prev => ({ ...prev, max_amount: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最大次数
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newRule.max_count}
                    onChange={(e) => setNewRule(prev => ({ ...prev, max_count: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <input
                    type="text"
                    value={newRule.description}
                    onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="规则描述（可选）"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowNewRuleForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  创建规则
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentLimitRules.map((rule) => (
              <LimitRuleCard
                key={rule.id}
                rule={rule}
                onUpdate={handleRuleUpdate}
                onDelete={handleRuleDelete}
              />
            ))}
          </div>

          {paymentLimitRules.length === 0 && !showNewRuleForm && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无限额规则</h3>
              <p className="text-gray-500 mb-4">创建限额规则来控制支付风险</p>
              <button
                onClick={() => setShowNewRuleForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                创建第一个规则
              </button>
            </div>
          )}
        </div>
      )}

      {/* 安全设置 */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">风险控制</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">启用风险评估</h4>
                  <p className="text-sm text-gray-500">对每笔支付进行风险评估</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-blue-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5" />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">自动拦截高风险交易</h4>
                  <p className="text-sm text-gray-500">自动拦截风险分数超过阈值的交易</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-blue-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5" />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">启用IP白名单</h4>
                  <p className="text-sm text-gray-500">只允许白名单IP进行支付操作</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">支付成功通知</h4>
                  <p className="text-sm text-gray-500">支付成功时发送通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-blue-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5" />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">异常交易警报</h4>
                  <p className="text-sm text-gray-500">检测到异常交易时发送警报</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-blue-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">数据保护</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  数据保留期限 (天)
                </label>
                <input
                  type="number"
                  min="1"
                  defaultValue="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  支付数据将在指定天数后自动删除
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">启用数据加密</h4>
                  <p className="text-sm text-gray-500">对敏感支付数据进行加密存储</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-blue-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5" />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 保存按钮 */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            保存中...
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;