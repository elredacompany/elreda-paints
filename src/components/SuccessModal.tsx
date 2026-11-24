import React from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  referenceCode?: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'تم الإرسال بنجاح',
  message = 'تم استلام طلبك بنجاح، سيتواصل معك مهندس الرضا خلال 24 ساعة.',
  referenceCode,
  whatsappUrl,
  whatsappLabel = 'متابعة عبر واتساب',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      dir="rtl"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Green Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-lg shadow-emerald-600/15">
          <CheckCircle2 className="w-11 h-11 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          {referenceCode && (
            <span className="inline-block text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-3 py-1 rounded-full">
              رقم المرجع: {referenceCode}
            </span>
          )}

          <h2 id="success-modal-title" className="text-xl font-black text-[#1c1917]">
            {title}
          </h2>

          <p className="text-sm sm:text-base font-bold text-[#292524] leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{whatsappLabel}</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl copper-btn-gradient text-white font-black text-xs sm:text-sm shadow-md shadow-[#c87a3e]/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            تم، شكراً
          </button>
        </div>
      </div>
    </div>
  );
};
