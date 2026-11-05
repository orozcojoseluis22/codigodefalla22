// Kit de construcción de documentos Word (docx-js) con la identidad de Electrónica y Servicio
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, BorderStyle, LevelFormat, PageBreak, Header, Footer, PageNumber, ImageRun,
  HeadingLevel, ExternalHyperlink, TableLayoutType, VerticalAlign,
} = require("docx");
const C = require("../../data/config");

const W = 9360; // ancho útil Carta con márgenes de 1"
const col = (hex) => hex.replace("#", "").toUpperCase();
const COL = {
  gris: col(C.colores.grisTecnico), carbon: col(C.colores.carbon), amarillo: col(C.colores.amarillo),
  rojo: col(C.colores.rojo), verde: col(C.colores.verde), azul: col(C.colores.azul), claro: col(C.colores.grisClaro),
  blanco: "FFFFFF", texto: "1E2227", tenue: "5B636B",
};
const FONT = "Arial";

function run(text, o = {}) {
  return new TextRun({ text: String(text), font: o.font || FONT, size: o.size || 22, bold: !!o.bold, italics: !!o.italics, color: o.color || COL.texto });
}
// Texto con **negritas** simples
function runs(text, o = {}) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p) => (p.startsWith("**") ? run(p.slice(2, -2), { ...o, bold: true }) : run(p, o)));
}
function p(text, o = {}) {
  return new Paragraph({
    children: Array.isArray(text) ? text : runs(text, o),
    alignment: o.align || AlignmentType.LEFT,
    spacing: { before: o.before ?? 0, after: o.after ?? 120, line: o.line || 276, lineRule: "auto" },
    keepNext: !!o.keepNext,
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    border: o.border,
    indent: o.indent,
  });
}
function titulo(text, o = {}) {
  // Título grande como párrafo normal en negritas (no estilo "Title")
  return p([run(text, { size: o.size || 44, bold: true, color: o.color || COL.carbon })], { after: o.after ?? 160, before: o.before ?? 0, align: o.align, keepNext: true });
}
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(text, { size: 32, bold: true, color: COL.carbon })],
    border: { left: { style: BorderStyle.SINGLE, size: 36, color: COL.amarillo, space: 8 } }, spacing: { before: 280, after: 140, line: 276, lineRule: "auto" }, keepNext: true });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(text, { size: 26, bold: true, color: COL.gris })], spacing: { before: 220, after: 100, line: 276, lineRule: "auto" }, keepNext: true });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [run(text, { size: 23, bold: true, color: COL.azul })], spacing: { before: 160, after: 80, line: 276, lineRule: "auto" }, keepNext: true });
}
function bullets(items, o = {}) {
  return items.map((t) => new Paragraph({ children: runs(t, o), numbering: { reference: o.numbered ? "numeros" : "vinetas", level: 0, instance: o.instance },
    spacing: { before: 0, after: 80, line: 276, lineRule: "auto" } }));
}
let numInstance = 10;
function numbered(items, o = {}) { return bullets(items, { ...o, numbered: true, instance: numInstance++ }); }
function callout(title, text, color = COL.amarillo) {
  const out = [];
  out.push(new Paragraph({ children: [run(title, { bold: true, size: 22, color: COL.carbon })], shading: { type: ShadingType.CLEAR, color: "auto", fill: COL.claro },
    border: { left: { style: BorderStyle.SINGLE, size: 36, color, space: 8 } }, spacing: { before: 120, after: 0, line: 276, lineRule: "auto" }, keepNext: true }));
  const arr = Array.isArray(text) ? text : [text];
  arr.forEach((t, i) => out.push(new Paragraph({ children: runs(t, { size: 21 }), shading: { type: ShadingType.CLEAR, color: "auto", fill: COL.claro },
    border: { left: { style: BorderStyle.SINGLE, size: 36, color, space: 8 } }, spacing: { before: 0, after: i === arr.length - 1 ? 160 : 0, line: 276, lineRule: "auto" }, keepNext: i < arr.length - 1 })));
  return out;
}
function normWidths(anchos, n) {
  let a = anchos && anchos.length === n ? anchos.slice() : Array(n).fill(Math.floor(W / n));
  const s = a.reduce((x, y) => x + y, 0);
  a = a.map((v) => Math.floor((v * W) / s));
  a[a.length - 1] += W - a.reduce((x, y) => x + y, 0);
  return a;
}
const thin = { style: BorderStyle.SINGLE, size: 4, color: "C9CED4" };
function cell(content, width, o = {}) {
  const paras = (Array.isArray(content) ? content : [content]).map((t) => new Paragraph({ children: runs(t, { size: o.size || 19, bold: o.bold, color: o.color }),
    alignment: o.align || AlignmentType.LEFT, spacing: { before: 40, after: 40, line: 252, lineRule: "auto" } }));
  return new TableCell({ children: paras, width: { size: width, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: o.valign || VerticalAlign.TOP,
    borders: { top: thin, bottom: thin, left: thin, right: thin } });
}
function table(cols, filas, anchos, o = {}) {
  const w = normWidths(anchos, (cols && cols.length) || filas[0].length);
  const rows = [];
  if (cols && cols.length) rows.push(new TableRow({ tableHeader: true, cantSplit: true, children: cols.map((c, i) => cell(c, w[i], { fill: o.headFill || COL.gris, color: COL.blanco, bold: true })) }));
  filas.forEach((f, r) => rows.push(new TableRow({ cantSplit: true, children: f.map((c, i) => cell(c, w[i], { fill: r % 2 ? COL.claro : COL.blanco, bold: o.boldFirst && i === 0, size: o.size })) })));
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows, layout: TableLayoutType.FIXED });
}
function tableTitle(t) { return p([run(t, { bold: true, size: 21, color: COL.gris })], { before: 160, after: 80, keepNext: true }); }
function spacer(after = 120) { return p("", { after }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function link(text, url) {
  return new Paragraph({ children: [new ExternalHyperlink({ link: url, children: [new TextRun({ text, style: "Hyperlink", font: FONT, size: 19 })] }), run("  " + url, { size: 16, color: COL.tenue })],
    spacing: { before: 0, after: 60, line: 252, lineRule: "auto" }, numbering: { reference: "numeros", level: 0, instance: 999 } });
}
function image(file, maxW = 6.5, o = {}) {
  const buf = fs.readFileSync(file);
  // PNG: tamaño en bytes 16-24
  const wpx = buf.readUInt32BE(16), hpx = buf.readUInt32BE(20);
  const wIn = Math.min(maxW, o.maxH ? (o.maxH * wpx) / hpx : maxW);
  const width = Math.round(wIn * 96), height = Math.round((wIn * 96 * hpx) / wpx);
  return new Paragraph({ children: [new ImageRun({ type: "png", data: buf, transformation: { width, height }, altText: { title: o.alt || "Imagen", description: o.alt || "Imagen", name: path.basename(file) } })],
    alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, keepNext: !!o.keepNext });
}
function caption(t) { return p([run(t, { italics: true, size: 18, color: COL.tenue })], { align: AlignmentType.CENTER, after: 160 }); }

function portada({ etiqueta, titulo: t, subtitulo, linea3, fecha }) {
  const band = (text, fill, color, size, bold = true, after = 0, before = 0) => new Paragraph({ children: [run(text, { size, bold, color })], shading: { type: ShadingType.CLEAR, color: "auto", fill },
    spacing: { before, after, line: 276, lineRule: "auto" }, indent: { left: 0, right: 0 } });
  return [
    band(" ", COL.amarillo, COL.carbon, 8),
    band((etiqueta || "ELECTRÓNICA Y SERVICIO").toUpperCase(), COL.carbon, COL.amarillo, 22, true, 0, 0),
    band(" ", COL.carbon, COL.blanco, 20),
    band(t, COL.carbon, COL.blanco, 52, true),
    band(" ", COL.carbon, COL.blanco, 16),
    ...(subtitulo ? [band(subtitulo, COL.carbon, "D7DBE0", 24, false)] : []),
    band(" ", COL.carbon, COL.blanco, 28),
    band(" ", COL.amarillo, COL.carbon, 8),
    spacer(360),
    p([run(C.instructor.nombre, { bold: true, size: 26 })], { after: 60 }),
    p([run(`${C.instructor.empresa} · ${C.instructor.web}`, { size: 22, color: COL.tenue })], { after: 60 }),
    ...(linea3 ? [p([run(linea3, { size: 22, color: COL.tenue })], { after: 60 })] : []),
    p([run(fecha || C.fechaInvestigacion, { size: 22, color: COL.tenue })], { after: 360 }),
    p([run(C.avisoMarcas, { size: 16, color: COL.tenue, italics: true })], { after: 0 }),
    pageBreak(),
  ];
}

function build(file, children, o = {}) {
  const doc = new Document({
    creator: C.instructor.nombre, title: o.title || C.titulo, description: o.description || C.subtitulo,
    styles: {
      default: { document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { line: 276, lineRule: "auto" } } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 32, bold: true, color: COL.carbon }, paragraph: { spacing: { before: 280, after: 140 }, keepNext: true, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 26, bold: true, color: COL.gris }, paragraph: { spacing: { before: 220, after: 100 }, keepNext: true, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 23, bold: true, color: COL.azul }, paragraph: { spacing: { before: 160, after: 80 }, keepNext: true, outlineLevel: 2 } },
      ],
    },
    numbering: { config: [
      { reference: "vinetas", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: "numeros", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 600, footer: 600 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [run(o.header || C.tituloCorto, { size: 16, color: COL.tenue })], alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COL.amarillo, space: 4 } } })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        run(`${C.instructor.empresa} · ${C.instructor.web} · Página `, { size: 16, color: COL.tenue }),
        new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: COL.tenue }) ] })] }) },
      children,
    }],
  });
  return Packer.toBuffer(doc).then((buf) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf); console.log("DOCX:", file); return file; });
}

module.exports = { W, COL, run, runs, p, titulo, h1, h2, h3, bullets, numbered, callout, table, tableTitle, spacer, pageBreak, link, image, caption, portada, build, AlignmentType };
