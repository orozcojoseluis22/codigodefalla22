# Índice de entregables

**Diagnóstico Electrónico y Electricidad de Motocicletas para Mecánicos** · Prof. José Luis Orozco Cuautle · Electrónica y Servicio

| Carpeta | Contenido | Archivos |
|---|---|---|
| 00_Indice_de_entregables | Este índice (Word, PDF y Markdown). | 5 |
| 01_Investigacion | Investigación de mejores prácticas: 15 hallazgos, cambios recientes, 10 secciones con tablas, advertencias y 40 fuentes. | 2 |
| 02_Temario | Temario oficial: ficha del curso, para quién es, 8 logros, temario por módulo, bonos, valor, garantía, metodología e instructor. | 2 |
| 03_Clases | Manual del instructor (101 págs.) y 12 presentaciones .pptx editables con notas del orador. | 14 |
| 04_Bonos | 10 bonos: atlas de 17 diagramas (PDF, PNG, SVG), fichas técnicas, árboles, tabla de valores (PDF y Excel), calculadora Excel, formatos, prompts, 100 ideas, kit WhatsApp y plan 30/90. | 54 |
| 05_Plataforma | No aplica: el curso es técnico; GoHighLevel se sustituyó por bonos de uso inmediato (ver nota). | 1 |
| 06_Landing_Page | index.html autosuficiente para tu dominio + og-imagen.jpg. | 2 |
| 07_Lead_Magnet | index.html del Árbol de Diagnóstico Eléctrico + og-lead-magnet.jpg. | 2 |
| 08_Animaciones | 3 videos MP4 (9:16, 1:1, 16:9) con portada PNG y fuentes HTML. | 9 |
| 09_Imagenes_Publicitarias | 25 imágenes PNG/JPG (juegos A, B, C y D) + copys y prompts de IA. | 26 |
| 10_Evaluacion | Examen final en 2 versiones (alumno y con respuestas), Word y PDF. | 4 |
| 11_Copys_y_Lanzamiento | Textos de venta y lanzamiento: copys por plataforma, 30 guiones, clase muestra, secuencia WhatsApp, plan con fechas, checklist y métricas. | 2 |
| _codigo_fuente | Fuente única de datos (data/*.js) y generadores (build/). node build/build-all.js regenera todo. | 88 |

## Datos por confirmar

- Número de WhatsApp (52 + 10 dígitos) en el bloque CONFIG de la landing y del lead magnet.
- Enlace de pago (checkoutUrl) o datos de transferencia.
- Garantía doble (7 días después de la Clase 2 + acompañamiento): condiciones finales.
- Periodo de acceso a grabaciones (propuesto: 12 meses).
- Fechas y horario del grupo (propuesto: martes y jueves 8:00–9:30 p. m., inicio 12 de enero de 2027; cierre 8 de enero).
- Cupo por grupo (propuesto: 40) y Bono Buen Fin (13–17 nov 2026).
- Pago en 2 partes y meses sin intereses: disponibilidad y quién absorbe comisiones del procesador.
- Quién paga costos por uso (WhatsApp Business Platform por mensaje, publicidad, procesador de pago).
- Valores de referencia de los bonos (estimados) y constancia de participación.
- Funciones exactas del Sens-22 descritas en el material.
- URL final de la landing y del lead magnet (para Open Graph) y webhookUrl opcional.

## Cómo regenerar

```
cd _codigo_fuente && npm install && node build/build-all.js
```
