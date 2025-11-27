import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types'
import { defaultContextValue } from './defaultContextValue'

export const SuiContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSuiContext = () => {
  const context = useContext(SuiContext)
  return context || defaultContextValue
}
