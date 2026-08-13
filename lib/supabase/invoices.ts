'use client'

import { createClient } from './client'
import type { InvoiceData } from '@/lib/invoice'

export interface SavedInvoiceRow {
  id: string
  invoice_no: string | null
  client_name: string | null
  issue_date: string | null
  total: number
  data: InvoiceData
  created_at: string
  updated_at: string
}

// ログイン中のユーザーを取得（未ログイン/未設定なら null）
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

// 請求書をクラウドに保存（新規レコードとして）
export async function saveInvoice(
  invoice: InvoiceData,
  total: number
): Promise<{ error: string | null }> {
  const supabase = createClient()
  if (!supabase) return { error: 'ログイン機能が未設定です。' }

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  if (!userId) return { error: 'ログインが必要です。' }

  const { error } = await supabase.from('invoices').insert({
    user_id: userId,
    invoice_no: invoice.invoiceNo || null,
    client_name: invoice.clientName || null,
    issue_date: invoice.issueDate || null,
    total,
    data: invoice,
  })

  return { error: error ? error.message : null }
}

// 保存済み一覧を取得
export async function listInvoices(): Promise<{
  rows: SavedInvoiceRow[]
  error: string | null
}> {
  const supabase = createClient()
  if (!supabase) return { rows: [], error: 'ログイン機能が未設定です。' }

  const { data, error } = await supabase
    .from('invoices')
    .select('id, invoice_no, client_name, issue_date, total, data, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) return { rows: [], error: error.message }
  return { rows: (data as SavedInvoiceRow[]) ?? [], error: null }
}

// 保存済みを削除
export async function deleteInvoice(id: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  if (!supabase) return { error: 'ログイン機能が未設定です。' }
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  return { error: error ? error.message : null }
}
