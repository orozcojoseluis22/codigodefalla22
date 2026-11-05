// Genera los bonos Word + PDF desde la fuente única
const path = require("path");
const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const S = require("../lib/curso");
const F = require("../../data/bono-fichas"), AR = require("../../data/arboles"), T = require("../../data/bonos-texto"), INV = require("../../data/investigacion");
const { cfg: C, clases } = S;
const B = (sub, file) => path.join(S.ROOT, "04_Bonos", sub, file);
const bono = (id) => S.oferta.bonos.find((b) => b.id === id);
const portada = (id, extra) => { const b = bono(id); return K.portada({ etiqueta: "Electrónica y Servicio · Bono del curso", titulo: b.nombre, subtitulo: b.formula, linea3: extra || `Curso: ${C.titulo}`, fecha: "Noviembre de 2026" }); };
const sem = { rojo: "🔴 ROJO", amarillo: "🟡 AMARILLO", verde: "🟢 VERDE" };
const jobs = [];
function job(file, ch, title) { jobs.push(K.build(file, ch, { title, header: title }).then((f) => toPdf(f))); }

// 01 Atlas
{ const ch = portada("atlas", "17 diagramas originales de sistemas típicos de motos");
  ch.push(K.h1("Cómo usar el atlas"));
  ch.push(...K.numbered(["Ubica el diagrama del sistema que vas a revisar (carga, encendido, arranque, luces, inyección).", "Sigue el camino de la corriente desde la batería hasta la tierra.", "Mide en los puntos de prueba marcados en amarillo (P1, P2…) y compara con el valor típico.", "Consigue siempre el diagrama del fabricante del modelo exacto: colores y pines cambian por modelo y año."]));
  ch.push(...K.callout("Aviso", ["Diagramas didácticos originales de Electrónica y Servicio, dibujados a partir de topologías típicas. No son copia de diagramas de fabricantes. Los colores de cable mostrados siguen la convención típica de Honda (verde = tierra, negro = positivo de llave) y cambian en otras marcas."], K.COL.rojo));
  ch.push(K.h2("Índice de diagramas"));
  ch.push(K.table(["#", "Diagrama", "Clase"], S.diagramas.map((d) => [`D${String(d.n).padStart(2, "0")}`, d.titulo, String(d.clase)]), [900, 7300, 1160], { boldFirst: true }));
  S.diagramas.forEach((d) => {
    ch.push(K.pageBreak());
    ch.push(K.h1(`D${String(d.n).padStart(2, "0")} · ${d.titulo}`));
    ch.push(K.p(d.que));
    ch.push(K.image(S.diagramaPng(d.id), 6.5, { alt: d.titulo }));
    if (d.puntos.length) ch.push(K.table(["Punto", "Qué medir", "Valor típico (verificar)"], d.puntos, [1300, 4300, 3760], { boldFirst: true }));
    const c = clases[d.clase - 1]; ch.push(K.p(`Se estudia en la Clase ${c.n}: ${c.titulo}.`, { italics: true, color: K.COL.tenue, before: 120 }));
  });
  ch.push(K.pageBreak());
  const sec = INV.secciones.find((s) => s.titulo.startsWith("9."));
  ch.push(K.h1("Directorio de fuentes de diagramas oficiales"));
  sec.parrafos.forEach((t) => ch.push(K.p(t)));
  ch.push(K.table(sec.tabla.cols, sec.tabla.filas, sec.tabla.anchos, { boldFirst: true }));
  ch.push(K.h2("Enlaces útiles (consulta: 5 de noviembre de 2026)"));
  [["Zontes México · Manuales de propietario (incluyen diagrama)", "https://zontesmexico.com/wp-content/uploads/2024/09/Zontes-HYPERNAKED-200-U1-Manual-de-propietario.pdf"], ["Ricks Motorsport Electrics · Guía de prueba de estator", "https://ricksmotorsportelectrics.com/blog/?p=1928"], ["pinouts.ru · Conectores de diagnóstico de motos", "https://pinouts.ru/CarElectronics/honda_5_2_diagnostic.shtml"], ["Cyclepedia · Manuales de servicio en línea (de pago)", "https://www.cyclepedia.com"], ["Honda Chile · Tempario de motos (tiempos de mano de obra)", "https://motos.honda.cl/wp-content/uploads/2026/01/Tempario-2W-23-12-2024.pdf"]].forEach(([t, u]) => ch.push(K.link(t, u)));
  ch.push(K.p("Respeta los derechos de autor: usa los manuales en tu taller y no los revendas ni los publiques.", { italics: true, before: 120 }));
  job(B("01_Atlas_de_diagramas", "Atlas_MotoDiagrama.docx"), ch, "Atlas MotoDiagrama"); }

// 02 Fichas
{ const ch = portada("fichas", "16 fichas: sensores, actuadores y componentes");
  ch.push(K.h1("Cómo usar las fichas"));
  ch.push(...K.bullets(["Sensores y actuadores: nombre → función → fallas → DTCs → diagnóstico (multímetro, escáner, osciloscopio, Sens-22).", "Componentes: definición → función → fallas → pruebas (multímetro, escáner, osciloscopio, Sens-22).", F.nota, C.avisoValores]));
  F.fichas.forEach((f, i) => {
    ch.push(K.pageBreak());
    ch.push(K.titulo(`${String(i + 1).padStart(2, "0")}. ${f.nombre}`, { size: 34 }));
    ch.push(K.p(`${f.tipo === "componente" ? "Ficha técnica de componente" : f.tipo === "sensor" ? "Ficha de sensor" : "Ficha de actuador"} · Clase ${f.clase}`, { color: K.COL.tenue }));
    if (f.tipo === "componente") {
      ch.push(K.h2("Definición")); ch.push(K.p(f.definicion));
      ch.push(K.h2("Función")); ch.push(K.p(f.funcion));
      ch.push(K.h2("Fallas")); ch.push(...K.bullets(f.fallas));
      ch.push(K.h2("Pruebas")); ch.push(K.table(["Herramienta", "Prueba"], f.pruebas.map((p) => { const [a, ...r] = p.split(":"); return [a, r.join(":").trim()]; }), [2000, 7360], { boldFirst: true }));
    } else {
      ch.push(K.h2("Función")); ch.push(K.p(f.funcion));
      ch.push(K.h2("Fallas")); ch.push(...K.bullets(f.fallas));
      ch.push(K.h2("DTCs")); ch.push(...K.bullets(f.dtcs));
      ch.push(K.h2("Diagnóstico")); ch.push(K.table(["Herramienta", "Qué hacer"], [["Multímetro", f.multimetro], ["Escáner", f.escaner], ["Osciloscopio", f.osciloscopio], ["Sens-22", f.sens22]], [2000, 7360], { boldFirst: true }));
    }
  });
  job(B("02_Fichas_tecnicas", "Fichas_tecnicas_sensores_actuadores.docx"), ch, "Fichas técnicas de motos"); }

// 03 Árboles
{ const ch = portada("arboles", "6 rutas de prueba paso a paso");
  ch.push(K.h1("Cómo usar los árboles"));
  ch.push(...K.numbered(["Elige el síntoma que reporta el cliente.", "Empieza en el Paso 1 y haz la prueba indicada con el instrumento señalado.", "Si el resultado es el esperado, sigue la columna \"Sí\"; si no, la columna \"No\".", "Al llegar a un resultado, aplica las 3 recomendaciones y documenta con foto."]));
  AR.forEach((a) => {
    ch.push(K.pageBreak());
    ch.push(K.titulo(`Árbol: ${a.titulo}`, { size: 34 }));
    const ids = Object.keys(a.nodos); const num = (x) => (x.startsWith("F:") ? "Resultado: " + a.finales[x.slice(2)].diagnostico : "Paso " + (ids.indexOf(x) + 1));
    ch.push(K.table(["Paso", "Prueba y cómo medir", "Esperado", "Sí →", "No →"], ids.map((k, i) => { const n = a.nodos[k]; return [String(i + 1), `**${n.prueba}** ${n.como}`, n.esperado, num(n.si), num(n.no)]; }), [700, 3500, 1900, 1630, 1630], { boldFirst: true, size: 17 }));
    ch.push(K.h2("Resultados y recomendaciones"));
    Object.values(a.finales).forEach((f) => { ch.push(K.p(`**${sem[f.semaforo]} · ${f.diagnostico}** (Clase ${f.clase})`, { after: 40, keepNext: true })); ch.push(...K.bullets(f.recs)); });
  });
  ch.push(K.p(C.avisoValores, { italics: true, before: 160 }));
  job(B("03_Arboles_de_diagnostico", "Arboles_de_diagnostico.docx"), ch, "Árboles de diagnóstico"); }

// 04 Tabla de valores (Word/PDF; el Excel lo genera Python)
{ const ch = portada("valores", "Referencia rápida para la mesa de trabajo");
  const v = INV.secciones.find((s) => s.titulo.startsWith("2.")).tabla;
  ch.push(K.h1("Valores de referencia"));
  ch.push(K.table(v.cols, v.filas, v.anchos, { boldFirst: true }));
  ch.push(K.h1("Abreviaturas de colores de cables (típicas)"));
  ch.push(K.table(["Color", "Honda", "Yamaha", "Suzuki"], T.colores, [2200, 2400, 2400, 2360], { boldFirst: true }));
  ch.push(K.p(T.coloresNota, { italics: true }));
  const d = INV.secciones.find((s) => s.titulo.startsWith("3.")).tabla;
  ch.push(K.h1("Formas de leer fallas por fabricante"));
  ch.push(K.table(d.cols, d.filas, d.anchos, { boldFirst: true }));
  ch.push(K.h1("Códigos genéricos SAE útiles en motos con OBD"));
  ch.push(K.table(["Código", "Circuito"], [["P0105–P0108", "Sensor MAP"], ["P0110–P0113", "Sensor IAT"], ["P0115–P0118", "Sensor ECT"], ["P0120–P0123", "Sensor TPS"], ["P0130–P0135", "Sensor de oxígeno y calentador"], ["P0201", "Inyector cilindro 1"], ["P0230", "Circuito primario de bomba"], ["P0335–P0336", "Sensor CKP"], ["P0351", "Bobina A primario"], ["P0500", "Sensor de velocidad"], ["P0505", "Control de ralentí"], ["P0560–P0563", "Voltaje del sistema"]], [2400, 6960], { boldFirst: true }));
  ch.push(K.p(F.nota + " " + C.avisoValores, { italics: true }));
  job(B("04_Tabla_de_valores", "Tabla_de_valores_y_codigos.docx"), ch, "Tabla de valores y códigos"); }

// 06 Formatos
{ const ch = portada("formatos", "Formatos editables e imprimibles");
  const lineas = (n) => Array.from({ length: n }, () => K.p("_____________________________________________________________________________", { after: 60, color: "9AA3AD" }));
  ch.push(K.titulo("Orden de servicio eléctrico", { size: 36 }));
  ch.push(K.table(["Campo", "Datos"], T.formatos.orden.map((x) => [x, ""]), [3800, 5560], { boldFirst: true }));
  ch.push(K.p("☐ Acepto recibir por WhatsApp recordatorios y promociones (opcional). Aviso de privacidad: [enlace]", { before: 120 }));
  ch.push(K.p("Firma del cliente: ____________________     Recibió: ____________________"));
  ch.push(K.pageBreak());
  ch.push(K.titulo("Inspección eléctrica con semáforo", { size: 36 }));
  ch.push(K.p("Moto: ____________________  Folio: ________  Fecha: __________  Técnico: ______________"));
  ch.push(K.table(["Punto", "Valor típico", "Medido", "🟢", "🟡", "🔴"], T.formatos.inspeccion.map(([a, b]) => [a, b, "", "☐", "☐", "☐"]), [3000, 2500, 1600, 760, 740, 760], { boldFirst: true }));
  ch.push(K.p("Verde: está bien · Amarillo: atender pronto · Rojo: reparar hoy. Adjunta foto de cada medición.", { italics: true }));
  ch.push(K.pageBreak());
  ch.push(K.titulo("Presupuesto de 3 opciones", { size: 36 }));
  ch.push(K.p("Falla diagnosticada: ________________________________________________"));
  ch.push(K.table(["", "Básico", "Recomendado", "Premium"], [["Qué incluye", "", "", ""], ["Garantía", "", "", ""], ["Tiempo de entrega", "", "", ""], ["Precio (IVA incluido si aplica)", "$", "$", "$"], ["Autorizo (firma)", "☐", "☐", "☐"]], [2760, 2200, 2200, 2200], { boldFirst: true }));
  ch.push(K.p("Si durante la reparación se requiere un trabajo adicional, se solicitará nueva autorización antes de realizarlo.", { italics: true }));
  ch.push(K.pageBreak());
  ch.push(K.titulo("Garantía por escrito", { size: 36 }));
  ch.push(...K.bullets(T.formatos.garantia));
  ch.push(K.p("Folio: ________  Trabajo realizado: ___________________________________  Fecha de entrega: __________"));
  ch.push(K.p("Firma del taller: ____________________"));
  ch.push(K.pageBreak());
  ch.push(K.titulo("Aviso de privacidad breve", { size: 36 }));
  ch.push(...K.callout("Plantilla por revisar con asesor legal", T.formatos.aviso, K.COL.amarillo));
  ch.push(K.p("Basado en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares publicada en el DOF el 20 de marzo de 2025. Esta plantilla es orientativa y no sustituye asesoría legal.", { italics: true }));
  ch.push(K.pageBreak());
  ch.push(K.titulo("Hoja para reconstruir un diagrama", { size: 36 }));
  ch.push(K.table(["Color", "Conector", "Pin", "Función", "OFF", "ON", "Motor"], Array.from({ length: 14 }, () => ["", "", "", "", "", "", ""]), [1300, 1400, 800, 2560, 1100, 1100, 1100]));
  ch.push(K.pageBreak());
  ch.push(K.titulo("Método: del código a la pieza", { size: 36 }));
  ch.push(K.table(["Paso", "Qué anotar", "Resultado"], [["1. Código y cuadro congelado", "Código, rpm, temperatura, voltaje", ""], ["2. Circuito en el diagrama", "Pines de ECU, colores, conectores", ""], ["3. Alimentación", "Voltaje medido", ""], ["3. Tierra", "Caída de tensión", ""], ["3. Señal", "Valor o forma de onda", ""], ["4. Reparación y prueba", "Qué se reparó, código borrado, prueba de manejo", ""]], [3000, 3600, 2760], { boldFirst: true }));
  job(B("06_Formatos", "Kit_de_formatos_del_taller.docx"), ch, "Kit de formatos del taller"); }

// 07 Prompts
{ const ch = portada("prompts", "60 instrucciones listas para copiar");
  ch.push(K.h1("Reglas antes de usar la IA"));
  ch.push(...K.numbered(T.prompts.reglas));
  let n = 1;
  T.prompts.grupos.forEach((g) => { ch.push(K.h1(g.tema)); g.items.forEach((t) => { ch.push(K.p(`**Prompt ${n++}.** ${t}`, { after: 100 })); }); });
  ch.push(K.p("Herramientas sugeridas: ChatGPT, Gemini (incluye Gemini Live con cámara) y Claude. Disponibilidad y funciones cambian; verifica en cada aplicación.", { italics: true }));
  job(B("07_Prompts_IA", "Banco_de_60_prompts_IA.docx"), ch, "Banco de prompts de IA"); }

// 08 100 ideas
{ const ch = portada("ideas", "Elige 3 ideas por mes y ejecútalas");
  let n = 1; T.ideas.forEach((g) => { ch.push(K.h1(g.grupo)); ch.push(K.table(["#", "Idea", "☐ Hecha"], g.items.map((t) => [String(n++), t, "☐"]), [800, 7360, 1200])); });
  ch.push(K.p(C.avisoEjemplos, { italics: true }));
  job(B("08_100_ideas", "100_ideas_para_ganar_mas.docx"), ch, "100 ideas para ganar más"); }

// 09 Kit WhatsApp + calendario
{ const ch = portada("whatsapp", "30 mensajes y 30 días de contenido");
  ch.push(K.h1("30 mensajes listos para WhatsApp"));
  ch.push(K.p("Personaliza lo que está entre corchetes. Envía promociones solo a quien dio su consentimiento."));
  ch.push(K.table(["#", "Etapa", "Mensaje"], T.whatsapp.map((m, i) => [String(i + 1), m.etapa, m.texto]), [600, 2000, 6760], { size: 18 }));
  ch.push(K.h1("Calendario de contenido de 30 días"));
  ch.push(K.table(["Día", "Publicación", "☐"], T.calendario.map((t, i) => [String(i + 1), t, "☐"]), [900, 7560, 900]));
  job(B("09_Kit_WhatsApp_y_contenido", "Kit_WhatsApp_y_calendario_30_dias.docx"), ch, "Kit WhatsApp y contenido"); }

// 10 Plan 30 y 90 días
{ const ch = portada("plan", "Ruta semana a semana para recuperar tu inversión");
  ch.push(K.h1("Plan de 30 días"));
  T.plan30.forEach((s) => { ch.push(K.h2(s.semana)); ch.push(K.table(["Tarea", "Fecha", "☐"], s.tareas.map((t) => [t, "", "☐"]), [6460, 1800, 1100])); });
  ch.push(K.h1("Plan de 90 días"));
  ch.push(K.table(["Mes", "Foco", "Meta"], T.plan90.map((m) => [m.mes, m.foco, m.meta]), [1300, 2600, 5460], { boldFirst: true }));
  ch.push(K.h1("Sesiones de dudas en vivo"));
  ch.push(K.p("Incluye 2 sesiones de 60 minutos al terminar el curso para revisar tus casos reales y tu plan (fechas por confirmar). Lleva tus mediciones y fotos."));
  ch.push(K.h1("Tus 4 números semanales"));
  ch.push(K.table(["Semana", "Diagnósticos", "% que autoriza", "Ticket promedio", "Reseñas nuevas"], [["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""], ["4", "", "", "", ""]], [1400, 1990, 1990, 1990, 1990]));
  ch.push(K.p(C.avisoEjemplos, { italics: true }));
  job(B("10_Plan_30_90", "Plan_de_accion_30_y_90_dias.docx"), ch, "Plan de acción 30 y 90 días"); }

Promise.all(jobs).then(() => console.log("bonos listos"));
