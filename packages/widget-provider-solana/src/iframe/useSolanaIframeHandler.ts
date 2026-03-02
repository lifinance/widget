import type { IframeEcosystemHandler } from '@lifi/widget-light'
import { useCallback, useEffect, useRef } from 'react'
import { useWalletAccount } from '../hooks/useWalletAccount.js'
import { useSolanaWalletStandard } from '../wallet-standard/useSolanaWalletStandard.js'

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for Solana (SVM).
 *
 * Uses the Wallet Standard store internally to access the connected Solana
 * wallet and forwards RPC-style method calls from the guest iframe.
 *
 * Supported methods:
 *   - `getAccount`       → returns current account address
 *   - `signTransaction`  → sign a serialized transaction (base64)
 *   - `signMessage`      → sign an arbitrary message (base64)
 *   - `signAndSendTransaction` → sign and send a transaction (base64)
 */
export function useSolanaIframeHandler(): IframeEcosystemHandler {
  const { selectedWallet, connected } = useSolanaWalletStandard()
  const { address } = useWalletAccount()

  const stateRef = useRef({ address, selectedWallet, connected })
  stateRef.current = { address, selectedWallet, connected }

  const emitRef = useRef<((event: string, data: unknown) => void) | null>(null)

  useEffect(() => {
    emitRef.current?.('accountsChanged', address ? [address] : [])
  }, [address])

  useEffect(() => {
    if (connected && address) {
      emitRef.current?.('connect', { address })
    } else {
      emitRef.current?.('disconnect', {})
    }
  }, [connected, address])

  const getInitState = useCallback(() => {
    const { address, connected } = stateRef.current
    return {
      chainType: 'SVM' as const,
      state: {
        accounts: address ? [address] : [],
        connected,
      },
    }
  }, [])

  const handleRequest = useCallback(
    async (_id: string, method: string, params?: unknown) => {
      const { selectedWallet, address } = stateRef.current
      if (!selectedWallet || !address) {
        throw new Error('Solana wallet not connected')
      }

      switch (method) {
        case 'getAccount':
          return { address }

        case 'signTransaction': {
          const { transaction } = params as { transaction: string }
          const features = selectedWallet.features as Record<string, any>
          const signFeature = features['solana:signTransaction']
          if (!signFeature) {
            throw new Error('Wallet does not support signTransaction')
          }
          const account = selectedWallet.accounts[0]
          const txBytes = Uint8Array.from(atob(transaction), (c) =>
            c.charCodeAt(0)
          )
          const [result] = await signFeature.signTransaction({
            account,
            transaction: txBytes,
          })
          return {
            signedTransaction: btoa(
              String.fromCharCode(...new Uint8Array(result.signedTransaction))
            ),
          }
        }

        case 'signMessage': {
          const { message } = params as { message: string }
          const features = selectedWallet.features as Record<string, any>
          const signFeature = features['solana:signMessage']
          if (!signFeature) {
            throw new Error('Wallet does not support signMessage')
          }
          const account = selectedWallet.accounts[0]
          const msgBytes = Uint8Array.from(atob(message), (c) =>
            c.charCodeAt(0)
          )
          const [result] = await signFeature.signMessage({
            account,
            message: msgBytes,
          })
          return {
            signature: btoa(
              String.fromCharCode(...new Uint8Array(result.signature))
            ),
          }
        }

        case 'signAndSendTransaction': {
          const { transaction } = params as {
            transaction: string
            options?: Record<string, unknown>
          }
          const features = selectedWallet.features as Record<string, any>
          const sendFeature = features['solana:signAndSendTransaction']
          if (!sendFeature) {
            throw new Error('Wallet does not support signAndSendTransaction')
          }
          const account = selectedWallet.accounts[0]
          const txBytes = Uint8Array.from(atob(transaction), (c) =>
            c.charCodeAt(0)
          )
          const [result] = await sendFeature.signAndSendTransaction({
            account,
            transaction: txBytes,
          })
          return {
            signature: btoa(
              String.fromCharCode(...new Uint8Array(result.signature))
            ),
          }
        }

        default:
          throw new Error(`Unsupported Solana method: ${method}`)
      }
    },
    []
  )

  const subscribe = useCallback(
    (emit: (event: string, data: unknown) => void) => {
      emitRef.current = emit
      return () => {
        emitRef.current = null
      }
    },
    []
  )

  return {
    chainType: 'SVM',
    getInitState,
    handleRequest,
    subscribe,
  }
}
