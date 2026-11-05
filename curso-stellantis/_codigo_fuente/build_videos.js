// Videos 30 s a 30 fps: HTML + seek(t) determinista → Playwright → ffmpeg (H.264, yuv420p, CRF 18, AAC silencioso)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { spawn, execSync } = require('child_process');
const { CSS, T, IMG, K, canPath, BITS } = require('./src/ads/ad_lib'); const DG = require('./data/diagramas'); const M = require('./data/marketing');
const OUT = path.resolve('../entrega/08_Animaciones'); fs.mkdirSync(OUT + '/portadas', { recursive: true }); fs.mkdirSync(OUT + '/cuadros_clave', { recursive: true }); fs.mkdirSync(OUT + '/fuentes_html', { recursive: true });
const FPS = 30, DUR = 30, FONTDIR = path.resolve('assets/fonts');
const S = (v, c = '') => `<svg viewBox="0 0 900 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"${c}>${v}</svg>`;
const mono = 'font-family="IBM Plex Mono, monospace"', cond = 'font-family="Barlow Condensed, Arial Narrow, sans-serif"', bar = 'font-family="Barlow, Arial"';
// Visuales dinámicos (elementos con data-* que seek(t) actualiza)
const V = {
  codes: () => S([['ABS', 'U0100'], ['TCM', 'U0100'], ['IPC', 'U0100'], ['ORC', 'U0100'], ['HVAC', 'U0140'], ['BCM', 'U0100']].map((r, i) => `<g data-pop="${0.25 + i * 0.32}" transform="translate(${60 + (i % 2) * 410} ${30 + Math.floor(i / 2) * 175})"><rect width="370" height="140" rx="16" fill="${K.carbon}" stroke="${K.rojo}" stroke-width="5"/><circle cx="60" cy="70" r="26" fill="${K.rojo}"/><text x="110" y="62" ${cond} font-size="44" font-weight="800" fill="#fff">${r[0]}</text><text x="110" y="108" ${mono} font-size="34" fill="${K.rojo}">${r[1]}</text></g>`).join('')),
  ohm: () => S(`<rect x="250" y="10" width="400" height="540" rx="40" fill="#F08C00" stroke="${K.carbon}" stroke-width="6"/><rect x="290" y="60" width="320" height="160" rx="14" fill="#C9D8B6"/><text x="450" y="180" text-anchor="middle" ${mono} font-size="96" font-weight="600" fill="${K.carbon}" data-count="0,60.2,0.3,1.6,1">0.0</text><text x="590" y="110" text-anchor="end" ${mono} font-size="40" fill="${K.carbon}">Ω</text><circle cx="450" cy="370" r="110" fill="${K.carbon}"/><circle cx="450" cy="370" r="70" fill="#4A5058"/><g data-pop="2.0"><rect x="320" y="440" width="260" height="70" rx="35" fill="${K.verde}"/><text x="450" y="487" text-anchor="middle" ${cond} font-size="40" font-weight="800" fill="#fff">RED SANA</text></g>`),
  scope: () => S(`<rect x="10" y="10" width="880" height="540" rx="26" fill="${K.carbon}" stroke="#4A5058" stroke-width="4"/><rect x="40" y="40" width="820" height="400" rx="10" fill="#0D110D"/>${Array.from({ length: 11 }, (_, i) => `<line x1="${40 + i * 82}" y1="40" x2="${40 + i * 82}" y2="440" stroke="#22301F" stroke-width="2"/>`).join('')}<clipPath id="cl"><rect x="40" y="40" width="820" height="400"/></clipPath><g clip-path="url(#cl)"><g data-scroll="160"><path d="${canPath([...BITS, ...BITS, ...BITS], 40, 29.3, 160, 240, 240)}" stroke="${K.am}" stroke-width="7" fill="none"/><path d="${canPath([...BITS, ...BITS, ...BITS], 40, 29.3, 320, 240, 240)}" stroke="${K.verde}" stroke-width="7" fill="none"/></g></g><text x="60" y="84" ${mono} font-size="28" fill="${K.am}">CH1 CAN H</text><text x="60" y="420" ${mono} font-size="28" fill="${K.verde}">CH2 CAN L</text><text x="60" y="510" ${mono} font-size="30" fill="#AEB6BF">1 V/div · 20 µs/div · en espejo</text>`),
  converge: () => S(`${['ABS', 'TCM', 'IPC', 'ORC'].map((n, i) => `<g data-pop="${0.2 + i * 0.3}"><rect x="30" y="${30 + i * 130}" width="220" height="100" rx="14" fill="${K.carbon}" stroke="#4A5058" stroke-width="4"/><text x="140" y="${92 + i * 130}" text-anchor="middle" ${cond} font-size="44" font-weight="800" fill="#fff">${n}</text><path d="M250 ${80 + i * 130} L600 280" stroke="${K.rojo}" stroke-width="6" stroke-dasharray="14 10"/></g>`).join('')}<g data-pop="1.6"><rect x="600" y="190" width="270" height="180" rx="18" fill="#3A3110" stroke="${K.am}" stroke-width="7"/><text x="735" y="270" text-anchor="middle" ${cond} font-size="64" font-weight="800" fill="${K.am}">PCM</text><text x="735" y="325" text-anchor="middle" ${mono} font-size="24" fill="#fff">B+ · tierra · red</text></g>`),
  receipt: () => S(`<rect x="200" y="10" width="500" height="540" rx="8" fill="#FFFDF5"/><text x="450" y="70" text-anchor="middle" ${mono} font-size="28" font-weight="600" fill="${K.carbon}">NOTA DE SERVICIO</text><line x1="230" y1="95" x2="670" y2="95" stroke="#9AA3AD" stroke-width="3" stroke-dasharray="6 6"/><text x="240" y="160" ${mono} font-size="30" fill="${K.carbon}">Escaneo</text><text x="660" y="160" text-anchor="end" ${mono} font-size="30" fill="${K.carbon}">$___</text><line data-draw="0.8" x1="230" y1="150" x2="670" y2="150" stroke="${K.rojo}" stroke-width="7"/><g data-pop="1.4"><text x="240" y="240" ${mono} font-size="30" font-weight="600" fill="${K.carbon}">Diagnóstico con método</text><text x="240" y="290" ${mono} font-size="26" fill="#4B5560">✔ Mediciones</text><text x="240" y="335" ${mono} font-size="26" fill="#4B5560">✔ Capturas de osciloscopio</text><text x="240" y="380" ${mono} font-size="26" fill="#4B5560">✔ Informe y garantía</text></g><g data-pop="2.0"><rect x="300" y="430" width="300" height="80" rx="40" fill="${K.verde}"/><text x="450" y="482" text-anchor="middle" ${cond} font-size="40" font-weight="800" fill="#fff">CLIENTE CONFÍA</text></g>`),
  menu: () => S(T.menu()),
  vin: () => S(`<rect x="40" y="40" width="820" height="480" rx="20" fill="${K.carbon}" stroke="#4A5058" stroke-width="4"/><text x="80" y="120" ${mono} font-size="34" fill="#AEB6BF">VIN (ejemplo)</text><rect x="80" y="145" width="740" height="80" rx="10" fill="#0F1114"/><text x="110" y="200" ${mono} font-size="40" fill="#fff" data-type="1C4RJF●●●●●●●●●●●">_</text><g data-pop="1.8"><rect x="80" y="270" width="740" height="200" rx="14" fill="#3A3110" stroke="${K.am}" stroke-width="5"/><text x="120" y="340" ${bar} font-size="40" font-weight="800" fill="${K.am}">Campaña pendiente</text><text x="120" y="400" ${bar} font-size="32" fill="#fff">Relevador de la bomba en el TIPM</text><text x="120" y="445" ${mono} font-size="24" fill="#AEB6BF">Consulta NHTSA / Profeco antes de presupuestar</text></g>`),
  lab: () => S(T.lab()),
  steps: () => S(`<rect x="20" y="20" width="860" height="520" rx="20" fill="${K.carbon}" stroke="#4A5058" stroke-width="4"/><text x="60" y="90" ${mono} font-size="40" font-weight="600" fill="${K.am}">P0335 · CKP</text>${['Síntoma y entrevista', 'VIN y campañas', 'Escaneo completo', 'B+ y tierras del PCM', 'CKP: 5 V, señal, retorno', 'Reparar y verificar'].map((x, i) => `<g data-pop="${0.3 + i * 0.35}"><rect x="60" y="${120 + i * 66}" width="52" height="52" rx="8" fill="${K.am}"/><text x="86" y="${156 + i * 66}" text-anchor="middle" ${cond} font-size="34" font-weight="800" fill="${K.carbon}">${i + 1}</text><text x="135" y="${158 + i * 66}" ${bar} font-size="32" font-weight="600" fill="#fff">${x}</text></g>`).join('')}`),
  diagram: () => DG.lista.find(d => d.id === 'ckp_cmp').svg.replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" '),
  cierre: () => S(T.cierre())
};
const VIDS = [
  { id: 'V1_9x16_dolor', w: 1080, h: 1920, scenes: [
    ['Diagnóstico Stellantis Pro', '¿Jeep lleno de códigos U?', 'No cambies módulos todavía.', 'codes', []],
    ['Tip 1 de 3', 'Mide 6–14 en el DLC', 'Con la batería desconectada.', 'ohm', [['60 Ω', 'sana'], ['120 Ω', 'falta 1'], ['0 Ω', 'corto']]],
    ['Tip 2 de 3', 'CAN H y CAN L en ON', 'Deben verse en espejo.', 'scope', [['CAN H', '2.6 V'], ['CAN L', '2.4 V']]],
    ['Tip 3 de 3', '¿Todos pierden al PCM?', 'Revisa su alimentación, tierra y red.', 'converge', [['U0100', 'en 4 módulos']]],
    ['Curso en línea', 'Diagnóstico Stellantis Pro', '12 clases · Laboratorio incluido', 'cierre', [['12', 'clases'], ['18', 'horas'], ['$1,799', 'MXN']]]] },
  { id: 'V2_1x1_dinero', w: 1080, h: 1080, scenes: [
    ['Diagnóstico Stellantis Pro', 'Escanear no es diagnosticar', '3 tips para cobrar tu trabajo.', 'receipt', []],
    ['Tip 1 de 3', 'Entrega evidencia', 'Medición + captura en el informe.', 'scope', [['Captura', 'CAN H/L']]],
    ['Tip 2 de 3', 'Menú de 3 opciones', 'El cliente elige sin presión.', 'menu', [['Precios', 'según tu tarifa']]],
    ['Tip 3 de 3', 'Revisa campañas por VIN', 'Ganas la confianza del cliente.', 'vin', []],
    ['Curso en línea', 'Mide y cobra con método', 'Diagnóstico Stellantis Pro', 'cierre', [['12', 'clases'], ['$1,799', 'MXN']]]] },
  { id: 'V3_16x9_sistema', w: 1920, h: 1080, scenes: [
    ['Laboratorio de Diagnóstico Stellantis', 'Sube tu forma de onda. Recibe tu siguiente prueba.', 'Incluido en el curso.', 'lab', []],
    ['Paso 1', 'Sube CSV o captura', 'Hantek, OpenHantek6022 o FNIRSI.', 'lab', [['CKP', '0–5 V'], ['Frec.', '794 Hz'], ['Hueco', '3×']]],
    ['Paso 2', 'Escribe el código', 'Ruta de 6 pasos según tu equipo.', 'steps', [['P0335', 'CKP']]],
    ['Paso 3', '14 diagramas con puntos de prueba', 'Red, carga, arranque e inmovilizador.', 'diagram', []],
    ['Curso en línea', 'Diagnóstico Stellantis Pro', '12 clases · 10 bonos', 'cierre', [['12', 'clases'], ['18', 'horas'], ['$1,799', 'MXN']]]] }
];
const T0 = [0, 3, 10, 17, 24, 30];
function html(v) {
  const land = v.w > v.h, tall = v.h > v.w * 1.5, safe = tall ? 250 : 0, pad = land ? 70 : 64, barH = land ? 96 : 120;
  const photo = land ? 150 : (tall ? 210 : 160);
  const scenes = v.scenes.map(([eb, hook, sub, vis, vals], i) => {
    const hs = land ? (hook.length > 34 ? 76 : 92) : Math.max(84, Math.min(tall ? 120 : 96, Math.round((tall ? 2700 : 2300) / Math.max(12, hook.length))));
    const textBox = land ? `left:${pad}px;top:${pad + 10}px;width:${Math.round(v.w * 0.4)}px` : `left:${pad}px;top:${safe + pad - 6}px;width:${v.w - photo - pad * 2 - 30}px`;
    const techBox = land ? `left:${Math.round(v.w * 0.45)}px;right:${pad}px;top:${pad + 150}px;bottom:${barH + 50}px` : `left:${pad}px;right:${pad - 26}px;top:${safe + (tall ? 540 : 380)}px;bottom:${safe + barH + (vals.length ? 170 : 60)}px`;
    const valsBox = land ? `left:${pad}px;top:${pad + 10 + hs * 2.3 + 140}px;justify-content:flex-start` : `left:26px;right:0;bottom:${safe + barH + 34}px`;
    return `<section class="sc" data-s="${T0[i]}" data-e="${T0[i + 1]}"><div style="position:absolute;${textBox}"><div class="eyebrow" data-pop="0" style="font-size:${land ? 24 : 26}px;margin-bottom:14px">${eb}</div><div class="hook" data-pop="0.1" style="font-size:${hs}px">${hook}</div><div class="sub" data-pop="0.35" style="font-size:${land ? 36 : (tall ? 42 : 36)}px;margin-top:18px">${sub}</div></div>
    <div class="tech" data-pop="0.5" style="${techBox}">${V[vis]()}</div>
    ${vals.length ? `<div class="vals" style="position:absolute;${valsBox}">${vals.map((x, j) => `<div class="val" data-pop="${1 + j * 0.25}" style="padding:12px 22px;min-width:${land ? 170 : 200}px"><b style="font-size:${land ? 40 : 44}px">${x[0]}</b><small style="font-size:22px">${x[1]}</small></div>`).join('')}</div>` : ''}</section>`;
  }).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><link rel="stylesheet" href="local-fonts.css"><style>${CSS}
  .sc{position:absolute;inset:0}.val b{margin-bottom:2px}
  .ex{position:absolute;font-family:"IBM Plex Mono",monospace;color:#AEB6BF;font-size:20px}
  </style></head><body><div class="ad" id="stage" style="width:${v.w}px;height:${v.h}px"><div class="strip"></div>
  <img class="photo" src="${IMG.prof}" style="position:absolute;right:${pad - 10}px;top:${safe + (land ? 34 : pad - 6)}px;width:${photo}px;height:${photo}px;z-index:3" alt="">
  <img class="logo" src="${IMG.logo}" style="position:absolute;right:${land ? pad + photo + 20 : pad - 10}px;top:${land ? safe + 34 + photo / 2 - 35 : safe + pad + photo + 12}px;${land ? 'height:70px' : `width:${photo}px`};z-index:3" alt="">
  ${scenes}
  <div class="ex" style="right:${pad}px;bottom:${safe + barH + 8}px">Valores típicos; verifique con el fabricante</div>
  <div class="cta" style="bottom:${safe}px;height:${barH}px;padding:0 ${pad}px;font-size:${land ? 40 : (tall ? 38 : 34)}px;z-index:4;white-space:nowrap"><span>Diagnóstico Stellantis Pro · Escribe STELLANTIS</span><span class="p" style="font-size:${land ? 32 : 30}px;padding:10px 16px;white-space:nowrap">$1,799 MXN</span></div>
  <div id="prog" style="position:absolute;left:26px;bottom:${safe}px;height:8px;background:${K.carbon};z-index:5"></div></div>
  <script>
  const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3);
  window.seek = function (t) {
    document.querySelectorAll('.sc').forEach(sc => {
      const s = +sc.dataset.s, e = +sc.dataset.e, inA = ease((t - s) / 0.35), outA = ease((t - (e - 0.3)) / 0.3), vis = t >= s - 0.01 && t < e + 0.001;
      sc.style.opacity = vis ? (e >= 30 ? inA : inA * (1 - outA)) : 0;
      const lt = t - s;
      sc.querySelectorAll('[data-pop]').forEach(el => { const d = +el.dataset.pop, a = ease((lt - d) / 0.4); el.style.opacity = a; if (el.tagName !== 'g') el.style.transform = 'translateY(' + ((1 - a) * 26) + 'px)'; });
      sc.querySelectorAll('[data-count]').forEach(el => { const [f, to, d, du, dec] = el.dataset.count.split(',').map(Number); const a = ease((lt - d) / du); el.textContent = (f + (to - f) * a).toFixed(dec); });
      sc.querySelectorAll('[data-scroll]').forEach(el => { el.setAttribute('transform', 'translate(' + (-(lt * +el.dataset.scroll) % 820) + ' 0)'); });
      sc.querySelectorAll('[data-draw]').forEach(el => { const d = +el.dataset.draw, a = ease((lt - d) / 0.5); el.setAttribute('x2', 230 + 440 * a); el.style.opacity = a > 0 ? 1 : 0; });
      sc.querySelectorAll('[data-type]').forEach(el => { const s2 = el.dataset.type, n = Math.max(0, Math.min(s2.length, Math.floor((lt - 0.4) * 14))); el.textContent = s2.slice(0, n) + (n < s2.length ? '_' : ''); });
    });
    document.getElementById('prog').style.width = (t / 30 * (${v.w} - 26)) + 'px';
  };
  window.seek(0);
  </script></body></html>`;
}
async function render(v, browser) {
  const file = path.join(FONTDIR, `_${v.id}.html`); const page_html = html(v); fs.writeFileSync(file, page_html); fs.writeFileSync(path.join(OUT, 'fuentes_html', `${v.id}.html`), page_html.replace('href="local-fonts.css"', 'href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap"'));
  const p = await browser.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  await p.goto('file://' + file); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
  // 6 cuadros clave para revisión
  for (const t of [1.5, 6, 13, 20, 27, 29.5]) { await p.evaluate(t => window.seek(t), t); await p.screenshot({ path: path.join(OUT, 'cuadros_clave', `${v.id}_t${String(t).replace('.', '_')}s.png`) }); }
  await p.evaluate(() => window.seek(27.5)); await p.screenshot({ path: path.join(OUT, 'portadas', `${v.id}_portada.png`) });
  if (process.argv.includes('--solo-cuadros')) { await p.close(); return; }
  const out = path.join(OUT, `${v.id}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000', '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]);
  ff.stderr.on('data', d => process.stderr.write(d));
  for (let i = 0; i < FPS * DUR; i++) { await p.evaluate(t => window.seek(t), i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 94 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await p.close(); fs.unlinkSync(file);
  console.log(v.id, execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,pix_fmt -show_entries format=duration -of csv=p=0 "${out}"`).toString().trim().replace(/\n/g, ' | '));
}
(async () => { const b = await chromium.launch(); const only = process.argv.find(a => a.startsWith('--v=')); for (const v of VIDS) { if (only && !v.id.startsWith(only.slice(4))) continue; await render(v, b); } await b.close(); })();
