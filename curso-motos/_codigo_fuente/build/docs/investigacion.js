const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const C = require("../../data/config");
const R = require("../../data/investigacion");
const OUT = require("path").resolve(__dirname, "../../../01_Investigacion/Investigacion_de_mejores_practicas.docx");

const ch = [];
ch.push(...K.portada({ etiqueta: "Electrónica y Servicio · Investigación", titulo: R.titulo, subtitulo: R.subtitulo, linea3: `Curso: ${C.titulo}`, fecha: `Fecha de consulta: ${R.fecha}` }));
ch.push(K.h1("Cómo se hizo esta investigación"));
ch.push(...K.bullets(R.metodo));
ch.push(K.h1("Resumen ejecutivo: 15 hallazgos"));
R.hallazgos.forEach((h, i) => { ch.push(K.p(`**${i + 1}. ${h.t}.** ${h.d}`, { after: 100 })); });
ch.push(K.h1("Cambios recientes y qué significan para el alumno"));
ch.push(K.table(["Fecha", "Cambio", "Qué significa para el alumno"], R.cambios.map((c) => [c.fecha, c.cambio, c.significa]), [1500, 4100, 3760], { boldFirst: true }));
R.secciones.forEach((s) => {
  ch.push(K.h1(s.titulo));
  s.parrafos.forEach((t) => ch.push(K.p(t)));
  if (s.tabla) { ch.push(K.tableTitle(s.tabla.titulo)); ch.push(K.table(s.tabla.cols, s.tabla.filas, s.tabla.anchos, { boldFirst: true })); ch.push(K.spacer(80)); }
});
ch.push(K.h1("Advertencias sobre los datos"));
ch.push(...K.callout("Lee esto antes de usar cualquier cifra", R.advertencias.map((a) => "• " + a), K.COL.rojo));
ch.push(K.p(C.avisoValores, { italics: true }));
ch.push(K.h1("Fuentes consultadas (5 de noviembre de 2026)"));
R.fuentes.forEach(([t, u]) => ch.push(K.link(t, u)));
K.build(OUT, ch, { title: R.titulo, header: "Investigación de mejores prácticas · " + C.tituloCorto }).then((f) => toPdf(f));
