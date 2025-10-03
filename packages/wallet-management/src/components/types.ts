import type { WalletTagType } from '../types/walletTagType.js'

export interface WalletListItemButtonProps {
  ecosystemSelection?: boolean
  tagType?: WalletTagType
  onNotInstalled?(connector: any): void
  onConnected?(): void
  onConnecting?(): void
  onError?(error: unknown): void
}
