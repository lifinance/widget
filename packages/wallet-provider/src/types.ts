import type { ChainType, ExtendedChain, SDKProvider } from '@lifi/sdk'

export type WalletConnector = {
  id?: string
  uid?: string
  name: string
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
  nonDetectedWallets: WalletConnector[]
  isValidAddress: (address: string) => boolean
  connect: (
    connector: WalletConnector,
    onSuccess?: (address: string, chainId: number) => void
  ) => Promise<void>
  disconnect: () => Promise<void>
}

interface WidgetWalletConfig {
  forceInternalWalletManagement?: boolean
}

export interface WalletProviderProps {
  walletConfig?: WidgetWalletConfig
  chains: ExtendedChain[]
}
