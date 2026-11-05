#!/bin/bash
# Regenera TODOS los entregables desde la fuente única (data/*.js)
# Requisitos: Node 18+ con docx, pptxgenjs, sharp, playwright, react, react-dom, react-icons; Python 3 con openpyxl; LibreOffice; ffmpeg.
set -e
cd "$(dirname "$0")/.."
node scripts/export_json.js
node scripts/render_diagrams.js
node scripts/gen_docs.js
node scripts/gen_pptx.js
python3 scripts/gen_xlsx.py
node scripts/build_pages.js
node scripts/render_ads.js
node scripts/render_videos.js all all
# PDF de documentos y presentaciones
cd ..
for f in $(find 01_Investigacion 02_Temario 03_Clases 04_Bonos 05_Plataforma 10_Evaluacion 11_Copys_y_Lanzamiento -name "*.docx" -o -name "*.pptx"); do
  soffice --headless --convert-to pdf --outdir "$(dirname "$f")" "$f" >/dev/null 2>&1
done
cd _codigo_fuente && node scripts/gen_index.js
echo "Listo."
