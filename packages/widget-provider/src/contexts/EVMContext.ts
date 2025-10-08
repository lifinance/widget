import { createContext, useContext } from 'react'
import type { WalletProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

export const EVMContext =
  createContext<WalletProviderContext>(defaultContextValue)

export const useEVMContext = () => {
  const context = useContext(EVMContext)
  return context || defaultContextValue
}
