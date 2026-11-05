// Lead magnet: Árbol de Diagnóstico Eléctrico para Mecánicos de Motos (HTML único) desde la fuente única
const fs = require("fs"), path = require("path");
const S = require("../lib/curso");
const AR = require("../../data/arboles");
const { cfg: C, clases } = S;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const NOMBRE = "Árbol de Diagnóstico Eléctrico para Mecánicos de Motos";
const PROMESA = "Encuentra por qué una moto no carga, no arranca o se descarga en 10 minutos";
// profundidad máxima por árbol (para la barra de progreso)
function depth(t, id, seen = 0) { if (id.startsWith("F:")) return seen; const n = t.nodos[id]; return Math.max(depth(t, n.si, seen + 1), depth(t, n.no, seen + 1)); }
const TREES = AR.map((t) => ({ ...t, max: depth(t, t.inicio) }));
const CLS = clases.map((c) => ({ n: c.n, t: c.titulo }));
const FAQ = [
  { q: "¿Es gratis de verdad?", a: "Sí. No pide registro. Solo si quieres recibir tus resultados por WhatsApp te pedimos nombre y número, con tu consentimiento." },
  { q: "¿Qué herramienta necesito?", a: "Un multímetro digital. En algunos pasos ayuda una pinza amperimétrica, un adaptador de voltaje pico o un escáner; si no los tienes, el árbol te dice qué medir." },
  { q: "¿Los valores sirven para cualquier moto?", a: "Son valores típicos de referencia tomados de manuales de servicio. Verifica siempre con el manual del modelo exacto." },
  { q: "¿Qué hago con el resultado?", a: "Aplica las 3 recomendaciones, documenta con foto y, si quieres dominar el método completo, revisa la clase del curso que lo resuelve." },
];
const CONFIG = `<script>
/* ===================== CONFIG · edita solo este bloque ===================== */
window.CONFIG = {
  whatsapp: "${C.whatsapp}",           // 52 + 10 dígitos del taller/escuela (por confirmar)
  enlaceCurso: "${C.landingUrl}",      // landing del curso
  precio: ${C.precio},                 // MXN
  webhookUrl: ""                       // opcional: webhook entrante (ej. GoHighLevel). Si está vacío o falla, se usa WhatsApp
};
/* ========================================================================== */
</script>`;
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">`;
const jsonld = JSON.stringify([
  { "@context": "https://schema.org", "@type": "WebApplication", name: NOMBRE, description: PROMESA + ". Herramienta gratuita de diagnóstico paso a paso.", applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "es-MX", url: C.leadMagnetUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "MXN" }, provider: { "@type": "Organization", name: C.instructor.empresa, url: "https://" + C.instructor.web } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]);
const seo = `<meta name="description" content="${esc(PROMESA)}. Herramienta gratis y sin registro para mecánicos de motos: prueba, valor esperado y resultado con semáforo.">
<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${esc(NOMBRE)}">
<meta property="og:description" content="${esc(PROMESA)}. Gratis y sin registro."><meta property="og:image" content="${esc(C.leadMagnetUrl)}/og-lead-magnet.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="628">
<meta property="og:url" content="${esc(C.leadMagnetUrl)}"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonld}</script>`;

const CSS = `
/* Layout: herramienta de banco de pruebas: banda de taller arriba, tarjeta de prueba al centro y tarjeta de resultado para captura. */
:root{
  --bg:#F2F3F5; --surface:#FFFFFF; --ink:#1E2227; --muted:#525A63; --line:#D8DCE1; --tint:#FFF4CC;
  --band:#1E2227; --band-ink:#EEF0F2; --band-muted:#AEB4BB; --accent:#FFC20E; --on-accent:#1E2227;
  --red:#C9363C; --green:#1F8A35; --blue:#215FCB; --sem-r:#E5484D; --sem-y:#FFC20E; --sem-g:#2FB344;
  --f-display:"Barlow Condensed","Arial Narrow",Arial,sans-serif; --f-body:"Barlow",Arial,sans-serif; --f-data:"IBM Plex Mono",ui-monospace,Menlo,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#14171A;--surface:#1F2327;--ink:#EEF0F2;--muted:#B3B9C0;--line:#353B42;--tint:#3A3116;--band:#0E1013;--band-ink:#EEF0F2;--band-muted:#AEB4BB;--red:#F06A6F;--green:#47C964;--blue:#6BA4FF;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#14171A;--surface:#1F2327;--ink:#EEF0F2;--muted:#B3B9C0;--line:#353B42;--tint:#3A3116;--band:#0E1013;--band-ink:#EEF0F2;--band-muted:#AEB4BB;--red:#F06A6F;--green:#47C964;--blue:#6BA4FF;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:17px;line-height:1.55;margin:0}
h1,h2,h3{font-family:var(--f-display);line-height:1.05;text-wrap:balance;margin:0}
p{margin:0}
.wrap{max-width:1080px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.mono{font-family:var(--f-data);font-variant-numeric:tabular-nums}
.eyebrow{font-family:var(--f-data);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:10px 18px;border-radius:8px;font-family:var(--f-display);font-weight:700;font-size:20px;letter-spacing:.02em;text-transform:uppercase;text-decoration:none;border:2px solid transparent;cursor:pointer;background:none;color:inherit}
.btn-primary{background:var(--accent);color:var(--on-accent)}
.btn-ghost{border-color:currentColor}
.btn-yes{background:var(--sem-g);color:#fff}.btn-no{background:var(--sem-r);color:#fff}
.btn:focus-visible,input:focus-visible,summary:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid var(--blue);outline-offset:3px}
header.hero{background:var(--band);color:var(--band-ink);padding-block:34px 30px}
header.hero h1{font-size:clamp(34px,5.6vw,58px);text-transform:uppercase;font-weight:800;max-width:22ch}
header.hero h1 em{font-style:normal;color:var(--accent)}
header.hero p{color:#D7DBE0;margin-top:12px;max-width:60ch}
.badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.badges span{font-family:var(--f-data);font-size:13px;border:1px solid #4A525B;border-radius:999px;padding:6px 12px}
.badges b{color:var(--accent);font-weight:600}
.tape{height:12px;background:repeating-linear-gradient(-45deg,var(--accent) 0 16px,#1E2227 16px 32px)}
main{padding-block:28px 48px}
.prog{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.bar{flex:1;height:10px;background:var(--line);border-radius:99px;overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--accent);transition:width .3s}
.prog span{font-family:var(--f-data);font-size:13px;color:var(--muted);white-space:nowrap}
.tool{display:grid;grid-template-columns:1.25fr .75fr;gap:22px;align-items:start}
.panel{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:22px;min-width:0}
.sym{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}
.sym button{display:flex;gap:12px;align-items:center;text-align:left;padding:16px;border:2px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:600 17px/1.25 var(--f-body);cursor:pointer;min-width:0}
.sym button:hover{border-color:var(--ink)}
.sym .n{font-family:var(--f-data);font-size:13px;color:var(--muted);flex:none;width:34px}
.step h2{font-size:clamp(26px,3.6vw,34px);margin-top:6px}
.kv{display:grid;grid-template-columns:150px 1fr;gap:8px 14px;margin-top:16px;font-size:16px}
.kv dt{font-family:var(--f-data);font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;padding-top:3px}
.kv dd{margin:0;min-width:0}
.esperado{display:inline-block;background:var(--tint);border-radius:6px;padding:2px 10px;font-family:var(--f-data);font-weight:600}
.ans{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.nav{display:flex;flex-wrap:wrap;gap:14px;margin-top:14px}
.link{background:none;border:0;color:var(--muted);text-decoration:underline;cursor:pointer;font:500 15px var(--f-body);padding:4px 0}
.side{display:flex;flex-direction:column;gap:14px}
.ruta{margin:0;padding-left:20px;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px}
.ruta b{color:var(--ink)}
.card{border:3px solid var(--ink);border-radius:12px;overflow:hidden;background:var(--surface)}
.card-h{background:var(--band);color:var(--band-ink);padding:12px 16px;display:flex;justify-content:space-between;gap:10px;font-family:var(--f-data);font-size:12px;letter-spacing:.06em}
.card-h b{color:var(--accent)}
.card-b{padding:18px;display:flex;flex-direction:column;gap:12px}
.semrow{display:flex;align-items:center;gap:14px}
.semaf{display:flex;gap:6px;background:#1E2227;padding:7px;border-radius:99px;flex:none}
.semaf i{width:22px;height:22px;border-radius:50%;background:#3A4047;display:block}
.semaf i.on.r{background:var(--sem-r)}.semaf i.on.y{background:var(--sem-y)}.semaf i.on.g{background:var(--sem-g)}
.card-b h3{font-size:26px}
.card-b ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px}
.clase{font-family:var(--f-data);font-size:14px;background:var(--tint);padding:8px 10px;border-radius:6px}
.example{font-family:var(--f-data);font-size:11px;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
.next{display:grid;grid-template-columns:1.2fr .8fr;gap:22px;margin-top:28px}
.next .panel h2{font-size:30px;text-transform:uppercase}
form.cap{display:flex;flex-direction:column;gap:10px}
form.cap label{font-size:15px;font-weight:600}
form.cap input[type=text],form.cap input[type=tel]{width:100%;min-height:46px;border:2px solid var(--line);border-radius:8px;padding:8px 12px;font:500 17px var(--f-body);background:var(--bg);color:var(--ink)}
.consent{display:flex;gap:8px;align-items:flex-start;font-size:14px;font-weight:500!important;color:var(--muted)}
.consent input{margin-top:4px;width:18px;height:18px;flex:none}
.msg{font-size:14px;min-height:1em}
.msg.err{color:var(--red)}.msg.ok{color:var(--green)}
.faq{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.faq details{background:var(--surface);border:1px solid var(--line);border-radius:8px}
.faq summary{padding:14px 16px;cursor:pointer;font-weight:600}
.faq p{padding:0 16px 14px;color:var(--muted)}
footer{padding-block:30px 40px;font-size:14px;color:var(--muted)}
footer .wrap{display:flex;flex-direction:column;gap:8px}
.toast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:8px;font-size:15px;z-index:50;max-width:calc(100% - 32px)}
@media (max-width:860px){.tool,.next{grid-template-columns:minmax(0,1fr)}.kv{grid-template-columns:minmax(0,1fr)}}
@media (max-width:520px){.sym{grid-template-columns:minmax(0,1fr)}body{font-size:16px}.ans .btn{flex:1 1 100%}}
@media (prefers-reduced-motion:reduce){.bar i{transition:none}}
`;

const bodyHtml = `
<header class="hero"><div class="wrap">
  <p class="eyebrow" style="color:var(--band-muted)">Herramienta gratis · Electrónica y Servicio</p>
  <h1 style="margin-top:10px">Árbol de diagnóstico eléctrico: <em>encuentra la falla</em> en 10 minutos</h1>
  <p>Para mecánicos de motos. Elige el síntoma, haz la prueba que te pide cada paso con tu multímetro y responde Sí o No. Al final tienes tu resultado con semáforo y 3 recomendaciones.</p>
  <div class="badges"><span><b>100 % gratis</b>, sin registro</span><span><b>6</b> fallas frecuentes</span><span>Valores típicos con <b>fuente</b></span></div>
</div></header>
<div class="tape" aria-hidden="true"></div>
<main><div class="wrap">
  <div class="prog" aria-label="Progreso"><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="bar"><i id="barI"></i></div><span id="progT">Paso 0 · elige un síntoma</span></div>
  <div class="tool">
    <section class="panel" id="stage" aria-live="polite">
      <div id="vSym">
        <p class="eyebrow">Paso 1 · ¿Qué le pasa a la moto?</p>
        <h2 style="font-size:30px;margin-top:6px">Elige el síntoma que reporta el cliente</h2>
        <div class="sym">${TREES.map((t, i) => `<button type="button" data-tree="${t.id}" id="sym_${t.id}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span>${esc(t.titulo)}</span></button>`).join("")}</div>
      </div>
      <div id="vStep" hidden class="step">
        <p class="eyebrow" id="stTree"></p>
        <h2 id="stQ"></h2>
        <dl class="kv"><dt>Cómo medir</dt><dd id="stComo"></dd><dt>Valor esperado</dt><dd><span class="esperado" id="stEsp"></span></dd></dl>
        <div class="ans"><button class="btn btn-yes" type="button" id="bSi">Sí, dentro de lo esperado</button><button class="btn btn-no" type="button" id="bNo">No</button></div>
        <div class="nav"><button class="link" type="button" id="bBack">← Paso anterior</button><button class="link" type="button" id="bReset">Empezar de nuevo</button></div>
      </div>
      <div id="vRes" hidden>
        <p class="eyebrow">Resultado</p>
        <h2 style="font-size:30px;margin-top:6px" id="rTitle"></h2>
        <p style="margin-top:8px;color:var(--muted)">Aplica las recomendaciones, documenta con foto y guarda la tarjeta de resultado (puedes tomarle captura de pantalla).</p>
        <div class="nav"><button class="link" type="button" id="bBack2">← Revisar el último paso</button><button class="link" type="button" id="bReset2">Diagnosticar otra moto</button></div>
      </div>
    </section>
    <aside class="side">
      <div class="card" id="card">
        <div class="card-h"><span>ÁRBOL DE DIAGNÓSTICO · <b>MOTOS</b></span><span id="cardDate">ELECTRÓNICA Y SERVICIO</span></div>
        <div class="card-b">
          <span class="example" id="cardEx">Ejemplo de resultado</span>
          <div class="semrow"><div class="semaf" aria-hidden="true"><i class="r" id="cR"></i><i class="y on" id="cY"></i><i class="g" id="cG"></i></div><h3 id="cDiag">Tierra o cable de salida del regulador con resistencia</h3></div>
          <p class="mono" style="font-size:13px;color:var(--muted)" id="cSint">Síntoma: La batería no carga o se descarga rodando</p>
          <ol id="cRecs"><li>Limpia y aprieta la tierra; agrega tierra dedicada a la batería si hace falta.</li><li>Revisa el fusible principal y el cable de salida.</li><li>Repite las pruebas de carga antes de cambiar piezas.</li></ol>
          <p class="clase" id="cClase">Lo resuelves en la Clase 4: ${esc(clases[3].titulo)}</p>
        </div>
      </div>
      <div class="panel"><strong>Tu ruta de pruebas</strong><ol class="ruta" id="ruta"><li>Aquí verás cada prueba y tu respuesta.</li></ol></div>
    </aside>
  </div>

  <div class="next" id="siguiente">
    <section class="panel">
      <p class="eyebrow">Siguiente paso</p>
      <h2 style="margin-top:6px">Domina el método completo</h2>
      <p style="margin-top:10px">${esc(C.titulo)}: ${C.clases} clases en vivo (${C.horasTotales} h) para diagnosticar carga, encendido, arranque e inyección con multímetro, escáner y osciloscopio, y cobrar el diagnóstico como especialista. Imparte ${esc(C.instructor.nombre)}.</p>
      <p class="mono" style="margin-top:12px;font-size:24px">${esc(C.precioTexto)}</p>
      <p style="margin-top:6px;font-weight:600">Inscripciones: ${esc(C.cta)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:14px"><a class="btn btn-primary" id="goCurso" href="${esc(C.landingUrl)}">Ver el curso completo</a><button class="btn btn-ghost" type="button" id="bReto">Reta a un colega</button></div>
    </section>
    <section class="panel">
      <h3 style="font-size:24px">Recibir mis resultados por WhatsApp</h3>
      <form class="cap" id="cap" novalidate>
        <label for="fNombre">Nombre</label><input type="text" id="fNombre" autocomplete="given-name" required>
        <label for="fWa">WhatsApp (10 dígitos)</label><input type="tel" id="fWa" inputmode="numeric" autocomplete="tel-national" placeholder="55 1234 5678" required>
        <label class="consent" for="fOk"><input type="checkbox" id="fOk" required><span>Acepto recibir mis resultados y avisos del curso por WhatsApp. Puedo darme de baja escribiendo BAJA. Aviso de privacidad abajo.</span></label>
        <button class="btn btn-primary" type="submit" id="fSend">Recibir mis resultados por WhatsApp</button>
        <p class="msg" id="fMsg" role="status"></p>
      </form>
    </section>
  </div>

  <section style="margin-top:32px;max-width:860px">
    <h2 style="font-size:30px;text-transform:uppercase">Preguntas frecuentes</h2>
    <div class="faq">${FAQ.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
  </section>
</div></main>
<footer><div class="wrap">
  <p><strong>${esc(NOMBRE)}</strong> · ${esc(C.instructor.nombre)} · ${esc(C.instructor.empresa)} · ${esc(C.instructor.web)}</p>
  <p>${esc(C.avisoValores)} Trabaja con seguridad: extintor cerca, nunca hagas chispa junto a la gasolina y usa puentes con fusible.</p>
  <p>${esc(C.avisoMarcas)}</p>
  <p id="aviso-privacidad"><strong>Aviso de privacidad breve:</strong> si nos das tu nombre y WhatsApp, los usamos para enviarte tus resultados y, con tu consentimiento, avisos del curso. Puedes ejercer tus derechos o darte de baja escribiendo BAJA. Aviso integral: solicítalo por WhatsApp (por confirmar). Tu progreso se guarda solo en tu navegador.</p>
</div></footer>
<div class="toast" id="toast" hidden></div>`;

const JS = `<script>
(function(){
  var CF = window.CONFIG || {};
  var T = ${JSON.stringify(TREES)};
  var CL = ${JSON.stringify(CLS)};
  var KEY = "es-arbol-motos";
  var st = { tree: null, path: [] }; // path: [{id, ans}]
  function $(id){ return document.getElementById(id); }
  function tree(){ return T.find(function(t){ return t.id === st.tree; }); }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e){} }
  function load(){ try { var v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v && v.tree) st = v; } catch(e){} }
  function toast(t){ var el = $("toast"); el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function(){ el.hidden = true; }, 2800); }
  function current(){ var t = tree(); if (!t) return null; var id = t.inicio; st.path.forEach(function(p){ var n = t.nodos[p.id]; id = p.ans ? n.si : n.no; }); return id; }
  function setProg(n, max, txt){ var pct = Math.min(100, Math.round(n / max * 100)); $("barI").style.width = pct + "%"; $("bar").setAttribute("aria-valuenow", pct); $("progT").textContent = txt; }
  function clase(n){ var c = CL[n - 1]; return "Lo resuelves en la Clase " + n + ": " + c.t; }
  var LAST = null;
  function render(){
    var t = tree();
    $("vSym").hidden = !!t; $("vStep").hidden = true; $("vRes").hidden = true;
    var ruta = $("ruta"); ruta.innerHTML = "";
    if (!t){ setProg(0, 1, "Paso 0 · elige un síntoma"); var li = document.createElement("li"); li.textContent = "Aquí verás cada prueba y tu respuesta."; ruta.appendChild(li); return; }
    st.path.forEach(function(p, i){ var li = document.createElement("li"); li.innerHTML = "<b>" + (p.ans ? "Sí" : "No") + "</b> · "; li.appendChild(document.createTextNode(t.nodos[p.id].prueba)); ruta.appendChild(li); });
    var id = current();
    if (id.indexOf("F:") === 0){
      var f = t.finales[id.slice(2)]; LAST = { t: t, f: f };
      $("vRes").hidden = false; $("rTitle").textContent = f.diagnostico;
      setProg(1, 1, "Resultado listo · " + st.path.length + " pruebas");
      $("cardEx").textContent = "Tu resultado · " + new Date().toLocaleDateString("es-MX");
      var SK = { rojo: "r", amarillo: "y", verde: "g" }[f.semaforo];
      ["r","y","g"].forEach(function(k){ $("c" + k.toUpperCase()).className = k + (k === SK ? " on" : ""); });
      $("cDiag").textContent = f.diagnostico; $("cSint").textContent = "Síntoma: " + t.titulo;
      var ol = $("cRecs"); ol.innerHTML = ""; f.recs.forEach(function(r){ var li = document.createElement("li"); li.textContent = r; ol.appendChild(li); });
      $("cClase").textContent = clase(f.clase);
    } else {
      var n = t.nodos[id];
      $("vStep").hidden = false; $("stTree").textContent = t.titulo + " · prueba " + (st.path.length + 1);
      $("stQ").textContent = n.prueba; $("stComo").textContent = n.como; $("stEsp").textContent = n.esperado;
      setProg(st.path.length, t.max, "Prueba " + (st.path.length + 1) + " de hasta " + t.max);
    }
    save();
  }
  T.forEach(function(t){ $("sym_" + t.id).addEventListener("click", function(){ st = { tree: t.id, path: [] }; render(); $("stage").scrollIntoView({ behavior: "smooth", block: "start" }); }); });
  function answer(v){ var id = current(); if (!id || id.indexOf("F:") === 0) return; st.path.push({ id: id, ans: v }); render(); }
  $("bSi").addEventListener("click", function(){ answer(true); }); $("bNo").addEventListener("click", function(){ answer(false); });
  function back(){ if (st.path.length) st.path.pop(); else st.tree = null; render(); }
  function reset(){ st = { tree: null, path: [] }; LAST = null; render(); }
  $("bBack").addEventListener("click", back); $("bBack2").addEventListener("click", back); $("bReset").addEventListener("click", reset); $("bReset2").addEventListener("click", reset);
  function resumen(){
    if (!LAST) return "Aún no termino el árbol de diagnóstico.";
    var sem = LAST.f.semaforo.toUpperCase();
    return "Síntoma: " + LAST.t.titulo + ". Resultado (" + sem + "): " + LAST.f.diagnostico + ". Recomendaciones: " + LAST.f.recs.join(" ") + " " + clase(LAST.f.clase) + ".";
  }
  if (CF.enlaceCurso) $("goCurso").href = CF.enlaceCurso;
  $("bReto").addEventListener("click", function(){
    var txt = "Te reto: encuentra por qué una moto no carga, no arranca o se descarga en 10 minutos con este árbol de diagnóstico gratis: " + location.href.split("#")[0];
    if (navigator.clipboard){ navigator.clipboard.writeText(txt).then(function(){ toast("Texto del reto copiado: pégalo en WhatsApp"); }, function(){ toast(txt); }); } else toast(txt);
  });
  function waUrl(nombre){
    var m = "Hola, soy " + nombre + ". Usé el Árbol de Diagnóstico Eléctrico para motos. " + resumen() + " Quiero información del curso. MOTO";
    return CF.whatsapp ? "https://wa.me/" + CF.whatsapp.replace(/\\D/g, "") + "?text=" + encodeURIComponent(m) : null;
  }
  $("cap").addEventListener("submit", function(e){
    e.preventDefault();
    var msg = $("fMsg"), nombre = $("fNombre").value.trim(), wa = $("fWa").value.replace(/\\D/g, "");
    msg.className = "msg";
    if (!nombre){ msg.className = "msg err"; msg.textContent = "Escribe tu nombre."; $("fNombre").focus(); return; }
    if (wa.length !== 10){ msg.className = "msg err"; msg.textContent = "Escribe tu WhatsApp a 10 dígitos, sin lada internacional."; $("fWa").focus(); return; }
    if (!$("fOk").checked){ msg.className = "msg err"; msg.textContent = "Para enviarte el resultado necesitamos tu consentimiento."; return; }
    var payload = { nombre: nombre, whatsapp: "52" + wa, resultado: resumen(), sintoma: LAST ? LAST.t.titulo : "", semaforo: LAST ? LAST.f.semaforo : "", clase: LAST ? LAST.f.clase : null, fuente: "lead-magnet-arbol", fecha: new Date().toISOString(), consentimiento: true };
    function fallback(){
      var u = waUrl(nombre);
      if (u){ msg.className = "msg ok"; msg.innerHTML = ""; var a = document.createElement("a"); a.href = u; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Abrir WhatsApp con tu resultado"; msg.appendChild(document.createTextNode("Listo. ")); msg.appendChild(a); }
      else { msg.className = "msg ok"; msg.textContent = "Copia este texto y envíalo por WhatsApp a Electrónica y Servicio: " + resumen(); }
    }
    if (CF.webhookUrl){
      fetch(CF.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function(r){ if (!r.ok) throw new Error(); msg.className = "msg ok"; msg.textContent = "Listo, " + nombre + ". Te enviaremos tus resultados por WhatsApp."; })
        .catch(fallback);
    } else fallback();
  });
  load(); render();
})();
</script>`;

const full = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
${CONFIG}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(NOMBRE)}: ${esc(PROMESA.toLowerCase())} | Gratis</title>
<meta name="claude:viewport-fit-sides" content="cover">
${seo}
${fonts}
<style>${CSS}</style>
</head>
<body>
${bodyHtml}
${JS}
</body>
</html>
`;
const preview = `<title>Árbol de Diagnóstico Eléctrico</title>
<meta name="claude:viewport-fit-sides" content="cover">
${CONFIG}
${seo}
${fonts}
<style>${CSS}</style>
${bodyHtml}
${JS}
`;
const out = path.join(S.ROOT, "07_Lead_Magnet");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), full);
fs.writeFileSync(path.resolve(__dirname, "../../dist/leadmagnet-preview.html"), preview);
console.log("lead magnet:", (full.length / 1024).toFixed(0) + " KB", TREES.map((t) => t.id + ":" + t.max).join(" "));
