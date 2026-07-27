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
