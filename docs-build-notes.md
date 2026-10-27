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

## Hero video
- Homepage hero is a 6-second Higgsfield Kling 4.0 clip (reference-to-video) built from Josh's About photo (identity) and the real block-slashing job photo (scene): `hero-video.mp4` 1.1 MB / `hero-video.webm` 2.2 MB, 1280×720, muted loop. The poster frame (`hero-video-poster.webp`) is the LCP image; the clip only loads after `window.load` and is skipped under prefers-reduced-motion, Data Saver or 2G.
- This is AI-generated footage of the owner: Josh should approve it before launch.

## QA (Playwright, stand-in images of identical dimensions/bytes)
- Desktop 1440px and mobile 375px: header, Services dropdown (hover + tap), animated service-area map (mower moves, labels light up, reduced-motion fallback), GBP iframe present, quote form submits and redirects to /thank-you.
- Mobile LCP (Slow-4G-style throttle, 4x CPU): homepage 780 ms (LCP element is the hero paragraph; hero image is below the text on mobile), /lawn-mowing 400 ms.

## Images on Vercel / Netlify (CDN fallback)

The photo bundle is not committed to the repo. `src/cdn.json` maps every referenced file (WebP + 600px
variants, logos, hero poster, hero MP4) to a public CDN copy. `scripts/build.mjs` uses the local
`/images/<file>` path when the file exists in `public/images`, otherwise the CDN URL, so a plain
`npm run build` deploys with working images. To self-host instead, run `npm run images` then
`npm run build`; the build prints how many references still come from the CDN (0 = fully self-hosted).
The WebM hero source is only emitted when it exists locally (the CDN copy is MP4 only).

## Standalone pages

- `/about` — owner story, values, equipment, process, gallery, 3 reviews, FAQ (AboutPage + BreadcrumbList + FAQPage schema).
- `/service-areas` — animated map, region-by-region blurbs with linked services, full suburb list, FAQ.
- `/contact` — quote form, contact details, hours, GBP embed, tips, FAQ (ContactPage schema).
Header nav is now Home · Services ▾ · About · Service Areas · Contact. Pages without an on-page form link
their quote CTAs to `/contact`.

## Homepage hero (v2)

Full-bleed hero: the video poster (then the muted MP4 after `load`) sits behind a charcoal gradient,
H1/lead/CTAs on the left and a compact "Quick Quote" form card at ≥1024px (hidden on mobile, where the
main form at `#quote` is used). A six-service icon strip sits directly beneath.
