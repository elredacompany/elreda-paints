import React, { useState } from 'react';
import { HelpCircle, Smartphone, Share, PlusSquare, MoreVertical, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallGuide: React.FC = () => {
  const [show, setShow] = useState(false);
  const { isIOS, isStandalone } = usePWAInstall();

  if (isStandalone) return null;

  return (
    <>
      {!show && (
        <button
          type="button"
          onClick={() => setShow(true)}
          aria-label="كيفية تثبيت التطبيق"
          title="كيفية تثبيت التطبيق؟"
          className="fixed bottom-20 right-4 z-30 w-11 h-11 rounded-full text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      )}

      {show && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[105] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#667eea]/20 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 id="pwa-guide-title" className="text-base sm:text-lg font-extrabold text-gray-800">
                  كيفية تثبيت التطبيق
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShow(false)}
                aria-label="إغلاق"
                className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-3 text-sm text-gray-700 bg-[#f5f6ff] rounded-2xl p-4 border border-[#667eea]/15">
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    1
                  </span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>اضغط زر</span>
                    <strong>المشاركة</strong>
                    <Share className="w-4 h-4 text-[#667eea] inline" />
                    <span>في Safari</span>
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
                    <span>اختر</span>
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
                    اضغط <strong>«إضافة»</strong>
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-sm text-gray-700 bg-[#f5f6ff] rounded-2xl p-4 border border-[#667eea]/15">
                <li className="flex items-start gap-3">
                  <span
                    className="text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    1
                  </span>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>اضغط</span>
                    <MoreVertical className="w-4 h-4 text-[#667eea] inline" />
                    <span>في أعلى Chrome</span>
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
                    اختر <strong>«تثبيت التطبيق»</strong>
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
                    اضغط <strong>«تثبيت»</strong>
                  </span>
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShow(false)}
              className="w-full mt-4 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <span>فهمت</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
