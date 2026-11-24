import React, { useState } from 'react';
import {
  ArrowUp,
  Copy,
  Check,
  ExternalLink,
  MoreVertical,
  MoreHorizontal,
  Smartphone,
  Compass,
  Lock,
  Bookmark,
  MousePointerClick,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { InAppBrowserInfo, getExternalBrowserRedirectUrl } from '../utils/inAppBrowser';

interface InAppBrowserOverlayProps {
  info: InAppBrowserInfo;
}

export const InAppBrowserOverlay: React.FC<InAppBrowserOverlayProps> = ({ info }) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const redirectUrl = getExternalBrowserRedirectUrl(info.os, currentUrl);
  const browserName = info.os === 'ios' ? 'Safari' : 'Google Chrome';
  const isIOS = info.os === 'ios';

  const handleForceOpenChrome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!currentUrl || info.os !== 'android') {
      e.preventDefault();
      return;
    }
    setTimeout(() => {
      try {
        window.location.href = redirectUrl;
      } catch {
        // Fallback stays on illustrated guide
      }
    }, 60);
  };

  const handleCopyUrl = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = currentUrl;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Ignore clipboard restriction
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="in-app-overlay-title"
      className="fixed inset-0 z-[9999] min-h-[100dvh] w-full bg-gradient-to-b from-neutral-950 via-[#1f140d] to-neutral-950 text-white flex flex-col justify-between px-3.5 py-4 sm:px-8 sm:py-6 overflow-y-auto select-none"
    >
      {/* Top Pointers toward Three Dots Menu (covers both corners for RTL/LTR social apps) */}
      <div className="w-full max-w-xl mx-auto flex items-start justify-between gap-2 pt-0.5">
        <div className="flex flex-col items-start gap-1 text-[#f3b689]">
          <div className="w-9 h-9 rounded-full bg-[#c87a3e]/25 border border-[#c87a3e]/70 flex items-center justify-center animate-bounce shadow-lg shadow-[#c87a3e]/25">
            <ArrowUp className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-black text-[#f3b689]">
            {isIOS ? 'النقاط (⋯)' : 'النقاط (⋮)'}
          </span>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs font-bold text-neutral-200 flex items-center gap-1.5 text-center">
          <Smartphone className="w-3.5 h-3.5 text-[#df9b6d] shrink-0" />
          <span>مفتوح داخل {info.appLabelAr || 'متصفح تواصل اجتماعي'}</span>
        </div>

        <div className="flex flex-col items-end gap-1 text-[#f3b689]">
          <div className="w-9 h-9 rounded-full bg-[#c87a3e]/25 border border-[#c87a3e]/70 flex items-center justify-center animate-bounce shadow-lg shadow-[#c87a3e]/25">
            <ArrowUp className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-black text-[#f3b689]">
            {isIOS ? 'النقاط (⋯)' : 'النقاط (⋮)'}
          </span>
        </div>
      </div>

      {/* Main Centered Instruction Card with Illustrated Mockups */}
      <div className="w-full max-w-lg mx-auto my-auto py-3">
        <div className="bg-white text-[#1c1917] rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#c87a3e]/45 text-center space-y-4">
          <div className="inline-flex items-center justify-center bg-[#fbf7f4] rounded-2xl px-4 py-1.5 border border-[#c87a3e]/25 shadow-2xs">
            <img
              src={COMPANY_INFO.logoUrl}
              alt={COMPANY_INFO.name}
              width={1632}
              height={964}
              className="h-11 sm:h-14 w-auto object-contain"
            />
          </div>

          <div className="space-y-1">
            <h1
              id="in-app-overlay-title"
              className="text-lg sm:text-xl font-black leading-snug text-[#1c1917]"
            >
              افتح التطبيق في {browserName} لتصفحه وتثبيته على شاشتك
            </h1>
            <p className="text-xs sm:text-sm text-[#57534e] font-medium leading-relaxed">
              {isIOS
                ? 'بسبب قيود آبل، المتصفح الداخلي لا يسمح بالفتح التلقائي أو تثبيت التطبيق. اتبع الخطوتين المصورتين:'
                : 'لم يتمكن التطبيق من التحويل تلقائياً إلى Chrome من هذا المتصفح الداخلي. اتبع الخطوتين المصورتين:'}
            </p>
          </div>

          {/* Illustrated Visual Step-by-Step Guide (Picture Mockups) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
            {/* Illustration 1: Top bar three dots */}
            <div className="bg-[#fbf7f4] border border-[#c87a3e]/30 rounded-2xl p-3 flex flex-col justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-lg copper-btn-gradient text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="text-xs font-black text-[#1c1917] leading-snug">
                  اضغط على <span className="text-[#a85a22]">{isIOS ? '(⋯)' : '(⋮)'}</span> في أعلى
                  الشاشة
                </p>
              </div>

              {/* Phone Top Header Illustration */}
              <div className="bg-neutral-900 rounded-xl p-2 border border-neutral-700 shadow-sm">
                <div className="flex items-center justify-between gap-1.5 text-white">
                  <span className="text-[11px] text-neutral-400 px-1">✕</span>
                  <div className="flex-1 bg-neutral-800 rounded-md px-2 py-1 flex items-center justify-center gap-1 text-[10px] text-neutral-300 font-mono truncate">
                    <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span>elreda-paints</span>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inset-0 rounded-lg bg-[#c87a3e] animate-ping opacity-45" />
                    <div className="relative w-7 h-7 rounded-lg bg-[#c87a3e] border border-amber-200 text-white flex items-center justify-center shadow-md">
                      {isIOS ? (
                        <MoreHorizontal className="w-4 h-4 stroke-[2.6]" />
                      ) : (
                        <MoreVertical className="w-4 h-4 stroke-[2.6]" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] font-bold text-amber-300">
                  <MousePointerClick className="w-3 h-3 shrink-0" />
                  <span>اضغط هنا أعلى المتصفح</span>
                </div>
              </div>
            </div>

            {/* Illustration 2: Menu Popup Highlight */}
            <div className="bg-[#fbf7f4] border border-[#c87a3e]/30 rounded-2xl p-3 flex flex-col justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-lg copper-btn-gradient text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="text-xs font-black text-[#1c1917] leading-snug">
                  اختر <span className="text-[#a85a22]">«فتح في المتصفح»</span> ({browserName})
                </p>
              </div>

              {/* Social Browser Dropdown Menu Illustration */}
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm text-[11px]">
                <div className="px-2.5 py-1.5 border-b border-neutral-100 flex items-center justify-between text-neutral-400">
                  <span>حفظ الرابط</span>
                  <Bookmark className="w-3 h-3" />
                </div>
                <div className="px-2.5 py-2 bg-[#fdf4ec] border-r-4 border-[#c87a3e] flex items-center justify-between font-black text-[#8c4a1e]">
                  <span>فتح في {isIOS ? 'Safari' : 'المتصفح'}</span>
                  <div className="w-5 h-5 rounded-md copper-btn-gradient text-white flex items-center justify-center shrink-0">
                    {isIOS ? (
                      <Compass className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isIOS && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl px-3 py-2 flex items-center justify-center gap-2 text-[11px] font-bold text-sky-900">
              <Compass className="w-4 h-4 text-sky-600 shrink-0" />
              <span>أو اضغط أيقونة البوصلة (Safari) بالأسفل إذا ظهرت لديك مباشرة.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-0.5">
            {info.os === 'android' && (
              <a
                href={redirectUrl}
                onClick={handleForceOpenChrome}
                className="w-full py-3.5 px-5 rounded-2xl copper-btn-gradient text-white font-black text-sm sm:text-base shadow-lg shadow-[#c87a3e]/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <ExternalLink className="w-5 h-5" />
                <span>فتح مباشرة في Google Chrome</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyUrl}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-[#292524] border border-neutral-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ الرابط! الصقه في {browserName}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#a85a22]" />
                  <span>نسخ الرابط ولصقه في {browserName}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[11px] text-neutral-400 font-medium pb-1">
        {COMPANY_INFO.name} — المتصفح الداخلي لتطبيقات التواصل لا يدعم التثبيت التلقائي
      </div>
    </div>
  );
};
