// Generador de documentos Word desde la fuente única (data/*.js)
const path = require('path'), fs = require('fs');
const L = require('./lib_docx');
const { d, K, TW, P, BIG, H1, H2, H3, bullets, numbered, PB, table, callout, img, link, spacer, cover, makeDoc, save, cell } = L;
const { AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, Paragraph, TextRun } = d;
const CFG = require('../data/config'), R = require('../data/research'), O = require('../data/offer'), FI = require('../data/fichas'), BO = require('../data/bonos');
const CLASES = [...require('../data/course_m1'), ...require('../data/course_m2'), ...require('../data/course_m3'), ...require('../data/course_m4')];
const money = n => '$' + Number(n).toLocaleString('en-US') + ' MXN';
const src = ids => (ids || []).map(id => R.fuentes[id] ? R.fuentes[id][0] : id).join(' · ');
const modName = n => O.modulos.find(m => m.n === n).nombre;
const only = process.argv[2];
const jobs = {};

// ───────────── 01 · Investigación ─────────────
jobs.investigacion = async () => {
  const c = [...cover({ kicker: 'Fase 1 · Investigación', title: 'Investigación de mejores prácticas', subtitle: `${CFG.curso.titulo} · ${CFG.curso.marcas}`, lines: [`Elaboró: ${CFG.instructor.empresa} para el ${CFG.instructor.nombre}`, `Fecha de consulta de fuentes: ${CFG.fechaElaboracion}`, 'Documento interno de soporte del curso. No constituye asesoría legal.'] })];
  c.push(H1('Resumen ejecutivo: 15 hallazgos'));
  c.push(P('Los hallazgos siguientes cambiaron el contenido del curso. Cada uno indica sus fuentes; la lista completa con enlaces está al final.'));
  R.resumen.forEach((h, i) => { c.push(P(`**${i + 1}. ${h[0]}.** ${h[1]}`, { after: 40 })); c.push(P('Fuentes: ' + src(h[2]), { size: 18, color: K.tenue, after: 140 })); });
  c.push(H1('Cambios recientes (últimos 24 meses)', { pb: true }));
  c.push(table(['Fecha', 'Cambio', 'Qué significa para el alumno'], R.cambios.map(r => [r[0], r[1], r[2]]), [1300, 4300, 3760]));
  c.push(P('Fuentes: ' + [...new Set(R.cambios.flatMap(r => r[3]))].map(id => id).join(', ') + ' (ver lista de fuentes).', { size: 18, color: K.tenue, before: 80 }));
  R.secciones.forEach(s => {
    c.push(H1(s.titulo));
    s.parrafos.forEach(p => c.push(P(p)));
    if (s.tabla) { c.push(H3(s.tabla.titulo)); c.push(table(s.tabla.cols, s.tabla.filas, s.tabla.cols.map(() => 1))); }
    c.push(P('Fuentes: ' + src(s.fuentes), { size: 18, color: K.tenue, before: 100 }));
  });
  c.push(H1('Advertencias sobre los datos'));
  c.push(...bullets(R.advertencias));
  c.push(H1('Lista de fuentes con enlaces', { pb: true }));
  Object.entries(R.fuentes).forEach(([id, f]) => { c.push(P(`**${id}.** ${f[0]}`, { after: 0, size: 20 })); c.push(link(f[1], f[1])); });
  return save(makeDoc(c, { title: 'Investigación de mejores prácticas' }), '01_Investigacion/Investigacion_mejores_practicas.docx');
};

// ───────────── 02 · Temario ─────────────
jobs.temario = async () => {
  const totalBonos = O.bonos.reduce((a, b) => a + b.valor, 0), total = totalBonos + O.valorCurso;
  const c = [...cover({ kicker: 'Programa de capacitación · ' + CFG.curso.modalidad, title: CFG.curso.titulo, subtitle: CFG.curso.marcas + ' — ' + CFG.curso.subtitulo, photo: 'assets/portada_prof.jpg', photoW: 600, lines: [`Imparte: ${CFG.instructor.nombre} · ${CFG.instructor.empresa}`, `${CFG.cta.texto} al ${CFG.cta.whatsappVisible}`] })];
  c.push(H1('Ficha del curso'));
  c.push(table(null, [
    ['Modalidad', CFG.curso.modalidad], ['Formato', CFG.curso.formato],
    ...CFG.sedes.map(s => ['Sede ' + s.ciudad, `${s.fechas} · ${s.lugar} · ${s.direccion}`]),
    ['Horario', CFG.curso.horario], ['Inversión', CFG.precioTexto + ' (precio total; por confirmar)'], ['Imparte', `${CFG.instructor.nombre} · ${CFG.instructor.empresa} · ${CFG.instructor.web}`],
    ['Requisitos', CFG.curso.requisitos], ['Cupo', CFG.curso.cupo], ['Informes', `${CFG.cta.texto} al ${CFG.cta.whatsappVisible}`]
  ], [2200, 7160], { firstBold: true }));
  c.push(callout('Promesa del curso', CFG.curso.promesa));
  c.push(H1('Para quién es'));
  c.push(...bullets(O.paraQuienSi));
  c.push(H3('Para quién no es')); c.push(...bullets(O.paraQuienNo));
  c.push(H1('Lo que vas a lograr (8 logros)')); c.push(...numbered(O.logros));
  c.push(H1('Temario por módulo', { pb: true }));
  O.modulos.forEach(m => {
    c.push(H2(`Módulo ${m.n} · ${m.nombre}`)); c.push(P(m.resultado, { color: K.tenue }));
    CLASES.filter(k => k.modulo === m.n).forEach(k => {
      c.push(H3(`Clase ${k.n} · ${k.titulo}`)); c.push(P('**Promesa:** ' + k.promesa, { after: 60 }));
      c.push(P('**Temas:** ' + k.temas.map(t => t.t).join(' · '), { after: 60 }));
      c.push(P('**Práctica:** ' + k.ejercicio.titulo, { after: 160 }));
    });
  });
  c.push(H1('Bonos incluidos', { pb: true }));
  c.push(table(['Bono', 'Formato', 'Para qué te sirve', 'Valor de referencia'], O.bonos.map(b => [`${b.n}. ${b.nombre}`, b.formato, b.porque, money(b.valor)]), [3300, 1500, 3060, 1500]));
  c.push(H2('Valor total frente a tu inversión'));
  c.push(table(['Concepto', 'Valor de referencia'], [['Curso presencial de 18 h (12 sesiones)', money(O.valorCurso)], ['10 bonos', money(totalBonos)], ['Valor total de referencia', money(total)], ['Tu inversión', CFG.precioTexto]], [6360, 3000], { firstBold: true }));
  c.push(P(O.valorCursoNota + ' Los valores de los bonos son de referencia interna y no constituyen precios anteriores ni descuentos.', { size: 18, color: K.tenue }));
  c.push(callout(O.bonoBuenFin.nombre, [O.bonoBuenFin.descripcion, O.bonoBuenFin.nota]));
  c.push(H1('Garantía')); c.push(callout(O.garantia.nombre, [O.garantia.texto, O.garantia.nota], { fill: 'E6F6EA', border: K.verde }));
  c.push(H1('Metodología'));
  c.push(...bullets(['Cada sesión de 90 minutos: explicación con diagramas, demostración del instructor, ejercicio en vivo con equipo real, repaso y tarea.', 'Método por etapas: alimentación → entradas → proceso → salidas → red, aplicable a cualquier marca.', 'Evidencia en cada paso: multímetro, osciloscopio (Hantek 6074BE y 6022BE, FNIRSI 2C53P y 1013D), escáner (Launch X431, CRT-511PRO, Autel MX900) y Sens-22.', 'Seguridad primero: fuente con límite de corriente, ESD, respaldo de memorias y ética con inmovilizadores.', 'Del banco a la caja: el último módulo enseña a validar, garantizar y cobrar.']));
  c.push(H1('Instructor'));
  c.push(img('assets/prof_crop.png', 170, { align: AlignmentType.LEFT }));
  c.push(P(`**${CFG.instructor.nombre}** · ${CFG.instructor.empresa} · ${CFG.instructor.web}`));
  c.push(P(CFG.instructor.bio));
  c.push(callout('Inscripciones', [`${CFG.cta.texto} al ${CFG.cta.whatsappVisible}.`, 'Curso independiente: no está afiliado ni patrocinado por Chrysler, Dodge, Jeep, Nissan ni por los fabricantes de herramientas mencionados.']));
  return save(makeDoc(c, { title: 'Temario' }), '02_Temario/Temario_Reparacion_Computadoras_Automotrices.docx');
};

// ───────────── 03 · Manual del instructor ─────────────
jobs.manual = async () => {
  const c = [...cover({ kicker: 'Manual del instructor', title: CFG.curso.titulo, subtitle: CFG.curso.marcas + ' · 12 sesiones · 18 horas', photo: 'assets/portada_prof.jpg', photoW: 600, lines: [`${CFG.instructor.nombre} · ${CFG.instructor.empresa}`, `Versión: ${CFG.fechaElaboracion}`] })];
  c.push(H1('Cómo usar este manual'));
  c.push(...bullets(['Cada clase tiene: promesa, 4 objetivos, agenda de 90 minutos en 6 bloques, desarrollo de cada tema, ejercicio en vivo, tarea, errores comunes, repaso con respuestas, recursos y frase de cierre.', 'Cada tema incluye la idea clave, los 4 puntos de la lámina, la explicación para el instructor, una frase "Dilo así" para que el alumno lo entienda con lenguaje de taller y la imagen sugerida.', 'Las presentaciones (.pptx) siguen el mismo orden; las notas del orador contienen la explicación completa.', 'Los valores marcados como "típico" deben confirmarse con el manual del fabricante. Los ejemplos de precios son ilustrativos.', 'Los diagramas son didácticos y simplificados; la asignación real de terminales se toma del diagrama del vehículo.']));
  c.push(H1('Material necesario'));
  c.push(table(['Categoría', 'Material'], [
    ['Instrumentos', 'Multímetro con modo diodo; pinza amperimétrica; osciloscopios Hantek 6074BE y 6022BE, FNIRSI 2C53P y 1013D'],
    ['Diagnóstico', 'Escáneres Launch X431, CRT-511PRO y Autel MX900 (con registro AutoAuth para FCA 2018+ si aplica); banco de comprobación de sensores Sens-22'],
    ['Banco', 'Fuente de laboratorio con límite de corriente; arneses de banco; DLC de banco con 120 Ω; simulador CKP/CMP; potenciómetros; cargas LED y lámparas; inyectores y bobinas de prueba'],
    ['Retrabajo', 'Estación de aire caliente y cautín; precalentador; microscopio; fundente, malla, alcohol isopropílico; silicón neutro; programador de EEPROM con pinza SOIC-8'],
    ['Computadoras de práctica', 'PCM Chrysler (NGC y GPEC si es posible) y ECM Nissan; tarjetas de desecho para soldadura'],
    ['Seguridad', 'Tapetes y pulseras ESD; lentes; extractor de humos; extintor; contenedor para residuos electrónicos']
  ], [2200, 7160], { firstBold: true }));
  c.push(H1('Tabla de clases'));
  c.push(table(['Clase', 'Módulo', 'Título', 'Promesa'], CLASES.map(k => [String(k.n), modName(k.modulo), k.titulo, k.promesa]), [800, 1900, 2500, 4160]));
  c.push(H2('Distribución en 2 días (por sede)'));
  c.push(table(['Día', 'Sesiones', 'Módulos'], [['Día 1', 'Clases 1 a 6 (9 h)', 'Módulo 1 · Entiende la computadora; Módulo 2 · Mide y diagnostica en banco'], ['Día 2', 'Clases 7 a 12 (9 h)', 'Módulo 3 · Repara entradas, salidas y redes; Módulo 4 · Reconstruye, valida y cobra']], [1400, 2600, 5360]));
  CLASES.forEach(k => {
    c.push(H1(`Clase ${k.n} · ${k.titulo}`, { pb: true }));
    c.push(P(`Módulo ${k.modulo} · ${modName(k.modulo)} · Duración: 1 h 30 min`, { color: K.tenue }));
    c.push(callout('Promesa de la clase', k.promesa));
    c.push(H2('Objetivos')); c.push(...numbered(k.objetivos));
    c.push(H2('Agenda de 90 minutos'));
    let t = 0; c.push(table(['Bloque', 'Minutos', 'Actividad'], k.agenda.map((a, i) => { const r = [String(i + 1), `${t}–${t + a[0]} (${a[0]} min)`, a[1]]; t += a[0]; return r; }), [1000, 2300, 6060]));
    c.push(H2('Desarrollo de los temas'));
    k.temas.forEach((tm, i) => {
      c.push(H3(`${k.n}.${i + 1} ${tm.t}`));
      c.push(P('**Idea clave:** ' + tm.k));
      c.push(P('Puntos de la lámina:', { bold: true, after: 40 })); c.push(...bullets(tm.p));
      c.push(P('Explicación para el instructor:', { bold: true, before: 80, after: 40 })); tm.e.forEach(e => c.push(P(e)));
      c.push(callout('Dilo así', tm.d, { fill: 'E7F0FF', border: K.azul }));
      if (tm.dg) { c.push(img(`assets/diagramas/${tm.dg}.png`, 560)); c.push(P('Diagrama del curso: ' + tm.t, { size: 18, color: K.tenue, align: AlignmentType.CENTER })); }
      c.push(P('**Imagen sugerida:** ' + tm.img, { size: 20, color: K.tenue, before: 60 }));
      if (tm.src) c.push(P('Fuentes: ' + src(tm.src), { size: 18, color: K.tenue }));
    });
    c.push(H2('Ejercicio en vivo: ' + k.ejercicio.titulo)); c.push(...numbered(k.ejercicio.pasos));
    c.push(H2('Tarea de la semana')); c.push(...numbered(k.tarea));
    c.push(H2('Errores comunes')); c.push(...bullets(k.errores));
    c.push(H2('Repaso (con respuestas)'));
    k.repaso.forEach(q => { c.push(P(q.q, { bold: true, after: 40, keepNext: true })); q.ops.forEach((o, j) => c.push(P((j === q.ok ? '✔ ' : '○ ') + o + (j === q.ok ? '  (correcta)' : ''), { indent: { left: 360 }, after: 20, color: j === q.ok ? '1E7A32' : undefined, bold: j === q.ok }))); c.push(P('', { after: 80 })); });
    c.push(H2('Recursos y bonos de la clase')); c.push(...bullets(k.recursos));
    c.push(callout('Frase de cierre', k.cierre));
  });
  c.push(H1('Fuentes principales', { pb: true }));
  Object.entries(R.fuentes).forEach(([id, f]) => { c.push(P(`**${id}.** ${f[0]}`, { after: 0, size: 18 })); c.push(link(f[1], f[1])); });
  return save(makeDoc(c, { title: 'Manual del instructor', header: 'Manual del instructor' }), '03_Clases/Manual_del_instructor.docx');
};

// ───────────── 10 · Examen (2 versiones) ─────────────
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function examen(conResp) {
  const rand = rng(20261105); const noB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const c = [img('assets/logo_es.png', 150, { align: AlignmentType.LEFT, after: 120 }), BIG('Examen final', { size: 44, after: 60 }), P(`${CFG.curso.titulo} · ${CFG.curso.marcas}`, { size: 24, color: K.gris }), P(conResp ? 'VERSIÓN CON RESPUESTAS (uso exclusivo del instructor)' : 'Versión para el alumno', { bold: true, color: conResp ? K.rojo : K.gris })];
  c.push(table(null, [['Nombre:', ''], ['Fecha y sede:', ''], ['Calificación:', '']], [2000, 7360], { zebra: false, firstBold: true }));
  c.push(P('Instrucciones: marca con una X el recuadro ☐ de la única opción correcta. 48 reactivos; cada uno vale lo mismo. Tiempo sugerido: 40 minutos.', { before: 160 }));
  const key = [];
  O.modulos.forEach(m => {
    c.push(H2(`Módulo ${m.n} · ${m.nombre}`));
    CLASES.filter(k => k.modulo === m.n).forEach(k => k.repaso.forEach(q => {
      const idx = [0, 1, 2, 3]; for (let i = 3; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      const pos = idx.indexOf(q.ok); key.push(pos);
      c.push(P(q.q, { bold: true, after: 60, keepNext: true, before: 120 }));
      const w = Math.floor(TW / 4);
      c.push(new Table({ width: { size: w * 4, type: WidthType.DXA }, columnWidths: [w, w, w, w], borders: { top: noB, bottom: noB, left: noB, right: noB, insideHorizontal: noB, insideVertical: noB }, rows: [new TableRow({ cantSplit: true, children: idx.map(oi => { const ok = conResp && oi === q.ok; return new TableCell({ width: { size: w, type: WidthType.DXA }, borders: { top: noB, bottom: noB, left: noB, right: noB }, margins: { left: 60, right: 100 }, shading: ok ? { type: ShadingType.CLEAR, color: 'auto', fill: 'DFF3E3' } : undefined, children: [new Paragraph({ children: [new TextRun({ text: (ok ? '☒ ' : '☐ ') + q.ops[oi], bold: ok, color: ok ? '1E7A32' : undefined, size: 20, font: 'Arial' })] })] }); }) })] }));
    }));
  });
  if (conResp) { const cnt = [0, 0, 0, 0]; key.forEach(p => cnt[p]++); c.push(P(`Distribución de respuestas correctas por posición (1ª a 4ª columna): ${cnt.join(' / ')}.`, { size: 18, color: K.tenue, before: 200 })); }
  return c;
}
jobs.examen = async () => {
  await save(makeDoc(examen(false), { title: 'Examen final' }), '10_Evaluacion/Examen_final_SIN_respuestas.docx');
  return save(makeDoc(examen(true), { title: 'Examen final (respuestas)' }), '10_Evaluacion/Examen_final_CON_respuestas.docx');
};

// ───────────── 04 · Bonos ─────────────
const bonoCover = (n, t, sub) => [img('assets/logo_es.png', 150, { align: AlignmentType.LEFT, after: 160 }), P(`BONO ${n}`, { bold: true, color: 'B88A00', size: 22 }), BIG(t, { size: 44, after: 80 }), P(sub || `${CFG.curso.titulo} · ${CFG.instructor.nombre}`, { size: 22, color: K.gris, after: 240 })];
jobs.bono1 = async () => {
  const c = bonoCover(1, 'Kit de 20 fichas técnicas de componentes y sensores de la ECU');
  c.push(P('Componentes: definición → función → fallas → pruebas (multímetro, escáner, osciloscopio, Sens-22). Sensores y actuadores: nombre → función → fallas → DTCs → diagnóstico (multímetro, escáner, osciloscopio, Sens-22). Valores típicos: verificar con el manual del fabricante.'));
  c.push(H1('Parte A · Componentes de la computadora'));
  FI.componentes.forEach((f, i) => { c.push(H2(`A${i + 1}. ${f.nombre}`)); c.push(table(null, [['Definición', f.def], ['Función', f.fn], ['Fallas', f.fallas], ['Pruebas · Multímetro', f.mult], ['Pruebas · Escáner', f.esc], ['Pruebas · Osciloscopio', f.osc], ['Pruebas · Sens-22', f.sens]], [2400, 6960], { firstBold: true })); if (f.dg) c.push(img(`assets/diagramas/${f.dg}.png`, 380)); });
  c.push(H1('Parte B · Sensores y actuadores', { pb: true }));
  FI.sensores.forEach((f, i) => { c.push(H2(`B${i + 1}. ${f.nombre}`)); c.push(table(null, [['Función', f.fn], ['Fallas', f.fallas], ['DTCs', f.dtc], ['Diagnóstico · Multímetro', f.mult], ['Diagnóstico · Escáner', f.esc], ['Diagnóstico · Osciloscopio', f.osc], ['Diagnóstico · Sens-22', f.sens]], [2400, 6960], { firstBold: true })); if (f.dg) c.push(img(`assets/diagramas/${f.dg}.png`, 380)); });
  return save(makeDoc(c, { title: 'Bono 1 · Fichas técnicas' }), '04_Bonos/Bono_01_Fichas_tecnicas.docx');
};
jobs.bono2 = async () => {
  const c = bonoCover(2, 'Plano del banco de pruebas ECU y lista de materiales');
  c.push(img('assets/diagramas/d_banco.png', 620));
  c.push(H1('Armado paso a paso'));
  c.push(...numbered(['Consigue el diagrama de la PCM/ECM y marca B+, ignición, todas las tierras, CAN-H/CAN-L y las entradas/salidas que vas a usar.', 'Recupera conectores originales con 20–30 cm de cable (deshuesadero) para no abrir terminales con caimanes.', 'Instala fusible de 5 A en B+ y de 2 A en ignición, cada uno con su interruptor.', 'Une todas las tierras de la computadora a un punto común conectado al negativo de la fuente.', 'Arma el DLC de banco: 16 a B+, 4 y 5 a tierra, 6 a CAN-H y 14 a CAN-L; agrega 120 Ω entre 6 y 14 si la ECU va sola.', 'Prepara un potenciómetro de 5–10 kΩ en caja con bornes de 5 V, señal y retorno.', 'Conecta el generador CKP/CMP con el patrón del motor (Hall o VR según el sensor original).', 'Prepara cargas: LED + 1 kΩ por salida de inyector/bobina; lámpara de 12 V para relevadores.', 'Etiqueta cada cable con su función y terminal; toma foto del arnés terminado.', 'Prueba el banco con una ECU buena y registra su consumo, sus voltajes y su comunicación como referencia.']));
  c.push(H2('Protocolo de primer encendido'));
  c.push(...numbered(['Verifica polaridad dos veces.', 'Fuente a 13.5 V con límite de 1–2 A.', 'Activa B+, luego ignición; observa la corriente.', 'Cero: alimentación interrumpida. Límite: corto. Estable: comunica con el escáner.', 'Nunca conectes ni desconectes el arnés con la ECU energizada.']));
  c.push(H1('Lista de materiales por nivel', { pb: true }));
  const niveles = [...new Set(BO.bom.map(b => b[0]))];
  niveles.forEach(nv => { const rows = BO.bom.filter(b => b[0] === nv); const sub = rows.reduce((a, b) => a + b[2] * b[3], 0); c.push(H2(nv)); c.push(table(['Material', 'Cant.', 'Precio unit.', 'Subtotal', 'Estatus del precio'], [...rows.map(b => [b[1], String(b[2]), money(b[3]), money(b[2] * b[3]), b[4]]), ['Subtotal del nivel', '', '', money(sub), '']], [3800, 700, 1400, 1400, 2060])); });
  c.push(P('Precios consultados o estimados al 5 de noviembre de 2026; verificar al comprar. La hoja de Excel "Bono_02_Lista_de_materiales_banco.xlsx" recalcula totales con tus precios.', { size: 18, color: K.tenue, before: 120 }));
  return save(makeDoc(c, { title: 'Bono 2 · Banco de pruebas' }), '04_Bonos/Bono_02_Plano_banco_de_pruebas.docx');
};
const blank = '______________________________';
jobs.bono4 = async () => {
  const c = bonoCover(4, 'Orden de servicio, hoja de diagnóstico, garantía y carta responsiva', 'Formatos imprimibles · Personaliza los datos de tu taller');
  c.push(H1('Orden de servicio de computadora automotriz'));
  c.push(table(null, [['Folio', ''], ['Fecha y hora de recepción', ''], ['Cliente / taller', ''], ['Teléfono / WhatsApp', ''], ['Vehículo (marca, modelo, año, motor)', ''], ['VIN', ''], ['Kilometraje', ''], ['Computadora (tipo y número de parte)', ''], ['Síntoma reportado', ''], ['Historia: arranque con cables, soldadura, agua, choque, cambios previos', ''], ['Códigos iniciales (DTC)', ''], ['Estado de recepción (fotos tomadas: conector, etiqueta, carcasa)', ''], ['Costo del diagnóstico autorizado', ''], ['Fecha estimada de entrega', '']], [4200, 5160], { firstBold: true, zebra: false }));
  c.push(P('El cliente autoriza el diagnóstico con el costo indicado. Si no autoriza la reparación, paga sólo el diagnóstico y se le devuelve la computadora en las condiciones en que se recibió. Los precios se informan como precio total. ' + 'Aviso de privacidad: ver formato anexo.', { size: 18, before: 120 }));
  c.push(table(null, [['Firma del cliente', 'Firma de quien recibe'], ['\n\n', '\n\n']], [4680, 4680], { zebra: false }));
  c.push(H1('Hoja de diagnóstico en banco y vehículo', { pb: true }));
  c.push(table(['Medición', 'Valor esperado (típico)', 'Medido', 'OK / Falla'], [
    ['Caída de voltaje en tierras (con carga)', '< 0.1 V', '', ''], ['Caída de voltaje en alimentación', '< 0.3 V', '', ''], ['Consumo en banco (KOEO)', 'Según referencia del número de parte', '', ''], ['Comunicación con escáner', 'Sí', '', ''], ['Referencia 5 V #1 (sin carga / con 1 kΩ)', '5.0 V / 5.0 V', '', ''], ['Referencia 5 V #2', '5.0 V', '', ''], ['Resistencia CAN 6–14 (batería desconectada)', '≈ 60 Ω', '', ''], ['CAN-H / CAN-L recesivo', '≈ 2.5 V / 2.5 V', '', ''], ['Pulso de inyectores (osciloscopio)', 'Iguales entre cilindros', '', ''], ['Señal de encendido / dwell', 'Iguales entre cilindros', '', ''], ['Resistencia de inyectores', '≈ 11–18 Ω (verificar)', '', ''], ['Primario de bobinas (2 cables)', '≈ 0.4–1.5 Ω (verificar)', '', ''], ['Prueba térmica 30–60 min', 'Sin reinicios ni códigos', '', ''], ['Causa raíz identificada', '—', '', '']
  ], [3700, 2700, 1600, 1360]));
  c.push(P('Valores típicos; verificar con el manual del fabricante del vehículo.', { size: 18, color: K.tenue }));
  c.push(H1('Garantía por escrito', { pb: true }));
  c.push(P(`[Nombre del taller] garantiza la reparación de la computadora número de parte ${blank} del vehículo con VIN ${blank} por un plazo de [90] días naturales a partir de la fecha de entrega (${blank}), conforme a los artículos 77 y 81 de la Ley Federal de Protección al Consumidor.`));
  c.push(H3('Alcance')); c.push(P('Cubre la(s) etapa(s) reparada(s): ' + blank + blank + '. Si la falla reparada se presenta nuevamente por causa imputable al taller, se repara sin costo.'));
  c.push(H3('Exclusiones')); c.push(...bullets(['Daño causado por actuadores, sensores o arneses que el cliente no autorizó reparar (indicados en la orden).', 'Entrada de agua, golpes, manipulación o apertura por terceros.', 'Picos de voltaje por arranque con cables, soldadura eléctrica sin desconectar la batería o sistema de carga defectuoso.', 'Programación o modificaciones realizadas por terceros.']));
  c.push(H3('Cómo hacerla válida')); c.push(P('Presentar esta garantía y la orden de servicio. El tiempo que dure la reparación en garantía no se computa dentro del plazo.'));
  c.push(table(null, [['Firma del cliente', 'Sello y firma del taller'], ['\n\n', '\n\n']], [4680, 4680], { zebra: false }));
  c.push(H1('Carta responsiva para servicio de datos (memoria / inmovilizador)', { pb: true }));
  c.push(P(`Yo, ${blank}, con identificación oficial número ${blank}, declaro ser propietario(a) o representante legal del vehículo marca ${blank}, modelo ${blank}, año ${blank}, VIN ${blank}, lo cual acredito con ${blank} (factura o tarjeta de circulación), y autorizo a [Nombre del taller] a realizar el siguiente servicio: ${blank}${blank}.`));
  c.push(...bullets(['Se realizó respaldo de la(s) memoria(s) con doble lectura verificada; el archivo se conserva con el folio de la orden.', 'El servicio no incluye anular inmovilizadores ni sistemas de control de emisiones.', 'Libero al taller de responsabilidad por el uso de la información que yo haya proporcionado de forma falsa.']));
  c.push(P('Lugar y fecha: ' + blank));
  c.push(table(null, [['Firma del propietario(a)', 'Firma del técnico'], ['\n\n', '\n\n']], [4680, 4680], { zebra: false }));
  c.push(H1('Aviso de privacidad simplificado (modelo · por confirmar con asesor)', { pb: true }));
  c.push(P('[Nombre o razón social del taller], con domicilio en [domicilio], es responsable del tratamiento de sus datos personales (nombre, teléfono, correo, datos del vehículo, VIN y placas). Finalidades necesarias: recepción, diagnóstico, reparación, garantía y facturación del servicio. Finalidades que requieren su consentimiento: envío de promociones y contenido por WhatsApp o correo. Si no desea que sus datos se usen para estas últimas, indíquelo aquí: ☐ No acepto. Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición en [medio de contacto]. Aviso integral en [enlace].'));
  c.push(P('Modelo de referencia elaborado conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares publicada en el DOF el 20 de marzo de 2025; verifique requisitos vigentes con un asesor.', { size: 18, color: K.tenue }));
  return save(makeDoc(c, { title: 'Bono 4 · Formatos' }), '04_Bonos/Bono_04_Formatos_orden_garantia_responsiva.docx');
};
jobs.bono5 = async () => {
  const c = bonoCover(5, 'Tabla de DTC internos, de referencia y de red con qué medir');
  c.push(P('Descripciones genéricas basadas en la nomenclatura SAE J2012 y en información de servicio; algunos fabricantes usan definiciones propias. Confirme siempre con la información del vehículo.'));
  c.push(table(['Código', 'Descripción', 'Categoría', 'Qué medir primero', 'Clase'], BO.dtc.map(r => [r[0], r[1], r[2], r[3], String(r[4])]), [900, 3300, 1300, 3060, 800], { size: 18 }));
  return save(makeDoc(c, { title: 'Bono 5 · Tabla de DTC' }), '04_Bonos/Bono_05_Tabla_DTC.docx');
};
jobs.bono6 = async () => {
  const c = bonoCover(6, 'Banco de 40 prompts de IA para el reparador de ECU');
  c.push(P('Úsalos en ChatGPT, Gemini, Claude o Copilot. Sustituye lo que está entre corchetes. Regla de oro: la IA propone, el multímetro y el osciloscopio confirman. No compartas datos personales de clientes en herramientas de IA.'));
  const cats = [...new Set(BO.prompts.map(p => p[0]))]; let n = 0;
  cats.forEach(cat => { c.push(H2(cat)); c.push(table(['#', 'Prompt'], BO.prompts.filter(p => p[0] === cat).map(p => [String(++n), p[1]]), [700, 8660])); });
  return save(makeDoc(c, { title: 'Bono 6 · Prompts de IA' }), '04_Bonos/Bono_06_Prompts_IA.docx');
};
jobs.bono7 = async () => {
  const c = bonoCover(7, 'Kit de 15 mensajes de WhatsApp y plantilla de cotización');
  c.push(P('Envía mensajes promocionales sólo a contactos que hayan dado su consentimiento. Personaliza lo que está entre corchetes.'));
  BO.whatsapp.forEach((m, i) => { c.push(H3(`${i + 1}. ${m[0]}`)); c.push(callout(null, m[1], { fill: 'E6F6EA', border: K.verde })); });
  c.push(H1('Plantilla de cotización', { pb: true })); c.push(...numbered(BO.plantillaCotizacion));
  c.push(img('assets/diagramas/d_menu.png', 560));
  return save(makeDoc(c, { title: 'Bono 7 · Kit de WhatsApp' }), '04_Bonos/Bono_07_Kit_WhatsApp_y_cotizacion.docx');
};
jobs.bono8 = async () => {
  const c = bonoCover(8, '100 ideas para ganar más con la reparación de computadoras automotrices');
  c.push(P('Organizadas según las 3 formas de crecer de Jay Abraham: más clientes, mayor ticket promedio y más frecuencia. Ninguna idea es una promesa de ingresos; aplica las que encajen con tu taller y tu plaza.'));
  c.push(...numbered(BO.ideas));
  return save(makeDoc(c, { title: 'Bono 8 · 100 ideas' }), '04_Bonos/Bono_08_100_ideas.docx');
};
jobs.bono9 = async () => {
  const c = bonoCover(9, 'Plan de acción de 30 y 90 días + calendario de contenido de 30 días');
  c.push(H1('Plan de 30 días'));
  BO.plan30.forEach(s => { c.push(H2(`${s[0]} · ${s[1]}`)); c.push(...numbered(s[2])); });
  c.push(callout('Meta de recuperación (ejemplo ilustrativo)', 'Si el nivel recomendado se cobra en $2,600 MXN con $400 de materiales, una reparación cubre la inversión del curso de $1,799 MXN. No es una promesa de ingresos: depende de tu plaza, esfuerzo y calidad.'));
  c.push(H1('Plan de 90 días')); c.push(table(['Periodo', 'Enfoque', 'Metas'], BO.plan90, [1400, 1800, 6160]));
  c.push(H1('Calendario de contenido de 30 días', { pb: true }));
  c.push(table(['Día', 'Tipo', 'Tema', 'Formato', 'Relación'], BO.calendario.map(r => [String(r[0]), r[1], r[2], r[3], r[4]]), [700, 1500, 4060, 1700, 1400], { size: 18 }));
  c.push(P('Cada publicación: un tip útil + el llamado "Escribe ECU por WhatsApp". Casos reales sólo con permiso del cliente; nunca testimonios inventados.', { size: 18, color: K.tenue }));
  return save(makeDoc(c, { title: 'Bono 9 · Plan de acción' }), '04_Bonos/Bono_09_Plan_30_90_dias_y_calendario.docx');
};
jobs.plataforma = async () => {
  const c = [img('assets/logo_es.png', 150, { align: AlignmentType.LEFT }), BIG('Plataforma de automatización: decisión', { size: 40 }),
    P('El prompt maestro indica incluir la plataforma GoHighLevel como bono sólo si el tema involucra clientes, seguimiento o ventas. Este curso es técnico (reparación de computadoras), por lo que se sustituyó por bonos de uso inmediato en el taller: calculadora de cotización, formatos legales, kit de WhatsApp y plan de 30/90 días.'),
    H2('Lo que sí queda conectado'),
    ...bullets(['El lead magnet (07_Lead_Magnet/index.html) acepta un webhook opcional (por ejemplo, un webhook entrante de GoHighLevel) en su bloque CONFIG para capturar nombre, WhatsApp y resultado en JSON.', 'Si el webhook está vacío o falla, el resultado se envía por WhatsApp con mensaje prellenado.', 'Recomendación: etiqueta en tu CRM a los prospectos por resultado del semáforo (rojo, amarillo, verde) para dar seguimiento con el kit de WhatsApp.']),
    H2('Por confirmar'), ...bullets(['Si se desea ofrecer subcuentas de GoHighLevel a alumnos, definir quién paga los costos por uso (mensajes, llamadas, IA) y las reglas de uso.'])];
  return save(makeDoc(c, { title: 'Plataforma' }), '05_Plataforma/Plataforma_decision_y_conexion.docx');
};

// ───────────── 11 · Copys y lanzamiento (si existen los datos) ─────────────
jobs.copys = async () => {
  const mpath = path.join(__dirname, '../data/marketing.js'); if (!fs.existsSync(mpath)) return null;
  const M = require('../data/marketing');
  const c = [...cover({ kicker: 'Fase 7 · Publicidad', title: 'Textos de venta y plan de lanzamiento', subtitle: `${CFG.curso.titulo} · ${CFG.curso.marcas}`, lines: [`Llamado único: ${CFG.cta.texto} al ${CFG.cta.whatsappVisible}`, `Elaborado: ${CFG.fechaElaboracion}`] })];
  c.push(H1('Estrategia')); c.push(callout('Idea central', M.ideaCentral));
  c.push(table(['Ángulo', 'Mensaje'], M.angulos, [2400, 6960], { firstBold: true }));
  c.push(P('Regla: dar, dar, dar… y luego pedir. Cada pieza enseña un tip útil y lleva la publicidad del curso visible.', { before: 100 }));
  c.push(H1('Copys por plataforma para cada video', { pb: true }));
  M.videos.forEach(v => { c.push(H2(`${v.formato} · ${v.angulo}`)); c.push(table(['Plataforma', 'Texto'], v.copys, [2400, 6960], { firstBold: true })); c.push(H3('Guion de locución (opcional)')); c.push(...bullets(v.locucion)); });
  c.push(H1('Copys de las imágenes publicitarias', { pb: true }));
  c.push(table(['Pieza', 'Texto principal', 'Título', 'Descripción', 'Hashtags'], M.copysImagenes, [1300, 3000, 1500, 1260, 2300], { size: 16 }));
  c.push(H2('Prompts de IA para fotos realistas (opcional)')); c.push(P('Úsalos si prefieres una foto realista en el espacio de la imagen técnica (ChatGPT, Gemini, Midjourney o Ideogram). Todas piden imagen sin texto ni logotipos.', { size: 20 })); c.push(table(['Imagen', 'Prompt'], M.promptsIA, [2200, 7160], { firstBold: true, size: 18 }));
  c.push(H1('30 guiones de video "tip + curso"', { pb: true }));
  c.push(table(['#', 'Gancho', 'Tip', 'Clase'], M.guiones.map((g, i) => [String(i + 1), g[0], g[1], g[2]]), [500, 3000, 5000, 860], { size: 18 }));
  c.push(H1('Guion de la clase muestra gratuita (45 min)', { pb: true }));
  c.push(table(['Minuto', 'Bloque', 'Contenido'], M.claseMuestra, [1200, 2200, 5960]));
  c.push(H1('Secuencia de venta por WhatsApp (6 mensajes)'));
  M.secuenciaWA.forEach((m, i) => { c.push(H3(`${i + 1}. ${m[0]}`)); c.push(callout(null, m[1], { fill: 'E6F6EA', border: K.verde })); });
  c.push(H1('Plan de lanzamiento con fechas reales', { pb: true }));
  c.push(table(['Fecha', 'Acción', 'Pieza / canal'], M.lanzamiento, [1800, 4560, 3000], { size: 18 }));
  c.push(H1('Lead magnet: promoción')); c.push(table(['Pieza', 'Texto'], M.leadPromo, [2400, 6960], { firstBold: true }));
  c.push(H1('Checklist previo al lanzamiento')); c.push(...numbered(M.checklist));
  c.push(H1('Métricas')); c.push(table(['Métrica', 'Cómo se mide', 'Meta sugerida (por confirmar)'], M.metricas, [2600, 4000, 2760]));
  c.push(H1('Cumplimiento')); c.push(...bullets(M.cumplimiento));
  return save(makeDoc(c, { title: 'Copys y lanzamiento' }), '11_Copys_y_Lanzamiento/Copys_y_plan_de_lanzamiento.docx');
};

(async () => {
  for (const [k, fn] of Object.entries(jobs)) { if (only && only !== k) continue; const out = await fn(); if (out) console.log('ok', k, path.relative(path.resolve(__dirname, '../..'), out)); }
})().catch(e => { console.error(e); process.exit(1); });
