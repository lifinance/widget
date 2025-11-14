import type { WalletConnector } from '@lifi/widget-provider'
import type { WalletTagType } from '../types/walletTagType.js'

export interface WalletListItemButtonProps {
  ecosystemSelection?: boolean
  tagType?: WalletTagType
  connector: WalletConnector
  onNotInstalled?(connector: WalletConnector): void
  onConnected?(): void
  onConnecting?(): void
  onError?(error: unknown): void
}
