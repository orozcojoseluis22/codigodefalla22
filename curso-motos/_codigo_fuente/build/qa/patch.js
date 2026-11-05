// Uso: node build/qa/patch.js archivo.js '[["viejo","nuevo"],...]'
const fs = require("fs");
const [file, json] = process.argv.slice(2);
let s = fs.readFileSync(file, "utf8");
for (const [a, b] of JSON.parse(json)) {
  const n = s.split(a).length - 1;
  if (n !== 1) { console.error(`NO ÚNICO (${n}): ${a}`); process.exit(1); }
  s = s.replace(a, b);
}
fs.writeFileSync(file, s); console.log("ok", file);
