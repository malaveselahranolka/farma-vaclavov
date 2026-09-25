import fs from 'node:fs';

// Projekt ma bud puppeteer (stahne si vlastni prohlizec), nebo jen puppeteer-core
// (potrebuje cestu k nainstalovanemu Chrome). Zvladni obojí, at skript nespadne
// na importu jen proto, ze je v repu ta druha varianta.
let puppeteer, executablePath;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  puppeteer = (await import('puppeteer-core')).default;
  executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
    || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
}

// node screenshot.mjs <url> [label] [width] [light|dark] [full|fold]
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = Number(process.argv[4]) || 1440;
const scheme = process.argv[5] === 'dark' ? 'dark' : 'light';
const mode = process.argv[6] === 'fold' ? 'fold' : 'full';

const dir = 'temporary screenshots';
fs.mkdirSync(dir, { recursive: true });
const n = fs.readdirSync(dir).filter((f) => f.startsWith('screenshot-')).length + 1;
const out = `${dir}/screenshot-${n}${label ? '-' + label : ''}.png`;

const browser = await puppeteer.launch({ ...(executablePath ? { executablePath } : {}), headless: 'new', args: ['--no-sandbox', '--font-render-hinting=none'] });
const page = await browser.newPage();
await page.setViewport({ width, height: width < 700 ? 844 : 900, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(() => new Promise((r) => setTimeout(r, 1200)));

if (mode === 'full') {
  // Walk the page at a human pace so IntersectionObserver actually fires.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 170));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
}

await page.screenshot({ path: out, fullPage: mode === 'full' });
await browser.close();
console.log(out);
