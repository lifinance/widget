import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const TronContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useTronContext = (): WidgetProviderContext => {
  const context = useContext(TronContext)
  return context || defaultContextValue
}
