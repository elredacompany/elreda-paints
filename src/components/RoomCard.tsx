import React, { useState } from 'react';
import { Room } from '../types';
import {
  calculatePerimeter,
  calculateGrossWallArea,
  calculateCeilingArea,
  calculateTotalDeductions,
  calculateNetPaintArea,
  formatNum,
} from '../utils/calculations';
import {
  Edit3,
  Copy,
  Trash2,
  DoorOpen,
  Maximize2,
  Paintbrush,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  index: number;
  onEdit: (room: Room) => void;
  onDuplicate: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const perimeter = calculatePerimeter(room.length, room.width);
  const grossWallArea = calculateGrossWallArea(room.length, room.width, room.height);
  const ceilingArea = room.includeCeiling ? calculateCeilingArea(room.length, room.width) : 0;
  const deductions = calculateTotalDeductions(room.openings);
  const netPaintArea = calculateNetPaintArea(room);

  const doorsCount = room.openings
    .filter((o) => o.type === 'door')
    .reduce((sum, o) => sum + o.count, 0);

  const windowsCount = room.openings
    .filter((o) => o.type === 'window')
    .reduce((sum, o) => sum + o.count, 0);

  const customCount = room.openings
    .filter((o) => o.type === 'custom')
    .reduce((sum, o) => sum + o.count, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#faf5f0] text-[#a85a22] flex items-center justify-center font-black text-sm shrink-0 border border-[#c87a3e]/30">
            {index + 1}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
              {room.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs font-semibold">
              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {room.length}م × {room.width}م (ارتفاع {room.height}م)
              </span>
              {room.includeCeiling ? (
                <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  + يشمل السقف ({ceilingArea}م²)
                </span>
              ) : (
                <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  حوائط فقط
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Big Net Area Highlight on Card Header */}
        <div className="text-left shrink-0 bg-[#faf5f0] border border-[#c87a3e]/30/80 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2">
          <div className="text-[10px] sm:text-xs font-bold text-[#a85a22]">صافي الدهان</div>
          <div className="flex items-baseline gap-1 text-[#a85a22] justify-end">
            <span className="text-xl sm:text-2xl font-black">{formatNum(netPaintArea)}</span>
            <span className="text-xs font-bold">م²</span>
          </div>
        </div>
      </div>

      {/* Quick Visual Breakdown Grid */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/50 grid grid-cols-3 gap-2 text-center text-xs border-b border-slate-100">
        {/* Gross Wall Area */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/70">
          <span className="block text-slate-400 font-semibold text-[11px]">مساحة الحوائط</span>
          <span className="font-black text-slate-800 text-sm">{grossWallArea} م²</span>
        </div>

        {/* Deductions (Doors & Windows) */}
        <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200/80">
          <span className="block text-amber-700 font-semibold text-[11px]">الخصم (الفتحات)</span>
          <span className="font-black text-amber-700 text-sm">− {deductions} م²</span>
        </div>

        {/* Ceiling */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/70">
          <span className="block text-slate-400 font-semibold text-[11px]">السقف</span>
          <span className="font-black text-slate-800 text-sm">
            {room.includeCeiling ? `+ ${ceilingArea} م²` : '0 م²'}
          </span>
        </div>
      </div>

      {/* Details Accordion (Openings breakdown & finish tags) */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-[#faf5f0]/50 border-b border-slate-100 space-y-3 text-xs text-slate-700">
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#a85a22]" />
              <span>خطوات الحساب الرياضية:</span>
            </div>
            <div className="text-slate-600 space-y-0.5 pt-1">
              <p>• محيط الغرفة = 2 × ({room.length} + {room.width}) = <strong className="text-slate-900">{perimeter} متر</strong></p>
              <p>• مساحة الحوائط = {perimeter}م × {room.height}م = <strong className="text-slate-900">{grossWallArea} م²</strong></p>
              {room.includeCeiling && (
                <p>• مساحة السقف = {room.length}م × {room.width}م = <strong className="text-slate-900">{ceilingArea} م²</strong></p>
              )}
            </div>
          </div>

          {/* Openings list */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <DoorOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>الفتحات المخصومة بالتفصيل ({room.openings.length}):</span>
            </div>
            {room.openings.length === 0 ? (
              <p className="text-slate-400 italic">لا توجد فتحات مخصومة.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {room.openings.map((op) => (
                  <div
                    key={op.id}
                    className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">
                      {op.count > 1 ? `${op.count} × ` : ''}
                      {op.name}
                    </span>
                    <span className="text-slate-500 font-bold">
                      {op.width}م × {op.height}م ={' '}
                      <span className="text-amber-700 font-black">
                        {(op.width * op.height * op.count).toFixed(2)} م²
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paint Type & Notes */}
          {(room.paintType || room.paintColorName || room.notes) && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
              {room.paintType && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">نوع الدهان:</span>
                  <span className="font-bold text-slate-800">{room.paintType}</span>
                </div>
              )}
              {room.paintColorName && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">اللون:</span>
                  <span className="font-bold text-[#a85a22]">{room.paintColorName}</span>
                </div>
              )}
              {room.notes && (
                <div className="pt-1 text-slate-500">
                  <span className="font-semibold">ملاحظات: </span>
                  {room.notes}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Footer: Big, Clear, Comfortable Buttons */}
      <div className="p-3 sm:px-5 sm:py-3 flex items-center justify-between gap-2">
        {/* Toggle details */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-500 hover:text-[#a85a22] p-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>إخفاء التفاصيل</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>تفاصيل الحساب</span>
            </>
          )}
        </button>

        {/* Edit, Duplicate, Delete Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDuplicate(room)}
            className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-slate-600 hover:text-[#a85a22] hover:bg-[#faf5f0] rounded-xl transition-colors border border-transparent hover:border-[#c87a3e]/30 flex items-center gap-1"
            title="نسخ هذه الغرفة (تكرار نفس الأبعاد والفتحات لغرفة أخرى)"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نسخ</span>
          </button>

          <button
            onClick={() => onEdit(room)}
            className="px-3 py-2 bg-[#faf5f0] hover:bg-sky-100 active:bg-[#faf5f0] text-[#a85a22] text-xs font-extrabold rounded-xl transition-all border border-[#c87a3e]/30 flex items-center gap-1 shadow-2xs"
            title="تعديل أبعاد الغرفة أو الفتحات"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل</span>
          </button>

          <button
            onClick={() => onDelete(room.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="حذف الغرفة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
