import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SuiContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSuiContext = (): WidgetProviderContext => {
  const context = useContext(SuiContext)
  return context || defaultContextValue
}
