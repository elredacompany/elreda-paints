import { PaintBrandOption } from '../types';

export interface PaintCompanyInfo {
  id: string;
  name: string;
  fullName: string;
  badge: string;
  description: string;
  coveragePerBucket: number; // عدد الأمتار المربعة التي تغطيها البستلة الواحدة
  products: PaintBrandOption[];
  foundationProducts: PaintBrandOption[];
  finishingProducts: PaintBrandOption[];
}

/**
 * معدلات التغطية الافتراضية للبستلة لكل شركة (بالمتر المربع)
 * - جوتن: 30 متر للبستلة
 * - GLC: 25 متر للبستلة
 * - سايبس: 25 متر للبستلة
 * - باكين: 25 متر للبستلة
 * - الجزيرة: 20 متر للبستلة
 */
export const DEFAULT_COMPANY_COVERAGE: Record<string, number> = {
  'جوتن': 30,
  'jotun': 30,
  'GLC': 25,
  'glc': 25,
  'سايبس': 25,
  'sipes': 25,
  'باكين': 25,
  'pachin': 25,
  'الجزيرة': 20,
  'aljazeera': 20,
};

/**
 * دالة استرجاع معدل التغطية لشركة محددة (مع إمكانية القراءة من خريطة سوبابيس الحية)
 */
export function getCompanyCoverage(
  companyIdOrName: string,
  supabaseCoverageMap?: Record<string, number>
): number {
  if (!companyIdOrName) return 30;

  // 1. فحص خريطة سوبابيس إذا توفرت
  if (supabaseCoverageMap && Object.keys(supabaseCoverageMap).length > 0) {
    if (supabaseCoverageMap[companyIdOrName] !== undefined) {
      return Number(supabaseCoverageMap[companyIdOrName]);
    }
    const target = companyIdOrName.trim().toLowerCase();
    for (const [key, val] of Object.entries(supabaseCoverageMap)) {
      const k = key.trim().toLowerCase();
      if (k === target || k.includes(target) || target.includes(k)) {
        return Number(val);
      }
    }
  }

  // 2. استخدام القيم الافتراضية الدقيقة
  const normalized = companyIdOrName.trim().toLowerCase();
  if (normalized.includes('جوتن') || normalized.includes('jotun')) return 30;
  if (normalized.includes('glc')) return 25;
  if (normalized.includes('سايبس') || normalized.includes('sipes')) return 25;
  if (normalized.includes('باكين') || normalized.includes('pachin')) return 25;
  if (normalized.includes('جزيرة') || normalized.includes('aljazeera') || normalized.includes('al-jazeera')) return 20;

  return DEFAULT_COMPANY_COVERAGE[companyIdOrName] || 30;
}

/**
 * شركات الدهانات الـ 5 المعتمدة مع منتجات التأسيس والتشطيب وأسعارها
 * (جوتن، GLC، باكين، الجزيرة، سايبس)
 */
export const PAINT_COMPANIES: PaintCompanyInfo[] = [
  {
    id: 'jotun',
    name: 'جوتن',
    fullName: 'دهانات جوتن العالمية (Jotun)',
    badge: 'الأعلى طلباً',
    description: 'ماركة عالمية رائدة بتركيبات فينوماستيك وسيتو برايمر الفاخرة وثبات ألوان أسطوري.',
    coveragePerBucket: 30, // 30 متر للبستلة
    finishingProducts: [
      {
        id: 'jotun_mani',
        name: 'جوتن ماني (Jotun Mani)',
        brand: 'جوتن',
        price: 1950,
        description: 'دهان مائي مطفي فاخر عالي التغطية قابل للغسيل والمسح المتكرر.',
        stage: 'finishing',
      },
      {
        id: 'jotun_silk',
        name: 'جوتن حرير (Fenomastic Silk)',
        brand: 'جوتن',
        price: 2150,
        description: 'فينوماستيك حريري نصف لمعة، ملمس ناعم كالحرير وفائق المقاومة للبقع.',
        stage: 'finishing',
      },
      {
        id: 'jotun_pure_matt',
        name: 'جوتن فينوماستيك بيور (Pure Matt)',
        brand: 'جوتن',
        price: 2050,
        description: 'مطفي غني يبرز عمق درجات الألوان بدون أي لمعان مزعج وخالي من الروائح.',
        stage: 'finishing',
      },
    ],
    foundationProducts: [
      {
        id: 'jotun_cito_primer',
        name: 'جوتن سيتو برايمر (سيلر مائي عازل)',
        brand: 'جوتن',
        price: 780,
        description: 'سيلر أساس مائي اختراقي عالي الكفاءة يعزل الرطوبة والأملاح ويقوي المحارة.',
        stage: 'foundation',
      },
      {
        id: 'jotun_putty_extra',
        name: 'جوتن معجون حوائط جاهز (Jotun Putty Extra)',
        brand: 'جوتن',
        price: 420,
        description: 'معجون أكريليك ناعم عالي المرونة لسد المسام والتنعيم الفائق للأسطح قبل الدهان.',
        stage: 'foundation',
      },
      {
        id: 'jotun_undercoat_primer',
        name: 'جوتن بلاستيك بطانة وتأسيس (Jotun Undercoat)',
        brand: 'جوتن',
        price: 1450,
        description: 'بستلة دهان أساس بيضاء عالية الكثافة لتسوية الحوائط وضمان بياض موحد قبل الفنش.',
        stage: 'foundation',
      },
    ],
    get products() {
      return [...this.finishingProducts, ...this.foundationProducts];
    },
  },
  {
    id: 'glc',
    name: 'GLC',
    fullName: 'دهانات جي إل سي (GLC Paints)',
    badge: 'الأكثر انتشاراً',
    description: 'تغطية استثنائية وبياض ناصع مع توازن ممتاز بين الجودة والسعر المناسب.',
    coveragePerBucket: 25, // 25 متر للبستلة
    finishingProducts: [
      {
        id: 'glc_7070',
        name: 'GLC 7070 سوبر دايتون',
        brand: 'GLC',
        price: 1350,
        description: 'سوبر دايتون فاخر بياض ناصع، تغطية عالية جداً ومقاومة ممتازة للاحتكاك.',
        stage: 'finishing',
      },
      {
        id: 'glc_3030',
        name: 'GLC 3030 دايتون',
        brand: 'GLC',
        price: 1100,
        description: 'دايتون اقتصادي عالي الجودة للصالات وغرف المعيشة والنوم.',
        stage: 'finishing',
      },
      {
        id: 'glc_chematone',
        name: 'GLC كيماتون مطفي',
        brand: 'GLC',
        price: 950,
        description: 'بلاستيك مطفي ناصع مثالي لدهان الأسقف والفنش الأنيق غير اللامع.',
        stage: 'finishing',
      },
    ],
    foundationProducts: [
      {
        id: 'glc_sealer_100',
        name: 'GLC سيلر 100 مائي مقاوم للأملاح',
        brand: 'GLC',
        price: 490,
        description: 'سيلر مائي عازل يخترق مسام المحارة ويوفر التصاقاً قوياً لطبقات المعجون.',
        stage: 'foundation',
      },
      {
        id: 'glc_putty_direct',
        name: 'GLC معجون أكريليك دايركت (جاهز)',
        brand: 'GLC',
        price: 340,
        description: 'معجون تشطيب ناعم فائق البياض وسهل الفرد والصنفرة لسكاكين التأسيس.',
        stage: 'foundation',
      },
      {
        id: 'glc_3030_base',
        name: 'GLC 3030 بطانة وتأسيس',
        brand: 'GLC',
        price: 1050,
        description: 'بستلة بلاستيك أبيض بطانة وتأسيس لتغطية المعجون وضبط امتصاص الحائط.',
        stage: 'foundation',
      },
    ],
    get products() {
      return [...this.finishingProducts, ...this.foundationProducts];
    },
  },
  {
    id: 'pachin',
    name: 'باكين',
    fullName: 'دهانات باكين (Pachin)',
    badge: 'عراقة وجودة مصرية',
    description: 'الاسم الكلاسيكي الأقدم في السوق المصري، صلابة فائقة وبياض ناصع يدوم طويلاً.',
    coveragePerBucket: 25, // 25 متر للبستلة
    finishingProducts: [
      {
        id: 'pachin_888',
        name: 'باكين 888 سوبر بلاستيك',
        brand: 'باكين',
        price: 1150,
        description: 'سوبر بلاستيك قابل للغسيل عالي التغطية والتحمل للرطوبة والعوامل الجوية.',
        stage: 'finishing',
      },
      {
        id: 'pachin_777',
        name: 'باكين 777 بلاستيك مطفي',
        brand: 'باكين',
        price: 900,
        description: 'بلاستيك مطفي ناصع البياض للغرف الداخلية بمعدل فرد وتغطية كبير.',
        stage: 'finishing',
      },
      {
        id: 'pachin_ultra_finish',
        name: 'باكين ألترا فينش حريري',
        brand: 'باكين',
        price: 1050,
        description: 'دهان نصف لمعة ناعم وسهل التنظيف لمظهر راقي ومتجدد.',
        stage: 'finishing',
      },
    ],
    foundationProducts: [
      {
        id: 'pachin_sealer_w',
        name: 'باكين سيلر W أساس مائي للمحارة',
        brand: 'باكين',
        price: 420,
        description: 'سيلر مائي عالي الالتصاق لمنع امتصاص الرطوبة والبودرة من المحارة الحديثة.',
        stage: 'foundation',
      },
      {
        id: 'pachin_putty_wall',
        name: 'باكين معجون حوائط جاهز داخلي',
        brand: 'باكين',
        price: 290,
        description: 'معجون تسوية الحوائط ممتاز في ملء الشروخ الدقيقة ومقاوم للتقشير.',
        stage: 'foundation',
      },
      {
        id: 'pachin_chemaplast',
        name: 'باكين كيمابلاست 600 (بطانة وتأسيس)',
        brand: 'باكين',
        price: 780,
        description: 'بلاستيك اقتصادي فائق البياض للتأسيس وضبط درجات الحوائط والأسقف.',
        stage: 'foundation',
      },
    ],
    get products() {
      return [...this.finishingProducts, ...this.foundationProducts];
    },
  },
  {
    id: 'aljazeera',
    name: 'الجزيرة',
    fullName: 'دهانات الجزيرة (Al-Jazeera Paints)',
    badge: 'فخامة وابتكار',
    description: 'دهانات معمارية فاخرة بتقنيات بيئية متقدمة ومقاومة استثنائية لجميع الظروف.',
    coveragePerBucket: 20, // 20 متر للبستلة
    finishingProducts: [
      {
        id: 'jazeera_novel',
        name: 'الجزيرة نوفل (Novel Silk)',
        brand: 'الجزيرة',
        price: 2100,
        description: 'دهان حريري فاخر مقاوم لالتصاق البقع وسهل التنظيف بدون تغير اللون.',
        stage: 'finishing',
      },
      {
        id: 'jazeera_green_new',
        name: 'الجزيرة جرين نيو (صحي وبيئي)',
        brand: 'الجزيرة',
        price: 1750,
        description: 'دهان مائي صحي صديق للبيئة خالي من المركبات العضوية المتطايرة والروائح.',
        stage: 'finishing',
      },
      {
        id: 'jazeera_matt',
        name: 'الجزيرة مات (Matt Finish)',
        brand: 'الجزيرة',
        price: 1500,
        description: 'دهان مطفي فائق الجودة والنعومة يوفر تغطية متجانسة وأنيقة للمساحات الواسعة.',
        stage: 'finishing',
      },
    ],
    foundationProducts: [
      {
        id: 'jazeera_primex',
        name: 'الجزيرة برايمكس (سيلر مائي نفاذ)',
        brand: 'الجزيرة',
        price: 650,
        description: 'سيلر أساس مائي يخترق المحارة ويحمي من الرطوبة والأملاح ويقوي الأسطح.',
        stage: 'foundation',
      },
      {
        id: 'jazeera_ultra_putty',
        name: 'الجزيرة ألترا باتي (معجون حوائط جاهز)',
        brand: 'الجزيرة',
        price: 450,
        description: 'معجون عالي النعومة وسهل الصنفرة يمنح الحوائط ملمساً زجاجياً أملس.',
        stage: 'foundation',
      },
      {
        id: 'jazeera_primer_base',
        name: 'الجزيرة برايمر أساس وبطانة بيضاء',
        brand: 'الجزيرة',
        price: 1350,
        description: 'دهان أساس وبطانة يعزز قوة تغطية ألوان التشطيب النهائية ويوفر الاستهلاك.',
        stage: 'foundation',
      },
    ],
    get products() {
      return [...this.finishingProducts, ...this.foundationProducts];
    },
  },
  {
    id: 'sipes',
    name: 'سايبس',
    fullName: 'دهانات سايبس (Sipes Paints)',
    badge: 'اعتمادية وثقة',
    description: 'خبرة طويلة وجودة معتمدة لدى كبار المقاولين والمهندسين.',
    coveragePerBucket: 25, // 25 متر للبستلة
    finishingProducts: [
      {
        id: 'sipes_700',
        name: 'سايبس 700 سبيشال فائق البياض',
        brand: 'سايبس',
        price: 1450,
        description: 'سبيشال 700 فائق البياض والنعومة، عالي المقاومة للرطوبة والغسيل المتكرر.',
        stage: 'finishing',
      },
      {
        id: 'sipes_coat',
        name: 'سايبس كوت 500 نصف لمعة',
        brand: 'سايبس',
        price: 1100,
        description: 'دهان أملس نصف لمعة عالي الجودة سهل التنظيف ومقاوم للاتساخ.',
        stage: 'finishing',
      },
      {
        id: 'sipes_facade_matt',
        name: 'سايبس مطفي ناصع بريميوم',
        brand: 'سايبس',
        price: 1250,
        description: 'بلاستيك مطفي أنيق ذو قدرة تغطية عالية للجدران الداخلية والأسقف.',
        stage: 'finishing',
      },
    ],
    foundationProducts: [
      {
        id: 'sipes_alkali_sealer',
        name: 'سايبس سيلر مقاوم للقلويات والأملاح',
        brand: 'سايبس',
        price: 520,
        description: 'سيلر أساس مائي عازل للمحارة يمنع التمليح ويضمن ثبات المعجون.',
        stage: 'foundation',
      },
      {
        id: 'sipes_acrylic_putty',
        name: 'سايبس معجون أكريليك ناعم',
        brand: 'سايبس',
        price: 310,
        description: 'معجون جاهز مرن سهل الفرد وسريع الجفاف لسد المسام والتنعيم.',
        stage: 'foundation',
      },
      {
        id: 'sipes_2000',
        name: 'سايبس 2000 تأسيس وبطانة',
        brand: 'سايبس',
        price: 850,
        description: 'بلاستيك لاتكس اقتصادي ممتاز للتأسيس والبطانة ودهانات الأسقف.',
        stage: 'foundation',
      },
    ],
    get products() {
      return [...this.finishingProducts, ...this.foundationProducts];
    },
  },
];

/**
 * القائمة الشاملة لجميع المنتجات للتوافق
 */
export const PAINT_COMPANY_OPTIONS: PaintBrandOption[] = PAINT_COMPANIES.flatMap((c) => c.products);
