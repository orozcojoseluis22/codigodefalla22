# Genera la calculadora y la tabla de valores en Excel con fórmulas reales (openpyxl)
import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.comments import Comment
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
cfg = json.load(open(os.path.join(SRC, "dist/curso.json")))["cfg"]
bj = json.load(open(os.path.join(SRC, "dist/bonos.json")))
F = "Arial"
H = PatternFill("solid", fgColor="2B3036"); Y = PatternFill("solid", fgColor="FFF2A8"); G = PatternFill("solid", fgColor="EEF0F2"); OK = PatternFill("solid", fgColor="E3F6E6")
th = Side(style="thin", color="C9CED4"); BOX = Border(top=th, bottom=th, left=th, right=th)
MX = '"$"#,##0;("$"#,##0);"-"'; MX2 = '"$"#,##0.00;("$"#,##0.00);"-"'; PCT = '0.0%;(0.0%);"-"'; NUM = '#,##0.0;(#,##0.0);"-"'; INT = '#,##0;(#,##0);"-"'
def title(ws, t, sub):
    ws["A1"] = t; ws["A1"].font = Font(name=F, size=16, bold=True, color="1E2227")
    ws["A2"] = sub; ws["A2"].font = Font(name=F, size=10, italic=True, color="5B636B")
def head(ws, row, cols):
    for i, c in enumerate(cols, 1):
        x = ws.cell(row=row, column=i, value=c); x.font = Font(name=F, bold=True, color="FFFFFF"); x.fill = H; x.alignment = Alignment(wrap_text=True, vertical="center"); x.border = BOX
def inp(c, v, fmt=None):
    c.value = v; c.font = Font(name=F, color="0000FF", bold=True); c.fill = Y; c.border = BOX
    if fmt: c.number_format = fmt
def fx(c, f, fmt=None, bold=False, fill=None):
    c.value = f; c.font = Font(name=F, color="000000", bold=bold); c.border = BOX
    if fmt: c.number_format = fmt
    if fill: c.fill = fill
def lab(c, t, bold=False):
    c.value = t; c.font = Font(name=F, bold=bold); c.border = BOX; c.alignment = Alignment(wrap_text=True, vertical="center")
def link(c, f, fmt=None, bold=False):
    c.value = f; c.font = Font(name=F, color="008000", bold=bold); c.border = BOX
    if fmt: c.number_format = fmt

wb = Workbook()
# Instrucciones
ws = wb.active; ws.title = "Instrucciones"
title(ws, "Calculadora de precios y recuperación", f"{cfg['titulo']} · {cfg['instructor']['nombre']} · {cfg['instructor']['empresa']}")
rows = [("Cómo usarla", ""), ("1", "Escribe tus datos SOLO en las celdas amarillas con número azul."), ("2", "Las celdas con texto negro son fórmulas: no las borres."), ("3", "Las celdas con texto verde traen datos de otra hoja."),
        ("4", "Todas las cifras que vienen escritas son un EJEMPLO ILUSTRATIVO para mostrar el formato; cámbialas por las de tu taller."), ("5", "Orden sugerido: 1_Costo_por_hora → 2_Precios → 3_Menu_3_opciones → 4_Recuperacion → 5_Metricas."),
        ("Aviso", cfg["avisoEjemplos"])]
for i, (a, b) in enumerate(rows, 4):
    ws.cell(row=i, column=1, value=a).font = Font(name=F, bold=True); ws.cell(row=i, column=2, value=b).font = Font(name=F)
ws.cell(row=12, column=1, value="Leyenda").font = Font(name=F, bold=True)
inp(ws["A13"], 123); ws["B13"] = "Dato que tú capturas"; fx(ws["A14"], "=A13*2"); ws["B14"] = "Fórmula (no editar)"; link(ws["A15"], "=A13"); ws["B15"] = "Dato traído de otra hoja"
ws.column_dimensions["A"].width = 14; ws.column_dimensions["B"].width = 110

# 1 Costo por hora
ws = wb.create_sheet("1_Costo_por_hora"); title(ws, "1. Tu costo real por hora", "Ejemplo ilustrativo: reemplaza las celdas amarillas con tus datos mensuales (MXN).")
head(ws, 4, ["Concepto mensual", "Monto (MXN)"])
gastos = [("Renta del local", 8000), ("Luz", 1200), ("Internet y teléfono", 600), ("Consumibles (estaño, termocontráctil, limpiador, terminales)", 800), ("Tu sueldo deseado", 16000), ("Sueldo de ayudantes", 9000), ("Reposición y compra de herramienta", 1500), ("Otros (publicidad, contabilidad, comisiones)", 900)]
for i, (a, v) in enumerate(gastos, 5):
    lab(ws.cell(row=i, column=1), a); inp(ws.cell(row=i, column=2), v, MX)
r = 5 + len(gastos)  # 13
lab(ws.cell(row=r, column=1), "Total de gastos del mes", True); fx(ws.cell(row=r, column=2), f"=SUM(B5:B{r-1})", MX, True, G)
lab(ws.cell(row=r+2, column=1), "Horas que el taller abre al mes"); inp(ws.cell(row=r+2, column=2), 208, INT)
lab(ws.cell(row=r+3, column=1), "% de horas que realmente cobras"); inp(ws.cell(row=r+3, column=2), 0.55, PCT)
lab(ws.cell(row=r+4, column=1), "Horas cobrables al mes"); fx(ws.cell(row=r+4, column=2), f"=B{r+2}*B{r+3}", NUM)
lab(ws.cell(row=r+5, column=1), "COSTO POR HORA (mínimo para no perder)", True); fx(ws.cell(row=r+5, column=2), f"=IFERROR(B{r}/B{r+4},0)", MX2, True, OK)
lab(ws.cell(row=r+7, column=1), "Margen deseado sobre tu costo"); inp(ws.cell(row=r+7, column=2), 0.25, PCT)
lab(ws.cell(row=r+8, column=1), "TARIFA POR HORA (lo que cobras)", True); fx(ws.cell(row=r+8, column=2), f"=B{r+5}*(1+B{r+7})", MX2, True, OK)
ws.cell(row=r+5, column=2).comment = Comment("Total mensual ÷ horas cobrables. Si cobras menos que esto por hora, pierdes dinero.", "Electrónica y Servicio")
ws.column_dimensions["A"].width = 58; ws.column_dimensions["B"].width = 18
TARIFA = f"'1_Costo_por_hora'!$B${r+8}"

# 2 Precios
ws = wb.create_sheet("2_Precios"); title(ws, "2. Precio por tiempo estándar", "Precio = tiempo estándar × tarifa por hora + refacción con margen. Ejemplo ilustrativo.")
lab(ws["A4"], "Tarifa por hora (de la hoja 1)", True); link(ws["B4"], f"={TARIFA}", MX2, True)
head(ws, 6, ["Servicio", "Tiempo estándar (h)", "Costo refacción (MXN)", "Margen refacción", "Mano de obra", "Refacción con margen", "Precio sugerido", "Precio redondeado"])
serv = [("Diagnóstico eléctrico (carga, encendido, arranque)", 0.75, 0, 0.3), ("Revisión preventiva con semáforo", 0.35, 0, 0.3), ("Prueba y carga de batería", 0.4, 0, 0.3), ("Medición de consumo parásito", 0.5, 0, 0.3), ("Reparación de conector estator-regulador", 0.6, 120, 0.3), ("Cambio de regulador-rectificador", 0.6, 650, 0.25), ("Instalación de accesorio con relevador y fusible", 1.0, 220, 0.3), ("Reparación de arnés (por tramo)", 0.8, 80, 0.3), ("Diagnóstico de inyección con escáner", 1.0, 0, 0.3), ("Conversión de direccionales a LED con flasher", 0.6, 380, 0.25)]
for i, (s, h, c, m) in enumerate(serv, 7):
    lab(ws.cell(row=i, column=1), s); inp(ws.cell(row=i, column=2), h, "0.00"); inp(ws.cell(row=i, column=3), c, MX); inp(ws.cell(row=i, column=4), m, PCT)
    fx(ws.cell(row=i, column=5), f"=B{i}*$B$4", MX); fx(ws.cell(row=i, column=6), f"=C{i}*(1+D{i})", MX); fx(ws.cell(row=i, column=7), f"=E{i}+F{i}", MX); fx(ws.cell(row=i, column=8), f"=ROUNDUP(G{i}/10,0)*10", MX, True, OK)
for col, w in zip("ABCDEFGH", [52, 14, 16, 14, 14, 16, 15, 16]): ws.column_dimensions[col].width = w
ws.row_dimensions[6].height = 32

# 3 Menú 3 opciones
ws = wb.create_sheet("3_Menu_3_opciones"); title(ws, "3. Menú de 3 opciones", "Ejemplo ilustrativo para \"moto que no carga\" y \"moto que no da marcha\".")
lab(ws["A4"], "Tarifa por hora (de la hoja 1)", True); link(ws["B4"], f"={TARIFA}", MX2, True)
head(ws, 6, ["Falla / opción", "Qué incluye", "Horas", "Refacciones con margen (MXN)", "Precio", "Precio redondeado"])
menu = [("No carga · Básico", "Cambio de regulador", 0.6, 810), ("No carga · Recomendado", "Regulador + conector nuevo + tierra + garantía", 1.2, 960), ("No carga · Premium", "Regulador serie + eliminación de conector + tierra dedicada + revisión a 30 días", 1.8, 2200),
        ("No da marcha · Básico", "Cambio de relevador de arranque", 0.5, 320), ("No da marcha · Recomendado", "Relevador + limpieza de cables y tierras + revisión de interruptores", 1.0, 380), ("No da marcha · Premium", "Lo anterior + revisión de motor de arranque y batería + protección de conectores", 1.6, 520)]
for i, (a, b, h, c) in enumerate(menu, 7):
    lab(ws.cell(row=i, column=1), a, True); lab(ws.cell(row=i, column=2), b); inp(ws.cell(row=i, column=3), h, "0.00"); inp(ws.cell(row=i, column=4), c, MX)
    fx(ws.cell(row=i, column=5), f"=C{i}*$B$4+D{i}", MX); fx(ws.cell(row=i, column=6), f"=ROUNDUP(E{i}/10,0)*10", MX, True, OK)
for col, w in zip("ABCDEF", [28, 60, 10, 20, 14, 16]): ws.column_dimensions[col].width = w

# 4 Recuperación
ws = wb.create_sheet("4_Recuperacion"); title(ws, "4. ¿En cuántos días recuperas tu inversión?", "EJEMPLO ILUSTRATIVO. No es una promesa de ingresos: depende de tu zona, tus precios y tu constancia.")
items = [("Inversión en el curso (MXN)", cfg["precio"], MX), ("Herramienta adicional que vas a comprar (MXN)", 0, MX), ("Servicios eléctricos adicionales por semana", 4, INT), ("Ganancia neta promedio por servicio (MXN)", 250, MX), ("Días laborables por semana", 6, INT)]
for i, (a, v, f) in enumerate(items, 5):
    lab(ws.cell(row=i, column=1), a); inp(ws.cell(row=i, column=2), v, f)
lab(ws["A11"], "Inversión total", True); fx(ws["B11"], "=B5+B6", MX, True)
lab(ws["A12"], "Ganancia adicional por semana"); fx(ws["B12"], "=B7*B8", MX)
lab(ws["A13"], "Ganancia adicional por día laborable"); fx(ws["B13"], "=IFERROR(B12/B9,0)", MX2)
lab(ws["A14"], "DÍAS LABORABLES PARA RECUPERAR LA INVERSIÓN", True); fx(ws["B14"], "=IFERROR(ROUNDUP(B11/B13,0),0)", INT, True, OK)
lab(ws["A15"], "Semanas aproximadas"); fx(ws["B15"], "=IFERROR(B14/B9,0)", NUM)
ws.column_dimensions["A"].width = 52; ws.column_dimensions["B"].width = 18

# 5 Métricas
ws = wb.create_sheet("5_Metricas"); title(ws, "5. Tus 4 números semanales", "Captura cada viernes. La semana 1 trae un ejemplo ilustrativo.")
head(ws, 4, ["Semana", "Diagnósticos", "Reparaciones autorizadas", "Ingresos eléctricos (MXN)", "Reseñas nuevas", "% que autoriza", "Ticket promedio"])
for i in range(1, 13):
    r = 4 + i
    lab(ws.cell(row=r, column=1), f"Semana {i}")
    ex = (8, 5, 4200, 2) if i == 1 else (None, None, None, None)
    for j, v in enumerate(ex, 2):
        c = ws.cell(row=r, column=j); c.fill = Y; c.font = Font(name=F, color="0000FF", bold=True); c.border = BOX; c.value = v
        c.number_format = MX if j == 4 else INT
    fx(ws.cell(row=r, column=6), f"=IFERROR(C{r}/B{r},0)", PCT); fx(ws.cell(row=r, column=7), f"=IFERROR(D{r}/C{r},0)", MX)
lab(ws["A17"], "Total / promedio", True); fx(ws["B17"], "=SUM(B5:B16)", INT, True); fx(ws["C17"], "=SUM(C5:C16)", INT, True); fx(ws["D17"], "=SUM(D5:D16)", MX, True); fx(ws["E17"], "=SUM(E5:E16)", INT, True)
fx(ws["F17"], "=IFERROR(C17/B17,0)", PCT, True, G); fx(ws["G17"], "=IFERROR(D17/C17,0)", MX, True, G)
for col, w in zip("ABCDEFG", [16, 14, 16, 18, 14, 14, 16]): ws.column_dimensions[col].width = w
ws.row_dimensions[4].height = 32
for s in wb.worksheets: s.sheet_view.showGridLines = False
out = os.path.join(ROOT, "04_Bonos/05_Calculadora/Calculadora_precios_y_recuperacion.xlsx"); os.makedirs(os.path.dirname(out), exist_ok=True); wb.save(out); print("XLSX:", out)

# Tabla de valores (datos)
wb = Workbook(); ws = wb.active; ws.title = "Valores"
def tabla(ws, t, cols, filas, widths, start=4):
    title(ws, t, cfg["avisoValores"]); head(ws, start, cols)
    for i, f in enumerate(filas, start + 1):
        for j, v in enumerate(f, 1): lab(ws.cell(row=i, column=j), v, j == 1)
    for k, w in enumerate(widths): ws.column_dimensions["ABCDEFG"[k]].width = w
v = bj["valores"]; tabla(ws, "Valores de referencia (típicos)", v["cols"], v["filas"], [40, 46, 40])
ws = wb.create_sheet("Colores"); tabla(ws, "Abreviaturas de colores de cables", ["Color", "Honda", "Yamaha", "Suzuki"], bj["colores"], [18, 18, 14, 14]); ws.cell(row=18, column=1, value=bj["coloresNota"]).font = Font(name=F, italic=True)
ws = wb.create_sheet("Codigos_SAE"); tabla(ws, "Códigos genéricos SAE en motos con OBD", ["Código", "Circuito"], [["P0105–P0108", "Sensor MAP"], ["P0110–P0113", "Sensor IAT"], ["P0115–P0118", "Sensor ECT"], ["P0120–P0123", "Sensor TPS"], ["P0130–P0135", "Sensor de oxígeno y calentador"], ["P0201", "Inyector cilindro 1"], ["P0230", "Circuito primario de bomba"], ["P0335–P0336", "Sensor CKP"], ["P0351", "Bobina A primario"], ["P0500", "Sensor de velocidad"], ["P0505", "Control de ralentí"], ["P0560–P0563", "Voltaje del sistema"]], [18, 40]); ws.cell(row=18, column=1, value=bj["nota"]).font = Font(name=F, italic=True)
l = bj["leer"]; ws = wb.create_sheet("Lectura_por_marca"); tabla(ws, "Formas de leer fallas por fabricante", l["cols"], l["filas"], [30, 60, 50])
for s in wb.worksheets:
    s.sheet_view.showGridLines = False
    for row in s.iter_rows():
        for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")
out = os.path.join(ROOT, "04_Bonos/04_Tabla_de_valores/Tabla_de_valores_y_codigos.xlsx"); wb.save(out); print("XLSX:", out)
