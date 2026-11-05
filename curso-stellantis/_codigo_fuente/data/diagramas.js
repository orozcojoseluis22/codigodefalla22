// Atlas de diagramas didácticos Stellantis (SVG de elaboración propia). Fuente única.
// Paleta de cables: B+ rojo, 5 V naranja, señal azul, tierra negro, CAN H amarillo, CAN L verde, LIN violeta, 48 V/AV naranja punteado.
const C = { bat: "#E5484D", ref: "#F08C00", sig: "#2D7FF9", gnd: "#1E2227", canh: "#E0A800", canl: "#2FB344", lin: "#8B5CF6", ctl: "#2D7FF9", hv: "#F97316", txt: "#1E2227", sub: "#4B5560", box: "#FFFFFF", boxS: "#2B3036", paper: "#F6F7F9", grid: "#E3E6EA", yel: "#FFC20E" };
const W = 1200, H = 760;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="Barlow, Arial, sans-serif" font-size="${o.size || 18}" font-weight="${o.w || 600}" fill="${o.fill || C.txt}" text-anchor="${o.a || "start"}"${o.mono ? ' font-family="IBM Plex Mono, monospace"' : ""}>${esc(s)}</text>`;
const box = (x, y, w, h, label, sub, o = {}) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${o.fill || C.box}" stroke="${o.stroke || C.boxS}" stroke-width="${o.sw || 2.5}"/>${t(x + w / 2, y + (sub ? h / 2 - 4 : h / 2 + 7), label, { a: "middle", size: o.size || 20, w: 700, fill: o.tfill || C.txt })}${sub ? t(x + w / 2, y + h / 2 + 18, sub, { a: "middle", size: 14, w: 500, fill: C.sub }) : ""}</g>`;
const wire = (pts, color, o = {}) => `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="${o.w || 4}" stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
const gnd = (x, y) => `<g stroke="${C.gnd}" stroke-width="3"><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 12}"/><line x1="${x - 14}" y1="${y + 12}" x2="${x + 14}" y2="${y + 12}"/><line x1="${x - 9}" y1="${y + 18}" x2="${x + 9}" y2="${y + 18}"/><line x1="${x - 4}" y1="${y + 24}" x2="${x + 4}" y2="${y + 24}"/></g>`;
const tp = (x, y, n) => `<g><circle cx="${x}" cy="${y}" r="15" fill="${C.yel}" stroke="${C.gnd}" stroke-width="2"/>${t(x, y + 6, n, { a: "middle", size: 16, w: 800 })}</g>`;
const res = (x, y, label, vert) => vert
  ? `<g><rect x="${x - 10}" y="${y}" width="20" height="56" rx="3" fill="#fff" stroke="${C.gnd}" stroke-width="2.5"/>${t(x + 18, y + 34, label, { size: 15, w: 700 })}</g>`
  : `<g><rect x="${x}" y="${y - 10}" width="56" height="20" rx="3" fill="#fff" stroke="${C.gnd}" stroke-width="2.5"/>${t(x + 28, y - 16, label, { a: "middle", size: 15, w: 700 })}</g>`;
const motor = (x, y, l = "M") => `<g><circle cx="${x}" cy="${y}" r="30" fill="#fff" stroke="${C.gnd}" stroke-width="3"/>${t(x, y + 8, l, { a: "middle", size: 24, w: 800 })}</g>`;
const fuse = (x, y, l) => `<g><rect x="${x - 22}" y="${y - 10}" width="44" height="20" rx="8" fill="#fff" stroke="${C.bat}" stroke-width="2.5"/><line x1="${x - 14}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="${C.bat}" stroke-width="2"/>${l ? t(x, y - 16, l, { a: "middle", size: 14, w: 700 }) : ""}</g>`;
const legend = (items, x = 40, y = H - 92) => `<g>${items.map((it, i) => `<line x1="${x + i * 190}" y1="${y}" x2="${x + i * 190 + 34}" y2="${y}" stroke="${it[1]}" stroke-width="5"${it[2] ? ` stroke-dasharray="${it[2]}"` : ""}/>${t(x + i * 190 + 42, y + 6, it[0], { size: 15, w: 600 })}`).join("")}</g>`;
const frame = (n, titulo, sub, body, nota) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(titulo)}">
<rect width="${W}" height="${H}" fill="${C.paper}"/>
<g stroke="${C.grid}" stroke-width="1">${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join("")}${Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join("")}</g>
<rect x="0" y="0" width="14" height="${H}" fill="${C.yel}"/>
<rect x="14" y="0" width="${W - 14}" height="74" fill="#2B3036"/>
${t(40, 34, `ATLAS STELLANTIS · ${n}`, { size: 16, w: 700, fill: C.yel })}
${t(40, 62, titulo, { size: 27, w: 800, fill: "#FFFFFF" })}
${t(W - 30, 62, sub, { size: 16, w: 500, fill: "#C9CED4", a: "end" })}
${body}
<rect x="14" y="${H - 44}" width="${W - 14}" height="44" fill="#1E2227"/>
${t(40, H - 16, nota || "Diagrama didáctico de elaboración propia. Valores típicos: verifique en el diagrama oficial del vehículo exacto.", { size: 14, w: 500, fill: "#C9CED4" })}
${t(W - 30, H - 16, "Prof. José Luis Orozco · Electrónica y Servicio", { size: 14, w: 700, fill: C.yel, a: "end" })}
</svg>`;

// 1 · DLC J1962 (formato obligatorio)
function dlc() {
  const cx = 600, topY = 170, botY = 330, topW = 760, botW = 600, h = 260;
  const pins = [];
  const colorOf = { 16: C.bat, 4: C.gnd, 5: C.gnd, 6: C.canh, 14: C.canl, 3: C.canh, 11: C.canl };
  for (let i = 1; i <= 8; i++) pins.push({ n: i, x: cx - topW / 2 + 70 + (i - 1) * ((topW - 140) / 7), y: 215 });
  for (let i = 9; i <= 16; i++) pins.push({ n: i, x: cx - botW / 2 + 60 + (i - 9) * ((botW - 120) / 7), y: 340 });
  const shape = `<path d="M ${cx - topW / 2} ${topY} L ${cx + topW / 2} ${topY} L ${cx + botW / 2 + 20} ${topY + h - 40} Q ${cx + botW / 2} ${topY + h} ${cx + botW / 2 - 30} ${topY + h} L ${cx - botW / 2 + 30} ${topY + h} Q ${cx - botW / 2} ${topY + h} ${cx - botW / 2 - 20} ${topY + h - 40} Z" fill="#3A4048" stroke="${C.gnd}" stroke-width="4"/>`;
  const p = pins.map(q => `<g><rect x="${q.x - 22}" y="${q.y - 30}" width="44" height="60" rx="8" fill="${colorOf[q.n] ? colorOf[q.n] : "#D8DCE1"}" stroke="#111" stroke-width="2"/>${t(q.x, q.y + 8, q.n, { a: "middle", size: 22, w: 800, fill: (q.n === 4 || q.n === 5) ? "#fff" : C.txt })}</g>`).join("");
  const rows = [["16", "B+ permanente (batería)", C.bat], ["4", "Tierra de chasis", C.gnd], ["5", "Tierra de señal", C.gnd], ["6", "CAN C alta (CAN H) – diagnóstico", C.canh], ["14", "CAN C baja (CAN L) – diagnóstico", C.canl], ["3", "CAN IHS / CAN B (+) según el modelo", C.canh], ["11", "CAN IHS / CAN B (−) según el modelo", C.canl]];
  const tab = rows.map((r, i) => `<g><rect x="${120 + (i % 2) * 500}" y="${470 + Math.floor(i / 2) * 44}" width="34" height="30" rx="6" fill="${r[2]}"/>${t(137 + (i % 2) * 500, 491 + Math.floor(i / 2) * 44, r[0], { a: "middle", size: 16, w: 800, fill: (r[0] === "4" || r[0] === "5") ? "#fff" : C.txt })}${t(166 + (i % 2) * 500, 492 + Math.floor(i / 2) * 44, r[1], { size: 18, w: 600 })}</g>`).join("");
  const body = `${shape}${p}${t(cx, 150, "Vista de frente del conector del vehículo · fila superior ancha 1–8, fila inferior estrecha 9–16, numeración de izquierda a derecha", { a: "middle", size: 16, w: 600, fill: C.sub })}${tab}${t(120, 660, "Prueba rápida: 16 = 12.4–12.8 V · 4 y 5 = menos de 0.1 V a negativo · 6–14 ≈ 60 Ω con batería desconectada", { size: 17, w: 700 })}`;
  return frame("01", "Conector de diagnóstico DLC SAE J1962 en Stellantis", "Terminales clave", body);
}

// 2 · Topología 2018+ con SGW
function topoSGW() {
  const body = `
  ${box(60, 300, 150, 90, "DLC", "J1962")}
  ${box(290, 290, 170, 110, "SGW", "Security Gateway", { fill: "#FFF6D6", stroke: C.yel, sw: 4 })}
  ${t(375, 280, "🔒 lectura sí · escritura con AutoAuth", { a: "middle", size: 14, w: 700, fill: C.sub })}
  ${wire([[210, 330], [290, 330]], C.canh)}${wire([[210, 360], [290, 360]], C.canl)}
  ${t(250, 318, "6", { a: "middle", size: 14 })}${t(250, 384, "14", { a: "middle", size: 14 })}
  ${wire([[460, 320], [540, 320], [540, 150], [1120, 150]], C.canh)}${wire([[460, 335], [555, 335], [555, 165], [1120, 165]], C.canl)}
  ${t(570, 135, "CAN C · 500 kbps · tren motriz y chasis", { size: 17, w: 700 })}
  ${[["PCM", 600], ["TCM", 730], ["ABS/ESC", 860], ["ORC", 990]].map(([n, x]) => `${wire([[x + 50, 150], [x + 50, 190]], C.canh, { w: 3 })}${wire([[x + 64, 165], [x + 64, 190]], C.canl, { w: 3 })}${box(x, 190, 120, 70, n)}`).join("")}
  ${res(1140, 172, "", true)}${t(1132, 255, "120 Ω", { a: "middle", size: 14, w: 700 })}
  ${wire([[460, 365], [540, 365], [540, 470], [1120, 470]], C.canh)}${wire([[460, 380], [555, 380], [555, 485], [1120, 485]], C.canl)}
  ${t(570, 455, "CAN IHS · 125 kbps · interior y confort", { size: 17, w: 700 })}
  ${[["BCM", 600], ["IPC", 730], ["HVAC", 860], ["Radio", 990]].map(([n, x]) => `${wire([[x + 50, 470], [x + 50, 510]], C.canh, { w: 3 })}${wire([[x + 64, 485], [x + 64, 510]], C.canl, { w: 3 })}${box(x, 510, 120, 70, n)}`).join("")}
  ${wire([[660, 580], [660, 630], [900, 630]], C.lin)}${t(910, 636, "LIN → IBS, interruptores, espejos", { size: 16, w: 700, fill: C.lin })}
  ${box(60, 470, 360, 120, "RFHM · EPS · otros", "según el modelo, en CAN C o CAN IHS", { size: 18 })}
  ${legend([["CAN H", C.canh], ["CAN L", C.canl], ["LIN", C.lin]])}`;
  return frame("02", "Topología típica 2018 en adelante con Security Gateway", "CAN C · CAN IHS · LIN", body);
}

// 3 · Topología CAN C + CAN B (aprox. 2005–2010)
function topoCANB() {
  const body = `
  ${box(60, 310, 150, 90, "DLC", "J1962")}
  ${box(300, 290, 190, 130, "TIPM / FCM", "puerta de enlace", { fill: "#FFF6D6", stroke: C.yel, sw: 4 })}
  ${wire([[210, 340], [300, 340]], C.canh)}${wire([[210, 365], [300, 365]], C.canl)}
  ${wire([[490, 320], [570, 320], [570, 160], [1120, 160]], C.canh)}${wire([[490, 335], [585, 335], [585, 175], [1120, 175]], C.canl)}
  ${t(600, 145, "CAN C · 500 kbps · terminación ≈ 60 Ω", { size: 17, w: 700 })}
  ${[["PCM", 620], ["TCM", 760], ["ABS", 900]].map(([n, x]) => `${wire([[x + 50, 160], [x + 50, 200]], C.canh, { w: 3 })}${wire([[x + 64, 175], [x + 64, 200]], C.canl, { w: 3 })}${box(x, 200, 120, 70, n)}`).join("")}
  ${wire([[490, 385], [570, 385], [570, 480], [1120, 480]], C.canh)}${wire([[490, 400], [585, 400], [585, 495], [1120, 495]], C.canl)}
  ${t(600, 465, "CAN B · 83.3 kbps · tolerante a fallas (un solo hilo)", { size: 17, w: 700 })}
  ${[["Tablero", 620], ["Radio", 760], ["HVAC", 900], ["Puertas", 1040]].map(([n, x]) => `${wire([[x + 50, 480], [x + 50, 520]], C.canh, { w: 3 })}${wire([[x + 64, 495], [x + 64, 520]], C.canl, { w: 3 })}${box(x - 10, 520, 120, 70, n)}`).join("")}
  ${t(60, 470, "En CAN B la terminación está", { size: 16, w: 600 })}${t(60, 492, "repartida en cada módulo:", { size: 16, w: 600 })}${t(60, 514, "no aplica la regla de 60 Ω.", { size: 16, w: 800, fill: C.bat })}
  ${legend([["CAN (+)", C.canh], ["CAN (−)", C.canl]])}`;
  return frame("03", "Topología típica de la generación 2005–2010 (CAN C + CAN B)", "TIPM como gateway en varios modelos", body);
}

// 4 · Terminación y pruebas de CAN C
function canTerm() {
  const body = `
  ${box(80, 190, 170, 110, "Módulo A", "120 Ω interna")}${box(950, 190, 170, 110, "Módulo B", "120 Ω interna")}
  ${wire([[250, 225], [950, 225]], C.canh, { w: 5 })}${wire([[250, 265], [950, 265]], C.canl, { w: 5 })}
  ${[420, 600, 780].map(x => `${wire([[x, 225], [x, 330]], C.canh, { w: 3 })}${wire([[x + 18, 265], [x + 18, 330]], C.canl, { w: 3 })}${box(x - 50, 330, 120, 60, "Módulo")}`).join("")}
  ${t(600, 210, "CAN H", { a: "middle", size: 16, w: 800, fill: "#9A7400" })}${t(600, 292, "CAN L", { a: "middle", size: 16, w: 800, fill: "#1E7A2E" })}
  ${box(80, 420, 200, 80, "DLC 6 – 14", "multímetro en Ω")}${tp(310, 460, "Ω")}
  ${[["≈ 60 Ω", "Normal: dos terminaciones en paralelo", C.canl], ["≈ 120 Ω", "Falta una terminación o hay un tramo abierto", C.yel], ["≈ 0 Ω", "CAN H en corto con CAN L", C.bat], ["OL", "Circuito abierto en el punto medido", C.bat]].map((r, i) => `<g><rect x="380" y="${420 + i * 52}" width="120" height="40" rx="8" fill="${r[2]}"/>${t(440, 447 + i * 52, r[0], { a: "middle", size: 20, w: 800, fill: r[2] === C.yel ? C.txt : "#fff" })}${t(520, 447 + i * 52, r[1], { size: 18, w: 600 })}</g>`).join("")}
  ${t(80, 545, "Voltaje (encendido ON):", { size: 17, w: 800 })}${t(80, 570, "CAN H ≈ 2.6 V", { size: 16, w: 600 })}${t(80, 593, "CAN L ≈ 2.4 V (promedio)", { size: 16, w: 600 })}${t(80, 616, "≈0 V corto a tierra", { size: 16, w: 600 })}${t(80, 639, "≈12 V corto a B+", { size: 16, w: 600 })}
  ${legend([["CAN H", C.canh], ["CAN L", C.canl]])}`;
  return frame("04", "Terminación de la CAN C y lecturas en el DLC", "Batería desconectada para medir Ω", body);
}

// 5 · Alimentaciones y tierras de un módulo
function alimentaciones() {
  const body = `
  ${box(470, 250, 260, 200, "MÓDULO", "PCM · BCM · RFHM", { size: 26 })}
  ${box(60, 150, 170, 80, "Batería", "12.6 V")}${fuse(320, 190, "Fusible PDC/TIPM")}
  ${wire([[230, 190], [298, 190]], C.bat)}${wire([[342, 190], [420, 190], [420, 290], [470, 290]], C.bat)}${t(432, 240, "B+ permanente", { size: 15, w: 700, fill: C.bat })}
  ${box(60, 330, 170, 80, "Encendido", "RUN / START")}${wire([[230, 370], [470, 370]], C.bat, { dash: "10 6" })}${t(250, 358, "Alimentación de encendido", { size: 15, w: 700, fill: C.bat })}
  ${wire([[600, 450], [600, 540]], C.gnd)}${gnd(600, 540)}${t(620, 520, "Tierra G### (electrónica)", { size: 15, w: 700 })}
  ${wire([[730, 300], [900, 300]], C.ref)}${t(760, 290, "5 V referencia", { size: 15, w: 700, fill: C.ref })}
  ${wire([[730, 350], [900, 350]], C.sig)}${t(760, 340, "Señal", { size: 15, w: 700, fill: C.sig })}
  ${wire([[730, 400], [900, 400]], C.gnd)}${t(745, 390, "Retorno de sensor", { size: 15, w: 700 })}
  ${box(900, 280, 160, 140, "Sensor", "3 hilos")}
  ${tp(455, 315, 1)}${tp(455, 395, 2)}${tp(640, 540, 3)}${tp(845, 425, 4)}
  ${t(60, 600, "1-2: voltaje en el conector del módulo, con carga · 3: caída de voltaje de tierra (< 0.1 V típico) · 4: retorno de sensor (< 0.1 V)", { size: 16, w: 600 })}
  ${legend([["B+", C.bat], ["Encendido", C.bat, "10 6"], ["5 V ref", C.ref], ["Señal", C.sig], ["Tierra", C.gnd]])}`;
  return frame("05", "Alimentaciones, tierras y retorno de un módulo", "Mida en el conector, con carga", body);
}

// 6 · Referencia de 5 V compartida
function ref5v() {
  const sens = ["MAP", "TPS", "APP", "A/C"];
  const body = `
  ${box(60, 230, 220, 260, "PCM", "regulador de 5 V", { size: 26 })}
  ${wire([[280, 300], [1050, 300]], C.ref, { w: 5 })}${t(360, 286, "Referencia de 5 V «A» compartida", { size: 16, w: 800, fill: C.ref })}
  ${wire([[280, 440], [1050, 440]], C.gnd, { w: 4 })}${t(300, 465, "Retorno (tierra de sensor) compartido", { size: 16, w: 700 })}
  ${sens.map((s, i) => { const x = 380 + i * 175; return `${wire([[x + 30, 300], [x + 30, 340]], C.ref, { w: 3 })}${wire([[x + 60, 340], [x + 60, 330], [x + 60, 250], [x + 60, 230]], C.sig, { w: 3 })}${wire([[x + 90, 400], [x + 90, 440]], C.gnd, { w: 3 })}${box(x, 340, 120, 60, s, null, { stroke: i === 1 ? C.bat : C.boxS, sw: i === 1 ? 4 : 2.5 })}`; }).join("")}
  ${t(560, 222, "señales al PCM", { size: 14, w: 600, fill: C.sig })}
  ${t(640, 540, "⚡ Un sensor en corto a tierra baja la referencia de todos → P0641 / P0651", { a: "middle", size: 19, w: 800, fill: C.bat })}
  ${t(640, 575, "Método: mida 5 V y desconecte sensores uno por uno hasta que regrese la referencia", { a: "middle", size: 17, w: 600 })}
  ${tp(320, 300, 1)}
  ${legend([["5 V ref", C.ref], ["Señal", C.sig], ["Retorno", C.gnd]])}`;
  return frame("06", "Referencia de 5 V compartida entre sensores", "P0641 · P0651", body);
}

// 7 · CKP y CMP Hall
function ckpcmp() {
  const s = (y, n) => `${box(860, y, 200, 110, n, "Hall · 3 hilos")}${wire([[300, y + 25], [860, y + 25]], C.ref)}${wire([[300, y + 55], [860, y + 55]], C.sig)}${wire([[300, y + 85], [860, y + 85]], C.gnd)}${tp(820, y + 25, "R")}${tp(780, y + 55, "S")}${tp(740, y + 85, "T")}`;
  const wave = (x, y, gap) => { let d = `M ${x} ${y + 40}`; let cx = x; for (let i = 0; i < 18; i++) { if (gap && (i === 7 || i === 8)) { d += ` L ${cx + 24} ${y + 40}`; cx += 24; continue; } d += ` L ${cx} ${y} L ${cx + 12} ${y} L ${cx + 12} ${y + 40} L ${cx + 24} ${y + 40}`; cx += 24; } return `<path d="${d}" fill="none" stroke="${C.sig}" stroke-width="3"/>`; };
  const body = `
  ${box(60, 170, 240, 380, "PCM", "", { size: 28 })}
  ${s(180, "CKP")}${s(410, "CMP")}
  ${t(330, 196, "5 V", { size: 14, w: 700, fill: C.ref })}${t(330, 226, "señal", { size: 14, w: 700, fill: C.sig })}${t(330, 256, "retorno", { size: 14, w: 700 })}
  ${wave(380, 310, true)}${t(380, 370, "CKP: pulsos 0–5 V con hueco de referencia", { size: 15, w: 700 })}
  ${wave(380, 540, false)}${t(380, 600, "CMP: patrón por cada 2 vueltas", { size: 15, w: 700 })}
  ${t(60, 640, "R = referencia ≈ 5 V · S = señal 0–5 V en marcha (osciloscopio 2 V/div) · T = retorno < 0.1 V · P0335 · P0340 · P0016", { size: 16, w: 600 })}
  ${legend([["5 V ref", C.ref], ["Señal", C.sig], ["Retorno", C.gnd]])}`;
  return frame("07", "Sensores CKP y CMP tipo Hall", "Puntos de prueba y formas de onda", body);
}

// 8 · Acelerador electrónico (ETC)
function etc() {
  const body = `
  ${box(60, 200, 230, 360, "PCM", "puente H + 2 entradas", { size: 26 })}
  ${box(840, 170, 260, 200, "", "", { size: 19 })}${t(970, 205, "Cuerpo de aceleración", { a: "middle", size: 19, w: 700 })}${t(970, 228, "motor + TPS A/B", { a: "middle", size: 14, w: 500, fill: C.sub })}${motor(970, 300)}
  ${wire([[290, 230], [840, 230]], C.ctl)}${wire([[290, 260], [840, 260]], C.ctl, { dash: "8 6" })}${t(450, 218, "Motor (+/−) PWM con puente H", { size: 15, w: 700, fill: C.ctl })}
  ${wire([[290, 300], [840, 300]], C.ref)}${wire([[290, 325], [840, 325]], C.sig)}${wire([[290, 350], [840, 350]], C.sig, { dash: "4 4" })}${wire([[290, 375], [860, 375], [860, 370]], C.gnd)}
  ${t(450, 292, "5 V · TPS A · TPS B · retorno", { size: 15, w: 700 })}
  ${box(840, 430, 260, 140, "Pedal (APP)", "APP D y APP E", { size: 20 })}
  ${wire([[290, 450], [840, 450]], C.ref)}${wire([[290, 475], [840, 475]], C.sig)}${wire([[290, 500], [840, 500]], C.sig, { dash: "4 4" })}${wire([[290, 525], [840, 525]], C.gnd)}
  ${t(450, 442, "5 V · APP D · APP E · retorno (circuitos independientes)", { size: 15, w: 700 })}
  ${t(60, 620, "Correlación: P2135 (TPS A/B) · P2138 (APP D/E) · P2101 (motor del actuador) · barrido en 2 canales sin huecos", { size: 16, w: 600 })}
  ${legend([["Control motor", C.ctl], ["5 V ref", C.ref], ["Señal", C.sig], ["Retorno", C.gnd]])}`;
  return frame("08", "Acelerador electrónico: cuerpo de aceleración y pedal", "Señales redundantes", body);
}

// 9 · ASD, inyectores y bobinas
function asd() {
  const body = `
  ${box(60, 150, 160, 80, "Batería", "12.6 V")}${fuse(290, 190, "Fusible")}${wire([[220, 190], [268, 190]], C.bat)}
  ${box(360, 150, 180, 90, "Relevador ASD", "en TIPM/PDC")}${wire([[312, 190], [360, 190]], C.bat)}
  ${wire([[540, 195], [1100, 195]], C.bat, { w: 5 })}${t(560, 182, "Alimentación del ASD (solo con CKP en marcha)", { size: 15, w: 700, fill: C.bat })}
  ${[0, 1, 2, 3].map(i => { const x = 600 + i * 120; return `${wire([[x, 195], [x, 260]], C.bat, { w: 3 })}${box(x - 45, 260, 90, 60, "INY " + (i + 1))}${wire([[x, 320], [x, 420], [300, 420]], C.ctl, { w: 3 })}`; }).join("")}
  ${box(60, 380, 240, 200, "PCM", "control a tierra", { size: 26 })}
  ${wire([[220, 260], [300, 260], [300, 380]], C.ctl, { dash: "6 5" })}${t(225, 290, "control ASD", { size: 14, w: 700, fill: C.ctl })}
  ${wire([[1060, 195], [1060, 470]], C.bat, { w: 3 })}${box(1000, 470, 120, 60, "Bobinas")}${wire([[1000, 500], [300, 500]], C.ctl, { w: 3, dash: "10 5" })}${t(640, 492, "señal lógica a bobinas (driver integrado)", { size: 14, w: 700, fill: C.ctl })}
  ${tp(600, 240, 1)}${tp(560, 420, 2)}
  ${t(60, 640, "1: 12 V del ASD durante la marcha · 2: pulso a tierra del PCM y pico inductivo al cerrar (osciloscopio 10–20 V/div)", { size: 16, w: 600 })}
  ${legend([["B+ / ASD", C.bat], ["Control PCM", C.ctl], ["Señal lógica", C.ctl, "10 5"]])}`;
  return frame("09", "Relevador ASD, inyectores y bobinas", "Típico de Chrysler (verificar por modelo)", body);
}

// 10 · TIPM y bomba de combustible
function tipm() {
  const body = `
  ${box(60, 170, 160, 80, "Batería", "12.6 V")}
  ${box(330, 140, 330, 260, "", "")}${t(495, 185, "TIPM / PDC", { a: "middle", size: 24, w: 800 })}${t(495, 210, "fusibles · relevadores · salidas", { a: "middle", size: 14, w: 500, fill: C.sub })}
  ${wire([[220, 210], [330, 210]], C.bat, { w: 6 })}
  ${box(370, 270, 250, 80, "Relevador o salida", "de la bomba", { fill: "#FFF6D6" })}
  ${box(60, 470, 200, 100, "PCM", "solicita la bomba")}
  ${wire([[260, 500], [440, 500], [440, 400]], C.canh, { w: 3 })}${wire([[260, 520], [460, 520], [460, 400]], C.canl, { w: 3 })}${t(280, 548, "Solicitud por CAN", { size: 15, w: 700 })}
  ${wire([[620, 310], [860, 310]], C.bat)}${tp(760, 310, 1)}
  ${box(860, 260, 230, 110, "Bomba de combustible", "en el tanque")}${motor(975, 470, "M")}
  ${wire([[975, 370], [975, 440]], C.bat, { w: 3 })}${wire([[975, 500], [975, 560]], C.gnd)}${gnd(975, 560)}${tp(1010, 540, 2)}
  ${t(560, 470, "Pinza de baja corriente", { size: 16, w: 700 })}${t(560, 494, "en la alimentación: 4–10 A", { size: 16, w: 700 })}${t(560, 518, "típico, segmentos parejos", { size: 16, w: 700 })}
  ${t(60, 640, "Campañas NHTSA 14V530 · 15V115 · 19V813 (Durango/Grand Cherokee 2011–2013): relevador externo + arnés. Revise el VIN antes de reemplazar.", { size: 15, w: 600 })}
  ${legend([["B+", C.bat], ["CAN H", C.canh], ["CAN L", C.canl], ["Tierra", C.gnd]])}`;
  return frame("10", "TIPM y circuito de la bomba de combustible", "1: voltaje con carga · 2: caída de tierra", body);
}

// 11 · Cadena de arranque
function arranque() {
  const steps = [["Botón / llave", "solicitud"], ["RFHM / WIN", "valida la llave"], ["PCM", "P/N + inmovilizador"], ["Relevador", "en TIPM / PDC"], ["Marcha", "solenoide + motor"]];
  const body = `
  ${steps.map((s, i) => { const x = 50 + i * 228; return `${box(x, 250, 190, 110, s[0], s[1])}${i < 4 ? `<polygon points="${x + 220},305 ${x + 196},290 ${x + 196},320" fill="${C.sub}"/>` : ""}${tp(x + 95, 230, i + 1)}`; }).join("")}
  ${wire([[240, 400], [700, 400]], C.canh, { w: 3 })}${wire([[240, 415], [700, 415]], C.canl, { w: 3 })}${t(470, 440, "Red CAN entre módulos", { a: "middle", size: 15, w: 700 })}
  ${box(560, 480, 200, 70, "Sensor P/N", "rango de la transmisión")}${wire([[660, 480], [660, 360]], C.sig, { w: 3 })}
  ${[["1", "Escáner: solicitud de arranque"], ["2", "Escáner: llave válida, sin P0513"], ["3", "Escáner: P/N y autorización"], ["4", "Osciloscopio: control de la bobina"], ["5", "Multímetro: > 10.5 V y caída < 0.5 V"]].map((r, i) => t(60 + (i % 3) * 380, 600 + Math.floor(i / 3) * 30, `${r[0]} → ${r[1]}`, { size: 16, w: 700 })).join("")}
  ${legend([["CAN H", C.canh], ["CAN L", C.canl], ["Señal", C.sig]])}`;
  return frame("11", "Cadena de permisos del arranque", "Diagnóstico de 'no da marcha'", body);
}

// 12 · Carga inteligente con IBS
function carga() {
  const body = `
  ${box(60, 180, 200, 120, "Alternador", "campo controlado")}${motor(160, 360, "G")}
  ${box(420, 170, 220, 140, "PCM", "PWM del campo")}${wire([[260, 220], [420, 220]], C.ctl)}${t(272, 208, "Control del campo (PWM)", { size: 15, w: 700, fill: C.ctl })}${tp(395, 245, 1)}
  ${wire([[260, 270], [330, 270], [330, 480], [560, 480]], C.bat, { w: 6 })}${t(345, 465, "Salida B+", { size: 15, w: 700, fill: C.bat })}
  ${box(560, 430, 200, 110, "Batería", "12 V")}
  ${box(800, 470, 150, 70, "IBS", "borne negativo", { fill: "#EFE7FF" })}${wire([[760, 505], [800, 505]], C.gnd, { w: 6 })}${wire([[950, 505], [1000, 505], [1000, 580]], C.gnd, { w: 6 })}${gnd(1000, 580)}
  ${box(860, 170, 220, 140, "BCM", "estrategia de carga")}${wire([[875, 470], [875, 400], [970, 400], [970, 310]], C.lin)}${t(985, 395, "LIN", { size: 16, w: 800, fill: C.lin })}${tp(920, 400, 2)}
  ${wire([[640, 220], [860, 220]], C.canh, { w: 3 })}${wire([[640, 240], [860, 240]], C.canl, { w: 3 })}${t(750, 208, "CAN", { a: "middle", size: 15, w: 700 })}
  ${t(60, 625, "1: ciclo de trabajo del campo contra voltaje real · 2: LIN 5 V/div, 2 ms/div · rizado AC < 0.5 Vpp típico · P0562 · P0563 · P0620 · P0622", { size: 15, w: 600 })}
  ${legend([["Control", C.ctl], ["B+", C.bat], ["LIN", C.lin], ["CAN H", C.canh], ["Tierra", C.gnd]])}`;
  return frame("12", "Carga inteligente: PCM, IBS por LIN y BCM", "Verifique por modelo", body);
}

// 13 · Inmovilizador
function inmo() {
  const gens = [["SKIM", "llave con transponder"], ["SKREEM / WCM", "llave + control remoto"], ["WIN", "FOBIK insertable"], ["RFHM", "sin llave (botón)"]];
  const body = `
  ${box(60, 200, 200, 110, "Llave / FOBIK", "transponder")}${wire([[260, 255], [380, 255]], C.sig, { dash: "6 6" })}${t(320, 240, "RF", { a: "middle", size: 15, w: 800, fill: C.sig })}
  ${box(380, 190, 240, 130, "Módulo inmovilizador", "SKIM · WCM · WIN · RFHM", { size: 19 })}
  ${wire([[620, 240], [800, 240]], C.canh, { w: 3 })}${wire([[620, 260], [800, 260]], C.canl, { w: 3 })}${t(710, 228, "clave secreta por CAN", { a: "middle", size: 14, w: 700 })}
  ${box(800, 190, 240, 130, "PCM", "permite arranque y combustible")}
  ${gens.map((g, i) => `${box(60 + i * 270, 400, 240, 90, g[0], g[1], { fill: "#FFF" })}`).join("")}
  ${t(60, 385, "Generaciones (según el modelo y el año):", { size: 17, w: 800 })}
  ${t(60, 560, "P0513: llave no válida · P0633: clave secreta no guardada en el PCM (después de cambiar el PCM).", { size: 17, w: 700 })}
  ${t(60, 590, "Antes de condenar módulos: llave de repuesto, pila del control, comunicación y alimentaciones. Programar requiere PIN.", { size: 16, w: 600 })}
  ${legend([["CAN H", C.canh], ["CAN L", C.canl], ["RF", C.sig, "6 6"]])}`;
  return frame("13", "Inmovilizador Stellantis: llave, módulo y PCM", "Sentry Key", body);
}

// 14 · eTorque 48 V (vista superior, formato de ilustración de híbridos)
function etorque() {
  const body = `
  <rect x="300" y="110" width="600" height="560" rx="120" fill="#DCE3EA" stroke="#2B3036" stroke-width="4"/>
  ${t(600, 140, "FRENTE", { a: "middle", size: 15, w: 800, fill: C.sub })}
  <rect x="380" y="170" width="440" height="200" rx="18" fill="#B9C3CE" stroke="#2B3036" stroke-width="3"/>
  ${t(600, 200, "Compartimento del motor", { a: "middle", size: 16, w: 700, fill: C.sub })}
  ${box(420, 230, 170, 110, "Motor", "Hemi 5.7 / 3.6", { fill: "#fff" })}
  ${box(620, 220, 170, 70, "BSG", "motor-generador", { fill: "#FFE8D6", stroke: C.hv, sw: 4 })}
  ${box(620, 300, 170, 60, "Batería 12 V", "", { fill: "#fff" })}
  ${box(470, 480, 260, 110, "Batería 48 V", "bajo el asiento trasero", { fill: "#FFE8D6", stroke: C.hv, sw: 4 })}
  ${box(470, 400, 260, 60, "Convertidor 48 V → 12 V", "", { fill: "#fff", size: 17 })}
  ${wire([[790, 255], [850, 255], [850, 535], [730, 535]], C.hv, { dash: "12 8", w: 5 })}
  ${wire([[600, 460], [600, 480]], C.hv, { dash: "12 8", w: 5 })}
  ${wire([[650, 400], [650, 360]], C.bat, { w: 4 })}
  ${t(930, 260, "BSG: arranca, asiste", { size: 16, w: 700 })}${t(930, 284, "y recarga", { size: 16, w: 700 })}
  ${t(930, 470, "Cable de 48 V", { size: 16, w: 800, fill: C.hv })}${t(930, 494, "(línea punteada)", { size: 15, w: 600 })}
  ${t(60, 300, "Antes de intervenir:", { size: 17, w: 800, fill: C.bat })}${t(60, 326, "1. Procedimiento de", { size: 16, w: 600 })}${t(60, 348, "desconexión del fabricante", { size: 16, w: 600 })}${t(60, 374, "2. Herramienta aislada", { size: 16, w: 600 })}${t(60, 400, "3. Verificar ausencia", { size: 16, w: 600 })}${t(60, 422, "de voltaje", { size: 16, w: 600 })}
  ${legend([["48 V", C.hv, "12 8"], ["12 V", C.bat]])}`;
  return frame("14", "Sistema eTorque de 48 V (vista superior)", "Ram 1500 · ilustración didáctica", body, "Ilustración didáctica de elaboración propia, proporciones aproximadas. Siga siempre el procedimiento de seguridad del fabricante.");
}

const lista = [
  ["dlc", "DLC SAE J1962", dlc, 2], ["topo_sgw", "Topología 2018+ con SGW", topoSGW, 4], ["topo_canb", "Topología CAN C + CAN B", topoCANB, 4],
  ["can_term", "Terminación CAN C", canTerm, 4], ["alimentaciones", "Alimentaciones y tierras", alimentaciones, 1], ["ref5v", "Referencia de 5 V", ref5v, 1],
  ["ckp_cmp", "CKP y CMP Hall", ckpcmp, 7], ["etc", "Acelerador electrónico", etc, 8], ["asd", "ASD, inyectores y bobinas", asd, 8],
  ["tipm", "TIPM y bomba", tipm, 6], ["arranque", "Cadena de arranque", arranque, 10], ["carga", "Carga con IBS", carga, 10],
  ["inmo", "Inmovilizador", inmo, 10], ["etorque", "eTorque 48 V", etorque, 10]
];
module.exports = { lista: lista.map(([id, n, fn, clase]) => ({ id, n, clase, svg: fn() })) };
