// Microsoft Graph API 経由で Outlook からメールを送信する
import { graphPost } from '@/lib/microsoftGraph'

export type OutlookMail = {
  to: string
  subject: string
  body: string
  replyTo?: string
}

export async function sendOutlookMail(mail: OutlookMail): Promise<void> {
  const sender = process.env.MS_SENDER_EMAIL
  if (!sender) {
    throw new Error('Outlook連携の環境変数が未設定です: MS_SENDER_EMAIL')
  }

  await graphPost(`/users/${encodeURIComponent(sender)}/sendMail`, {
    message: {
      subject: mail.subject,
      body: { contentType: 'Text', content: mail.body },
      toRecipients: [{ emailAddress: { address: mail.to } }],
      ...(mail.replyTo && {
        replyTo: [{ emailAddress: { address: mail.replyTo } }],
      }),
    },
    saveToSentItems: true,
  })
}
