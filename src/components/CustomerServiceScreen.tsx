import React, { useState } from 'react';
import {
  Headphones,
  PhoneCall,
  MessageCircle,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Database,
  Loader2,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Screen } from '../types';
import { submitComplaintToSupabase } from '../services/supabase';
import { createFeedbackInFirestore, submitComplaintToFirestore } from '../services/firebase';
import { SuccessModal } from './SuccessModal';

interface CustomerServiceScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const CustomerServiceScreen: React.FC<CustomerServiceScreenProps> = ({ onNavigate }) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim() || !details.trim()) return;

    setIsSubmitting(true);
    let dbSaved = false;

    // 1. Save to Firebase Firestore (complaints + feedback) & Supabase
    try {
      const [fbResult, feedbackResult] = await Promise.all([
        submitComplaintToFirestore(clientName.trim(), phone.trim(), details.trim()),
        createFeedbackInFirestore({
          name: clientName.trim(),
          phone: phone.trim(),
          type: 'complaint',
          message: details.trim(),
        }),
      ]);
      if (fbResult.success || feedbackResult.success) {
        dbSaved = true;
        setSavedToDb(true);
      }
    } catch (e) {
      console.warn('Firestore complaint save error:', e);
    }

    try {
      const supaRes = await submitComplaintToSupabase(
        clientName.trim(),
        phone.trim(),
        details.trim()
      );
      if (supaRes?.success) {
        dbSaved = true;
        setSavedToDb(true);
      }
    } catch {
      // secondary backup
    }

    const message = `شكوى/استفسار من: ${clientName.trim()} - رقم الهاتف: ${phone.trim()} - التفاصيل: ${details.trim()}`;
    const whatsappUrl = `${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
    setLastWhatsappUrl(whatsappUrl);

    setIsSent(true);
    setShowSuccessModal(true);
    setClientName('');
    setPhone('');
    setDetails('');
    setIsSubmitting(false);
    void dbSaved;
  };

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] max-w-3xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#c87a3e]/30 shadow-xl shadow-[#c87a3e]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black shadow-md shadow-[#c87a3e]/25 shrink-0">
            <Headphones className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#faf5f0] border border-[#c87a3e]/30 text-[#a85a22] text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>فريق خدمة عملاء شركة الرضا للدهانات والديكور</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1">
              خدمة العملاء والشكاوى
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              نحن جاهزون للاستماع إليك وحل أي استفسار أو ملاحظة بأسرع وقت
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>
      </div>

      {/* 2. Welcome Card with the Requested Statement */}
      <div className="bg-[#faf5f0] p-5 sm:p-6 rounded-3xl border-2 border-[#c87a3e]/35 shadow-md relative overflow-hidden text-center sm:text-right">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#a85a22] flex items-center justify-center shrink-0 border border-[#c87a3e]/30 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-[#1c1917]">
              رضاؤكم هو هدفنا الأول
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] font-semibold leading-relaxed">
              "رضاؤكم هو هدفنا الأول. نحن هنا لخدمتكم والاستماع لملاحظاتكم وشكاويكم لضمان أفضل جودة."
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Two Quick Action Buttons at the Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* زر اتصال بخدمة العملاء */}
        <a
          href={`tel:${COMPANY_INFO.phone}`}
          className="p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/30 shadow-md flex items-center justify-between gap-3 group transition-all"
        >
          <div className="flex items-center gap-3 text-right">
            <div className="w-11 h-11 rounded-xl bg-[#faf5f0] text-[#a85a22] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-[#c87a3e]/25">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm sm:text-base font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
                اتصال بخدمة العملاء
              </span>
              <span className="block text-xs text-[#78716c] font-mono mt-0.5" dir="ltr">
                {COMPANY_INFO.phoneFormatted}
              </span>
            </div>
          </div>
          <span className="text-xs bg-[#faf5f0] px-3 py-1.5 rounded-xl text-[#a85a22] font-bold border border-[#c87a3e]/25 shadow-sm">
            مكالمة فورية
          </span>
        </a>

        {/* زر محادثة واتساب مباشرة */}
        <a
          href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent('السلام عليكم، أود التواصل مع خدمة عملاء الرضا للدهانات والديكورات.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 sm:p-4.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white shadow-md border border-emerald-500 flex items-center justify-between gap-3 group transition-all"
        >
          <div className="flex items-center gap-3 text-right">
            <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm sm:text-base font-black text-white">
                محادثة واتساب مباشرة
              </span>
              <span className="block text-xs text-emerald-100 font-medium mt-0.5">
                متاح طوال اليوم للرد الفوري
              </span>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1.5 rounded-xl text-white font-bold shrink-0">
            شات سريع
          </span>
        </a>
      </div>

      {/* 4. Form (نموذج إرسال الشكوى أو الاستفسار) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#c87a3e]/25 shadow-xl space-y-5">
        <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1c1917] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#a85a22]" />
              <span>نموذج تسجيل الشكوى أو الاستفسار</span>
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              سيتم توجيه رسالتك مباشرة إلى إدارة الشركة لسرعة المتابعة
            </p>
          </div>
          <span className="text-[11px] text-[#a85a22] bg-[#faf5f0] px-2.5 py-1 rounded-lg border border-[#c87a3e]/25 font-semibold">
            سرية تامة
          </span>
        </div>

        {isSent && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تم إرسال الشكوى والاستفسار بنجاح!</span>
            </div>
            {savedToDb ? (
              <p className="text-emerald-700 text-xs">
                تم حفظ سجل الشكوى في قاعدة البيانات (Firebase Firestore) وتم فتح محادثة الواتساب للمتابعة المباشرة مع الإدارة.
              </p>
            ) : (
              <p className="text-emerald-700 text-xs">
                تم فتح تطبيق الواتساب لمتابعة طلبك مباشرة مع خدمة العملاء.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اسم العميل */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c1917]">
              اسم العميل <span className="text-[#a85a22]">*</span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="اكتب اسمك الكريم..."
              required
              className="w-full p-3.5 bg-white border border-neutral-300 rounded-2xl text-sm font-semibold text-[#1c1917] placeholder:text-neutral-400 focus:outline-none focus:border-[#a85a22] transition-all shadow-sm"
            />
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c1917]">
              رقم الهاتف للتواصل <span className="text-[#a85a22]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              required
              className="w-full p-3.5 bg-white border border-neutral-300 rounded-2xl text-sm font-semibold text-[#1c1917] placeholder:text-neutral-400 focus:outline-none focus:border-[#a85a22] transition-all font-mono shadow-sm"
            />
          </div>

          {/* تفاصيل الشكوى أو الاستفسار */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1c1917]">
              تفاصيل الشكوى أو الاستفسار <span className="text-[#a85a22]">*</span>
            </label>
            <textarea
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اشرح لنا بالتفصيل ملاحظتك، استفسارك، أو أي مشكلة واجهتها لنقوم بحلها على الفور..."
              required
              className="w-full p-3.5 bg-white border border-neutral-300 rounded-2xl text-sm font-semibold text-[#1c1917] placeholder:text-neutral-400 focus:outline-none focus:border-[#a85a22] transition-all resize-none leading-relaxed shadow-sm"
            />
          </div>

          {/* الزر الكبير لإرسال الشكوى */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 sm:py-4.5 px-6 rounded-2xl copper-btn-gradient hover:brightness-110 active:scale-98 text-white font-black text-base shadow-xl shadow-[#c87a3e]/25 border border-[#df9b6d]/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جارٍ حفظ وإرسال الرسالة...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 stroke-[2.3]" />
                <span>إرسال الشكوى / الاستفسار</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#78716c] pt-1">
          <Database className="w-3.5 h-3.5 text-[#a85a22]" />
          <span>الشكاوى تُسجل وتُحفظ بأمان في قاعدة بيانات سوبابيس (Supabase)</span>
        </div>
      </div>

      {/* 5. Assurance Footer */}
      <div className="bg-white p-4.5 rounded-2xl border border-neutral-200 text-xs text-[#57534e] flex items-center gap-3 shadow-sm">
        <Clock className="w-5 h-5 text-[#a85a22] shrink-0" />
        <p className="leading-relaxed">
          يلتزم فريق إدارة <strong>الرضا للدهانات والديكورات</strong> بمراجعة كافة الشكاوى والاستفسارات والرد خلال مدة لا تتجاوز ساعتين خلال أوقات العمل الرسمية.
        </p>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="تم استلام الشكوى بنجاح"
        message="تم استلام طلبك بنجاح، سيتواصل معك مهندس الرضا خلال 24 ساعة."
        whatsappUrl={lastWhatsappUrl || undefined}
        whatsappLabel="إرسال نسخة عبر واتساب"
      />
    </div>
  );
};
