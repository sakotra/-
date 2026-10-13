// Microsoft Graph API 共通処理（Outlook / Excel 連携で使用）
const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'

const REQUIRED_ENV = ['MS_TENANT_ID', 'MS_CLIENT_ID', 'MS_CLIENT_SECRET'] as const

function getCredentials() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Microsoft連携の環境変数が未設定です: ${missing.join(', ')}`)
  }
  return {
    tenantId: process.env.MS_TENANT_ID!,
    clientId: process.env.MS_CLIENT_ID!,
    clientSecret: process.env.MS_CLIENT_SECRET!,
  }
}

// クライアント資格情報フローでアクセストークンを取得
async function getAccessToken(): Promise<string> {
  const { tenantId, clientId, clientSecret } = getCredentials()
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`アクセストークンの取得に失敗しました (${res.status})`)
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function graphPost(path: string, body: unknown): Promise<void> {
  const token = await getAccessToken()
  const res = await fetch(`${GRAPH_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Graph API呼び出しに失敗しました ${path} (${res.status}): ${await res.text()}`)
  }
}
