import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseEnv } from './config'

// サーバー（Route Handler / Server Component）用の Supabase クライアント。
export function createClient() {
  const { url, anonKey } = getSupabaseEnv()
  if (!url || !anonKey) return null

  const cookieStore = cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component からは cookie を書き込めない。
          // セッション更新は middleware が担うため、ここでは無視してよい。
        }
      },
    },
  })
}
