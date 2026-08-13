// 会社情報
export const COMPANY = {
  name: '左近トランスポート株式会社',
  nameKana: 'サコン トランスポート',
  address: '大阪府大阪市北区西天満3-11-3',
  phone: '06-4301-5211',
  email: 't.sakon@sakon-transport.com',
  contact: {
    name: '左近 大樹',
    nameKana: 'サコン タイキ',
  },
  businessHours: {
    weekday: '9:00 - 18:00',
    saturday: '9:00 - 12:00',
    sunday: '休業',
  },
  // 適格請求書発行事業者（インボイス）登録番号
  invoiceRegistrationNo: 'T1234567890123',
  // 振込先情報
  bank: {
    name: '三菱UFJ銀行',
    branch: '梅田支店',
    type: '普通',
    number: '1234567',
    holder: 'サコントランスポート（カ',
  },
}

// ナビゲーション
export const NAVIGATION = [
  { label: 'ホーム', href: '/' },
  { label: '会社情報', href: '/about' },
  { label: 'サービス', href: '/services' },
  { label: '請求書作成', href: '/invoices/create' },
  { label: 'お問い合わせ', href: '/contact' },
]

// 消費税率
export const TAX_RATES = [
  { label: '10%（標準）', value: 0.1 },
  { label: '8%（軽減）', value: 0.08 },
  { label: '非課税（0%）', value: 0 },
]

// よく使う単位
export const UNITS = ['件', '個', '台', 'ケース', 'kg', 'km', '時間', '日', '式']

// サービス一覧
export const SERVICES = [
  {
    id: 1,
    title: '一般貨物運送',
    description: '小口から大口まで、幅広い貨物の運送に対応しています。',
    icon: '🚚',
  },
  {
    id: 2,
    title: '特積み運送',
    description: '精密機器や重量物など、特別な取り扱いが必要な商品も安全に運送します。',
    icon: '📦',
  },
  {
    id: 3,
    title: 'チャーター便',
    description: '専用車両で目的地まで直送。柔軟な対応が可能です。',
    icon: '🛣️',
  },
  {
    id: 4,
    title: 'グローバル物流',
    description: '国内外への海外輸送サービスも承っています。',
    icon: '✈️',
  },
]

// SNS
export const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: 'FaFacebook',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'FaTwitter',
  },
]
