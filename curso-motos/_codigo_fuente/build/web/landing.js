// Landing de venta: genera index.html (dominio propio) y la versión de vista previa (Artifact) desde la fuente única
const fs = require("fs"), path = require("path");
const S = require("../lib/curso");
const LD = require("../../data/landing");
const { cfg: C, arq: A, oferta: O, clases, mxn } = S;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => "$" + Number(n).toLocaleString("en-US");
const pad = (n) => String(n).padStart(2, "0");

// Valor inicial de la calculadora (para que el primer cuadro esté completo sin JS)
const cv = Object.fromEntries(LD.calculadora.map((x) => [x.id, x.val]));
const mes0 = Math.round(cv.rech * cv.cobro * 4.33 + cv.piezas * cv.costo + cv.horas * cv.hora * 4.33);
const dias0 = Math.ceil(C.precio / (mes0 / 30));

const CONFIG = `<script>
/* ===================== CONFIG · edita solo este bloque ===================== */
window.CONFIG = {
  whatsapp: "${C.whatsapp}",            // 52 + 10 dígitos, ej. "5215512345678" (por confirmar)
  checkoutUrl: "${C.checkoutUrl}",      // enlace de pago (Shopify, Mercado Pago, Stripe…). Si tiene valor, los botones van al pago
  precio: ${C.precio},                  // MXN
  periodoDeAcceso: "${C.periodoDeAcceso}",
  proximoGrupo: "${C.proximoGrupo}",
  promo: "Bono Buen Fin del 13 al 17 de noviembre de 2026: sesión extra \\"Fallas reales de motos de reparto\\" (por confirmar)",
  palabraClave: "${C.palabraClave}",
  leadMagnetUrl: "${C.leadMagnetUrl}"
};
/* ========================================================================== */
</script>`;

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">`;

const jsonld = JSON.stringify([
  { "@context": "https://schema.org", "@type": "Course", name: C.titulo, description: C.subtitulo, inLanguage: "es-MX",
    provider: { "@type": "Organization", name: C.instructor.empresa, url: "https://" + C.instructor.web },
    offers: { "@type": "Offer", price: String(C.precio), priceCurrency: "MXN", category: "Paid", availability: "https://schema.org/InStock", url: C.landingUrl },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", courseWorkload: "PT18H", startDate: C.proximoGrupoISO, instructor: { "@type": "Person", name: C.instructor.nombre } },
    syllabusSections: clases.map((c) => ({ "@type": "Syllabus", name: `Clase ${c.n}. ${c.titulo}`, description: c.promesa })) },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: LD.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]);

const CSS = `
/* Layout: banda oscura de taller para la portada + hojas claras tipo orden de servicio y nota de venta; un solo acento: amarillo de cinta de precaución. */
:root{
  --bg:#F2F3F5; --surface:#FFFFFF; --ink:#1E2227; --muted:#525A63; --line:#D8DCE1; --tint:#FFF4CC;
  --band:#1E2227; --band2:#2B3036; --band-ink:#EEF0F2; --band-muted:#AEB4BB;
  --accent:#FFC20E; --on-accent:#1E2227; --red:#C9363C; --green:#1F8A35; --blue:#215FCB; --amber:#B07A00;
  --f-display:"Barlow Condensed","Arial Narrow",Arial,sans-serif; --f-body:"Barlow",Arial,sans-serif; --f-data:"IBM Plex Mono",ui-monospace,Menlo,monospace;
  --r:10px; --wrap:1120px;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#14171A; --surface:#1F2327; --ink:#EEF0F2; --muted:#B3B9C0; --line:#353B42; --tint:#3A3116;
  --band:#0E1013; --band2:#22272C; --band-ink:#EEF0F2; --band-muted:#AEB4BB;
  --accent:#FFC20E; --on-accent:#1E2227; --red:#F06A6F; --green:#47C964; --blue:#6BA4FF; --amber:#F2B705; color-scheme:dark }}
:root[data-theme="dark"]{
  --bg:#14171A; --surface:#1F2327; --ink:#EEF0F2; --muted:#B3B9C0; --line:#353B42; --tint:#3A3116;
  --band:#0E1013; --band2:#22272C; --band-ink:#EEF0F2; --band-muted:#AEB4BB;
  --accent:#FFC20E; --on-accent:#1E2227; --red:#F06A6F; --green:#47C964; --blue:#6BA4FF; --amber:#F2B705; color-scheme:dark }
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:17px;line-height:1.55;margin:0;padding-bottom:84px}
h1,h2,h3{font-family:var(--f-display);line-height:1.05;text-wrap:balance;margin:0}
h2{font-size:clamp(30px,5vw,44px);text-transform:uppercase;letter-spacing:.01em}
h3{font-size:24px}
p{margin:0}
a{color:inherit}
.wrap{max-width:var(--wrap);margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
section{padding-block:64px}
.eyebrow{font-family:var(--f-data);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.lead{color:var(--muted);max-width:62ch}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:12px 22px;border-radius:8px;font-family:var(--f-display);font-weight:700;font-size:21px;letter-spacing:.02em;text-transform:uppercase;text-decoration:none;border:2px solid transparent;cursor:pointer}
.btn-primary{background:var(--accent);color:var(--on-accent)}
.btn-primary:hover{filter:brightness(1.05)}
.btn-ghost{background:transparent;color:inherit;border-color:currentColor}
.btn:focus-visible,summary:focus-visible,input:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid var(--blue);outline-offset:3px}
.mono{font-family:var(--f-data);font-variant-numeric:tabular-nums}
/* barra superior */
.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:var(--band);color:var(--band-ink);border-bottom:1px solid #000}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:30;background:var(--band)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:60px}
.brand{font-family:var(--f-display);font-weight:800;font-size:20px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
.brand b{color:var(--accent)}
.top .btn{min-height:40px;padding:6px 14px;font-size:17px}
/* portada */
.hero{background:var(--band);color:var(--band-ink);padding-block:48px 0}
.hero .grid{display:grid;grid-template-columns:1.08fr .92fr;gap:40px;align-items:center}
.hero h1{font-size:clamp(40px,6.4vw,72px);text-transform:uppercase;font-weight:800}
.hero h1 em{font-style:normal;color:var(--accent)}
.hero .eyebrow{color:var(--band-muted)}
.hero p.sub{color:#D7DBE0;font-size:19px;max-width:56ch;margin-top:18px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.chip{font-family:var(--f-data);font-size:14px;padding:7px 12px;border:1px solid #4A525B;border-radius:999px;color:var(--band-ink)}
.chip b{color:var(--accent);font-weight:600}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.hero .btn-ghost{color:var(--band-ink)}
.tape{height:14px;background:repeating-linear-gradient(-45deg,var(--accent) 0 18px,#1E2227 18px 36px);margin-top:48px}
/* instrumento */
.inst{background:#2B3036;border-radius:16px;padding:16px;border:1px solid #3A4047;box-shadow:0 18px 40px rgba(0,0,0,.35)}
.inst-head{display:flex;justify-content:space-between;font-family:var(--f-data);font-size:12px;color:#AEB4BB;letter-spacing:.08em;margin-bottom:10px}
.scope{position:relative;background:#0B1A12;border-radius:10px;overflow:hidden;aspect-ratio:16/9;max-width:100%}
.scope svg{display:block;width:100%;height:100%}
.trace{animation:run 6s linear infinite}
@keyframes run{from{transform:translateX(0)}to{transform:translateX(-400px)}}
.meter{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center;margin-top:14px}
.lcd{background:#C9D6B0;color:#1E2A12;border-radius:8px;padding:10px 14px;font-family:var(--f-data);border:3px solid #1E2227}
.lcd .v{font-size:clamp(30px,5vw,40px);font-weight:600;line-height:1}
.lcd .l{font-size:12px;letter-spacing:.08em;margin-top:4px}
.sema{display:flex;flex-direction:column;gap:6px;background:#1E2227;padding:8px;border-radius:999px}
.sema i{width:18px;height:18px;border-radius:50%;background:#3A4047;display:block}
.sema i.on.r{background:#E5484D;box-shadow:0 0 10px #E5484D}.sema i.on.y{background:#FFC20E;box-shadow:0 0 10px #FFC20E}.sema i.on.g{background:#2FB344;box-shadow:0 0 10px #2FB344}
/* tips */
.tips{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:28px}
.tip{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:10px;min-width:0}
.tip .dato{font-family:var(--f-data);font-size:26px;font-weight:600;color:var(--ink);background:var(--tint);align-self:flex-start;padding:2px 10px;border-radius:6px}
.tip .clase{margin-top:auto;font-family:var(--f-data);font-size:13px;color:var(--muted);border-top:1px dashed var(--line);padding-top:10px}
/* diagnóstico */
.diag{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;margin-top:28px;align-items:start}
.qs{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.q{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:14px 18px;border-top:1px solid var(--line);margin:0;min-width:0}
.q:first-child{border-top:0}
.q legend{display:contents}
.q .t{font-size:16px;min-width:0}
.yn{display:flex;gap:6px}
.yn label{position:relative}
.yn input{position:absolute;opacity:0;inset:0;margin:0}
.yn span{display:inline-block;min-width:52px;text-align:center;padding:8px 10px;border:2px solid var(--line);border-radius:8px;font-family:var(--f-display);font-weight:700;font-size:18px;cursor:pointer}
.yn input:checked+span{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.yn input:focus-visible+span{outline:3px solid var(--blue);outline-offset:2px}
.res{position:sticky;top:76px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:14px}
.res .big{display:flex;align-items:center;gap:14px}
.light{width:56px;height:56px;border-radius:50%;background:var(--line);flex:none}
.light.r{background:#E5484D}.light.y{background:#FFC20E}.light.g{background:#2FB344}
.res .score{font-family:var(--f-data);font-size:34px;font-weight:600}
.res ul{margin:0;padding-left:20px;font-size:15px;color:var(--muted)}
.res .acts{display:flex;flex-wrap:wrap;gap:10px}
.res .btn{font-size:17px;min-height:44px;padding:8px 14px}
.note{font-size:14px;color:var(--muted)}
/* calculadora */
.calc{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;margin-top:28px;align-items:start}
.sliders{display:flex;flex-direction:column;gap:18px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:22px}
.sl label{display:flex;justify-content:space-between;gap:12px;font-size:15px}
.sl output{font-family:var(--f-data);font-weight:600;white-space:nowrap}
.sl input[type=range]{width:100%;accent-color:#E0A800;margin-top:6px}
.total{background:var(--band);color:var(--band-ink);border-radius:var(--r);padding:26px;display:flex;flex-direction:column;gap:10px}
.total .n{font-family:var(--f-data);font-size:clamp(38px,6vw,54px);font-weight:600;color:var(--accent);line-height:1}
.total .d{font-family:var(--f-data);font-size:22px}
.total .note{color:var(--band-muted)}
/* orden de servicio */
.orden{background:var(--surface);border:2px solid var(--ink);border-radius:6px;margin-top:28px;overflow:hidden}
.orden-h{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;padding:14px 18px;border-bottom:2px solid var(--ink);font-family:var(--f-data);font-size:13px;letter-spacing:.05em}
.orden-h b{font-family:var(--f-display);font-size:22px;letter-spacing:.03em}
.mod{padding:14px 18px;background:var(--tint);border-bottom:1px solid var(--line);font-family:var(--f-display);font-size:22px;font-weight:700;text-transform:uppercase}
.mod small{display:block;font-family:var(--f-body);font-size:15px;font-weight:500;text-transform:none;color:var(--muted)}
details.cl{border-bottom:1px solid var(--line)}
details.cl summary{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;padding:14px 18px;cursor:pointer;list-style:none}
details.cl summary::-webkit-details-marker{display:none}
details.cl summary .no{font-family:var(--f-data);font-size:14px;color:var(--muted)}
details.cl summary .ti{font-weight:600;min-width:0}
details.cl summary .mi{font-family:var(--f-data);font-size:13px;color:var(--muted)}
details.cl summary::after{content:"+";font-family:var(--f-data);font-size:20px;grid-column:3;grid-row:1;justify-self:end;display:none}
details.cl .body{padding:0 18px 18px 94px;display:flex;flex-direction:column;gap:10px}
details.cl .body ul{margin:0;padding-left:20px;columns:2;column-gap:28px}
details.cl .body li{break-inside:avoid;margin-bottom:4px;font-size:15px}
/* nota de venta */
.venta{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:28px;align-items:start}
.nota{background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:24px;font-size:15px;box-shadow:0 1px 0 var(--line)}
.nota-h{display:flex;justify-content:space-between;font-family:var(--f-data);font-size:13px;border-bottom:2px dashed var(--line);padding-bottom:10px;margin-bottom:10px}
.row{display:grid;grid-template-columns:1fr auto;gap:12px;padding:8px 0;border-bottom:1px dotted var(--line)}
.row .v{font-family:var(--f-data);white-space:nowrap}
.row.tot{border-bottom:0;padding-top:14px;font-weight:700}
.row.tot .v s{color:var(--muted)}
.inv{margin-top:14px;background:var(--accent);color:var(--on-accent);border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.inv b{font-family:var(--f-display);font-size:24px;text-transform:uppercase}
.inv .p{font-family:var(--f-data);font-size:34px;font-weight:600}
.pago{display:flex;flex-direction:column;gap:14px}
.pago ul{margin:0;padding-left:20px}
/* sí / no */
.sino{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px}
.box{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:22px}
.box h3{display:flex;align-items:center;gap:10px}
.box ul{margin:12px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:6px}
.dot{width:14px;height:14px;border-radius:50%;display:inline-block}
/* instructor */
.inst2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px}
.gar{background:var(--tint);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:10px}
.gar ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.tools span{font-family:var(--f-data);font-size:12px;border:1px solid var(--line);border-radius:6px;padding:4px 8px;color:var(--muted)}
/* faq */
.faq{margin-top:24px;display:flex;flex-direction:column;gap:10px;max-width:860px}
.faq details{background:var(--surface);border:1px solid var(--line);border-radius:8px}
.faq summary{padding:16px 18px;cursor:pointer;font-weight:600}
.faq details p{padding:0 18px 16px;color:var(--muted)}
/* cierre */
.cierre{background:var(--band);color:var(--band-ink);text-align:left}
.cierre h2{max-width:20ch}
.cierre .lead{color:#D7DBE0;margin-top:14px}
/* barra fija */
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--band);color:var(--band-ink);border-top:3px solid var(--accent);padding-bottom:env(safe-area-inset-bottom,0px)}
.sticky .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:72px}
.sticky .t{font-family:var(--f-display);font-size:19px;text-transform:uppercase;line-height:1.1;min-width:0}
.sticky .t .mono{color:var(--accent);font-size:18px}
.sticky .btn{min-height:46px;font-size:18px;padding:8px 16px;white-space:nowrap}
footer{padding-block:40px;font-size:14px;color:var(--muted)}
footer .wrap{display:flex;flex-direction:column;gap:10px}
.toast{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:8px;font-size:15px;z-index:50}
@media (max-width:900px){
  .hero .grid,.diag,.calc,.venta,.sino,.inst2{grid-template-columns:minmax(0,1fr)}
  .tips{grid-template-columns:minmax(0,1fr)}
  .res{position:static}
  details.cl .body{padding-left:18px}
  details.cl .body ul{columns:1}
  details.cl summary{grid-template-columns:52px minmax(0,1fr)}
  details.cl summary .mi{display:none}
}
@media (max-width:520px){
  body{font-size:16px}
  .top .btn{display:none}
  .sticky .t{font-size:16px}.sticky .t .lbl{display:none}
  .sticky .btn{font-size:16px;padding:8px 12px}
  .q{grid-template-columns:minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){.trace{animation:none}*{scroll-behavior:auto!important}}
`;

const ckp = (() => { // forma de onda CKP con diente faltante, repetida
  let d = "", x = 0; const y0 = 112;
  for (let k = 0; k < 3; k++) { for (let i = 0; i < 11; i++) { d += `L${x + 6} ${y0 - 40} L${x + 12} ${y0 + 40} L${x + 18} ${y0} `; x += 18; } d += `L${x + 36} ${y0} `; x += 36; }
  return "M0 " + y0 + " " + d;
})();
const grid = Array.from({ length: 9 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="225" />`).join("") + Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 45}" x2="400" y2="${i * 45}" />`).join("");

function body() {
  const bonos = O.bonos;
  return `
<header class="top" role="banner"><div class="wrap">
  <div class="brand">Electrónica <b>y</b> Servicio</div>
  <a class="btn btn-primary js-cta" data-src="barra superior" href="#precio">${esc(C.cta)}</a>
</div></header>
<main>
<section class="hero" aria-labelledby="h-hero"><div class="wrap">
  <div class="grid">
    <div>
      <p class="eyebrow">${esc(LD.heroEyebrow)}</p>
      <h1 id="h-hero" style="margin-top:14px">Deja de cambiar piezas a ciegas: <em>encuentra la falla</em> eléctrica de la moto con pruebas</h1>
      <p class="sub">${esc(LD.heroSub)}</p>
      <div class="chips" aria-label="Datos del curso">
        <span class="chip"><b>${C.clases}</b> clases en vivo</span><span class="chip"><b>${C.horasTotales} h</b> de práctica guiada</span><span class="chip"><b>${esc(C.precioTexto)}</b></span><span class="chip">Bono: <b>Atlas de 17 diagramas</b></span>
      </div>
      <div class="cta-row">
        <a class="btn btn-primary js-cta" data-src="portada" href="#precio">Inscribirme · ${esc(C.cta)}</a>
        <a class="btn btn-ghost" href="#diagnostico">Hacer mi diagnóstico gratis</a>
      </div>
      <p class="note" style="color:#AEB4BB;margin-top:14px">Próximo grupo: ${esc(C.proximoGrupo)} · ${esc(C.frecuencia)} (por confirmar)</p>
    </div>
    <div class="inst" role="img" aria-label="Osciloscopio mostrando la señal del sensor de cigüeñal y multímetro midiendo el voltaje de carga de una moto">
      <div class="inst-head"><span>CH1 · CKP · 2 V/div · 10 ms/div</span><span>TRIG ↑</span></div>
      <div class="scope"><svg viewBox="0 0 400 225" preserveAspectRatio="none" aria-hidden="true">
        <g stroke="#1F3A28" stroke-width="1">${grid}</g>
        <g class="trace"><path d="${ckp}" fill="none" stroke="#5CFF8A" stroke-width="2.4"/><path d="${ckp}" transform="translate(400 0)" fill="none" stroke="#5CFF8A" stroke-width="2.4"/></g>
        <text x="10" y="215" fill="#5CFF8A" font-family="IBM Plex Mono, monospace" font-size="12">diente faltante = referencia PMS</text>
      </svg></div>
      <div class="meter">
        <div class="lcd" aria-live="off"><div class="v mono" id="lcdV">14.2 V</div><div class="l" id="lcdL">CARGA A 5,000 RPM · OK</div></div>
        <div class="sema" aria-hidden="true"><i class="r" id="sR"></i><i class="y" id="sY"></i><i class="g on" id="sG"></i></div>
      </div>
    </div>
  </div>
</div><div class="tape" aria-hidden="true"></div></section>

<section id="tips" aria-labelledby="h-tips"><div class="wrap">
  <p class="eyebrow">Gratis, para que lo uses hoy</p>
  <h2 id="h-tips">3 pruebas que te ahorran piezas</h2>
  <div class="tips">${LD.tips.map((t) => `
    <article class="tip"><span class="dato">${esc(t.dato)}</span><h3>${esc(t.titulo)}</h3><p>${esc(t.texto)}</p><p class="clase">Lo vemos completo en la Clase ${t.clase}: ${esc(clases[t.clase - 1].titulo)}</p></article>`).join("")}
  </div>
</div></section>

<section id="diagnostico" aria-labelledby="h-diag" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">Diagnóstico de tu taller · 2 minutos</p>
  <h2 id="h-diag">¿Qué tan listo estás para las fallas eléctricas?</h2>
  <p class="lead" style="margin-top:10px">Responde con honestidad. Al final verás tu semáforo y qué clase resuelve lo que te falta.</p>
  <div class="diag">
    <form class="qs" id="diagForm" onsubmit="return false">${LD.diagnostico.map((q, i) => `
      <fieldset class="q"><legend><span class="t">${esc(q.p)}</span></legend>
        <div class="yn" role="radiogroup" aria-label="Respuesta a la pregunta ${i + 1}">
          <label><input type="radio" id="q${i}s" name="q${i}" value="1"><span>Sí</span></label>
          <label><input type="radio" id="q${i}n" name="q${i}" value="0"><span>No</span></label>
        </div></fieldset>`).join("")}
    </form>
    <aside class="res" aria-live="polite" id="diagRes">
      <div class="big"><span class="light" id="dLight" aria-hidden="true"></span><div><div class="score" id="dScore">0 / 10</div><div class="note" id="dCount">Has respondido 0 de 10</div></div></div>
      <p id="dMsg">Responde las 10 preguntas para ver tu semáforo: 0–4 rojo, 5–7 amarillo, 8–10 verde.</p>
      <div><strong>Lo que te falta y la clase que lo resuelve</strong><ul id="dFalta"><li>Aparecerá aquí conforme respondas.</li></ul></div>
      <div class="acts"><a class="btn btn-primary js-cta" data-src="diagnóstico" id="dWa" href="#precio">Enviar mi resultado por WhatsApp</a><button class="btn btn-ghost" type="button" id="dShare">Compartir</button></div>
      <p class="note">También puedes probar gratis el <a href="${esc(C.leadMagnetUrl)}" id="lmLink">Árbol de Diagnóstico Eléctrico</a> para encontrar por qué una moto no carga, no arranca o se descarga.</p>
    </aside>
  </div>
</div></section>

<section id="calculadora" aria-labelledby="h-calc" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">Calculadora · ejemplo ilustrativo</p>
  <h2 id="h-calc">¿Cuánto dinero dejas ir cada mes?</h2>
  <p class="lead" style="margin-top:10px">Mueve las barras con los números de tu taller. Es una estimación para que veas el tamaño del problema, no una promesa de ingresos.</p>
  <div class="calc">
    <form class="sliders" id="calcForm" onsubmit="return false">${LD.calculadora.map((s) => `
      <div class="sl"><label for="c_${s.id}"><span>${esc(s.label)}</span><output id="o_${s.id}" for="c_${s.id}">${s.fmt === "mxn" ? money(s.val) : s.val + (s.fmt === "h" ? " h" : "")}</output></label>
      <input type="range" id="c_${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}" data-fmt="${s.fmt}"></div>`).join("")}
    </form>
    <div class="total" aria-live="polite">
      <span class="eyebrow" style="color:var(--band-muted)">Dinero que dejas ir al mes (estimado)</span>
      <span class="n" id="cMes">${money(mes0)}</span>
      <span class="d">Días para recuperar los ${esc(C.precioTexto)}: <b id="cDias">${dias0}</b></span>
      <p class="note">Cálculo: motos rechazadas × cobro × 4.33 semanas + piezas cambiadas sin necesidad × su costo + horas perdidas × valor de tu hora × 4.33. Ejemplo ilustrativo; tus resultados dependen de tu zona, tus precios y tu trabajo.</p>
      <a class="btn btn-primary js-cta" data-src="calculadora" id="cWa" href="#precio">Quiero dejar de perder ese dinero</a>
    </div>
  </div>
</div></section>

<section id="temario" aria-labelledby="h-tem" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">Temario completo</p>
  <h2 id="h-tem">Tu orden de servicio: 4 módulos, 12 clases</h2>
  <div class="orden">
    <div class="orden-h"><b>ORDEN DE SERVICIO</b><span>FOLIO MOTO-2027-01</span><span>${C.clases} CLASES · ${C.horasTotales} H · EN VIVO</span></div>
    ${A.modulos.map((m) => `<div class="mod">Módulo ${m.n} · ${esc(m.nombre)}<small>Resultado: ${esc(m.resultado)}</small></div>
    ${m.clases.map((n) => { const c = clases[n - 1]; return `<details class="cl"><summary><span class="no">CL-${pad(c.n)}</span><span class="ti">${esc(c.titulo)}</span><span class="mi">90 min</span></summary>
      <div class="body"><p><strong>Promesa:</strong> ${esc(c.promesa)}</p><ul>${c.temas.map((t) => `<li>${esc(t.titulo)}</li>`).join("")}</ul><p class="note"><strong>Práctica:</strong> ${esc(c.ejercicio.titulo.replace(/^Práctica:\s*/, ""))}</p></div></details>`; }).join("")}`).join("")}
  </div>
</div></section>

<section id="precio" aria-labelledby="h-precio" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">Todo lo que recibes</p>
  <h2 id="h-precio">Tu nota de venta</h2>
  <div class="venta">
    <div class="nota">
      <div class="nota-h"><span>NOTA DE VENTA</span><span>ELECTRÓNICA Y SERVICIO</span></div>
      <div class="row"><span>12 clases en vivo con práctica, grabación y repaso</span><span class="v">${money(O.valorClases)}</span></div>
      ${bonos.map((b) => `<div class="row"><span><strong>${esc(b.nombre)}</strong> · ${esc(b.formula)}</span><span class="v">${money(b.valor)}</span></div>`).join("")}
      <div class="row tot"><span>Valor total de referencia</span><span class="v"><s>${money(S.valorTotal)}</s></span></div>
      <div class="inv"><b>Tu inversión</b><span class="p">${esc(C.precioTexto)}</span></div>
      <p class="note" style="margin-top:10px">Valores de referencia estimados por Electrónica y Servicio para mostrar el alcance del material (por confirmar); no se venden por separado.</p>
    </div>
    <div class="pago">
      <h3>Formas de pago</h3>
      <ul><li>Contado: ${esc(O.pago.contado)}</li><li>${esc(O.pago.partes)}</li><li>${esc(O.pago.msi)}</li><li>${esc(O.pago.sinTarjeta)}</li></ul>
      <p class="note" id="promo">${esc("Bono Buen Fin del 13 al 17 de noviembre de 2026: sesión extra \"Fallas reales de motos de reparto\" (por confirmar).")}</p>
      <p class="note">${esc(O.escasez)} ${esc(O.urgencia)}</p>
      <a class="btn btn-primary js-cta" data-src="nota de venta" href="#precio">${esc(C.cta)}</a>
    </div>
  </div>
</div></section>

<section aria-labelledby="h-sino" style="padding-top:0"><div class="wrap">
  <h2 id="h-sino">¿Es para ti?</h2>
  <div class="sino">
    <div class="box"><h3><span class="dot" style="background:#2FB344"></span>Sí es para ti si…</h3><ul>${LD.paraQuienSi.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
    <div class="box"><h3><span class="dot" style="background:#E5484D"></span>No es para ti si…</h3><ul>${LD.paraQuienNo.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
  </div>
</div></section>

<section aria-labelledby="h-inst" style="padding-top:0"><div class="wrap">
  <h2 id="h-inst">Quién te enseña y qué te garantizamos</h2>
  <div class="inst2">
    <div class="box"><h3>${esc(C.instructor.nombre)}</h3><p style="margin-top:8px">${esc(C.instructor.empresa)} · ${esc(C.instructor.web)}</p><p style="margin-top:8px">${esc(C.instructor.trayectoria)}</p>
      <div class="tools">${[...C.herramientas.osciloscopios, ...C.herramientas.escaneres, "Sens-22", "Multímetro", "Pinza amperimétrica"].map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>
    <div class="gar"><h3>${esc(O.garantia.nombre)}</h3><ul>${O.garantia.puntos.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
  </div>
</div></section>

<section id="faq" aria-labelledby="h-faq" style="padding-top:0"><div class="wrap">
  <h2 id="h-faq">Preguntas frecuentes</h2>
  <div class="faq">${LD.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
</div></section>

<section class="cierre" aria-labelledby="h-cierre"><div class="wrap">
  <h2 id="h-cierre">${esc(LD.cierreTitulo)}</h2>
  <p class="lead">${esc(LD.cierreTexto)}</p>
  <div class="cta-row"><a class="btn btn-primary js-cta" data-src="cierre" href="#precio">${esc(C.cta)}</a><a class="btn btn-ghost" style="color:var(--band-ink)" href="#temario">Ver el temario</a></div>
</div></section>
</main>
<footer><div class="wrap">
  <p><strong>${esc(C.titulo)}</strong> · ${esc(C.instructor.nombre)} · ${esc(C.instructor.empresa)} · ${esc(C.instructor.web)}</p>
  <p>${esc(C.avisoMarcas)}</p><p>${esc(C.avisoEjemplos)}</p><p>${esc(C.avisoValores)}</p>
  <p id="aviso-privacidad"><strong>Aviso de privacidad breve:</strong> si nos escribes por WhatsApp, usamos tu nombre y número solo para darte información del curso y, con tu consentimiento, avisos de nuevos grupos. Puedes pedir la baja en cualquier momento escribiendo BAJA. Aviso integral: solicítalo por WhatsApp (por confirmar).</p>
  <p>Los resultados del diagnóstico se guardan solo en tu navegador.</p>
</div></footer>
<div class="sticky" role="region" aria-label="Inscripción"><div class="wrap">
  <div class="t"><span class="lbl">Diagnóstico Eléctrico de Motos · </span><span class="mono">${esc(C.precioTexto)}</span><br><span style="font-size:14px;color:var(--band-muted);text-transform:none;font-family:var(--f-body)">${C.clases} clases en vivo · inicia ${esc(C.proximoGrupo)}</span></div>
  <a class="btn btn-primary js-cta" data-src="barra fija" href="#precio">${esc(C.cta)}</a>
</div></div>
<div class="toast" id="toast" hidden></div>`;
}

const JS = `<script>
(function(){
  var CF = window.CONFIG || {};
  var D = ${JSON.stringify(LD.diagnostico.map((q) => ({ falta: q.falta, clase: q.clase, titulo: clases[q.clase - 1].titulo })))};
  var TITULO = ${JSON.stringify(C.titulo)};
  function base(){ return "Hola, quiero información del curso " + TITULO + ". " + (CF.palabraClave || "MOTO"); }
  function waLink(extra){ var m = base() + (extra ? "\\n" + extra : ""); return CF.whatsapp ? "https://wa.me/" + CF.whatsapp.replace(/\\D/g,"") + "?text=" + encodeURIComponent(m) : null; }
  function setCta(el, extra){
    if (CF.checkoutUrl){ el.href = CF.checkoutUrl; el.target = "_blank"; el.rel = "noopener"; return; }
    var w = waLink(extra); if (w){ el.href = w; el.target = "_blank"; el.rel = "noopener"; } else { el.href = "#precio"; el.removeAttribute("target"); }
  }
  var ctas = document.querySelectorAll(".js-cta");
  for (var i = 0; i < ctas.length; i++) setCta(ctas[i], "Vengo de: " + (ctas[i].getAttribute("data-src") || "landing"));
  var lm = document.getElementById("lmLink"); if (lm && CF.leadMagnetUrl) lm.href = CF.leadMagnetUrl;
  var promo = document.getElementById("promo"); if (promo && CF.promo) promo.textContent = CF.promo;
  function toast(t){ var el = document.getElementById("toast"); el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function(){ el.hidden = true; }, 2600); }
  // Instrumento de portada
  var states = [["14.2 V","CARGA A 5,000 RPM · OK","g"],["12.7 V","BATERÍA EN REPOSO · OK","g"],["0.62 V","CAÍDA EN TIERRA · REVISAR","r"],["13.1 V","CARGA CON LUCES · ATENCIÓN","y"]], si = 0;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) setInterval(function(){ si = (si + 1) % states.length; var s = states[si];
    document.getElementById("lcdV").textContent = s[0]; document.getElementById("lcdL").textContent = s[1];
    ["r","y","g"].forEach(function(k){ document.getElementById("s" + k.toUpperCase()).className = k + (k === s[2] ? " on" : ""); }); }, 2400);
  // Diagnóstico
  var KEY = "es-diag-motos";
  function load(){ try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e){ return {}; } }
  function save(v){ try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){} }
  var saved = load();
  Object.keys(saved).forEach(function(k){ var el = document.getElementById(k + (saved[k] === "1" ? "s" : "n")); if (el) el.checked = true; });
  var resumen = "";
  function evalDiag(){
    var ans = {}, yes = 0, n = 0, falta = [];
    for (var i = 0; i < D.length; i++){ var c = document.querySelector('input[name="q' + i + '"]:checked'); if (c){ ans["q" + i] = c.value; n++; if (c.value === "1") yes++; else falta.push(D[i]); } }
    save(ans);
    var light = document.getElementById("dLight"), msg = document.getElementById("dMsg");
    document.getElementById("dScore").textContent = yes + " / 10";
    document.getElementById("dCount").textContent = "Has respondido " + n + " de 10";
    var color = "", txt = "Responde las 10 preguntas para ver tu semáforo: 0–4 rojo, 5–7 amarillo, 8–10 verde.";
    if (n === 10){
      if (yes <= 4){ color = "r"; txt = "Semáforo ROJO: hoy las fallas eléctricas te cuestan tiempo y piezas. El curso te da el método desde cero."; }
      else if (yes <= 7){ color = "y"; txt = "Semáforo AMARILLO: tienes bases, pero te faltan sistemas clave. Con el método completo diagnosticas y cobras mejor."; }
      else { color = "g"; txt = "Semáforo VERDE: vas bien. El curso te ayuda a especializarte en inyección, osciloscopio y a cobrar como especialista."; }
    }
    light.className = "light" + (color ? " " + color : ""); msg.textContent = txt;
    var ul = document.getElementById("dFalta"); ul.innerHTML = "";
    if (!falta.length){ var li = document.createElement("li"); li.textContent = n ? "Nada pendiente en lo que respondiste." : "Aparecerá aquí conforme respondas."; ul.appendChild(li); }
    falta.forEach(function(f){ var li = document.createElement("li"); li.textContent = f.falta + " → Clase " + f.clase + ": " + f.titulo; ul.appendChild(li); });
    var sem = color === "r" ? "ROJO" : color === "y" ? "AMARILLO" : color === "g" ? "VERDE" : "incompleto";
    resumen = "Mi diagnóstico: " + yes + "/10 (" + sem + ")." + (falta.length ? " Me falta: " + falta.map(function(f){ return f.falta; }).join(", ") + "." : "");
    setCta(document.getElementById("dWa"), resumen);
  }
  document.getElementById("diagForm").addEventListener("change", evalDiag); evalDiag();
  document.getElementById("dShare").addEventListener("click", function(){
    var text = "Hice el diagnóstico eléctrico para mecánicos de motos: " + resumen + " Hazlo tú también: " + location.href.split("#")[0] + "#diagnostico";
    if (navigator.share){ navigator.share({ title: TITULO, text: text }).catch(function(){}); return; }
    if (navigator.clipboard){ navigator.clipboard.writeText(text).then(function(){ toast("Texto copiado: pégalo en WhatsApp"); }, function(){ toast(text); }); } else toast(text);
  });
  // Calculadora
  var fmt = function(n){ return "$" + Math.round(n).toLocaleString("en-US"); };
  function calc(){
    var v = {}; document.querySelectorAll("#calcForm input[type=range]").forEach(function(r){ var id = r.id.slice(2); v[id] = +r.value;
      var f = r.getAttribute("data-fmt"); document.getElementById("o_" + id).textContent = f === "mxn" ? fmt(r.value) : r.value + (f === "h" ? " h" : ""); });
    var mes = v.rech * v.cobro * 4.33 + v.piezas * v.costo + v.horas * v.hora * 4.33;
    var dias = mes > 0 ? Math.ceil((CF.precio || ${C.precio}) / (mes / 30)) : "—";
    document.getElementById("cMes").textContent = fmt(mes); document.getElementById("cDias").textContent = dias;
    setCta(document.getElementById("cWa"), "Según la calculadora dejo ir unos " + fmt(mes) + " al mes (estimado).");
  }
  document.getElementById("calcForm").addEventListener("input", calc); calc();
})();
</script>`;

const headMeta = `<title>Diagnóstico Eléctrico de Motos</title>
<meta name="claude:viewport-fit-sides" content="cover">`;
const seo = `<meta name="description" content="${esc(LD.seoDescription)}">
<meta property="og:type" content="website"><meta property="og:locale" content="es_MX">
<meta property="og:title" content="${esc(C.titulo)}"><meta property="og:description" content="${esc(LD.seoDescription)}">
<meta property="og:image" content="${esc(C.landingUrl)}/og-imagen.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${esc(C.landingUrl)}"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonld}</script>`;

const full = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
${CONFIG}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(LD.seoTitle)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
${seo}
${fonts}
<style>${CSS}</style>
</head>
<body>
${body()}
${JS}
</body>
</html>
`;
const preview = `${headMeta}
${CONFIG}
${seo}
${fonts}
<style>${CSS}</style>
${body()}
${JS}
`;
const out = path.join(S.ROOT, "06_Landing_Page");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), full);
fs.mkdirSync(path.resolve(__dirname, "../../dist"), { recursive: true });
fs.writeFileSync(path.resolve(__dirname, "../../dist/landing-preview.html"), preview);
console.log("landing:", (full.length / 1024).toFixed(0) + " KB", "· mes0", mes0, "dias0", dias0);
