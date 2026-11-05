// Captura las referencias sintéticas del Laboratorio (bien / con falla) para la guía del bono 4
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const L = require('./data/lab');
const out = path.resolve('build/referencias'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 900 }, colorScheme: 'light' });
  await p.goto('file://' + path.resolve('../entrega/04_Bonos/Bono01_Laboratorio_Interactivo/laboratorio-stellantis.html') + '#referencias'); await p.waitForTimeout(600);
  for (const s of L.senales) for (const mode of ['ok', 'bad']) {
    await p.selectOption('#rSig', s.id); await p.selectOption('#rMode', mode); await p.waitForTimeout(150);
    const el = await p.$('#v-referencias .scope'); await el.screenshot({ path: `${out}/${s.id}_${mode}.png` });
  }
  await b.close(); console.log('referencias', L.senales.length * 2);
})();
