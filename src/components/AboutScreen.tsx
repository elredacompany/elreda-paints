import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { FAQ_DATA } from '../data/trustData';
import { Screen } from '../types';

interface AboutScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'faq'>('about');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleFaq = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] max-w-4xl mx-auto">
      {/* 1. Header with Brand Identity */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#c87a3e]/30 shadow-xl shadow-[#c87a3e]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black shadow-md shadow-[#c87a3e]/25 shrink-0">
            <Building2 className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#faf5f0] border border-[#c87a3e]/30 text-[#a85a22] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>خبرة تفوق 15 عاماً في التشطيب الراقي</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1">
              عن الشركة والأسئلة الشائعة
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              شركة الرضا للدهانات والديكور • إتقان معماري يرتقي بأفخم التشطيبات
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

      {/* 2. Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#faf5f0] rounded-2xl border border-[#c87a3e]/25">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'copper-btn-gradient text-white shadow-md'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>عن شركة الرضا للدهانات</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'faq'
              ? 'copper-btn-gradient text-white shadow-md'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>الأسئلة الشائعة (FAQ)</span>
        </button>
      </div>

      {/* 3. Tab Content: About Us */}
      {activeTab === 'about' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Main Story & Values */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#c87a3e]/25 shadow-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-[#1c1917] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#a85a22]" />
              <span>من نحن: شركة الرضا للدهانات والديكور</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
              تأسست <strong>شركة الرضا للدهانات والديكور</strong> لتكون الوجهة الأولى لكل من يبحث عن التميز المعماري والفخامة في تشطيبات الجدران والأسقف والديكورات الداخلية والخارجية. نعتمد على أحدث أساليب التأسيس بالليزر، والمعجون الحراري، واستخدام أرقى الدهانات المائية والزيتية الأصلية المعتمدة من أكبر المصانع العالمية مثل جوتن وGLC وسايبس.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-[#faf5f0] border border-[#c87a3e]/25 space-y-1.5">
                <ShieldCheck className="w-6 h-6 text-[#a85a22]" />
                <h3 className="font-extrabold text-[#1c1917] text-sm">ضمان شامل ومكتوب</h3>
                <p className="text-[11px] text-[#78716c] leading-relaxed">
                  نضمن جودة المواد ومراحل التأسيس لسنوات طويلة ضد التقشير والتشققات.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf5f0] border border-[#c87a3e]/25 space-y-1.5">
                <Users className="w-6 h-6 text-[#a85a22]" />
                <h3 className="font-extrabold text-[#1c1917] text-sm">طاقم فني محترف</h3>
                <p className="text-[11px] text-[#78716c] leading-relaxed">
                  صنايعية وفنيون بخبرة عقود في التعامل مع أفخم الخامات والقصور.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf5f0] border border-[#c87a3e]/25 space-y-1.5">
                <Clock className="w-6 h-6 text-[#a85a22]" />
                <h3 className="font-extrabold text-[#1c1917] text-sm">التزام صارم بالمواعيد</h3>
                <p className="text-[11px] text-[#78716c] leading-relaxed">
                  جدول زمني محدد ودقيق لتسليم الشقة أو الفيلا بدون أي تأخير.
                </p>
              </div>
            </div>
          </div>

          {/* Scope of Services */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#c87a3e]/25 space-y-3">
            <h3 className="font-black text-[#1c1917] text-base">خدماتنا المتكاملة:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5f0] border border-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#a85a22] shrink-0" />
                <span className="text-[#1c1917]">دهانات الجدران والأسقف (مطفي، نصف لمعة، سيلك، قطيفة)</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5f0] border border-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#a85a22] shrink-0" />
                <span className="text-[#1c1917]">تكسيات بديل الخشب WPC الكوري والتركي المضلع</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5f0] border border-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#a85a22] shrink-0" />
                <span className="text-[#1c1917]">ألواح بديل الرخام UV المقاوم للمياه وعروق الذهب المضاءة</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5f0] border border-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#a85a22] shrink-0" />
                <span className="text-[#1c1917]">شيبورد وخشب MDF ألماني لوحدات التلفزيون والدريسنج</span>
              </div>
            </div>
          </div>

          {/* Regional Coverage Banner */}
          <div className="bg-[#faf5f0] p-4.5 rounded-2xl border-2 border-[#c87a3e]/35 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#a85a22]" />
              <span className="text-xs sm:text-sm font-bold text-[#1c1917]">
                نخدم القاهرة الكبرى حالياً.. وقريباً في باقي المحافظات
              </span>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-xl copper-btn-gradient text-white text-xs font-black shadow-md cursor-pointer"
            >
              اطلب معاينة لموقعك
            </button>
          </div>
        </div>
      )}

      {/* 4. Tab Content: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-3">
            {FAQ_DATA.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#c87a3e]/50 shadow-md'
                      : 'bg-white border-neutral-200 hover:border-[#c87a3e]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-3 focus:outline-none group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                          isOpen
                            ? 'copper-btn-gradient text-white'
                            : 'bg-[#faf5f0] text-[#78716c] group-hover:text-[#a85a22]'
                        }`}
                      >
                        ؟
                      </span>
                      <span className="font-extrabold text-sm sm:text-base text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`p-1.5 rounded-xl shrink-0 transition-colors ${
                        isOpen ? 'text-[#a85a22] bg-[#faf5f0]' : 'text-[#78716c] group-hover:text-[#1c1917]'
                      }`}
                    >
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-neutral-100 space-y-2 animate-in fade-in duration-200">
                      <div className="bg-[#faf5f0] p-4 rounded-xl border border-neutral-200 text-xs sm:text-sm text-[#57534e] leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick WhatsApp Help */}
          <div className="bg-white p-5 rounded-2xl border border-[#c87a3e]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div>
              <h4 className="font-bold text-[#1c1917] text-sm">هل لديك سؤال آخر لم تجد إجابته؟</h4>
              <p className="text-xs text-[#78716c] mt-0.5">فريقنا متواجد للرد على استفسارك في الحال عبر الواتساب</p>
            </div>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة واتساب سريعة</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
