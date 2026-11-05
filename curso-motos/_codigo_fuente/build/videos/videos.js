// Animaciones de video: HTML + CSS con motor de línea de tiempo determinista seek(t) → cuadros 30 fps (Playwright) → MP4 (ffmpeg)
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const R = require("../lib/render");
const V = require("../ads/visuales");
const S = require("../lib/curso");
const P = require("../../data/publicidad");
const { cfg: C } = S;
const OUT = path.join(S.ROOT, "08_Animaciones");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function reporte() {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg"><rect x="170" y="20" width="460" height="520" rx="16" fill="#fff"/><rect x="170" y="20" width="460" height="80" rx="16" fill="#1E2227"/><text x="400" y="72" text-anchor="middle" font-family="'Barlow Condensed'" font-size="34" font-weight="800" fill="#FFC20E">REPORTE DE DIAGNÓSTICO</text>
  ${[["Batería", "g", "12.7 V"], ["Carga 5,000 rpm", "r", "12.4 V"], ["Conector", "r", "Derretido"], ["Tierra regulador", "y", "0.31 V"], ["Luces", "g", "OK"]].map(([t, c, v], i) => `<circle cx="215" cy="${150 + i * 72}" r="18" fill="${{ g: "#2FB344", y: "#FFC20E", r: "#E5484D" }[c]}"/><text x="250" y="${160 + i * 72}" font-family="'Barlow'" font-size="28" font-weight="600" fill="#1E2227">${t}</text><text x="600" y="${160 + i * 72}" text-anchor="end" font-family="'IBM Plex Mono'" font-size="26" font-weight="700" fill="#1E2227">${v}</text>`).join("")}
  <rect x="200" y="500" width="400" height="6" fill="#FFC20E"/></svg>`;
}
function menu3() {
  const col = [["BÁSICO", "Regulador", "$1,060"], ["RECOMENDADO", "Regulador + conector + tierra", "$1,460"], ["PREMIUM", "Serie + tierra dedicada + revisión", "$2,950"]];
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">${col.map(([t, d, p], i) => { const x = 30 + i * 255, hi = i === 1; return `<rect x="${x}" y="${hi ? 40 : 80}" width="235" height="${hi ? 440 : 400}" rx="18" fill="${hi ? "#FFC20E" : "#1E2227"}" stroke="#4A525B" stroke-width="3"/><text x="${x + 117}" y="${hi ? 100 : 140}" text-anchor="middle" font-family="'Barlow Condensed'" font-size="34" font-weight="800" fill="${hi ? "#1E2227" : "#fff"}">${t}</text>
    <foreignObject x="${x + 15}" y="${hi ? 130 : 170}" width="205" height="160"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 24px Barlow;color:${hi ? "#1E2227" : "#D7DBE0"};text-align:center">${d}</div></foreignObject>
    <text x="${x + 117}" y="${hi ? 400 : 420}" text-anchor="middle" font-family="'IBM Plex Mono'" font-size="40" font-weight="700" fill="${hi ? "#1E2227" : "#FFC20E"}">${p}</text>`; }).join("")}
    <text x="400" y="545" text-anchor="middle" font-family="'IBM Plex Mono'" font-size="20" fill="#AEB4BB">Ejemplo ilustrativo · calculadora del curso</text></svg>`;
}
function calendario() {
  return `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg"><rect x="120" y="40" width="560" height="440" rx="18" fill="#1E2227" stroke="#4A525B" stroke-width="3"/><text x="400" y="100" text-anchor="middle" font-family="'Barlow Condensed'" font-size="40" font-weight="800" fill="#FFC20E">PLAN PREVENTIVO MENSUAL</text>
  ${Array.from({ length: 4 }, (_, i) => `<rect x="160" y="${130 + i * 82}" width="480" height="64" rx="10" fill="#2B3036"/><text x="185" y="${172 + i * 82}" font-family="'Barlow'" font-size="28" font-weight="600" fill="#fff">Mes ${i + 1} · revisión con semáforo</text><circle cx="605" cy="${162 + i * 82}" r="18" fill="#2FB344"/>`).join("")}
  <text x="400" y="530" text-anchor="middle" font-family="'IBM Plex Mono'" font-size="22" fill="#AEB4BB">Repartidores y flotillas · prioridad y precio fijo</text></svg>`;
}
const VIS = {
  multiRojo: () => V.multimetro("12.4 V", "5,000 RPM · NO CARGA", "r"), multiVerde: () => V.multimetro("14.2 V", "5,000 RPM · OK", "g"), bateria: () => V.bateria("12.6 V"),
  fases: () => V.scope("rizo", "CH1 · VAC ENTRE FASES · PAREJAS"), rizoMalo: () => V.scope("rizoMalo", "CH1 · RIZO · HUECO = DIODO ABIERTO"), rizo: () => V.scope("rizo", "CH1 · RIZO DE CARGA · SANO"),
  parque: () => V.parque(), reporte, menu3, calendario, telefono: () => V.telefono(),
};
// Guion visual por video: escenas [inicio, fin, eyebrow, texto principal (HTML), visual, valores[]]
const PLAN = {
  V1: [[0, 3, "¿TE PASÓ ESTO?", "Cambiaste el regulador y <em>sigue sin cargar</em>", "multiRojo", []],
    [3, 10, "PRUEBA 1 · BATERÍA EN REPOSO", "Llena: <em class=n>12.6 V</em> o más", "bateria", [["≥ 12.6 V", "convencional"], ["12.8–13.0 V", "AGM"]]],
    [10, 17, "PRUEBA 2 · CARGA A 5,000 RPM", "Debe subir a <em class=n>13.5–14.8 V</em>", "multiVerde", [["< 13.5 V", "no carga"], ["> 15 V", "sobrecarga"]]],
    [17, 24, "PRUEBA 3 · ESTATOR", "Fases <em>parejas</em> y nada a tierra", "fases", [["0.1–1.0 Ω", "entre fases (ej.)"], ["OL", "fase a tierra"]]],
    [24, 28, "APRENDE EL MÉTODO COMPLETO", "Mide antes de <em>cambiar piezas</em>", "telefono", [["12", "clases en vivo"], ["$1,799", "MXN"]]]],
  V2: [[0, 3, "OPORTUNIDAD", "Más motos, <em>pocos que las miden</em>", "parque", []],
    [3, 10, "IDEA 1", "Cobra el diagnóstico <em>con evidencia</em>", "reporte", [["Fotos", "de cada medición"], ["Semáforo", "fácil de entender"]]],
    [10, 17, "IDEA 2", "Ofrece un <em>menú de 3 opciones</em>", "menu3", [["3", "opciones"], ["Centro", "la más elegida"]]],
    [17, 24, "IDEA 3", "Plan <em>preventivo mensual</em>", "calendario", [["Mensual", "para repartidores"], ["Fijo", "precio claro"]]],
    [24, 28, "SIN PROMESAS, CON MÉTODO", "Diagnostica y <em>cobra mejor</em>", "telefono", [["12", "clases en vivo"], ["$1,799", "MXN"]]]],
  V3: [[0, 3, "SISTEMA DE CARGA", "No carga: <em>4 pruebas</em>", "rizoMalo", []],
    [3, 9, "PRUEBA 1", "Batería <em>cargada y sana</em>", "bateria", [["≥ 12.6 V", "en reposo"], ["≈ 9.5–10 V", "mínimo al dar marcha"]]],
    [9, 15, "PRUEBA 2", "Carga a <em>5,000 rpm</em>", "multiVerde", [["13.5–14.8 V", "típico"], ["> 15 V", "sobrecarga"]]],
    [15, 21, "PRUEBA 3", "Estator <em>estático y dinámico</em>", "fases", [["Parejas", "fases en VAC"], ["OL", "fase a tierra"]]],
    [21, 26, "PRUEBA 4", "Regulador, <em>tierra y rizo</em>", "rizo", [["< 0.2 V", "caída en tierra"], ["Parejo", "rizo sano"]]],
    [26, 30, "LO PRACTICAMOS EN VIVO", "Aprende el <em>método completo</em>", "telefono", [["12", "clases en vivo"], ["$1,799", "MXN"]]]],
};
function geom(W, H) {
  if (H > W) return { pad: 80, stripe: 26, top: 270, eyeFs: 34, hookFs: 104, hookH: 440, visY: 740, visH: 560, valsY: 1320, valsH: 140, valFs: [52, 24], barY: 1490, barH: 180, barFs: [34, 36], badge: [880, 270, 130], progY: 250 };
  if (H === W) return { pad: 76, stripe: 24, top: 60, eyeFs: 30, hookFs: 84, hookH: 270, visY: 330, visH: 430, valsY: 770, valsH: 110, valFs: [42, 20], barY: 910, barH: 170, barFs: [32, 34], badge: [904, 56, 116], progY: 40 };
  return { land: true, pad: 90, stripe: 26, top: 80, eyeFs: 30, hookFs: 104, hookH: 420, visX: 980, visY: 200, visW: 800, visH: 560, valsY: 640, valsH: 130, valFs: [48, 22], barY: 900, barH: 180, barFs: [38, 40], badge: [1760, 60, 120], progY: 60 };
}
function videoHtml(v) {
  const g = geom(v.w, v.h), W = v.w, H = v.h, plan = PLAN[v.id];
  const hookW = g.land ? 820 : W - g.pad - 260;
  let scenes = plan.map((s, i) => {
    const [a, b, eye, hook, vis, vals] = s;
    const visBox = g.land ? `left:${g.visX}px;top:${g.visY}px;width:${g.visW}px;height:${g.visH}px` : `left:${g.pad}px;top:${g.visY}px;width:${W - g.pad * 2}px;height:${g.visH}px`;
    const valsBox = g.land ? `left:${g.pad}px;top:${g.valsY}px;width:${820}px;height:${g.valsH}px` : `left:${g.pad}px;top:${g.valsY}px;width:${W - g.pad * 2}px;height:${g.valsH}px`;
    return `<div class="scene" id="s${i}" data-a="${a}" data-b="${b}">
      <div class="head" style="left:${g.pad}px;top:${g.top}px;width:${hookW}px;height:${g.hookH}px"><div class="eye" style="font-size:${g.eyeFs}px">${esc(eye)}</div><div class="hook" style="font-size:${g.hookFs}px">${hook}</div></div>
      <div class="vis" style="${visBox}">${VIS[vis]()}</div>
      ${vals.length ? `<div class="vals" style="${valsBox}">${vals.map(([x, y]) => `<div class="val"><b style="font-size:${g.valFs[0]}px">${esc(x)}</b><span style="font-size:${g.valFs[1]}px">${esc(y)}</span></div>`).join("")}</div>` : ""}
    </div>`;
  }).join("");
  const [bx, by, bs] = g.badge;
  const steps = v.id === "V3" ? `<div class="steps" style="left:${g.pad}px;top:${g.valsY - 150}px">${["Batería", "Carga", "Estator", "Regulador"].map((t, i) => `<div class="st" id="st${i}"><i>${i + 1}</i>${t}</div>`).join("")}</div>` : "";
  return `<div class="stage" style="width:${W}px;height:${H}px">
    <div class="stripe" style="width:${g.stripe}px"></div>
    <div class="prog" style="left:${g.stripe + 20}px;right:20px;top:${g.progY}px"><i id="pb"></i></div>
    <div class="badge" style="left:${bx}px;top:${by}px;width:${bs}px;height:${bs}px;font-size:${Math.round(bs * 0.36)}px;border-width:${Math.round(bs / 20)}px">E·S<small style="font-size:${Math.round(bs * 0.1)}px">ELECTRÓNICA</small><small style="font-size:${Math.round(bs * 0.1)}px">Y SERVICIO</small></div>
    ${scenes}${steps}
    <div class="bar" style="top:${g.barY}px;height:${g.barH}px;padding:0 ${Math.round(W * 0.05)}px 0 ${g.stripe + Math.round(W * 0.045)}px"><div class="t" style="font-size:${g.barFs[0]}px">Diagnóstico Eléctrico de Motos<br><b>12 clases en vivo · ${C.precioTexto}</b></div><div class="btn" id="cta" style="font-size:${g.barFs[1]}px">${esc(C.cta)}</div></div>
    <div class="ex" style="left:${g.stripe + 20}px;top:${g.barY - 34}px">Valores típicos · verifica con el manual del fabricante</div>
  </div>
  <script>
  var DUR = ${v.dur};
  function ease(x){ return x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3); }
  window.seek = function(t){
    document.getElementById("pb").style.width = (t / DUR * 100).toFixed(2) + "%";
    document.querySelectorAll(".scene").forEach(function(s){
      var a = +s.dataset.a, b = +s.dataset.b, last = b >= DUR;
      var inn = ease((t - a) / 0.35), out = last ? 1 : 1 - ease((t - (b - 0.3)) / 0.3);
      var o = Math.max(0, Math.min(inn, out)); if (t < a || t > b + 0.01) o = 0;
      s.style.opacity = o;
      var h = s.querySelector(".head"); h.style.transform = "translateY(" + ((1 - ease((t - a) / 0.45)) * 40).toFixed(1) + "px)";
      var vis = s.querySelector(".vis"); vis.style.transform = "scale(" + (0.94 + 0.06 * ease((t - a - 0.1) / 0.6)).toFixed(3) + ")";
      s.querySelectorAll(".val").forEach(function(v, i){ var k = ease((t - a - 0.5 - i * 0.25) / 0.4); v.style.opacity = k; v.style.transform = "translateY(" + ((1 - k) * 24).toFixed(1) + "px)"; });
    });
    var st = document.querySelectorAll(".st");
    st.forEach(function(e, i){ var on = t >= [3, 9, 15, 21][i]; e.className = "st" + (on ? " on" : ""); });
    var cta = document.getElementById("cta"); var pulse = t > DUR - 4 ? 1 + 0.04 * Math.sin((t - (DUR - 4)) * 6) : 1; cta.style.transform = "scale(" + pulse.toFixed(3) + ")";
  };
  window.seek(0);
  </script>`;
}
const CSS = (W, H) => `*{box-sizing:border-box;margin:0;padding:0}
.stage{position:relative;overflow:hidden;background:#2B3036;font-family:'Barlow',sans-serif;color:#fff;background-image:linear-gradient(rgba(255,255,255,.045) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.045) 2px,transparent 2px);background-size:40px 40px}
.stripe{position:absolute;left:0;top:0;bottom:0;background:#FFC20E}
.prog{position:absolute;height:8px;background:rgba(255,255,255,.12);border-radius:8px;overflow:hidden}.prog i{display:block;height:100%;width:0;background:#FFC20E}
.badge{position:absolute;border-radius:50%;background:#1E2227;border:solid #FFC20E;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Barlow Condensed';font-weight:800;color:#FFC20E;line-height:1;z-index:3}
.badge small{font-family:'IBM Plex Mono';font-weight:600;color:#EEF0F2}
.scene{position:absolute;inset:0;opacity:0}
.head{position:absolute;display:flex;flex-direction:column;gap:14px}
.eye{font-family:'IBM Plex Mono';font-weight:600;color:#FFC20E;letter-spacing:.08em}
.hook{font-family:'Barlow Condensed';font-weight:800;text-transform:uppercase;line-height:.98}
.hook em{font-style:normal;color:#FFC20E}.hook em.n{white-space:nowrap}
.vis{position:absolute;display:flex;align-items:center;justify-content:center;transform-origin:center}
.vis svg{width:100%;height:100%}
.vals{position:absolute;display:flex;gap:4%;justify-content:center}
.val{flex:1;background:#1E2227;border:2px solid #4A525B;border-radius:14px;display:flex;flex-direction:column;justify-content:center;align-items:center}
.val b{font-family:'IBM Plex Mono';font-weight:700;color:#FFC20E;line-height:1.1}
.val span{font-weight:600;color:#D7DBE0;text-transform:uppercase;letter-spacing:.04em}
.steps{position:absolute;display:flex;gap:16px}
.st{display:flex;align-items:center;gap:10px;font-family:'Barlow Condensed';font-weight:800;font-size:34px;text-transform:uppercase;color:#6B737C;background:#1E2227;border:2px solid #3A4047;border-radius:12px;padding:10px 16px}
.st i{font-style:normal;width:40px;height:40px;border-radius:50%;background:#3A4047;color:#1E2227;display:flex;align-items:center;justify-content:center}
.st.on{color:#fff;border-color:#FFC20E}.st.on i{background:#FFC20E}
.bar{position:absolute;left:0;right:0;background:#1E2227;border-top:6px solid #FFC20E;display:flex;align-items:center;justify-content:space-between;z-index:4}
.bar .t{font-family:'Barlow Condensed';font-weight:700;text-transform:uppercase;line-height:1.1;color:#EEF0F2}.bar .t b{color:#FFC20E}
.bar .btn{background:#FFC20E;color:#1E2227;font-family:'Barlow Condensed';font-weight:800;text-transform:uppercase;border-radius:12px;padding:18px 26px;white-space:nowrap}
.ex{position:absolute;font-family:'IBM Plex Mono';font-size:18px;color:#AEB4BB;z-index:4}`;

async function render(v, mode) {
  const html = R.page(videoHtml(v), CSS(v.w, v.h));
  const b = await R.getBrowser();
  const p = await b.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  const f = path.join(R.TMP, `video_${v.id}.html`); fs.writeFileSync(f, html);
  await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  const name = `${v.id}_${v.formato.replace(":", "x")}_${v.angulo}`;
  if (mode === "keys") {
    const keys = v.id === "V3" ? [1.5, 6, 12, 18, 23.5, 28.5] : [1.5, 6.5, 13.5, 20.5, 26, 27.6];
    for (const t of keys) { await p.evaluate((t) => window.seek(t), t); await p.screenshot({ path: path.join(R.TMP, `key_${v.id}_${t}.png`) }); }
    await p.close(); return keys.map((t) => path.join(R.TMP, `key_${v.id}_${t}.png`));
  }
  const fdir = path.join(R.TMP, "frames_" + v.id); fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir, { recursive: true });
  const N = v.dur * 30;
  for (let i = 0; i < N; i++) { await p.evaluate((t) => window.seek(t), i / 30); await p.screenshot({ path: path.join(fdir, `f_${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 }); }
  await p.evaluate((t) => window.seek(t), 2.0); fs.mkdirSync(OUT, { recursive: true });
  await p.screenshot({ path: path.join(OUT, `${name}_portada.png`) });
  await p.close();
  const mp4 = path.join(OUT, `${name}.mp4`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "30", "-i", path.join(fdir, "f_%04d.jpg"), "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000", "-t", String(v.dur), "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", mp4]);
  fs.rmSync(fdir, { recursive: true, force: true });
  // fuente HTML del video (reproducible)
  fs.mkdirSync(path.join(OUT, "fuentes"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "fuentes", `${name}.html`), html.replace(/url\(file:\/\/[^)]+\/([^/)]+\.ttf)\)/g, "url(../../_codigo_fuente/assets/fonts/$1)"));
  console.log("MP4:", mp4);
  return mp4;
}
(async () => {
  const mode = process.argv[2] || "all", only = process.argv[3];
  const outs = [];
  for (const v of P.videos) { if (only && v.id !== only) continue; outs.push(await render(v, mode)); }
  await R.close();
  if (mode === "keys") console.log(JSON.stringify(outs));
})();
