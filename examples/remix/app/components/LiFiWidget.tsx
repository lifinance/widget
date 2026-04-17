import { lazy, Suspense } from 'react'

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
    <Suspense fallback={<div style={{ minHeight: 682 }} />}>
      <LiFiWidgetLazy config={config} integrator="remix-example" />
    </Suspense>
  )
}
