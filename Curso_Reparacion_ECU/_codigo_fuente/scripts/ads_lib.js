// Librería gráfica de publicidad: visuales técnicos (SVG) y compositor de anuncios (HTML/CSS)
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const FONTS = fs.readFileSync(path.join(ROOT, 'assets/fonts/fonts.css'), 'utf8').replace(/url\('/g, "url('file://" + path.join(ROOT, 'assets/fonts') + '/');
const PROF = 'file://' + path.join(ROOT, 'assets/prof_cutout_clean.png');
const LOGO = 'file://' + path.join(ROOT, 'assets/logo_es.png');
const C = { gris: '#2B3036', carbon: '#1E2227', am: '#FFC20E', rojo: '#E5484D', verde: '#2FB344', azul: '#2D7FF9', claro: '#EEF0F2', tenue: '#9BA2AA', panel: '#23282E', borde: '#3A4149', pantalla: '#0D0F11' };
const mono = "font-family=\"IBM Plex Mono, monospace\"", cond = "font-family=\"Barlow Condensed, Arial Narrow, sans-serif\"", sans = "font-family=\"Barlow, Arial, sans-serif\"";
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const svg = (body, vb = '0 0 900 400') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block">${body}</svg>`;
function meter(x, y, val, unit, color, label, o = {}) {
  return `<g transform="translate(${x},${y})"><rect width="${o.w || 330}" height="${o.h || 230}" rx="26" fill="#FFC20E"/><rect x="18" y="18" width="${(o.w || 330) - 36}" height="110" rx="12" fill="#C8D3B4"/><text x="${(o.w || 330) - 40}" y="102" text-anchor="end" ${mono} font-size="70" font-weight="600" fill="${color}">${val}</text><text x="${(o.w || 330) - 36}" y="122" text-anchor="end" ${mono} font-size="20" fill="#1E2227">${unit}</text><circle cx="${(o.w || 330) / 2}" cy="178" r="34" fill="#1E2227"/><path d="M${(o.w || 330) / 2} 178 l20 -18" stroke="#FFC20E" stroke-width="6" stroke-linecap="round"/><text x="${(o.w || 330) / 2}" y="${(o.h || 230) + 44}" text-anchor="middle" ${cond} font-size="34" font-weight="700" fill="${o.labelColor || C.claro}">${label}</text></g>`;
}
const V = {
  // Osciloscopio: CKP + pulso de inyector con pico de clamp. p = progreso de trazado
  scope(o = {}) {
    const p = o.p ?? 1, L = 1500;
    let grid = ''; for (let i = 1; i < 10; i++) grid += `<path d="M${20 + i * 86} 20V380" stroke="#1E262D"/>`; for (let i = 1; i < 6; i++) grid += `<path d="M20 ${20 + i * 60}H880" stroke="#1E262D"/>`;
    let ckp = 'M40 150'; let x = 40; for (let i = 0; i < 34; i++) { if (i === 16 || i === 17) { ckp += `h22`; x += 22; continue; } ckp += 'v-56h11v56h11'; x += 22; }
    return svg(`<rect x="10" y="10" width="880" height="380" rx="22" fill="${C.pantalla}" stroke="${C.borde}" stroke-width="3"/>${grid}
      <text x="40" y="52" ${mono} font-size="22" fill="${C.tenue}">CH1 CKP 2V/div   CH2 INY 20V/div</text>
      <path d="${ckp}" fill="none" stroke="${C.am}" stroke-width="4" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - p)}"/>
      <path d="M40 330 H230 V360 H520 L528 196 L540 206 L552 202 L566 318 L590 330 H860" fill="none" stroke="#6EA2FF" stroke-width="4" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - p)}"/>
      <g opacity="${clamp((p - 0.55) * 3)}"><path d="M560 196 L640 150" stroke="${C.claro}" stroke-width="2"/><rect x="640" y="118" width="210" height="56" rx="8" fill="#1E2227" stroke="#6EA2FF"/><text x="745" y="155" text-anchor="middle" ${mono} font-size="26" fill="#6EA2FF">pico 62 V</text></g>`);
  },
  ref5v(o = {}) {
    const p = o.p ?? 1, v = (1.2 + (5.0 - 1.2) * clamp((p - 0.4) / 0.4)).toFixed(1), ok = p > 0.8;
    return svg(`${meter(40, 20, '1.2', 'V DC', C.rojo, 'MAP en corto: jala la ref.')}${meter(530, 20, v, 'V DC', ok ? C.verde : C.carbon, ok ? 'MAP desconectado: 5.0 V' : 'Desconecta sensor por sensor')}
      <g opacity="${clamp(p * 2)}"><path d="M390 140 H500" stroke="${C.am}" stroke-width="10" stroke-linecap="round"/><path d="M490 115 L520 140 L490 165" fill="none" stroke="${C.am}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  },
  menu(o = {}) {
    const p = o.p ?? 1; const cards = [['Básico', '$1,800'], ['Recomendado', '$2,600'], ['Premium', '$3,400']];
    return svg(cards.map((c, i) => { const op = clamp(p * 3 - i), hl = i === 1; const x = 30 + i * 290, y = hl ? 30 : 60;
      return `<g opacity="${op}" transform="translate(${x},${y + (1 - op) * 30})"><rect width="260" height="${hl ? 310 : 260}" rx="20" fill="${hl ? C.am : C.panel}" stroke="${hl ? C.am : C.borde}" stroke-width="3"/><text x="130" y="70" text-anchor="middle" ${cond} font-size="40" font-weight="800" fill="${hl ? C.carbon : C.claro}">${c[0]}</text><text x="130" y="150" text-anchor="middle" ${mono} font-size="50" font-weight="600" fill="${hl ? C.carbon : C.am}">${c[1]}</text>${hl ? `<text x="130" y="210" text-anchor="middle" ${sans} font-size="24" font-weight="700" fill="${C.carbon}">+ causa raíz</text><text x="130" y="244" text-anchor="middle" ${sans} font-size="24" font-weight="700" fill="${C.carbon}">+ prueba térmica</text>` : ''}</g>`; }).join('') +
      `<text x="450" y="392" text-anchor="middle" ${mono} font-size="22" fill="${C.tenue}">EJEMPLO ILUSTRATIVO · CALCULA TUS PRECIOS</text>`);
  },
  dlc(o = {}) {
    const p = o.p ?? 1; const cx = 330, top = 70, bot = 300, wt = 520, wb = 410;
    let s = `<path d="M${cx - wt / 2} ${top} L${cx + wt / 2} ${top} L${cx + wb / 2} ${bot} L${cx - wb / 2} ${bot} Z" fill="#111" stroke="${C.borde}" stroke-width="4"/>`;
    const pin = (n, x, y) => { const hl = n === 6 || n === 14; return `<rect x="${x - 19}" y="${y - 26}" width="38" height="52" rx="6" fill="${hl ? C.am : '#7E868F'}"/><text x="${x}" y="${y + 9}" text-anchor="middle" ${mono} font-size="22" font-weight="600" fill="${C.carbon}">${n}</text>`; };
    for (let i = 0; i < 8; i++) s += pin(i + 1, cx - 210 + i * 60, 140); for (let i = 0; i < 8; i++) s += pin(i + 9, cx - 161 + i * 46, 232);
    const v = (60.2 * clamp((p - 0.3) / 0.5) + 0).toFixed(1);
    s += `<g opacity="${clamp(p * 2)}"><path d="M${cx - 210 + 5 * 60} 114 C 600 40, 640 60, 650 120" stroke="${C.rojo}" stroke-width="5" fill="none"/><path d="M${cx - 161 + 5 * 46} 258 C 560 330, 620 300, 650 250" stroke="#111" stroke-width="5" fill="none"/></g>`;
    s += meter(640, 50, v, 'Ω', p > 0.8 ? C.verde : C.carbon, 'Pines 6–14 ≈ 60 Ω', { w: 240, h: 200 });
    return svg(s);
  },
  tierra(o = {}) {
    const p = o.p ?? 1;
    return svg(`${meter(40, 20, '0.62', 'V caída', C.rojo, 'Tierra con caída: falla')}${meter(530, 20, p > 0.5 ? '0.04' : '----', 'V caída', C.verde, 'Tierra buena: < 0.1 V')}`);
  },
  inyector(o = {}) {
    const p = o.p ?? 1;
    const iny = (x, ok) => `<g transform="translate(${x},40)"><rect x="40" y="0" width="70" height="40" rx="6" fill="#55606B"/><rect x="25" y="40" width="100" height="150" rx="14" fill="${ok ? '#3D4752' : '#5A2B2D'}" stroke="${ok ? C.verde : C.rojo}" stroke-width="4"/><rect x="60" y="190" width="30" height="60" fill="#8B949C"/><path d="M75 250 l-10 30 h20 z" fill="#8B949C"/></g>`;
    return svg(`${iny(70, true)}${meter(250, 30, '12.1', 'Ω', C.verde, 'Inyector sano', { w: 220, h: 190 })}<g opacity="${clamp(p * 2 - 0.5)}">${iny(500, false)}${meter(660, 30, '3.2', 'Ω', C.rojo, 'En corto: quema el driver', { w: 220, h: 190 })}</g>`);
  },
  semaforo(o = {}) {
    const p = o.p ?? 1, on = Math.min(2, Math.floor(p * 3 - 0.001));
    const items = [['Verde', 'No es la computadora', C.verde], ['Amarillo', 'Confírmalo en banco', C.am], ['Rojo', 'Computadora dañada: repara', C.rojo]];
    return svg(`<rect x="40" y="20" width="150" height="360" rx="75" fill="#111" stroke="${C.borde}" stroke-width="4"/>` + items.map((it, i) => `<circle cx="115" cy="${90 + i * 110}" r="44" fill="${i <= on ? it[2] : '#2E343A'}"/>`).join('') +
      items.map((it, i) => `<g opacity="${i <= on ? 1 : 0.35}"><rect x="240" y="${45 + i * 110}" width="620" height="90" rx="14" fill="${C.panel}" stroke="${it[2]}" stroke-width="3"/><text x="270" y="${85 + i * 110}" ${cond} font-size="36" font-weight="800" fill="${it[2]}">${it[0]}</text><text x="270" y="${120 + i * 110}" ${sans} font-size="28" font-weight="600" fill="${C.claro}">${it[1]}</text></g>`).join(''));
  },
  bloques(o = {}) {
    const hl = o.hl ?? -1; const st = [['Alimentación', 'TVS · reguladores'], ['Entradas', 'Ref. 5 V · sensores'], ['Micro', 'Reloj · memoria'], ['Salidas', 'Drivers · IGBT'], ['Red', 'CAN · LIN']];
    return svg(st.map((s, i) => { const x = 10 + i * 178, on = hl < 0 || hl === i; return `<g opacity="${on ? 1 : 0.35}"><rect x="${x}" y="110" width="160" height="180" rx="18" fill="${hl === i ? C.am : C.panel}" stroke="${hl === i ? C.am : C.borde}" stroke-width="3"/><text x="${x + 80}" y="170" text-anchor="middle" ${mono} font-size="26" fill="${hl === i ? C.carbon : C.tenue}">0${i + 1}</text><text x="${x + 80}" y="215" text-anchor="middle" ${cond} font-size="32" font-weight="800" fill="${hl === i ? C.carbon : C.claro}">${s[0]}</text><text x="${x + 80}" y="252" text-anchor="middle" ${sans} font-size="19" font-weight="600" fill="${hl === i ? C.carbon : C.tenue}">${s[1]}</text></g>${i < 4 ? `<path d="M${x + 162} 200 h14" stroke="${C.am}" stroke-width="5"/>` : ''}`; }).join(''));
  },
  bench(o = {}) {
    const p = o.p ?? 1; const a = (0.42 * clamp(p * 1.4)).toFixed(2);
    return svg(`<rect x="30" y="40" width="330" height="200" rx="18" fill="${C.panel}" stroke="${C.borde}" stroke-width="3"/><text x="60" y="88" ${mono} font-size="22" fill="${C.tenue}">FUENTE · LÍMITE 1.5 A</text><text x="60" y="160" ${mono} font-size="62" font-weight="600" fill="${C.am}">13.50<tspan font-size="30"> V</tspan></text><text x="60" y="215" ${mono} font-size="40" fill="${C.verde}">${a}<tspan font-size="24"> A</tspan></text>
      <path d="M360 140 H470" stroke="${C.rojo}" stroke-width="6"/><path d="M360 200 H470" stroke="#111" stroke-width="6"/>
      <rect x="470" y="40" width="400" height="300" rx="20" fill="#1A2420" stroke="#2F4A3D" stroke-width="3"/><rect x="620" y="130" width="110" height="110" rx="6" fill="#111" stroke="#666"/><text x="675" y="192" text-anchor="middle" ${mono} font-size="20" fill="#C9CED4">MCU</text>
      ${[0, 1, 2, 3].map(i => `<circle cx="${520 + i * 40}" cy="300" r="12" fill="${C.am}" opacity="${(Math.floor(p * 12) % 4) === i ? 1 : 0.25}"/>`).join('')}<text x="690" y="306" ${mono} font-size="20" fill="#C9CED4">INY 1–4</text>
      <text x="200" y="300" text-anchor="middle" ${cond} font-size="34" font-weight="700" fill="${C.claro}">ECU en banco</text>`);
  }
};

const BASE_CSS = `${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.gris};overflow:hidden}
.ad{position:absolute;inset:0;background:${C.gris};background-image:linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px);background-size:40px 40px;overflow:hidden;font-family:Barlow,Arial,sans-serif;color:${C.claro}}
.stripe{position:absolute;left:0;top:0;bottom:0;background:${C.am}}
.abs{position:absolute}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:2px;color:${C.carbon};background:${C.am};display:inline-block;padding:.25em .6em;border-radius:6px}
.hook{font-family:'Barlow Condensed',sans-serif;font-weight:800;line-height:.98;color:#fff;letter-spacing:.3px}
.hook em{font-style:normal;color:${C.am}}
.prof{object-fit:contain;object-position:bottom right}
.logo{object-fit:contain;border-radius:4px}
.vals{display:flex;justify-content:center;gap:.6em;flex-wrap:wrap}
.vals span{font-family:'IBM Plex Mono',monospace;font-weight:600;background:${C.carbon};border:2px solid ${C.borde};border-radius:10px;padding:.35em .7em;color:${C.am};white-space:nowrap}
.cta{background:${C.am};color:${C.carbon};display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.cta b{font-family:'Barlow Condensed',sans-serif;font-weight:800;line-height:1}
.cta small{font-family:'IBM Plex Mono',monospace;font-weight:600;line-height:1.2}
.name{font-family:'Barlow Condensed',sans-serif;font-weight:700;color:${C.claro};text-align:right;line-height:1.05}
.name small{display:block;font-family:'IBM Plex Mono',monospace;font-size:.62em;color:${C.am};font-weight:600}
.tag{font-family:'IBM Plex Mono',monospace;color:${C.tenue}}
`;
// Geometrías por formato (posición absoluta en px)
function geo(w, h) {
  const k = w + 'x' + h;
  const G = {
    '1080x1350': { stripe: 28, logo: [790, 40, 250, 94], prof: [740, 150, 320, 640], name: [690, 730, 360, 70, 30], eyebrow: [72, 64, 26], hook: [72, 130, 640, 90], vis: [60, 800, 960, 300], vals: [40, 1100, 1000, 27], cta: [28, 1200, 1052, 150, 54, 24] },
    '1080x1920': { stripe: 28, logo: [790, 270, 250, 94], prof: [720, 390, 340, 720], name: [670, 1040, 380, 70, 32], eyebrow: [72, 280, 28], hook: [72, 350, 620, 100], vis: [60, 1130, 960, 320], vals: [40, 1462, 1000, 28], cta: [28, 1540, 1052, 130, 54, 24] },
    '1080x1080': { stripe: 26, logo: [800, 34, 230, 86], prof: [770, 130, 290, 470], name: [700, 560, 350, 60, 26], eyebrow: [66, 50, 24], hook: [66, 110, 660, 82], vis: [60, 600, 960, 250], vals: [40, 862, 1000, 24], cta: [26, 945, 1054, 135, 50, 22] },
    '1200x628': { stripe: 22, logo: [985, 24, 190, 72], prof: [930, 92, 250, 420], name: [930, 452, 250, 60, 17], eyebrow: [56, 32, 18], hook: [56, 76, 720, 64], vis: [40, 290, 560, 200], vals: [610, 296, 300, 19, 'col'], cta: [22, 528, 1178, 100, 40, 18] },
    '1200x630': { stripe: 22, logo: [985, 24, 190, 72], prof: [930, 92, 250, 420], name: [930, 454, 250, 60, 17], eyebrow: [56, 32, 18], hook: [56, 76, 720, 64], vis: [40, 290, 560, 200], vals: [610, 296, 300, 19, 'col'], cta: [22, 530, 1178, 100, 40, 18] },
    '1280x720': { stripe: 24, logo: [1050, 28, 200, 76], prof: [900, 60, 360, 660], name: [0, 0, 0, 0, 0], eyebrow: [60, 40, 22], hook: [60, 92, 820, 104], vis: [50, 420, 760, 260], vals: [0, 0, 0, 0], cta: [0, 0, 0, 0] }
  };
  return G[k];
}
function adHTML(spec) {
  const { w, h } = spec, g = geo(w, h);
  const px = (a) => `left:${a[0]}px;top:${a[1]}px;width:${a[2]}px;height:${a[3]}px`;
  let html = `<div class="ad" style="width:${w}px;height:${h}px"><div class="stripe" style="width:${g.stripe}px"></div>`;
  if (spec.showProf !== false && g.prof[2]) html += `<img class="abs prof" src="${PROF}" style="${px(g.prof)}">` + (g.name[2] ? `<div class="abs name" style="${px(g.name)};font-size:${g.name[4]}px;display:flex;flex-direction:column;justify-content:flex-end"><span style="background:#1E2227cc;padding:6px 10px;border-radius:8px;align-self:flex-end">Prof. José Luis Orozco Cuautle<small>50 AÑOS DE EXPERIENCIA</small></span></div>` : '');
  if (spec.showLogo !== false) html += `<img class="abs logo" src="${LOGO}" style="${px(g.logo)};z-index:3">`;
  html += `<div class="abs" style="left:${g.eyebrow[0]}px;top:${g.eyebrow[1]}px;font-size:${g.eyebrow[2]}px"><span class="eyebrow">${spec.eyebrow}</span></div>`;
  html += `<div class="abs hook" style="left:${g.hook[0]}px;top:${g.hook[1]}px;width:${g.hook[2]}px;font-size:${spec.hookSize || g.hook[3]}px">${spec.hook}</div>`;
  if (spec.sub) html += `<div class="abs" style="left:${g.hook[0]}px;top:${spec.subTop}px;width:${g.hook[2]}px;font-size:${spec.subSize || Math.round(g.hook[3] * 0.36)}px;font-weight:600;color:${C.claro}">${spec.sub}</div>`;
  if (spec.visual) html += `<div class="abs" style="${px(spec.visBox || g.vis)}">${V[spec.visual](spec.vp || {})}</div>`;
  if (spec.vals && g.vals[2]) html += `<div class="abs vals" style="${px(spec.valsBox || g.vals)};font-size:${g.vals[3]}px;${g.vals[4] === 'col' ? 'flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:12px;height:auto' : ''}">${spec.vals.map(v => `<span>${v}</span>`).join('')}</div>`;
  if (g.cta[2]) html += `<div class="abs cta" style="${px(g.cta)}"><b style="font-size:${g.cta[4]}px">${spec.cta || 'Escribe ECU por WhatsApp'}</b><small style="font-size:${g.cta[5]}px;margin-top:8px">${spec.ctaSub || '55 5217 3484 · Curso $1,799 MXN · León y CDMX'}</small></div>`;
  if (spec.extra) html += spec.extra;
  return html + '</div>';
}
function page(inner, w, h, extraCss = '') { return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><style>${BASE_CSS}${extraCss}</style></head><body style="width:${w}px;height:${h}px;position:relative">${inner}</body></html>`; }
module.exports = { V, C, adHTML, page, geo, BASE_CSS, PROF, LOGO, clamp, svg };
