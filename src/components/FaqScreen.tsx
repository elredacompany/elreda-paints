import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  Search,
} from 'lucide-react';
import { FAQ_DATA } from '../data/trustData';
import { COMPANY_INFO } from '../data/companyData';
import { Screen } from '../types';

interface FaqScreenProps {
  onBackToHome: () => void;
  onNavigateToContact: () => void;
  onNavigate: (screen: Screen) => void;
}

export const FaqScreen: React.FC<FaqScreenProps> = ({
  onBackToHome,
  onNavigateToContact,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']); // First two open by default
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFaq = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] max-w-3xl mx-auto">
      {/* 1. Header with Back Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#c87a3e]/30 shadow-xl shadow-[#c87a3e]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black shadow-md shadow-[#c87a3e]/25 shrink-0">
            <HelpCircle className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-2.5 py-0.5 rounded-full shadow-sm">
                إجابات فورية واضحة
              </span>
              <span className="text-xs text-[#78716c] font-medium">كل ما يهمك معرفته</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1">
              الأسئلة الشائعة
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              إجابات دقيقة على أكثر استفسارات العملاء حول مواعيد التنفيذ، الخامات، والضمان
            </p>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white hover:bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </button>
      </div>

      {/* 2. Search input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#78716c] absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في الأسئلة (مثال: مدة التنفيذ، الضمان، الخامات)..."
          className="w-full pl-4 pr-11 py-3.5 bg-white border border-neutral-300 rounded-2xl text-xs sm:text-sm font-semibold text-[#1c1917] placeholder:text-neutral-400 focus:outline-none focus:border-[#a85a22] shadow-sm"
        />
      </div>

      {/* 3. Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#c87a3e]/50 shadow-md'
                  : 'bg-white border-neutral-200 hover:border-[#c87a3e]/30'
              }`}
            >
              {/* Question Header */}
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-3 focus:outline-none group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                      isOpen
                        ? 'copper-btn-gradient text-white shadow-sm'
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

              {/* Accordion Answer Body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-neutral-100 space-y-2 animate-in fade-in duration-200">
                  <div className="bg-[#faf5f0] p-4 rounded-xl border border-neutral-200 text-xs sm:text-sm text-[#57534e] leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                  {faq.category && (
                    <span className="text-[10px] text-[#a85a22] font-bold bg-[#faf5f0] border border-[#c87a3e]/20 px-2 py-0.5 rounded-md inline-block">
                      {faq.category}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Have other questions? Contact directly */}
      <div className="bg-[#faf5f0] p-5 sm:p-6 rounded-3xl border-2 border-[#c87a3e]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-extrabold text-[#1c1917] text-base">
            هل لديك استفسار آخر لم تجد إجابته هنا؟
          </h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            تواصل مباشرة مع الفني المشرف عبر الواتساب أو الهاتف وسيجيبك فوراً
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اسألنا على واتساب</span>
          </a>

          <button
            onClick={onNavigateToContact}
            className="px-4 py-2.5 rounded-xl copper-btn-gradient text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>طلب معاينة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
