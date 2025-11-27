import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types'
import { defaultContextValue } from './defaultContextValue'

export const SolanaContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useSolanaContext = () => {
  const context = useContext(SolanaContext)
  return context || defaultContextValue
}
