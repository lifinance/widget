import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SolanaContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSolanaContext = () => {
  const context = useContext(SolanaContext)
  return context || defaultContextValue
}
