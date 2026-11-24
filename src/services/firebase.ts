/**
 * Firebase Firestore Service for "الرضا للدهانات وديكورات - Abo Reda"
 * Client-facing persistent data service:
 * 1. portfolio: completed paint & decor projects
 * 2. gallery: execution stages photos ("مراحل التنفيذ")
 * 3. prices: paint brand products and bucket pricing
 * 4. orders: inspection booking requests + Telegram notifications
 * 5. calculator_leads: soft-gate calculator leads + Telegram notifications
 * 6. feedback & complaints: customer feedback and complaints
 * 7. analytics/visitorStats: automatic visitor counter on app open
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  getDocFromServer,
  runTransaction,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  PortfolioItem,
  GalleryStageItem,
  PaintBrandOption,
  CustomerOrder,
  CustomerFeedback,
  CalculatorLead,
  CalculatorLeadStatus,
  ReviewItem,
} from '../types';
import { PAINT_COMPANY_OPTIONS } from '../data/paintCompanies';
import { PORTFOLIO_ITEMS } from '../data/companyData';
import { REVIEWS_DATA } from '../data/trustData';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned databaseId (SDK v13 uses fetch streams + auto long-polling detection)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Error Handling Infrastructure per Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore at boot time
 */
export async function testFirestoreConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      connected: false,
      message: 'الجهاز غير متصل بالإنترنت حالياً.',
    };
  }

  try {
    const testDocRef = doc(db, 'portfolio', 'connection_test');
    await getDocFromServer(testDocRef);
    return {
      connected: true,
      message: 'تم الاتصال بقاعدة بيانات Firebase Firestore بنجاح',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    if (
      msg.includes('the client is offline') ||
      msg.includes('could not reach cloud firestore backend') ||
      msg.includes('unavailable') ||
      msg.includes('timeout')
    ) {
      console.warn('Firestore offline / standby mode:', error instanceof Error ? error.message : error);
      return {
        connected: false,
        message: 'Firebase يعمل بنمط عدم الاتصال أو التخزين المؤقت.',
      };
    }
    return {
      connected: true,
      message: 'تم الاتصال بقاعدة بيانات Firebase بنجاح.',
    };
  }
}

/**
 * 1. PORTFOLIO (معرض الأعمال)
 */
export async function fetchPortfolioFromFirestore(): Promise<{
  success: boolean;
  data: PortfolioItem[];
  isFromFirestore: boolean;
  error?: unknown;
}> {
  const collectionPath = 'portfolio';
  try {
    const colRef = collection(db, collectionPath);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const items: PortfolioItem[] = [];
      snap.forEach((d) => {
        const val = d.data();
        if (val.title && val.imageUrl) {
          items.push({
            id: d.id,
            title: val.title,
            category: val.category || 'paints',
            categories: val.categories || [val.category || 'paints'],
            categoryName: val.categoryName || 'تشطيبات',
            location: val.location || 'الرضا للدهانات والديكور الحديث',
            imageUrl: val.imageUrl,
            paintUsed: val.paintUsed || 'تشطيب فندقي معتمد وخامات عالية الجودة',
            colorCode: val.colorCode || 'تنفيذ الرضا',
            description: val.description || val.title,
            price: typeof val.price === 'number' ? val.price : undefined,
            storageSource: val.storageSource,
          });
        }
      });

      if (items.length > 0) {
        return {
          success: true,
          data: items,
          isFromFirestore: true,
        };
      }
    }

    return {
      success: true,
      data: PORTFOLIO_ITEMS,
      isFromFirestore: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      try {
        handleFirestoreError(err, OperationType.LIST, collectionPath);
      } catch {
        // Logged via handleFirestoreError
      }
    } else {
      console.warn('Failed to fetch portfolio from Firestore:', msg);
    }
    return {
      success: false,
      data: PORTFOLIO_ITEMS,
      isFromFirestore: false,
      error: err,
    };
  }
}

/**
 * 2. EXECUTION STAGES GALLERY (مراحل التنفيذ — مجموعة gallery)
 */
export async function fetchGalleryFromFirestore(): Promise<{
  success: boolean;
  data: GalleryStageItem[];
  isFromFirestore: boolean;
  error?: string;
}> {
  const collectionPath = 'gallery';
  try {
    const colRef = collection(db, collectionPath);
    const snap = await getDocs(colRef);
    const items: GalleryStageItem[] = [];

    if (!snap.empty) {
      snap.forEach((d) => {
        const val = d.data();
        const imageUrl = typeof val.imageUrl === 'string'
          ? val.imageUrl
          : typeof val.image_url === 'string'
          ? val.image_url
          : '';
        if (imageUrl) {
          items.push({
            id: d.id,
            title: typeof val.title === 'string' && val.title.trim() ? val.title : 'مرحلة تنفيذ ميدانية',
            stageName: typeof val.stageName === 'string'
              ? val.stageName
              : typeof val.stage_name === 'string'
              ? val.stage_name
              : undefined,
            description: typeof val.description === 'string' ? val.description : undefined,
            imageUrl,
            order: typeof val.order === 'number' ? val.order : undefined,
            createdAt: typeof val.createdAt === 'string'
              ? val.createdAt
              : typeof val.created_at === 'string'
              ? val.created_at
              : undefined,
          });
        }
      });

      items.sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return {
      success: true,
      data: items,
      isFromFirestore: true,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      try {
        handleFirestoreError(err, OperationType.LIST, collectionPath);
      } catch {
        // Logged cleanly via handleFirestoreError
      }
    } else {
      console.warn('Failed to fetch gallery from Firestore:', msg);
    }
    return {
      success: false,
      data: [],
      isFromFirestore: false,
      error: msg,
    };
  }
}

/**
 * 3. PRICES & PRODUCTS (أسعار وخامات الدهانات)
 */
export async function fetchPricesFromFirestore(): Promise<{
  success: boolean;
  data: PaintBrandOption[];
  isFromFirestore: boolean;
  error?: unknown;
}> {
  const collectionPath = 'prices';
  try {
    const colRef = collection(db, collectionPath);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const list: PaintBrandOption[] = [];
      snap.forEach((d) => {
        const val = d.data();
        if (val.company_name && val.price) {
          list.push({
            id: d.id,
            name: `${val.company_name} ${val.product_name || ''}`.trim(),
            brand: val.company_name,
            price: Number(val.price),
            description: val.description || `سعر البستلة المسجل (${val.company_name})`,
          });
        }
      });

      if (list.length > 0) {
        return {
          success: true,
          data: list,
          isFromFirestore: true,
        };
      }
    }

    return {
      success: true,
      data: PAINT_COMPANY_OPTIONS,
      isFromFirestore: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      try {
        handleFirestoreError(err, OperationType.LIST, collectionPath);
      } catch {
        // Logged cleanly
      }
    } else {
      console.warn('Failed to fetch prices from Firestore:', msg);
    }
    return {
      success: false,
      data: PAINT_COMPANY_OPTIONS,
      isFromFirestore: false,
      error: err,
    };
  }
}

/**
 * 4. COMPLAINTS (الشكاوى والاستفسارات)
 */
export async function submitComplaintToFirestore(
  customerName: string,
  phone: string,
  complaintText: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const docId = `complaint_${Date.now()}`;
  const path = `complaints/${docId}`;
  try {
    const docRef = doc(db, 'complaints', docId);
    const payload = {
      customer_name: customerName,
      phone,
      complaint_text: complaintText,
      created_at: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return { success: true, data: payload };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
    return { success: false, error: msg };
  }
}

/**
 * 5. TELEGRAM NOTIFICATIONS & ORDERS (إشعارات تليجرام وطلبات المعاينة)
 */
const TELEGRAM_BOT_TOKEN = '9056189281:AAGd3tSiqx8fF6BSugrbpXNYpEAzOVTJw3E';
const TELEGRAM_CHAT_ID = '5447662296';

/**
 * Sends a non-blocking background notification to Telegram via Fetch API.
 * Never throws or interrupts Firebase persistence if network/Telegram fails.
 */
async function sendTelegramNotification(
  customerName: string,
  phone: string,
  details: string
): Promise<void> {
  try {
    const cleanName = (customerName || 'عميل').trim();
    const cleanPhone = (phone || 'غير مسجل').trim();
    const cleanDetails = (details || '—').trim();
    const text = `🔔 إشعار جديد من تطبيق الرضا!\nالاسم: ${cleanName}\nرقم الهاتف: ${cleanPhone}\nالتفاصيل: ${cleanDetails}`.slice(0, 4000);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    });
  } catch (telegramError) {
    console.warn('Telegram background notification skipped:', telegramError);
  }
}

/**
 * Creates a new inspection order in Firestore and triggers background Telegram notification
 */
export async function createOrderInFirestore(
  order: Omit<CustomerOrder, 'id'>
): Promise<{ success: boolean; data?: CustomerOrder; error?: string }> {
  const docId = `ord-${Date.now()}`;
  const path = `orders/${docId}`;
  try {
    const docRef = doc(db, 'orders', docId);
    const payload = {
      customer_name: order.customerName,
      phone: order.phone,
      address: order.address || '',
      service_type: order.serviceType,
      total_cost: order.totalCost || 0,
      status: order.status || 'new',
      notes: order.notes || '',
      created_at: order.createdAt || new Date().toISOString(),
      room_specs: order.roomSpecs || null,
    };
    await setDoc(docRef, payload);

    const orderDetails = [
      `طلب معاينة (${order.serviceType})`,
      order.address ? `العنوان: ${order.address}` : '',
      order.totalCost && order.totalCost > 0
        ? `التكلفة التقديرية: ${order.totalCost.toLocaleString('en-US')} ج.م`
        : '',
      order.roomSpecs?.area ? `المساحة: ${order.roomSpecs.area} م²` : '',
      order.notes ? `ملاحظات: ${order.notes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    void sendTelegramNotification(order.customerName, order.phone, orderDetails);

    return {
      success: true,
      data: {
        id: docId,
        ...order,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
    console.error('Error creating order in Firestore:', msg);
    return { success: false, error: msg };
  }
}

/**
 * 6. CUSTOMER FEEDBACK (الشكاوى والاقتراحات)
 */
export async function createFeedbackInFirestore(
  feedback: Omit<CustomerFeedback, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; data?: CustomerFeedback; error?: string }> {
  const docId = `fb-${Date.now()}`;
  const now = new Date().toISOString();
  const path = `feedback/${docId}`;
  try {
    const docRef = doc(db, 'feedback', docId);
    const payload = {
      name: feedback.name.trim(),
      phone: feedback.phone.trim(),
      type: feedback.type,
      message: feedback.message.trim(),
      status: 'new',
      created_at: now,
    };
    await setDoc(docRef, payload);
    return {
      success: true,
      data: {
        id: docId,
        name: feedback.name,
        phone: feedback.phone,
        type: feedback.type,
        message: feedback.message,
        status: 'new',
        createdAt: now,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
    console.error('Error creating feedback in Firestore:', msg);
    return { success: false, error: msg };
  }
}

/**
 * 7. SITE VISITOR COUNTER (`analytics/visitorStats`)
 */
export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  updatedAt: string;
}

const SESSION_VISIT_KEY = 'alreda_visit_recorded_v1';
const UNIQUE_VISITOR_KEY = 'alreda_unique_visitor_v1';

/**
 * Increments the visitor counter atomically in Firestore (`analytics/visitorStats`) once per session.
 */
export async function trackVisitorInFirestore(): Promise<{
  success: boolean;
  stats?: VisitorStats;
}> {
  const path = 'analytics/visitorStats';
  try {
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_VISIT_KEY)) {
      return { success: true };
    }

    const isNewUniqueVisitor =
      typeof window !== 'undefined' ? !window.localStorage.getItem(UNIQUE_VISITOR_KEY) : false;

    const statsRef = doc(db, 'analytics', 'visitorStats');
    const updatedStats = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(statsRef);
      const data = snap.exists() ? snap.data() : null;
      const currentTotal =
        data && typeof data.totalVisits === 'number' ? Math.max(0, Math.floor(data.totalVisits)) : 0;
      const currentUnique =
        data && typeof data.uniqueVisitors === 'number'
          ? Math.max(0, Math.floor(data.uniqueVisitors))
          : 0;

      const payload: VisitorStats = {
        totalVisits: currentTotal + 1,
        uniqueVisitors: currentUnique + (isNewUniqueVisitor ? 1 : 0),
        updatedAt: new Date().toISOString(),
      };

      transaction.set(statsRef, payload);
      return payload;
    });

    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SESSION_VISIT_KEY, '1');
        if (isNewUniqueVisitor) {
          window.localStorage.setItem(UNIQUE_VISITOR_KEY, '1');
        }
      } catch {
        // Ignore storage restrictions
      }
    }

    return { success: true, stats: updatedStats };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      try {
        handleFirestoreError(err, OperationType.WRITE, path);
      } catch {
        // Logged via handleFirestoreError; do not disrupt customer experience
      }
    } else {
      console.warn('Visitor tracking skipped:', msg);
    }
    return { success: false };
  }
}

/**
 * 8. CALCULATOR SOFT-GATE LEADS (`calculator_leads` collection)
 */
export async function createCalculatorLeadInFirestore(
  lead: Omit<CalculatorLead, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; data?: CalculatorLead; error?: string }> {
  const docId = `lead-${Date.now()}`;
  const now = new Date().toISOString();
  const path = `calculator_leads/${docId}`;
  const cleanName = (lead.name.trim() || 'عميل الحاسبة').slice(0, 150);
  const cleanPhone = lead.phone.trim().slice(0, 30);

  const payload = {
    name: cleanName,
    phone: cleanPhone,
    total_area: Number(lead.totalArea) || 0,
    ceiling_area: Number(lead.ceilingArea) || 0,
    walls_area: Number(lead.wallsArea) || 0,
    rooms_count: Math.max(0, Math.floor(lead.roomsCount)),
    receptions_count: Math.max(0, Math.floor(lead.receptionsCount)),
    corridors_count: Math.max(0, Math.floor(lead.corridorsCount)),
    dimensions_summary: lead.dimensionsSummary.slice(0, 1500),
    materials_summary: lead.materialsSummary.slice(0, 2000),
    status: 'new' as CalculatorLeadStatus,
    created_at: now,
  };

  try {
    await setDoc(doc(db, 'calculator_leads', docId), payload);

    const leadDetails = [
      `حاسبة المواد — الإجمالي: ${payload.total_area} م² (حوائط: ${payload.walls_area} م²، سقف: ${payload.ceiling_area} م²)`,
      payload.dimensions_summary ? `المقاسات: ${payload.dimensions_summary}` : '',
      payload.materials_summary ? `الكميات: ${payload.materials_summary}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    void sendTelegramNotification(cleanName, cleanPhone, leadDetails);

    return {
      success: true,
      data: {
        id: docId,
        name: cleanName,
        phone: cleanPhone,
        totalArea: payload.total_area,
        ceilingArea: payload.ceiling_area,
        wallsArea: payload.walls_area,
        roomsCount: payload.rooms_count,
        receptionsCount: payload.receptions_count,
        corridorsCount: payload.corridors_count,
        dimensionsSummary: payload.dimensions_summary,
        materialsSummary: payload.materials_summary,
        status: 'new',
        createdAt: now,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
    console.error('Error creating calculator lead in Firestore:', msg);
    return { success: false, error: msg };
  }
}

/**
 * 9. CUSTOMER REVIEWS (`reviews` collection - immutable public reviews)
 */
function formatReviewDateArabic(isoDate?: string): string {
  if (!isoDate) return 'تقييم موثق';
  const parsedTime = new Date(isoDate).getTime();
  if (Number.isNaN(parsedTime)) return 'تقييم موثق';

  const diffMs = Date.now() - parsedTime;
  if (diffMs < 2 * 60 * 1000) return 'الآن';

  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `منذ ${diffDays} يوم`;

  return new Date(parsedTime).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export async function fetchReviewsFromFirestore(): Promise<{
  success: boolean;
  data: ReviewItem[];
  isFromFirestore: boolean;
  error?: string;
}> {
  const collectionPath = 'reviews';
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const firestoreReviews: Array<{ item: ReviewItem; timestamp: number }> = [];

    if (!snap.empty) {
      snap.forEach((d) => {
        const val = d.data();
        const name = typeof val.name === 'string' ? val.name.trim() : '';
        const comment = typeof val.comment === 'string' ? val.comment.trim() : '';
        if (!name || !comment) return;

        const rawRating = typeof val.rating === 'number' ? val.rating : 5;
        const rating = Math.min(5, Math.max(1, Math.round(rawRating)));
        const createdAtRaw =
          typeof val.created_at === 'string'
            ? val.created_at
            : typeof val.createdAt === 'string'
            ? val.createdAt
            : '';
        const timestamp = createdAtRaw ? new Date(createdAtRaw).getTime() || 0 : 0;

        firestoreReviews.push({
          timestamp,
          item: {
            id: d.id,
            name,
            role: 'عميل معتمد',
            project:
              typeof val.project === 'string' && val.project.trim()
                ? val.project.trim()
                : 'تشطيب دهانات سكنية',
            location:
              typeof val.location === 'string' && val.location.trim()
                ? val.location.trim()
                : 'القاهرة',
            rating,
            comment,
            date: formatReviewDateArabic(createdAtRaw),
            verified: true,
            avatarColor: 'from-[#c87a3e] to-[#944616]',
          },
        });
      });

      firestoreReviews.sort((a, b) => b.timestamp - a.timestamp);
    }

    const mapped = firestoreReviews.map((entry) => entry.item);
    return {
      success: true,
      data: [...mapped, ...REVIEWS_DATA],
      isFromFirestore: mapped.length > 0,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      try {
        handleFirestoreError(err, OperationType.LIST, collectionPath);
      } catch {
        // Logged via handleFirestoreError
      }
    } else {
      console.warn('Failed to fetch reviews from Firestore:', msg);
    }
    return {
      success: false,
      data: REVIEWS_DATA,
      isFromFirestore: false,
      error: msg,
    };
  }
}

export async function createReviewInFirestore(review: {
  name: string;
  comment: string;
  rating?: number;
  project?: string;
  location?: string;
}): Promise<{ success: boolean; data?: ReviewItem; error?: string }> {
  const docId = `rev-${Date.now()}`;
  const path = `reviews/${docId}`;
  const now = new Date().toISOString();

  const cleanName = review.name.trim().slice(0, 150);
  const cleanComment = review.comment.trim().slice(0, 2000);
  const cleanRating = Math.min(5, Math.max(1, Math.round(Number(review.rating ?? 5) || 5)));
  const cleanProject =
    (review.project || '').trim().slice(0, 150) || 'تشطيب دهانات سكنية';
  const cleanLocation = (review.location || '').trim().slice(0, 100) || 'القاهرة';

  if (!cleanName || !cleanComment) {
    return { success: false, error: 'الاسم ونص التقييم مطلوبان' };
  }

  const payload = {
    name: cleanName,
    comment: cleanComment,
    rating: cleanRating,
    project: cleanProject,
    location: cleanLocation,
    created_at: now,
  };

  try {
    await setDoc(doc(db, 'reviews', docId), payload);
    return {
      success: true,
      data: {
        id: docId,
        name: cleanName,
        role: 'عميل معتمد',
        project: cleanProject,
        location: cleanLocation,
        rating: cleanRating,
        comment: cleanComment,
        date: 'الآن',
        verified: true,
        avatarColor: 'from-[#c87a3e] to-[#944616]',
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
    console.error('Error creating review in Firestore:', msg);
    return { success: false, error: msg };
  }
}
