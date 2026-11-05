// 12 presentaciones editables (pptxgenjs, LAYOUT_WIDE) desde la fuente única
const PptxGenJS = require('pptxgenjs'); const fs = require('fs');
const C = require('./data/course');
const K = { gris: '2B3036', carbon: '1E2227', am: 'FFC20E', rojo: 'E5484D', verde: '2FB344', azul: '2D7FF9', claro: 'EEF0F2', blanco: 'FFFFFF', sub: '4B5560' };
const OUT = '../entrega/03_Clases/Presentaciones/'; fs.mkdirSync(OUT, { recursive: true });
const FONT_T = 'Arial', FONT_B = 'Calibri';
// Ajusta el tamaño de letra según la longitud (nunca menos de 14 pt)
const fit = (text, base, minS, chars) => Math.max(14, Math.max(minS, Math.round(base - Math.max(0, String(text).length - chars) / 10)));
const LOGO = 'assets/logo_es.png';

function masters(p) {
  const common0 = () => [{ rect: { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: K.am } } }, { rect: { x: 0.18, y: 0, w: 13.15, h: 1.15, fill: { color: K.gris } } },
    { text: { text: 'Diagnóstico Stellantis Pro · Prof. José Luis Orozco · Electrónica y Servicio', options: { x: 0.45, y: 7.05, w: 9, h: 0.35, fontFace: FONT_B, fontSize: 12, color: K.sub } } }];
  const titlePh0 = () => ({ placeholder: { options: { name: 'title', type: 'title', x: 0.45, y: 0.12, w: 11.4, h: 0.92, fontFace: FONT_T, fontSize: 30, bold: true, color: K.blanco, align: 'left', valign: 'middle' }, text: '' } });
  const sn = { x: 12.5, y: 7.05, w: 0.6, h: 0.35, fontFace: FONT_B, fontSize: 12, color: K.sub };
  const body = x => ({ placeholder: { options: { name: 'body', type: 'body', x, y: 2.3, w: 7.2, h: 4.55, fontFace: FONT_B, fontSize: 20, color: K.carbon, valign: 'top' }, text: '' } });
  p.defineSlideMaster({ title: 'TEMA', background: { color: K.blanco }, objects: [...common0(), titlePh0(), body(0.45)], slideNumber: { ...sn } });
  p.defineSlideMaster({ title: 'TEMA_DER', background: { color: K.blanco }, objects: [...common0(), titlePh0(), body(5.8)], slideNumber: { ...sn } });
  p.defineSlideMaster({ title: 'TEMA_LIBRE', background: { color: K.blanco }, objects: [...common0(), titlePh0()], slideNumber: { ...sn } });
  p.defineSlideMaster({ title: 'SECCION', background: { color: K.carbon }, objects: [{ rect: { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: K.am } } }, { placeholder: { options: { name: 'title', type: 'title', x: 0.9, y: 2.2, w: 11.5, h: 1.6, fontFace: FONT_T, fontSize: 40, bold: true, color: K.blanco, align: 'left' }, text: '' } }], slideNumber: { x: 12.5, y: 7.05, w: 0.6, h: 0.35, fontFace: FONT_B, fontSize: 12, color: 'AEB6BF' } });
}
const imgBox = (s, x, y, w, h, desc, name) => {
  s.addShape('rect', { x, y, w, h, fill: { color: 'F6F7F9' }, line: { color: '9AA3AD', width: 1.5, dashType: 'dash' }, objectName: name || 'Espacio para imagen' });
  s.addText([{ text: 'Espacio para imagen\n', options: { bold: true, fontSize: 16, color: K.gris } }, { text: desc, options: { fontSize: fit(desc, 15, 14, 140), color: K.sub } }], { x: x + 0.15, y: y + 0.15, w: w - 0.3, h: h - 0.3, fontFace: FONT_B, valign: 'middle', align: 'center', objectName: 'Descripción de la imagen' });
};
const ideaBox = (s, t, w = 12.6) => { s.addShape('rect', { x: 0.45, y: 1.35, w, h: 0.75, fill: { color: 'FFF6D6' }, line: { color: K.am, width: 1 }, objectName: 'Fondo idea clave' }); s.addText([{ text: 'Idea clave: ', options: { bold: true } }, { text: t }], { x: 0.6, y: 1.35, w: w - 0.3, h: 0.75, fontFace: FONT_B, fontSize: fit(t, 20, 17, 80), color: K.carbon, valign: 'middle', objectName: 'Idea clave' }); };
const bullets = arr => arr.map(t => ({ text: t, options: { bullet: { indent: 18 }, paraSpaceAfter: 8 } }));

function deck(k) {
  const p = new PptxGenJS(); p.layout = 'LAYOUT_WIDE'; p.author = 'Prof. José Luis Orozco Cuautle'; p.company = 'Electrónica y Servicio'; p.title = `Clase ${k.n}. ${k.t}`;
  p.theme = { headFontFace: FONT_T, bodyFontFace: FONT_B }; masters(p);
  const notesTema = t => `${t.t}\n\nIdea clave: ${t.idea}\n\n${t.e.join('\n\n')}\n\nDilo así: ${t.dilo}`;
  // Portada
  let s = p.addSlide({ masterName: 'SECCION' });
  s.addText(`Clase ${k.n}. ${k.t}`, { placeholder: 'title' });
  s.addText(`MÓDULO ${k.mod} · ${C.modulos[k.mod - 1].t.toUpperCase()}`, { x: 0.9, y: 1.4, w: 11, h: 0.6, fontFace: FONT_B, fontSize: 18, bold: true, color: K.am, objectName: 'Módulo' });
  s.addText(k.promesa, { x: 0.9, y: 3.9, w: 11.2, h: 1.1, fontFace: FONT_B, fontSize: fit(k.promesa, 22, 18, 110), color: 'D5DAE0', objectName: 'Promesa' });
  s.addImage({ path: LOGO, x: 0.9, y: 5.6, w: 2.2, h: 0.8, objectName: 'Logotipo' });
  s.addText('Prof. José Luis Orozco Cuautle\nElectrónica y Servicio · electronicayservicio.com', { x: 3.4, y: 5.55, w: 8, h: 0.9, fontFace: FONT_B, fontSize: 16, color: K.blanco, objectName: 'Instructor' });
  s.addNotes(`Bienvenida a la Clase ${k.n}. Promesa: ${k.promesa}`);
  // Objetivos + agenda
  s = p.addSlide({ masterName: 'TEMA_LIBRE' }); s.addText('Objetivos y agenda', { placeholder: 'title' });
  s.addText('Al terminar la clase podrás:', { x: 0.45, y: 1.35, w: 6.3, h: 0.5, fontFace: FONT_B, fontSize: 20, bold: true, color: K.gris, objectName: 'Subtítulo objetivos' });
  s.addText(bullets(k.obj), { x: 0.45, y: 1.9, w: 6.3, h: 4.9, fontFace: FONT_B, fontSize: 18, color: K.carbon, valign: 'top', objectName: 'Objetivos' });
  s.addTable([[{ text: 'Min', options: { bold: true, color: K.blanco, fill: { color: K.gris } } }, { text: 'Actividad', options: { bold: true, color: K.blanco, fill: { color: K.gris } } }], ...k.agenda.map(a => [String(a[0]), a[1]])], { x: 7.0, y: 1.4, w: 6.0, colW: [0.8, 5.2], fontFace: FONT_B, fontSize: 15, color: K.carbon, border: { type: 'solid', color: 'C9CED4', pt: 1 }, rowH: 0.62, objectName: 'Agenda' });
  s.addNotes('Objetivos: ' + k.obj.join(' · ') + '\nAgenda: ' + k.agenda.map(a => a[0] + ' min ' + a[1]).join(' · '));
  // Temas (3 composiciones alternadas)
  k.temas.forEach((t, i) => {
    const comp = i % 3; const sl = p.addSlide({ masterName: ['TEMA', 'TEMA_DER', 'TEMA_LIBRE'][comp] }); sl.addText(t.t, { placeholder: 'title', fontSize: fit(t.t, 30, 26, 40) }); ideaBox(sl, t.idea);
    if (comp === 0) { sl.addText(bullets(t.p), { placeholder: 'body', fontSize: fit(t.p.join(''), 20, 17, 300) }); imgBox(sl, 7.95, 2.3, 5.05, 4.55, t.img); }
    else if (comp === 1) { imgBox(sl, 0.45, 2.3, 5.05, 4.55, t.img); sl.addText(bullets(t.p), { placeholder: 'body', fontSize: fit(t.p.join(''), 20, 17, 300) }); }
    else {
      t.p.forEach((pt, j) => { const x = 0.45 + (j % 2) * 4.15, y = 2.3 + Math.floor(j / 2) * 2.32; sl.addShape('rect', { x, y, w: 3.95, h: 2.15, fill: { color: K.claro }, line: { color: 'C9CED4', width: 1 }, objectName: 'Tarjeta ' + (j + 1) }); sl.addShape('rect', { x, y, w: 3.95, h: 0.12, fill: { color: [K.am, K.azul, K.verde, K.rojo][j] }, objectName: 'Franja tarjeta ' + (j + 1) }); sl.addText(pt, { x: x + 0.15, y: y + 0.2, w: 3.65, h: 1.85, fontFace: FONT_B, fontSize: fit(pt, 18, 17, 70), color: K.carbon, valign: 'middle', objectName: 'Texto tarjeta ' + (j + 1) }); });
      imgBox(sl, 8.85, 2.3, 4.15, 4.47, t.img);
    }
    sl.addNotes(notesTema(t));
  });
  // Ejercicio
  s = p.addSlide({ masterName: 'TEMA_LIBRE' }); s.addText('Ejercicio en vivo: ' + k.ej.t, { placeholder: 'title', fontSize: fit(k.ej.t, 28, 26, 30) });
  k.ej.pasos.forEach((st, j) => { const y = 1.45 + j * 1.35; s.addShape('rect', { x: 0.45, y, w: 0.95, h: 1.15, fill: { color: K.am }, objectName: 'Número paso ' + (j + 1) }); s.addText(String(j + 1), { x: 0.45, y, w: 0.95, h: 1.15, fontFace: FONT_T, fontSize: 32, bold: true, align: 'center', valign: 'middle', color: K.carbon, objectName: 'Paso ' + (j + 1) + ' número' }); s.addText(st, { x: 1.6, y, w: 11.4, h: 1.15, fontFace: FONT_B, fontSize: fit(st, 21, 18, 90), color: K.carbon, valign: 'middle', objectName: 'Paso ' + (j + 1) }); });
  s.addNotes('Ejercicio en vivo: ' + k.ej.pasos.map((x, j) => `${j + 1}) ${x}`).join(' '));
  // Tarea + errores
  s = p.addSlide({ masterName: 'TEMA_LIBRE' }); s.addText('Tarea de la semana y errores comunes', { placeholder: 'title' });
  s.addShape('rect', { x: 0.45, y: 1.4, w: 6.2, h: 5.4, fill: { color: 'E6F6E9' }, line: { color: K.verde, width: 1.5 }, objectName: 'Fondo tarea' });
  s.addText([{ text: 'Tarea\n', options: { bold: true, fontSize: 22, color: '1E7A2E' } }, ...bullets(k.tarea)], { x: 0.6, y: 1.5, w: 5.9, h: 5.2, fontFace: FONT_B, fontSize: 18, color: K.carbon, valign: 'top', objectName: 'Tarea' });
  s.addShape('rect', { x: 6.85, y: 1.4, w: 6.2, h: 5.4, fill: { color: 'FDE7E8' }, line: { color: K.rojo, width: 1.5 }, objectName: 'Fondo errores' });
  s.addText([{ text: 'Errores comunes\n', options: { bold: true, fontSize: 22, color: 'B3262B' } }, ...bullets(k.errores)], { x: 7.0, y: 1.5, w: 5.9, h: 5.2, fontFace: FONT_B, fontSize: 18, color: K.carbon, valign: 'top', objectName: 'Errores' });
  s.addNotes('Tarea: ' + k.tarea.join(' · ') + '\nErrores comunes: ' + k.errores.join(' · '));
  // Repaso
  s = p.addSlide({ masterName: 'TEMA_LIBRE' }); s.addText('Repaso', { placeholder: 'title' });
  k.repaso.forEach((q, j) => { const x = 0.45 + (j % 2) * 6.35, y = 1.4 + Math.floor(j / 2) * 2.75; s.addShape('rect', { x, y, w: 6.15, h: 2.6, fill: { color: K.claro }, line: { color: 'C9CED4', width: 1 }, objectName: 'Pregunta ' + (j + 1) + ' fondo' }); s.addText([{ text: q.q + '\n', options: { bold: true, fontSize: fit(q.q, 17, 15, 70) } }, ...q.o.map((o, m) => ({ text: '☐ ' + q.o[(m + j + 1) % 4] + (m < 3 ? '\n' : ''), options: { fontSize: 15 } }))], { x: x + 0.15, y: y + 0.1, w: 5.85, h: 2.4, fontFace: FONT_B, color: K.carbon, valign: 'top', objectName: 'Pregunta ' + (j + 1) }); });
  s.addNotes('Respuestas correctas: ' + k.repaso.map((q, j) => `${j + 1}) ${q.o[0]}`).join(' · '));
  // Cierre
  s = p.addSlide({ masterName: 'SECCION' }); s.addText(k.cierre, { placeholder: 'title', fontSize: fit(k.cierre, 36, 28, 80) });
  const next = C.clases.find(c => c.n === k.n + 1);
  s.addText(next ? `Próxima clase: Clase ${next.n}. ${next.t}` : 'Fin del curso: examen final, sesión en vivo y plan de 30 días', { x: 0.9, y: 4.3, w: 11.5, h: 0.7, fontFace: FONT_B, fontSize: 22, bold: true, color: K.am, objectName: 'Próxima clase' });
  s.addText('Recursos: ' + k.recursos.join(' · '), { x: 0.9, y: 5.1, w: 11.5, h: 0.9, fontFace: FONT_B, fontSize: 16, color: 'D5DAE0', objectName: 'Recursos' });
  s.addText('Escribe STELLANTIS por WhatsApp · 55 52 17 34 84', { x: 0.9, y: 6.2, w: 11.5, h: 0.5, fontFace: FONT_B, fontSize: 16, color: K.blanco, objectName: 'Llamado a la acción' });
  s.addNotes('Cierre: ' + k.cierre);
  const name = `Clase_${String(k.n).padStart(2, '0')}_${k.t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/_+$/, '')}.pptx`;
  return p.writeFile({ fileName: OUT + name }).then(() => name);
}
(async () => { for (const k of C.clases) console.log(await deck(k)); })();
