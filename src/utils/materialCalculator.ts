export const REFERENCE_TOTAL_AREA = 140;

export interface MaterialQuantities {
  sealer: number;
  ceilingPrimerSealer: number;
  ceilingPrimerPlastic: number;
  wallPrimerSealer: number;
  wallPrimerPlastic: number;
  puttyFourCoats: number;
  puttyPremium: number;
  sandpaperNormal: number;
  sandpaperDuco: number;
  ceilingFinish: number;
  wallFinish: number;
}

/**
 * الدالة الموحدة لحساب كميات الخامات بدقة انطلاقاً من إجمالي مساحة الدهانات (حوائط + سقف).
 * تُستخدم مباشرة في صفحة "حاسبة المواد" وفي استجابات "المستشار الذكي" لضمان تطابق 100%.
 */
export function calculateMaterialsFromTotalArea(totalPaintArea: number): MaterialQuantities {
  if (!Number.isFinite(totalPaintArea) || totalPaintArea <= 0) {
    return {
      sealer: 0,
      ceilingPrimerSealer: 0,
      ceilingPrimerPlastic: 0,
      wallPrimerSealer: 0,
      wallPrimerPlastic: 0,
      puttyFourCoats: 0,
      puttyPremium: 0,
      sandpaperNormal: 0,
      sandpaperDuco: 0,
      ceilingFinish: 0,
      wallFinish: 0,
    };
  }

  const scale = (ref: number) =>
    Math.max(1, Math.round((totalPaintArea / REFERENCE_TOTAL_AREA) * ref));

  return {
    sealer: scale(2),
    ceilingPrimerSealer: scale(1),
    ceilingPrimerPlastic: scale(1),
    wallPrimerSealer: scale(1),
    wallPrimerPlastic: scale(1),
    puttyFourCoats: scale(12),
    puttyPremium: scale(1),
    sandpaperNormal: scale(12),
    sandpaperDuco: scale(2),
    ceilingFinish: scale(2),
    wallFinish: scale(2),
  };
}

export function normalizeEasternDigitsAndArabic(value: string): string {
  const easternConverted = value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/(\d)[٫,](\d)/g, '$1.$2');

  return easternConverted
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
}

export function formatAdvisorMaterialsReply(params: {
  floorArea: number | null;
  totalPaintArea: number;
  materials: MaterialQuantities;
}): string {
  const { materials } = params;

  return `**كميات التأسيس:**
• السيلر: **${materials.sealer} بستلة**
• بطانة السقف: **${materials.ceilingPrimerSealer} بستلة سيلر + ${materials.ceilingPrimerPlastic} بستلة بلاستيك**
• بطانة الحوائط: **${materials.wallPrimerSealer} بستلة سيلر + ${materials.wallPrimerPlastic} بستلة بلاستيك**
• معجون 4 سواكين (للحوائط): **${materials.puttyFourCoats} شكارة**
• معجون ممتاز (لفواصل جبسون بورد): **${materials.puttyPremium} شكارة**
• السنفرة: **${materials.sandpaperNormal} فرخ سنفرة + ${materials.sandpaperDuco} فرخ سنفرة دوكو**

**كميات التشطيب:**
• تشطيب السقف: **${materials.ceilingFinish} بستلة**
• تشطيب الحوائط: **${materials.wallFinish} بستلة**

هذه الحسابات تقريبية وتخضع للمعاينة لتحديد الكميات النهائية بدقة 100%.`;
}

export type AdvisorAreaAnalysis =
  | {
      type: 'calculated';
      areaKind: 'floor' | 'total';
      floorArea: number | null;
      totalPaintArea: number;
      materials: MaterialQuantities;
      reply: string;
    }
  | {
      type: 'clarify';
      candidateArea: number;
      reply: string;
    }
  | {
      type: 'none';
    };

function stripNonAreaTokens(text: string, matchedColorCodes: string[]): string {
  let cleaned = text;
  // Remove Egyptian phone numbers and international phone numbers
  cleaned = cleaned.replace(/(?:\+?20|0020)?0?1[0125]\d{8}/g, ' ');
  // Remove matched Jotun color codes
  for (const code of matchedColorCodes) {
    if (!code) continue;
    const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(new RegExp(`(?:^|\\D)${escaped}(?=\\D|$)`, 'g'), ' ');
  }
  return cleaned;
}

function extractPlausibleAreaNumber(
  normalizedCleanedText: string
): { value: number; hasExplicitAreaContext: boolean } | null {
  // 1. Prefer numbers explicitly paired with area units (متر / م / م² / م2 / m2 / m)
  const unitMatch = normalizedCleanedText.match(
    /(?:^|[^\d.])(\d{1,4}(?:\.\d+)?)\s*(?:متر\s*مربع|متر|م2|م²|م(?=\s|$|[؟!،.])|m2|m²|sqm)(?:\s|$|[؟!،.])/i
  );
  if (unitMatch) {
    const val = parseFloat(unitMatch[1]);
    if (Number.isFinite(val) && val >= 10 && val <= 2000) {
      return { value: val, hasExplicitAreaContext: true };
    }
  }

  // 2. Number preceded by apartment/area keyword without repeating "متر"
  const keywordBeforeNumMatch = normalizedCleanedText.match(
    /(?:شقه|الشقه|شقتي|ارضيه|الارضيه|ارضي|مساحه|المساحه|مقاس|بيت|منزل|فيلا|شاليه|اجمالي|حوائط|اسقف)\s*(?:حوالي|تقريبا|نحو|حوالي|تصل\s*الي|قدره|قدها|يساوي|بـ)?\s*(\d{2,4}(?:\.\d+)?)(?:\s|$|[؟!،.])/
  );
  if (keywordBeforeNumMatch) {
    const val = parseFloat(keywordBeforeNumMatch[1]);
    if (Number.isFinite(val) && val >= 10 && val <= 2000) {
      return { value: val, hasExplicitAreaContext: true };
    }
  }

  // 3. Number when query explicitly asks about materials/quantities without non-area units
  const asksAboutMaterials =
    /(?:خامات|كميات|كميه|احسب|حساب|بستله|معجون|سيلر|تاسيس|تشطيب)/.test(
      normalizedCleanedText
    );
  if (asksAboutMaterials) {
    const nonAreaNumberPattern =
      /(\d+(?:\.\d+)?)\s*(?:سنه|سنين|عام|يوم|ايام|اسبوع|شهر|شهور|غرف|غرفه|اوض|اوضه|ريسبشن|طرق|طرقه|حمام|بستله|بستلات|شكاره|شكاير|فرخ|سواكين|وش|اوجه|ساعات|جنيه|الف|كود|رقم)/;
    const withoutNonArea = normalizedCleanedText.replace(new RegExp(nonAreaNumberPattern, 'g'), ' ');
    const fallbackNumMatch = withoutNonArea.match(/(?:^|[^\d.])(\d{2,4}(?:\.\d+)?)(?=[^\d.]|$)/);
    if (fallbackNumMatch) {
      const val = parseFloat(fallbackNumMatch[1]);
      if (Number.isFinite(val) && val >= 15 && val <= 2000) {
        return { value: val, hasExplicitAreaContext: true };
      }
    }
  }

  // 4. Standalone numeric message like "100"
  const pureNum = normalizedCleanedText.match(/^(\d{2,4}(?:\.\d+)?)$/);
  if (pureNum) {
    const val = parseFloat(pureNum[1]);
    if (Number.isFinite(val) && val >= 15 && val <= 2000) {
      return { value: val, hasExplicitAreaContext: false };
    }
  }

  return null;
}

const TOTAL_AREA_INTENT_REGEX =
  /(?:اجمالي|الاجمالي|كلي|الكلي|صافي|الصافي|حوائط|حيطه|الحيطه|الحيط|جدران|سقف|اسقف|الاسقف|مساحه\s*الدهان|مساحه\s*الدهانات|مساحه\s*حوائط|مساحه\s*الحوائط)/;

const FLOOR_AREA_INTENT_REGEX =
  /(?:ارضيه|الارضيه|ارضي|مساحه\s*الارض|شقه|الشقه|شقتي|شقتنا|منزل|بيت|البيت|فيلا|شاليه|عياده|مكتب|دور)/;

const CLARIFICATION_MARKER_REGEX =
  /مساحة أرضية الشقة[\s\S]*إجمالي مساحة الحوائط/;

function extractPendingClarificationArea(
  history: Array<{ role: string; text: string }>
): number | null {
  if (!Array.isArray(history) || history.length === 0) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (msg.role === 'assistant') {
      const text = String(msg.text || '');
      if (CLARIFICATION_MARKER_REGEX.test(text)) {
        const normAssistant = normalizeEasternDigitsAndArabic(text);
        const match = normAssistant.match(/(?:بـ|الرقم)\s*\*?\*?(\d{1,4}(?:\.\d+)?)/);
        if (match) {
          const val = parseFloat(match[1]);
          if (Number.isFinite(val) && val >= 10 && val <= 2000) {
            return val;
          }
        }
        // Fallback: inspect user message right before assistant clarification
        if (i > 0 && history[i - 1]?.role === 'user') {
          const prevUserNorm = normalizeEasternDigitsAndArabic(String(history[i - 1].text || ''));
          const prevNum = extractPlausibleAreaNumber(prevUserNorm);
          if (prevNum) return prevNum.value;
        }
      }
      // Only check the most recent assistant message
      break;
    }
  }
  return null;
}

export function analyzeAdvisorAreaQuery(
  userMessage: string,
  history: Array<{ role: string; text: string }> = [],
  matchedColorCodes: string[] = []
): AdvisorAreaAnalysis {
  const cleanedRaw = stripNonAreaTokens(userMessage, matchedColorCodes);
  const norm = normalizeEasternDigitsAndArabic(cleanedRaw);

  if (!norm) {
    return { type: 'none' };
  }

  // First check if user is replying to our clarification prompt without entering a different number
  const pendingArea = extractPendingClarificationArea(history);
  const extractedFromCurrent = extractPlausibleAreaNumber(norm);

  if (pendingArea !== null && !extractedFromCurrent) {
    const pickedFloor =
      FLOOR_AREA_INTENT_REGEX.test(norm) ||
      /(?:^|\s)(?:الاولي|الاول|رقم\s*1|1|نعم\s*ارضيه|مساحه\s*شقه)(?:\s|$)/.test(norm);
    const pickedTotal =
      TOTAL_AREA_INTENT_REGEX.test(norm) ||
      /(?:^|\s)(?:الثانيه|الثاني|تاني|رقم\s*2|2)(?:\s|$)/.test(norm);

    if (pickedTotal && !pickedFloor) {
      const totalPaintArea = Number(pendingArea.toFixed(1));
      const materials = calculateMaterialsFromTotalArea(totalPaintArea);
      return {
        type: 'calculated',
        areaKind: 'total',
        floorArea: null,
        totalPaintArea,
        materials,
        reply: formatAdvisorMaterialsReply({
          floorArea: null,
          totalPaintArea,
          materials,
        }),
      };
    }

    if (pickedFloor && !pickedTotal) {
      const floorArea = Number(pendingArea.toFixed(1));
      const totalPaintArea = Number((floorArea * 3).toFixed(1));
      const materials = calculateMaterialsFromTotalArea(totalPaintArea);
      return {
        type: 'calculated',
        areaKind: 'floor',
        floorArea,
        totalPaintArea,
        materials,
        reply: formatAdvisorMaterialsReply({
          floorArea,
          totalPaintArea,
          materials,
        }),
      };
    }
  }

  if (!extractedFromCurrent) {
    return { type: 'none' };
  }

  // Ignore if query is strictly asking about colors (and has no area context / explicit meter unit)
  if (matchedColorCodes.length > 0 && !extractedFromCurrent.hasExplicitAreaContext) {
    return { type: 'none' };
  }

  const areaNum = Number(extractedFromCurrent.value.toFixed(1));
  const hasExplicitTotal = TOTAL_AREA_INTENT_REGEX.test(norm);
  const hasColloquialFloor = /(?:^|\s)عندي\s+\d+(?:\.\d+)?\s*(?:متر|م2|م²|م(?=\s|$|[؟!،.]))/.test(
    norm
  );
  const hasExplicitFloor = FLOOR_AREA_INTENT_REGEX.test(norm) || (hasColloquialFloor && !hasExplicitTotal);

  if (hasExplicitTotal && !hasExplicitFloor) {
    const totalPaintArea = areaNum;
    const materials = calculateMaterialsFromTotalArea(totalPaintArea);
    return {
      type: 'calculated',
      areaKind: 'total',
      floorArea: null,
      totalPaintArea,
      materials,
      reply: formatAdvisorMaterialsReply({
        floorArea: null,
        totalPaintArea,
        materials,
      }),
    };
  }

  if (hasExplicitFloor) {
    const floorArea = areaNum;
    const totalPaintArea = Number((floorArea * 3).toFixed(1));
    const materials = calculateMaterialsFromTotalArea(totalPaintArea);
    return {
      type: 'calculated',
      areaKind: 'floor',
      floorArea,
      totalPaintArea,
      materials,
      reply: formatAdvisorMaterialsReply({
        floorArea,
        totalPaintArea,
        materials,
      }),
    };
  }

  // Ambiguous: the number was given as area (e.g. "100 متر" or "مساحة 70 متر") without clarifying floor vs total walls+ceiling
  const multipliedPreview = Number((areaNum * 3).toFixed(1));
  return {
    type: 'clarify',
    candidateArea: areaNum,
    reply: `لتحديد كميات الخامات بدقة من حاسبة المواد، هل تقصد بـ **${areaNum} م²**:
1. **مساحة أرضية الشقة** (سيتم ضربها × 3 لحساب إجمالي الحوائط والأسقف = **${multipliedPreview} م²**)؟
2. أم **إجمالي مساحة الحوائط والأسقف** مباشرة (**${areaNum} م²**)؟

من فضلك وضّح لي وسأعرض لك قائمة الخامات والكميات الدقيقة فوراً.`,
  };
}
