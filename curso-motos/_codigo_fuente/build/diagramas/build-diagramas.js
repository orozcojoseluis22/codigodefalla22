// Genera SVG + PNG del Atlas MotoDiagrama
const fs = require("fs"), path = require("path");
const K = require("./svg-kit"), D = require("./draw"), R = require("../lib/render");
const LIST = require("../../data/diagramas");
const OUT = path.resolve(__dirname, "../../../04_Bonos/01_Atlas_de_diagramas");
const ASSETS = path.resolve(__dirname, "../../assets/diagramas");
(async () => {
  const only = process.argv[2];
  for (const d of LIST) {
    if (only && d.id !== only) continue;
    const svg = K.frame(d, D[d.id](), { noPanel: false });
    const name = `D${String(d.n).padStart(2, "0")}_${d.id}`;
    fs.mkdirSync(path.join(OUT, "svg"), { recursive: true });
    fs.writeFileSync(path.join(OUT, "svg", name + ".svg"), svg);
    await R.shot(svg, path.join(ASSETS, name + ".png"), 1600, 1000);
    fs.mkdirSync(path.join(OUT, "png"), { recursive: true });
    fs.copyFileSync(path.join(ASSETS, name + ".png"), path.join(OUT, "png", name + ".png"));
    console.log("ok", name);
  }
  await R.close();
})();
