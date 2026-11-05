// Diagramas técnicos del curso (SVG) · Electrónica y Servicio
// Diagramas didácticos simplificados, elaborados para el curso. Se renderizan a PNG con render_diagrams.js
const C = { gris: '#2B3036', carbon: '#1E2227', am: '#FFC20E', rojo: '#E5484D', verde: '#2FB344', azul: '#2D7FF9', claro: '#EEF0F2', blanco: '#FFFFFF', tenue: '#8A929B', linea: '#C9CED4' };
const W = 1200, H = 750;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function T(x, y, s, o = {}) {
  const size = o.size || 22, fam = o.mono ? "'IBM Plex Mono'" : (o.cond ? "'Barlow Condensed'" : "'Barlow'");
  const lines = String(s).split('\n');
  return lines.map((ln, i) => `<text x="${x}" y="${y + i * size * 1.18}" font-family="${fam}, Arial, sans-serif" font-size="${size}" font-weight="${o.w || 600}" fill="${o.fill || C.gris}" text-anchor="${o.a || 'middle'}"${o.italic ? ' font-style="italic"' : ''}>${esc(ln)}</text>`).join('');
}
function B(x, y, w, h, label, o = {}) {
  const fill = o.fill || C.claro, stroke = o.stroke || C.gris, tc = o.tc || C.gris;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw || 2.5}"${o.dash ? ' stroke-dasharray="8 6"' : ''}/>`;
  if (label) {
    const n = String(label).split('\n').length, size = o.size || 22;
    const sub = o.sub ? String(o.sub).split('\n').length : 0;
    const totalH = n * size * 1.18 + (sub ? sub * (o.subSize || 16) * 1.2 + 4 : 0);
    const y0 = y + h / 2 - totalH / 2 + size * 0.85;
    s += T(x + w / 2, y0, label, { size, w: o.w || 700, fill: tc, cond: o.cond !== false });
    if (o.sub) s += T(x + w / 2, y0 + n * size * 1.18 + 2, o.sub, { size: o.subSize || 16, w: 500, fill: o.subFill || tc });
  }
  return s;
}
function L(pts, o = {}) {
  const color = o.color || C.gris, d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  const mk = o.arrow === false ? '' : ` marker-end="url(#ar-${o.mk || 'g'})"`;
  const mks = o.both ? ` marker-start="url(#as-${o.mk || 'g'})"` : '';
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${o.w || 3}"${o.dash ? ' stroke-dasharray="9 7"' : ''} stroke-linejoin="round"${mk}${mks}/>`;
}
const DOT = (x, y, c = C.gris, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
function defs() {
  const m = (id, c) => `<marker id="ar-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker><marker id="as-${id}" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker>`;
  return `<defs>${m('g', C.gris)}${m('r', C.rojo)}${m('b', C.azul)}${m('v', C.verde)}${m('a', '#C99400')}<pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0 L0 0 0 30" fill="none" stroke="#E6E9EC" stroke-width="1"/></pattern></defs>`;
}
function frame(title, body, nota) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}<rect width="${W}" height="${H}" fill="#FFFFFF"/><rect width="${W}" height="${H}" fill="url(#grid)"/>` +
    `<rect x="0" y="0" width="14" height="${H}" fill="${C.am}"/>` +
    T(40, 46, title, { size: 32, w: 800, a: 'start', cond: true, fill: C.carbon }) +
    body +
    T(40, H - 18, (nota ? nota + '  ·  ' : '') + 'Diagrama didáctico simplificado · Electrónica y Servicio', { size: 15, w: 500, a: 'start', fill: C.tenue }) + '</svg>';
}
// Resistencia en zigzag (horizontal o vertical)
function R(x, y, len, vertical, label, o = {}) {
  const n = 6, amp = 9, seg = len / (n + 2); let p = [];
  for (let i = 0; i <= n + 2; i++) {
    const t = i * seg, off = (i === 0 || i === n + 2) ? 0 : (i % 2 ? amp : -amp);
    p.push(vertical ? [x + off, y + t] : [x + t, y + off]);
  }
  let s = L(p, { arrow: false, color: o.color || C.gris, w: 2.5 });
  if (label) s += vertical ? T(x + 18, y + len / 2 + 6, label, { size: 17, a: 'start', mono: true }) : T(x + len / 2, y - 16, label, { size: 17, mono: true });
  return s;
}
function GND(x, y, c = C.gris) { return `<path d="M${x} ${y} L${x} ${y + 12} M${x - 16} ${y + 12} L${x + 16} ${y + 12} M${x - 10} ${y + 18} L${x + 10} ${y + 18} M${x - 4} ${y + 24} L${x + 4} ${y + 24}" stroke="${c}" stroke-width="2.5"/>`; }
function CAP(x, y, label) { return `<path d="M${x} ${y} L${x} ${y + 18} M${x - 16} ${y + 18} L${x + 16} ${y + 18} M${x - 16} ${y + 26} L${x + 16} ${y + 26} M${x} ${y + 26} L${x} ${y + 44}" stroke="${C.gris}" stroke-width="2.5" fill="none"/>` + (label ? T(x + 24, y + 28, label, { size: 16, a: 'start', mono: true }) : '') + GND(x, y + 44); }
function DIODE(x, y, dir = 'right', c = C.gris, label) {
  // diodo horizontal de 50 px
  const s = dir === 'right' ? `<path d="M${x} ${y} L${x + 14} ${y} M${x + 14} ${y - 13} L${x + 14} ${y + 13} L${x + 36} ${y} Z M${x + 36} ${y - 13} L${x + 36} ${y + 13} M${x + 36} ${y} L${x + 50} ${y}" stroke="${c}" stroke-width="2.5" fill="${c}" fill-opacity="0.15"/>` :
    `<path d="M${x} ${y} L${x + 14} ${y} M${x + 14} ${y - 13} L${x + 14} ${y + 13} M${x + 14} ${y} L${x + 36} ${y - 13} L${x + 36} ${y + 13} Z M${x + 36} ${y} L${x + 50} ${y}" stroke="${c}" stroke-width="2.5" fill="${c}" fill-opacity="0.15"/>`;
  return s + (label ? T(x + 25, y - 22, label, { size: 16, mono: true }) : '');
}
function wave(pts, color, w = 3) { return L(pts, { arrow: false, color, w }); }

const D = {};

D.d_bloques = () => frame('Diagrama de bloques de una computadora automotriz', [
  B(40, 110, 230, 90, 'Batería · Ignición', { fill: '#FDECEC', stroke: C.rojo, sub: 'B+ directa · IGN' }),
  B(40, 250, 230, 110, 'Protección y filtro', { fill: '#FDECEC', stroke: C.rojo, sub: 'Diodo polaridad · TVS\nBobina + capacitores' }),
  B(40, 410, 230, 110, 'Reguladores', { fill: '#FDECEC', stroke: C.rojo, sub: '5 V micro · 3.3 V · núcleo\nReferencias 5 V sensores' }),
  L([[155, 200], [155, 248]], { color: C.rojo, mk: 'r' }), L([[155, 360], [155, 408]], { color: C.rojo, mk: 'r' }),
  B(460, 250, 300, 190, 'MICROCONTROLADOR', { fill: '#FFF6D6', stroke: '#C99400', size: 23, sub: 'CPU · Flash (programa)\nRAM · ADC · temporizadores\nReloj + reset + watchdog' }),
  B(520, 480, 180, 70, 'EEPROM', { fill: '#FFF6D6', stroke: '#C99400', sub: 'VIN · inmovilizador' }),
  L([[610, 440], [610, 478]], { color: '#C99400', mk: 'a', both: true }),
  L([[270, 465], [380, 465], [380, 345], [468, 345]], { color: C.rojo, mk: 'r' }), T(330, 455, '5 V', { size: 18, mono: true, fill: C.rojo }),
  B(300, 110, 300, 90, 'Sensores', { fill: '#E7F0FF', stroke: C.azul, sub: 'MAP · TPS · CKP · CMP · ECT · O2' }),
  B(300, 600, 240, 80, 'Etapas de entrada', { fill: '#E7F0FF', stroke: C.azul, sub: 'Filtro RC · acondicionador' }),
  L([[450, 200], [450, 300], [468, 300]], { color: C.azul, mk: 'b' }), T(485, 230, 'señales', { size: 17, a: 'start', fill: C.azul }),
  L([[270, 500], [290, 500], [290, 560], [420, 560], [420, 598]], { color: C.rojo, mk: 'r', dash: true }), T(300, 590, 'ref. 5 V', { size: 16, a: 'start', fill: C.rojo, mono: true }),
  L([[540, 640], [640, 640], [640, 552]], { color: C.azul, mk: 'b', arrow: false }),
  B(860, 250, 300, 110, 'Drivers de salida', { fill: '#E6F6EA', stroke: C.verde, sub: 'MOSFET · IGBT · puente H\nICs multicanal' }),
  B(860, 410, 300, 110, 'Actuadores', { fill: '#E6F6EA', stroke: C.verde, sub: 'Inyectores · bobinas · relevadores\nMariposa · solenoides' }),
  L([[750, 305], [858, 305]], { color: C.verde, mk: 'v' }), L([[1010, 360], [1010, 408]], { color: C.verde, mk: 'v' }),
  B(860, 600, 300, 80, 'Transceptores CAN / LIN', { fill: '#EDEFF2', stroke: C.gris, sub: '↔ Red del vehículo y DLC' }),
  L([[750, 410], [800, 410], [800, 640], [858, 640]], { color: C.gris, mk: 'g', both: true }),
  T(1010, 140, 'Energía', { size: 18, fill: C.rojo, a: 'start' }), L([[920, 134], [1000, 134]], { color: C.rojo, mk: 'r' }),
  T(1010, 172, 'Señales', { size: 18, fill: C.azul, a: 'start' }), L([[920, 166], [1000, 166]], { color: C.azul, mk: 'b' }),
  T(1010, 204, 'Mando', { size: 18, fill: C.verde, a: 'start' }), L([[920, 198], [1000, 198]], { color: C.verde, mk: 'v' })
].join(''));

D.d_dlc = () => {
  // Conector J1962 visto de frente: fila superior ancha (1–8), inferior estrecha (9–16), lados angulados, sin muesca
  const cx = 600, top = 170, bot = 430, wt = 760, wb = 600;
  let s = `<path d="M${cx - wt / 2} ${top} L${cx + wt / 2} ${top} L${cx + wb / 2} ${bot} L${cx - wb / 2} ${bot} Z" fill="${C.carbon}" stroke="${C.gris}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="M${cx - wt / 2 + 26} ${top + 22} L${cx + wt / 2 - 26} ${top + 22} L${cx + wb / 2 - 22} ${bot - 22} L${cx - wb / 2 + 22} ${bot - 22} Z" fill="#3A4048"/>`;
  const fn = { 2: 'J1850 +', 4: 'Tierra chasis', 5: 'Tierra señal', 6: 'CAN-H', 7: 'Línea K', 10: 'J1850 −', 14: 'CAN-L', 15: 'Línea L', 16: 'Batería +' };
  const col = { 4: C.claro, 5: C.claro, 16: C.rojo, 6: C.am, 14: C.am, 2: C.azul, 10: C.azul, 7: C.verde, 15: C.verde };
  const row = (n0, y, span) => { let r = ''; for (let i = 0; i < 8; i++) { const n = n0 + i, x = cx - span / 2 + i * span / 7; r += `<rect x="${x - 20}" y="${y - 26}" width="40" height="52" rx="6" fill="${col[n] || '#9AA1A9'}" stroke="#111" stroke-width="2"/>` + T(x, y + 9, String(n), { size: 24, w: 800, fill: (n === 16 || n === 2 || n === 10) ? '#fff' : C.carbon, mono: true }); } return r; };
  s += row(1, 248, 560) + row(9, 352, 420);
  // etiquetas superiores e inferiores
  const lab = (n, x, y, up) => { const px = n <= 8 ? cx - 280 + (n - 1) * 80 : cx - 210 + (n - 9) * 60; const py = n <= 8 ? 222 : 378; return L([[px, py], [px, y + (up ? 10 : -26)]], { arrow: false, color: C.tenue, w: 2 }) + T(px, y, `${n} · ${fn[n]}`, { size: 19, w: 700, fill: C.carbon }); };
  s += lab(2, 0, 120, true) + lab(4, 0, 140, true) + lab(5, 0, 100, true) + lab(6, 0, 140, true) + lab(7, 0, 100, true);
  s += lab(10, 0, 500) + lab(14, 0, 525) + lab(15, 0, 500) + lab(16, 0, 545);
  s += T(cx, 600, 'Vista frontal del conector del vehículo · numeración de izquierda a derecha en ambas filas', { size: 20, w: 600, fill: C.gris });
  s += T(cx, 632, 'Pines 4 y 16 siempre presentes · 6/14 CAN (ISO 15765-4) · Chrysler antiguo: PCI J1850 en pin 2', { size: 18, w: 500, fill: C.tenue });
  s += T(cx, 668, 'Con batería desconectada: 6 ↔ 14 ≈ 60 Ω (dos terminaciones de 120 Ω)', { size: 20, w: 700, fill: C.azul, mono: true });
  return frame('Conector de diagnóstico DLC · SAE J1962 (16 pines)', s, 'Fuente: SAE J1962 / OBDtester');
};

D.d_banco = () => frame('Banco de pruebas: conexión básica de una PCM/ECM', [
  B(40, 110, 220, 120, 'Fuente de\nlaboratorio', { fill: '#FDECEC', stroke: C.rojo, sub: '13.5 V · límite 1–2 A' }),
  B(330, 95, 120, 54, 'Fusible 5 A', { size: 18, fill: '#fff', stroke: C.rojo }), B(330, 175, 120, 54, 'Fusible 2 A', { size: 18, fill: '#fff', stroke: C.rojo }),
  B(500, 95, 130, 54, 'Int. B+', { size: 18, fill: '#fff' }), B(500, 175, 130, 54, 'Int. IGN', { size: 18, fill: '#fff' }),
  L([[260, 140], [300, 140], [300, 122], [328, 122]], { color: C.rojo, mk: 'r' }), L([[300, 140], [300, 202], [328, 202]], { color: C.rojo, mk: 'r' }),
  L([[450, 122], [498, 122]], { color: C.rojo, mk: 'r' }), L([[450, 202], [498, 202]], { color: C.rojo, mk: 'r' }),
  B(720, 110, 260, 330, 'PCM / ECM', { fill: '#FFF6D6', stroke: '#C99400', size: 30, sub: 'B+ · IGN · TODAS las tierras\nCAN-H / CAN-L\nEntradas CKP / CMP / MAP / TPS\nSalidas a cargas' }),
  L([[630, 122], [718, 122]], { color: C.rojo, mk: 'r' }), L([[630, 202], [718, 202]], { color: C.rojo, mk: 'r' }),
  L([[150, 230], [150, 470], [700, 470], [700, 420], [718, 420]], { color: C.gris, mk: 'g' }), T(420, 460, 'Tierras (negativo de la fuente)', { size: 17, fill: C.gris }),
  B(40, 520, 240, 110, 'DLC de banco', { fill: '#EDEFF2', sub: '16 → B+ · 4/5 → tierra\n6 → CAN-H · 14 → CAN-L' }),
  R(300, 640, 120, false, '120 Ω (si va sola)'),
  L([[280, 560], [690, 560], [690, 360], [718, 360]], { color: C.gris, mk: 'g', both: true }), T(480, 550, 'CAN-H / CAN-L', { size: 17 }),
  B(40, 330, 240, 90, 'Simulador CKP/CMP', { fill: '#E7F0FF', stroke: C.azul, sub: 'Patrón del motor' }),
  L([[280, 375], [560, 375], [560, 300], [718, 300]], { color: C.azul, mk: 'b' }),
  B(455, 245, 240, 80, 'Potenciómetro 5–10 kΩ', { size: 17, fill: '#E7F0FF', stroke: C.azul, sub: 'Simula MAP / TPS', subSize: 15 }),
  L([[695, 285], [718, 285]], { color: C.azul, mk: 'b' }),
  B(1010, 150, 160, 250, 'Cargas', { fill: '#E6F6EA', stroke: C.verde, sub: 'LED + 1 kΩ\npor salida\n\nLámpara 12 V\n(relevadores)\n\nInyectores y\nbobinas reales\n(validación)' }),
  L([[980, 275], [1008, 275]], { color: C.verde, mk: 'v' }),
  B(760, 520, 220, 110, 'Escáner', { fill: '#fff', sub: 'Launch X431 · Autel MX900\nCRT-511PRO' }),
  L([[758, 575], [282, 575]], { color: C.gris, mk: 'g' }),
  B(1010, 520, 160, 110, 'Seguridad', { fill: '#FFF6D6', stroke: '#C99400', size: 20, sub: 'Polaridad ×2\nESD · fusibles\nInmovilizador' })
].join(''), 'Valores típicos; verificar terminales con el diagrama del fabricante');

D.d_alimentacion = () => {
  let s = '';
  s += T(70, 160, 'B+', { size: 26, w: 800, fill: C.rojo }) + DOT(70, 180, C.rojo);
  s += L([[70, 180], [130, 180]], { arrow: false, color: C.rojo }) + DIODE(130, 180, 'right', C.rojo, 'D1 polaridad') + L([[180, 180], [300, 180]], { arrow: false, color: C.rojo });
  s += DOT(240, 180, C.rojo) + L([[240, 180], [240, 230]], { arrow: false, color: C.rojo });
  s += `<path d="M227 230 L253 230 L240 252 Z M227 252 L253 252 M227 252 L222 246 M253 252 L258 258" stroke="${C.rojo}" stroke-width="2.5" fill="${C.rojo}" fill-opacity=".15"/>` + L([[240, 252], [240, 280]], { arrow: false, color: C.rojo }) + GND(240, 280) + T(270, 248, 'TVS', { size: 18, a: 'start', mono: true, fill: C.rojo });
  s += `<path d="M300 180 q12 -22 24 0 q12 -22 24 0 q12 -22 24 0 q12 -22 24 0" fill="none" stroke="${C.gris}" stroke-width="3"/>` + T(348, 150, 'L filtro', { size: 16, mono: true });
  s += L([[396, 180], [470, 180]], { arrow: false, color: C.rojo }) + DOT(430, 180, C.rojo) + CAP(430, 180, 'C bulk');
  s += B(470, 130, 200, 100, 'Preregulador', { fill: '#FDECEC', stroke: C.rojo, sub: 'conmutado (si existe)' });
  s += L([[670, 180], [720, 180], [720, 120], [770, 120]], { color: C.rojo, mk: 'r' }) + L([[720, 180], [720, 270], [770, 270]], { color: C.rojo, mk: 'r' }) + L([[720, 270], [720, 420], [770, 420]], { color: C.rojo, mk: 'r' }) + L([[720, 420], [720, 560], [770, 560]], { color: C.rojo, mk: 'r' });
  s += B(770, 85, 190, 70, 'LDO 5 V', { fill: '#fff', stroke: C.rojo, sub: 'con reset' }) + B(770, 235, 190, 70, 'LDO 3.3 V', { fill: '#fff', stroke: C.rojo }) + B(770, 385, 190, 70, 'Núcleo 1.2–1.5 V', { size: 20, fill: '#fff', stroke: C.rojo }) + B(770, 525, 190, 70, 'Seguidor 5 V', { fill: '#fff', stroke: C.rojo, sub: 'sensores (ref.)' });
  s += B(1010, 160, 160, 230, 'MICRO', { fill: '#FFF6D6', stroke: '#C99400', size: 28, sub: 'VCC 5 V\nI/O 3.3 V\nNúcleo\nRESET' });
  s += L([[960, 120], [985, 120], [985, 200], [1008, 200]], { color: C.rojo, mk: 'r' }) + L([[960, 270], [1008, 270]], { color: C.rojo, mk: 'r' }) + L([[960, 420], [985, 420], [985, 340], [1008, 340]], { color: C.rojo, mk: 'r' });
  s += L([[960, 560], [1100, 560]], { color: C.rojo, mk: 'r' }) + T(1090, 600, 'Sensores', { size: 20 });
  // Puntos de prueba
  const tp = (x, y, n, v) => `<circle cx="${x}" cy="${y}" r="17" fill="${C.am}" stroke="${C.carbon}" stroke-width="2"/>` + T(x, y + 7, 'TP' + n, { size: 14, w: 800, mono: true, fill: C.carbon }) + T(x, y + 42, v, { size: 16, mono: true, w: 600, fill: C.carbon });
  s += tp(100, 230, 1, '12–14 V') + tp(282, 112, 2, '≈ B+ − 0.7') + tp(430, 290, 3, 'sin rizo') + tp(865, 185, 4, '5.0 V') + tp(865, 335, 5, '3.3 V') + tp(865, 625, 6, '5.0 V');
  s += B(40, 400, 560, 230, '', { fill: '#fff', stroke: C.linea });
  s += T(60, 440, 'Cómo medir (en banco, referido a tierra de la tarjeta):', { size: 20, w: 700, a: 'start' });
  s += T(60, 478, '1. TP1→TP3: si se pierde, revisa D1, TVS y filtro.\n2. Fuente en límite: TVS o capacitor en corto.\n3. Entrada OK y salida baja: desconecta carga.\n4. Rizo y reset con osciloscopio (2 canales).\n5. Valores típicos; compara con una tarjeta buena.', { size: 18, w: 500, a: 'start' });
  return frame('Etapa de alimentación: ruta de la energía y puntos de prueba', s, 'Valores típicos; verificar con tarjeta buena del mismo número de parte');
};

D.d_ref5v = () => {
  let s = '';
  s += B(40, 120, 230, 110, 'Seguidor / regulador', { fill: '#FDECEC', stroke: C.rojo, sub: 'Referencia 1 (5 V)\nprotegido contra corto' });
  s += B(40, 440, 230, 110, 'Seguidor / regulador', { fill: '#FDECEC', stroke: C.rojo, sub: 'Referencia 2 (5 V)' });
  s += L([[270, 175], [1080, 175]], { arrow: false, color: C.rojo, w: 4 }) + L([[270, 495], [1080, 495]], { arrow: false, color: C.rojo, w: 4 });
  const sensor = (x, y, name, color, extra) => B(x, y, 170, 90, name, { fill: color || '#E7F0FF', stroke: C.azul, sub: extra || '5 V · señal · retorno' });
  s += L([[400, 175], [400, 248]], { color: C.rojo, mk: 'r' }) + sensor(315, 250, 'MAP', '#FDECEC', 'EN CORTO');
  s += L([[650, 175], [650, 248]], { color: C.rojo, mk: 'r' }) + sensor(565, 250, 'TPS 1');
  s += L([[900, 175], [900, 248]], { color: C.rojo, mk: 'r' }) + sensor(815, 250, 'Presión A/C');
  s += L([[400, 495], [400, 568]], { color: C.rojo, mk: 'r' }) + sensor(315, 570, 'APP 2');
  s += L([[650, 495], [650, 568]], { color: C.rojo, mk: 'r' }) + sensor(565, 570, 'TPS 2');
  s += `<path d="M350 355 l15 -18 l10 14 l15 -22" stroke="${C.rojo}" stroke-width="5" fill="none"/>` + T(470, 382, '⚡ corto interno del sensor', { size: 18, w: 700, fill: C.rojo });
  s += B(860, 380, 300, 60, 'Ref. 1 medida: 1.2 V', { fill: C.rojo, stroke: C.rojo, tc: '#fff', size: 24 });
  s += B(860, 540, 300, 60, 'Ref. 2 medida: 5.0 V', { fill: C.verde, stroke: C.verde, tc: '#fff', size: 24 });
  s += B(1000, 110, 170, 120, 'Escáner', { fill: '#fff', sub: 'P0641 + códigos\nde MAP y TPS1' });
  s += T(600, 690, 'Procedimiento: mide la referencia en un sensor (KOEO) → desconecta uno a uno los sensores que la comparten\n→ el que regresa la referencia a ≈ 5 V es el culpable.', { size: 16, w: 600, fill: C.carbon });
  return frame('Referencias de 5 V: cómo un sensor en corto "jala" su grupo', s, 'Ejemplo ilustrativo; la asignación real se toma del diagrama del vehículo');
};

D.d_entradas = () => {
  let s = '';
  // a) analógica
  s += T(40, 110, 'A · Entrada analógica (MAP, TPS, ECT)', { size: 22, w: 800, a: 'start', fill: C.azul });
  s += B(40, 140, 130, 80, 'Sensor', { fill: '#E7F0FF', stroke: C.azul }) + L([[170, 180], [220, 180]], { arrow: false, color: C.azul }) + R(220, 180, 110, false, 'R serie') + L([[330, 180], [430, 180]], { arrow: false, color: C.azul }) + DOT(390, 180, C.azul) + CAP(390, 180, 'C filtro');
  s += T(495, 268, 'diodos de protección a 5 V y tierra', { size: 14, fill: C.tenue }) + L([[430, 180], [560, 180]], { color: C.azul, mk: 'b' }) + B(560, 145, 160, 70, 'ADC del micro', { size: 20, fill: '#FFF6D6', stroke: '#C99400' });
  // b) hall
  s += T(40, 290, 'B · Entrada Hall (CKP / CMP) con pull-up interno', { size: 22, w: 800, a: 'start', fill: C.azul });
  s += B(40, 350, 130, 90, 'Sensor Hall', { fill: '#E7F0FF', stroke: C.azul, sub: 'colector abierto' }) + L([[170, 395], [430, 395]], { arrow: false, color: C.azul }) + DOT(330, 395, C.azul) + R(330, 330, 65, true, '') + T(348, 368, 'Pull-up', { size: 16, a: 'start', mono: true }) + T(330, 322, '+5 V', { size: 17, fill: C.rojo, mono: true });
  s += L([[430, 395], [560, 395]], { color: C.azul, mk: 'b' }) + B(560, 360, 160, 70, 'Entrada digital', { size: 20, fill: '#FFF6D6', stroke: '#C99400' });
  s += wave([[200, 470], [230, 470], [230, 440], [260, 440], [260, 470], [290, 470], [290, 440], [320, 440], [320, 470], [380, 470], [380, 440], [410, 440]], C.azul) + T(305, 498, '0–5 V cuadrada', { size: 15, mono: true });
  // c) VR
  s += T(40, 560, 'C · Entrada de reluctancia variable (CKP inductivo)', { size: 22, w: 800, a: 'start', fill: C.azul });
  s += B(40, 590, 130, 90, 'Sensor VR', { fill: '#E7F0FF', stroke: C.azul, sub: 'bobina + imán' }) + L([[170, 635], [300, 635]], { color: C.azul, mk: 'b' });
  s += B(300, 595, 230, 80, 'Acondicionador', { fill: '#E7F0FF', stroke: C.azul, sub: 'comparador con histéresis', subSize: 15 }) + L([[530, 635], [560, 635]], { color: C.azul, mk: 'b' }) + B(560, 600, 160, 70, 'Captura (timer)', { size: 20, fill: '#FFF6D6', stroke: '#C99400' });
  // ondas VR
  let p = []; for (let i = 0; i <= 60; i++) { const x = 790 + i * 6, a = (i > 28 && i < 36) ? 0 : (8 + i * 0.6); p.push([x, 610 + Math.sin(i * 0.9) * a]); }
  s += wave(p, C.azul) + T(970, 670, 'Alterna: amplitud crece con RPM', { size: 15, mono: true });
  s += B(780, 130, 380, 330, '', { fill: '#fff', stroke: C.linea });
  s += T(800, 170, 'Prueba de la etapa en banco', { size: 22, w: 800, a: 'start' });
  s += T(800, 210, '• Inyecta señal conocida en la terminal.\n• Compara con el dato del escáner.\n• Sigue la señal con osciloscopio\n  hasta el micro.\n• Hall sin sensor: la terminal debe\n  mostrar el pull-up (≈ 5 V).\n• Termistor: resistencia fija conocida\n  → temperatura reportada.', { size: 18, w: 500, a: 'start' });
  return frame('Etapas de entrada: analógica, Hall y reluctancia variable', s);
};

D.d_driver_iny = () => {
  let s = '';
  s += T(100, 120, '+12 V (ASD / relevador)', { size: 20, a: 'start', fill: C.rojo, w: 700 }) + L([[180, 135], [180, 175]], { arrow: false, color: C.rojo });
  s += B(130, 175, 100, 110, 'Inyector', { fill: '#E6F6EA', stroke: C.verde, size: 20, sub: '≈ 12 Ω' }) + L([[180, 285], [180, 330]], { arrow: false, color: C.verde });
  s += B(110, 330, 300, 300, '', { fill: '#FFF6D6', stroke: '#C99400', dash: true }) + T(300, 618, 'Dentro de la computadora', { size: 16, w: 700, fill: '#8a6a00' });
  s += L([[180, 330], [180, 420]], { arrow: false, color: C.verde }) + DOT(180, 420, C.verde);
  s += `<path d="M160 420 L160 500 M150 430 L150 490 M160 440 L180 440 M160 480 L180 480 L180 520" stroke="${C.gris}" stroke-width="3" fill="none"/>` + L([[110, 460], [150, 460]], { arrow: false, color: C.gris });
  s += T(205, 470, 'MOSFET', { size: 18, a: 'start', w: 700 }) + T(205, 494, 'lado bajo', { size: 15, a: 'start', w: 500 }) + GND(180, 520);
  s += L([[180, 420], [320, 420], [320, 445]], { arrow: false, color: C.gris }) + `<path d="M307 445 L333 445 L320 467 Z M305 467 L335 467" stroke="${C.gris}" stroke-width="2.5" fill="${C.gris}" fill-opacity=".15"/>` + L([[320, 467], [320, 520]], { arrow: false }) + GND(320, 520) + T(345, 465, 'Clamp', { size: 16, a: 'start', mono: true });
  s += B(30, 560, 150, 50, 'Driver / micro', { size: 17, fill: '#fff' }) + L([[105, 560], [105, 460], [110, 460]], { arrow: false });
  // forma de onda
  const ox = 480, oy = 160, ow = 680, oh = 420;
  s += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" fill="${C.carbon}" rx="12"/>`;
  for (let i = 1; i < 10; i++) s += `<line x1="${ox + i * ow / 10}" y1="${oy}" x2="${ox + i * ow / 10}" y2="${oy + oh}" stroke="#39414A"/>`;
  for (let i = 1; i < 8; i++) s += `<line x1="${ox}" y1="${oy + i * oh / 8}" x2="${ox + ow}" y2="${oy + i * oh / 8}" stroke="#39414A"/>`;
  const y12 = oy + 330, y0 = oy + 385, ypk = oy + 70;
  s += wave([[ox + 20, y12], [ox + 140, y12], [ox + 142, y0], [ox + 380, y0], [ox + 384, ypk], [ox + 392, ypk + 6], [ox + 400, ypk + 4], [ox + 410, y12 - 40], [ox + 430, y12 + 6], [ox + 450, y12 - 4], [ox + 470, y12], [ox + 660, y12]], C.am, 4);
  s += T(ox + 70, y12 - 14, '12 V', { size: 17, mono: true, fill: '#fff' }) + T(ox + 260, y0 - 14, '≈ 0 V · tiempo de inyección', { size: 17, mono: true, fill: '#fff' });
  s += T(ox + 520, ypk + 10, 'Pico de clamp', { size: 19, w: 700, fill: C.am, a: 'start' }) + T(ox + 520, ypk + 36, 'típ. 35–80 V', { size: 17, mono: true, fill: '#fff', a: 'start' });
  s += T(ox + ow / 2, oy + oh + 40, 'Voltaje en el lado de control del inyector (osciloscopio)', { size: 18, w: 600 });
  s += T(ox + ow / 2, oy + oh + 70, 'Pico bajo en un cilindro: bobina de inyector en corto o clamp dañado → compara cilindros', { size: 17, w: 500, fill: C.rojo });
  return frame('Driver de inyector: MOSFET de lado bajo y pico inductivo', s, 'Valores típicos; comparar contra un vehículo bueno');
};

D.d_bobina = () => {
  let s = '';
  s += B(40, 100, 540, 560, '', { fill: '#fff', stroke: C.linea }) + T(310, 140, 'A · Driver en la computadora (común en Chrysler)', { size: 18, w: 800, fill: C.carbon });
  s += T(110, 200, '+12 V (ASD)', { size: 19, fill: C.rojo, a: 'start', w: 700 }) + L([[150, 210], [150, 250]], { arrow: false, color: C.rojo });
  s += B(100, 250, 220, 150, 'Bobina 2 cables', { fill: '#E6F6EA', stroke: C.verde, sub: 'Primario ≈ 0.4–1.5 Ω\nSecundario → bujía' });
  s += L([[150, 400], [150, 470]], { arrow: false, color: C.verde }) + B(80, 470, 330, 150, 'PCM: IGBT de encendido', { fill: '#FFF6D6', stroke: '#C99400', size: 22, sub: 'Clamp ≈ 400 V (ej. ISL9V3040)\nautoprotegido · 300 mJ' });
  s += L([[320, 325], [470, 325]], { color: C.gris, mk: 'g' }) + T(500, 315, 'Chispa', { size: 18 }) + T(500, 340, 'kV', { size: 16, mono: true });
  s += B(620, 100, 540, 560, '', { fill: '#fff', stroke: C.linea }) + T(890, 140, 'B · Bobina con transistor integrado (común en Nissan)', { size: 18, w: 800, fill: C.carbon });
  s += B(700, 220, 380, 210, 'Bobina 3 cables', { fill: '#E6F6EA', stroke: C.verde, sub: 'Transistor de potencia integrado\n+12 V · tierra · señal' });
  s += T(700, 200, '+12 V', { size: 18, fill: C.rojo, a: 'start', w: 700 }) + L([[730, 205], [730, 218]], { arrow: false, color: C.rojo });
  s += L([[890, 430], [890, 470]], { color: C.gris, mk: 'g', both: true }) + B(700, 470, 380, 150, 'ECM: driver de señal', { fill: '#FFF6D6', stroke: '#C99400', size: 22, sub: 'Pulso lógico de bajo voltaje\n(no maneja la corriente del primario)' });
  s += wave([[930, 465], [950, 465], [950, 440], [980, 440], [980, 465], [1000, 465]], C.azul);
  s += T(600, 700, 'Antes de reinstalar: mide primarios y secundarios; un corto en la bobina daña el driver de la computadora.', { size: 18, w: 600, fill: C.rojo });
  return frame('Encendido: dos arquitecturas que cambian qué se daña', s, 'Verificar arquitectura en el diagrama del motor; valores típicos');
};

D.d_can = () => {
  let s = '';
  const yH = 170, yL = 230;
  s += L([[90, yH], [1110, yH]], { arrow: false, color: C.am, w: 5 }) + L([[90, yL], [1110, yL]], { arrow: false, color: '#8E6A00', w: 5 });
  s += T(70, yH + 7, 'H', { size: 22, w: 800, fill: '#C99400' }) + T(70, yL + 7, 'L', { size: 22, w: 800, fill: '#8E6A00' });
  s += R(110, yH, yL - yH, true, '') + T(140, 205, '120 Ω', { size: 18, a: 'start', mono: true, w: 700 }) + R(1090, yH, yL - yH, true, '') + T(1060, 205, '120 Ω', { size: 18, a: 'end', mono: true, w: 700 });
  const node = (x, n) => L([[x, yH], [x, 280]], { arrow: false, color: C.am }) + L([[x + 16, yL], [x + 16, 280]], { arrow: false, color: '#8E6A00' }) + B(x - 62, 280, 140, 60, n, { size: 18, fill: '#fff' });
  s += node(260, 'PCM/ECM') + node(450, 'TCM') + node(640, 'ABS') + node(830, 'Gateway/BCM');
  s += L([[1000, yH], [1000, 120]], { arrow: false, color: C.am }) + L([[1016, yL], [1016, 250], [1040, 250], [1040, 120]], { arrow: false, color: '#8E6A00' }) + B(950, 80, 130, 44, 'DLC 6 / 14', { size: 18, fill: C.claro });
  // forma de onda
  const ox = 90, oy = 390, ow = 1020, oh = 260;
  s += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" fill="${C.carbon}" rx="12"/>`;
  const v2y = v => oy + oh - 30 - (v / 4.5) * (oh - 60);
  [1.5, 2.5, 3.5].forEach(v => { s += `<line x1="${ox}" y1="${v2y(v)}" x2="${ox + ow}" y2="${v2y(v)}" stroke="#4A525C" stroke-dasharray="6 6"/>` + T(ox + ow - 12, v2y(v) - 8, v.toFixed(1) + ' V', { size: 16, mono: true, fill: '#C9CED4', a: 'end' }); });
  const bits = [1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1];
  let pH = [], pL = []; const bw = (ow - 140) / bits.length;
  bits.forEach((b, i) => { const x0 = ox + 30 + i * bw, x1 = x0 + bw; const h = b ? 2.5 : 3.5, l = b ? 2.5 : 1.5; pH.push([x0, v2y(h)], [x1, v2y(h)]); pL.push([x0, v2y(l) + (b ? 3 : 0)], [x1, v2y(l) + (b ? 3 : 0)]); });
  s += wave(pH, C.am, 4) + wave(pL, '#5FB0FF', 4);
  s += T(ox + 60, oy + 34, 'CAN-H', { size: 18, w: 700, fill: C.am }) + T(ox + 140, oy + 34, 'CAN-L', { size: 18, w: 700, fill: '#5FB0FF' });
  s += T(ox + ow / 2, oy + oh - 16, 'Recesivo (1): ambas ≈ 2.5 V · Dominante (0): H ≈ 3.5 V, L ≈ 1.5 V · diferencial ≈ 2 V', { size: 17, mono: true, fill: '#fff' });
  return frame('CAN de alta velocidad: topología, terminación y niveles', s, 'Fuentes: TI SLOA101, NXP TJA1042 (valores típicos)');
};

D.d_lin = () => {
  let s = '';
  s += L([[120, 220], [1080, 220]], { arrow: false, color: C.verde, w: 5 }) + T(1100, 228, 'LIN', { size: 22, w: 800, fill: C.verde, a: 'start' });
  s += B(80, 260, 240, 130, 'Maestro', { fill: '#FFF6D6', stroke: '#C99400', size: 24, sub: 'BCM / ECM\npull-up 1 kΩ + diodo a VBAT' });
  s += B(480, 260, 220, 110, 'Esclavo 1', { fill: '#E6F6EA', stroke: C.verde, sub: 'Alternador inteligente' }) + B(820, 260, 220, 110, 'Esclavo 2', { fill: '#E6F6EA', stroke: C.verde, sub: 'Sensor / interruptor' });
  s += L([[200, 220], [200, 258]], { arrow: false, color: C.verde }) + L([[590, 220], [590, 258]], { arrow: false, color: C.verde }) + L([[930, 220], [930, 258]], { arrow: false, color: C.verde });
  const ox = 80, oy = 430, ow = 1040, oh = 230; s += `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" fill="${C.carbon}" rx="12"/>`;
  const yv = v => oy + oh - 25 - (v / 13) * (oh - 50);
  [[12, 'VBAT ≈ 12 V'], [7.2, '60 %'], [4.8, '40 %'], [2.4, '20 %']].forEach(([v, t]) => { s += `<line x1="${ox}" y1="${yv(v)}" x2="${ox + ow}" y2="${yv(v)}" stroke="#4A525C" stroke-dasharray="6 6"/>` + T(ox + ow - 12, yv(v) - 8, t, { size: 16, mono: true, fill: '#C9CED4', a: 'end' }); });
  const bits = [1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
  let p = []; const bw = (ow - 180) / bits.length; bits.forEach((b, i) => { const x0 = ox + 30 + i * bw; p.push([x0, yv(b ? 11.6 : 1.2)], [x0 + bw, yv(b ? 11.6 : 1.2)]); });
  s += wave(p, '#7CE38B', 4);
  s += T(ox + 520, oy + 36, 'Recesivo ≈ batería · dominante ≤ 0.2·VSUP (transmisor) · receptor: < 40 % dominante, > 60 % recesivo', { size: 16, mono: true, fill: '#fff' });
  s += T(600, 150, 'Un solo cable · hasta ≈ 20 kbit/s · el maestro pregunta y los esclavos responden', { size: 20, w: 600 });
  return frame('LIN: red de un cable referida a batería', s, 'Fuentes: ISO 17987 (vía NXP TJA1021, TI TLIN1021A-Q1, Microchip)');
};

D.d_puenteh = () => {
  let s = '';
  s += T(600, 110, '+12 V', { size: 22, w: 800, fill: C.rojo }) + L([[300, 125], [900, 125]], { arrow: false, color: C.rojo, w: 4 });
  s += GND(600, 610) + L([[300, 610], [900, 610]], { arrow: false, color: C.gris, w: 4 });
  const sw = (x, y, n, on) => B(x - 70, y - 45, 140, 90, n, { fill: on ? '#E6F6EA' : '#fff', stroke: on ? C.verde : C.gris, size: 24, sub: on ? 'ON' : 'OFF' });
  s += L([[300, 125], [300, 190]], { arrow: false }) + L([[900, 125], [900, 190]], { arrow: false }) + L([[300, 545], [300, 610]], { arrow: false }) + L([[900, 545], [900, 610]], { arrow: false });
  s += sw(300, 235, 'HS1', true) + sw(900, 235, 'HS2', false) + sw(300, 500, 'LS1', false) + sw(900, 500, 'LS2', true);
  s += L([[300, 280], [300, 455]], { arrow: false }) + L([[900, 280], [900, 455]], { arrow: false });
  s += L([[300, 367], [520, 367]], { arrow: false }) + L([[680, 367], [900, 367]], { arrow: false });
  s += `<circle cx="600" cy="367" r="80" fill="#FFF6D6" stroke="#C99400" stroke-width="3"/>` + T(600, 378, 'M', { size: 44, w: 800 }) + T(600, 470, 'Motor de mariposa', { size: 18 });
  s += L([[330, 160], [330, 340], [560, 340]], { color: C.verde, mk: 'v', w: 4 }) + L([[640, 340], [870, 340], [870, 560]], { color: C.verde, mk: 'v', w: 4 });
  s += T(450, 325, 'Abrir: HS1 + LS2', { size: 18, w: 700, fill: C.verde });
  s += B(960, 160, 210, 200, 'Puente H', { fill: '#fff', size: 22, sub: 'ej. TLE7209\n5 A continuos\n5–28 V\nprotección térmica\ny de corto' });
  s += B(20, 160, 190, 200, 'Cerrar', { fill: '#fff', size: 22, sub: 'HS2 + LS1\n(corriente\ninvertida)\n\nPWM controla\nla posición' });
  s += B(960, 420, 210, 140, 'Retroalimentación', { fill: '#E7F0FF', stroke: C.azul, size: 20, sub: 'TPS 1 y TPS 2\n→ micro' });
  s += T(600, 680, 'Mariposa trabada o con carbón → sobrecorriente → el puente se protege y la ECU guarda códigos (no siempre está dañada).', { size: 17, w: 600, fill: C.rojo });
  return frame('Cuerpo de aceleración electrónico: puente H', s, 'Fuente: Infineon TLE7209 (ejemplo de integrado)');
};

D.d_eeprom = () => {
  let s = '';
  const chip = (x, title, sub, pins) => {
    let r = B(x, 120, 340, 470, '', { fill: '#fff', stroke: C.linea }) + T(x + 170, 160, title, { size: 28, w: 800, cond: true, fill: C.carbon }) + T(x + 170, 188, sub, { size: 17, w: 500, fill: C.tenue });
    r += `<rect x="${x + 110}" y="220" width="120" height="300" rx="10" fill="${C.carbon}"/><circle cx="${x + 132}" cy="242" r="8" fill="${C.am}"/>`;
    for (let i = 0; i < 4; i++) {
      const y = 260 + i * 72;
      r += `<rect x="${x + 86}" y="${y - 10}" width="26" height="20" fill="#B9BEC4"/><rect x="${x + 228}" y="${y - 10}" width="26" height="20" fill="#B9BEC4"/>`;
      r += T(x + 100, y - 16, String(i + 1), { size: 15, mono: true, w: 700, fill: C.tenue }) + T(x + 241, y - 16, String(8 - i), { size: 15, mono: true, w: 700, fill: C.tenue });
      r += T(x + 76, y + 7, pins[i], { size: 18, a: 'end', w: 700, mono: true, fill: pins[i] === 'GND' ? C.gris : (pins[i] === 'VCC' ? C.rojo : C.azul) });
      r += T(x + 266, y + 7, pins[7 - i], { size: 18, a: 'start', w: 700, mono: true, fill: pins[7 - i] === 'VCC' ? C.rojo : (pins[7 - i] === 'GND' ? C.gris : C.azul) });
    }
    return r;
  };
  s += chip(40, '93Cxx · Microwire', 'ej. 93C46 / 93C56 / 93C66', ['CS', 'CLK', 'DI', 'DO', 'GND', 'ORG', 'NC', 'VCC']);
  s += chip(430, '95xxx / 25xxx · SPI', 'ej. 95080 / 95160 / 95320', ['CS', 'SO', 'WP', 'GND', 'SI', 'CLK', 'HOLD', 'VCC']);
  s += chip(820, '24Cxx · I²C', 'ej. 24C02 / 24C04 / 24C16', ['A0', 'A1', 'A2', 'GND', 'SDA', 'SCL', 'WP', 'VCC']);
  s += T(600, 632, 'Vista superior (terminal 1 junto al punto). Mismo encapsulado SO-8, distinta asignación; algunas variantes 93Cxx\ntienen asignación rotada: confirma siempre con la hoja de datos del marcado exacto.', { size: 17, w: 600 });
  s += T(600, 690, 'Antes de escribir: dos lecturas idénticas, archivo con VIN + número de parte + fecha, guardado en dos lugares.', { size: 18, w: 700, fill: C.rojo });
  return frame('EEPROM de 8 terminales: tres familias, tres asignaciones', s, 'Fuentes: hojas de datos Microchip 93LC66B, 25LC320A, 24LC256');
};

D.d_arbol = () => {
  let s = '';
  const q = (x, y, t) => `<path d="M${x} ${y - 46} L${x + 190} ${y} L${x} ${y + 46} L${x - 190} ${y} Z" fill="#FFF6D6" stroke="#C99400" stroke-width="2.5"/>` + T(x, y + 7, t, { size: 19, w: 700 });
  const res = (x, y, t, c, sub) => B(x - 160, y - 40, 320, 80, t, { fill: c, stroke: c, tc: '#fff', size: 18, sub, subFill: '#fff', subSize: 14 });
  s += B(500, 72, 200, 46, 'Síntoma: no arranca', { size: 19, fill: C.carbon, stroke: C.carbon, tc: '#fff' });
  s += L([[600, 118], [600, 136]]) + q(600, 182, '¿Comunica con el escáner?');
  s += L([[790, 182], [880, 182]], { mk: 'g' }) + T(835, 172, 'No', { size: 17, w: 700, fill: C.rojo }) + res(1015, 182, 'Red · alimentación · tierras', C.am, 'Clase 3 y 9 · luego transceptor');
  s += L([[600, 228], [600, 262]]) + T(620, 252, 'Sí', { size: 17, w: 700, fill: C.verde, a: 'start' }) + q(600, 308, '¿Hay RPM al dar marcha?');
  s += L([[790, 308], [880, 308]], { mk: 'g' }) + T(835, 298, 'No', { size: 17, w: 700, fill: C.rojo }) + res(1015, 308, 'CKP · arnés · etapa de entrada', C.am, 'Clase 7');
  s += L([[600, 354], [600, 388]]) + T(620, 378, 'Sí', { size: 17, w: 700, fill: C.verde, a: 'start' }) + q(600, 434, '¿Inmovilizador autorizado?');
  s += L([[410, 434], [320, 434]], { mk: 'g' }) + T(365, 424, 'No', { size: 17, w: 700, fill: C.rojo }) + res(185, 434, 'Sistema antirrobo', C.verde, 'No es falla de la ECU · Clase 11');
  s += L([[600, 480], [600, 514]]) + T(620, 504, 'Sí', { size: 17, w: 700, fill: C.verde, a: 'start' }) + q(600, 560, '¿Pulso de inyector y chispa?');
  s += L([[410, 560], [320, 560]], { mk: 'g' }) + T(365, 550, 'Sí', { size: 17, w: 700, fill: C.verde }) + res(185, 560, 'Combustible / mecánica', C.verde, 'La ECU trabaja');
  s += L([[790, 560], [880, 560]], { mk: 'g' }) + T(835, 550, 'No', { size: 17, w: 700, fill: C.rojo }) + res(1015, 560, '¿12 V en actuador (ASD)?', C.gris, 'No: relevador / fusible · Sí: ↓');
  s += L([[1015, 600], [1015, 640]], { mk: 'g' }) + res(1015, 680, 'Driver dañado · banco', C.rojo, 'Clase 8 · revisa causa raíz');
  s += B(40, 600, 470, 96, '', { fill: '#fff', stroke: C.linea }) + T(60, 632, 'Semáforo del resultado', { size: 19, w: 800, a: 'start' }) + `<circle cx="72" cy="668" r="12" fill="${C.verde}"/><circle cx="236" cy="668" r="12" fill="${C.am}"/><circle cx="366" cy="668" r="12" fill="${C.rojo}"/>` + T(92, 674, 'No es la ECU', { size: 16, a: 'start' }) + T(256, 674, 'Confirmar', { size: 16, a: 'start' }) + T(386, 674, 'ECU dañada', { size: 16, a: 'start' });
  return frame('Árbol de decisión: ¿computadora o vehículo? (síntoma: no arranca)', s);
};

D.d_ckp = () => {
  let s = '';
  const ox = 60, ow = 1080;
  const scope = (oy, oh, t) => `<rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" fill="${C.carbon}" rx="12"/>` + T(ox + 20, oy + 32, t, { size: 19, w: 700, fill: '#fff', a: 'start' });
  s += scope(90, 190, 'CKP Hall · rueda con diente(s) faltante(s) · 0–5 V');
  let p = [], x = ox + 40; const y1 = 140, y0 = 245; const tw = 26;
  for (let i = 0; i < 36; i++) { if (i === 17 || i === 18) { p.push([x, y0], [x + tw, y0]); x += tw; continue; } p.push([x, y0], [x, y1], [x + tw / 2, y1], [x + tw / 2, y0], [x + tw, y0]); x += tw; }
  s += wave(p, C.am, 3) + T(ox + 40 + 17.5 * tw, 270, 'hueco = referencia', { size: 16, mono: true, fill: C.am });
  s += scope(310, 150, 'CMP · fase (1 evento por cada 2 vueltas del cigüeñal)');
  s += wave([[ox + 40, 430], [ox + 300, 430], [ox + 300, 370], [ox + 520, 370], [ox + 520, 430], [ox + 1040, 430]], '#5FB0FF', 3);
  s += scope(490, 190, 'CKP de reluctancia (VR) · alterna; amplitud crece con RPM');
  let q = []; for (let i = 0; i <= 400; i++) { const xx = ox + 40 + i * 2.5; const gap = i > 190 && i < 215; const a = gap ? 4 : 10 + i * 0.12; q.push([xx, 590 + (gap ? Math.sin(i * 0.3) * a : Math.sin(i * 0.72) * a)]); }
  s += wave(q, '#7CE38B', 2.5);
  s += T(600, 712, 'El patrón (dientes, huecos y fase CKP–CMP) depende del motor: el simulador debe reproducirlo exacto.', { size: 18, w: 600 });
  return frame('Patrones de cigüeñal y árbol de levas (CKP / CMP)', s, 'Ejemplo ilustrativo; Chrysler NGC y otros tienen patrones propios');
};

D.d_retrabajo = () => {
  let s = '';
  const steps = [['1', 'Respalda y documenta', 'Foto · orientación\nrespaldo EEPROM'], ['2', 'Retira recubrimiento', 'Sólo en la zona\n(IPC-7711/7721)'], ['3', 'Precalienta', 'Por debajo\ntemperatura moderada'], ['4', 'Aire caliente', 'Boquilla adecuada\nprotege vecinos'], ['5', 'Limpia pads', 'Malla + fundente\nsin levantar pads'], ['6', 'Coloca y verifica', 'Microscopio · modo diodo\nlimpieza IPA']];
  steps.forEach((st, i) => { const col = i % 3, row = Math.floor(i / 3); const x = 50 + col * 380, y = 110 + row * 270;
    s += B(x, y, 340, 220, '', { fill: i === 3 ? '#FFF6D6' : '#fff', stroke: i === 3 ? '#C99400' : C.gris });
    s += `<circle cx="${x + 50}" cy="${y + 50}" r="30" fill="${C.am}" stroke="${C.carbon}" stroke-width="2"/>` + T(x + 50, y + 61, st[0], { size: 30, w: 800, cond: true, fill: C.carbon });
    s += T(x + 92, y + 60, st[1], { size: 22, w: 800, a: 'start', cond: true, fill: C.carbon }) + T(x + 30, y + 120, st[2], { size: 20, w: 500, a: 'start' });
    if (col < 2) s += L([[x + 342, y + 110], [x + 376, y + 110]], { mk: 'g' }); });
  s += B(50, 650, 1100, 60, 'SAC305: 217–220 °C · Sn63Pb37: 183 °C · punta orientativa sin plomo 370–400 °C · resella con silicón neutro', { fill: C.carbon, stroke: C.carbon, tc: '#fff', size: 20 });
  return frame('Retrabajo SMD en tarjetas automotrices: secuencia segura', s, 'Fuentes: LCSC, JLCPCB, SCS Coatings; valores orientativos');
};

D.d_menu = () => {
  let s = '';
  const col = (x, n, price, items, hl) => {
    let r = B(x, hl ? 100 : 130, 340, hl ? 560 : 500, '', { fill: hl ? '#FFF6D6' : '#fff', stroke: hl ? '#C99400' : C.gris, sw: hl ? 4 : 2.5 });
    if (hl) r += B(x + 70, 82, 200, 38, 'MÁS ELEGIDO', { fill: C.am, stroke: C.am, size: 18, tc: C.carbon });
    r += T(x + 170, hl ? 170 : 190, n, { size: 34, w: 800, cond: true, fill: C.carbon }) + T(x + 170, hl ? 220 : 238, price, { size: 32, w: 600, mono: true, fill: hl ? '#8a6a00' : C.gris });
    items.forEach((it, i) => { r += T(x + 30, (hl ? 280 : 290) + i * 46, '✓ ' + it, { size: 19, w: 500, a: 'start' }); });
    return r;
  };
  s += col(50, 'Básico', '$1,800', ['Diagnóstico en banco', 'Reparación de la etapa', 'Prueba con escáner', 'Garantía legal 90 días']);
  s += col(430, 'Recomendado', '$2,600', ['Todo lo del Básico', 'Causa raíz: actuadores', 'Revisión de arnés', 'Prueba térmica 60 min', 'Reporte de escáner'], true);
  s += col(810, 'Premium', '$3,400', ['Todo lo Recomendado', 'Respaldo de memoria', 'Reporte con osciloscopio', 'Garantía extendida', 'Limpieza de conector']);
  s += T(600, 700, 'Precios: ejemplo ilustrativo en MXN · calcula los tuyos con la calculadora (Bono 3) · informa siempre el precio total', { size: 18, w: 600, fill: C.tenue });
  return frame('Menú de 3 opciones para la reparación de computadoras', s);
};

module.exports = { D, C };
