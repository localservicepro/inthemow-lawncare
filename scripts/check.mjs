// SEO / content checks on the built pages.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const dir = new URL('../public/', import.meta.url).pathname;
const files = readdirSync(dir).filter(f => f.endsWith('.html'));
let fail = 0;
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
for (const f of files) {
  const html = readFileSync(path.join(dir, f), 'utf8');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = ((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<form[\s\S]*?<\/form>/g, '');
  const words = text(main).split(' ').length;
  const tig = /tigereye/i.test(html);
  const kw = f === 'index.html' ? 'lawn mowing byford' : null;
  let dens = '';
  if (kw) { const t = text(main).toLowerCase(); const n = (t.match(new RegExp(kw, 'g')) || []).length; dens = ` kw:"${kw}" x${n} density=${((n * 3) / words * 100).toFixed(2)}%`; }
  const ok = h1s === 1 && !tig && title && desc;
  if (!ok) fail++;
  console.log(`${ok ? 'OK ' : 'BAD'} ${f.padEnd(24)} h1=${h1s} words=${words} title=${title?.length}ch desc=${desc?.length}ch tigereye=${tig}${dens}`);
}
const home = readFileSync(path.join(dir, 'index.html'), 'utf8');
const want = { h1: "Lawn Mowing Byford & Perth's South-East: Reliable Mowing, Retic & Garden Care", title: 'Lawn Mowing Byford & Perth South-East | In The Mow', desc: "Lawn mowing Byford & Perth's South-East. Reliable mowing, acreage slashing, retic repairs & garden care from Canning Vale to Mandurah. Get a free quote today." };
const h1txt = text((home.match(/<h1[\s\S]*?<\/h1>/) || [''])[0]);
console.log('H1 verbatim:', h1txt === want.h1, '|', h1txt);
console.log('Title verbatim:', (home.match(/<title>([^<]*)<\/title>/) || [])[1].replace(/&amp;/g, '&') === want.title);
console.log('Desc verbatim:', (home.match(/<meta name="description" content="([^"]*)"/) || [])[1].replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'") === want.desc);
console.log('Tracking script on every page:', files.every(f => readFileSync(path.join(dir, f), 'utf8').includes('data-tracking-id="tk_9c8c4108f54d4ef2bf2af5dfac9d0c15"')));
console.log('GBP iframe exact:', home.includes('<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d114132.82700240743!2d115.9135828!3d-32.1626134!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e33d9b3d8d0a54f%3A0xff3e40563a8aefad!2sIn%20The%20Mow%20Lawncare!5e1!3m2!1sen!2sph!4v1793107124209!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>'));
// schema sanity
for (const f of files) { const html = readFileSync(path.join(dir, f), 'utf8'); const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []; blocks.forEach(b => { const j = JSON.parse(b.replace(/<script[^>]*>|<\/script>/g, '')); if (JSON.stringify(j).toLowerCase().includes('tigereye') || JSON.stringify(j).includes('streetAddress')) { console.log('BAD schema', f); fail++; } }); }
console.log(fail ? `FAILURES: ${fail}` : 'All checks passed');
process.exit(fail ? 1 : 0);
