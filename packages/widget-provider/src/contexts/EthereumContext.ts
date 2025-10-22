import { createContext, useContext } from 'react'
import type { WidgetProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const EthereumContext =
  createContext<WidgetProviderContext>(defaultContextValue)

export const useEthereumContext = () => {
  const context = useContext(EthereumContext)
  return context || defaultContextValue
}
