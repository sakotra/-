import type { Metadata } from 'next'
import { COMPANY, COMPANY_PROFILE, STRENGTHS } from '@/lib/constants'

export const metadata: Metadata = {
  title: `会社情報 | ${COMPANY.name}`,
  description: `${COMPANY.name}の会社概要、企業理念、選ばれる理由をご紹介します。`,
}

export default function About() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">会社情報</h1>
          <p className="text-gray-200">私たちの理念と歩みをご紹介します</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">企業理念</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          「安全・確実・迅速」をモットーに、お客様の大切な荷物を心を込めてお届けします。
          地域社会に貢献し、信頼される運送企業であり続けることを目指しています。
        </p>
      </section>

      {/* Strengths */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-12 text-center">
            選ばれる理由
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STRENGTHS.map((item) => (
              <div key={item.title} className="text-center px-4">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">会社概要</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <tbody>
              {COMPANY_PROFILE.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <th className="py-4 px-6 font-bold text-primary align-top w-1/3 whitespace-nowrap">
                    {row.label}
                  </th>
                  <td className="py-4 px-6 text-gray-700">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
