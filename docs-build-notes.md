# Build notes — In The Mow Lawncare rebuild (27 Oct 2026)

## Pages
- `/` homepage (H1, title and meta description verbatim from the SEO research report; keyword "lawn mowing Byford" used 6 times, 1.28% of prose words)
- `/lawn-mowing`, `/acreage-mowing`, `/garden-maintenance` (retargeted, URLs kept)
- `/reticulation`, `/turf-installation`, `/lawn-renovation` (new)
- `/thank-you` (noindex), `/blog` (placeholder, noindex until posts are published), `/privacy`, `404`
- 301s: `/home → /`, `/landscape-design → /turf-installation` (vercel.json, netlify.toml, public/_redirects)

## Schema
LocalBusiness (service-area business: Byford WA 6122, no streetAddress, geo, Mo-Fr 09:00-17:00, 57 areaServed suburbs, sameAs GBP + Facebook) on every page;
FAQPage on the homepage and each service page; Service + BreadcrumbList on service pages.

## Images
- Real photos: 38 files from the client Google Drive "Photos" folder, optimised in a cloud sandbox to WebP ≤1200px q70 plus 600px variants (manifest in `src/images.json`).
- Generated with Higgsfield (flagged "Illustrative image" on the site): gen-1 sprinklers (retic hero), gen-2 solenoid repair, gen-3 Wi-Fi controller, gen-5 mini loader levelling, gen-6 vertimower, gen-8 fertiliser spreading.
- `npm run images` populates `public/images/`. The build sandbox could not download binaries, so the photos are not in this commit.

## QA (Playwright, stand-in images of identical dimensions/bytes)
- Desktop 1440px and mobile 375px: header, Services dropdown (hover + tap), animated service-area map (mower moves, labels light up, reduced-motion fallback), GBP iframe present, quote form submits and redirects to /thank-you.
- Mobile LCP (Slow-4G-style throttle, 4x CPU): homepage 780 ms (LCP element is the hero paragraph; hero image is below the text on mobile), /lawn-mowing 400 ms.
