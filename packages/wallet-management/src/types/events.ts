import type { ChainType } from '@lifi/sdk'

export enum WalletManagementEvent {
  WalletConnected = 'walletConnected',
  WalletDisconnected = 'walletDisconnected',
}

export type WalletManagementEvents = {
  walletConnected: (data: WalletConnected) => void
  walletDisconnected: (data: WalletDisconnected) => void
}

// Compile-time invariant: WalletManagementEvent enum values and
// keyof WalletManagementEvents must stay in lockstep. Adding to one
// without the other fails the build.
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
const _eventEnumMatchesEventMap: Exact<
  `${WalletManagementEvent}`,
  keyof WalletManagementEvents
> = true
void _eventEnumMatchesEventMap

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
