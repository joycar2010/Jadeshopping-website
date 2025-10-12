import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  Settings,
  Truck,
  MapPin,
  DollarSign,
  Package,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  AlertCircle,
  Globe,
  Key,
  Shield,
  Calendar,
  Weight
} from 'lucide-react';

interface CarrierFormData {
  code: string;
  name: string;
  api_url: string;
  api_key: string;
  enabled: boolean;
  supported_services: string[];
  pricing_config: {
    base_fee: number;
    weight_fee: number;
    distance_fee: number;
  };
}

interface ShippingRuleFormData {
  name: string;
  conditions: {
    min_weight?: number;
    max_weight?: number;
    regions: string[];
    product_categories: string[];
  };
  actions: {
    carrier_code?: string;
    shipping_fee?: number;
    free_shipping_threshold?: number;
  };
  enabled: boolean;
}

interface ShippingTemplateFormData {
  name: string;
  type: 'weight' | 'quantity' | 'fixed';
  regions: string[];
  pricing: {
    base_fee: number;
    additional_fee: number;
    free_threshold?: number;
  };
  enabled: boolean;
}

const ShippingSettings: React.FC = () => {
  const {
    shippingConfig,
    carrierConfigs,
    shippingRules,
    shippingTemplates,
    configLoading,
    fetchShippingConfig,
    updateShippingConfig,
    fetchCarrierConfigs,
    updateCarrierConfig,
    fetchShippingRules,
    createShippingRule,
    updateShippingRule,
    deleteShippingRule,
    fetchShippingTemplates,
    createShippingTemplate,
    updateShippingTemplate,
    deleteShippingTemplate
  } = useStore();

  const [activeTab, setActiveTab] = useState<'carriers' | 'rules' | 'templates' | 'general'>('carriers');
  const [showCarrierForm, setShowCarrierForm] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const [carrierForm, setCarrierForm] = useState<CarrierFormData>({
    code: '',
    name: '',
    api_url: '',
    api_key: '',
    enabled: true,
    supported_services: [],
    pricing_config: {
      base_fee: 0,
      weight_fee: 0,
      distance_fee: 0
    }
  });

  const [ruleForm, setRuleForm] = useState<ShippingRuleFormData>({
    name: '',
    conditions: {
      regions: [],
      product_categories: []
    },
    actions: {},
    enabled: true
  });

  const [templateForm, setTemplateForm] = useState<ShippingTemplateFormData>({
    name: '',
    type: 'weight',
    regions: [],
    pricing: {
      base_fee: 0,
      additional_fee: 0
    },
    enabled: true
  });

  const [generalSettings, setGeneralSettings] = useState({
    default_carrier: '',
    auto_shipping: false,
    tracking_update_interval: 60,
    exception_notification: true,
    delivery_time_estimation: true
  });

  useEffect(() => {
    fetchShippingConfig();
    fetchCarrierConfigs();
    fetchShippingRules();
    fetchShippingTemplates();
  }, []);

  useEffect(() => {
    if (shippingConfig) {
      setGeneralSettings({
        default_carrier: shippingConfig.default_carrier || '',
        auto_shipping: shippingConfig.auto_shipping || false,
        tracking_update_interval: shippingConfig.tracking_update_interval || 60,
        exception_notification: shippingConfig.exception_notification || true,
        delivery_time_estimation: shippingConfig.delivery_time_estimation || true
      });
    }
  }, [shippingConfig]);

  const handleSaveCarrier = async () => {
    try {
      if (editingCarrier) {
        await updateCarrierConfig(editingCarrier, carrierForm);
      } else {
        await updateCarrierConfig(carrierForm.code, carrierForm);
      }
      setShowCarrierForm(false);
      setEditingCarrier(null);
      resetCarrierForm();
    } catch (error) {
      console.error('保存物流公司配置失败:', error);
    }
  };

  const handleSaveRule = async () => {
    try {
      if (editingRule) {
        await updateShippingRule(editingRule, ruleForm);
      } else {
        await createShippingRule(ruleForm);
      }
      setShowRuleForm(false);
      setEditingRule(null);
      resetRuleForm();
    } catch (error) {
      console.error('保存发货规则失败:', error);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        await updateShippingTemplate(editingTemplate, templateForm);
      } else {
        await createShippingTemplate(templateForm);
      }
      setShowTemplateForm(false);
      setEditingTemplate(null);
      resetTemplateForm();
    } catch (error) {
      console.error('保存运费模板失败:', error);
    }
  };

  const handleSaveGeneralSettings = async () => {
    try {
      await updateShippingConfig(generalSettings);
    } catch (error) {
      console.error('保存通用设置失败:', error);
    }
  };

  const resetCarrierForm = () => {
    setCarrierForm({
      code: '',
      name: '',
      api_url: '',
      api_key: '',
      enabled: true,
      supported_services: [],
      pricing_config: {
        base_fee: 0,
        weight_fee: 0,
        distance_fee: 0
      }
    });
  };

  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      conditions: {
        regions: [],
        product_categories: []
      },
      actions: {},
      enabled: true
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      type: 'weight',
      regions: [],
      pricing: {
        base_fee: 0,
        additional_fee: 0
      },
      enabled: true
    });
  };

  const editCarrier = (carrier: any) => {
    setCarrierForm(carrier);
    setEditingCarrier(carrier.code);
    setShowCarrierForm(true);
  };

  const editRule = (rule: any) => {
    setRuleForm(rule);
    setEditingRule(rule.id);
    setShowRuleForm(true);
  };

  const editTemplate = (template: any) => {
    setTemplateForm(template);
    setEditingTemplate(template.id);
    setShowTemplateForm(true);
  };

  const tabs = [
    { id: 'carriers', label: '物流公司', icon: Truck },
    { id: 'rules', label: '发货规则', icon: Shield },
    { id: 'templates', label: '运费模板', icon: DollarSign },
    { id: 'general', label: '通用设置', icon: Settings }
  ];

  const serviceOptions = [
    { value: 'standard', label: '标准快递' },
    { value: 'express', label: '特快专递' },
    { value: 'economy', label: '经济快递' },
    { value: 'same_day', label: '当日达' },
    { value: 'next_day', label: '次日达' }
  ];

  const regionOptions = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' },
    { value: 'hangzhou', label: '杭州' },
    { value: 'nanjing', label: '南京' },
    { value: 'wuhan', label: '武汉' },
    { value: 'chengdu', label: '成都' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">发货配置</h1>
        <p className="text-gray-600">管理物流公司、发货规则和运费模板</p>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* 物流公司配置 */}
          {activeTab === 'carriers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">物流公司配置</h2>
                <button
                  onClick={() => {
                    resetCarrierForm();
                    setShowCarrierForm(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加物流公司
                </button>
              </div>

              {showCarrierForm && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCarrier ? '编辑物流公司' : '添加物流公司'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowCarrierForm(false);
                        setEditingCarrier(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        物流公司代码
                      </label>
                      <input
                        type="text"
                        value={carrierForm.code}
                        onChange={(e) => setCarrierForm(prev => ({ ...prev, code: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="如: sf, sto, yt"
                        disabled={!!editingCarrier}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        物流公司名称
                      </label>
                      <input
                        type="text"
                        value={carrierForm.name}
                        onChange={(e) => setCarrierForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="如: 顺丰速运"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API地址
                      </label>
                      <input
                        type="url"
                        value={carrierForm.api_url}
                        onChange={(e) => setCarrierForm(prev => ({ ...prev, api_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://api.carrier.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API密钥
                      </label>
                      <input
                        type="password"
                        value={carrierForm.api_key}
                        onChange={(e) => setCarrierForm(prev => ({ ...prev, api_key: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入API密钥"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        支持的服务类型
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {serviceOptions.map(option => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={carrierForm.supported_services.includes(option.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCarrierForm(prev => ({
                                    ...prev,
                                    supported_services: [...prev.supported_services, option.value]
                                  }));
                                } else {
                                  setCarrierForm(prev => ({
                                    ...prev,
                                    supported_services: prev.supported_services.filter(s => s !== option.value)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        基础运费 (¥)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={carrierForm.pricing_config.base_fee}
                        onChange={(e) => setCarrierForm(prev => ({
                          ...prev,
                          pricing_config: {
                            ...prev.pricing_config,
                            base_fee: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        重量费用 (¥/kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={carrierForm.pricing_config.weight_fee}
                        onChange={(e) => setCarrierForm(prev => ({
                          ...prev,
                          pricing_config: {
                            ...prev.pricing_config,
                            weight_fee: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={carrierForm.enabled}
                          onChange={(e) => setCarrierForm(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">启用此物流公司</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowCarrierForm(false);
                        setEditingCarrier(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveCarrier}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {carrierConfigs.map(carrier => (
                  <div key={carrier.code} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{carrier.name}</h3>
                          <p className="text-sm text-gray-600">代码: {carrier.code}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          carrier.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {carrier.enabled ? '已启用' : '已禁用'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editCarrier(carrier)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">基础运费:</span> ¥{carrier.pricing_config?.base_fee || 0}
                      </div>
                      <div>
                        <span className="font-medium">重量费用:</span> ¥{carrier.pricing_config?.weight_fee || 0}/kg
                      </div>
                      <div>
                        <span className="font-medium">支持服务:</span> {carrier.supported_services?.length || 0}种
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 发货规则 */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">发货规则</h2>
                <button
                  onClick={() => {
                    resetRuleForm();
                    setShowRuleForm(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加规则
                </button>
              </div>

              {showRuleForm && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingRule ? '编辑发货规则' : '添加发货规则'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowRuleForm(false);
                        setEditingRule(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        规则名称
                      </label>
                      <input
                        type="text"
                        value={ruleForm.name}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入规则名称"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最小重量 (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={ruleForm.conditions.min_weight || ''}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            conditions: {
                              ...prev.conditions,
                              min_weight: parseFloat(e.target.value) || undefined
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最大重量 (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={ruleForm.conditions.max_weight || ''}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            conditions: {
                              ...prev.conditions,
                              max_weight: parseFloat(e.target.value) || undefined
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        适用地区
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {regionOptions.map(option => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={ruleForm.conditions.regions.includes(option.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRuleForm(prev => ({
                                    ...prev,
                                    conditions: {
                                      ...prev.conditions,
                                      regions: [...prev.conditions.regions, option.value]
                                    }
                                  }));
                                } else {
                                  setRuleForm(prev => ({
                                    ...prev,
                                    conditions: {
                                      ...prev.conditions,
                                      regions: prev.conditions.regions.filter(r => r !== option.value)
                                    }
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          指定物流公司
                        </label>
                        <select
                          value={ruleForm.actions.carrier_code || ''}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            actions: {
                              ...prev.actions,
                              carrier_code: e.target.value || undefined
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">不指定</option>
                          {carrierConfigs.filter(c => c.enabled).map(carrier => (
                            <option key={carrier.code} value={carrier.code}>
                              {carrier.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          运费 (¥)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={ruleForm.actions.shipping_fee || ''}
                          onChange={(e) => setRuleForm(prev => ({
                            ...prev,
                            actions: {
                              ...prev.actions,
                              shipping_fee: parseFloat(e.target.value) || undefined
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={ruleForm.enabled}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">启用此规则</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowRuleForm(false);
                        setEditingRule(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveRule}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {shippingRules.map(rule => (
                  <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{rule.name}</h3>
                          <p className="text-sm text-gray-600">
                            适用地区: {rule.conditions.regions.length}个
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.enabled ? '已启用' : '已禁用'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editRule(rule)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteShippingRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 运费模板 */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">运费模板</h2>
                <button
                  onClick={() => {
                    resetTemplateForm();
                    setShowTemplateForm(true);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加模板
                </button>
              </div>

              {showTemplateForm && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingTemplate ? '编辑运费模板' : '添加运费模板'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowTemplateForm(false);
                        setEditingTemplate(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          模板名称
                        </label>
                        <input
                          type="text"
                          value={templateForm.name}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="请输入模板名称"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          计费方式
                        </label>
                        <select
                          value={templateForm.type}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="weight">按重量计费</option>
                          <option value="quantity">按件数计费</option>
                          <option value="fixed">固定运费</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        适用地区
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {regionOptions.map(option => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={templateForm.regions.includes(option.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTemplateForm(prev => ({
                                    ...prev,
                                    regions: [...prev.regions, option.value]
                                  }));
                                } else {
                                  setTemplateForm(prev => ({
                                    ...prev,
                                    regions: prev.regions.filter(r => r !== option.value)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          基础运费 (¥)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={templateForm.pricing.base_fee}
                          onChange={(e) => setTemplateForm(prev => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              base_fee: parseFloat(e.target.value) || 0
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          续重/续件费用 (¥)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={templateForm.pricing.additional_fee}
                          onChange={(e) => setTemplateForm(prev => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              additional_fee: parseFloat(e.target.value) || 0
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          包邮门槛 (¥)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={templateForm.pricing.free_threshold || ''}
                          onChange={(e) => setTemplateForm(prev => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              free_threshold: parseFloat(e.target.value) || undefined
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="不设置包邮门槛"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={templateForm.enabled}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">启用此模板</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowTemplateForm(false);
                        setEditingTemplate(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {shippingTemplates.map(template => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600">
                            {template.type === 'weight' ? '按重量计费' : 
                             template.type === 'quantity' ? '按件数计费' : '固定运费'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.enabled ? '已启用' : '已禁用'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editTemplate(template)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteShippingTemplate(template.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">基础运费:</span> ¥{template.pricing.base_fee}
                      </div>
                      <div>
                        <span className="font-medium">续费:</span> ¥{template.pricing.additional_fee}
                      </div>
                      <div>
                        <span className="font-medium">包邮门槛:</span> 
                        {template.pricing.free_threshold ? `¥${template.pricing.free_threshold}` : '无'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 通用设置 */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">通用设置</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认物流公司
                    </label>
                    <select
                      value={generalSettings.default_carrier}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, default_carrier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择默认物流公司</option>
                      {carrierConfigs.filter(c => c.enabled).map(carrier => (
                        <option key={carrier.code} value={carrier.code}>
                          {carrier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      物流跟踪更新间隔 (分钟)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={generalSettings.tracking_update_interval}
                      onChange={(e) => setGeneralSettings(prev => ({ 
                        ...prev, 
                        tracking_update_interval: parseInt(e.target.value) || 60 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={generalSettings.auto_shipping}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, auto_shipping: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">自动发货</span>
                      <p className="text-sm text-gray-600">订单支付完成后自动创建发货记录</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={generalSettings.exception_notification}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, exception_notification: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">异常通知</span>
                      <p className="text-sm text-gray-600">配送异常时发送通知</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={generalSettings.delivery_time_estimation}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, delivery_time_estimation: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">配送时间预估</span>
                      <p className="text-sm text-gray-600">根据历史数据预估配送时间</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveGeneralSettings}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingSettings;