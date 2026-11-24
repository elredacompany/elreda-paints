import { ReviewItem, FaqItem } from '../types';

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'أ. أحمد الشريف',
    role: 'مالك شقة سكنية',
    project: 'تشطيب شقة 180 م² بالكامل',
    location: 'التجمع الخامس - حي النرجس',
    rating: 5,
    comment: 'شغل نظيف جداً ودقيق للغاية! ما شاء الله عليهم التزام كامل بتغطية الأرضيات والأبواب قبل البدء، واستلمت الشقة على المفتاح ونظيفة تماماً. شكراً لفريق وفنيي شركة الرضا.',
    date: 'منذ أسبوعين',
    verified: true,
    avatarColor: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'rev-2',
    name: 'أ. سارة عبد الرحمن',
    role: 'مصممة ديكور',
    project: 'دهانات داخلية فندقية وبانوهات',
    location: 'الشيخ زايد - كمبوند الياسمين',
    rating: 5,
    comment: 'التزام غير عادي في المواعيد وجودة الخامات أصلية 100% معتمدة من جوتن. الفينش النهائي للأوف وايت والستوكو طلع مظبوط بالملي زي ما كنت عايزة بالظبط.',
    date: 'منذ شهر',
    verified: true,
    avatarColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'rev-3',
    name: 'د. محمود توفيق',
    role: 'استشاري جراحة',
    project: 'تجديد دهانات فيلا وديكورات بديل خشب',
    location: 'الشروق - حي الفلل',
    rating: 5,
    comment: 'فريق عمل محترم وصنايعية قمة في الأمانة والذوق. المعاينة تمت في نفس اليوم والأسعار كانت واضحة جداً وبدون أي مصاريف مخفية. أنصح بالتعامل معهم بشدة.',
    date: 'منذ شهر ونصف',
    verified: true,
    avatarColor: 'from-sky-400 to-blue-600',
  },
  {
    id: 'rev-4',
    name: 'أ. طارق القاضي',
    role: 'رجل أعمال',
    project: 'دهانات ريسبشن ومجلس كلاسيك',
    location: 'مدينتي - مجموعة 12',
    rating: 5,
    comment: 'المعجون والصنفرة بالماكينة خلت الحوائط ناعمة كالحرير بدون أي تمويج تحت الإضاءة الليد. شغل فندقي فاخر يستحق كل جنيه.',
    date: 'منذ شهرين',
    verified: true,
    avatarColor: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'rev-5',
    name: 'أ. إبراهيم فؤاد',
    role: 'عميل متميز',
    project: 'تشطيب شقة عريس كاملة مع الأسقف',
    location: 'المعادي الجديدة',
    rating: 5,
    comment: 'استفدت من خصم الـ 10% للشقق الجديدة، والتنفيذ خلص في 10 أيام فقط قبل ميعاد فرحي بأسبوع. احترافية عالية وفريق يتابع يومياً.',
    date: 'منذ 3 أشهر',
    verified: true,
    avatarColor: 'from-amber-500 to-orange-600',
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'كم يستغرق تنفيذ شقة كاملة؟',
    answer: 'من أسبوع إلى أسبوعين حسب المساحة وحالة المحارة، مع التزام تام بالجدول الزمني المحدد في عقد الاتفاق.',
    category: 'المدة والمواعيد',
  },
  {
    id: 'faq-2',
    question: 'هل توفرون المواد الخام؟',
    answer: 'نعم، نوفر أجود أنواع الدهانات (جوتن، GLC، وغيرها) بأسعار الجملة المميزة وفواتير رسمية معتمدة لضمان الخامات الأصلية 100%.',
    category: 'الخامات والأسعار',
  },
  {
    id: 'faq-3',
    question: 'هل يوجد ضمان على الشغل؟',
    answer: 'نعم، نضمن لك جودة التنفيذ وعدم حدوث أي تشققات أو تقشير في الدهانات، ونلتزم فوراً بأي ملاحظات مجاناً بعد التسليم.',
    category: 'الضمان والجودة',
  },
  {
    id: 'faq-4',
    question: 'هل المعاينة ورفع المقاسات مجانية؟',
    answer: 'نعم، المعاينة المجانية وزيارة الموقع وحساب الأمتار وتقديم المقايسة التقديرية مجانية تماماً داخل القاهرة والجيزة وبدون أي إلزام بالتعاقد.',
    category: 'المعاينة',
  },
  {
    id: 'faq-5',
    question: 'كيف تحافظون على نظافة الأرضيات والشبابيك أثناء العمل؟',
    answer: 'نقوم بتغطية كاملة وشاملة لجميع الأرضيات بالسيراميك أو الباركيه والشبابيك ومفاتيح الكهرباء بأغطية بلاستيكية وشريط عازل قبل البدء، ونسلمك المكان نظيفاً بعد إنهاء العمل.',
    category: 'الضمان والجودة',
  },
  {
    id: 'faq-6',
    question: 'هل تساعدون في اختيار وتنسيق درجات الألوان؟',
    answer: 'بكل تأكيد، يرافقك الفني المختص مع كتالوجات جوتن الحية، ونقوم بتنفيذ عينات ألوان تجريبية على الحائط لرؤيتها تحت إضاءة الغرفة قبل البدء في الدهان الكامل.',
    category: 'الألوان والديكور',
  },
];

export interface WorkStepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export const WORK_STEPS_DATA: WorkStepItem[] = [
  {
    number: '01',
    title: 'معاينة مجانية',
    subtitle: 'زيارة الموقع ورفع المقاسات مجاناً',
    description: 'نصل إليك في القاهرة الكبرى لمعاينة الحوائط، رفع المقاسات بدقة، وعرض عينات ألوان جوتن والديكورات مجاناً.',
    iconName: 'PhoneCall',
  },
  {
    number: '02',
    title: 'عرض سعر',
    subtitle: 'مقايسة تفصيلية وعقد رسمي',
    description: 'نقدم لك مقايسة واضحة بجميع بنود الخامات والتنفيذ وجدولاً زمنياً محدداً مع عقد رسمي يضمن حقوقك.',
    iconName: 'FileCheck',
  },
  {
    number: '03',
    title: 'تنفيذ وتسليم',
    subtitle: 'خامات أصلية وإشراف هندسي بالضمان',
    description: 'تنفيذ احترافي مع حماية كاملة للأرضيات والأثاث، والتسليم على المفتاح في الموعد المحدد بضمان شامل.',
    iconName: 'ShieldCheck',
  },
];

export interface BeforeAfterTransformation {
  id: string;
  title: string;
  roomType: string;
  location: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  paintCode: string;
}

export const BEFORE_AFTER_DATA: BeforeAfterTransformation[] = [
  {
    id: 'ba-1',
    title: 'ريسبشن مودرن بلون البريز 0552 وبديل الخشب',
    roomType: 'ريسبشن وصالون',
    location: 'التجمع الخامس - كمبوند ميفيدا',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    afterImg: 'https://i.ibb.co/Zp4V3zNJ/FB-IMG-1787873473975.jpg',
    description: 'تحويل شامل من محارة متهالكة إلى ريسبشن فندقي فاخر بلون البريز 0552 من جوتن مع تجاليد بديل الخشب المعالج.',
    paintCode: 'جوتن بريز 0552',
  },
  {
    id: 'ba-2',
    title: 'ديكور شاشة وبديل رخام وحجر',
    roomType: 'حائط الشاشة بالمعيشة',
    location: 'الشروق - حي الفلل',
    beforeImg: 'https://images.unsplash.com/photo-1502005229762-ee1b2b85e089?w=800&auto=format&fit=crop&q=80',
    afterImg: 'https://i.ibb.co/hNRrqPW/file-000000008784720c84743871b47e1fe7.jpg',
    description: 'تصميم وتنفيذ جدارية شاشة تلفزيون تدمج بين فخامة بديل الرخام اللامع ودفء شرائح بديل الخشب مع ليد بروفايل مخفي.',
    paintCode: 'بديل رخام + خشب',
  },
  {
    id: 'ba-3',
    title: 'غرفة نوم رئيسية مهدئة للأعصاب',
    roomType: 'غرفة نوم Master',
    location: 'الشيخ زايد',
    beforeImg: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80',
    afterImg: 'https://i.ibb.co/4nJRhnGD/FB-IMG-1787523645389.jpg',
    description: 'تأسيس 3 أوجه معجون مع صنفرة ميكانيكية ودهان أوف وايت حريري مع بانو كلاسيكي ناعم خلف السرير.',
    paintCode: 'جوتن فينوماستيك حرير',
  },
];

