import { useCombinedWallets } from '@lifi/wallet-management'
import { useMemo } from 'react'

const VISIBLE_WALLET_COUNT = 3

type TopWallet = {
  id: string
  name?: string
  icon?: string
}

export function useSelectSourceTopWallets(): {
  topWallets: TopWallet[]
  walletOverflowCount: number
} {
  const combinedWallets = useCombinedWallets()

  const walletsWithIcons = useMemo(
    () => combinedWallets.filter((w) => Boolean(w.icon)),
    [combinedWallets]
  )

  const topWallets = useMemo(
    () =>
      walletsWithIcons.slice(0, VISIBLE_WALLET_COUNT).map((w) => ({
        id: w.id ?? w.name,
        name: w.name,
        icon: w.icon,
      })),
    [walletsWithIcons]
  )

  const walletOverflowCount = useMemo(
    () => Math.max(0, combinedWallets.length - VISIBLE_WALLET_COUNT),
    [combinedWallets]
  )

  return { topWallets, walletOverflowCount }
}
