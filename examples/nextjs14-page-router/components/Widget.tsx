'use client'

import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'

const config: Partial<WidgetConfig> = {
  appearance: 'light',
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
}

export function Widget() {
  return <LiFiWidget config={config} integrator="nextjs-example" />
}
