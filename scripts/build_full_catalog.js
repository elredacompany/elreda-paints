import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.resolve('public/jotun_images');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Batch 2 items (from scripts/process_catalog.js)
const batch2 = JSON.parse(fs.readFileSync('scripts/processed_colors.json', 'utf8'));

// 2. Batch 1 unique items
const batch1Raw = [
  { img: 'img_03.png', code: '6253', nameAr: 'سي ميست', nameEn: 'Sea Mist', category: 'greys' },
  { img: 'img_04.png', code: '9911', nameAr: 'بلاتينيوم', nameEn: 'Platinum', category: 'greys' },
  { img: 'img_06.png', code: '2089', nameAr: 'لايت فينس', nameEn: 'Light Finesse', category: 'beiges' },
  { img: 'img_07.png', code: '11228', nameAr: 'فوريست لايت', nameEn: 'Forest Light', category: 'accent' },
  { img: 'img_08.png', code: '2040', nameAr: 'لايت غرانايت', nameEn: 'Light Granite', category: 'greys' },
  { img: 'img_09.png', code: '3206', nameAr: 'لايت إغبلانت', nameEn: 'Light Eggplant', category: 'accent' },
  { img: 'img_10.png', code: '1130', nameAr: 'سبرينغ لايت', nameEn: 'Spring Light', category: 'beiges' },
  { img: 'img_11.png', code: '4618', nameAr: 'إيفنينغ لايت', nameEn: 'Evening Light', category: 'accent' },
  { img: 'img_12.png', code: '4199', nameAr: 'لايت لافندر', nameEn: 'Light Lavender', category: 'accent' },
  { img: 'img_13.png', code: '1117', nameAr: 'بيتش سكاي', nameEn: 'Beach Sky', category: 'greys' },
  { img: 'img_14.png', code: '4627', nameAr: 'رين سكاي', nameEn: 'Rain Sky', category: 'accent' },
  { img: 'img_15.png', code: '8082', nameAr: 'سكاي غراي', nameEn: 'Sky Grey', category: 'greys' },
  { img: 'img_16.png', code: '1462', nameAr: 'إيفنينغ سكاي', nameEn: 'Evening Sky', category: 'accent' },
  { img: 'img_18.png', code: '1349', nameAr: 'بريز لايت', nameEn: 'Breeze Light', category: 'beiges' },
  { img: 'img_19.png', code: '20118', nameAr: 'آمبر رد', nameEn: 'Amber Red', category: 'accent' },
  { img: 'img_20.png', code: '12074', nameAr: 'بيتشي بيج', nameEn: 'Peachy Beige', category: 'beiges' },
  { img: 'img_22.png', code: '9904', nameAr: 'توايلايت', nameEn: 'Twilight', category: 'greys' },
  { img: 'img_23.png', code: '9408', nameAr: 'آيس ميست', nameEn: 'Ice Mist', category: 'greys' },
  { img: 'img_26.png', code: '10341', nameAr: 'لايمستون', nameEn: 'Limestone', category: 'beiges' },
  { img: 'img_28.png', code: '20120', nameAr: 'أورجانك رد', nameEn: 'Organic Red', category: 'accent' },
  { img: 'img_29.png', code: '12076', nameAr: 'مودرن بيج', nameEn: 'Modern Beige', category: 'beiges' },
  { img: 'img_31.png', code: '1939', nameAr: 'ساند بيج', nameEn: 'Sand Beige', category: 'beiges' },
  { img: 'img_32.png', code: '1037', nameAr: 'ديزرت ساند', nameEn: 'Desert Sand', category: 'beiges' },
  { img: 'img_33.png', code: '1006', nameAr: 'ساند ببل', nameEn: 'Sand Pebble', category: 'beiges' },
  { img: 'img_34.png', code: '12075', nameAr: 'سوذنغ بيج', nameEn: 'Soothing Beige', category: 'beiges' },
  { img: 'img_35.png', code: '1987', nameAr: 'أوك ساند', nameEn: 'Oak Sand', category: 'beiges' },
  { img: 'img_36.png', code: '1140', nameAr: 'ساند', nameEn: 'Sand', category: 'beiges' },
  { img: 'img_37.png', code: '7637', nameAr: 'إكسهيل', nameEn: 'Exhale', category: 'accent' },
  { img: 'img_38.png', code: '7555', nameAr: 'سوفت منت', nameEn: 'Soft Mint', category: 'accent' }
];

const processedBatch1 = [];

for (const item of batch1Raw) {
  const srcPath = path.join(publicDir, item.img);
  if (!fs.existsSync(srcPath)) {
    console.warn(`File ${srcPath} not found!`);
    continue;
  }

  const cleanFilename = `clean_${item.code}.png`;
  const fullCardFilename = `card_${item.code}.png`;
  const cleanDest = path.join(publicDir, cleanFilename);
  const cardDest = path.join(publicDir, fullCardFilename);

  // Copy full card if not exists
  if (!fs.existsSync(cardDest)) {
    fs.copyFileSync(srcPath, cardDest);
  }

  // Get image dimensions
  const dimOut = execSync(`identify -format "%w %h" "${srcPath}"`).toString().trim();
  const [W, H] = dimOut.split(' ').map(Number);

  // Crop pure color square:
  // Avoid top heart (0-20%) and right arrow (centered right) by taking center-left or safe center
  const side = Math.floor(Math.min(W * 0.70, H * 0.35));
  const x = Math.floor((W * 0.40) - (side / 2));
  const y = Math.floor(H * 0.24);

  execSync(`convert "${srcPath}" -crop ${side}x${side}+${x}+${y} +repage -resize 400x400 "${cleanDest}"`);

  // Extract average hex from pure color crop
  const hexOut = execSync(`convert "${cleanDest}" -resize 1x1 txt:-`).toString();
  const hexMatch = hexOut.match(/#([0-9A-Fa-f]{6})/);
  const hex = hexMatch ? `#${hexMatch[1].toUpperCase()}` : '#CCCCCC';

  processedBatch1.push({
    id: `jotun-${item.code}`,
    code: item.code,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    imageUrl: `/jotun_images/${fullCardFilename}`,
    localImage: `/jotun_images/${fullCardFilename}`,
    cleanImage: `/jotun_images/${cleanFilename}`,
    hex,
    category: item.category,
    categoryLabel: 'ألوان جوتن الرسمية المصورة',
    description: `درجة ${item.nameAr} (${item.nameEn}) الرسمية برقم ${item.code} من كتالوج جوتن للدهانات.`
  });

  console.log(`Processed Batch 1: ${item.code} - ${item.nameAr} (${hex})`);
}

// 3. Merge both batches, avoiding any duplicate color code
const seenCodes = new Set();
const combinedPalette = [];

// Add batch 2 first (they have external ibb urls + clean images)
for (const item of batch2) {
  if (!seenCodes.has(item.code)) {
    seenCodes.add(item.code);
    combinedPalette.push(item);
  }
}

// Add batch 1 unique items
for (const item of processedBatch1) {
  if (!seenCodes.has(item.code)) {
    seenCodes.add(item.code);
    combinedPalette.push(item);
  }
}

console.log(`Total unique colors after strict deduplication: ${combinedPalette.length}`);

// Save combined JSON
fs.writeFileSync('scripts/full_processed_colors.json', JSON.stringify(combinedPalette, null, 2));

// Generate src/data/jotunColors.ts
const beigesCount = combinedPalette.filter(c => c.category === 'beiges').length;
const greysCount = combinedPalette.filter(c => c.category === 'greys').length;
const accentCount = combinedPalette.filter(c => c.category === 'accent').length;

const tsContent = `import { JotunColor } from '../types';

export const JOTUN_CATEGORIES = [
  { id: 'all', label: 'جميع ألوان الكتالوج المصورة (${combinedPalette.length} لوناً معتمداً)', count: ${combinedPalette.length} },
  { id: 'beiges', label: 'درجات البيج والأوف وايت', count: ${beigesCount} },
  { id: 'greys', label: 'درجات الرمادي والكونسيبت', count: ${greysCount} },
  { id: 'accent', label: 'ألوان التمييز والتدرجات الدافئة', count: ${accentCount} },
];

/**
 * قائمة ألوان جوتن الرسمية المصورة بناءً على كروت وصور الكتالوج الرسمية (بدون أي تكرار)
 * مع الألوان الصافية المقصوصة بدقة (خالية من القلوب والأسهم والكتابات)، والأسماء والأرقام الرسمية
 */
export const OFFICIAL_JOTUN_PALETTE: JotunColor[] = ${JSON.stringify(combinedPalette, null, 2)};
`;

fs.writeFileSync('src/data/jotunColors.ts', tsContent);
console.log(`src/data/jotunColors.ts updated with ${combinedPalette.length} unique colors.`);
