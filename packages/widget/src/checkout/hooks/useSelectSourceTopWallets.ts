import {
  type CombinedWallet,
  getConnectorId,
  getSortedByTags,
  getWalletTagType,
  useAccount,
  useCombinedWallets,
  type WalletTagType,
} from '@lifi/wallet-management'
import { useMemo } from 'react'

type TaggedCombinedWallet = CombinedWallet & { tagType?: WalletTagType }

export function useSelectSourceTopWallets(): {
  topWallets: TaggedCombinedWallet[]
  walletOverflowCount: number
} {
  const installedWallets = useCombinedWallets()
  const { accounts } = useAccount()

  const connectedConnectorIds: string[] = useMemo(() => {
    return accounts
      .filter((account) => account.isConnected)
      .map((account) => getConnectorId(account.connector, account.chainType))
      .filter(Boolean) as string[]
  }, [accounts])

  const filteredWalletsWithTagTypes = useMemo(
    () =>
      getSortedByTags(
        installedWallets
          .filter((wallet) => wallet.connectors?.length)
          .map((wallet) => ({
            ...wallet,
            tagType: getWalletTagType(wallet, connectedConnectorIds),
          }))
      ),
    [installedWallets, connectedConnectorIds]
  )

  const topWallets = useMemo(
    () => filteredWalletsWithTagTypes.slice(0, 3),
    [filteredWalletsWithTagTypes]
  )

  const walletOverflowCount = useMemo(
    () => Math.max(0, filteredWalletsWithTagTypes.length - topWallets.length),
    [filteredWalletsWithTagTypes.length, topWallets.length]
  )

  return { topWallets, walletOverflowCount }
}
