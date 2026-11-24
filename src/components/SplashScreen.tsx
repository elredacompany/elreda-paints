import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // شريط التقدم خلال ثانيتين بالضبط (2000ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + 5);
      });
    }, 90);

    // الإغلاق التلقائي بعد ثانيتين (2000ms)
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onFinish();
    }, 280);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col items-center justify-between p-6 select-none transition-opacity duration-300 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial copper aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c87a3e]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[#df9b6d]/10 rounded-full blur-[70px]"></div>
      </div>

      {/* Top Header Row with Skip Button */}
      <div className="w-full max-w-md flex items-center justify-between relative z-10 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#c87a3e]/30 text-[11px] font-bold text-[#a85a22] shadow-sm">
          <Sparkles className="w-3 h-3 text-[#a85a22]" />
          <span>نسخة التطبيق الرسمية</span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs font-bold text-[#a85a22] hover:text-[#944616] bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/30 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Logo Showcase & Branding */}
      <div className="w-full max-w-sm flex flex-col items-center text-center relative z-10 space-y-6 my-auto animate-in zoom-in-95 duration-300">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[#df9b6d] via-[#c87a3e] to-[#944616] opacity-25 blur-md"></div>

          <div className="relative w-68 sm:w-84 rounded-[28px] overflow-hidden bg-white border border-[#c87a3e]/35 shadow-2xl px-4 py-3 flex items-center justify-center">
            <img
              src={COMPANY_INFO.logoUrl}
              alt={COMPANY_INFO.name}
              width={1632}
              height={964}
              decoding="async"
              className="w-full h-auto aspect-[1632/964] object-contain"
            />
          </div>
        </div>

        {/* Company Title */}
        <div className="space-y-2 pt-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            <span className="block copper-text-gradient">
              {COMPANY_INFO.name}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#57534e] font-medium leading-relaxed max-w-xs mx-auto">
            رواد تشطيبات الدهانات المعمارية والديكورات العصرية الفاخرة
          </p>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-serif-luxury font-bold text-[#a85a22] tracking-[0.25em] pt-1">
            <span>Al Reda Paints &amp; Decor</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-xs relative z-10 space-y-3 pb-6">
        <div className="flex items-center justify-between text-[11px] font-medium text-[#78716c]">
          <span>جاري تجهيز التطبيق...</span>
          <span className="font-mono font-bold text-[#a85a22]">{progress}%</span>
        </div>

        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden border border-[#c87a3e]/20 p-[1px]">
          <div
            className="h-full copper-btn-gradient rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-[10px] text-center text-[#78716c] font-medium">
          ديكورات عصرية • تشطيبات راقية • ضمان شامل
        </p>
      </div>
    </div>
  );
};
