import fs from 'fs';
import path from 'path';
import https from 'https';

const urls = [
  'https://i.ibb.co/gLLnn8Dw/IMG-20261102-221125.png',
  'https://i.ibb.co/WWDrLJhQ/IMG-20261103-025404.png',
  'https://i.ibb.co/5xTP1FxV/IMG-20261103-025444.png',
  'https://i.ibb.co/ZpMkvt3K/IMG-20261103-025748.png',
  'https://i.ibb.co/k2hwBqZ6/IMG-20261103-025533.png',
  'https://i.ibb.co/Psk2zrYB/IMG-20261103-025849.png',
  'https://i.ibb.co/GQqYshqx/IMG-20261103-025816.png',
  'https://i.ibb.co/rG4jwrqN/IMG-20261103-025948.png',
  'https://i.ibb.co/d0YzTLDp/IMG-20261103-025923.png',
  'https://i.ibb.co/FLGJYVdS/IMG-20261103-030047.png',
  'https://i.ibb.co/mrVDxvv6/IMG-20261103-030024.png',
  'https://i.ibb.co/3y86Mr4T/IMG-20261103-030116.png',
  'https://i.ibb.co/7dCGYs1n/IMG-20261103-030158.png',
  'https://i.ibb.co/q3ZyFV2N/IMG-20261103-030217.png',
  'https://i.ibb.co/k2FLxz5D/IMG-20261103-030246.png',
  'https://i.ibb.co/844956xz/IMG-20261103-030324.png',
  'https://i.ibb.co/r2g7FyRq/IMG-20261103-030352.png',
  'https://i.ibb.co/PvVqQXBx/IMG-20261103-030510.png',
  'https://i.ibb.co/RGSRgCFZ/IMG-20261103-030427.png',
  'https://i.ibb.co/TDrvDm3q/IMG-20261103-030633.png',
  'https://i.ibb.co/TDYgHrpj/IMG-20261103-030550.png',
  'https://i.ibb.co/zWdHnHkZ/IMG-20261103-030705.png',
  'https://i.ibb.co/VYmvm3VG/IMG-20261103-030742.png',
  'https://i.ibb.co/KzNL1y7f/IMG-20261103-030813.png',
  'https://i.ibb.co/f7NkpLX/IMG-20261103-030850.png',
  'https://i.ibb.co/84tqsSMk/IMG-20261103-030917.png',
  'https://i.ibb.co/nqcdZq35/IMG-20261103-030954.png',
  'https://i.ibb.co/nsz0gfh0/IMG-20261103-031026.png',
  'https://i.ibb.co/vxFNgf6c/IMG-20261103-031056.png',
  'https://i.ibb.co/CK7MLhZg/IMG-20261103-031119.png',
  'https://i.ibb.co/fzGxZP47/IMG-20261103-031219.png',
  'https://i.ibb.co/gMQbztYj/IMG-20261103-031242.png',
  'https://i.ibb.co/pjdm7yrF/IMG-20261103-031314.png',
  'https://i.ibb.co/gLFXDV8M/IMG-20261103-031342.png',
  'https://i.ibb.co/20MR819t/IMG-20261103-031404.png',
  'https://i.ibb.co/H5xXxTw/IMG-20261103-031456.png',
  'https://i.ibb.co/DDx9xJ9c/IMG-20261103-031434.png',
  'https://i.ibb.co/wVqzrv9/IMG-20261103-031528.png',
  'https://i.ibb.co/HDM68McW/IMG-20261103-031634.png',
  'https://i.ibb.co/SwT5Kyc4/IMG-20261103-031725.png',
  'https://i.ibb.co/dsKNbkZg/IMG-20261103-031852.png',
  'https://i.ibb.co/5hjpGSjb/IMG-20261103-031915.png'
];

const targetDir = path.resolve('temp_raw');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Status ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting download of ${urls.length} images...`);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = `raw_${String(i + 1).padStart(2, '0')}.png`;
    const dest = path.join(targetDir, filename);
    process.stdout.write(`Downloading ${i + 1}/${urls.length}: ${filename}... `);
    try {
      await download(url, dest);
      const stat = fs.statSync(dest);
      console.log(`OK (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
    }
  }
  console.log('Download complete.');
}

run();
