// Browser QA with Playwright: screenshots at 375px and 1440px, dropdown hover/tap, map animation, GBP iframe, form, LCP.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('qa', { recursive: true });
const base = process.env.BASE || 'http://localhost:8080';
const browser = await chromium.launch();
const log = (...a) => console.log(...a);
const scrollThrough = async (page) => { await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 80)); } window.scrollTo({ top: 0, behavior: 'instant' }); }); await page.waitForTimeout(900); };

// ---- Desktop ----
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let page = await ctx.newPage();
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'qa/desktop-home-top.png' });
await page.hover('.nav .has-sub button');
await page.waitForTimeout(400);
const subVisible = await page.locator('.nav .sub').first().isVisible();
log('desktop dropdown visible on hover:', subVisible);
await page.screenshot({ path: 'qa/desktop-dropdown.png', clip: { x: 0, y: 0, width: 1440, height: 420 } });
await page.locator('#areas').scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const mowerT = await page.locator('#mower').getAttribute('transform');
await page.waitForTimeout(1500);
const mowerT2 = await page.locator('#mower').getAttribute('transform');
log('map mower moving:', mowerT !== mowerT2, mowerT, '->', mowerT2);
log('lit labels after 4s:', await page.locator('.map .lbl.lit, .map .lbl.hot').count());
await page.screenshot({ path: 'qa/desktop-areas.png' });
await page.locator('#quote').scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
log('GBP iframe present:', await page.locator('#quote iframe[src*="google.com/maps/embed"]').count());
await page.screenshot({ path: 'qa/desktop-contact.png' });
await scrollThrough(page); await page.screenshot({ path: 'qa/desktop-home-full.png', fullPage: true });
await page.goto(base + '/reticulation', { waitUntil: 'networkidle' });
await scrollThrough(page); await page.screenshot({ path: 'qa/desktop-reticulation.png', fullPage: true });
await ctx.close();

// ---- Mobile 375 ----
ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: 375, height: 812 }, reducedMotion: 'no-preference' });
page = await ctx.newPage();
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'qa/mobile-home-top.png' });
await page.tap('.burger');
await page.waitForTimeout(300);
await page.tap('.mobile-menu summary');
await page.waitForTimeout(300);
log('mobile services submenu links visible:', await page.locator('.mobile-menu details[open] a').count());
await page.screenshot({ path: 'qa/mobile-menu.png' });
await page.tap('.burger');
await page.locator('#areas').scrollIntoViewIfNeeded();
await page.waitForTimeout(3000);
log('mobile minor labels hidden:', await page.locator('.map .lbl.minor').first().isHidden());
await page.screenshot({ path: 'qa/mobile-areas.png' });
await page.locator('#quote-form').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'qa/mobile-form.png' });
// fill + submit form
await page.fill('#quote-form-name', 'QA Test');
await page.fill('#quote-form-phone', '0400000000');
await page.fill('#quote-form-email', 'qa@example.com');
await page.selectOption('#quote-form-service', 'Lawn Mowing');
await page.click('#quote-form button[type=submit]');
await page.waitForURL('**/thank-you', { timeout: 5000 });
log('form redirected to:', page.url());
await page.screenshot({ path: 'qa/mobile-thankyou.png' });
await page.goto(base + '/acreage-mowing', { waitUntil: 'networkidle' });
await scrollThrough(page); await page.screenshot({ path: 'qa/mobile-acreage-full.png', fullPage: true });
await ctx.close();

// ---- Mobile LCP with throttling (Slow 4G-ish, 4x CPU) ----
ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: 375, height: 812 } });
page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.addInitScript(() => {
  window.__lcp = 0; window.__lcpEl = '';
  new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__lcp = e.startTime; window.__lcpEl = (e.element && (e.element.tagName + (e.element.className ? '.' + e.element.className : ''))) || ''; } }).observe({ type: 'largest-contentful-paint', buffered: true });
});
for (const p of ['/', '/lawn-mowing']) {
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), el: window.__lcpEl, fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0), bytes: performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || r.encodedBodySize || 0), 0) }));
  log(`LCP ${p}: ${r.lcp} ms (element ${r.el}), FCP ${r.fcp} ms, resource bytes ${r.bytes}`);
}
await browser.close();
