const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const S = require("../lib/curso");
const { cfg: C, arq: A, oferta: O, clases, mxn } = S;
const OUT = require("path").join(S.ROOT, "02_Temario/Temario_Diagnostico_Electrico_de_Motos.docx");
const ch = [];
ch.push(...K.portada({ etiqueta: "Electrónica y Servicio · Temario oficial", titulo: C.titulo, subtitulo: C.subtitulo, linea3: `Próximo grupo: ${C.proximoGrupo} (por confirmar)`, fecha: "Temario · noviembre de 2026" }));
ch.push(K.h1("Ficha del curso"));
ch.push(K.table(["Concepto", "Detalle"], [
  ["Modalidad", C.modalidad], ["Duración", `${C.clases} clases de ${C.horasPorClase} · ${C.horasTotales} horas · ${C.modulos} módulos de 3 clases`],
  ["Frecuencia y horario", `${C.frecuencia} · ${C.horario} (por confirmar)`], ["Inversión", `${C.precioTexto} · ${O.pago.partes}`],
  ["Acceso", `${C.periodoDeAcceso} (por confirmar)`], ["Imparte", `${C.instructor.nombre} · ${C.instructor.empresa}`],
  ["Requisitos", A.requisitos.join(" · ")], ["Inscripciones", `${C.cta} · ${C.instructor.web}`],
], [2400, 6960], { boldFirst: true }));
ch.push(K.h1("Promesa del curso"));
ch.push(K.p(`**${C.promesa}**`));
ch.push(K.p(A.resultadoSonado));
ch.push(K.h1("¿Para quién es?"));
ch.push(K.p(A.paraQuien));
ch.push(K.table(["Perfil", "Lo que le duele", "Lo que logra con el curso"], A.avatares.map((a) => [a.nombre, a.problemas.join("; "), a.quiere.join("; ")]), [2200, 3600, 3560], { boldFirst: true }));
ch.push(K.p("Los perfiles son ejemplos ilustrativos para describir al alumno; no son personas reales.", { italics: true }));
ch.push(K.h1("Al terminar podrás"));
ch.push(...K.numbered(A.logros));
ch.push(K.h1("Temario por módulo"));
A.modulos.forEach((m) => {
  ch.push(K.h2(`Módulo ${m.n}. ${m.nombre}`));
  ch.push(K.p(`**Resultado del módulo:** ${m.resultado}`));
  m.clases.forEach((n) => {
    const c = clases[n - 1];
    ch.push(K.h3(`Clase ${c.n}. ${c.titulo}`));
    ch.push(K.p(`**Promesa:** ${c.promesa}`, { after: 60 }));
    ch.push(...K.bullets(c.temas.map((t) => t.titulo)));
    ch.push(K.p(`**Práctica:** ${c.ejercicio.titulo.replace(/^Práctica:\s*/, "")}`, { after: 140 }));
  });
});
ch.push(K.h1("Bonos incluidos"));
ch.push(K.table(["Bono", "Qué obtienes", "Formato", "Valor de referencia"], O.bonos.map((b) => [b.nombre, b.formula, b.formato, mxn(b.valor)]), [2500, 3900, 1300, 1660], { boldFirst: true }));
ch.push(K.p(O.sustitucionPlataforma, { italics: true }));
ch.push(K.h1("Valor total frente a tu inversión"));
ch.push(K.table(["Concepto", "Valor de referencia"], [["12 clases en vivo con práctica y grabación", mxn(O.valorClases)], ["10 bonos", mxn(S.valorBonos)], ["**Valor total de referencia**", `**${mxn(S.valorTotal)}**`], ["**Tu inversión**", `**${C.precioTexto}**`]], [6360, 3000]));
ch.push(K.p("Los valores de referencia son estimaciones del equipo de Electrónica y Servicio para comunicar el alcance del material (por confirmar); no representan un precio de venta por separado.", { italics: true }));
ch.push(K.h1("Garantía"));
ch.push(...K.callout(O.garantia.nombre, O.garantia.puntos.map((t) => "• " + t), K.COL.verde));
ch.push(K.h1("Metodología"));
ch.push(...K.bullets(A.metodologia));
ch.push(K.h1("Instructor"));
ch.push(K.p(`**${C.instructor.nombre}** · ${C.instructor.empresa} (${C.instructor.web}). ${C.instructor.trayectoria}`));
ch.push(K.p("Equipo de prácticas: " + [...C.herramientas.osciloscopios, ...C.herramientas.escaneres, ...C.herramientas.otros].join(", ") + "."));
ch.push(K.h1("Avisos"));
ch.push(...K.bullets([C.avisoMarcas, C.avisoEjemplos, C.avisoValores]));
K.build(OUT, ch, { title: "Temario · " + C.titulo }).then((f) => toPdf(f));
