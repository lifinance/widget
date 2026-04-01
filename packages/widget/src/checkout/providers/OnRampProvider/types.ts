import type { FC, ReactNode } from 'react'
import type { WidgetConfig } from '../../../types/widget.js'

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

export interface OnRampFlowValue {
  openDepositFlow: () => void
  close: () => void
  isOpen: boolean
  isLoading: boolean
  error: string | null
}
