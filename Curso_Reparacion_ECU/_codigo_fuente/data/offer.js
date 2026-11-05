// FUENTE ÚNICA · Arquitectura del curso y oferta (Hormozi aplicado)
module.exports = {
  modulos: [
    { n: 1, nombre: 'Entiende la computadora', resultado: 'Ves seis etapas donde antes veías una tarjeta llena de piezas y demuestras si la ECU está dañada.', clases: [1, 2, 3] },
    { n: 2, nombre: 'Mide y diagnostica en banco', resultado: 'Enciendes la ECU fuera del auto y localizas fallas de alimentación y de referencia de 5 V.', clases: [4, 5, 6] },
    { n: 3, nombre: 'Repara entradas, salidas y redes', resultado: 'Reparas etapas de sensores, drivers de potencia y comunicación CAN/LIN.', clases: [7, 8, 9] },
    { n: 4, nombre: 'Reconstruye, valida y cobra', resultado: 'Sueldas SMD, cuidas las memorias, validas con escáner y sales con precios y plan de 30 días.', clases: [10, 11, 12] }
  ],
  avatares: [
    { nombre: 'El técnico que empieza en electrónica', perfil: 'Mecánico o eléctrico automotriz de 20 a 35 años; domina el escáner y el multímetro básico.', problemas: ['Manda las computadoras a un laboratorio y pierde la ganancia y el control del tiempo.', 'No sabe por dónde empezar dentro de una tarjeta.', 'Ha cambiado computadoras que no estaban dañadas.'], miedos: ['Quemar una computadora del cliente.', 'No entender la electrónica "de verdad".', 'Gastar en equipo que no sabrá usar.'], quiere: 'Un método paso a paso para diagnosticar en banco y hacer sus primeras reparaciones con seguridad.' },
    { nombre: 'El dueño de taller', perfil: 'Dueño de taller mecánico o eléctrico de 35 a 55 años con 2 a 6 empleados.', problemas: ['Autos detenidos días esperando una computadora reparada fuera.', 'Clientes que se van con la agencia.', 'Márgenes bajos en servicios de rutina.'], miedos: ['Invertir y que su equipo no lo aplique.', 'Garantías y devoluciones.', 'Problemas legales con inmovilizadores.'], quiere: 'Un servicio nuevo, rentable y con procedimientos que su equipo pueda seguir, con garantía y precios claros.' },
    { nombre: 'El especialista que quiere cobrar más', perfil: 'Técnico en electrónica automotriz o de línea blanca con experiencia en soldadura.', problemas: ['Repara "a prueba y error" y tarda demasiado.', 'Cobra poco porque no sabe justificar el precio.', 'No tiene un sistema para conseguir trabajo de otros talleres.'], miedos: ['Quedarse atrás con las computadoras nuevas.', 'Competir sólo por precio.', 'Perder clientes por una garantía mal manejada.'], quiere: 'Diagnóstico por etapas, evidencia con osciloscopio y un menú de precios para trabajar con talleres aliados.' }
  ],
  logros: [
    'Identificar en la tarjeta las etapas de alimentación, micro, memorias, entradas, salidas y red.',
    'Leer el diagrama de la PCM/ECM y armar una hoja de terminales con valores esperados.',
    'Demostrar con mediciones si la computadora está dañada o si la falla es externa.',
    'Encender, comunicar y simular sensores de una computadora en banco con seguridad.',
    'Localizar y reparar fallas de alimentación y de referencia de 5 V hasta el componente.',
    'Probar y reemplazar drivers de inyectores, bobinas, relevadores y mariposa.',
    'Diagnosticar computadoras sin comunicación midiendo CAN y LIN, y respaldar memorias con ética.',
    'Validar con escáner, entregar con garantía por escrito y cobrar con un menú de 3 opciones.'
  ],
  resultadoSonado: 'Recibir una computadora "muerta", demostrar en banco qué etapa falló, repararla, validarla con escáner y cobrarla con garantía, sin mandarla a un laboratorio.',
  objeciones: [
    ['"No sé electrónica, esto no es para mí."', 'Empezamos desde el diagrama de bloques y cada tema tiene una analogía de taller ("Dilo así"). Requisito: saber usar el multímetro.', 1],
    ['"Me da miedo quemar una computadora del cliente."', 'Protocolo de banco con fuente limitada en corriente, fusibles, ESD y respaldo de memoria antes de soldar.', 4],
    ['"No tengo el equipo."', 'Lista de materiales por niveles con precios en México (Bono 2); empiezas con multímetro, fuente y un osciloscopio USB.', 4],
    ['"Las computadoras nuevas ya no se pueden reparar."', 'El método por etapas aplica a todas las generaciones; además verás Secure Gateway, inmovilizador y cuándo conviene reemplazar.', 9],
    ['"Dos días no alcanzan para aprender esto."', '18 horas presenciales con práctica guiada, manual, fichas y una sesión en vivo de dudas 30 días después.', 12],
    ['"Me van a enseñar teoría y nada de práctica."', 'Cada sesión tiene ejercicio en vivo con osciloscopios, escáneres y computadoras reales del instructor.', 3],
    ['"No sabré cuánto cobrar."', 'Clase 12 completa de precios, menú de 3 opciones y calculadora en Excel con fórmulas (Bono 3).', 12],
    ['"No voy a conseguir clientes."', 'Plan de 30 días, kit de mensajes de WhatsApp y estrategia de talleres aliados.', 12],
    ['"¿Y si me meto en problemas legales con inmovilizadores?"', 'Clase 11: ética, propiedad documentada, carta responsiva y límites claros: no se anulan inmovilizadores ni emisiones.', 11],
    ['"Es mucho dinero ahora."', 'Ejemplo ilustrativo: una reparación del nivel recomendado puede cubrir la inversión; opciones de pago y apartado (por confirmar).', 12]
  ],
  bonos: [
    { n: 1, nombre: 'Kit de 20 fichas técnicas de componentes y sensores de la ECU', formato: 'Word + PDF', valor: 600, porque: 'Consulta inmediata en el banco: definición, función, fallas y pruebas con multímetro, escáner, osciloscopio y Sens-22.' },
    { n: 2, nombre: 'Plano del banco de pruebas ECU y lista de materiales con precios', formato: 'PDF + Excel', valor: 500, porque: 'Arma tu banco en un fin de semana sin comprar de más.' },
    { n: 3, nombre: 'Calculadora de cotización y rentabilidad de reparación de ECU', formato: 'Excel con fórmulas', valor: 400, porque: 'Cotiza en 2 minutos sin olvidar consumibles, garantía ni riesgo.' },
    { n: 4, nombre: 'Orden de servicio, hoja de diagnóstico, garantía y carta responsiva', formato: 'Word + PDF imprimibles', valor: 350, porque: 'Te protegen ante el cliente y ante Profeco desde el primer trabajo.' },
    { n: 5, nombre: 'Tabla de DTC internos, de referencia y de red con qué medir', formato: 'Excel + PDF', valor: 300, porque: 'Pasa del código a la medición correcta sin adivinar.' },
    { n: 6, nombre: 'Banco de 40 prompts de IA para el reparador de ECU', formato: 'Word + PDF', valor: 300, porque: 'Traduce hojas de datos, arma checklists y redacta cotizaciones en minutos.' },
    { n: 7, nombre: 'Kit de 15 mensajes de WhatsApp y plantillas de cotización', formato: 'Word + PDF', valor: 300, porque: 'Ofreces el servicio a talleres y clientes sin sonar a vendedor.' },
    { n: 8, nombre: '100 ideas para ganar más con la reparación de computadoras automotrices', formato: 'PDF', valor: 250, porque: 'Servicios, alianzas y productos para subir tu ticket y tu frecuencia.' },
    { n: 9, nombre: 'Plan de acción de 30 y 90 días + calendario de contenido de 30 días', formato: 'Word + PDF + Excel', valor: 350, porque: 'Sabes qué hacer cada semana para recuperar tu inversión.' },
    { n: 10, nombre: 'Sesión en vivo de dudas y casos (90 min por Zoom) a los 30 días', formato: 'Sesión en línea', valor: 500, porque: 'Resuelves los casos reales que te lleguen después del curso.' }
  ],
  valorCurso: 4500,
  valorCursoNota: 'Valor de referencia del curso presencial: 18 h × $250 MXN por hora de capacitación técnica práctica (referencia interna por confirmar). No es un precio anterior.',
  bonoBuenFin: { nombre: 'Bono Buen Fin (13 al 17 de noviembre de 2026)', descripcion: 'Inscríbete durante El Buen Fin y recibe una asesoría grupal extra de 60 min: "Tu primer banco de pruebas, revisado en vivo" + biblioteca de capturas de osciloscopio de referencia.', valor: 400, nota: 'Bono en lugar de descuento. Por confirmar.' },
  garantia: { nombre: 'Garantía de acompañamiento "Primer banco funcionando"', texto: 'Si asistes a las 12 sesiones, haces las tareas y en los 30 días siguientes no logras encender y comunicar una computadora en tu propio banco, te damos una asesoría 1 a 1 por Zoom (hasta 60 min) sin costo y puedes repetir el módulo que necesites en el siguiente grupo sin costo de inscripción.', nota: 'Garantía de acompañamiento condicionada. Por confirmar con el instructor.' },
  escasez: 'Cupo limitado por sede: cada alumno necesita lugar en un banco de práctica (número exacto por confirmar).',
  urgencia: 'Fechas reales: León 27–28 de noviembre y CDMX 16–17 de diciembre de 2026. Bono Buen Fin sólo del 13 al 17 de noviembre.',
  modeloDinero: [
    ['Atracción', 'Árbol de diagnóstico ECU gratuito (lead magnet) y clase muestra en vivo de 45 min "¿Es la computadora o es el auto?".', 'Gratis'],
    ['Oferta principal', 'Curso presencial de 18 h con 10 bonos.', '$1,799 MXN (por confirmar)'],
    ['Venta adicional', 'Asesoría 1 a 1 de casos reales; revisión de tu banco por videollamada; kit de banco armado (arnés + simulador).', 'Precio por confirmar'],
    ['Opción accesible', 'Apartado con anticipo y saldo antes del curso; meses sin intereses con tarjeta; transferencia u OXXO.', 'Por confirmar'],
    ['Continuidad', 'Comunidad mensual "Laboratorio ECU": un caso en vivo al mes, biblioteca de capturas y fichas nuevas.', 'Cuota mensual por confirmar']
  ],
  ecuacionValor: [
    ['Resultado soñado ↑', 'Reparar y cobrar computadoras en tu propio taller; ser el especialista de tu zona.'],
    ['Probabilidad percibida ↑', 'Instructor con 50 años de capacitación, práctica con equipo real, fichas, plantillas y garantía de acompañamiento.'],
    ['Tiempo de espera ↓', '2 días intensivos; plan de 30 días con primeras reparaciones desde la semana 2.'],
    ['Esfuerzo y sacrificio ↓', 'Plantillas listas, calculadora con fórmulas, lista de compras con precios y árbol de diagnóstico.']
  ],
  consejos: [
    { t: 'Antes de condenar la computadora, mide caída de voltaje en sus tierras', d: 'Una tierra puede marcar continuidad y aun así fallar con carga. Con el motor en marcha, menos de 0.1 V entre batería negativo y la tierra de la ECU (típico; verifica con el fabricante).', clase: 3 },
    { t: 'P0641 casi nunca es la computadora', d: 'Mide la referencia en un sensor y desconecta uno a uno los sensores que la comparten: el que la regresa a 5 V es el culpable.', clase: 6 },
    { t: '60 Ω entre los pines 6 y 14 del DLC', d: 'Con batería desconectada, unos 60 Ω indican que las dos terminaciones CAN están bien; 120 Ω indican que falta una.', clase: 9 }
  ],
  diagnostico: [
    ['¿Identificas en la tarjeta el micro, las memorias, los reguladores y los drivers?', 1],
    ['¿Ubicas en el diagrama las alimentaciones, tierras y líneas de red de la computadora?', 2],
    ['¿Mides caída de voltaje en tierras bajo carga antes de condenar una ECU?', 3],
    ['¿Tienes o sabes armar un banco para encender y comunicar una ECU fuera del auto?', 4],
    ['¿Sabes localizar un corto en la alimentación interna con inyección de corriente?', 5],
    ['¿Diagnosticas una falla de referencia de 5 V hasta el componente?', 6],
    ['¿Pruebas con osciloscopio la etapa de entrada del CKP y del CMP?', 7],
    ['¿Pruebas y reemplazas MOSFET o IGBT de inyectores y bobinas con su equivalente correcto?', 8],
    ['¿Diagnosticas una ECU sin comunicación midiendo CAN-H y CAN-L?', 9],
    ['¿Respaldas la EEPROM con doble lectura antes de soldar o programar?', 11]
  ],
  calculadora: [
    { id: 'ecus', label: 'Computadoras que mandas a reparar fuera o rechazas al mes', min: 0, max: 20, step: 1, val: 3, fmt: 'n' },
    { id: 'precio', label: 'Precio que cobrarías por una reparación (nivel recomendado)', min: 1000, max: 8000, step: 100, val: 2600, fmt: '$' },
    { id: 'material', label: 'Costo de materiales por reparación', min: 50, max: 1500, step: 50, val: 400, fmt: '$' },
    { id: 'diags', label: 'Diagnósticos de "no comunica/no arranca" que hoy no resuelves al mes', min: 0, max: 20, step: 1, val: 2, fmt: 'n' },
    { id: 'cobroDiag', label: 'Cobro por diagnóstico electrónico en banco', min: 300, max: 1500, step: 50, val: 600, fmt: '$' }
  ],
  paraQuienSi: ['Mecánicos y eléctricos automotrices que ya usan escáner y multímetro.', 'Dueños de taller que quieren dejar de mandar computadoras fuera.', 'Técnicos en electrónica que quieren especializarse en automotriz.', 'Quien trabaja con Chrysler, Dodge, Jeep o Nissan en México y Latinoamérica.', 'Quien quiere un servicio rentable con procedimiento, garantía y precios claros.'],
  paraQuienNo: ['Quien busca anular inmovilizadores o sistemas de emisiones.', 'Quien espera resultados sin practicar ni hacer las tareas.', 'Quien busca un curso exclusivamente de programación o "tuning".', 'Quien nunca ha usado un multímetro (primero toma un curso básico).'],
  faqs: [
    ['¿Necesito saber electrónica?', 'Necesitas usar el multímetro en voltaje, resistencia y continuidad. Lo demás se explica desde cero con analogías de taller.'],
    ['¿Qué debo llevar?', 'Multímetro, lentes de seguridad y libreta o laptop. Si tienes cautín, osciloscopio o escáner, tráelos; el instructor tiene equipo para las prácticas.'],
    ['¿Sirve para otras marcas?', 'Sí. El método por etapas aplica a cualquier computadora; los ejemplos se enfocan en Chrysler, Dodge, Jeep y Nissan.'],
    ['¿Qué incluye exactamente?', '12 sesiones presenciales (18 h), manual del instructor, presentaciones, fichas técnicas, plantillas, calculadora en Excel y 10 bonos.'],
    ['¿Cuándo y dónde es?', 'León, Gto.: 27 y 28 de noviembre de 2026 en Manzer Escuela de Mecánica. CDMX: 16 y 17 de diciembre de 2026 en el World Trade Center.'],
    ['¿Enseñan a quitar inmovilizadores?', 'No. Se enseña a respaldar y transferir datos sólo con propiedad documentada. No se anulan inmovilizadores ni controles de emisiones.'],
    ['¿Hay facilidades de pago?', 'Se proponen apartado con anticipo, transferencia, pago en tienda y meses sin intereses con tarjeta (por confirmar).'],
    ['¿Entregan constancia?', 'Se entrega constancia de participación (características por confirmar).'],
    ['¿Cómo me inscribo?', 'Escribe ECU por WhatsApp al 55 5217 3484 y te enviamos los datos de pago y confirmación de tu lugar.']
  ]
};
