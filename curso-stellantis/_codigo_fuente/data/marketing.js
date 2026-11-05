// Fuente única · Publicidad, copys y lanzamiento
module.exports = {
  ideaCentral: "En Stellantis, el técnico que mide con método encuentra la falla a la primera y cobra el diagnóstico; el que solo escanea, adivina.",
  angulos: [
    ["Dolor o problema", "Tablero lleno de códigos U, escáner que no borra y módulos cambiados sin resolver la falla."],
    ["Dinero u oportunidad", "Cobrar el diagnóstico con método e informe, en lugar de regalar el escaneo o rechazar Jeep y Ram."],
    ["Resultado o sistema", "Ruta de 6 pasos y un Laboratorio que te dice qué medir según tu equipo."],
    ["Miedo a errores o riesgos", "Dañar un módulo al programar, puentear una salida del TIPM o trabajar sin protocolo en 48 V."],
    ["Facilidad y tiempo", "12 clases en línea con grabación y tareas cortas con un vehículo del propio taller."],
    ["Autoridad del instructor", "50 años del Prof. José Luis Orozco capacitando técnicos en México y Latinoamérica, con equipo real en clase."]
  ],
  // Juego A · 3 anuncios en 4 tamaños
  anuncios: [
    { id: "A1_dolor", angulo: "Dolor o problema", hook: "¿Tablero lleno de códigos U?", sub: "Mide la red antes de culpar al módulo.", tech: "scope", valores: [["DLC 6–14", "60 Ω"], ["CAN H", "2.6 V"], ["CAN L", "2.4 V"]],
      copy: { texto: "Antes de cambiar un módulo en un Jeep o Ram, mide 6–14 en el DLC: 60 Ω es red sana. Lo vemos en la Clase 4.", titulo: "Diagnostica redes CAN en Stellantis", desc: "12 clases · $1,799 MXN", tags: ["#DiagnosticoAutomotriz", "#Jeep", "#RAM", "#Osciloscopio", "#ElectricidadAutomotriz"] } },
    { id: "A2_dinero", angulo: "Dinero u oportunidad", hook: "Cobra el diagnóstico, no el escaneo", sub: "Método, mediciones e informe con capturas.", tech: "menu", valores: [["Básico", "escaneo"], ["Recomendado", "+ osciloscopio"], ["Premium", "+ carga"]],
      copy: { texto: "Un informe con capturas del osciloscopio justifica tu diagnóstico. Aprende el método y el menú de 3 opciones.", titulo: "Diagnóstico Stellantis Pro", desc: "Curso en línea · 12 clases", tags: ["#TallerMecanico", "#Chrysler", "#Dodge", "#DiagnosticoAutomotriz", "#Mecanicos"] } },
    { id: "A3_sistema", angulo: "Resultado o sistema", hook: "Sube tu forma de onda y sigue la ruta", sub: "Laboratorio interactivo incluido.", tech: "lab", valores: [["CKP", "0–5 V"], ["Frecuencia", "794 Hz"], ["Hueco", "3×"]],
      copy: { texto: "Sube tu captura del Hantek o FNIRSI: el Laboratorio mide, compara y te dice la siguiente prueba según tu equipo.", titulo: "Laboratorio de Diagnóstico Stellantis", desc: "Incluido en el curso", tags: ["#Osciloscopio", "#Hantek", "#FNIRSI", "#Jeep", "#DiagnosticoAutomotriz"] } }
  ],
  // Juego B · carrusel educativo 1080×1350
  carrusel: [
    { t: "5 pruebas que todo técnico de Stellantis debe dominar", s: "Desliza →", tech: "dlc" },
    { t: "1 · 60 Ω entre 6 y 14", s: "Batería desconectada. 120 Ω: falta una terminación.", tech: "ohm", c: 4 },
    { t: "2 · Si lee pero no borra", s: "En 2018+ es el Security Gateway, no el módulo.", tech: "sgw", c: 5 },
    { t: "3 · Tierra: menos de 0.1 V", s: "Caída de voltaje con el circuito trabajando.", tech: "drop", c: 1 },
    { t: "4 · Consumo: menos de 50 mA", s: "Después de que los módulos se duermen.", tech: "amp", c: 6 },
    { t: "5 · CKP + CMP en 2 canales", s: "Cuenta dientes desde el hueco y compara.", tech: "scope2", c: 9 },
    { t: "Aprende el método completo", s: "Diagnóstico Stellantis Pro · 12 clases · $1,799 MXN · Prueba gratis el Detector de Fallas", tech: "cierre" }
  ],
  carruselCopy: { texto: "5 pruebas rápidas para Chrysler, Dodge, Jeep y Ram. Guárdalo para tu próximo diagnóstico.", titulo: "5 pruebas para Stellantis", desc: "Tips de taller", tags: ["#ElectricidadAutomotriz", "#Jeep", "#RAM", "#Multimetro", "#TallerMecanico"] },
  // Juego C · lead magnet
  lead: { hook: "Detector de Fallas Stellantis", sub: "Tu ruta de diagnóstico con semáforo, según tu equipo, en 7 minutos.", valores: [["Precio", "Gratis"], ["Registro", "No"], ["Tiempo", "7 min"]],
    copy: { texto: "¿Jeep o Ram que no arranca o con códigos U? Responde 5 preguntas y recibe tu siguiente prueba con semáforo. Gratis.", titulo: "Detector de Fallas Stellantis", desc: "Gratis, sin registro", tags: ["#Jeep", "#RAM", "#Dodge", "#DiagnosticoAutomotriz", "#Mecanicos"] },
    posts: [
      "Herramienta gratis para técnicos: elige el síntoma (no arranca, códigos U, batería que se descarga o escáner que no borra), marca tu equipo y recibe tu siguiente prueba con semáforo. Enlace en el perfil.",
      "¿Cuántas veces cambiaste una pieza en un Jeep sin medir? El Detector de Fallas Stellantis te dice qué medir primero según lo que tienes en el taller. Gratis y sin registro.",
      "Reto para técnicos: haz el Detector de Fallas Stellantis y comparte tu semáforo con un colega. ¿Verde, amarillo o rojo?",
      "Tip del día: con la batería desconectada, 6–14 en el DLC deben dar unos 60 Ω. El Detector de Fallas te guía en el siguiente paso. Gratis.",
      "Tu Ram 2018 o posterior no deja borrar códigos: ¿falla o Security Gateway? Averígualo en 7 minutos con el Detector de Fallas Stellantis."],
    whatsapp: "Hola, te comparto una herramienta gratuita del Prof. José Luis Orozco para diagnosticar Chrysler, Dodge, Jeep y Ram: eliges el síntoma, marcas tu equipo y te da la siguiente prueba con semáforo. Tarda 7 minutos: {ENLACE}. Si no quieres recibir más mensajes de esta lista, responde BAJA.",
    video: "0–3 s: «¿Jeep que no arranca y no sabes qué medir primero?» · 3–20 s: pantalla del detector: elegir síntoma, marcar equipo, responder Sí/No, aparece el semáforo y la clase que lo resuelve · 20–30 s: «Gratis, sin registro, 7 minutos. Enlace en el perfil. Y si quieres el método completo: Diagnóstico Stellantis Pro, escribe STELLANTIS por WhatsApp.»" },
  // Videos 30 s · locución
  videos: [
    { id: "V1_9x16_dolor", w: 1080, h: 1920, angulo: "Dolor o problema", locucion: [
      "[0–3 s] ¿Tu Jeep llegó con ocho códigos U y no sabes por dónde empezar?",
      "[3–10 s] Paso uno: con la batería desconectada mide entre las terminales 6 y 14 del conector de diagnóstico. Unos 60 ohms es una red sana; 120, falta una terminación.",
      "[10–17 s] Paso dos: con el encendido en ON, CAN H debe estar cerca de 2.6 volts y CAN L cerca de 2.4. En el osciloscopio se ven en espejo.",
      "[17–24 s] Paso tres: si varios módulos reportan que perdieron al PCM, revisa el PCM: su alimentación, su tierra y su tramo de red.",
      "[24–30 s] Esto y mucho más en Diagnóstico Stellantis Pro: 12 clases en línea, 1,799 pesos. Escribe STELLANTIS por WhatsApp."] },
    { id: "V2_1x1_dinero", w: 1080, h: 1080, angulo: "Dinero u oportunidad", locucion: [
      "[0–3 s] Escanear no es diagnosticar.",
      "[3–10 s] Tip uno: entrega un informe con la medición y la captura del osciloscopio. Así el cliente ve lo que tú viste.",
      "[10–17 s] Tip dos: ofrece tres opciones: básico, recomendado y premium. El cliente elige sin presión.",
      "[17–24 s] Tip tres: revisa campañas por VIN antes de presupuestar. Le ahorras dinero al cliente y ganas su confianza.",
      "[24–30 s] Aprende a medir y a cobrar tu diagnóstico en Diagnóstico Stellantis Pro. 1,799 pesos. Escribe STELLANTIS por WhatsApp."] },
    { id: "V3_16x9_sistema", w: 1920, h: 1080, angulo: "Resultado o sistema", locucion: [
      "[0–3 s] Sube tu forma de onda. Recibe tu siguiente prueba.",
      "[3–10 s] Uno: exporta el CSV de tu Hantek o la captura de tu FNIRSI y súbelos al Laboratorio. Mide voltaje, frecuencia y huecos, y te da un semáforo.",
      "[10–17 s] Dos: escribe el código de falla, marca tu equipo y obtén la ruta de 6 pasos con valores esperados.",
      "[17–24 s] Tres: 14 diagramas didácticos con puntos de prueba de la red, carga, arranque e inmovilizador.",
      "[24–30 s] El Laboratorio está incluido en Diagnóstico Stellantis Pro. 12 clases, 1,799 pesos. Escribe STELLANTIS por WhatsApp."] }
  ],
  copysVideo: {
    "Facebook e Instagram": "Tip de taller para Stellantis: mide antes de cambiar piezas. En el video, 3 pruebas que puedes hacer hoy. Método completo: Diagnóstico Stellantis Pro, 12 clases en línea, $1,799 MXN. Escribe STELLANTIS por WhatsApp.",
    "Reels y TikTok": "3 pruebas en 30 segundos para Jeep, Ram, Dodge y Chrysler. ¿Cuál ya usas? Escribe STELLANTIS por WhatsApp para el curso completo. #Jeep #RAM #DiagnosticoAutomotriz",
    "YouTube": "En este video: 3 pruebas rápidas para diagnosticar vehículos Stellantis (Chrysler, Dodge, Jeep y Ram) con multímetro, escáner y osciloscopio. Curso completo Diagnóstico Stellantis Pro con el Prof. José Luis Orozco Cuautle: 12 clases en línea, $1,799 MXN. Escribe STELLANTIS por WhatsApp al 55 52 17 34 84. Los valores mostrados son típicos; verifique con el manual del fabricante.",
    "Estados de WhatsApp": "Tip: 60 Ω entre 6 y 14 = red CAN sana. ¿Quieres el método completo? Escribe STELLANTIS.",
    "Comentario fijado": "¿Quieres el temario y las fechas? Escribe STELLANTIS por WhatsApp al 55 52 17 34 84. Herramienta gratis: Detector de Fallas Stellantis (enlace en el perfil)."
  },
  secuenciaWhatsApp: [
    ["Día 0 · Bienvenida", "Hola {NOMBRE}, gracias por escribir STELLANTIS. Soy del equipo del Prof. José Luis Orozco. Te comparto el temario de Diagnóstico Stellantis Pro (12 clases en línea, $1,799 MXN). ¿Qué vehículos Stellantis te llegan más al taller?"],
    ["Día 1 · Dar valor", "Un tip de la Clase 4: con la batería desconectada, entre 6 y 14 del DLC deben medirse unos 60 Ω. Si mides 120 Ω, falta una terminación. ¿Te ha tocado un Jeep con muchos códigos U?"],
    ["Día 2 · Herramienta", "Te regalo el Detector de Fallas Stellantis: eliges el síntoma y tu equipo, y te da la siguiente prueba con semáforo. {ENLACE_DETECTOR}"],
    ["Día 3 · Oferta", "Lo que recibes: 12 clases con grabación, el Laboratorio Interactivo para subir tus formas de onda, 14 diagramas, fichas, calculadora de tarifa y sesión de dudas. Inversión: $1,799 MXN. ¿Te aparto un lugar en el grupo {FECHA}?"],
    ["Día 5 · Objeción", "Muchos técnicos nos preguntan si necesitan osciloscopio. No es indispensable para empezar: el curso te enseña desde cero y te dice qué equipo conviene comprar primero. ¿Tienes alguna otra duda?"],
    ["Día 7 · Cierre", "El bono de inscripción anticipada termina el {FECHA_BONO}. Si quieres asegurar tu lugar, te envío la forma de pago. Si prefieres no recibir más mensajes, responde BAJA."]
  ],
  claseMuestra: [
    ["0–5 min", "Bienvenida, presentación del Prof. José Luis Orozco y promesa de la clase: 'en 45 minutos sabrás por dónde empezar con un Stellantis lleno de códigos'."],
    ["5–15 min", "Tip 1 en vivo: la red CAN en el DLC (60 Ω, voltajes de CAN H y CAN L) con la caja de desconexión y el multímetro."],
    ["15–25 min", "Tip 2 en vivo: CAN H y CAN L en el osciloscopio Hantek 6074BE; forma correcta contra forma con falla (Laboratorio)."],
    ["25–32 min", "Tip 3: Security Gateway: qué se puede hacer sin desbloquear y cómo distinguir un bloqueo de una falla real."],
    ["32–38 min", "Demostración del Laboratorio Interactivo: subir una captura, ruta por DTC según el equipo."],
    ["38–43 min", "Presentación del curso: temario, bonos, garantía (por confirmar) e inversión de $1,799 MXN. Bono de inscripción anticipada si aplica."],
    ["43–45 min", "Preguntas y llamado: escribe STELLANTIS por WhatsApp."]
  ],
  lanzamiento: [
    ["Jue 5–Dom 8 nov 2026", "Preparación", "Configurar WhatsApp Business, landing, detector, píxel y aviso de privacidad. Subir videos e imágenes. Confirmar precio, grupo y garantía."],
    ["Lun 9 nov", "Dar", "Publicar el Detector de Fallas y el carrusel de 5 pruebas. Mensaje a la lista de difusión (con consentimiento)."],
    ["Mar 10–Mié 11 nov", "Dar", "Video 9:16 (dolor) y 1:1 (dinero) en orgánico. Invitación a la clase muestra."],
    ["Jue 12 nov · 19:00", "Dar", "Clase muestra gratuita en vivo de 45 minutos."],
    ["Vie 13–Mar 17 nov", "Pedir · El Buen Fin", "Apertura de inscripciones con bono de inscripción anticipada (sesión extra de revisión de capturas) en lugar de descuento. Anuncios con video 16:9 (sistema). Estados diarios."],
    ["Mié 18–Mar 24 nov", "Seguimiento", "Secuencia de 6 mensajes de WhatsApp. Responder objeciones. Publicar 2 tips más."],
    ["Mié 25–Jue 26 nov", "Autoridad", "Edición presencial en Querétaro (según el anuncio de referencia; por confirmar): fotos y video del taller con autorización."],
    ["Vie 27 nov", "Recordatorio", "Black Friday: recordatorio del cupo del grupo (sin descuento)."],
    ["Vie 18–Mar 22 dic", "Aguinaldo", "Segundo empuje: opción de pago en exhibiciones (por confirmar)."],
    ["Mar 12 ene 2027", "Inicio sugerido del grupo", "Clases martes y jueves de 19:00 a 20:30 durante 6 semanas (por confirmar)."]
  ],
  checklist: ["WhatsApp 55 52 17 34 84 con catálogo y respuestas rápidas", "Enlace de pago configurado en CONFIG (checkoutUrl) o WhatsApp como respaldo", "Aviso de privacidad visible y consentimiento en el detector", "Píxel o etiquetas de medición en landing y detector", "Imágenes y videos revisados sin promesas de ingresos ni atributos personales", "Fechas del grupo, periodo de acceso y garantía confirmados", "Prueba de todos los botones en celular y en escritorio", "Lista de difusión solo con contactos que aceptaron", "Respuestas preparadas para las 9 preguntas frecuentes", "Responsable de responder WhatsApp en menos de 1 hora"],
  metricas: [["Costo por resultado del detector (lead)", "Inversión en anuncios ÷ resultados enviados por WhatsApp"], ["CTR del anuncio", "Clics ÷ impresiones"], ["Tasa de finalización del detector", "Resultados ÷ personas que iniciaron"], ["Conversación a venta", "Inscritos ÷ conversaciones de WhatsApp"], ["Costo por inscrito", "Inversión ÷ inscritos"], ["Asistencia a la clase muestra", "Asistentes ÷ registrados"], ["Retorno de la inversión publicitaria", "Ventas ÷ inversión en anuncios"]]
};
