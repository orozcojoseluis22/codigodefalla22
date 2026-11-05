/* ============ CONFIG (editar aquí) ============ */
const CONFIG = {
  whatsapp: "525552173484",        // 52 + 10 dígitos. Vacío = los botones bajan a la sección de precio
  checkoutUrl: "",                 // enlace de pago (Shopify, GoHighLevel, Mercado Pago…). Si existe, los botones van al pago
  precio: "$1,799 MXN",
  periodoDeAcceso: "12 meses a grabaciones y materiales (por confirmar)",
  proximoGrupo: "Por confirmar",
  promo: "Bono de inscripción anticipada en El Buen Fin (13 al 17 de noviembre): sesión extra de revisión de capturas (por confirmar).",
  enlaceLeadMagnet: "detector-fallas-stellantis.html",
  palabra: "STELLANTIS"
};
/* ============================================== */
const D = window.__PAGE__;
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = n => "$" + Math.round(n).toLocaleString("en-US");
let CONTEXTO = "";
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
function ctaHref(src) {
  if (CONFIG.checkoutUrl) return CONFIG.checkoutUrl;
  if (CONFIG.whatsapp) return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`${CONFIG.palabra}. Hola, quiero inscribirme a Diagnóstico Stellantis Pro (${CONFIG.precio}).${CONTEXTO ? " " + CONTEXTO : ""}`)}`;
  return "#precio";
}
function refreshCtas() { $$(".js-cta").forEach(a => { const h = ctaHref(a.dataset.src); a.href = h; if (h.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; } else { a.removeAttribute("target"); } }); }

function tips() {
  $("#tips").innerHTML = D.tips.map(t => `<article class="card"><span class="tag">Tip</span><h3>${esc(t.t)}</h3><p>${esc(t.x)}</p><p style="font-weight:700">Lo vemos completo en la Clase ${t.c}.</p></article>`).join("");
}
let ANS = Array(D.preguntas.length).fill(null);
try { const s = JSON.parse(localStorage.getItem("stlDiag") || "null"); if (Array.isArray(s) && s.length === ANS.length) ANS = s; } catch (e) {}
function diag() {
  $("#yn").innerHTML = D.preguntas.map((q, i) => `<div class="yn-row"><p>${esc(q.q)}</p><div class="seg" role="group" aria-label="Respuesta"><button type="button" class="si" data-i="${i}" data-v="1" aria-pressed="${ANS[i] === 1}">Sí</button><button type="button" class="no" data-i="${i}" data-v="0" aria-pressed="${ANS[i] === 0}">No</button></div></div>`).join("");
  $$("#yn button").forEach(b => b.addEventListener("click", () => { ANS[+b.dataset.i] = +b.dataset.v; try { localStorage.setItem("stlDiag", JSON.stringify(ANS)); } catch (e) {} diag(); }));
  const done = ANS.filter(a => a !== null).length, si = ANS.filter(a => a === 1).length;
  const st = si >= 8 ? "ok" : si >= 5 ? "warn" : "bad";
  const falta = D.preguntas.map((q, i) => ({ q, a: ANS[i] })).filter(x => x.a === 0);
  const titulo = done < D.preguntas.length ? `Llevas ${done} de ${D.preguntas.length} respuestas` : st === "ok" ? "Verde: tienes buena base; el curso te lleva a especialista" : st === "warn" ? "Amarillo: diagnosticas, pero pierdes tiempo y trabajos" : "Rojo: hoy te conviene mandar los Stellantis a otro taller";
  $("#diagRes").className = "result " + (done ? st : "");
  $("#diagRes").innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><strong style="font-family:var(--f-display);font-size:1.5rem">${esc(titulo)}</strong><div class="sema" data-s="${done ? st : ""}" aria-label="Semáforo"><i></i><i></i><i></i></div></div><p class="mono">${si} de 10 en «Sí»</p>${falta.length ? `<div><strong>Lo que te falta y dónde lo resuelves:</strong><ul>${falta.map(f => `<li>${esc(f.q.corto)} → Clase ${f.q.c}</li>`).join("")}</ul></div>` : ""}<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-acc btn-sm" id="diagWa" target="_blank" rel="noopener" href="#">Enviar mi resultado por WhatsApp</a><button class="btn btn-line btn-sm" id="diagShare" type="button">Compartir</button></div>`;
  CONTEXTO = done ? `Mi autoevaluación: ${si}/10 (${st === "ok" ? "verde" : st === "warn" ? "amarillo" : "rojo"}). Me falta: ${falta.map(f => f.q.corto).join(", ") || "nada"}.` : CONTEXTO;
  $("#diagWa").href = CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`${CONFIG.palabra}. ${CONTEXTO}`)}` : "#precio";
  $("#diagShare").addEventListener("click", async () => { const txt = `Hice la autoevaluación de diagnóstico Stellantis: ${si}/10. Haz la tuya: ${location.href.split("#")[0]}#diagnostico`; try { await navigator.clipboard.writeText(txt); toast("Texto copiado para compartir"); } catch (e) { toast(txt); } });
  refreshCtas();
}
const CALC = [["rech", "Stellantis que rechazas o mandas a agencia al mes", 0, 20, 1, 4, ""], ["esc", "Escaneos que cobras barato al mes", 0, 40, 1, 10, ""], ["dif", "Diferencia entre tu escaneo y un diagnóstico con método", 0, 800, 50, 250, "$"], ["tic", "Ticket promedio de una reparación eléctrica", 500, 8000, 100, 1800, "$"], ["mar", "Margen sobre la reparación", 10, 60, 5, 35, "%"], ["hrs", "Horas al mes perdidas cambiando piezas a ciegas (valor $220/h)", 0, 40, 1, 8, ""]];
function calc() {
  $("#calc").innerHTML = CALC.map(([id, l, mi, ma, st, v, u]) => `<div class="range"><label for="c_${id}"><span>${esc(l)}</span><output id="o_${id}"></output></label><input type="range" id="c_${id}" min="${mi}" max="${ma}" step="${st}" value="${v}"></div>`).join("");
  const upd = () => { const g = id => +$("#c_" + id).value; CALC.forEach(([id, , , , , , u]) => $("#o_" + id).textContent = u === "$" ? money(g(id)) : u === "%" ? g(id) + "%" : g(id));
    const tot = g("rech") * g("tic") * g("mar") / 100 + g("esc") * g("dif") + g("hrs") * 220; $("#calcTot").textContent = money(tot);
    const dias = tot > 0 ? Math.ceil(D.precio / (tot / 30)) : null; $("#calcDias").innerHTML = dias ? `Con esa estimación, la inversión de ${esc(CONFIG.precio)} se recuperaría en unos <strong>${dias} días</strong> (ejemplo ilustrativo).` : "Mueve los valores para ver la estimación.";
    CONTEXTO = `Mi calculadora: ${money(tot)} al mes que dejo ir (ejemplo ilustrativo).`; refreshCtas(); };
  $$("#calc input").forEach(i => i.addEventListener("input", upd)); upd();
}
function temario() {
  $("#tem").innerHTML = D.modulos.map(m => `<div class="mod-h">Módulo ${m.n} · ${esc(m.t)}</div>` + D.clases.filter(c => c.mod === m.n).map(c => `<details class="cls"><summary><span class="n">C-${String(c.n).padStart(2, "0")}</span><span class="t">${esc(c.t)}</span><span class="x" aria-hidden="true">+</span></summary><div class="body"><p><strong>${esc(c.promesa)}</strong></p><ul>${c.temas.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></details>`).join("")).join("");
}
function receipt() {
  const tot = D.valorClases + D.bonos.reduce((a, b) => a + b.valor, 0);
  $("#receipt").innerHTML = `<div style="text-align:center;margin-bottom:10px"><strong>ELECTRÓNICA Y SERVICIO</strong><br>Nota de venta · Diagnóstico Stellantis Pro</div>
  <div class="row"><span>12 clases en vivo con grabación</span><span>${money(D.valorClases)}</span></div>${D.bonos.map(b => `<div class="row"><span>Bono ${b.n}: ${esc(b.nombre)}</span><span>${money(b.valor)}</span></div>`).join("")}
  <div class="row tot"><span>Valor de referencia</span><span><s>${money(tot)}</s></span></div><div style="margin-top:12px">Tu inversión</div><div class="inv">${esc(CONFIG.precio)}</div>
  <div style="font-size:.8rem;margin-top:6px">Valores de referencia estimados; no son precios de venta. Acceso: ${esc(CONFIG.periodoDeAcceso)}. Próximo grupo: ${esc(CONFIG.proximoGrupo)}.</div>`;
  $("#promoTxt").textContent = CONFIG.promo || "";
}
function rest() {
  $("#si").innerHTML = D.si.map(x => `<li>✔ ${esc(x)}</li>`).join(""); $("#no").innerHTML = D.no.map(x => `<li>✖ ${esc(x)}</li>`).join("");
  $("#bio").textContent = D.bio; $("#equipo").innerHTML = D.equipo.map(e => `<span class="chip" style="border-color:var(--line)">${esc(e)}</span>`).join("");
  $("#garT").textContent = D.garantia.nombre; $("#garX").textContent = D.garantia.texto;
  $("#faq").innerHTML = D.faq.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  $("#aviso").textContent = D.aviso; $("#chipPrecio").textContent = CONFIG.precio; $("#stPrecio").textContent = CONFIG.precio;
  $("#lmLink").href = CONFIG.enlaceLeadMagnet || "#diagnostico";
}
function scope() {
  const H = [], L = []; let x = 0; const bits = [0,0,1,0,1,1,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,1,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0];
  for (let r = 0; r < 2; r++) bits.forEach(b => { const yh = b ? 98 : 150, yl = b ? 202 : 150; H.push(`L${x} ${yh} L${x + 26} ${yh}`); L.push(`L${x} ${yl} L${x + 26} ${yl}`); x += 26; });
  $("#canH").setAttribute("d", "M0 150 " + H.join(" ")); $("#canL").setAttribute("d", "M0 150 " + L.join(" "));
  const tr = document.querySelector(".trace"); if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let off = 0; const span = bits.length * 26; const step = () => { off = (off + 1.2) % span; tr.setAttribute("transform", `translate(${20 - off} 0)`); requestAnimationFrame(step); }; requestAnimationFrame(step);
}
function init() { tips(); diag(); calc(); temario(); receipt(); rest(); scope(); refreshCtas(); }
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
