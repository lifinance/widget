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

  const connectorName = connector?.name
  const connectorIcon = connector?.icon

  const stateRef = useRef({
    address,
    chainId,
    walletClient,
    publicClient,
    connectorName,
    connectorIcon,
  })
  stateRef.current = {
    address,
    chainId,
    walletClient,
    publicClient,
    connectorName,
    connectorIcon,
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
      connector: connectorName
        ? { name: connectorName, icon: connectorIcon }
        : undefined,
    })
  }, [chainId, connectorName, connectorIcon])

  const getInitState = useCallback(() => {
    const { address, chainId, connectorName, connectorIcon } = stateRef.current
    return {
      chainType: 'EVM' as const,
      state: {
        accounts: address ? [address] : [],
        chainId: chainId ?? 1,
        connector: connectorName
          ? { name: connectorName, icon: connectorIcon }
          : undefined,
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
