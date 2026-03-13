import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const TronContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useTronContext = () => {
  const context = useContext(TronContext)
  return context || defaultContextValue
}
