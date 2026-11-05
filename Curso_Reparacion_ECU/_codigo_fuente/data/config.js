// FUENTE ÚNICA · Configuración general del curso
// Cambie aquí un dato y vuelva a ejecutar los generadores (scripts/build_all.sh).
module.exports = {
  fechaElaboracion: '5 de noviembre de 2026',
  curso: {
    titulo: 'Reparación de computadoras automotrices',
    marcas: 'Chrysler · Dodge · Jeep · Nissan',
    subtitulo: 'Para técnicos automotrices y electrónicos que quieren diagnosticar en banco y reparar ECU, ECM y PCM a nivel componente, en lugar de mandarlas a un laboratorio o cambiarlas completas.',
    promesa: 'En 2 días aprendes a demostrar si la computadora está dañada, localizar la etapa que falló y repararla en banco con multímetro, osciloscopio y fuente de alimentación.',
    nombreHormozi: 'Intensivo ECU 18 h: diagnostica y repara computadoras Chrysler, Dodge, Jeep y Nissan en banco en 2 días (método del Prof. José Luis Orozco)',
    nombreHormoziNota: 'Propuesta con la fórmula motivo + para quién + resultado + tiempo + contenedor. Por confirmar; el banner conserva el título original.',
    modalidad: 'Presencial teórico-práctico',
    formato: '12 sesiones de 1 h 30 min · 18 horas · 4 módulos de 3 sesiones · 2 días por sede',
    clases: 12, horas: 18, modulos: 4, duracionClase: '1 h 30 min',
    requisitos: 'Saber usar el multímetro en voltaje, resistencia y continuidad. Recomendable: nociones de osciloscopio. Traer multímetro, cautín si lo tiene, lentes de seguridad y laptop o teléfono para tomar notas.',
    horario: 'Día 1: 8:30 a 19:00 · Día 2: 8:30 a 19:00 (con 2 recesos de 15 min y 1 h de comida) — por confirmar',
    cupo: 'Cupo limitado por sede según bancos de práctica disponibles (número por confirmar)'
  },
  sedes: [
    { ciudad: 'León, Gto.', fechas: '27 y 28 de noviembre de 2026', inicioISO: '2026-11-27', finISO: '2026-11-28', lugar: 'Manzer Escuela de Mecánica', direccion: 'Blvd. Venustiano Carranza 304, Los Fresnos, C. P. 37380, León, Guanajuato.' },
    { ciudad: 'Ciudad de México', fechas: '16 y 17 de diciembre de 2026', inicioISO: '2026-12-16', finISO: '2026-12-17', lugar: 'World Trade Center Ciudad de México', direccion: 'Montecito 38, Nápoles, Benito Juárez, C. P. 03810, Ciudad de México.' }
  ],
  instructor: {
    nombre: 'Prof. José Luis Orozco Cuautle',
    nombreCorto: 'José Luis Orozco',
    empresa: 'Electrónica y Servicio',
    web: 'electronicayservicio.com',
    bio: '50 años de experiencia en capacitación técnica en electrónica y electricidad automotriz para técnicos de México y Latinoamérica.',
    herramientas: ['Osciloscopios Hantek 6074BE y 6022BE', 'Osciloscopios FNIRSI 2C53P y 1013D', 'Escáneres Launch X431, CRT-511PRO y Autel MX900', 'Banco de comprobación de sensores Sens-22', 'Multímetro y pinza amperimétrica']
  },
  precio: 1799,
  precioTexto: '$1,799 MXN',
  precioNota: 'Precio predeterminado del prompt maestro; el banner no indica precio. Por confirmar.',
  cta: {
    palabra: 'ECU',
    texto: 'Escribe ECU por WhatsApp',
    whatsappVisible: '55 5217 3484',
    whatsapp: '525552173484',
    mensajeBase: 'Hola, quiero informes del curso Reparación de computadoras automotrices. ECU'
  },
  colores: { gris: '#2B3036', carbon: '#1E2227', amarillo: '#FFC20E', rojo: '#E5484D', verde: '#2FB344', azul: '#2D7FF9', claro: '#EEF0F2', blanco: '#FFFFFF' },
  fuentes: { titulos: 'Barlow Condensed', texto: 'Barlow', datos: 'IBM Plex Mono', office1: 'Arial', office2: 'Calibri' },
  porConfirmar: [
    'Precio final ($1,799 MXN es el valor predeterminado; el banner no muestra precio).',
    'Enlace de pago (checkoutUrl) y métodos: transferencia, tarjeta a meses, OXXO/efectivo.',
    'Número de lugares por sede (cupo real) y horario exacto de cada día.',
    'Garantía de acompañamiento propuesta y política de cancelación/reembolso del curso presencial.',
    'Fecha y hora de las clases muestra gratuitas (propuestas: 10 de noviembre y 2 de diciembre, 19:00 h).',
    'Bono de Buen Fin (13 al 17 de noviembre de 2026) y su vigencia.',
    'Precios de la venta adicional (asesoría 1 a 1, kit de banco) y de la continuidad (comunidad mensual).',
    'Webhook de captura de prospectos (GoHighLevel u otro) para el lead magnet.',
    'Aviso de privacidad del negocio (responsable, domicilio, medios para derechos ARCO) conforme a la LFPDPPP de 2025.',
    'Constancia o diploma que se entrega al terminar (con o sin validez oficial).'
  ]
};
