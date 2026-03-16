import { useCallback, useEffect, useMemo, useRef } from 'react'
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
  const { address, chainId, connector } = useConnection()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { mutateAsync: switchChainAsync } = useSwitchChain()

  const connectorInfo = connector
    ? { name: connector.name, icon: connector.icon }
    : undefined

  const stateRef = useRef({
    address,
    chainId,
    walletClient,
    publicClient,
    connectorInfo,
  })
  stateRef.current = {
    address,
    chainId,
    walletClient,
    publicClient,
    connectorInfo,
  }

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
    emitRef.current?.('connect', {
      chainId: hexChainId,
      connector: connectorInfo,
    })
  }, [chainId, connectorInfo])

  const getInitState = useCallback(() => {
    const { address, chainId, connectorInfo } = stateRef.current
    return {
      chainType: 'EVM' as const,
      state: {
        accounts: address ? [address] : [],
        chainId: chainId ?? 1,
        connector: connectorInfo,
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

  return useMemo(
    () => ({
      chainType: 'EVM' as const,
      getInitState,
      handleRequest,
      subscribe,
    }),
    [getInitState, handleRequest, subscribe]
  )
}
