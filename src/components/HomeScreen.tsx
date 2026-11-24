import React, { useState, useEffect } from 'react';
import {
  Calculator,
  PhoneCall,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Palette,
  Gift,
  MapPin,
  Headphones,
  Award,
  MessageSquare,
  Bot,
  ShieldCheck,
  Star,
  CheckCircle2,
  PlusCircle,
  Check,
  HardHat,
  FileCheck,
  Clock,
  Layers,
  Maximize2,
  X,
} from 'lucide-react';
import { COMPANY_INFO, PORTFOLIO_ITEMS } from '../data/companyData';
import {
  WORK_STEPS_DATA,
  FAQ_DATA,
  REVIEWS_DATA,
} from '../data/trustData';
import { Screen, BannerOffer, PortfolioItem, GalleryStageItem, ReviewItem } from '../types';
import { fetchReviewsFromFirestore, createReviewInFirestore } from '../services/firebase';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  bannerOffer?: BannerOffer;
  portfolioItems?: PortfolioItem[];
  galleryStages?: GalleryStageItem[];
  isGalleryLoading?: boolean;
  pwaInstall?: {
    isInstallable: boolean;
    isInstalled: boolean;
    isIOS: boolean;
    onInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  portfolioItems,
  galleryStages = [],
  isGalleryLoading = false,
}) => {
  const [selectedStageImage, setSelectedStageImage] = useState<GalleryStageItem | null>(null);

  // Customer reviews loaded from Firestore (shared across all visitors)
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewProject, setReviewProject] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchReviewsFromFirestore().then((res) => {
      if (isMounted && res.data.length > 0) {
        setReviews(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || isSubmittingReview) return;

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      const result = await createReviewInFirestore({
        name: reviewName.trim(),
        project: reviewProject.trim() || 'تشطيب سكني - القاهرة',
        location: 'القاهرة',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (result.success && result.data) {
        setReviews((prev) => [result.data!, ...prev]);
        setReviewSubmitted(true);
        setReviewName('');
        setReviewProject('');
        setReviewComment('');
        setReviewRating(5);
        setTimeout(() => {
          setShowReviewForm(false);
          setReviewSubmitted(false);
        }, 2500);
      } else {
        setReviewError('تعذر إرسال التقييم حالياً، يرجى المحاولة مرة أخرى.');
      }
    } catch {
      setReviewError('حدث خطأ أثناء حفظ التقييم، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] relative">

      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-[#c87a3e]/30 p-6 sm:p-8 shadow-xl shadow-[#c87a3e]/5 text-center">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#c87a3e]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#df9b6d]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-4">
          {/* Logo Showcase */}
          <div className="relative group/logo">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#df9b6d] via-[#c87a3e] to-[#944616] opacity-25 blur-md group-hover/logo:opacity-40 transition duration-500"></div>
            <div className="relative w-48 h-28 sm:w-60 sm:h-36 md:w-68 md:h-40 rounded-3xl overflow-hidden bg-white border-2 border-[#c87a3e]/40 shadow-xl p-2 flex items-center justify-center">
              <img
                src={COMPANY_INFO.logoUrl}
                alt={COMPANY_INFO.name}
                width={1632}
                height={964}
                decoding="async"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Company Name & Tagline */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl font-black text-[#1c1917] tracking-tight">
              شركة الرضا للدهانات والديكور
            </h1>

            {/* English Subtitle */}
            <div className="text-xs sm:text-sm md:text-base font-bold font-serif-luxury tracking-[0.22em] text-[#a85a22] uppercase">
              Al Reda Paints &amp; Decor
            </div>

            {/* Tagline: "شغل محترف ومضمون" */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#faf5f0] border border-[#c87a3e]/40 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#a85a22]" />
              <span className="text-base sm:text-lg font-black text-[#a85a22]">
                شغل محترف ومضمون
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed max-w-lg">
            خبرة تزيد عن 15 عاماً في دهانات الحوائط والأسقف، بديل الخشب، بديل الرخام، وشيبورد MDF بأعلى معايير الإتقان والفخامة.
          </p>

          {/* Small Card: "نقدم استشارة مجانية" */}
          <div
            onClick={() => onNavigate('contact')}
            className="w-full max-w-md p-3.5 sm:p-4 rounded-2xl bg-[#faf5f0] hover:bg-[#f6eee4] border-2 border-[#c87a3e]/45 hover:border-[#b86221] shadow-md flex items-center justify-between gap-3 cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl copper-btn-gradient text-white flex items-center justify-center shrink-0 shadow-md shadow-[#c87a3e]/25 group-hover:scale-105 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm sm:text-base font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
                  نقدم استشارة مجانية
                </span>
                <span className="block text-[11px] text-[#78716c] mt-0.5">
                  معاينة موقع بدون أي رسوم وتحديد الخامات والألوان المناسبة
                </span>
              </div>
            </div>
            <span className="text-xs font-black bg-white text-[#a85a22] px-3 py-1.5 rounded-xl border border-[#c87a3e]/30 shrink-0 shadow-sm">
              احجز الآن ←
            </span>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTION BUTTONS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#57534e] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#a85a22]" />
            <span>خدمات وأدوات التطبيق السريعة:</span>
          </span>
          <span className="text-[11px] text-[#a85a22] font-semibold">أدوات تنفيذية وتفاعلية</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* 1. حاسبة المواد */}
          <button
            type="button"
            onClick={() => onNavigate('calculator')}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center shadow-md shadow-[#c87a3e]/20 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6 stroke-[2.3]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
              حاسبة المواد
            </span>
            <span className="text-[10px] text-[#78716c]">حساب البستلات والتكلفة</span>
          </button>

          {/* 2. كتالوج الألوان */}
          <button
            type="button"
            onClick={() => onNavigate('jotun_colors')}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6 stroke-[2.3]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
              كتالوج الألوان
            </span>
            <span className="text-[10px] text-[#78716c]">كروت ألوان جوتن الرسمية</span>
          </button>

          {/* 3. معرض الأعمال */}
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 stroke-[2.3]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
              معرض الأعمال
            </span>
            <span className="text-[10px] text-[#78716c]">صور حقيقية بعد التنفيذ</span>
          </button>

          {/* 4. اطلب معاينة */}
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center shadow-md shadow-[#c87a3e]/20 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6 stroke-[2.3]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
              اطلب معاينة
            </span>
            <span className="text-[10px] text-[#78716c]">زيارة مجانية للموقع</span>
          </button>

          {/* 5. الشكاوى والاقتراحات (New Section) */}
          <button
            type="button"
            onClick={() => onNavigate('feedback')}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#a85a22] border border-amber-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 stroke-[2.3]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1c1917] group-hover:text-[#a85a22] transition-colors">
              الشكاوى والاقتراحات
            </span>
            <span className="text-[10px] text-[#78716c]">صوتك واقتراحك للإدارة</span>
          </button>

          {/* 6. خدمة العملاء */}
          <button
            type="button"
            onClick={() => onNavigate('customer_service')}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf5f0] border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6 stroke-[2.3]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1c1917] group-hover:text-emerald-700 transition-colors">
              خدمة العملاء
            </span>
            <span className="text-[10px] text-[#78716c]">دعم واستفسارات فورية</span>
          </button>
        </div>
      </div>

      {/* Smart Advisor AI Full Banner */}
      <div
        onClick={() => onNavigate('smart_advisor')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-4 sm:p-5 border-2 border-[#c87a3e]/40 shadow-xl cursor-pointer group transition-all hover:border-[#c87a3e] active:scale-[0.99]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c87a3e]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl copper-btn-gradient flex items-center justify-center text-white shadow-lg shadow-[#c87a3e]/30 group-hover:scale-105 transition-transform shrink-0">
              <Bot className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white group-hover:text-[#e49b64] transition-colors">
                  المستشار الذكي لشركة الرضا
                </span>
                <span className="text-[10px] bg-[#c87a3e]/30 text-[#e49b64] border border-[#c87a3e]/50 px-2 py-0.5 rounded-full font-mono font-bold">
                  AI
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5 line-clamp-1 sm:line-clamp-none">
                استشارة فورية لألوان جوتن (كالبريز 0552) وديكورات بديل الخشب والرخام وحجز المعاينة
              </p>
            </div>
          </div>
          <span className="text-xs font-bold copper-btn-gradient text-white px-3.5 py-2 rounded-xl shadow-xs shrink-0 whitespace-nowrap hidden sm:inline-block">
            ابدأ المحادثة ←
          </span>
        </div>
      </div>

      {/* WHY CHOOSE US SECTION (ليه تختار الرضا؟) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#c87a3e]/25 shadow-lg space-y-5">
        <div className="pb-3 border-b border-neutral-100">
          <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-3 py-0.5 rounded-full shadow-2xs">
            مميزات شركة الرضا
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#1c1917] mt-1.5 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#c87a3e]" />
            <span>ليه تختار الرضا؟</span>
          </h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            نجمع بين الخبرة الميدانية والالتزام الهندسي لنضمن لك تشطيباً فاخراً يدوم طويلاً
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#faf5f0]/80 hover:bg-[#faf5f0] border border-[#c87a3e]/20 hover:border-[#c87a3e]/50 transition-all text-center space-y-2.5 shadow-2xs group">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#a85a22] border border-[#c87a3e]/30 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-[#1c1917]">
              خبرة تزيد عن 15 عاماً
            </h4>
            <p className="text-[11px] text-[#57534e] leading-relaxed">
              سجل حافل في تنفيذ وتشطيب الشقق والفلل بأعلى جودة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5f0]/80 hover:bg-[#faf5f0] border border-[#c87a3e]/20 hover:border-[#c87a3e]/50 transition-all text-center space-y-2.5 shadow-2xs group">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#a85a22] border border-[#c87a3e]/30 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <HardHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-[#1c1917]">
              إشراف هندسي
            </h4>
            <p className="text-[11px] text-[#57534e] leading-relaxed">
              متابعة فنية وهندسية دقيقة لكل مراحل التأسيس والتشطيب.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5f0]/80 hover:bg-[#faf5f0] border border-[#c87a3e]/20 hover:border-[#c87a3e]/50 transition-all text-center space-y-2.5 shadow-2xs group">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#a85a22] border border-[#c87a3e]/30 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-[#1c1917]">
              عقد رسمي وضمان
            </h4>
            <p className="text-[11px] text-[#57534e] leading-relaxed">
              بنود واضحة وخامات أصلية معتمدة بضمان شامل بعد التسليم.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5f0]/80 hover:bg-[#faf5f0] border border-[#c87a3e]/20 hover:border-[#c87a3e]/50 transition-all text-center space-y-2.5 shadow-2xs group">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#a85a22] border border-[#c87a3e]/30 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-[#1c1917]">
              التزام بالمواعيد
            </h4>
            <p className="text-[11px] text-[#57534e] leading-relaxed">
              جدول زمني منضبط لتسليم الموقع في الموعد المحدد تماماً.
            </p>
          </div>
        </div>
      </div>

      {/* WORK PROCESS STEPS SECTION (معاينة -> عرض سعر -> تنفيذ) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#c87a3e]/25 shadow-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-3 py-0.5 rounded-full shadow-2xs">
              منهجية واضحة وموثوقة
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#1c1917] mt-1.5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c87a3e]" />
              <span>خطوات العمل وتنفيذ مشروعك</span>
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              3 خطوات بسيطة وواضحة: معاينة مجانية، عرض سعر رسمي، وتنفيذ وتسليم بالضمان
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="hidden sm:flex text-xs font-bold copper-btn-gradient text-white px-3.5 py-2 rounded-xl shadow-xs items-center gap-1.5 cursor-pointer"
          >
            <span>حجز معاينة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {WORK_STEPS_DATA.map((step) => (
            <div
              key={step.number}
              className="p-4 rounded-2xl bg-[#faf5f0]/80 hover:bg-[#faf5f0] border border-[#c87a3e]/20 hover:border-[#c87a3e]/50 transition-all space-y-2 relative group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl sm:text-2xl font-black text-[#c87a3e]/70 group-hover:text-[#c87a3e] transition-colors">
                  {step.number}
                </span>
                <span className="w-8 h-8 rounded-xl bg-white border border-[#c87a3e]/30 text-[#a85a22] flex items-center justify-center shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-[#1c1917]">
                {step.title}
              </h4>
              <span className="block text-[11px] font-bold text-[#a85a22]">
                {step.subtitle}
              </span>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* EXECUTION STAGES SECTION (مراحل التنفيذ من Firebase gallery) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#c87a3e]/25 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 gap-3">
          <div>
            <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-3 py-0.5 rounded-full shadow-2xs">
              التنفيذ خطوة بخطوة
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#1c1917] mt-1.5 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#c87a3e]" />
              <span>مراحل التنفيذ</span>
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              توثيق مراحل العمل الميدانية من التأسيس والمعجون والصنفرة وحتى التشطيب النهائي
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="text-xs font-bold text-[#a85a22] hover:text-[#944616] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#faf5f0] border border-[#c87a3e]/30 transition-colors cursor-pointer shrink-0"
          >
            <span>احجز معاينة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {isGalleryLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-48 rounded-2xl bg-neutral-100 animate-pulse border border-neutral-200"
              />
            ))}
          </div>
        ) : galleryStages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {galleryStages.map((stage, index) => (
              <div
                key={stage.id}
                onClick={() => setSelectedStageImage(stage)}
                className="group bg-[#faf5f0] rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#c87a3e] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-100">
                  <img
                    src={stage.imageUrl}
                    alt={stage.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 bg-white/95 text-[#a85a22] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#c87a3e]/30 shadow-xs">
                    {stage.stageName || `المرحلة ${index + 1}`}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/50 text-white p-1.5 rounded-lg backdrop-blur-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-3 bg-white flex-1 space-y-1">
                  <h4 className="font-bold text-[#1c1917] text-xs sm:text-sm truncate group-hover:text-[#a85a22] transition-colors">
                    {stage.title}
                  </h4>
                  {stage.description && (
                    <p className="text-[11px] text-[#78716c] line-clamp-2 leading-relaxed">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-[#faf5f0]/80 border border-[#c87a3e]/25 text-center space-y-1.5">
            <p className="text-xs sm:text-sm font-bold text-[#1c1917]">
              صور مراحل التنفيذ الميدانية متاحة فور إضافتها من موقع العمل
            </p>
            <p className="text-[11px] text-[#78716c]">
              تشمل مراحلنا: السيلر المعالج ← 4 سواكين معجون ← الصنفرة الميكانيكية ← بطانة ← تشطيب نهائي معتمد
            </p>
          </div>
        )}
      </div>

      {/* 4. Quick Showcase of Finished Work */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#c87a3e]/25 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1c1917] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#a85a22]" />
              <span>أحدث تشطيباتنا المنفذة</span>
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              نماذج واقعية من تشطيبات الفلل والشقق بعد التنفيذ مباشرة
            </p>
          </div>

          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold text-[#a85a22] hover:text-[#944616] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#faf5f0] border border-[#c87a3e]/30 transition-colors cursor-pointer"
          >
            <span>معرض الأعمال</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {(portfolioItems || PORTFOLIO_ITEMS).slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('portfolio')}
              className="group bg-[#faf5f0] rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#c87a3e] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden bg-neutral-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center scale-[1.04] group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2.5 right-2.5 bg-white/95 text-[#a85a22] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#c87a3e]/30 shadow-sm backdrop-blur-sm">
                  {item.categoryName}
                </div>
              </div>
              <div className="p-3 space-y-1 bg-white">
                <h4 className="font-bold text-[#1c1917] text-xs truncate group-hover:text-[#a85a22] transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#78716c] truncate">
                  {item.paintUsed}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS & REVIEWS SECTION (آراء العملاء) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#c87a3e]/25 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-3">
          <div>
            <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-3 py-0.5 rounded-full shadow-2xs">
              تجارب حقيقية موثقة
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#1c1917] mt-1.5 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>آراء العملاء وتقييماتهم</span>
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              انطباعات ملاك الشقق والفلل ومصممي الديكور في القاهرة الكبرى
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs font-bold text-white copper-btn-gradient flex items-center gap-1.5 px-3.5 py-2 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showReviewForm ? 'إلغاء' : 'أضف تقييمك الآن'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('reviews')}
              className="text-xs font-bold text-[#a85a22] hover:text-[#944616] flex items-center gap-1 px-3 py-2 rounded-xl bg-[#faf5f0] border border-[#c87a3e]/30 transition-colors cursor-pointer"
            >
              <span>جميع التقييمات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Review Submission Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="p-4 sm:p-5 rounded-2xl bg-[#fdfaf7] border-2 border-[#c87a3e]/35 shadow-sm space-y-3.5 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-[#1c1917] flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>شاركنا تقييمك ورأيك في تنفيذ وتشطيب شركة الرضا</span>
              </h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-115"
                    title={`${star} نجوم`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="اسم حضرتك (مثال: أستاذ تامر حسني)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-[#c87a3e] text-xs sm:text-sm text-neutral-900 outline-none"
              />
              <input
                type="text"
                value={reviewProject}
                onChange={(e) => setReviewProject(e.target.value)}
                placeholder="نوع المكان أو المنطقة (مثال: شقة 150م - التجمع الخامس)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-[#c87a3e] text-xs sm:text-sm text-neutral-900 outline-none"
              />
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="اكتب تجربتك مع دقة المواعيد ونظافة الموقع وجودة الدهانات وسعر المصنعية..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 focus:border-[#c87a3e] text-xs sm:text-sm text-neutral-900 outline-none resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {reviewSubmitted ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>شكراً جزيلاً! تم نشر تقييمك بنجاح وسعداء بخدمتك دائماً.</span>
                </div>
              ) : reviewError ? (
                <span className="text-xs font-bold text-red-600">{reviewError}</span>
              ) : (
                <span className="text-[11px] text-[#78716c]">
                  سيتم عرض تقييمك فوراً في التطبيق أمام جميع زوار وعملاء الشركة.
                </span>
              )}

              <button
                type="submit"
                disabled={reviewSubmitted || isSubmittingReview}
                className="px-5 py-2.5 rounded-xl copper-btn-gradient text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingReview ? 'جاري النشر...' : 'إرسال التقييم'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-[#faf5f0]/70 border border-neutral-200/90 hover:border-[#c87a3e]/40 transition-all space-y-2.5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed mt-2 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-extrabold text-[#1c1917]">{rev.name}</span>
                  <span className="block text-[10px] text-[#78716c]">{rev.project}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  rev.date === 'الآن'
                    ? 'text-amber-700 bg-amber-100'
                    : 'text-emerald-600 bg-emerald-50'
                }`}>
                  {rev.date === 'الآن' ? 'تقييم حديث ✨' : 'عميل موثق'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ PREVIEW SECTION (الأسئلة الشائعة) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#c87a3e]/25 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-3 py-0.5 rounded-full shadow-2xs">
              إجابات سريعة
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#1c1917] mt-1.5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#c87a3e]" />
              <span>الأسئلة الشائعة حول التشطيب</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('faq')}
            className="text-xs font-bold text-[#a85a22] hover:text-[#944616] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#faf5f0] border border-[#c87a3e]/30 transition-colors cursor-pointer"
          >
            <span>المزيد من الأسئلة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {FAQ_DATA.slice(0, 3).map((faq) => (
            <div
              key={faq.id}
              className="p-3.5 rounded-2xl bg-[#faf5f0]/60 border border-neutral-200/80 hover:border-[#c87a3e]/30 transition-all space-y-1.5"
            >
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1c1917] flex items-center gap-2">
                <span className="w-5 h-5 rounded-md copper-btn-gradient text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  س
                </span>
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs text-[#57534e] leading-relaxed pr-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BOTTOM SECTION & TERMS LINK */}
      <div className="bg-[#faf5f0] p-5 sm:p-6 rounded-3xl border-2 border-[#c87a3e]/35 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#a85a22] flex items-center justify-center shrink-0 border border-[#c87a3e]/30 shadow-sm">
            <MapPin className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <span className="block text-sm sm:text-base font-black text-[#1c1917]">
              نخدم القاهرة الكبرى وقريباً في باقي المحافظات
            </span>
            <span className="block text-xs text-[#78716c] mt-0.5">
              التجمع الخامس، القاهرة الجديدة، الشيخ زايد، 6 أكتوبر، المعادي، الشروق، ومدينتي
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('terms')}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-100 text-[#a85a22] font-bold text-xs border border-[#c87a3e]/30 shadow-xs cursor-pointer"
          >
            الشروط والأحكام
          </button>
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl copper-btn-gradient text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل معنا للاستفسار</span>
          </a>
        </div>
      </div>

      {/* Execution Stage Image Lightbox */}
      {selectedStageImage && (
        <div
          onClick={() => setSelectedStageImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border-2 border-[#c87a3e]/40 shadow-2xl"
          >
            <div className="px-4 py-3 bg-[#faf5f0] border-b border-[#c87a3e]/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#a85a22]">
                  {selectedStageImage.stageName || 'مراحل التنفيذ'}
                </span>
                <h4 className="text-sm font-black text-[#1c1917]">{selectedStageImage.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStageImage(null)}
                className="p-1.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-neutral-100 max-h-[65vh] overflow-hidden flex items-center justify-center">
              <img
                src={selectedStageImage.imageUrl}
                alt={selectedStageImage.title}
                decoding="async"
                className="w-full h-full max-h-[65vh] object-contain"
              />
            </div>
            {selectedStageImage.description && (
              <p className="p-4 text-xs sm:text-sm text-[#57534e] leading-relaxed bg-white">
                {selectedStageImage.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
