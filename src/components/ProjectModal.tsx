import React, { useState } from 'react';
import { Project } from '../types';
import { X, Building, Phone, MapPin, Check, Trash2, RotateCcw } from 'lucide-react';
import { SAMPLE_ROOMS } from '../utils/storage';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSaveProject: (updated: Project) => void;
  onClearRooms: () => void;
  onLoadSampleRooms: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveProject,
  onClearRooms,
  onLoadSampleRooms,
}) => {
  const [name, setName] = useState(project.name);
  const [clientPhone, setClientPhone] = useState(project.clientPhone || '');
  const [location, setLocation] = useState(project.location || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProject({
      ...project,
      name: name.trim() || 'مشروع جديد',
      clientPhone: clientPhone.trim(),
      location: location.trim(),
      updatedAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl copper-btn-gradient text-white flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              بيانات المشروع والعميل
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم المشروع أو اسم العميل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شقة أستاذ أحمد - فيلا الياسمين"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              رقم هاتف العميل (اختياري)
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="010XXXXXXXX"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              موقع أو عنوان الوحدة (اختياري)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثال: التجمع الخامس، حي النرجس"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c87a3e]"
            />
          </div>

          {/* Quick Actions (Sample Rooms or Clear All) */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="block text-xs font-bold text-slate-500">إدارة غرف المشروع:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  onLoadSampleRooms();
                  onClose();
                }}
                className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-xl border border-sky-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تحميل شقة نموذجية (3 غرف)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل تريد مسح جميع الغرف الحالية والبدء من الصفر؟')) {
                    onClearRooms();
                    onClose();
                  }
                }}
                className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح جميع الغرف</span>
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white font-bold text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl copper-btn-gradient hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>حفظ البيانات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
