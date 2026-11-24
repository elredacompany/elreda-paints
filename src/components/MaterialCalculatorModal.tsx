import React, { useState } from 'react';
import { Project, MaterialSettings } from '../types';
import {
  calculateProjectTotals,
  calculateMaterialEstimates,
  formatNum,
} from '../utils/calculations';
import {
  X,
  Calculator,
  Paintbrush,
  Layers,
  Coins,
  Share2,
  Printer,
  Check,
  Copy,
  Info,
  MessageCircle,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface MaterialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateSettings: (settings: MaterialSettings) => void;
}

export const MaterialCalculatorModal: React.FC<MaterialCalculatorModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateSettings,
}) => {
  const [settings, setSettings] = useState<MaterialSettings>(project.materialSettings);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totals = calculateProjectTotals(project.rooms);
  const estimates = calculateMaterialEstimates(totals.totalNetPaintArea, settings);

  const handleSettingChange = (field: keyof MaterialSettings, value: any) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    onUpdateSettings(updated);
  };

  const handleCopyWhatsAppReport = () => {
    const reportText = `📋 *مقايسة دهانات وتشطيبات*
👤 المشروع: ${project.name || 'مشروع جديد'}
📍 الموقع: ${project.location || 'غير محدد'}
━━━━━━━━━━━━━━━━━━
🔢 عدد الغرف: ${totals.roomsCount} غرفة
📐 إجمالي الحوائط الخام: ${totals.totalGrossWall} م²
🚪 إجمالي خصم الفتحات: -${totals.totalDeductions} م²
🏠 إجمالي مساحة الأسقف: +${totals.totalCeiling} م²
✨ *صافي مساحة الدهان الإجمالية:* ${totals.totalNetPaintArea} م²
━━━━━━━━━━━━━━━━━━
🪣 *تقدير الخامات المطلوبة:*
• عدد الأوجه: ${settings.coatsCount} أوجه
• إجمالي بستلات الدهان المطلوبة (${settings.bucketCapacityLiters} لتر): *${estimates.bucketsCount} بستلة* (${estimates.paintLiters} لتر)
• سيلر مائي أساسي: *${estimates.primerBuckets} بستلة* (${estimates.primerLiters} لتر)
• معجون حوائط: *${estimates.puttyBags} شيكارة* (تقريباً)
━━━━━━━━━━━━━━━━━━
💰 *التكلفة المقدرة:*
• سعر المتر: ${settings.pricePerMeter} ${settings.currency}
• *إجمالي تكلفة المشروع:* *${formatNum(estimates.totalCost)} ${settings.currency}*

_تم الحساب بواسطة تطبيق حاسبة المقاول للدهانات_`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                المقايسة وتقدير كميات الخامات
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                حساب بستلات الدهان، السيلر، المعجون وإجمالي تكلفة المتر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Area Banner */}
          <div className="bg-gradient-to-r from-sky-600 to-teal-600 text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs text-sky-100 font-semibold block">
                صافي المساحة الإجمالية لجميع الغرف ({totals.roomsCount} غرف)
              </span>
              <span className="text-3xl sm:text-4xl font-black">
                {formatNum(totals.totalNetPaintArea)}
              </span>
              <span className="text-sm font-bold text-sky-200 mr-1.5">متر مربع (م²)</span>
            </div>
            <div className="text-left text-xs text-sky-100/90 hidden sm:block bg-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <div>حوائط: {totals.totalGrossWall} م²</div>
              <div>خصومات: -{totals.totalDeductions} م²</div>
              {totals.totalCeiling > 0 && <div>أسقف: +{totals.totalCeiling} م²</div>}
            </div>
          </div>

          {/* Calculator Parameters & Settings */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              معايير حساب الدهان والتشطيب
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Coats Count */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  عدد الأوجه المطلوبة
                </label>
                <select
                  value={settings.coatsCount}
                  onChange={(e) => handleSettingChange('coatsCount', parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
                >
                  <option value={1}>وجه واحد (تجديد سريع)</option>
                  <option value={2}>وجهين (القياسي والشائع)</option>
                  <option value={3}>3 أوجه (تغطية فائقة / ألوان داكنة)</option>
                </select>
              </div>

              {/* Bucket Size */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  سعة بستلة الدهان (جردل)
                </label>
                <select
                  value={settings.bucketCapacityLiters}
                  onChange={(e) => handleSettingChange('bucketCapacityLiters', parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
                >
                  <option value={14}>14 لتر (بستلة شائعة جوتن / GLC)</option>
                  <option value={16}>16 لتر</option>
                  <option value={18}>18 لتر (بستلة كبيرة)</option>
                  <option value={9}>9 أو 10 لتر (جردل متوسط)</option>
                  <option value={4}>4 أو 3.5 لتر (جالون صغير)</option>
                </select>
              </div>

              {/* Coverage rate */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  معدل الفرد (م²/لتر للوجه)
                </label>
                <input
                  type="number"
                  min="5"
                  max="20"
                  step="1"
                  value={settings.coveragePerLiter}
                  onChange={(e) => handleSettingChange('coveragePerLiter', parseFloat(e.target.value) || 10)}
                  className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
                />
              </div>
            </div>
          </div>

          {/* Quantities Results Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-teal-600" />
              الكميات المقدرة للتنفيذ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Paint Buckets */}
              <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200 text-center">
                <span className="block text-xs font-bold text-sky-800 mb-1">
                  بستلات الدهان النهائي ({settings.coatsCount} أوجه)
                </span>
                <span className="text-3xl font-black text-sky-900">{estimates.bucketsCount}</span>
                <span className="text-xs font-bold text-sky-700 mr-1">بستلة</span>
                <p className="text-[11px] text-sky-600 mt-1">
                  تعادل تقريباً {estimates.paintLiters} لتر دهان
                </p>
              </div>

              {/* Primer / Sealer */}
              <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200 text-center">
                <span className="block text-xs font-bold text-teal-800 mb-1">
                  سيلر مائي (أساس للحوائط)
                </span>
                <span className="text-3xl font-black text-teal-900">{estimates.primerBuckets}</span>
                <span className="text-xs font-bold text-teal-700 mr-1">بستلة</span>
                <p className="text-[11px] text-teal-600 mt-1">
                  تعادل تقريباً {estimates.primerLiters} لتر (وجه واحد)
                </p>
              </div>

              {/* Putty Bags */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-center">
                <span className="block text-xs font-bold text-amber-800 mb-1">
                  شكاير معجون حوائط (جاهز)
                </span>
                <span className="text-3xl font-black text-amber-900">{estimates.puttyBags}</span>
                <span className="text-xs font-bold text-amber-700 mr-1">شيكارة</span>
                <p className="text-[11px] text-amber-600 mt-1">
                  تكفي وجهين معجون تأسيس تقريباً
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Quotation Section */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 space-y-3.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              حساب المقايسة وتكلفة المتر
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سعر المتر المربع (مصنعية أو شامل الخامات)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={settings.pricePerMeter || ''}
                    onChange={(e) => handleSettingChange('pricePerMeter', parseFloat(e.target.value) || 0)}
                    placeholder="35"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-base font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ج.م">ج.م (جنيه)</option>
                    <option value="ر.س">ر.س (ريال)</option>
                    <option value="د.إ">د.إ (درهم)</option>
                    <option value="د.ك">د.ك (دينار)</option>
                    <option value="$">$ (دولار)</option>
                  </select>
                </div>
              </div>

              {/* Total Quotation Amount */}
              <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-emerald-800">
                    إجمالي مقايسة المشروع التقديرية
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatNum(totals.totalNetPaintArea)} م² × {settings.pricePerMeter} {settings.currency}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                    {formatNum(estimates.totalCost)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 mr-1">
                    {settings.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* تنبيه تقلب الأسعار اليومية وزر تواصل معنا لمعرفة الأسعار */}
            <div className="pt-2 space-y-2.5">
              <div className="bg-[#faf5f0] border border-[#c87a3e]/40 rounded-xl p-3 text-center shadow-xs">
                <p className="text-[#1c1917] font-extrabold text-xs sm:text-sm leading-relaxed">
                  الأسعار بتتغير كل يوم حسب السوق وشركة الدهانات.
                </p>
              </div>

              <a
                href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(
                  `السلام عليكم، قمت بحساب مقايسة في حاسبة المواد لتطبيق الرضا:\n- صافي المساحة: ${totals.totalNetPaintArea} م²\n- البستلات: ${estimates.bucketsCount} بستلة\n- السيلر: ${estimates.primerBuckets} بستلة\n- المعجون: ${estimates.puttyBags} شكارة\nأود معرفة أحدث أسعار المواد وخامات الدهانات اليوم.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>تواصل معنا لمعرفة الأسعار</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer with Quick Export/Share */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyWhatsAppReport}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>تم نسخ المقايسة للواتساب!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة المقايسة لواتساب</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              title="طباعة التقرير"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">طباعة</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors text-center"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
