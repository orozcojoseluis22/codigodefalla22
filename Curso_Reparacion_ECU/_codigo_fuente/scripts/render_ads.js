// Renderiza las imágenes publicitarias (juegos A, B, C y D) a PNG/JPG en tamaño exacto
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const { adHTML, page } = require('./ads_lib');
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(ROOT, '..', '09_Imagenes_Publicitarias');
const SIZES = [[1080, 1350], [1080, 1920], [1080, 1080], [1200, 628]];
const A = [
  { id: 'A1_dolor', eyebrow: 'CURSO PRESENCIAL · LEÓN Y CDMX', hook: '¿La ECU “no tiene arreglo”? <em>Mídela antes de cambiarla.</em>', visual: 'ref5v', vals: ['Tierras &lt; 0.1 V', 'Ref. 5.0 V', 'CAN 60 Ω'] },
  { id: 'A2_dinero', eyebrow: 'REPARACIÓN DE ECU · 2 DÍAS', hook: 'Cada ECU que mandas fuera <em>la cobra otro taller.</em>', visual: 'menu', vals: ['Diagnóstico en banco', '3 opciones', 'Garantía 90 días'] },
  { id: 'A3_sistema', eyebrow: 'CHRYSLER · DODGE · JEEP · NISSAN', hook: 'Repara computadoras <em>en banco, en 2 días.</em>', visual: 'scope', vals: ['12 clases · 18 h', 'León 27–28 nov', 'CDMX 16–17 dic'] }
];
const B = [
  { eyebrow: 'GUÁRDALO · 1/7', hook: '5 mediciones <em>antes de condenar una ECU</em>', visual: 'bloques', vals: ['Desliza →'] },
  { eyebrow: '2/7 · TIERRAS', hook: 'Mide la caída de voltaje <em>en las tierras</em>', visual: 'tierra', vals: ['Con carga: &lt; 0.1 V (típico)'], wide: true },
  { eyebrow: '3/7 · REFERENCIA 5 V', hook: 'P0641: desconecta <em>sensor por sensor</em>', visual: 'ref5v', vals: ['El que regresa a 5 V es el culpable'], wide: true },
  { eyebrow: '4/7 · RED CAN', hook: '60 Ω entre <em>los pines 6 y 14</em>', visual: 'dlc', vals: ['120 Ω = falta una terminación'], wide: true },
  { eyebrow: '5/7 · INYECTOR', hook: 'Compara el pico <em>entre cilindros</em>', visual: 'scope', vals: ['Pico menor = espiras en corto o clamp'], wide: true },
  { eyebrow: '6/7 · CAUSA RAÍZ', hook: 'Mide el actuador <em>antes de entregar</em>', visual: 'inyector', vals: ['3 Ω en vez de 12 Ω quema el driver'], wide: true },
  { eyebrow: '7/7 · SIGUIENTE PASO', hook: 'Aprende el método <em>completo en 2 días</em>', visual: 'semaforo', vals: ['Árbol de diagnóstico gratis', 'León · CDMX'] }
];
const LEAD = { eyebrow: 'HERRAMIENTA GRATIS · SIN REGISTRO', hook: '¿Es la computadora <em>o el vehículo?</em>', visual: 'semaforo', vals: ['Árbol de diagnóstico ECU', 'Resultado en 10 min'], cta: 'Escribe ECU y recibe el enlace', ctaSub: 'Gratis · Electrónica y Servicio · 55 5217 3484' };
(async () => {
  const browser = await chromium.launch(); const tmp = path.join(ROOT, 'html', '_tmp_ad.html'); const made = [];
  async function shot(spec, w, h, file, jpg) {
    let s = { ...spec, w, h };
    if (spec.wide && w === 1080) { s.showProf = false; s.visBox = [40, 330, 1000, 640]; s.valsBox = [40, 1070, 1000, 30]; }
    let html = adHTML(s);
    if (spec.wide && w === 1080) html = html.replace(/(class="abs hook" style="left:\d+px;top:\d+px;width:)\d+px/, '$1940px');
    fs.writeFileSync(tmp, page(html, w, h));
    const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const buf = await p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: w, height: h } }); await p.close();
    if (jpg) await sharp(buf).jpeg({ quality: 88 }).toFile(file); else fs.writeFileSync(file, buf);
    const m = await sharp(file).metadata(); made.push([path.relative(OUT, file), m.width + '×' + m.height]);
  }
  for (const a of A) for (const [w, h] of SIZES) await shot(a, w, h, path.join(OUT, 'A_Anuncios', `${a.id}_${w}x${h}.png`));
  for (let i = 0; i < B.length; i++) await shot(B[i], 1080, 1350, path.join(OUT, 'B_Carrusel', `B${i + 1}_carrusel_1080x1350.png`));
  for (const [w, h] of [[1080, 1350], [1080, 1920], [1200, 628]]) await shot(LEAD, w, h, path.join(OUT, 'C_Lead_magnet', `C_arbol_diagnostico_${w}x${h}.png`));
  await shot({ eyebrow: 'MÉTODO EN BANCO · CURSO 2026', hook: 'Repara cualquier ECU <em>por etapas</em>', visual: 'bloques', vp: { hl: 3 } }, 1280, 720, path.join(OUT, 'D_YouTube_y_OG', 'D_miniatura_youtube_1280x720.png'));
  await shot({ eyebrow: 'CURSO PRESENCIAL · LEÓN Y CDMX 2026', hook: 'Reparación de computadoras <em>automotrices</em>', visual: 'bench', vals: ['12 clases · 18 h', '$1,799 MXN', 'Chrysler · Nissan'] }, 1200, 630, path.join(OUT, 'D_YouTube_y_OG', 'og-imagen.jpg'), true);
  await shot(LEAD, 1200, 630, path.join(OUT, 'D_YouTube_y_OG', 'og-lead.jpg'), true);
  fs.copyFileSync(path.join(OUT, 'D_YouTube_y_OG', 'og-imagen.jpg'), path.resolve(OUT, '..', '06_Landing_Page', 'og-imagen.jpg'));
  fs.copyFileSync(path.join(OUT, 'D_YouTube_y_OG', 'og-lead.jpg'), path.resolve(OUT, '..', '07_Lead_Magnet', 'og-lead.jpg'));
  fs.unlinkSync(tmp); await browser.close();
  made.forEach(m => console.log(m.join('  ')));
  console.log('total', made.length);
})();
