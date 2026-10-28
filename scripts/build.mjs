// Static site generator: src/content.mjs + src/styles.css + src/main.js -> public/*.html
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, services, regions, allSuburbs, route, reviews, homeFaqs, beforeAfter, home, formServices, about, areasPage, contactPage } from '../src/content.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public');
mkdirSync(out, { recursive: true });
const css = readFileSync(path.join(root, 'src/styles.css'), 'utf8');
const js = readFileSync(path.join(root, 'src/main.js'), 'utf8');
const lqip = JSON.parse(readFileSync(path.join(root, 'src/lqip.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(root, 'src/images.json'), 'utf8')).images;
// Public CDN copies of every asset (src/cdn.json). Used whenever the file is not present in public/images,
// so the site renders on Vercel/Netlify even when the photo bundle has not been downloaded into the repo.
// Run `npm run images` to self-host; the build then switches back to /images/... automatically.
const cdn = JSON.parse(readFileSync(path.join(root, 'src/cdn.json'), 'utf8'));
let cdnUsed = 0;
function asset(file, absolute = false) {
  if (existsSync(path.join(out, 'images', file))) return (absolute ? site.url : '') + '/images/' + file;
  const c = cdn[file]; if (!c) throw new Error('asset missing locally and not in cdn.json: ' + file);
  cdnUsed++; return c.url;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = esc;
const jsonld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

/* ---------- icons (single-weight line art, gradient stroke) ---------- */
const GRAD = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#04713b"/><stop offset=".5" stop-color="#4b9c2c"/><stop offset="1" stop-color="#8dc81b"/></linearGradient></defs></svg>`;
const ICONS = {
  mower: 'M7 34h19l5-9H15z M11 34.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0 M24 36.5a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M26 25l12-14h5 M17 25v-4h6',
  sprinkler: 'M24 41V24 M17 41h14 M24 24h-4v-5h8v5z M24 15c0-5-3-8-3-8 M24 15c0-5 3-8 3-8 M22 17c-5-1-8-6-8-6 M26 17c5-1 8-6 8-6 M24 12V5',
  rideon: 'M9 34a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M29 33a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0 M13 30h7l3-10h9l4 10 M23 20v-6h8 M21 30v-5h7 M26 14l3-5h4',
  shears: 'M15 37L30 11 M33 37L18 11 M10 42l5-5 M38 42l-5-5 M24 21l3-4 M20 26l4 5',
  turf: 'M8 40h32 M12 34h16 M28 34a6 6 0 1 0 0-12a6 6 0 0 0 0 12 M28 28h.1 M12 34l7-5h9 M8 18h8 M20 18h6 M30 18h4 M8 12h5 M17 12h4',
  aerator: 'M8 38h32 M12 38l-2-8h21l4-10h9 M15 30v8 M21 30v8 M27 30v8 M33 36a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  phone: 'M22 16.9a10 10 0 0 0 9 9l3-3a1.5 1.5 0 0 1 1.6-.4l5.2 2.1A1.5 1.5 0 0 1 41 26v5.2A3.8 3.8 0 0 1 37.2 35 30.4 30.4 0 0 1 11 10.8 3.8 3.8 0 0 1 14.8 7H20a1.5 1.5 0 0 1 1.4 1l2.1 5.2a1.5 1.5 0 0 1-.4 1.6z',
  check: 'M10 25l9 9 19-20',
  pin: 'M24 42s-13-11-13-21a13 13 0 0 1 26 0c0 10-13 21-13 21z M24 25a4 4 0 1 0 0-8a4 4 0 0 0 0 8z',
  mail: 'M7 12h34v24H7z M7 14l17 12 17-12',
  clock: 'M24 42a18 18 0 1 0 0-36a18 18 0 0 0 0 36z M24 13v11l7 5',
  arrow: 'M8 24h30 M26 12l12 12-12 12',
  star: 'M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35l-12.5 7 3-14L4 18.5 18 17z'
};
const icon = (name, cls = '', extra = '') => `<svg class="${cls}" viewBox="0 0 48 48" fill="none" stroke="url(#g)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}><path d="${ICONS[name]}"/></svg>`;
const iconSolid = (name, color) => `<svg viewBox="0 0 48 48" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
const star = `<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="${ICONS.star}"/></svg>`;

/* ---------- image helper ---------- */
function img(slug, alt, opts = {}) {
  const m = manifest[slug]; if (!m) throw new Error('unknown image ' + slug);
  const sizes = opts.sizes || '(min-width: 1000px) 400px, (min-width: 640px) 50vw, 100vw';
  const full = asset(`${slug}.webp`);
  const srcset = m.w > 600 ? `${asset(`${slug}-600.webp`)} 600w, ${full} ${m.w}w` : `${full} ${m.w}w`;
  const eager = opts.eager ? 'loading="eager" fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  const bg = lqip[slug] ? ` style="background:url(data:image/webp;base64,${lqip[slug]}) center/cover no-repeat"` : '';
  return `<img src="${full}" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${attr(alt)}" ${eager}${bg}${opts.cls ? ` class="${opts.cls}"` : ''}>`;
}
const genNote = '<p class="gen-note">Illustrative image.</p>';

/* ---------- map ---------- */
const P = ([lon, lat]) => [Math.round((lon - 115.60) * 1700), Math.round((lat + 32.00) * -1900)];
const coord = {}; regions.forEach(r => r.suburbs.forEach(s => { coord[s[0]] = [s[1], s[2]]; }));
function smooth(pts) { // Catmull-Rom -> cubic bezier
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function mapSvg() {
  const coast = smooth([[115.76, -32.03], [115.77, -32.10], [115.78, -32.17], [115.76, -32.24], [115.72, -32.27], [115.69, -32.27], [115.70, -32.30], [115.74, -32.33], [115.74, -32.39], [115.72, -32.45], [115.70, -32.50], [115.69, -32.54], [115.66, -32.57], [115.63, -32.62]].map(P));
  const scarp = smooth([[116.03, -32.03], [116.04, -32.10], [116.045, -32.17], [116.03, -32.25], [116.02, -32.33], [116.03, -32.40]].map(P));
  const freeway = smooth([[115.86, -32.03], [115.855, -32.12], [115.84, -32.20], [115.82, -32.28], [115.80, -32.36], [115.78, -32.44], [115.76, -32.50], [115.74, -32.56]].map(P));
  const tonkin = smooth([[115.95, -32.03], [115.98, -32.10], [116.00, -32.16], [115.995, -32.23], [115.985, -32.30], [115.98, -32.36]].map(P));
  const pts = route.map(w => P(Array.isArray(w) ? w : coord[w]));
  const [hx, hy] = P(coord.Byford);
  // label offsets to reduce overlaps
  const off = { 'Canning Vale': [-10, -12, 'end'], 'Thornlie': [0, -12, 'middle'], 'Maddington': [8, -4], 'Southern River': [10, 14], 'Huntingdale': [6, 14], 'Gosnells': [8, -2], 'Kelmscott': [8, 2], 'Seville Grove': [-8, 6, 'end'], 'Armadale': [10, 6], 'Mount Richon': [10, -6], 'Byford': [12, 4], 'Hilbert': [-8, 2, 'end'], 'Haynes': [10, -6], 'Cardup': [10, 4], 'Mundijong': [10, 4], 'Whitby': [-8, 10, 'end'], 'Oakford': [-8, -8, 'end'], 'Wandi': [10, -6], 'Anketell': [10, 4], 'Casuarina': [10, -8], 'Serpentine': [10, 8], 'Jarrahdale': [10, 4], 'Bedfordale': [10, 10], 'Roleystone': [10, 4], 'Karragullen': [10, 0], 'Jandakot': [-8, -8, 'end'], 'Treeby': [10, 0], 'Cockburn Central': [-8, 0, 'end'], 'Success': [10, 4], 'Atwell': [10, 4], 'Aubin Grove': [10, -4], 'Hammond Park': [10, 12], 'Wattleup': [-8, 0, 'end'], 'Hope Valley': [-8, 6, 'end'], 'Bertram': [10, 12], 'Parmelia': [10, 10], 'Orelia': [10, -6], 'Medina': [-8, 4, 'end'], 'Leda': [-8, 6, 'end'], 'Wellard': [10, 6], 'Baldivis': [12, 4], 'Waikiki': [-8, 0, 'end'], 'Warnbro': [-8, 4, 'end'], 'Port Kennedy': [-8, 4, 'end'], 'Secret Harbour': [-8, 4, 'end'], 'Golden Bay': [-8, 4, 'end'], 'Lakelands': [12, 0], 'Madora Bay': [-8, 10, 'end'], 'Meadow Springs': [12, 4], 'Greenfields': [12, 4], 'Dudley Park': [10, 10], 'Halls Head': [-8, 0, 'end'], 'Erskine': [-8, 8, 'end'], 'Falcon': [-8, 4, 'end'], 'Wannanup': [-8, 8, 'end'], 'Coodanup': [12, 8], 'Mandurah': [12, 2] };
  let labels = '';
  regions.forEach(r => r.suburbs.forEach(s => {
    const [x, y] = P([s[1], s[2]]); const anchor = s[3] === 1; const o = off[s[0]] || [10, 4];
    const cls = anchor ? '' : ' minor';
    labels += `<circle class="dot${cls}" data-x="${x}" data-y="${y}" cx="${x}" cy="${y}" r="${anchor ? 5 : 3.5}"/><text class="lbl${cls}" data-x="${x}" data-y="${y}" x="${x + o[0]}" y="${y + o[1] + 4}" text-anchor="${o[2] || 'start'}" font-size="${anchor ? 17 : 14}">${esc(s[0])}</text>`;
  }));
  const regionLabels = [['SOUTH-EAST PERTH', 115.86, -32.045], ['BYFORD CORRIDOR', 116.03, -32.235], ['SERPENTINE / HILLS', 116.03, -32.385], ['COCKBURN / KWINANA', 115.655, -32.165], ['ROCKINGHAM / COASTAL', 115.645, -32.36], ['MANDURAH', 115.80, -32.60]].map(([n, lo, la]) => { const [x, y] = P([lo, la]); return `<text class="region" data-x="${x}" data-y="${y}" x="${x}" y="${y}" font-size="15">${n}</text>`; }).join('');
  const [sx, sy] = P([115.955, -32.025]); const [cx, cy] = P([115.62, -32.09]); const [fx, fy] = P([115.875, -32.055]); const [tx, ty] = P([115.905, -32.035]); const [sc, scy] = P([116.055, -32.05]);
  return `<svg class="map" viewBox="0 0 900 1240" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="map-title map-desc">
<title id="map-title">Animated map of In The Mow Lawncare's service area</title>
<desc id="map-desc">A stylised map of Perth's south-east and the Peel coast. A ride-on mower drives from Byford through the Serpentine-Jarrahdale hills, Armadale and Canning Vale, Cockburn and Kwinana, the Rockingham coast and Mandurah, lighting up each suburb it services.</desc>
<defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#04713b"/><stop offset=".5" stop-color="#4b9c2c"/><stop offset="1" stop-color="#8dc81b"/></linearGradient></defs>
<rect width="900" height="1240" fill="#2a3340" rx="12"/>
<path d="${coast}" fill="none" stroke="url(#mg)" stroke-width="3" stroke-linecap="round"/>
<text x="${cx}" y="${cy}" fill="rgba(255,255,255,.35)" font-size="13" font-style="italic">Indian Ocean</text>
<path d="${scarp}" fill="none" stroke="url(#mg)" stroke-width="2" stroke-dasharray="8 7" stroke-linecap="round" opacity=".8"/>
<text x="${sc}" y="${scy}" fill="rgba(255,255,255,.35)" font-size="13" font-style="italic">Darling Scarp</text>
<path d="${freeway}" fill="none" stroke="#4a5565" stroke-width="2.5" stroke-linecap="round"/>
<text x="${fx}" y="${fy}" fill="#6b7686" font-size="12">Kwinana Fwy</text>
<path d="${tonkin}" fill="none" stroke="#4a5565" stroke-width="2.5" stroke-linecap="round"/>
<text x="${tx}" y="${ty}" fill="#6b7686" font-size="12">Tonkin Hwy</text>
<path id="mow-route" d="${smooth(pts)}" fill="none" stroke="url(#mg)" stroke-width="2" stroke-dasharray="6 9" opacity=".55" stroke-linecap="round"/>
${regionLabels}${labels}
<g id="mower" data-home="${hx} ${hy}" transform="translate(${hx} ${hy})"><g transform="translate(-20 -22) scale(1.1)" fill="none" stroke="#8dc81b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h16l4-8h7l3 8h5 M11 23.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0 M27 24a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M19 14v-5h5 M23 9a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0"/><path d="M8 22c-1-3-5-3-6 0" stroke="#212832" stroke-width="4"/></g></g>
</svg>`;
}

/* ---------- shared partials ---------- */
const phoneLink = (cls = 'btn btn-call', label = site.phone) => `<a class="${cls}" href="tel:${site.phoneTel}">${iconSolid('phone', 'currentColor')}<span>${label}</span></a>`;
const servicesNav = () => services.map(s => `<a href="/${s.slug}">${icon(s.icon)}${esc(s.nav)}</a>`).join('');

// Pages that carry their own quote form link to it in-page; everything else goes to /contact.
const HAS_FORM = new Set(['/', '/contact', ...services.map(s => '/' + s.slug)]);
const quoteHref = current => (HAS_FORM.has(current) ? '#quote' : '/contact');
function header(current) {
  const cur = p => (current === p ? ' aria-current="page"' : '');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="header"><div class="container">
  <a class="brand" href="/" aria-label="In The Mow Lawncare home"><img src="${asset('logo-128.png')}" width="60" height="60" alt="In The Mow Lawncare logo"></a>
  <nav class="nav" aria-label="Main">
    <a href="/"${cur('/')}>Home</a>
    <div class="has-sub"><button type="button" aria-expanded="false" aria-haspopup="true">Services ${iconSolid('arrow', 'currentColor').replace('viewBox="0 0 48 48"', 'viewBox="0 0 48 48" style="transform:rotate(90deg)"')}</button><div class="sub">${servicesNav()}</div></div>
    <a href="/about"${cur('/about')}>About</a><a href="/service-areas"${cur('/service-areas')}>Service Areas</a><a href="/contact"${cur('/contact')}>Contact</a>
  </nav>
  <div class="header-cta"><a class="header-call" href="tel:${site.phoneTel}">${iconSolid('phone', 'currentColor')}${site.phone}</a><a class="btn btn-primary" href="${quoteHref(current)}" data-quote-open>Get a Free Quote</a></div>
  <a class="btn btn-primary btn-sm head-quote" href="${quoteHref(current)}" data-quote-open>Get a Quote</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
</div>
<div class="mobile-menu" id="mobile-menu">
  <a href="/">Home</a>
  <details><summary>Services <span aria-hidden="true">+</span></summary>${services.map(s => `<a href="/${s.slug}">${esc(s.nav)}</a>`).join('')}</details>
  <a href="/about">About</a><a href="/service-areas">Service Areas</a><a href="/contact">Contact</a>
  <div class="mm-cta"><a class="btn btn-primary" href="tel:${site.phoneTel}">Call ${site.phone}</a><a class="btn btn-outline" href="${quoteHref(current)}" data-quote-open>Get a Quote</a></div>
</div></header>`;
}

const stickyBar = () => ''; // removed: no fixed bottom bar
const _oldStickyBar = (quoteHref) => `<div class="sticky-bar" aria-label="Quick actions"><a class="btn btn-primary" href="tel:${site.phoneTel}">${iconSolid('phone', 'currentColor')}Call ${site.phone}</a><a class="btn btn-outline" href="${quoteHref}">Get a Quote</a></div>`;

function footer(withMap) {
  return `<footer class="footer"><div class="container">
<div class="footer-grid">
  <div class="brand-block">
    <img src="${asset('logo-128.png')}" width="88" height="88" alt="In The Mow Lawncare logo" loading="lazy">
    <p class="brand-name">${site.name}</p><p class="tagline">${site.tagline}</p>
    <p>Locally owned and operated lawn mowing, reticulation, turf and garden maintenance for Perth's South-East corridor and the Peel region. Based in Byford WA 6122.</p>
    <div class="social"><a href="${site.facebook}" target="_blank" rel="noopener" aria-label="In The Mow Lawncare on Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8z"/></svg></a><a href="${site.gbp}" target="_blank" rel="noopener" aria-label="In The Mow Lawncare on Google Maps">${iconSolid('pin', 'currentColor')}</a></div>
  </div>
  <div><h3>Services</h3><ul>${services.map(s => `<li><a href="/${s.slug}">${esc(s.nav)}</a></li>`).join('')}</ul></div>
  <div><h3>Quick links</h3><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li><li><a href="/service-areas">Service areas</a></li><li><a href="/#reviews">Reviews</a></li><li><a href="/blog">Blog</a></li><li><a href="/contact">Contact &amp; free quote</a></li><li><a href="/#faq">FAQ</a></li></ul>
    <h3 style="margin-top:22px">Contact</h3><ul><li><a href="tel:${site.phoneTel}">${site.phone}</a></li><li><a href="mailto:${site.email}">${site.email}</a></li><li>Byford WA 6122</li><li>${site.hoursText}</li></ul></div>
  <div><h3>Where we work</h3><p class="areas-line">${regions.map(r => `<strong>${esc(r.name)}:</strong> ${r.suburbs.map(s => s[0]).join(', ')}`).join('<br>')}</p>${withMap ? `<div class="gmap" style="margin-top:14px">${site.gbpEmbed}</div>` : ''}</div>
</div>
<div class="footer-bottom"><span>© ${new Date().getFullYear()} ${site.name}. All rights reserved. ABN available on request.</span><span><a href="/privacy">Privacy</a> · Website by <a href="https://www.localservicepro.com.au/" rel="noopener" target="_blank">Local Service Pro</a></span></div>
</div></footer>
<div class="modal" id="quote-modal" hidden><div class="modal-backdrop" data-quote-close></div><div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-form-title"><button class="modal-close" type="button" aria-label="Close" data-quote-close><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>${quoteForm('modal-form', true)}</div></div>`;
}

function quoteForm(id, compact = false) {
  return `<form id="${id}" class="form-card" data-quote-form data-redirect="/thank-you" novalidate="" autocomplete="on">
  <h2 id="${id}-title">Get a Free Quote</h2>
  <p class="phone-line">${iconSolid('phone', '#1a8235')}<span>Prefer to talk? </span><a href="tel:${site.phoneTel}">${site.phone}</a></p>
  <div class="form-grid${compact ? ' compact' : ''}">
    <div class="field"><label for="${id}-name">Name</label><input id="${id}-name" name="full_name" type="text" required autocomplete="name" data-ghl="{{contact.full_name}}"></div>
    <div class="field"><label for="${id}-phone">Phone</label><input id="${id}-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel" data-ghl="{{contact.phone}}"></div>
    <div class="field full"><label for="${id}-email">Email</label><input id="${id}-email" name="email" type="email" required autocomplete="email" data-ghl="{{contact.email}}"></div>
    <div class="field full"><label for="${id}-address">Property Address</label><input id="${id}-address" name="property_address" type="text" autocomplete="street-address" placeholder="Suburb is fine to start" data-ghl="{{contact.property_address}}"></div>
    <div class="field"><label for="${id}-size">Property Size</label><input id="${id}-size" name="property_size" type="text" placeholder="e.g. 600m², 2 acres" data-ghl="{{contact.property_size}}"></div>
    <div class="field"><label for="${id}-service">Service Needed</label><select id="${id}-service" name="service_needed" required data-ghl="{{contact.service_needed}}"><option value="" selected disabled>Select a service</option>${formServices.map(s => `<option value="${attr(s)}">${esc(s)}</option>`).join('')}</select></div>
    <div class="field full"><label for="${id}-notes">Job Notes</label><textarea id="${id}-notes" name="job_notes" placeholder="Tell us about the job, access, timing…" data-ghl="{{contact.job_notes}}"></textarea></div>
    <div class="field full"><button class="btn btn-primary btn-lg" type="submit" style="width:100%">Send My Quote Request</button></div>
  </div>
  <p class="form-note">No obligation. Josh replies personally, usually the same business day.</p>
</form>`;
}

function head({ title, description, canonical, robots, ogImage, preload, schema }) {
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${canonical}">
${robots ? `<meta name="robots" content="${robots}">` : ''}
<meta name="theme-color" content="#212832">
<meta property="og:type" content="website"><meta property="og:site_name" content="${site.name}"><meta property="og:title" content="${attr(title)}"><meta property="og:description" content="${attr(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${asset(ogImage + '.webp', true)}"><meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="${asset('logo-128.png')}" type="image/png"><link rel="apple-touch-icon" href="${asset('logo-512.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${preload ? `<link rel="preload" as="image" href="${asset(preload + '.webp')}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600;700&display=swap" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600;700&display=swap"></noscript>
<style>${css}</style>
<script
  src="https://link.msgsndr.com/js/external-tracking.js"
  data-tracking-id="${site.trackingId}">
</script>
${schema.map(jsonld).join('\n')}
</head>`;
}

/* ---------- schema ---------- */
const BIZ_ID = site.url + '/#business';
const localBusiness = () => ({
  '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': BIZ_ID,
  name: site.name, alternateName: 'In The Mow', url: site.url + '/', telephone: site.phoneTel, email: site.email,
  image: asset('logo-512.png', true), logo: asset('logo-512.png', true),
  description: "Lawn mowing, acreage slashing, reticulation repairs and installation, turf installation, lawn health and garden maintenance across Perth's South-East corridor and the Peel region, from Canning Vale to Mandurah.",
  founder: { '@type': 'Person', name: site.owner }, slogan: site.tagline,
  address: { '@type': 'PostalAddress', addressLocality: site.locality, addressRegion: site.region, postalCode: site.postcode, addressCountry: site.country },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }],
  openingHours: site.openingHours,
  areaServed: allSuburbs.map(n => ({ '@type': 'City', name: n, containedInPlace: { '@type': 'State', name: 'Western Australia' } })),
  sameAs: [site.gbp, site.facebook],
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Lawn and garden services', itemListElement: services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.nav, url: `${site.url}/${s.slug}` } })) }
});
const faqSchema = faqs => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
const breadcrumb = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: it[1] })) });
const serviceSchema = s => ({ '@context': 'https://schema.org', '@type': 'Service', '@id': `${site.url}/${s.slug}#service`, name: s.nav, serviceType: s.schemaType, url: `${site.url}/${s.slug}`, description: s.description, image: asset(`${s.hero.img}.webp`, true), provider: { '@id': BIZ_ID }, areaServed: s.suburbs.map(n => ({ '@type': 'City', name: n })), availableChannel: { '@type': 'ServiceChannel', servicePhone: { '@type': 'ContactPoint', telephone: site.phoneTel, contactType: 'customer service', areaServed: 'AU', availableLanguage: 'en' } } });

/* ---------- pages ---------- */
const faqHtml = (faqs, cls = '') => `<div class="faq ${cls}">${faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary><h3 style="display:inline;font:inherit">${esc(f.q)}</h3></summary><div class="a"><p>${esc(f.a)}</p></div></details>`).join('')}</div>`;

function homePage() {
  const h = home;
  const body = `${header('/')}
<main id="main">
<section class="hero hero-home">
  <div class="hero-bg"${h.video ? ` data-hero-video data-poster="${asset(h.video.poster + '.webp')}" data-sources="${[h.video.webm, h.video.mp4].filter(f => existsSync(path.join(out, 'images', f)) || cdn[f]).map(f => asset(f)).join(',')}"` : ''}>${img(h.video ? h.video.poster : h.hero.img, h.video ? h.video.alt : h.hero.alt, { eager: true, sizes: '100vw' })}</div>
  <div class="container">
    <div>
      <p class="hero-pill">${iconSolid('pin', 'currentColor')}Byford WA · Canning Vale to Mandurah</p>
      <h1>${esc(h.h1).replace(' — ', ' — <em>').replace(/$/, '</em>')}</h1>
      <p class="lead">${esc(h.lead)}</p>
      <div class="hero-cta">${phoneLink('btn btn-primary btn-lg', 'Call ' + site.phone)}<a class="btn btn-outline btn-lg" href="#quote" data-quote-open>Get a Free Quote</a></div>
    </div>
    <ul class="trust hero-trust">${h.trust.map(t => `<li>${iconSolid('check', '#8dc81b')}${esc(t)}</li>`).join('')}</ul>
  </div>
</section>
<nav class="svc-strip" aria-label="Services"><div class="container">${services.map(s => `<a href="/${s.slug}">${icon(s.icon)}${esc(s.nav)}</a>`).join('')}</div></nav>

<section class="section" id="services"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">Our services</p><h2>Lawn, Retic, Turf &amp; Garden Services</h2><span class="rule center"></span><p class="lead">${esc(h.servicesLead)}</p></div>
  <div class="grid grid-3">${services.map((s, i) => `<article class="card reveal" style="transition-delay:${i * 60}ms"><div class="ph">${img(s.hero.img, s.hero.alt)}</div><div class="ic">${icon(s.icon)}</div><div class="body"><h3><a href="/${s.slug}">${esc(s.nav)}</a></h3><p>${esc(s.short)}</p><span class="more">Learn more ${iconSolid('arrow', 'currentColor')}</span></div></article>`).join('')}</div>
</div></section>

<section class="section section-dark on-dark" id="about"><div class="container feature">
  <div class="media reveal">${img(h.about.img, h.about.alt, { sizes: '(min-width: 900px) 560px, 100vw' })}</div>
  <div class="reveal"><p class="eyebrow">About In The Mow Lawncare</p><h2>Locally Owned, Not a Franchise</h2><span class="rule"></span>${h.about.paras.map(p => `<p class="lead">${esc(p)}</p>`).join('')}
    <ul class="checks">${h.about.points.map(([t, d]) => `<li>${icon('check')}<div><strong>${esc(t)}</strong><span>${esc(d)}</span></div></li>`).join('')}</ul>
    <div class="hero-cta">${phoneLink('btn btn-primary', 'Call ' + site.phone)}<a class="btn btn-outline" href="/about">More About Us</a></div>
  </div>
</div></section>

<section class="section section-grey" id="results"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Before &amp; after</p><h2>Real Jobs, Real Results</h2><span class="rule"></span><p class="lead">Drag the slider. Every pair below is a real job, from lawn mowing Byford verges to full garden makeovers across Perth's South-East.</p></div>
  <div class="grid grid-3">${beforeAfter.map((b, i) => `<div class="reveal" style="transition-delay:${i * 60}ms"><div class="ba">${img(b.before, b.altB, { cls: 'before', sizes: '(min-width: 1000px) 370px, (min-width: 640px) 50vw, 100vw' })}${img(b.after, b.altA, { cls: 'after', sizes: '(min-width: 1000px) 370px, (min-width: 640px) 50vw, 100vw' })}<span class="lbl lbl-b">Before</span><span class="lbl lbl-a">After</span><div class="handle"></div><input type="range" min="0" max="100" value="50" aria-label="Compare before and after: ${attr(b.cap)}"></div><p class="ba-cap">${esc(b.cap)}</p></div>`).join('')}</div>
</div></section>

<section class="section" id="reviews"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">Google reviews</p><h2>What Customers Say</h2><span class="rule center"></span><p class="lead">Real reviews from In The Mow Lawncare's Google Business Profile, quoted as written.</p></div>
  <div class="grid grid-3">${reviews.map((r, i) => `<article class="review reveal" style="transition-delay:${i * 50}ms"><div class="stars" aria-label="5 out of 5 stars">${star}${star}${star}${star}${star}</div><p>“${esc(r.text)}”</p><footer><span class="av" aria-hidden="true">${r.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><span><strong>${esc(r.name)}</strong><br><time datetime="${r.date}">${r.dateText}</time> · Google</span></footer></article>`).join('')}</div>
  <div style="text-align:center"><a class="g-link" href="${site.gbp}" target="_blank" rel="noopener">Read more reviews on Google ${iconSolid('arrow', 'currentColor').replace('<svg', '<svg style="width:18px;height:18px"')}</a></div>
</div></section>

<section class="section section-dark on-dark" id="areas"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Service areas</p><h2>Service Areas Across Perth's South-East &amp; Peel</h2><span class="rule"></span><p class="lead">${esc(h.areasIntro)}</p></div>
  <div class="areas-grid">
    <div class="map-wrap reveal">${mapSvg()}<div class="map-legend"><span><i></i>Coastline &amp; scarp</span><span><i class="road"></i>Freeway &amp; highway</span><span><i style="background:#8dc81b;width:8px;height:8px;border-radius:50%"></i>Suburb serviced</span></div></div>
    <div class="reveal"><p class="lead">${esc(h.areasPara)}</p><div class="suburbs">${regions.map(r => `<div><h3>${esc(r.name)}</h3><p>${r.suburbs.map(s => esc(s[0])).join(', ')}</p></div>`).join('')}</div><p style="margin-top:20px"><a class="btn btn-outline" href="/service-areas">Full service areas guide ${iconSolid('arrow', 'currentColor')}</a></p></div>
  </div>
</div></section>

<section class="section" id="faq"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">FAQ</p><h2>Frequently Asked Questions</h2><span class="rule center"></span></div>
  ${faqHtml(homeFaqs, 'reveal')}
</div></section>

<section class="section section-dark on-dark" id="quote"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Contact</p><h2>Get a Free Quote</h2><span class="rule"></span><p class="lead">${esc(h.contactIntro)}</p></div>
  <div class="contact-grid">
    <div class="reveal">${quoteForm('quote-form')}</div>
    <div class="reveal">
      <div class="contact-info">
        <div class="row">${icon('phone')}<div><a href="tel:${site.phoneTel}">${site.phone}</a><span>Click to call. ${site.hoursText}</span></div></div>
        <div class="row">${icon('mail')}<div><a href="mailto:${site.email}">${site.email}</a><span>Send photos of the job for a faster quote</span></div></div>
        <div class="row">${icon('pin')}<div><a href="${site.gbp}" target="_blank" rel="noopener">Byford WA 6122</a><span>Service-area business covering Perth's South-East corridor and Peel. Find us on Google.</span></div></div>
        <div class="row">${icon('clock')}<div><strong style="color:#fff">${site.hoursText}</strong><span>Messages and form enquiries outside these hours are answered the next business day.</span></div></div>
      </div>
      <div class="gmap" style="margin-top:24px">${site.gbpEmbed}</div>
    </div>
  </div>
</div></section>
</main>
${footer(false)}
${stickyBar('#quote')}
${GRAD}
<script>${js}</script>
</body></html>`;
  return head({ title: h.title, description: h.description, canonical: site.url + '/', ogImage: h.hero.img, preload: h.hero.img, schema: [localBusiness(), faqSchema(homeFaqs), { '@context': 'https://schema.org', '@type': 'WebSite', url: site.url + '/', name: site.name, publisher: { '@id': BIZ_ID } }] }) + '\n<body>\n' + body;
}

function servicePage(s) {
  const rel = s.related.map(r => services.find(x => x.slug === r));
  const body = `${header('/' + s.slug)}
<main id="main">
<section class="hero hero-inner"><div class="container">
  <div>
    <ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Home</a></li><li><a href="/#services">Services</a></li><li aria-current="page">${esc(s.nav)}</li></ol>
    <h1>${esc(s.h1)}</h1>
    <p class="lead">${esc(s.lead)}</p>
    <div class="hero-cta">${phoneLink('btn btn-primary btn-lg', 'Call ' + site.phone)}<a class="btn btn-outline btn-lg" href="#quote" data-quote-open>Get a Free Quote</a></div>
    <ul class="trust"><li>${iconSolid('check', '#8dc81b')}Locally owned, Byford based</li><li>${iconSolid('check', '#8dc81b')}Free, no-obligation quotes</li><li>${iconSolid('check', '#8dc81b')}One crew for mowing, retic, turf &amp; gardens</li></ul>
  </div>
  <div class="hero-media">${img(s.hero.img, s.hero.alt, { eager: true, sizes: '(min-width: 900px) 520px, 100vw' })}${s.hero.gen ? '<div class="hero-badge">Illustrative image</div>' : ''}</div>
</div></section>

<section class="section"><div class="container two-col">
  <div class="prose">
    ${s.intro.map(p => `<p class="lead">${esc(p)}</p>`).join('')}
    ${s.sections.map((sec, i) => `<div class="reveal" style="margin-top:40px"><h2>${esc(sec.h2)}</h2><span class="rule"></span>${sec.img ? `<figure style="margin:0 0 20px">${img(sec.img, sec.alt, { sizes: '(min-width: 960px) 720px, 100vw', cls: 'feature-img' })}${sec.gen ? genNote : ''}</figure>` : ''}${sec.paras.map(p => `<p>${esc(p)}</p>`).join('')}${sec.bullets.length ? `<ul class="checks">${sec.bullets.map(b => `<li>${icon('check')}<span style="color:var(--text)">${esc(b)}</span></li>`).join('')}</ul>` : ''}</div>`).join('')}
    <div class="reveal" style="margin-top:40px"><h2>Where We Offer ${esc(s.nav)}</h2><span class="rule"></span><p>${esc(s.nav)} is available across ${s.suburbs.slice(0, -1).join(', ')} and ${s.suburbs.slice(-1)}, and throughout the rest of Perth's South-East corridor and the Peel region. See the <a href="/#areas">full service-area list</a> or <a href="/">return to the home page</a>.</p></div>
  </div>
  <aside class="aside">
    <div id="quote">${quoteForm('quote-' + s.slug, true)}</div>
    <div class="related"><h3>Related services</h3>${rel.map(r => `<a href="/${r.slug}">${icon(r.icon)}${esc(r.nav)}</a>`).join('')}<a href="/">${icon('pin')}All services &amp; service areas</a></div>
  </aside>
</div></section>

<section class="section section-grey"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Recent work</p><h2>${esc(s.nav)} Photos</h2><span class="rule"></span></div>
  <div class="gallery reveal">${s.gallery.map(g => `<figure>${img(g.img, g.alt)}<figcaption>${esc(g.alt)}${g.gen ? ' (illustrative image)' : ''}</figcaption></figure>`).join('')}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">FAQ</p><h2>${esc(s.nav)} Questions</h2><span class="rule"></span></div>
  ${faqHtml(s.faqs, 'reveal')}
</div></section>

<section class="cta-band"><div class="container"><div><h2>Need ${esc(s.nav.toLowerCase())} sorted?</h2><p>Call Josh now or send the form and we will come back to you with a price.</p></div><div class="hero-cta" style="margin:0">${phoneLink('btn btn-primary', 'Call ' + site.phone)}<a class="btn btn-outline-dark" href="#quote" data-quote-open>Get a Free Quote</a></div></div></section>
</main>
${footer(true)}
${stickyBar('#quote')}
${GRAD}
<script>${js}</script>
</body></html>`;
  return head({ title: s.title, description: s.description, canonical: `${site.url}/${s.slug}`, ogImage: s.hero.img, preload: s.hero.img, schema: [localBusiness(), serviceSchema(s), breadcrumb([['Home', site.url + '/'], [s.nav, `${site.url}/${s.slug}`]]), faqSchema(s.faqs)] }) + '\n<body>\n' + body;
}


/* ---------- About ---------- */
function aboutPage() {
  const a = about; const cur = '/about';
  const body = `${header(cur)}
<main id="main">
<section class="hero hero-inner page-hero"><div class="container">
  <div>
    <ol class="crumbs"><li><a href="/">Home</a></li><li aria-current="page">About</li></ol>
    <p class="eyebrow">Locally owned · Byford WA 6122</p>
    <h1>${esc(a.h1).replace(' — ', ' — <em>').replace(/$/, '</em>')}</h1>
    <p class="lead">${esc(a.lead)}</p>
    <div class="hero-cta">${phoneLink('btn btn-primary btn-lg', 'Call ' + site.phone)}<a class="btn btn-outline btn-lg" href="/contact" data-quote-open>Get a Free Quote</a></div>
  </div>
  <div class="hero-media">${img(a.hero.img, a.hero.alt, { eager: true, sizes: '(min-width: 900px) 520px, 100vw' })}<div class="hero-badge">${iconSolid('pin', '#8dc81b')}Owner-operated by Joshua Patriarca</div></div>
</div></section>

<section class="section"><div class="container feature">
  <div class="reveal"><p class="eyebrow">Our story</p><h2>${esc(a.story.h2)}</h2><span class="rule"></span>${a.story.paras.map(p => `<p>${esc(p)}</p>`).join('')}
    <div class="owner-card"><span class="av" aria-hidden="true">JP</span><div><strong>${esc(site.owner)}</strong><span>Owner &amp; operator, In The Mow Lawncare, Byford WA</span></div></div>
  </div>
  <div class="media reveal">${img(a.story.img, a.story.alt, { sizes: '(min-width: 900px) 560px, 100vw' })}</div>
</div></section>

<section class="section section-grey"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">Why people stick with us</p><h2>What You Can Expect</h2><span class="rule center"></span></div>
  <div class="values">${a.values.map(([t, d], i) => `<div class="value reveal" style="transition-delay:${i * 50}ms">${icon(['pin', 'mower', 'rideon', 'clock', 'check', 'phone'][i])}<h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
</div></section>

<section class="section"><div class="container feature flip">
  <div class="reveal"><p class="eyebrow">The gear</p><h2>${esc(a.equipment.h2)}</h2><span class="rule"></span>${a.equipment.paras.map(p => `<p>${esc(p)}</p>`).join('')}
    <div class="hero-cta">${services.slice(0, 3).map(s => `<a class="btn btn-outline-dark" href="/${s.slug}">${esc(s.nav)}</a>`).join('')}</div>
  </div>
  <div class="media reveal">${img(a.equipment.img, a.equipment.alt, { sizes: '(min-width: 900px) 560px, 100vw' })}</div>
</div></section>

<section class="section section-dark on-dark"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Simple process</p><h2>${esc(a.process.h2)}</h2><span class="rule"></span></div>
  <div class="steps">${a.process.steps.map(([t, d], i) => `<div class="step reveal" style="transition-delay:${i * 60}ms"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Our work</p><h2>Real Jobs Across Perth's South-East</h2><span class="rule"></span></div>
  <div class="gallery reveal">${a.gallery.map(g => `<figure>${img(g.img, g.alt)}<figcaption>${esc(g.alt)}</figcaption></figure>`).join('')}</div>
</div></section>

<section class="section section-grey" id="reviews"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">Google reviews</p><h2>What Customers Say</h2><span class="rule center"></span></div>
  <div class="grid grid-3">${reviews.slice(0, 3).map((r, i) => `<article class="review reveal" style="transition-delay:${i * 50}ms"><div class="stars" aria-label="5 out of 5 stars">${star}${star}${star}${star}${star}</div><p>“${esc(r.text)}”</p><footer><span class="av" aria-hidden="true">${r.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><span><strong>${esc(r.name)}</strong><br><time datetime="${r.date}">${r.dateText}</time> · Google</span></footer></article>`).join('')}</div>
  <div style="text-align:center"><a class="g-link" href="${site.gbp}" target="_blank" rel="noopener">Read more reviews on Google ${iconSolid('arrow', 'currentColor').replace('<svg', '<svg style="width:18px;height:18px"')}</a></div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">FAQ</p><h2>About In The Mow Lawncare</h2><span class="rule center"></span></div>
  ${faqHtml(a.faqs, 'reveal')}
</div></section>

<section class="cta-band"><div class="container"><div><h2>Want the owner on the job?</h2><p>Call Josh now or send the form and we will come back to you with a price.</p></div><div class="hero-cta" style="margin:0">${phoneLink('btn btn-primary', 'Call ' + site.phone)}<a class="btn btn-outline-dark" href="/contact" data-quote-open>Get a Free Quote</a></div></div></section>
</main>
${footer(false)}
${stickyBar('/contact')}
${GRAD}
<script>${js}</script>
</body></html>`;
  return head({ title: a.title, description: a.description, canonical: `${site.url}/${a.slug}`, ogImage: a.hero.img, preload: a.hero.img, schema: [localBusiness(), breadcrumb([['Home', site.url + '/'], ['About', `${site.url}/${a.slug}`]]), { '@context': 'https://schema.org', '@type': 'AboutPage', url: `${site.url}/${a.slug}`, name: a.title, about: { '@id': BIZ_ID } }, faqSchema(a.faqs)] }) + '\n<body>\n' + body;
}

/* ---------- Service Areas ---------- */
function serviceAreasPage() {
  const p = areasPage; const cur = '/service-areas';
  const body = `${header(cur)}
<main id="main">
<section class="hero hero-inner page-hero"><div class="container" style="grid-template-columns:1fr">
  <div>
    <ol class="crumbs"><li><a href="/">Home</a></li><li aria-current="page">Service Areas</li></ol>
    <p class="eyebrow">6 regions · ${allSuburbs.length} suburbs</p>
    <h1>${esc(p.h1).replace(' — ', ' — <em>').replace(/$/, '</em>')}</h1>
    <p class="lead">${esc(p.lead)}</p>
    <div class="hero-cta">${phoneLink('btn btn-primary btn-lg', 'Call ' + site.phone)}<a class="btn btn-outline btn-lg" href="/contact" data-quote-open>Get a Free Quote</a></div>
  </div>
</div></section>

<section class="section section-dark on-dark" id="map"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Interactive map</p><h2>Where the Mower Goes</h2><span class="rule"></span><p class="lead">${esc(p.mapIntro)}</p></div>
  <div class="areas-grid">
    <div class="map-wrap reveal">${mapSvg()}<div class="map-legend"><span><i></i>Coastline &amp; scarp</span><span><i class="road"></i>Freeway &amp; highway</span><span><i style="background:#8dc81b;width:8px;height:8px;border-radius:50%"></i>Suburb serviced</span></div></div>
    <div class="reveal"><p class="lead">${esc(home.areasPara)}</p><div class="suburbs">${regions.map(r => `<div><h3><a href="#${slugify(r.name)}" style="color:#fff">${esc(r.name)}</a></h3><p>${r.suburbs.map(s => esc(s[0])).join(', ')}</p></div>`).join('')}</div></div>
  </div>
</div></section>

<section class="section section-grey"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Region by region</p><h2>What We Do in Each Area</h2><span class="rule"></span></div>
  <div class="region-grid">${regions.map((r, i) => { const d = p.regions[r.name]; return `<article class="region reveal" id="${slugify(r.name)}" style="transition-delay:${i * 50}ms"><h3>${esc(r.name)}</h3><span class="rule"></span><p>${esc(d.blurb)}</p><p class="subs"><strong>Suburbs:</strong> ${r.suburbs.map(s => esc(s[0])).join(', ')}</p><div class="tags">${d.services.map(sl => { const sv = services.find(x => x.slug === sl); return `<a href="/${sv.slug}">${esc(sv.nav)}</a>`; }).join('')}</div></article>`; }).join('')}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head center reveal"><p class="eyebrow">FAQ</p><h2>Service Area Questions</h2><span class="rule center"></span></div>
  ${faqHtml(p.faqs, 'reveal')}
</div></section>

<section class="cta-band"><div class="container"><div><h2>In one of these suburbs?</h2><p>Call Josh now or send the form and we will come back to you with a price.</p></div><div class="hero-cta" style="margin:0">${phoneLink('btn btn-primary', 'Call ' + site.phone)}<a class="btn btn-outline-dark" href="/contact" data-quote-open>Get a Free Quote</a></div></div></section>
</main>
${footer(true)}
${stickyBar('/contact')}
${GRAD}
<script>${js}</script>
</body></html>`;
  return head({ title: p.title, description: p.description, canonical: `${site.url}/${p.slug}`, ogImage: home.about.img, schema: [localBusiness(), breadcrumb([['Home', site.url + '/'], ['Service Areas', `${site.url}/${p.slug}`]]), faqSchema(p.faqs)] }) + '\n<body>\n' + body;
}

/* ---------- Contact ---------- */
function contactPageHtml() {
  const c = contactPage; const cur = '/contact';
  const body = `${header(cur)}
<main id="main">
<section class="hero hero-inner page-hero"><div class="container" style="grid-template-columns:1fr">
  <div>
    <ol class="crumbs"><li><a href="/">Home</a></li><li aria-current="page">Contact</li></ol>
    <p class="eyebrow">Free quotes · ${site.hoursText}</p>
    <h1>${esc(c.h1).replace(' — ', ' — <em>').replace(/$/, '</em>')}</h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="hero-cta">${phoneLink('btn btn-primary btn-lg', 'Call ' + site.phone)}<a class="btn btn-outline btn-lg" href="mailto:${site.email}">${iconSolid('mail', 'currentColor')}Email Us</a></div>
  </div>
</div></section>

<section class="section section-dark on-dark contact-page" id="quote"><div class="container">
  <div class="contact-grid">
    <div class="reveal">${quoteForm('quote-form')}</div>
    <div class="reveal">
      <div class="contact-info">
        <div class="row">${icon('phone')}<div><a href="tel:${site.phoneTel}">${site.phone}</a><span>Click to call. Fastest for urgent jobs.</span></div></div>
        <div class="row">${icon('mail')}<div><a href="mailto:${site.email}">${site.email}</a><span>Send photos of the job for a faster quote</span></div></div>
        <div class="row">${icon('pin')}<div><a href="${site.gbp}" target="_blank" rel="noopener">Byford WA 6122</a><span>Service-area business covering Perth's South-East corridor and Peel. Find us on Google.</span></div></div>
        <div class="row">${icon('clock')}<div><dl class="hours"><dt>Mon – Fri</dt><dd>9:00am – 5:00pm</dd><dt>Sat – Sun</dt><dd>Closed (messages answered next business day)</dd></dl></div></div>
        <div class="row"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="color:#8dc81b"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8z"/></svg><div><a href="${site.facebook}" target="_blank" rel="noopener">In The Mow Lawncare on Facebook</a><span>Recent jobs and seasonal updates</span></div></div>
      </div>
      <div class="gmap" style="margin-top:24px">${site.gbpEmbed}</div>
    </div>
  </div>
</div></section>

<section class="section"><div class="container contact-page">
  <div class="two-col" style="display:grid;gap:32px">
    <div class="reveal"><p class="eyebrow">Before you send</p><h2>${esc(c.tips.h2)}</h2><span class="rule"></span><ul style="margin:0;padding:0;list-style:none;display:grid;gap:12px">${c.tips.items.map(t => `<li style="display:flex;gap:10px;align-items:flex-start">${icon('check').replace('<svg', '<svg style="width:22px;height:22px;flex:none;margin-top:2px"')}<span>${esc(t)}</span></li>`).join('')}</ul></div>
    <div class="reveal"><p class="eyebrow">FAQ</p><h2>Contact Questions</h2><span class="rule"></span>${faqHtml(c.faqs)}</div>
  </div>
</div></section>
</main>
${footer(false)}
${stickyBar('#quote')}
${GRAD}
<script>${js}</script>
</body></html>`;
  return head({ title: c.title, description: c.description, canonical: `${site.url}/${c.slug}`, ogImage: home.about.img, schema: [localBusiness(), breadcrumb([['Home', site.url + '/'], ['Contact', `${site.url}/${c.slug}`]]), { '@context': 'https://schema.org', '@type': 'ContactPage', url: `${site.url}/${c.slug}`, name: c.title, about: { '@id': BIZ_ID } }, faqSchema(c.faqs)] }) + '\n<body>\n' + body;
}
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function simplePage({ slug, title, description, h1, html, robots }) {
  const body = `${header('/' + slug)}<main id="main"><section class="section"><div class="container center-page">${html.replace('{{H1}}', `<h1>${esc(h1)}</h1>`)}</div></section></main>${footer(false)}${stickyBar('/contact')}${GRAD}<script>${js}</script></body></html>`;
  return head({ title, description, canonical: `${site.url}/${slug}`, ogImage: home.hero.img, robots, schema: [localBusiness(), breadcrumb([['Home', site.url + '/'], [h1, `${site.url}/${slug}`]])] }) + '\n<body>\n' + body;
}

/* ---------- write ---------- */
writeFileSync(path.join(out, 'index.html'), homePage());
services.forEach(s => writeFileSync(path.join(out, `${s.slug}.html`), servicePage(s)));
writeFileSync(path.join(out, 'about.html'), aboutPage());
writeFileSync(path.join(out, 'service-areas.html'), serviceAreasPage());
writeFileSync(path.join(out, 'contact.html'), contactPageHtml());
writeFileSync(path.join(out, 'thank-you.html'), simplePage({ slug: 'thank-you', title: 'Thanks – We Have Your Quote Request | In The Mow', description: 'Your quote request has been sent to In The Mow Lawncare. Josh will be in touch shortly.', h1: 'Thanks, Your Quote Request Is In', robots: 'noindex, nofollow',
  html: `<div class="big-tick">${icon('check')}</div>{{H1}}<p class="lead" id="ty-name">Thanks!</p><p class="lead">Josh will look at the details and come back to you, usually the same business day. If the job is urgent, like a retic fault or a block that needs slashing before fire season, call now.</p><div class="hero-cta" style="justify-content:center">${phoneLink('btn btn-primary btn-lg', 'Call ' + site.phone)}<a class="btn btn-outline-dark btn-lg" href="/">Back to home</a></div>` }));
writeFileSync(path.join(out, '404.html'), simplePage({ slug: '404', title: 'Page Not Found | In The Mow', description: 'That page does not exist. Head back to In The Mow Lawncare.', h1: 'Page Not Found', robots: 'noindex, nofollow',
  html: `{{H1}}<p class="lead">That page has moved or never existed. Try one of our services or head back home.</p><div class="hero-cta" style="justify-content:center">${services.map(s => `<a class="btn btn-outline-dark" href="/${s.slug}">${esc(s.nav)}</a>`).join('')}</div>` }));
writeFileSync(path.join(out, 'blog.html'), simplePage({ slug: 'blog', title: 'Lawn Care Tips for Perth | In The Mow Blog', description: "Seasonal lawn mowing, reticulation and lawn care advice for Perth's South-East from In The Mow Lawncare.", h1: 'Lawn Care Tips for Perth', robots: 'noindex, follow',
  html: `{{H1}}<p class="lead">Practical, WA-specific advice from the crew is on its way. First up: what lawn mowing costs in Perth, how often to mow through the year, what it costs to fix reticulation, and what your retic controller should be set to for your watering days.</p><p>In the meantime, the <a href="/#faq">FAQ on the home page</a> answers the questions we get asked most.</p><div class="hero-cta" style="justify-content:center">${phoneLink('btn btn-primary', 'Call ' + site.phone)}<a class="btn btn-outline-dark" href="/contact" data-quote-open>Get a Free Quote</a></div>` }));
writeFileSync(path.join(out, 'privacy.html'), simplePage({ slug: 'privacy', title: 'Privacy Policy | In The Mow', description: 'How In The Mow Lawncare handles enquiry details.', h1: 'Privacy Policy', robots: 'noindex, follow',
  html: `{{H1}}<div style="text-align:left"><p>In The Mow Lawncare collects the details you enter in the quote form (name, phone, email, property address, property size, service needed and job notes) and standard website analytics in order to respond to your enquiry and run the business. Details are stored in our customer management system and are not sold or shared with third parties except the service providers that host that system. You can ask us to update or delete your details at any time by emailing <a href="mailto:${site.email}">${site.email}</a>.</p></div>` }));

// sitemap + robots
const urls = ['/', ...services.map(s => '/' + s.slug), '/about', '/service-areas', '/contact'];
writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${site.url}${u}</loc><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log('built', urls.length + 5, 'pages;', cdnUsed ? `${cdnUsed} asset references served from CDN (run npm run images to self-host)` : 'all assets self-hosted');
