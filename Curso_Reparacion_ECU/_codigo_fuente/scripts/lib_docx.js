// Librería de apoyo para documentos Word (docx-js) con la identidad de Electrónica y Servicio
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, BorderStyle, Header, Footer, PageNumber, LevelFormat, HeadingLevel, ExternalHyperlink, VerticalAlign, TableLayoutType } = d;
const CFG = require('../data/config');
const ROOT = path.resolve(__dirname, '..');
const K = { gris: '2B3036', carbon: '1E2227', am: 'FFC20E', rojo: 'E5484D', verde: '2FB344', azul: '2D7FF9', claro: 'EEF0F2', amClaro: 'FFF6D6', blanco: 'FFFFFF', tenue: '5F6670' };
const FONT = 'Arial', TW = 9360; // ancho útil Carta con márgenes de 1" (DXA)

function runs(text, base = {}) {
  // Soporta **negritas** dentro del texto
  const out = []; const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) { if (!p) continue; const b = p.startsWith('**') && p.endsWith('**'); out.push(new TextRun({ text: b ? p.slice(2, -2) : p, bold: b || base.bold, italics: base.italics, color: base.color, size: base.size, font: base.font || FONT })); }
  return out;
}
const P = (text, o = {}) => new Paragraph({ children: Array.isArray(text) ? text : runs(text, o), alignment: o.align, spacing: { before: o.before ?? 0, after: o.after ?? 120, line: o.line ?? 276, lineRule: 'auto' }, keepNext: o.keepNext, indent: o.indent, shading: o.shade ? { type: ShadingType.CLEAR, color: 'auto', fill: o.shade } : undefined, border: o.border });
const BIG = (text, o = {}) => new Paragraph({ children: [new TextRun({ text, bold: true, size: o.size || 56, color: o.color || K.carbon, font: FONT })], alignment: o.align, spacing: { before: o.before ?? 0, after: o.after ?? 160 } });
const H1 = (text, o = {}) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, font: FONT })], pageBreakBefore: !!o.pb, border: { left: { style: BorderStyle.SINGLE, size: 36, color: K.am, space: 8 } } });
const H2 = text => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: FONT })] });
const H3 = text => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: FONT })] });
let inst = 0;
const bullets = (items, lvl = 0) => items.map(t => new Paragraph({ children: runs(t), numbering: { reference: 'bul', level: lvl }, spacing: { after: 60, line: 276, lineRule: 'auto' } }));
function numbered(items) { inst++; return items.map(t => new Paragraph({ children: runs(t), numbering: { reference: 'num', level: 0, instance: inst }, spacing: { after: 60, line: 276, lineRule: 'auto' } })); }
const PB = () => new Paragraph({ children: [new d.PageBreak()] });
function cell(content, w, o = {}) {
  const kids = (Array.isArray(content) ? content : [content]).map(c => (c instanceof Paragraph || c instanceof Table) ? c : P(String(c), { after: 40, bold: o.bold, color: o.color, size: o.size, align: o.align }));
  return new TableCell({ children: kids, width: { size: w, type: WidthType.DXA }, shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined, verticalAlign: o.valign || VerticalAlign.CENTER, margins: { top: 80, bottom: 80, left: 110, right: 110 }, columnSpan: o.span, borders: o.borders });
}
function table(headers, rows, widths, o = {}) {
  const sum = widths.reduce((a, b) => a + b, 0); const scale = (o.width || TW) / sum; const ws = widths.map(w => Math.round(w * scale));
  ws[ws.length - 1] += (o.width || TW) - ws.reduce((a, b) => a + b, 0);
  const trs = [];
  if (headers) trs.push(new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, ws[i], { fill: o.headFill || K.gris, color: K.blanco, bold: true, size: o.headSize || 20 })) }));
  rows.forEach((r, ri) => trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, ws[i], { fill: o.zebra === false ? undefined : (ri % 2 ? K.claro : undefined), size: o.size || 20, bold: o.firstBold && i === 0 })) })));
  return new Table({ width: { size: o.width || TW, type: WidthType.DXA }, columnWidths: ws, rows: trs, layout: TableLayoutType.FIXED });
}
function callout(title, text, o = {}) {
  const kids = [];
  if (title) kids.push(P(title, { bold: true, color: o.titleColor || K.carbon, after: 60 }));
  (Array.isArray(text) ? text : [text]).forEach(t => kids.push(P(t, { after: 60 })));
  const b = { style: BorderStyle.SINGLE, size: 6, color: o.border || K.am };
  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], rows: [new TableRow({ cantSplit: true, children: [new TableCell({ children: kids, width: { size: TW, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: o.fill || K.amClaro }, margins: { top: 120, bottom: 120, left: 180, right: 180 }, borders: { top: b, bottom: b, right: b, left: { style: BorderStyle.SINGLE, size: 36, color: o.border || K.am } } })] })] });
}
function img(file, wpx, o = {}) {
  const buf = fs.readFileSync(path.isAbsolute(file) ? file : path.join(ROOT, file));
  const { w, h } = pngSize(buf, file); const width = wpx, height = Math.round(wpx * h / w);
  return new Paragraph({ alignment: o.align || AlignmentType.CENTER, spacing: { before: 60, after: o.after ?? 120 }, children: [new ImageRun({ type: file.endsWith('.jpg') ? 'jpg' : 'png', data: buf, transformation: { width, height } })] });
}
function pngSize(buf, file) {
  if (file.endsWith('.png')) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  let i = 2; while (i < buf.length) { const m = buf[i + 1], len = buf.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC2) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }; i += 2 + len; } return { w: 1, h: 1 };
}
const link = (text, url) => new Paragraph({ spacing: { after: 60 }, children: [new ExternalHyperlink({ link: url, children: [new TextRun({ text, style: 'Hyperlink', font: FONT, size: 20 })] })] });
const spacer = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [], spacing: { after: 120 } }));

function cover(o) {
  const kids = [img('assets/logo_es.png', 190, { align: AlignmentType.LEFT, after: 300 })];
  if (o.kicker) kids.push(P(o.kicker.toUpperCase(), { bold: true, color: 'B88A00', size: 22, after: 120 }));
  kids.push(BIG(o.title, { size: o.size || 60, after: 120 }));
  if (o.subtitle) kids.push(P(o.subtitle, { size: 28, color: K.gris, after: 240 }));
  if (o.photo) kids.push(img(o.photo, o.photoW || 330, { align: AlignmentType.LEFT, after: 200 }));
  (o.lines || []).forEach(l => kids.push(P(l, { size: 22, color: K.tenue, after: 60 })));
  kids.push(PB());
  return kids;
}

function makeDoc(children, o = {}) {
  return new Document({
    creator: CFG.instructor.nombre, title: o.title || CFG.curso.titulo, description: 'Electrónica y Servicio',
    styles: {
      default: { document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { line: 276, lineRule: 'auto' } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 36, bold: true, color: K.carbon }, paragraph: { spacing: { before: 360, after: 160 }, keepNext: true, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 28, bold: true, color: K.gris }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: '1F5FBF' }, paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 2 } }
      ]
    },
    numbering: { config: [
      { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }, { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 270 } } } }] },
      { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] }
    ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440, header: 600, footer: 600 } } },
      headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: K.am, space: 4 } }, children: [new TextRun({ text: `${CFG.curso.titulo} · ${CFG.curso.marcas}`, size: 16, color: K.tenue, font: FONT }), new TextRun({ text: `\t${o.header || CFG.instructor.empresa}`, size: 16, color: K.tenue, font: FONT })], tabStops: [{ type: d.TabStopType.RIGHT, position: TW }] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ tabStops: [{ type: d.TabStopType.RIGHT, position: TW }], children: [new TextRun({ text: `${CFG.instructor.nombre} · ${CFG.instructor.web}`, size: 16, color: K.tenue, font: FONT }), new TextRun({ children: ['\tPágina ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES], size: 16, color: K.tenue, font: FONT })] })] }) },
      children
    }]
  });
}
async function save(doc, rel) { const out = path.resolve(ROOT, '..', rel); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, await Packer.toBuffer(doc)); return out; }

module.exports = { d, K, TW, FONT, runs, P, BIG, H1, H2, H3, bullets, numbered, PB, cell, table, callout, img, link, spacer, cover, makeDoc, save, ROOT };
