import {
  CurrentAccountSigner,
  useCurrentWallet,
  useDAppKit,
  useWalletConnection,
} from '@mysten/dapp-kit-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for Sui (MVM).
 *
 * Uses dapp-kit-react hooks internally to access the connected Sui wallet
 * and forwards method calls from the guest iframe.
 *
 * Supported methods:
 *   - `getAccount`              → returns current account address
 *   - `signTransaction`         → sign a transaction block (base64)
 *   - `signPersonalMessage`     → sign an arbitrary message (base64)
 *   - `signAndExecuteTransaction` → sign and execute a transaction block
 */
export function useSuiIframeHandler(): IframeEcosystemHandler {
  const dAppKit = useDAppKit()
  const currentWallet = useCurrentWallet()
  const { status: connectionStatus } = useWalletConnection()

  const address = currentWallet?.accounts?.[0]?.address
  const isConnected = connectionStatus === 'connected'
  const connectorName = currentWallet?.name
  const connectorIcon = currentWallet?.icon

  const stateRef = useRef({
    address,
    isConnected,
    dAppKit,
    connectorName,
    connectorIcon,
  })
  stateRef.current = {
    address,
    isConnected,
    dAppKit,
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
    const { address, isConnected, connectorName, connectorIcon } =
      stateRef.current
    return {
      chainType: 'MVM' as const,
      state: {
        accounts: address ? [address] : [],
        connected: isConnected,
        connector: connectorName
          ? { name: connectorName, icon: connectorIcon }
          : undefined,
      },
    }
  }, [])

  const handleRequest = useCallback(
    async (_id: string, method: string, params?: unknown) => {
      const { address, dAppKit } = stateRef.current
      if (!address) {
        throw new Error('Sui wallet not connected')
      }

      const signer = new CurrentAccountSigner(dAppKit)

      switch (method) {
        case 'getAccount':
          return { address }

        case 'signTransaction': {
          const { transaction } = params as { transaction: string }
          const result = await signer.signTransaction(
            base64ToBytes(transaction)
          )
          return {
            signature: result.signature,
            bytes: result.bytes,
          }
        }

        case 'signPersonalMessage': {
          const { message } = params as { message: string }
          const result = await signer.signPersonalMessage(
            base64ToBytes(message)
          )
          return {
            signature: result.signature,
            bytes: result.bytes,
          }
        }

        case 'signAndExecuteTransaction': {
          const { transaction } = params as { transaction: string }
          return dAppKit.signAndExecuteTransaction({ transaction })
        }

        default:
          throw new Error(`Unsupported Sui method: ${method}`)
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
      chainType: 'MVM' as const,
      getInitState,
      handleRequest,
      subscribe,
    }),
    [getInitState, handleRequest, subscribe]
  )
}
