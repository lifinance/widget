import type { ChainType, ExtendedChain, SDKProvider } from '@lifi/sdk'

export type WalletConnector = {
  name: string
  id?: string
  uid?: string
  displayName?: string
  icon?: string
}

export interface Account {
  id?: string
  name?: string
  address?: string
  addresses?: readonly string[]
  chainId?: number
  chainType: ChainType
  connector?: WalletConnector
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  isReconnecting: boolean
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected'
}

export type WalletProviderContext = {
  isEnabled: boolean
  isExternalContext: boolean
  isConnected: boolean
  account: Account | null
  sdkProvider: SDKProvider | null
  installedWallets: WalletConnector[]
  isValidAddress: (address: string) => boolean
  connect: (
    connectorIdOrName: string,
    onSuccess?: (address: string, chainId: number) => void
  ) => Promise<void>
  disconnect: () => Promise<void>
  // EVM handlers
  getBytecode?: (
    chainId: number,
    address: string
  ) => Promise<string | undefined>
  getTransactionCount?: (
    chainId: number,
    address: string
  ) => Promise<number | undefined>
}
export interface WalletProviderProps {
  forceInternalWalletManagement?: boolean
  chains: ExtendedChain[]
}
