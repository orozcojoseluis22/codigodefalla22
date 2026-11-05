// Descarga las fuentes de Google Fonts (TTF completos) para renderizado local determinista
const fs = require("fs"), path = require("path"), { execSync } = require("child_process");
const dir = path.resolve(__dirname, "../../assets/fonts");
const url = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap";
const css = execSync(`curl -sS -m 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "${url}"`).toString();
let out = "";
for (const b of css.match(/@font-face \{[^}]+\}/g)) {
  const u = b.match(/url\((https:[^)]+)\)/)[1];
  const fam = b.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, "");
  const w = b.match(/font-weight: (\d+)/)[1];
  const f = `${fam}-${w}.ttf`;
  if (!fs.existsSync(path.join(dir, f))) execSync(`curl -sS -m 30 -o "${path.join(dir, f)}" "${u}"`);
  out += b.replace(u, f) + "\n";
}
fs.writeFileSync(path.join(dir, "fonts.css"), out);
console.log("archivos:", fs.readdirSync(dir).join(" "));
