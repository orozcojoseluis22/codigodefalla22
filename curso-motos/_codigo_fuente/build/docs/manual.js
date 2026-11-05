const K = require("../lib/docx-kit");
const { toPdf } = require("../lib/pdf");
const S = require("../lib/curso");
const { cfg: C, arq: A, clases } = S;
const OUT = require("path").join(S.ROOT, "03_Clases/Manual_del_instructor.docx");
const L = ["A", "B", "C", "D"];
const ch = [];
ch.push(...K.portada({ etiqueta: "Electrónica y Servicio · Manual del instructor", titulo: "Manual del instructor", subtitulo: C.titulo, linea3: `${C.clases} clases · ${C.horasTotales} horas · ${C.modulos} módulos`, fecha: "Versión 1.0 · noviembre de 2026" }));
ch.push(K.h1("Cómo usar este manual"));
ch.push(...K.numbered([
  "Cada clase tiene su presentación .pptx con el mismo orden de temas; las notas del orador contienen la explicación completa.",
  "Antes de la clase revisa la agenda de 90 minutos, prepara el material del ejercicio en vivo y ten a la mano el diagrama del Atlas indicado.",
  "Cada tema trae: idea clave (lo que el alumno debe recordar), 4 puntos de la lámina, explicación en dos párrafos, una frase \"Dilo así\" y la imagen sugerida.",
  "Cierra siempre con el repaso de 4 preguntas (las respuestas correctas vienen marcadas aquí) y la tarea de la semana.",
  "Los valores técnicos son típicos de referencia: recuerda a los alumnos verificarlos con el manual del fabricante.",
]));
ch.push(K.h1("Material necesario"));
ch.push(K.table(["Tipo", "Equipo"], [
  ["Osciloscopios", C.herramientas.osciloscopios.join(", ")], ["Escáneres", C.herramientas.escaneres.join(", ")],
  ["Medición y simulación", C.herramientas.otros.join(", ")], ["Específico para motos", C.herramientas.motos.join(", ")],
  ["Motos de práctica", "Al menos una moto con carburador y CDI, una con inyección (ej. 125–150 cc) y, de ser posible, una con sistema trifásico."],
  ["Seguridad", "Extintor, lentes de seguridad, guantes, ventilación y cables puente con fusible."],
], [2500, 6860], { boldFirst: true }));
ch.push(K.h1("Tabla de clases"));
ch.push(K.table(["Clase", "Módulo", "Título", "Promesa"], clases.map((c) => [String(c.n), String(c.modulo), c.titulo, c.promesa]), [800, 900, 3000, 4660], { boldFirst: true, size: 18 }));
clases.forEach((c) => {
  ch.push(K.pageBreak());
  ch.push(K.titulo(`Clase ${c.n}. ${c.titulo}`, { size: 38 }));
  ch.push(K.p(`Módulo ${c.modulo}: ${A.modulos[c.modulo - 1].nombre}`, { color: K.COL.tenue }));
  ch.push(...K.callout("Promesa de la clase", c.promesa));
  ch.push(K.h2("Objetivos"));
  ch.push(...K.numbered(c.objetivos));
  ch.push(K.h2("Agenda de 90 minutos"));
  ch.push(K.table(["Minutos", "Actividad"], c.agenda.map((a) => [a.min, a.act]), [1500, 7860], { boldFirst: true }));
  ch.push(K.h2("Desarrollo de los temas"));
  c.temas.forEach((t, i) => {
    ch.push(K.h3(`${c.n}.${i + 1} ${t.titulo}`));
    ch.push(K.p(`**Idea clave:** ${t.idea}`));
    ch.push(...K.bullets(t.puntos));
    t.explicacion.forEach((x) => ch.push(K.p(x)));
    ch.push(...K.callout("Dilo así", t.dilo, K.COL.azul));
    if (t.diagrama && S.diagramaPng(t.diagrama)) { ch.push(K.image(S.diagramaPng(t.diagrama), 6.3, { alt: t.titulo, keepNext: true })); ch.push(K.caption("Diagrama del Atlas MotoDiagrama (didáctico, sistema típico).")); }
    else ch.push(K.p(`**Imagen sugerida:** ${t.imagen}`, { italics: true, color: K.COL.tenue }));
  });
  ch.push(K.h2(`Ejercicio en vivo: ${c.ejercicio.titulo.replace(/^Práctica:\s*/, "")}`));
  ch.push(...K.numbered(c.ejercicio.pasos));
  ch.push(K.h2("Tarea de la semana"));
  ch.push(...K.numbered(c.tarea));
  ch.push(K.h2("Errores comunes"));
  ch.push(...K.bullets(c.errores));
  ch.push(K.h2("Repaso (con respuestas)"));
  c.repaso.forEach((q, i) => {
    const s = S.shuffleQ(q, c.n * 100 + i);
    ch.push(K.p(`**${q.p}**`, { after: 40, keepNext: true }));
    ch.push(K.p(s.ops.map((o, j) => `${j === s.ok ? "☑" : "☐"} ${L[j]}) ${o}`).join("    "), { after: 40 }));
    ch.push(K.p(`Respuesta correcta: ${L[s.ok]}) ${q.ops[q.ok]}`, { color: K.COL.verde, after: 120 }));
  });
  ch.push(K.h2("Recursos y bonos de la clase"));
  ch.push(...K.bullets(c.recursos));
  ch.push(...K.callout("Frase de cierre", c.cierre, K.COL.verde));
});
K.build(OUT, ch, { title: "Manual del instructor · " + C.titulo, header: "Manual del instructor · " + C.tituloCorto }).then((f) => toPdf(f));
