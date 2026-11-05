# Diagnóstico Stellantis Pro · código fuente

Fuente única en `data/`:

| Archivo | Contenido |
|---|---|
| `meta.js` | Datos fijos, avatar, objeciones, bonos, garantía, modelo de dinero |
| `m1.js`–`m4.js` | 12 clases (temas, ejercicios, tareas, repaso) |
| `ampliaciones.js` | Ampliaciones de explicaciones e ideas clave |
| `research.js` | Investigación con fuentes |
| `lab.js` | DTC, equipo, señales de referencia, PIDs, árboles y fichas |
| `diagramas.js` | Atlas de 14 diagramas SVG |
| `bonos.js` | Prompts, 100 ideas, checklists, plan 30/90 |
| `marketing.js` | Anuncios, videos, copys y lanzamiento |

Generadores: `build_lab.js`, `build_docs.js`, `build_xlsx.py`, `build_pptx.js`, `build_pages.js`, `build_ads.js`, `build_videos.js`, `build_copys.js`, `build_index.js`, `scripts_render_diagramas.js`.

Requisitos: Node 18+, Python 3 con openpyxl y Pillow, LibreOffice, ffmpeg y Playwright con Chromium. Ejecute `npm install` en esta carpeta.
