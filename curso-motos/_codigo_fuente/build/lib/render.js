// Renderizado HTML → PNG con Playwright (fuentes locales, determinista)
const fs = require("fs"), path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const FONTS = path.resolve(__dirname, "../../assets/fonts");
const TMP = path.resolve(__dirname, "../../.tmp");
fs.mkdirSync(TMP, { recursive: true });
function fontCss() {
  return fs.readFileSync(path.join(FONTS, "fonts.css"), "utf8").replace(/url\(([^)]+\.ttf)\)/g, (m, f) => `url(file://${path.join(FONTS, f)})`);
}
let browser;
async function getBrowser() { if (!browser) browser = await chromium.launch(); return browser; }
async function close() { if (browser) await browser.close(); browser = null; }
function page(html, css = "") {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${fontCss()}html,body{margin:0;padding:0;background:transparent}${css}</style></head><body>${html}</body></html>`;
}
async function shot(html, out, w, h, o = {}) {
  const b = await getBrowser();
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: o.scale || 1 });
  const f = path.join(TMP, `r_${process.pid}_${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(f, html.startsWith("<!doctype") ? html : page(html, o.css));
  await p.goto("file://" + f);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(o.wait || 50);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await p.screenshot({ path: out, type: out.endsWith(".jpg") ? "jpeg" : "png", quality: out.endsWith(".jpg") ? 92 : undefined, clip: { x: 0, y: 0, width: w, height: h } });
  await p.close(); fs.unlinkSync(f);
  return out;
}
module.exports = { shot, close, page, fontCss, getBrowser, TMP };
