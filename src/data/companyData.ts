import { PaintTypeOption, PortfolioItem, BeforeAfterItem } from '../types';

export const COMPANY_INFO = {
  name: 'شركة الرضا للدهانات والديكور',
  managementName: 'Al Reda Paints & Decor',
  logoUrl: '/assets/aistudio/logo_alreda.webp',
  tagline: 'رواد تشطيبات الدهانات المعمارية والديكورات العصرية الفاخرة',
  subtext: 'خبرة تزيد عن 15 عاماً في تنفيذ أرقى تشطيبات الفلل، القصور، والشقق السكنية بأعلى معايير الجودة العالمية.',
  phone: '01115134295',
  phoneFormatted: '0111 513 4295',
  whatsappUrl: 'https://wa.me/201115134295',
  facebookUrl: 'https://www.facebook.com/share/19myF656FZ/',
  instagramUrl: 'https://www.instagram.com/el_reda_paints__decorations?rpxt=M2ZqZDB1aHZmaHd2',
  location: 'التجمع الخامس - القاهرة الجديدة | الشيخ زايد',
  stats: [
    { value: '+750', label: 'مشروع منجز' },
    { value: '15+', label: 'عاماً من الخبرة' },
    { value: '100%', label: 'ضمان على الأعمال' },
    { value: '5 نجوم', label: 'تقييم العملاء' },
  ],
};

export const PAINT_TYPE_OPTIONS: Record<string, PaintTypeOption> = {
  plastic: {
    id: 'plastic',
    title: 'دهان بلاستيك مائي فاخر (مطفي / نصف لمعة)',
    subtitle: 'أعلى خامات الدهانات المائية القابلة للغسيل (مستوى جوتن وفينوماستيك / كيمي وبوتاماستيك)',
    pricePerUnit: 1450, // سعر بستلة البلاستيك الفاخر 14 لتر
    unitName: 'بستلة (14 لتر)',
    coveragePerUnit: 70, // 14 لتر تغطي حوالي 70 م² لوجهين
    description: 'دهان عالي التغطية مقاوم للبقع ومضاد للبكتيريا يعطي ملمساً حريرياً ناعماً ومظهراً فخماً يدوم لسنوات.',
  },
  putty: {
    id: 'putty',
    title: 'معجون حوائط تأسيس (شكاير جاهزة)',
    subtitle: 'معجون بوليمري فائق النعومة لملء المسام وتسوية الحوائط تماماً قبل الدهان',
    pricePerUnit: 280, // سعر الشيكارة 15 كجم
    unitName: 'شيكارة معجون (15 كجم)',
    coveragePerUnit: 18, // شيكارة المعجون تغطي حوالي 18 م² لوجهين
    description: 'أساس ناعم وقوي يمنع التشققات والشروخ الشعرية ويضمن ثبات ونقاء طبقات الدهان النهائية.',
  },
  sealer: {
    id: 'sealer',
    title: 'سيلر مائي عازل ومثبت للياسة (برايمر)',
    subtitle: 'طبقة التأسيس الأولى المقاومة للرطوبة والأملاح لضمان التصاق تام للمعجون',
    pricePerUnit: 680, // بستلة سيلر مائي
    unitName: 'بستلة سيلر (14 لتر)',
    coveragePerUnit: 120, // السيلر وجه واحد يغطي مساحة كبيرة
    description: 'يحمي الجدران من النشع والرطوبة ويقلل استهلاك الدهانات اللاحقة بنسبة تصل إلى 25%.',
  },
  full_package: {
    id: 'full_package',
    title: 'الباقة المتكاملة (سيلر + معجون وجهين + دهان بلاستيك وجهين)',
    subtitle: 'التوليفة الاحترافية الكاملة الموصى بها من خبراء الديكور لتأسيس وتشطيب الغرفة بالكامل',
    pricePerUnit: 2410, // تكلفة الخامات المتكاملة لكل وحدة مساحة
    unitName: 'مجموعة خامات تأسيس وتشطيب',
    coveragePerUnit: 70,
    description: 'تشمل سيلر مائي + معجون تسوية عالي النعومة + دهان بلاستيك مائي فاخر فائق الجودة بألوان عصرية.',
  },
};

export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    title: 'تجديد صالون فاخر - فيلا النرجس التجمع',
    roomType: 'صالون واستقبال كلاسيك مودرن',
    location: 'التجمع الخامس',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    description: 'تم معالجة الشروخ القديمة وتطبيق سيلر مقاوم للرطوبة ثم وجهين معجون وتسوية كاملة، مع دهان نصف لمعة عاجي وأوف وايت مع إضاءات ليد مخفية وبانوهات كلاسيكية راقية.',
    highlights: ['معالجة رطوبة الجدران', 'دهان حريري مقاوم للغسيل', 'بانوهات فيوتك مذهبة'],
  },
  {
    id: 'ba-2',
    title: 'غرفة نوم ماستر فندقية - كمبوند بالم هيلز',
    roomType: 'جناح نوم رئيسي',
    location: 'الشيخ زايد',
    beforeImg: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    description: 'تحويل جدران خرسانية تقليدية إلى جناح فندقي فخم بدهانات مطفية دافئة بلون كشمير ورمادي دافئ مع جدار ديكوري ستوكو إيطالي خلف السرير.',
    highlights: ['دهان مطفي مخملي', 'جدار ستوكو إيطالي', 'تناسق ألوان مهدئ للأعصاب'],
  },
  {
    id: 'ba-3',
    title: 'ريسبشن مفتوح مع بديل خشب ورخام - مدينتي',
    roomType: 'صالة معيشة واستقبال عصرية',
    location: 'مدينتي',
    beforeImg: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: 'تشطيب كامل من الصفر مع تأسيس 3 أوجه معجون حريري، ودهان أوف وايت لؤلؤي مع دمج تكسيات بديل الخشب الإسباني وبديل الرخام المضاء.',
    highlights: ['تأسيس ميكانيكي بالليزر', 'أوف وايت لؤلؤي', 'تنسيق ديكوري متكامل'],
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // 1. صورة الشيبورد (تنفيذ الرضا للدهانات والديكورات)
  {
    id: 'chipboard-reda-cropped-2026',
    title: 'شيبورد - تنفيذ الرضا للدهانات والديكورات',
    category: 'chipboard',
    categories: ['chipboard'],
    categoryName: 'شيبورد',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: '/assets/portfolio/chipboard_reda.webp',
    paintUsed: 'ألواح وتجاليد شيبورد و MDF فاخرة معالجة بأعلى دقة',
    colorCode: 'شيبورد - تنفيذ الرضا',
    description: 'شيبورد - تنفيذ الرضا للدهانات والديكورات',
  },
  // 2. صورة الريسبشن (تنفيذ الرضا للدهانات والديكورات)
  {
    id: 'paint-reception-reda-real-2026',
    title: 'ريسبشن - تنفيذ الرضا للدهانات والديكورات',
    category: 'paints',
    categories: ['paints'],
    categoryName: 'دهانات',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/23Qkzysj/FB-IMG-1787523728081.jpg',
    paintUsed: 'دهان جوتن فاخر تشطيب ريسبشن راقي وديكورات حديثة',
    colorCode: 'تشطيب ريسبشن - الرضا',
    description: 'ريسبشن - تنفيذ الرضا للدهانات والديكورات',
  },
  // 3. شغل بديل خشب ورخام - الرضا
  {
    id: 'wood-marble-combo-reda-1',
    title: 'شغل بديل خشب ورخام - الرضا',
    category: 'wood_alternative',
    categories: ['wood_alternative', 'marble_alternative'],
    categoryName: 'بديل خشب ورخام',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/hNRrqPW/file-000000008784720c84743871b47e1fe7.jpg',
    paintUsed: 'شرائح بديل خشب تركي مضلع مع تكسيات ألواح بديل رخام إسباني',
    colorCode: 'بديل خشب ورخام مدمج',
    description: 'شغل بديل خشب ورخام - الرضا',
  },
  // 4. ريسبشن بلون البريز
  {
    id: 'paint-reception-breeze-0552',
    title: 'ريسبشن بلون البريز',
    category: 'paints',
    categories: ['paints'],
    categoryName: 'دهانات',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/Zp4V3zNJ/FB-IMG-1787873473975.jpg',
    paintUsed: 'دهان جوتن فينوماستيك - بريز Breeze 0552',
    colorCode: '0552 Breeze',
    description: 'ريسبشن بلون البريز',
  },
  // 5. دهان بلون بريز - تشطيب
  {
    id: 'paint-breeze-finish-0552',
    title: 'دهان بلون بريز - تشطيب',
    category: 'paints',
    categories: ['paints'],
    categoryName: 'دهانات',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/fWDxSQT/FB-IMG-1789421808555.jpg',
    paintUsed: 'دهان جوتن فينوماستيك - بريز Breeze 0552',
    colorCode: '0552 Breeze',
    description: 'دهان بلون بريز - تشطيب',
  },
  // 6. ريسبشن يجمع بين دفء الدهانات وفخامة بديل الخشب والحجر
  {
    id: 'paint-wood-stone-combo-reda',
    title: 'ريسبشن يجمع بين دفء الدهانات وفخامة بديل الخشب والحجر',
    category: 'paints',
    categories: ['paints', 'wood_alternative', 'stone_alternative'],
    categoryName: 'دهانات وبديل خشب وحجر',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/WNtQdHRL/FB-IMG-1787469680067.jpg',
    paintUsed: 'دهان جوتن راقي مع تكسيات بديل خشب WPC وبديل حجر ديكوري',
    colorCode: 'توليفة دهانات وخشب وحجر',
    description: 'ريسبشن يجمع بين دفء الدهانات وفخامة بديل الخشب والحجر',
  },
  // 7. غرفة بلون البريز - كود 0552
  {
    id: 'paint-room-breeze-0552',
    title: 'غرفة بلون البريز - كود 0552',
    category: 'paints',
    categories: ['paints'],
    categoryName: 'دهانات',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/4nJRhnGD/FB-IMG-1787523645389.jpg',
    paintUsed: 'دهان جوتن فينوماستيك - بريز Breeze 0552',
    colorCode: '0552 Breeze',
    description: 'غرفة بلون البريز - كود 0552',
  },
  // 8. شاشة تتحدث عن الجمال والبساطة
  {
    id: 'paint-screen-elegance-reda',
    title: 'شاشة تتحدث عن الجمال والبساطة',
    category: 'paints',
    categories: ['paints'],
    categoryName: 'دهانات',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/Q7BgFDjp/FB-IMG-1781183577954.jpg',
    paintUsed: 'دهان جوتن فاخر بتشطيب ناعم يبرز فخامة وبساطة جدار الشاشة',
    colorCode: 'Jotun Decor Touch',
    description: 'شاشة تتحدث عن الجمال والبساطة',
  },
  // 9. لمسة دفء وأناقة مع بديل الخشب
  {
    id: 'wood-warmth-elegance-reda',
    title: 'لمسة دفء وأناقة مع بديل الخشب',
    category: 'wood_alternative',
    categories: ['wood_alternative'],
    categoryName: 'بديل خشب',
    location: 'الرضا للدهانات والديكور الحديث',
    imageUrl: 'https://i.ibb.co/MxRwFx4w/FB-IMG-1787469646358.jpg',
    paintUsed: 'شرائح بديل خشب تركي ديكوري عالي الجودة مضاد للرطوبة والحرارة',
    colorCode: 'Natural Warm Wood WPC',
    description: 'لمسة دفء وأناقة مع بديل الخشب',
  },
];
