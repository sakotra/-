// 請求書のデータモデルと計算ロジック（軽貨物運送向け）

export interface LineItem {
  id: string
  date: string // 配送日 (YYYY-MM-DD)
  description: string // 配送内容・ルート・作業内容
  quantity: number // 数量
  unit: string // 単位（件・個・台 など）
  unitPrice: number // 単価（円）
}

export interface InvoiceData {
  invoiceNo: string // 請求書番号
  issueDate: string // 発行日
  dueDate: string // お支払い期限
  subject: string // 件名
  clientName: string // 請求先 会社名
  clientContact: string // 請求先 担当者名
  clientPostal: string // 請求先 郵便番号
  clientAddress: string // 請求先 住所
  taxRate: number // 消費税率（0.1 など）
  items: LineItem[]
  notes: string // 備考
}

// AI が返す明細（idを持たない）
export interface AiLineItem {
  date: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
}

// 1明細の金額
export function lineAmount(item: LineItem): number {
  const q = Number(item.quantity) || 0
  const p = Number(item.unitPrice) || 0
  return Math.round(q * p)
}

// 小計・消費税・合計
export function calcTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + lineAmount(item), 0)
  const tax = Math.floor(subtotal * (Number(taxRate) || 0))
  const total = subtotal + tax
  return { subtotal, tax, total }
}

// 通貨表示（¥1,234）
export function formatYen(value: number): string {
  return '¥' + Math.round(value || 0).toLocaleString('ja-JP')
}

// 日付を和暦っぽい表記（2026年1月5日）に
export function formatDateJa(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

// 請求書番号の自動採番（INV-YYYYMMDD-001 形式）
export function generateInvoiceNo(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 900) + 100)
  return `INV-${y}${m}${d}-${rand}`
}

// ISO日付文字列（input[type=date] 用）
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// N日後の日付
export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

let idCounter = 0
export function newLineId(): string {
  idCounter += 1
  return `line-${Date.now()}-${idCounter}`
}

export function emptyLineItem(): LineItem {
  return {
    id: newLineId(),
    date: '',
    description: '',
    quantity: 1,
    unit: '件',
    unitPrice: 0,
  }
}
