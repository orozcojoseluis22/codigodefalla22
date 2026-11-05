// Textos de venta y lanzamiento (Word + PDF) + copys y prompts por imagen (Markdown) desde la fuente única
const fs = require("fs"), path = require("path");
const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const S = require("../lib/curso");
const P = require("../../data/publicidad");
const { cfg: C, clases } = S;
const warn = [];
const chk = (t, n, what) => { if (t.length > n) warn.push(`${what}: ${t.length} > ${n}`); return t; };
// Copys por imagen
const sizes = ["1080x1350", "1080x1920", "1080x1080", "1200x628"];
const imgs = [];
P.anuncios.forEach((a) => sizes.forEach((s) => imgs.push({ archivo: `A_Anuncios/${a.id}_${a.angulo}_${s}.png`, ...a.copy })));
const carCopy = { principal: "5 pruebas eléctricas que todo mecánico de motos debe dominar, con valores típicos. Guárdalo y compártelo con tu ayudante.", titulo: "5 pruebas que debes dominar", descripcion: "Curso en vivo · $1,799 MXN", hashtags: ["#MecanicaDeMotos", "#Multimetro", "#TallerDeMotos", "#ElectricidadDeMotos", "#ElectronicaYServicio"] };
P.carrusel.forEach((c, i) => imgs.push({ archivo: `B_Carrusel/B${i + 1}_${c.tipo}${c.n ? "_" + c.n : ""}_1080x1350.png`, ...carCopy }));
const lmCopy = { principal: "¿No carga, no arranca o se descarga? Encuentra la falla en 10 minutos con el Árbol de Diagnóstico Eléctrico. Gratis.", titulo: "Árbol de diagnóstico gratis", descripcion: "Sin registro", hashtags: ["#DiagnosticoDeMotos", "#MecanicoDeMotos", "#Herramientagratis", "#TallerDeMotos", "#ElectronicaYServicio"] };
["1080x1350", "1080x1920", "1200x628"].forEach((s) => imgs.push({ archivo: `C_Lead_Magnet/C_arbol_diagnostico_${s}.png`, ...lmCopy }));
imgs.push({ archivo: "D_YouTube_y_OG/D_miniatura_youtube_1280x720.png", principal: P.copysVideo.V3.yt.titulo, titulo: "No carga: 4 pruebas", descripcion: "Video en YouTube", hashtags: ["#SistemaDeCarga", "#Motos", "#Estator", "#Regulador", "#ElectronicaYServicio"] });
imgs.push({ archivo: "D_YouTube_y_OG/og-imagen_1200x630.jpg", principal: "Curso en vivo de diagnóstico eléctrico de motos para mecánicos: 12 clases, 18 horas, $1,799 MXN.", titulo: "Diagnóstico eléctrico de motos", descripcion: "Escribe MOTO por WhatsApp", hashtags: ["#CursoDeMotos", "#MecanicaDeMotos", "#ElectricidadDeMotos", "#TallerDeMotos", "#ElectronicaYServicio"] });
imgs.forEach((x) => { chk(x.principal, 125, x.archivo + " principal"); chk(x.titulo, 40, x.archivo + " título"); chk(x.descripcion, 30, x.archivo + " descripción"); if (x.hashtags.length !== 5) warn.push(x.archivo + " hashtags != 5"); });

const ch = [];
ch.push(...K.portada({ etiqueta: "Electrónica y Servicio · Publicidad", titulo: "Textos de venta y lanzamiento", subtitulo: C.titulo, linea3: "Copys, guiones, secuencias y plan de lanzamiento", fecha: "Noviembre de 2026" }));
ch.push(K.h1("1. Estrategia"));
ch.push(K.p(`**Idea central:** ${P.ideaCentral}`));
ch.push(K.p(`**Regla:** ${P.regla}`));
ch.push(K.table(["Ángulo", "Mensaje"], P.angulos.map((a) => [a.nombre, a.mensaje]), [2600, 6760], { boldFirst: true }));
ch.push(K.p(`**Llamado a la acción único en todas las piezas:** ${C.cta} · Precio: ${C.precioTexto}.`));
ch.push(K.h1("2. Copys por imagen"));
ch.push(K.p("Texto principal (primer renglón ≤125 caracteres), título (≤40), descripción (≤30) y 5 hashtags por imagen."));
const grupos = []; imgs.forEach((x) => { const g = grupos.find((y) => y.principal === x.principal); if (g) g.archivos.push(x.archivo); else grupos.push({ ...x, archivos: [x.archivo] }); });
ch.push(K.table(["Archivos", "Texto principal", "Título / descripción", "Hashtags"], grupos.map((x) => [x.archivos.map((a) => a.split("/").pop()), x.principal, [`**${x.titulo}**`, x.descripcion], x.hashtags]), [2500, 3000, 1900, 1960], { size: 16 }));
ch.push(K.h1("3. Copys por plataforma para cada video"));
P.videos.forEach((v) => {
  const c = P.copysVideo[v.id];
  ch.push(K.h2(`${v.id} · ${v.formato} · ${v.titulo} (ángulo: ${v.angulo})`));
  ch.push(K.table(["Plataforma", "Texto"], [["Facebook e Instagram (feed)", c.fb], ["Reels y TikTok", c.reels], ["YouTube · título", c.yt.titulo], ["YouTube · descripción", c.yt.desc], ["Estados de WhatsApp", c.estado], ["Comentario fijado", c.fijado]], [2600, 6760], { boldFirst: true }));
  ch.push(K.p(`**Guion de locución (opcional, ${v.dur} s):** ${v.locucion}`));
});
ch.push(K.p("Los videos no llevan música. Si agregas música, usa solo pistas con licencia (por ejemplo, la biblioteca de audio de la propia plataforma).", { italics: true }));
ch.push(K.h1("4. 30 guiones de videos \"tip + curso\""));
ch.push(K.p("Formato: gancho (3 s) → tip con medición en pantalla (15–20 s) → cierre: \"Esto lo vemos completo en la Clase X. Escribe MOTO por WhatsApp\"."));
ch.push(K.table(["#", "Gancho", "Tip", "Clase"], P.guiones30.map(([g, t, c], i) => [String(i + 1), g, t, `${c}. ${clases[c - 1].titulo}`]), [600, 3200, 3300, 2260], { size: 17 }));
ch.push(K.h1(`5. Guion de la clase muestra gratuita (45 min)`));
ch.push(K.p(`**${P.claseMuestra.titulo}**`));
ch.push(K.table(["Minutos", "Bloque"], P.claseMuestra.bloques, [1500, 7860], { boldFirst: true }));
ch.push(K.h1("6. Secuencia de venta por WhatsApp (6 mensajes)"));
ch.push(K.table(["Momento", "Mensaje"], P.secuenciaWA, [2300, 7060], { boldFirst: true }));
ch.push(K.p("Envía solo a quien te escribió o dio su consentimiento. Respeta la palabra BAJA.", { italics: true }));
ch.push(K.h1("7. Promoción del lead magnet"));
ch.push(K.h2("5 publicaciones para redes"));
ch.push(...K.numbered(P.leadPosts));
ch.push(K.h2("Mensaje para listas de difusión de WhatsApp"));
ch.push(K.p(P.leadDifusion));
ch.push(K.h2("Guion de video (20–30 s)"));
ch.push(K.table(["Tiempo", "Escena"], P.leadVideo, [1400, 7960], { boldFirst: true }));
ch.push(K.h1("8. Plan de lanzamiento (desde el 5 de noviembre de 2026)"));
ch.push(K.p("Fecha comercial más cercana: El Buen Fin, del 13 al 17 de noviembre de 2026. Se usa un bono (sesión extra) en lugar de descuento. Fechas del grupo por confirmar."));
ch.push(K.table(["Fecha", "Fase", "Acción"], P.lanzamiento, [2200, 2000, 5160], { boldFirst: true }));
ch.push(K.h1("9. Checklist previo al lanzamiento"));
ch.push(K.table(["☐", "Tarea"], P.checklist.map((t) => ["☐", t]), [700, 8660]));
ch.push(K.h1("10. Métricas"));
ch.push(K.table(["Métrica", "Cómo se calcula", "Uso"], P.metricas, [2600, 3200, 3560], { boldFirst: true }));
ch.push(K.h1("11. Prompts de IA para fotos realistas (opcional)"));
ch.push(K.table(["Pieza", "Prompt"], P.promptsIA.map((x) => [x.pieza, x.prompt]), [2100, 7260], { boldFirst: true, size: 17 }));
ch.push(K.h1("12. Cumplimiento"));
ch.push(...K.bullets([
  "Meta y Google: sin ingresos garantizados ni \"hazte rico\"; sin afirmar o insinuar atributos personales del público (no \"¿Estás quebrado?\"); antes y después solo de trabajos reales y sin exagerar.",
  "Profeco: precio total visible ($1,799 MXN), condiciones de pago y garantía claras; las cifras de la calculadora se rotulan como ejemplo ilustrativo.",
  "Ley Federal de Protección de Datos Personales (DOF 20/mar/2025): aviso de privacidad desde que se pide el WhatsApp y consentimiento para mensajes promocionales.",
  "Sorteos o rifas promocionales requieren permiso de la Secretaría de Gobernación: no se incluyen en este plan.",
  "Nunca testimonios inventados: usa solo opiniones reales con permiso por escrito.",
  "Derechos de autor: diagramas y visuales son originales; no uses logotipos de marcas de motos como si fueran patrocinadores; música solo con licencia.",
]));
const OUT = path.join(S.ROOT, "11_Copys_y_Lanzamiento", "Textos_de_venta_y_lanzamiento.docx");
K.build(OUT, ch, { title: "Textos de venta y lanzamiento", header: "Copys y lanzamiento · " + C.tituloCorto }).then((f) => toPdf(f));
// Markdown de copys y prompts junto a las imágenes
let md = `# Copys y prompts por imagen\n\n${C.titulo} · ${C.instructor.nombre}\n\nCTA único: **${C.cta}** · ${C.precioTexto}\n\n| Archivo | Texto principal | Título | Descripción | Hashtags |\n|---|---|---|---|---|\n`;
imgs.forEach((x) => (md += `| ${x.archivo} | ${x.principal} | ${x.titulo} | ${x.descripcion} | ${x.hashtags.join(" ")} |\n`));
md += `\n## Prompts de IA para fotos realistas (opcional)\n\nLos visuales técnicos de las piezas ya están dibujados en SVG. Si prefieres foto realista, genera la imagen con estos prompts y colócala en el área central.\n\n`;
P.promptsIA.forEach((x) => (md += `**${x.pieza}:** ${x.prompt}\n\n`));
fs.writeFileSync(path.join(S.ROOT, "09_Imagenes_Publicitarias", "Copys_y_prompts_IA.md"), md);
console.log("advertencias de longitud:", warn.length ? warn : "ninguna");
