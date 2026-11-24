import { Room, OpeningItem, MaterialSettings } from '../types';

/**
 * حساب محيط الغرفة: 2 × (الطول + العرض)
 */
export function calculatePerimeter(length: number, width: number): number {
  if (length <= 0 || width <= 0) return 0;
  return Number((2 * (length + width)).toFixed(2));
}

/**
 * حساب مساحة الحوائط الإجمالية: محيط الغرفة × الارتفاع
 */
export function calculateGrossWallArea(length: number, width: number, height: number): number {
  if (length <= 0 || width <= 0 || height <= 0) return 0;
  const perimeter = 2 * (length + width);
  return Number((perimeter * height).toFixed(2));
}

/**
 * حساب مساحة السقف: الطول × العرض
 */
export function calculateCeilingArea(length: number, width: number): number {
  if (length <= 0 || width <= 0) return 0;
  return Number((length * width).toFixed(2));
}

/**
 * حساب مساحة فتحة واحدة أو مجموعة فتحات مماثلة (طول × عرض × عدد)
 */
export function calculateOpeningArea(opening: OpeningItem): number {
  if (opening.width <= 0 || opening.height <= 0 || opening.count <= 0) return 0;
  return Number((opening.width * opening.height * opening.count).toFixed(2));
}

/**
 * حساب إجمالي مساحة الخصومات (أبواب، شبابيك، فتحات)
 */
export function calculateTotalDeductions(openings: OpeningItem[]): number {
  if (!openings || openings.length === 0) return 0;
  const sum = openings.reduce((acc, curr) => acc + calculateOpeningArea(curr), 0);
  return Number(sum.toFixed(2));
}

/**
 * حساب صافي مساحة الدهان للغرفة:
 * (مساحة الحوائط الإجمالية - مساحة الفتحات) + (مساحة السقف إن وجدت)
 */
export function calculateNetPaintArea(room: Room): number {
  const grossWall = calculateGrossWallArea(room.length, room.width, room.height);
  const deductions = calculateTotalDeductions(room.openings);
  const wallPaintArea = Math.max(0, grossWall - deductions);
  const ceilingArea = room.includeCeiling ? calculateCeilingArea(room.length, room.width) : 0;
  
  return Number((wallPaintArea + ceilingArea).toFixed(2));
}

/**
 * حساب مساحة الحوائط الصافية فقط (بدون السقف)
 */
export function calculateNetWallOnlyArea(room: Room): number {
  const grossWall = calculateGrossWallArea(room.length, room.width, room.height);
  const deductions = calculateTotalDeductions(room.openings);
  return Number(Math.max(0, grossWall - deductions).toFixed(2));
}

/**
 * حساب إجمالي المشروع لعدة غرف
 */
export function calculateProjectTotals(rooms: Room[]) {
  let totalGrossWall = 0;
  let totalDeductions = 0;
  let totalCeiling = 0;
  let totalNetPaintArea = 0;
  let totalDoorsCount = 0;
  let totalWindowsCount = 0;

  rooms.forEach((r) => {
    const gross = calculateGrossWallArea(r.length, r.width, r.height);
    const ded = calculateTotalDeductions(r.openings);
    const ceiling = r.includeCeiling ? calculateCeilingArea(r.length, r.width) : 0;
    const net = calculateNetPaintArea(r);

    totalGrossWall += gross;
    totalDeductions += ded;
    totalCeiling += ceiling;
    totalNetPaintArea += net;

    r.openings.forEach((op) => {
      if (op.type === 'door') totalDoorsCount += op.count;
      else if (op.type === 'window') totalWindowsCount += op.count;
    });
  });

  return {
    totalGrossWall: Number(totalGrossWall.toFixed(2)),
    totalDeductions: Number(totalDeductions.toFixed(2)),
    totalCeiling: Number(totalCeiling.toFixed(2)),
    totalNetPaintArea: Number(totalNetPaintArea.toFixed(2)),
    roomsCount: rooms.length,
    totalDoorsCount,
    totalWindowsCount,
  };
}

/**
 * حساب تقدير كميات الخامات وتكلفتها
 */
export function calculateMaterialEstimates(totalArea: number, settings: MaterialSettings) {
  if (totalArea <= 0) {
    return {
      paintLiters: 0,
      bucketsCount: 0,
      primerLiters: 0,
      primerBuckets: 0,
      puttyBags: 0,
      totalCost: 0,
    };
  }

  // إجمالي الأمتار المطلوبة مضروبة في عدد الأوجه
  const effectiveAreaForPaint = totalArea * (settings.coatsCount || 2);
  // اللترات = المساحة الإجمالية للأوجه ÷ معدل فرد اللتر
  const paintLiters = effectiveAreaForPaint / (settings.coveragePerLiter || 10);
  // عدد البستلات = إجمالي اللترات ÷ سعة البستلة
  const bucketsCount = Math.ceil(paintLiters / (settings.bucketCapacityLiters || 14));

  // سيلر مائي (برايمر): وجه واحد كافي للمتر، معدل فرد ~10م² لكل لتر
  const primerLiters = totalArea / 10;
  const primerBuckets = Math.ceil(primerLiters / (settings.bucketCapacityLiters || 14));

  // معجون حوائط ممتاز: 6 شكاير لكل 70 متر مربع
  const puttyBags = Math.max(1, Math.round((totalArea / 70) * 6));

  // إجمالي التكلفة
  const totalCost = totalArea * (settings.pricePerMeter || 0);

  return {
    paintLiters: Number(paintLiters.toFixed(1)),
    bucketsCount,
    primerLiters: Number(primerLiters.toFixed(1)),
    primerBuckets,
    puttyBags,
    totalCost: Number(totalCost.toFixed(2)),
  };
}

/**
 * تنسيق الأرقام لتظهر بسلاسة في الواجهة
 */
export function formatNum(val: number): string {
  if (isNaN(val)) return '0';
  return Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.00$/, '');
}
