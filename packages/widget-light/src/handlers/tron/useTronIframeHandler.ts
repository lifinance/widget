import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

export interface TronAdapter {
  name: string
  icon: string
  signTransaction(transaction: unknown): Promise<unknown>
  signMessage(message: string): Promise<string>
}

export interface TronIframeHandlerParams {
  address: string | null
  connected: boolean
  adapter: TronAdapter | null
}

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for Tron (TVM).
 *
 * Accepts wallet state as arguments so the host can provide values from
 * `@tronweb3/tronwallet-adapter-react-hooks`.
 *
 * Supported methods:
 *   - `getAccount`        → returns current account address
 *   - `signTransaction`   → sign a TronWeb transaction object (JSON)
 *   - `signMessage`       → sign an arbitrary message string
 */
export function useTronIframeHandler(
  params: TronIframeHandlerParams
): IframeEcosystemHandler {
  const { address, connected, adapter } = params

  const stateRef = useRef({ address, connected, adapter })
  stateRef.current = { address, connected, adapter }

  const emitRef = useRef<((event: string, data: unknown) => void) | null>(null)

  const connectorName = adapter?.name
  const connectorIcon = adapter?.icon

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
    const { address, connected, adapter } = stateRef.current
    return {
      chainType: 'TVM' as const,
      state: {
        accounts: address ? [address] : [],
        connected,
        connector: adapter
          ? { name: adapter.name, icon: adapter.icon }
          : undefined,
      },
    }
  }, [])

  const handleRequest = useCallback(
    async (_id: string, method: string, params?: unknown) => {
      const { adapter, address } = stateRef.current
      if (!adapter || !address) {
        throw new Error('Tron wallet not connected')
      }

      switch (method) {
        case 'getAccount':
          return { address }

        case 'signTransaction': {
          const { transaction } = params as { transaction: unknown }
          return adapter.signTransaction(transaction)
        }

        case 'signMessage': {
          const { message } = params as { message: string }
          const signature = await adapter.signMessage(message)
          return { signature }
        }

        default:
          throw new Error(`Unsupported Tron method: ${method}`)
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
      chainType: 'TVM' as const,
      getInitState,
      handleRequest,
      subscribe,
    }),
    [getInitState, handleRequest, subscribe]
  )
}
