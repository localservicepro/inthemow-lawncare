// Populates public/images/ with the optimised WebP set (plus logo PNGs).
// Fast path: downloads the pre-optimised bundle (built with sharp: max 1200px q70 + 600px q68 variants).
// Fallback: --from-drive downloads the originals from the client's Google Drive folder and optimises
// locally with sharp (npm i sharp). Generated Higgsfield images are downloaded from their result URLs.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'images');
const manifest = JSON.parse(readFileSync(path.join(root, 'src', 'images.json'), 'utf8'));
mkdirSync(out, { recursive: true });

const fromDrive = process.argv.includes('--from-drive');

async function download(url, dest) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

if (!fromDrive) {
  const zip = path.join(out, '_bundle.zip');
  console.log('Downloading optimised image bundle…');
  await download(manifest.zip, zip);
  execSync(`unzip -o -q "${zip}" -d "${out}"`);
  execSync(`rm -f "${zip}"`);
  console.log('Done →', out);
} else {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch { console.error('Run: npm i sharp'); process.exit(1); }
  for (const [slug, img] of Object.entries(manifest.images)) {
    const src = img.source === 'drive'
      ? `https://drive.google.com/uc?export=download&confirm=t&id=${img.fileId}`
      : img.url;
    const tmp = path.join(out, `_${slug}.src`);
    console.log('fetch', slug);
    await download(src, tmp);
    if (img.png) {
      await sharp(tmp).resize(img.w).png().toFile(path.join(out, `${slug}.png`));
    } else {
      await sharp(tmp).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(out, `${slug}.webp`));
      await sharp(tmp).rotate().resize({ width: 600, withoutEnlargement: true }).webp({ quality: 68 }).toFile(path.join(out, `${slug}-600.webp`));
    }
    execSync(`rm -f "${tmp}"`);
  }
  console.log('Done →', out);
}
