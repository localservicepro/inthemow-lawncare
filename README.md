# In The Mow Lawncare — website

Static rebuild of https://inthemowlawncare.com.au (lawn mowing, reticulation, turf & garden maintenance, Byford WA).
No framework: `src/` holds the copy, styles and JS; `scripts/build.mjs` generates `public/`, which is the deploy root.

## Commands

| Command | What it does |
| --- | --- |
| `npm run build` | Regenerates `public/*.html` from `src/content.mjs`, `src/styles.css`, `src/main.js` |
| `npm run images` | Downloads the optimised photo set (WebP, ≤1200px q70 + 600px variants) into `public/images/` |
| `npm run images -- --from-drive` | Same, but re-optimises from the originals in the client's Google Drive folder (needs `npm i sharp`) |
| `npm run check` | SEO checks: one H1 per page, homepage H1/title/description verbatim, keyword density, no street address, schema sanity |
| `npm run serve` | Local server with clean URLs and the production 301s |
| `node scripts/qa.mjs` | Playwright QA: 375px + desktop screenshots, dropdown, map, form, mobile LCP |

## Hosting

Deploy `public/`. `vercel.json`, `netlify.toml` and `public/_redirects` carry the clean URLs and the 301s
(`/home → /`, `/landscape-design → /turf-installation`). Pages keep the existing URLs: `/lawn-mowing`,
`/garden-maintenance`, `/acreage-mowing`, `/blog`; new: `/reticulation`, `/turf-installation`, `/lawn-renovation`, `/thank-you`.

## Images

`src/images.json` is the manifest: every photo's source (Google Drive file id, or a Higgsfield result URL for the
generated gap images), dimensions and optimised byte sizes. `public/images/` is populated by `npm run images`.
Blur-up placeholders are inlined in the HTML so pages never show empty boxes while photos load.
