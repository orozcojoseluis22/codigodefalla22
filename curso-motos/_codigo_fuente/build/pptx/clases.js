// 12 presentaciones .pptx editables (una por clase) desde la fuente única
const path = require("path"), fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react"), RDS = require("react-dom/server"), FA = require("react-icons/fa"), sharp = require("sharp");
const S = require("../lib/curso");
const { cfg: CF, arq: A, clases } = S;
const SKILL = fs.readdirSync("/root/.claude/skills/synced").map((d) => `/root/.claude/skills/synced/${d}/pptx/scripts/apply_theme.js`).find((f) => fs.existsSync(f));
const { applyTheme } = require(SKILL);
const OUTDIR = path.join(S.ROOT, "03_Clases/Presentaciones");
const H = (c) => c.replace("#", "").toUpperCase();
const COL = { carbon: H(CF.colores.carbon), gris: H(CF.colores.grisTecnico), am: H(CF.colores.amarillo), rojo: H(CF.colores.rojo), verde: H(CF.colores.verde), azul: H(CF.colores.azul), claro: H(CF.colores.grisClaro), blanco: "FFFFFF", tenue: "5B636B" };
const THEME = { name: "Electrónica y Servicio", headFontFace: "Arial", bodyFontFace: "Calibri",
  colors: { dk1: COL.carbon, lt1: "FFFFFF", dk2: COL.gris, lt2: COL.claro, accent1: COL.am, accent2: COL.azul, accent3: COL.verde, accent4: COL.rojo, accent5: COL.gris, accent6: "8A939C", hlink: COL.azul, folHlink: "6E5BD9" } };
const L = ["A", "B", "C", "D"];
const iconCache = {};
async function icon(name, color = COL.carbon) {
  const k = name + color; if (iconCache[k]) return iconCache[k];
  const svg = RDS.renderToStaticMarkup(React.createElement(FA[name] || FA.FaBolt, { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return (iconCache[k] = "image/png;base64," + buf.toString("base64"));
}
// Ajusta tamaño de letra según longitud del texto y caja (estimación Calibri/Arial)
function fit(text, w, h, max, min = 14, lh = 1.15, cw = 0.47) {
  const t = Array.isArray(text) ? text.join("\n") : text;
  for (let pt = max; pt >= min; pt -= 1) {
    const charsPerLine = Math.max(8, Math.floor((w * 72) / (pt * cw)));
    const lines = t.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil(l.length / charsPerLine)), 0);
    const extra = Array.isArray(text) ? text.length * 0.25 : 0; // espacio entre viñetas
    if ((lines + extra) * pt * lh / 72 <= h) return pt;
  }
  return min;
}
function layouts(pres) {
  const foot = (dark) => [
    { text: { text: `${CF.instructor.empresa} · ${CF.tituloCorto}`, options: { x: 0.6, y: 7.0, w: 8, h: 0.3, fontFace: "Calibri", fontSize: 11, color: dark ? "AEB4BB" : COL.tenue } } },
  ];
  pres.defineSlideMaster({ title: "PORTADA", background: { color: COL.carbon },
    objects: [...foot(true)],
    slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.35, fontFace: "Calibri", fontSize: 11, color: "AEB4BB", align: "right" } });
  pres.defineSlideMaster({ title: "CONTENIDO", background: { color: "FFFFFF" },
    objects: [...foot(false), { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 11.2, h: 0.95, fontFace: "Arial", fontSize: 30, bold: true, color: COL.carbon, align: "left", valign: "middle", margin: 0 }, text: "Título del tema" } }],
    slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.35, fontFace: "Calibri", fontSize: 11, color: COL.tenue, align: "right" } });
  pres.defineSlideMaster({ title: "OSCURO", background: { color: COL.gris },
    objects: [...foot(true), { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 11.2, h: 0.95, fontFace: "Arial", fontSize: 30, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0 }, text: "Título" } }],
    slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.35, fontFace: "Calibri", fontSize: 11, color: "AEB4BB", align: "right" } });
}
async function iconCircle(s, name, x, y, d, bg = COL.am, fg = COL.carbon, id = "icono") {
  s.addShape("ellipse", { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg }, objectName: id + "_fondo" });
  s.addImage({ data: await icon(name, fg), x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56, objectName: id, altText: name });
}
function imageBox(s, t, x, y, w, h) {
  const png = t.diagrama && S.diagramaPng(t.diagrama);
  if (png) {
    const ar = 1600 / 1000; let iw = w, ih = w / ar; if (ih > h) { ih = h; iw = h * ar; }
    s.addImage({ path: png, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih, objectName: "diagrama_atlas", altText: "Diagrama del Atlas MotoDiagrama: " + t.titulo });
    return;
  }
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.12, fill: { color: COL.claro }, line: { color: "AEB4BB", width: 1.5, dashType: "dash" }, objectName: "espacio_imagen" });
  s.addText([{ text: "Espacio para imagen", options: { bold: true, fontSize: 18, color: COL.gris, breakLine: true } }, { text: t.imagen, options: { fontSize: fit(t.imagen, w - 0.6, h - 1.2, 16, 14), color: COL.tenue } }],
    { x: x + 0.3, y: y + 0.3, w: w - 0.6, h: h - 0.6, fontFace: "Calibri", valign: "middle", align: "left", isTextBox: true, objectName: "descripcion_imagen", paraSpaceAfter: 6 });
}
function ideaBox(s, text, x, y, w, h) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.1, fill: { color: "FFF4CC" }, line: { color: "FFF4CC" }, objectName: "idea_clave_fondo" });
  s.addText([{ text: "Idea clave  ", options: { bold: true, color: COL.gris } }, { text, options: { bold: true, color: COL.carbon } }],
    { x: x + 0.25, y, w: w - 0.5, h, fontFace: "Calibri", fontSize: fit("Idea clave  " + text, w - 0.5, h - 0.1, 22, 17), valign: "middle", isTextBox: true, objectName: "idea_clave", margin: 0 });
}
function bulletList(s, items, x, y, w, h, max = 22) {
  const pt = fit(items, w - 0.3, h, max, 17);
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: i < items.length - 1 } })),
    { x, y, w, h, fontFace: "Calibri", fontSize: pt, color: COL.carbon, valign: "top", paraSpaceAfter: 10, isTextBox: true, objectName: "puntos" });
}
async function temaSlide(pres, c, t, i) {
  const s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Temas" });
  s.addText(`${c.n}.${i + 1} ${t.titulo}`, { placeholder: "title", fontSize: fit(t.titulo, 11, 0.95, 30, 26, 1.1, 0.52) });
  await iconCircle(s, t.icono, 12.0, 0.4, 0.8);
  const comp = i % 3;
  if (comp === 0) { // lista + imagen a la derecha
    ideaBox(s, t.idea, 0.6, 1.5, 6.5, 1.0);
    bulletList(s, t.puntos, 0.6, 2.75, 6.5, 3.95);
    imageBox(s, t, 7.45, 1.5, 5.3, 5.2);
  } else if (comp === 1) { // imagen a la izquierda + lista
    imageBox(s, t, 0.6, 1.5, 5.3, 5.2);
    ideaBox(s, t.idea, 6.25, 1.5, 6.5, 1.0);
    bulletList(s, t.puntos, 6.25, 2.75, 6.5, 3.95);
  } else { // tarjetas 2x2 + imagen
    ideaBox(s, t.idea, 0.6, 1.5, 12.15, 0.8);
    const cw = 3.75, chh = 2.05;
    t.puntos.forEach((p, k) => {
      const x = 0.6 + (k % 2) * (cw + 0.25), y = 2.55 + Math.floor(k / 2) * (chh + 0.2);
      s.addShape("roundRect", { x, y, w: cw, h: chh, rectRadius: 0.1, fill: { color: COL.claro }, line: { color: COL.claro }, objectName: `tarjeta_${k + 1}` });
      s.addShape("ellipse", { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: COL.gris }, line: { color: COL.gris }, objectName: `tarjeta_${k + 1}_num_fondo` });
      s.addText(String(k + 1), { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fontFace: "Arial", fontSize: 16, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: `tarjeta_${k + 1}_num` });
      s.addText(p, { x: x + 0.2, y: y + 0.8, w: cw - 0.4, h: chh - 0.95, fontFace: "Calibri", fontSize: fit(p, cw - 0.4, chh - 0.95, 20, 16), color: COL.carbon, valign: "top", margin: 0, isTextBox: true, objectName: `tarjeta_${k + 1}_texto` });
    });
    imageBox(s, t, 8.6, 2.55, 4.15, 4.3);
  }
  s.addNotes(`${t.titulo}\n\nIDEA CLAVE: ${t.idea}\n\n${t.explicacion.join("\n\n")}\n\nDILO ASÍ: ${t.dilo}\n\nIMAGEN SUGERIDA: ${t.imagen}`);
}
async function buildClase(c) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; pres.theme = { headFontFace: "Arial", bodyFontFace: "Calibri" };
  pres.author = CF.instructor.nombre; pres.company = CF.instructor.empresa; pres.title = `Clase ${c.n}. ${c.titulo}`; pres.subject = CF.titulo;
  layouts(pres);
  const mod = A.modulos[c.modulo - 1];
  // Portada
  pres.addSection({ title: "Inicio" });
  let s = pres.addSlide({ masterName: "PORTADA", sectionTitle: "Inicio" });
  s.addText(`MÓDULO ${c.modulo} · ${mod.nombre.toUpperCase()}`, { x: 1.0, y: 0.65, w: 11, h: 0.4, fontFace: "Arial", fontSize: 16, bold: true, color: COL.am, charSpacing: 2, margin: 0, isTextBox: true, objectName: "modulo" });
  s.addText(`Clase ${c.n}`, { x: 1.0, y: 1.05, w: 11, h: 0.5, fontFace: "Arial", fontSize: 22, color: "D7DBE0", margin: 0, isTextBox: true, objectName: "numero_clase" });
  s.addText(c.titulo, { x: 0.6, y: 2.0, w: 9.0, h: 2.2, fontFace: "Arial", fontSize: fit(c.titulo, 9, 2.2, 44, 32, 1.1, 0.55), bold: true, color: "FFFFFF", valign: "top", margin: 0, isTextBox: true, objectName: "titulo_clase" });
  s.addText(c.promesa, { x: 0.6, y: 4.35, w: 8.6, h: 1.3, fontFace: "Calibri", fontSize: fit(c.promesa, 8.6, 1.3, 22, 18), color: "D7DBE0", valign: "top", margin: 0, isTextBox: true, objectName: "promesa" });
  s.addText([{ text: CF.instructor.nombre, options: { bold: true, breakLine: true } }, { text: `${CF.instructor.empresa} · ${CF.instructor.web}` }], { x: 0.6, y: 5.85, w: 8, h: 0.8, fontFace: "Calibri", fontSize: 17, color: "FFFFFF", margin: 0, isTextBox: true, objectName: "instructor" });
  await iconCircle(s, c.temas[0].icono, 10.2, 2.1, 2.3, COL.am, COL.carbon, "icono_portada");
  s.addNotes(`Bienvenida a la Clase ${c.n}: ${c.titulo}. Promesa: ${c.promesa} Recuerda las reglas: cámara opcional, preguntas en el chat y práctica con moto real.`);
  // Objetivos + agenda
  pres.addSection({ title: "Objetivos y agenda" });
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Objetivos y agenda" });
  s.addText("Objetivos y agenda de hoy", { placeholder: "title" });
  await iconCircle(s, "FaBullseye", 12.0, 0.4, 0.8);
  s.addText("Al terminar la clase podrás:", { x: 0.6, y: 1.5, w: 6.2, h: 0.5, fontFace: "Arial", fontSize: 20, bold: true, color: COL.gris, margin: 0, isTextBox: true, objectName: "objetivos_titulo" });
  s.addText(c.objetivos.map((o, i) => ({ text: o, options: { bullet: { type: "number" }, breakLine: i < 3 } })), { x: 0.6, y: 2.05, w: 6.2, h: 4.7, fontFace: "Calibri", fontSize: fit(c.objetivos, 5.9, 4.6, 20, 17), color: COL.carbon, valign: "top", paraSpaceAfter: 10, isTextBox: true, objectName: "objetivos" });
  s.addShape("roundRect", { x: 7.2, y: 1.5, w: 5.55, h: 5.25, rectRadius: 0.12, fill: { color: COL.claro }, line: { color: COL.claro }, objectName: "agenda_fondo" });
  s.addText("Agenda · 90 minutos", { x: 7.5, y: 1.65, w: 5, h: 0.5, fontFace: "Arial", fontSize: 20, bold: true, color: COL.gris, margin: 0, isTextBox: true, objectName: "agenda_titulo" });
  s.addTable(c.agenda.map((a) => [{ text: a.min, options: { bold: true, color: COL.azul, fontFace: "Calibri" } }, { text: a.act, options: { color: COL.carbon, fontFace: "Calibri" } }]),
    { x: 7.5, y: 2.25, w: 5.0, colW: [1.0, 4.0], fontSize: 16, border: { type: "none" }, valign: "middle", rowH: 0.7, objectName: "agenda" });
  s.addNotes(`Objetivos: ${c.objetivos.join(" / ")}. Agenda: ${c.agenda.map((a) => a.min + " " + a.act).join("; ")}.`);
  // Temas
  pres.addSection({ title: "Temas" });
  for (let i = 0; i < c.temas.length; i++) await temaSlide(pres, c, c.temas[i], i);
  // Ejercicio
  pres.addSection({ title: "Práctica" });
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Práctica" });
  s.addText("Ejercicio en vivo", { placeholder: "title" });
  await iconCircle(s, "FaTools", 12.0, 0.4, 0.8);
  s.addText(c.ejercicio.titulo.replace(/^Práctica:\s*/, "").replace(/^./, (m) => m.toUpperCase()), { x: 0.6, y: 1.45, w: 12.1, h: 0.7, fontFace: "Arial", fontSize: fit(c.ejercicio.titulo, 12, 0.7, 24, 18), bold: true, color: COL.azul, margin: 0, isTextBox: true, objectName: "ejercicio_titulo" });
  c.ejercicio.pasos.forEach((p, k) => {
    const x = 0.6 + k * 3.08;
    s.addShape("roundRect", { x, y: 2.45, w: 2.88, h: 4.2, rectRadius: 0.12, fill: { color: k % 2 ? COL.claro : "FFF4CC" }, line: { color: k % 2 ? COL.claro : "FFF4CC" }, objectName: `paso_${k + 1}_fondo` });
    s.addText(`Paso ${k + 1}`, { x: x + 0.2, y: 2.6, w: 2.5, h: 0.5, fontFace: "Arial", fontSize: 20, bold: true, color: COL.gris, margin: 0, isTextBox: true, objectName: `paso_${k + 1}_titulo` });
    s.addText(p, { x: x + 0.2, y: 3.2, w: 2.5, h: 3.3, fontFace: "Calibri", fontSize: fit(p, 2.5, 3.3, 19, 15), color: COL.carbon, valign: "top", margin: 0, isTextBox: true, objectName: `paso_${k + 1}` });
  });
  s.addNotes(`Ejercicio en vivo: ${c.ejercicio.titulo}\n${c.ejercicio.pasos.map((p, k) => `${k + 1}. ${p}`).join("\n")}\nSeguridad: extintor cerca, puntas tipo aguja, puentes con fusible.`);
  // Tarea + errores
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Práctica" });
  s.addText("Tarea de la semana y errores comunes", { placeholder: "title" });
  await iconCircle(s, "FaClipboardList", 12.0, 0.4, 0.8);
  s.addText("Tarea de la semana", { x: 0.6, y: 1.5, w: 6, h: 0.5, fontFace: "Arial", fontSize: 20, bold: true, color: COL.verde, margin: 0, isTextBox: true, objectName: "tarea_titulo" });
  s.addText(c.tarea.map((o, i) => ({ text: o, options: { bullet: { type: "number" }, breakLine: i < 3 } })), { x: 0.6, y: 2.05, w: 5.9, h: 4.7, fontFace: "Calibri", fontSize: fit(c.tarea, 5.6, 4.6, 19, 16), color: COL.carbon, valign: "top", paraSpaceAfter: 10, isTextBox: true, objectName: "tarea" });
  s.addShape("roundRect", { x: 6.85, y: 1.5, w: 5.9, h: 5.25, rectRadius: 0.12, fill: { color: "FDECEC" }, line: { color: "FDECEC" }, objectName: "errores_fondo" });
  s.addText("Errores comunes", { x: 7.1, y: 1.65, w: 5.4, h: 0.5, fontFace: "Arial", fontSize: 20, bold: true, color: COL.rojo, margin: 0, isTextBox: true, objectName: "errores_titulo" });
  s.addText(c.errores.map((o, i) => ({ text: o, options: { bullet: { indent: 18 }, breakLine: i < 3 } })), { x: 7.1, y: 2.25, w: 5.4, h: 4.3, fontFace: "Calibri", fontSize: fit(c.errores, 5.1, 4.2, 19, 16), color: COL.carbon, valign: "top", paraSpaceAfter: 10, isTextBox: true, objectName: "errores" });
  s.addNotes(`Tarea: ${c.tarea.join(" / ")}. Errores comunes: ${c.errores.join(" / ")}.`);
  // Repaso
  pres.addSection({ title: "Repaso y cierre" });
  s = pres.addSlide({ masterName: "CONTENIDO", sectionTitle: "Repaso y cierre" });
  s.addText("Repaso: 4 preguntas", { placeholder: "title" });
  await iconCircle(s, "FaQuestion", 12.0, 0.4, 0.8);
  const notes = [];
  c.repaso.forEach((q, k) => {
    const sh = S.shuffleQ(q, c.n * 100 + k), y = 1.45 + k * 1.33;
    s.addText(`${k + 1}. ${q.p}`, { x: 0.6, y, w: 12.1, h: 0.5, fontFace: "Calibri", fontSize: fit(q.p, 12, 0.5, 19, 16), bold: true, color: COL.carbon, margin: 0, isTextBox: true, objectName: `pregunta_${k + 1}` });
    const opts = sh.ops.map((o, j) => `☐ ${L[j]}) ${o}`).join("     ");
    s.addText(opts, { x: 0.6, y: y + 0.48, w: 12.1, h: 0.8, fontFace: "Calibri", fontSize: fit(opts, 12, 0.8, 18, 15), color: COL.tenue, valign: "top", margin: 0, isTextBox: true, objectName: `opciones_${k + 1}` });
    notes.push(`${k + 1}. ${q.p} → Respuesta: ${L[sh.ok]}) ${q.ops[q.ok]}`);
  });
  s.addNotes("RESPUESTAS\n" + notes.join("\n"));
  // Cierre
  s = pres.addSlide({ masterName: "PORTADA", sectionTitle: "Repaso y cierre" });
  s.addText("Frase de cierre", { x: 1.0, y: 0.75, w: 8, h: 0.5, fontFace: "Arial", fontSize: 18, bold: true, color: COL.am, margin: 0, isTextBox: true, objectName: "cierre_etiqueta" });
  s.addText(`“${c.cierre}”`, { x: 0.6, y: 1.7, w: 11.6, h: 2.5, fontFace: "Arial", fontSize: fit(c.cierre, 11.6, 2.5, 40, 28, 1.15, 0.55), bold: true, color: "FFFFFF", valign: "middle", margin: 0, isTextBox: true, objectName: "frase_cierre" });
  const next = clases[c.n];
  s.addShape("roundRect", { x: 0.6, y: 4.6, w: 12.1, h: 1.6, rectRadius: 0.12, fill: { color: COL.gris }, line: { color: COL.gris }, objectName: "proxima_fondo" });
  s.addText(next ? [{ text: "Próxima clase · ", options: { bold: true, color: COL.am } }, { text: `Clase ${next.n}. ${next.titulo}`, options: { bold: true, color: "FFFFFF", breakLine: true } }, { text: next.promesa, options: { color: "D7DBE0" } }]
    : [{ text: "Siguiente paso · ", options: { bold: true, color: COL.am } }, { text: "Examen final, plan de 30 días y sesiones de dudas en vivo", options: { bold: true, color: "FFFFFF", breakLine: true } }, { text: "Gracias por tu esfuerzo: ahora toca aplicar.", options: { color: "D7DBE0" } }],
    { x: 0.9, y: 4.7, w: 11.5, h: 1.4, fontFace: "Calibri", fontSize: 19, valign: "middle", margin: 0, isTextBox: true, objectName: "proxima_clase" });
  s.addNotes(`Cierre: ${c.cierre} Recuerda la tarea y el canal de dudas. ${next ? "Próxima clase: " + next.titulo : "Indica fechas del examen y de las sesiones de dudas."}`);
  const file = path.join(OUTDIR, `Clase_${String(c.n).padStart(2, "0")}_${c.titulo.replace(/[^\wáéíóúñÁÉÍÓÚÑ]+/g, "_").replace(/_+$/, "").slice(0, 60)}.pptx`);
  fs.mkdirSync(OUTDIR, { recursive: true });
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  console.log("PPTX:", path.basename(file));
  return file;
}
(async () => {
  const only = process.argv[2] ? Number(process.argv[2]) : null;
  for (const c of clases) if (!only || c.n === only) await buildClase(c);
})();
