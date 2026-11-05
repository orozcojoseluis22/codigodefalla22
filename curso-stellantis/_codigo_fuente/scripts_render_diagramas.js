const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const D = require('./data/diagramas.js');
const out = path.resolve(process.argv[2] || 'build/diagramas');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 760 }, deviceScaleFactor: 1.5 });
  const tmp = path.resolve('assets/fonts/_render.html');
  for (const d of D.lista) {
    fs.writeFileSync(`${out}/${d.id}.svg`, d.svg);
    fs.writeFileSync(tmp, `<html><head><link rel="stylesheet" href="local-fonts.css"><style>body{margin:0}</style></head><body>${d.svg}</body></html>`);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(50);
    await p.screenshot({ path: `${out}/${d.id}.png`, clip: { x: 0, y: 0, width: 1200, height: 760 } });
  }
  fs.unlinkSync(tmp); await b.close(); console.log('ok', D.lista.length);
})();
