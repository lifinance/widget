import { createContext, use } from 'react'
import type { EthereumProviderContext } from '../types.js'
import { defaultContextValue } from './defaultContextValue.js'

const ethereumDefaultContextValue: EthereumProviderContext = {
  ...defaultContextValue,
  getBytecode: async () => undefined,
  getTransactionCount: async () => undefined,
}

export const EthereumContext: React.Context<EthereumProviderContext> =
  createContext<EthereumProviderContext>(ethereumDefaultContextValue)

export const useEthereumContext = (): EthereumProviderContext => {
  const context = use(EthereumContext)
  return context || ethereumDefaultContextValue
}
