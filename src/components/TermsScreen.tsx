import React from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Award,
  AlertCircle,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Screen } from '../types';

interface TermsScreenProps {
  onBackToHome: () => void;
  onNavigateToContact: () => void;
  onNavigate: (screen: Screen) => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({
  onBackToHome,
  onNavigateToContact,
}) => {
  const termsList = [
    {
      title: '1. المعاينة الميدانية المجانية',
      description:
        'المعاينة الميدانية وزيارة المهندس أو الفني المختص داخل محافظة القاهرة والجيزة مجانية بالكامل 100% وبدون أي رسوم خفية. تهدف المعاينة لرفع المقاسات بدقة، معاينة حالة الحوائط، وعرض عينات خامات جوتن وبديل الخشب والرخام.',
    },
    {
      title: '2. طبيعة الخدمة (تنفيذ واحترافية متكاملة)',
      description:
        'نحن شركة متخصصة في تنفيذ أعمال التشطيب والديكور بالكامل (شاملة الصنفرة، المعجون، التأسيس، والتشطيب النهائي). لا نقوم ببيع خامات منفردة بدون تنفيذ، وذلك لضمان جودة النتيجة النهائية وضمان متانة العمل.',
    },
    {
      title: '3. تحديد التكلفة والأسعار',
      description:
        'نظراً لاختلاف طبيعة كل موقع ومساحته ونوع التشطيب المطلوب (دهانات، بديل خشب، بديل رخام، جبسون بورد)، يتم تقديم مقايسة سعرية رسمية ونهائية بعد المعاينة الميدانية وتحديد رغبات العميل بدقة.',
    },
    {
      title: '4. الالتزام بمواعيد التنفيذ والتسليم',
      description:
        'يتم تحديد جدول زمني محدد ودقيق لتسليم المشروع في عقد الاتفاق، ونلتزم بتسليم العمل في الموعد المحدد مع الحفاظ على نظافة المكان وأعلى معايير الإتقان.',
    },
    {
      title: '5. ضمان جودة التنفيذ وخامات أصلية 100%',
      description:
        'نلتزم باستخدام خامات أصلية ومعتمدة من كبرى الشركات (جوتن، GLC، سايبس، باكين) مع ضمان شامل على جودة وثبات الألوان وعدم تقشير الدهان أو تفكك ديكورات بديل الخشب والرخام.',
    },
    {
      title: '6. سياسة الدفعات والتعاقد',
      description:
        'تتم الدفعات على مراحل مرتبطة بنسبة الإنجاز على أرض الواقع (دفعة مقدمة للبدء، دفعات مرحلية بعد استلام مراحل التأسيس، ودفعة نهائية عند التسليم والمطابقة مع العميل).',
    },
  ];

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#c87a3e]/30 shadow-xl shadow-[#c87a3e]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black shadow-md shadow-[#c87a3e]/25 shrink-0">
            <FileText className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-2.5 py-0.5 rounded-full shadow-sm">
                شفافية ووضوح
              </span>
              <span className="text-xs text-[#78716c] font-medium">عقد واتفاق عادل</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1">
              الشروط والأحكام وسياسة العمل
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              التزاماتنا تجاه عملائنا لضمان أرقى مستوى تشطيب بأعلى معايير الأمانة والاحترافية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </button>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#c87a3e]/20 flex items-center gap-3 shadow-xs">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <span className="block text-xs font-black text-[#1c1917]">معاينة مجانية 100%</span>
            <span className="block text-[10px] text-[#78716c]">بدون أي التزام مسبق</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c87a3e]/20 flex items-center gap-3 shadow-xs">
          <Award className="w-8 h-8 text-[#c87a3e] shrink-0" />
          <div>
            <span className="block text-xs font-black text-[#1c1917]">ضمان جودة معتمد</span>
            <span className="block text-[10px] text-[#78716c]">خامات أصلية بالكامل</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c87a3e]/20 flex items-center gap-3 shadow-xs">
          <Clock className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <span className="block text-xs font-black text-[#1c1917]">التزام صارم بالمواعيد</span>
            <span className="block text-[10px] text-[#78716c]">تسليم في الوقت المحدد</span>
          </div>
        </div>
      </div>

      {/* Terms Accordion / Cards */}
      <div className="space-y-3">
        {termsList.map((term, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#c87a3e]/40 shadow-xs transition-all space-y-2"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#1c1917]">
                {term.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed pr-7">
              {term.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-[#faf5f0] p-5 sm:p-6 rounded-3xl border-2 border-[#c87a3e]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-extrabold text-[#1c1917] text-base">
            جاهز لبدء تشطيب شقتك أو فيلتك؟
          </h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            احجز موعد معاينتك المجانية الآن وسيتواصل معك مهندس التنفيذ مباشرة
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
            <span>واتساب</span>
          </a>

          <button
            type="button"
            onClick={onNavigateToContact}
            className="px-4 py-2.5 rounded-xl copper-btn-gradient text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>طلب معاينة الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
