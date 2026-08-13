'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { COMPANY } from '@/lib/constants'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.9 2.9 14.7 2 12 2 6.98 2 2.9 6.06 2.9 11.1S6.98 20.2 12 20.2c5.8 0 9.64-4.07 9.64-9.8 0-.66-.07-1.16-.16-1.66H12z"
      />
    </svg>
  )
}

function LoginInner() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/invoices/create'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()
  const configured = Boolean(supabase)

  async function signInWithGoogle() {
    if (!supabase) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
      },
    })
    if (error) {
      setError('ログインを開始できませんでした。時間をおいて再度お試しください。')
      setLoading(false)
    }
    // 成功時は Google へリダイレクトされる
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-24">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-3">🚚</div>
        <h1 className="text-2xl font-bold text-primary mb-1">ログイン</h1>
        <p className="text-sm text-gray-600 mb-8">
          {COMPANY.name}の請求書作成システム
        </p>

        {configured ? (
          <>
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 disabled:opacity-60 font-bold py-3 rounded-lg transition-colors"
            >
              <GoogleIcon />
              {loading ? 'リダイレクト中…' : 'Googleでログイン'}
            </button>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <p className="mt-6 text-xs text-gray-400">
              ログインすると、請求書をアカウントごとにクラウド保存できます。
            </p>
          </>
        ) : (
          <div className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <p className="font-bold mb-1">ログインは現在利用できません</p>
            <p>
              Supabase の設定（環境変数）が未完了です。管理者による設定が必要です。
              設定が完了するまでは、ログインなしで請求書作成をご利用いただけます。
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-24 text-center text-gray-500">読み込み中…</div>}>
      <LoginInner />
    </Suspense>
  )
}
