'use client'

import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'
import type { ReactNode } from 'react'
import { ClientOnly } from './ClientOnly'

interface WidgetProps {
  fallback: ReactNode
  config: Partial<WidgetConfig>
}

export function Widget({ config, fallback }: WidgetProps) {
  return (
    <ClientOnly fallback={fallback}>
      <LiFiWidget config={config} integrator="nextjs-example" />
    </ClientOnly>
  )
}
