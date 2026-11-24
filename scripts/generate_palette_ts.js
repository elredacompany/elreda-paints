import fs from 'fs';

const colors = JSON.parse(fs.readFileSync('scripts/processed_colors.json', 'utf8'));

const tsContent = `import { JotunColor } from '../types';

export const JOTUN_CATEGORIES = [
  { id: 'all', label: 'جميع ألوان الكتالوج المصورة (36 لوناً معتمداً)', count: ${colors.length} },
  { id: 'beiges', label: 'درجات البيج والأوف وايت', count: ${colors.filter(c => c.category === 'beiges').length} },
  { id: 'greys', label: 'درجات الرمادي والكونسيبت', count: ${colors.filter(c => c.category === 'greys').length} },
  { id: 'accent', label: 'ألوان التمييز والتدرجات الدافئة', count: ${colors.filter(c => c.category === 'accent').length} },
];

/**
 * قائمة ألوان جوتن الرسمية المصورة بناءً على كروت وصور الكتالوج الرسمية (بدون تكرار)
 * مع الألوان الصافية المقصوصة بدقة، والأسماء والأرقام والروابط الرسمية
 */
export const OFFICIAL_JOTUN_PALETTE: JotunColor[] = ${JSON.stringify(colors, null, 2)};
`;

fs.writeFileSync('src/data/jotunColors.ts', tsContent);
console.log('src/data/jotunColors.ts written successfully with', colors.length, 'colors.');
