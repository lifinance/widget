import type { Wallet } from '@wallet-standard/base'
import { useCallback, useEffect, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

export interface SolanaIframeHandlerParams {
  address: string | null
  connected: boolean
  wallet: Wallet | null
}

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for Solana (SVM).
 *
 * Accepts wallet state as arguments so the host can provide values from
 * any Solana wallet library (wallet-standard, wallet-adapter, etc.).
 *
 * Supported methods:
 *   - `getAccount`                → returns current account address
 *   - `signTransaction`           → sign a serialized transaction (base64)
 *   - `signMessage`               → sign an arbitrary message (base64)
 *   - `signAndSendTransaction`    → sign and send a transaction (base64)
 */
export function useSolanaIframeHandler(
  params: SolanaIframeHandlerParams
): IframeEcosystemHandler {
  const { address, connected, wallet } = params

  const stateRef = useRef({ address, connected, wallet })
  stateRef.current = { address, connected, wallet }

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
      const { wallet, address } = stateRef.current
      if (!wallet || !address) {
        throw new Error('Solana wallet not connected')
      }

      switch (method) {
        case 'getAccount':
          return { address }

        case 'signTransaction': {
          const { transaction } = params as { transaction: string }
          const features = wallet.features as Record<string, any>
          const signFeature = features['solana:signTransaction']
          if (!signFeature) {
            throw new Error('Wallet does not support signTransaction')
          }
          const account = wallet.accounts[0]
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
          const features = wallet.features as Record<string, any>
          const signFeature = features['solana:signMessage']
          if (!signFeature) {
            throw new Error('Wallet does not support signMessage')
          }
          const account = wallet.accounts[0]
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
          const features = wallet.features as Record<string, any>
          const sendFeature = features['solana:signAndSendTransaction']
          if (!sendFeature) {
            throw new Error('Wallet does not support signAndSendTransaction')
          }
          const account = wallet.accounts[0]
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
