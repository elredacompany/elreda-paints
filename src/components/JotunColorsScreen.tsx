import React, { useState, useEffect } from 'react';
import {
  Palette,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Search,
  Share2,
  Info,
  X,
  Maximize2,
} from 'lucide-react';
import { OFFICIAL_JOTUN_PALETTE } from '../data/jotunColors';
import { JotunColor, Screen } from '../types';

interface JotunColorsScreenProps {
  onBackToHome: () => void;
  onSelectColorForInspection?: (color: JotunColor) => void;
  onNavigate: (screen: Screen) => void;
  onAddColorToCalculator?: (color: { name: string; code: string; hex: string }) => void;
  initialSearchQuery?: string;
}

export const JotunColorsScreen: React.FC<JotunColorsScreenProps> = ({
  onBackToHome,
  onSelectColorForInspection,
  onNavigate,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedColorForFullScreen, setSelectedColorForFullScreen] = useState<JotunColor | null>(
    null
  );
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const filteredColors = OFFICIAL_JOTUN_PALETTE.filter((color) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      color.nameAr.toLowerCase().includes(q) ||
      color.nameEn.toLowerCase().includes(q) ||
      color.code.includes(q)
    );
  });

  const triggerToast = (message: string) => {
    setCopiedNotification(message);
    setTimeout(() => {
      setCopiedNotification(null);
    }, 2500);
  };

  const handleCopyColorCode = (color: JotunColor, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(color.code);
    }
    triggerToast(`تم نسخ رقم اللون (${color.code}) بنجاح`);
  };

  // مشاركة اسم اللون ورقمه عبر Web Share API مع بديل النسخ للحافظة
  const handleShareColor = async (color: JotunColor, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const appUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://elreda-paints.ai.studio';
    const shareTitle = `لون جوتن ${color.nameAr} (${color.code}) - الرضا للدهانات والديكور`;
    const shareText = `عجبني لون جوتن: ${color.nameAr} (${color.nameEn}) — رقم اللون: ${color.code} من تطبيق الرضا للدهانات والديكور.`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appUrl,
        });
        triggerToast(`تمت مشاركة لون ${color.nameAr} (${color.code})`);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${appUrl}`);
      triggerToast(`تم نسخ تفاصيل لون ${color.nameAr} (${color.code}) للمشاركة`);
    } catch {
      triggerToast(`لون ${color.nameAr} — رقم ${color.code}`);
    }
  };

  const isVeryDarkHex = (hex: string): boolean => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return false;
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 0.24;
  };

  // -------------------------------------------------------------
  // VIEW 2: شاشة عرض اللون الكاملة (Full Screen View)
  // -------------------------------------------------------------
  if (selectedColorForFullScreen) {
    const color = selectedColorForFullScreen;
    const darkBg = isVeryDarkHex(color.hex);

    return (
      <div
        className="fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden select-none animate-in fade-in duration-200 flex flex-col justify-between"
        style={{ backgroundColor: color.hex }}
      >
        <div className="flex items-center justify-between p-5 sm:p-7">
          <button
            type="button"
            onClick={(e) => handleShareColor(color, e)}
            aria-label="مشاركة اللون"
            title="مشاركة اللون"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
              darkBg
                ? 'text-white/85 hover:text-white hover:bg-white/10'
                : 'text-[#3f3f46] hover:text-[#18181b] hover:bg-black/5'
            }`}
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedColorForFullScreen(null)}
            aria-label="إغلاق"
            title="إغلاق"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
              darkBg
                ? 'text-white/85 hover:text-white hover:bg-white/10'
                : 'text-[#3f3f46] hover:text-[#18181b] hover:bg-black/5'
            }`}
          >
            <X className="w-7 h-7 stroke-[1.75]" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div dir="ltr" className="text-center space-y-2 sm:space-y-3 max-w-3xl mx-auto">
            <p
              onClick={(e) => handleCopyColorCode(color, e)}
              title="اضغط لنسخ رقم اللون"
              className={`text-xs sm:text-sm font-sans font-medium tracking-[0.28em] uppercase cursor-pointer transition-opacity hover:opacity-75 ${
                darkBg ? 'text-neutral-300' : 'text-[#52525b]'
              }`}
            >
              {color.code}
            </p>

            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide uppercase leading-tight ${
                darkBg ? 'text-neutral-50' : 'text-[#18181b]'
              }`}
              style={{
                fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              }}
            >
              {color.nameEn}
            </h2>

            <p
              dir="rtl"
              className={`text-base sm:text-lg font-bold ${
                darkBg ? 'text-neutral-200' : 'text-[#27272a]'
              }`}
            >
              {color.nameAr}
            </p>
          </div>
        </div>

        <div className="px-5 pb-6 sm:pb-8 pt-3 flex items-center justify-center">
          <div className="flex items-center justify-center gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={(e) => handleShareColor(color, e)}
              className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                darkBg
                  ? 'bg-white text-[#18181b] hover:bg-neutral-100'
                  : 'bg-[#18181b] text-white hover:bg-[#27272a]'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة اللون</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedColorForFullScreen(null);
                if (onSelectColorForInspection) {
                  onSelectColorForInspection(color);
                } else {
                  onNavigate('contact');
                }
              }}
              className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-bold tracking-wide border transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                darkBg
                  ? 'border-white/50 text-white hover:bg-white/10'
                  : 'border-[#18181b]/40 text-[#18181b] hover:bg-black/5'
              }`}
            >
              <span>طلب معاينة</span>
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#18181b] text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-3">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            <span>{copiedNotification}</span>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: شاشة كتالوج الألوان الأساسية
  // -------------------------------------------------------------
  return (
    <div className="space-y-5 pb-28 text-[#1c1917] max-w-5xl mx-auto">
      {/* إشعار النسخ أو المشاركة */}
      {copiedNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400/50 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* 1. رأس صفحة الكتالوج */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#c87a3e]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <Palette className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1917]">
              كتالوج ألوان جوتن الرسمية ({OFFICIAL_JOTUN_PALETTE.length} لوناً)
            </h1>
            <p className="text-xs sm:text-sm text-[#57534e] mt-0.5">
              اضغط على مساحة اللون لفتحه بالحجم الكامل، أو استخدم أيقونات النسخ والمشاركة
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>
      </div>

      {/* 3. شريط البحث واختصارات الألوان الأكثر طلباً */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#57534e]">
            <Palette className="w-4 h-4 text-[#a85a22]" />
            <span>
              الألوان المعروضة ({filteredColors.length} لوناً من {OFFICIAL_JOTUN_PALETTE.length}):
            </span>
          </div>

          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#78716c] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو رقم جوتن (مثل: 1519 أو فانيليا)..."
              className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] placeholder:text-neutral-400 focus:outline-none focus:border-[#a85a22] transition-all shadow-2xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-xs font-bold text-[#78716c] shrink-0">الأكثر طلباً:</span>
          {[
            { name: 'فانيليا لاتيه', code: '1519' },
            { name: 'بريز', code: '0552' },
            { name: 'لايمستون', code: '10341' },
            { name: 'سكاي لايت', code: '1624' },
            { name: 'كلاسيك وايت', code: '9918' },
          ].map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                const found = OFFICIAL_JOTUN_PALETTE.find((item) => item.code === c.code);
                if (found) setSelectedColorForFullScreen(found);
              }}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/30 hover:border-[#a85a22] text-[#1c1917] hover:text-[#a85a22] font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>{c.name}</span>
              <span className="font-mono text-[11px] text-[#a85a22] bg-[#faf5f0] px-1.5 py-0.5 rounded border border-[#c87a3e]/20">
                {c.code}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. شبكة الألوان المصورة */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredColors.map((color) => {
          const isTopDemand = ['1519', '0552', '10341', '1624', '9918'].includes(color.code);

          return (
            <div
              key={color.id}
              onClick={() => setSelectedColorForFullScreen(color)}
              className={`bg-white rounded-2xl overflow-hidden border ${
                isTopDemand
                  ? 'border-[#c87a3e] shadow-sm ring-1 ring-[#c87a3e]/30'
                  : 'border-neutral-200 shadow-2xs hover:border-[#c87a3e]/60'
              } hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group`}
            >
              {/* مساحة اللون نفسها تفتح العرض الكامل (Full Screen View) */}
              <div
                onClick={() => setSelectedColorForFullScreen(color)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#faf5f0] flex items-center justify-center"
              >
                <img
                  src={color.cleanImage || color.localImage}
                  alt={`${color.nameAr} - ${color.code}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: color.hex }}
                />

                <div className="absolute top-1.5 right-1.5">
                  <span className="font-mono text-[11px] font-black text-neutral-900 bg-white/95 px-2 py-0.5 rounded-md shadow-xs border border-black/5">
                    {color.code}
                  </span>
                </div>

                {isTopDemand && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-bold text-amber-900 bg-amber-300/95 px-1.5 py-0.5 rounded-md shadow-2xs">
                    ★ الأكثر طلباً
                  </span>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-bold text-white bg-black/65 px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>عرض كامل</span>
                  </span>
                </div>
              </div>

              {/* تفاصيل الكارت + أيقونتا النسخ والمشاركة */}
              <div className="p-2.5 sm:p-3 bg-white flex flex-col justify-between gap-1.5 flex-1">
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-black text-[#1c1917] leading-snug">
                      {color.nameAr}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-[#a85a22] shrink-0">
                      {color.code}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#78716c] font-medium block truncate">
                    {color.nameEn}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="text-[#a85a22] font-bold flex items-center gap-1 group-hover:underline">
                    <Maximize2 className="w-3 h-3" />
                    <span>شاشة كاملة</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleShareColor(color, e)}
                      className="text-neutral-600 hover:text-[#a85a22] p-1.5 rounded-lg hover:bg-[#faf5f0] transition-colors cursor-pointer"
                      title="مشاركة اللون"
                      aria-label={`مشاركة ${color.nameAr}`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCopyColorCode(color, e)}
                      className="text-neutral-600 hover:text-[#a85a22] p-1.5 rounded-lg hover:bg-[#faf5f0] transition-colors cursor-pointer"
                      title="نسخ رقم اللون"
                      aria-label={`نسخ رقم ${color.code}`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. شريط التنبيه الإرشادي تحت الكتالوج */}
      <div className="bg-white rounded-3xl p-5 border border-[#c87a3e]/30 shadow-sm text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#faf5f0] border border-[#c87a3e]/30 text-[#a85a22] text-xs font-bold">
          <Info className="w-4 h-4 text-[#a85a22]" />
          <span>تنبيه هام</span>
        </div>
        <p className="text-sm sm:text-base font-black text-[#1c1917] leading-relaxed">
          "المرجع النهائي هو رقم اللون وكتالوج جوتن الورقي عند المحل."
        </p>
      </div>
    </div>
  );
};
