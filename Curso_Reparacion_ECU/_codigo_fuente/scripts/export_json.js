// Exporta la fuente única a JSON para los generadores en Python y las páginas HTML
const fs = require('fs'), path = require('path');
const D = p => require(path.join(__dirname, '../data', p));
const clases = [...D('course_m1'), ...D('course_m2'), ...D('course_m3'), ...D('course_m4')];
const out = { config: D('config'), offer: D('offer'), bonos: D('bonos'), fichas: D('fichas'), research: D('research'), clases };
try { out.marketing = D('marketing'); } catch (e) {}
fs.writeFileSync(path.join(__dirname, '../data/export.json'), JSON.stringify(out, null, 1));
console.log('export.json', Object.keys(out).join(', '));
