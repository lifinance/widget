import { useStellarWalletsKit } from '../stellar-kit/useStellarWalletsKit.js'

export interface UseWalletAccountReturn {
  /** Currently connected G-address, or null when disconnected. */
  address: string | null
  connected: boolean
  connecting: boolean
}

/**
 * Hook to access the connected Stellar wallet account. Stellar Wallets Kit
 * exposes a single active address per connected wallet.
 */
export function useWalletAccount(): UseWalletAccountReturn {
  const { address, connected, connecting } = useStellarWalletsKit()
  return { address, connected, connecting }
}
