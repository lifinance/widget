import type { ChainType, ExtendedChain } from '@lifi/sdk'

export interface WalletMenuOpenArgs {
  chain?: ExtendedChain
  chainType?: ChainType
}

export interface WalletMenuContext {
  isWalletMenuOpen(): boolean
  toggleWalletMenu(): void
  openWalletMenu(args?: WalletMenuOpenArgs): void
  closeWalletMenu(): void
}
