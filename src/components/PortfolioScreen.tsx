import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MapPin,
  Paintbrush,
  Tag,
  Maximize2,
  X,
  PhoneCall,
  Layers,
  Gem,
  Box,
  LayoutGrid,
  MessageCircle,
  CheckCircle2,
  SlidersHorizontal,
  Camera,
  Image as ImageIcon,
  BrickWall,
  Share2,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { PORTFOLIO_ITEMS, COMPANY_INFO } from '../data/companyData';
import { PortfolioItem, Screen } from '../types';

interface PortfolioScreenProps {
  onNavigateToContactWithProject: (projectTitle: string) => void;
  onNavigate: (screen: Screen) => void;
  portfolioItems?: PortfolioItem[];
  initialSelectedProjectId?: string | null;
  onShowToast?: (msg: string) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  onNavigateToContactWithProject,
  onNavigate,
  portfolioItems,
  initialSelectedProjectId,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [shareTargetItem, setShareTargetItem] = useState<PortfolioItem | null>(null);
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);
  const hasOpenedDeepLinkRef = useRef(false);

  const allItems = portfolioItems && portfolioItems.length > 0 ? portfolioItems : PORTFOLIO_ITEMS;

  useEffect(() => {
    if (!initialSelectedProjectId || hasOpenedDeepLinkRef.current) return;
    const matched = allItems.find((item) => item.id === initialSelectedProjectId);
    if (matched) {
      hasOpenedDeepLinkRef.current = true;
      setSelectedItem(matched);
    }
  }, [initialSelectedProjectId, allItems]);

  const getProjectShareUrl = (item: PortfolioItem): string => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?screen=portfolio&project=${encodeURIComponent(
      item.id
    )}`;
  };

  const getProjectShareText = (item: PortfolioItem): string => {
    return `شاهد مشروع "${item.title}" (${item.categoryName}) من تنفيذ ${COMPANY_INFO.name} — ${item.paintUsed}`;
  };

  const handleCopyProjectLink = async (item: PortfolioItem) => {
    const shareUrl = getProjectShareUrl(item);
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      try {
        const temp = document.createElement('textarea');
        temp.value = shareUrl;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      } catch {
        // Ignore fallback failure
      }
    }
    setCopiedProjectId(item.id);
    onShowToast?.('تم نسخ رابط المشروع للمشاركة');
    setTimeout(() => setCopiedProjectId(null), 2500);
  };

  const handleNativeShare = async (item: PortfolioItem) => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: `${item.title} | ${COMPANY_INFO.name}`,
        text: getProjectShareText(item),
        url: getProjectShareUrl(item),
      });
    } catch {
      // User cancelled native share sheet
    }
  };

  // التصنيفات الـ 5 المطلوبة بدقة من العميل
  const categories = [
    {
      id: 'all',
      label: 'الكل',
      labelEn: 'All Work',
      icon: LayoutGrid,
    },
    {
      id: 'paints',
      label: 'دهانات',
      labelEn: 'Paints',
      icon: Paintbrush,
    },
    {
      id: 'wood_alternative',
      label: 'بديل خشب',
      labelEn: 'Wood Alternative',
      icon: Layers,
    },
    {
      id: 'marble_alternative',
      label: 'بديل رخام',
      labelEn: 'Marble Alternative',
      icon: Gem,
    },
    {
      id: 'stone_alternative',
      label: 'بديل حجر',
      labelEn: 'Stone Alternative',
      icon: BrickWall,
    },
    {
      id: 'chipboard',
      label: 'شيبورد و MDF',
      labelEn: 'Chipboard & MDF',
      icon: Box,
    },
  ];

  // دالة مطابقة التصنيف
  const isItemInCategory = (item: PortfolioItem, catId: string): boolean => {
    if (catId === 'all') return true;
    if (item.categories && item.categories.includes(catId)) {
      return true;
    }
    if (catId === 'paints') {
      return (
        item.category === 'paints' ||
        item.category === 'villas' ||
        item.category === 'apartments' ||
        item.category === 'decorations' ||
        item.category === 'facades'
      );
    }
    return item.category === catId;
  };

  const filteredItems = allItems.filter((item) => isItemInCategory(item, activeCategory));

  const getCategoryCount = (catId: string) => {
    return allItems.filter((item) => isItemInCategory(item, catId)).length;
  };

  const getCategoryBadgeStyle = (category: string, categories?: string[]) => {
    if (categories && categories.length > 1) {
      return {
        bg: 'bg-white/95 text-[#a85a22] border-[#c87a3e]/40 shadow-sm',
        dot: 'bg-[#a85a22]',
      };
    }
    switch (category) {
      case 'wood_alternative':
        return {
          bg: 'bg-[#fbf4ee]/95 text-[#944616] border-[#c87a3e]/40 shadow-sm',
          dot: 'bg-[#944616]',
        };
      case 'marble_alternative':
        return {
          bg: 'bg-amber-50/95 text-amber-900 border-amber-300 shadow-sm',
          dot: 'bg-amber-600',
        };
      case 'stone_alternative':
        return {
          bg: 'bg-stone-100/95 text-stone-800 border-stone-300 shadow-sm',
          dot: 'bg-stone-600',
        };
      case 'chipboard':
        return {
          bg: 'bg-orange-50/95 text-orange-900 border-orange-300 shadow-sm',
          dot: 'bg-orange-600',
        };
      case 'paints':
      default:
        return {
          bg: 'bg-white/95 text-[#a85a22] border-[#c87a3e]/40 shadow-sm',
          dot: 'bg-[#a85a22]',
        };
    }
  };

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] max-w-5xl mx-auto">
      {/* 1. رأس الشاشة - نمط فخم أبيض ونحاسي */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#c87a3e]/30 shadow-xl shadow-[#c87a3e]/5">
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#c87a3e]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#df9b6d]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#faf5f0] border border-[#c87a3e]/40 text-[#a85a22] text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#a85a22]" />
              <span>معرض صور الأعمال الحقيقية بعد التنفيذ</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-[#1c1917] tracking-tight leading-snug">
              معرض أعمالنا: تشطيبات حقيقية بأعلى دقة وفخامة
            </h1>
            <p className="text-xs sm:text-sm text-[#57534e] max-w-2xl leading-relaxed">
              استعرض صور أعمالنا بعد التنفيذ في الدهانات الفاخرة، بديل الخشب، بديل الرخام، وتجاليد الشيبورد و MDF. كل صورة تبرز مهارة وجودة التنفيذ الفعلي.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-2xl copper-btn-gradient text-white font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#c87a3e]/25 flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>طلب زيارة موقع ومعاينة مجانية</span>
            </button>
          </div>
        </div>

        {/* جاهزية المعرض لصور الشغل الحقيقي */}
        <div className="mt-4 pt-3.5 border-t border-neutral-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#a85a22] font-bold">
            <Camera className="w-4 h-4 text-[#a85a22]" />
            <span>معرض الأعمال جاهز لاستقبال صور شغلك الحقيقي فوراً</span>
          </div>
          <span className="text-[11px] text-[#78716c] bg-[#faf5f0] px-3 py-1 rounded-full border border-[#c87a3e]/20">
            تحديث مستمر لأحدث المشروعات والتشطيبات المنفذة
          </span>
        </div>
      </div>

      {/* 2. شريط تصنيفات فخم بالأبيض والنحاسي */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#57534e] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#a85a22]" />
            <span>اختر تصنيف الخدمة:</span>
          </span>
          <span className="text-[11px] font-bold text-[#a85a22]">
            عرض {filteredItems.length} من أصل {allItems.length} عملاً
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 px-0.5 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative group px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'copper-btn-gradient text-white shadow-lg shadow-[#c87a3e]/30 border border-[#df9b6d]/60 scale-[1.02]'
                    : 'bg-white text-[#57534e] hover:text-[#1c1917] border border-[#c87a3e]/25 hover:border-[#c87a3e] hover:bg-[#faf5f0] shadow-sm'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white stroke-[2.4]' : 'text-[#a85a22]'
                  }`}
                />
                <span>{cat.label}</span>

                {/* Counter Badge */}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                    isActive
                      ? 'bg-black/25 text-white'
                      : 'bg-[#faf5f0] text-[#78716c] group-hover:text-[#1c1917]'
                  }`}
                >
                  {count}
                </span>

                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#c87a3e] rounded-full blur-[1px]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. شبكة صور فخمة */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#c87a3e]/25 p-8 space-y-3 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-[#faf5f0] text-[#a85a22] flex items-center justify-center mx-auto border border-[#c87a3e]/30">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1c1917]">لا توجد صور مضافة في هذا التصنيف حالياً</h3>
          <p className="text-xs text-[#78716c] max-w-sm mx-auto">
            سيتم إضافة أحدث الصور والأعمال المنفذة لهذا التصنيف قريباً.
          </p>
          <button
            onClick={() => setActiveCategory('all')}
            className="px-5 py-2.5 rounded-xl copper-btn-gradient text-white font-black text-xs hover:brightness-110 transition-all mt-2 cursor-pointer shadow-md"
          >
            عرض كافة الأعمال
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {filteredItems.map((item) => {
            const badgeStyle = getCategoryBadgeStyle(item.category, item.categories);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#c87a3e]/25 hover:border-[#c87a3e] shadow-lg hover:shadow-xl hover:shadow-[#c87a3e]/15 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container with object-cover and subtle zoom to eliminate any edge borders */}
                <div className="relative h-72 sm:h-84 md:h-96 overflow-hidden bg-[#faf5f0]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center scale-[1.04] group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                  {/* Top Right: Category Badge */}
                  <div
                    className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-1.5 shadow-md ${badgeStyle.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`}></span>
                    <span>{item.categoryName}</span>
                  </div>

                  {/* Top Left: After Completion Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 border border-[#c87a3e]/30 text-[#1c1917] text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم التنفيذ الفعلي</span>
                  </div>

                  {/* Bottom Right: Location Badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-[#1c1917] bg-white/95 px-3 py-1.5 rounded-xl border border-[#c87a3e]/30 backdrop-blur-md shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-[#a85a22]" />
                    <span>{item.location}</span>
                  </div>

                  {/* Bottom Left: Expand icon overlay */}
                  <div className="absolute bottom-4 left-4 copper-btn-gradient text-white p-2.5 rounded-xl opacity-95 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                    <Maximize2 className="w-4 h-4 stroke-[2.3]" />
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-5 sm:p-6 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-[#1c1917] text-base sm:text-lg group-hover:text-[#a85a22] transition-colors leading-snug flex-1">
                      {item.title}
                    </h3>
                    {typeof item.price === 'number' && item.price > 0 && (
                      <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl shrink-0 shadow-xs">
                        {item.price} ج.م
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#57534e] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#57534e]">
                      <Layers className="w-3.5 h-3.5 text-[#a85a22] shrink-0" />
                      <span className="truncate">{item.paintUsed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#a85a22] font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#a85a22] shrink-0" />
                      <span className="font-mono">كود الخامة / اللون: {item.colorCode}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] sm:text-xs text-[#a85a22] group-hover:underline font-bold flex items-center gap-1 shrink-0">
                      <span className="hidden sm:inline">انقر لتكبير الصورة</span>
                      <span className="sm:hidden">التفاصيل</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareTargetItem(item);
                        }}
                        aria-label={`مشاركة مشروع ${item.title}`}
                        title="مشاركة رابط المشروع عبر تطبيقات المراسلة"
                        className="px-3 py-2 rounded-xl bg-white hover:bg-[#faf5f0] text-[#57534e] hover:text-[#a85a22] font-bold border border-neutral-200 hover:border-[#c87a3e]/40 transition-all text-xs cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#a85a22]" />
                        <span>مشاركة</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToContactWithProject(item.title);
                        }}
                        className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#faf5f0] hover:bg-[#c87a3e] text-[#a85a22] hover:text-white font-bold border border-[#c87a3e]/30 transition-all text-xs cursor-pointer shadow-sm"
                      >
                        طلب تنفيذ مماثل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Lightbox / Modal Zoom with Large View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border-2 border-[#c87a3e]/50 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-[#faf5f0] flex items-center justify-between border-b border-[#c87a3e]/25">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-white copper-btn-gradient px-3 py-1 rounded-full shadow-sm">
                  {selectedItem.categoryName}
                </span>
                <span className="text-xs text-[#57534e] font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#a85a22]" />
                  {selectedItem.location}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-[#57534e] hover:text-[#1c1917] rounded-full bg-white border border-[#c87a3e]/30 transition-colors cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Resolution Big Photo View - object-cover with zoom to fill the frame completely without any black lines */}
            <div className="relative h-[50vh] sm:h-[62vh] w-full overflow-hidden bg-white border-y border-[#c87a3e]/20 flex items-center justify-center">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center scale-[1.04] transition-transform duration-300"
              />
            </div>

            {/* Modal Details & Action */}
            <div className="p-5 sm:p-6 space-y-4 bg-white">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-[#1c1917]">
                  {selectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#faf5f0] p-4 rounded-2xl border border-[#c87a3e]/25 text-xs">
                <div>
                  <span className="text-[#78716c] block mb-1">الخامة أو نوع الدهان المعتمد:</span>
                  <span className="font-extrabold text-[#1c1917] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a85a22]" />
                    {selectedItem.paintUsed}
                  </span>
                </div>
                <div>
                  <span className="text-[#78716c] block mb-1">كود اللون أو رقم الموديل:</span>
                  <span className="font-extrabold text-[#a85a22] font-mono text-sm">
                    {selectedItem.colorCode}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                {/* WhatsApp Action */}
                <a
                  href={`${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(
                    `مرحباً شركة الرضا، أنا مهتم بتنفيذ مشروع مماثل لـ "${selectedItem.title}" من قسم (${selectedItem.categoryName}) بكود [${selectedItem.colorCode}]، وعايز أعرف التفاصيل والتكلفة التقديرية.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>استفسار واتساب عن هذا المشروع</span>
                </a>

                {/* Book Inspection Action */}
                <button
                  onClick={() => {
                    const title = selectedItem.title;
                    setSelectedItem(null);
                    onNavigateToContactWithProject(title);
                  }}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl copper-btn-gradient text-white font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#c87a3e]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.2]" />
                  <span>طلب معاينة مجانية لهذا الطراز</span>
                </button>

                {/* Share Project Button */}
                <button
                  type="button"
                  onClick={() => setShareTargetItem(selectedItem)}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-[#faf5f0] hover:bg-[#faefe6] border border-[#c87a3e]/35 text-[#a85a22] text-xs font-black cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة الرابط</span>
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-neutral-300 text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf5f0] text-xs font-bold cursor-pointer transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Social Share Modal for Messaging Apps */}
      {shareTargetItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-share-title"
          onClick={() => setShareTargetItem(null)}
          className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl border border-[#c87a3e]/35 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
          >
            <div className="copper-btn-gradient px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 font-black text-sm">
                <Share2 className="w-4 h-4" />
                <span id="portfolio-share-title">مشاركة المشروع عبر تطبيقات المراسلة</span>
              </div>
              <button
                type="button"
                onClick={() => setShareTargetItem(null)}
                aria-label="إغلاق نافذة المشاركة"
                className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-[#faf5f0] p-3 rounded-2xl border border-[#c87a3e]/20">
                <img
                  src={shareTargetItem.imageUrl}
                  alt={shareTargetItem.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#c87a3e]/25"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-sm text-[#1c1917] truncate">
                    {shareTargetItem.title}
                  </h4>
                  <p className="text-[11px] text-[#78716c] truncate">
                    {shareTargetItem.categoryName} • {shareTargetItem.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${getProjectShareText(shareTargetItem)}\n${getProjectShareUrl(shareTargetItem)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1fb858] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب (WhatsApp)</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    getProjectShareUrl(shareTargetItem)
                  )}&text=${encodeURIComponent(getProjectShareText(shareTargetItem))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>تيليجرام (Telegram)</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    getProjectShareUrl(shareTargetItem)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#1465d0] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>فيسبوك (Facebook)</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyProjectLink(shareTargetItem)}
                  className="py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-[#1c1917] border border-neutral-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
                >
                  {copiedProjectId === shareTargetItem.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">تم نسخ الرابط!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#a85a22]" />
                      <span>نسخ رابط المشروع</span>
                    </>
                  )}
                </button>
              </div>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={() => handleNativeShare(shareTargetItem)}
                  className="w-full py-3 px-4 rounded-2xl copper-btn-gradient text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر تطبيقات الجهاز الأخرى</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
