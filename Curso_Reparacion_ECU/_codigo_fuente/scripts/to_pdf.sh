#!/bin/bash
# Convierte cada .docx/.pptx/.xlsx entregable a PDF en su misma carpeta (LibreOffice)
cd "$(dirname "$0")/../.."
for f in "$@"; do soffice --headless --convert-to pdf --outdir "$(dirname "$f")" "$f" >/dev/null 2>&1 && echo "pdf: $f"; done
