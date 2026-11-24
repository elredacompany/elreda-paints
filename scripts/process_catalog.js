import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rawList = [
  { rawFile: 'raw_01.png', url: 'https://i.ibb.co/gLLnn8Dw/IMG-20261102-221125.png', code: '10051', nameAr: 'كلاي وود', nameEn: 'Clay Wood', category: 'greys' },
  { rawFile: 'raw_02.png', url: 'https://i.ibb.co/WWDrLJhQ/IMG-20261103-025404.png', code: '2500', nameAr: 'كوتون وود', nameEn: 'Cotton Wood', category: 'beiges' },
  { rawFile: 'raw_03.png', url: 'https://i.ibb.co/5xTP1FxV/IMG-20261103-025444.png', code: '0568', nameAr: 'وود سموك', nameEn: 'Wood Smoke', category: 'greys' },
  // raw_04 duplicate of 0568
  { rawFile: 'raw_05.png', url: 'https://i.ibb.co/k2hwBqZ6/IMG-20261103-025533.png', code: '10981', nameAr: 'نوريجان وود', nameEn: 'Norwegian Wood', category: 'accent' },
  { rawFile: 'raw_06.png', url: 'https://i.ibb.co/Psk2zrYB/IMG-20261103-025849.png', code: '1832', nameAr: 'ملكي واي', nameEn: 'Milky Way', category: 'beiges' },
  { rawFile: 'raw_07.png', url: 'https://i.ibb.co/GQqYshqx/IMG-20261103-025816.png', code: '1875', nameAr: 'سنس', nameEn: 'Sense', category: 'beiges' },
  { rawFile: 'raw_08.png', url: 'https://i.ibb.co/rG4jwrqN/IMG-20261103-025948.png', code: '4062', nameAr: 'كلاسيك بلو', nameEn: 'Classic Blue', category: 'accent' },
  { rawFile: 'raw_09.png', url: 'https://i.ibb.co/d0YzTLDp/IMG-20261103-025923.png', code: '6243', nameAr: 'كلاسيك غرين', nameEn: 'Classic Green', category: 'accent' },
  // raw_10 duplicate of 1832
  { rawFile: 'raw_11.png', url: 'https://i.ibb.co/FLGJYVdS/IMG-20261103-030047.png', code: '9918', nameAr: 'كلاسيك وايت', nameEn: 'Classic White', category: 'beiges' },
  { rawFile: 'raw_12.png', url: 'https://i.ibb.co/mrVDxvv6/IMG-20261103-030024.png', code: '12080', nameAr: 'سوفت راديانس', nameEn: 'Soft Radiance', category: 'beiges' },
  { rawFile: 'raw_13.png', url: 'https://i.ibb.co/3y86Mr4T/IMG-20261103-030116.png', code: '3377', nameAr: 'سلايت لافندر', nameEn: 'Slate Lavender', category: 'accent' },
  { rawFile: 'raw_14.png', url: 'https://i.ibb.co/7dCGYs1n/IMG-20261103-030158.png', code: '7628', nameAr: 'تريجر', nameEn: 'Treasure', category: 'accent' },
  { rawFile: 'raw_15.png', url: 'https://i.ibb.co/q3ZyFV2N/IMG-20261103-030217.png', code: '0121', nameAr: 'بيرل', nameEn: 'Pearl', category: 'beiges' },
  // raw_16 duplicate of 7628
  { rawFile: 'raw_17.png', url: 'https://i.ibb.co/k2FLxz5D/IMG-20261103-030246.png', code: '1442', nameAr: 'كلير', nameEn: 'Claire', category: 'beiges' },
  { rawFile: 'raw_18.png', url: 'https://i.ibb.co/844956xz/IMG-20261103-030324.png', code: '1024', nameAr: 'تايملس', nameEn: 'Timeless', category: 'beiges' },
  { rawFile: 'raw_19.png', url: 'https://i.ibb.co/r2g7FyRq/IMG-20261103-030352.png', code: '0567', nameAr: 'أيفري', nameEn: 'Ivory', category: 'beiges' },
  { rawFile: 'raw_20.png', url: 'https://i.ibb.co/PvVqQXBx/IMG-20261103-030510.png', code: '8394', nameAr: 'وايت بويتري', nameEn: 'White Poetry', category: 'beiges' },
  { rawFile: 'raw_21.png', url: 'https://i.ibb.co/RGSRgCFZ/IMG-20261103-030427.png', code: '1453', nameAr: 'كوتون بول', nameEn: 'Cotton Ball', category: 'beiges' },
  { rawFile: 'raw_22.png', url: 'https://i.ibb.co/TDrvDm3q/IMG-20261103-030633.png', code: '3037', nameAr: 'كوول أش', nameEn: 'Cool Ash', category: 'greys' },
  { rawFile: 'raw_23.png', url: 'https://i.ibb.co/TDYgHrpj/IMG-20261103-030550.png', code: '1622', nameAr: 'رفلكشن', nameEn: 'Reflection', category: 'greys' },
  { rawFile: 'raw_24.png', url: 'https://i.ibb.co/zWdHnHkZ/IMG-20261103-030705.png', code: '1376', nameAr: 'ميست', nameEn: 'Mist', category: 'beiges' },
  { rawFile: 'raw_25.png', url: 'https://i.ibb.co/VYmvm3VG/IMG-20261103-030742.png', code: '1624', nameAr: 'سكاي لايت', nameEn: 'Skylight', category: 'beiges' },
  { rawFile: 'raw_26.png', url: 'https://i.ibb.co/KzNL1y7f/IMG-20261103-030813.png', code: '8282', nameAr: 'وايت بيبر', nameEn: 'White Pepper', category: 'beiges' },
  { rawFile: 'raw_27.png', url: 'https://i.ibb.co/f7NkpLX/IMG-20261103-030850.png', code: '8012', nameAr: 'مرجلد وايت', nameEn: 'Marigold White', category: 'beiges' },
  { rawFile: 'raw_28.png', url: 'https://i.ibb.co/84tqsSMk/IMG-20261103-030917.png', code: '12218', nameAr: 'أوركس وايت', nameEn: 'Oryx White', category: 'beiges' },
  { rawFile: 'raw_29.png', url: 'https://i.ibb.co/nqcdZq35/IMG-20261103-030954.png', code: '1016', nameAr: 'انتيك وايت', nameEn: 'Antique White', category: 'beiges' },
  { rawFile: 'raw_30.png', url: 'https://i.ibb.co/nsz0gfh0/IMG-20261103-031026.png', code: '3144', nameAr: 'وايت ملفا', nameEn: 'White Malva', category: 'beiges' },
  { rawFile: 'raw_31.png', url: 'https://i.ibb.co/vxFNgf6c/IMG-20261103-031056.png', code: '1001', nameAr: 'إغّ وايت', nameEn: 'Egg White', category: 'beiges' },
  { rawFile: 'raw_32.png', url: 'https://i.ibb.co/CK7MLhZg/IMG-20261103-031119.png', code: '0471', nameAr: 'انتيك وايت', nameEn: 'Antique White', category: 'beiges' },
  { rawFile: 'raw_33.png', url: 'https://i.ibb.co/fzGxZP47/IMG-20261103-031219.png', code: '7236', nameAr: 'جاز وايت', nameEn: 'Jazz White', category: 'beiges' },
  { rawFile: 'raw_34.png', url: 'https://i.ibb.co/gMQbztYj/IMG-20261103-031242.png', code: '8395', nameAr: 'وايت كومفورت', nameEn: 'White Comfort', category: 'beiges' },
  { rawFile: 'raw_35.png', url: 'https://i.ibb.co/pjdm7yrF/IMG-20261103-031314.png', code: '12123', nameAr: 'كونتيمبرري وايت', nameEn: 'Contemporary White', category: 'beiges' },
  { rawFile: 'raw_36.png', url: 'https://i.ibb.co/gLFXDV8M/IMG-20261103-031342.png', code: '9148', nameAr: 'ويسبر وايت', nameEn: 'Whisper White', category: 'beiges' },
  // raw_37 duplicate of 12123
  { rawFile: 'raw_38.png', url: 'https://i.ibb.co/20MR819t/IMG-20261103-031404.png', code: '8470', nameAr: 'سموث وايت', nameEn: 'Smooth White', category: 'beiges' },
  { rawFile: 'raw_39.png', url: 'https://i.ibb.co/H5xXxTw/IMG-20261103-031456.png', code: '5272', nameAr: 'وايت كلاي', nameEn: 'White Clay', category: 'greys' },
  { rawFile: 'raw_40.png', url: 'https://i.ibb.co/DDx9xJ9c/IMG-20261103-031434.png', code: '8190', nameAr: 'أبل وايت', nameEn: 'Apple White', category: 'beiges' }
  // raw_41 duplicate of 6243
  // raw_42 duplicate of 4062
];

const publicDir = path.resolve('public/jotun_images');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const processedColors = [];

for (let i = 0; i < rawList.length; i++) {
  const item = rawList[i];
  const rawPath = path.resolve('temp_raw', item.rawFile);
  const cleanFilename = `clean_${item.code}.png`;
  const fullCardFilename = `card_${item.code}.png`;
  const cleanDest = path.join(publicDir, cleanFilename);
  const cardDest = path.join(publicDir, fullCardFilename);

  // Copy full card
  fs.copyFileSync(rawPath, cardDest);

  // Get image dimensions using identify
  const dimOut = execSync(`identify -format "%w %h" "${rawPath}"`).toString().trim();
  const [W, H] = dimOut.split(' ').map(Number);

  // Square crop: safely in the pure color zone
  // Avoiding top heart (~0-20%) and bottom white info (~68-100%)
  const side = Math.floor(Math.min(W * 0.82, H * 0.38));
  const x = Math.floor((W - side) / 2);
  const y = Math.floor(H * 0.23);

  // Crop pure color square and resize to crisp 400x400
  execSync(`convert "${rawPath}" -crop ${side}x${side}+${x}+${y} +repage -resize 400x400 "${cleanDest}"`);

  // Extract average hex from pure color crop
  const hexOut = execSync(`convert "${cleanDest}" -resize 1x1 txt:-`).toString();
  const hexMatch = hexOut.match(/#([0-9A-Fa-f]{6})/);
  const hex = hexMatch ? `#${hexMatch[1].toUpperCase()}` : '#CCCCCC';

  processedColors.push({
    id: `jotun-${item.code}`,
    code: item.code,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    imageUrl: item.url,
    localImage: `/jotun_images/${fullCardFilename}`,
    cleanImage: `/jotun_images/${cleanFilename}`,
    hex,
    category: item.category,
    categoryLabel: 'ألوان جوتن الرسمية المصورة',
    description: `درجة ${item.nameAr} (${item.nameEn}) الرسمية برقم ${item.code} من كتالوج جوتن للدهانات.`
  });

  console.log(`[${i + 1}/${rawList.length}] Processed ${item.code} - ${item.nameAr} (${hex})`);
}

// Write the result to a json file to inspect and import
fs.writeFileSync('scripts/processed_colors.json', JSON.stringify(processedColors, null, 2));
console.log(`\nSuccessfully processed ${processedColors.length} unique Jotun colors.`);
