import { NextResponse } from 'next/server'
import { sendOutlookMail } from '@/lib/outlook'
import { appendExcelRow, isExcelConfigured } from '@/lib/excel'
import { COMPANY } from '@/lib/constants'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactRequest = {
  name?: string
  company?: string
  email?: string
  phone?: string
  message?: string
}

export async function POST(request: Request) {
  let data: ContactRequest
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'リクエストが不正です' }, { status: 400 })
  }

  const name = data.name?.trim() ?? ''
  const email = data.email?.trim() ?? ''
  const message = data.message?.trim() ?? ''
  const company = data.company?.trim() ?? ''
  const phone = data.phone?.trim() ?? ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'お名前・メールアドレス・お問い合わせ内容は必須です' }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email) || message.length > 5000) {
    return NextResponse.json({ error: '入力内容をご確認ください' }, { status: 400 })
  }

  const body = [
    'ホームページのお問い合わせフォームから送信がありました。',
    '',
    `お名前: ${name}`,
    `会社名: ${company || '-'}`,
    `メールアドレス: ${email}`,
    `電話番号: ${phone || '-'}`,
    '',
    '【お問い合わせ内容】',
    message,
  ].join('\n')

  const receivedAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

  const [mailResult, excelResult] = await Promise.allSettled([
    sendOutlookMail({
      to: process.env.CONTACT_TO_EMAIL || COMPANY.email,
      subject: `【お問い合わせ】${name} 様`,
      body,
      replyTo: email,
    }),
    isExcelConfigured()
      ? appendExcelRow([receivedAt, name, company, email, phone, message])
      : Promise.resolve(),
  ])

  // Excel への記録失敗はログのみ（メールが届いていれば受付成功とする）
  if (excelResult.status === 'rejected') {
    console.error(excelResult.reason)
  }
  if (mailResult.status === 'rejected') {
    console.error(mailResult.reason)
    return NextResponse.json(
      { error: '送信に失敗しました。お手数ですがお電話にてご連絡ください。' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
