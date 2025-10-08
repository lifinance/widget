import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const BitcoinContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useBitcoinContext = () => {
  const context = useContext(BitcoinContext)
  return context || defaultContextValue
}
