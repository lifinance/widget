import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'

type TopWallet = {
  id: string
  name?: string
  icon?: string
}

export function useSelectSourceTopWallets(): {
  topWallets: TopWallet[]
  walletOverflowCount: number
} {
  const { accounts } = useAccount()

  const topWallets = useMemo(
    () =>
      accounts
        .filter((account) => account.isConnected && account.connector)
        .map((account) => ({
          id:
            account.connector?.name ??
            account.connector?.displayName ??
            account.name ??
            'wallet',
          name:
            account.connector?.displayName ??
            account.connector?.name ??
            account.name,
          icon: account.connector?.icon,
        }))
        .filter(
          (wallet, index, wallets) =>
            wallets.findIndex((w) => w.id === wallet.id) === index
        )
        .slice(0, 3),
    [accounts]
  )

  const walletOverflowCount = 0

  return { topWallets, walletOverflowCount }
}
