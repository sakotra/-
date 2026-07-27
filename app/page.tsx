import Hero from '@/components/Hero'
import ServiceCard from '@/components/ServiceCard'
import { SERVICES, COMPANY } from '@/lib/constants'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">主なサービス</h2>
          <p className="text-gray-600 text-lg">様々なニーズに対応した運送サービスをご提供します</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </section>

      {/* Company Info Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">私たちについて</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                左近トランスポート株式会社は、大阪を拠点に事業を展開する運送・物流企業です。
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                創業以来、信頼と安全を第一に、顧客満足度の向上に取り組んでおります。
              </p>
              <Link
                href="/about"
                className="inline-block bg-primary hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                詳しく知る
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary to-blue-900 rounded-lg p-8 text-white">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-1">住所</h3>
                  <p>{COMPANY.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-1">電話番号</h3>
                  <p>{COMPANY.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-1">メールアドレス</h3>
                  <p>{COMPANY.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-1">担当者</h3>
                  <p>{COMPANY.contact.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">ご質問やご不明な点はお気軽に</h2>
          <p className="text-lg mb-8">お電話またはメール、お問い合わせフォームからお気軽にご連絡ください</p>
          <Link
            href="/contact"
            className="inline-block bg-white hover:bg-gray-100 text-secondary font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            お問い合わせ
          </Link>
        </div>
      </section>
    </>
  )
}
