# Generador de hojas de Excel con fórmulas reales (openpyxl) desde data/export.json
import json, os, datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = json.load(open(os.path.join(HERE, '..', 'data', 'export.json'), encoding='utf-8'))
OUT = os.path.join(HERE, '..', '..')
CFG, OFF, BON = DATA['config'], DATA['offer'], DATA['bonos']

F = 'Arial'
HEAD = PatternFill('solid', fgColor='2B3036'); INP = PatternFill('solid', fgColor='FFF2B3'); OUTF = PatternFill('solid', fgColor='EEF0F2'); KEY = PatternFill('solid', fgColor='DFF3E3')
thin = Side(style='thin', color='C9CED4'); BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
MXN = '"$"#,##0.00'; PCT = '0.0%'

def title(ws, t, sub):
    ws['A1'] = t; ws['A1'].font = Font(name=F, size=16, bold=True, color='1E2227')
    ws['A2'] = sub; ws['A2'].font = Font(name=F, size=10, italic=True, color='5F6670')
def head(ws, row, cols, widths=None):
    for i, c in enumerate(cols, 1):
        x = ws.cell(row=row, column=i, value=c); x.font = Font(name=F, bold=True, color='FFFFFF'); x.fill = HEAD; x.alignment = Alignment(wrap_text=True, vertical='center'); x.border = BOX
    if widths:
        for i, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(i)].width = w
def inp(c, v, fmt=None):
    c.value = v; c.fill = INP; c.font = Font(name=F, color='0000FF', bold=True); c.border = BOX
    if fmt: c.number_format = fmt
def fx(c, f, fmt=None, bold=False, fill=OUTF):
    c.value = f; c.font = Font(name=F, color='000000', bold=bold); c.border = BOX
    if fill: c.fill = fill
    if fmt: c.number_format = fmt
def txt(c, v, bold=False, color='1E2227', size=10, wrap=False):
    c.value = v; c.font = Font(name=F, bold=bold, color=color, size=size); c.alignment = Alignment(wrap_text=wrap, vertical='top')
def legend(ws, row):
    txt(ws.cell(row=row, column=1), 'Leyenda:', bold=True)
    c = ws.cell(row=row, column=2, value='Celda amarilla con número azul = dato que tú capturas'); c.fill = INP; c.font = Font(name=F, color='0000FF')
    c = ws.cell(row=row + 1, column=2, value='Celda gris = fórmula (no la edites)'); c.fill = OUTF; c.font = Font(name=F)

# ───────── Bono 3 · Calculadora de cotización y rentabilidad ─────────
def bono3():
    wb = Workbook(); ws = wb.active; ws.title = 'Cotizacion'
    title(ws, 'Calculadora de cotización · Reparación de computadoras automotrices', 'Bono 3 · Electrónica y Servicio · Valores de ejemplo ilustrativos: reemplázalos con tus costos reales.')
    ws.column_dimensions['A'].width = 58; ws.column_dimensions['B'].width = 18; ws.column_dimensions['C'].width = 60
    legend(ws, 3)
    txt(ws['A6'], 'DATOS DE ENTRADA', bold=True, color='B88A00')
    rows = [
        ('Tarifa por hora del taller', 350, MXN, 'Tu costo por hora + utilidad deseada.'),
        ('Horas de diagnóstico en banco', 1.6, '0.0', 'Se cobra aunque el cliente no autorice la reparación.'),
        ('Horas de reparación', 1.4, '0.0', 'Apertura, retrabajo, cierre y pruebas.'),
        ('Costo de componentes', 250, MXN, 'Precio de compra.'),
        ('Envío de componentes', 80, MXN, ''),
        ('Consumibles (fundente, IPA, silicón neutro, desgaste)', 70, MXN, ''),
        ('% de margen sobre materiales', 0.30, PCT, ''),
        ('% de reserva para garantía y riesgo', 0.10, PCT, 'La garantía legal mínima es de 90 días (LFPC art. 77).'),
        ('% de comisión por pago con tarjeta o meses sin intereses', 0.04, PCT, 'Consulta la comisión real de tu proveedor de pagos.'),
        ('Horas extra: causa raíz + prueba térmica (Recomendado)', 1.9, '0.0', ''),
        ('Horas extra: respaldo de memoria + reporte (Premium)', 1.5, '0.0', ''),
        ('Costo de garantía extendida y limpieza de conector (Premium)', 200, MXN, ''),
        ('Redondear precios a múltiplos de', 50, MXN, ''),
    ]
    r0 = 7
    for i, (l, v, f, n) in enumerate(rows):
        r = r0 + i; txt(ws.cell(row=r, column=1), l); inp(ws.cell(row=r, column=2), v, f); txt(ws.cell(row=r, column=3), n, color='5F6670')
    B = {k: f'B{r0 + i}' for i, k in enumerate(['tar', 'hd', 'hr', 'comp', 'env', 'cons', 'mar', 'gar', 'com', 'hx1', 'hx2', 'prem', 'red'])}
    r = r0 + len(rows) + 1; txt(ws.cell(row=r, column=1), 'RESULTADOS (fórmulas)', bold=True, color='B88A00')
    out = [
        ('Mano de obra (diagnóstico + reparación)', f"=({B['hd']}+{B['hr']})*{B['tar']}"),
        ('Materiales con margen', f"=({B['comp']}+{B['env']}+{B['cons']})*(1+{B['mar']})"),
        ('Subtotal básico', '=B{a}+B{b}'),
        ('Reserva de garantía y riesgo', "=B{c}*" + B['gar']),
        ('PRECIO BÁSICO (precio total)', "=ROUNDUP((B{c}+B{d})/(1-" + B['com'] + ")/" + B['red'] + ",0)*" + B['red']),
        ('PRECIO RECOMENDADO (precio total)', "=ROUNDUP(((B{c}+B{d})+" + B['hx1'] + "*" + B['tar'] + "*(1+" + B['gar'] + "))/(1-" + B['com'] + ")/" + B['red'] + ",0)*" + B['red']),
        ('PRECIO PREMIUM (precio total)', "=ROUNDUP(((B{c}+B{d})+(" + B['hx1'] + "+" + B['hx2'] + ")*" + B['tar'] + "*(1+" + B['gar'] + ")+" + B['prem'] + ")/(1-" + B['com'] + ")/" + B['red'] + ",0)*" + B['red']),
        ('Precio sólo diagnóstico en banco', "=ROUNDUP(" + B['hd'] + "*" + B['tar'] + "/(1-" + B['com'] + ")/" + B['red'] + ",0)*" + B['red']),
        ('Costos directos (componentes + envío + consumibles)', f"={B['comp']}+{B['env']}+{B['cons']}"),
        ('Utilidad estimada nivel Básico (después de comisión)', "=B{e}*(1-" + B['com'] + ")-B{i}"),
        ('Utilidad estimada nivel Recomendado', "=B{f}*(1-" + B['com'] + ")-B{i}"),
        ('Utilidad estimada nivel Premium', "=B{g}*(1-" + B['com'] + ")-B{i}-" + B['prem']),
    ]
    rr = r + 1; idx = {}
    letters = 'abcdefghijkl'
    for j in range(len(out)): idx[letters[j]] = rr + j
    for j, (l, f) in enumerate(out):
        row = rr + j; txt(ws.cell(row=row, column=1), l, bold=l.isupper() or l.startswith('PRECIO'))
        fx(ws.cell(row=row, column=2), f.format(**idx), MXN, bold=l.startswith('PRECIO'), fill=KEY if l.startswith('PRECIO') else OUTF)
    note = rr + len(out) + 1
    txt(ws.cell(row=note, column=1), 'Ejemplo ilustrativo. Informa siempre el precio total (LFPC art. 7 Bis). No es una promesa de ingresos.', color='5F6670', wrap=True)

    # Rentabilidad
    w2 = wb.create_sheet('Rentabilidad'); title(w2, 'Rentabilidad mensual y recuperación de la inversión', 'Ejemplo ilustrativo; captura tus propios números.')
    w2.column_dimensions['A'].width = 58; w2.column_dimensions['B'].width = 18; w2.column_dimensions['C'].width = 50; legend(w2, 3)
    ins = [('Reparaciones nivel Básico al mes', 1, '0'), ('Reparaciones nivel Recomendado al mes', 2, '0'), ('Reparaciones nivel Premium al mes', 1, '0'), ('Diagnósticos sin reparación al mes', 2, '0'), ('Costos fijos mensuales del área (renta parcial, luz, software)', 1500, MXN), ('Inversión en el curso', CFG['precio'], MXN), ('Inversión en equipo de banco (ver Bono 2)', 6000, MXN)]
    for i, (l, v, f) in enumerate(ins):
        txt(w2.cell(row=6 + i, column=1), l); inp(w2.cell(row=6 + i, column=2), v, f)
    c = 'Cotizacion!'
    outs = [
        ('Ingresos del mes', f"=B6*{c}B{idx['e']}+B7*{c}B{idx['f']}+B8*{c}B{idx['g']}+B9*{c}B{idx['h']}"),
        ('Utilidad de reparaciones', f"=B6*{c}B{idx['j']}+B7*{c}B{idx['k']}+B8*{c}B{idx['l']}"),
        ('Utilidad de diagnósticos', f"=B9*{c}B{idx['h']}*(1-{c}{B['com']})"),
        ('Utilidad neta mensual (después de costos fijos)', '=B15+B16-B11'),
        ('Días para recuperar el curso', '=IF(B17>0,B11*0+B11/(B17/30),"Sin utilidad")'),
        ('Días para recuperar curso + equipo', '=IF(B17>0,(B11+B12)/(B17/30),"Sin utilidad")'),
    ]
    # Ajuste: B11 es la inversión del curso (fila 11) y B12 el equipo (fila 12); costos fijos en B10
    outs[3] = ('Utilidad neta mensual (después de costos fijos)', '=B15+B16-B10')
    outs[4] = ('Días para recuperar el curso', '=IF(B17>0,B11/(B17/30),"Sin utilidad")')
    for i, (l, f) in enumerate(outs):
        txt(w2.cell(row=14 + i, column=1), l, bold=True); fx(w2.cell(row=14 + i, column=2), f, MXN if i < 4 else '0.0', bold=True, fill=KEY if i >= 3 else OUTF)
    txt(w2.cell(row=21, column=1), 'Ejemplo ilustrativo: depende de tu plaza, esfuerzo y calidad. No constituye promesa de ingresos.', color='5F6670')

    # Registro de reparaciones
    w3 = wb.create_sheet('Registro'); title(w3, 'Registro de reparaciones', 'Captura una fila por trabajo; las columnas grises se calculan solas.')
    head(w3, 4, ['Fecha', 'Cliente / taller', 'Vehículo', 'No. de parte ECU', 'Falla encontrada', 'Nivel', 'Precio cobrado', 'Materiales', 'Horas', 'Utilidad', 'Utilidad por hora'], [12, 20, 22, 18, 30, 14, 15, 13, 9, 14, 16])
    dv = DataValidation(type='list', formula1='"Básico,Recomendado,Premium,Diagnóstico"', allow_blank=True); w3.add_data_validation(dv)
    ex = [datetime.date(2026, 12, 1), 'Ejemplo: Taller aliado', 'Dodge Journey 2012 2.4', '05150XXXXX (ejemplo)', 'Driver de inyector 2 + inyector en corto', 'Recomendado', 2600, 400, 3]
    for r in range(5, 26):
        for col in range(1, 10):
            cl = w3.cell(row=r, column=col); v = ex[col - 1] if r == 5 else None
            inp(cl, v, 'yyyy-mm-dd' if col == 1 else (MXN if col in (7, 8) else ('0.0' if col == 9 else None)))
            if col == 6: dv.add(cl)
        fx(w3.cell(row=r, column=10), f'=IF(G{r}="","",G{r}-H{r})', MXN)
        fx(w3.cell(row=r, column=11), f'=IF(OR(G{r}="",I{r}="",I{r}=0),"",(G{r}-H{r})/I{r})', MXN)
    txt(w3.cell(row=27, column=1), 'Total'); fx(w3.cell(row=27, column=7), '=SUM(G5:G25)', MXN, bold=True); fx(w3.cell(row=27, column=10), '=SUM(J5:J25)', MXN, bold=True)
    p = os.path.join(OUT, '04_Bonos', 'Bono_03_Calculadora_cotizacion_y_rentabilidad.xlsx'); wb.save(p); return p

# ───────── Bono 2 · Lista de materiales ─────────
def bono2():
    wb = Workbook(); ws = wb.active; ws.title = 'Lista de materiales'
    title(ws, 'Lista de materiales del banco de pruebas ECU', 'Bono 2 · Precios consultados o estimados al 5 de noviembre de 2026; verifica al comprar.')
    legend(ws, 3)
    head(ws, 6, ['Nivel', 'Material', 'Cantidad', 'Precio unitario', 'Subtotal', 'Estatus del precio'], [24, 62, 10, 16, 16, 40])
    r = 7
    for b in BON['bom']:
        txt(ws.cell(row=r, column=1), b[0]); txt(ws.cell(row=r, column=2), b[1], wrap=True)
        inp(ws.cell(row=r, column=3), b[2], '0'); inp(ws.cell(row=r, column=4), b[3], MXN)
        fx(ws.cell(row=r, column=5), f'=C{r}*D{r}', MXN); txt(ws.cell(row=r, column=6), b[4], color='5F6670', wrap=True); r += 1
    last = r - 1; r += 1
    for nv in sorted(set(b[0] for b in BON['bom'])):
        txt(ws.cell(row=r, column=2), 'Total ' + nv, bold=True); fx(ws.cell(row=r, column=5), f'=SUMIF(A7:A{last},"{nv}",E7:E{last})', MXN, bold=True); r += 1
    txt(ws.cell(row=r, column=2), 'TOTAL GENERAL', bold=True); fx(ws.cell(row=r, column=5), f'=SUM(E7:E{last})', MXN, bold=True, fill=KEY)
    ws.freeze_panes = 'A7'
    p = os.path.join(OUT, '04_Bonos', 'Bono_02_Lista_de_materiales_banco.xlsx'); wb.save(p); return p

# ───────── Bono 5 · Tabla de DTC ─────────
def bono5():
    wb = Workbook(); ws = wb.active; ws.title = 'DTC'
    title(ws, 'Tabla de DTC internos, de referencia y de red', 'Bono 5 · Descripciones genéricas (SAE J2012 / información de servicio); confirma con el fabricante.')
    head(ws, 4, ['Código', 'Descripción', 'Categoría', 'Qué medir primero', 'Clase del curso'], [10, 62, 16, 52, 14])
    for i, d in enumerate(BON['dtc']):
        for j, v in enumerate(d): txt(ws.cell(row=5 + i, column=j + 1), v, wrap=True)
    last = 4 + len(BON['dtc']); ws.auto_filter.ref = f'A4:E{last}'; ws.freeze_panes = 'A5'
    w2 = wb.create_sheet('Resumen'); title(w2, 'Códigos por categoría', 'Conteo automático (COUNTIF).')
    head(w2, 4, ['Categoría', 'Códigos'], [22, 12])
    for i, cat in enumerate(sorted(set(d[2] for d in BON['dtc']))):
        txt(w2.cell(row=5 + i, column=1), cat); fx(w2.cell(row=5 + i, column=2), f'=COUNTIF(DTC!C5:C{last},A{5 + i})', '0')
    p = os.path.join(OUT, '04_Bonos', 'Bono_05_Tabla_DTC.xlsx'); wb.save(p); return p

# ───────── Bono 9 · Calendario de contenido ─────────
def bono9():
    wb = Workbook(); ws = wb.active; ws.title = 'Calendario 30 dias'
    title(ws, 'Calendario de contenido de 30 días', 'Bono 9 · Captura la fecha de inicio; las fechas se calculan solas.')
    legend(ws, 3)
    txt(ws['A6'], 'Fecha de inicio:', bold=True); inp(ws['B6'], datetime.date(2026, 11, 30), 'yyyy-mm-dd')
    head(ws, 8, ['Día', 'Fecha', 'Tipo', 'Tema', 'Formato', 'Relación', 'Estado'], [8, 14, 18, 56, 20, 16, 16])
    dv = DataValidation(type='list', formula1='"Pendiente,Grabado,Publicado"', allow_blank=True); ws.add_data_validation(dv)
    for i, c in enumerate(BON['calendario']):
        r = 9 + i; txt(ws.cell(row=r, column=1), c[0]); fx(ws.cell(row=r, column=2), f'=$B$6+A{r}-1', 'ddd dd/mm/yyyy')
        for j, v in enumerate(c[1:]): txt(ws.cell(row=r, column=3 + j), v, wrap=True)
        inp(ws.cell(row=r, column=7), 'Pendiente' if i else 'Publicado'); dv.add(ws.cell(row=r, column=7))
    r = 9 + len(BON['calendario']) + 1
    txt(ws.cell(row=r, column=3), 'Publicados:', bold=True); fx(ws.cell(row=r, column=4), f'=COUNTIF(G9:G{r - 2},"Publicado")&" de {len(BON["calendario"])}"')
    w2 = wb.create_sheet('Plan 30 dias'); title(w2, 'Plan de acción de 30 días', 'Marca cada tarea al cumplirla.')
    head(w2, 4, ['Semana', 'Enfoque', 'Tarea', 'Hecho (Sí/No)'], [12, 16, 80, 14])
    r = 5; dv2 = DataValidation(type='list', formula1='"Sí,No"', allow_blank=True); w2.add_data_validation(dv2)
    for s in BON['plan30']:
        for t in s[2]:
            txt(w2.cell(row=r, column=1), s[0]); txt(w2.cell(row=r, column=2), s[1]); txt(w2.cell(row=r, column=3), t, wrap=True); inp(w2.cell(row=r, column=4), 'No'); dv2.add(w2.cell(row=r, column=4)); r += 1
    txt(w2.cell(row=r + 1, column=3), 'Avance:', bold=True); fx(w2.cell(row=r + 1, column=4), f'=COUNTIF(D5:D{r - 1},"Sí")/COUNTA(D5:D{r - 1})', PCT)
    p = os.path.join(OUT, '04_Bonos', 'Bono_09_Calendario_y_plan.xlsx'); wb.save(p); return p

for fn in (bono2, bono3, bono5, bono9): print('ok', fn())
