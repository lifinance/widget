import { createContext, use } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SuiContext: React.Context<WidgetProviderContext> =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSuiContext = (): WidgetProviderContext => {
  const context = use(SuiContext)
  return context || defaultContextValue
}
