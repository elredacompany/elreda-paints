import React from 'react';
import { Share, PlusSquare, Smartphone, X, MoreVertical, Check } from 'lucide-react';

interface PWAInstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS?: boolean;
}

export const PWAInstallPromptModal: React.FC<PWAInstallPromptModalProps> = ({
  isOpen,
  onClose,
  isIOS = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#667eea]/20 animate-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 id="pwa-modal-title" className="text-lg font-extrabold text-gray-900">
              تثبيت التطبيق
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {isIOS ? (
            <div className="bg-[#f5f6ff] border border-[#667eea]/20 rounded-2xl p-4">
              <p className="text-sm text-[#4c51bf] font-bold mb-3">
                لتثبيت التطبيق على آيفون، اتبع الخطوات التالية:
              </p>

              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    1
                  </span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>اضغط على زر</span>
                    <strong>المشاركة</strong>
                    <Share className="w-4 h-4 text-[#667eea] inline" />
                    <span>في أسفل Safari</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    2
                  </span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>مرّر للأسفل واضغط على</span>
                    <strong>«إضافة إلى الصفحة الرئيسية»</strong>
                    <PlusSquare className="w-4 h-4 text-[#667eea] inline" />
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    3
                  </span>
                  <span>
                    اضغط <strong>«إضافة»</strong> في الأعلى
                  </span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="bg-[#f5f6ff] border border-[#667eea]/20 rounded-2xl p-4">
              <p className="text-sm text-[#4c51bf] font-bold mb-3">
                لتثبيت التطبيق من المتصفح بسهولة:
              </p>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    1
                  </span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>اضغط على النقاط الثلاثة</span>
                    <MoreVertical className="w-4 h-4 text-[#667eea] inline" />
                    <span>في أعلى متصفح Chrome</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    2
                  </span>
                  <span>
                    اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«الإضافة إلى الشاشة الرئيسية»</strong>
                  </span>
                </li>
              </ol>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <span>فهمت</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
