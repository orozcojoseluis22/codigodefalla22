// Construye la landing y el lead magnet (versión para dominio y versión de vista previa) desde la fuente única
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(ROOT, '..');
const CFG = require('../data/config'), O = require('../data/offer');
const CLASES = [...require('../data/course_m1'), ...require('../data/course_m2'), ...require('../data/course_m3'), ...require('../data/course_m4')];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => '$' + Number(n).toLocaleString('en-US') + ' MXN';
const LINKS = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data/links.json'), 'utf8')); } catch (e) { return {}; } })();
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap">';

async function assets() {
  const logo = await sharp(path.join(ROOT, 'assets/logo_es.png')).resize({ width: 240 }).png({ compressionLevel: 9 }).toBuffer();
  const prof = await sharp(path.join(ROOT, 'assets/prof_cutout_clean.png')).resize({ width: 440 }).webp({ quality: 82, alphaQuality: 90 }).toBuffer();
  return { LOGO: 'data:image/png;base64,' + logo.toString('base64'), PROF: 'data:image/webp;base64,' + prof.toString('base64') };
}
function jsonld() {
  const course = { '@context': 'https://schema.org', '@type': 'Course', name: CFG.curso.titulo + ' · ' + CFG.curso.marcas, description: CFG.curso.promesa, inLanguage: 'es-MX',
    provider: { '@type': 'Organization', name: CFG.instructor.empresa, url: 'https://' + CFG.instructor.web },
    offers: { '@type': 'Offer', price: String(CFG.precio), priceCurrency: 'MXN', category: 'Paid', availability: 'https://schema.org/LimitedAvailability' },
    hasCourseInstance: CFG.sedes.map(s => ({ '@type': 'CourseInstance', courseMode: 'onsite', startDate: s.inicioISO, endDate: s.finISO, location: { '@type': 'Place', name: s.lugar, address: s.direccion }, instructor: { '@type': 'Person', name: CFG.instructor.nombre }, courseWorkload: 'PT18H' })) };
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: O.faqs.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) };
  return `<script type="application/ld+json">${JSON.stringify(course)}</script><script type="application/ld+json">${JSON.stringify(faq)}</script>`;
}
function fill(tpl, map) { return tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in map ? map[k] : m)); }

async function landing(A) {
  const tpl = fs.readFileSync(path.join(ROOT, 'html/landing.src.html'), 'utf8');
  const totalBonos = O.bonos.reduce((a, b) => a + b.valor, 0), total = totalBonos + O.valorCurso;
  const map = {
    LOGO: A.LOGO, PROF: A.PROF, PRECIO: money(CFG.precio), GRUPO: esc(CFG.sedes.map(s => s.ciudad + ' ' + s.fechas).join(' · ')),
    SEDES: CFG.sedes.map(s => `<div class="sede"><p class="d">${esc(s.fechas.replace(' de 2026', ''))}</p><p class="c">${esc(s.ciudad)}</p><p class="l">${esc(s.lugar)} · ${esc(s.direccion)}</p></div>`).join(''),
    TIPS: O.consejos.map((t, i) => `<article class="tip"><p class="n">CONSEJO ${i + 1} DE 3</p><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p><p class="cl">Lo vemos completo en la Clase ${t.clase}</p></article>`).join(''),
    QUESTIONS: O.diagnostico.map((q, i) => `<fieldset class="q"><legend class="qt">${esc(q[0])}</legend><div class="yn" role="radiogroup" aria-label="Respuesta ${i + 1}"><input type="radio" id="q${i}s" name="q${i}" value="si"><label for="q${i}s">Sí</label><input type="radio" id="q${i}n" name="q${i}" value="no"><label for="q${i}n">No</label></div></fieldset>`).join(''),
    SLIDERS: O.calculadora.map(c => `<div class="sl"><div class="row"><label for="s-${c.id}">${esc(c.label)}</label><output id="o-${c.id}" for="s-${c.id}"></output></div><input type="range" id="s-${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.val}"></div>`).join(''),
    TEMARIO: O.modulos.map(m => `<div class="mod"><b>Módulo ${m.n} · ${esc(m.nombre)}</b><span>${esc(m.resultado)}</span></div>` + CLASES.filter(k => k.modulo === m.n).map(k => `<details class="cl"><summary><span class="f">CL-${String(k.n).padStart(2, '0')}</span><span class="t">${esc(k.titulo)}</span><span class="pl" aria-hidden="true">+</span></summary><div class="body"><p>${esc(k.promesa)}</p><ul>${k.temas.map(t => `<li>${esc(t.t)}</li>`).join('')}</ul><p class="prac"><b>Práctica:</b> ${esc(k.ejercicio.titulo)}</p></div></details>`).join('')).join(''),
    STACK: `<tr><td>Curso presencial · 12 sesiones · 18 h</td><td>${money(O.valorCurso)}</td></tr>` + O.bonos.map(b => `<tr><td>Bono ${b.n}: ${esc(b.nombre)}</td><td>${money(b.valor)}</td></tr>`).join(''),
    TOTAL: money(total), PROMO: esc(O.valorCursoNota),
    BUENFIN_T: esc(O.bonoBuenFin.nombre), BUENFIN_D: esc(O.bonoBuenFin.descripcion),
    SI: O.paraQuienSi.map(t => `<li><span class="mk" aria-hidden="true">✓</span><span>${esc(t)}</span></li>`).join(''),
    NO: O.paraQuienNo.map(t => `<li><span class="mk" aria-hidden="true">✕</span><span>${esc(t)}</span></li>`).join(''),
    TOOLS: CFG.instructor.herramientas.map(t => `<li>${esc(t)}</li>`).join(''),
    GAR_T: esc(O.garantia.nombre), GAR_D: esc(O.garantia.texto),
    FAQ: O.faqs.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join(''),
    DATA: JSON.stringify({ diagnostico: O.diagnostico, calculadora: O.calculadora, clases: CLASES.map(k => ({ n: k.n, titulo: k.titulo })) })
  };
  const titleA = 'Reparación de computadoras automotrices';
  const desc = 'Curso presencial de 18 h en León y CDMX: diagnostica en banco y repara ECU, ECM y PCM Chrysler, Dodge, Jeep y Nissan a nivel componente. Imparte el Prof. José Luis Orozco Cuautle.';
  // Versión para dominio (documento completo)
  const full = fill(tpl, { ...map, LEADURL: LINKS.leadDomain || '../07_Lead_Magnet/index.html' });
  const head = `<!doctype html>\n<html lang="es-MX">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>Curso ${titleA} | Electrónica y Servicio</title>\n<meta name="description" content="${esc(desc)}">\n<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${esc(titleA)} · Chrysler, Dodge, Jeep y Nissan"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="og-imagen.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">\n<meta name="theme-color" content="#1E2227">\n${FONTS}\n${jsonld()}\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>\n</head>\n<body>\n`;
  fs.mkdirSync(path.join(OUT, '06_Landing_Page'), { recursive: true });
  fs.writeFileSync(path.join(OUT, '06_Landing_Page/index.html'), head + full + '\n</body>\n</html>\n');
  // Versión de vista previa (Artifact): sin doctype/html/head/body
  const prev = fill(tpl, { ...map, LEADURL: LINKS.leadArtifact || '' });
  fs.writeFileSync(path.join(ROOT, 'html/landing_preview.html'), `<title>${titleA}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<meta name="description" content="${esc(desc)}">\n${FONTS}\n${jsonld()}\n` + prev);
  console.log('landing ok', (fs.statSync(path.join(OUT, '06_Landing_Page/index.html')).size / 1024).toFixed(0) + ' KB');
}

async function lead(A) {
  const p = path.join(ROOT, 'html/lead.src.html'); if (!fs.existsSync(p)) return;
  const L = require('../data/leadmagnet');
  const tpl = fs.readFileSync(p, 'utf8');
  const map = { LOGO: A.LOGO, PROF: A.PROF, PRECIO: money(CFG.precio), DATA: JSON.stringify(L.data), FAQ: L.faq.map(f => `<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join(''), NOMBRE: esc(L.nombre), PROMESA: esc(L.promesa) };
  const desc = L.promesa;
  const ld = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: L.nombre, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', inLanguage: 'es-MX', offers: { '@type': 'Offer', price: '0', priceCurrency: 'MXN' }, provider: { '@type': 'Organization', name: CFG.instructor.empresa, url: 'https://' + CFG.instructor.web } })}</script>`;
  const full = fill(tpl, { ...map, CURSOURL: LINKS.landingDomain || '../06_Landing_Page/index.html' });
  const head = `<!doctype html>\n<html lang="es-MX">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>${esc(L.titulo)} | Electrónica y Servicio</title>\n<meta name="description" content="${esc(desc)}">\n<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:title" content="${esc(L.titulo)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="og-lead.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#1E2227">\n${FONTS}\n${ld}\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>\n</head>\n<body>\n`;
  fs.mkdirSync(path.join(OUT, '07_Lead_Magnet'), { recursive: true });
  fs.writeFileSync(path.join(OUT, '07_Lead_Magnet/index.html'), head + full + '\n</body>\n</html>\n');
  const prev = fill(tpl, { ...map, CURSOURL: LINKS.landingArtifact || '' });
  fs.writeFileSync(path.join(ROOT, 'html/lead_preview.html'), `<title>${esc(L.titulo)}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n${FONTS}\n${ld}\n` + prev);
  console.log('lead ok', (fs.statSync(path.join(OUT, '07_Lead_Magnet/index.html')).size / 1024).toFixed(0) + ' KB');
}
(async () => { const A = await assets(); await landing(A); await lead(A); })().catch(e => { console.error(e); process.exit(1); });
