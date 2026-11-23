// Added by Sales Brain (Beacon): Google Analytics, Search Console and chat widget tags in every built page. Safe to run twice.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const block = readFileSync(join(here, 'analytics-head.html'), 'utf8').trim();
const START = '<!-- sales-brain:analytics -->', END = '<!-- /sales-brain:analytics -->', GA_START = '<!-- sales-brain:ga -->', GA_END = '<!-- /sales-brain:ga -->';
// The GA tag's id: a page that already loads it (added by hand) gets only the Search Console meta, never a second copy.
const idAt = block.indexOf('gtag/js?id=');
const gaId = idAt >= 0 ? block.slice(idAt + 11).match(/^G-[A-Z0-9]+/)?.[0] : null;
const noGa = (() => { const a = block.indexOf(GA_START), b = block.indexOf(GA_END); return a >= 0 && b > a ? (block.slice(0, a).trimEnd() + block.slice(b + GA_END.length)) : block; })();
const skip = new Set(['node_modules', '.git', '.salesbrain']);
let n = 0;
const tag = (p) => {
  let h = readFileSync(p, 'utf8');
  for (let i = h.indexOf(START); i >= 0; i = h.indexOf(START)) { const j = h.indexOf(END, i); if (j < 0) break; h = h.slice(0, i).trimEnd() + h.slice(j + END.length); }
  const m = h.match(/<head(\s[^>]*)?>/i);
  if (!m) return;
  writeFileSync(p, h.replace(m[0], m[0] + '\n' + (gaId && h.includes(gaId) ? noGa : block)));
  n += 1;
};
const walk = (d) => {
  for (const name of readdirSync(d)) {
    if (skip.has(name)) continue;
    const p = join(d, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p); else if (name.endsWith('.html')) tag(p);
  }
};
walk(process.cwd());
console.log('sales-brain: analytics tags in ' + n + ' pages');
