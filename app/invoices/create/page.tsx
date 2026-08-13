import type { Metadata } from 'next'
import InvoiceEditor from '@/components/InvoiceEditor'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: `請求書作成 | ${COMPANY.name}`,
  description:
    '軽貨物運送に特化した請求書作成ツール。配送内容をAIが明細化し、消費税を自動計算。そのまま印刷・PDF保存できます。',
}

export default function InvoiceCreatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <div className="no-print mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          請求書作成
        </h1>
        <p className="text-gray-600">
          軽貨物の配送明細をかんたん入力。
          <span className="font-bold text-secondary">AIが配送内容を明細に自動変換</span>
          し、消費税を自動計算します。作成後はそのまま印刷・PDF保存できます。
        </p>
      </div>
      <InvoiceEditor />
    </div>
  )
}
