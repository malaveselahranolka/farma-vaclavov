# AGENTS.md

Static one-page site (index.html, styles.css, main.js). No build.

- Preview: `node serve.mjs` → http://localhost:3000
- Screenshot: `node screenshot.mjs http://localhost:3000 <label> <width> light full|fold`
- Photos: originals in `brand_assets/`, web copies in `img/` (WebP served, JPG kept for og:image). Re-encode: sharp, `webp({quality:78})`.
- Contact form: `ENDPOINT` in `main.js` is empty → falls back to mailto. Fill in a form service URL to send directly.
- Czech copy: single-letter prepositions/conjunctions (v, a, s, k, u, o, z, i) are followed by `&nbsp;`.
- Deploy (production): Vercel project `farma-dolni-vaclavov` (team adamekfilip12-3803s-projects), domain farma-vaclavov.cz (+www). NOT git-linked: deploy with `npx vercel deploy --prod --yes --scope adamekfilip12-3803s-projects`. GitHub Pages (malaveselahranolka/farma-vaclavov) still mirrors main as an old draft URL.
- Cache: Pages sends max-age=600. Bump `?v=N` on styles.css/main.js in index.html on every CSS/JS change, else clients see stale styles.
