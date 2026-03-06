import { useCallback, useEffect, useRef } from 'react'
import {
  useConnection,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'
import type { IframeEcosystemHandler } from '../../shared/protocol.js'
import { handleRpcRequest } from './rpcHandler.js'

/**
 * Host-side hook that creates an `IframeEcosystemHandler` for EVM.
 *
 * Uses wagmi hooks internally to access wallet/public clients and
 * forwards EIP-1193 RPC requests from the guest iframe.
 */
export function useEthereumIframeHandler(): IframeEcosystemHandler {
  const { address, chainId } = useConnection()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { mutateAsync: switchChainAsync } = useSwitchChain()

  const stateRef = useRef({ address, chainId, walletClient, publicClient })
  stateRef.current = { address, chainId, walletClient, publicClient }

  const emitRef = useRef<((event: string, data: unknown) => void) | null>(null)

  useEffect(() => {
    emitRef.current?.('accountsChanged', address ? [address] : [])
  }, [address])

  useEffect(() => {
    if (!chainId) {
      return
    }
    const hexChainId = `0x${chainId.toString(16)}` as const
    emitRef.current?.('chainChanged', hexChainId)
    emitRef.current?.('connect', { chainId: hexChainId })
  }, [chainId])

  const getInitState = useCallback(() => {
    const { address, chainId } = stateRef.current
    return {
      chainType: 'EVM' as const,
      state: {
        accounts: address ? [address] : [],
        chainId: chainId ?? 1,
      },
    }
  }, [])

  const handleRequest = useCallback(
    async (_id: string, method: string, params?: unknown) => {
      const { address, chainId, walletClient, publicClient } = stateRef.current
      return handleRpcRequest(method, params as unknown[] | undefined, {
        address,
        chainId,
        walletClient,
        publicClient,
        switchChain: async (targetChainId) => {
          await switchChainAsync({ chainId: targetChainId })
        },
      })
    },
    [switchChainAsync]
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
    chainType: 'EVM',
    getInitState,
    handleRequest,
    subscribe,
  }
}
