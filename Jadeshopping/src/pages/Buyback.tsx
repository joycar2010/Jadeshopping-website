import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BadgeCheck,
  FileText,
  UploadCloud,
  Images,
  Video,
  Calculator,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Info,
  Recycle
} from 'lucide-react';
import { toast } from 'sonner';

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
      <span>{title}</span>
    </h2>
    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
  </div>
);

type WearLevel = '完好' | '轻微磨损' | '中度磨损' | '严重损伤';

const Buyback: React.FC = () => {
  const [category, setCategory] = useState('翡翠');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [orderNo, setOrderNo] = useState('');
  const [certificateNo, setCertificateNo] = useState('');
  const [wear, setWear] = useState<WearLevel>('完好');
  const [imagesCount, setImagesCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  const withinOneYear = useMemo(() => {
    if (!purchaseDate) return false;
    const purchase = new Date(purchaseDate).getTime();
    const now = Date.now();
    const diffDays = (now - purchase) / (1000 * 60 * 60 * 24);
    return diffDays <= 365;
  }, [purchaseDate]);

  const estimate = useMemo(() => {
    if (!purchasePrice || typeof purchasePrice !== 'number') return null;
    // 基础：保值专区 1 年内不低于 90%
    let base = purchasePrice * 0.9;
    // 根据损耗调整
    switch (wear) {
      case '完好':
        base *= 1.0; // 不调整
        break;
      case '轻微磨损':
        base *= 0.96; // 约 -4%
        break;
      case '中度磨损':
        base *= 0.85; // 约 -15%
        break;
      case '严重损伤':
        base = NaN; // 不支持回购或需大幅下调，交由线下评估
        break;
    }
    if (!withinOneYear) {
      // 超期仅支持寄售，给出提示，无直接回购价
      return null;
    }
    if (isNaN(base)) return null;
    return Math.max(0, Math.round(base));
  }, [purchasePrice, wear, withinOneYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 基础校验
    if (!purchaseDate || !purchasePrice || !orderNo) {
      toast.error('请完整填写购买日期、购买价与订单号');
      return;
    }
    if (!proofUploaded) {
      toast.warning('未上传购买凭证：可能需额外鉴定费用（估值的3%）');
    }
    if (!certUploaded) {
      toast.warning('未上传鉴定证书：可能需额外鉴定费用（估值的3%）');
    }
    if (wear === '严重损伤') {
      toast.info('存在严重损伤：平台可能拒绝回购或大幅下调报价');
    }

    setStep(1);
    toast.success('申请已提交，1个工作日内完成初审');
  };

  const advanceStep = () => {
    setStep((s) => {
      const next = Math.min(4, s + 1);
      if (next === 2) toast.message('实物核验中：邮寄或到店交付');
      if (next === 3) toast.message('报价确认：请在3个工作日内确认');
      if (next === 4) toast.success('交易完成：24小时内付款，或免费原路寄回');
      return next as 0 | 1 | 2 | 3 | 4;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">首页</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900">回购中心</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">玉石回购中心</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">标准化服务</span>
          </div>
          <p className="mt-2 text-gray-600 max-w-3xl">专业鉴定 · 透明定价 · 安全流程 —— 为您的闲置玉石提供可靠的变现与升级渠道。</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：说明区块 */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SectionTitle title="功能核心价值" subtitle="打破“买定离手”壁垒，降低决策门槛与持有风险" />
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><BadgeCheck className="h-5 w-5 text-green-600 flex-shrink-0" /> 专业鉴定与标准化流程，全程可视化记录</li>
              <li className="flex items-start gap-2"><Calculator className="h-5 w-5 text-blue-600 flex-shrink-0" /> 透明定价：依据材质品质、工艺水准与市场行情</li>
              <li className="flex items-start gap-2"><Banknote className="h-5 w-5 text-amber-600 flex-shrink-0" /> 保值专区商品 1 年内回购价不低于原价的 90%</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SectionTitle title="回购适用范围" subtitle="仅限本平台保值专区真品精品，需提供完整凭证" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">商品条件</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><ShieldCheck className="h-5 w-5 text-gray-500" /> 保值专区在售/已售：翡翠、白玉、和田玉等直供真品精品</li>
                  <li className="flex items-start gap-2"><FileText className="h-5 w-5 text-gray-500" /> 保留原包装、购买凭证（订单截图/发票）及权威鉴定证书</li>
                  <li className="flex items-start gap-2"><Info className="h-5 w-5 text-gray-500" /> 无重大损伤：无明显裂纹、无结构性损坏、无严重变种变色</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">时间限制</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><Clock className="h-5 w-5 text-gray-500" /> 保值专区商品：购买后 1 年内可申请回购</li>
                  <li className="flex items-start gap-2"><ChevronRight className="h-5 w-5 text-gray-500" /> 超期可转寄售服务，不支持直接回购</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SectionTitle title="回购定价机制" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">定价依据</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><Calculator className="h-5 w-5 text-blue-600" /> 材质品质（种水、颜色、纯度）、工艺水准、市场行情</li>
                  <li className="flex items-start gap-2"><BadgeCheck className="h-5 w-5 text-green-600" /> 权威鉴定报告结论、磨损程度、同类货品近期成交数据</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">专区规则</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><Banknote className="h-5 w-5 text-amber-600" /> 保值专区：不低于原购买价的 90%，视实物损耗调整</li>
                  <li className="flex items-start gap-2"><ChevronRight className="h-5 w-5 text-gray-500" /> 可选择折价退现或等值换购平台其他商品</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SectionTitle title="回购流程" />
            <div className="grid md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${step >= 0 ? 'border-black' : 'border-gray-200'} bg-gray-50`}>
                <div className="flex items-center gap-2 mb-2"><UploadCloud className="h-5 w-5" /><span className="font-medium">申请提交</span></div>
                <p className="text-sm text-gray-600">上传照片/视频、购买凭证及鉴定证书，1个工作日内初审。</p>
              </div>
              <div className={`p-4 rounded-lg border ${step >= 1 ? 'border-black' : 'border-gray-200'} bg-gray-50`}>
                <div className="flex items-center gap-2 mb-2"><ShieldCheck className="h-5 w-5" /><span className="font-medium">实物核验</span></div>
                <p className="text-sm text-gray-600">邮寄（顺丰保价包邮）或到店交付，专业鉴定全程视频记录。</p>
              </div>
              <div className={`p-4 rounded-lg border ${step >= 2 ? 'border-black' : 'border-gray-200'} bg-gray-50`}>
                <div className="flex items-center gap-2 mb-2"><Calculator className="h-5 w-5" /><span className="font-medium">报价确认</span></div>
                <p className="text-sm text-gray-600">依据评估报告定价，3个工作日内确认是否接受。</p>
              </div>
              <div className={`p-4 rounded-lg border ${step >= 3 ? 'border-black' : 'border-gray-200'} bg-gray-50`}>
                <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="h-5 w-5" /><span className="font-medium">交易完成</span></div>
                <p className="text-sm text-gray-600">确认报价后签署电子协议，24小时内完成付款。</p>
              </div>
            </div>
            <div className="mt-3">
              <button onClick={advanceStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">模拟推进一步</button>
              {step === 4 && <span className="ml-3 text-green-700 text-sm">流程完成</span>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SectionTitle title="注意事项" />
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2"><FileText className="h-5 w-5 text-gray-500" /> 凭证缺失需额外支付鉴定费用（按商品估值的 3% 收取），且仅支持保值专区回购，增值部分不予核算。</li>
              <li className="flex items-start gap-2"><XCircle className="h-5 w-5 text-red-500" /> 因人为原因造成的严重损伤，平台可拒绝回购或大幅下调报价。</li>
              <li className="flex items-start gap-2"><Info className="h-5 w-5 text-gray-500" /> 对报价有异议可申请第三方权威机构复检（费用由申请人垫付，偏差超10%由平台承担）。</li>
              <li className="flex items-start gap-2"><Clock className="h-5 w-5 text-gray-500" /> 玉石价格受市场波动影响，实际行情可能低于预期；非平台购买暂不支持回购。</li>
            </ul>
          </div>
        </div>

        {/* 右侧：申请表单 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SectionTitle title="申请回购" subtitle="填写信息并上传材料，提交后我们将尽快审核" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品品类</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>翡翠</option>
                  <option>白玉</option>
                  <option>和田玉</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">购买日期</label>
                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                {!withinOneYear && purchaseDate && (
                  <p className="mt-1 text-xs text-amber-600">超出 1 年期限：建议使用平台寄售服务</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">原购买价 ($)</label>
                <input type="number" min={0} value={purchasePrice ?? ''} onChange={(e) => setPurchasePrice(e.target.value ? Number(e.target.value) : '')} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="例如 12800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">订单号</label>
                <input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="用于核验购买凭证" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">鉴定证书编号</label>
                <input value={certificateNo} onChange={(e) => setCertificateNo(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="若缺失可留空" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品状态</label>
                <select value={wear} onChange={(e) => setWear(e.target.value as WearLevel)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>完好</option>
                  <option>轻微磨损</option>
                  <option>中度磨损</option>
                  <option>严重损伤</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品照片</label>
                <div className="flex items-center gap-2">
                  <Images className="h-5 w-5 text-gray-500" />
                  <input type="file" accept="image/*" multiple onChange={(e) => setImagesCount(e.target.files?.length || 0)} />
                </div>
                {imagesCount > 0 && <p className="mt-1 text-xs text-gray-500">已选择 {imagesCount} 张图片</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品视频（可选）</label>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-gray-500" />
                  <input type="file" accept="video/*" multiple onChange={(e) => setVideosCount(e.target.files?.length || 0)} />
                </div>
                {videosCount > 0 && <p className="mt-1 text-xs text-gray-500">已选择 {videosCount} 个视频</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">购买凭证</label>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <input type="file" onChange={(e) => setProofUploaded(!!e.target.files?.length)} />
                </div>
                {!proofUploaded && <p className="mt-1 text-xs text-amber-600">未上传可能需额外鉴定费用（3%）</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">鉴定证书</label>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-gray-500" />
                  <input type="file" onChange={(e) => setCertUploaded(!!e.target.files?.length)} />
                </div>
                {!certUploaded && <p className="mt-1 text-xs text-amber-600">未上传可能需额外鉴定费用（3%）</p>}
              </div>

              {/* 预估报价提示 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5" />
                  <span className="font-medium">预估回购价</span>
                </div>
                {estimate && withinOneYear ? (
                  <p className="text-2xl font-bold text-gray-900">${estimate.toFixed(2)}</p>
                ) : (
                  <p className="text-sm text-gray-600">需完成资质核验后给出正式报价；超期商品建议选择寄售服务。</p>
                )}
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                提交申请
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buyback;