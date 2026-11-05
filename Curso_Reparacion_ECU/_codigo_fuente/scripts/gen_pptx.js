// Generador de las 12 presentaciones (.pptx editables) desde la fuente única
const path = require('path'), fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react'), RDS = require('react-dom/server'), FA = require('react-icons/fa'), sharp = require('sharp');
const SKILL = '/root/.claude/skills/synced/e9811ed7-df63-42fa-931b-e3a977426169_88439d4a-d1ca-495c-b643-c275da93cf7c/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');
const ROOT = path.resolve(__dirname, '..');
const CFG = require('../data/config'), O = require('../data/offer'), R = require('../data/research');
const CLASES = [...require('../data/course_m1'), ...require('../data/course_m2'), ...require('../data/course_m3'), ...require('../data/course_m4')];
const OUT = path.resolve(ROOT, '..', '03_Clases', 'Presentaciones');
const THEME = { name: 'Electronica y Servicio', headFontFace: 'Arial', bodyFontFace: 'Calibri', colors: { dk1: '1E2227', lt1: 'FFFFFF', dk2: '2B3036', lt2: 'EEF0F2', accent1: 'FFC20E', accent2: 'E5484D', accent3: '2FB344', accent4: '2D7FF9', accent5: '5F6670', accent6: 'C99400', hlink: '2D7FF9', folHlink: '7A5CFA' } };
const HX = { carbon: '1E2227', gris: '2B3036', am: 'FFC20E', amClaro: 'FFF6D6', rojo: 'E5484D', verde: '2FB344', azul: '2D7FF9', claro: 'EEF0F2', tenue: '5F6670', linea: 'C9CED4', blanco: 'FFFFFF' };
const W = 13.333, Hh = 7.5, MX = 0.6, CW = W - 2 * MX;
const b64 = f => 'image/png;base64,' + fs.readFileSync(path.join(ROOT, f)).toString('base64');
const LOGO = b64('assets/logo_es.png'), PROF = b64('assets/prof_cutout_700.png');
const profRatio = (() => { const b = fs.readFileSync(path.join(ROOT, 'assets/prof_cutout_700.png')); return b.readUInt32BE(16) / b.readUInt32BE(20); })();
const iconCache = {};
async function icon(name, color = '#1E2227') {
  const k = name + color; if (iconCache[k]) return iconCache[k];
  const Cmp = FA[name] || FA.FaMicrochip;
  const svg = RDS.renderToStaticMarkup(React.createElement(Cmp, { size: 256, color }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return (iconCache[k] = 'image/png;base64,' + png.toString('base64'));
}
// Ajuste de tamaño de letra según longitud del texto
function fitPt(paras, wIn, hIn, maxPt, minPt, o = {}) {
  const cw = o.charW || 0.5, lh = o.lineH || 1.18, sp = o.space ?? 8, ind = o.indent ?? 0.35;
  for (let pt = maxPt; pt >= minPt; pt -= 1) {
    const cpl = Math.max(8, ((wIn - ind - 0.2) * 72) / (pt * cw));
    const lines = paras.reduce((a, p) => a + Math.max(1, Math.ceil(String(p).length / cpl)), 0);
    if (lines * pt * lh / 72 + paras.length * sp / 72 + 0.15 <= hIn) return pt;
  }
  return minPt;
}
const sh = () => ({ type: 'outer', color: '000000', opacity: 0.12, blur: 6, offset: 2, angle: 90 });

function defineLayouts(pres) {
  const C = pres.SchemeColor;
  pres.defineSlideMaster({ title: 'ES_PORTADA', background: { color: HX.carbon }, objects: [
    { image: { data: LOGO, x: MX, y: 0.5, w: 2.2, h: 0.83 } },
    { image: { data: PROF, x: W - 7.5 * profRatio - 0.25, y: 0.15, w: 7.35 * profRatio, h: 7.35 } },
    { text: { text: `${CFG.instructor.nombre} · ${CFG.instructor.web}`, options: { x: MX, y: 6.75, w: 8.2, h: 0.4, fontSize: 14, color: HX.am, bold: true, margin: 0 } } },
    { placeholder: { options: { name: 'title', type: 'title', x: MX, y: 2.05, w: 8.4, h: 2.1, fontSize: 40, bold: true, color: C.background1, fontFace: 'Arial', valign: 'top', align: 'left', margin: 0 }, text: 'Título de la clase' } },
    { placeholder: { options: { name: 'body', type: 'body', x: MX, y: 4.3, w: 8.0, h: 2.1, fontSize: 20, color: C.background2, valign: 'top', align: 'left', margin: 0 }, text: 'Promesa' } }
  ] });
  pres.defineSlideMaster({ title: 'ES_CONTENIDO', background: { color: HX.blanco }, margin: [0.4, 0.6, 0.6, 0.6], objects: [
    { image: { data: LOGO, x: W - MX - 1.05, y: 0.4, w: 1.05, h: 0.4 } },
    { text: { text: `${CFG.curso.titulo} · ${CFG.instructor.nombre}`, options: { x: MX, y: 7.0, w: 9.5, h: 0.3, fontSize: 11, color: HX.tenue, margin: 0 } } },
    { placeholder: { options: { name: 'title', type: 'title', x: MX, y: 0.32, w: CW - 1.3, h: 0.9, fontSize: 30, bold: true, color: C.text1, fontFace: 'Arial', valign: 'middle', align: 'left', margin: 0 }, text: 'Título' } }
  ], slideNumber: { x: W - MX - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 11, color: HX.tenue, align: 'right' } });
  pres.defineSlideMaster({ title: 'ES_OSCURO', background: { color: HX.carbon }, objects: [
    { image: { data: LOGO, x: W - MX - 1.6, y: 0.45, w: 1.6, h: 0.6 } },
    { text: { text: `${CFG.curso.titulo} · ${CFG.instructor.nombre}`, options: { x: MX, y: 7.0, w: 9.5, h: 0.3, fontSize: 11, color: 'AEB4BB', margin: 0 } } },
    { placeholder: { options: { name: 'title', type: 'title', x: MX, y: 0.45, w: CW - 2.0, h: 1.0, fontSize: 30, bold: true, color: C.accent1, fontFace: 'Arial', valign: 'top', align: 'left', margin: 0 }, text: 'Título' } }
  ] });
}

function imageSpace(s, x, y, w, h, tema, k) {
  if (tema.dg) {
    const ih = Math.min(h - 0.45, w / 1.6), iw = ih * 1.6, ix = x + (w - iw) / 2;
    s.addImage({ path: path.join(ROOT, 'assets/diagramas', tema.dg + '.png'), x: ix, y, w: iw, h: ih, objectName: 'Diagrama', altText: 'Diagrama: ' + tema.t, shadow: sh() });
    s.addText('Diagrama del curso · ' + tema.t, { x, y: y + ih + 0.08, w, h: 0.35, fontSize: 14, color: HX.tenue, italic: true, align: 'center', isTextBox: true, objectName: 'Pie de diagrama', margin: 0 });
  } else {
    s.addShape('roundRect', { x, y, w, h, fill: { color: 'F4F5F7' }, line: { color: HX.linea, width: 1.5, dashType: 'dash' }, rectRadius: 0.12, objectName: 'Espacio para imagen' });
    s.addImage({ data: k.camera, x: x + w / 2 - 0.3, y: y + 0.35, w: 0.6, h: 0.6, objectName: 'Icono de imagen' });
    s.addText([{ text: 'Espacio para imagen', options: { bold: true, fontSize: 18, color: HX.gris, breakLine: true } }, { text: tema.img, options: { fontSize: fitPt([tema.img], w - 0.4, h - 1.6, 16, 14, { indent: 0 }), color: HX.tenue } }], { x: x + 0.2, y: y + 1.1, w: w - 0.4, h: h - 1.3, align: 'center', valign: 'top', isTextBox: true, objectName: 'Descripción de imagen sugerida', paraSpaceAfter: 6 });
  }
}

async function buildClase(k) {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'; pres.author = CFG.instructor.nombre; pres.company = CFG.instructor.empresa; pres.title = `Clase ${k.n} · ${k.titulo}`;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  defineLayouts(pres); const C = pres.SchemeColor;
  const kk = { camera: await icon('FaImage', '#8A929B') };
  const modulo = O.modulos.find(m => m.n === k.modulo);
  // 1 · Portada
  pres.addSection({ title: 'Portada' });
  let s = pres.addSlide({ masterName: 'ES_PORTADA', sectionTitle: 'Portada' });
  s.addText(`CLASE ${k.n} DE 12 · MÓDULO ${k.modulo}: ${modulo.nombre.toUpperCase()}`, { x: MX, y: 1.55, w: 8.4, h: 0.4, fontSize: 16, bold: true, color: HX.am, isTextBox: true, margin: 0, objectName: 'Clase y módulo' });
  s.addText(k.titulo, { placeholder: 'title', fontSize: fitPt([k.titulo], 8.4, 2.0, 44, 32, { indent: 0, charW: 0.55 }) });
  s.addText(k.promesa, { placeholder: 'body', fontSize: fitPt([k.promesa], 8.0, 2.0, 22, 18, { indent: 0 }) });
  s.addNotes(`Bienvenida a la Clase ${k.n}: ${k.titulo}.\nPromesa: ${k.promesa}\nMódulo ${k.modulo}: ${modulo.nombre}. ${modulo.resultado}`);
  // 2 · Objetivos + agenda
  pres.addSection({ title: 'Objetivos y agenda' });
  s = pres.addSlide({ masterName: 'ES_CONTENIDO', sectionTitle: 'Objetivos y agenda' });
  s.addText('Objetivos y agenda de la clase', { placeholder: 'title' });
  s.addText('Al terminar podrás:', { x: MX, y: 1.35, w: 6.4, h: 0.45, fontSize: 20, bold: true, color: HX.gris, isTextBox: true, margin: 0, objectName: 'Encabezado objetivos' });
  const objPt = fitPt(k.objetivos, 5.5, 1.1, 18, 15, { indent: 0 });
  k.objetivos.forEach((o, i) => { const y = 1.9 + i * 1.22;
    s.addShape('roundRect', { x: MX, y, w: 6.4, h: 1.08, fill: { color: i % 2 ? 'FFFFFF' : HX.claro }, line: { color: HX.linea, width: 1 }, rectRadius: 0.1, objectName: `Objetivo ${i + 1} fondo` });
    s.addShape('ellipse', { x: MX + 0.18, y: y + 0.27, w: 0.54, h: 0.54, fill: { color: HX.am }, line: { color: HX.am }, objectName: `Objetivo ${i + 1} número fondo` });
    s.addText(String(i + 1), { x: MX + 0.18, y: y + 0.27, w: 0.54, h: 0.54, fontSize: 20, bold: true, color: HX.carbon, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: `Objetivo ${i + 1} número` });
    s.addText(o, { x: MX + 0.9, y: y + 0.05, w: 5.4, h: 0.98, fontSize: objPt, color: HX.carbon, valign: 'middle', margin: 0, isTextBox: true, objectName: `Objetivo ${i + 1}` }); });
  s.addShape('roundRect', { x: 7.35, y: 1.35, w: 5.38, h: 5.45, fill: { color: HX.gris }, line: { color: HX.gris }, rectRadius: 0.12, objectName: 'Agenda fondo' });
  s.addText('Agenda · 90 minutos', { x: 7.65, y: 1.5, w: 4.8, h: 0.5, fontSize: 22, bold: true, color: HX.am, isTextBox: true, margin: 0, objectName: 'Agenda título' });
  let t0 = 0; k.agenda.forEach((a, i) => { const y = 2.15 + i * 0.75;
    s.addText(`${t0}–${t0 + a[0]}′`, { x: 7.65, y, w: 1.15, h: 0.6, fontSize: 16, bold: true, color: HX.carbon, fill: { color: HX.am }, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: `Agenda minutos ${i + 1}` });
    s.addText(a[1], { x: 8.95, y, w: 3.6, h: 0.6, fontSize: fitPt([a[1]], 3.6, 0.65, 16, 14, { indent: 0 }), color: HX.blanco, valign: 'middle', margin: 0, isTextBox: true, objectName: `Agenda actividad ${i + 1}` }); t0 += a[0]; });
  s.addNotes('Objetivos:\n' + k.objetivos.map((o, i) => `${i + 1}. ${o}`).join('\n') + '\n\nAgenda:\n' + k.agenda.map(a => `${a[0]} min · ${a[1]}`).join('\n'));
  // 3 · Temas (una lámina por tema, 3 composiciones alternadas)
  pres.addSection({ title: 'Temas' });
  for (let i = 0; i < k.temas.length; i++) {
    const tm = k.temas[i], comp = i % 3; s = pres.addSlide({ masterName: 'ES_CONTENIDO', sectionTitle: 'Temas' });
    s.addText(tm.t, { placeholder: 'title', fontSize: fitPt([tm.t], CW - 1.3, 0.9, 30, 26, { indent: 0, charW: 0.55 }) });
    s.addShape('roundRect', { x: MX, y: 1.32, w: CW, h: 0.82, fill: { color: HX.amClaro }, line: { color: 'F1D27A', width: 1 }, rectRadius: 0.1, objectName: 'Idea clave fondo' });
    s.addShape('ellipse', { x: MX + 0.14, y: 1.42, w: 0.62, h: 0.62, fill: { color: HX.carbon }, line: { color: HX.carbon }, objectName: 'Icono fondo' });
    s.addImage({ data: await icon(tm.ic, '#FFC20E'), x: MX + 0.28, y: 1.56, w: 0.34, h: 0.34, objectName: 'Icono del tema' });
    s.addText([{ text: 'Idea clave: ', options: { bold: true, color: 'B88A00' } }, { text: tm.k, options: { bold: true, color: HX.carbon } }], { x: MX + 0.95, y: 1.34, w: CW - 1.1, h: 0.78, fontSize: fitPt([tm.k + 'Idea clave: '], CW - 1.1, 0.8, 20, 17, { indent: 0, space: 0 }), valign: 'middle', margin: 0, isTextBox: true, objectName: 'Idea clave' });
    const pts = tm.p; const top = 2.4, bottom = 6.8;
    if (comp === 0 || comp === 1) {
      const lx = comp === 0 ? MX : 6.55, ix = comp === 0 ? 7.0 : MX, lw = 5.95 + (comp === 0 ? 0.2 : 0.18), iw = 5.75;
      const pt = fitPt(pts, lw, bottom - top, 22, 17);
      s.addText(pts.map((p, j) => ({ text: p, options: { bullet: { code: '25A0' }, breakLine: j < pts.length - 1, paraSpaceAfter: 12 } })), { x: lx, y: top, w: lw, h: bottom - top, fontSize: pt, color: HX.carbon, valign: 'top', margin: [4, 4, 4, 4], isTextBox: true, objectName: 'Explicación en viñetas' });
      imageSpace(s, ix, top + 0.05, iw, bottom - top - 0.05, tm, kk);
    } else {
      const cw2 = 3.3, chh = 2.05; const pt = Math.min(...pts.map(p => fitPt([p], cw2 - 0.3, chh - 0.55, 18, 15, { indent: 0, space: 0 })));
      pts.forEach((p, j) => { const cx = MX + (j % 2) * (cw2 + 0.2), cy = top + Math.floor(j / 2) * (chh + 0.2);
        s.addShape('roundRect', { x: cx, y: cy, w: cw2, h: chh, fill: { color: j === 0 || j === 3 ? HX.claro : 'FFFFFF' }, line: { color: HX.linea, width: 1 }, rectRadius: 0.1, shadow: sh(), objectName: `Tarjeta ${j + 1} fondo` });
        s.addText(String(j + 1).padStart(2, '0'), { x: cx + 0.18, y: cy + 0.12, w: 0.8, h: 0.4, fontSize: 18, bold: true, color: 'B88A00', margin: 0, isTextBox: true, objectName: `Tarjeta ${j + 1} número` });
        s.addText(p, { x: cx + 0.18, y: cy + 0.5, w: cw2 - 0.3, h: chh - 0.6, fontSize: pt, color: HX.carbon, valign: 'top', margin: 0, isTextBox: true, objectName: `Tarjeta ${j + 1}` }); });
      imageSpace(s, 7.65, top + 0.05, W - MX - 7.65, bottom - top - 0.05, tm, kk);
    }
    s.addNotes(`IDEA CLAVE: ${tm.k}\n\nEXPLICACIÓN:\n${tm.e[0]}\n\n${tm.e[1]}\n\nDILO ASÍ: ${tm.d}\n\nIMAGEN SUGERIDA: ${tm.img}` + (tm.src ? `\n\nFUENTES: ${tm.src.map(id => R.fuentes[id] ? R.fuentes[id][0] + ' ' + R.fuentes[id][1] : id).join(' | ')}` : ''));
  }
  // Ejercicio en vivo
  pres.addSection({ title: 'Práctica' });
  s = pres.addSlide({ masterName: 'ES_CONTENIDO', sectionTitle: 'Práctica' });
  s.addText('Ejercicio en vivo: ' + k.ejercicio.titulo, { placeholder: 'title', fontSize: fitPt(['Ejercicio en vivo: ' + k.ejercicio.titulo], CW - 1.3, 0.9, 30, 24, { indent: 0, charW: 0.55 }) });
  const sw = (CW - 3 * 0.25) / 4; const stPt = Math.min(...k.ejercicio.pasos.map(p => fitPt([p], sw - 0.35, 3.3, 20, 15, { indent: 0, space: 0 })));
  k.ejercicio.pasos.forEach((p, j) => { const x = MX + j * (sw + 0.25), y = 1.45;
    s.addShape('roundRect', { x, y, w: sw, h: 4.3, fill: { color: j % 2 ? 'FFFFFF' : HX.claro }, line: { color: HX.linea, width: 1 }, rectRadius: 0.12, shadow: sh(), objectName: `Paso ${j + 1} fondo` });
    s.addShape('ellipse', { x: x + 0.2, y: y + 0.22, w: 0.7, h: 0.7, fill: { color: HX.am }, line: { color: HX.am }, objectName: `Paso ${j + 1} círculo` });
    s.addText(String(j + 1), { x: x + 0.2, y: y + 0.22, w: 0.7, h: 0.7, fontSize: 24, bold: true, color: HX.carbon, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: `Paso ${j + 1} número` });
    s.addText(p, { x: x + 0.2, y: y + 1.1, w: sw - 0.35, h: 3.05, fontSize: stPt, color: HX.carbon, valign: 'top', margin: 0, isTextBox: true, objectName: `Paso ${j + 1}` }); });
  s.addText([{ text: 'Equipo del instructor: ', options: { bold: true, color: HX.am } }, { text: 'osciloscopios Hantek 6074BE y 6022BE, FNIRSI 2C53P y 1013D · escáneres Launch X431, CRT-511PRO y Autel MX900 · Sens-22 · multímetro y pinza amperimétrica', options: { color: HX.blanco } }], { x: MX, y: 5.95, w: CW, h: 0.8, fontSize: 16, fill: { color: HX.gris }, valign: 'middle', margin: [6, 12, 6, 12], isTextBox: true, objectName: 'Equipo' });
  s.addNotes('Ejercicio en vivo: ' + k.ejercicio.titulo + '\n' + k.ejercicio.pasos.map((p, i) => `${i + 1}. ${p}`).join('\n') + '\n\nSeguridad: fuente con límite de corriente, ESD y verificación de polaridad antes de energizar.');
  // Tarea + errores
  s = pres.addSlide({ masterName: 'ES_CONTENIDO', sectionTitle: 'Práctica' });
  s.addText('Tarea de la semana y errores comunes', { placeholder: 'title' });
  const colW = (CW - 0.3) / 2;
  const cols = [[k.tarea, 'Tarea de la semana', HX.verde, 'E6F6EA', await icon('FaCheckCircle', '#2FB344')], [k.errores, 'Errores comunes', HX.rojo, 'FDECEC', await icon('FaTimesCircle', '#E5484D')]];
  cols.forEach(([items, ttl, col, bg, ico], c) => { const x = MX + c * (colW + 0.3);
    s.addShape('roundRect', { x, y: 1.4, w: colW, h: 5.4, fill: { color: bg }, line: { color: col, width: 1.5 }, rectRadius: 0.12, objectName: ttl + ' fondo' });
    s.addImage({ data: ico, x: x + 0.3, y: 1.62, w: 0.5, h: 0.5, objectName: ttl + ' icono' });
    s.addText(ttl, { x: x + 0.95, y: 1.58, w: colW - 1.2, h: 0.6, fontSize: 24, bold: true, color: HX.carbon, margin: 0, isTextBox: true, objectName: ttl + ' título' });
    const pt = fitPt(items, colW - 0.6, 4.3, 20, 15);
    s.addText(items.map((p, j) => ({ text: p, options: { bullet: true, breakLine: j < items.length - 1, paraSpaceAfter: 10 } })), { x: x + 0.3, y: 2.35, w: colW - 0.6, h: 4.3, fontSize: pt, color: HX.carbon, valign: 'top', margin: 0, isTextBox: true, objectName: ttl }); });
  s.addNotes('Tarea:\n' + k.tarea.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n\nErrores comunes:\n' + k.errores.join('\n'));
  // Repaso
  pres.addSection({ title: 'Repaso y cierre' });
  s = pres.addSlide({ masterName: 'ES_CONTENIDO', sectionTitle: 'Repaso y cierre' });
  s.addText('Repaso: ¿cuál es la respuesta correcta?', { placeholder: 'title' });
  const qw = (CW - 0.3) / 2, qh = 2.55;
  k.repaso.forEach((q, j) => { const x = MX + (j % 2) * (qw + 0.3), y = 1.4 + Math.floor(j / 2) * (qh + 0.2);
    s.addShape('roundRect', { x, y, w: qw, h: qh, fill: { color: j === 0 || j === 3 ? HX.claro : 'FFFFFF' }, line: { color: HX.linea, width: 1 }, rectRadius: 0.1, shadow: sh(), objectName: `Pregunta ${j + 1} fondo` });
    const qpt = fitPt([q.q], qw - 0.4, 0.85, 18, 15, { indent: 0, space: 0 });
    s.addText(q.q, { x: x + 0.2, y: y + 0.12, w: qw - 0.4, h: 0.85, fontSize: qpt, bold: true, color: HX.carbon, valign: 'top', margin: 0, isTextBox: true, objectName: `Pregunta ${j + 1}` });
    const opt = q.ops.map((o, m) => `${'ABCD'[m]}) ${o}`);
    s.addText(opt.map((o, m) => ({ text: o, options: { breakLine: m < 3 } })), { x: x + 0.2, y: y + 1.0, w: qw - 0.4, h: qh - 1.1, fontSize: Math.min(15, fitPt(opt, qw - 0.4, qh - 1.1, 15, 14, { indent: 0, space: 2 })), color: HX.gris, valign: 'top', margin: 0, isTextBox: true, objectName: `Opciones ${j + 1}` }); });
  s.addNotes('Respuestas:\n' + k.repaso.map((q, j) => `${j + 1}. ${q.q} → ${'ABCD'[q.ok]}) ${q.ops[q.ok]}`).join('\n'));
  // Cierre
  s = pres.addSlide({ masterName: 'ES_OSCURO', sectionTitle: 'Repaso y cierre' });
  s.addText('Cierre', { placeholder: 'title' });
  s.addImage({ data: await icon('FaQuoteLeft', '#FFC20E'), x: MX, y: 1.75, w: 0.7, h: 0.7, objectName: 'Comillas' });
  s.addText(k.cierre, { x: MX + 1.0, y: 1.65, w: CW - 1.2, h: 2.3, fontSize: fitPt([k.cierre], CW - 1.2, 2.3, 32, 24, { indent: 0 }), bold: true, color: HX.blanco, valign: 'top', margin: 0, isTextBox: true, objectName: 'Frase de cierre' });
  const next = CLASES.find(c => c.n === k.n + 1);
  s.addText([{ text: next ? 'Próxima clase · ' : 'Siguiente paso · ', options: { bold: true, color: HX.am, breakLine: true } }, { text: next ? `Clase ${next.n}: ${next.titulo}` : 'Aplica tu plan de 30 días y nos vemos en la sesión de dudas en vivo (Bono 10).', options: { color: HX.blanco } }], { x: MX, y: 4.35, w: CW, h: 1.2, fontSize: 24, valign: 'top', margin: 0, isTextBox: true, objectName: 'Próxima clase' });
  s.addText(`Informes: ${CFG.cta.texto} al ${CFG.cta.whatsappVisible}`, { x: MX, y: 5.85, w: CW, h: 0.6, fontSize: 20, bold: true, color: HX.carbon, fill: { color: HX.am }, margin: [4, 12, 4, 12], valign: 'middle', isTextBox: true, objectName: 'Llamado a la acción' });
  s.addNotes(`Frase de cierre: ${k.cierre}\nRecursos de la clase: ${k.recursos.join('; ')}.`);
  const file = path.join(OUT, `Clase_${String(k.n).padStart(2, '0')}_${k.titulo.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, '').replace(/\s+/g, '_')}.pptx`);
  await pres.writeFile({ fileName: file }); await applyTheme(file, THEME); return file;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true }); const only = process.argv[2] ? Number(process.argv[2]) : null;
  for (const k of CLASES) { if (only && k.n !== only) continue; const f = await buildClase(k); console.log('ok', path.basename(f)); }
})().catch(e => { console.error(e); process.exit(1); });
