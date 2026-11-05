// Imágenes publicitarias PNG al tamaño exacto (HTML/CSS → Playwright). Formato de anuncio vertical de Electrónica y Servicio.
const fs = require("fs"), path = require("path");
const R = require("../lib/render");
const V = require("./visuales");
const S = require("../lib/curso");
const P = require("../../data/publicidad");
const { cfg: C } = S;
const OUT = path.join(S.ROOT, "09_Imagenes_Publicitarias");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const baseCss = (W, H) => `
*{box-sizing:border-box;margin:0;padding:0}
.ad{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#2B3036;font-family:'Barlow',sans-serif;color:#fff;
 background-image:linear-gradient(rgba(255,255,255,.045) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.045) 2px,transparent 2px);background-size:${Math.round(W / 27)}px ${Math.round(W / 27)}px}
.stripe{position:absolute;left:0;top:0;bottom:0;background:#FFC20E}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-weight:600;color:#FFC20E;letter-spacing:.08em}
.hook{font-family:'Barlow Condensed',sans-serif;font-weight:800;text-transform:uppercase;line-height:.98;letter-spacing:.005em}
.hook em{font-style:normal;color:#FFC20E}
.badge{position:absolute;border-radius:50%;background:#1E2227;border:solid #FFC20E;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#FFC20E;line-height:1}
.badge small{font-family:'IBM Plex Mono',monospace;font-weight:600;color:#EEF0F2;letter-spacing:.06em}
.visual{position:absolute;display:flex;align-items:center;justify-content:center}
.visual svg{width:100%;height:100%}
.vals{position:absolute;display:flex;justify-content:center;gap:4%}
.val{background:#1E2227;border:2px solid #4A525B;border-radius:14px;text-align:center;display:flex;flex-direction:column;justify-content:center}
.val b{font-family:'IBM Plex Mono',monospace;font-weight:700;color:#FFC20E;line-height:1.05}
.val span{font-family:'Barlow',sans-serif;font-weight:600;color:#D7DBE0;text-transform:uppercase;letter-spacing:.04em}
.cta{position:absolute;left:0;right:0;background:#1E2227;display:flex;align-items:center;justify-content:space-between;border-top:solid #FFC20E}
.cta .t{font-family:'Barlow Condensed',sans-serif;font-weight:700;text-transform:uppercase;color:#EEF0F2;line-height:1.05}
.cta .t b{color:#FFC20E}
.cta .btn{background:#FFC20E;color:#1E2227;font-family:'Barlow Condensed',sans-serif;font-weight:800;text-transform:uppercase;border-radius:12px;white-space:nowrap;display:flex;align-items:center}
.tag{font-family:'IBM Plex Mono',monospace;font-weight:600;color:#1E2227;background:#FFC20E;border-radius:8px;display:inline-block}
.note{position:absolute;font-family:'IBM Plex Mono',monospace;color:#AEB4BB}
`;
// Geometría por formato: [x,y,w,h] en px
function geo(W, H) {
  if (W === 1080 && H === 1350) return { u: 1, stripe: 26, head: [80, 80, 720, 380], eyeFs: 30, hookFs: 88, badge: [880, 70, 130], vis: [90, 470, 900, 560], vals: [90, 1030, 900, 110], valFs: [46, 22], cta: [1185, 165], ctaFs: [32, 34] };
  if (W === 1080 && H === 1920) return { u: 1, stripe: 26, head: [80, 260, 720, 460], eyeFs: 32, hookFs: 98, badge: [880, 260, 130], vis: [90, 760, 900, 560], vals: [90, 1330, 900, 120], valFs: [50, 24], cta: [1500, 170], ctaFs: [32, 36] };
  if (W === 1080 && H === 1080) return { u: 1, stripe: 24, head: [76, 56, 760, 300], eyeFs: 28, hookFs: 80, badge: [900, 56, 116], vis: [150, 340, 780, 440], vals: [90, 780, 900, 105], valFs: [42, 20], cta: [930, 150], ctaFs: [30, 32] };
  if (W === 1200 && (H === 628 || H === 630)) return { u: 1, land: true, stripe: 20, head: [64, 44, 600, 300], eyeFs: 22, hookFs: 64, badge: [1075, 30, 96], vis: [650, 140, 520, 370], vals: [64, 360, 560, 100], valFs: [34, 16], cta: [H - 104, 104], ctaFs: [26, 28] };
  if (W === 1280 && H === 720) return { u: 1, land: true, stripe: 22, head: [70, 60, 640, 420], eyeFs: 26, hookFs: 96, badge: [1150, 30, 100], vis: [690, 150, 560, 400], vals: [70, 470, 600, 100], valFs: [36, 16], cta: [H - 110, 110], ctaFs: [28, 30] };
  throw new Error("formato no soportado " + W + "x" + H);
}
function adHtml({ W, H, eyebrow, hook, visual, vals = [], ctaLeft, ctaBtn, note, extra = "" }) {
  const g = geo(W, H);
  const [hx, hy, hw, hh] = g.head, [vx, vy, vw, vh] = g.vis, [bx, by, bs] = g.badge, [cy, ch] = g.cta;
  let s = `<div class="ad"><div class="stripe" style="width:${g.stripe}px"></div>`;
  s += `<div style="position:absolute;left:${hx}px;top:${hy}px;width:${hw}px;height:${hh}px;display:flex;flex-direction:column;justify-content:flex-start;gap:${Math.round(g.eyeFs * 0.6)}px">${eyebrow ? `<div class="eyebrow" style="font-size:${g.eyeFs}px">${esc(eyebrow)}</div>` : ""}<div class="hook" style="font-size:${g.hookFs}px">${hook}</div></div>`;
  s += `<div class="badge" style="left:${bx}px;top:${by}px;width:${bs}px;height:${bs}px;border-width:${Math.round(bs / 20)}px;font-size:${Math.round(bs * 0.36)}px">E·S<small style="font-size:${Math.round(bs * 0.1)}px;margin-top:${Math.round(bs * 0.05)}px">ELECTRÓNICA</small><small style="font-size:${Math.round(bs * 0.1)}px">Y SERVICIO</small></div>`;
  s += `<div class="visual" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px">${visual}</div>`;
  if (vals.length) { const [ax, ay, aw, ah] = g.vals; s += `<div class="vals" style="left:${ax}px;top:${ay}px;width:${aw}px;height:${ah}px">${vals.map(([b, t]) => `<div class="val" style="width:${Math.floor(46)}%;padding:${Math.round(ah * 0.08)}px"><b style="font-size:${g.valFs[0]}px">${esc(b)}</b><span style="font-size:${g.valFs[1]}px">${esc(t)}</span></div>`).join("")}</div>`; }
  if (note) s += `<div class="note" style="left:${hx}px;top:${cy - 30}px;font-size:${Math.max(14, Math.round(g.eyeFs * 0.55))}px">${esc(note)}</div>`;
  s += `<div class="cta" style="top:${cy}px;height:${ch}px;border-top-width:${Math.round(g.stripe / 4)}px;padding:0 ${Math.round(W * 0.055)}px 0 ${g.stripe + Math.round(W * 0.05)}px"><div class="t" style="font-size:${g.ctaFs[0]}px">${ctaLeft || `Curso en vivo · <b>${C.precioTexto}</b>`}</div><div class="btn" style="font-size:${g.ctaFs[1]}px;padding:${Math.round(ch * 0.16)}px ${Math.round(W * 0.03)}px">${esc(ctaBtn || C.cta)}</div></div>`;
  return s + extra + "</div>";
}
const SIZES = [[1080, 1350, "1080x1350"], [1080, 1920, "1080x1920"], [1080, 1080, "1080x1080"], [1200, 628, "1200x628"]];
const VIS = { multimetro: () => V.multimetro("12.4 V", "5,000 RPM · NO CARGA", "r"), parque: () => V.parque(), pasos: () => V.pasos() };
const jobs = [];
// Juego A
for (const a of P.anuncios) for (const [W, H, tag] of SIZES) {
  const hook = a.gancho.replace(/sin cargar/, "<em>sin cargar</em>").replace(/medirlas/, "<em>medirlas</em>").replace(/^4 pruebas/, "<em>4 pruebas</em>");
  jobs.push([path.join(OUT, "A_Anuncios", `${a.id}_${a.angulo}_${tag}.png`), W, H, adHtml({ W, H, eyebrow: a.eyebrow, hook, visual: VIS[a.visual](), vals: a.valores, note: a.id === "A2" ? "" : "Valores típicos · verifica con el manual" })]);
}
// Juego B · carrusel
const tipVis = { 1: () => V.bateria("12.6 V"), 2: () => V.multimetro("14.2 V", "5,000 RPM · OK", "g"), 3: () => V.caida(), 4: () => V.pulsador(), 5: () => V.parasito() };
P.carrusel.forEach((c, i) => {
  const W = 1080, H = 1350, n = i + 1;
  let html;
  if (c.tipo === "portada") html = adHtml({ W, H, eyebrow: "GUÁRDALO · 1/7", hook: c.gancho.replace(/5 pruebas/, "<em>5 pruebas</em>"), visual: V.scope("ckp"), vals: [["5", "pruebas con valores"], ["→", "desliza"]], ctaLeft: "Curso Diagnóstico <b>Eléctrico de Motos</b>" });
  else if (c.tipo === "cierre") html = adHtml({ W, H, eyebrow: "7/7 · SIGUIENTE PASO", hook: "Aprende el <em>método completo</em>", visual: V.telefono(), vals: [["12", "clases en vivo"], ["Gratis", "árbol de diagnóstico"]] });
  else html = adHtml({ W, H, eyebrow: `PRUEBA ${c.n} · ${n}/7 · CLASE ${c.clase}`, hook: esc(c.titulo), visual: tipVis[c.n](), vals: [[c.dato, "valor típico"]], ctaLeft: "Curso Diagnóstico <b>Eléctrico de Motos</b>",
    extra: `<div style="position:absolute;left:80px;top:300px;width:900px;font-size:36px;font-weight:600;color:#D7DBE0;line-height:1.3">${esc(c.texto)}</div>` });
  jobs.push([path.join(OUT, "B_Carrusel", `B${n}_${c.tipo}${c.n ? "_" + c.n : ""}_1080x1350.png`), W, H, html]);
});
// Juego C · lead magnet
for (const [W, H, tag] of [[1080, 1350, "1080x1350"], [1080, 1920, "1080x1920"], [1200, 628, "1200x628"]]) {
  jobs.push([path.join(OUT, "C_Lead_Magnet", `C_arbol_diagnostico_${tag}.png`), W, H, adHtml({ W, H, eyebrow: "HERRAMIENTA GRATIS · SIN REGISTRO", hook: "¿No carga, no arranca o <em>se descarga</em>?", visual: V.telefono(), vals: [["10 min", "encuentra la falla"], ["6", "fallas frecuentes"]], ctaLeft: "Árbol de diagnóstico · <b>gratis</b>", ctaBtn: "Enlace en la bio" })]);
}
// Juego D · miniatura YouTube y og-imagen
jobs.push([path.join(OUT, "D_YouTube_y_OG", "D_miniatura_youtube_1280x720.png"), 1280, 720, adHtml({ W: 1280, H: 720, eyebrow: "SISTEMA DE CARGA", hook: "No carga: <em>4 pruebas</em>", visual: V.scope("rizoMalo", "CH1 · RIZO · DIODO ABIERTO"), vals: [["13.5–14.8 V", "carga típica"], ["OL", "fase a tierra"]] })]);
jobs.push([path.join(OUT, "D_YouTube_y_OG", "og-imagen_1200x630.jpg"), 1200, 630, adHtml({ W: 1200, H: 630, eyebrow: "CURSO EN VIVO · 12 CLASES", hook: "Diagnóstico <em>eléctrico</em> de motos", visual: V.multimetro("14.2 V", "5,000 RPM · OK", "g"), vals: [["18 h", "práctica guiada"], ["$1,799", "MXN"]] })]);
jobs.push([path.join(OUT, "D_YouTube_y_OG", "og-lead-magnet_1200x628.jpg"), 1200, 628, adHtml({ W: 1200, H: 628, eyebrow: "GRATIS · SIN REGISTRO", hook: "Árbol de <em>diagnóstico</em> eléctrico", visual: V.telefono(), vals: [["10 min", "encuentra la falla"], ["6", "síntomas"]], ctaLeft: "Para mecánicos de <b>motos</b>", ctaBtn: "Pruébalo gratis" })]);

if (require.main === module) (async () => {
  const only = process.argv[2];
  for (const [file, W, H, html] of jobs) {
    if (only && !file.includes(only)) continue;
    await R.shot(R.page(html, baseCss(W, H)), file, W, H);
    console.log("ok", path.relative(OUT, file));
  }
  await R.close();
  // copias para landing y lead magnet
  fs.copyFileSync(path.join(OUT, "D_YouTube_y_OG", "og-imagen_1200x630.jpg"), path.join(S.ROOT, "06_Landing_Page", "og-imagen.jpg"));
  fs.copyFileSync(path.join(OUT, "D_YouTube_y_OG", "og-lead-magnet_1200x628.jpg"), path.join(S.ROOT, "07_Lead_Magnet", "og-lead-magnet.jpg"));
})();
module.exports = { adHtml, baseCss };
