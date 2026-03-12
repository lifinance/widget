import {
  CurrentAccountSigner,
  useCurrentWallet,
  useDAppKit,
  useWalletConnection,
} from '@mysten/dapp-kit-react'
import { useCallback, useEffect, useRef } from 'react'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'

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

  const stateRef = useRef({ address, isConnected, dAppKit })
  stateRef.current = { address, isConnected, dAppKit }

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
      chainType: 'MVM' as const,
      state: {
        accounts: address ? [address] : [],
        connected: isConnected,
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
          const txBytes = Uint8Array.from(atob(transaction), (c) =>
            c.charCodeAt(0)
          )
          const result = await signer.signTransaction(txBytes)
          return {
            signature: result.signature,
            bytes: result.bytes,
          }
        }

        case 'signPersonalMessage': {
          const { message } = params as { message: string }
          const msgBytes = Uint8Array.from(atob(message), (c) =>
            c.charCodeAt(0)
          )
          const result = await signer.signPersonalMessage(msgBytes)
          return {
            signature: result.signature,
            bytes: result.bytes,
          }
        }

        case 'signAndExecuteTransaction': {
          const { transaction } = params as {
            transaction: string
          }
          const result = await dAppKit.signAndExecuteTransaction({
            transaction,
          })
          return result
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

  return {
    chainType: 'MVM',
    getInitState,
    handleRequest,
    subscribe,
  }
}
