// FUENTE ÚNICA · Publicidad, copys y lanzamiento
const CTA = 'Escribe ECU por WhatsApp al 55 5217 3484';
module.exports = {
  ideaCentral: 'La mayoría de las computadoras "dañadas" no lo están, y las que sí lo están casi siempre se reparan: con método por etapas y banco de pruebas, el técnico deja de mandar ECU fuera y empieza a cobrarlas.',
  angulos: [
    ['Dolor o problema', 'Cambiaste la computadora y el auto sigue igual; o la mandaste fuera y tardó dos semanas.'],
    ['Dinero u oportunidad', 'Cada ECU que mandas fuera la cobra otro taller; el diagnóstico en banco también se cobra.'],
    ['Resultado o sistema', 'Método de 5 etapas: alimentación, entradas, proceso, salidas y red, probado en banco.'],
    ['Miedo a errores o riesgos', 'Fuente con límite de corriente, ESD y respaldo de memoria: repara sin quemar la computadora del cliente.'],
    ['Facilidad y tiempo', '2 días presenciales con práctica, fichas, plantillas y calculadora listas para usar.'],
    ['Autoridad del instructor', 'Prof. José Luis Orozco Cuautle: 50 años capacitando técnicos en México y Latinoamérica.']
  ],
  // Videos (guion visual en scripts/video_*.html; textos aquí)
  videos: [
    { id: 'video_9x16_dolor', formato: '9:16 · 1080×1920 · 28 s', angulo: 'Dolor o problema',
      gancho: '¿Cambiaste la computadora… y el auto sigue igual?',
      tips: [['Mide la caída de voltaje en las tierras', 'Con carga: menos de 0.1 V', 'Clase 3'], ['P0641: desconecta sensor por sensor', 'El que regresa la referencia a 5 V es el culpable', 'Clase 6'], ['60 Ω entre los pines 6 y 14 del DLC', 'Si mide 120 Ω falta una terminación CAN', 'Clase 9']],
      cierre: 'Aprende a demostrar si la ECU está dañada',
      copys: [['Facebook e Instagram', '¿Cambiaste la computadora y el auto sigue igual? 3 mediciones que debes hacer antes de condenar una ECU. Curso presencial en León (27–28 nov) y CDMX (16–17 dic). ' + CTA + '.'], ['Reels y TikTok', 'Antes de cambiar la ECU, mide esto 👇 Tierras, referencia de 5 V y red CAN. ¿Cuál revisas primero? ' + CTA + '.'], ['YouTube (Shorts)', 'Título: 3 mediciones antes de cambiar una computadora automotriz · Descripción: tierras, P0641 y CAN. Curso Reparación de computadoras automotrices. ' + CTA + '.'], ['Estados de WhatsApp', 'Antes de cambiar la ECU: tierras < 0.1 V, referencia 5 V y CAN 60 Ω. Curso presencial León y CDMX. Escribe ECU.'], ['Comentario fijado', '¿Quieres el árbol de diagnóstico gratis para separar falla de computadora o de vehículo? Escribe ECU por WhatsApp al 55 5217 3484 y te mandamos el enlace.']],
      locucion: ['(0–3 s) ¿Cambiaste la computadora… y el auto sigue igual?', '(3–10 s) Primero: mide la caída de voltaje en las tierras con el motor trabajando. Más de una décima de volt y la culpa no es de la computadora.', '(10–18 s) ¿Código P0641? Desconecta sensor por sensor. El que regresa la referencia a cinco volts es el culpable.', '(18–25 s) ¿No comunica? Con batería desconectada, mide entre los pines 6 y 14: deben ser unos 60 ohms.', '(25–28 s) Aprende el método completo. Curso presencial en León y Ciudad de México. Escribe ECU por WhatsApp.'] },
    { id: 'video_1x1_dinero', formato: '1:1 · 1080×1080 · 28 s', angulo: 'Dinero u oportunidad',
      gancho: 'Cada ECU que mandas fuera la cobra otro taller',
      tips: [['Cobra el diagnóstico en banco', 'Aunque el cliente no autorice la reparación', 'Clase 10'], ['Ofrece 3 opciones, no un precio', 'Ejemplo: $1,800 · $2,600 · $3,400', 'Clase 12'], ['Corrige la causa raíz', 'Inyector de 3 Ω contra 12 Ω: se vende con evidencia', 'Clase 8']],
      cierre: 'Repara, garantiza y cobra tus computadoras',
      copys: [['Facebook e Instagram', 'Cada ECU que mandas fuera la cobra otro taller. Aprende a diagnosticarla en banco, repararla y cobrarla con garantía. Ejemplos ilustrativos; no es promesa de ingresos. ' + CTA + '.'], ['Reels y TikTok', '3 formas de cobrar mejor la reparación de ECU (ejemplo ilustrativo) 💡 ¿Tú cómo cotizas? ' + CTA + '.'], ['YouTube (Shorts)', 'Título: Cómo cotizar la reparación de una ECU con 3 opciones · Descripción: diagnóstico en banco, menú de precios y causa raíz. ' + CTA + '.'], ['Estados de WhatsApp', 'Cobra el diagnóstico, ofrece 3 opciones y corrige la causa raíz. Curso presencial León y CDMX. Escribe ECU.'], ['Comentario fijado', 'La calculadora de cotización en Excel viene como bono del curso. Escribe ECU por WhatsApp al 55 5217 3484.']],
      locucion: ['(0–3 s) Cada computadora que mandas fuera… la cobra otro taller.', '(3–10 s) Uno: cobra el diagnóstico en banco, aunque el cliente no autorice la reparación.', '(10–18 s) Dos: no des un precio, da tres opciones. Básico, recomendado y premium. Son ejemplos: calcula los tuyos.', '(18–25 s) Tres: corrige la causa raíz. Un inyector en corto quema el driver; con evidencia, el cliente lo entiende.', '(25–28 s) Aprende a reparar y cobrar computadoras. Escribe ECU por WhatsApp.'] },
    { id: 'video_16x9_sistema', formato: '16:9 · 1920×1080 · 28 s', angulo: 'Resultado o sistema',
      gancho: 'El método por etapas para reparar cualquier ECU',
      tips: [['1 · Alimentación', 'TVS, reguladores y consumo en banco', 'Clase 5'], ['2 · Referencia y entradas', '5.0 V estables y señales que el escáner ve', 'Clase 6 y 7'], ['3 · Salidas y red', 'Pico del inyector y CAN 2.5 / 3.5 / 1.5 V', 'Clase 8 y 9']],
      cierre: '12 clases · 18 h · práctica con equipo real',
      copys: [['Facebook e Instagram', 'El método por etapas para reparar computadoras automotrices: alimentación, entradas, salidas y red, probado en banco. Curso presencial León 27–28 nov y CDMX 16–17 dic. ' + CTA + '.'], ['Reels y TikTok', 'Así se diagnostica una ECU por etapas 🔧 Guárdalo. ' + CTA + '.'], ['YouTube', 'Título: Método por etapas para reparar computadoras automotrices (ECU, ECM, PCM) · Descripción: alimentación, referencia de 5 V, entradas, salidas y CAN. Curso presencial con el Prof. José Luis Orozco Cuautle. ' + CTA + '.'], ['Estados de WhatsApp', 'Método por etapas para reparar ECU. 12 clases, 18 h, León y CDMX. Escribe ECU.'], ['Comentario fijado', 'Temario completo y fechas: escribe ECU por WhatsApp al 55 5217 3484.']],
      locucion: ['(0–3 s) El método por etapas para reparar cualquier computadora automotriz.', '(3–10 s) Etapa uno: alimentación. Supresor TVS, reguladores y consumo en banco.', '(10–18 s) Etapa dos: referencia de cinco volts y entradas. Si el escáner no ve el sensor, sigue la señal.', '(18–25 s) Etapa tres: salidas y red. El pico del inyector y los niveles CAN te dicen qué está dañado.', '(25–28 s) Doce clases, dieciocho horas, práctica con equipo real. Escribe ECU por WhatsApp.'] }
  ],
  // Copys de imágenes (texto principal ≤125, título ≤40, descripción ≤30, 5 hashtags)
  copysImagenes: [
    ['A1 Dolor (4 tamaños)', '¿Te dijeron que la ECU no tiene arreglo? Mide tierras, referencia de 5 V y CAN antes de cambiarla.', 'Mide antes de cambiar la ECU', 'Curso presencial León y CDMX', '#ECU #ElectricidadAutomotriz #DiagnosticoAutomotriz #Mecanicos #ElectronicaYServicio'],
    ['A2 Dinero (4 tamaños)', 'Cada computadora que mandas fuera la cobra otro taller. Aprende a repararla y cobrarla con garantía.', 'Repara y cobra tus ECU', 'Ejemplos ilustrativos', '#ReparacionECU #TallerMecanico #PCM #ECM #ElectronicaYServicio'],
    ['A3 Sistema (4 tamaños)', 'Diagnostica y repara computadoras Chrysler, Dodge, Jeep y Nissan en banco en 2 días.', 'Método por etapas en banco', '12 clases · 18 horas', '#Osciloscopio #ECU #Chrysler #Nissan #ElectronicaYServicio'],
    ['B Carrusel 7 láminas', '5 mediciones antes de condenar una computadora automotriz. Guárdalo para tu próximo diagnóstico.', '5 mediciones antes de la ECU', 'Guárdalo y compártelo', '#TipsAutomotrices #ECU #Multimetro #Osciloscopio #ElectronicaYServicio'],
    ['C Lead magnet (3 tamaños)', '¿Es la computadora o el vehículo? Usa gratis el Árbol de diagnóstico ECU y sal de dudas en 10 minutos.', 'Árbol de diagnóstico ECU gratis', 'Sin registro', '#HerramientaGratis #ECU #DiagnosticoAutomotriz #Mecanicos #ElectronicaYServicio'],
    ['D Miniatura YouTube', 'Método por etapas para reparar computadoras automotrices: alimentación, entradas, salidas y red.', 'Repara cualquier ECU por etapas', 'Curso presencial 2026', '#YouTubeMecanico #ECU #PCM #Osciloscopio #ElectronicaYServicio']
  ],
  guiones: [
    ['¿Tu ECU no comunica? No la cambies todavía', 'Mide 12 V en el pin 16 y tierra en 4 y 5 del DLC.', 'Clase 2'],
    ['El 60 que salva computadoras', 'Batería desconectada: 6–14 ≈ 60 Ω; 120 Ω = falta una terminación.', 'Clase 9'],
    ['Tierra con continuidad… y aun así mala', 'La prueba real es caída de voltaje con carga: < 0.1 V típico.', 'Clase 3'],
    ['P0641 en 30 segundos', 'Desconecta sensor por sensor hasta que regrese a 5 V.', 'Clase 6'],
    ['El TVS: el fusible de sacrificio', 'En modo diodo: si marca 0 en ambos sentidos, está en corto.', 'Clase 5'],
    ['Nunca uses cargador como fuente', 'Usa fuente de laboratorio con límite de 1–2 A.', 'Clase 4'],
    ['¿Por qué la ECU no inyecta en banco?', 'Muchas no inyectan sin autorización del inmovilizador.', 'Clase 4'],
    ['El sensor Hall que "no da señal"', 'Desconectado, la terminal debe mostrar el pull-up de ≈ 5 V.', 'Clase 7'],
    ['MAP en la CDMX ≠ MAP en Veracruz', 'A 2,240 m la barométrica ronda 77 kPa; el MAP marca menos.', 'Clase 6'],
    ['El pico del inyector te delata', 'Pico menor en un cilindro: espiras en corto o clamp dañado.', 'Clase 8'],
    ['Bobina Chrysler vs bobina Nissan', '2 cables: IGBT en la PCM; 3 cables: transistor en la bobina.', 'Clase 8'],
    ['La mariposa con carbón que parecía ECU', 'Limpia y mide el motor antes de abrir la computadora.', 'Clase 8'],
    ['MOSFET en corto en 5 segundos', 'Modo diodo drenaje–fuente: 0 en ambos sentidos = corto.', 'Clase 8'],
    ['El driver no se quema solo', 'Mide el inyector: 3 Ω en vez de 12 Ω mata al driver.', 'Clase 8'],
    ['CAN se ve así en el osciloscopio', 'Recesivo 2.5 V; dominante 3.5 y 1.5 V.', 'Clase 9'],
    ['LIN: un cable y 12 V', 'Reposa cerca de batería; baja a < 20 % al transmitir.', 'Clase 9'],
    ['Secure Gateway: por qué no borra códigos', 'En FCA 2018+ necesitas herramienta registrada (AutoAuth).', 'Clase 9'],
    ['El error del silicón de ferretería', 'Resella con silicón neutro; el acético corroe la tarjeta.', 'Clase 10'],
    ['Precalienta o levantas pads', 'Las tarjetas automotrices roban calor: precalentador abajo.', 'Clase 10'],
    ['217 °C contra 183 °C', 'Sin plomo funde más alto: ajusta tu punta.', 'Clase 10'],
    ['Respalda dos veces', 'Dos lecturas idénticas o no hay respaldo.', 'Clase 11'],
    ['93C, 95 o 24C: no son iguales', 'Mismo SO-8, distinta asignación de terminales.', 'Clase 11'],
    ['P0633 en Chrysler', 'Clave secreta no transferida a la PCM: arranca y se apaga.', 'Clase 11'],
    ['Cuando NO debes tocar la memoria', 'Sin propiedad documentada, no hay servicio de datos.', 'Clase 11'],
    ['La prueba térmica que evita regresos', '30–60 min en banco con calor moderado antes de entregar.', 'Clase 12'],
    ['Garantía: lo que dice la ley', 'Mínimo 90 días por escrito (LFPC art. 77).', 'Clase 12'],
    ['Tres precios venden más que uno', 'Básico, recomendado y premium (ejemplo ilustrativo).', 'Clase 12'],
    ['Tu mejor cliente es el taller de enfrente', 'Ofrece recolección y reporte técnico a talleres aliados.', 'Clase 12'],
    ['El consumo de la fuente habla', '0 A, en límite o estable: tres diagnósticos sin escáner.', 'Clase 4'],
    ['Las 6 etapas de toda ECU', 'Alimentación, micro, memoria, entradas, salidas y red.', 'Clase 1']
  ],
  claseMuestra: [
    ['0–3', 'Bienvenida', 'Quién es el Prof. José Luis Orozco Cuautle y qué vas a poder hacer al terminar esta clase.'],
    ['3–10', 'El problema', 'Por qué se cambian computadoras sanas: falta de método; costo para el taller y el cliente.'],
    ['10–20', 'Enseñanza 1', 'Diagrama de bloques: las 6 etapas de toda ECU y cómo cada síntoma apunta a una etapa.'],
    ['20–30', 'Enseñanza 2 (demostración)', 'En vivo: caída de voltaje en tierras, referencia de 5 V y 60 Ω en CAN con equipo real.'],
    ['30–37', 'Enseñanza 3', 'El árbol de decisión "¿computadora o vehículo?" y la herramienta gratuita.'],
    ['37–42', 'Presentación del curso', 'Temario de 12 clases, sedes y fechas, bonos con valor de referencia, garantía de acompañamiento, precio total.'],
    ['42–45', 'Cierre y preguntas', 'Llamado único: escribe ECU por WhatsApp; bono Buen Fin vigente del 13 al 17 de noviembre (por confirmar).']
  ],
  secuenciaWA: [
    ['Día 0 · Bienvenida', 'Hola, [nombre]. Gracias por escribir ECU. Te comparto el temario completo y las sedes: León 27–28 nov y CDMX 16–17 dic. ¿Cuál te queda mejor?'],
    ['Día 1 · Valor', 'Te regalo el Árbol de diagnóstico ECU: [enlace]. Úsalo en tu próximo auto que "no arranca" y cuéntame qué semáforo te salió.'],
    ['Día 2 · Prueba', 'Esto es lo que vas a practicar en banco: encender una PCM, simular CKP/CMP y ver el pulso de inyectores. [video corto]. ¿Ya tienes fuente con límite de corriente?'],
    ['Día 3 · Oferta', 'La inversión es de $1,799 MXN (precio total) e incluye 12 clases, 18 h y 10 bonos. Del 13 al 17 de noviembre se agrega el Bono Buen Fin. ¿Te aparto lugar?'],
    ['Día 5 · Objeciones', 'Lo que más nos preguntan: ¿necesito saber electrónica? No, sólo usar el multímetro. ¿Qué llevo? Multímetro y lentes. ¿Hay pagos? Sí: transferencia, tienda o meses con tarjeta (por confirmar).'],
    ['Día 7 · Cierre', 'Último aviso para [sede]: el cupo depende de los bancos de práctica. Si quieres tu lugar, responde "APARTAR" y te mando los datos de pago.']
  ],
  lanzamiento: [
    ['Jue 5 nov 2026', 'Confirmar precio, enlace de pago y cupo; subir landing y lead magnet al dominio; etiquetas en WhatsApp Business.', 'Landing, lead magnet, WhatsApp'],
    ['Vie 6 nov', 'Publicar video 9:16 (dolor) y carrusel de 5 mediciones.', 'Reels, TikTok, Facebook, Estados'],
    ['Sáb 7 nov', 'Lanzar el Árbol de diagnóstico ECU (imágenes juego C) y mensaje de difusión.', 'Instagram, Facebook, listas de WhatsApp'],
    ['Lun 9 nov', 'Video 1:1 (dinero) e invitación a la clase muestra.', 'Facebook, Instagram, WhatsApp'],
    ['Mar 10 nov · 19:00', 'Clase muestra gratuita en vivo (45 min) "¿Es la computadora o es el auto?".', 'Zoom / Facebook Live'],
    ['Mié 11 nov', 'Repetición de la clase y mensajes 1–2 de la secuencia a asistentes.', 'WhatsApp'],
    ['Jue 12 nov', 'Video 16:9 en YouTube y anuncio del Bono Buen Fin.', 'YouTube, Facebook'],
    ['Vie 13 – Mar 17 nov', 'El Buen Fin: bono en lugar de descuento; anuncios juego A; mensajes 3–4.', 'Meta Ads, WhatsApp'],
    ['Lun 23 nov', 'Último aviso de inscripción León (mensaje 6).', 'WhatsApp, Estados'],
    ['Mié 25 nov', 'Confirmación logística León: dirección, horario y qué llevar.', 'WhatsApp'],
    ['Vie 27 – Sáb 28 nov', 'Curso en León (Manzer Escuela de Mecánica). Fotos y video con permiso.', 'Presencial'],
    ['Lun 30 nov', 'Abrir campaña CDMX con material real del curso de León (sin testimonios inventados).', 'Redes, WhatsApp'],
    ['Mié 2 dic · 19:00', 'Segunda clase muestra (enfoque CDMX).', 'Zoom / Facebook Live'],
    ['Lun 7 – Vie 11 dic', 'Temporada de aguinaldo: anuncios juego A con fecha de CDMX; facilidades de pago.', 'Meta Ads, WhatsApp'],
    ['Lun 14 dic', 'Último aviso de inscripción CDMX.', 'WhatsApp, Estados'],
    ['Mar 15 dic', 'Confirmación logística CDMX (World Trade Center).', 'WhatsApp'],
    ['Mié 16 – Jue 17 dic', 'Curso en Ciudad de México.', 'Presencial'],
    ['Desde el 18 dic', 'Seguimiento, venta adicional (asesoría 1 a 1) y fechas de sesión de dudas (por confirmar).', 'WhatsApp, correo']
  ],
  leadPromo: [
    ['Publicación 1', '¿Es la computadora o el vehículo? Te regalo el Árbol de diagnóstico ECU: 4 síntomas, 25 resultados, semáforo y pasos concretos. Gratis y sin registro. Escribe ECU por WhatsApp y te mando el enlace.'],
    ['Publicación 2', 'Pruébalo con el próximo auto que "no arranca": comunicación, RPM, inmovilizador y pulso de inyector, en ese orden. El árbol te dice cuándo NO es la ECU.'],
    ['Publicación 3', 'Reto: haz el árbol con un caso real y comparte tu semáforo. Verde = no era la computadora. ¿Cuántas veces te ha pasado?'],
    ['Publicación 4', 'P0641 con tres sensores fuera de rango: el árbol te lleva paso a paso a encontrar el sensor que jala la referencia.'],
    ['Publicación 5', '¿Tu escáner no comunica? El árbol revisa el DLC, la red CAN (60 Ω) y la alimentación antes de culpar a la computadora.'],
    ['Mensaje de difusión (WhatsApp)', 'Hola, [nombre]. Hicimos una herramienta gratuita para técnicos: el Árbol de diagnóstico ECU. En 10 minutos te dice si la falla es la computadora o el vehículo. Enlace: [enlace]. Si te sirve, compártela con un colega.'],
    ['Guion de video (25 s)', '(0–3) "¿Es la computadora o el vehículo?" (3–12) Muestra en pantalla el árbol: síntoma, mediciones y semáforo. (12–20) "Verde: no es la ECU. Amarillo: confírmalo en banco. Rojo: hay que repararla." (20–25) "Gratis y sin registro. Escribe ECU por WhatsApp."']
  ],
  checklist: ['Precio, enlace de pago y política de cancelación confirmados.', 'Número de WhatsApp Business con catálogo, mensaje de bienvenida y etiqueta "ECU".', 'Landing y lead magnet subidos al dominio con el bloque CONFIG completo.', 'Aviso de privacidad publicado y enlazado (LFPDPPP 2025).', 'Imagen og-imagen.jpg subida junto a index.html.', 'Videos y portadas revisados en celular sin sonido.', 'Píxel o etiqueta de conversión configurados (opcional).', 'Cupo por sede y lista de asistentes en hoja de control.', 'Material impreso: temario, formatos y examen.', 'Bancos de práctica probados con computadoras de práctica.'],
  metricas: [
    ['Alcance y reproducciones', 'Estadísticas de Meta/YouTube/TikTok', 'Por confirmar según presupuesto'],
    ['Retención a 3 s del video', 'Estadísticas de video', '≥ 30 % (referencia)'],
    ['Mensajes "ECU" recibidos', 'Etiqueta en WhatsApp Business', 'Por confirmar'],
    ['Usos del lead magnet', 'Mensajes con resultado o webhook', 'Por confirmar'],
    ['Asistentes a clase muestra', 'Registro de Zoom/Live', 'Por confirmar'],
    ['Inscripciones por sede', 'Hoja de control', 'Cupo de cada sede'],
    ['Costo por mensaje y por inscripción', 'Gasto en anuncios ÷ resultados', 'Por confirmar']
  ],
  cumplimiento: [
    'Sin promesas de ingresos: toda cifra de dinero va rotulada como ejemplo ilustrativo (políticas de Meta y LFPC art. 32).',
    'Sin aludir a atributos personales del público ("¿Eres mecánico y estás quebrado?" no se usa).',
    'Precio total visible (LFPC art. 7 Bis); valores de referencia aclarados como no precios anteriores.',
    'Testimonios sólo reales y con permiso; nunca inventados.',
    'Consentimiento para mensajes de WhatsApp y aviso de privacidad conforme a la LFPDPPP de 2025.',
    'Los sorteos promocionales requieren permiso de la Dirección General de Juegos y Sorteos (SEGOB); este lanzamiento no usa sorteos.',
    'Marcas de vehículos y herramientas sólo descriptivas; no se presentan como patrocinadores.',
    'Sin música con derechos de autor en los videos; foto del instructor propia.'
  ],
  // Prompts de IA para fotos realistas opcionales (una por imagen técnica)
  promptsIA: [
    ['Escena de banco de pruebas', 'Fotografía realista de un banco de pruebas de computadoras automotrices en un taller mexicano: PCM de aluminio abierta con tarjeta electrónica visible, fuente de laboratorio con display encendido, osciloscopio mostrando una onda cuadrada amarilla, cables con caimanes, tapete antiestático gris. Encuadre medio a 45°, iluminación de estudio suave con luz lateral cálida, profundidad de campo baja, estilo fotografía de producto industrial, fondo gris oscuro desenfocado, proporción 4:5, sin texto ni logotipos.'],
    ['Tarjeta de ECU en macro', 'Fotografía macro de una tarjeta electrónica de computadora automotriz: microcontrolador QFP, transistores de potencia D2PAK y capacitores, recubrimiento brillante, punta de cautín acercándose con un hilo de humo, luz rasante, colores neutros con acento amarillo. Proporción 1:1, sin texto ni logotipos, sin marcas visibles.'],
    ['Técnico midiendo con multímetro', 'Fotografía realista de manos de técnico con guantes midiendo con multímetro digital las terminales de un conector de computadora automotriz bajo el cofre, display legible, luz natural de taller, enfoque en las puntas, fondo de motor desenfocado. Proporción 9:16, sin texto ni logotipos, sin rostro.'],
    ['Pantalla de osciloscopio', 'Pantalla de osciloscopio de 4 canales en un taller mostrando el pulso de un inyector con pico inductivo, reflejos sutiles, luz baja, estilo fotografía tecnológica, proporción 16:9, sin texto ni logotipos.'],
    ['Semáforo de diagnóstico', 'Ilustración limpia y realista de un semáforo de inspección (rojo, amarillo, verde) sobre una computadora automotriz de aluminio en una mesa de trabajo gris, iluminación de estudio, proporción 4:5, sin texto ni logotipos.']
  ]
};
