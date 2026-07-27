'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-900 text-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">信頼できる運送パートナー</h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
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
