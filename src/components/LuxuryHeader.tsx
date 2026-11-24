import React, { useState } from 'react';
import { Phone, MessageCircle, Smartphone, Monitor, Sparkles, Building2, Download } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Screen } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallPromptModal } from './PWAInstallPromptModal';

interface LuxuryHeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isAndroidFrame: boolean;
  onToggleAndroidFrame: () => void;
  isInAppBrowser?: boolean;
}

export const LuxuryHeader: React.FC<LuxuryHeaderProps> = ({
  currentScreen,
  onNavigate,
  isAndroidFrame,
  onToggleAndroidFrame,
  isInAppBrowser = false,
}) => {
  const { install, isIOS, isStandalone, hasNativePrompt } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const onInstallClick = async () => {
    if (isIOS || !hasNativePrompt) {
      setShowIOSModal(true);
      return;
    }
    const outcome = await install();
    if (outcome === 'unavailable') {
      setShowIOSModal(true);
    }
  };

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#c87a3e]/25 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand / Logo + Official Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 group focus:outline-none cursor-pointer select-none min-w-0"
          title="شركة الرضا للدهانات والديكور"
        >
          <img
            src={COMPANY_INFO.logoUrl}
            alt="شركة الرضا للدهانات والديكور"
            width={1632}
            height={964}
            decoding="async"
            className="h-9 sm:h-12 w-auto max-w-none object-contain shrink-0 group-hover:scale-[1.03] transition-transform duration-300"
          />
          <span className="text-xs sm:text-sm md:text-base font-black leading-tight bg-gradient-to-l from-[#667eea] to-[#764ba2] bg-clip-text text-transparent truncate">
            شركة الرضا للدهانات والديكور
          </span>
        </button>

        {/* Top Fast Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Header Install Button (hidden when standalone or inside in-app WebView) */}
          {!isStandalone && !isInAppBrowser && (
            <button
              type="button"
              onClick={onInstallClick}
              className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              title="تثبيت التطبيق"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تثبيت</span>
            </button>
          )}

          {/* Quick Header Navigation for About Us / FAQ */}
          <button
            onClick={() => onNavigate('about')}
            className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              currentScreen === 'about'
                ? 'copper-btn-gradient text-white border-transparent'
                : 'bg-[#fbf7f4] text-[#a85a22] hover:bg-[#faefe6] border-[#c87a3e]/30'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#c87a3e]" />
            <span>من نحن والأسئلة</span>
          </button>

          {/* Quick Inspection Booking */}
          <button
            onClick={() => onNavigate('contact')}
            className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              currentScreen === 'contact'
                ? 'copper-btn-gradient text-white border-transparent'
                : 'bg-[#fbf7f4] text-[#a85a22] hover:bg-[#faefe6] border-[#c87a3e]/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c87a3e]" />
            <span>طلب معاينة</span>
          </button>

          {/* Quick Phone Call Button */}
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="flex items-center gap-1.5 bg-white hover:bg-[#fdf8f4] text-[#a85a22] hover:text-[#8c4a1e] border border-[#c87a3e]/35 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            title="اتصال هاتفي مباشر بالشركة"
          >
            <Phone className="w-3.5 h-3.5 text-[#c87a3e]" />
            <span className="hidden sm:inline font-mono">{COMPANY_INFO.phoneFormatted}</span>
            <span className="sm:hidden">اتصال</span>
          </a>

          {/* Quick WhatsApp Chat Button */}
          <a
            href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent('مرحباً شركة الرضا للدهانات والديكور، أود الاستفسار عن خدمات تشطيب الدهانات والديكور.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 active:scale-95"
            title="محادثة واتساب مباشرة"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">واتساب</span>
          </a>

          {/* Android Mobile Frame toggle */}
          <button
            onClick={onToggleAndroidFrame}
            className="p-1.5 text-[#78716c] hover:text-[#a85a22] hover:bg-[#fbf7f4] rounded-xl transition-colors border border-transparent hover:border-[#c87a3e]/20 hidden md:flex items-center cursor-pointer"
            title={isAndroidFrame ? 'عرض كامل الشاشة' : 'محاكاة شاشة هاتف أندرويد'}
          >
            {isAndroidFrame ? (
              <Monitor className="w-4 h-4 text-[#c87a3e]" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>

    <PWAInstallPromptModal
      isOpen={showIOSModal}
      onClose={() => setShowIOSModal(false)}
      isIOS={isIOS}
    />
    </>
  );
};
