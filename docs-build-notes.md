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

Desktop (≥1024px): the video poster (then the muted MP4 after `load`) sits behind a charcoal gradient
with H1/lead/CTAs on the left. Below 1024px the video becomes a short in-flow strip above the H1 so the
H1, lead and both buttons fit in the first screen at 375×740. Call and quote buttons sit side by side.
A six-service icon strip sits directly beneath the hero. There is no fixed bottom bar.

## Quote popup

Every "Get a (Free) Quote" button carries `data-quote-open` and opens `#quote-modal` (the same quote form,
rendered once per page in `footer()`), a bottom sheet on phones and a centred dialog from 640px. The
href (`#quote` or `/contact`) remains as the no-JS fallback. Esc, the close button and the backdrop
close it; submission follows the normal form flow to `/thank-you`. The mobile header shows a
"Get a Quote" button instead of the phone icon; the phone number stays in the hero, footer and
desktop header.

## Service page heroes (v2)

Hero image column is a full-height 4:3-or-taller frame beside the text (1fr/1fr from 900px) with a gradient
backplate. Each service hero has a 1600px `-1600.webp` variant on the CDN (`src/cdn.json`), which `img()`
appends to the srcset automatically whenever `<slug>-1600.webp` exists locally or on the CDN. The three
lowest-resolution sources (gen-1, garden-maintenance, lawn-aeration-vertimowing) were upscaled with
Higgsfield before re-encoding. Visible "Illustrative image" labels have been removed; AI-generated images are
still flagged with `gen: true` in `src/content.mjs` and in the manifest for the record.

## Client feedback round (Josh): services and wording

- Services are now eight: Lawn Mowing, Reticulation, Acreage, Garden Maintenance, Landscaping & Turf (`/landscaping`,
  replaces `/turf-installation`), Lawn Health, Mini Earthworks (`/earthworks`) and Commercial & Tenders (`/commercial`).
- `/turf-installation` and `/landscape-design` both 301 to `/landscaping` (vercel.json, netlify.toml, `_redirects`, serve.mjs).
- Homepage has a Commercial & Tenders callout between the services grid and the about section; services grid is 4 across from 1100px;
  the icon strip uses each service's short `strip` label.
- Wording no longer implies a one-person business: "multiple crews", "one team", "Josh quotes and oversees the work".
- To confirm with Josh: the tender copy says we supply "the business documentation your panel or tender asks for"
  (insurance, ABN, safety docs), and the earthworks FAQ says we check Before You Dig Australia before digging.

## Client feedback round 3 (Josh): form, homepage, retic pricing, commercial

- Quote form: phone OR email (one required), Suburb (required, with suburb suggestions), optional street address,
  up to 5 job photos (shrunk to 1600px JPEG in the browser so a request stays under Vercel's 4.5 MB limit),
  spam honeypot. The service is preselected from the page (`formService` on each service, or `data-service`
  on a button); the commercial page relabels the popup "Request a Site Walkthrough".
- The form now POSTs to `api/quote.js` (Vercel Function). It stores photos in the Vercel Blob store
  `inthemow-quote-photos` (BLOB_READ_WRITE_TOKEN, already connected), then calls the LeadConnector API directly
  with a sub-account Private Integration Token: upsert contact, add a note with every detail and the photo links,
  then add the tag "website quote" last (tags added via the tags endpoint so existing tags are kept).
  Needs GHL_PIT_TOKEN (secret; scopes contacts.write, locations/customFields.readonly, forms.write) and GHL_LOCATION_ID in Vercel.
  Job photos are uploaded into the File Upload field "Attach a photo" ({{contact.attach_a_photo}}) via forms/upload-custom-files. Until both are set the endpoint
  returns 503 and the visitor sees a "did not send, please call or email" message rather than a false thank-you.
  Custom fields are sent by key (service_needed, property_size, property_address, job_notes, job_photos); if the CRM
  rejects them the contact is saved without them. The notification email comes from a LeadConnector workflow
  triggered by the tag "website quote".
- Local test: `npm run serve` runs the function too; without GHL_PIT_TOKEN and GHL_LOCATION_ID it answers 503.
- Homepage: shorter lead, headline second line in solid lime with a shadow, "Popular" quick links (lawn renovations,
  retic, turf and landscaping, commercial), and a before/after plus a Google review straight after the services strip.
  Service order: mowing, retic, lawn renovation, landscaping, commercial, acreage, gardens, earthworks.
- Retic: $175 fault-finding visit credited toward the repair, free quotes for new installs (pricing cards, FAQ, form note).
- Firebreak wording removed site-wide; block slashing kept. Reply wording is "We'll get back to you as soon as we can".
- Commercial page leads with Commercial Grounds Maintenance: who we work with (businesses, strata, property managers,
  local governments, government agencies), examples of sites, Request a Site Walkthrough as the main button.

## CRM: contacts only, no tracking script

- The LeadConnector external tracking script (link.msgsndr.com) is removed from every page, along with the
  `data-ghl` attributes on the form fields. Enquiries reach the CRM only through `api/quote.js`, so there is one
  contact per enquiry and no second capture. `npm run check` fails if the script is added back.
- The website never creates opportunities (the form handler only upserts the contact, uploads photos to "Job Photos",
  adds a note and adds the "website quote" tag). Opportunities are created by the LeadConnector workflow, step 3.
