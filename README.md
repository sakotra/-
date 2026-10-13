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

## 📧 Outlook / Excel 連携（お問い合わせフォーム）

お問い合わせフォーム（`/contact`）の送信内容は、Microsoft Graph API 経由で Outlook からメール送信され、設定すると OneDrive 上の Excel にも1行ずつ記録されます。

1. Azure Portal → **Microsoft Entra ID** → **アプリの登録** → 新規登録
2. **API のアクセス許可** で Microsoft Graph の **アプリケーションの許可** `Mail.Send`（Excel 連携も使う場合は `Files.ReadWrite.All` も）を追加し、管理者の同意を付与
3. **証明書とシークレット** でクライアントシークレットを作成
4. `.env.example` を `.env.local` にコピーして値を設定（Vercel の場合は Environment Variables に設定）

```bash
cp .env.example .env.local
```

| 変数 | 内容 |
| --- | --- |
| `MS_TENANT_ID` | ディレクトリ (テナント) ID |
| `MS_CLIENT_ID` | アプリケーション (クライアント) ID |
| `MS_CLIENT_SECRET` | クライアントシークレットの値 |
| `MS_SENDER_EMAIL` | 送信元の Outlook メールボックス |
| `CONTACT_TO_EMAIL` | お問い合わせの送信先（省略時は会社メール） |
| `MS_EXCEL_OWNER_EMAIL` | （Excel）ファイルがある OneDrive の所有者（省略時は `MS_SENDER_EMAIL`） |
| `MS_EXCEL_FILE_PATH` | （Excel）OneDrive ルートからのファイルパス |
| `MS_EXCEL_TABLE_NAME` | （Excel）記録先のテーブル名 |

### Excel の準備

1. OneDrive に `.xlsx` ファイルを作成し、1行目に次の見出しを入力
   `受付日時 / お名前 / 会社名 / メールアドレス / 電話番号 / お問い合わせ内容`
2. 見出し行を選択して **挿入 → テーブル**（「先頭行をテーブルの見出しとして使用する」にチェック）
3. **テーブル デザイン** でテーブル名（例: `Inquiries`）を設定し、`MS_EXCEL_TABLE_NAME` に指定

Excel 関連の変数が未設定の場合、Excel への記録はスキップされます。Excel への記録に失敗してもメール送信が成功していれば受付は完了扱いとなり、エラーはサーバーログに出力されます。

> `Mail.Send` / `Files.ReadWrite.All` はテナント全体に及ぶ権限です。必要に応じて Exchange の **アプリケーション アクセス ポリシー** で送信元メールボックスを制限してください。

## 📦 ビルド

```bash
npm run build
npm start
```

## 🔍 型チェック

```bash
npm run type-check
```

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
