import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldAlert,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { FeedbackType } from '../types';
import { createFeedbackInFirestore } from '../services/firebase';
import { COMPANY_INFO } from '../data/companyData';
import { SuccessModal } from './SuccessModal';

interface FeedbackScreenProps {
  onBackToHome?: () => void;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<FeedbackType>('suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setErrorMsg('يرجى كتابة الاسم بالكامل');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('يرجى كتابة رقم هاتف صحيح للتواصل');
      return;
    }
    if (!cleanMessage) {
      setErrorMsg('يرجى كتابة تفاصيل الشكوى أو الاقتراح');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createFeedbackInFirestore({
        name: cleanName,
        phone: cleanPhone,
        type,
        message: cleanMessage,
      });

      if (res.success) {
        setIsSuccess(true);
        setShowSuccessModal(true);
        setName('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(res.error || 'تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى أو التواصل عبر واتساب');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c87a3e]/30 shadow-sm text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#df9b6d] via-[#c87a3e] to-[#8c4a1e] p-[2px] mx-auto mb-4 shadow-md shadow-[#c87a3e]/20">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-[#c87a3e]" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mb-2 tracking-tight">
          الشكاوى والاقتراحات
        </h1>
        <p className="text-xs sm:text-sm text-[#57534e] max-w-lg mx-auto leading-relaxed">
          صوتك ورأيك هما أساس نجاحنا في <span className="font-bold text-[#c87a3e]">{COMPANY_INFO.name}</span>. تصل رسالتك مباشرة إلى إدارة الشركة للمتابعة والرد الفوري.
        </p>
      </div>

      {/* Success State */}
      {isSuccess ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-500/40 shadow-lg text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            تم استلام رسالتك بنجاح!
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-md mx-auto leading-relaxed">
            شكراً لاهتمامك وتواصلك معنا. تم حفظ {type === 'complaint' ? 'شكواك' : 'اقتراحك'} في نظام الإدارة وسيتم مراجعتها والتواصل معك في أقرب وقت.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer"
            >
              إرسال رسالة أخرى
            </button>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-6 py-2.5 rounded-2xl copper-btn-gradient text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>العودة للرئيسية</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Feedback Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c87a3e]/30 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Selector (Complaint vs Suggestion) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-2">
              نوع الرسالة <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('suggestion')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  type === 'suggestion'
                    ? 'bg-amber-500/10 border-[#c87a3e] text-[#a85a22] shadow-xs ring-1 ring-[#c87a3e]'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Lightbulb className={`w-4 h-4 ${type === 'suggestion' ? 'text-[#c87a3e]' : 'text-neutral-400'}`} />
                <span>اقتراح وتطوير</span>
              </button>

              <button
                type="button"
                onClick={() => setType('complaint')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  type === 'complaint'
                    ? 'bg-red-50 border-red-400 text-red-700 shadow-xs ring-1 ring-red-400'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <ShieldAlert className={`w-4 h-4 ${type === 'complaint' ? 'text-red-600' : 'text-neutral-400'}`} />
                <span>شكوى أو ملاحظة</span>
              </button>
            </div>
          </div>

          {/* Customer Full Name */}
          <div>
            <label htmlFor="fb-name" className="block text-xs font-bold text-neutral-800 mb-1.5">
              الاسم بالكامل <span className="text-red-500">*</span>
            </label>
            <input
              id="fb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أستاذ أحمد الشريف"
              required
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-[#c87a3e] focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label htmlFor="fb-phone" className="block text-xs font-bold text-neutral-800 mb-1.5">
              رقم الهاتف للتواصل <span className="text-red-500">*</span>
            </label>
            <input
              id="fb-phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              required
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-[#c87a3e] focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 text-right font-mono"
            />
          </div>

          {/* Message Content */}
          <div>
            <label htmlFor="fb-message" className="block text-xs font-bold text-neutral-800 mb-1.5">
              تفاصيل {type === 'complaint' ? 'الشكوى أو الملاحظة' : 'الاقتراح'} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="fb-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === 'complaint'
                  ? 'يرجى توضيح تفاصيل الشكوى وموقع العمل أو الخدمة لنتمكن من معالجتها فوراً...'
                  : 'شاركنا أفكارك واقتراحاتك لتطوير خدماتنا أو أي ميزات تود رؤيتها...'
              }
              required
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 focus:border-[#c87a3e] focus:bg-white text-xs sm:text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl copper-btn-gradient text-white font-bold text-sm shadow-md shadow-[#c87a3e]/20 hover:shadow-lg hover:shadow-[#c87a3e]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>جاري الإرسال وحفظ البيانات في النظام...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>إرسال {type === 'complaint' ? 'الشكوى' : 'الاقتراح'} إلى الإدارة</span>
              </>
            )}
          </button>

          {/* Fast WhatsApp Alternative */}
          <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#57534e]">
            <span>هل تفضل التواصل المباشر والسريع؟</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent('مرحباً إدارة شركة الرضا للدهانات والديكورات، أود تقديم شكوى/اقتراح بخصوص...')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب مباشر</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#fdf8f4] hover:bg-[#faefe6] text-[#a85a22] font-bold flex items-center justify-center gap-1.5 border border-[#c87a3e]/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>اتصال هاتفي</span>
              </a>
            </div>
          </div>
        </form>
      )}

      {/* Contextual Reassurance & Follow-up Standards */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <h3 className="text-xs font-bold text-[#1c1917] mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#c87a3e]" />
          <span>التزام إدارة شركة الرضا تجاه ملاحظاتكم</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-100 shadow-xs">
            <span className="font-bold text-[#292524] block mb-1">سرعة الرد والمتابعة الميدانية</span>
            <p className="text-[#78716c] leading-relaxed">
              تصل كل رسالة فوراً إلى المهندس المسؤول والإدارة العامة للمتابعة وحل أي ملاحظة تنفيذية خلال 24 ساعة.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-100 shadow-xs">
            <span className="font-bold text-[#292524] block mb-1">ضمان رضا العميل التام</span>
            <p className="text-[#78716c] leading-relaxed">
              لا نعتبر أي مشروع منتهياً إلا بعد المعاينة النهائية ومطابقة أعلى معايير الجودة ورضاكم الكامل.
            </p>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="تم استلام رسالتك بنجاح"
        message="تم استلام طلبك بنجاح، سيتواصل معك مهندس الرضا خلال 24 ساعة."
      />
    </div>
  );
};
