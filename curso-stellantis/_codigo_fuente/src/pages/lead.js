/* ============ CONFIG (editar aquí) ============ */
const CONFIG = {
  whatsapp: "525552173484",                 // 52 + 10 dígitos
  enlaceCurso: "index.html",                // URL de la landing del curso
  precio: "$1,799 MXN",
  webhookUrl: "",                           // opcional: webhook entrante (por ejemplo, GoHighLevel). Vacío = se usa WhatsApp
  palabra: "STELLANTIS"
};
/* ============================================== */
const D = window.__PAGE__;
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KEY = "stlDetector";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
let S = load() || { paso: 1, marca: "Jeep", anio: 2019, eq: ["mm", "escbi"], sintoma: "", i: 0, hist: [], fin: null, finOk: false };
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2800); }
const eqN = id => (D.equipos.find(e => e.id === id) || { n: id }).n;
function prog() { const p = Math.min(4, S.paso); $("#progBar").style.width = (p / 4 * 100) + "%"; $("#progTxt").textContent = S.paso > 4 ? "Listo" : `Paso ${p} de 4`; }
function render() {
  prog(); const st = $("#step");
  if (S.paso === 1) {
    st.innerHTML = `<h3>1 · ¿Qué vehículo tienes enfrente?</h3><div class="grid2"><div class="range"><label for="fMarca">Marca</label><select id="fMarca" style="padding:10px;border:2px solid var(--line);border-radius:8px;background:var(--surface-2)">${["Jeep", "Ram", "Dodge", "Chrysler"].map(m => `<option ${m === S.marca ? "selected" : ""}>${m}</option>`).join("")}</select></div><div class="range"><label for="fAnio">Año</label><input id="fAnio" type="number" min="1996" max="2027" value="${S.anio}" style="padding:10px;border:2px solid var(--line);border-radius:8px;background:var(--surface-2)"></div></div><div><button class="btn btn-acc" type="button" id="n1">Siguiente</button></div>`;
    $("#n1").onclick = () => { S.marca = $("#fMarca").value; S.anio = +$("#fAnio").value || 2019; S.paso = 2; save(); render(); };
  } else if (S.paso === 2) {
    st.innerHTML = `<h3>2 · ¿Qué equipo tienes?</h3><p>Marca todo lo que puedes usar hoy.</p><div class="chips" style="gap:10px">${D.equipos.map(e => `<label class="chip" style="border:2px solid var(--line);display:inline-flex;gap:8px;align-items:center;cursor:pointer;font-family:var(--f-body);font-size:.95rem"><input type="checkbox" value="${e.id}" ${S.eq.includes(e.id) ? "checked" : ""}> ${esc(e.n)}</label>`).join("")}</div><div style="display:flex;gap:10px"><button class="btn btn-line" type="button" id="b2">Atrás</button><button class="btn btn-acc" type="button" id="n2">Siguiente</button></div>`;
    $("#b2").onclick = () => { S.paso = 1; save(); render(); };
    $("#n2").onclick = () => { S.eq = $$("#step input:checked").map(i => i.value); S.paso = 3; save(); render(); };
  } else if (S.paso === 3) {
    st.innerHTML = `<h3>3 · ¿Qué síntoma tiene?</h3><div class="grid2">${D.sintomas.map(s => `<button class="btn btn-line" type="button" data-s="${s.arbol}" style="justify-content:flex-start;text-align:left">${esc(s.t)}</button>`).join("")}</div><div><button class="btn btn-line" type="button" id="b3">Atrás</button></div>`;
    $$("#step [data-s]").forEach(b => b.onclick = () => { S.sintoma = b.dataset.s; S.i = 0; S.hist = []; S.fin = null; S.paso = 4; save(); render(); });
    $("#b3").onclick = () => { S.paso = 2; save(); render(); };
  } else if (S.paso === 4) {
    const tr = D.arboles[S.sintoma]; const p = tr.pasos[S.i];
    st.innerHTML = `<h3>4 · ${esc(tr.n)} · prueba ${S.i + 1}</h3>${S.hist.map(h => `<p class="mono" style="font-size:.85rem;color:var(--ink-2)">✔ ${esc(h.q)} → ${h.a}</p>`).join("")}<p style="font-family:var(--f-display);font-size:1.45rem;font-weight:700">${esc(p.q)}</p><p style="font-size:.9rem">Equipo para esta prueba: ${p.eq.map(id => `<span class="pill ${S.eq.includes(id) ? "ok" : "bad"}">${esc(eqN(id))}${S.eq.includes(id) ? "" : " (no lo tienes)"}</span>`).join(" ")}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-acc" type="button" id="si">Sí</button><button class="btn btn-line" type="button" id="no">No</button><button class="btn btn-line" type="button" id="nose">No lo puedo medir</button></div>`;
    const go = (v) => { S.hist.push({ q: p.q, a: v === 1 ? "Sí" : v === 0 ? "No" : "Sin medir", eq: p.eq }); if (v === 2) { S.fin = "No pudiste hacer esta prueba con tu equipo: " + p.eq.map(eqN).join(", ") + ". Sin esa medición, cualquier cambio de pieza es una apuesta."; S.finOk = false; S.paso = 5; } else { const nx = v ? p.si : p.no; if (typeof nx === "number") S.i = nx; else { S.fin = nx; S.finOk = !!v; S.paso = 5; } } save(); render(); };
    $("#si").onclick = () => go(1); $("#no").onclick = () => go(0); $("#nose").onclick = () => go(2);
  } else { st.innerHTML = `<h3>Diagnóstico completo</h3><p>Revisa tu resultado abajo.</p>`; showResult(); }
}
function resultData() {
  const tr = D.arboles[S.sintoma]; const used = [...new Set(S.hist.flatMap(h => h.eq))]; const miss = used.filter(id => !S.eq.includes(id));
  const sinMedir = S.hist.some(h => h.a === "Sin medir");
  const nivel = sinMedir || miss.length >= 2 ? "bad" : miss.length === 1 ? "warn" : "ok";
  const sgw = S.anio >= 2018;
  const recs = [S.fin, miss.length ? `Equipo esencial que te falta para esta falla: ${miss.map(eqN).join(", ")}. Revisa precios de referencia en el Laboratorio del curso.` : "Tienes el equipo para confirmar la falla: guarda las mediciones y capturas para el informe del cliente.", sgw ? `Tu ${S.marca} ${S.anio} probablemente tiene Security Gateway: puedes leer sin desbloquear, pero borrar y activar requiere AutoAuth (Clase 5).` : `Para tu ${S.marca} ${S.anio}, verifica la generación de red en el DLC antes de medir: 60 Ω entre 6 y 14 con la batería desconectada (Clase 4).`];
  const txt = { ok: "Verde: falla localizada y tienes el equipo para confirmarla", warn: "Amarillo: vas bien, pero te falta equipo para confirmar", bad: "Rojo: necesitas pruebas que hoy no puedes hacer" }[nivel];
  return { tr, nivel, txt, recs, clase: tr.clase };
}
function showResult() {
  const r = resultData(); $("#resultado").hidden = false;
  $("#resCard").innerHTML = `<div class="result ${r.nivel}" style="border-width:3px"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><div class="eyebrow">Detector de Fallas Stellantis · ${esc(S.marca)} ${S.anio}</div><strong style="font-family:var(--f-display);font-size:1.7rem;line-height:1.1;display:block">${esc(r.tr.n)}</strong></div><div class="sema" data-s="${r.nivel}" aria-label="Semáforo"><i></i><i></i><i></i></div></div><p style="font-weight:700">${esc(r.txt)}</p><ol style="margin:0;padding-left:22px;display:grid;gap:6px">${r.recs.map(x => `<li>${esc(x)}</li>`).join("")}</ol><p><span class="tag">Lo resuelve</span> Clase ${r.clase}: ${esc(D.clases.find(c => c.n === r.clase).t)}</p><p class="mono" style="font-size:.78rem;color:var(--ink-2)">Prof. José Luis Orozco · Electrónica y Servicio · Valores típicos; verifique con el manual del fabricante.</p></div>`;
  $("#resultado").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
function resultText() { const r = resultData(); return `Detector de Fallas Stellantis · ${S.marca} ${S.anio} · ${r.tr.n}: ${r.txt}. 1) ${r.recs[0]} 2) ${r.recs[1]} 3) ${r.recs[2]} · Clase ${r.clase}.`; }
async function send() {
  const nombre = $("#lmNombre").value.trim(), tel = $("#lmTel").value.replace(/\D/g, "");
  if (!$("#lmOk").checked) { $("#lmMsg").textContent = "Marca la casilla de consentimiento para enviarte tu resultado."; return; }
  const msg = `${CONFIG.palabra}. Hola, soy ${nombre || "técnico"}. Mi resultado: ${resultText()}`;
  if (CONFIG.webhookUrl) {
    try { const r = await fetch(CONFIG.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre, whatsapp: tel, resultado: resultText(), origen: "detector-fallas-stellantis" }) }); if (r.ok) { $("#lmMsg").textContent = "Listo: recibimos tu resultado. Te escribiremos por WhatsApp."; return; } } catch (e) { /* se usa WhatsApp */ }
  }
  if (CONFIG.whatsapp) { const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`; const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove(); $("#lmMsg").innerHTML = `Si no se abrió WhatsApp, usa este enlace: <a href="${url}" target="_blank" rel="noopener">enviar resultado</a>`; }
}
function init() {
  render(); if (S.paso === 5) showResult();
  $("#lmSend").onclick = send;
  $("#lmChallenge").onclick = async () => { const r = resultData(); const txt = `Hice el Detector de Fallas Stellantis (${r.tr.n}) y salí en ${r.nivel === "ok" ? "verde" : r.nivel === "warn" ? "amarillo" : "rojo"}. ¿Te animas a hacerlo? Es gratis: ${location.href.split("#")[0]}`; try { await navigator.clipboard.writeText(txt); toast("Texto copiado: pégalo en WhatsApp para retar a un colega"); } catch (e) { $("#lmMsg").textContent = txt; } };
  $("#lmRestart").onclick = () => { S = { paso: 1, marca: S.marca, anio: S.anio, eq: S.eq, sintoma: "", i: 0, hist: [], fin: null, finOk: false }; save(); $("#resultado").hidden = true; render(); $("#herramienta").scrollIntoView(); };
  $("#lmCurso").href = CONFIG.enlaceCurso || "#siguiente"; $("#topCurso").href = CONFIG.enlaceCurso || "#siguiente"; $("#stBtn").href = CONFIG.enlaceCurso || "#siguiente";
  [$("#lmCurso"), $("#topCurso"), $("#stBtn")].forEach(a => { if (/^https?:|\.html/.test(a.getAttribute("href"))) { a.target = "_blank"; a.rel = "noopener"; } });
  $("#lmWaCurso").href = CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.palabra + ". Quiero información del curso Diagnóstico Stellantis Pro.")}` : (CONFIG.enlaceCurso || "#siguiente");
  $("#lmPrecio").textContent = CONFIG.precio; $("#stPrecio").textContent = CONFIG.precio;
  $("#lmTemas").innerHTML = D.clases.map(c => `<li>Clase ${c.n}: ${esc(c.t)}</li>`).join("");
  $("#faq").innerHTML = D.faqLm.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  $("#aviso").textContent = D.aviso;
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
