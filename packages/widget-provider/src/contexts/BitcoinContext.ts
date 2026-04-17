import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const BitcoinContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useBitcoinContext = (): WidgetProviderContext => {
  const context = useContext(BitcoinContext)
  return context || defaultContextValue
}
