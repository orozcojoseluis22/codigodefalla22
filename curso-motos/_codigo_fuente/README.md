# Código fuente · Curso de Diagnóstico Eléctrico de Motos

Fuente única de contenido en `data/` (JS). Todos los entregables se generan desde ahí.

- `data/config.js` · datos fijos (precio, CTA, fechas, colores, instructor)
- `data/investigacion.js` · investigación (hallazgos, tablas, fuentes)
- `data/arquitectura.js` · avatares, objeciones, módulos, logros
- `data/clases/c01.js … c12.js` · 12 clases (8 temas cada una)
- `data/oferta.js` · bonos, garantía, modelo de dinero
- `data/diagramas.js` · Atlas MotoDiagrama (17 diagramas)
- `data/bono-fichas.js`, `data/arboles.js`, `data/bonos-texto.js` · bonos
- `data/landing.js`, `data/publicidad.js` · landing, anuncios, videos y lanzamiento

Regenerar todo: `npm install && node build/build-all.js` (requiere LibreOffice, ffmpeg, Python con openpyxl y Playwright con Chromium).
