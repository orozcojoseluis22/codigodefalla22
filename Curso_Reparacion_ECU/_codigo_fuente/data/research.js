// FUENTE ÚNICA · Investigación de mejores prácticas (consulta: 5 de noviembre de 2026)
const F = {
  S1: ['Diag.net · "Some of the Ins and Outs of Chrysler PCMs" (foro de técnicos)', 'https://diag.net/discussion/sxkghunpfaell9tzehmy95lvcp'],
  S2: ['HP Tuners Forum · hilo sobre NGC4/NGC4A y GPEC', 'https://forum.hptuners.com/showthread.php?p=691810'],
  S3: ['For A-Bodies Only · "NGC or GPEC2?"', 'https://www.forabodiesonly.com/mopar/threads/ngc-or-gpec2.520191/'],
  S4: ['Jeep Gladiator Forum · GPEC2A y GPEC5', 'https://www.jeepgladiatorforum.com/forum/goto/post?id=1079682'],
  S5: ['Speeduino Wiki · decodificador Chrysler NGC (patrón de cigüeñal/árbol)', 'https://gitea.interbiznw.com/speeduino/wiki.js/blame/branch/master/decoders/ChryslerNGC.md'],
  S6: ['Nissan ECU Wiki (Miraheze) · ECM Nissan con Renesas SuperH', 'https://nissanecu.miraheze.org'],
  S7: ['Renesas · SH7059 (familia SH-2E para tren motriz)', 'https://www.renesas.com/en/products/sh7059'],
  S8: ['Hitachi · Comunicado SH7058F (2002), microcontrolador para control de tren motriz', 'https://www.hitachi.com/New/cnews/E/2002/0924/0924.pdf'],
  S9: ['Infineon · TLE4252D, seguidor de voltaje (voltage tracker) protegido', 'https://infineon.com/cms/en/product/power/linear-voltage-regulator/linear-voltage-regulators-for-automotive-applications/tle4252d/'],
  S10: ['Infineon · Hoja de datos TLE4252D rev. 1.41 (copia Mouser)', 'https://www.mouser.com/datasheet/2/196/Infineon_TLE4252D_DataSheet_v01_41_EN-1227723.pdf'],
  S11: ['Texas Instruments · SLOA101B "Introduction to the Controller Area Network (CAN)"', 'https://ti.com/lit/SLOA101'],
  S12: ['NXP · Hoja de datos TJA1042 (transceptor CAN de alta velocidad)', 'https://www.nxp.com/docs/en/data-sheet/TJA1042.pdf'],
  S13: ['NXP · Hoja de datos TJA1021 (transceptor LIN, ISO 17987 / SAE J2602)', 'https://www.nxp.com/docs/en/data-sheet/TJA1021.pdf'],
  S14: ['Microchip · "Bus Voltages and Levels" (LIN: recesivo > 60 %, dominante < 40 % de VSUP)', 'https://onlinedocs.microchip.com/oxy/GUID-FA73463A-EB90-493D-A558-196E2EA36553-en-US-1/GUID-08DAFCAB-235F-40D0-95EF-37C1EF0FD266.html'],
  S15: ['Texas Instruments · TLIN1021A-Q1 (niveles de salida LIN 0.2/0.8 VSUP)', 'https://www.ti.com/product/TLIN1021A-Q1'],
  S16: ['RepairPal · P0641 Sensor Reference Voltage "A" Circuit/Open', 'https://repairpal.com/obd-ii-code-p0641'],
  S17: ['Saab WIS · DTC P0641, P0651, P0697 (referencias de 5 V 1, 2 y 3)', 'https://saabwisonline.com/9-4x/2011/2-engine/engine-management-and-fuel-system-v6/fault-diagnosis-diagnostic-trouble-codes/dtc-p0641-p0651-p0697-or-p06a3-ecm-lfw'],
  S18: ['Manual de servicio Jeep Wrangler JK 2010 · P0652 Sensor Reference Voltage 2 Circuit Low', 'https://s3.amazonaws.com/jeepwranglerjk2010/7c033448.html'],
  S19: ['Expansión · ¿Cuándo es el Buen Fin 2026? (13 al 17 de noviembre)', 'https://expansion.mx/empresas/2026/10/07/cuando-es-el-buen-fin-2026-fechas'],
  S20: ['EY México · Nueva LFPDPPP (DOF 20 de marzo de 2025)', 'https://www.ey.com/es_mx/technical/tax/boletines-fiscales/nueva-ley-federal-proteccion-datos-personal-posesion-particulares'],
  S21: ['Hogan Lovells · Mexico’s new federal data protection law', 'https://www.hoganlovells.com/es/publications/mexicos-new-federal-data-protection-law-what-it-means-for-companies'],
  S22: ['IDC Online · Ajustes en el aviso de privacidad con la nueva ley', 'https://idconline.mx/corporativo/2025/03/31/ajustes-en-el-aviso-de-privacidad-con-la-ley-de-proteccion-de-datos'],
  S23: ['Ley Federal de Protección al Consumidor · Art. 77 (garantía mínima de 90 días)', 'https://mley.mx/LFPC/articulo/77/'],
  S24: ['Ley Federal de Protección al Consumidor · Art. 81 (reparación sin costo por falla imputable al reparador)', 'https://mley.mx/LFPC/articulo/81/'],
  S25: ['Orden Jurídico Nacional · Texto de la LFPC (arts. 7 Bis y 32)', 'https://www.ordenjuridico.gob.mx/Documentos/Federal/html/wo120869.html'],
  S26: ['Secretaría de Economía · NOM-174-SCFI-2007 (prestación de servicios en general)', 'https://platiica.economia.gob.mx/normalizacion/wp-content/uploads/sites/2/PDF_Normas_Publicas/174scfi2007.pdf'],
  S27: ['El Universal · Profeco sanciona talleres mecánicos (contratos de adhesión, catálogo de precios)', 'https://www.eluniversal.com.mx/articulo/cartera/negocios/2017/06/14/profeco-sanciona-197-talleres-mecanicos-por-practicas-abusivas/'],
  S28: ['Mercado Libre México · listados de reparación de ECU/ECM', 'https://listado.mercadolibre.com.mx/reparacion-ecu-ecm-computadoras-automotrices'],
  S29: ['Pymes.org.mx · Taller eléctrico automotriz (rangos orientativos de reprogramación de ECU)', 'https://pymes.org.mx/pyme/taller-electrico-automotriz-ac774383.html'],
  S30: ['SJM Automotriz · Curso ECU 2026 (referencias de cobro en USD de un competidor)', 'https://sjmautomotriz.com/producto/curso-ecu-2026/'],
  S31: ['SCS Coatings · Conformal Coating Removal Standards (IPC-7711/7721, procedimientos 2.3.1–2.3.6)', 'https://scscoatings.com/newsroom/blog/conformal-coating-removal-standards/'],
  S32: ['SCS Coatings · Removing Conformal Coatings', 'https://scscoatings.com/newsroom/blog/removing-conformal-coatings/'],
  S33: ['Desco · Preguntas y respuestas ESD (pulsera 1 MΩ, límites ANSI/ESD S20.20)', 'https://www.descoasia.com/QuestionsAndAnswers/ShowQuestion.aspx?i=1447'],
  S34: ['LCSC · Solder Melting Point Guide (SAC305 217–220 °C; Sn63Pb37 183 °C)', 'https://www.lcsc.com/blog/solder-melting-point-guide/'],
  S35: ['JLCPCB · Solder Melting Point Guide (temperaturas de punta)', 'https://jlcpcb.com/blog/solder-melting-point-guide'],
  S36: ['onsemi · ISL9V3040 EcoSPARK IGBT de encendido 300 mJ / 400 V', 'https://www.onsemi.com/download/data-sheet/pdf/isl9v3040-f085c-d.pdf'],
  S37: ['NXP · MC33810 Automotive Engine Control IC (4 drivers de inyector + 4 predrivers de encendido)', 'https://www.nxp.com/assets/block-diagram/en/MC33810.pdf'],
  S38: ['Infineon · TLE7209-3R puente H para control electrónico de mariposa', 'https://www.infineon.com/cms/en/product/power/motor-control-ics/intelligent-motor-control-ics/integrated-full-bridge-driver/tle7209-3r/'],
  S39: ['Littelfuse · Automotive Circuit Protection using TVS Diodes (nota de aplicación)', 'https://www.mouser.com/pdfdocs/Littelfuse_TVS_Diode_Automotive_Circuit_Protection_Using_Automotive_TVS_Diodes_Application_Notepdf.pdf'],
  S40: ['Analog Devices · Load-Dump Protection (ISO 7637-2 pulso 5 → ISO 16750-2 pruebas A/B)', 'https://www.analog.com/en/resources/technical-articles/loaddump-protection-for-24v-automotive-applications.html'],
  S41: ['UpFix · What causes an ECU/ECM to fail?', 'https://info.upfix.com/kb/what-causes-an-ecu/ecm-to-fail'],
  S42: ['Diag.net · Chrysler P0633 (clave secreta no almacenada en la PCM)', 'https://diag.net/discussion/shajshjk9agpeaxohteywlnhfg'],
  S43: ['Diag.net · PCM de reemplazo Chrysler que arranca y se apaga', 'https://diag.net/discussion/shkaknnztxpnefu5akybn2dmz7'],
  S44: ['Underhood Service · Nissan ECM Replacement Service Procedure', 'https://www.underhoodservice.com/?p=41625'],
  S45: ['Automotive Tech Info · An Introduction to Nissan Anti-Theft Systems (PDF)', 'https://automotivetechinfo.com/wp-content/uploads/2009/12/An-Introduction-to-Nissan-Anti-Theft-Systems.pdf'],
  S46: ['OBDtester · Conector OBD-II SAE J1962 (pinout)', 'https://obdtester.com/obd2_connector'],
  S47: ['ALLDATA · FCA Secure Gateway (2018 y posteriores; AutoAuth)', 'https://www.alldata.com/mx/en/support/diagnostics/article/fca-secure-gateway'],
  S48: ['Repairer Driven News · CIC explica el SGW de FCA (2020)', 'https://www.repairerdrivennews.com/2020/01/20/cic-emerging-tech-head-explains-fca-sgw-says-other-oem-firewalls-coming/'],
  S49: ['RomRaider Forum · lectura de EEPROM de ECU con CH341A (respaldo previo)', 'https://mailserver.romraider.com/forum/viewtopic.php?p=170737'],
  S50: ['Mercado Libre México · Programador CH341A (precios)', 'https://listado.mercadolibre.com.mx/ch341a-programador'],
  S51: ['UElectronics · Programador CH341A ($134 MXN)', 'https://uelectronics.com/producto/programador-de-bios-eeprom-serie-24-25-ch341a-usb/'],
  S52: ['Walmart México · Fuente de laboratorio NICE-POWER 30 V 10 A ($2,668 MXN)', 'https://www.walmart.com.mx/ip/nice-power-30v-10a-fuente-de-alimentacion-regulable-laboratorio-300w-interfaz-usb-de-5v-2a-pantalla-led-de-4-bits/00076835111075'],
  S53: ['LCSC · Hantek 6022BE (2 canales, 20 MHz, 48 MS/s)', 'https://lcsc.com/product-detail/oscilloscope_Hantek-6022BE_C5139836.html'],
  S54: ['SEMARNAT · NOM-161-SEMARNAT-2011 (residuos de manejo especial)', 'https://www.gob.mx/cms/uploads/attachment/file/134113/20.-_NORMA_OFICIAL_MEXICANA_NOM-161-SEMARNAT-2011.pdf'],
  S55: ['Meta · Normas publicitarias: atributos personales', 'https://transparency.meta.com/policies/ad-standards/objectionable-content/personal-attributes'],
  S56: ['Universidad Politécnica Salesiana · Tesis sobre el banco de comprobación de sensores Sens-22 Plus', 'https://dspace.ups.edu.ec/handle/123456789/29711?mode=full'],
  S57: ['EEVblog Forum · identificación de componentes SMD por código', 'https://www.eevblog.com/forum/chat/identifying-smd-by-code/msg2789386'],
  S58: ['Speeduino · Ardu-Stim (generador de señales CKP/CMP de código abierto)', 'https://github.com/speeduino/Ardu-Stim'],
  S59: ['Acquisition.com · Libros de Alex Hormozi ($100M Offers, $100M Leads, $100M Money Models)', 'https://www.acquisition.com/books'],
  S60: ['Influence at Work · Principios de persuasión de Robert Cialdini', 'https://www.influenceatwork.com/7-principles-of-persuasion/'],
  S61: ['NOAA/NWS · Cálculo de presión según altitud (atmósfera estándar)', 'https://www.weather.gov/media/epz/wxcalc/pressureAltitude.pdf'],
  S62: ['Ley Federal del Trabajo · Art. 87 (aguinaldo antes del 20 de diciembre)', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf'],
  S63: ['SEGOB · Dirección General de Juegos y Sorteos (permisos de sorteos)', 'https://www.juegosysorteos.gob.mx'],
  S64: ['Microchip · 93LC66B EEPROM Microwire (asignación de terminales)', 'https://www.microchip.com/en-us/product/93LC66B'],
  S65: ['Microchip · 25LC320A EEPROM SPI (asignación de terminales equivalente a la serie 95xxx)', 'https://www.microchip.com/en-us/product/25LC320A'],
  S66: ['Microchip · 24LC256 EEPROM I²C (asignación de terminales)', 'https://www.microchip.com/en-us/product/24LC256']
};

module.exports = {
  fuentes: F,
  resumen: [
    ['No todas las PCM Chrysler son iguales', 'Las generaciones JTEC, NGC (1 a 4), GPEC, GPEC2/2A/3 y GPEC5 cambian procesador, conectores y asignación de terminales; no son intercambiables. Se identifican por número de conectores y forma física, no sólo por número de parte.', ['S1', 'S2', 'S3', 'S4']],
    ['La memoria de programa de los Nissan está dentro del micro', 'Las ECM Nissan de aprox. 2001–2010 usan microcontroladores Renesas/Hitachi SuperH (SH7055/SH7058, núcleo SH-2E) con flash interna; no hay un chip de flash externo que reemplazar: se respalda y programa por puerto o por OBD.', ['S6', 'S7', 'S8']],
    ['La referencia de 5 V aguanta cortos… pero no para siempre', 'Los seguidores de voltaje para sensores (tipo TLE4252) están protegidos contra corto a tierra y a batería, pero el fabricante aclara que la protección no está diseñada para operación repetitiva continua: cortos repetidos en sensores terminan dañando la etapa.', ['S9', 'S10']],
    ['P0641/P0651/P0697 casi nunca empiezan en la ECU', 'Cada referencia de 5 V alimenta varios sensores; un sensor o arnés en corto "jala" toda la línea. El procedimiento de servicio es desconectar sensor por sensor hasta que la referencia regrese a ~5 V (ventana típica 4.5–5.5 V o 4.75–5.25 V según fabricante).', ['S16', 'S17', 'S18']],
    ['CAN se diagnostica con dos números: 60 Ω y 2.5 V', 'Bus CAN de alta velocidad: en reposo (recesivo) ambas líneas ≈ 2.5 V; en dominante CAN-H ≈ 3.5–3.6 V y CAN-L ≈ 1.4–1.5 V. Dos terminaciones de 120 Ω en paralelo dan ≈ 60 Ω entre pines 6 y 14 del DLC con batería desconectada.', ['S11', 'S12', 'S46']],
    ['LIN es un solo cable referido a batería', 'LIN (ISO 17987) en reposo está cerca del voltaje de batería; el transmisor dominante baja a menos de 0.2·VSUP y el receptor decide con umbrales de 40 % y 60 % de VSUP.', ['S13', 'S14', 'S15']],
    ['Desde 2018 el Secure Gateway de FCA limita la validación', 'En la mayoría de los vehículos FCA 2018 y posteriores se puede leer sin registro, pero borrar códigos y hacer pruebas de actuadores requiere una herramienta registrada en AutoAuth. Esto cambia cómo se valida una PCM reparada en Jeep, Dodge, Chrysler y RAM recientes.', ['S47', 'S48']],
    ['Reparar es mejor negocio que reemplazar porque se conserva la identidad', 'Al sustituir una PCM Chrysler hay que transferir VIN y clave secreta con PIN (si falla aparece P0633). En Nissan depende de si el NATS/NVIS está basado en ECM o en BCM, y en modelos recientes hay pasos adicionales con CONSULT. Reparar la ECU original evita gran parte de ese trabajo.', ['S42', 'S43', 'S44', 'S45']],
    ['Si no se corrige la causa raíz, la ECU regresa', 'Las causas más citadas de daño son picos por arranque con cables (incluso invertidos), entrada de agua y bobinas o inyectores en corto. Una ECU reparada que se instala sin corregir el actuador o el arnés se vuelve a dañar.', ['S41']],
    ['Los diodos TVS de entrada son fusibles de sacrificio', 'El "load dump" (antes ISO 7637-2 pulso 5a/5b, hoy ISO 16750-2 pruebas A y B) entrega mucha energía; el TVS de entrada la absorbe hasta su límite. Un TVS en corto es una de las primeras cosas que se revisan en una ECU "muerta".', ['S39', 'S40']],
    ['Los drivers tienen energía de "clamp" limitada', 'Un IGBT de encendido como el ISL9V3040 está autoprotegido (≈ 400 V, 300 mJ) y un IC como el MC33810 limita la energía de clamp de inyector (≈ 100 mJ). Un actuador en corto o un circuito abierto sobrecarga el driver: por eso se mide el actuador antes de entregar.', ['S36', 'S37']],
    ['El cuerpo de aceleración usa un puente H protegido', 'Drivers tipo TLE7209 (5 A continuos, 5–28 V) apagan sus salidas en tercer estado al detectar corto o sobretemperatura; un motor de mariposa trabado o con carbón puede generar códigos de "driver" sin que la ECU esté dañada.', ['S38']],
    ['Soldadura sin plomo exige más temperatura y más cuidado', 'SAC305 funde a 217–220 °C contra 183 °C del Sn63Pb37; las guías sugieren punta de 370–400 °C para sin plomo. El retiro de recubrimientos se hace según IPC-7711/7721 (procedimientos 2.3.1 a 2.3.6) y el método depende del tipo de recubrimiento.', ['S31', 'S32', 'S34', 'S35']],
    ['La garantía mínima legal en México es de 90 días', 'La LFPC fija una garantía no menor a 90 días (art. 77) y obliga a reparar sin costo si la falla es imputable al reparador (art. 81). La NOM-174-SCFI-2007 pide catálogo de precios visible y contrato de adhesión registrado. La nueva LFPDPPP (DOF 20/03/2025) cambió el aviso de privacidad.', ['S20', 'S23', 'S24', 'S26', 'S27']],
    ['No hay tarifa oficial de reparación de ECU: hay que construir la propia', 'Las referencias públicas son dispersas: reprogramación o actualización de ECU de $1,500 a $6,500 MXN (orientativo) y, en un curso competidor, diagnóstico de 30–60 USD y reparación de drivers de 80–150 USD. Se usan sólo como ejemplo ilustrativo para armar el menú de precios.', ['S28', 'S29', 'S30']]
  ],
  cambios: [
    ['20 mar 2025', 'Se publica la nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares; abroga la de 2010 y las funciones del INAI pasan a la Secretaría Anticorrupción y Buen Gobierno.', 'Actualiza el aviso de privacidad de tu orden de servicio y de tus formularios/WhatsApp; pide consentimiento para mensajes promocionales.', ['S20', 'S21', 'S22']],
    ['14 nov 2025', 'Reforma a la LFPDPPP para armonizarla con el Código Nacional de Procedimientos Civiles (según fuente secundaria).', 'Sin cambio operativo directo identificado; verificar texto vigente antes de redactar avisos.', ['S20']],
    ['2025', 'Nissan (boletín NTB25-013, según fuente secundaria): en modelos recientes con arranque remoto, el reemplazo de ECM requiere secuencia en BCM, registro de VIN y escritura de clave MAC con CONSULT.', 'Cambiar una ECM Nissan nueva es cada vez más complejo; reparar la original gana valor.', ['S44']],
    ['5 may 2026', 'Meta actualiza su documento de Normas Publicitarias (cambios editoriales, según fuente secundaria).', 'Mantener anuncios sin promesas de ingresos ni alusiones a atributos personales.', ['S55']],
    ['13–17 nov 2026', 'El Buen Fin 2026 dura 5 días y cambia a viernes–martes (fuentes periodísticas; confirmar en elbuenfin.org).', 'Fecha comercial más cercana para el lanzamiento: usar bono en lugar de descuento.', ['S19']],
    ['2018 → hoy', 'Secure Gateway de FCA en la mayoría de los modelos 2018+: borrado de códigos y pruebas activas sólo con herramienta registrada (AutoAuth).', 'Registrar el escáner (Autel/Launch según soporte) antes de validar PCM de Jeep/Dodge/RAM recientes.', ['S47', 'S48']]
  ],
  secciones: [
    { titulo: '1. Estado actual de la tecnología de las computadoras automotrices', parrafos: [
      'Una computadora de motor (ECU, ECM o PCM) se compone siempre de las mismas etapas: protección y filtrado de la alimentación, reguladores (5 V para el microcontrolador y una o más referencias de 5 V para sensores), el microcontrolador con su memoria, las etapas de entrada que acondicionan las señales de los sensores, las etapas de salida o drivers que conmutan inyectores, bobinas, relevadores y motores, y los transceptores de red (CAN, LIN y, en modelos antiguos, J1850/SCI o línea K). Entender esta arquitectura permite diagnosticar cualquier marca.',
      'En Chrysler/Dodge/Jeep conviven en el parque vehicular mexicano varias generaciones: JTEC (aprox. 1996–2004), NGC (aprox. 2003–2010, con versiones NGC1 a NGC4/4A), GPEC/GPEC2 (Continental/Siemens, aprox. 2008–2011 en adelante), GPEC2A/GPEC3 en modelos con herencia FIAT y GPEC5 a partir de 2021 en algunos Jeep. Las fuentes son mayormente foros técnicos, por lo que los rangos de años son aproximados.',
      'En Nissan, la comunidad de ingeniería inversa documenta ECM basadas en microcontroladores Renesas/Hitachi SuperH (SH7051/SH7054/SH7055/SH7058) en vehículos de aprox. 2001–2010, con memoria flash interna; los modelos posteriores usan microcontroladores Renesas más recientes. Nissan suele usar bobinas con transistor de potencia integrado (la ECM envía sólo una señal lógica) y relevador de ECM controlado por la propia ECM.'
    ], tabla: { titulo: 'Comparativo de generaciones (aproximado; confirmar por conector y número de parte)', cols: ['Familia', 'Años aprox.', 'Identificación física', 'Notas para reparación'], filas: [
      ['Chrysler JTEC', '1996–2004', '3 conectores; rueda fónica de 16 dientes (según foro)', 'Comunicación SCI/J1850 PCI; sensores Hall con alimentación de 8 V en varios motores'],
      ['Chrysler NGC 1–4', '2003–2010', '4 conectores; rueda fónica de 32 dientes (según foro)', 'Patrón de cigüeñal/árbol "NGC" documentado en proyectos abiertos (Speeduino)'],
      ['Chrysler GPEC / GPEC2', '2008–2011 en adelante', 'Carcasa Continental/Siemens; GPEC2 de 2011+', 'Requiere programación en línea; SGW en 2018+'],
      ['Chrysler GPEC2A / GPEC3 / GPEC5', 'Modelos FIAT-Chrysler recientes', 'GPEC2A: carcasa mayor, conectores crema y gris', 'GPEC5 reemplazó a GPEC2A en algunos Jeep desde finales de 2021'],
      ['Nissan (Hitachi/Renesas SH705x)', '2001–2010 aprox.', 'Carcasa metálica; micro SH7055/SH7058', 'Flash interna; NATS basado en ECM o BCM según modelo']
    ] }, fuentes: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] },
    { titulo: '2. Valores de referencia verificados y típicos', parrafos: [
      'Los valores siguientes se usan en todo el curso. Los marcados como "típico" son valores de taller que deben confirmarse con el manual del fabricante del vehículo; los marcados con fuente provienen de hojas de datos o normas.',
      'Dato local importante: la presión barométrica baja con la altitud. Según la atmósfera estándar (NOAA), a 1,815 m (León) es ≈ 81 kPa y a 2,240 m (CDMX) ≈ 77 kPa, contra 101.3 kPa a nivel del mar. Por eso el voltaje del sensor MAP con motor apagado en el Bajío y el Valle de México es menor que el que muestran muchas tablas estadounidenses.'
    ], tabla: { titulo: 'Tabla de valores de referencia', cols: ['Medición', 'Valor', 'Condición', 'Fuente / estatus'], filas: [
      ['Resistencia CAN pines 6–14 (DLC)', '≈ 60 Ω', 'Batería desconectada; 2 terminaciones de 120 Ω', 'TI SLOA101, NXP TJA1042'],
      ['CAN recesivo', '≈ 2.5 V en CAN-H y CAN-L', 'Bus en reposo', 'NXP TJA1042 (0.5·VCC)'],
      ['CAN dominante', 'CAN-H ≈ 3.5–3.6 V / CAN-L ≈ 1.4–1.5 V', 'Carga 50–65 Ω', 'NXP TJA1042 (típico)'],
      ['LIN recesivo / dominante', '≥ 0.8·VSUP / ≤ 0.2·VSUP (transmisor)', '7–18 V', 'TI TLIN1021A-Q1; Microchip'],
      ['Referencia de sensores', '5.0 V (ventana 4.5–5.5 V o 4.75–5.25 V)', 'KOEO, en el conector del sensor', 'Manuales de servicio (varía por fabricante)'],
      ['Caída de voltaje en tierra de ECU', '< 0.1 V', 'Con carga (arranque o motor en marcha)', 'Típico; verificar con el manual del fabricante'],
      ['Caída en alimentación de ECU', '< 0.3 V', 'Con carga', 'Típico; verificar con el manual del fabricante'],
      ['Inyector alta impedancia', '≈ 11–18 Ω', '20 °C', 'Típico; verificar con el manual del fabricante'],
      ['Primario de bobina (sin igniter integrado)', '≈ 0.4–1.5 Ω', '20 °C', 'Típico; verificar con el manual del fabricante'],
      ['Pico inductivo de inyector', '≈ 35–80 V según el clamp del driver', 'Osciloscopio en lado de control', 'Típico; comparar contra un vehículo bueno'],
      ['Clamp de IGBT de encendido', '≈ 400 V (colector)', 'ISL9V3040', 'onsemi'],
      ['Soldadura SAC305 / Sn63Pb37', '217–220 °C / 183 °C', 'Punto de fusión', 'LCSC, Chip Quik'],
      ['Punta de cautín sin plomo', '370–400 °C', 'Ajustar por masa térmica', 'LCSC, JLCPCB (orientativo)'],
      ['Pulsera antiestática', '1 MΩ (resistor de la pulsera); sistema < 35 MΩ', 'ANSI/ESD S20.20', 'Desco (fuente de fabricante)'],
      ['Presión barométrica', '≈ 101 / 81 / 77 kPa', 'Nivel del mar / León / CDMX', 'NOAA (cálculo de atmósfera estándar)']
    ] }, fuentes: ['S9', 'S10', 'S11', 'S12', 'S14', 'S15', 'S16', 'S17', 'S33', 'S34', 'S35', 'S36', 'S61'] },
    { titulo: '3. Errores comunes que el curso corrige', parrafos: [
      '1) Condenar la ECU sin medir alimentaciones y tierras con caída de voltaje bajo carga. 2) Cambiar la ECU sin corregir la bobina, inyector o arnés que la dañó. 3) Medir la referencia de 5 V sólo en la ECU y no en el sensor, o no aislar sensor por sensor. 4) Energizar en banco sin límite de corriente. 5) Soldar sin protección ESD ni respaldo de la EEPROM. 6) Usar silicón acético para resellar (el ácido corroe la tarjeta). 7) Validar sólo "que arranca" sin pruebas de actuadores, datos en vivo y prueba térmica. 8) Olvidar el inmovilizador y el Secure Gateway al entregar.'
    ], fuentes: ['S16', 'S18', 'S41', 'S47'] },
    { titulo: '4. Normas, reglamentos y políticas aplicables (México)', parrafos: [
      'Protección al consumidor: la LFPC exige informar el precio total (art. 7 Bis), prohíbe la publicidad engañosa (art. 32), fija la garantía mínima de 90 días (art. 77) y obliga a reparar sin costo si la falla es imputable al reparador dentro de 90 días (art. 81). La NOM-174-SCFI-2007 regula la información en la prestación de servicios: catálogo o lista de precios visible y contrato de adhesión registrado ante Profeco; Profeco ha sancionado talleres por incumplirlos.',
      'Datos personales: la nueva LFPDPPP (DOF 20 de marzo de 2025) mantiene la obligación del aviso de privacidad, modifica sus requisitos (art. 15) y exige pedir nuevo consentimiento si se usan los datos para otra finalidad. Esto aplica a la orden de servicio (nombre, teléfono, VIN, placas) y a los mensajes de WhatsApp promocionales.',
      'Medio ambiente y seguridad: las tarjetas y módulos electrónicos de desecho son residuos de manejo especial (NOM-161-SEMARNAT-2011); deben entregarse a un gestor autorizado. En soldadura use extracción de humos y EPP. Publicidad: Meta prohíbe afirmar o insinuar atributos personales y restringe promesas de ingresos; los sorteos promocionales requieren permiso de la Dirección General de Juegos y Sorteos (SEGOB). Inmovilizadores y emisiones: el curso no enseña a anular inmovilizadores ni sistemas de control de emisiones; los procedimientos de datos de inmovilizador se hacen sólo con propiedad documentada del vehículo.'
    ], fuentes: ['S20', 'S21', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S54', 'S55', 'S63'] },
    { titulo: '5. Herramientas y precios en México (consulta 5 nov 2026)', parrafos: [
      'Precios observados en tiendas en línea el día de la consulta; cambian con frecuencia. Donde no se encontró precio en pesos se indica "estimado, no verificado".'
    ], tabla: { titulo: 'Equipo para un banco de reparación de ECU', cols: ['Equipo', 'Precio observado', 'Fuente', 'Estatus'], filas: [
      ['Programador CH341A básico', '$110–$136 MXN', 'Mercado Libre / UElectronics', 'Verificado'],
      ['Kit CH341A con pinza SOIC-8 y adaptador 1.8 V', '$289–$499 MXN', 'Mercado Libre', 'Verificado'],
      ['Fuente de laboratorio 30 V 10 A', '$2,668 MXN', 'Walmart México (NICE-POWER)', 'Verificado'],
      ['Osciloscopio USB Hantek 6022BE', '≈ 54 USD (LCSC) / 61 EUR', 'LCSC / SainSmart', 'Precio en MXN no verificado'],
      ['Estación 2 en 1 aire caliente + cautín (tipo 8786D)', '$1,200–$2,500 MXN', '—', 'Estimado, no verificado'],
      ['Microscopio digital USB o con pantalla', '$600–$2,500 MXN', '—', 'Estimado, no verificado'],
      ['Registro AutoAuth (FCA SGW)', '≈ 50 USD/año', 'Fuente secundaria', 'Verificar en autoauth.com']
    ] }, fuentes: ['S50', 'S51', 'S52', 'S53', 'S47'] },
    { titulo: '6. Mercado: cuánto se cobra y qué se puede vender', parrafos: [
      'No existe un tarifario oficial. Un directorio de talleres eléctricos reporta $1,500–$6,500 MXN por reprogramación o actualización de ECU (más alto en CDMX, Monterrey y Guadalajara). Un curso competidor reporta referencias de 30–60 USD por diagnóstico de ECU, 80–150 USD por reparación de drivers de inyección y 120–300 USD por reparación de TCM. Mercado Libre muestra desde refacciones hasta servicios, por lo que no sirve como cotización. Todas estas cifras se usan en el curso sólo como ejemplo ilustrativo.',
      'Servicios complementarios con demanda: diagnóstico electrónico en banco, reparación de etapa de alimentación y referencia de 5 V, reparación de drivers, respaldo/transferencia de datos con propiedad documentada, revisión de arnés y conectores, prueba de actuadores, venta de sensores y actuadores para corregir la causa raíz, y servicio a otros talleres (maquila) con recolección.'
    ], fuentes: ['S28', 'S29', 'S30'] },
    { titulo: '7. Estrategias de venta aplicadas al oficio', parrafos: [
      'Alex Hormozi ($100M Offers): valor = (resultado soñado × probabilidad percibida) ÷ (tiempo de espera × esfuerzo); Oferta Gran Slam con bonos que eliminan obstáculos, garantía y escasez/urgencia reales. $100M Leads: los "Core Four" (contacto en frío, contenido gratuito, publicidad pagada en frío y pagada a contenidos) e imanes de clientes que revelan un problema, entregan una muestra o resuelven un paso. $100M Money Models: oferta de atracción, venta adicional, opción accesible y continuidad.',
      'Jay Abraham: sólo hay tres formas de crecer: más clientes, mayor ticket promedio y más frecuencia de compra. Cialdini: reciprocidad, compromiso y coherencia, prueba social, autoridad, simpatía, escasez y unidad. Tropicalización: WhatsApp como canal principal, Google Maps para búsqueda local, pagos sin tarjeta (transferencia, OXXO) y meses sin intereses para tarjetas de crédito.'
    ], fuentes: ['S59', 'S60'] },
    { titulo: '8. Inteligencia artificial útil para el reparador de ECU', parrafos: [
      'Asistentes de texto e imagen disponibles en México (ChatGPT, Gemini, Claude, Copilot) sirven para: traducir y resumir hojas de datos, explicar un diagrama de bloques, sugerir qué componente podría ser por su encapsulado y marcado (siempre verificar con bases de códigos SMD y la hoja de datos), calcular divisores y disipación, armar listas de verificación y redactar mensajes y cotizaciones. La IA no sustituye la medición: toda sugerencia se confirma con multímetro u osciloscopio.',
      'Advertencia: los códigos de marcado SMD varían por fabricante y la identificación por código es de "prueba y error" según técnicos experimentados; use microscopio y bases de datos especializadas.'
    ], fuentes: ['S57'] },
    { titulo: '9. Calendario comercial cercano', parrafos: [
      'El Buen Fin 2026: 13 al 17 de noviembre (confirmar en elbuenfin.org). Curso en León: 27 y 28 de noviembre. Aguinaldo: debe pagarse antes del 20 de diciembre (LFT art. 87), lo que favorece las inscripciones de la sede CDMX (16 y 17 de diciembre). Después: cuesta de enero (ofrecer pagos en partes) y temporada de lluvias (más ECU dañadas por agua de junio a octubre).'
    ], fuentes: ['S19', 'S62'] }
  ],
  advertencias: [
    'Varias fuentes técnicas sobre generaciones de PCM Chrysler son foros de técnicos; los rangos de años son aproximados.',
    'Los valores marcados como "típico" deben confirmarse con el manual del fabricante del vehículo específico.',
    'Las cifras de mercado (precios de reparación) son orientativas y se presentan como ejemplo ilustrativo; investigue su plaza.',
    'Algunos precios de equipo no pudieron verificarse en pesos el día de la consulta y se indican como estimados.',
    'Las fechas del Buen Fin 2026 provienen de medios; confirmar en el sitio oficial.',
    'El documento no constituye asesoría legal; verifique los textos vigentes de LFPC, NOM-174-SCFI-2007 y LFPDPPP en fuentes oficiales.'
  ]
};
