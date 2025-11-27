import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types'
import { defaultContextValue } from './defaultContextValue'

export const BitcoinContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useBitcoinContext = () => {
  const context = useContext(BitcoinContext)
  return context || defaultContextValue
}
