# AGENTS.md

Static one-page site (index.html, styles.css, main.js). No build.

- Preview: `node serve.mjs` → http://localhost:3000
- Screenshot: `node screenshot.mjs http://localhost:3000 <label> <width> light full|fold`
- Photos: originals in `brand_assets/`, web copies in `img/` (WebP served, JPG kept for og:image). Re-encode: sharp, `webp({quality:78})`.
- Contact form: `ENDPOINT` in `main.js` is empty → falls back to mailto. Fill in a form service URL to send directly.
- Czech copy: single-letter prepositions/conjunctions (v, a, s, k, u, o, z, i) are followed by `&nbsp;`.
- Deploy: GitHub Pages from `main` (repo malaveselahranolka/farma-vaclavov), push = redeploy. `noindex` meta in index.html is for the draft only; remove at launch on the real domain.
