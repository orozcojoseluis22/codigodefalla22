// Captura una página en escritorio y celular, claro y oscuro; reporta desborde horizontal y errores de consola
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const [file, outPrefix, ...rest] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const runs = [["desk-light", 1280, 900, "light"], ["mob-light", 390, 844, "light"], ["desk-dark", 1280, 900, "dark"], ["mob-dark", 390, 844, "dark"]];
  for (const [name, w, h, scheme] of runs) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
    const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(e.message));
    await p.goto("file://" + file); await p.waitForTimeout(1500);
    const ov = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight,
      wide: [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 5).map((e) => e.tagName + "." + e.className) }));
    await p.screenshot({ path: `${outPrefix}-${name}.png`, fullPage: true });
    console.log(name, "scrollW", ov.sw, "clientW", ov.cw, "height", ov.h, ov.wide.length ? "WIDE:" + ov.wide.join(",") : "", errs.length ? "ERR:" + errs.join(" | ") : "");
    await p.close();
  }
  await b.close();
})();
