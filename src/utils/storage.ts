import { Project, Room, MaterialSettings } from '../types';

const STORAGE_KEY = 'painter_contractor_project_v1';

export const DEFAULT_MATERIAL_SETTINGS: MaterialSettings = {
  coatsCount: 2,
  coveragePerLiter: 10,
  bucketCapacityLiters: 14,
  pricePerMeter: 35,
  currency: 'ج.م',
  includePrimer: true,
  includePutty: true,
};

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'sample-room-1',
    name: 'صالة الاستقبال والصالون',
    length: 6.0,
    width: 4.5,
    height: 2.8,
    includeCeiling: true,
    paintType: 'نصف لمعة',
    paintColorName: 'أوف وايت كريمي (Off-White)',
    notes: 'حائط الشاشة مميز بدهان ديكوري',
    createdAt: Date.now() - 3600000 * 4,
    openings: [
      {
        id: 'op-1',
        name: 'باب الشقة الرئيسي',
        type: 'door',
        width: 1.0,
        height: 2.1,
        count: 1,
      },
      {
        id: 'op-2',
        name: 'شباك بلكونة كبير',
        type: 'door',
        width: 1.8,
        height: 2.2,
        count: 1,
      },
      {
        id: 'op-3',
        name: 'شباك صالة',
        type: 'window',
        width: 1.5,
        height: 1.2,
        count: 1,
      },
    ],
  },
  {
    id: 'sample-room-2',
    name: 'غرفة النوم الرئيسية (ماستر)',
    length: 4.2,
    width: 3.8,
    height: 2.8,
    includeCeiling: false,
    paintType: 'مطفي فاخر',
    paintColorName: 'رمادي دافئ (Warm Grey)',
    notes: 'معجون وجهين مع صنفرة بالماكينة',
    createdAt: Date.now() - 3600000 * 2,
    openings: [
      {
        id: 'op-4',
        name: 'باب الغرفة',
        type: 'door',
        width: 0.9,
        height: 2.1,
        count: 1,
      },
      {
        id: 'op-5',
        name: 'شباك الغرفة',
        type: 'window',
        width: 1.2,
        height: 1.2,
        count: 1,
      },
    ],
  },
  {
    id: 'sample-room-3',
    name: 'غرفة الأطفال',
    length: 3.5,
    width: 3.2,
    height: 2.8,
    includeCeiling: true,
    paintType: 'نصف لمعة قابل للغسيل',
    paintColorName: 'بيج باستيل هادئ',
    notes: '',
    createdAt: Date.now() - 3600000,
    openings: [
      {
        id: 'op-6',
        name: 'باب الغرفة',
        type: 'door',
        width: 0.9,
        height: 2.1,
        count: 1,
      },
      {
        id: 'op-7',
        name: 'شباك ألوميتال',
        type: 'window',
        width: 1.2,
        height: 1.2,
        count: 1,
      },
    ],
  },
];

export function getInitialProject(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.rooms)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved project from localStorage', e);
  }

  // افتراضياً مشروع جديد به عينات توضيحية لتسهيل الفهم الفوري للمقاول
  return {
    id: 'proj-' + Date.now(),
    name: 'شقة العميل - تشطيب دهانات كامل',
    clientPhone: '010XXXXXXXX',
    location: 'مدينة نصر - القاهرة',
    rooms: SAMPLE_ROOMS,
    materialSettings: DEFAULT_MATERIAL_SETTINGS,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function saveProjectToStorage(project: Project): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (e) {
    console.error('Failed to save project to localStorage', e);
  }
}

export function clearProjectRooms(project: Project): Project {
  const updated: Project = {
    ...project,
    rooms: [],
    updatedAt: Date.now(),
  };
  saveProjectToStorage(updated);
  return updated;
}
