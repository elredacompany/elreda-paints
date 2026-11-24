import React, { useEffect, useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { PWAInstallPromptModal } from './PWAInstallPromptModal';
import { isEmbeddedIframe, isStandalonePWA } from '../utils/inAppBrowser';
import { COMPANY_INFO } from '../data/companyData';

export const SmartOpenScreen: React.FC = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (isEmbeddedIframe() || isStandalonePWA()) return;

    const ua = navigator.userAgent || '';
    setIsIOSDevice(/iPad|iPhone|iPod/.test(ua));

    const isSocialInApp =
      ua.includes('FBAN') ||
      ua.includes('FBAV') ||
      ua.includes('Facebook') ||
      ua.includes('Instagram') ||
      ua.includes('WhatsApp') ||
      ua.includes('Telegram') ||
      ua.includes('Messenger') ||
      ua.includes('FB_IAB') ||
      ua.includes('Orca-Android') ||
      ua.includes('TikTok') ||
      ua.includes('BytedanceWebview') ||
      ua.includes('Twitter') ||
      ua.includes('X/') ||
      ua.includes('Snapchat');

    if (isSocialInApp) {
      setShow(true);
    }
  }, []);

  const handleOpen = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent || '');
    setIsIOSDevice(isIOS);
    setLoading(true);

    if (isIOS) {
      const chromeUrl = `googlechrome://${url.replace(/^https?:\/\//, '')}`;
      window.location.href = chromeUrl;
    } else {
      window.location.href = `intent://${url.replace(
        /^https?:\/\//,
        ''
      )}#Intent;scheme=https;package=com.android.chrome;end`;
    }

    window.setTimeout(() => {
      setLoading(false);
      if (document.visibilityState === 'visible') {
        setShow(false);
        setShowFallback(true);
      }
    }, 1500);
  };

  if (!show && !showFallback) return null;

  return (
    <>
      {show && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="smart-open-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-5">
            <div className="w-20 h-20 mx-auto rounded-2xl p-2 bg-[#f5f6ff] border border-[#667eea]/20 flex items-center justify-center shadow-sm">
              <img
                src="/pwa-192x192.png"
                alt={COMPANY_INFO.name}
                width={64}
                height={64}
                className="w-16 h-16 object-contain rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <h2
                id="smart-open-title"
                className="text-xl sm:text-2xl font-black leading-snug bg-gradient-to-l from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"
              >
                شركة الرضا للدهانات والديكور
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                افتح التطبيق في متصفحك عشان تستمتع بتجربة أسرع وأفضل
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpen}
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: loading
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري الفتح...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>افتح التطبيق الآن</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 font-medium">
              مجاناً • بدون إعلانات • سريع
            </p>
          </div>
        </div>
      )}

      <PWAInstallPromptModal
        isOpen={showFallback}
        onClose={() => setShowFallback(false)}
        isIOS={isIOSDevice}
      />
    </>
  );
};
