// Fuente única · Datos fijos, avatar, oferta y modelo de dinero
module.exports = {
  curso: {
    titulo: "Diagnóstico Stellantis Pro",
    marcas: "Chrysler, Dodge, Jeep y Ram",
    tituloLargo: "Diagnóstico Stellantis Pro: Chrysler, Dodge, Jeep y Ram",
    subtitulo: "Para técnicos y dueños de taller que quieren encontrar a la primera fallas eléctricas, de red y de motor con multímetro, escáner y osciloscopio, en 12 clases en línea.",
    nombreHormozi: "Método Diagnóstico Stellantis Pro: el sistema de 12 clases para que el técnico de Chrysler, Dodge, Jeep y Ram encuentre la falla a la primera y la cobre como especialista (por confirmar)",
    promesa: "En 12 clases diagnosticarás con método cualquier falla eléctrica o electrónica de Chrysler, Dodge, Jeep y Ram (SGW, redes CAN, sensores, carga y arranque) y aprenderás a cobrarla como especialista.",
    resultadoSonado: "Recibir un Jeep, Ram, Dodge o Chrysler con el tablero lleno de códigos, saber por dónde empezar, medir lo correcto en 15 minutos, encontrar la falla real y entregar al cliente un informe con capturas que justifica el cobro.",
    modalidad: "En línea, en vivo, con grabación",
    clases: 12, duracionClase: "1 h 30 min", horas: 18, modulos: 4,
    precio: 1799, precioTxt: "$1,799 MXN",
    palabraClave: "STELLANTIS",
    cta: "Escribe STELLANTIS por WhatsApp",
    whatsapp: "525552173484",
    whatsappTxt: "55 52 17 34 84",
    sitio: "electronicayservicio.com",
    sitioIA: "codigodefalla22.com",
    requisitos: [
      "Conocimientos básicos de mecánica o electricidad automotriz (no es indispensable ser experto).",
      "Multímetro digital. Se recomienda un osciloscopio de 2 canales (por ejemplo, Hantek 6022BE o FNIRSI 2C53P) y un escáner con funciones bidireccionales.",
      "Computadora o celular con internet para las clases en vivo y para usar el Laboratorio Interactivo.",
      "Acceso a un vehículo Chrysler, Dodge, Jeep o Ram para hacer las tareas (propio, de un cliente o del taller)."
    ],
    proximoGrupo: "Por confirmar",
    edicionPresencial: "Edición presencial en Querétaro: 25 y 26 de noviembre, en el27 Coworking (según el anuncio de referencia; por confirmar)",
    periodoAcceso: "12 meses a grabaciones y materiales (por confirmar)"
  },
  instructor: {
    nombre: "Prof. José Luis Orozco Cuautle",
    corto: "José Luis Orozco",
    empresa: "Electrónica y Servicio",
    bio: "Con 50 años de experiencia en capacitación técnica en electrónica y electricidad automotriz, ha formado a técnicos de México y Latinoamérica con cursos, manuales y publicaciones especializadas. Su método: entender el sistema, medir lo correcto y cobrar con un informe que respalda el diagnóstico.",
    equipo: ["Osciloscopios Hantek 6074BE y 6022BE", "Osciloscopios FNIRSI 2C53P y 1013D", "Escáneres Launch X431, CRT-511PRO y Autel MX900", "Probador de sensores Sens-22", "Multímetro y pinza amperimétrica"]
  },
  logros: [
    "Identificar en 5 minutos la generación eléctrica del vehículo (CAN B, CAN IHS o SGW) y elegir la ruta de diagnóstico.",
    "Medir alimentaciones, tierras y caídas de voltaje bajo carga, sin cambiar piezas a ciegas.",
    "Diagnosticar redes CAN C, CAN B/IHS y LIN en el DLC con multímetro y osciloscopio, e interpretar los códigos U.",
    "Distinguir una falla real de un bloqueo del Security Gateway y saber cuándo hacen falta AutoAuth, wiTECH o la alineación PROXI.",
    "Probar el TIPM y el PDC, los relevadores, la bomba de combustible y el consumo parásito con método.",
    "Leer e interpretar las señales de CKP, CMP, MAP, TPS/APP, sensores de oxígeno, inyectores y bobinas, con valores de referencia.",
    "Diagnosticar la carga inteligente con IBS, los casos de no arranque y el inmovilizador (SKIM, WIN y RFHM).",
    "Poner precio a tu diagnóstico, armar un menú de 3 opciones y conseguir clientes con Google Maps, WhatsApp e IA."
  ],
  avatares: [
    { nombre: "Técnico que empieza", ejemplo: "Ejemplo ilustrativo: «Luis», 24 años, 2 años en un taller de barrio.",
      problemas: "Sabe conectar el escáner, pero se pierde cuando aparecen 8 códigos U o el escáner dice que no puede borrar. Cambia piezas por recomendación.",
      miedos: "Dañar un módulo, quedar mal con el cliente o con su jefe, e invertir en equipo que no sabe usar.",
      quiere: "Un método paso a paso, saber qué medir y con qué equipo, y ganar confianza para cobrar su trabajo." },
    { nombre: "Dueño de taller", ejemplo: "Ejemplo ilustrativo: «Don Arturo», 48 años, taller con 3 técnicos.",
      problemas: "Rechaza Jeep y Ram 2018 y posteriores, o los manda a la agencia. Pierde trabajos de 'no arranca' y de batería que se descarga. Cobra el escaneo barato.",
      miedos: "Gastar en equipo caro que no se paga solo y que sus técnicos no aprendan.",
      quiere: "Atender Stellantis completo, cobrar el diagnóstico aparte y aparecer en Google Maps cuando buscan 'electricista automotriz'." },
    { nombre: "Especialista que quiere cobrar más", ejemplo: "Ejemplo ilustrativo: «Mariana», 35 años, eléctrica automotriz con osciloscopio.",
      problemas: "Domina sensores, pero le faltan SGW, PROXI, IBS/LIN y la programación. Compite por precio con talleres que solo escanean.",
      miedos: "Quedarse atrás con las nuevas generaciones (48 V, 4xe, gateway) y no recuperar la inversión en suscripciones.",
      quiere: "Ser la referencia regional en Stellantis, con un menú de servicios premium y una agenda llena." }
  ],
  objeciones: [
    ["No sé usar el osciloscopio", "Desde la Clase 2 se configuran 3 ajustes (V/div, tiempo/div y disparo) con plantillas para Hantek y FNIRSI, y el Laboratorio te dice qué ajuste usar en cada señal."],
    ["Mi escáner es genérico", "La Clase 5 muestra qué sí puedes hacer sin desbloquear el SGW y cuándo conviene AutoAuth o el cable 12+8. El Laboratorio te sugiere el equipo esencial según la falla."],
    ["No tengo diagramas", "La Clase 3 enseña dónde conseguir diagramas oficiales y cómo leerlos. Además recibes el Atlas de diagramas didácticos Stellantis."],
    ["No tengo tiempo", "Son 12 clases de 90 minutos, grabadas, con una tarea corta por semana que puedes hacer con un vehículo del propio taller."],
    ["Ya tomé cursos y no me sirvieron", "Aquí cada clase termina con un ejercicio con herramientas reales y tienes un Laboratorio Interactivo para practicar con tus propias capturas."],
    ["Es caro", "La inversión es de $1,799 MXN. Con la calculadora puedes ver, como ejemplo ilustrativo, cuántos diagnósticos bien cobrados se necesitan para recuperarla."],
    ["Los Stellantis son muy complicados", "Por eso el curso los divide en generaciones y sistemas. En la Clase 4 ya mides la red en el DLC."],
    ["Tengo miedo de dañar un módulo", "Cada clase incluye medidas de seguridad: mantenedor de voltaje al programar, no perforar cables, protocolo de 48 V y de alto voltaje."],
    ["No sé cobrar el diagnóstico", "La Clase 12 incluye la calculadora de tarifa, el menú de 3 opciones, mensajes de WhatsApp y un informe con capturas que justifica el cobro."],
    ["No vivo en la Ciudad de México", "El curso es en línea, en vivo y con grabación, para todo México y Latinoamérica."]
  ],
  bonos: [
    { n: 1, nombre: "Laboratorio Interactivo de Diagnóstico Stellantis", desc: "App web para subir formas de onda (CSV o captura), con guía de diagnóstico según tu equipo, buscador de DTC con el equipo esencial, lectura de datos en vivo y pruebas de red.", valor: 1500, porque: "Equivale a una herramienta de consulta que usarás en cada diagnóstico." },
    { n: 2, nombre: "Atlas de diagramas didácticos Stellantis", desc: "14 diagramas propios: red CAN con SGW, DLC, TIPM, CKP/CMP, ETC, inyector y bobina, carga con IBS, arranque e inmovilizador, bomba de combustible, LIN y 48 V.", valor: 900, porque: "Te ahorra horas de búsqueda y sirve para explicarle la falla al cliente." },
    { n: 3, nombre: "12 fichas técnicas de sensores y actuadores", desc: "Formato de nombre, función, fallas, DTC y diagnóstico con multímetro, escáner, osciloscopio y Sens-22.", valor: 600, porque: "Es consulta rápida en el taller, lista para imprimir." },
    { n: 4, nombre: "Biblioteca de formas de onda de referencia", desc: "Patrones buenos y malos, con la configuración del osciloscopio por señal para Hantek y FNIRSI, integrados en el Laboratorio.", valor: 800, porque: "Comparar contra una referencia correcta acorta el diagnóstico." },
    { n: 5, nombre: "Calculadora de tarifa y menú de servicios (Excel)", desc: "Con fórmulas: costo por hora, recuperación de equipo, precio del diagnóstico y menú de 3 opciones.", valor: 500, porque: "Cobrar bien desde la primera semana." },
    { n: 6, nombre: "Checklists imprimibles de red, SGW, carga y consumo parásito", desc: "Formatos de orden de servicio y hojas de prueba con semáforo.", valor: 300, porque: "Un procedimiento repetible, incluso para técnicos nuevos." },
    { n: 7, nombre: "Banco de 60 prompts de IA para diagnóstico y ventas", desc: "Prompts para explicar DTC, ordenar pruebas, redactar presupuestos y publicaciones, más una guía de uso de codigodefalla22.com.", valor: 400, porque: "Ahorra tiempo de escritorio y mejora la comunicación con el cliente." },
    { n: 8, nombre: "Kit Google Maps y WhatsApp para taller + 100 ideas para ganar más con Stellantis", desc: "Guía del perfil de negocio, calendario de 30 publicaciones, respuestas rápidas y 100 ideas de servicios.", valor: 500, porque: "Atraer clientes que buscan electricista automotriz cerca." },
    { n: 9, nombre: "Plan de acción de 30 y 90 días", desc: "Metas semanales para aplicar lo aprendido y recuperar la inversión (ejemplo ilustrativo).", valor: 300, porque: "Convierte el curso en acciones concretas." },
    { n: 10, nombre: "Sesión en vivo de dudas y casos (90 min)", desc: "Sesión con el Prof. José Luis Orozco para revisar tus capturas y casos reales.", valor: 800, porque: "Te da acompañamiento directo del instructor." }
  ],
  garantia: {
    nombre: "Garantía de acompañamiento «Diagnóstico a la primera» (por confirmar)",
    texto: "Si asistes o ves las 12 clases y entregas las tareas, y aun así no logras diagnosticar con método una falla de red, sensor o carga en un Stellantis, te acompañamos en una sesión 1 a 1 de 45 minutos sobre tu caso y puedes repetir el siguiente grupo sin costo."
  },
  urgencia: "Bono de inscripción anticipada durante El Buen Fin (13 al 17 de noviembre de 2026): sesión extra de revisión de capturas en grupo. Solo aplica si se confirma la fecha del grupo (por confirmar).",
  escasez: "Cupo limitado por grupo para revisar las tareas de todos (número por confirmar). Usarlo solo si es real.",
  modeloDinero: [
    ["Atracción", "Lead magnet gratuito «Detector de Fallas Stellantis» y clase muestra de 45 minutos", "Gratis"],
    ["Oferta principal", "Curso Diagnóstico Stellantis Pro (12 clases + 10 bonos)", "$1,799 MXN"],
    ["Venta adicional", "Asesoría 1 a 1 por caso, curso avanzado de programación y PROXI, y venta de manuales", "Por confirmar"],
    ["Opción accesible", "Pago en 2 o 3 exhibiciones o meses sin intereses con la pasarela de pago", "Por confirmar"],
    ["Continuidad", "Comunidad o membresía mensual con casos, actualizaciones y sesiones de dudas", "Por confirmar"]
  ],
  aviso: "Curso independiente. Chrysler, Dodge, Jeep, Ram, Mopar, wiTECH y Stellantis son marcas de sus respectivos titulares, que no patrocinan ni avalan este curso. Los casos, negocios y cifras de ejemplo son ilustrativos. Los valores técnicos son típicos; verifíquelos con el manual del fabricante.",
  colores: { gris: "2B3036", carbon: "1E2227", amarillo: "FFC20E", rojo: "E5484D", verde: "2FB344", azul: "2D7FF9", claro: "EEF0F2" }
};
