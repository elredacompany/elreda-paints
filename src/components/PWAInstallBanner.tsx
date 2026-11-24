import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallPromptModal } from './PWAInstallPromptModal';
import { COMPANY_INFO } from '../data/companyData';

export const PWAInstallBanner: React.FC = () => {
  const { install, isStandalone, dismissed, dismiss, isIOS, hasNativePrompt } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isStandalone && !dismissed) {
      const t = window.setTimeout(() => setVisible(true), 8000);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
  }, [isStandalone, dismissed]);

  if (isStandalone) return null;

  const handleInstallClick = async () => {
    if (isIOS || !hasNativePrompt) {
      setShowModal(true);
      return;
    }
    const outcome = await install();
    if (outcome === 'unavailable') {
      setShowModal(true);
    } else if (outcome === 'accepted') {
      setVisible(false);
    }
  };

  return (
    <>
      {visible && !dismissed && (
        <div
          dir="rtl"
          role="status"
          aria-live="polite"
          className="fixed bottom-[72px] sm:bottom-[78px] left-3 right-3 z-40 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-[#667eea]/25 p-3.5 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-xs"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              <img
                src="/pwa-192x192.png"
                alt={COMPANY_INFO.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain bg-white"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-gray-800 truncate">ثبّت التطبيق</p>
              <p className="text-xs text-gray-500 truncate">وصول أسرع بلمسة واحدة</p>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-bold shrink-0 active:scale-95 transition-transform shadow-sm cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              تثبيت
            </button>

            <button
              type="button"
              onClick={dismiss}
              aria-label="إغلاق"
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <PWAInstallPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={isIOS}
      />
    </>
  );
};
