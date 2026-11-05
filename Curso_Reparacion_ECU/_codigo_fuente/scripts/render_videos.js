// Motor de video determinista: HTML + CSS con seek(t), render cuadro por cuadro a 30 fps con Playwright y codificación con ffmpeg
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execSync } = require('child_process');
const { V, C, BASE_CSS, PROF, LOGO } = require('./ads_lib');
const M = require('../data/marketing');
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(ROOT, '..', '08_Animaciones');
const FPS = 30, DUR = 28;
const VIS = { video_9x16_dolor: { hook: 'bench', tips: ['tierra', 'ref5v', 'dlc'], close: 'semaforo' }, video_1x1_dinero: { hook: 'menu', tips: ['bench', 'menu', 'inyector'], close: 'menu' }, video_16x9_sistema: { hook: 'bloques', tips: ['bench', 'ref5v', 'scope'], close: 'bloques' } };
// Geometría por formato
const G = {
  '1080x1920': { w: 1080, h: 1920, stripe: 28, logo: [800, 262, 240, 90], prof: [740, 360, 320, 600], top: 270, left: 72, colW: 640, hook: 104, tipT: 76, sub: 38, vis: [60, 1000, 960, 420], chip: [72, 1440, 30], bar: [28, 1550, 1052, 120], bigCta: 70 },
  '1080x1080': { w: 1080, h: 1080, stripe: 26, logo: [820, 30, 220, 82], prof: [800, 120, 260, 420], top: 40, left: 64, colW: 700, hook: 84, tipT: 62, sub: 30, vis: [60, 560, 960, 300], chip: [64, 870, 26], bar: [26, 950, 1054, 130], bigCta: 58 },
  '1920x1080': { w: 1920, h: 1080, stripe: 30, logo: [1640, 36, 240, 90], prof: [1480, 150, 420, 800], top: 50, left: 90, colW: 1250, hook: 110, tipT: 84, sub: 40, vis: [80, 470, 1180, 380], chip: [90, 870, 30], bar: [30, 960, 1890, 120], bigCta: 76 }
};
function html(v, g) {
  const px = a => `left:${a[0]}px;top:${a[1]}px;width:${a[2]}px;height:${a[3]}px`;
  const vis = VIS[v.id];
  const css = `${BASE_CSS}
  .scene{position:absolute;left:${g.left}px;top:${g.top}px;width:${g.colW}px}
  .lbl{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:${Math.round(g.sub * 0.8)}px;color:${C.carbon};background:${C.am};display:inline-block;padding:.2em .6em;border-radius:8px;letter-spacing:1px}
  .ttl{font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#fff;line-height:1;margin-top:18px}
  .ttl em{font-style:normal;color:${C.am}}
  .sub{font-family:Barlow,sans-serif;font-weight:600;color:${C.claro};font-size:${g.sub}px;line-height:1.2;margin-top:16px}
  .chip{position:absolute;font-family:'IBM Plex Mono',monospace;font-weight:600;color:${C.am};background:${C.carbon};border:2px solid ${C.borde};border-radius:10px;padding:.3em .7em}
  .bar{position:absolute;background:${C.am};color:${C.carbon};display:flex;align-items:center;justify-content:space-between;padding:0 ${Math.round(g.w * 0.03)}px;gap:20px}
  .bar b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:${Math.round(g.bar[3] * 0.34)}px;line-height:1}
  .bar span{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:${Math.round(g.bar[3] * 0.2)}px;line-height:1.25}
  .vis{position:absolute;${px(g.vis)}}
  .close{position:absolute;left:${g.left}px;top:${g.top}px;width:${g.colW}px}
  .big{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:${g.bigCta}px;color:${C.carbon};background:${C.am};display:inline-block;padding:.15em .4em;border-radius:12px;margin-top:20px;line-height:1.05}
  .tagx{font-family:'IBM Plex Mono',monospace;color:${C.tenue};font-size:${Math.round(g.sub * 0.6)}px}`;
  const tipHtml = v.tips.map((t, i) => `<div class="scene" id="tip${i}" style="opacity:0"><span class="lbl">TIP ${i + 1} DE 3 · ${t[2].toUpperCase()}</span><div class="ttl" style="font-size:${g.tipT}px">${t[0]}</div><div class="sub">${t[1]}</div></div>`).join('');
  const body = `<div class="ad" style="width:${g.w}px;height:${g.h}px"><div class="stripe" style="width:${g.stripe}px"></div>
    <img class="abs prof" id="prof" src="${PROF}" style="${px(g.prof)}"><img class="abs logo" src="${LOGO}" style="${px(g.logo)};z-index:3">
    <div class="scene" id="hook"><span class="lbl">CURSO PRESENCIAL · LEÓN Y CDMX</span><div class="ttl" style="font-size:${g.hook}px">${v.gancho.replace(/(\S+\s\S+)$/, '<em>$1</em>')}</div></div>
    ${tipHtml}
    <div class="close" id="close" style="opacity:0"><span class="lbl">CURSO PRESENCIAL · 12 CLASES · 18 H</span><div class="ttl" style="font-size:${g.tipT}px">${v.cierre}</div><div class="sub">León 27–28 nov · CDMX 16–17 dic 2026</div><div class="big">Escribe ECU por WhatsApp</div><div class="sub" style="font-family:'IBM Plex Mono',monospace">55 5217 3484 · $1,799 MXN</div></div>
    <div class="vis" id="vis"></div><div class="chip" id="chip" style="left:${g.chip[0]}px;top:${g.chip[1]}px;font-size:${g.chip[2]}px;opacity:0"></div>
    <div class="bar" style="${px(g.bar)}">${g.w === 1080 ? `<div style="display:grid;gap:6px"><b style="font-size:30px">Reparación de computadoras automotrices</b><span style="font-size:19px">Prof. José Luis Orozco Cuautle · $1,799 MXN</span></div><div style="display:grid;gap:6px;text-align:right"><b style="font-size:36px">Escribe ECU</b><span style="font-size:19px">WhatsApp 55 5217 3484</span></div>` : `<div style="display:grid"><b>Reparación de computadoras automotrices</b><span>Prof. José Luis Orozco Cuautle · $1,799 MXN</span></div><div style="display:grid;text-align:right"><b>Escribe ECU por WhatsApp</b><span>55 5217 3484</span></div>`}</div>
    ${v.id.includes('dinero') ? `<div class="abs tagx" id="ilus" style="left:${g.left}px;top:${g.vis[1] - 34}px;opacity:0">Ejemplo ilustrativo · no es promesa de ingresos</div>` : ''}</div>`;
  const script = `const V={${Object.keys(V).map(k => `${k}:${V[k].toString().replace(/^[^(]*/, 'function')}`).join(',')}};
  const C=${JSON.stringify(C)};const mono='font-family="IBM Plex Mono, monospace"',cond='font-family="Barlow Condensed, Arial Narrow, sans-serif"',sans='font-family="Barlow, Arial, sans-serif"';
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const svg=${svgSrc()};${meterSrc()}
  const VIS=${JSON.stringify(vis)}, CHIPS=${JSON.stringify(v.tips.map(t => t[2]))};
  const T=[[0,3],[3,10.5],[10.5,18],[18,25],[25,${DUR}]];
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  function win(t,a,b,f=.35){return clamp((t-a)/f)*clamp((b-t)/f);}
  let last='';
  window.seek=function(t){
    const hk=win(t,-1,T[0][1]); const h=document.getElementById('hook'); h.style.opacity=hk; h.style.transform='translateY('+(1-clamp(t/.5))*30+'px)';
    let visName=VIS.hook,p=clamp(t/2.5),chipTxt='',chipOp=0;
    for(let i=0;i<3;i++){const [a,b]=T[i+1];const o=win(t,a,b);const el=document.getElementById('tip'+i);el.style.opacity=o;el.style.transform='translateX('+(1-ease(clamp((t-a)/.5)))*-40+'px)';if(t>=a&&t<b){visName=VIS.tips[i];p=clamp((t-a-.3)/3);chipTxt='Lo vemos completo en la '+CHIPS[i];chipOp=o;}}
    const co=clamp((t-T[4][0])/.4);const ce=document.getElementById('close');ce.style.opacity=co;ce.style.transform='scale('+(0.96+0.04*co)+')';
    if(t>=T[4][0]){visName=VIS.close;p=clamp((t-T[4][0])/1.5);}
    const prof=document.getElementById('prof');prof.style.opacity=1;
    const vo=t<T[4][0]?(t<T[0][1]?clamp(t/.6)*clamp((T[0][1]-t)/.35):1):co; const ve=document.getElementById('vis');
    const opts=visName==='bloques'?{hl:t<T[0][1]||t>=T[4][0]?-1:Math.min(4,Math.floor((t-3)/1.5))}:{p};
    const key=visName+JSON.stringify(opts); if(key!==last){ve.innerHTML=V[visName](opts);last=key;}
    ve.style.opacity=t>=T[4][0]?co:vo;
    const ch=document.getElementById('chip');ch.textContent=chipTxt;ch.style.opacity=chipOp;
    const il=document.getElementById('ilus');if(il)il.style.opacity=(visName==='menu')?1:0;
  };`;
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><style>${css}</style></head><body style="width:${g.w}px;height:${g.h}px;position:relative">${body}<script>${script}<\/script></body></html>`;
}
function svgSrc() { return "(body, vb = '0 0 900 400') => `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"${vb}\" preserveAspectRatio=\"xMidYMid meet\" style=\"width:100%;height:100%;display:block\">${body}</svg>`"; }
function meterSrc() { const src = fs.readFileSync(path.join(__dirname, 'ads_lib.js'), 'utf8'); const m = src.match(/function meter\([\s\S]*?\n\}/); return m[0]; }

(async () => {
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(path.join(OUT, 'fuentes_html'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'revision_cuadros_clave'), { recursive: true });
  const only = process.argv[2], mode = process.argv[3] || 'all';
  const browser = await chromium.launch();
  for (const v of M.videos) {
    if (only && only !== 'all' && !v.id.includes(only)) continue;
    const [w, h] = v.formato.match(/(\d+)×(\d+)/).slice(1).map(Number); const g = G[w + 'x' + h];
    const file = path.join(OUT, 'fuentes_html', v.id + '.html'); fs.writeFileSync(file, html(v, g));
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const errs = []; page.on('pageerror', e => errs.push(String(e)));
    await page.goto('file://' + file); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
    // Revisión de 6 cuadros clave
    for (const t of [1.5, 5.5, 9.8, 14, 21.5, 27]) { await page.evaluate(t => window.seek(t), t); await page.screenshot({ path: path.join(OUT, 'revision_cuadros_clave', `${v.id}_t${String(t).replace('.', '_')}.png`) }); }
    await page.evaluate(() => window.seek(1.8)); await page.screenshot({ path: path.join(OUT, v.id + '_portada.png') });
    if (errs.length) console.log('ERR', errs);
    if (mode === 'frames') { await page.close(); console.log('frames', v.id); continue; }
    const mp4 = path.join(OUT, v.id + '.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', mp4]);
    ff.stderr.on('data', d => process.stderr.write(d));
    const N = FPS * DUR; const t0 = Date.now();
    for (let i = 0; i < N; i++) { await page.evaluate(t => window.seek(t), i / FPS); const buf = await page.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await page.close();
    console.log('mp4', v.id, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
    console.log(execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name,pix_fmt -show_entries format=duration -of csv=p=0 "${mp4}"`).toString().trim());
  }
  await browser.close();
})();
