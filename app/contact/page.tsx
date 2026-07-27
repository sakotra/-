'use client'

import { useState, FormEvent } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { COMPANY } from '@/lib/constants'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // 実際の送信処理はバックエンド実装時に接続してください
    setSubmitted(true)
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">お問い合わせ</h1>
          <p className="text-gray-200">ご質問・ご相談はお気軽にご連絡ください</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">連絡先</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-secondary text-2xl mt-1">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">所在地</h3>
                  <p className="text-gray-600">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-secondary text-2xl mt-1">
                  <FaPhone />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">電話番号</h3>
                  <a href={`tel:${COMPANY.phone}`} className="text-gray-600 hover:text-primary">
                    {COMPANY.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-secondary text-2xl mt-1">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">メールアドレス</h3>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-gray-600 hover:text-primary break-all"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-secondary text-2xl mt-1">
                  <FaClock />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">営業時間</h3>
                  <p className="text-gray-600">平日 {COMPANY.businessHours.weekday}</p>
                  <p className="text-gray-600">土曜 {COMPANY.businessHours.saturday}</p>
                  <p className="text-gray-400">日曜・祝日 {COMPANY.businessHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">お問い合わせフォーム</h2>
            {submitted ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  お問い合わせありがとうございます
                </h3>
                <p className="text-gray-600">
                  内容を確認のうえ、担当者より折り返しご連絡いたします。
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-5"
              >
                <div>
                  <label htmlFor="name" className="block font-bold text-gray-700 mb-1">
                    お名前 <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-bold text-gray-700 mb-1">
                    メールアドレス <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-bold text-gray-700 mb-1">
                    電話番号
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-bold text-gray-700 mb-1">
                    お問い合わせ内容 <span className="text-secondary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  送信する
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
