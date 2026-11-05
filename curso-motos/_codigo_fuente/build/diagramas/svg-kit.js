// Primitivas SVG para diagramas eléctricos didácticos (Atlas MotoDiagrama)
const C = require("../../data/config").colores;
const WC = { R: "#E5484D", B: "#1E2227", Bl: "#1E2227", Y: "#F2B705", G: "#2FB344", W: "#FFFFFF", L: "#2D7FF9", Bu: "#2D7FF9", O: "#F28C28", Br: "#8B5A2B", P: "#F06BA8", Gr: "#8A939C", Lb: "#6EC6FF", Lg: "#8BD17C", V: "#8E5BD9" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FT = "'Barlow Condensed', 'Arial Narrow', sans-serif", FB = "'Barlow', Arial, sans-serif", FM = "'IBM Plex Mono', monospace";

function text(x, y, s, o = {}) {
  return `<text x="${x}" y="${y}" font-family="${o.f || FB}" font-size="${o.s || 18}" font-weight="${o.w || 500}" fill="${o.c || C.carbon}" text-anchor="${o.a || "start"}"${o.ls ? ` letter-spacing="${o.ls}"` : ""}>${esc(s)}</text>`;
}
function wrap(s, max) {
  const out = []; let line = "";
  for (const w of String(s).split(" ")) { if ((line + " " + w).trim().length > max) { out.push(line.trim()); line = w; } else line += " " + w; }
  if (line.trim()) out.push(line.trim());
  return out;
}
function mtext(x, y, s, max, o = {}) { return wrap(s, max).map((l, i) => text(x, y + i * (o.lh || 22), l, o)).join(""); }
function pill(x, y, s, o = {}) {
  const w = 14 + String(s).length * (o.cw || 9.6);
  return `<g><rect x="${x - w / 2}" y="${y - 13}" width="${w}" height="26" rx="13" fill="${o.fill || "#fff"}" stroke="${o.stroke || C.grisTecnico}" stroke-width="1.5"/>${text(x, y + 5.5, s, { f: FM, s: o.s || 15, w: 600, a: "middle", c: o.c || C.carbon })}</g>`;
}
// Cable con código de color (ej. "R", "B/W"). pts = [[x,y],...]
function wire(pts, code, o = {}) {
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const [a, b] = String(code).split("/");
  const w = o.w || 5, col = WC[a] || a;
  let s = `<path d="${d}" fill="none" stroke="${C.carbon}" stroke-width="${w + 3}" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
  if (b && WC[b]) s += `<path d="${d}" fill="none" stroke="${WC[b]}" stroke-width="2.4" stroke-dasharray="12 10"/>`;
  if (o.label !== false) {
    let best = 0, bi = 0;
    for (let i = 0; i < pts.length - 1; i++) { const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); if (L > best) { best = L; bi = i; } }
    const i = o.at ?? bi, t = o.t ?? 0.5;
    const lx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, ly = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
    s += pill(lx + (o.dx || 0), ly + (o.dy || 0), o.text || code);
  }
  return s;
}
function thin(pts, o = {}) { return `<path d="M${pts.map((p) => p.join(" ")).join(" L")}" fill="none" stroke="${o.c || C.grisTecnico}" stroke-width="${o.w || 2}" stroke-dasharray="${o.dash || "6 6"}"/>`; }
function dot(x, y, c = C.carbon) { return `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`; }
function comp(x, y, w, h, title, sub, color = C.grisTecnico, o = {}) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${o.fill || "#F7F8FA"}" stroke="${color}" stroke-width="3.5"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="${color}"/>`;
  s += mtext(x + w / 2, y + (o.ty || 40), title, o.max || 18, { f: FT, s: o.ts || 26, w: 700, a: "middle", lh: 26 });
  if (sub) s += mtext(x + w / 2, y + (o.sy || 40 + 26 * wrap(title, o.max || 18).length), sub, o.smax || 24, { s: 16, w: 500, a: "middle", c: "#4A525B", lh: 20 });
  return s;
}
function pin(x, y, label, side = "left") {
  const tx = side === "left" ? x + 12 : x - 12;
  return `<circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="2.5"/>` + text(tx, y + 6, label, { f: FM, s: 14, w: 600, a: side === "left" ? "start" : "end", c: "#3A424A" });
}
function battery(x, y, label = "BATERÍA 12 V") {
  let s = `<rect x="${x}" y="${y}" width="150" height="96" rx="8" fill="#2B3036" stroke="${C.carbon}" stroke-width="3"/>`;
  s += `<rect x="${x + 22}" y="${y - 14}" width="26" height="14" fill="#C9CED4" stroke="${C.carbon}" stroke-width="2"/><rect x="${x + 102}" y="${y - 14}" width="26" height="14" fill="#C9CED4" stroke="${C.carbon}" stroke-width="2"/>`;
  s += text(x + 35, y + 30, "+", { s: 30, w: 800, a: "middle", c: C.rojo }) + text(x + 115, y + 30, "−", { s: 30, w: 800, a: "middle", c: "#fff" });
  s += text(x + 75, y + 72, label, { f: FT, s: 20, w: 700, a: "middle", c: C.amarillo });
  return s;
}
const BAT = (x, y) => ({ pos: [x + 35, y - 14], neg: [x + 115, y - 14] });
function fuse(x, y, label, o = {}) {
  // horizontal centrado en x,y ; conexiones en x-30 y x+30
  const v = o.vertical;
  const g = v ? `transform="rotate(90 ${x} ${y})"` : "";
  let s = `<g ${g}><rect x="${x - 30}" y="${y - 13}" width="60" height="26" rx="5" fill="#FFF7D6" stroke="${C.carbon}" stroke-width="2.5"/><path d="M${x - 22} ${y} C ${x - 10} ${y - 14}, ${x} ${y + 14}, ${x + 22} ${y}" fill="none" stroke="${C.carbon}" stroke-width="2.5"/></g>`;
  if (label) s += text(v ? x + 24 : x, v ? y + 6 : y - 22, label, { f: FM, s: 14, w: 600, a: v ? "start" : "middle" });
  return s;
}
function ground(x, y, label) {
  let s = `<path d="M${x} ${y} L${x} ${y + 14} M${x - 22} ${y + 14} L${x + 22} ${y + 14} M${x - 14} ${y + 22} L${x + 14} ${y + 22} M${x - 6} ${y + 30} L${x + 6} ${y + 30}" stroke="${C.carbon}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (label) s += text(x, y + 52, label, { s: 14, a: "middle", c: "#4A525B" });
  return s;
}
function sw(x, y, label, o = {}) {
  // interruptor abierto horizontal: conexiones en (x,y) y (x+70,y)
  let s = `<circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="3"/><circle cx="${x + 70}" cy="${y}" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="3"/>`;
  s += `<path d="M${x + 4} ${y - 4} L${x + 62} ${y - 28}" stroke="${C.carbon}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (label) s += mtext(x + 35, y + (o.below ? 36 : -40), label, o.max || 16, { s: 15, w: 600, a: "middle", lh: 18 });
  return s;
}
function swV(x, y, label, o = {}) {
  // vertical: conexiones (x,y) y (x,y+70)
  let s = `<circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="3"/><circle cx="${x}" cy="${y + 70}" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="3"/>`;
  s += `<path d="M${x + 4} ${y + 4} L${x + 28} ${y + 62}" stroke="${C.carbon}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (label) s += mtext(x + (o.left ? -16 : 36), y + 40, label, o.max || 14, { s: 15, w: 600, a: o.left ? "end" : "start", lh: 18 });
  return s;
}
function coil(x, y, n = 4, o = {}) {
  // bobina horizontal desde x hasta x+n*24
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += ` a12 14 0 0 1 24 0`;
  return `<path d="${d}" fill="none" stroke="${o.c || C.carbon}" stroke-width="3.5"/>`;
}
function coilV(x, y, n = 4, o = {}) {
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += ` a14 12 0 0 1 0 24`;
  return `<path d="${d}" fill="none" stroke="${o.c || C.carbon}" stroke-width="3.5"/>`;
}
function lamp(x, y, r = 26, label) {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF7D6" stroke="${C.carbon}" stroke-width="3"/><path d="M${x - r * 0.62} ${y - r * 0.62} L${x + r * 0.62} ${y + r * 0.62} M${x + r * 0.62} ${y - r * 0.62} L${x - r * 0.62} ${y + r * 0.62}" stroke="${C.carbon}" stroke-width="3"/>`;
  if (label) s += mtext(x, y + r + 24, label, 16, { s: 15, w: 600, a: "middle", lh: 18 });
  return s;
}
function motor(x, y, r = 46, label, l2 = "M") {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3.5"/>` + text(x, y + 12, l2, { f: FT, s: 36, w: 800, a: "middle" });
  if (label) s += mtext(x, y + r + 26, label, 18, { s: 15, w: 600, a: "middle", lh: 18 });
  return s;
}
function diode(x, y, o = {}) {
  // horizontal apuntando a la derecha, de x-16 a x+16
  return `<path d="M${x - 14} ${y - 14} L${x - 14} ${y + 14} L${x + 12} ${y} Z" fill="${C.carbon}"/><path d="M${x + 14} ${y - 15} L${x + 14} ${y + 15}" stroke="${C.carbon}" stroke-width="3.5"/>` + (o.label ? text(x, y - 22, o.label, { s: 14, a: "middle", w: 600 }) : "");
}
function tp(x, y, label) {
  const w = Math.max(40, 14 + label.length * 11);
  return `<g><rect x="${x - w / 2}" y="${y - 17}" width="${w}" height="34" rx="17" fill="${C.amarillo}" stroke="${C.carbon}" stroke-width="2.5"/>${text(x, y + 6.5, label, { f: FM, s: 16, w: 700, a: "middle" })}</g>`;
}
function meter(x, y, kind, value) {
  let s = `<circle cx="${x}" cy="${y}" r="38" fill="#fff" stroke="${C.azul}" stroke-width="4"/>` + text(x, y + 12, kind, { f: FT, s: 34, w: 800, a: "middle", c: C.azul });
  if (value) s += pill(x, y + 60, value, { fill: "#EAF2FF", stroke: C.azul, c: C.azul });
  return s;
}
function arrow(x1, y1, x2, y2, color = C.grisTecnico, w = 4) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 16;
  const p1 = [x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)], p2 = [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)];
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${w}"/><path d="M${x2} ${y2} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} Z" fill="${color}"/>`;
}
function plug(x, y, label = "BUJÍA") {
  return `<rect x="${x - 16}" y="${y}" width="32" height="34" rx="4" fill="#fff" stroke="${C.carbon}" stroke-width="3"/><rect x="${x - 10}" y="${y + 34}" width="20" height="26" fill="#C9CED4" stroke="${C.carbon}" stroke-width="3"/><path d="M${x} ${y + 60} L${x} ${y + 76} M${x - 8} ${y + 82} L${x + 8} ${y + 82}" stroke="${C.carbon}" stroke-width="3"/>` + text(x, y + 112, label, { s: 15, w: 600, a: "middle" });
}
function stator(x, y, r = 80, label = "ESTATOR + VOLANTE") {
  let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="#fff" stroke="${C.carbon}" stroke-width="3"/>`;
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; s += `<rect x="${x + Math.cos(a) * r * 0.62 - 9}" y="${y + Math.sin(a) * r * 0.62 - 9}" width="18" height="18" rx="3" fill="#C98A3A" stroke="${C.carbon}" stroke-width="1.5" transform="rotate(${(i * 45)} ${x + Math.cos(a) * r * 0.62} ${y + Math.sin(a) * r * 0.62})"/>`; }
  s += text(x, y + 6, "N S", { f: FT, s: 18, w: 800, a: "middle", c: C.rojo });
  if (label) s += mtext(x, y + r + 28, label, 20, { f: FT, s: 20, w: 700, a: "middle", lh: 20 });
  return s;
}
function panel(x, y, w, titulo, puntos, nota) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${780}" rx="14" fill="#F4F5F7" stroke="#D5DADF" stroke-width="2"/>`;
  s += text(x + 20, y + 40, titulo, { f: FT, s: 24, w: 800, c: C.grisTecnico, ls: 1 });
  let yy = y + 78;
  for (const [k, que, val] of puntos) {
    s += tp(x + 20 + Math.max(40, 14 + k.length * 11) / 2, yy, k);
    const lines = wrap(que, 30);
    lines.forEach((l, i) => (s += text(x + 20, yy + 38 + i * 20, l, { s: 16, w: 600 })));
    const vl = wrap(val, 32);
    vl.forEach((l, i) => (s += text(x + 20, yy + 38 + lines.length * 20 + 4 + i * 20, l, { f: FM, s: 14, w: 500, c: C.azul })));
    yy += 38 + lines.length * 20 + vl.length * 20 + 26;
  }
  if (nota) { const nl = wrap(nota, 34); nl.forEach((l, i) => (s += text(x + 20, y + 780 - 22 - (nl.length - 1 - i) * 19, l, { s: 14, w: 500, c: "#5B636B" }))); }
  return s;
}
function frame(d, body, o = {}) {
  const W = 1600, H = 1000;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#EEF0F2" stroke-width="1.5"/></pattern></defs>`;
  s += `<rect width="${W}" height="${H}" fill="#fff"/><rect y="96" width="${W}" height="${H - 156}" fill="url(#g)"/>`;
  s += `<rect width="${W}" height="96" fill="${C.carbon}"/><rect width="14" height="96" fill="${C.amarillo}"/>`;
  s += text(40, 36, `ATLAS MOTODIAGRAMA · D${String(d.n).padStart(2, "0")} · CLASE ${d.clase}`, { f: FM, s: 17, w: 600, c: C.amarillo, ls: 1 });
  s += text(40, 76, d.titulo, { f: FT, s: 38, w: 800, c: "#fff" });
  s += `<rect y="${H - 60}" width="${W}" height="60" fill="${C.grisClaro}"/><rect y="${H - 60}" width="${W}" height="4" fill="${C.amarillo}"/>`;
  s += text(40, H - 24, "Diagrama didáctico de un sistema típico · colores y valores de referencia: verifica siempre con el diagrama y el manual del fabricante.", { s: 16, w: 500, c: "#3A424A" });
  s += text(W - 40, H - 24, "Electrónica y Servicio", { f: FT, s: 22, w: 800, a: "end", c: C.grisTecnico });
  s += body;
  if (!o.noPanel) s += panel(1190, 116, 370, d.puntos.length ? "PUNTOS DE PRUEBA" : "CÓMO LEERLO", d.puntos, o.nota || d.que);
  return s + "</svg>";
}
module.exports = { C, WC, text, mtext, wrap, pill, wire, thin, dot, comp, pin, battery, BAT, fuse, ground, sw, swV, coil, coilV, lamp, motor, diode, tp, meter, arrow, plug, stator, panel, frame, FT, FB, FM };
