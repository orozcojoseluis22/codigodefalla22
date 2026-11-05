// Ayudantes para documentos Word (docx-js): Carta, márgenes de 1", Arial 11, interlineado automático
const fs = require('fs');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, LevelFormat, Header, Footer, PageNumber, ImageRun, PageBreak, HeadingLevel, ExternalHyperlink } = D;
const COL = { gris: "2B3036", carbon: "1E2227", amarillo: "FFC20E", rojo: "E5484D", verde: "2FB344", azul: "2D7FF9", claro: "EEF0F2", texto: "1E2227", sub: "4B5560" };
const W = 9360; // ancho útil en DXA (8.5" − 2")
const sp = (after = 120, before = 0) => ({ spacing: { before, after, line: 276, lineRule: "auto" } });
const run = (text, o = {}) => new TextRun({ text: String(text), font: o.font || "Arial", size: o.size || 22, bold: o.bold, italics: o.italics, color: o.color || COL.texto });
function P(text, o = {}) {
  const children = Array.isArray(text) ? text : [run(text, o)];
  return new Paragraph({ children, alignment: o.align, ...sp(o.after ?? 120, o.before ?? 0), keepNext: o.keepNext, shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined, indent: o.indent ? { left: o.indent } : undefined });
}
const BigTitle = (t, o = {}) => P(t, { bold: true, size: o.size || 52, color: o.color || COL.carbon, after: 120, font: "Arial" });
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(t, { bold: true, size: 32, color: COL.carbon })], ...sp(140, 280), keepNext: true });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(t, { bold: true, size: 26, color: COL.gris })], ...sp(100, 200), keepNext: true });
const H3 = t => P(t, { bold: true, size: 23, color: COL.gris, before: 120, after: 60, keepNext: true });
const Bul = (text, lvl = 0, ref = "bul") => new Paragraph({ numbering: { reference: ref, level: lvl }, children: Array.isArray(text) ? text : [run(text)], ...sp(60) });
const Num = (text, ref = "num") => new Paragraph({ numbering: { reference: ref, level: 0 }, children: Array.isArray(text) ? text : [run(text)], ...sp(60) });
const Label = (k, v) => P([run(k + ": ", { bold: true }), run(v)], { after: 60 });
const border = { style: BorderStyle.SINGLE, size: 4, color: "C9CED4" };
function Tbl(header, rows, widths, o = {}) {
  const tot = widths.reduce((a, b) => a + b, 0); const ws = widths.map(w => Math.round(w / tot * W)); ws[ws.length - 1] += W - ws.reduce((a, b) => a + b, 0);
  const cell = (txt, i, head) => new TableCell({ width: { size: ws[i], type: WidthType.DXA }, borders: { top: border, bottom: border, left: border, right: border },
    shading: head ? { type: ShadingType.CLEAR, fill: COL.gris, color: "auto" } : (o.zebra !== false && cell._z ? { type: ShadingType.CLEAR, fill: "F6F7F9", color: "auto" } : undefined),
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: String(txt).split("\n").map(line => new Paragraph({ children: [run(line, { bold: head, color: head ? "FFFFFF" : COL.texto, size: o.size || (head ? 20 : 19) })], spacing: { after: 20, line: 252, lineRule: "auto" } })) });
  const trs = [new TableRow({ tableHeader: true, children: header.map((h, i) => cell(h, i, true)) })];
  rows.forEach((r, k) => { cell._z = k % 2 === 1; trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, i, false)) })); });
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: ws, rows: trs });
}
function Box(lines, fill = "FFF6D6", edge = COL.amarillo) {
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], rows: [new TableRow({ children: [new TableCell({ width: { size: W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill, color: "auto" }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: edge }, bottom: { style: BorderStyle.SINGLE, size: 4, color: edge }, right: { style: BorderStyle.SINGLE, size: 4, color: edge }, left: { style: BorderStyle.SINGLE, size: 36, color: edge } }, margins: { top: 100, bottom: 100, left: 180, right: 140 }, children: lines.map(l => (l instanceof Paragraph) ? l : P(l, { after: 60 })) })] })] });
}
const Img = (file, wPx, hPx, type = "png") => new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type, data: fs.readFileSync(file), transformation: { width: wPx, height: hPx } })], ...sp(120) });
const Break = () => new Paragraph({ children: [new PageBreak()] });
const Link = (text, url) => new Paragraph({ children: [new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: "Arial", size: 20, color: COL.azul, underline: {} })] })], ...sp(40) });
function doc(children, o = {}) {
  return new Document({
    creator: "Prof. José Luis Orozco Cuautle · Electrónica y Servicio", title: o.title || "Diagnóstico Stellantis Pro", description: o.title,
    styles: { default: { document: { run: { font: "Arial", size: 22 }, paragraph: { spacing: { line: 276, lineRule: "auto" } } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 32, bold: true, color: COL.carbon }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 26, bold: true, color: COL.gris }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } }] },
    numbering: { config: [
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }, { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 270 } } } }] },
      ...Array.from({ length: 60 }, (_, i) => ({ reference: i ? "num" + i : "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] }))] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 600, footer: 600 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [run("Diagnóstico Stellantis Pro · " + (o.title || ""), { size: 16, color: COL.sub })], border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: COL.amarillo, space: 4 } } })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run("Prof. José Luis Orozco Cuautle · Electrónica y Servicio · electronicayservicio.com · Página ", { size: 16, color: COL.sub }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: COL.sub })] })] }) },
      children
    }]
  });
}
async function save(d, file) { fs.writeFileSync(file, await Packer.toBuffer(d)); }
function Cover(t, sub, extra = []) {
  return [new Paragraph({ children: [new ImageRun({ type: "png", data: fs.readFileSync(__dirname + "/../assets/logo_es.png"), transformation: { width: 190, height: 69 } })], ...sp(600) }),
    P("DIAGNÓSTICO STELLANTIS PRO · CHRYSLER · DODGE · JEEP · RAM", { bold: true, size: 20, color: COL.sub, after: 200 }),
    BigTitle(t, { size: 60 }), P(sub, { size: 28, color: COL.gris, after: 400 }),
    Box(["Imparte: Prof. José Luis Orozco Cuautle · Electrónica y Servicio", "50 años de experiencia en capacitación técnica en electrónica y electricidad automotriz", "electronicayservicio.com · Escribe STELLANTIS por WhatsApp: 55 52 17 34 84", ...extra]), Break()];
}
module.exports = { D, COL, W, P, run, BigTitle, H1, H2, H3, Bul, Num, Label, Tbl, Box, Img, Break, Link, doc, save, Cover };
