import type { ChainType } from '@lifi/sdk'

export enum WalletManagementEvent {
  WalletConnected = 'walletConnected',
  WalletDisconnected = 'walletDisconnected',
}

export type WalletManagementEvents = {
  walletConnected: WalletConnected
  walletDisconnected: WalletDisconnected
}

export interface WalletConnected {
  address: string
  chainId: number
  chainType: ChainType
  connectorId: string
  connectorName: string
}

export interface WalletDisconnected {
  address?: string
  chainId?: number
  chainType: ChainType
  connectorId?: string
  connectorName?: string
}
