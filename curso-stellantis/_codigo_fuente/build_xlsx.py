# Calculadora de tarifa y menú de servicios (bono 5) · fórmulas reales
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
wb = Workbook()
AM = PatternFill("solid", fgColor="FFF2B3"); GR = PatternFill("solid", fgColor="2B3036"); OK = PatternFill("solid", fgColor="E6F6E9"); CL = PatternFill("solid", fgColor="EEF0F2")
IN = Font(name="Arial", size=11, color="1F4FD1", bold=True); TX = Font(name="Arial", size=11); B = Font(name="Arial", size=11, bold=True); WH = Font(name="Arial", size=11, bold=True, color="FFFFFF")
th = Side(style="thin", color="C9CED4"); BD = Border(top=th, bottom=th, left=th, right=th)
def head(ws, r, vals):
    for i, v in enumerate(vals, 1):
        c = ws.cell(r, i, v); c.font = WH; c.fill = GR; c.alignment = Alignment(wrap_text=True, vertical="center"); c.border = BD
def inp(c, v, fmt=None):
    c.value = v; c.fill = AM; c.font = IN; c.border = BD
    if fmt: c.number_format = fmt
def frm(c, f, fmt=None, bold=False):
    c.value = f; c.font = B if bold else TX; c.border = BD; c.fill = OK if bold else PatternFill()
    if fmt: c.number_format = fmt
MX = '"$"#,##0.00'; PC = '0.0%'
ws = wb.active; ws.title = "Calculadora"
ws["A1"] = "Calculadora de tarifa de diagnóstico · Diagnóstico Stellantis Pro"; ws["A1"].font = Font(name="Arial", size=16, bold=True)
ws["A2"] = "Escribe tus datos en las celdas amarillas (número azul). Los valores precargados son un EJEMPLO ILUSTRATIVO: reemplázalos por los tuyos."; ws["A2"].font = Font(name="Arial", size=10, italic=True, color="4B5560")
head(ws, 4, ["Concepto", "Valor", "Nota"])
rows = [
 ("Renta mensual del local", 9000, MX, "Ejemplo ilustrativo"), ("Sueldos mensuales (incluye el tuyo)", 32000, MX, ""), ("Luz, agua, internet y teléfono", 3500, MX, ""),
 ("Suscripciones (información técnica, AutoAuth, software del escáner)", 1800, MX, "AutoAuth ≈ US$50 al año (convertir)"), ("Otros gastos (consumibles, publicidad, contador)", 3000, MX, ""),
 ("Valor del equipo de diagnóstico", 45000, MX, "Osciloscopio, escáner, pinzas, Sens-22"), ("Meses para recuperar el equipo", 24, "0", ""),
 ("Días hábiles al mes", 24, "0", ""), ("Horas cobrables por día por técnico", 5, "0.0", "No todas las horas abiertas son cobrables"), ("Número de técnicos", 2, "0", ""),
 ("Margen de utilidad deseado", 0.30, PC, ""), ("Comisión de la terminal por meses sin intereses", 0.08, PC, "Consulta la tuya"), ("Inversión del curso", 1799, MX, "")]
for i, (k, v, f, n) in enumerate(rows, 5):
    ws.cell(i, 1, k).font = TX; ws.cell(i, 1).border = BD; inp(ws.cell(i, 2), v, f); ws.cell(i, 3, n).font = Font(name="Arial", size=9, color="4B5560")
r = 5 + len(rows) + 1
head(ws, r, ["Resultado", "Valor", "Fórmula"])
res = [("Costo mensual total", "=SUM(B5:B9)+B10/B11", MX), ("Horas cobrables al mes", "=B12*B13*B14", "0"), ("Costo por hora", "=B%d/B%d" % (r + 1, r + 2), MX), ("Precio por hora de diagnóstico", "=B%d*(1+B15)" % (r + 3), MX)]
for j, (k, f, fm) in enumerate(res, r + 1):
    ws.cell(j, 1, k).font = B; ws.cell(j, 1).border = BD; frm(ws.cell(j, 2), f, fm, True); ws.cell(j, 3, f.replace("=", "")).font = Font(name="Arial", size=9, color="4B5560")
PH = "B%d" % (r + 4); CH = "B%d" % (r + 3)
m = r + 6
ws.cell(m - 1, 1, "Menú de 3 opciones").font = Font(name="Arial", size=13, bold=True)
head(ws, m, ["Opción", "Horas", "Precio sugerido", "Precio con MSI", "Utilidad estimada", "Incluye"])
menu = [("Básico", 0.5, "Escaneo completo, informe impreso y revisión de campañas por VIN"), ("Recomendado", 1.5, "Básico + pruebas con multímetro y osciloscopio + informe con capturas"), ("Premium", 2.5, "Recomendado + batería, carga y consumo parásito + revisión a 30 días")]
for k, (n, h, inc) in enumerate(menu, m + 1):
    ws.cell(k, 1, n).font = B; ws.cell(k, 1).border = BD; inp(ws.cell(k, 2), h, "0.0")
    frm(ws.cell(k, 3), "=ROUNDUP(B%d*%s/10,0)*10" % (k, PH), MX, True); frm(ws.cell(k, 4), "=ROUNDUP(C%d/(1-$B$16)/10,0)*10" % k, MX); frm(ws.cell(k, 5), "=C%d-B%d*%s" % (k, k, CH), MX)
    ws.cell(k, 6, inc).font = TX; ws.cell(k, 6).alignment = Alignment(wrap_text=True); ws.cell(k, 6).border = BD
q = m + 5
ws.cell(q, 1, "Recuperación de la inversión del curso (ejemplo ilustrativo)").font = Font(name="Arial", size=13, bold=True)
ws.cell(q + 1, 1, "Diagnósticos Recomendados para recuperar el curso").font = B; frm(ws.cell(q + 1, 2), "=IF(E%d>0,ROUNDUP(B17/E%d,0),\"Revisa tus datos\")" % (m + 2, m + 2), "0", True)
ws.cell(q + 2, 1, "Los resultados dependen de tu mercado y de tu trabajo. No se garantizan ingresos.").font = Font(name="Arial", size=9, italic=True, color="4B5560")
for col, w in zip("ABCDEF", [58, 16, 18, 18, 18, 62]): ws.column_dimensions[col].width = w
# Hoja 2 · servicios extra
w2 = wb.create_sheet("Servicios extra")
w2["A1"] = "Servicios adicionales en 3 escalones"; w2["A1"].font = Font(name="Arial", size=14, bold=True)
w2["A2"] = "Renglón 4 = ejemplo ilustrativo. Agrega tus servicios en las filas amarillas."; w2["A2"].font = Font(name="Arial", size=10, italic=True, color="4B5560")
head(w2, 3, ["Servicio", "Escalón", "Horas", "Costo de refacción", "Margen en refacción", "Precio al cliente"])
ext = [("Limpieza y apriete de tierras", "Económico", 0.5, 0, 0), ("Prueba impresa de batería", "Económico", 0.25, 0, 0), ("Batería nueva con registro del IBS", "Medio", 0.75, 2600, 0.25),
       ("Limpieza de cuerpo de aceleración con reaprendizaje", "Medio", 1, 150, 0.3), ("Alineación PROXI / configuración", "Alto", 1, 0, 0), ("Programación de llave (con PIN)", "Alto", 1.5, 1200, 0.3), ("", "", None, None, None), ("", "", None, None, None)]
dv = DataValidation(type="list", formula1='"Económico,Medio,Alto"', allow_blank=True); w2.add_data_validation(dv)
for i, (s, e, h, c, mg) in enumerate(ext, 4):
    inp(w2.cell(i, 1), s); inp(w2.cell(i, 2), e); dv.add(w2.cell(i, 2)); inp(w2.cell(i, 3), h, "0.00"); inp(w2.cell(i, 4), c, MX); inp(w2.cell(i, 5), mg, PC)
    frm(w2.cell(i, 6), '=IF(C%d="","",ROUNDUP((C%d*Calculadora!%s+D%d*(1+E%d))/10,0)*10)' % (i, i, PH, i, i), MX, True)
for col, w in zip("ABCDEF", [50, 14, 10, 20, 20, 20]): w2.column_dimensions[col].width = w
# Hoja 3 · registro mensual
w3 = wb.create_sheet("Registro mensual")
w3["A1"] = "Registro mensual de resultados"; w3["A1"].font = Font(name="Arial", size=14, bold=True)
head(w3, 3, ["Mes", "Clientes atendidos", "Diagnósticos cobrados", "Reparaciones autorizadas", "Ingreso total", "Ticket promedio", "Conversión a reparación"])
for i in range(4, 16):
    inp(w3.cell(i, 1), "Mes %d" % (i - 3) if i > 4 else "Ejemplo"); inp(w3.cell(i, 2), 40 if i == 4 else None, "0"); inp(w3.cell(i, 3), 22 if i == 4 else None, "0"); inp(w3.cell(i, 4), 15 if i == 4 else None, "0"); inp(w3.cell(i, 5), 98000 if i == 4 else None, MX)
    frm(w3.cell(i, 6), '=IF(B%d>0,E%d/B%d,"")' % (i, i, i), MX); frm(w3.cell(i, 7), '=IF(C%d>0,D%d/C%d,"")' % (i, i, i), PC)
for col, w in zip("ABCDEFG", [14, 18, 20, 22, 18, 18, 22]): w3.column_dimensions[col].width = w
wb.save("../entrega/04_Bonos/Bono05_Calculadora_Excel/Calculadora_tarifa_y_menu.xlsx"); print("ok")
