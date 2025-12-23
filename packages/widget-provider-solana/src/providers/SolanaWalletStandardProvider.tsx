import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'
import {
  WalletStandardClient,
  type WalletStandardClientConfig,
} from '../wallet-standard-client.js'

export type SolanaWalletStandardState = ReturnType<
  WalletStandardClient['getState']
> & {
  select: (walletName: string) => Promise<void>
  disconnect: () => Promise<void>
  selectAccount: (address: string) => Promise<void>
}

export const SolanaWalletStandardContext =
  createContext<WalletStandardClient | null>(null)
SolanaWalletStandardContext.displayName = 'SolanaWalletStandardContext'

// Global client singleton
let walletStandardClient: WalletStandardClient | null = null

function getOrCreateSolanaWalletStandardClient(
  config?: WalletStandardClientConfig
): WalletStandardClient {
  if (!walletStandardClient) {
    walletStandardClient = new WalletStandardClient(config)
  }

  return walletStandardClient
}

export function SolanaWalletStandardProvider({
  children,
  config,
}: {
  children: ReactNode
  config?: WalletStandardClientConfig
}) {
  const client = getOrCreateSolanaWalletStandardClient(config)

  return (
    <SolanaWalletStandardContext.Provider value={client}>
      {children}
    </SolanaWalletStandardContext.Provider>
  )
}

export function useSolanaWalletStandard(): SolanaWalletStandardState {
  const client = useContext(SolanaWalletStandardContext)
  if (!client) {
    throw new Error(
      'useSolanaWalletStandard must be used within SolanaWalletStandardProvider'
    )
  }
  const state = useSyncExternalStore(
    (cb) => client.subscribe(cb),
    () => client.getState(),
    () => client.getState()
  )
  const select = useCallback(
    (walletName: string) => client.select(walletName),
    [client]
  )
  const disconnect = useCallback(() => client.disconnect(), [client])
  const selectAccount = useCallback(
    (address: string) => client.selectAccount(address),
    [client]
  )
  return useMemo(
    () => ({
      ...state,
      select,
      disconnect,
      selectAccount,
    }),
    [state, select, disconnect, selectAccount]
  )
}

export function useSolanaWalletStandardContext(): WalletStandardClient | null {
  return useContext(SolanaWalletStandardContext)
}
