import type { Metadata } from 'next'
import Link from 'next/link'
import ServiceCard from '@/components/ServiceCard'
import { COMPANY, SERVICES, PRICING } from '@/lib/constants'

export const metadata: Metadata = {
  title: `サービス | ${COMPANY.name}`,
  description: `${COMPANY.name}が提供する運送・物流サービスと料金プランをご紹介します。`,
}

export default function Services() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">サービス</h1>
          <p className="text-gray-200">お客様のニーズに合わせた多彩な運送サービス</p>
        </div>
      </section>

      {/* Service List */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-12 text-center">
          サービス一覧
        </h2>
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

      {/* Pricing */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">
            料金プラン
          </h2>
          <p className="text-center text-gray-600 mb-12">
            ※料金は目安です。詳しくはお問い合わせください。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg p-8 flex flex-col ${
                  plan.highlighted
                    ? 'bg-primary text-white shadow-xl md:-translate-y-2'
                    : 'bg-gray-50 text-gray-800 shadow-lg'
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    plan.highlighted ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-80">{plan.unit}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className={plan.highlighted ? 'text-secondary' : 'text-accent'}>
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`text-center font-bold py-2 px-6 rounded-lg transition-colors duration-300 ${
                    plan.highlighted
                      ? 'bg-secondary hover:bg-orange-600 text-white'
                      : 'bg-primary hover:bg-blue-900 text-white'
                  }`}
                >
                  お問い合わせ
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">まずはお気軽にご相談ください</h2>
          <p className="text-lg mb-8">お客様に最適な運送プランをご提案いたします</p>
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
