import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SolanaContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSolanaContext = (): WidgetProviderContext => {
  const context = useContext(SolanaContext)
  return context || defaultContextValue
}
