import { createContext, use } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SolanaContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSolanaContext = (): WidgetProviderContext => {
  const context = use(SolanaContext)
  return context || defaultContextValue
}
