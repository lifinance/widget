import { Widget } from '@/components/Widget'
import type { WidgetConfig } from '@lifi/widget'

// NOTE: The WidgetSkeleton component can not be used currently in Next 13 with the App Router
// as it currently produces some errors
//  - it can be used with the pages router in Next 13 - see pages/pages-example
//  - and it can be used in both the App and Page router in Next 14 - see the nextjs example.
//    upgrading to Next 14 is advisable.
export default function Home() {
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
      <Widget config={config} fallback={<p>loading...</p>} />
    </main>
  )
}
