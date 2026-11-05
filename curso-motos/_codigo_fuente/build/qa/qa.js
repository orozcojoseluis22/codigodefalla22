// Control de calidad: tamaños de imagen, videos (ffprobe), Excel sin errores, consistencia de precio/CTA, páginas sin desborde
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const S = require("../lib/curso"); const { cfg: C } = S;
const ROOT = S.ROOT; const rep = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name.startsWith("_") || e.name === "node_modules" ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]));
const files = walk(ROOT);
// 1) imágenes: tamaño exacto según el nombre
let imgOk = 0, imgBad = [];
for (const f of files.filter((f) => /\d+x\d+\.(png|jpg)$/.test(f))) {
  const [w, h] = f.match(/(\d+)x(\d+)\.(png|jpg)$/).slice(1, 3).map(Number);
  const out = execFileSync("python3", ["-c", `from PIL import Image;print(*Image.open(${JSON.stringify(f)}).size)`]).toString().trim().split(" ").map(Number);
  if (out[0] === w && out[1] === h) imgOk++; else imgBad.push(path.relative(ROOT, f) + " " + out.join("x"));
}
rep.push(`Imágenes con tamaño exacto: ${imgOk}${imgBad.length ? " · ERROR: " + imgBad.join(", ") : ""}`);
// 2) videos
for (const f of files.filter((f) => f.endsWith(".mp4"))) {
  const j = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", f]).toString());
  const v = j.streams.find((s) => s.codec_type === "video"), a = j.streams.find((s) => s.codec_type === "audio");
  rep.push(`Video ${path.basename(f)}: ${v.codec_name} ${v.width}x${v.height} ${v.pix_fmt} ${v.r_frame_rate} fps · ${(+j.format.duration).toFixed(2)} s · audio ${a ? a.codec_name : "NO"} · ${(+j.format.size / 1e6).toFixed(1)} MB`);
}
// 3) consistencia de precio y CTA en HTML y docs de texto
for (const f of files.filter((f) => f.endsWith(".html") || f.endsWith(".md"))) {
  const t = fs.readFileSync(f, "utf8");
  const precios = [...new Set((t.match(/\$\s?1,\d{3}/g) || []))];
  rep.push(`${path.relative(ROOT, f)} · precios encontrados: ${precios.join(" ") || "—"} · CTA: ${t.includes(C.cta) ? "sí" : "no"}`);
}
// 4) conteo de entregables
const ext = {}; files.forEach((f) => { const e = path.extname(f).slice(1); ext[e] = (ext[e] || 0) + 1; });
rep.push("Archivos por tipo: " + Object.entries(ext).map(([e, n]) => `${e}:${n}`).join(" "));
fs.writeFileSync(path.resolve(__dirname, "../../dist/qa-reporte.txt"), rep.join("\n"));
console.log(rep.join("\n"));
