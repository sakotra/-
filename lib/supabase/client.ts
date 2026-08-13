'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './config'

// ブラウザ（クライアントコンポーネント）用の Supabase クライアント。
// 設定されていない場合は null を返し、呼び出し側でガードする。
export function createClient() {
  const { url, anonKey } = getSupabaseEnv()
  if (!url || !anonKey) return null
  return createBrowserClient(url, anonKey)
}
