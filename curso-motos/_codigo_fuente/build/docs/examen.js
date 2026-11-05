// Examen final: 2 versiones (alumno y con respuestas). Sin numeración; opciones en una fila con ☐; posiciones aleatorias.
const { Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, TableLayoutType, ShadingType } = require("docx");
const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const S = require("../lib/curso");
const { cfg: C, clases } = S;
const path = require("path");
const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const qs = []; clases.forEach((c) => c.repaso.forEach((q, i) => qs.push({ ...S.shuffleQ(q, 9000 + c.n * 10 + i), clase: c.n, correcta: q.ops[q.ok] })));
function filaOpciones(q, conResp) {
  const w = Math.floor(K.W / 4);
  return new Table({ width: { size: K.W, type: WidthType.DXA }, columnWidths: [w, w, w, K.W - 3 * w], layout: TableLayoutType.FIXED,
    rows: [new TableRow({ cantSplit: true, children: q.ops.map((o, j) => new TableCell({ width: { size: j < 3 ? w : K.W - 3 * w, type: WidthType.DXA },
      borders: { top: none, bottom: none, left: none, right: none }, margins: { top: 20, bottom: 20, left: 40, right: 80 },
      shading: conResp && j === q.ok ? { type: ShadingType.CLEAR, color: "auto", fill: "E3F6E6" } : undefined,
      children: [new Paragraph({ children: [K.run(`${conResp && j === q.ok ? "☑" : "☐"} ${o}`, { size: 20, bold: conResp && j === q.ok, color: conResp && j === q.ok ? "1E7B30" : K.COL.texto })] })] })) })] });
}
async function version(conResp) {
  const ch = [];
  ch.push(K.titulo("Examen final", { size: 44 }));
  ch.push(K.p(`**${C.titulo}**`, { after: 60 }));
  ch.push(K.p(`${C.instructor.nombre} · ${C.instructor.empresa}${conResp ? " · VERSIÓN CON RESPUESTAS (solo instructor)" : ""}`, { color: K.COL.tenue }));
  ch.push(K.table([], [["Nombre: ______________________________________", "Fecha: ______________", "Calificación: ____ / 48"]], [4300, 2260, 2800]));
  ch.push(K.p("Instrucciones: marca con una X la casilla de la respuesta correcta. Solo hay una respuesta correcta por pregunta. Cada acierto vale 1 punto; aprobatorio: 38 aciertos (80 %).", { before: 160, after: 200 }));
  let mod = 0;
  for (const q of qs) {
    const c = clases[q.clase - 1];
    if (c.modulo !== mod) { mod = c.modulo; ch.push(K.h2(`Módulo ${mod}. ${S.arq.modulos[mod - 1].nombre}`)); }
    ch.push(K.p(`**${q.p}**`, { after: 40, before: 120, keepNext: true }));
    ch.push(filaOpciones(q, conResp));
  }
  if (conResp) {
    ch.push(K.pageBreak());
    ch.push(K.h1("Clave de respuestas"));
    ch.push(K.table(["Clase", "Pregunta", "Respuesta correcta (posición)"], qs.map((q) => [String(q.clase), q.p, `${["1.ª", "2.ª", "3.ª", "4.ª"][q.ok]} opción: ${q.correcta}`]), [900, 5200, 3260], { size: 17 }));
  }
  const name = conResp ? "Examen_final_CON_respuestas.docx" : "Examen_final_alumno.docx";
  const f = await K.build(path.join(S.ROOT, "10_Evaluacion", name), ch, { title: "Examen final · " + C.titulo, header: "Examen final · " + C.tituloCorto });
  toPdf(f);
}
(async () => { await version(false); await version(true); })();
