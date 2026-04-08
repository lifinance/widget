import { lazy, Suspense } from 'react'
import { ClientOnly } from './ClientOnly'

const LiFiWidgetLazy = lazy(async () => {
  const module = await import('@lifi/widget')

  return { default: module.LiFiWidget }
})

export function LiFiWidget() {
  const config = {
    appearance: 'light' as const,
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  }

  return (
    <ClientOnly fallback={<div style={{ minHeight: 682 }} />}>
      <Suspense fallback={<div style={{ minHeight: 682 }} />}>
        <LiFiWidgetLazy config={config} integrator="react-router-7-example" />
      </Suspense>
    </ClientOnly>
  )
}
