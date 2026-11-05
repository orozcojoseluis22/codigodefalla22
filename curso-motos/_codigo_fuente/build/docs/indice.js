// Índice de entregables (Word + PDF + Markdown)
const fs = require("fs"), path = require("path");
const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const S = require("../lib/curso");
const INV = require("../../data/investigacion");
const { cfg: C, arq: A, clases } = S;
const ROOT = S.ROOT;
const desc = {
  "00_Indice_de_entregables": "Este índice (Word, PDF y Markdown).",
  "01_Investigacion": "Investigación de mejores prácticas: 15 hallazgos, cambios recientes, 10 secciones con tablas, advertencias y 40 fuentes.",
  "02_Temario": "Temario oficial: ficha del curso, para quién es, 8 logros, temario por módulo, bonos, valor, garantía, metodología e instructor.",
  "03_Clases": "Manual del instructor (101 págs.) y 12 presentaciones .pptx editables con notas del orador.",
  "04_Bonos": "10 bonos: atlas de 17 diagramas (PDF, PNG, SVG), fichas técnicas, árboles, tabla de valores (PDF y Excel), calculadora Excel, formatos, prompts, 100 ideas, kit WhatsApp y plan 30/90.",
  "05_Plataforma": "No aplica: el curso es técnico; GoHighLevel se sustituyó por bonos de uso inmediato (ver nota).",
  "06_Landing_Page": "index.html autosuficiente para tu dominio + og-imagen.jpg.",
  "07_Lead_Magnet": "index.html del Árbol de Diagnóstico Eléctrico + og-lead-magnet.jpg.",
  "08_Animaciones": "3 videos MP4 (9:16, 1:1, 16:9) con portada PNG y fuentes HTML.",
  "09_Imagenes_Publicitarias": "25 imágenes PNG/JPG (juegos A, B, C y D) + copys y prompts de IA.",
  "10_Evaluacion": "Examen final en 2 versiones (alumno y con respuestas), Word y PDF.",
  "11_Copys_y_Lanzamiento": "Textos de venta y lanzamiento: copys por plataforma, 30 guiones, clase muestra, secuencia WhatsApp, plan con fechas, checklist y métricas.",
  "_codigo_fuente": "Fuente única de datos (data/*.js) y generadores (build/). node build/build-all.js regenera todo.",
};
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const porConfirmar = [
  "Número de WhatsApp (52 + 10 dígitos) en el bloque CONFIG de la landing y del lead magnet.",
  "Enlace de pago (checkoutUrl) o datos de transferencia.",
  "Garantía doble (7 días después de la Clase 2 + acompañamiento): condiciones finales.",
  "Periodo de acceso a grabaciones (propuesto: 12 meses).",
  "Fechas y horario del grupo (propuesto: martes y jueves 8:00–9:30 p. m., inicio 12 de enero de 2027; cierre 8 de enero).",
  "Cupo por grupo (propuesto: 40) y Bono Buen Fin (13–17 nov 2026).",
  "Pago en 2 partes y meses sin intereses: disponibilidad y quién absorbe comisiones del procesador.",
  "Quién paga costos por uso (WhatsApp Business Platform por mensaje, publicidad, procesador de pago).",
  "Valores de referencia de los bonos (estimados) y constancia de participación.",
  "Funciones exactas del Sens-22 descritas en el material.",
  "URL final de la landing y del lead magnet (para Open Graph) y webhookUrl opcional.",
];
const ch = [];
ch.push(...K.portada({ etiqueta: "Electrónica y Servicio · Entrega", titulo: "Índice de entregables", subtitulo: C.titulo, linea3: `${C.clases} clases · ${C.horasTotales} h · ${C.precioTexto}`, fecha: "5 de noviembre de 2026" }));
ch.push(K.h1("Entregables por carpeta"));
const rows = Object.keys(desc).map((k) => { const p = path.join(ROOT, k); const n = fs.existsSync(p) ? walk(p).filter((f) => !f.includes("node_modules") && !f.includes(".tmp")).length : 0; return [k, desc[k], String(n)]; });
ch.push(K.table(["Carpeta", "Contenido", "Archivos"], rows, [2500, 5560, 1300], { boldFirst: true, size: 18 }));
ch.push(K.h1("Temario"));
ch.push(K.table(["Clase", "Módulo", "Título", "Promesa"], clases.map((c) => [String(c.n), A.modulos[c.modulo - 1].nombre, c.titulo, c.promesa]), [800, 2300, 2900, 3360], { size: 17 }));
ch.push(K.h1("Hallazgos de la investigación que cambiaron el contenido"));
ch.push(...K.numbered([INV.hallazgos[1], INV.hallazgos[3], INV.hallazgos[9], INV.hallazgos[11], INV.hallazgos[6], INV.hallazgos[13], INV.hallazgos[14]].map((h) => `**${h.t}.** ${h.d}`)));
ch.push(K.h1("Datos por confirmar"));
ch.push(...K.bullets(porConfirmar));
ch.push(K.h1("Fuentes principales"));
INV.fuentes.slice(0, 14).forEach(([t, u]) => ch.push(K.link(t, u)));
ch.push(K.p("Lista completa: 01_Investigacion/Investigacion_de_mejores_practicas.pdf", { italics: true, before: 120 }));
const out = path.join(ROOT, "00_Indice_de_entregables", "Indice_de_entregables.docx");
K.build(out, ch, { title: "Índice de entregables", header: "Índice de entregables · " + C.tituloCorto }).then((f) => toPdf(f));
let md = `# Índice de entregables\n\n**${C.titulo}** · ${C.instructor.nombre} · ${C.instructor.empresa}\n\n| Carpeta | Contenido | Archivos |\n|---|---|---|\n`;
rows.forEach((r) => (md += `| ${r.join(" | ")} |\n`));
md += `\n## Datos por confirmar\n\n${porConfirmar.map((x) => "- " + x).join("\n")}\n\n## Cómo regenerar\n\n\`\`\`\ncd _codigo_fuente && npm install && node build/build-all.js\n\`\`\`\n`;
fs.writeFileSync(path.join(ROOT, "00_Indice_de_entregables", "LEEME.md"), md);
