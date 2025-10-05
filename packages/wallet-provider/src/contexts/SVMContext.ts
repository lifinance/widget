import { createContext, useContext } from 'react'
import type { WalletProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const SVMContext =
  createContext<WalletProviderContext>(defaultContextValue)

export const useSVMContext = () => {
  const context = useContext(SVMContext)
  return context || defaultContextValue
}
