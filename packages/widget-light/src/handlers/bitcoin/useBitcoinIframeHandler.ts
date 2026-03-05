import {
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { useAccount, useConfig } from '@bigmi/react'
import { useCallback, useEffect, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for Bitcoin (UTXO).
 *
 * Uses Bigmi hooks internally to access the connected Bitcoin wallet
 * and forwards method calls from the guest iframe.
 *
 * Supported methods:
 *   - `getAccount`   → returns current account info
 *   - `signPsbt`     → sign a PSBT (base64)
 *   - `sendBitcoin`  → send bitcoin to an address
 *   - `getAddresses` → get wallet addresses
 *   - Generic methods are forwarded to the wallet client
 */
export function useBitcoinIframeHandler(): IframeEcosystemHandler {
  const bigmiConfig = useConfig()
  const currentWallet = useAccount()

  const address = currentWallet.account?.address
  const isConnected = currentWallet.isConnected

  const stateRef = useRef({ address, isConnected, bigmiConfig })
  stateRef.current = { address, isConnected, bigmiConfig }

  const emitRef = useRef<((event: string, data: unknown) => void) | null>(null)

  useEffect(() => {
    emitRef.current?.('accountsChanged', address ? [address] : [])
  }, [address])

  useEffect(() => {
    if (isConnected && address) {
      emitRef.current?.('connect', { address })
    } else {
      emitRef.current?.('disconnect', {})
    }
  }, [isConnected, address])

  const getInitState = useCallback(() => {
    const { address, isConnected } = stateRef.current
    return {
      chainType: 'UTXO' as const,
      state: {
        accounts: address ? [address] : [],
        connected: isConnected,
      },
    }
  }, [])

  const handleRequest = useCallback(
    async (_id: string, method: string, params?: unknown) => {
      const { address, bigmiConfig } = stateRef.current
      const account = getAccount(bigmiConfig)

      if (!account.isConnected || !address) {
        throw new Error('Bitcoin wallet not connected')
      }

      switch (method) {
        case 'getAccount':
          return { address }

        case 'signPsbt':
        case 'sendBitcoin':
        case 'getAddresses': {
          const client = await getBigmiConnectorClient(bigmiConfig)
          return (client as any).request({
            method,
            params: params as any,
          })
        }

        default: {
          const client = await getBigmiConnectorClient(bigmiConfig)
          return (client as any).request({
            method,
            params: params as any,
          })
        }
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
    chainType: 'UTXO',
    getInitState,
    handleRequest,
    subscribe,
  }
}
