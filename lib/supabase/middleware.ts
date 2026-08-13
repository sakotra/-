import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseEnv } from './config'

// 保護対象のパス（ログイン必須）
const PROTECTED_PREFIXES = ['/invoices']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const { url, anonKey } = getSupabaseEnv()
  // 未設定なら認証を行わず素通し（既存ツールはそのまま使える）
  if (!url || !anonKey) return supabaseResponse

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // セッションを更新（getUser でリフレッシュ）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p))

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
