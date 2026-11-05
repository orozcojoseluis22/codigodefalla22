// FUENTE ÚNICA · Oferta (Hormozi aplicado). Todo lo marcado porConfirmar debe validarlo José Luis Orozco.
module.exports = {
  ecuacionValor: [
    { palanca: "Resultado soñado ↑", como: "Diagnosticar cualquier falla eléctrica de moto y cobrarla como especialista; menú de servicios y plan de clientes incluidos." },
    { palanca: "Probabilidad de lograrlo ↑", como: "Método 1-2-3 (alimentación, tierra, señal), prácticas con motos reales, revisión de tareas, atlas de diagramas y garantía de acompañamiento." },
    { palanca: "Tiempo de espera ↓", como: "Desde la Clase 1 ya mides caída de tensión; en la Clase 4 diagnosticas sistemas de carga, el servicio más pedido." },
    { palanca: "Esfuerzo y sacrificio ↓", como: "Clases nocturnas de 90 minutos, grabadas 12 meses; formatos, fichas y calculadora listos para usar." },
  ],
  valorClases: 4200, // 12 clases en vivo × $350 de referencia
  valorClasesExplica: "Referencia: una clase técnica en vivo de 90 minutos con práctica y revisión de tareas se valora en $350 MXN (estimado por confirmar).",
  bonos: [
    { id: "atlas", nombre: "Atlas MotoDiagrama", formula: "17 diagramas eléctricos de motos para ubicar cualquier circuito en minutos", formato: "PDF + PNG", valor: 990, explica: "Diagramas originales de sistemas típicos con puntos de prueba y valores; equivale a días de trabajo de dibujo y verificación.", entrega: "04_Bonos/01_Atlas_de_diagramas" },
    { id: "fichas", nombre: "Fichas técnicas de sensores y actuadores", formula: "16 fichas para probar cada pieza con multímetro, escáner, osciloscopio y Sens-22", formato: "Word + PDF", valor: 690, explica: "Formato de taller listo para imprimir y pegar junto a la mesa de trabajo.", entrega: "04_Bonos/02_Fichas_tecnicas" },
    { id: "arboles", nombre: "Árboles de diagnóstico", formula: "6 rutas de prueba para resolver las fallas que más llegan al taller", formato: "PDF", valor: 490, explica: "No carga, no da marcha, no hay chispa, se descarga parada, inyección/se apaga y focos fundidos.", entrega: "04_Bonos/03_Arboles_de_diagnostico" },
    { id: "valores", nombre: "Tabla de valores y códigos", formula: "Referencia rápida de valores típicos, colores y formas de leer fallas por marca", formato: "PDF + Excel", valor: 390, explica: "Valores con fuente y advertencia de verificar con el manual del modelo.", entrega: "04_Bonos/04_Tabla_de_valores" },
    { id: "calculadora", nombre: "Calculadora de precios y recuperación", formula: "Calcula tu costo por hora, tus paquetes y tus días para recuperar la inversión", formato: "Excel con fórmulas", valor: 790, explica: "Hoja con fórmulas reales; celdas de entrada en amarillo y un ejemplo ilustrativo.", entrega: "04_Bonos/05_Calculadora" },
    { id: "formatos", nombre: "Kit de formatos del taller eléctrico", formula: "Orden de servicio, inspección con semáforo, presupuesto de 3 opciones, garantía y aviso de privacidad", formato: "Word + PDF", valor: 590, explica: "Formatos editables para trabajar en orden y cumplir con información de precios y datos personales.", entrega: "04_Bonos/06_Formatos" },
    { id: "prompts", nombre: "Banco de 60 prompts de IA para el taller", formula: "Traduce manuales, redacta reportes y mensajes en minutos", formato: "Word + PDF", valor: 390, explica: "Instrucciones probadas para ChatGPT, Gemini o Claude con advertencias de verificación y privacidad.", entrega: "04_Bonos/07_Prompts_IA" },
    { id: "ideas", nombre: "100 ideas para ganar más con la electricidad de motos", formula: "Servicios, paquetes, alianzas y contenidos para subir tu ticket", formato: "PDF", valor: 290, explica: "Lista práctica para elegir 3 ideas por mes.", entrega: "04_Bonos/08_100_ideas" },
    { id: "whatsapp", nombre: "Kit WhatsApp + calendario de contenido de 30 días", formula: "30 mensajes listos y 30 días de publicaciones para llenar tu agenda", formato: "Word + PDF", valor: 490, explica: "Mensajes para cotizar, dar seguimiento, pedir reseñas y reactivar clientes.", entrega: "04_Bonos/09_Kit_WhatsApp_y_contenido" },
    { id: "plan", nombre: "Plan de acción 30 y 90 días + 2 sesiones de dudas en vivo", formula: "Ruta semana a semana y dos sesiones para resolver tus casos reales", formato: "PDF + Zoom", valor: 1200, explica: "Incluye 2 sesiones en vivo de 60 minutos al terminar el curso (fechas por confirmar).", entrega: "04_Bonos/10_Plan_30_90" },
  ],
  sustitucionPlataforma: "El tema del curso es técnico; por eso la plataforma GoHighLevel no se incluye como bono y se sustituye por el Atlas MotoDiagrama y el Kit de formatos, de uso inmediato en el taller.",
  bonoBuenFin: { nombre: "Bono Buen Fin (13–17 nov 2026)", que: "Sesión extra en vivo \"Fallas reales de motos de reparto\" + plantilla de propuesta para flotillas", valor: 590, condicion: "Solo para inscripciones pagadas del 13 al 17 de noviembre de 2026 (por confirmar)." },
  garantia: {
    nombre: "Garantía doble Mide y Decide (por confirmar)",
    puntos: [
      "Satisfacción: toma las Clases 1 y 2 y haz sus tareas; si sientes que el curso no es para ti, pide por WhatsApp la devolución del 100 % dentro de los 7 días siguientes a la Clase 2.",
      "Acompañamiento: si entregas las 12 tareas y aún no logras hacer el diagnóstico completo de carga, encendido y arranque, te damos lugar sin costo en el siguiente grupo y una sesión 1 a 1 de 30 minutos.",
    ],
  },
  escasez: "Cupo de 40 alumnos por grupo para poder revisar tareas y responder dudas (por confirmar).",
  urgencia: "Inscripciones abiertas hasta el viernes 8 de enero de 2027 o hasta agotar cupo; el Bono Buen Fin solo aplica del 13 al 17 de noviembre de 2026 (por confirmar).",
  pago: { contado: "$1,799 MXN", partes: "2 pagos de $900 MXN (por confirmar)", msi: "Meses sin intereses con tarjeta participante si el procesador de pago lo permite (por confirmar)", sinTarjeta: "Transferencia o depósito en tienda con comprobante" },
  modeloDinero: [
    { etapa: "Atracción", oferta: "Lead magnet gratis: Árbol de Diagnóstico Eléctrico para Mecánicos de Motos + clase muestra gratuita de 45 minutos", objetivo: "Dar valor, captar WhatsApp con consentimiento y mostrar el método" },
    { etapa: "Oferta principal", oferta: "Curso Diagnóstico Electrónico y Electricidad de Motocicletas para Mecánicos · $1,799 MXN", objetivo: "Transformar al alumno en técnico eléctrico de motos" },
    { etapa: "Venta adicional", oferta: "Asesoría 1 a 1 de casos reales o curso avanzado de diagnóstico de motos con CAN, ABS e inmovilizador (precio por confirmar)", objetivo: "Subir el valor por alumno con quien ya obtuvo resultados" },
    { etapa: "Opción accesible", oferta: "Pago en 2 partes o meses sin intereses (por confirmar)", objetivo: "No perder alumnos por flujo de efectivo" },
    { etapa: "Continuidad", oferta: "Comunidad MotoDiagnóstico: caso del mes en vivo, actualizaciones y bolsa de diagramas (membresía mensual por confirmar)", objetivo: "Ingreso recurrente y comunidad de egresados" },
  ],
  nombresHormozi: [
    { pieza: "Oferta", nombre: "Programa Intensivo MotoDiagnóstico", formula: "Motivo (arranque de año) + para quién (mecánicos de motos) + resultado (diagnosticar con método) + tiempo (6 semanas) + contenedor (programa intensivo)" },
    { pieza: "Lead magnet", nombre: "Árbol de Diagnóstico Eléctrico para Mecánicos de Motos: encuentra por qué no carga, no arranca o se descarga en 10 minutos", formula: "Herramienta + para quién + resultado + tiempo" },
    { pieza: "Clase muestra", nombre: "Clase muestra gratis: la moto que no carga, diagnosticada en 4 pruebas", formula: "Contenedor + resultado + método" },
  ],
};
