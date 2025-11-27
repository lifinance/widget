import { createContext, useContext } from 'react'
import type { EthereumProviderContext } from '../types'
import { defaultContextValue } from './defaultContextValue'

const ethereumDefaultContextValue: EthereumProviderContext = {
  ...defaultContextValue,
  getBytecode: async () => undefined,
  getTransactionCount: async () => undefined,
}

export const EthereumContext = createContext<EthereumProviderContext>(
  ethereumDefaultContextValue
)

export const useEthereumContext = () => {
  const context = useContext(EthereumContext)
  return context || ethereumDefaultContextValue
}
