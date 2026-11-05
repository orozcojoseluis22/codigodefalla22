// Valida longitudes y conteos de la fuente única de clases
const fs = require("fs"), path = require("path");
const fa = require(path.resolve(__dirname, "../../node_modules/react-icons/fa/index.js"));
const dir = path.resolve(__dirname, "../../data/clases");
const wc = (s) => s.trim().split(/\s+/).length;
let errs = 0, words = 0;
const files = fs.readdirSync(dir).filter((f) => /^c\d\d\.js$/.test(f)).sort();
for (const f of files) {
  const c = require(path.join(dir, f));
  const e = (m) => { errs++; console.log(`${f}: ${m}`); };
  if (c.objetivos.length !== 4) e("objetivos != 4");
  if (c.agenda.length !== 6) e("agenda != 6");
  if (c.temas.length < 8 || c.temas.length > 12) e("temas fuera de 8-12");
  c.temas.forEach((t, i) => {
    if (t.titulo.length > 60) e(`T${i + 1} título ${t.titulo.length} > 60: ${t.titulo}`);
    if (t.idea.length > 100) e(`T${i + 1} idea ${t.idea.length} > 100`);
    if (t.puntos.length !== 4) e(`T${i + 1} puntos != 4`);
    t.puntos.forEach((pt, j) => { if (pt.length > 110) e(`T${i + 1} punto ${j + 1} ${pt.length} > 110`); });
    if (t.explicacion.length !== 2) e(`T${i + 1} explicación != 2 párrafos`);
    t.explicacion.forEach((x, j) => { const n = wc(x); words += n; if (n < 80 || n > 150) e(`T${i + 1} párrafo ${j + 1}: ${n} palabras`); });
    if (!t.dilo || !t.imagen) e(`T${i + 1} falta dilo/imagen`);
    if (!fa[t.icono]) e(`T${i + 1} ícono inexistente: ${t.icono}`);
  });
  if (c.ejercicio.pasos.length !== 4) e("ejercicio pasos != 4");
  if (c.tarea.length !== 4) e("tarea != 4");
  if (c.errores.length !== 4) e("errores != 4");
  if (c.repaso.length !== 4) e("repaso != 4");
  c.repaso.forEach((q, i) => { if (q.ops.length !== 4) e(`Q${i + 1} ops != 4`); });
}
console.log(`${files.length} clases · ${words} palabras de explicación · ${errs} errores`);
process.exit(errs ? 1 : 0);
