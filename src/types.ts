export type Screen =
  | 'home'
  | 'calculator'
  | 'contact'
  | 'portfolio'
  | 'jotun_colors'
  | 'customer_service'
  | 'smart_advisor'
  | 'feedback'
  | 'about'
  | 'reviews'
  | 'faq'
  | 'terms';

export interface BannerOffer {
  badge: string;
  title: string;
  subtitle: string;
  discountPercent?: number;
}

export interface MaterialPrices {
  plasticPrice: number;
  puttyPrice: number;
  sealerPrice: number;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  project: string;
  location: string;
  rating: number; // 5
  comment: string;
  date: string;
  verified: boolean;
  avatarColor?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface JotunColor {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  hex: string;
  imageUrl?: string;
  localImage?: string;
  cleanImage?: string;
  hexHalf?: string; // كود نصف الصبغة (Half Tint)
  category?: 'trending' | '2026' | '2027' | 'beige' | string;
  categoryLabel?: string;
  description?: string;
  textColor?: 'dark' | 'light';
  isBeige?: boolean;
}

export interface PaintBrandOption {
  id: string;
  name: string;
  brand: string;
  price: number;
  description?: string;
  stage?: 'foundation' | 'finishing';
}

export type PaintType = 'plastic' | 'putty' | 'sealer' | 'full_package';

export interface PaintTypeOption {
  id: PaintType;
  title: string;
  subtitle: string;
  pricePerUnit: number; // سعر الوحدة بالجنيه
  unitName: string; // بستلة 14 لتر، شيكارة 15 كجم، بستلة سيلر
  coveragePerUnit: number; // كم متر مربع تغطي الوحدة
  description: string;
}

export interface CalculationResult {
  length: number;
  width: number;
  height: number;
  perimeter: number;
  grossWallArea: number;
  openingsArea?: number;
  doorsWindowsDeduction?: number;
  includeCeiling?: boolean;
  ceilingArea?: number;
  netArea: number; // المساحة الصافية الإجمالية
  selectedBrand?: PaintBrandOption;
  // الكميات المطلوبة
  plasticBucketsExact: number;
  plasticBuckets: number;
  plasticPriceUnit: number;
  plasticCost: number;
  puttyBagsExact: number;
  puttyBags: number;
  puttyPriceUnit: number;
  puttyCost: number;
  sealerGallonsExact: number;
  sealerGallons: number;
  sealerPriceUnit: number;
  sealerCost: number;
  totalMaterialCost: number;
  selectedColorName?: string;
  selectedColorCode?: string;
  roomImagePreview?: string | null;
  estimatedMaterialCost?: number;
}

export type PortfolioCategory =
  | 'all'
  | 'paints'
  | 'wood_alternative'
  | 'marble_alternative'
  | 'stone_alternative'
  | 'chipboard'
  | string;

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'paints' | 'wood_alternative' | 'marble_alternative' | 'stone_alternative' | 'chipboard' | string;
  categories?: string[];
  categoryName: string;
  location: string;
  imageUrl: string;
  paintUsed: string; // الخامات أو الدهانات المستخدمة
  colorCode: string; // كود اللون أو الموديل
  description: string;
  price?: number;
  storageSource?: 'firebase_storage' | 'base64' | string;
}

export interface GalleryStageItem {
  id: string;
  title: string;
  stageName?: string;
  description?: string;
  imageUrl: string;
  order?: number;
  createdAt?: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  roomType: string;
  location: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  highlights: string[];
}

export interface InspectionRequest {
  id: string;
  clientName: string;
  phone: string;
  address: string;
  serviceType: string;
  preferredDate?: string;
  notes?: string;
  roomSpecs?: {
    area: number;
    estimatedMaterialCost?: number;
    paintType?: string;
  };
  createdAt: number;
}

export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export interface CustomerOrder {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  serviceType: string;
  totalCost?: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  roomSpecs?: {
    area?: number;
    paintType?: string;
  };
}

export type FeedbackType = 'complaint' | 'suggestion';
export type FeedbackStatus = 'new' | 'replied';

export interface CustomerFeedback {
  id: string;
  name: string;
  phone: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt?: string;
}

export type CalculatorLeadStatus = 'new' | 'contacted';

export interface CalculatorLead {
  id: string;
  name: string;
  phone: string;
  totalArea: number;
  ceilingArea: number;
  wallsArea: number;
  roomsCount: number;
  receptionsCount: number;
  corridorsCount: number;
  dimensionsSummary: string;
  materialsSummary: string;
  status: CalculatorLeadStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerComplaint {
  id: string;
  clientName: string;
  phone: string;
  details: string;
  createdAt: number;
}

export interface OpeningItem {
  id: string;
  name: string;
  type: 'door' | 'window' | 'custom';
  width: number;
  height: number;
  count: number;
}

export interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  includeCeiling: boolean;
  openings: OpeningItem[];
  paintType?: string;
  paintColorName?: string;
  notes?: string;
  createdAt: number;
}

export interface MaterialSettings {
  coatsCount: number;
  coveragePerLiter: number;
  bucketCapacityLiters: number;
  pricePerMeter: number;
  currency: string;
  includePrimer: boolean;
  includePutty: boolean;
}

export interface Project {
  id: string;
  name: string;
  clientPhone?: string;
  location?: string;
  rooms: Room[];
  materialSettings: MaterialSettings;
  createdAt: number;
  updatedAt: number;
}

export interface SupabasePrice {
  id?: number;
  company_name: string;
  product_name: string;
  price: number;
}

export interface SupabasePortfolio {
  id?: number;
  image_url: string;
  category: string;
}

export interface SupabaseComplaint {
  id?: number;
  customer_name: string;
  phone: string;
  complaint_text: string;
  created_at?: string;
}

export interface SupabaseCompanyCoverage {
  id?: number;
  company_name: string;
  coverage_per_bucket: number;
}

