import {
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useStellarContext,
  useSuiContext,
  useTronContext,
} from '@lifi/widget-provider'
import { useEffect } from 'react'

// The menu unmounts on close, so this runs on every open. Extensions can inject after
// the first probe, and a probe can miss a wallet whose background worker was asleep.
export const useRefreshWalletsOnOpen = (): void => {
  const { refreshWallets: refreshEthereum } = useEthereumContext()
  const { refreshWallets: refreshBitcoin } = useBitcoinContext()
  const { refreshWallets: refreshSolana } = useSolanaContext()
  const { refreshWallets: refreshSui } = useSuiContext()
  const { refreshWallets: refreshTron } = useTronContext()
  const { refreshWallets: refreshStellar } = useStellarContext()

  useEffect(() => {
    for (const refresh of [
      refreshEthereum,
      refreshBitcoin,
      refreshSolana,
      refreshSui,
      refreshTron,
      refreshStellar,
    ]) {
      refresh?.().catch((error) => {
        console.error('Failed to refresh wallets:', error)
      })
    }
  }, [
    refreshEthereum,
    refreshBitcoin,
    refreshSolana,
    refreshSui,
    refreshTron,
    refreshStellar,
  ])
}
