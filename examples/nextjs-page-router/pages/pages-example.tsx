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
        border: '1px solid rgb(234, 234, 234)',
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
