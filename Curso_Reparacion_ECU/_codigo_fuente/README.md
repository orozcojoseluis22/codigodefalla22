# Código fuente · Curso "Reparación de computadoras automotrices"

Fuente única de verdad: `data/`. Todo lo demás se genera desde ahí.

| Archivo | Contenido |
|---|---|
| `data/config.js` | Datos fijos: título, sedes, fechas, precio, WhatsApp, colores, tipografías, "por confirmar" |
| `data/research.js` | Investigación: hallazgos, cambios recientes, tablas y 66 fuentes |
| `data/course_m1.js` … `course_m4.js` | Las 12 clases completas (temas, explicación, "Dilo así", ejercicios, repaso) |
| `data/offer.js` | Módulos, avatares, objeciones, bonos, garantía, modelo de dinero, diagnóstico, calculadora, FAQ |
| `data/fichas.js`, `data/bonos.js` | Contenido de los bonos |
| `data/marketing.js` | Ángulos, videos, copys, guiones, secuencia de WhatsApp y plan de lanzamiento |
| `data/leadmagnet.js` | Árbol de diagnóstico ECU (nodos y 25 resultados) |

Generadores (`scripts/`): `gen_docs.js` (Word), `gen_pptx.js` (PowerPoint), `gen_xlsx.py` (Excel), `build_pages.js` (landing y lead magnet), `render_diagrams.js`, `render_ads.js`, `render_videos.js`, `gen_index.js`. Ejecuta `scripts/build_all.sh` para regenerar todo.

Para cambiar el WhatsApp, el enlace de pago o el precio en las páginas publicadas en tu dominio, edita el bloque `CONFIG` al inicio del `<script>` de `06_Landing_Page/index.html` y `07_Lead_Magnet/index.html`.
