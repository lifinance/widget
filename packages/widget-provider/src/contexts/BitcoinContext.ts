import { createContext, use } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const BitcoinContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useBitcoinContext = (): WidgetProviderContext => {
  const context = use(BitcoinContext)
  return context || defaultContextValue
}
