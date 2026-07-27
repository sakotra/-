#!/usr/bin/env python3
"""日本語の請求書テンプレートを作成するスクリプト。"""

from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill, NamedStyle
from openpyxl.utils import get_column_letter

# --- スタイル定義 -----------------------------------------------------------
FONT = "Arial"

title_font = Font(name=FONT, size=22, bold=True)
label_font = Font(name=FONT, size=10, bold=True)
normal_font = Font(name=FONT, size=10)
input_font = Font(name=FONT, size=10, color="0000FF")  # 入力欄は青字
header_font = Font(name=FONT, size=10, bold=True, color="FFFFFF")
total_font = Font(name=FONT, size=12, bold=True)
small_font = Font(name=FONT, size=9)

thin = Side(style="thin", color="808080")
box = Border(left=thin, right=thin, top=thin, bottom=thin)

header_fill = PatternFill("solid", fgColor="374151")   # ダークグレー
accent_fill = PatternFill("solid", fgColor="DBEAFE")   # 薄い青
input_fill = PatternFill("solid", fgColor="FFFFCC")    # 入力欄は薄い黄色

center = Alignment(horizontal="center", vertical="center")
right = Alignment(horizontal="right", vertical="center")
left = Alignment(horizontal="left", vertical="center", wrap_text=True)

wb = Workbook()
ws = wb.active
ws.title = "請求書"
ws.sheet_view.showGridLines = False

# 列幅
widths = {"A": 4, "B": 26, "C": 12, "D": 10, "E": 14, "F": 16, "G": 4}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

# --- タイトル ---------------------------------------------------------------
ws.merge_cells("B2:F2")
c = ws["B2"]
c.value = "請 求 書"
c.font = title_font
c.alignment = center

# --- 請求先 / 請求元 --------------------------------------------------------
# 宛先（左側）
ws["B4"] = "＿＿＿＿＿＿＿＿＿ 御中"
ws["B4"].font = Font(name=FONT, size=14, bold=True)
ws["B5"] = "〒000-0000"
ws["B6"] = "住所を入力"
ws["B7"] = "TEL: 000-0000-0000"
for r in range(5, 8):
    ws[f"B{r}"].font = input_font

# 発行日・請求書番号（右側）
ws["E4"] = "請求日:"
ws["F4"] = "2026/07/27"
ws["E5"] = "請求書番号:"
ws["F5"] = "INV-0001"
ws["E6"] = "支払期限:"
ws["F6"] = "2026/08/31"
for r in range(4, 7):
    ws[f"E{r}"].font = label_font
    ws[f"E{r}"].alignment = right
    ws[f"F{r}"].font = input_font
    ws[f"F{r}"].alignment = right

# 発行元（自社情報）
ws.merge_cells("E8:F8")
ws["E8"] = "＿＿＿＿＿＿ 株式会社"
ws["E8"].font = Font(name=FONT, size=11, bold=True)
ws["E8"].alignment = right
ws.merge_cells("E9:F9")
ws["E9"] = "〒000-0000  住所を入力"
ws["E9"].alignment = right
ws["E9"].font = input_font
ws.merge_cells("E10:F10")
ws["E10"] = "TEL: 000-0000-0000"
ws["E10"].alignment = right
ws["E10"].font = input_font

# --- ご請求金額（合計）ボックス --------------------------------------------
ws.merge_cells("B10:C10")
ws["B10"] = "ご請求金額（税込）"
ws["B10"].font = label_font
ws["B10"].alignment = center
ws["B10"].fill = accent_fill
ws.merge_cells("B11:C11")
ws["B11"] = "=F27"  # 合計を参照
ws["B11"].font = Font(name=FONT, size=18, bold=True)
ws["B11"].alignment = center
ws["B11"].number_format = "¥#,##0"
ws["B11"].border = box
ws["B10"].border = box

# --- 明細テーブル ヘッダー --------------------------------------------------
header_row = 13
headers = ["", "品目・摘要", "数量", "単価", "金額"]
cols = ["A", "B", "C", "D", "E"]
# ヘッダー: B(品目) C(数量) D(単価) E,F(金額)
ws[f"B{header_row}"] = "品目・摘要"
ws[f"C{header_row}"] = "数量"
ws[f"D{header_row}"] = "単価"
ws.merge_cells(f"E{header_row}:F{header_row}")
ws[f"E{header_row}"] = "金額"
for col in ["B", "C", "D", "E", "F"]:
    cell = ws[f"{col}{header_row}"]
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = center
    cell.border = box

# --- 明細行 -----------------------------------------------------------------
first_item = header_row + 1          # 14
n_items = 10
last_item = first_item + n_items - 1  # 23

# サンプル行（1行だけ記入例を入れる）
ws[f"B{first_item}"] = "（記入例）コンサルティング費用"
ws[f"C{first_item}"] = 2
ws[f"D{first_item}"] = 50000

for i in range(n_items):
    r = first_item + i
    ws.merge_cells(f"E{r}:F{r}")
    # 金額 = 数量 * 単価（空欄なら0）
    ws[f"E{r}"] = f'=IF(AND(C{r}="",D{r}=""),"",N(C{r})*N(D{r}))'
    ws[f"E{r}"].number_format = "¥#,##0"
    for col in ["B", "C", "D", "E", "F"]:
        cell = ws[f"{col}{r}"]
        cell.border = box
        if col == "B":
            cell.alignment = left
            cell.font = input_font
        elif col in ("C", "D"):
            cell.alignment = right
            cell.font = input_font
            cell.number_format = "#,##0"
        else:
            cell.alignment = right
            cell.font = normal_font

# --- 小計・消費税・合計 -----------------------------------------------------
subtotal_row = last_item + 1   # 24
tax_row = subtotal_row + 1     # 25
tax_rate_row = subtotal_row    # 税率は小計行の隣に表示
total_row = tax_row + 1        # 26 -> 実際は下で調整

# レイアウト: D列にラベル, E:F に金額
def money_line(r, label, formula, bold=False, fill=None):
    ws.merge_cells(f"C{r}:D{r}")
    lc = ws[f"C{r}"]
    lc.value = label
    lc.alignment = right
    lc.font = total_font if bold else label_font
    ws.merge_cells(f"E{r}:F{r}")
    vc = ws[f"E{r}"]
    vc.value = formula
    vc.number_format = "¥#,##0"
    vc.alignment = right
    vc.font = total_font if bold else normal_font
    vc.border = box
    if fill:
        lc.fill = fill
        vc.fill = fill

# 小計
money_line(subtotal_row, "小計", f"=SUM(E{first_item}:E{last_item})")
# 消費税(10%)  税率は変更可能な入力セルにする
tax_rate_cell = f"C{tax_row}"
ws.merge_cells(f"C{tax_row}:D{tax_row}")
ws[f"C{tax_row}"] = "消費税（10%）"
ws[f"C{tax_row}"].alignment = right
ws[f"C{tax_row}"].font = label_font
ws.merge_cells(f"E{tax_row}:F{tax_row}")
ws[f"E{tax_row}"] = f"=ROUND(E{subtotal_row}*0.1,0)"
ws[f"E{tax_row}"].number_format = "¥#,##0"
ws[f"E{tax_row}"].alignment = right
ws[f"E{tax_row}"].font = normal_font
ws[f"E{tax_row}"].border = box

# 合計
final_row = tax_row + 1  # 26 -> but B11 references F27; adjust references
money_line(final_row, "合計（税込）",
           f"=E{subtotal_row}+E{tax_row}", bold=True, fill=accent_fill)

# B11 の参照を合計セルに合わせる
ws["B11"] = f"=E{final_row}"

# --- 備考欄 -----------------------------------------------------------------
note_row = final_row + 2
ws[f"B{note_row}"] = "お振込先"
ws[f"B{note_row}"].font = label_font
ws.merge_cells(f"B{note_row+1}:F{note_row+3}")
ws[f"B{note_row+1}"] = (
    "〇〇銀行 〇〇支店　普通 0000000\n"
    "口座名義: ＿＿＿＿＿＿＿＿＿\n"
    "※振込手数料は貴社にてご負担願います。"
)
ws[f"B{note_row+1}"].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
ws[f"B{note_row+1}"].font = input_font
for r in range(note_row+1, note_row+4):
    for col in ["B", "C", "D", "E", "F"]:
        ws[f"{col}{r}"].border = box

# --- 使い方メモ（別シート）--------------------------------------------------
guide = wb.create_sheet("使い方")
guide.sheet_view.showGridLines = False
guide.column_dimensions["A"].width = 4
guide.column_dimensions["B"].width = 90
notes = [
    ("この請求書テンプレートの使い方", True),
    ("", False),
    ("■ 青字・黄色セルが入力欄です。ご自身の情報に書き換えてください。", False),
    ("■ 明細の「数量」「単価」を入力すると「金額」が自動計算されます。", False),
    ("■ 小計・消費税（10%）・合計（税込）はすべて自動で計算されます。", False),
    ("■ 上部の「ご請求金額（税込）」は合計と連動しています。", False),
    ("■ 消費税率を変更する場合は、請求書シートの消費税の数式 0.1 を修正してください。", False),
    ("■ 明細が足りない場合は、行を挿入して数式をコピーしてください。", False),
    ("", False),
    ("記入例として1行目にサンプルを入れています。実際の入力時は削除してください。", False),
]
for i, (text, is_title) in enumerate(notes, start=2):
    cell = guide[f"B{i}"]
    cell.value = text
    cell.font = Font(name=FONT, size=13, bold=True) if is_title else Font(name=FONT, size=10)
    cell.alignment = left

# 印刷設定
ws.print_area = f"A1:G{note_row+4}"
ws.page_setup.orientation = "portrait"
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0
ws.sheet_properties.pageSetUpPr.fitToPage = True

# 表計算アプリで開いた瞬間に全数式を再計算させる
wb.calculation.fullCalcOnLoad = True

wb.save("/home/user/-/請求書.xlsx")
print("saved: /home/user/-/請求書.xlsx")
print(f"final_row={final_row}, subtotal_row={subtotal_row}, tax_row={tax_row}")
