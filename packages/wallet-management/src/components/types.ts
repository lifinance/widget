import type { WalletTagType } from '../types/walletTagType.js'

export interface WalletListItemButtonProps {
  ecosystemSelection?: boolean
  tagType?: WalletTagType
  connector: any // TODO: Add type
  onNotInstalled?(connector: any): void // TODO: Add type
  onConnected?(): void
  onConnecting?(): void
  onError?(error: unknown): void
}
