import type { ChainType, ExtendedChain } from '@lifi/sdk'

export interface WalletMenuOpenArgs {
  chain?: ExtendedChain
  chainType?: ChainType
  walletId?: string
}

export interface WalletMenuContext {
  isWalletMenuOpen(): void
  toggleWalletMenu(): void
  openWalletMenu(args?: WalletMenuOpenArgs): void
  closeWalletMenu(): void
}
