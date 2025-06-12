import type { Connector as BigmiConnector } from '@bigmi/client'
import type { Connector } from 'wagmi'
import type { WalletTagType } from '../types/walletTagType'

export interface WalletListItemButtonProps {
  ecosystemSelection?: boolean
  tagType?: WalletTagType
  onNotInstalled?(connector: Connector | BigmiConnector): void
  onConnected?(): void
  onConnecting?(): void
  onError?(error: unknown): void
}
