import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'

export const isDuplicateOneKeyWallet = (wallet: WalletWithRequiredFeatures) => {
  if ('_name' in wallet) {
    return (
      (wallet._name as string).toLowerCase() === 'onekey wallet' &&
      wallet.name.toLowerCase() === 'sui wallet'
    )
  }
  return false
}
