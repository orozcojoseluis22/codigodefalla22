// Documento de copys y lanzamiento + prompts de IA para imágenes, desde la fuente única
const fs = require('fs');
const H = require('./lib/docx_helpers'); const { P, run, BigTitle, H1, H2, H3, Bul, Num, Tbl, Box, Break, doc, save, Cover, COL } = H;
const M = require('./data/marketing'); const C = require('./data/course');
const E = '../entrega/'; const mk = d => { fs.mkdirSync(E + d, { recursive: true }); return E + d + '/'; };
// 30 guiones "tip + curso" derivados de los temas del curso (3 por clase, clases 1 a 10)
const guiones = C.clases.slice(0, 10).flatMap(k => k.temas.slice(0, 3).map(t => ({ k, t }))).slice(0, 30);
const prompts = [
  ['Técnico midiendo el DLC', 'Fotografía realista de un técnico automotriz mexicano de 40 años con camisa de trabajo azul marino, midiendo con un multímetro digital en el conector de diagnóstico OBD2 bajo el tablero de una camioneta, encuadre medio desde el lado del conductor, luz de taller fría con relleno suave, estilo fotografía comercial nítida, fondo de taller desenfocado, proporción 4:5, sin texto ni logotipos.'],
  ['Osciloscopio en el compartimento del motor', 'Fotografía realista de un osciloscopio portátil de mano mostrando dos señales cuadradas amarillas y verdes, apoyado sobre la salpicadera de un SUV con el cofre abierto, puntas de prueba conectadas a un sensor del motor, enfoque en la pantalla, luz natural de mediodía, profundidad de campo baja, proporción 1:1, sin texto ni logotipos.'],
  ['Banco de trabajo con equipo', 'Fotografía cenital realista de un banco de trabajo de taller con un multímetro, una pinza amperimétrica, un osciloscopio USB conectado a una laptop y una caja de desconexión OBD2, sobre superficie gris metálica, iluminación uniforme de estudio, estilo catálogo técnico, proporción 16:9, sin texto ni logotipos.'],
  ['Pinza amperimétrica en la batería', 'Fotografía realista en primer plano de una pinza amperimétrica de baja corriente abrazando el cable negativo de la batería de una camioneta, pantalla con lectura en miliamperes, luz lateral cálida, fondo oscuro del compartimento del motor, proporción 4:5, sin texto ni logotipos.'],
  ['Explicación al cliente', 'Fotografía realista de un técnico mostrando una tableta con una gráfica de osciloscopio a un cliente en el mostrador de un taller limpio en México, ambos sonriendo con naturalidad, luz suave de ventana, estilo fotografía documental, proporción 9:16, sin texto ni logotipos.'],
  ['Arnés reparado', 'Fotografía macro realista de un arnés automotriz con un empalme sellado con termocontráctil nuevo junto a un tramo de cable rozado, iluminación de anillo, fondo negro, proporción 1:1, sin texto ni logotipos.']
];
(async () => {
  const csv = fs.readFileSync(E + '09_Imagenes_Publicitarias/Copys_por_imagen.csv', 'utf8').replace(/^﻿/, '').split('\n').slice(1).map(l => l.match(/"((?:[^"]|"")*)"/g).map(x => x.slice(1, -1).replace(/""/g, '"')));
  const ch = [...Cover('Copys y plan de lanzamiento', 'Publicidad «dar, dar, dar… y luego pedir» · Escribe STELLANTIS por WhatsApp'),
    H1('Estrategia'), Box([P([run('Idea central: ', { bold: true }), run(M.ideaCentral)])]), H2('6 ángulos de venta'), Tbl(['Ángulo', 'Mensaje'], M.angulos, [28, 72]),
    P('Regla: cada pieza enseña un tip útil y siempre lleva la publicidad del curso (nombre, precio y llamado). Sin promesas de ingresos, sin aludir a atributos personales del lector y con los ejemplos rotulados como ilustrativos.', { before: 120 }),
    H1('Videos: guiones de locución'), ...M.videos.flatMap(v => [H2(`${v.id} · ${v.w}×${v.h} · ángulo: ${v.angulo}`), ...v.locucion.map(x => Bul(x))]),
    H1('Copys por plataforma'), ...M.videos.flatMap(v => [H2(v.id), Tbl(['Plataforma', 'Copy'], Object.entries(M.copysVideo).map(([k, x]) => [k, x]), [24, 76])]),
    H1('30 guiones de video «tip + curso» (20 a 30 s)'), P('Estructura: gancho (0–3 s) con la frase «Dilo así» del tema, tip (3–20 s) con la idea clave y una medición, cierre (20–30 s) con la clase relacionada y el llamado.'),
    ...guiones.flatMap(({ k, t }, i) => [H3(`Guion ${i + 1} · ${t.t}`), P([run('Gancho: ', { bold: true }), run(t.dilo)], { after: 40 }), P([run('Tip: ', { bold: true }), run(t.idea + ' ' + t.p[0])], { after: 40 }), P([run('Cierre: ', { bold: true }), run(`Lo vemos completo en la Clase ${k.n} de Diagnóstico Stellantis Pro. Escribe STELLANTIS por WhatsApp.`)])]),
    H1('Guion de la clase muestra gratuita (45 minutos)'), Tbl(['Minutos', 'Contenido'], M.claseMuestra, [16, 84]),
    H1('Secuencia de venta por WhatsApp (6 mensajes)'), Tbl(['Momento', 'Mensaje'], M.secuenciaWhatsApp, [20, 80]), P('Enviar solo a quien escribió o aceptó recibir mensajes. Siempre incluir la opción de baja.', { italics: true, size: 19, color: COL.sub }),
    H1('Promoción del lead magnet'), H2('5 publicaciones para redes'), ...M.lead.posts.map(x => Num(x, 'num40')), H2('Mensaje para listas de difusión de WhatsApp'), Box([M.lead.whatsapp]), H2('Guion de video de 20 a 30 segundos'), P(M.lead.video),
    H1('Copy de cada imagen'), Tbl(['Archivo', 'Texto principal', 'Título', 'Descripción', 'Hashtags'], csv.map(r => [r[0].split('/').pop(), r[2], r[3], r[4], r[5]]), [22, 34, 16, 12, 16]),
    H1('Plan de lanzamiento (fechas reales desde el 5 de noviembre de 2026)'), Tbl(['Fecha', 'Fase', 'Acciones'], M.lanzamiento, [20, 16, 64]), P('Fecha comercial más cercana: El Buen Fin, del 13 al 17 de noviembre de 2026. Se usa un bono de inscripción anticipada en lugar de un descuento. Fechas del grupo por confirmar.', { italics: true, size: 19, color: COL.sub }),
    H1('Checklist previo al lanzamiento'), Tbl(['✓', 'Punto'], M.checklist.map(x => ['☐', x]), [6, 94]),
    H1('Métricas'), Tbl(['Métrica', 'Cómo se calcula'], M.metricas, [40, 60]),
    H1('Cumplimiento'), ...['Meta y Google: sin ingresos garantizados, sin «¿Eres…?» ni frases que asignen atributos personales al lector, sin antes y después engañosos.', 'Profeco: precio claro ($1,799 MXN) y publicidad veraz; las condiciones (acceso, garantía, fechas) se publican cuando se confirmen.', 'LFPDPPP 2025: aviso de privacidad visible y consentimiento antes de enviar mensajes; opción de baja en cada mensaje.', 'Sorteos o rifas promocionales: requieren permiso de la Secretaría de Gobernación; este plan no los usa.', 'Nunca testimonios inventados; reseñas solo reales y con autorización.', 'Música: los videos no llevan música; si se agrega, usar música libre de derechos o con licencia.', 'Marcas: Chrysler, Dodge, Jeep, Ram y Stellantis se mencionan de forma descriptiva; no se usan sus logotipos como patrocinadores.'].map(x => Bul(x))];
  await save(doc(ch, { title: 'Copys y lanzamiento' }), mk('11_Copys_y_Lanzamiento') + 'Copys_y_plan_de_lanzamiento.docx');
  const ch2 = [...Cover('Prompts de IA para imágenes realistas', 'Para ChatGPT, Gemini, Midjourney o Ideogram'), P('Las piezas del curso usan imágenes técnicas dibujadas en SVG. Si quiere sustituir el centro de un anuncio por una foto realista, use estos prompts y respete el espacio reservado. Revise que la imagen generada no muestre logotipos ni texto, ni personas reales identificables.'), ...prompts.flatMap(([t, p], i) => [H3(`${i + 1}. ${t}`), Box([p], 'EEF0F2', COL.gris)])];
  await save(doc(ch2, { title: 'Prompts de IA para imágenes' }), mk('09_Imagenes_Publicitarias') + 'Prompts_IA_imagenes.docx');
  fs.writeFileSync(E + '09_Imagenes_Publicitarias/Prompts_IA_imagenes.txt', prompts.map(([t, p], i) => `${i + 1}. ${t}\n${p}\n`).join('\n'));
  fs.writeFileSync(E + '08_Animaciones/Guiones_de_locucion.txt', M.videos.map(v => `${v.id} (${v.w}x${v.h}) · ${v.angulo}\n` + v.locucion.join('\n')).join('\n\n'));
  fs.writeFileSync(E + '07_Lead_Magnet/Promocion_del_lead_magnet.txt', `PUBLICACIONES\n${M.lead.posts.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\nMENSAJE DE DIFUSIÓN (WhatsApp)\n${M.lead.whatsapp}\n\nGUION DE VIDEO 20–30 s\n${M.lead.video}\n`);
  console.log('Copys:', guiones.length, 'guiones');
})();
