import {
  getAccount,
  getConnectorClient as getBigmiConnectorClient,
} from '@bigmi/client'
import { useAccount, useConfig } from '@bigmi/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for Bitcoin (UTXO).
 *
 * Uses Bigmi hooks internally to access the connected Bitcoin wallet
 * and forwards method calls from the guest iframe.
 *
 * Supported methods:
 *   - `getAccount`   → returns current account info
 *   - All other methods are forwarded to the wallet client
 */
export function useBitcoinIframeHandler(): IframeEcosystemHandler {
  const bigmiConfig = useConfig()
  const currentWallet = useAccount()

  const address = currentWallet.account?.address
  const publicKey = currentWallet.account?.publicKey
  const isConnected = currentWallet.isConnected
  const connectorName = currentWallet.connector?.name
  const connectorIcon = currentWallet.connector?.icon

  const stateRef = useRef({
    address,
    publicKey,
    isConnected,
    bigmiConfig,
    connectorName,
    connectorIcon,
  })
  stateRef.current = {
    address,
    publicKey,
    isConnected,
    bigmiConfig,
    connectorName,
    connectorIcon,
  }

  const emitRef = useRef<((event: string, data: unknown) => void) | null>(null)

  useEffect(() => {
    emitRef.current?.('accountsChanged', address ? [address] : [])
  }, [address])

  useEffect(() => {
    if (isConnected && address) {
      emitRef.current?.('connect', {
        address,
        connector: connectorName
          ? { name: connectorName, icon: connectorIcon }
          : undefined,
      })
    } else {
      emitRef.current?.('disconnect', {})
    }
  }, [isConnected, address, connectorName, connectorIcon])

  const getInitState = useCallback(() => {
    const { address, publicKey, isConnected, connectorName, connectorIcon } =
      stateRef.current
    return {
      chainType: 'UTXO' as const,
      state: {
        accounts: address ? [address] : [],
        connected: isConnected,
        publicKey: publicKey ?? null,
        connector: connectorName
          ? { name: connectorName, icon: connectorIcon }
          : undefined,
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

      if (method === 'getAccount') {
        return { address, publicKey: stateRef.current.publicKey ?? null }
      }

      const client = await getBigmiConnectorClient(bigmiConfig)
      return (client as any).request({
        method,
        params: params as any,
      })
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
      chainType: 'UTXO' as const,
      getInitState,
      handleRequest,
      subscribe,
    }),
    [getInitState, handleRequest, subscribe]
  )
}
