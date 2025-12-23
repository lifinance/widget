import type { Address } from '@solana/kit'
import { useMemo } from 'react'
import { useSolanaWalletStandard } from '../providers/SolanaWalletStandardProvider.js'
import { createWalletSigner, type WalletSigner } from '../utils/walletSigner.js'
import { useWalletAccount } from './useWalletAccount.js'

export interface UseWalletSignerReturn {
  /** Transaction signer instance (null if not connected) */
  signer: WalletSigner | null
  /** Currently connected account address */
  address: Address | null
  /** Whether a signer is available */
  isReady: boolean
}

/**
 * Hook to access transaction signing capabilities
 * Returns a signer compatible with @solana/kit
 *
 * @example
 * ```tsx
 * function SendTransaction() {
 *   const { signer, address, isReady } = useWalletSigner()
 *
 *   const handleSend = async () => {
 *     if (!signer) return
 *
 *     const transaction = createTransaction(...)
 *     const signed = await signer.modifyAndSignTransactions([transaction])
 *     // Submit signed[0] to network
 *   }
 *
 *   if (!isReady) return <p>Connect wallet to continue</p>
 *
 *   return <button onClick={handleSend}>Send from {address}</button>
 * }
 * ```
 */
export function useWalletSigner(): UseWalletSignerReturn {
  const { selectedWallet } = useSolanaWalletStandard()
  const { account } = useWalletAccount()

  const signer = useMemo(() => {
    if (!selectedWallet || !account) {
      return null
    }

    return createWalletSigner(account.raw, selectedWallet)
  }, [selectedWallet, account])

  return {
    signer,
    address: signer?.address ?? null,
    isReady: signer !== null,
  }
}
