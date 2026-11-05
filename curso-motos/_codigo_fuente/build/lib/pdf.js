// Convierte DOCX/XLSX/PPTX a PDF con LibreOffice
const { execFileSync } = require("child_process");
const path = require("path");
function toPdf(file, outDir) {
  outDir = outDir || path.dirname(file);
  execFileSync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", outDir, file], { stdio: "pipe", timeout: 240000 });
  const out = path.join(outDir, path.basename(file).replace(/\.[^.]+$/, ".pdf"));
  console.log("PDF:", out);
  return out;
}
module.exports = { toPdf };
