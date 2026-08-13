'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { COMPANY, TAX_RATES, UNITS } from '@/lib/constants'
import { getCurrentUserId, saveInvoice } from '@/lib/supabase/invoices'
import {
  InvoiceData,
  LineItem,
  AiLineItem,
  calcTotals,
  lineAmount,
  formatYen,
  formatDateJa,
  generateInvoiceNo,
  toISODate,
  addDays,
  newLineId,
  emptyLineItem,
} from '@/lib/invoice'

const STORAGE_KEY = 'sakon-invoice-draft'
// 保存済み一覧から「開く」ときの受け渡しキー
export const OPEN_INVOICE_KEY = 'sakon-open-invoice'

function initialInvoice(): InvoiceData {
  const today = new Date()
  return {
    invoiceNo: generateInvoiceNo(today),
    issueDate: toISODate(today),
    dueDate: toISODate(addDays(today, 30)),
    subject: '軽貨物配送業務料金',
    clientName: '',
    clientContact: '',
    clientPostal: '',
    clientAddress: '',
    taxRate: 0.1,
    items: [emptyLineItem()],
    notes: '',
  }
}

export default function InvoiceEditor() {
  const [invoice, setInvoice] = useState<InvoiceData>(initialInvoice)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [cloudSaving, setCloudSaving] = useState(false)
  const [cloudMsg, setCloudMsg] = useState('')

  // 下書き / 保存済みの復元
  useEffect(() => {
    // 保存済み一覧から「開く」で渡されたデータを優先
    try {
      const handoff = sessionStorage.getItem(OPEN_INVOICE_KEY)
      if (handoff) {
        sessionStorage.removeItem(OPEN_INVOICE_KEY)
        const parsed = JSON.parse(handoff) as InvoiceData
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setInvoice(parsed)
          setHydrated(true)
          return
        }
      }
    } catch {
      /* 破損データは無視 */
    }
    // 通常はローカル下書きを復元
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as InvoiceData
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setInvoice(parsed)
        }
      }
    } catch {
      /* 破損データは無視 */
    }
    setHydrated(true)
  }, [])

  // ログイン状態の確認
  useEffect(() => {
    getCurrentUserId().then((id) => setLoggedIn(Boolean(id)))
  }, [])

  // 下書きの自動保存
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice))
    } catch {
      /* 保存不可でも継続 */
    }
  }, [invoice, hydrated])

  const totals = useMemo(
    () => calcTotals(invoice.items, invoice.taxRate),
    [invoice.items, invoice.taxRate]
  )

  function update<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    setInvoice((prev) => ({ ...prev, [key]: value }))
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }))
  }

  function addRow() {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, emptyLineItem()] }))
  }

  function removeRow(id: string) {
    setInvoice((prev) => ({
      ...prev,
      items:
        prev.items.length > 1
          ? prev.items.filter((it) => it.id !== id)
          : prev.items,
    }))
  }

  function resetAll() {
    if (confirm('入力内容をすべてクリアして新規作成しますか？')) {
      setInvoice(initialInvoice())
      setAiText('')
      setAiError('')
      setCloudMsg('')
    }
  }

  async function saveToCloud() {
    setCloudSaving(true)
    setCloudMsg('')
    const { error } = await saveInvoice(invoice, totals.total)
    setCloudMsg(
      error ? `保存に失敗しました：${error}` : 'クラウドに保存しました。'
    )
    setCloudSaving(false)
  }

  async function runAi() {
    const text = aiText.trim()
    if (!text) {
      setAiError('配送内容を入力してください。')
      return
    }
    setAiLoading(true)
    setAiError('')
    try {
      const res = await fetch('/api/ai/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, today: toISODate(new Date()) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAiError(data.error || 'AI明細の生成に失敗しました。')
        return
      }
      const aiItems: AiLineItem[] = Array.isArray(data.items) ? data.items : []
      if (aiItems.length === 0) {
        setAiError('明細を抽出できませんでした。表現を変えてお試しください。')
        return
      }
      const newItems: LineItem[] = aiItems.map((it) => ({
        id: newLineId(),
        date: it.date || '',
        description: it.description || '',
        quantity: Number(it.quantity) || 0,
        unit: it.unit || '件',
        unitPrice: Number(it.unitPrice) || 0,
      }))
      // 既存が空行1つだけなら置き換え、それ以外は追記
      setInvoice((prev) => {
        const onlyEmpty =
          prev.items.length === 1 &&
          !prev.items[0].description &&
          !prev.items[0].unitPrice
        return {
          ...prev,
          items: onlyEmpty ? newItems : [...prev.items, ...newItems],
        }
      })
      setAiText('')
    } catch {
      setAiError('通信エラーが発生しました。')
    } finally {
      setAiLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary'
  const labelClass = 'block text-xs font-bold text-gray-600 mb-1'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ============ 入力エリア ============ */}
      <div className="no-print space-y-6">
        {/* AIアシスト */}
        <section className="bg-gradient-to-br from-primary to-blue-900 text-white rounded-xl p-5 shadow-lg">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
            <span>🤖</span> AIで明細を自動作成
          </h3>
          <p className="text-xs text-blue-100 mb-3">
            配送内容を普段の言葉で入力してください。AIが請求明細に変換します。
          </p>
          <textarea
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            rows={4}
            placeholder="例）1月5日 大阪市内スポット便 10件 単価800円、1月8日 京都ルート定期便 5件 1200円、待機料 2時間 1500円"
            className="w-full rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {aiError && (
            <p className="mt-2 text-sm bg-red-500/90 rounded px-3 py-2">{aiError}</p>
          )}
          <button
            onClick={runAi}
            disabled={aiLoading}
            className="mt-3 w-full bg-secondary hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-md transition-colors"
          >
            {aiLoading ? 'AIが作成中…' : 'AIで明細を生成する'}
          </button>
        </section>

        {/* 請求先 */}
        <section className="bg-white rounded-xl p-5 shadow border border-gray-100">
          <h3 className="font-bold text-primary mb-4">請求先情報</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelClass}>会社名 / 宛名</label>
              <input
                className={inputClass}
                value={invoice.clientName}
                onChange={(e) => update('clientName', e.target.value)}
                placeholder="株式会社〇〇"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>担当者名</label>
                <input
                  className={inputClass}
                  value={invoice.clientContact}
                  onChange={(e) => update('clientContact', e.target.value)}
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <label className={labelClass}>郵便番号</label>
                <input
                  className={inputClass}
                  value={invoice.clientPostal}
                  onChange={(e) => update('clientPostal', e.target.value)}
                  placeholder="530-0001"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>住所</label>
              <input
                className={inputClass}
                value={invoice.clientAddress}
                onChange={(e) => update('clientAddress', e.target.value)}
                placeholder="大阪府大阪市北区…"
              />
            </div>
          </div>
        </section>

        {/* 請求書情報 */}
        <section className="bg-white rounded-xl p-5 shadow border border-gray-100">
          <h3 className="font-bold text-primary mb-4">請求書情報</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>請求書番号</label>
              <input
                className={inputClass}
                value={invoice.invoiceNo}
                onChange={(e) => update('invoiceNo', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>件名</label>
              <input
                className={inputClass}
                value={invoice.subject}
                onChange={(e) => update('subject', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>発行日</label>
              <input
                type="date"
                className={inputClass}
                value={invoice.issueDate}
                onChange={(e) => update('issueDate', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>お支払期限</label>
              <input
                type="date"
                className={inputClass}
                value={invoice.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>消費税率</label>
              <select
                className={inputClass}
                value={invoice.taxRate}
                onChange={(e) => update('taxRate', Number(e.target.value))}
              >
                {TAX_RATES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 明細 */}
        <section className="bg-white rounded-xl p-5 shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary">明細</h3>
            <button
              onClick={addRow}
              className="text-sm bg-primary hover:bg-blue-900 text-white font-bold px-3 py-1.5 rounded-md transition-colors"
            >
              ＋ 行を追加
            </button>
          </div>
          <div className="space-y-3">
            {invoice.items.map((item, idx) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">
                    明細 {idx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                      {formatYen(lineAmount(item))}
                    </span>
                    <button
                      onClick={() => removeRow(item.id)}
                      disabled={invoice.items.length === 1}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 text-sm"
                      aria-label="行を削除"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className={labelClass}>配送日</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={item.date}
                      onChange={(e) => updateItem(item.id, { date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>単位</label>
                    <input
                      className={inputClass}
                      list="unit-options"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className={labelClass}>配送内容 / ルート</label>
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                    placeholder="大阪市内スポット便"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>数量</label>
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>単価（税抜）</label>
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <datalist id="unit-options">
            {UNITS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </section>

        {/* 備考 */}
        <section className="bg-white rounded-xl p-5 shadow border border-gray-100">
          <h3 className="font-bold text-primary mb-3">備考</h3>
          <textarea
            className={inputClass}
            rows={3}
            value={invoice.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="高速代・立替金の精算方法など"
          />
        </section>

        {/* クラウド保存（ログイン時のみ） */}
        {loggedIn && (
          <section className="bg-white rounded-xl p-5 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-primary">クラウド保存</h3>
              <Link
                href="/invoices"
                className="text-sm text-primary hover:underline"
              >
                保存済み一覧 →
              </Link>
            </div>
            <button
              onClick={saveToCloud}
              disabled={cloudSaving}
              className="w-full bg-primary hover:bg-blue-900 disabled:opacity-60 text-white font-bold py-2.5 rounded-md transition-colors"
            >
              {cloudSaving ? '保存中…' : '☁ この請求書を保存'}
            </button>
            {cloudMsg && (
              <p className="mt-2 text-sm text-gray-600">{cloudMsg}</p>
            )}
          </section>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-accent hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            🖨 印刷 / PDF保存
          </button>
          <button
            onClick={resetAll}
            className="px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
          >
            新規
          </button>
        </div>
      </div>

      {/* ============ プレビュー ============ */}
      <div className="lg:sticky lg:top-24 self-start">
        <div className="invoice-print-area bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-gray-800">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-bold tracking-widest">請求書</h2>
            <div className="text-right text-xs text-gray-600">
              <p>請求書番号：{invoice.invoiceNo || '—'}</p>
              <p>発行日：{formatDateJa(invoice.issueDate) || '—'}</p>
            </div>
          </div>

          <div className="flex justify-between gap-6 mb-8">
            {/* 請求先 */}
            <div className="flex-1">
              <p className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">
                {invoice.clientName || '　'} 御中
              </p>
              {invoice.clientPostal && (
                <p className="text-sm">〒{invoice.clientPostal}</p>
              )}
              {invoice.clientAddress && (
                <p className="text-sm">{invoice.clientAddress}</p>
              )}
              {invoice.clientContact && (
                <p className="text-sm mt-1">{invoice.clientContact} 様</p>
              )}
            </div>
            {/* 請求元 */}
            <div className="text-sm text-right">
              <p className="font-bold">{COMPANY.name}</p>
              <p>{COMPANY.address}</p>
              <p>TEL: {COMPANY.phone}</p>
              <p>{COMPANY.email}</p>
              <p className="mt-1 text-xs text-gray-500">
                登録番号: {COMPANY.invoiceRegistrationNo}
              </p>
            </div>
          </div>

          {invoice.subject && (
            <p className="mb-2 text-sm">
              <span className="font-bold">件名：</span>
              {invoice.subject}
            </p>
          )}

          {/* ご請求金額 */}
          <div className="bg-primary text-white rounded-lg px-5 py-3 mb-6 flex items-center justify-between">
            <span className="font-bold">ご請求金額（税込）</span>
            <span className="text-2xl font-bold">{formatYen(totals.total)}</span>
          </div>

          {/* 明細テーブル */}
          <table className="w-full text-sm border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 px-2 py-1.5 text-left">日付</th>
                <th className="border border-gray-300 px-2 py-1.5 text-left">内容</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right w-14">数量</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center w-12">単位</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right w-20">単価</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right w-24">金額</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-2 py-1.5 whitespace-nowrap text-xs">
                    {item.date
                      ? new Date(item.date).toLocaleDateString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                        })
                      : ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5">
                    {item.description || '　'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {item.quantity || ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center text-xs">
                    {item.unit}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {item.unitPrice ? formatYen(item.unitPrice) : ''}
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">
                    {formatYen(lineAmount(item))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 合計 */}
          <div className="flex justify-end mb-6">
            <div className="w-64 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>小計</span>
                <span>{formatYen(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>消費税（{Math.round(invoice.taxRate * 100)}%）</span>
                <span>{formatYen(totals.tax)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-primary text-base">
                <span>合計</span>
                <span>{formatYen(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* 振込先 */}
          <div className="border border-gray-300 rounded-lg p-3 mb-4 text-sm bg-gray-50">
            <p className="font-bold mb-1">お振込先</p>
            <p>
              {COMPANY.bank.name} {COMPANY.bank.branch}／{COMPANY.bank.type}{' '}
              {COMPANY.bank.number}
            </p>
            <p>名義：{COMPANY.bank.holder}</p>
            <p className="text-xs text-gray-500 mt-1">
              お支払期限：{formatDateJa(invoice.dueDate) || '—'}
            </p>
          </div>

          {invoice.notes && (
            <div className="text-sm">
              <p className="font-bold mb-1">備考</p>
              <p className="whitespace-pre-wrap text-gray-700">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
