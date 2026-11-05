/* ============ CONFIG (editar aquí) ============ */
const CONFIG = {
  whatsapp: "525552173484",          // 52 + 10 dígitos. Vacío = sin botón de WhatsApp
  palabra: "STELLANTIS",             // palabra clave del llamado a la acción
  enlaceCurso: "",                   // URL de la landing del curso (opcional)
  precio: "$1,799 MXN",
  sitioIA: "https://codigodefalla22.com"
};
/* ============================================== */
const DATA = window.__LAB_DATA__;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem("labStl." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("labStl." + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
};
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Copiado al portapapeles"); }
  catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Copiado al portapapeles"); } catch (x) { toast("Selecciona y copia el texto manualmente"); } ta.remove(); }
}
function wa(msg) { return CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}` : (CONFIG.enlaceCurso || "#"); }
const eqName = id => (DATA.equipos.find(e => e.id === id) || { n: id }).n;
const claseName = n => { const c = DATA.clases.find(x => x.n === n); return c ? `Clase ${c.n}: ${c.t}` : ""; };
const fmt = (x, d = 2) => (x == null || !isFinite(x)) ? "—" : Number(x).toFixed(d);
function fmtTime(s) { const a = Math.abs(s); if (a === 0) return "0"; if (a < 1e-3) return (s * 1e6).toFixed(a < 1e-5 ? 1 : 0) + " µs"; if (a < 1) return (s * 1e3).toFixed(a < 1e-2 ? 2 : 1) + " ms"; return s.toFixed(2) + " s"; }
function fmtFreq(f) { if (!isFinite(f) || f <= 0) return "—"; if (f >= 1e3) return (f / 1e3).toFixed(2) + " kHz"; return f.toFixed(f < 10 ? 2 : 1) + " Hz"; }
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* ---------- Pestañas y rutas ---------- */
const TABS = [["asistente", "Asistente"], ["ondas", "Formas de onda"], ["codigos", "Códigos DTC"], ["datos", "Datos en vivo"], ["redes", "Redes CAN/LIN"], ["diagramas", "Diagramas"], ["equipo", "Equipo"], ["referencias", "Referencias"]];
function buildTabs() {
  $("#tablist").innerHTML = TABS.map(([id, n], i) => `<button class="tab" role="tab" id="t-${id}" aria-controls="v-${id}" aria-selected="false" type="button" data-v="${id}"><span class="n">${String(i + 1).padStart(2, "0")}</span>${n}</button>`).join("");
  $$("#tablist .tab").forEach(b => b.addEventListener("click", () => { location.hash = b.dataset.v; }));
}
function route() {
  const id = (location.hash || "#asistente").slice(1);
  const ok = TABS.some(t => t[0] === id) ? id : "asistente";
  TABS.forEach(([t]) => { $("#v-" + t).hidden = t !== ok; $("#t-" + t).setAttribute("aria-selected", t === ok ? "true" : "false"); });
  if (ok === "ondas") requestAnimationFrame(() => plotWave());
  if (ok === "referencias") requestAnimationFrame(() => renderRef());
}

/* ---------- Equipo del usuario ---------- */
let MYEQ = new Set(store.get("eq", ["mm", "escbi", "osc2", "pinzaB", "dlcbox"]));
function renderEquipo() {
  $("#equipoChips").innerHTML = DATA.equipos.map(e => `<label class="chip" title="${esc(e.ej)}"><input type="checkbox" value="${e.id}" ${MYEQ.has(e.id) ? "checked" : ""}>${esc(e.n)}</label>`).join("");
  $$("#equipoChips input").forEach(i => i.addEventListener("change", () => {
    i.checked ? MYEQ.add(i.value) : MYEQ.delete(i.value); store.set("eq", [...MYEQ]);
    runAsistente(); renderCoverage(); renderEqTable(); updateCfg();
  }));
}
const toolTag = id => `<span class="tool ${MYEQ.has(id) ? "" : "miss"}" title="${MYEQ.has(id) ? "Lo tienes" : "No lo tienes"}">${esc(eqName(id))}</span>`;
const hasOsc = () => MYEQ.has("osc2") || MYEQ.has("osc4");

/* ---------- Asistente ---------- */
function generacion(y) {
  if (!y || y < 1996) return { t: "Año no válido", d: "" };
  if (y >= 2018) return { t: "2018+ con SGW", d: "CAN C + CAN IHS con Security Gateway: leer sí; borrar, activar y programar requiere AutoAuth (o cable 12+8)." };
  if (y >= 2011) return { t: "2011–2017 · CAN IHS", d: "CAN C (500 kbps) + CAN IHS (125 kbps), IBS por LIN en muchos modelos." };
  if (y >= 2005) return { t: "2005–2010 · CAN B", d: "CAN C (500 kbps) + CAN B (83.3 kbps, tolerante a fallas), TIPM como gateway en varios modelos." };
  return { t: "Antes de 2005", d: "Arquitectura previa a CAN en muchos modelos (bus PCI/SCI): verifique con el diagrama." };
}
function dtcLookup(code) {
  code = (code || "").trim().toUpperCase();
  if (!code) return null;
  const d = DATA.dtc.find(x => x.c.toUpperCase() === code);
  if (d) return { ...d, known: true };
  const m = code.match(/^([PBCU])([0-3])([0-9A-F])([0-9A-F]{2})/);
  if (!m) return null;
  const [, L, d1, d2] = m;
  const fabricante = (L === "P" && (d1 === "1" || d1 === "3")) || (L !== "P" && (d1 === "1" || d1 === "2"));
  let f = "modulo", sis = "Módulo o configuración";
  if (L === "U") { f = "red"; sis = "Red de comunicación"; }
  else if (L === "C") { f = "chasis"; sis = "Chasis (ABS, dirección, suspensión)"; }
  else if (L === "B") { f = "modulo"; sis = "Carrocería (BCM, bolsas, confort)"; }
  else { const map = { "0": ["mezcla", "Medición de aire, combustible y emisiones auxiliares"], "1": ["sensor", "Medición de aire y combustible"], "2": ["actuador", "Circuito de inyectores"], "3": ["encendido", "Encendido y fallas de encendido"], "4": ["evap", "Controles de emisiones auxiliares"], "5": ["sensor", "Velocidad, ralentí y entradas auxiliares"], "6": ["modulo", "Computadora y salidas"], "7": ["modulo", "Transmisión"], "8": ["modulo", "Transmisión"], "9": ["modulo", "Transmisión"], "A": ["modulo", "Propulsión híbrida"] }; [f, sis] = map[d2] || ["modulo", "Sistema no identificado"]; }
  return { c: code, d: `Código ${fabricante ? "específico del fabricante" : "genérico SAE"} · ${sis}. Consulte la definición exacta en la información de servicio.`, f, causas: ["Verifique la definición exacta del fabricante", "Revise alimentaciones, tierras y conectores del sistema", "Aplique el método de 6 pasos"], pids: ["Datos del sistema involucrado"], osc: null, sgw: true, known: false };
}
function planFor(d, y, marca, modelo) {
  const fam = DATA.familias[d.f] || DATA.familias.modulo;
  const sgwYear = y >= 2018;
  const steps = [];
  steps.push({ s: "info", h: "Verifica el síntoma y entrevista al cliente", b: `<p>Pregunta cuándo falla (frío, calor, lluvia, baches, con carga). Confirma el síntoma antes de medir.</p>`, tools: [] });
  let camp = `<p>Consulta campañas y boletines por VIN (<a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener">NHTSA</a> y llamados a revisión de Profeco).</p>`;
  if (/durango|grand cherokee/i.test(modelo) && y >= 2011 && y <= 2013 && ["distribucion", "arranque", "actuador"].includes(d.f)) camp += `<p><span class="pill warn">Atención</span> Las ${esc(modelo)} ${y} tienen campañas del relevador de la bomba en el TIPM (14V530, 15V115, 19V813).</p>`;
  if (/4xe/i.test(modelo)) camp += `<p><span class="pill bad">Alto voltaje</span> Revise la campaña 68C (25V-741). Solo personal capacitado en alto voltaje.</p>`;
  steps.push({ s: "info", h: "VIN, campañas y boletines", b: camp, tools: [] });
  const scanTool = MYEQ.has("escbi") ? "escbi" : (MYEQ.has("escgen") ? "escgen" : "escbi");
  let scan = `<p>Escaneo completo de todos los módulos. Guarda el informe y los datos congelados <strong>antes</strong> de borrar.</p><p>Datos en vivo a leer: ${d.pids.map(esc).join(" · ")}</p>`;
  if (!MYEQ.has("escbi") && MYEQ.has("escgen")) scan += `<p><span class="pill warn">Limitación</span> El escáner genérico solo ve el motor y códigos genéricos: no verás códigos de carrocería ni de red de otros módulos.</p>`;
  if (sgwYear) scan += `<p><span class="pill info">SGW</span> Puedes leer sin autenticar. Borrar, activar o programar requiere AutoAuth.</p>`;
  steps.push({ s: "info", h: "Escaneo completo", b: scan, tools: [scanTool] });
  steps.push({ s: "info", h: "Alimentaciones y tierras del módulo involucrado", b: `<p>Mide B+, encendido y tierras <strong>en el conector del módulo</strong>, con carga. Caída típica en tierra de electrónica: menos de 0.1 V.</p>`, tools: ["mm"] });
  // Pruebas específicas
  const sig = d.osc ? DATA.senales.find(s => s.id === d.osc) : null;
  let sp = `<p>Causas probables: ${d.causas.map(esc).join("; ")}.</p><ul>`;
  const tl = [];
  if (d.f === "red") { sp += `<li>DLC: 16 = B+, 4/5 = tierra; resistencia 6–14 ≈ 60 Ω (batería desconectada); CAN H ≈ 2.6 V y CAN L ≈ 2.4 V (ON). Usa la pestaña Redes.</li><li>Varios módulos que pierden al mismo: revisa ese módulo (alimentación, tierra, tramo de red).</li>`; tl.push("dlcbox", "mm"); }
  if (sig) { sp += `<li>Osciloscopio · ${esc(sig.n)}: ${esc(sig.vdiv)}, ${esc(sig.tdiv)}, disparo ${esc(sig.trig)}. Bien: ${esc(sig.bien)}</li>`; tl.push(MYEQ.has("osc4") ? "osc4" : "osc2"); if (/bomba|corriente|compresion/i.test(sig.id)) tl.push(sig.id === "compresion" ? "pinzaA" : "pinzaB"); if (sig.id === "inyector" || sig.id === "bobina") tl.push("atenuador"); }
  if (["sensor"].includes(d.f) && d.osc !== "can_c") { sp += `<li>Sens-22: desconecta el sensor y simula la señal; si el escáner la sigue, el cableado y el PCM están bien.</li>`; tl.push("sens22"); }
  if (d.f === "mezcla" || d.c === "P0300") { sp += `<li>Prueba de humo en la admisión y presión de combustible; compara ajustes en ralentí y a 2,500 RPM.</li>`; tl.push("humo", "presion"); }
  if (d.f === "carga") { sp += `<li>Voltaje objetivo contra real, corriente con la pinza y rizado en AC (&lt; 0.5 Vpp típico). Revisa el fusible y la LIN del IBS.</li>`; tl.push("pinzaA", "probbat"); }
  if (d.f === "distribucion") { sp += `<li>Voltaje en la carga con la carga conectada y corriente con la pinza. No puentees salidas protegidas del TIPM.</li>`; tl.push("pinzaB", "lampara"); }
  if (d.f === "arranque") { sp += `<li>Prueba la llave de repuesto y la pila. Necesitarás el PIN para programar o transferir la clave.</li>`; }
  if (d.f === "encendido") { sp += `<li>Intercambia bobina, bujía o inyector con otro cilindro: si la falla se mueve, encontraste la pieza.</li><li>Compresión relativa con pinza de alta corriente si la falla no se mueve.</li>`; tl.push("pinzaA"); }
  if (!hasOsc() && sig) sp += `<li><span class="pill warn">Sin osciloscopio</span> Alternativa: multímetro en MIN/MAX y punta lógica para ver actividad, pero no podrás ver la forma de la señal.</li>`;
  sp += `</ul>`;
  steps.push({ s: "warn", h: "Pruebas específicas del código", b: sp, tools: [...new Set(tl)] });
  let fin = `<p>Repara, borra códigos y haz una prueba de manejo que repita las condiciones de la falla.</p>`;
  if (d.f === "modulo" || d.c.startsWith("B10")) fin += `<p>Si reemplazas un módulo: mantenedor de voltaje, programación y alineación PROXI.</p>`;
  if (sgwYear && d.sgw) fin += `<p><span class="pill warn">SGW</span> Este paso requiere acceso de escritura (AutoAuth o cable 12+8).</p>`;
  const finTools = [];
  if (sgwYear) finTools.push("autoauth");
  if (d.f === "modulo" || d.f === "arranque") finTools.push("witech", "mantenedor");
  steps.push({ s: "ok", h: "Reparar, verificar y documentar", b: fin, tools: finTools });
  const miss = fam.esencial.filter(id => !MYEQ.has(id));
  return { steps, fam, miss };
}
function runAsistente() {
  const y = +$("#aAnio").value, marca = $("#aMarca").value, modelo = $("#aModelo").value.trim();
  const g = generacion(y); $("#genPill").textContent = g.t; $("#genPill").title = g.d;
  const sint = $("#aSintoma").value;
  const box = $("#aOut");
  if (sint) { box.innerHTML = `<div class="panel-h"><h3>${esc(DATA.sintomas.find(s => s.arbol === sint)?.t)}</h3><span class="pill info">${esc(g.t)}</span></div><p class="hint">${esc(g.d)}</p><p>Responde el árbol de decisión de abajo. Cada paso indica el equipo que usa.</p>`; startTree(sint); $("#aEquipo").innerHTML = ""; return; }
  $("#treeBox").hidden = true;
  const d = dtcLookup($("#aDtc").value);
  if (!d) { box.innerHTML = `<div class="result warn"><strong>Escribe un código válido</strong><p>Formato: una letra (P, B, C, U) y cuatro caracteres. Ejemplo: P0335.</p></div>`; return; }
  const p = planFor(d, y, marca, modelo);
  const essential = p.fam.esencial.map(toolTag).join("") + (p.fam.recomendado.length ? `<div class="hint" style="margin-top:6px">Recomendado: ${p.fam.recomendado.map(toolTag).join("")}</div>` : "");
  $("#aEquipo").innerHTML = `<div class="callout"><div class="lbl">Equipo esencial para esta falla (${esc(p.fam.n)})</div>${essential}${p.miss.length ? `<p class="hint" style="margin-top:6px">Te falta: ${p.miss.map(eqName).map(esc).join(", ")}. Revisa la pestaña Equipo.</p>` : `<p class="hint" style="margin-top:6px">Tienes el equipo esencial.</p>`}</div>`;
  box.innerHTML = `<div class="panel-h"><div><div class="eyebrow">${esc(marca)} ${esc(modelo)} ${y || ""} · ${esc(g.t)}</div><h3><span class="mono">${esc(d.c)}</span> · ${esc(d.d)}</h3></div><div class="sema" data-s="${p.miss.length ? (p.miss.length > 1 ? "bad" : "warn") : "ok"}" aria-label="Cobertura de equipo"><i></i><i></i><i></i></div></div>
    <p class="hint">${esc(g.d)}${d.known ? "" : " · Código no incluido en la base: ruta genérica."}</p>
    <ol class="steps">${p.steps.map(s => `<li class="${s.s}"><div><h4>${esc(s.h)}</h4>${s.b}${s.tools.length ? `<div>${s.tools.map(toolTag).join("")}</div>` : ""}</div></li>`).join("")}</ol>
    <p class="callout"><strong>Lo vemos completo en la ${esc(claseName(p.fam.clase))}.</strong></p>`;
  box._text = planText(d, p, marca, modelo, y);
  $("#aWa").href = wa(`Hola, quiero el curso Diagnóstico Stellantis Pro (${CONFIG.palabra}). Mi caso: ${box._text.slice(0, 600)}`);
}
function planText(d, p, marca, modelo, y) {
  const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return `${marca} ${modelo} ${y} · ${d.c}: ${d.d}\n` + p.steps.map((s, i) => `${i + 1}) ${s.h}: ${strip(s.b)}${s.tools.length ? " [Equipo: " + s.tools.map(eqName).join(", ") + "]" : ""}`).join("\n") + (p.miss.length ? `\nEquipo esencial que falta: ${p.miss.map(eqName).join(", ")}` : "") + `\nClase del curso: ${claseName(p.fam.clase)}`;
}
/* Árboles */
let TREE = null;
function startTree(id) { TREE = { id, i: 0, hist: [] }; renderTree(); }
function renderTree() {
  const tr = DATA.arboles[TREE.id], box = $("#treeBox"); box.hidden = false;
  const p = tr.pasos[TREE.i];
  const hist = TREE.hist.map(h => `<div>✔ ${esc(h.q)} → <strong>${h.a}</strong></div>`).join("");
  if (TREE.end) {
    box.innerHTML = `<div class="panel-h"><h3>${esc(tr.n)}</h3><button class="btn btn-line btn-sm" type="button" id="trR">Reiniciar</button></div><div class="tree-hist">${hist}</div><div class="result ${TREE.endOk ? "ok" : "bad"}"><strong>Conclusión</strong><p>${esc(TREE.end)}</p><p class="hint">Lo vemos completo en la ${esc(claseName(tr.clase))}.</p></div>`;
  } else {
    box.innerHTML = `<div class="panel-h"><h3>${esc(tr.n)} · paso ${TREE.i + 1} de ${tr.pasos.length}</h3><button class="btn btn-line btn-sm" type="button" id="trR">Reiniciar</button></div><div class="tree-hist">${hist}</div><p class="tree-q">${esc(p.q)}</p><div>${p.eq.map(toolTag).join("")}</div><div class="row"><button class="btn btn-acc" type="button" id="trS">Sí</button><button class="btn btn-line" type="button" id="trN">No</button></div>`;
    $("#trS").onclick = () => answer(true); $("#trN").onclick = () => answer(false);
  }
  $("#trR").onclick = () => startTree(TREE.id);
}
function answer(yes) {
  const p = DATA.arboles[TREE.id].pasos[TREE.i]; TREE.hist.push({ q: p.q, a: yes ? "Sí" : "No" });
  const nx = yes ? p.si : p.no;
  if (typeof nx === "number") TREE.i = nx; else { TREE.end = nx; TREE.endOk = yes; }
  renderTree();
}

/* ---------- Generador de señales sintéticas (referencias) ---------- */
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function synth(id, bad) {
  const r = rng(bad ? 7 : 3); const N = 4000; let T = 0.1, unit = "V", f, f2 = null;
  const tooth = (t, per, teeth, missing, shift = 0) => { const k = Math.floor((t + shift) / per); const ph = ((t + shift) / per) - k; const idx = ((k % teeth) + teeth) % teeth; return idx >= teeth - missing ? 0 : (ph < 0.5 ? 1 : 0); };
  switch (id) {
    case "ckp_hall": T = 0.12; f = t => { let v = 5 * tooth(t, 0.075 / 60, 60, 2); if (bad && Math.floor(t / (0.075 / 60)) % 60 === 22) v = 0; if (bad && r() < 0.01) v = 5 - v; return v + (r() - 0.5) * 0.08; }; break;
    case "cmp_hall": T = 0.2; f = t => { const a = (t / 0.15 * 720) % 720; let v = (a < 30 || (a > 90 && a < 150) || (a > 300 && a < 330) || (a > 450 && a < 540)) ? 5 : 0; if (bad && r() < 0.012) v = 5 - v; return v + (r() - 0.5) * 0.08; }; break;
    case "ckp_cmp": T = 0.16; f = t => 5 * tooth(t, 0.075 / 60, 60, 2) + (r() - 0.5) * 0.06; f2 = t => { const a = ((t + (bad ? 0.0025 : 0)) / 0.15 * 720) % 720; return ((a > 40 && a < 100) || (a > 400 && a < 430)) ? 5 : 0; }; break;
    case "ckp_ind": T = 0.12; f = t => { const per = 0.075 / 60; const k = Math.floor(t / per) % 60; const amp = bad ? 0.35 : 4.2; return k >= 58 ? amp * 0.15 * Math.sin(2 * Math.PI * t / (per * 2)) : amp * Math.sin(2 * Math.PI * t / per) + (r() - 0.5) * 0.05; }; break;
    case "can_c": case "can_ihs": { const bit = id === "can_c" ? 2e-6 : 8e-6; T = bit * 100; const bits = Array.from({ length: 101 }, (_, i) => (i > 5 && i < 95) ? (r() < 0.5 ? 1 : 0) : 0); f = t => { const b = bits[Math.floor(t / bit)] || 0; return (b ? 3.5 : 2.5) + (r() - 0.5) * 0.05; }; f2 = t => { const b = bits[Math.floor(t / bit)] || 0; return bad ? 0.05 + r() * 0.03 : (b ? 1.5 : 2.5) + (r() - 0.5) * 0.05; }; break; }
    case "lin": { T = 0.02; const bit = 1 / 19200; const frame = []; for (let i = 0; i < 13; i++) frame.push(0); frame.push(1); for (let k = 0; k < 4; k++) { frame.push(0); for (let j = 0; j < 8; j++) frame.push(r() < 0.5 ? 1 : 0); frame.push(1, 1); } f = t => { const k = Math.floor((t - 0.003) / bit); const lo = bad ? 4.6 : 0.6; const v = (k >= 0 && k < frame.length && frame[k] === 0) ? lo : 12.6; return v + (r() - 0.5) * 0.08; }; break; }
    case "inyector": T = 0.012; f = t => { if (t < 0.002) return 13.8 + (r() - 0.5) * 0.1; if (t < 0.005) return 0.3 + 0.3 * (t - 0.002) / 0.003; const dt = t - 0.005; const spike = bad ? 3 : 48; return 13.8 + spike * Math.exp(-dt / 0.00018) + 1.5 * Math.exp(-dt / 0.0008) * Math.sin(2 * Math.PI * dt / 0.0004); }; break;
    case "bobina": T = 0.08; f = t => { const k = Math.floor(t / 0.02); const ph = t - k * 0.02; const dw = (bad && k === 2) ? 0.0008 : 0.003; if (bad && k === 3) return 0; return (ph > 0.01 && ph < 0.01 + dw ? 4.9 : 0.05) + (r() - 0.5) * 0.04; }; break;
    case "analog": T = 2; f = t => { let v = 0.6 + 3.7 * (0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, t / 1.6))); if (bad && t > 0.9 && t < 0.93) v = 0.25; if (bad && Math.abs(t - 1.3) < 0.004) v += 1.4; return v + (r() - 0.5) * 0.02; }; break;
    case "o2": T = 4; f = t => bad ? 0.12 + (r() - 0.5) * 0.04 : 0.46 + 0.38 * Math.tanh(3 * Math.sin(2 * Math.PI * 1.1 * t)) + (r() - 0.5) * 0.03; break;
    case "pwm": T = 0.02; f = t => { const ph = (t * 250) % 1; return (ph < 0.4 ? (bad ? 3.6 : 0.2) : 13.8) + (r() - 0.5) * 0.08; }; break;
    case "bomba": T = 0.024; unit = "A"; f = t => { const ph = t * 667 * 8; const seg = Math.floor(ph) % 8; let h = 0.9 * Math.abs(Math.sin(Math.PI * (ph % 1))); if (bad && seg === 5) h *= 0.25; return 6.1 + h + (r() - 0.5) * 0.08; }; break;
    case "compresion": T = 1.2; unit = "A"; f = t => { if (t < 0.06) return 120 + 330 * Math.exp(-t / 0.02); const ph = (t - 0.06) / 0.09; const cyl = Math.floor(ph) % 6; let p = 95 * Math.pow(Math.max(0, Math.sin(Math.PI * (ph % 1))), 2); if (bad && cyl === 4) p *= 0.55; return 105 + p + (r() - 0.5) * 3; }; break;
    case "rizado": T = 0.005; f = t => { const ph = t * 1500 * 3; const k = Math.floor(ph) % 3; let h = 0.18 * Math.abs(Math.sin(Math.PI * (ph % 1))); if (bad && k === 2) h = -0.55 * Math.abs(Math.sin(Math.PI * (ph % 1))); return h - 0.09 + (r() - 0.5) * 0.01; }; break;
    case "ks": T = 0.05; f = t => { const n = (r() - 0.5) * 0.03; if (bad) return n; const dt = t - 0.02; return n + (dt > 0 ? 1.6 * Math.exp(-dt / 0.003) * Math.sin(2 * Math.PI * 7000 * dt) : 0); }; break;
    case "wss": T = 0.05; f = t => { const k = Math.floor(t / 0.0025); if (bad && (k === 9 || k === 10)) return 0.8; return ((t / 0.0025) % 1 < 0.5 ? 1.6 : 0.8) + (r() - 0.5) * 0.03; }; break;
    default: T = 0.01; f = () => 0;
  }
  const t = new Float64Array(N), v = new Float64Array(N), v2 = f2 ? new Float64Array(N) : null;
  for (let i = 0; i < N; i++) { t[i] = i * T / (N - 1); v[i] = f(t[i]); if (v2) v2[i] = f2(t[i]); }
  return { t, v, v2, unit };
}

/* ---------- Análisis de señales ---------- */
function pct(arr, p) { const a = Float64Array.from(arr).sort(); const i = Math.min(a.length - 1, Math.max(0, Math.round(p / 100 * (a.length - 1)))); return a[i]; }
function median(a) { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function edges(t, v, th) { const up = [], dn = []; for (let i = 1; i < v.length; i++) { if (v[i - 1] < th && v[i] >= th) up.push(t[i - 1] + (th - v[i - 1]) / (v[i] - v[i - 1]) * (t[i] - t[i - 1])); else if (v[i - 1] >= th && v[i] < th) dn.push(t[i - 1] + (v[i - 1] - th) / (v[i - 1] - v[i]) * (t[i] - t[i - 1])); } return { up, dn }; }
function peaksW(v) {
  const n = v.length; let mean = 0; for (const x of v) mean += x; mean /= n; let c = 0; for (let i = 1; i < n; i++) if (v[i - 1] < mean && v[i] >= mean) c++;
  const P = Math.max(5, Math.round(n / Math.max(1, c))); const h = Math.max(2, Math.round(P * 0.45)); const out = [];
  for (let i = h; i < n - h; i++) { let ok = true; for (let j = i - h; j <= i + h; j++) if (v[j] > v[i]) { ok = false; break; } if (ok && (!out.length || i - out[out.length - 1] > h)) out.push(i); }
  return out;
}
function peaks(t, v) { const mean = v.reduce((a, b) => a + b, 0) / v.length; let sd = 0; for (const x of v) sd += (x - mean) ** 2; sd = Math.sqrt(sd / v.length); const th = mean + 0.3 * sd; const pk = []; let cur = null; for (let i = 0; i < v.length; i++) { if (v[i] > th) { if (!cur || v[i] > cur.v) cur = { v: v[i], t: t[i] }; } else if (cur) { pk.push(cur); cur = null; } } if (cur) pk.push(cur); return pk; }
function analyze(sig, t, v, v2, refTeeth) {
  const M = [], C = [], unit = (sig.id === "bomba" || sig.id === "compresion") ? "A" : "V";
  const lo = pct(v, 3), hi = pct(v, 97), vmin = pct(v, 0.2), vmax = pct(v, 99.8), span = t[t.length - 1] - t[0];
  M.push(["Mínimo", fmt(vmin) + " " + unit], ["Máximo", fmt(vmax) + " " + unit], ["Pico a pico", fmt(vmax - vmin) + " " + unit], ["Ventana", fmtTime(span)]);
  const chk = (s, m) => C.push({ s, m });
  const inR = (x, r) => x >= r[0] && x <= r[1];
  if (sig.digital) {
    const th = (lo + hi) / 2; const { up, dn } = edges(t, v, th);
    const per = up.slice(1).map((x, i) => x - up[i]); const mp = median(per);
    const freq = mp > 0 ? 1 / mp : NaN;
    let duty = NaN; if (up.length > 1 && dn.length) { const d = []; for (let i = 0; i < up.length - 1; i++) { const f = dn.find(x => x > up[i] && x < up[i + 1]); if (f != null) d.push((f - up[i]) / (up[i + 1] - up[i])); } duty = median(d) * 100; }
    M.push(["Nivel bajo", fmt(lo) + " V"], ["Nivel alto", fmt(hi) + " V"]); if (!/^(can_|lin)/.test(sig.id)) M.push(["Frecuencia", fmtFreq(freq)], ["Ciclo de trabajo", isFinite(duty) ? fmt(duty, 1) + " %" : "—"]); M.push(["Transiciones", String(up.length)]);
    if (up.length < 2) chk("bad", "No se detectan pulsos: la línea está fija. Revise alimentación, referencia o un corto (o ajuste el tiempo/div).");
    else {
      chk(inR(lo, sig.vmin) ? "ok" : "bad", `Nivel bajo ${fmt(lo)} V (esperado ${sig.vmin[0]} a ${sig.vmin[1]} V).`);
      chk(inR(hi, sig.vmax) ? "ok" : "bad", `Nivel alto ${fmt(hi)} V (esperado ${sig.vmax[0]} a ${sig.vmax[1]} V).`);
      const datos = /^(can_|lin)/.test(sig.id), patron = datos || sig.id === "cmp_hall" || sig.id === "ckp_cmp";
      const gaps = per.filter(p => p > 1.8 * mp).length, glitch = datos ? 0 : per.filter(p => p < 0.35 * mp).length;
      const irr = per.filter(p => (p < 0.65 * mp && p >= 0.35 * mp) || (p > 1.35 * mp && p <= 1.8 * mp)).length;
      if (!sig.hueco && !patron && gaps) chk("bad", `${gaps} pulso(s) faltante(s): el periodo se duplica. Revise el control del PCM, el arnés o la alimentación.`);
      if (!patron && up.length > 2) { const hts = []; for (let i = 0; i < up.length; i++) { const f = dn.find(x => x > up[i]); if (f != null && (i === up.length - 1 || f < up[i + 1])) hts.push(f - up[i]); } const mh = median(hts); const varh = hts.length > 1 ? (Math.max(...hts) - Math.min(...hts)) / mh : 0; if (varh > 0.3) chk("warn", `El ancho de los pulsos varía ${fmt(varh * 100, 0)}% (dwell o ciclo de trabajo irregular): compare entre cilindros o con lo que ordena el PCM.`); }
      if (sig.hueco) { const gr = Math.max(...per) / mp; M.push(["Hueco/diente", fmt(gr, 1) + "×"]); chk(gaps ? "ok" : "warn", gaps ? `Hueco de referencia detectado (${gaps} en la ventana).` : "No se ve el hueco de referencia: amplíe el tiempo/div para ver una vuelta completa."); }
      if (datos) chk("ok", `Hay actividad en la red: ${up.length} transiciones en la ventana (en una red de datos los bits varían; no se evalúa la regularidad).`);
      else if (glitch) chk("bad", `${glitch} pulsos muy cortos: ruido, rebote o interferencia. Revise la tierra del sensor, el blindaje y el entrehierro.`);
      else if (irr && patron) chk("ok", "Patrón de pulsos presente; compárelo con la referencia del mismo motor.");
      else if (irr && !sig.hueco) chk("warn", `${irr} periodos irregulares: revise si es normal para este patrón (CMP o patrón de dientes) o si hay pulsos faltantes.`);
      else if (irr && sig.hueco && gaps > 0) chk("warn", `${irr} periodos irregulares además del hueco: posible diente dañado o pulso faltante.`);
      else chk("ok", "Pulsos regulares, sin ruido evidente.");
      if (sig.id === "lin" && lo > 2.5) chk("bad", "El nivel bajo de la LIN no llega a casi 0 V: tierra del esclavo o del maestro con resistencia.");
      if (v2 && (sig.id === "can_c" || sig.id === "can_ihs")) { const l2 = pct(v2, 3), h2 = pct(v2, 97); M.push(["CAN L bajo/alto", `${fmt(l2)} / ${fmt(h2)} V`]); if (h2 < 0.5) chk("bad", "CAN L fija cerca de 0 V: corto a tierra en CAN L."); else if (l2 > 4.5) chk("bad", "CAN L fija alta: corto a B+."); else chk(inR(l2, [1.2, 1.9]) && inR(h2, [2.3, 2.7]) ? "ok" : "warn", `CAN L de ${fmt(h2)} V a ${fmt(l2)} V (esperado de 2.5 V a 1.5 V, en espejo).`); }
      if (v2 && sig.id === "ckp_cmp") { const e2 = edges(t, v2, 2.5).up; const g = []; for (let i = 1; i < per.length; i++) if (per[i] > 1.8 * mp) g.push(up[i + 1]); if (g.length && e2.length) { const ref = g[0]; const nxt = e2.find(x => x > ref); if (nxt != null) { const teeth = (nxt - ref) / mp; M.push(["CMP tras hueco", fmt(teeth, 1) + " dientes"]); if (refTeeth != null) { const dif = teeth - refTeeth; chk(Math.abs(dif) < 0.8 ? "ok" : "bad", Math.abs(dif) < 0.8 ? `Flanco del CMP en la misma posición que la referencia (${fmt(refTeeth, 1)} dientes).` : `Flanco del CMP desplazado ${fmt(dif, 1)} dientes frente a la referencia: sincronía alterada (cadena, engrane, VVT o puesta a tiempo). Posible P0016.`); } else chk("ok", `Anote: el CMP aparece ${fmt(teeth, 1)} dientes después del hueco. Compárelo con un motor sano igual: 1 diente o más de diferencia indica sincronía alterada (P0016).`); } } }
    }
  } else if (sig.picos) {
    const base = pct(v, 5); const skip = Math.round(v.length * 0.06);
    let amp = peaksW(v).filter(i => i > skip).map(i => v[i] - base); const ma = median(amp); amp = amp.filter(a => a < 1.6 * ma);
    const pk = amp; const am = amp.length ? amp.reduce((a, b) => a + b, 0) / amp.length : NaN; const varp = amp.length ? (Math.max(...amp) - Math.min(...amp)) / am * 100 : NaN;
    const avg = v.reduce((a, b) => a + b, 0) / v.length;
    M.push(["Promedio", fmt(avg, 1) + " " + unit], ["Picos", String(pk.length)], ["Variación de picos", fmt(varp, 0) + " %"]);
    if (sig.id === "bomba") chk(inR(avg, [3, 11]) ? "ok" : "warn", `Corriente promedio ${fmt(avg, 1)} A (típico de 4 a 10 A según el modelo; verificar).`);
    if (pk.length < 3) chk("warn", "Se detectan pocos picos: amplíe la ventana de tiempo.");
    else chk(varp < 15 ? "ok" : (varp < 30 ? "warn" : "bad"), varp < 15 ? "Picos parejos." : (sig.id === "compresion" ? "Un cilindro muestra un pico distinto: compresión menor en ese cilindro; confirme con manómetro o prueba de fuga." : "Picos irregulares: segmento, escobillas o alimentación de la bomba."));
  } else if (sig.conmuta) {
    const cr = edges(t, v, 0.45).up.length; const fsw = cr / (t[t.length - 1] - t[0]);
    M.push(["Conmutaciones", fmtFreq(fsw)]);
    if (vmax < 0.6) chk("bad", "El sensor se queda bajo: mezcla pobre o sensor; revise ajustes de combustible."); else if (vmin > 0.3) chk("bad", "El sensor se queda alto: mezcla rica."); else chk(fsw >= 0.5 ? "ok" : "warn", fsw >= 0.5 ? "Oscila correctamente entre pobre y rico." : "Oscilación lenta: sensor contaminado o lazo abierto.");
  } else if (sig.rizado) {
    const pp = vmax - vmin; M.push(["Rizado", fmt(pp) + " Vpp"]);
    chk(pp <= 0.5 ? "ok" : (pp <= 1 ? "warn" : "bad"), pp <= 0.5 ? "Rizado dentro del valor típico (< 0.5 Vpp)." : "Rizado alto o patrón con huecos: diodo abierto o en corto; revise el alternador y la batería.");
  } else if (sig.pico) {
    M.push(["Pico", fmt(vmax, 1) + " V"]);
    chk(lo < 1.5 ? "ok" : "bad", `Durante la inyección baja a ${fmt(lo)} V (esperado < 1.5 V).`);
    chk(hi > 11 ? "ok" : "bad", `Reposo ${fmt(median(Array.from(v.slice(0, 50))), 1)} V (esperado ≈ 12–14 V del ASD).`);
    chk(vmax > 25 ? "ok" : "warn", vmax > 25 ? "Pico inductivo presente." : "Pico inductivo bajo o ausente: devanado en corto o driver; compare con los otros inyectores.");
  } else if (sig.suave) {
    let jumps = 0; const s = vmax - vmin; for (let i = 3; i < v.length; i++) if (Math.abs(v[i] - v[i - 3]) > 0.18 * s) jumps++;
    M.push(["Saltos bruscos", String(jumps)]);
    chk(inR(vmin, [0, 1.6]) ? "ok" : "warn", `Mínimo ${fmt(vmin)} V (típico 0.3 a 1.2 V en reposo; verificar).`);
    chk(inR(vmax, [3, 4.95]) ? "ok" : "warn", `Máximo ${fmt(vmax)} V (típico 3.5 a 4.8 V; verificar).`);
    chk(jumps === 0 ? "ok" : "bad", jumps === 0 ? "Variación suave, sin huecos ni picos." : "Saltos bruscos: pista desgastada o conector flojo. Repita el barrido lento.");
  } else if (sig.id === "ckp_ind") {
    const pp = vmax - vmin; M.push(["Pico a pico", fmt(pp) + " V"]);
    chk(pp >= 1 ? "ok" : "warn", pp >= 1 ? "Amplitud suficiente para el PCM." : "Amplitud baja: entrehierro grande, sensor débil o RPM de marcha muy bajas. Mida la resistencia y la distancia al reluctor.");
  } else {
    M.push(["Promedio", fmt(v.reduce((a, b) => a + b, 0) / v.length) + " " + unit]);
    chk((vmax - vmin) > 0.1 ? "ok" : "bad", (vmax - vmin) > 0.1 ? "Hay señal." : "No hay señal: revise el sensor, el arnés y el torque de apriete.");
  }
  const st = C.some(c => c.s === "bad") ? "bad" : (C.some(c => c.s === "warn") ? "warn" : "ok");
  return { M, C, st };
}

/* ---------- Gráfica ---------- */
const PLOTS = {};
function decimate(t, v, v2, max = 3000) {
  if (t.length <= max) return [Array.from(t), Array.from(v), v2 ? Array.from(v2) : null];
  const b = Math.ceil(t.length / (max / 2)); const T = [], V = [], V2 = v2 ? [] : null;
  for (let i = 0; i < t.length; i += b) { let mi = i, ma = i; for (let j = i; j < Math.min(t.length, i + b); j++) { if (v[j] < v[mi]) mi = j; if (v[j] > v[ma]) ma = j; } const [a, c] = mi < ma ? [mi, ma] : [ma, mi]; T.push(t[a], t[c]); V.push(v[a], v[c]); if (V2) V2.push(v2[a], v2[c]); }
  return [T, V, V2];
}
function drawPlot(key, el, t, v, v2, unit, bands) {
  if (!window.uPlot) { el.innerHTML = `<p class="hint">No se pudo cargar la biblioteca de gráficas.</p>`; return; }
  const [T, V, V2] = decimate(t, v, v2);
  const w = Math.max(280, el.clientWidth || el.parentElement.clientWidth - 16);
  const data = [T, V]; const series = [{}, { label: unit === "A" ? "Corriente (A)" : "CH1 (V)", stroke: css("--info"), width: 1.6 }];
  if (V2) { data.push(V2); series.push({ label: "CH2 (V)", stroke: css("--ok"), width: 1.6 }); }
  (bands || []).forEach(b => { data.push(T.map(() => b.v)); series.push({ label: b.l, stroke: css(b.c), width: 1, dash: [6, 5], points: { show: false } }); });
  const ax = { stroke: css("--ink-2"), grid: { stroke: css("--plot-grid"), width: 1 }, ticks: { stroke: css("--plot-grid") }, font: "12px IBM Plex Mono, monospace" };
  const opts = { width: w, height: Math.min(360, Math.max(220, Math.round(w * 0.42))), series, scales: { x: { time: false } }, legend: { show: true }, cursor: { drag: { x: true, y: false } },
    axes: [{ ...ax, values: (u, vals) => vals.map(fmtTime) }, { ...ax, values: (u, vals) => vals.map(x => x.toFixed(Math.abs(x) < 10 ? 1 : 0)), size: 52 }] };
  if (PLOTS[key]) { PLOTS[key].destroy(); }
  el.innerHTML = ""; PLOTS[key] = new uPlot(opts, data, el);
}

/* ---------- Pestaña de formas de onda ---------- */
let WAVE = null;
function sigById(id) { return DATA.senales.find(s => s.id === id); }
function updateCfg() {
  const s = sigById($("#wSig").value); if (!s) return;
  const eq = MYEQ.has("osc4") ? "Hantek 6074BE (4 canales)" : (MYEQ.has("osc2") ? "Hantek 6022BE / FNIRSI 2C53P / 1013D" : "tu osciloscopio");
  $("#wCfg").innerHTML = `<div class="lbl">Configuración sugerida para ${esc(eq)}</div><p class="mono">${esc(s.vdiv)} · ${esc(s.tdiv)} · disparo: ${esc(s.trig)} · ${esc(s.acople)}</p><p class="hint">Bien: ${esc(s.bien)}</p>${hasOsc() ? "" : `<p class="hint"><span class="pill warn">Sin osciloscopio marcado</span> Puedes practicar con los ejemplos.</p>`}`;
}
function loadSample(bad) { const s = sigById($("#wSig").value); const g = synth(s.id, bad); WAVE = { sig: s, t: g.t, v: g.v, v2: g.v2, unit: g.unit, name: `Ejemplo sintético ${bad ? "con falla" : "correcto"}: ${s.n}` }; $("#wFileInfo").textContent = WAVE.name + " (no es una medición real)."; $("#wCsvOpts").hidden = true; plotWave(); }
function plotWave() {
  if (!WAVE || $("#v-ondas").hidden) return;
  const s = sigById($("#wSig").value) || WAVE.sig; WAVE.sig = s;
  const bands = [];
  if (s.digital || s.suave) { bands.push({ v: s.vmax[0], l: "Alto mín.", c: "--warn" }, { v: s.vmin[1], l: "Bajo máx.", c: "--bad" }); }
  drawPlot("wave", $("#wPlot"), WAVE.t, WAVE.v, WAVE.v2, WAVE.unit, bands);
  $("#wScopeL").textContent = WAVE.v2 ? "CH1 + CH2" : "CH1"; $("#wScopeR").textContent = WAVE.name;
  let refT = null; if (s.id === "ckp_cmp" && WAVE.name.startsWith("Ejemplo")) { const g = synth("ckp_cmp", false); const ar = analyze(s, g.t, g.v, g.v2, null); const m = ar.M.find(x => x[0] === "CMP tras hueco"); if (m) refT = parseFloat(m[1]); }
  const a = analyze(s, WAVE.t, WAVE.v, WAVE.v2, refT);
  $("#wSema").dataset.s = a.st;
  $("#wMetrics").innerHTML = a.M.map(([k, v]) => `<div class="metric"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("");
  const fam = Object.entries(DATA.familias).find(([k, f]) => DATA.dtc.some(d => d.osc === s.id && d.f === k));
  const cls = fam ? DATA.familias[fam[0]].clase : 9;
  const next = a.st === "ok" ? ["Guarda la captura en la carpeta del vehículo e inclúyela en el informe.", "Si el síntoma persiste, mide la señal en el conector del módulo para descartar el cableado."] : s.fallas;
  $("#wVerdict").innerHTML = `<div class="result ${a.st}"><strong>${a.st === "ok" ? "Señal dentro de lo esperado" : a.st === "warn" ? "Revisar: hay detalles fuera de lo típico" : "Falla probable"}</strong><ul>${a.C.map(c => `<li><span class="pill ${c.s}">${c.s === "ok" ? "OK" : c.s === "warn" ? "Revisar" : "Falla"}</span> ${esc(c.m)}</li>`).join("")}</ul><div><div class="lbl">Siguiente paso</div><ul>${next.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div><p class="hint">Valores típicos; verifique con el manual del fabricante. Lo vemos completo en la ${esc(claseName(cls))}.</p></div>`;
  const txt = `Análisis de ${s.n} (${WAVE.name}): ${a.st === "ok" ? "OK" : a.st === "warn" ? "REVISAR" : "FALLA"}. ` + a.M.map(m => m.join(": ")).join("; ") + ". " + a.C.map(c => c.m).join(" ");
  $("#wVerdict")._text = txt; $("#wWa").href = wa(`Hola, analicé mi señal en el Laboratorio Stellantis. ${txt}`);
}
/* CSV */
function parseCSV(text) {
  const res = Papa.parse(text, { skipEmptyLines: true, dynamicTyping: false });
  const rows = res.data.map(r => r.map(c => String(c).trim()));
  const isNum = c => c !== "" && !isNaN(+c.replace(",", "."));
  let start = rows.findIndex((r, i) => r.filter(isNum).length >= 1 && rows[i + 1] && rows[i + 1].filter(isNum).length >= 1 && r.filter(isNum).length === rows[i + 1].filter(isNum).length);
  if (start < 0) throw new Error("No encontré columnas numéricas en el archivo.");
  const header = start > 0 ? rows[start - 1] : rows[start].map((_, i) => "Col " + (i + 1));
  const body = rows.slice(start).filter(r => r.some(isNum));
  const ncol = Math.max(...body.slice(0, 20).map(r => r.length));
  const cols = Array.from({ length: ncol }, (_, j) => Float64Array.from(body.map(r => +(String(r[j] ?? "").replace(",", ".")))));
  return { header: Array.from({ length: ncol }, (_, j) => header[j] || "Col " + (j + 1)), cols };
}
let CSVD = null;
function useCSV() {
  const { header, cols } = CSVD; const scale = +$("#wScale").value;
  const timeIdx = header.findIndex(h => /time|tiempo|^t\b|seg|^s$/i.test(h));
  let tI = timeIdx;
  if (tI < 0 && cols.length > 1) { const c = cols[0]; let mono = true; for (let i = 1; i < Math.min(c.length, 200); i++) if (!(c[i] > c[i - 1])) { mono = false; break; } if (mono) tI = 0; }
  const chOpts = header.map((h, i) => i).filter(i => i !== tI);
  const sel = $("#wCol"); if (!sel.options.length || sel._for !== CSVD) { sel.innerHTML = chOpts.map(i => `<option value="${i}">${esc(header[i])}</option>`).join(""); sel._for = CSVD; }
  const ch = +sel.value; let t;
  if (tI >= 0) { const h = header[tI]; let k = /\bns\b|\(ns\)/i.test(h) ? 1e-9 : /µs|us\b|\(us\)/i.test(h) ? 1e-6 : /ms\b|\(ms\)/i.test(h) ? 1e-3 : 1; t = cols[tI].map(x => x * k); }
  else { const dt = +$("#wDt").value * +$("#wDtU").value; t = cols[ch].map((_, i) => i * dt); }
  const v = cols[ch].map(x => x * scale); const ok = []; for (let i = 0; i < v.length; i++) if (isFinite(v[i]) && isFinite(t[i])) ok.push(i);
  const second = chOpts.find(i => i !== ch);
  WAVE = { sig: sigById($("#wSig").value), t: Float64Array.from(ok.map(i => t[i] - t[ok[0]])), v: Float64Array.from(ok.map(i => v[i])), v2: (sigById($("#wSig").value).id.match(/can|ckp_cmp/) && second != null) ? Float64Array.from(ok.map(i => cols[second][i] * scale)) : null, unit: "V", name: CSVD.name };
  $("#wFileInfo").textContent = `${CSVD.name}: ${ok.length.toLocaleString("es-MX")} muestras · columna de tiempo: ${tI >= 0 ? header[tI] : "no encontrada (se usa el intervalo)"}`;
  plotWave();
}
function handleFile(file) {
  if (!file) return;
  if (/\.(png|jpe?g|bmp|webp)$/i.test(file.name) || /^image\//.test(file.type)) { const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { DIG.img = img; DIG.rect = null; DIG.color = null; DIG.zero = null; setupDigit(); $("#digPanel").hidden = false; $("#digPanel").scrollIntoView({ behavior: "smooth", block: "start" }); }; img.src = url; $("#wFileInfo").textContent = `Imagen: ${file.name}. Sigue los 3 pasos para digitalizarla.`; return; }
  const fr = new FileReader(); fr.onload = () => { try { CSVD = parseCSV(fr.result); CSVD.name = file.name; $("#wCsvOpts").hidden = false; $("#wCol").innerHTML = ""; useCSV(); } catch (e) { $("#wFileInfo").textContent = "No se pudo leer el archivo: " + e.message + " Exporta en CSV con columnas de tiempo y voltaje."; } }; fr.readAsText(file);
}
/* Digitalizador de capturas */
const DIG = { img: null, mode: "rect", rect: null, color: null, zero: null, drag: null };
function setupDigit() { const c = $("#digCanvas"); c.width = DIG.img.naturalWidth; c.height = DIG.img.naturalHeight; c.style.width = Math.min(DIG.img.naturalWidth, $(".digit-wrap").clientWidth || 900) + "px"; drawDigit(); setMode("rect"); }
function setMode(m) { DIG.mode = m; $$("#digPanel [data-mode]").forEach(b => b.classList.toggle("btn-acc", b.dataset.mode === m)); $("#digStep").textContent = m === "rect" ? "Paso 1: arrastra un rectángulo sobre la cuadrícula (de borde a borde)" : m === "color" ? "Paso 2: toca la línea de la señal para tomar su color" : "Paso 3: toca la línea de 0 V (marcador de tierra del canal)"; }
function drawDigit() {
  const c = $("#digCanvas"), x = c.getContext("2d"); x.drawImage(DIG.img, 0, 0);
  const lw = Math.max(2, c.width / 400);
  if (DIG.rect) { const r = DIG.rect; x.strokeStyle = "#FFC20E"; x.lineWidth = lw; x.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); const dx = +$("#dDivX").value || 10, dy = +$("#dDivY").value || 8; x.globalAlpha = .35; for (let i = 1; i < dx; i++) { const xx = r.x0 + (r.x1 - r.x0) * i / dx; x.beginPath(); x.moveTo(xx, r.y0); x.lineTo(xx, r.y1); x.stroke(); } for (let i = 1; i < dy; i++) { const yy = r.y0 + (r.y1 - r.y0) * i / dy; x.beginPath(); x.moveTo(r.x0, yy); x.lineTo(r.x1, yy); x.stroke(); } x.globalAlpha = 1; }
  if (DIG.zero != null && DIG.rect) { x.strokeStyle = "#E5484D"; x.setLineDash([10, 6]); x.lineWidth = lw; x.beginPath(); x.moveTo(DIG.rect.x0, DIG.zero); x.lineTo(DIG.rect.x1, DIG.zero); x.stroke(); x.setLineDash([]); }
}
function canvasPt(e) { const c = $("#digCanvas"), b = c.getBoundingClientRect(); return { x: (e.clientX - b.left) * c.width / b.width, y: (e.clientY - b.top) * c.height / b.height }; }
function digitize() {
  if (!DIG.img || !DIG.rect || !DIG.color) { toast("Completa los pasos 1 y 2"); return; }
  const c = $("#digCanvas"), x = c.getContext("2d"); x.drawImage(DIG.img, 0, 0);
  const r = DIG.rect, W = Math.round(r.x1 - r.x0), H = Math.round(r.y1 - r.y0); const d = x.getImageData(Math.round(r.x0), Math.round(r.y0), W, H).data;
  const [cr, cg, cb] = DIG.color; const tol = 70; const ys = [];
  for (let i = 0; i < W; i++) { const hit = []; for (let j = 0; j < H; j++) { const k = (j * W + i) * 4; const dist = Math.abs(d[k] - cr) + Math.abs(d[k + 1] - cg) + Math.abs(d[k + 2] - cb); if (dist < tol) hit.push(j); } ys.push(hit.length ? median(hit) : NaN); }
  for (let i = 0; i < ys.length; i++) if (isNaN(ys[i])) { let a = i - 1; while (a >= 0 && isNaN(ys[a])) a--; let b = i + 1; while (b < ys.length && isNaN(ys[b])) b++; ys[i] = a >= 0 && b < ys.length ? ys[a] + (ys[b] - ys[a]) * (i - a) / (b - a) : (a >= 0 ? ys[a] : ys[b]); }
  const dx = +$("#dDivX").value, dy = +$("#dDivY").value, vdiv = +$("#dVdiv").value, tdiv = +$("#dTdiv").value * +$("#dTu").value;
  const y0 = (DIG.zero != null ? DIG.zero : (r.y0 + r.y1) / 2) - r.y0;
  const t = Float64Array.from(ys.map((_, i) => i / (W / dx) * tdiv)); const v = Float64Array.from(ys.map(y => (y0 - y) / (H / dy) * vdiv));
  if (v.some(n => isNaN(n))) { toast("No encontré la traza con ese color: toca de nuevo sobre la línea de la señal"); drawDigit(); return; }
  WAVE = { sig: sigById($("#wSig").value), t, v, v2: null, unit: "V", name: "Captura digitalizada" }; drawDigit(); plotWave(); $("#wPlot").scrollIntoView({ behavior: "smooth", block: "center" });
}
function initDigit() {
  const c = $("#digCanvas");
  $$("#digPanel [data-mode]").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  c.addEventListener("pointerdown", e => { if (!DIG.img) return; const p = canvasPt(e); if (DIG.mode === "rect") { DIG.drag = p; c.setPointerCapture(e.pointerId); } else if (DIG.mode === "color") { const px = c.getContext("2d").getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data; DIG.color = [px[0], px[1], px[2]]; $("#dColor").textContent = `Color de traza: rgb(${px[0]}, ${px[1]}, ${px[2]})`; $("#dColor").style.borderColor = `rgb(${px[0]},${px[1]},${px[2]})`; setMode("zero"); } else { DIG.zero = p.y; drawDigit(); } });
  c.addEventListener("pointermove", e => { if (DIG.mode === "rect" && DIG.drag) { const p = canvasPt(e); DIG.rect = { x0: Math.min(DIG.drag.x, p.x), y0: Math.min(DIG.drag.y, p.y), x1: Math.max(DIG.drag.x, p.x), y1: Math.max(DIG.drag.y, p.y) }; drawDigit(); } });
  c.addEventListener("pointerup", () => { if (DIG.mode === "rect" && DIG.drag) { DIG.drag = null; if (DIG.rect && DIG.rect.x1 - DIG.rect.x0 > 20) setMode("color"); } });
  ["dDivX", "dDivY"].forEach(id => $("#" + id).addEventListener("input", () => DIG.img && drawDigit()));
  $("#dGo").addEventListener("click", digitize);
  $("#dOcr").addEventListener("click", async () => {
    if (!DIG.img) return; $("#dOcrOut").textContent = "Cargando OCR…";
    try {
      if (!window.Tesseract) await new Promise((ok, ko) => { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"; s.onload = ok; s.onerror = () => ko(new Error("sin conexión")); document.head.appendChild(s); });
      const r = await Tesseract.recognize($("#digCanvas"), "eng"); const txt = r.data.text || "";
      const vs = [...txt.matchAll(/(\d+(?:[.,]\d+)?)\s*(mV|V)(?:\/div)?/g)].map(m => m[0]); const ts = [...txt.matchAll(/(\d+(?:[.,]\d+)?)\s*(ns|us|µs|ms|s)(?:\/div)?\b/g)].map(m => m[0]);
      $("#dOcrOut").textContent = `Escalas detectadas · voltaje: ${vs.slice(0, 4).join(", ") || "—"} · tiempo: ${ts.slice(0, 4).join(", ") || "—"}. Verifícalas y escríbelas arriba.`;
    } catch (e) { $("#dOcrOut").textContent = "No se pudo usar el OCR (" + e.message + "). Escribe las escalas a mano."; }
  });
}

/* ---------- Códigos ---------- */
let FUSE = null;
function renderCodes() {
  const q = $("#cQ").value.trim();
  let list;
  if (!q) list = DATA.dtc.slice(0, 12);
  else { const exact = dtcLookup(q); list = FUSE ? FUSE.search(q, { limit: 12 }).map(r => r.item) : DATA.dtc.filter(d => (d.c + d.d).toLowerCase().includes(q.toLowerCase())).slice(0, 12); if (exact && !exact.known && /^[PBCU][0-9A-F]{4}/i.test(q)) list = [exact, ...list]; else if (exact && exact.known) list = [exact, ...list.filter(d => d.c !== exact.c)]; }
  $("#cList").innerHTML = list.length ? list.map(d => { const f = DATA.familias[d.f]; const s = d.osc ? sigById(d.osc) : null; return `<article class="panel"><div class="panel-h"><h3 class="mono">${esc(d.c)}</h3><span class="pill info">${esc(f.n)}</span></div><p><strong>${esc(d.d)}</strong></p><div><div class="lbl">Causas probables</div><ul>${d.causas.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div><div><div class="lbl">Datos en vivo</div><p>${d.pids.map(esc).join(" · ")}</p></div>${s ? `<div><div class="lbl">Forma de onda</div><p class="mono">${esc(s.n)} · ${esc(s.vdiv)} · ${esc(s.tdiv)}</p></div>` : ""}<div><div class="lbl">Equipo esencial</div>${f.esencial.map(toolTag).join("")}</div>${d.sgw ? `<p class="hint">En 2018+, borrar o activar requiere AutoAuth.</p>` : ""}<p class="hint">${esc(claseName(f.clase))}</p><button class="btn btn-line btn-sm" type="button" data-use="${esc(d.c)}">Usar en el asistente</button></article>`; }).join("") : `<p>Sin resultados.</p>`;
  $$("#cList [data-use]").forEach(b => b.addEventListener("click", () => { $("#aDtc").value = b.dataset.use; $("#aSintoma").value = ""; runAsistente(); location.hash = "asistente"; }));
}

/* ---------- Datos en vivo ---------- */
const PEX = { rpm: 720, ect: 92, iat: 34, map: 30, baro: 81, stft: 9, ltft: 17, volt: 14.1, tps: 12, ipw: 3.1, spark: 12, o2v: 0.45, fuelp: 395 };
function baroAt(h) { return 101.325 * Math.pow(1 - 2.25577e-5 * h, 5.25588); }
function renderPForm() { $("#pForm").innerHTML = DATA.pids.map(p => `<div class="field"><label for="p_${p.id}">${esc(p.n)} (${esc(p.u)})</label><input id="p_${p.id}" type="number" step="any" value="${PEX[p.id] ?? ""}"></div>`).join(""); }
function runPids() {
  const val = id => { const x = $("#p_" + id); return x && x.value !== "" ? +x.value : null; };
  const alt = +$("#pAlt").value || 0; const be = baroAt(alt);
  const rows = DATA.pids.map(p => { const v = val(p.id); let s = "info", note = p.nota; let min = p.min, max = p.max;
    if (p.id === "baro") { min = be - 5; max = be + 5; note = `Esperado ≈ ${be.toFixed(0)} kPa a ${alt} m.`; }
    if (p.id === "map") { min = be * 0.22; max = be * 0.45; note = `Típico en ralentí: ${(be * 0.22).toFixed(0)}–${(be * 0.45).toFixed(0)} kPa a tu altitud.`; }
    if (v != null) s = (v >= min && v <= max) ? "ok" : "warn";
    return { p, v, s, note, min, max }; });
  const fx = []; const st = val("stft"), lt = val("ltft");
  if (st != null && lt != null) { const tot = st + lt; if (tot > 15) fx.push(["bad", `Ajuste total +${tot.toFixed(0)}%: el PCM agrega combustible (mezcla pobre). Revise fugas de vacío (humo), presión de combustible e inyectores. Si mejora a 2,500 RPM, sospeche una fuga de vacío. Posible P0171.`]); else if (tot < -15) fx.push(["bad", `Ajuste total ${tot.toFixed(0)}%: mezcla rica. Revise inyector que gotea, presión alta y purga EVAP. Posible P0172.`]); else fx.push(["ok", `Ajuste total ${tot >= 0 ? "+" : ""}${tot.toFixed(0)}%: dentro de ±15%.`]); }
  const ect = val("ect"); if (ect != null && ect < 80) fx.push(["warn", "Temperatura del refrigerante baja con el motor caliente: revise el termostato (P0128) y el ECT."]);
  const b = val("baro"); if (b != null && Math.abs(b - be) > 5) fx.push(["warn", `La presión barométrica (${b} kPa) no coincide con tu altitud (≈ ${be.toFixed(0)} kPa): revise el MAP o el sensor barométrico.`]);
  const m = val("map"); if (m != null && b != null && m / b > 0.55) fx.push(["warn", "MAP alto en ralentí (poco vacío): fuga grande, sincronía de distribución, EGR o carga en el motor."]);
  const vo = val("volt"); if (vo != null) { if (vo < 13) fx.push(["bad", "Voltaje de carga bajo: compare contra el voltaje objetivo y revise el campo, el alternador y el IBS (Clase 10)."]); else if (vo > 15) fx.push(["bad", "Voltaje de carga alto: revise el control del campo y el IBS."]); }
  $("#pOut").innerHTML = `<div class="panel-h"><h3>Interpretación</h3><div class="sema" data-s="${fx.some(f => f[0] === "bad") ? "bad" : fx.some(f => f[0] === "warn") || rows.some(r => r.s === "warn") ? "warn" : "ok"}"><i></i><i></i><i></i></div></div>
  <div class="result ${fx.some(f => f[0] === "bad") ? "bad" : fx.some(f => f[0] === "warn") ? "warn" : "ok"}"><ul>${fx.map(f => `<li><span class="pill ${f[0]}">${f[0] === "ok" ? "OK" : f[0] === "warn" ? "Revisar" : "Falla"}</span> ${esc(f[1])}</li>`).join("") || "<li>Escribe valores para interpretarlos.</li>"}</ul></div>
  <div class="tbl-wrap"><table><thead><tr><th>Dato</th><th>Valor</th><th>Típico</th><th>Estado</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.p.n)}<div class="hint">${esc(r.note)}</div></td><td class="num">${r.v == null ? "—" : r.v + " " + esc(r.p.u)}</td><td class="num">${fmt(r.min, r.p.u === "V" ? 1 : 0)}–${fmt(r.max, r.p.u === "V" ? 1 : 0)}</td><td>${r.v == null ? "" : `<span class="pill ${r.s}">${r.s === "ok" ? "OK" : "Revisar"}</span>`}</td></tr>`).join("")}</tbody></table></div><p class="hint">Rangos típicos de referencia; verifique con el manual del fabricante. Valores precargados: ejemplo ilustrativo.</p>`;
}
function pidCSV(file) {
  const fr = new FileReader(); fr.onload = () => { try { const { header, cols } = parseCSV(fr.result); const fz = window.Fuse ? new Fuse(DATA.pids.map(p => ({ id: p.id, k: p.alias.join(" ") + " " + p.n })), { keys: ["k"], threshold: 0.4 }) : null; let n = 0;
    header.forEach((h, j) => { const hl = h.toLowerCase(); let p = DATA.pids.find(p => p.alias.some(a => hl.includes(a))); if (!p && fz) { const r = fz.search(h)[0]; if (r) p = DATA.pids.find(x => x.id === r.item.id); } if (p) { const arr = Array.from(cols[j]).filter(isFinite); if (arr.length) { $("#p_" + p.id).value = (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2); n++; } } });
    toast(`Se reconocieron ${n} datos del registro (promedios)`); runPids(); } catch (e) { toast("No se pudo leer el registro: " + e.message); } }; fr.readAsText(file);
}

/* ---------- Redes ---------- */
function runNet() {
  const tipo = $("#nTipo").value, R = parseFloat($("#nR").value), H = parseFloat($("#nH").value), L = parseFloat($("#nL").value), v16 = parseFloat($("#n16").value), g = parseFloat($("#n45").value), lh = parseFloat($("#nLinHi").value), ll = parseFloat($("#nLinLo").value);
  const out = []; const add = (s, m) => out.push([s, m]);
  if (isFinite(v16)) add(v16 >= 12 ? "ok" : v16 >= 11 ? "warn" : "bad", `Terminal 16: ${v16} V ${v16 >= 12 ? "(correcto)" : "(baja: revise el fusible y la batería)"}.`);
  if (isFinite(g)) add(g <= 0.1 ? "ok" : "warn", `Tierras 4/5: caída de ${g} V ${g <= 0.1 ? "(correcta)" : "(alta: limpie y apriete la tierra del DLC)"}.`);
  if (tipo === "b") add("info", "CAN B tolerante a fallas: la terminación está repartida en los módulos; no aplica la regla de 60 Ω. Sus niveles de voltaje son distintos a los de CAN C: compare con el diagrama del modelo.");
  else {
    if (!isFinite(R)) add("info", "Escribe la resistencia medida con la batería desconectada.");
    else if (R < 10) add("bad", `${R} Ω: CAN H en corto con CAN L. Aísle desconectando módulos y tramos.`);
    else if (R < 50) add("warn", `${R} Ω: más de dos terminaciones o un módulo con resistencia en paralelo (accesorio instalado o módulo incorrecto).`);
    else if (R <= 70) add("ok", `${R} Ω: terminación correcta (≈ 60 Ω).`);
    else if (R < 105) add("warn", `${R} Ω: valor intermedio; terminación dañada o resistencia de conexión. Verifique en el diagrama.`);
    else if (R <= 140) add("bad", `${R} Ω: falta una terminación o hay un tramo abierto hacia un extremo de la red.`);
    else add("bad", `${R} Ω: circuito abierto en el punto medido (o la red del DLC solo llega al gateway).`);
    if (isFinite(H) && isFinite(L)) {
      if (H > 9) add("bad", "CAN H cerca de voltaje de batería: corto a B+."); else if (H < 0.6) add("bad", "CAN H cerca de 0 V: corto a tierra.");
      if (L > 9) add("bad", "CAN L cerca de voltaje de batería: corto a B+."); else if (L < 0.6) add("bad", "CAN L cerca de 0 V: corto a tierra.");
      if (H >= 0.6 && H <= 9 && L >= 0.6 && L <= 9) {
        if (Math.abs(H - L) < 0.03 && Math.abs(H - 2.5) < 0.3) add("warn", "CAN H y CAN L iguales cerca de 2.5 V: red sin tráfico (dormida o sin encendido) o H y L en corto.");
        else if (H >= 2.5 && H <= 3.1 && L >= 1.9 && L <= 2.5) add("ok", `CAN H ${H} V y CAN L ${L} V: niveles promedio correctos.`);
        else add("warn", `CAN H ${H} V y CAN L ${L} V fuera del promedio típico (H ≈ 2.6 V, L ≈ 2.4 V): revise con osciloscopio.`);
        if (Math.abs(H + L - 5) > 0.6) add("warn", `La suma H + L (${(H + L).toFixed(2)} V) se aleja de 5 V: posible desplazamiento de tierra o módulo que distorsiona la red.`);
      }
    }
  }
  if (isFinite(lh)) add(lh >= 10.5 && lh <= 15 ? "ok" : "bad", `LIN en reposo ${lh} V ${lh >= 10.5 ? "(correcto, cerca del voltaje de batería)" : "(bajo: corto a tierra o maestro sin alimentación)"}.`);
  if (isFinite(ll)) add(ll <= 2.5 ? "ok" : "warn", `LIN nivel bajo ${ll} V ${ll <= 2.5 ? "(correcto)" : "(no llega a casi 0 V: revise tierras)"}.`);
  const st = out.some(o => o[0] === "bad") ? "bad" : out.some(o => o[0] === "warn") ? "warn" : "ok";
  $("#nOut").innerHTML = `<div class="panel-h"><h3>Interpretación</h3><div class="sema" data-s="${st}"><i></i><i></i><i></i></div></div><div class="result ${st}"><ul>${out.map(o => `<li><span class="pill ${o[0]}">${o[0] === "ok" ? "OK" : o[0] === "warn" ? "Revisar" : o[0] === "bad" ? "Falla" : "Nota"}</span> ${esc(o[1])}</li>`).join("")}</ul></div><p class="hint">Siguiente paso: captura CAN H y CAN L en dos canales y súbela al analizador. Lo vemos completo en la ${esc(claseName(4))}.</p>`;
}

/* ---------- Diagramas ---------- */
function renderAtlas() {
  $("#atlas").innerHTML = DATA.diagramas.map((d, i) => `<button type="button" data-i="${i}" aria-label="Ampliar diagrama ${esc(d.n)}">${d.svg}<strong>${String(i + 1).padStart(2, "0")} · ${esc(d.n)}</strong><span class="hint">${esc(claseName(d.clase))}</span></button>`).join("");
  $$("#atlas button").forEach(b => b.addEventListener("click", () => { const d = DATA.diagramas[+b.dataset.i]; $("#dlgT").textContent = d.n; $("#dlgB").innerHTML = d.svg; const dl = $("#dlg"); if (dl.showModal) dl.showModal(); else dl.setAttribute("open", ""); }));
  $("#dlgX").addEventListener("click", () => $("#dlg").close ? $("#dlg").close() : $("#dlg").removeAttribute("open"));
  $("#nDlc").innerHTML = DATA.diagramas[0].svg;
  $("#srcList").innerHTML = DATA.fuentesDiag.map(f => `<li><a href="${esc(f[1])}" target="_blank" rel="noopener">${esc(f[0])}</a> · ${esc(f[2])}</li>`).join("");
}

/* ---------- Equipo ---------- */
function renderCoverage() {
  const rows = Object.entries(DATA.familias).map(([k, f]) => { const have = f.esencial.filter(id => MYEQ.has(id)).length; const p = Math.round(have / f.esencial.length * 100); return { f, p, miss: f.esencial.filter(id => !MYEQ.has(id)) }; });
  const missCount = {}; rows.forEach(r => r.miss.forEach(id => missCount[id] = (missCount[id] || 0) + 1));
  const best = Object.entries(missCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  $("#eqCover").innerHTML = `<div class="panel-h"><h3>¿Qué fallas puedes diagnosticar hoy?</h3>${best.length ? `<span class="hint">Compra que más trabajos abre: <strong>${esc(eqName(best[0][0]))}</strong> (${best[0][1]} tipos de falla)</span>` : `<span class="pill ok">Equipo completo</span>`}</div>
  <div class="tbl-wrap"><table><thead><tr><th>Tipo de falla</th><th>Cobertura</th><th>Te falta</th><th>Clase</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.f.n)}</td><td><span class="pill ${r.p === 100 ? "ok" : r.p >= 50 ? "warn" : "bad"}">${r.p}%</span></td><td>${r.miss.map(toolTag).join("") || "—"}</td><td class="num">${r.f.clase}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderEqTable() {
  $("#eqTable").innerHTML = `<thead><tr><th>Tengo</th><th>Equipo</th><th>Ejemplos</th><th>Para qué sirve</th><th>Precio de referencia</th></tr></thead><tbody>${DATA.equipos.map(e => `<tr><td><input type="checkbox" aria-label="Tengo ${esc(e.n)}" data-eq="${e.id}" ${MYEQ.has(e.id) ? "checked" : ""}></td><td><strong>${esc(e.n)}</strong></td><td>${esc(e.ej)}</td><td>${esc(e.para)}</td><td>${esc(e.precio)}</td></tr>`).join("")}</tbody>`;
  $$("#eqTable [data-eq]").forEach(i => i.addEventListener("change", () => { i.checked ? MYEQ.add(i.dataset.eq) : MYEQ.delete(i.dataset.eq); store.set("eq", [...MYEQ]); renderEquipo(); renderCoverage(); runAsistente(); updateCfg(); }));
}

/* ---------- Referencias ---------- */
function renderRef() {
  if ($("#v-referencias").hidden) return;
  const s = sigById($("#rSig").value), bad = $("#rMode").value === "bad"; const g = synth(s.id, bad);
  drawPlot("ref", $("#rPlot"), g.t, g.v, g.v2, g.unit, []);
  $("#rL").textContent = `${s.n} · ${bad ? "con falla típica" : "en buen estado"}`; $("#rR").textContent = "Señal sintética de referencia";
  const dtcs = DATA.dtc.filter(d => d.osc === s.id).map(d => d.c);
  $("#rInfo").innerHTML = `<div class="callout"><div class="lbl">Configuración sugerida</div><p class="mono">${esc(s.vdiv)} · ${esc(s.tdiv)}<br>Disparo: ${esc(s.trig)}<br>${esc(s.acople)}</p></div><div class="callout"><div class="lbl">${bad ? "Fallas típicas" : "Cómo se ve bien"}</div>${bad ? `<ul>${s.fallas.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : `<p>${esc(s.bien)}</p>`}${dtcs.length ? `<p class="hint">Códigos relacionados: ${dtcs.join(", ")}</p>` : ""}</div>`;
}

/* ---------- Tema ---------- */
function initTheme() { const t = store.get("theme", null); if (t) document.documentElement.dataset.theme = t; $("#themeBtn").addEventListener("click", () => { const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); const nx = cur === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = nx; store.set("theme", nx); plotWave(); renderRef(); }); }

/* ---------- Inicio ---------- */
function init() {
  buildTabs(); initTheme(); renderEquipo();
  $("#aSintoma").innerHTML += DATA.sintomas.map(s => `<option value="${s.arbol}">${esc(s.t)}</option>`).join("");
  ["aGo"].forEach(id => $("#" + id).addEventListener("click", runAsistente));
  ["aAnio", "aMarca", "aModelo", "aSintoma"].forEach(id => $("#" + id).addEventListener("change", runAsistente));
  $("#aDtc").addEventListener("keydown", e => { if (e.key === "Enter") { $("#aSintoma").value = ""; runAsistente(); } });
  $("#aCopy").addEventListener("click", () => copy($("#aOut")._text || $("#aOut").innerText));
  const cta = $("#ctaTop"); cta.textContent = `Escribe ${CONFIG.palabra} por WhatsApp`; cta.href = wa(`Hola, quiero información del curso Diagnóstico Stellantis Pro. ${CONFIG.palabra}`);
  $("#fPrecio").textContent = CONFIG.precio; $("#fAviso").textContent = DATA.aviso;
  // Formas de onda
  $("#wSig").innerHTML = DATA.senales.map(s => `<option value="${s.id}">${esc(s.n)}</option>`).join("");
  $("#wSig").addEventListener("change", () => { updateCfg(); if (WAVE && WAVE.name.startsWith("Ejemplo")) loadSample(WAVE.name.includes("falla")); else plotWave(); });
  $("#wSampleOk").addEventListener("click", () => loadSample(false)); $("#wSampleBad").addEventListener("click", () => loadSample(true));
  const drop = $("#wDrop"); ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); })); ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => handleFile(e.dataTransfer.files[0])); $("#wFile").addEventListener("change", e => handleFile(e.target.files[0]));
  ["wCol", "wDt", "wDtU", "wScale"].forEach(id => $("#" + id).addEventListener("change", () => CSVD && useCSV()));
  $("#wCopy").addEventListener("click", () => copy($("#wVerdict")._text || ""));
  initDigit(); updateCfg();
  WAVE = (() => { const s = DATA.senales[0]; const g = synth(s.id, false); return { sig: s, t: g.t, v: g.v, v2: g.v2, unit: g.unit, name: "Ejemplo sintético correcto: " + s.n }; })();
  // Códigos
  if (window.Fuse) FUSE = new Fuse(DATA.dtc, { keys: [{ name: "c", weight: 0.6 }, { name: "d", weight: 0.3 }, { name: "causas", weight: 0.1 }], threshold: 0.38, ignoreLocation: true });
  $("#cQ").addEventListener("input", renderCodes); renderCodes();
  // Datos
  renderPForm(); $("#pGo").addEventListener("click", runPids); $("#pAlt").addEventListener("change", runPids); $("#pFile").addEventListener("change", e => e.target.files[0] && pidCSV(e.target.files[0])); runPids();
  // Redes
  $("#nGo").addEventListener("click", runNet); runNet();
  renderAtlas(); renderCoverage(); renderEqTable();
  $("#rSig").innerHTML = DATA.senales.map(s => `<option value="${s.id}">${esc(s.n)}</option>`).join(""); ["rSig", "rMode"].forEach(id => $("#" + id).addEventListener("change", renderRef));
  runAsistente();
  window.addEventListener("hashchange", route); route();
  let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { plotWave(); renderRef(); }, 200); });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
