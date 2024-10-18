import { Widget } from '@/components/Widget'
import type { WidgetConfig } from '@lifi/widget'
import { WidgetSkeleton } from '@lifi/widget'
import { Inter } from 'next/font/google'

const _inter = Inter({ subsets: ['latin'] })

export default function PagesExample() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return (
    <main>
      <Widget config={config} fallback={<WidgetSkeleton config={config} />} />
    </main>
  )
}
