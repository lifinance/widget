import { WalletTagType } from '../types/walletTagType'

const tagOrder = {
  [WalletTagType.Connected]: 0,
  [WalletTagType.Multichain]: 1,
  [WalletTagType.Installed]: 2,
  [WalletTagType.QrCode]: 3,
  [WalletTagType.GetStarted]: 4,
}

export const getSortedByTags = <T extends { tagType?: WalletTagType }>(
  wallets: T[]
) => {
  return wallets.sort((a, b) => {
    // If any undefined tags - put them last
    if (a.tagType === undefined) {
      return 1
    }
    if (b.tagType === undefined) {
      return -1
    }
    return tagOrder[a.tagType] - tagOrder[b.tagType]
  })
}
