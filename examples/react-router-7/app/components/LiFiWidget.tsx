import { EVMProvider } from '@lifi/wallet-provider-evm'
import { type WidgetConfig, WidgetSkeleton } from '@lifi/widget'
import { lazy, Suspense } from 'react'

const LiFiWidgetLazy = lazy(async () => {
  const module = await import('@lifi/widget')

  return { default: module.LiFiWidget }
})

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
    <Suspense fallback={<WidgetSkeleton config={config} />}>
      <LiFiWidgetLazy
        config={config}
        integrator="remix-to-react-router-7-example"
        walletProviders={[EVMProvider]}
      />
    </Suspense>
  )
}
