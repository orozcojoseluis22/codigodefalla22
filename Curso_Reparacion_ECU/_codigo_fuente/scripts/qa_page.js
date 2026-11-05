// QA de páginas: errores de consola, desborde horizontal y capturas (escritorio/celular, claro/oscuro)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const file = path.resolve(process.argv[2]), out = process.argv[3];
  const b = await chromium.launch(); const res = [];
  for (const [name, vp, scheme] of [['desk-light', { width: 1366, height: 900 }, 'light'], ['mob-light', { width: 390, height: 844 }, 'light'], ['mob-dark', { width: 390, height: 844 }, 'dark'], ['desk-dark', { width: 1366, height: 900 }, 'dark']]) {
    const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, deviceScaleFactor: 1 }); const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
    await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith('file:') || u.startsWith('data:') || u.includes('fonts.g')) r.continue(); else r.abort(); });
    await p.goto('file://' + file); await p.waitForTimeout(1200);
    const ov = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, wide: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 5).map(e => e.tagName + '.' + e.className) }));
    res.push({ name, errs: errs.filter(e => !e.includes('net::ERR_FAILED')), ...ov });
    await p.screenshot({ path: `${out}-${name}.png`, fullPage: true });
    await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1)); await b.close();
})();
