// Agregador de la fuente única
const meta = require('./meta');
const amp = require('./ampliaciones');
const clases = [...require('./m1'), ...require('./m2'), ...require('./m3'), ...require('./m4')];
for (const k of clases) k.temas.forEach((t, i) => {
  const id = `${k.n}.${i}`;
  if (amp.ideas[id]) t.idea = amp.ideas[id];
  t.e = t.e.map((par, j) => [par, amp.extra[`${id}.${j}`], (amp.extra2 || {})[`${id}.${j}`]].filter(Boolean).join(' '));
});
const modulos = [
  { n: 1, t: "Entiende el sistema Stellantis", promesa: "Alimentaciones, herramientas, método y diagrama: la base para no cambiar piezas a ciegas." },
  { n: 2, t: "Domina redes y módulos", promesa: "Redes CAN y LIN, Security Gateway, PROXI, TIPM y consumo parásito." },
  { n: 3, t: "Mide y diagnostica el motor", promesa: "Sensores, actuadores, encendido e inyección con el osciloscopio como aliado." },
  { n: 4, t: "Repara casos reales y cobra más", promesa: "Carga, arranque, inmovilizador, casos reales y cómo convertirlo en dinero." }
];
module.exports = { ...meta, modulos, clases };
