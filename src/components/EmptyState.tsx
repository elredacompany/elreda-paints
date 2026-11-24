import React from 'react';
import { Plus, Paintbrush, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onAddNewRoom: () => void;
  onLoadSample: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddNewRoom, onLoadSample }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center my-6 flex flex-col items-center max-w-lg mx-auto shadow-xs">
      <div className="w-20 h-20 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100 shadow-inner">
        <Paintbrush className="w-10 h-10 stroke-[1.8]" />
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-2">
        لم تقم بإضافة أي غرف بعد
      </h3>
      <p className="text-slate-500 text-sm mb-6 max-w-md leading-relaxed">
        ابدأ بإضافة غرفتك الأولى لإدخال الطول والعرض والارتفاع، وسيقوم التطبيق بحساب مساحة الحوائط وخصم الأبواب والشبابيك وحساب صافي الدهان فوراً.
      </p>

      {/* Big Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onAddNewRoom}
          className="w-full sm:w-auto px-7 py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white rounded-2xl font-black text-base shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>إضافة غرفة جديدة الآن</span>
        </button>

        <button
          onClick={onLoadSample}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>تجربة شقة نموذجية</span>
        </button>
      </div>
    </div>
  );
};
