# 左近トランスポート株式会社 - ホームページ

運送会社向けの現代的で保守性の高いホームページです。

## 🚀 技術スタック

- **フロントエンド**: React 18 + Next.js 14
- **言語**: TypeScript
- **スタイル**: Tailwind CSS
- **デプロイ**: Vercel推奨

## 📋 プロジェクト構造

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   ├── about/               # 会社情報
│   ├── services/            # サービス内容
│   ├── contact/             # お問い合わせ
│   └── api/                 # APIエンドポイント
├── components/              # 再利用可能なコンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ...
├── lib/                     # ユーティリティ関数
│   └── constants.ts         # 定数定義
├── public/                  # 静的ファイル
└── styles/                  # グローバルスタイル
```

## 🛠️ セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```

### 3. ブラウザでアクセス
```
http://localhost:3000
```

## 📦 ビルド

```bash
npm run build
npm start
```

## 🔍 型チェック

```bash
npm run type-check
```

## 🧾 軽貨物特化 AI請求書作成（NEW）

軽貨物運送に特化した請求書作成ツールを搭載しています（`/invoices/create`）。

### 主な機能
- **AIによる明細自動生成**: 「1月5日 大阪市内 10件 800円」のように配送内容を自然文で入力すると、Claude が請求明細（日付・内容・数量・単位・単価）に自動変換します。
- **自動計算**: 小計・消費税（10% / 8% / 非課税）・合計を自動計算。
- **明細の手動編集**: 行の追加・削除、各項目の編集に対応。
- **印刷 / PDF保存**: 請求書レイアウトをそのまま印刷・PDF出力（インボイス登録番号・振込先を表示）。
- **下書き自動保存**: 入力内容をブラウザに自動保存。

### AI機能の有効化
AI明細生成には Anthropic API キーが必要です。環境変数に設定してください：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

未設定の場合でも、請求書の手動作成・計算・印刷はそのまま利用できます。
使用モデル: `claude-opus-5`（構造化出力で明細を厳密に生成）。

## 🔐 ログイン & クラウド保存（Google / Supabase）

Google ログインで利用者を認証し、請求書を**アカウントごとにクラウド保存**できます。
`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定すると有効化され、
`/invoices/*`（請求書作成・一覧）はログイン必須になります。**未設定の場合はログインなしで利用可能**です。

### セットアップ手順

1. **Supabase プロジェクト作成** — [supabase.com](https://supabase.com) で新規プロジェクトを作成。
2. **DBスキーマの適用** — ダッシュボードの「SQL Editor」で `supabase/schema.sql` を実行（請求書テーブルと行レベルセキュリティを作成）。
3. **Google ログインの有効化** — [Google Cloud Console](https://console.cloud.google.com) で OAuth クライアントID/シークレットを発行し、Supabase の「Authentication → Providers → Google」に設定。
   - Google 側の「承認済みのリダイレクト URI」に次を追加：
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Supabase の「Authentication → URL Configuration → Site URL / Redirect URLs」に本番URLと `http://localhost:3000` を追加。
4. **環境変数の設定** — `.env.local.example` を `.env.local` にコピーして値を設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 認証まわりのファイル構成
- `middleware.ts` — セッション更新と `/invoices/*` のログイン保護
- `app/login/` — ログイン画面（Googleボタン）
- `app/auth/callback/` — OAuth コールバック
- `app/auth/signout/` — ログアウト
- `lib/supabase/` — Supabase クライアント（browser/server）と請求書CRUD
- `app/invoices/` — 保存済み請求書一覧
- `supabase/schema.sql` — DBスキーマ（RLS付き）

## 📝 ページ構成

### ホームページ (/)
- ヒーロー画像
- サービス紹介
- 会社情報概要
- 問い合わせ案内

### 会社情報 (/about)
- 会社概要
- アクセス情報
- 採用情報

### サービス内容 (/services)
- サービス一覧
- 料金表
- 実績

### お問い合わせ (/contact)
- 問い合わせフォーム
- 連絡先一覧
- 営業時間

## 📞 会社情報

- **会社名**: 左近トランスポート株式会社
- **住所**: 大阪府大阪市北区西天満3-11-3
- **電話**: 06-4301-5211
- **メール**: t.sakon@sakon-transport.com
- **担当者**: 左近 大樹

## 📄 ライセンス

プライベートプロジェクト
