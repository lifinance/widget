import type { WidgetConfig } from '@lifi/widget'
import type { FC, ReactNode } from 'react'

export interface OnRampProviderMeta {
  id: string
  name: string
  description: string
  features: string[]
  recommended?: boolean
}

export interface LoadedOnRampAdapter {
  meta: OnRampProviderMeta
  Wrap: FC<{
    widgetConfig: WidgetConfig
    children: ReactNode
  }>
}
