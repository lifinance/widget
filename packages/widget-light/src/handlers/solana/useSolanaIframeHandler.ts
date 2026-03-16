import type { Wallet } from '@wallet-standard/base'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

export interface SolanaIframeHandlerParams {
  address: string | null
  connected: boolean
  wallet: Wallet | null
}

function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function getWalletFeature(wallet: Wallet, feature: string): any {
  const features = wallet.features as Record<string, any>
  const f = features[feature]
  if (!f) {
    throw new Error(`Wallet does not support ${feature}`)
  }
  return f
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

  const connectorName = wallet?.name
  const connectorIcon = wallet?.icon

  useEffect(() => {
    emitRef.current?.('accountsChanged', address ? [address] : [])
  }, [address])

  useEffect(() => {
    if (connected && address) {
      emitRef.current?.('connect', {
        address,
        connector: connectorName
          ? { name: connectorName, icon: connectorIcon }
          : undefined,
      })
    } else {
      emitRef.current?.('disconnect', {})
    }
  }, [connected, address, connectorName, connectorIcon])

  const getInitState = useCallback(() => {
    const { address, connected, wallet } = stateRef.current
    return {
      chainType: 'SVM' as const,
      state: {
        accounts: address ? [address] : [],
        connected,
        connector: wallet
          ? { name: wallet.name, icon: wallet.icon }
          : undefined,
      },
    }
  }, [])

  const handleRequest = useCallback(
    async (_id: string, method: string, params?: unknown) => {
      const { wallet, address } = stateRef.current
      if (!wallet || !address) {
        throw new Error('Solana wallet not connected')
      }

      const account = wallet.accounts[0]

      switch (method) {
        case 'getAccount':
          return { address }

        case 'signTransaction': {
          const { transaction } = params as { transaction: string }
          const feature = getWalletFeature(wallet, 'solana:signTransaction')
          const [result] = await feature.signTransaction({
            account,
            transaction: base64ToBytes(transaction),
          })
          return {
            signedTransaction: bytesToBase64(
              new Uint8Array(result.signedTransaction)
            ),
          }
        }

        case 'signMessage': {
          const { message } = params as { message: string }
          const feature = getWalletFeature(wallet, 'solana:signMessage')
          const [result] = await feature.signMessage({
            account,
            message: base64ToBytes(message),
          })
          return {
            signature: bytesToBase64(new Uint8Array(result.signature)),
          }
        }

        case 'signAndSendTransaction': {
          const { transaction } = params as { transaction: string }
          const feature = getWalletFeature(
            wallet,
            'solana:signAndSendTransaction'
          )
          const [result] = await feature.signAndSendTransaction({
            account,
            transaction: base64ToBytes(transaction),
          })
          return {
            signature: bytesToBase64(new Uint8Array(result.signature)),
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

  return useMemo(
    () => ({
      chainType: 'SVM' as const,
      getInitState,
      handleRequest,
      subscribe,
    }),
    [getInitState, handleRequest, subscribe]
  )
}
