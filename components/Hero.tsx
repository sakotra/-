'use client'

import Image from 'next/image'
import Link from 'next/link'

// 写真に差し替える場合は public/images/ に置き、このパスを変更してください（例: /images/hero-osaka-2035.jpg）
const HERO_IMAGE = '/images/hero-osaka-2035.svg'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white py-20 md:py-32">
      <Image
        src={HERO_IMAGE}
        alt="2035年の大阪。大阪城上空から梅田の高層ビル群、中之島、大阪湾の夢洲を望む。高速道路を車や配送車が走り、空には配送ドローン"
        fill
        priority
        unoptimized={HERO_IMAGE.endsWith('.svg')}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/40 to-primary/60" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 [text-shadow:0_2px_12px_rgba(0,20,50,0.6)]">信頼できる運送パートナー</h2>
        <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto [text-shadow:0_1px_8px_rgba(0,20,50,0.7)]">
          左近トランスポート株式会社は、大阪を拠点に全国への安全で信頼できる運送サービスを提供しています。
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            お問い合わせ
          </Link>
          <Link
            href="/services"
            className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            サービス詳細
          </Link>
        </div>
      </div>
    </section>
  )
}
