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
  established: '2015年4月',
  capital: '1,000万円',
  employees: '25名',
  business: '一般貨物自動車運送事業',
}

// 会社概要テーブル
export const COMPANY_PROFILE = [
  { label: '会社名', value: COMPANY.name },
  { label: '所在地', value: COMPANY.address },
  { label: '電話番号', value: COMPANY.phone },
  { label: 'メール', value: COMPANY.email },
  { label: '代表者', value: COMPANY.contact.name },
  { label: '設立', value: COMPANY.established },
  { label: '資本金', value: COMPANY.capital },
  { label: '従業員数', value: COMPANY.employees },
  { label: '事業内容', value: COMPANY.business },
]

// 選ばれる理由
export const STRENGTHS = [
  {
    title: '安全第一の運行管理',
    description: '徹底した車両点検とドライバー教育で、大切な荷物を安全にお届けします。',
    icon: '🛡️',
  },
  {
    title: '柔軟な対応力',
    description: '小口配送から専用チャーター便まで、お客様のニーズに合わせて柔軟に対応します。',
    icon: '🤝',
  },
  {
    title: '全国ネットワーク',
    description: '大阪を拠点に全国への配送網を確保。スピーディーな輸送を実現します。',
    icon: '🗾',
  },
]

// 料金プラン
export const PRICING = [
  {
    name: '小口配送',
    price: '5,000円〜',
    unit: '/ 1件',
    features: ['府内近距離配送', '当日・翌日対応', '小口貨物向け'],
  },
  {
    name: 'チャーター便',
    price: '20,000円〜',
    unit: '/ 1台',
    features: ['専用車両で直送', '積み込みから配送まで', '時間指定可能'],
    highlighted: true,
  },
  {
    name: '定期便',
    price: 'お見積り',
    unit: '',
    features: ['ルート配送', '月額契約でお得', '専任担当者が対応'],
  },
]

// ナビゲーション
export const NAVIGATION = [
  { label: 'ホーム', href: '/' },
  { label: '会社情報', href: '/about' },
  { label: 'サービス', href: '/services' },
  { label: 'お問い合わせ', href: '/contact' },
]

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
