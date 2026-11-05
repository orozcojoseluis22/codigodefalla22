// Renderiza los diagramas SVG a PNG (2x) con Playwright y fuentes locales
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { D } = require('./diagrams');
const ROOT = path.resolve(__dirname, '..');
(async () => {
  const out = path.join(ROOT, 'assets', 'diagramas'); fs.mkdirSync(out, { recursive: true });
  const fontsCss = fs.readFileSync(path.join(ROOT, 'assets/fonts/fonts.css'), 'utf8').replace(/url\('/g, "url('file://" + path.join(ROOT, 'assets/fonts') + '/');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 2 });
  const only = process.argv[2];
  for (const id of Object.keys(D)) {
    if (only && id !== only) continue;
    const svg = D[id]();
    fs.writeFileSync(path.join(out, id + '.svg'), svg);
    await page.setContent(`<html><head><style>${fontsCss} body{margin:0}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(80);
    await page.screenshot({ path: path.join(out, id + '.png'), clip: { x: 0, y: 0, width: 1200, height: 750 } });
    console.log('ok', id);
  }
  await browser.close();
})();
