import { createContext, useContext } from 'react'
import type { WalletProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const MVMContext =
  createContext<WalletProviderContext>(defaultContextValue)

export const useMVMContext = () => {
  const context = useContext(MVMContext)
  return context || defaultContextValue
}
