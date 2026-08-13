// Supabase の環境変数と設定状態のヘルパー
// 未設定でもアプリが壊れないよう、判定関数を用意する。

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return { url, anonKey }
}

// NEXT_PUBLIC_ 変数はビルド時にクライアントへインライン展開されるため、
// サーバー・クライアント双方でこの関数を利用できる。
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv()
  return Boolean(url && anonKey)
}
