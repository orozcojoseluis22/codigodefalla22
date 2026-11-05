// Fuente única · Investigación de mejores prácticas · Consulta: 5 de noviembre de 2026
module.exports = {
  titulo: "Investigación de mejores prácticas",
  subtitulo: "Diagnóstico electrónico y eléctrico en Chrysler, Dodge, Jeep y Ram (Stellantis)",
  fechaConsulta: "5 de noviembre de 2026",
  metodo: "Búsqueda web con fecha actual, priorizando documentos del fabricante (boletines técnicos publicados por NHTSA, manuales de servicio, comunicados de prensa de Stellantis) y contrastando cada dato importante con al menos dos fuentes. Cuando un dato solo aparece en foros o tiendas, se indica como 'práctica de campo' o 'por verificar'.",
  hallazgos: [
    ["El Security Gateway (SGW) cambia la forma de escanear", "Desde el modelo 2018, los vehículos FCA/Stellantis permiten leer códigos y datos en vivo, pero borrar códigos, hacer pruebas activas y programar exige un escáner autenticado en AutoAuth. El costo reportado para el usuario es de unos 50 USD al año por taller, con vehículos ilimitados.", "S1,S2,S3"],
    ["El número de serie del escáner queda ligado a un solo taller", "En AutoAuth cada número de serie se asigna a un taller. Al comprar un escáner usado hay que verificar que se pueda transferir.", "S4"],
    ["El cable 12+8 es una alternativa de campo, no oficial", "El cable 12+8 se conecta al SGW (en Ram DT 2019+ va en el piso del lado del conductor; en 2018 y Ram DS, detrás del radio). Al terminar se deben reinstalar los conectores originales o se pierde el radio.", "S5,S6"],
    ["Hay tres velocidades de red CAN y una LIN", "CAN C: 500 kbps (tren motriz y chasis). CAN B: 83.3 kbps, tolerante a fallas, puede trabajar con un solo cable (generaciones 2005–2010 aprox.). CAN IHS: 125 kbps (generaciones recientes). LIN: un solo cable, 9.6 a 20 kbps según el modelo.", "S7,S8,S9"],
    ["El DLC concentra la prueba de red", "CAN C se mide en las terminales 6 y 14, y CAN IHS o CAN B en la 3 y la 11. Con la batería desconectada se esperan unos 60 Ω entre CAN H y CAN L (dos resistencias de 120 Ω en paralelo). En algunos modelos, la CAN C de diagnóstico solo llega del DLC al TIPM o al gateway.", "S9,S10,S11"],
    ["La bomba de combustible en el TIPM tiene historial de campañas", "NHTSA 14V530 (Durango y Grand Cherokee 2011), 15V115 (2012–2013) y 19V813 (ampliación de 528,594 unidades). La reparación es un relevador externo y su arnés. Antes de cambiar un TIPM hay que revisar las campañas por número VIN.", "S12,S13,S14"],
    ["La carga es inteligente: PCM + IBS + BCM", "El PCM controla el campo del alternador por PWM. El sensor IBS, en el borne negativo, informa voltaje, corriente, temperatura y estado de carga por LIN. Un boletín técnico de 2024 atribuye fallas a cortos o aberturas en la línea LIN o al fusible del IBS.", "S15,S16,S17"],
    ["Cambiar un módulo exige alineación PROXI", "Después de reemplazar o agregar un módulo se ejecutan 'Restore Vehicle Configuration' y 'PROXI Configuration Alignment' en wiTECH 2.0. Se necesita suscripción y una interfaz J2534. Existen boletines por fallas de alineación del BCM (código B10AA-4A).", "S18,S19,S20"],
    ["El inmovilizador ha cambiado de generación", "Han existido SKIM, SKREEM/WCM, WIN y RFHM. P0513 indica llave no válida y P0633 indica que la clave secreta no está guardada en el PCM. Se necesita el PIN del vehículo. Antes de condenar el PCM, se prueba la llave de repuesto.", "S21,S22"],
    ["El Hemi regresa a la Ram 1500 2026 con eTorque de 48 V", "Stellantis confirmó el Hemi 5.7 con eTorque (híbrido ligero de 48 V) y el Hurricane 3.0 de seis cilindros en línea (420 y 540 hp). El taller debe saber trabajar con sistemas de 48 V y motor-generador de banda (BSG).", "S23,S24"],
    ["Los Jeep 4xe exigen protocolo de alto voltaje", "La campaña 68C (NHTSA 25V-741) cubre Wrangler 4xe 2020–2025 y Grand Cherokee 4xe 2022–2026 por celdas de la batería de alto voltaje. Solo debe intervenir personal capacitado, con equipo de protección, desenergizado y una espera mínima de 2 minutos.", "S25,S26,S27"],
    ["El consumo parásito se mide con paciencia", "Las referencias generales indican menos de 30 a 50 mA con los módulos dormidos. Algunos Jeep tardan hasta unos 20 minutos en dormir, y abrir una puerta o conectar el medidor los despierta. Este valor es típico; verifíquelo con el manual del fabricante.", "S28,S29"],
    ["Stellantis crece en México", "Su participación fue de 5.8% (enero a septiembre de 2025), 6.6% (primer trimestre de 2026) y 7.2% (julio de 2026), con Ram a la cabeza del grupo. Cada vez llegan más unidades de estas marcas a los talleres independientes.", "S30,S31"],
    ["Nueva ley de datos personales (2025)", "La LFPDPPP se publicó el 20 de marzo de 2025. Ahora supervisa la Secretaría Anticorrupción y Buen Gobierno. El aviso de privacidad debe mostrarse desde que se recaba el dato, y en general se requiere consentimiento. Esto aplica al lead magnet y a WhatsApp.", "S32,S33,S34"],
    ["Fecha comercial más cercana: El Buen Fin 2026", "Será del 13 al 17 de noviembre de 2026 (cinco días; el lunes 16 es día de descanso). El Black Friday cae el 27 de noviembre. Se recomienda un bono en lugar de un descuento.", "S35,S36"]
  ],
  cambios: [
    ["20 mar 2025", "Entra en vigor la nueva LFPDPPP; desaparece el INAI", "El aviso de privacidad y el consentimiento deben estar en la landing, el lead magnet y WhatsApp."],
    ["Jun–dic 2025", "Regresa el Hemi 5.7 eTorque de 48 V a la Ram 1500 2026, junto con el Hurricane 3.0", "Llegarán más sistemas de 48 V y BSG al taller, y se requiere protocolo de seguridad."],
    ["2025", "Boletín técnico sobre la alineación PROXI del BCM (código B10AA-4A)", "Un módulo nuevo puede no alinearse; hay que seguir el procedimiento de la cadena PROXI."],
    ["Fin de 2025", "Campaña 68C / 25V-741 en Jeep 4xe (más de 320 mil unidades)", "Revise el VIN antes de recibir un 4xe y no lo cargue si la campaña está pendiente."],
    ["2024", "Boletín técnico del IBS: fallas en la línea LIN o en el fusible del IBS", "Mida la línea LIN con osciloscopio antes de cambiar el IBS o el BCM."],
    ["2024–2025", "Más escáneres de posventa con acceso AutoAuth (Autel, Bosch, Innova)", "Elija un escáner con AutoAuth para trabajar Stellantis 2018 y posteriores."],
    ["2026", "Boletines con 'Restore Vehicle Configuration' y PROXI en wiTECH 2.0", "Presupueste la suscripción y la interfaz J2534 si va a reemplazar módulos."],
    ["1T 2026", "Stellantis México crece 19% anual (6.6% del mercado)", "Hay más demanda de diagnóstico especializado en Ram, Jeep y Dodge."],
    ["5 may 2026", "Meta actualiza sus Normas de Publicidad (cambios principalmente editoriales)", "Evite el 'tú' que señala atributos personales y las promesas de ingresos."],
    ["13–17 nov 2026", "El Buen Fin 2026 dura 5 días", "Lanzamiento con bono por inscripción anticipada."]
  ],
  secciones: [
    { t: "1. Estado actual de la tecnología Stellantis", p: [
      "La arquitectura eléctrica de Chrysler, Dodge, Jeep y Ram ha pasado por tres etapas que el técnico debe reconocer a simple vista. Primera etapa (aprox. 2005–2010): CAN C de 500 kbps para tren motriz y CAN B de 83.3 kbps tolerante a fallas para la carrocería, con TIPM como central de distribución. Segunda etapa (aprox. 2011–2017): CAN IHS de 125 kbps en lugar de CAN B, TIPM‑7 o PDC con BCM, IBS por LIN y PCM GPEC. Tercera etapa (2018 en adelante): Security Gateway (SGW) entre el DLC y las redes, alineación PROXI obligatoria al cambiar módulos, eTorque de 48 V y, en 4xe, alto voltaje.",
      "Implicación didáctica: el curso enseña a identificar la etapa del vehículo en los primeros 5 minutos (año, presencia de SGW, tipo de red en el DLC) para elegir equipo y ruta de diagnóstico. Esa es la base del Laboratorio Interactivo."
    ], tabla: { enc: ["Red", "Velocidad", "Terminales DLC", "Característica", "Prueba rápida"], filas: [
      ["CAN C", "500 kbps", "6 (H) y 14 (L)", "Tren motriz, ABS, módulos críticos", "≈60 Ω con batería desconectada; H≈2.6 V y L≈2.4 V promedio"],
      ["CAN B", "83.3 kbps", "3 y 11 (según modelo)", "Carrocería, tolerante a fallas, modo de un solo cable", "No usa la regla de 60 Ω; verifique con el diagrama"],
      ["CAN IHS", "125 kbps", "3 y 11 (según modelo)", "Interior: radio, clima, tablero", "Termine y mida como CAN de alta velocidad según el diagrama"],
      ["LIN", "9.6–20 kbps", "No llega al DLC", "IBS, alternador, interruptores, sensores", "Osciloscopio: reposo ≈ voltaje de batería, pulsos a ≈0 V"]
    ] }, nota: "Valores típicos; verifique con el manual del fabricante. Fuentes: S7–S11." },
    { t: "2. Procedimientos correctos y errores comunes", p: [
      "Procedimiento correcto: (1) entrevista y verificación del síntoma; (2) revisión de campañas y boletines por VIN; (3) escaneo completo de módulos con registro de códigos y datos congelados; (4) prueba de alimentaciones y tierras con caída de voltaje bajo carga; (5) prueba del circuito con multímetro y osciloscopio desde el conector del módulo; (6) reparación, alineación PROXI si aplica, borrado de códigos y prueba de manejo.",
      "Errores frecuentes documentados: cambiar el TIPM sin revisar la campaña del relevador de la bomba; cambiar el PCM ante P0633 sin el PIN ni la transferencia de la clave secreta; confundir un bloqueo del SGW con una falla de comunicación; medir el consumo parásito sin esperar a que los módulos se duerman; olvidar reinstalar los conectores originales después de usar el cable 12+8."
    ] },
    { t: "3. Normas y reglamentos aplicables en México", p: [
      "Protección de datos: la nueva LFPDPPP (DOF, 20 de marzo de 2025) exige aviso de privacidad desde la recolección y consentimiento. La autoridad ahora es la Secretaría Anticorrupción y Buen Gobierno. Aplica al formulario del lead magnet, a la captura por WhatsApp y a los webhooks.",
      "Consumo: la Ley Federal de Protección al Consumidor obliga a respetar garantías (art. 78) y a publicitar precios claros. Profeco vigila que talleres y agencias cumplan lo acordado. Recomendación: entregar presupuesto y orden de servicio por escrito, con garantía de la reparación. Los sorteos con fines promocionales requieren permiso de la Secretaría de Gobernación.",
      "Seguridad eléctrica: en vehículos 4xe, solo personal capacitado puede intervenir el sistema de alto voltaje, con equipo de protección personal, procedimiento de desenergizado y espera mínima de 2 minutos (documento de campaña 23V‑303). En sistemas de 48 V (eTorque) se debe seguir el procedimiento del fabricante para desconectar."
    ] },
    { t: "4. Herramientas, software y precios de referencia", p: [
      "No se encontraron precios oficiales de lista en pesos para todos los equipos. Se reportan los precios encontrados con su moneda original y su fuente. Conviértalos al tipo de cambio del día (Banxico) y confírmelos en Mercado Libre México o con un distribuidor antes de publicarlos."
    ], tabla: { enc: ["Equipo", "Uso en Stellantis", "Precio encontrado", "Fuente / fecha"], filas: [
      ["Hantek 6022BE (2 canales, 20 MHz)", "CKP/CMP, inyectores, LIN, PWM", "€55.88 a €66.50; £85", "Botland, The Debug Store · nov 2026"],
      ["Hantek 6074BE (4 canales, 70 MHz)", "Correlación CKP‑CMP, CAN H/L, encendido", "$7,600 MXN (tienda MX); usados en ML $8,599–$14,846 MXN", "autodiagnosisochoa.com, Mercado Libre · nov 2026"],
      ["FNIRSI 2C53P (2 canales, 50 MHz, multímetro, generador)", "Taller móvil, sensores, LIN", "€78.99 a €123.49; Q1,219 (Guatemala)", "eBay.de, Elektor, Pacifiko · nov 2026"],
      ["FNIRSI 1013D (2 canales, 100 MHz, tableta)", "Señales generales; firmware abierto disponible", "Por verificar", "Repositorio pecostm32/FNIRSI_1013D_Firmware"],
      ["Autel MaxiCheck MX900", "Bidireccional, AutoAuth (verificar versión)", "US$464.99 a US$624", "eBay, distribuidor de EUA · nov 2026"],
      ["Launch X431 (serie PRO)", "Bidireccional, codificación; AutoAuth según versión", "US$599 a US$1,349 según variante", "eBay · nov 2026"],
      ["AutoAuth (registro SGW)", "Desbloqueo del SGW 2018+", "≈US$50 al año por taller", "Astech, YouCanIC · nov 2026"],
      ["wiTECH 2.0 + J2534", "Programación, PROXI, configuración", "Suscripción por VIN o por periodo (por verificar)", "Foros técnicos y portal Stellantis"]
    ] }, nota: "Los precios cambian a diario. Rotúlelos como referencia y confírmelos antes de publicarlos." },
    { t: "5. Mercado: cuánto se cobra y qué se puede vender", p: [
      "Las fuentes públicas en México sobre el precio del escaneo básico son escasas y poco verificables: reportan de $250 a $450 MXN por un escaneo básico, y algunas refaccionarias escanean gratis. Conclusión práctica: el taller no debe competir por 'escaneo', sino vender DIAGNÓSTICO con método (tiempo, equipo especializado, informe y garantía).",
      "Servicios adicionales que piden los clientes de Stellantis: diagnóstico de comunicación (códigos U), consumo parásito, sistema de carga con IBS, reemplazo e inicialización de batería, revisión y reparación del TIPM, programación de llaves (con PIN), alineación PROXI, actualización de software, prueba de batería con impresión y revisión de campañas por VIN."
    ], tabla: { enc: ["Servicio (ejemplo ilustrativo)", "Equipo mínimo", "Tiempo típico", "Precio sugerido por calcular"], filas: [
      ["Escaneo con informe", "Escáner + impresión", "20–30 min", "Usar la calculadora del bono 5"],
      ["Diagnóstico de red CAN / códigos U", "Escáner, multímetro, osciloscopio", "1–2 h", "Tarifa por hora de diagnóstico"],
      ["Consumo parásito", "Pinza de bajo amperaje, multímetro", "1–2 h", "Tarifa por hora + reparación"],
      ["Carga inteligente / IBS", "Pinza, osciloscopio, escáner", "1 h", "Tarifa + batería o reparación"],
      ["Alineación PROXI / configuración", "wiTECH o escáner compatible + J2534", "30–60 min", "Tarifa + costo de suscripción"]
    ] } },
    { t: "6. Estrategias de venta aplicadas al taller", p: [
      "Hormozi, $100M Offers: valor = (resultado soñado × probabilidad percibida) ÷ (tiempo de espera × esfuerzo). En el taller: 'su camioneta arranca hoy, con informe y garantía' sube el resultado y la probabilidad; 'diagnóstico en 2 horas' baja el tiempo. Oferta Gran Slam = servicio principal + bonos que eliminan obstáculos (revisión de campañas, impresión del informe, prueba de batería).",
      "$100M Leads: los Core Four son contacto en frío, contenido gratuito, anuncios pagados y referidos. 'Dar, dar, dar… y luego pedir': publicar tips útiles (por ejemplo, la prueba de 60 Ω en el DLC) antes de ofrecer el servicio. $100M Money Models: atracción (escaneo con informe), venta adicional (reparación + batería), opción accesible (pagos) y continuidad (revisión preventiva).",
      "Jay Abraham: hay 3 formas de crecer: más clientes, ticket promedio mayor y más visitas por cliente. Cialdini: reciprocidad (informe gratis impreso), compromiso (autorización por etapas), prueba social (reseñas reales en Google), autoridad (fichas y capturas de osciloscopio), simpatía, escasez real (lugares por día) y unidad ('técnicos que sí miden'). Método CLOSER en llamada o mostrador: Clarificar, Etiquetar, Repasar el pasado, Vender el destino, Explicar inquietudes y Reforzar la decisión."
    ] },
    { t: "7. Inteligencia artificial útil para el alumno", p: [
      "Usos verificables hoy en México con asistentes comerciales (ChatGPT, Gemini, Claude, Copilot): explicar un DTC en lenguaje del cliente, ordenar una ruta de prueba, describir una captura de osciloscopio (como apoyo, no como veredicto), redactar presupuestos, mensajes de WhatsApp y publicaciones para Google Maps.",
      "Reglas: la IA no sustituye la medición. Toda conclusión se confirma con multímetro, osciloscopio y diagrama del fabricante. No suba datos personales del cliente (nombre, teléfono, VIN completo) sin consentimiento. El curso integra el Laboratorio Interactivo con motor de reglas propio y un enlace a codigodefalla22.com para la consulta con IA."
    ] },
    { t: "8. Repositorios de GitHub evaluados para el Laboratorio Interactivo", p: [
      "Se buscaron repositorios populares (con muchas estrellas) que aporten funciones al laboratorio: graficar señales, leer archivos CSV de osciloscopio, búsqueda tolerante de códigos, digitalizar capturas, OCR y análisis de CAN. Estrellas consultadas en la API de GitHub el 5 de noviembre de 2026."
    ], tabla: { enc: ["Repositorio", "Estrellas", "Licencia", "Uso en el laboratorio"], filas: [
      ["d3/d3", "113,869", "ISC", "Referencia de visualización (no incrustado)"],
      ["mermaid-js/mermaid", "91,016", "MIT", "Diagramas de flujo de diagnóstico (opcional)"],
      ["chartjs/Chart.js", "67,779", "MIT", "Alternativa de gráficas (no usada)"],
      ["commaai/openpilot", "64,068", "MIT", "Referencia: soporta Chrysler/Jeep/Ram en CAN"],
      ["naptha/tesseract.js", "38,810", "Apache‑2.0", "OCR opcional de escalas V/div y tiempo/div en capturas"],
      ["krisk/Fuse", "20,523", "Apache‑2.0", "INCRUSTADO: búsqueda tolerante de DTC y síntomas"],
      ["plotly/plotly.js", "18,376", "MIT", "Alternativa de gráficas (no usada por su peso)"],
      ["mholt/PapaParse", "13,591", "MIT", "INCRUSTADO: lectura de CSV de Hantek, FNIRSI y escáneres"],
      ["leeoniya/uPlot", "10,616", "MIT", "INCRUSTADO: gráfica rápida de formas de onda con zoom y cursores"],
      ["commaai/opendbc", "3,536", "MIT", "Referencia de mensajes CAN de Chrysler (DBC) para clase de redes"],
      ["automeris-io/WebPlotDigitizer", "3,182", "AGPL‑3.0", "Método de referencia: el laboratorio implementa su propio digitalizador por color"],
      ["cantools/cantools", "2,310", "MIT", "Decodificar registros CAN (práctica avanzada en PC)"],
      ["fr3ts0n/AndrOBD", "2,168", "GPL‑3.0", "App gratuita con ELM327 para datos en vivo"],
      ["collin80/SavvyCAN", "1,915", "MIT", "Analizador CAN para PC (práctica avanzada)"],
      ["OpenHantek/OpenHantek6022", "1,150", "GPL‑3.0", "Software libre para Hantek 6022BE; exporta CSV compatible"],
      ["pecostm32/FNIRSI_1013D_Firmware", "163", "GPL‑3.0", "Firmware abierto para FNIRSI 1013D (solo referencia)"]
    ] }, nota: "Solo se incrustan bibliotecas MIT o Apache‑2.0 (uPlot, PapaParse y Fuse.js). Las de licencia GPL o AGPL se usan como herramientas externas o como referencia, sin copiar su código." },
    { t: "9. Calendario comercial cercano", p: [
      "El Buen Fin es del 13 al 17 de noviembre de 2026 y el Black Friday el 27 de noviembre. Después vienen el aguinaldo (pago a más tardar el 20 de diciembre), la cuesta de enero y la temporada de lluvias (de mayo a octubre), que aumenta las fallas eléctricas por humedad en conectores y tierras. El regreso a clases es en agosto, el Día del Padre en junio y el Hot Sale entre mayo y junio (fecha de 2027 por confirmar).",
      "Recomendación: lanzar con un bono de inscripción anticipada durante El Buen Fin, sin descuento, y con fecha de cierre real."
    ] },
    { t: "10. Políticas de publicidad", p: [
      "En Meta, evite afirmar o insinuar atributos personales del lector ('¿Eres…?') y no prometa ingresos. En 2026 se reportó una aplicación más estricta de esta regla (fuentes de terceros; verifique el texto oficial en el Centro de Políticas de Meta). En Google, no prometa posiciones: Google Maps clasifica por relevancia, distancia y prominencia, y no es posible pagar por un mejor lugar en los resultados locales. Profeco exige precios claros y publicidad no engañosa."
    ] }
  ],
  advertencias: [
    "Los valores eléctricos son típicos y provienen de manuales de modelos específicos. Siempre se debe verificar con el diagrama del fabricante del vehículo exacto (año, motor y equipamiento).",
    "Los precios de los equipos son referencias tomadas de tiendas y subastas. No son precios oficiales. Confírmelos antes de publicarlos.",
    "Los datos de mercado de México sobre el costo del escaneo provienen de fuentes no verificables. Se usan solo como orientación.",
    "La información sobre el cable 12+8 y las ubicaciones del SGW proviene de foros. No es un procedimiento oficial del fabricante.",
    "No se encontró el artículo específico de la LFPC que obliga a entregar presupuesto escrito en talleres. Se recomienda como buena práctica y para cumplir Profeco.",
    "Los diagramas del curso son didácticos y de elaboración propia, a partir de arquitecturas típicas. No sustituyen al diagrama oficial (TechAuthority / wiTECH / Mitchell / ALLDATA)."
  ],
  fuentes: [
    ["S1", "Astech · AutoAuth Access", "https://astech.com/autoauth/"],
    ["S2", "FCA/ETI · SGW FAQ Ver. 12 (2024)", "https://etools.org/wp-content/uploads/2024/09/SGW-FAQ-Ver-12.pdf"],
    ["S3", "ETI · Steps to obtain Stellantis SGW Access (2024)", "https://etools.org/wp-content/uploads/2024/09/Steps-to-obtain-Stellantis-SGW-Access-1.pdf"],
    ["S4", "Bosch Diagnostics · Secure Gateway", "https://boschdiagnostics.com/ads-software/secure-gateway"],
    ["S5", "RamForum · SGW Location Help", "https://www.ramforum.com/threads/sgw-location-help.211832/"],
    ["S6", "JL Wrangler Forums · Security bypass cable", "https://www.jlwranglerforums.com/forum/threads/security-bypass-cable-question.155664/post-3215832"],
    ["S7", "Manual de servicio Dodge Avenger 2008 · Body Control Systems", "https://workshop-manuals.com/dodge/avenger/v6-3.5l/body_and_frame/body_control_systems/system_information/description_and_operation/description/"],
    ["S8", "Manual de servicio Chrysler 300 2012 · Communication (CAN IHS)", "https://manuals.autorepairshq.com/Chrysler/2012/300%20AWD%20V6-3.6L/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Information%20Bus/Description%20and%20Operation/Communication%20-%20Description"],
    ["S9", "Manual de servicio Chrysler Pacifica 2007 · Information Bus", "https://manuals.autorepairshq.com/Chrysler/2007/Pacifica%20V6-4.0L%20VIN%20X/Repair%20and%20Diagnosis/Powertrain%20Management/Computers%20and%20Control%20Systems/Information%20Bus/Description%20and%20Operation"],
    ["S10", "IATN · Chrysler CAN-C Network Issue", "https://www.iatn.net/forums/13/55838/chrysler-can-c-network-issue"],
    ["S11", "NHTSA · documento técnico MC-10175684 (2020)", "https://static.nhtsa.gov/odi/tsbs/2020/MC-10175684-9999.pdf"],
    ["S12", "NHTSA · Recall 15V115 (informe)", "https://static.nhtsa.gov/odi/rcl/2015/RCLRPT-15V115-7243.PDF"],
    ["S13", "Vehicle Safety Recalls · NHTSA 19V813", "https://vehiclesafetyrecalls.com/recall/19V813000"],
    ["S14", "Vehicle Safety Recalls · NHTSA 14V530", "https://vehiclesafetyrecalls.com/recall/14V530000"],
    ["S15", "Información de servicio 3.0L · Charging System (Jeep Gladiator)", "https://www.jeepgladiatorforum.com/forum/attachments/electrical-3-0l-charging-system-service-information-pdf.369368/"],
    ["S16", "NHTSA · boletín técnico MC-10251783 (2024) · IBS/LIN", "https://static.nhtsa.gov/odi/tsbs/2024/MC-10251783-9999.pdf"],
    ["S17", "Manual Chrysler 300 2012 · Intelligent Battery Sensor", "https://manuals.autorepairshq.com/Chrysler/2012/300%20AWD%20V6-3.6L/Repair%20and%20Diagnosis/Starting%20and%20Charging/Battery/Battery%20Control%20Module/Description%20and%20Operation/Intelligent%20Battery%20Sensor%20%28IBS%29%20-%20Operation"],
    ["S18", "I-CAR RTS · Identifying FCA/Stellantis Programming Differences", "https://rts.i-car.com/crn-1291.html"],
    ["S19", "NHTSA · boletín técnico MC-11017878 (2025) · BCM PROXI", "https://static.nhtsa.gov/odi/tsbs/2025/MC-11017878-0001.pdf"],
    ["S20", "NHTSA · boletín técnico MC-11032315 (2026)", "https://static.nhtsa.gov/odi/tsbs/2026/MC-11032315-0001.pdf"],
    ["S21", "diag.net · Unable to complete PIN/SKIM transfer, 2019 Jeep Cherokee", "https://diag.net/discussion/s05nsd7vltjdbhiiepyagdwuv1"],
    ["S22", "diag.net · Programming SKIM keys on 2020 Gladiator with wiTECH 2.0", "https://diag.net/discussion/snpjdhagrnd8ieyc2gcc0eilb5"],
    ["S23", "Stellantis Media · 2026 Ram 1500 Hemi V-8 eTorque", "https://www.media.stellantis.com/em-en/ram/press/the-legend-returns-2026-ram-1500-offers-5-7-liter-hemi-v-8-etorque-engine-with-proven-performance-and-capability"],
    ["S24", "Stellantis North America · What's New 2026 Ram 1500", "https://media.stellantisnorthamerica.com/text.do?id=27368"],
    ["S25", "NHTSA · documento de campaña 23V-303 (seguridad de alto voltaje)", "https://static.nhtsa.gov/odi/rcl/2023/RCRIT-23V303-2466.pdf"],
    ["S26", "Cars.com · Wrangler 4xe recall", "https://www.cars.com/articles/nearly-every-jeep-wrangler-unlimited-4xe-phev-recalled-for-overheating-battery-pack-458577"],
    ["S27", "Vehicle Safety Recalls · NHTSA 24V720", "https://www.vehiclesafetyrecalls.com/recall/24V720000"],
    ["S28", "Underhood Service · Parasitic Drain: Jeep Grand Cherokee", "https://www.underhoodservice.com/parasitic-drain-jeep/"],
    ["S29", "diag.net · BCM not going to sleep", "https://diag.net/discussion/sctbveamveqeykd07dznvlhdxg"],
    ["S30", "México Industry · ventas 2025", "https://mexicoindustry.com/noticia/nissan-gm-y-volkswagen-lideran-ventas-de-autos-en-mexico-en-2025"],
    ["S31", "Clúster Industrial · Stellantis crece 19% en 1T 2026", "https://clusterindustrial.com.mx/stellantis-acelera-en-mexico-crece-19-en-el-primer-trimestre-de-2026/"],
    ["S32", "KPMG México · Nueva LFPDPPP (2025)", "https://kpmg.com/mx/es/tendencias/2025/04/flash-nueva-ley-federal-de-proteccion-de-datos-personales-en-posesion-de-los-particulares.html"],
    ["S33", "Hogan Lovells · Mexico's new federal data protection law", "https://www.hoganlovells.com/es/publications/mexicos-new-federal-data-protection-law-what-it-means-for-companies"],
    ["S34", "IDC Online · Secretaría Anticorrupción tras el INAI", "https://idconline.mx/corporativo/2025/04/02/que-asumio-la-secretaria-anticorrupcion-tras-la-desaparicion-del-inai"],
    ["S35", "Bloomberg Línea · Buen Fin 2026 fechas", "https://www.bloomberglinea.com/latinoamerica/mexico/cuando-es-el-buen-fin-2026-en-mexico-fechas-y-cuantos-dias-duraran-los-descuentos/"],
    ["S36", "Xataka México · Buen Fin 2026 durará cinco días", "https://www.xataka.com.mx/comercio-electronico/buen-fin-2026-confirma-fecha-mexico-este-ano-durara-seran-cinco-dias-ofertas/amp"],
    ["S37", "Google · Cómo mejorar tu posicionamiento local", "https://support.google.com/business/answer/7091?hl=es"],
    ["S38", "El Imparcial · Profeco: garantías obligatorias (2026)", "https://www.elimparcial.com/dinero/2026/05/22/profeco-recuerda-que-las-garantias-si-son-obligatorias-y-explica-que-hacer-si-una-tienda-se-niega-a-reparar-o-devolver-tu-dinero/"],
    ["S39", "Mercado Libre México · Hantek 6074BE", "https://listado.mercadolibre.com.mx/osciloscopio-hantek-6074be"],
    ["S40", "FNIRSI · 2C53P (fabricante)", "https://www.fnirsi.com/es/products/2c53p"],
    ["S41", "UPS Ecuador · Estudio comparativo banco Sens-22 Plus", "https://dspace.ups.edu.ec/handle/123456789/29711"],
    ["S42", "GitHub · OpenHantek6022", "https://github.com/OpenHantek/OpenHantek6022"],
    ["S43", "GitHub · uPlot", "https://github.com/leeoniya/uPlot"],
    ["S44", "GitHub · PapaParse", "https://github.com/mholt/PapaParse"],
    ["S45", "GitHub · Fuse.js", "https://github.com/krisk/Fuse"],
    ["S46", "GitHub · commaai/opendbc", "https://github.com/commaai/opendbc"],
    ["S47", "GitHub · WebPlotDigitizer", "https://github.com/automeris-io/WebPlotDigitizer"],
    ["S48", "GitHub · tesseract.js", "https://github.com/naptha/tesseract.js"],
    ["S49", "Stellantis · Technical Information (registro de operadores independientes)", "https://www.technicalinformation.fiat.com/tech-info-web/web/easyAccess.do"],
    ["S50", "I-CAR RTS · Collision Information Website Access: FCA/Stellantis", "https://rts.i-car.com/crn-459.html"]
  ]
};
