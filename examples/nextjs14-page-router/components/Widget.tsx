'use client'

import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import type { ReactNode } from 'react'
import { ClientOnly } from './ClientOnly'

interface WidgetProps {
  fallback: ReactNode
  config: Partial<WidgetConfig>
}

export function Widget({ config, fallback }: WidgetProps) {
  return (
    <ClientOnly fallback={fallback}>
      <LiFiWidget
        config={config}
        integrator="nextjs-example"
        providers={[EthereumProvider()]}
      />
    </ClientOnly>
  )
}
