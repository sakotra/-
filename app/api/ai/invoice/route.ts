import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// AI が返す明細のJSONスキーマ（構造化出力で厳密に検証）
const ITEMS_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      description: '請求書の明細行の配列',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: '配送日。YYYY-MM-DD形式。不明な場合は空文字。',
          },
          description: {
            type: 'string',
            description: '配送内容・配送先・ルート・作業内容',
          },
          quantity: { type: 'number', description: '数量' },
          unit: {
            type: 'string',
            description: '単位（件・個・台・kg・km・時間・日 など）',
          },
          unitPrice: { type: 'number', description: '単価（円・税抜）' },
        },
        required: ['date', 'description', 'quantity', 'unit', 'unitPrice'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
}

const SYSTEM_PROMPT = `あなたは軽貨物運送業の請求書作成を支援するアシスタントです。
ドライバーや事業者が入力した「配送内容の説明文」を読み取り、請求書の明細行に構造化してください。

ルール:
- 1件の配送・作業を1つの明細行にします。日付・件数・単価が異なるものは別の行に分けます。
- 日付は可能な限り YYYY-MM-DD 形式に変換します。「先週」「今月」など相対表現は、与えられた本日の日付を基準に推定します。年が省略されている場合は本日の年を使います。判断できなければ空文字にします。
- description には配送先・エリア・ルート・積荷・作業内容など、請求先が見て分かる簡潔な内容を入れます。
- 単価は税抜の円で数値のみ（例: 800）。数量に単価の意味が含まれないよう注意します（合計金額しか分からない場合は数量1・単価を合計額にします）。
- 単位は 件・個・台・ケース・kg・km・時間・日・式 から最も適切なものを選びます。軽貨物の配送案件は通常「件」です。
- 説明文にない金額を創作しないでください。単価が不明な行は unitPrice を 0 にします。
- 軽貨物特有の項目（時間チャーター、待機料、高速代の立替、燃料サーチャージ等）も適切に行として分けます。`

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'AI機能は現在利用できません（ANTHROPIC_API_KEY が未設定です）。明細は手動で入力してください。',
      },
      { status: 501 }
    )
  }

  let text = ''
  let today = ''
  try {
    const body = await request.json()
    text = (body.text || '').toString().trim()
    today = (body.today || '').toString().trim()
  } catch {
    return NextResponse.json({ error: 'リクエストの形式が不正です。' }, { status: 400 })
  }

  if (!text) {
    return NextResponse.json(
      { error: '配送内容を入力してください。' },
      { status: 400 }
    )
  }

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: ITEMS_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: `本日の日付: ${today || '不明'}\n\n以下の配送内容を明細に変換してください:\n\n${text}`,
        },
      ],
    } as Anthropic.MessageCreateParamsNonStreaming)

    // 構造化出力によりテキストブロックは有効なJSON
    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'AIから有効な応答が得られませんでした。' },
        { status: 502 }
      )
    }

    const parsed = JSON.parse(textBlock.text)
    const items = Array.isArray(parsed.items) ? parsed.items : []
    return NextResponse.json({ items })
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError
        ? `AIサービスでエラーが発生しました（${err.status}）。`
        : 'AI明細生成に失敗しました。しばらくして再度お試しください。'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
