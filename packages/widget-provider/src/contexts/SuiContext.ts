import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SuiContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSuiContext = () => {
  const context = useContext(SuiContext)
  return context || defaultContextValue
}
