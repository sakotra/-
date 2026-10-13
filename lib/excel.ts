// Microsoft Graph API 経由で OneDrive 上の Excel テーブルに行を追加する
import { graphPost } from '@/lib/microsoftGraph'

export function isExcelConfigured(): boolean {
  return Boolean(process.env.MS_EXCEL_FILE_PATH && process.env.MS_EXCEL_TABLE_NAME)
}

// values はテーブルの列順に並べる
export async function appendExcelRow(values: (string | number)[]): Promise<void> {
  const owner = process.env.MS_EXCEL_OWNER_EMAIL || process.env.MS_SENDER_EMAIL
  const filePath = process.env.MS_EXCEL_FILE_PATH
  const tableName = process.env.MS_EXCEL_TABLE_NAME
  if (!owner || !filePath || !tableName) {
    throw new Error(
      'Excel連携の環境変数が未設定です: MS_EXCEL_OWNER_EMAIL(またはMS_SENDER_EMAIL), MS_EXCEL_FILE_PATH, MS_EXCEL_TABLE_NAME'
    )
  }

  const encodedPath = filePath
    .replace(/^\/+/, '')
    .split('/')
    .map(encodeURIComponent)
    .join('/')

  await graphPost(
    `/users/${encodeURIComponent(owner)}/drive/root:/${encodedPath}:/workbook/tables/${encodeURIComponent(tableName)}/rows`,
    { values: [values] }
  )
}
