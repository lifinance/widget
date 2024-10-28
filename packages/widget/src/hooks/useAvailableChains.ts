import type { ExtendedChain } from '@lifi/sdk'
import { ChainType, config, getChains } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { isItemAllowed } from '../utils/item.js'

export type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined

const supportedChainTypes = [ChainType.EVM, ChainType.SVM, ChainType.UTXO]

export const useAvailableChains = (chainTypes?: ChainType[]) => {
  const { chains } = useWidgetConfig()
  // const { providers } = useHasExternalWalletProvider();
  const { data, isLoading } = useQuery({
    queryKey: [
      'chains',
      // providers,
      chains?.types,
      chains?.allow,
      chains?.deny,
      chains?.from,
      chains?.to,
    ] as const,
    queryFn: async ({ queryKey: [, chainTypesConfig] }) => {
      const chainTypesRequest = supportedChainTypes
        // providers.length > 0 ? providers : supportedChainTypes
        .filter((chainType) => isItemAllowed(chainType, chainTypesConfig))

      const availableChains = await getChains({
        chainTypes: chainTypes || chainTypesRequest,
      })
      config.setChains(availableChains)
      return availableChains
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

  const getChainById: GetChainById = useCallback(
    (chainId?: number, chains: ExtendedChain[] | undefined = data) => {
      if (!chainId) {
        return
      }
      const chain = chains?.find((chain) => chain.id === chainId)
      // if (!chain) {
      //   throw new Error('Chain not found or chainId is invalid.');
      // }
      return chain
    },
    [data]
  )

  return {
    chains: data,
    getChainById,
    isLoading,
  }
}
