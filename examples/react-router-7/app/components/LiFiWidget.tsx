import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget as LiFiWidgetComponent, WidgetSkeleton } from '@lifi/widget'
import { ClientOnly } from './ClientOnly'

export function LiFiWidget() {
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
    <ClientOnly fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidgetComponent
        config={config}
        integrator="remix-to-react-router-7-example"
      />
    </ClientOnly>
  )
}
