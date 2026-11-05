// Agregador de la FUENTE ÚNICA: todo entregable lee de aquí
const fs = require("fs"), path = require("path");
const D = path.resolve(__dirname, "../../data");
const cfg = require(D + "/config");
const arq = require(D + "/arquitectura");
const oferta = require(D + "/oferta");
const diagramas = require(D + "/diagramas");
const clases = fs.readdirSync(D + "/clases").filter((f) => /^c\d\d\.js$/.test(f)).sort().map((f) => require(path.join(D, "clases", f)));
const valorBonos = oferta.bonos.reduce((a, b) => a + b.valor, 0);
const valorTotal = oferta.valorClases + valorBonos;
const mxn = (n) => "$" + Number(n).toLocaleString("en-US") + " MXN";
// Mezcla determinista (para posiciones aleatorias de respuestas reproducibles)
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function shuffleQ(q, seed) {
  const r = rng(seed); const idx = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return { p: q.p, ops: idx.map((i) => q.ops[i]), ok: idx.indexOf(q.ok) };
}
const diagramaPng = (id) => { const d = diagramas.find((x) => x.id === id); return d ? path.resolve(__dirname, `../../assets/diagramas/D${String(d.n).padStart(2, "0")}_${d.id}.png`) : null; };
module.exports = { cfg, arq, oferta, diagramas, clases, valorBonos, valorTotal, mxn, shuffleQ, diagramaPng, ROOT: path.resolve(__dirname, "../../..") };
if (require.main === module) {
  const out = { cfg, arq, oferta, diagramas, clases, valorBonos, valorTotal };
  fs.mkdirSync(path.resolve(__dirname, "../../dist"), { recursive: true });
  fs.writeFileSync(path.resolve(__dirname, "../../dist/curso.json"), JSON.stringify(out, null, 1));
  console.log("curso.json ·", clases.length, "clases · valor total", mxn(valorTotal));
}
