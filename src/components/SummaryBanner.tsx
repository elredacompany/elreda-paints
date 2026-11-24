import React from 'react';
import { Project } from '../types';
import { calculateProjectTotals, formatNum } from '../utils/calculations';
import { Layers, DoorOpen, LayoutGrid, Sparkles, PaintRoller } from 'lucide-react';

interface SummaryBannerProps {
  project: Project;
  onOpenMaterialModal: () => void;
}

export const SummaryBanner: React.FC<SummaryBannerProps> = ({ project, onOpenMaterialModal }) => {
  const totals = calculateProjectTotals(project.rooms);

  return (
    <div className="bg-white border-2 border-[#c87a3e]/30 rounded-3xl p-4 sm:p-5 shadow-md mb-5 transition-all">
      {/* Top Header & Net Area Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30">
              <PaintRoller className="w-3.5 h-3.5 text-[#a85a22]" />
              ملخص إجمالي الدهانات
            </span>
            <span className="text-xs font-semibold text-[#78716c]">
              ({totals.roomsCount} {totals.roomsCount === 1 ? 'غرفة' : totals.roomsCount === 2 ? 'غرفتان' : 'غرف'})
            </span>
          </div>
          <h2 className="text-[#1c1917] font-bold text-sm sm:text-base">
            إجمالي المساحة الفعلية المطلوب دهانها
          </h2>
        </div>

        {/* Big Net Area Highlight */}
        <div className="copper-btn-gradient text-white rounded-2xl p-3.5 sm:px-6 sm:py-3 shadow-md shadow-[#c87a3e]/20 flex items-center justify-between md:justify-end gap-4">
          <div className="text-right">
            <div className="text-xs text-white/90 font-medium">صافي مساحة الدهان</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight">
                {formatNum(totals.totalNetPaintArea)}
              </span>
              <span className="text-base sm:text-lg font-bold text-white/90">متر مربع (م²)</span>
            </div>
          </div>
          <button
            onClick={onOpenMaterialModal}
            className="bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all border border-white/30 backdrop-blur-xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>حساب الخامات</span>
          </button>
        </div>
      </div>

      {/* Breakdown Grid with Soft Light Colors & Large Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3.5">
        {/* Gross Wall Area */}
        <div className="bg-[#faf5f0] rounded-2xl p-3 border border-[#c87a3e]/20 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#78716c] text-xs font-semibold mb-1">
            <Layers className="w-4 h-4 text-[#a85a22]" />
            <span>مساحة الحوائط الخام</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#1c1917]">
              {formatNum(totals.totalGrossWall)}
            </span>
            <span className="text-xs font-bold text-[#78716c]">م²</span>
          </div>
          <p className="text-[11px] text-[#78716c] mt-0.5">قبل خصم الفتحات</p>
        </div>

        {/* Deductions (Doors & Windows) */}
        <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-300 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-900 text-xs font-semibold mb-1">
            <DoorOpen className="w-4 h-4 text-amber-700" />
            <span>خصم الفتحات</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-amber-800">
              - {formatNum(totals.totalDeductions)}
            </span>
            <span className="text-xs font-bold text-amber-700">م²</span>
          </div>
          <p className="text-[11px] text-amber-800/80 mt-0.5">
            {totals.totalDoorsCount} أبواب • {totals.totalWindowsCount} شبابيك
          </p>
        </div>

        {/* Ceilings Area */}
        <div className="bg-[#faf5f0] rounded-2xl p-3 border border-[#c87a3e]/20 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#78716c] text-xs font-semibold mb-1">
            <LayoutGrid className="w-4 h-4 text-[#a85a22]" />
            <span>مساحة الأسقف</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#1c1917]">
              + {formatNum(totals.totalCeiling)}
            </span>
            <span className="text-xs font-bold text-[#78716c]">م²</span>
          </div>
          <p className="text-[11px] text-[#78716c] mt-0.5">للغرف المحددة فقط</p>
        </div>

        {/* Estimated Paint Buckets Quick Glance */}
        <div className="bg-[#faf5f0] rounded-2xl p-3 border border-[#c87a3e]/20 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#a85a22] text-xs font-semibold mb-1">
            <PaintRoller className="w-4 h-4 text-[#a85a22]" />
            <span>بستلات الدهان (وجهين)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#a85a22]">
              ≈ {totals.totalNetPaintArea > 0 ? Math.ceil((totals.totalNetPaintArea * 2) / (10 * 14)) : 0}
            </span>
            <span className="text-xs font-bold text-[#a85a22]">بستلة (14ل)</span>
          </div>
          <p className="text-[11px] text-[#78716c] mt-0.5">تقدير أولي سريع</p>
        </div>
      </div>
    </div>
  );
};
