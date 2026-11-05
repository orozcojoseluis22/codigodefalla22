// Genera todos los documentos Word desde la fuente única
const fs = require('fs'); const path = require('path');
const H = require('./lib/docx_helpers'); const { P, run, BigTitle, H1, H2, H3, Bul, Num, Label, Tbl, Box, Img, Break, Link, doc, save, Cover, COL } = H;
const C = require('./data/course'); const R = require('./data/research'); const L = require('./data/lab'); const B = require('./data/bonos'); const DG = require('./data/diagramas');
const E = '../entrega/'; const mk = d => { fs.mkdirSync(E + d, { recursive: true }); return E + d + '/'; };
const H2pb = t => new H.D.Paragraph({ heading: H.D.HeadingLevel.HEADING_2, pageBreakBefore: true, children: [run(t, { bold: true, size: 26, color: COL.gris })], spacing: { before: 0, after: 100 } });
const money = n => '$' + n.toLocaleString('en-US') + ' MXN';
const valorTotal = C.bonos.reduce((a, b) => a + b.valor, 0);
const VALOR_CLASES = 12 * 450; // valor de referencia de las clases ($450 por clase de 90 min, explicado en el temario)
let numRef = 0; const nref = () => 'num' + (++numRef % 59 + 1);

// ---------- 1. Investigación ----------
async function investigacion() {
  const ch = [...Cover(R.titulo, R.subtitulo, ['Fecha de consulta: ' + R.fechaConsulta]),
    H1('Método'), P(R.metodo),
    H1('Resumen ejecutivo: 15 hallazgos'), ...R.hallazgos.flatMap((h, i) => [H3(`${i + 1}. ${h[0]}`), P(h[1] + ` (Fuentes: ${h[2]})`)]),
    H1('Cambios recientes'), Tbl(['Fecha', 'Cambio', 'Qué significa para el alumno'], R.cambios, [14, 43, 43]),
    ...R.secciones.flatMap(s => [H1(s.t), ...s.p.map(x => P(x)), ...(s.tabla ? [Tbl(s.tabla.enc, s.tabla.filas, s.tabla.enc.map(() => 1))] : []), ...(s.nota ? [P(s.nota, { italics: true, size: 19, color: COL.sub, before: 80 })] : [])]),
    H1('Advertencias sobre los datos'), ...R.advertencias.map(a => Bul(a)),
    H1('Fuentes'), ...R.fuentes.flatMap(f => [P([run(f[0] + ' · ', { bold: true, size: 20 }), run(f[1], { size: 20 })], { after: 0 }), Link(f[2], f[2])])];
  await save(doc(ch, { title: 'Investigación de mejores prácticas' }), mk('01_Investigacion') + 'Investigacion_mejores_practicas.docx');
}

// ---------- 2. Temario ----------
async function temario() {
  const c = C.curso;
  const ch = [...Cover(c.tituloLargo, c.subtitulo, ['Inversión: ' + c.precioTxt + ' · ' + c.clases + ' clases · ' + c.horas + ' horas']),
    H1('Ficha del curso'), Tbl(['Concepto', 'Detalle'], [['Modalidad', c.modalidad], ['Duración', `${c.clases} clases de ${c.duracionClase} · ${c.horas} horas · ${c.modulos} módulos`], ['Inversión', c.precioTxt], ['Imparte', C.instructor.nombre + ' · ' + C.instructor.empresa], ['Acceso', c.periodoAcceso], ['Próximo grupo', c.proximoGrupo], ['Requisitos', c.requisitos.join('\n')], ['Inscripción', c.cta + ' · ' + c.whatsappTxt]], [25, 75]),
    H1('Promesa'), Box([P(c.promesa, { bold: true, size: 24 })]),
    H1('¿Para quién es?'), ...C.avatares.map(a => Bul([run(a.nombre + ': ', { bold: true }), run(a.quiere)])),
    H2('Para quién no es'), ...['Quien busca un truco para borrar códigos sin diagnosticar.', 'Quien no tiene acceso a ningún vehículo para practicar las tareas.', 'Quien espera certificación oficial de una marca: este curso es independiente.'].map(x => Bul(x)),
    H1('Lo que vas a lograr'), ...C.logros.map(l => Num(l, 'num')),
    H1('Temario'), ...C.modulos.flatMap(m => [H2(`Módulo ${m.n}. ${m.t}`), P(m.promesa, { italics: true, color: COL.sub }),
      ...C.clases.filter(k => k.mod === m.n).flatMap(k => [H3(`Clase ${k.n}. ${k.t}`), P(k.promesa), ...k.temas.map(t => Bul(t.t))])]),
    H1('Bonos incluidos'), Tbl(['Bono', 'Qué recibes', 'Valor de referencia'], C.bonos.map(b => [`${b.n}. ${b.nombre}`, b.desc + '\n' + b.porque, money(b.valor)]), [30, 50, 20]),
    H1('Valor total frente a la inversión'), Tbl(['Concepto', 'Valor de referencia'], [['12 clases en vivo con grabación (referencia: $450 por clase de 90 min, precio típico de una sesión de capacitación técnica grupal; por confirmar)', money(VALOR_CLASES)], ['10 bonos', money(valorTotal)], ['Valor total de referencia', money(VALOR_CLASES + valorTotal)], ['Tu inversión', c.precioTxt]], [75, 25]),
    P('Los valores de referencia son estimaciones del precio que tendría cada componente por separado; no son precios de venta.', { italics: true, size: 19, color: COL.sub }),
    H1('Garantía'), Box([P(C.garantia.nombre, { bold: true }), P(C.garantia.texto)], 'E6F6E9', COL.verde),
    H1('Metodología'), ...['Cada clase: teoría aplicada, demostración con equipo real (Hantek, FNIRSI, Launch, Autel, Sens-22) y ejercicio en vivo.', 'Tarea semanal en un vehículo real con hoja de valores esperados contra reales.', 'Laboratorio Interactivo para subir capturas, practicar con referencias y seguir rutas de diagnóstico.', 'Repaso de 4 preguntas por clase y examen final.', 'Sesión en vivo de dudas para revisar casos de los alumnos.'].map(x => Bul(x)),
    H1('Instructor'), P(C.instructor.nombre, { bold: true }), P(C.instructor.bio), ...C.instructor.equipo.map(e => Bul(e)),
    P(C.aviso, { italics: true, size: 18, color: COL.sub, before: 200 })];
  await save(doc(ch, { title: 'Temario' }), mk('02_Temario') + 'Temario_Diagnostico_Stellantis_Pro.docx');
}

// ---------- 3. Manual del instructor ----------
async function manual() {
  const ch = [...Cover('Manual del instructor', C.curso.tituloLargo),
    H1('Cómo usar este manual'), ...['Cada clase tiene promesa, objetivos, agenda de 90 minutos, desarrollo de cada tema, ejercicio en vivo, tarea, errores comunes, repaso con respuestas, recursos y frase de cierre.', 'El desarrollo de cada tema incluye la idea clave, los 4 puntos de la lámina, la explicación para el instructor, la frase «Dilo así» y la imagen sugerida.', 'Las presentaciones .pptx usan el mismo contenido; las notas del orador contienen la explicación completa.', 'Los valores técnicos son típicos: verifíquelos con el manual del fabricante del vehículo exacto antes de enseñarlos como especificación.'].map(x => Bul(x)),
    H1('Material necesario'), ...['Osciloscopios Hantek 6074BE y 6022BE; FNIRSI 2C53P y 1013D', 'Escáneres Launch X431, CRT-511PRO y Autel MX900 (con acceso AutoAuth para las prácticas de SGW)', 'Probador Sens-22, multímetro, pinza amperimétrica de baja y alta corriente, atenuador 20:1', 'Caja de desconexión del DLC, lámpara de prueba LED, mantenedor de voltaje', 'Vehículo Stellantis de práctica (ideal: uno 2011–2017 y uno 2018 o posterior)', 'Laboratorio Interactivo abierto en la pantalla compartida'].map(x => Bul(x)),
    H1('Tabla de clases'), Tbl(['Clase', 'Módulo', 'Título', 'Promesa'], C.clases.map(k => [String(k.n), String(k.mod), k.t, k.promesa]), [8, 10, 32, 50])];
  for (const k of C.clases) {
    ch.push(Break(), P(`MÓDULO ${k.mod} · ${C.modulos[k.mod - 1].t.toUpperCase()}`, { bold: true, size: 18, color: COL.sub, after: 40 }), BigTitle(`Clase ${k.n}. ${k.t}`, { size: 40 }), Box([P([run('Promesa: ', { bold: true }), run(k.promesa)])]),
      H2('Objetivos'), ...k.obj.map(o => Num(o, nref())), H2('Agenda de 90 minutos'), Tbl(['Minutos', 'Actividad'], k.agenda.map(a => [String(a[0]), a[1]]), [15, 85]),
      H2('Desarrollo de los temas'));
    k.temas.forEach((t, i) => ch.push(H3(`${k.n}.${i + 1} ${t.t}`), P([run('Idea clave: ', { bold: true }), run(t.idea)]), ...t.p.map(x => Bul(x)), ...t.e.map(x => P(x)), Box([P([run('Dilo así: ', { bold: true }), run(t.dilo)])], 'EEF0F2', COL.gris), P([run('Imagen sugerida: ', { bold: true, size: 19 }), run(t.img, { size: 19, color: COL.sub })], { before: 80 })));
    ch.push(H2('Ejercicio en vivo: ' + k.ej.t), ...k.ej.pasos.map(x => Num(x, nref())), H2('Tarea de la semana'), ...k.tarea.map(x => Bul(x)), H2('Errores comunes'), ...k.errores.map(x => Bul(x)),
      H2('Repaso (respuesta correcta en negritas)'), ...k.repaso.flatMap(q => [P(q.q, { bold: true, after: 40 }), ...q.o.map((o, j) => Bul(j === 0 ? [run(o + '  ✔', { bold: true, color: '1E7A2E' })] : o))]),
      H2('Recursos y bonos de la clase'), ...k.recursos.map(x => Bul(x)), Box([P([run('Frase de cierre: ', { bold: true }), run(k.cierre)])], 'E6F6E9', COL.verde));
  }
  await save(doc(ch, { title: 'Manual del instructor' }), mk('03_Clases') + 'Manual_del_instructor.docx');
}

// ---------- 4. Examen (2 versiones) ----------
function shuffle(arr, seed) { const a = arr.map((x, i) => ({ x, i })); let s = seed; for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
async function examen() {
  const qs = C.clases.flatMap(k => k.repaso.map((q, j) => ({ ...q, k: k.n, seed: k.n * 31 + j * 7 + 5 })));
  const key = [];
  for (const conResp of [false, true]) {
    const ch = [P('DIAGNÓSTICO STELLANTIS PRO · EXAMEN FINAL', { bold: true, size: 20, color: COL.sub }), BigTitle(conResp ? 'Examen final · versión CON respuestas' : 'Examen final', { size: 44 }),
      Tbl(['Nombre', 'Fecha', 'Calificación'], [['', '', '      / ' + qs.length]], [50, 25, 25]),
      P('Instrucciones: marca con una X la casilla de la respuesta correcta. Solo hay una respuesta correcta por pregunta. Tiempo sugerido: 45 minutos.', { before: 160, after: 200 })];
    qs.forEach((q, n) => {
      const sh = shuffle(q.o, q.seed); const pos = sh.findIndex(s => s.i === 0); if (!conResp) key.push('ABCD'[pos]);
      ch.push(P(q.q, { bold: true, after: 60, keepNext: true }));
      const runs = []; sh.forEach((s, j) => { const ok = conResp && s.i === 0; runs.push(run((ok ? '☒ ' : '☐ ') + s.x, { bold: ok, color: ok ? '1E7A2E' : COL.texto, size: 21 })); if (j < 3) runs.push(run('      ', { size: 21 })); });
      ch.push(P(runs, { after: 200 }));
    });
    if (conResp) ch.push(H1('Clave de respuestas'), Tbl(['Pregunta (orden de aparición)', 'Posición correcta', 'Clase'], qs.map((q, i) => [String(i + 1), key[i] + ' (' + (key[i].charCodeAt(0) - 64) + 'ª opción de la fila)', 'Clase ' + q.k]), [40, 35, 25]));
    await save(doc(ch, { title: 'Examen final' }), mk('10_Evaluacion') + (conResp ? 'Examen_final_CON_respuestas.docx' : 'Examen_final_SIN_respuestas.docx'));
  }
  const dist = key.reduce((a, k) => (a[k] = (a[k] || 0) + 1, a), {}); console.log('Distribución de respuestas:', JSON.stringify(dist));
}

// ---------- 5. Bonos ----------
async function bonos() {
  // Bono 2 · Atlas
  const dA = mk('04_Bonos/Bono02_Atlas_diagramas');
  const ch2 = [...Cover('Atlas de diagramas didácticos Stellantis', '14 diagramas propios con puntos de prueba'), H1('Cómo usar el atlas'), ...['Los diagramas muestran la arquitectura típica y los puntos de prueba. No sustituyen al diagrama oficial del vehículo exacto.', 'Colores: rojo = B+, naranja = 5 V de referencia, azul = señal o control, negro = tierra, amarillo = CAN H, verde = CAN L, violeta = LIN, naranja punteado = 48 V.', 'Los círculos amarillos numerados son puntos de prueba; el pie de cada diagrama indica qué medir en cada uno.'].map(x => Bul(x))];
  DG.lista.forEach((d, i) => ch2.push(...(i ? [Break()] : []), H2(`${String(i + 1).padStart(2, '0')} · ${d.n}`), P(`Se estudia en la Clase ${d.clase}: ${C.clases[d.clase - 1].t}.`, { color: COL.sub }), Img(`build/diagramas/${d.id}.png`, 624, 395)));
  await save(doc(ch2, { title: 'Atlas de diagramas' }), dA + 'Atlas_diagramas_Stellantis.docx');
  fs.mkdirSync(dA + 'PNG', { recursive: true }); fs.mkdirSync(dA + 'SVG', { recursive: true });
  DG.lista.forEach((d, i) => { const n = `${String(i + 1).padStart(2, '0')}_${d.id}`; fs.copyFileSync(`build/diagramas/${d.id}.png`, `${dA}PNG/${n}.png`); fs.copyFileSync(`build/diagramas/${d.id}.svg`, `${dA}SVG/${n}.svg`); });
  // Bono 3 · Fichas
  const ch3 = [...Cover('12 fichas técnicas de sensores y actuadores', 'Formato: nombre → función → fallas → DTC → diagnóstico')];
  L.fichas.forEach((f, i) => ch3.push(...(i ? [Break()] : []), BigTitle(f.n, { size: 36 }), H2('Función'), P(f.f), H2('Fallas'), ...f.fallas.map(x => Bul(x)), H2('Códigos de falla (DTC)'), P(f.dtc.map(c => { const d = L.dtc.find(x => x.c === c); return d ? `${c}: ${d.d}` : c; }).join('\n')),
    H2('Diagnóstico'), Tbl(['Herramienta', 'Prueba'], [['Multímetro', f.mm], ['Escáner', f.esc], ['Osciloscopio', f.osc], ['Sens-22', f.sens]], [22, 78]), P('Valores típicos; verifique con el manual del fabricante.', { italics: true, size: 18, color: COL.sub, before: 80 })));
  await save(doc(ch3, { title: 'Fichas técnicas' }), mk('04_Bonos/Bono03_Fichas_tecnicas') + 'Fichas_tecnicas_sensores_actuadores.docx');
  // Bono 4 · Biblioteca de formas de onda (configuración)
  const ch4 = [...Cover('Biblioteca de formas de onda de referencia', 'Configuración del osciloscopio por señal · Hantek y FNIRSI'), H1('Cómo usarla'), ...['Abra el Laboratorio Interactivo (bono 1), pestaña Referencias, para ver cada señal en buen estado y con falla.', 'Con OpenHantek6022 (software libre para el Hantek 6022BE) o el software de Hantek, exporte CSV y súbalo a la pestaña Formas de onda.', 'Con FNIRSI 2C53P o 1013D, guarde la captura de pantalla y digitalícela en el Laboratorio (3 clics).', 'Guarde sus propias referencias de vehículos sanos por modelo y motor.'].map(x => Bul(x)),
    H1('Configuración por señal'), Tbl(['Señal', 'V/div', 'Tiempo/div', 'Disparo', 'Acoplamiento'], L.senales.map(s => [s.n, s.vdiv, s.tdiv, s.trig, s.acople]), [26, 15, 19, 22, 18]),
    ...L.senales.flatMap(s => { const sz = require('child_process').execSync(`python3 -c "from PIL import Image; print(*Image.open('build/referencias/${s.id}_ok.png').size)"`).toString().trim().split(' ').map(Number); const w = 600, h = Math.round(w * sz[1] / sz[0]);
      return [H2pb(s.n), P([run('Configuración: ', { bold: true }), run(`${s.vdiv} · ${s.tdiv} · disparo ${s.trig} · ${s.acople}`)]), P('En buen estado (referencia sintética):', { bold: true, after: 40 }), Img(`build/referencias/${s.id}_ok.png`, 540, Math.round(540 * h / w)), P([run('Cómo se ve bien: ', { bold: true }), run(s.bien)]), P('Con falla típica (referencia sintética):', { bold: true, after: 40, before: 120 }), Img(`build/referencias/${s.id}_bad.png`, 540, Math.round(540 * h / w)), P('Fallas típicas:', { bold: true, after: 40 }), ...s.fallas.map(x => Bul(x))]; })];
  await save(doc(ch4, { title: 'Biblioteca de formas de onda' }), mk('04_Bonos/Bono04_Biblioteca_formas_de_onda') + 'Guia_configuracion_osciloscopio.docx');
  // Bono 6 · Checklists
  const ch6 = [...Cover('Checklists imprimibles', 'Red, SGW, carga, consumo parásito, TIPM, arranque e intermitentes')];
  B.checklists.forEach((c, i) => ch6.push(...(i ? [Break()] : []), BigTitle(c.t, { size: 34 }), Tbl(['Vehículo / VIN', 'Orden de servicio', 'Técnico', 'Fecha'], [['', '', '', '']], [35, 25, 20, 20]), P('', { after: 60 }),
    Tbl(['✓', 'Paso', 'Semáforo'], c.items.map(it => ['☐', it, '🟢 🟡 🔴']), [6, 76, 18])));
  await save(doc(ch6, { title: 'Checklists' }), mk('04_Bonos/Bono06_Checklists') + 'Checklists_imprimibles.docx');
  // Bono 7 · Prompts
  let n = 0; const ch7 = [...Cover('Banco de 60 prompts de IA', 'Diagnóstico, atención al cliente y contenido'), H1('Reglas de uso'), ...['La IA es apoyo: toda conclusión se confirma midiendo con multímetro, osciloscopio y diagrama oficial.', 'No escriba datos personales del cliente (nombre, teléfono, VIN completo) sin su consentimiento.', 'Reemplace lo que está entre llaves {ASÍ} con los datos de su caso.', 'Para diagnóstico asistido en línea, consulte codigodefalla22.com.'].map(x => Bul(x))];
  for (const [cat, list] of Object.entries(B.prompts)) { ch7.push(H1(cat)); list.forEach(p => { n++; ch7.push(P([run(`Prompt ${n}. `, { bold: true }), run(p)], { after: 140 })); }); }
  await save(doc(ch7, { title: 'Banco de prompts' }), mk('04_Bonos/Bono07_Prompts_IA') + 'Banco_60_prompts_IA.docx'); console.log('Prompts:', n);
  // Bono 8 · Kit Google Maps + 100 ideas
  const ch8 = [...Cover('Kit Google Maps y WhatsApp + 100 ideas', 'Para talleres que atienden Chrysler, Dodge, Jeep y Ram'), H1('Cómo funciona Google Maps'), P('Google explica que los resultados locales se ordenan por relevancia, distancia y prominencia, y que no se puede pagar por un mejor lugar. Fuente: support.google.com/business/answer/7091.'),
    H1('Perfil de negocio en 10 pasos'), ...['Categoría principal precisa y categorías secundarias relacionadas.', 'Nombre real del negocio (sin palabras clave agregadas).', 'Dirección exacta y zona de servicio si atiende a domicilio.', 'Horario actualizado, incluidos días festivos.', 'Teléfono con WhatsApp y enlace de citas.', 'Lista de servicios con descripción: red CAN, SGW, carga con IBS, consumo parásito, TIPM, inmovilizador.', 'Mínimo 10 fotos reales: fachada, área de trabajo, equipo y técnicos.', 'Descripción del negocio de 750 caracteres con el método de diagnóstico.', 'Preguntas y respuestas frecuentes.', 'Publicación semanal y respuesta a todas las reseñas.'].map(x => Num(x, nref())),
    H1('WhatsApp Business'), ...['Catálogo con el menú de 3 opciones (Básico, Recomendado y Premium).', 'Respuestas rápidas: /horario, /ubicacion, /diagnostico, /pagos, /cita.', 'Etiquetas: nuevo, presupuesto enviado, en reparación, entregado, seguimiento.', 'Mensaje de bienvenida y de ausencia con aviso de privacidad breve y opción de baja.'].map(x => Bul(x)),
    H1('Calendario de 30 publicaciones'), Tbl(['Día', 'Publicación'], B.googlePosts.map((p, i) => [String(i + 1), p]), [10, 90]),
    H1('100 ideas para ganar más con diagnóstico Stellantis'), ...B.ideas.map(x => Num(x, 'num58')), P('Los casos y cifras de ejemplo son ilustrativos. No compre ni invente reseñas.', { italics: true, size: 18, color: COL.sub })];
  await save(doc(ch8, { title: 'Kit Google Maps y 100 ideas' }), mk('04_Bonos/Bono08_Kit_Google_Maps_WhatsApp') + 'Kit_Google_Maps_WhatsApp_100_ideas.docx'); console.log('Ideas:', B.ideas.length);
  // Bono 9 · Plan
  const ch9 = [...Cover('Plan de acción de 30 y 90 días', 'Para aplicar el método y recuperar la inversión (ejemplo ilustrativo)'), H1('Plan de 30 días'), ...B.plan30.flatMap(([s, it]) => [H2(s), Tbl(['✓', 'Acción', 'Fecha', 'Resultado'], it.map(x => ['☐', x, '', '']), [6, 54, 15, 25])]), H1('Plan de 90 días'), ...B.plan90.flatMap(([s, it]) => [H2(s), Tbl(['✓', 'Acción', 'Fecha', 'Resultado'], it.map(x => ['☐', x, '', '']), [6, 54, 15, 25])]), P('Los resultados dependen del mercado y del trabajo de cada taller. No se garantizan ingresos.', { italics: true, size: 18, color: COL.sub, before: 200 })];
  await save(doc(ch9, { title: 'Plan de acción' }), mk('04_Bonos/Bono09_Plan_30_90_dias') + 'Plan_de_accion_30_90_dias.docx');
  // Bono 10 · Sesión en vivo
  const ch10 = [...Cover('Sesión en vivo de dudas y casos', '90 minutos con el Prof. José Luis Orozco'), H1('Agenda'), Tbl(['Bloque', 'Actividad'], B.sesionVivo.map((x, i) => [String(i + 1), x]), [12, 88]), H1('Cómo preparar tu caso'), ...['Envía antes de la sesión tus capturas (CSV o imagen) y el informe del escáner.', 'Incluye año, modelo, motor y síntoma; omite datos personales del cliente.', 'Indica qué equipo tienes para que la recomendación sea práctica.', 'Fecha y hora de la sesión: por confirmar.'].map(x => Bul(x))];
  await save(doc(ch10, { title: 'Sesión en vivo' }), mk('04_Bonos/Bono10_Sesion_en_vivo') + 'Agenda_sesion_en_vivo.docx');
}

(async () => {
  await investigacion(); await temario(); await manual(); await examen(); await bonos();
  console.log('Documentos generados');
})().catch(e => { console.error(e); process.exit(1); });
