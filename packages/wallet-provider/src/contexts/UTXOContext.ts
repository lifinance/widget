import { createContext, useContext } from 'react'
import type { WalletProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const UTXOContext =
  createContext<WalletProviderContext>(defaultContextValue)

export const useUTXOContext = () => {
  const context = useContext(UTXOContext)
  return context || defaultContextValue
}
