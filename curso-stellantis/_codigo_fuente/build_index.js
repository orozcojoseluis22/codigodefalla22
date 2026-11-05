// Índice de entregables (Word) a partir de lo que existe en la carpeta de entrega
const fs = require('fs'); const path = require('path');
const H = require('./lib/docx_helpers'); const { P, run, H1, H2, Bul, Tbl, Box, Link, doc, save, Cover, COL } = H;
const C = require('./data/course'); const R = require('./data/research');
const E = path.resolve('../entrega');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const desc = {
  '00_Indice_de_entregables': 'Este índice', '01_Investigacion': 'Investigación de mejores prácticas con 15 hallazgos, cambios recientes y 50 fuentes', '02_Temario': 'Temario del curso', '03_Clases': 'Manual del instructor y 12 presentaciones .pptx editables',
  '04_Bonos': '10 bonos: Laboratorio Interactivo, Atlas de diagramas, fichas, biblioteca de formas de onda, calculadora Excel, checklists, prompts, kit Google Maps, plan 30/90 y sesión en vivo',
  '05_Plataforma': 'No aplica (GoHighLevel sustituido por el Laboratorio Interactivo)', '06_Landing_Page': 'Landing de venta index.html + og-imagen.jpg', '07_Lead_Magnet': 'Detector de Fallas Stellantis + og-lead.jpg + promoción',
  '08_Animaciones': '3 videos MP4 (9:16, 1:1, 16:9), portadas, cuadros clave, guiones y fuentes HTML', '09_Imagenes_Publicitarias': '24 imágenes (juegos A–D), copy por imagen y prompts de IA', '10_Evaluacion': 'Examen final en 2 versiones', '11_Copys_y_Lanzamiento': 'Copys, 30 guiones, clase muestra, WhatsApp, plan de lanzamiento y métricas', '_codigo_fuente': 'Fuente única (datos) y generadores'
};
(async () => {
  const dirs = fs.readdirSync(E).filter(d => fs.statSync(path.join(E, d)).isDirectory()).sort();
  const rows = dirs.map(d => { const files = d === '_codigo_fuente' ? [] : walk(path.join(E, d)).filter(f => !/cuadros_clave|fuentes_html/.test(f)); return [d, desc[d] || '', d === '_codigo_fuente' ? 'Datos JSON/JS, plantillas y scripts' : files.length + ' archivos']; });
  const ch = [...Cover('Índice de entregables', C.curso.tituloLargo),
    H1('Resumen'), P(`Curso en línea de ${C.curso.clases} clases (${C.curso.horas} h) · ${C.curso.precioTxt} · ${C.curso.cta}. Todo el contenido sale de una fuente única (carpeta _codigo_fuente/data) y se regenera con los scripts de esa carpeta.`),
    H1('Entregables por carpeta'), Tbl(['Carpeta', 'Contenido', 'Archivos'], rows, [26, 58, 16]),
    H1('Vistas previas publicadas (privadas)'), ...[['Laboratorio de Diagnóstico Stellantis', 'https://claude.ai/artifact/JGiydVF24Fw9Pk1t58TajG'], ['Landing de venta', 'https://claude.ai/artifact/TBg22Tz9eN6kJTxEXzLTyB'], ['Detector de Fallas Stellantis (lead magnet)', 'https://claude.ai/artifact/Bw68eeANgy5fZQeJ9MoXJW']].flatMap(([t, u]) => [P(t, { bold: true, after: 0 }), Link(u, u)]),
    P('Las vistas previas son privadas: compártalas desde el menú Compartir de cada página si quiere que otras personas las vean.', { italics: true, size: 19, color: COL.sub }),
    H1('Temario'), Tbl(['Clase', 'Módulo', 'Título', 'Promesa'], C.clases.map(k => [String(k.n), C.modulos[k.mod - 1].t, k.t, k.promesa]), [10, 20, 29, 41]),
    H1('Hallazgos de la investigación que cambiaron el contenido'), ...R.hallazgos.slice(0, 7).map(h => Bul([run(h[0] + ': ', { bold: true }), run(h[1])])),
    H1('Datos por confirmar'), Tbl(['Dato', 'Valor actual', 'Dónde se cambia'], [
      ['WhatsApp', '52 55 5217 3484 (del anuncio de referencia)', 'CONFIG de landing, detector y laboratorio; data/meta.js'],
      ['Enlace de pago', 'Vacío (los botones abren WhatsApp)', 'CONFIG.checkoutUrl de la landing'],
      ['Garantía', C.garantia.nombre, 'data/meta.js → garantia'],
      ['Periodo de acceso', C.curso.periodoAcceso, 'CONFIG.periodoDeAcceso y data/meta.js'],
      ['Fechas del grupo', 'Sugerido: martes 12 de enero de 2027, martes y jueves 19:00–20:30', 'CONFIG.proximoGrupo y data/marketing.js'],
      ['Bono de El Buen Fin', 'Sesión extra de revisión de capturas (13–17 nov)', 'CONFIG.promo'],
      ['Webhook de GoHighLevel', 'Vacío (usa WhatsApp)', 'CONFIG.webhookUrl del detector'],
      ['Costos por uso', 'AutoAuth, wiTECH y suscripciones los paga el alumno o el taller; el curso no los incluye', 'Por confirmar con el instructor'],
      ['Valor de referencia de las clases', '$450 por clase (supuesto)', 'build_docs.js y build_pages.js'],
      ['Precios de equipo', 'Referencias en USD/EUR consultadas el 5 nov 2026', 'data/lab.js → equipos'],
      ['Edición presencial Querétaro', '25 y 26 de noviembre (anuncio de referencia)', 'data/meta.js']], [22, 42, 36]),
    H1('Cómo regenerar todo'), ...['cd _codigo_fuente && npm install (instala pptxgenjs, docx, uplot, papaparse y fuse.js)', 'node build_lab.js · node build_docs.js · python3 build_xlsx.py · node build_pptx.js', 'node build_pages.js · node build_ads.js · node build_videos.js · node build_copys.js · node build_index.js', 'Convertir Word a PDF: soffice --headless --convert-to pdf archivo.docx', 'Para cambiar un texto: edite data/*.js y vuelva a ejecutar los generadores que lo usan.'].map(x => Bul(x)),
    P(C.aviso, { italics: true, size: 18, color: COL.sub, before: 200 })];
  fs.mkdirSync(path.join(E, '00_Indice_de_entregables'), { recursive: true });
  await save(doc(ch, { title: 'Índice de entregables' }), path.join(E, '00_Indice_de_entregables', 'Indice_de_entregables.docx'));
  console.log('índice ok');
})();
