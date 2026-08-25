import { createContext, use } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const StellarContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useStellarContext = (): WidgetProviderContext => {
  const context = use(StellarContext)
  return context || defaultContextValue
}
