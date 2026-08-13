import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Google OAuth 後のコールバック。認可コードをセッションに交換する。
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/invoices/create'

  if (code) {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code)
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`)
}
