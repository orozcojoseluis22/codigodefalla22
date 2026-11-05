// Índice de entregables (Markdown + Word + PDF) generado a partir de las carpetas
const fs = require('fs'), path = require('path');
const L = require('./lib_docx');
const { P, BIG, H1, H2, table, makeDoc, save, img, bullets, callout } = L;
const CFG = require('../data/config');
const BASE = path.resolve(__dirname, '../..');
const DESC = {
  '00_Indice_de_entregables': 'Este índice',
  '01_Investigacion': 'Investigación de mejores prácticas con 15 hallazgos, tablas y 66 fuentes con enlaces',
  '02_Temario': 'Temario comercial: ficha, logros, módulos, bonos, garantía e instructor',
  '03_Clases': 'Manual del instructor (124 págs.) y 12 presentaciones .pptx editables con notas del orador (+ PDF)',
  '04_Bonos': '10 bonos: fichas técnicas, banco de pruebas, calculadora, formatos, DTC, prompts, WhatsApp, 100 ideas y plan 30/90',
  '05_Plataforma': 'Decisión sobre la plataforma de automatización y conexión opcional por webhook',
  '06_Landing_Page': 'Landing de venta index.html autosuficiente + og-imagen.jpg',
  '07_Lead_Magnet': 'Árbol de diagnóstico ECU (index.html) + og-lead.jpg',
  '08_Animaciones': '3 videos MP4 (9:16, 1:1, 16:9), portadas, cuadros clave, fuentes HTML y guiones de locución',
  '09_Imagenes_Publicitarias': '25 imágenes: anuncios, carrusel, lead magnet, miniatura y OG; copys y prompts de IA',
  '10_Evaluacion': 'Examen final en 2 versiones (con y sin respuestas), Word y PDF',
  '11_Copys_y_Lanzamiento': 'Copys por plataforma, 30 guiones, clase muestra, secuencia de WhatsApp y plan de lanzamiento',
  '_codigo_fuente': 'Fuente única de datos (data/*.js) y generadores (scripts/) para volver a producir todo'
};
function walk(dir) { let out = []; for (const f of fs.readdirSync(dir).sort()) { const p = path.join(dir, f); const st = fs.statSync(p); if (st.isDirectory()) { if (['node_modules', 'fonts', 'revision_cuadros_clave', 'fuentes_html', 'diagramas'].includes(f) && !dir.endsWith('Curso_Reparacion_ECU')) { out.push([p + '/', st, true]); continue; } out = out.concat(walk(p)); } else out.push([p, st, false]); } return out; }
const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
(async () => {
  const folders = fs.readdirSync(BASE).filter(f => fs.statSync(path.join(BASE, f)).isDirectory()).sort();
  let md = `# Índice de entregables\n\n**${CFG.curso.titulo} · ${CFG.curso.marcas}** · ${CFG.instructor.nombre} · ${CFG.instructor.empresa}\n\nGenerado: ${CFG.fechaElaboracion}. Llamado único: **${CFG.cta.texto} al ${CFG.cta.whatsappVisible}**.\n\n`;
  const rows = [];
  for (const fo of folders) {
    md += `## ${fo}\n\n${DESC[fo] || ''}\n\n`;
    if (fo === '_codigo_fuente') { md += '- `data/` fuente única: config, research, course_m1–m4, offer, fichas, bonos, marketing, leadmagnet\n- `scripts/` generadores: gen_docs.js, gen_pptx.js, gen_xlsx.py, build_pages.js, render_diagrams.js, render_ads.js, render_videos.js, gen_index.js\n- `html/` plantillas de landing y lead magnet\n- `assets/` foto del profesor, logotipo, tipografías y diagramas\n\n'; rows.push([fo, DESC[fo], 'Ver README']); continue; }
    const files = walk(path.join(BASE, fo));
    for (const [p, st, isDir] of files) { const rel = path.relative(path.join(BASE, fo), p); md += `- ${isDir ? '📁 ' : ''}\`${rel}\` · ${isDir ? 'carpeta' : kb(st.size)}\n`; }
    md += '\n'; rows.push([fo, DESC[fo] || '', String(files.length)]);
  }
  md += `## Vistas previas privadas\n\n- Landing: https://claude.ai/artifact/PUm6Qn7Yz29osTYyYeVggH\n- Lead magnet: https://claude.ai/artifact/6mwL5DbxeoYbDGrAx6QiGk\n\n## Datos por confirmar\n\n${CFG.porConfirmar.map(x => '- ' + x).join('\n')}\n`;
  fs.mkdirSync(path.join(BASE, '00_Indice_de_entregables'), { recursive: true });
  fs.writeFileSync(path.join(BASE, '00_Indice_de_entregables', 'Indice_de_entregables.md'), md);
  const c = [img('assets/logo_es.png', 150, { align: L.d.AlignmentType.LEFT }), BIG('Índice de entregables', { size: 44 }), P(`${CFG.curso.titulo} · ${CFG.curso.marcas} · ${CFG.instructor.nombre}`, { size: 22 }), H1('Carpetas'), table(['Carpeta', 'Contenido', 'Archivos'], rows, [2600, 5760, 1000]), H1('Vistas previas privadas'), P('Landing: https://claude.ai/artifact/PUm6Qn7Yz29osTYyYeVggH'), P('Lead magnet: https://claude.ai/artifact/6mwL5DbxeoYbDGrAx6QiGk'), H1('Datos por confirmar'), ...bullets(CFG.porConfirmar), callout('Cómo regenerar', 'Edita los archivos de _codigo_fuente/data y ejecuta _codigo_fuente/scripts/build_all.sh: se vuelven a generar documentos, presentaciones, Excel, páginas, imágenes y videos con los textos actualizados.')];
  await save(makeDoc(c, { title: 'Índice de entregables' }), '00_Indice_de_entregables/Indice_de_entregables.docx');
  console.log('index ok');
})();
