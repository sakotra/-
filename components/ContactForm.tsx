'use client'

import { FormEvent, useState } from 'react'

type Status = 'idle' | 'sending' | 'success' | 'error'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || '送信に失敗しました')
      }
      form.reset()
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="block text-sm font-bold text-gray-700 mb-1">
            お名前 <span className="text-red-500">*</span>
          </span>
          <input name="name" required className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-bold text-gray-700 mb-1">会社名</span>
          <input name="company" className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-bold text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </span>
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-bold text-gray-700 mb-1">電話番号</span>
          <input name="phone" type="tel" className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-bold text-gray-700 mb-1">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </span>
        <textarea name="message" required rows={6} maxLength={5000} className={inputClass} />
      </label>

      {status === 'success' && (
        <p className="text-green-700">お問い合わせを受け付けました。担当者よりご連絡いたします。</p>
      )}
      {status === 'error' && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-secondary hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
      >
        {status === 'sending' ? '送信中...' : '送信する'}
      </button>
    </form>
  )
}
