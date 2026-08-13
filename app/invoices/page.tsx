'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  listInvoices,
  deleteInvoice,
  SavedInvoiceRow,
} from '@/lib/supabase/invoices'
import { OPEN_INVOICE_KEY } from '@/components/InvoiceEditor'
import { formatYen, formatDateJa } from '@/lib/invoice'

export default function SavedInvoicesPage() {
  const router = useRouter()
  const [rows, setRows] = useState<SavedInvoiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function reload() {
    setLoading(true)
    const { rows, error } = await listInvoices()
    setRows(rows)
    setError(error || '')
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [])

  function openInvoice(row: SavedInvoiceRow) {
    try {
      sessionStorage.setItem(OPEN_INVOICE_KEY, JSON.stringify(row.data))
    } catch {
      /* 保存不可でも遷移は行う */
    }
    router.push('/invoices/create')
  }

  async function remove(id: string) {
    if (!confirm('この請求書を削除しますか？')) return
    const { error } = await deleteInvoice(id)
    if (error) {
      alert('削除に失敗しました：' + error)
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
            保存済み請求書
          </h1>
          <p className="text-gray-600">クラウドに保存した請求書の一覧です。</p>
        </div>
        <Link
          href="/invoices/create"
          className="bg-secondary hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          ＋ 新規作成
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">読み込み中…</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          読み込みに失敗しました：{error}
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow p-12 text-center">
          <div className="text-5xl mb-4">🧾</div>
          <p className="text-gray-600 mb-6">保存された請求書はまだありません。</p>
          <Link
            href="/invoices/create"
            className="inline-block bg-primary hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            請求書を作成する
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-bold">請求書番号</th>
                <th className="text-left px-4 py-3 font-bold">請求先</th>
                <th className="text-left px-4 py-3 font-bold hidden sm:table-cell">
                  発行日
                </th>
                <th className="text-right px-4 py-3 font-bold">金額</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs">
                    {row.invoice_no || '—'}
                  </td>
                  <td className="px-4 py-3">{row.client_name || '（未入力）'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                    {formatDateJa(row.issue_date || '') || '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-primary">
                    {formatYen(row.total)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openInvoice(row)}
                      className="text-primary hover:underline mr-4"
                    >
                      開く
                    </button>
                    <button
                      onClick={() => remove(row.id)}
                      className="text-red-500 hover:underline"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
