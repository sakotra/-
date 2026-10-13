import ContactForm from '@/components/ContactForm'
import { COMPANY } from '@/lib/constants'

export const metadata = {
  title: `お問い合わせ | ${COMPANY.name}`,
}

export default function ContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">お問い合わせ</h1>
        <p className="text-gray-600 text-lg">下記フォームよりお気軽にお問い合わせください</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <div className="bg-gradient-to-br from-primary to-blue-900 rounded-lg p-8 text-white space-y-4 h-fit">
          <div>
            <h2 className="text-sm font-bold text-secondary mb-1">電話番号</h2>
            <p>{COMPANY.phone}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-secondary mb-1">メールアドレス</h2>
            <p>{COMPANY.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-secondary mb-1">営業時間</h2>
            <p>平日 {COMPANY.businessHours.weekday}</p>
            <p>土曜 {COMPANY.businessHours.saturday}</p>
            <p>日曜 {COMPANY.businessHours.sunday}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
