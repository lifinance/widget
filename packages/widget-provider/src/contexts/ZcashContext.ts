import { createContext, use } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const ZcashContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useZcashContext = (): WidgetProviderContext => {
  const context = use(ZcashContext)
  return context || defaultContextValue
}
