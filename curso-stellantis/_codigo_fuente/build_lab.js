// Construye el Laboratorio Interactivo desde la fuente única
const fs = require('fs'); const path = require('path');
const lab = require('./data/lab'); const D = require('./data/diagramas'); const course = require('./data/course');
const R = f => fs.readFileSync(f, 'utf8');
const logo = 'data:image/png;base64,' + fs.readFileSync('assets/logo_es_small.png').toString('base64');
const DATA = {
  ...lab,
  diagramas: D.lista.map(d => ({ id: d.id, n: d.n, clase: d.clase, svg: d.svg.replace(/^<svg /, '<svg focusable="false" ') })),
  clases: course.clases.map(c => ({ n: c.n, t: c.t })),
  aviso: course.aviso,
  fuentesDiag: [
    ['Portal de información técnica de Stellantis (TechAuthority / wiTECH)', 'https://www.technicalinformation.fiat.com/tech-info-web/web/easyAccess.do', 'oficial, por suscripción para talleres'],
    ['Mitchell 1 ProDemand', 'https://mitchell1.com/', 'comercial'],
    ['ALLDATA', 'https://www.alldata.com/', 'comercial'],
    ['NHTSA · campañas y boletines por VIN', 'https://www.nhtsa.gov/recalls', 'oficial (EUA)'],
    ['commaai/opendbc · mensajes CAN de Chrysler (referencia avanzada)', 'https://github.com/commaai/opendbc', 'código abierto, MIT']
  ]
};
const libsJs = [R('node_modules/uplot/dist/uPlot.iife.min.js'), R('node_modules/papaparse/papaparse.min.js'), R('node_modules/fuse.js/dist/fuse.min.js')].join('\n;\n');
const libsCss = R('node_modules/uplot/dist/uPlot.min.css');
const head = `<title>Laboratorio Diagnóstico Stellantis</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Laboratorio interactivo para diagnosticar fallas eléctricas y electrónicas en Chrysler, Dodge, Jeep y Ram: formas de onda, códigos DTC, datos en vivo, redes CAN/LIN y diagramas.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>${libsCss}\n${R('src/lab/lab.css')}</style>`;
const body = R('src/lab/lab.body.html').replace('__LOGO__', logo);
const scripts = `<script>${libsJs}</script>
<script>window.__LAB_DATA__ = ${JSON.stringify(DATA).replace(/</g, '\\u003c')};</script>
<script>${R('src/lab/lab.js')}</script>`;
const full = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}
${scripts}
</body>
</html>
`;
const frag = `${head}\n${body}\n${scripts}\n`;
const outDir = '../entrega/04_Bonos/Bono01_Laboratorio_Interactivo';
fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync('build/artifact', { recursive: true });
fs.writeFileSync(path.join(outDir, 'laboratorio-stellantis.html'), full);
fs.writeFileSync('build/artifact/laboratorio-stellantis.html', frag);
console.log('Laboratorio:', (full.length / 1024).toFixed(0), 'KB');
