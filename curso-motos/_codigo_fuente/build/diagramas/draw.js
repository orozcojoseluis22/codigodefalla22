// Dibujo de los 17 diagramas del Atlas MotoDiagrama (originales, didácticos)
const K = require("./svg-kit");
const { C, text, mtext, wire, thin, dot, comp, pin, battery, BAT, fuse, ground, sw, swV, coil, coilV, lamp, motor, diode, tp, meter, arrow, plug, stator, pill } = K;

const D = {};

D.bloques = () => {
  let s = "";
  const box = (x, y, w, h, t, sub, col) => comp(x, y, w, h, t, sub, col, { max: 16, smax: 22 });
  s += box(50, 140, 230, 130, "ESTATOR + VOLANTE", "Genera alterna", C.azul);
  s += box(340, 140, 250, 130, "REGULADOR RECTIFICADOR", "Rectifica y limita", C.azul);
  s += box(650, 140, 220, 130, "BATERÍA 12 V", "Guarda energía", C.verde);
  s += box(930, 140, 220, 130, "FUSIBLE PRINCIPAL", "Protege el arnés", C.amarillo);
  s += arrow(282, 205, 336, 205) + arrow(592, 205, 646, 205) + arrow(872, 205, 926, 205);
  s += box(930, 330, 220, 110, "LLAVE / INTERRUPTORES", "Controla", C.amarillo);
  s += box(930, 500, 220, 110, "FUSIBLES Y RELEVADORES", "Reparte y protege", C.amarillo);
  s += arrow(1040, 272, 1040, 326) + arrow(1040, 442, 1040, 496);
  const cons = [["ENCENDIDO", "CDI o ECU + bobina"], ["LUCES", "Faro, stop, direccionales"], ["INYECCIÓN", "ECU, bomba, inyector"], ["ACCESORIOS", "USB, alarma, faros aux."]];
  cons.forEach(([t, sub], i) => { const x = 50 + i * 228; s += box(x, 700, 205, 120, t, sub, C.rojo); s += thin([[1040, 612], [1040, 660], [x + 102, 660], [x + 102, 696]], { c: C.grisTecnico, dash: "0" }); });
  s += box(370, 470, 240, 120, "ARRANQUE", "Relevador + motor de arranque", C.rojo);
  s += wire([[760, 272], [760, 420], [490, 420], [490, 466]], "R", { w: 7, text: "Potencia", at: 1, t: 0.2 });
  s += wire([[700, 272], [700, 310], [640, 310], [640, 360]], "G", { text: "Tierra", t: 0.6 });
  s += ground(640, 360, "Chasis");
  s += tp(700, 120, "P1") + tp(615, 255, "P2") + tp(560, 370, "P3");
  // leyenda de colores
  const leg = [[C.azul, "Genera"], [C.verde, "Guarda"], [C.amarillo, "Protege y controla"], [C.rojo, "Consume"]];
  leg.forEach(([c, t], i) => { s += `<rect x="${50 + i * 230}" y="880" width="26" height="26" rx="5" fill="${c}"/>` + text(86 + i * 230, 900, t, { s: 18, w: 600 }); });
  return s;
};

D.simbolos = () => {
  let s = "";
  const cells = [
    ["Batería", (x, y) => `<path d="M${x - 60} ${y} L${x - 20} ${y} M${x + 20} ${y} L${x + 60} ${y}" stroke="${C.carbon}" stroke-width="3.5"/><path d="M${x - 20} ${y - 34} L${x - 20} ${y + 34} M${x + 4} ${y - 18} L${x + 4} ${y + 18}" stroke="${C.carbon}" stroke-width="4"/><path d="M${x + 20} ${y - 34} L${x + 20} ${y + 34}" stroke="${C.carbon}" stroke-width="4"/>` + text(x - 30, y - 30, "+", { s: 24, w: 800, c: C.rojo }) + text(x + 36, y - 30, "−", { s: 24, w: 800 })],
    ["Fusible", (x, y) => `<path d="M${x - 70} ${y} L${x - 30} ${y} M${x + 30} ${y} L${x + 70} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + fuse(x, y)],
    ["Tierra (chasis)", (x, y) => `<path d="M${x} ${y - 40} L${x} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + ground(x, y)],
    ["Interruptor", (x, y) => `<path d="M${x - 80} ${y} L${x - 35} ${y} M${x + 35} ${y} L${x + 80} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + sw(x - 35, y)],
    ["Conector", (x, y) => `<path d="M${x - 80} ${y} L${x - 10} ${y}" stroke="${C.carbon}" stroke-width="3.5"/><path d="M${x - 10} ${y - 14} L${x + 6} ${y} L${x - 10} ${y + 14}" fill="none" stroke="${C.carbon}" stroke-width="3.5"/><path d="M${x + 14} ${y - 16} Q${x + 2} ${y} ${x + 14} ${y + 16}" fill="none" stroke="${C.carbon}" stroke-width="3.5"/><path d="M${x + 14} ${y} L${x + 80} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>`],
    ["Relevador", (x, y) => `<rect x="${x - 70}" y="${y - 50}" width="140" height="100" rx="6" fill="none" stroke="${C.carbon}" stroke-width="3" stroke-dasharray="7 5"/>` + coilV(x - 36, y - 30, 2) + sw(x + 2, y + 10).replace(/r="6"/g, 'r="5"') + text(x - 36, y + 46, "bobina", { s: 13, a: "middle" }) + text(x + 37, y + 46, "contacto", { s: 13, a: "middle" })],
    ["Bobina / devanado", (x, y) => `<path d="M${x - 80} ${y} L${x - 48} ${y} M${x + 48} ${y} L${x + 80} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + coil(x - 48, y, 4)],
    ["Diodo", (x, y) => `<path d="M${x - 70} ${y} L${x - 14} ${y} M${x + 14} ${y} L${x + 70} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + diode(x, y)],
    ["Sensor (resistencia variable)", (x, y) => `<path d="M${x - 80} ${y} L${x - 45} ${y} L${x - 35} ${y - 14} L${x - 20} ${y + 14} L${x - 5} ${y - 14} L${x + 10} ${y + 14} L${x + 25} ${y - 14} L${x + 35} ${y} L${x + 80} ${y}" fill="none" stroke="${C.carbon}" stroke-width="3.5"/>` + arrow(x - 40, y + 30, x + 40, y - 30, C.rojo, 3)],
    ["Motor", (x, y) => `<path d="M${x - 80} ${y} L${x - 36} ${y} M${x + 36} ${y} L${x + 80} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + motor(x, y, 36)],
    ["Foco / LED", (x, y) => `<path d="M${x - 80} ${y} L${x - 26} ${y} M${x + 26} ${y} L${x + 80} ${y}" stroke="${C.carbon}" stroke-width="3.5"/>` + lamp(x, y)],
    ["Bujía", (x, y) => `<path d="M${x} ${y - 50} L${x} ${y - 40}" stroke="${C.carbon}" stroke-width="3.5"/>` + plug(x, y - 40, "")],
  ];
  cells.forEach(([t, f], i) => {
    const col = i % 4, row = Math.floor(i / 4), cx = 40 + col * 280 + 130, cy = 130 + row * 260;
    s += `<rect x="${cx - 125}" y="${cy}" width="250" height="235" rx="14" fill="#fff" stroke="#D5DADF" stroke-width="2"/>`;
    s += f(cx, cy + 100);
    s += text(cx, cy + 212, t, { f: FTn(), s: 22, w: 700, a: "middle" });
  });
  return s;
};
function FTn() { return K.FT; }

D["caida-tension"] = () => {
  let s = battery(120, 470);
  const b = BAT(120, 470);
  s += motor(900, 470, 60) + text(975, 480, "MOTOR DE ARRANQUE", { f: K.FT, s: 22, w: 700 });
  s += `<rect x="640" y="700" width="520" height="90" rx="10" fill="#C9CED4" stroke="${C.carbon}" stroke-width="3"/>` + text(900, 755, "BLOQUE DEL MOTOR / CHASIS", { f: K.FT, s: 26, w: 700, a: "middle" });
  s += wire([b.pos, [155, 330], [900, 330], [900, 410]], "R", { w: 9, text: "Cable positivo" });
  s += wire([b.neg, [235, 420], [235, 400], [300, 400], [300, 745], [636, 745]], "B", { w: 9, text: "Cable de tierra", at: 4 });
  s += `<path d="M900 530 L900 700" stroke="${C.carbon}" stroke-width="9"/>` + text(915, 620, "Carcasa a bloque", { s: 15, w: 600 });
  s += meter(520, 210, "V", "V1 < 0.5 V");
  s += thin([[482, 210], [155, 210], [155, 330]], { c: C.azul }) + thin([[558, 210], [960, 210], [960, 410]], { c: C.azul });
  s += dot(155, 330, C.azul) + dot(960, 410, C.azul);
  s += meter(470, 600, "V", "V2 < 0.5 V");
  s += thin([[432, 600], [350, 600], [350, 425], [241, 425]], { c: C.azul }) + thin([[508, 600], [700, 600], [700, 700]], { c: C.azul });
  s += dot(700, 700, C.azul) + dot(241, 425, C.azul);
  s += mtext(60, 900, "Mide mientras das marcha 3 segundos: el voltímetro muestra lo que se pierde en el cable.", 60, { s: 17, w: 600, c: C.grisTecnico });
  return s;
};

D.parasito = () => {
  let s = battery(80, 420);
  const b = BAT(80, 420);
  s += wire([b.pos, [115, 230], [700, 230]], "R", { w: 7, text: "+ directo" });
  s += meter(330, 560, "A", "38 mA");
  s += wire([b.neg, [195, 360], [250, 360], [250, 560], [292, 560]], "B", { label: false });
  s += wire([[368, 560], [460, 560], [460, 760], [700, 760]], "B", { w: 7, text: "Cable de tierra (separado del borne)", at: 2, t: 0.45 });
  s += ground(700, 760);
  s += mtext(250, 660, "Amperímetro EN SERIE: punta roja en borne mA/A", 30, { s: 15, w: 600, c: C.azul });
  const loads = [["F1 10 A", "ECU / reloj (memoria)"], ["F2 10 A", "Alarma o rastreador"], ["F3 15 A", "Accesorios USB"], ["F4 20 A", "Regulador (fuga de diodo)"]];
  loads.forEach(([f, t], i) => {
    const y = 300 + i * 115;
    s += wire([[700, 230], [700, y], [770, y]], "R", { label: false, w: 4 });
    s += fuse(800, y, f);
    s += wire([[830, y], [900, y]], "R", { label: false, w: 4 });
    s += `<rect x="900" y="${y - 32}" width="250" height="64" rx="10" fill="#F7F8FA" stroke="${C.rojo}" stroke-width="3"/>` + mtext(1025, y - 4, t, 20, { f: K.FT, s: 21, w: 700, a: "middle", lh: 22 });
  });
  s += meter(800, 165, "mV", "");
  s += thin([[770, 175], [756, 175], [756, 415], [770, 415]], { c: C.azul }) + thin([[830, 175], [844, 175], [844, 415], [830, 415]], { c: C.azul });
  s += pill(1000, 165, "mV sobre F2 = corriente", { fill: "#EAF2FF", stroke: C.azul, c: C.azul });
  return s;
};

D["carga-mono"] = () => {
  let s = stator(170, 470, 95, "ESTATOR MONOFÁSICO");
  s += comp(470, 260, 240, 330, "REGULADOR RECTIFICADOR", "4 pines (típico)", C.azul, { max: 14 });
  s += pin(470, 380, "Y carga", "left") + pin(470, 470, "W luces", "left") + pin(710, 380, "R salida", "right") + pin(710, 540, "G tierra", "right");
  s += wire([[230, 410], [330, 410], [330, 380], [464, 380]], "Y", { text: "Y" });
  s += wire([[245, 510], [360, 510], [360, 470], [464, 470]], "W", { text: "W" });
  s += wire([[100, 530], [60, 570], [60, 610]], "G", { label: false }) + ground(60, 610);
  s += mtext(110, 700, "Un extremo de cada bobina va a tierra dentro del estator (típico).", 34, { s: 15, w: 600, c: "#4A525B" });
  s += wire([[716, 380], [800, 380], [800, 200], [880, 200]], "R", { w: 6, text: "R" });
  s += fuse(910, 200, "15 A");
  s += battery(980, 330);
  const b = BAT(980, 330);
  s += wire([[940, 200], [1015, 200], b.pos], "R", { label: false, w: 6 });
  s += wire([b.neg, [1095, 280], [1140, 280], [1140, 470]], "G", { text: "G" }) + ground(1140, 470);
  s += wire([[716, 540], [790, 540], [790, 600]], "G", { label: false }) + ground(790, 600);
  s += wire([[464, 470], [420, 470], [420, 760], [560, 760]], "W", { label: false, w: 4 });
  s += sw(560, 760, "Interruptor de luces", { below: true });
  s += wire([[630, 760], [860, 760]], "W", { text: "W/AC" });
  s += lamp(900, 760, 34, "FARO (alterna regulada)");
  s += wire([[934, 760], [1010, 760], [1010, 820]], "G", { label: false }) + ground(1010, 820);
  s += tp(1060, 300, "P1") + tp(330, 345, "P2") + tp(900, 700, "P3") + tp(790, 575, "P4");
  return s;
};

D["carga-tri"] = () => {
  let s = stator(170, 470, 95, "ESTATOR TRIFÁSICO");
  s += `<rect x="330" y="350" width="44" height="170" rx="8" fill="#fff" stroke="${C.carbon}" stroke-width="3"/>` + mtext(352, 545, "Conector estator-regulador", 14, { s: 14, w: 600, a: "middle", lh: 17 });
  [380, 435, 490].forEach((y, i) => { s += wire([[240 + (i === 1 ? 25 : 0), 400 + i * 50 - 20], [300, y - 0], [330, y]], "Y", { label: false }); s += wire([[374, y], [494, y]], "Y", { text: "Y", dx: 0 }); });
  s += comp(500, 270, 250, 360, "REGULADOR RECTIFICADOR", "5 cables (típico)", C.azul, { max: 14 });
  s += pin(500, 380, "Y", "left") + pin(500, 435, "Y", "left") + pin(500, 490, "Y", "left") + pin(750, 380, "R", "right") + pin(750, 560, "G", "right");
  s += wire([[756, 380], [850, 380], [850, 210], [890, 210]], "R", { w: 6, text: "R" });
  s += comp(880, 140, 150, 140, "RELEVADOR ARRANQUE", "con fusible 30 A", C.amarillo, { max: 12, ts: 20, ty: 34 });
  s += battery(980, 400);
  const b = BAT(980, 400);
  s += wire([[1030, 230], [1060, 230], [1060, 330], b.pos[0] === 1015 ? [1015, 330] : [1015, 330], b.pos], "R", { label: false, w: 6 });
  s += wire([b.neg, [1095, 360], [1145, 360], [1145, 560]], "G", { label: false }) + ground(1145, 560);
  s += wire([[756, 560], [840, 560], [840, 620]], "G", { text: "G" }) + ground(840, 620);
  s += tp(415, 335, "P1") + tp(290, 600, "P2") + tp(450, 535, "P3") + tp(1060, 520, "P4");
  s += mtext(470, 760, "Revisa el conector: si está café o derretido, repáralo antes de cambiar piezas.", 46, { s: 17, w: 600, c: C.rojo });
  return s;
};

D["cdi-ac"] = () => {
  let s = stator(160, 380, 90, "ESTATOR (bobina de excitación)");
  s += `<rect x="80" y="610" width="150" height="70" rx="10" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + text(155, 652, "PULSADOR", { f: K.FT, s: 22, w: 700, a: "middle" });
  s += comp(470, 250, 240, 400, "CDI AC", "Unidad de encendido", C.azul);
  s += pin(470, 380, "Excitación", "left") + pin(470, 470, "Pulsador", "left") + pin(470, 590, "Paro", "left") + pin(710, 380, "Bobina", "right") + pin(710, 590, "Tierra", "right");
  s += wire([[245, 360], [320, 360], [320, 380], [464, 380]], "B/R", { text: "B/R" });
  s += wire([[230, 645], [330, 645], [330, 470], [464, 470]], "Bl/Y", { text: "Bl/Y", at: 1 });
  s += wire([[464, 590], [400, 590], [400, 820], [480, 820]], "B/W", { text: "B/W", at: 1 });
  s += sw(480, 820, "Interruptor de paro (manubrio)", { below: true, max: 18 });
  s += wire([[550, 820], [620, 820], [620, 860]], "G", { label: false }) + ground(620, 860);
  s += wire([[716, 590], [790, 590], [790, 650]], "G", { text: "G" }) + ground(790, 650);
  s += `<rect x="830" y="300" width="150" height="170" rx="10" fill="#F7F8FA" stroke="${C.rojo}" stroke-width="3.5"/>` + text(905, 290, "BOBINA DE ENCENDIDO", { f: K.FT, s: 20, w: 700, a: "middle" });
  s += coilV(870, 330, 4) + coilV(930, 320, 5);
  s += wire([[716, 380], [790, 380], [790, 330], [870, 330]], "B/Y", { text: "B/Y", at: 0 });
  s += wire([[870, 426], [870, 500], [870, 540]], "G", { label: false }) + ground(870, 540);
  s += wire([[930, 320], [1060, 320], [1060, 390]], "B", { w: 7, text: "Alta tensión", at: 0 });
  s += `<rect x="1040" y="390" width="40" height="40" rx="6" fill="#E5484D" stroke="${C.carbon}" stroke-width="2.5"/>` + text(1060, 575, "Capuchón ≈5 kΩ", { s: 15, w: 600, a: "middle" });
  s += plug(1060, 430);
  s += tp(390, 340, "P1") + tp(330, 520, "P2") + tp(790, 300, "P3") + tp(1100, 380, "P4");
  return s;
};

D["cdi-dc"] = () => {
  let s = battery(70, 560);
  const b = BAT(70, 560);
  s += wire([b.pos, [105, 200], [180, 200]], "R", { w: 6, text: "R" });
  s += fuse(210, 200, "10 A");
  s += wire([[240, 200], [300, 200]], "R", { label: false, w: 6 });
  s += sw(300, 200, "Llave", {});
  s += wire([[370, 200], [450, 200]], "B", { text: "B" });
  s += sw(450, 200, "Paro de motor", {});
  s += wire([[520, 200], [590, 200], [590, 360], [624, 360]], "B/W", { text: "B/W" });
  s += wire([b.neg, [185, 500], [255, 500], [255, 560]], "G", { label: false }) + ground(255, 560);
  s += comp(630, 270, 230, 360, "CDI DC", "Eleva 12 V a cientos de volts", C.azul);
  s += pin(630, 360, "+12 V", "left") + pin(630, 470, "Pulsador", "left") + pin(630, 580, "Tierra", "left") + pin(860, 360, "Bobina", "right");
  s += `<rect x="260" y="700" width="160" height="70" rx="10" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + text(340, 742, "PULSADOR", { f: K.FT, s: 22, w: 700, a: "middle" });
  s += wire([[420, 735], [520, 735], [520, 470], [624, 470]], "Bl/Y", { text: "Bl/Y", at: 0 });
  s += wire([[624, 580], [560, 580], [560, 640]], "G", { label: false }) + ground(560, 640);
  s += `<rect x="920" y="300" width="130" height="160" rx="10" fill="#F7F8FA" stroke="${C.rojo}" stroke-width="3.5"/>` + text(985, 290, "BOBINA", { f: K.FT, s: 20, w: 700, a: "middle" });
  s += coilV(955, 330, 4) + coilV(1010, 320, 5);
  s += wire([[866, 360], [900, 360], [900, 330], [955, 330]], "B/Y", { label: false });
  s += wire([[955, 426], [955, 520]], "G", { label: false }) + ground(955, 520);
  s += wire([[1010, 320], [1110, 320], [1110, 400]], "B", { w: 7, label: false });
  s += plug(1110, 400);
  s += tp(590, 320, "P1") + tp(470, 690, "P3") + tp(610, 630, "P2");
  return s;
};

D["tci-ecu"] = () => {
  let s = battery(60, 600);
  const b = BAT(60, 600);
  s += wire([b.pos, [95, 200], [160, 200]], "R", { w: 6, text: "R" });
  s += fuse(190, 200, "30 A");
  s += wire([[220, 200], [270, 200]], "R", { label: false, w: 6 });
  s += sw(270, 200, "Llave");
  s += wire([[340, 200], [400, 200]], "B", { label: false });
  s += fuse(430, 200, "10 A");
  s += wire([[460, 200], [930, 200], [930, 300]], "B", { text: "12 V de llave", t: 0.82 });
  s += wire([[700, 200], [700, 260]], "B", { label: false });
  s += comp(540, 260, 280, 380, "ECU", "Calcula avance con CKP, TPS y temperatura", C.azul, { smax: 22 });
  s += pin(540, 380, "CKP +", "left") + pin(540, 440, "CKP −", "left") + pin(820, 420, "Disparo", "right") + pin(540, 580, "Tierra", "left");
  s += `<rect x="150" y="360" width="150" height="110" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + mtext(225, 400, "SENSOR CKP (inductivo)", 12, { f: K.FT, s: 20, w: 700, a: "middle", lh: 22 });
  s += wire([[300, 385], [534, 380]], "W/Y", { text: "W/Y" }) + wire([[300, 445], [534, 440]], "G/W", { text: "G/W" });
  s += wire([[534, 580], [480, 580], [480, 650]], "G", { label: false }) + ground(480, 650);
  s += wire([b.neg, [175, 540], [255, 540], [255, 600]], "G", { label: false }) + ground(255, 600);
  s += `<rect x="880" y="300" width="100" height="300" rx="22" fill="#F7F8FA" stroke="${C.rojo}" stroke-width="3.5"/>` + mtext(930, 640, "BOBINA TIPO LÁPIZ", 12, { f: K.FT, s: 20, w: 700, a: "middle", lh: 22 });
  s += coilV(915, 330, 5) + coilV(948, 330, 7, { c: C.rojo });
  s += wire([[826, 420], [880, 420]], "Y/Bu", { text: "Y/Bu", dx: -4, dy: -24 });
  s += `<path d="M930 600 L930 690" stroke="${C.carbon}" stroke-width="5"/>` + plug(930, 690, "BUJÍA");
  s += tp(980, 250, "P1") + tp(850, 470, "P2") + tp(420, 340, "P3");
  return s;
};

D.arranque = () => {
  let s = battery(60, 300);
  const b = BAT(60, 300);
  s += comp(470, 140, 220, 200, "RELEVADOR DE ARRANQUE", "con fusible principal", C.amarillo, { max: 12, ts: 22 });
  s += wire([b.pos, [95, 200], [466, 200]], "R", { w: 9, text: "Potencia" });
  s += wire([[694, 200], [940, 200], [940, 254]], "R", { w: 9, text: "Al motor" });
  s += motor(940, 310, 56, "MOTOR DE ARRANQUE");
  s += wire([[996, 310], [1100, 310], [1100, 400]], "B", { w: 9, label: false }) + ground(1100, 400, "Bloque");
  s += wire([b.neg, [175, 250], [260, 250], [260, 300]], "G", { w: 7, label: false }) + ground(260, 300);
  // control
  s += wire([[95, 200], [95, 160], [140, 160], [140, 520], [170, 520]], "R", { label: false, w: 4 });
  s += sw(170, 520, "Llave");
  s += wire([[240, 520], [290, 520]], "B", { label: false, w: 4 });
  s += fuse(320, 520, "10 A");
  s += wire([[350, 520], [400, 520]], "B", { label: false, w: 4 });
  s += sw(400, 520, "Paro de motor");
  s += wire([[470, 520], [520, 520]], "B/W", { label: false, w: 4 });
  s += sw(520, 520, "Botón de arranque");
  s += wire([[590, 520], [620, 520], [620, 344]], "Y/R", { text: "Y/R", w: 4 });
  s += wire([[640, 344], [640, 440], [760, 440], [760, 560]], "G/R", { text: "G/R", w: 4, at: 1 });
  s += dot(760, 560);
  s += wire([[760, 560], [760, 640]], "Lg/R", { label: false, w: 4 });
  s += swV(760, 640, "Interruptor de neutral", { max: 14 });
  s += wire([[760, 710], [760, 760]], "G", { label: false, w: 4 }) + ground(760, 760);
  s += wire([[760, 560], [880, 560]], "G/R", { label: false, w: 4 });
  s += diode(910, 560, { label: "Diodo" });
  s += wire([[924, 560], [1000, 560], [1000, 640]], "G/R", { label: false, w: 4 });
  s += swV(1000, 640, "Interruptor de clutch", { max: 14 });
  s += wire([[1000, 710], [1000, 760]], "G", { label: false, w: 4 }) + ground(1000, 760);
  s += tp(620, 400, "P1") + tp(580, 115, "P2") + tp(840, 165, "P3") + tp(1010, 230, "A");
  s += `<rect x="60" y="820" width="22" height="22" fill="${C.rojo}"/>` + text(92, 838, "Circuito de potencia (cable grueso)", { s: 17, w: 600 });
  s += `<rect x="430" y="820" width="22" height="22" fill="${C.azul}"/>` + text(462, 838, "Circuito de control (colores típicos estilo Honda)", { s: 17, w: 600 });
  return s;
};

D.direccionales = () => {
  let s = battery(60, 320);
  const b = BAT(60, 320);
  s += wire([b.pos, [95, 200], [150, 200]], "R", { label: false, w: 6 });
  s += sw(150, 200, "Llave");
  s += wire([[220, 200], [270, 200]], "B", { label: false });
  s += fuse(300, 200, "10 A");
  s += wire([[330, 200], [400, 200]], "B", { text: "B" });
  s += comp(400, 150, 200, 130, "RELEVADOR DE DESTELLOS", "B entra · L sale", C.amarillo, { max: 12, ts: 21 });
  s += wire([[600, 215], [680, 215], [680, 330]], "Gr", { text: "Gr" });
  s += `<rect x="610" y="330" width="140" height="120" rx="12" fill="#F7F8FA" stroke="${C.carbon}" stroke-width="3"/>` + mtext(680, 365, "INTERRUPTOR DE DIRECCIONALES", 12, { f: K.FT, s: 18, w: 700, a: "middle", lh: 20 });
  s += text(640, 440, "IZQ", { f: K.FM, s: 14, w: 700, a: "middle" }) + text(720, 440, "DER", { f: K.FM, s: 14, w: 700, a: "middle" });
  s += wire([[640, 450], [640, 520], [250, 520], [250, 600]], "O", { text: "O (izquierda)", at: 1 });
  s += wire([[720, 450], [720, 520], [1000, 520], [1000, 600]], "Lb", { text: "Lb (derecha)", at: 1 });
  [[150, "Del. izq."], [350, "Tras. izq."]].forEach(([x, t]) => { s += wire([[250, 600], [x, 600], [x, 640]], "O", { label: false, w: 4 }); s += lamp(x, 670, 28) + text(x + 36, 676, t, { s: 15, w: 600 }); s += wire([[x, 698], [x, 790]], "G", { label: false, w: 4 }) + ground(x, 790); });
  [[900, "Del. der."], [1100, "Tras. der."]].forEach(([x, t]) => { s += wire([[1000, 600], [x, 600], [x, 640]], "Lb", { label: false, w: 4 }); s += lamp(x, 670, 28) + text(x - 36, 676, t, { s: 15, w: 600, a: "end" }); s += wire([[x, 698], [x, 790]], "G", { label: false, w: 4 }) + ground(x, 790); });
  s += wire([b.neg, [175, 270], [255, 270], [255, 320]], "G", { label: false }) + ground(255, 320);
  s += lamp(560, 680, 22, "Testigo tablero");
  s += thin([[250, 600], [250, 560], [520, 560], [520, 680], [538, 680]]) + thin([[582, 680], [600, 680], [600, 560], [1000, 560], [1000, 600]]);
  s += tp(370, 160, "P1") + tp(740, 300, "P2") + tp(195, 760, "P3");
  return s;
};

D["efi-potencia"] = () => {
  let s = battery(50, 700);
  const b = BAT(50, 700);
  s += wire([b.pos, [85, 180], [120, 180]], "R", { w: 6, text: "R", t: 0.3 });
  s += fuse(150, 180, "30 A");
  s += wire([[180, 180], [230, 180]], "R", { label: false, w: 6 });
  s += sw(230, 180, "Llave");
  s += wire([[300, 180], [340, 180]], "B", { label: false });
  s += fuse(370, 180, "10 A");
  s += wire([[400, 180], [470, 180]], "B", { label: false });
  s += comp(470, 130, 200, 120, "RELEVADOR PRINCIPAL", "controlado por ECU", C.amarillo, { max: 12, ts: 21 });
  s += wire([[670, 190], [1150, 190]], "B/W", { text: "12 V a actuadores", t: 0.22 });
  s += comp(360, 420, 300, 330, "ECU", "", C.azul);
  s += pin(360, 500, "Alim.", "left") + pin(360, 680, "Tierra", "left") + pin(660, 500, "Inyector −", "right") + pin(660, 580, "Bobina −", "right") + pin(660, 660, "Relevador", "right");
  s += `<circle cx="510" cy="750" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="2.5"/>` + text(510, 735, "Inclinación", { f: K.FM, s: 14, w: 600, a: "middle", c: "#3A424A" });
  s += wire([[600, 252], [600, 330], [310, 330], [310, 500], [354, 500]], "B/W", { label: false, w: 4 });
  s += wire([[666, 660], [720, 660], [720, 290], [640, 290], [640, 252]], "G/Y", { text: "Control", at: 1, w: 4 });
  s += wire([[354, 680], [300, 680], [300, 740]], "G", { label: false }) + ground(300, 740);
  s += wire([b.neg, [165, 650], [245, 650], [245, 700]], "G", { label: false }) + ground(245, 700);
  s += motor(860, 330, 40, "BOMBA (en tanque)");
  s += wire([[860, 190], [860, 290]], "B/W", { label: false, w: 4 }) + wire([[900, 330], [960, 330], [960, 380]], "G", { label: false, w: 4 }) + ground(960, 380);
  s += `<rect x="1000" y="400" width="70" height="90" rx="10" fill="#F7F8FA" stroke="${C.rojo}" stroke-width="3"/>` + text(1035, 388, "INYECTOR", { f: K.FT, s: 18, w: 700, a: "middle" }) + coilV(1021, 410, 3);
  s += wire([[1021, 190], [1021, 362]], "B/W", { label: false, w: 4 }) + `<path d="M1021 362 L1021 410" stroke="${C.carbon}" stroke-width="3"/>`;
  s += wire([[666, 500], [790, 500], [790, 540], [1021, 540], [1021, 490]], "P/B", { text: "Pulso", at: 2, w: 4 });
  s += `<rect x="1090" y="600" width="70" height="140" rx="16" fill="#F7F8FA" stroke="${C.rojo}" stroke-width="3"/>` + text(1125, 770, "BOBINA", { f: K.FT, s: 18, w: 700, a: "middle" }) + coilV(1111, 615, 4);
  s += wire([[1140, 190], [1140, 570], [1111, 570], [1111, 615]], "B/W", { label: false, w: 4 });
  s += wire([[666, 580], [750, 580], [750, 820], [1111, 820], [1111, 711]], "Y/Bu", { text: "Disparo", at: 2, w: 4 });
  s += `<rect x="410" y="840" width="200" height="70" rx="10" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + mtext(510, 868, "SENSOR DE INCLINACIÓN", 14, { f: K.FT, s: 18, w: 700, a: "middle", lh: 20 });
  s += wire([[510, 840], [510, 756]], "R/W", { label: false, w: 4 });
  s += tp(270, 455, "P1") + tp(805, 250, "P2") + tp(1110, 380, "P3") + tp(650, 875, "P4");
  return s;
};

D["efi-sensores"] = () => {
  let s = comp(830, 130, 300, 780, "ECU", "Entradas de sensores", C.azul);
  const pins = [["5 V REF", 250], ["SG (tierra sensor)", 300], ["TPS", 380], ["MAP", 460], ["IAT", 540], ["ECT / EOT", 620], ["CKP +", 700], ["CKP −", 740], ["O2 señal", 820], ["O2 calentador −", 870]];
  pins.forEach(([t, y]) => (s += pin(830, y, t, "left")));
  // buses
  s += wire([[824, 250], [600, 250], [600, 470]], "Y/R", { text: "5 V", at: 0 });
  s += wire([[824, 300], [640, 300], [640, 650]], "G/O", { text: "SG", at: 0, t: 0.3 });
  // TPS
  s += `<rect x="60" y="330" width="160" height="100" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + mtext(140, 362, "TPS (posición acelerador)", 12, { f: K.FT, s: 19, w: 700, a: "middle", lh: 21 });
  s += wire([[220, 350], [600, 350]], "Y/R", { label: false, w: 3 }) + wire([[220, 380], [824, 380]], "R/Y", { text: "Señal 0.5–4.5 V", t: 0.45, w: 4 }) + wire([[220, 410], [640, 410]], "G/O", { label: false, w: 3 });
  // MAP
  s += `<rect x="60" y="445" width="160" height="80" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + mtext(140, 478, "MAP (presión)", 12, { f: K.FT, s: 19, w: 700, a: "middle", lh: 21 });
  s += wire([[220, 455], [600, 455]], "Y/R", { label: false, w: 3 }) + wire([[220, 485], [824, 460]], "L/Y", { text: "Señal", t: 0.45, w: 4 }) + wire([[220, 512], [640, 512]], "G/O", { label: false, w: 3 });
  // IAT
  s += `<rect x="60" y="540" width="160" height="60" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + text(140, 578, "IAT (NTC)", { f: K.FT, s: 19, w: 700, a: "middle" });
  s += wire([[220, 552], [824, 540]], "Gr/Bu", { text: "Señal", t: 0.45, w: 4 }) + wire([[220, 588], [640, 588]], "G/O", { label: false, w: 3 });
  // ECT
  s += `<rect x="60" y="615" width="160" height="60" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + text(140, 653, "ECT / EOT (NTC)", { f: K.FT, s: 19, w: 700, a: "middle" });
  s += wire([[220, 625], [824, 620]], "G/Bu", { text: "Señal", t: 0.45, w: 4 }) + wire([[220, 660], [640, 660], [640, 650]], "G/O", { label: false, w: 3 });
  // CKP
  s += `<rect x="60" y="690" width="160" height="70" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + mtext(140, 720, "CKP (inductivo)", 12, { f: K.FT, s: 19, w: 700, a: "middle", lh: 21 });
  s += wire([[220, 705], [824, 700]], "W/Y", { text: "Alterna propia", t: 0.45, w: 4 }) + wire([[220, 745], [824, 740]], "G/W", { label: false, w: 4 });
  // O2
  s += `<rect x="60" y="790" width="160" height="110" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + mtext(140, 825, "SENSOR O2 (con calentador)", 12, { f: K.FT, s: 19, w: 700, a: "middle", lh: 21 });
  s += wire([[220, 815], [824, 820]], "B/O", { text: "Señal 0.1–0.9 V", t: 0.45, w: 4 }) + wire([[220, 870], [824, 870]], "P/W", { text: "Calentador (ECU a tierra)", t: 0.45, w: 4 });
  s += wire([[220, 892], [300, 892], [300, 925]], "B/W", { label: false, w: 3 }) + text(310, 922, "12 V relevador", { s: 14, w: 600 });
  s += tp(740, 352, "TPS") + tp(740, 432, "MAP") + tp(745, 582, "ECT/IAT") + tp(740, 792, "O2");
  return s;
};

D["diag-pines"] = () => {
  let s = `<rect x="80" y="170" width="440" height="300" rx="40" fill="#2B3036" stroke="${C.carbon}" stroke-width="4"/><rect x="230" y="150" width="140" height="24" rx="6" fill="#2B3036"/>`;
  const L = ["A", "B", "C", "D", "E", "F"];
  L.forEach((l, i) => { const x = 170 + (i % 3) * 130, y = 260 + Math.floor(i / 3) * 120; s += `<circle cx="${x}" cy="${y}" r="34" fill="#C9CED4" stroke="${C.carbon}" stroke-width="3"/>` + text(x, y + 10, l, { f: K.FT, s: 30, w: 800, a: "middle" }); });
  s += mtext(300, 510, "Vista de terminales. Las letras son genéricas: la función de cada cavidad cambia por marca y modelo.", 44, { s: 17, w: 600, a: "middle", lh: 22, c: "#4A525B" });
  s += meter(300, 680, "V", "Llave en ON");
  const rows = [["Función", "Qué mides", "Qué esperas (típico)"], ["+12 V", "Voltaje a tierra, llave ON", "≈ voltaje de batería"], ["Tierra", "Continuidad a chasis", "≈ 0 Ω"], ["K-line", "Voltaje en reposo", "Cercano al de batería"], ["CAN H", "Voltaje, llave ON", "≈ 2.5 V (sube al comunicar)"], ["CAN L", "Voltaje, llave ON", "≈ 2.5 V (baja al comunicar)"], ["Sin uso", "Nada", "0 V y sin continuidad"]];
  rows.forEach((r, i) => {
    const y = 160 + i * 92;
    s += `<rect x="580" y="${y}" width="580" height="84" rx="10" fill="${i === 0 ? C.grisTecnico : i % 2 ? "#fff" : "#F4F5F7"}" stroke="#D5DADF" stroke-width="2"/>`;
    const col = i === 0 ? "#fff" : C.carbon;
    s += text(600, y + 50, r[0], { f: i === 0 ? K.FT : K.FM, s: i === 0 ? 22 : 18, w: 700, c: col });
    s += mtext(740, y + (wrapLen(r[1]) > 1 ? 36 : 50), r[1], 18, { s: 17, w: 600, c: col, lh: 20 });
    s += mtext(950, y + (wrapLen(r[2], 20) > 1 ? 36 : 50), r[2], 20, { s: 17, w: 600, c: i === 0 ? "#fff" : C.azul, lh: 20 });
  });
  return s;
};
function wrapLen(s, m = 18) { return K.wrap(s, m).length; }

D.relevador = () => {
  let s = `<rect x="60" y="180" width="380" height="420" rx="20" fill="#F7F8FA" stroke="${C.carbon}" stroke-width="3.5" stroke-dasharray="10 6"/>` + text(250, 160, "RELEVADOR (vista interna)", { f: K.FT, s: 24, w: 800, a: "middle" });
  s += coilV(150, 300, 5) + text(128, 365, "Bobina", { s: 16, w: 600, a: "end" });
  s += `<path d="M150 300 L150 250 L110 250 M150 420 L150 470 L110 470" fill="none" stroke="${C.carbon}" stroke-width="3.5"/>`;
  s += pin(100, 250, "86", "right") + pin(100, 470, "85", "right");
  s += `<path d="M330 250 L330 330 M330 410 L330 470" stroke="${C.carbon}" stroke-width="3.5"/><path d="M334 334 L372 400" stroke="${C.carbon}" stroke-width="4"/><circle cx="330" cy="330" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="3"/><circle cx="330" cy="410" r="6" fill="#fff" stroke="${C.carbon}" stroke-width="3"/>`;
  s += `<path d="M330 250 L400 250 M330 470 L400 470" stroke="${C.carbon}" stroke-width="3.5"/>` + pin(410, 250, "30", "left") + pin(410, 470, "87", "left");
  s += thin([[175, 360], [320, 370]], { c: C.azul }) + text(250, 398, "campo magnético", { s: 14, w: 600, a: "middle", c: C.azul });
  // circuito de prueba
  s += battery(560, 720);
  const b = BAT(560, 720);
  s += wire([b.pos, [595, 600], [620, 600]], "R", { label: false, w: 5 });
  s += fuse(650, 600, "10 A");
  s += wire([[680, 600], [760, 600], [760, 300], [800, 300]], "R", { text: "a 30", at: 1, w: 5 });
  s += comp(800, 240, 160, 300, "RELEVADOR", "", C.amarillo);
  s += pin(800, 300, "30", "left") + pin(800, 460, "86", "left") + pin(960, 300, "87", "right") + pin(960, 460, "85", "right");
  s += wire([[680, 600], [700, 600], [700, 460], [794, 460]], "R", { label: false, w: 4 });
  s += wire([[966, 460], [1020, 460], [1020, 560]], "G", { label: false, w: 4 }) + ground(1020, 560);
  s += wire([[966, 300], [1080, 300]], "Y", { label: false, w: 5 });
  s += lamp(1110, 300, 28, "Carga");
  s += wire([[1138, 300], [1160, 300], [1160, 560]], "G", { label: false, w: 5 }) + ground(1160, 560);
  s += wire([b.neg, [675, 680], [740, 680], [740, 720]], "G", { label: false }) + ground(740, 720);
  s += meter(880, 130, "V", "< 0.2 V");
  s += thin([[842, 130], [780, 130], [780, 300]], { c: C.azul }) + thin([[918, 130], [990, 130], [990, 300]], { c: C.azul });
  s += meter(160, 720, "Ω", "60–120 Ω típ.");
  s += thin([[160, 682], [160, 640], [100, 640], [100, 476]], { c: C.azul }) + thin([[198, 720], [250, 720], [250, 640], [90, 640]], { c: "transparent" });
  s += thin([[198, 720], [230, 720], [230, 230], [100, 230], [100, 244]], { c: C.azul });
  return s;
};

D["moto-electrica"] = () => {
  let s = `<rect x="60" y="180" width="300" height="300" rx="16" fill="#2B3036" stroke="${C.carbon}" stroke-width="3"/>` + mtext(210, 240, "BATERÍA DE LITIO 60 V (típico)", 16, { f: K.FT, s: 26, w: 800, a: "middle", c: C.amarillo, lh: 28 });
  s += `<rect x="100" y="330" width="220" height="110" rx="12" fill="#fff" stroke="${C.verde}" stroke-width="3"/>` + mtext(210, 370, "BMS: protege celdas (sobrecarga, descarga, temperatura)", 22, { s: 16, w: 600, a: "middle", lh: 20 });
  s += `<path d="M420 140 L470 220 L370 220 Z" fill="${C.amarillo}" stroke="${C.carbon}" stroke-width="3"/>` + text(420, 210, "!", { f: K.FT, s: 40, w: 800, a: "middle" }) + text(500, 190, "ALTO VOLTAJE", { f: K.FT, s: 22, w: 800, c: C.rojo });
  s += wire([[360, 260], [430, 260]], "R", { w: 8, label: false }) + fuse(460, 260, "Fusible/contactor") + wire([[490, 260], [600, 260]], "R", { w: 8, text: "+60 V" });
  s += wire([[360, 420], [600, 420]], "B", { w: 8, text: "−" });
  s += comp(600, 200, 260, 300, "CONTROLADOR", "Recibe acelerador y Hall; alimenta al motor", C.azul, { smax: 20 });
  s += motor(1020, 340, 90, null, "BLDC") + text(1020, 232, "MOTOR EN RUEDA (sin escobillas)", { f: K.FT, s: 21, w: 700, a: "middle" });
  s += wire([[860, 280], [940, 300]], "Y", { w: 6, text: "U" }) + wire([[860, 340], [930, 340]], "G", { w: 6, text: "V" }) + wire([[860, 400], [940, 380]], "L", { w: 6, text: "W" });
  s += wire([[1020, 430], [1020, 560], [730, 560], [730, 500]], "W", { text: "Sensores Hall (5 V, tierra, Ha, Hb, Hc)", at: 1, t: 0.3, w: 4 });
  s += `<rect x="520" y="640" width="200" height="90" rx="12" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + text(620, 692, "ACELERADOR", { f: K.FT, s: 22, w: 700, a: "middle" });
  s += wire([[620, 640], [620, 500]], "G/W", { text: "5 V · tierra · señal", w: 4 });
  s += `<rect x="60" y="600" width="230" height="110" rx="12" fill="#F7F8FA" stroke="${C.verde}" stroke-width="3"/>` + text(175, 645, "CONVERTIDOR DC-DC", { f: K.FT, s: 22, w: 700, a: "middle" }) + text(175, 678, "60 V → 12 V", { f: K.FM, s: 17, w: 600, a: "middle", c: C.azul });
  s += wire([[175, 480], [175, 600]], "R", { w: 5, label: false });
  s += wire([[290, 680], [400, 680], [400, 820]], "R", { text: "12 V", w: 5, at: 0 });
  s += lamp(400, 850, 26, "Luces, claxon, tablero");
  s += `<rect x="60" y="780" width="200" height="70" rx="10" fill="#EEF0F2" stroke="${C.carbon}" stroke-width="3"/>` + text(160, 822, "PUERTO DE CARGA", { f: K.FT, s: 20, w: 700, a: "middle" });
  s += wire([[160, 780], [160, 760], [45, 760], [45, 500], [90, 500], [90, 480]], "O", { text: "Carga", w: 5, at: 1 });
  s += tp(210, 160, "P1") + tp(700, 610, "P2") + tp(880, 600, "P3") + tp(330, 590, "P4");
  return s;
};

D.accesorio = () => {
  let s = battery(60, 520);
  const b = BAT(60, 520);
  s += wire([b.pos, [95, 300], [180, 300]], "R", { w: 6, label: false });
  s += fuse(210, 300, "15 A");
  s += text(210, 350, "≤ 20 cm de la batería", { s: 15, w: 700, a: "middle", c: C.rojo });
  s += wire([[240, 300], [560, 300]], "R", { w: 6, text: "Arnés dedicado" });
  s += comp(560, 220, 200, 300, "RELEVADOR", "Accesorio", C.amarillo);
  s += pin(560, 300, "30", "left") + pin(560, 450, "86", "left") + pin(760, 300, "87", "right") + pin(760, 450, "85", "right");
  s += wire([[766, 300], [900, 300]], "R", { w: 6, label: false });
  s += lamp(940, 300, 40, "FARO AUXILIAR / USB");
  s += wire([[980, 300], [1100, 300], [1100, 420]], "B", { w: 6, label: false }) + ground(1100, 420, "Tierra sólida");
  s += wire([[766, 450], [830, 450], [830, 540]], "G", { label: false, w: 4 }) + ground(830, 540);
  s += `<rect x="150" y="640" width="250" height="80" rx="12" fill="#F7F8FA" stroke="${C.azul}" stroke-width="3"/>` + mtext(275, 672, "POSITIVO DE LLAVE (circuito con fusible)", 20, { f: K.FT, s: 19, w: 700, a: "middle", lh: 21 });
  s += wire([[400, 680], [470, 680]], "B", { label: false, w: 4 });
  s += sw(470, 680, "Interruptor del accesorio (opcional)", { below: true, max: 20 });
  s += wire([[540, 680], [554, 680], [554, 450]], "B/Y", { text: "Control", w: 4, at: 1 });
  s += wire([b.neg, [175, 470], [255, 470], [255, 520]], "G", { label: false }) + ground(255, 520);
  s += tp(210, 255, "F") + tp(500, 450, "P1") + tp(130, 610, "P2");
  s += `<rect x="620" y="760" width="520" height="110" rx="12" fill="#FDECEC" stroke="${C.rojo}" stroke-width="2.5"/>` + mtext(880, 795, "Evita empalmes rápidos de presión y conexiones a positivo directo sin relevador: causan fallas intermitentes y descargas.", 46, { s: 17, w: 600, a: "middle", lh: 22, c: C.rojo });
  return s;
};

module.exports = D;
