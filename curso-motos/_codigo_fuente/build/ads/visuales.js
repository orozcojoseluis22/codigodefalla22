// Visuales técnicos SVG para anuncios, carrusel, miniaturas y videos (dibujados, sin fotos)
const Y = "#FFC20E", R = "#E5484D", G = "#2FB344", B = "#2D7FF9", K = "#1E2227", GT = "#2B3036", L = "#EEF0F2";
const M = "'IBM Plex Mono',monospace", T = "'Barlow Condensed',sans-serif";
function sema(x, y, on, s = 1) {
  const c = (k) => (k === on ? { r: R, y: Y, g: G }[k] : "#3A4047");
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="54" height="150" rx="27" fill="${K}" stroke="#4A525B" stroke-width="3"/><circle cx="27" cy="27" r="17" fill="${c("r")}"/><circle cx="27" cy="75" r="17" fill="${c("y")}"/><circle cx="27" cy="123" r="17" fill="${c("g")}"/></g>`;
}
// Multímetro con puntas hacia una batería
function multimetro(value = "12.4 V", label = "5,000 RPM", on = "r") {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="40" width="300" height="470" rx="34" fill="${Y}" stroke="${K}" stroke-width="6"/>
  <rect x="70" y="80" width="240" height="120" rx="12" fill="#C9D6B0" stroke="${K}" stroke-width="5"/>
  <text x="190" y="158" text-anchor="middle" font-family="${M}" font-size="58" font-weight="700" fill="${on === "r" ? "#9E1C21" : "#1E2A12"}">${value}</text>
  <text x="190" y="190" text-anchor="middle" font-family="${M}" font-size="18" font-weight="600" fill="#1E2A12">${label}</text>
  <circle cx="190" cy="320" r="78" fill="${GT}" stroke="${K}" stroke-width="5"/><path d="M190 320 L230 270" stroke="${Y}" stroke-width="10" stroke-linecap="round"/>
  <text x="190" y="230" text-anchor="middle" font-family="${M}" font-size="20" font-weight="700" fill="${K}">V⎓</text>
  <circle cx="120" cy="450" r="20" fill="${K}"/><circle cx="260" cy="450" r="20" fill="${R}"/>
  <text x="120" y="495" text-anchor="middle" font-family="${M}" font-size="16" font-weight="700" fill="${K}">COM</text><text x="260" y="495" text-anchor="middle" font-family="${M}" font-size="16" font-weight="700" fill="${K}">V</text>
  <path d="M260 450 C 380 470, 430 300, 560 250" fill="none" stroke="${R}" stroke-width="10" stroke-linecap="round"/>
  <path d="M120 450 C 300 560, 520 420, 690 250" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/>
  <rect x="500" y="250" width="250" height="170" rx="14" fill="${GT}" stroke="#4A525B" stroke-width="5"/>
  <rect x="535" y="225" width="45" height="28" fill="#C9CED4" stroke="${K}" stroke-width="3"/><rect x="670" y="225" width="45" height="28" fill="#C9CED4" stroke="${K}" stroke-width="3"/>
  <text x="557" y="300" text-anchor="middle" font-family="${T}" font-size="44" font-weight="800" fill="${R}">+</text><text x="692" y="300" text-anchor="middle" font-family="${T}" font-size="44" font-weight="800" fill="#fff">−</text>
  <text x="625" y="380" text-anchor="middle" font-family="${T}" font-size="34" font-weight="800" fill="${Y}">BATERÍA 12 V</text>
  ${sema(700, 40, on, 0.9)}
</svg>`;
}
// Barras de parque vehicular de motos (INEGI)
function parque() {
  const bars = [["2024", 8.95], ["2025", 10.55]];
  const max = 12, h = 330;
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <line x1="90" y1="460" x2="760" y2="460" stroke="#AEB4BB" stroke-width="3"/>
  ${bars.map(([y, v], i) => { const bh = (v / max) * h, x = 170 + i * 300; return `<rect x="${x}" y="${460 - bh}" width="190" height="${bh}" rx="10" fill="${i ? Y : "#6B737C"}"/><text x="${x + 95}" y="${450 - bh}" text-anchor="middle" font-family="${M}" font-size="44" font-weight="700" fill="#fff">${v.toFixed(2)} M</text><text x="${x + 95}" y="505" text-anchor="middle" font-family="${M}" font-size="30" font-weight="600" fill="#D7DBE0">${y}</text>`; }).join("")}
  <text x="90" y="545" font-family="${M}" font-size="20" fill="#AEB4BB">Motos registradas en circulación · INEGI (vía prensa)</text>
  <g transform="translate(60 40)"><circle cx="40" cy="70" r="34" fill="none" stroke="${Y}" stroke-width="9"/><circle cx="190" cy="70" r="34" fill="none" stroke="${Y}" stroke-width="9"/><path d="M40 70 L95 20 L150 20 L190 70 M95 20 L120 70 L150 20" fill="none" stroke="${Y}" stroke-width="9" stroke-linejoin="round"/></g>
</svg>`;
}
// 4 pasos con semáforo
function pasos(labels = ["Batería", "Carga", "Estator", "Regulador"], vals = ["12.6 V", "14.2 V", "0.4 Ω", "OK"]) {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  ${labels.map((l, i) => { const y = 30 + i * 128; return `<rect x="40" y="${y}" width="720" height="108" rx="16" fill="${K}" stroke="#4A525B" stroke-width="3"/>
    <circle cx="100" cy="${y + 54}" r="34" fill="${Y}"/><text x="100" y="${y + 68}" text-anchor="middle" font-family="${T}" font-size="42" font-weight="800" fill="${K}">${i + 1}</text>
    <text x="160" y="${y + 70}" font-family="${T}" font-size="50" font-weight="800" fill="#fff">${l.toUpperCase()}</text>
    <text x="610" y="${y + 68}" text-anchor="end" font-family="${M}" font-size="36" font-weight="700" fill="${Y}">${vals[i]}</text>
    <circle cx="690" cy="${y + 54}" r="22" fill="${G}"/><path d="M679 ${y + 54} l8 9 l15 -18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`; }).join("")}
</svg>`;
}
// Pantalla de osciloscopio (ckp, rizo, rizoMalo, inyector)
function scope(tipo = "ckp", titulo = "") {
  let d = "", x = 0;
  if (tipo === "ckp") { const y0 = 200; d = `M0 ${y0}`; for (let k = 0; k < 3; k++) { for (let i = 0; i < 9; i++) { d += ` L${x + 9} ${y0 - 80} L${x + 18} ${y0 + 80} L${x + 27} ${y0}`; x += 27; } d += ` L${x + 40} ${y0}`; x += 40; } }
  if (tipo === "rizo" || tipo === "rizoMalo") { const y0 = 210; d = `M0 ${y0}`; for (let i = 0; i < 24; i++) { const amp = tipo === "rizoMalo" && i % 3 === 2 ? 90 : 40; d += ` Q${x + 15} ${y0 - amp} ${x + 32} ${y0 - (tipo === "rizoMalo" && i % 3 === 2 ? 0 : 10)}`; x += 32; } }
  if (tipo === "inyector") { d = "M0 110"; for (let k = 0; k < 2; k++) { d += ` L${x + 120} 110 L${x + 120} 320 L${x + 230} 320 L${x + 232} 40 L${x + 245} 110`; x += 245 + 120; } d += ` L800 110`; }
  const grid = Array.from({ length: 11 }, (_, i) => `<line x1="${i * 76}" y1="0" x2="${i * 76}" y2="420" stroke="#1F3A28" stroke-width="2"/>`).join("") + Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 70}" x2="760" y2="${i * 70}" stroke="#1F3A28" stroke-width="2"/>`).join("");
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="780" height="540" rx="26" fill="${GT}" stroke="#4A525B" stroke-width="4"/>
  <text x="40" y="58" font-family="${M}" font-size="22" font-weight="600" fill="#AEB4BB">${titulo || (tipo === "ckp" ? "CH1 · CKP · 2 V/div" : tipo === "inyector" ? "CH1 · INYECTOR · x10" : "CH1 · RIZO DE CARGA · AC 200 mV/div")}</text>
  <g transform="translate(20 80)"><rect width="760" height="420" rx="12" fill="#0B1A12"/>${grid}<path d="${d}" fill="none" stroke="#5CFF8A" stroke-width="5" stroke-linejoin="round"/></g>
  ${tipo === "rizoMalo" ? `<circle cx="${20 + 32 * 2.5 + 0}" cy="250" r="0" fill="none"/>` : ""}
</svg>`;
}
// Celular con el árbol de diagnóstico
function telefono() {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <rect x="250" y="10" width="300" height="540" rx="40" fill="${K}" stroke="#4A525B" stroke-width="6"/>
  <rect x="268" y="40" width="264" height="480" rx="20" fill="#F2F3F5"/>
  <rect x="268" y="40" width="264" height="80" rx="20" fill="${GT}"/><text x="400" y="88" text-anchor="middle" font-family="${T}" font-size="26" font-weight="800" fill="${Y}">ÁRBOL DE DIAGNÓSTICO</text>
  <rect x="288" y="140" width="224" height="16" rx="8" fill="#D8DCE1"/><rect x="288" y="140" width="130" height="16" rx="8" fill="${Y}"/>
  <text x="290" y="200" font-family="${T}" font-size="26" font-weight="800" fill="${K}">¿A 5,000 RPM SUBE</text><text x="290" y="230" font-family="${T}" font-size="26" font-weight="800" fill="${K}">A 13.5–14.8 V?</text>
  <rect x="288" y="255" width="224" height="40" rx="8" fill="#FFF4CC"/><text x="300" y="282" font-family="${M}" font-size="18" font-weight="700" fill="${K}">ESPERADO 13.5–14.8 V</text>
  <rect x="288" y="315" width="105" height="56" rx="10" fill="${G}"/><text x="340" y="352" text-anchor="middle" font-family="${T}" font-size="28" font-weight="800" fill="#fff">SÍ</text>
  <rect x="407" y="315" width="105" height="56" rx="10" fill="${R}"/><text x="460" y="352" text-anchor="middle" font-family="${T}" font-size="28" font-weight="800" fill="#fff">NO</text>
  <rect x="288" y="395" width="224" height="105" rx="12" fill="#fff" stroke="${K}" stroke-width="3"/>
  <circle cx="318" cy="430" r="12" fill="#3A4047"/><circle cx="348" cy="430" r="12" fill="${Y}"/><circle cx="378" cy="430" r="12" fill="#3A4047"/>
  <text x="300" y="470" font-family="${M}" font-size="15" font-weight="700" fill="${K}">RESULTADO + 3 PASOS</text><text x="300" y="490" font-family="${M}" font-size="15" fill="#525A63">Clase que lo resuelve</text>
  <g transform="translate(40 120)">${multimetroMini()}</g><g transform="translate(600 200)">${sema(0, 0, "y", 1.1)}</g>
</svg>`;
}
function multimetroMini() {
  return `<rect x="0" y="0" width="170" height="250" rx="22" fill="${Y}" stroke="${K}" stroke-width="5"/><rect x="18" y="22" width="134" height="70" rx="8" fill="#C9D6B0" stroke="${K}" stroke-width="4"/><text x="85" y="72" text-anchor="middle" font-family="${M}" font-size="34" font-weight="700" fill="#1E2A12">14.2</text><circle cx="85" cy="165" r="48" fill="${GT}" stroke="${K}" stroke-width="4"/><path d="M85 165 L110 135" stroke="${Y}" stroke-width="7" stroke-linecap="round"/>`;
}
function bateria(v = "12.6 V") {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg"><rect x="170" y="150" width="460" height="300" rx="24" fill="${GT}" stroke="#4A525B" stroke-width="6"/><rect x="230" y="110" width="80" height="44" fill="#C9CED4" stroke="${K}" stroke-width="4"/><rect x="490" y="110" width="80" height="44" fill="#C9CED4" stroke="${K}" stroke-width="4"/><text x="270" y="220" text-anchor="middle" font-family="${T}" font-size="70" font-weight="800" fill="${R}">+</text><text x="530" y="220" text-anchor="middle" font-family="${T}" font-size="70" font-weight="800" fill="#fff">−</text><rect x="250" y="270" width="300" height="110" rx="12" fill="#C9D6B0" stroke="${K}" stroke-width="5"/><text x="400" y="350" text-anchor="middle" font-family="${M}" font-size="64" font-weight="700" fill="#1E2A12">${v}</text></svg>`;
}
function caida() {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="300" width="220" height="150" rx="16" fill="${GT}" stroke="#4A525B" stroke-width="5"/><text x="170" y="395" text-anchor="middle" font-family="${T}" font-size="38" font-weight="800" fill="${Y}">BATERÍA</text>
  <rect x="440" y="380" width="320" height="110" rx="14" fill="#6B737C"/><text x="600" y="448" text-anchor="middle" font-family="${T}" font-size="38" font-weight="800" fill="#fff">BLOQUE</text>
  <path d="M230 300 L230 230 L330 230 L330 435 L440 435" fill="none" stroke="#111" stroke-width="18" stroke-linejoin="round"/>
  <circle cx="420" cy="140" r="80" fill="#fff" stroke="${B}" stroke-width="8"/><text x="420" y="168" text-anchor="middle" font-family="${T}" font-size="80" font-weight="800" fill="${B}">V</text>
  <path d="M340 140 L230 140 L230 300" fill="none" stroke="${B}" stroke-width="5" stroke-dasharray="14 10"/><path d="M500 140 L640 140 L640 380" fill="none" stroke="${B}" stroke-width="5" stroke-dasharray="14 10"/>
  <rect x="520" y="40" width="230" height="70" rx="12" fill="${R}"/><text x="635" y="88" text-anchor="middle" font-family="${M}" font-size="40" font-weight="700" fill="#fff">0.62 V</text></svg>`;
}
function pulsador() { return scope("ckp", "CH1 · PULSADOR · PICO 1.8 V"); }
function parasito() {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="250" width="240" height="160" rx="16" fill="${GT}" stroke="#4A525B" stroke-width="5"/><text x="180" y="345" text-anchor="middle" font-family="${T}" font-size="38" font-weight="800" fill="${Y}">BATERÍA</text>
  <path d="M250 250 L250 170 L400 170" fill="none" stroke="#111" stroke-width="14"/><circle cx="470" cy="170" r="70" fill="#fff" stroke="${B}" stroke-width="8"/><text x="470" y="200" text-anchor="middle" font-family="${T}" font-size="80" font-weight="800" fill="${B}">A</text>
  <path d="M540 170 L700 170 L700 420" fill="none" stroke="#111" stroke-width="14"/><path d="M670 420 L730 420 M682 436 L718 436 M694 452 L706 452" stroke="#fff" stroke-width="6"/>
  <rect x="380" y="300" width="250" height="90" rx="12" fill="#C9D6B0" stroke="${K}" stroke-width="5"/><text x="505" y="365" text-anchor="middle" font-family="${M}" font-size="54" font-weight="700" fill="#1E2A12">38 mA</text></svg>`;
}
module.exports = { multimetro, parque, pasos, scope, telefono, bateria, caida, pulsador, parasito, sema };
