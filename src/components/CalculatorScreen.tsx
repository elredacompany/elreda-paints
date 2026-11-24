import React, { useState, useMemo } from 'react';
import {
  Calculator,
  PhoneCall,
  MessageCircle,
  Palette,
  X,
  Plus,
  Minus,
  CheckCircle2,
  Send,
  User,
  Phone,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Screen, MaterialPrices, PaintBrandOption } from '../types';
import { createCalculatorLeadInFirestore } from '../services/firebase';
import { calculateMaterialsFromTotalArea } from '../utils/materialCalculator';

interface CalculatorScreenProps {
  onNavigateToContactWithSpecs: (specs: {
    area: number;
    estimatedCost: number;
    paintTypeName: string;
    roomImage?: string | null;
  }) => void;
  onNavigate: (screen: Screen) => void;
  materialPrices?: MaterialPrices;
  initialSelectedColor?: {
    name: string;
    code: string;
    hex: string;
  } | null;
  paintBrands?: PaintBrandOption[];
  isPricesFromSupabase?: boolean;
  companyCoverageMap?: Record<string, number>;
  isCoverageFromSupabase?: boolean;
}

type SpaceKind = 'room' | 'reception' | 'corridor';

interface SpaceDimensions {
  id: string;
  kind: SpaceKind;
  index: number;
  length: string;
  width: string;
  height: string;
  openings: string;
}

const DEFAULT_SPACE_PRESETS: Record<
  SpaceKind,
  { length: string; width: string; height: string; openings: string; title: string }
> = {
  room: { length: '4', width: '3.5', height: '2.8', openings: '2.5', title: 'غرفة' },
  reception: { length: '6', width: '4', height: '2.8', openings: '4', title: 'ريسبشن' },
  corridor: { length: '3', width: '1.5', height: '2.8', openings: '1.5', title: 'طرقة / فراغ' },
};

function createSpaceEntry(kind: SpaceKind, index: number): SpaceDimensions {
  const preset = DEFAULT_SPACE_PRESETS[kind];
  return {
    id: `${kind}-${index}`,
    kind,
    index,
    length: preset.length,
    width: preset.width,
    height: preset.height,
    openings: preset.openings,
  };
}

function resizeSpaceList(
  prev: SpaceDimensions[],
  kind: SpaceKind,
  targetCount: number
): SpaceDimensions[] {
  const clamped = Math.max(0, Math.min(kind === 'reception' ? 5 : 15, targetCount));
  const next: SpaceDimensions[] = [];
  for (let i = 1; i <= clamped; i++) {
    const existing = prev.find((item) => item.id === `${kind}-${i}`);
    next.push(existing || createSpaceEntry(kind, i));
  }
  return next;
}

function parseNonNegative(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  onNavigateToContactWithSpecs,
  onNavigate,
  initialSelectedColor,
}) => {
  const [rooms, setRooms] = useState<SpaceDimensions[]>(() => [
    createSpaceEntry('room', 1),
    createSpaceEntry('room', 2),
  ]);
  const [receptions, setReceptions] = useState<SpaceDimensions[]>(() => [
    createSpaceEntry('reception', 1),
  ]);
  const [corridors, setCorridors] = useState<SpaceDimensions[]>(() => [
    createSpaceEntry('corridor', 1),
  ]);
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor || null);

  // Soft Gate state
  const [isSoftGateDismissed, setIsSoftGateDismissed] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadError, setLeadError] = useState<string | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);

  const handleCountChange = (kind: SpaceKind, rawCount: number) => {
    const safeCount = Number.isFinite(rawCount) ? Math.max(0, Math.floor(rawCount)) : 0;
    if (kind === 'room') {
      setRooms((prev) => resizeSpaceList(prev, 'room', safeCount));
    } else if (kind === 'reception') {
      setReceptions((prev) => resizeSpaceList(prev, 'reception', safeCount));
    } else {
      setCorridors((prev) => resizeSpaceList(prev, 'corridor', safeCount));
    }
  };

  const handleDimensionChange = (
    kind: SpaceKind,
    id: string,
    field: 'length' | 'width' | 'height' | 'openings',
    value: string
  ) => {
    const updater = (prev: SpaceDimensions[]) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item));

    if (kind === 'room') setRooms(updater);
    else if (kind === 'reception') setReceptions(updater);
    else setCorridors(updater);
  };

  const allSpaces = useMemo(
    () => [...rooms, ...receptions, ...corridors],
    [rooms, receptions, corridors]
  );

  const computedSpaces = useMemo(() => {
    return allSpaces.map((space) => {
      const length = parseNonNegative(space.length);
      const width = parseNonNegative(space.width);
      const height = parseNonNegative(space.height);
      const openings = parseNonNegative(space.openings);

      const ceilingArea = length * width;
      const perimeter = 2 * (length + width);
      const netWallArea = Math.max(0, perimeter * height - openings);
      const totalArea = ceilingArea + netWallArea;

      return {
        ...space,
        ceilingArea: Number(ceilingArea.toFixed(1)),
        netWallArea: Number(netWallArea.toFixed(1)),
        totalArea: Number(totalArea.toFixed(1)),
      };
    });
  }, [allSpaces]);

  const totals = useMemo(() => {
    const ceiling = computedSpaces.reduce((acc, s) => acc + s.ceilingArea, 0);
    const walls = computedSpaces.reduce((acc, s) => acc + s.netWallArea, 0);
    const paintArea = ceiling + walls;
    return {
      ceiling: Number(ceiling.toFixed(1)),
      walls: Number(walls.toFixed(1)),
      paintArea: Number(paintArea.toFixed(1)),
    };
  }, [computedSpaces]);

  // المرجع الدقيق لمساحة إجمالية 140 م²:
  // السيلر: 2 بستلة
  // بطانة السقف: 1 بستلة سيلر + 1 بستلة بلاستيك
  // بطانة الحوائط: 1 بستلة سيلر + 1 بستلة بلاستيك
  // معجون 4 سواكين (للحوائط): 12 شكارة
  // معجون ممتاز (لفواصل جبسون بورد): 1 شكارة
  // السنفرة: 12 فرخ سنفرة + 2 فرخ سنفرة دوكو
  // تشطيب السقف: 2 بستلة
  // تشطيب الحوائط: 2 بستلة
  const materials = useMemo(
    () => calculateMaterialsFromTotalArea(totals.paintArea),
    [totals.paintArea]
  );

  const foundationRows = [
    {
      name: 'السيلر',
      qty: `${materials.sealer} بستلة`,
    },
    {
      name: 'بطانة السقف',
      qty: `${materials.ceilingPrimerSealer} بستلة سيلر + ${materials.ceilingPrimerPlastic} بستلة بلاستيك`,
    },
    {
      name: 'بطانة الحوائط',
      qty: `${materials.wallPrimerSealer} بستلة سيلر + ${materials.wallPrimerPlastic} بستلة بلاستيك`,
    },
    {
      name: 'معجون 4 سواكين (للحوائط)',
      qty: `${materials.puttyFourCoats} شكارة`,
    },
    {
      name: 'معجون ممتاز (لفواصل جبسون بورد)',
      qty: `${materials.puttyPremium} شكارة`,
    },
    {
      name: 'السنفرة',
      qty: `${materials.sandpaperNormal} فرخ سنفرة + ${materials.sandpaperDuco} فرخ سنفرة دوكو`,
    },
  ];

  const finishingRows = [
    {
      name: 'تشطيب السقف',
      qty: `${materials.ceilingFinish} بستلة`,
    },
    {
      name: 'تشطيب الحوائط',
      qty: `${materials.wallFinish} بستلة`,
    },
  ];

  const whatsappSummary = `مرحباً شركة الرضا للدهانات والديكور، قمت بحساب الكميات من التطبيق:
عدد الغرف: ${rooms.length} | عدد الريسبشن: ${receptions.length} | عدد الطرق/الفراغات: ${corridors.length}
السقف: ${totals.ceiling} م² | الحوائط (بعد خصم الفوارغ): ${totals.walls} م² | المساحة الإجمالية للدهانات: ${totals.paintArea} م²

كميات التأسيس:
- السيلر: ${materials.sealer} بستلة
- بطانة السقف: ${materials.ceilingPrimerSealer} بستلة سيلر + ${materials.ceilingPrimerPlastic} بستلة بلاستيك
- بطانة الحوائط: ${materials.wallPrimerSealer} بستلة سيلر + ${materials.wallPrimerPlastic} بستلة بلاستيك
- معجون 4 سواكين (للحوائط): ${materials.puttyFourCoats} شكارة
- معجون ممتاز (لفواصل جبسون بورد): ${materials.puttyPremium} شكارة
- السنفرة: ${materials.sandpaperNormal} فرخ سنفرة + ${materials.sandpaperDuco} فرخ سنفرة دوكو

كميات التشطيب:
- تشطيب السقف: ${materials.ceilingFinish} بستلة
- تشطيب الحوائط: ${materials.wallFinish} بستلة${
    selectedColor ? `\nاللون المختار: ${selectedColor.name} (${selectedColor.code})` : ''
  }`;

  const countControls: { kind: SpaceKind; label: string; count: number; max: number }[] = [
    { kind: 'room', label: 'عدد الغرف', count: rooms.length, max: 15 },
    { kind: 'reception', label: 'عدد الريسبشن', count: receptions.length, max: 5 },
    { kind: 'corridor', label: 'عدد الطرق/الفراغات', count: corridors.length, max: 10 },
  ];

  return (
    <div className="space-y-4 pb-24 text-[#1c1917] max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl px-4 py-3.5 border border-[#c87a3e]/30 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl copper-btn-gradient text-white flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[#1c1917] leading-snug">
            حاسبة المواد بنظام الغرف الديناميكي
          </h1>
          <p className="text-sm text-[#57534e] leading-snug">
            حدد عدد الغرف والريسبشن والطرق وأبعاد كل جزء لحساب الخامات بدقة
          </p>
        </div>
      </div>

      {/* Optional Selected Color */}
      {selectedColor && (
        <div className="px-4 py-2.5 rounded-xl bg-[#faf5f0] border border-[#c87a3e]/35 flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2.5">
            <span
              className="w-5 h-5 rounded-md border border-black/20 shrink-0"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <span className="font-bold text-[#1c1917]">
              اللون المختار: {selectedColor.name} ({selectedColor.code})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedColor(null)}
            className="text-[#57534e] hover:text-[#1c1917] p-1 cursor-pointer"
            title="إزالة اللون"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 1: 3 Dynamic Space Count Inputs */}
      <div className="bg-white rounded-2xl p-4 border border-[#c87a3e]/30 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {countControls.map((ctrl) => (
            <div
              key={ctrl.kind}
              className="bg-[#faf5f0] border border-[#c87a3e]/30 rounded-xl p-3 space-y-2"
            >
              <label
                htmlFor={`count-${ctrl.kind}`}
                className="block text-sm font-black text-[#1c1917]"
              >
                {ctrl.label}
              </label>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCountChange(ctrl.kind, ctrl.count - 1)}
                  disabled={ctrl.count <= 0}
                  className="w-9 h-9 rounded-lg bg-white border border-neutral-300 hover:border-[#a85a22] text-[#1c1917] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  aria-label={`تقليل ${ctrl.label}`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id={`count-${ctrl.kind}`}
                  type="number"
                  min={0}
                  max={ctrl.max}
                  value={ctrl.count}
                  onChange={(e) => handleCountChange(ctrl.kind, parseInt(e.target.value || '0', 10))}
                  className="w-16 text-center text-lg font-black font-mono text-[#1c1917] bg-white border border-[#c87a3e]/40 rounded-lg py-1.5 focus:outline-none focus:border-[#a85a22]"
                />
                <button
                  type="button"
                  onClick={() => handleCountChange(ctrl.kind, ctrl.count + 1)}
                  disabled={ctrl.count >= ctrl.max}
                  className="w-9 h-9 rounded-lg copper-btn-gradient text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  aria-label={`زيادة ${ctrl.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Step 2: Dynamically Generated Dimension Inputs Per Space */}
        {computedSpaces.length === 0 ? (
          <div className="text-center py-6 px-4 bg-[#faf5f0] rounded-xl border border-dashed border-[#c87a3e]/40 text-sm font-bold text-[#57534e]">
            أدخل عدداً واحداً على الأقل في الغرف أو الريسبشن أو الطرق لبدء الحساب.
          </div>
        ) : (
          <div className="space-y-3">
            {computedSpaces.map((space) => {
              const title = `${DEFAULT_SPACE_PRESETS[space.kind].title} ${space.index}`;
              return (
                <div
                  key={space.id}
                  className="bg-[#faf5f0] border border-neutral-200 rounded-xl p-3 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                    <span className="text-sm sm:text-base font-black text-[#1c1917]">
                      {title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#57534e]">
                      <span>السقف: {space.ceilingArea} م²</span>
                      <span>•</span>
                      <span>الحوائط: {space.netWallArea} م²</span>
                      <span>•</span>
                      <span className="text-[#8c4a1e] font-black">
                        الإجمالي: {space.totalArea} م²
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="space-y-1">
                      <label
                        htmlFor={`${space.id}-length`}
                        className="block text-xs sm:text-sm font-bold text-[#1c1917]"
                      >
                        الطول (م)
                      </label>
                      <input
                        id={`${space.id}-length`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={space.length}
                        onChange={(e) =>
                          handleDimensionChange(space.kind, space.id, 'length', e.target.value)
                        }
                        className="w-full text-base font-black font-mono text-[#1c1917] bg-white border border-neutral-300 focus:border-[#a85a22] rounded-lg px-2.5 py-2 focus:outline-none text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor={`${space.id}-width`}
                        className="block text-xs sm:text-sm font-bold text-[#1c1917]"
                      >
                        العرض (م)
                      </label>
                      <input
                        id={`${space.id}-width`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={space.width}
                        onChange={(e) =>
                          handleDimensionChange(space.kind, space.id, 'width', e.target.value)
                        }
                        className="w-full text-base font-black font-mono text-[#1c1917] bg-white border border-neutral-300 focus:border-[#a85a22] rounded-lg px-2.5 py-2 focus:outline-none text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor={`${space.id}-height`}
                        className="block text-xs sm:text-sm font-bold text-[#1c1917]"
                      >
                        الارتفاع (م)
                      </label>
                      <input
                        id={`${space.id}-height`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={space.height}
                        onChange={(e) =>
                          handleDimensionChange(space.kind, space.id, 'height', e.target.value)
                        }
                        className="w-full text-base font-black font-mono text-[#1c1917] bg-white border border-neutral-300 focus:border-[#a85a22] rounded-lg px-2.5 py-2 focus:outline-none text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor={`${space.id}-openings`}
                        className="block text-xs sm:text-sm font-bold text-[#1c1917]"
                      >
                        الفوارغ (م²)
                      </label>
                      <input
                        id={`${space.id}-openings`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={space.openings}
                        onChange={(e) =>
                          handleDimensionChange(space.kind, space.id, 'openings', e.target.value)
                        }
                        title="مساحة الأبواب والشبابيك"
                        className="w-full text-base font-black font-mono text-[#1c1917] bg-white border border-neutral-300 focus:border-[#a85a22] rounded-lg px-2.5 py-2 focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total Paint Area Summary Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 text-center">
          <div className="bg-[#faf5f0] rounded-xl py-2.5 px-2">
            <span className="block text-xs sm:text-sm font-bold text-[#57534e]">إجمالي السقف</span>
            <span className="font-mono font-black text-base sm:text-lg text-[#1c1917]">
              {totals.ceiling} م²
            </span>
          </div>
          <div className="bg-[#faf5f0] rounded-xl py-2.5 px-2">
            <span className="block text-xs sm:text-sm font-bold text-[#57534e]">صافي الحوائط</span>
            <span className="font-mono font-black text-base sm:text-lg text-[#1c1917]">
              {totals.walls} م²
            </span>
          </div>
          <div className="bg-[#f5ebe0] border border-[#c87a3e]/40 rounded-xl py-2.5 px-2">
            <span className="block text-xs sm:text-sm font-bold text-[#8c4a1e]">
              المساحة الإجمالية للدهانات
            </span>
            <span className="font-mono font-black text-base sm:text-lg text-[#8c4a1e]">
              {totals.paintArea} م²
            </span>
          </div>
        </div>
      </div>

      {/* Step 3: Clean Compact Results Table inside ONE Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c87a3e]/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
          <h2 className="text-base sm:text-lg font-black text-[#1c1917]">
            جدول الخامات المطلوبة
          </h2>
          <span className="text-sm sm:text-base font-black font-mono text-[#8c4a1e]">
            {totals.paintArea} م²
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#faf5f0] border-b border-neutral-200 text-[#1c1917]">
                <th className="py-2.5 px-3.5 text-sm sm:text-base font-black">الخامة</th>
                <th className="py-2.5 px-3.5 text-sm sm:text-base font-black text-left">
                  الكمية المقدرة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[#1c1917]">
              <tr className="bg-neutral-100">
                <td
                  colSpan={2}
                  className="py-2 px-3.5 text-sm font-black text-[#8c4a1e]"
                >
                  كميات التأسيس
                </td>
              </tr>
              {foundationRows.map((row) => (
                <tr key={row.name} className="bg-white">
                  <td className="py-2.5 px-3.5 text-sm sm:text-base font-bold text-[#1c1917]">
                    {row.name}
                  </td>
                  <td className="py-2.5 px-3.5 text-left text-sm sm:text-base font-black text-[#a85a22]">
                    {row.qty}
                  </td>
                </tr>
              ))}

              <tr className="bg-emerald-50">
                <td
                  colSpan={2}
                  className="py-2 px-3.5 text-sm font-black text-emerald-800"
                >
                  كميات التشطيب
                </td>
              </tr>
              {finishingRows.map((row) => (
                <tr key={row.name} className="bg-white">
                  <td className="py-2.5 px-3.5 text-sm sm:text-base font-bold text-[#1c1917]">
                    {row.name}
                  </td>
                  <td className="py-2.5 px-3.5 text-left text-sm sm:text-base font-black text-emerald-700">
                    {row.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Exact Required Disclaimer */}
        <p className="text-sm font-bold text-[#1c1917] bg-[#faf5f0] border border-[#c87a3e]/30 rounded-xl px-4 py-3 text-center leading-relaxed">
          هذه الحسابات تقريبية وتخضع للمعاينة لتحديد الكميات النهائية بدقة 100%
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappSummary)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>واتساب ({COMPANY_INFO.phone})</span>
          </a>

          <button
            type="button"
            onClick={() =>
              onNavigateToContactWithSpecs({
                area: totals.paintArea,
                estimatedCost: 0,
                paintTypeName: `${rooms.length} غرفة + ${receptions.length} ريسبشن + ${corridors.length} طرقة (إجمالي الدهانات ${totals.paintArea} م²)${
                  selectedColor ? ` - لون ${selectedColor.name} (${selectedColor.code})` : ''
                }`,
              })
            }
            className="flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl copper-btn-gradient text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>طلب معاينة</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('jotun_colors')}
            className="py-2.5 px-3.5 rounded-xl bg-[#faf5f0] hover:bg-[#f1e7dc] text-[#8c4a1e] border border-[#c87a3e]/40 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span>كتالوج الألوان</span>
          </button>
        </div>
      </div>

      {/* Step 4: Non-Intrusive Soft Gate Card Below Results */}
      {totals.paintArea > 0 && !isSoftGateDismissed && (
        <div className="space-y-1.5">
          <div className="bg-gradient-to-br from-[#fffaf5] to-white rounded-2xl p-4 sm:p-5 border border-[#c87a3e]/40 shadow-sm space-y-3.5">
            {isLeadSubmitted ? (
              <div className="py-2 text-center space-y-2.5">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#1c1917]">
                  شكراً لتواصلك مع الرضا للدهانات والديكورات!
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                  تم حفظ حسبتك ورقمك بنجاح، وسيتواصل معك فريقنا قريباً لإرسال الحسبة وتنسيق المعاينة المجانية.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-[#1c1917] leading-relaxed">
                    عايز تبعت الحسبة دي على الواتساب عشان متنساهاش؟ وتحجز معاينة مجانية؟ سيب رقمك هنا.
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLeadError(null);
                    const digitsOnly = leadPhone.replace(/\D/g, '');
                    if (!/^01[0125][0-9]{8}$/.test(digitsOnly)) {
                      setLeadError('يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقماً (يبدأ بـ 01).');
                      return;
                    }

                    setIsSubmittingLead(true);
                    const dimensionsSummary = [
                      `غرف: ${rooms.length} | ريسبشن: ${receptions.length} | طرق: ${corridors.length}`,
                      ...computedSpaces.map(
                        (sp) =>
                          `${DEFAULT_SPACE_PRESETS[sp.kind].title} ${sp.index}: ${sp.length}×${sp.width}م (ارتفاع ${sp.height}م، إجمالي ${sp.totalArea} م²)`
                      ),
                      selectedColor ? `اللون المختار: ${selectedColor.name} (${selectedColor.code})` : '',
                    ]
                      .filter(Boolean)
                      .join(' · ');

                    const materialsSummary = [
                      `السيلر: ${materials.sealer} بستلة`,
                      `بطانة السقف: ${materials.ceilingPrimerSealer} سيلر + ${materials.ceilingPrimerPlastic} بلاستيك`,
                      `بطانة الحوائط: ${materials.wallPrimerSealer} سيلر + ${materials.wallPrimerPlastic} بلاستيك`,
                      `معجون 4 سواكين: ${materials.puttyFourCoats} شكارة`,
                      `معجون ممتاز: ${materials.puttyPremium} شكارة`,
                      `السنفرة: ${materials.sandpaperNormal} فرخ + ${materials.sandpaperDuco} دوكو`,
                      `تشطيب السقف: ${materials.ceilingFinish} بستلة`,
                      `تشطيب الحوائط: ${materials.wallFinish} بستلة`,
                    ].join(' | ');

                    const res = await createCalculatorLeadInFirestore({
                      name: leadName.trim() || 'عميل الحاسبة',
                      phone: digitsOnly,
                      totalArea: totals.paintArea,
                      ceilingArea: totals.ceiling,
                      wallsArea: totals.walls,
                      roomsCount: rooms.length,
                      receptionsCount: receptions.length,
                      corridorsCount: corridors.length,
                      dimensionsSummary,
                      materialsSummary,
                    });

                    setIsSubmittingLead(false);
                    if (res.success) {
                      setIsLeadSubmitted(true);
                    } else {
                      setLeadError('تعذر حفظ البيانات مؤقتاً، يرجى المحاولة مرة أخرى.');
                    }
                  }}
                  className="space-y-2.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="relative">
                      <User className="w-4 h-4 text-[#78716c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="الاسم (اختياري)"
                        maxLength={100}
                        className="w-full min-h-[44px] pr-9 pl-3 rounded-xl bg-white border border-neutral-300 focus:border-[#a85a22] text-sm text-[#1c1917] placeholder:text-[#78716c] focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#78716c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        inputMode="tel"
                        dir="ltr"
                        required
                        maxLength={15}
                        value={leadPhone}
                        onChange={(e) => {
                          setLeadPhone(e.target.value);
                          if (leadError) setLeadError(null);
                        }}
                        placeholder="01xxxxxxxxx"
                        className="w-full min-h-[44px] pr-9 pl-3 rounded-xl bg-white border border-neutral-300 focus:border-[#a85a22] text-sm font-mono text-[#1c1917] placeholder:text-[#78716c] text-left focus:outline-none"
                      />
                    </div>
                  </div>

                  {leadError && (
                    <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                      {leadError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full min-h-[46px] px-4 rounded-xl copper-btn-gradient text-white font-black text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingLead ? 'جارٍ الإرسال...' : 'إرسال'}</span>
                  </button>
                </form>
              </>
            )}
          </div>

          {!isLeadSubmitted && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsSoftGateDismissed(true)}
                className="text-[11px] font-medium text-[#78716c] hover:text-[#1c1917] px-3 py-1 transition-colors cursor-pointer"
              >
                تخطي
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
