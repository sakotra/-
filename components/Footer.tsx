'use client'

import Link from 'next/link'
import { COMPANY, NAVIGATION } from '@/lib/constants'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">{COMPANY.name}</h3>
            <p className="text-sm text-gray-300 mb-4">{COMPANY.nameKana}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>{COMPANY.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone />
                <a href={`tel:${COMPANY.phone}`} className="hover:text-secondary">
                  {COMPANY.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-secondary">
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-secondary">メニュー</h4>
            <ul className="space-y-2 text-sm">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-secondary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-bold mb-4 text-secondary">営業時間</h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold">平日</p>
                <p>{COMPANY.businessHours.weekday}</p>
              </div>
              <div>
                <p className="font-semibold">土曜日</p>
                <p>{COMPANY.businessHours.saturday}</p>
              </div>
              <div>
                <p className="font-semibold">日曜日</p>
                <p className="text-gray-400">{COMPANY.businessHours.sunday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-600 mb-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {currentYear} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
