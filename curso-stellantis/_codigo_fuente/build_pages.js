// Landing de venta y lead magnet desde la fuente única
const fs = require('fs'); const path = require('path');
const C = require('./data/course'); const L = require('./data/lab');
const R = f => fs.readFileSync(f, 'utf8');
const b64 = (f, m) => `data:${m};base64,` + fs.readFileSync(f).toString('base64');
const LOGO = b64('assets/logo_es_small.png', 'image/png'), PROF = b64('assets/prof_web.jpg', 'image/jpeg');
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">`;
const faq = [
  ['¿Necesito osciloscopio para tomar el curso?', 'No es indispensable para empezar. Con multímetro y escáner aprovechas buena parte del curso; el osciloscopio se enseña desde cero y el Laboratorio trae ejemplos para practicar. Si vas a comprar uno, la pestaña Equipo te dice cuál conviene primero.'],
  ['¿Me sirve si tengo un escáner genérico?', 'Sí. Aprenderás qué puedes hacer con él, qué no puede ver (módulos de carrocería y red) y cuándo conviene un escáner bidireccional con AutoAuth para los modelos 2018 y posteriores.'],
  ['¿Las clases quedan grabadas?', 'Sí. Las 12 clases son en vivo y quedan grabadas. Periodo de acceso: ' + C.curso.periodoAcceso + '.'],
  ['¿Qué pasa si no puedo asistir a una clase en vivo?', 'Ves la grabación y haces la tarea. En la sesión en vivo de dudas (bono 10) revisamos tus capturas y casos.'],
  ['¿Incluye los diagramas oficiales de Stellantis?', 'No. Incluye un Atlas de 14 diagramas didácticos propios con puntos de prueba y te enseñamos dónde conseguir la información oficial (portal técnico de Stellantis, Mitchell, ALLDATA).'],
  ['¿Voy a aprender a programar módulos?', 'Aprenderás cuándo se requiere programar y alinear la configuración PROXI, qué equipo y suscripciones se necesitan y cómo hacerlo con seguridad. El curso no vende accesos ni suscripciones de terceros.'],
  ['¿Cómo pago?', 'Escribe STELLANTIS por WhatsApp y te enviamos las opciones de pago vigentes (formas de pago y meses sin intereses por confirmar).'],
  ['¿Tiene garantía?', C.garantia.texto + ' (por confirmar).'],
  ['¿Es un curso oficial de Chrysler, Dodge, Jeep, Ram o Stellantis?', 'No. Es un curso independiente de Electrónica y Servicio; las marcas mencionadas pertenecen a sus titulares.']
];
const P = {
  precio: C.curso.precio, aviso: C.aviso, bio: C.instructor.bio, equipo: C.instructor.equipo, garantia: C.garantia, bonos: C.bonos.map(b => ({ n: b.n, nombre: b.nombre, valor: b.valor })), valorClases: 12 * 450,
  modulos: C.modulos, clases: C.clases.map(k => ({ n: k.n, mod: k.mod, t: k.t, promesa: k.promesa, temas: k.temas.map(t => t.t) })),
  tips: [
    { t: 'Mide la red antes de culpar al módulo', x: 'Con la batería desconectada, entre las terminales 6 y 14 del DLC deben medirse unos 60 Ω. Si mides 120 Ω falta una terminación; si mides 0 Ω, CAN H y CAN L están en corto.', c: 4 },
    { t: 'Si lee pero no borra, no es el módulo', x: 'En un Stellantis 2018 o posterior, el Security Gateway deja leer códigos y datos, pero bloquea borrar y activar sin AutoAuth. Si el módulo responde a la lectura, la comunicación funciona.', c: 5 },
    { t: 'Antes de cambiar el TIPM, revisa el VIN', x: 'Las Durango y Grand Cherokee 2011–2013 tienen campañas del relevador de la bomba en el TIPM (NHTSA 14V530, 15V115 y 19V813). Revisar campañas por VIN te da autoridad y ahorra dinero a tu cliente.', c: 6 }],
  preguntas: [
    { q: '¿Mides alimentaciones y tierras con caída de voltaje bajo carga?', corto: 'Caída de voltaje bajo carga', c: 1 },
    { q: '¿Sigues un método fijo antes de cambiar una pieza?', corto: 'Método de diagnóstico de 6 pasos', c: 2 },
    { q: '¿Sabes leer un diagrama Stellantis y marcar puntos de prueba?', corto: 'Lectura de diagramas y plan de prueba', c: 3 },
    { q: '¿Sabes qué significa medir 60 Ω o 120 Ω entre las terminales 6 y 14 del DLC?', corto: 'Prueba de red CAN en el DLC', c: 4 },
    { q: '¿Distingues un bloqueo del Security Gateway de una falla real de comunicación?', corto: 'Security Gateway y AutoAuth', c: 5 },
    { q: '¿Mides el consumo parásito sin despertar los módulos?', corto: 'Consumo parásito con método', c: 6 },
    { q: '¿Capturas CKP y CMP en dos canales y sabes compararlos?', corto: 'Correlación CKP–CMP con osciloscopio', c: 9 },
    { q: '¿Aíslas una falla de encendido sin cambiar todas las bobinas?', corto: 'Aislamiento de fallas de encendido', c: 8 },
    { q: '¿Diagnosticas la carga inteligente con IBS y línea LIN?', corto: 'Carga inteligente con IBS', c: 10 },
    { q: '¿Tienes tu tarifa de diagnóstico calculada y un menú de 3 opciones?', corto: 'Tarifa y menú de 3 opciones', c: 12 }],
  si: ['Eres técnico o dueño de taller y te llegan Jeep, Ram, Dodge o Chrysler.', 'Quieres dejar de cambiar piezas a ciegas y medir con método.', 'Tienes (o vas a comprar) multímetro, escáner y, de preferencia, osciloscopio.', 'Quieres cobrar el diagnóstico como especialista.'],
  no: ['Buscas un truco para borrar códigos sin diagnosticar.', 'No tienes acceso a ningún vehículo para hacer las tareas.', 'Esperas una certificación oficial de la marca.', 'Buscas ingresos garantizados: aquí aprendes un oficio que depende de tu trabajo.'],
  faq
};
const LM = {
  aviso: C.aviso, clases: C.clases.map(k => ({ n: k.n, t: k.t })), sintomas: L.sintomas, arboles: L.arboles,
  equipos: L.equipos.filter(e => ['mm', 'lampara', 'logica', 'escgen', 'escbi', 'autoauth', 'osc2', 'pinzaB', 'pinzaA', 'sens22', 'dlcbox', 'probbat', 'presion'].includes(e.id)).map(e => ({ id: e.id, n: e.n })),
  faqLm: [['¿Es gratis de verdad?', 'Sí, 100% gratis y sin registro. Solo si quieres recibir tu resultado por WhatsApp te pedimos nombre y número, con tu consentimiento.'], ['¿Sustituye al diagnóstico con equipo?', 'No. Te dice qué medir y en qué orden; la conclusión siempre se confirma midiendo con el diagrama oficial.'], ['¿Para qué años sirve?', 'Para Chrysler, Dodge, Jeep y Ram de las generaciones con red CAN; en los 2018 y posteriores te avisa sobre el Security Gateway.'], ['¿Dónde aprendo todo el método?', 'En el curso Diagnóstico Stellantis Pro: 12 clases en línea con el Laboratorio Interactivo completo.']]
};
const jsonld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const head = (title, desc, og, ld) => `<title>${title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${desc}">
<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:image" content="${og}"><meta name="twitter:card" content="summary_large_image">
${FONTS}
${ld}`;
function build(name, title, desc, og, ld, body, js, data, outDir) {
  const h = head(title, desc, og, ld) + `\n<style>${R('src/pages/base.css')}</style>`;
  const b = R(body).replace(/__LOGO__/g, LOGO).replace(/__PROF__/g, PROF);
  const s = `<script>window.__PAGE__ = ${JSON.stringify(data).replace(/</g, '\\u003c')};</script>\n<script>${R(js)}</script>`;
  fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync('build/artifact', { recursive: true });
  fs.writeFileSync(path.join(outDir, name), `<!doctype html>\n<html lang="es-MX">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${h}\n</head>\n<body>\n${b}\n${s}\n</body>\n</html>\n`);
  const art = `${h}\n${b}\n${s}\n`.replace('enlaceLeadMagnet: "detector-fallas-stellantis.html",', 'enlaceLeadMagnet: "https://claude.ai/artifact/Bw68eeANgy5fZQeJ9MoXJW",').replace('enlaceCurso: "index.html",', 'enlaceCurso: "https://claude.ai/artifact/TBg22Tz9eN6kJTxEXzLTyB",');
  fs.writeFileSync('build/artifact/' + name.replace('index', 'landing-stellantis'), art);
  console.log(name, (fs.statSync(path.join(outDir, name)).size / 1024).toFixed(0) + ' KB');
}
const course = { '@context': 'https://schema.org', '@type': 'Course', name: C.curso.tituloLargo, description: C.curso.subtitulo, inLanguage: 'es-MX', provider: { '@type': 'Organization', name: 'Electrónica y Servicio', url: 'https://electronicayservicio.com' }, instructor: { '@type': 'Person', name: 'José Luis Orozco Cuautle' }, offers: { '@type': 'Offer', price: '1799', priceCurrency: 'MXN', category: 'Paid' }, hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT18H' } };
const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) };
build('index.html', 'Diagnóstico Stellantis Pro', 'Curso en línea de 12 clases para diagnosticar fallas eléctricas, de red y de motor en Chrysler, Dodge, Jeep y Ram con multímetro, escáner y osciloscopio. Prof. José Luis Orozco Cuautle.', 'og-imagen.jpg', jsonld(course) + '\n' + jsonld(faqLd), 'src/pages/landing.body.html', 'src/pages/landing.js', P, '../entrega/06_Landing_Page');
const app = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Detector de Fallas Stellantis', applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'es-MX', offers: { '@type': 'Offer', price: '0', priceCurrency: 'MXN' }, author: { '@type': 'Person', name: 'José Luis Orozco Cuautle' } };
const faqLd2 = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: LM.faqLm.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) };
build('detector-fallas-stellantis.html', 'Detector de Fallas Stellantis', 'Herramienta gratuita para técnicos: tu ruta de diagnóstico con semáforo para Chrysler, Dodge, Jeep y Ram según tu equipo, en 7 minutos.', 'og-lead.jpg', jsonld(app) + '\n' + jsonld(faqLd2), 'src/pages/lead.body.html', 'src/pages/lead.js', LM, '../entrega/07_Lead_Magnet');
