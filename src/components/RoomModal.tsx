import React, { useState, useEffect } from 'react';
import { Room, OpeningItem } from '../types';
import {
  calculatePerimeter,
  calculateGrossWallArea,
  calculateCeilingArea,
  calculateTotalDeductions,
  calculateOpeningArea,
  formatNum,
} from '../utils/calculations';
import {
  X,
  Plus,
  Trash2,
  DoorOpen,
  Maximize2,
  Sparkles,
  HelpCircle,
  Check,
  Paintbrush,
  Square,
  Minus,
} from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
  initialRoom?: Room | null;
}

const ROOM_NAME_PRESETS = [
  'الصالون / المجلس',
  'غرفة النوم الرئيسية',
  'غرفة أطفال',
  'صالة المعيشة',
  'المطبخ',
  'الممر / الطُرقة',
  'الحمام',
  'المكتب',
  'غرفة الضيوف',
];

const HEIGHT_PRESETS = [2.6, 2.7, 2.8, 3.0, 3.2];

const PAINT_TYPES = [
  'نصف لمعة (شائع للحوائط)',
  'مطفي فاخر (للحوائط والأسقف)',
  'لامع كامل (للأبواب والكرانيش)',
  'ديكوري (فلفت / سواحلي / ستوكو)',
  'تأسيس ومعجون فقط',
];

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoom,
}) => {
  const [name, setName] = useState('');
  const [length, setLength] = useState<number>(4.0);
  const [width, setWidth] = useState<number>(3.5);
  const [height, setHeight] = useState<number>(2.8);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [openings, setOpenings] = useState<OpeningItem[]>([]);
  const [paintType, setPaintType] = useState<string>('نصف لمعة (شائع للحوائط)');
  const [paintColorName, setPaintColorName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Populate state when modal opens or initialRoom changes
  useEffect(() => {
    if (initialRoom) {
      setName(initialRoom.name);
      setLength(initialRoom.length);
      setWidth(initialRoom.width);
      setHeight(initialRoom.height);
      setIncludeCeiling(initialRoom.includeCeiling);
      setOpenings(initialRoom.openings || []);
      setPaintType(initialRoom.paintType || 'نصف لمعة (شائع للحوائط)');
      setPaintColorName(initialRoom.paintColorName || '');
      setNotes(initialRoom.notes || '');
    } else {
      // New room defaults
      setName('');
      setLength(4.0);
      setWidth(3.5);
      setHeight(2.8);
      setIncludeCeiling(false);
      // Sensible standard defaults: 1 door & 1 window for quick entry
      setOpenings([
        {
          id: 'op-' + Math.random().toString(36).substring(2, 7),
          name: 'باب الغرفة',
          type: 'door',
          width: 0.9,
          height: 2.1,
          count: 1,
        },
        {
          id: 'op-' + Math.random().toString(36).substring(2, 7),
          name: 'شباك الغرفة',
          type: 'window',
          width: 1.2,
          height: 1.2,
          count: 1,
        },
      ]);
      setPaintType('نصف لمعة (شائع للحوائط)');
      setPaintColorName('');
      setNotes('');
    }
  }, [initialRoom, isOpen]);

  if (!isOpen) return null;

  // Live Calculations
  const perimeter = calculatePerimeter(length, width);
  const grossWallArea = calculateGrossWallArea(length, width, height);
  const ceilingArea = includeCeiling ? calculateCeilingArea(length, width) : 0;
  const totalDeductions = calculateTotalDeductions(openings);
  const netPaintArea = Math.max(0, Number((grossWallArea - totalDeductions + ceilingArea).toFixed(2)));

  // Handlers for Openings
  const handleAddDoor = () => {
    setOpenings([
      ...openings,
      {
        id: 'op-' + Date.now() + Math.random().toString(36).substring(2, 5),
        name: 'باب إضافي',
        type: 'door',
        width: 0.9,
        height: 2.1,
        count: 1,
      },
    ]);
  };

  const handleAddWindow = () => {
    setOpenings([
      ...openings,
      {
        id: 'op-' + Date.now() + Math.random().toString(36).substring(2, 5),
        name: 'شباك إضافي',
        type: 'window',
        width: 1.2,
        height: 1.2,
        count: 1,
      },
    ]);
  };

  const handleAddCustomOpening = () => {
    setOpenings([
      ...openings,
      {
        id: 'op-' + Date.now() + Math.random().toString(36).substring(2, 5),
        name: 'فتحة / بلكونة',
        type: 'custom',
        width: 1.5,
        height: 2.2,
        count: 1,
      },
    ]);
  };

  const handleUpdateOpening = (id: string, field: keyof OpeningItem, value: any) => {
    setOpenings(
      openings.map((op) => {
        if (op.id === id) {
          return { ...op, [field]: value };
        }
        return op;
      })
    );
  };

  const handleRemoveOpening = (id: string) => {
    setOpenings(openings.filter((op) => op.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRoom: Room = {
      id: initialRoom ? initialRoom.id : 'room-' + Date.now(),
      name: name.trim() || 'غرفة جديدة',
      length: Number(length) || 0,
      width: Number(width) || 0,
      height: Number(height) || 0,
      includeCeiling,
      openings,
      paintType,
      paintColorName: paintColorName.trim(),
      notes: notes.trim(),
      createdAt: initialRoom ? initialRoom.createdAt : Date.now(),
    };
    onSave(finalRoom);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl copper-btn-gradient text-white flex items-center justify-center shadow-xs">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                {initialRoom ? 'تعديل بيانات الغرفة' : 'إضافة غرفة جديدة'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                أدخل الأبعاد لحساب مساحة الحوائط وخصم الأبواب والشبابيك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form id="room-form" onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Room Name & Quick Presets */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              اسم الغرفة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الصالون، غرفة النوم الرئيسية، المجلس..."
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c87a3e] focus:border-transparent transition-all shadow-2xs"
              required
              autoFocus={!initialRoom}
            />

            {/* Quick chips */}
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1.5">اقتراحات سريعة لاسم الغرفة:</div>
              <div className="flex flex-wrap gap-1.5">
                {ROOM_NAME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setName(preset)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      name === preset
                        ? 'copper-btn-gradient text-white border-[#c87a3e] font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Room Dimensions (Length, Width, Height) */}
          <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-sky-600" />
                أبعاد الغرفة (بالمتر)
              </h4>
              <span className="text-xs text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md font-semibold">
                طول × عرض × ارتفاع
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Length Input */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  الطول (متر) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="50"
                    value={length || ''}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full text-xl font-black text-slate-900 p-1.5 rounded-lg focus:outline-none focus:bg-sky-50"
                    placeholder="4.0"
                    required
                  />
                  <span className="text-xs font-bold text-slate-400">متر</span>
                </div>
                <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setLength((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
                    className="flex-1 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                  >
                    -0.25
                  </button>
                  <button
                    type="button"
                    onClick={() => setLength((prev) => Number((prev + 0.25).toFixed(2)))}
                    className="flex-1 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                  >
                    +0.25
                  </button>
                </div>
              </div>

              {/* Width Input */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  العرض (متر) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="50"
                    value={width || ''}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full text-xl font-black text-slate-900 p-1.5 rounded-lg focus:outline-none focus:bg-sky-50"
                    placeholder="3.5"
                    required
                  />
                  <span className="text-xs font-bold text-slate-400">متر</span>
                </div>
                <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWidth((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))))}
                    className="flex-1 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                  >
                    -0.25
                  </button>
                  <button
                    type="button"
                    onClick={() => setWidth((prev) => Number((prev + 0.25).toFixed(2)))}
                    className="flex-1 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                  >
                    +0.25
                  </button>
                </div>
              </div>

              {/* Height Input */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  ارتفاع الحوائط (متر) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="10"
                    value={height || ''}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full text-xl font-black text-slate-900 p-1.5 rounded-lg focus:outline-none focus:bg-sky-50"
                    placeholder="2.8"
                    required
                  />
                  <span className="text-xs font-bold text-slate-400">متر</span>
                </div>
                <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                  {HEIGHT_PRESETS.slice(1, 4).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHeight(h)}
                      className={`flex-1 py-1 text-[11px] rounded font-bold transition-colors ${
                        height === h
                          ? 'copper-btn-gradient text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {h}م
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Formula Preview of Perimeter & Gross Walls */}
            <div className="bg-white/90 p-3 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-slate-700 space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-500">محيط الغرفة = 2 × (الطول + العرض) = </span>
                  <span className="font-bold text-slate-900">2 × ({length} + {width}) = {perimeter} متر</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">مساحة الحوائط الإجمالية = المحيط × الارتفاع = </span>
                  <span className="font-bold text-slate-900">{perimeter} × {height} = </span>
                  <span className="font-black text-sky-700 text-sm">{grossWallArea} م²</span>
                </div>
              </div>
              <div className="bg-sky-100/70 text-sky-800 px-3 py-1.5 rounded-lg text-center font-bold self-start sm:self-center">
                إجمالي الحوائط: {grossWallArea} م²
              </div>
            </div>
          </div>

          {/* 3. Openings Deduction (الأبواب والشبابيك) */}
          <div className="bg-amber-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200/80 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-amber-600" />
                  خصم الأبواب والشبابيك (الفتحات)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  يتم طرح مساحة الفتحات تلقائياً من مساحة الحوائط لتوفير استهلاك الدهان بدقة
                </p>
              </div>

              {/* Total Deductions Badge */}
              <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-extrabold border border-amber-300 self-start sm:self-auto flex items-center gap-1.5">
                <span>إجمالي المخصوم:</span>
                <span className="text-sm font-black text-amber-700">− {totalDeductions} م²</span>
              </div>
            </div>

            {/* Quick Add Buttons for Openings */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddDoor}
                className="bg-white hover:bg-amber-50 active:bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>+ إضافة باب (0.9 × 2.1م)</span>
              </button>
              <button
                type="button"
                onClick={handleAddWindow}
                className="bg-white hover:bg-amber-50 active:bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>+ إضافة شباك (1.2 × 1.2م)</span>
              </button>
              <button
                type="button"
                onClick={handleAddCustomOpening}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ فتحة مخصصة (بلكونة / قوس)</span>
              </button>
            </div>

            {/* Openings List */}
            {openings.length === 0 ? (
              <div className="bg-white p-4 rounded-xl border border-dashed border-amber-200 text-center text-xs text-slate-500">
                لا توجد فتحات مخصومة حالياً. (الحوائط ستُحسب بالكامل بدون خصم).
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {openings.map((op, idx) => {
                  const itemArea = calculateOpeningArea(op);
                  return (
                    <div
                      key={op.id}
                      className="bg-white p-3 rounded-xl border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Name & Type */}
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={op.name}
                          onChange={(e) => handleUpdateOpening(op.id, 'name', e.target.value)}
                          className="font-bold text-xs sm:text-sm text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-500 focus:outline-none focus:border-amber-500 py-0.5 w-32 sm:w-36"
                          placeholder="اسم الفتحة"
                        />
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {op.type === 'door' ? 'باب' : op.type === 'window' ? 'شباك' : 'فتحة'}
                        </span>
                      </div>

                      {/* Dimension Fields: Width, Height, Count */}
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        {/* Width */}
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <span className="text-slate-500">عرض:</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0.1"
                            value={op.width || ''}
                            onChange={(e) => handleUpdateOpening(op.id, 'width', parseFloat(e.target.value) || 0)}
                            className="w-12 font-bold text-slate-800 text-center bg-transparent focus:outline-none"
                          />
                          <span className="text-slate-400">م</span>
                        </div>

                        {/* Height */}
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <span className="text-slate-500">ارتفاع:</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0.1"
                            value={op.height || ''}
                            onChange={(e) => handleUpdateOpening(op.id, 'height', parseFloat(e.target.value) || 0)}
                            className="w-12 font-bold text-slate-800 text-center bg-transparent focus:outline-none"
                          />
                          <span className="text-slate-400">م</span>
                        </div>

                        {/* Count */}
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <span className="text-slate-500">العدد:</span>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={op.count || 1}
                            onChange={(e) => handleUpdateOpening(op.id, 'count', parseInt(e.target.value, 10) || 1)}
                            className="w-8 font-bold text-slate-800 text-center bg-transparent focus:outline-none"
                          />
                        </div>

                        {/* Subtotal of this opening */}
                        <div className="font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          = {itemArea} م²
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveOpening(op.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف هذا الخصم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Ceiling Option Toggle (دهان السقف) */}
          <div className="bg-teal-50/40 p-4 rounded-2xl border border-teal-100 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label
                htmlFor="include-ceiling-checkbox"
                className="font-bold text-slate-900 text-sm cursor-pointer flex items-center gap-2"
              >
                <span>دهان السقف لهذه الغرفة؟</span>
                {includeCeiling && (
                  <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-2 py-0.5 rounded-md border border-teal-200">
                    + {ceilingArea} م²
                  </span>
                )}
              </label>
              <p className="text-xs text-slate-500">
                مساحة السقف = الطول ({length}م) × العرض ({width}م) = {ceilingArea} متر مربع
              </p>
            </div>
            <input
              id="include-ceiling-checkbox"
              type="checkbox"
              checked={includeCeiling}
              onChange={(e) => setIncludeCeiling(e.target.checked)}
              className="w-6 h-6 text-teal-600 rounded-lg border-slate-300 focus:ring-teal-500 cursor-pointer accent-teal-600"
            />
          </div>

          {/* 5. Additional Paint Contractor Details (Collapsible) */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-500" />
                تفاصيل إضافية للدهان (نوع التشطيب، كود اللون، ملاحظات المقاول)
              </span>
              <span className="text-slate-400">{showAdvanced ? '▲ إخفاء' : '▼ إظهار'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نوع الدهان / التشطيب
                  </label>
                  <select
                    value={paintType}
                    onChange={(e) => setPaintType(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
                  >
                    {PAINT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اسم أو كود اللون المقترح
                    </label>
                    <input
                      type="text"
                      value={paintColorName}
                      onChange={(e) => setPaintColorName(e.target.value)}
                      placeholder="مثال: أوف وايت جوتن 1024، رمادي فاتح"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ملاحظات التنفيذ للصنايعية
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثلاً: معالجة شروخ، عزل رطوبة، حائط ديكور"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Sticky Footer - Giant Clear Calculation Result & Save Button */}
        <div className="p-4 sm:p-5 bg-gradient-to-t from-slate-100 via-slate-50 to-white border-t border-slate-200/90 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3.5">
          {/* Big Eye-friendly Area Result Banner */}
          <div className="w-full sm:w-auto bg-white border-2 border-[#c87a3e]/30 rounded-2xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-4 shadow-sm">
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-500">
                صافي مساحة الدهان للغرفة
              </div>
              <div className="text-xs text-slate-400">
                (الحوائط {grossWallArea} − الفتحات {totalDeductions} {includeCeiling ? `+ سقف ${ceilingArea}` : ''})
              </div>
            </div>
            <div className="flex items-baseline gap-1 text-sky-700">
              <span className="text-3xl font-black">{formatNum(netPaintArea)}</span>
              <span className="text-xs font-bold">م²</span>
            </div>
          </div>

          {/* Action Buttons: Big, Touch-Friendly, Clear */}
          <div className="w-full sm:w-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 font-bold text-sm transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form="room-form"
              className="flex-2 sm:flex-none px-7 py-3.5 rounded-2xl copper-btn-gradient hover:brightness-105 active:scale-98 text-white font-black text-base shadow-md shadow-[#c87a3e]/25 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{initialRoom ? 'حفظ التعديلات' : 'إضافة الغرفة الآن'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
