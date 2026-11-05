// Imágenes publicitarias (PNG/JPG al tamaño exacto) desde la fuente única
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const { CSS, ad } = require('./src/ads/ad_lib'); const M = require('./data/marketing');
const OUT = path.resolve('../entrega/09_Imagenes_Publicitarias'); const FONTDIR = path.resolve('assets/fonts');
const jobs = []; const copys = [['Archivo', 'Juego', 'Texto principal (≤125)', 'Título (≤40)', 'Descripción (≤30)', 'Hashtags']];
const sizes = [[1080, 1350], [1080, 1920], [1080, 1080], [1200, 628]];
M.anuncios.forEach(a => sizes.forEach(([w, h]) => { const f = `JuegoA_Anuncios/${a.id}_${w}x${h}.png`; jobs.push({ f, w, h, html: ad({ w, h, hook: a.hook, sub: a.sub, tech: a.tech, valores: a.valores, note: a.tech === 'menu' ? 'Menú de servicios: precios por calcular con la calculadora del curso' : 'Valores típicos; verifique con el fabricante' }) }); copys.push([f, 'A · ' + a.angulo, a.copy.texto, a.copy.titulo, a.copy.desc, a.copy.tags.join(' ')]); }));
M.carrusel.forEach((c, i) => { const f = `JuegoB_Carrusel/B${i + 1}_1080x1350.png`; const last = i === M.carrusel.length - 1; jobs.push({ f, w: 1080, h: 1350, html: ad({ w: 1080, h: 1350, eyebrow: i === 0 ? 'Carrusel · 7 láminas' : (last ? 'Siguiente paso' : `Tip ${i}/${M.carrusel.length - 2} · Stellantis`), hook: c.t, sub: c.s, tech: c.tech, cta: last ? 'Escribe STELLANTIS por WhatsApp' : (c.c ? `Lo vemos en la Clase ${c.c}` : 'Desliza para ver los 5 tips'), note: i > 0 && !last ? 'Valores típicos; verifique con el fabricante' : '' }) }); copys.push([f, 'B · Carrusel', M.carruselCopy.texto, M.carruselCopy.titulo, M.carruselCopy.desc, M.carruselCopy.tags.join(' ')]); });
[[1080, 1350], [1080, 1920], [1200, 628]].forEach(([w, h]) => { const f = `JuegoC_Lead_Magnet/C_detector_${w}x${h}.png`; jobs.push({ f, w, h, html: ad({ w, h, eyebrow: 'Herramienta gratuita', hook: M.lead.hook, sub: M.lead.sub, tech: 'lead', valores: M.lead.valores, cta: 'Pruébalo gratis: enlace en el perfil', price: 'Gratis' }) }); copys.push([f, 'C · Lead magnet', M.lead.copy.texto, M.lead.copy.titulo, M.lead.copy.desc, M.lead.copy.tags.join(' ')]); });
jobs.push({ f: 'JuegoD_Miniatura_y_OG/Miniatura_YouTube_1280x720.png', w: 1280, h: 720, html: ad({ w: 1280, h: 720, hook: 'Sube tu forma de onda: el Laboratorio te dice qué medir', tech: 'lab', valores: [['CKP', '0–5 V'], ['Semáforo', 'OK']] }) });
copys.push(['JuegoD_Miniatura_y_OG/Miniatura_YouTube_1280x720.png', 'D · Miniatura', 'Laboratorio de diagnóstico Stellantis: sube tu captura del Hantek o FNIRSI y sigue la ruta.', 'Laboratorio de Diagnóstico Stellantis', 'Video 16:9', '#Osciloscopio #Jeep #RAM #Hantek #DiagnosticoAutomotriz']);
jobs.push({ f: 'JuegoD_Miniatura_y_OG/og-imagen.jpg', w: 1200, h: 630, jpg: true, html: ad({ w: 1200, h: 630, hook: 'Diagnóstico Stellantis Pro', sub: 'Chrysler · Dodge · Jeep · Ram · 12 clases en línea', tech: 'scope', valores: [['DLC 6–14', '60 Ω'], ['CAN H', '2.6 V']] }) });
copys.push(['JuegoD_Miniatura_y_OG/og-imagen.jpg', 'D · Open Graph', 'Curso en línea de 12 clases para diagnosticar Chrysler, Dodge, Jeep y Ram con método.', 'Diagnóstico Stellantis Pro', '$1,799 MXN', '#Jeep #RAM #Dodge #Chrysler #DiagnosticoAutomotriz']);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 1 }); const tmp = path.join(FONTDIR, '_ad.html');
  for (const j of jobs) {
    await p.setViewportSize({ width: j.w, height: j.h });
    fs.writeFileSync(tmp, `<!doctype html><html lang="es"><head><meta charset="utf-8"><link rel="stylesheet" href="local-fonts.css"><style>${CSS}</style></head><body>${j.html}</body></html>`);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(80);
    // detectar texto desbordado
    const ov = await p.evaluate(() => [...document.querySelectorAll('.hook,.sub,.cta span,.val')].filter(e => e.scrollWidth > e.clientWidth + 2 || e.getBoundingClientRect().right > innerWidth + 1).length);
    if (ov) console.log('Revisar desborde:', j.f, ov);
    const f = path.join(OUT, j.f); fs.mkdirSync(path.dirname(f), { recursive: true });
    await p.screenshot({ path: f, type: j.jpg ? 'jpeg' : 'png', quality: j.jpg ? 90 : undefined, clip: { x: 0, y: 0, width: j.w, height: j.h } });
  }
  fs.unlinkSync(tmp); await b.close();
  fs.copyFileSync(path.join(OUT, 'JuegoD_Miniatura_y_OG/og-imagen.jpg'), '../entrega/06_Landing_Page/og-imagen.jpg');
  const sh = require('child_process'); sh.execSync(`python3 -c "from PIL import Image; im=Image.open('${path.join(OUT, 'JuegoC_Lead_Magnet/C_detector_1200x628.png')}').convert('RGB'); im.save('../entrega/07_Lead_Magnet/og-lead.jpg', quality=90)"`);
  const csv = copys.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  fs.writeFileSync(path.join(OUT, 'Copys_por_imagen.csv'), '﻿' + csv);
  copys.slice(1).forEach(r => { if (r[2].length > 125 || r[3].length > 40 || r[4].length > 30) console.log('Copy fuera de límite:', r[0], r[2].length, r[3].length, r[4].length); });
  console.log('Imágenes:', jobs.length);
})();
