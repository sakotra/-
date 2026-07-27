import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { COMPANY } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  title: `${COMPANY.name} | 運送・物流サービス`,
  description: `${COMPANY.name}は大阪を拠点に、全国への運送・物流サービスを提供しています。`,
  keywords: ['運送', '物流', '配送', 'トランスポート', '大阪'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
