import {
  getConnectorId,
  getSortedByTags,
  getWalletTagType,
  useAccount,
  useCombinedWallets,
} from '@lifi/wallet-management'
import { useMemo } from 'react'

export function useSelectSourceTopWallets() {
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
    () => filteredWalletsWithTagTypes.slice(0, 2),
    [filteredWalletsWithTagTypes]
  )

  return { topWallets }
}
