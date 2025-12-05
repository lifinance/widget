import type { ExtendedChain } from '@lifi/sdk'
import { ChainType, createClient, getChains } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { WidgetConfig } from '../types/widget.js'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'

type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined

const supportedChainTypes = [
  ChainType.EVM,
  ChainType.SVM,
  ChainType.UTXO,
  ChainType.MVM,
]

export const useAvailableChains = (
  chainTypes?: ChainType[],
  externalWidgetConfig?: WidgetConfig
) => {
  const {
    chains: internalChains,
    keyPrefix: internalKeyPrefix,
    sdkConfig: internalSdkConfig,
  } = useWidgetConfig()
  const internalClient = useSDKClient()

  const externalClient = externalWidgetConfig
    ? createClient({
        ...externalWidgetConfig.sdkConfig,
        apiKey: externalWidgetConfig.apiKey,
        integrator:
          externalWidgetConfig.integrator ?? window?.location.hostname,
      })
    : undefined

  // Overwrite widget config if passed as param
  const keyPrefix = externalWidgetConfig?.keyPrefix ?? internalKeyPrefix
  const chains = externalWidgetConfig?.chains ?? internalChains
  const refetchInterval =
    externalWidgetConfig?.sdkConfig?.chainsRefetchInterval ??
    internalSdkConfig?.chainsRefetchInterval ??
    300_000

  const { data, isLoading } = useQuery({
    queryKey: [
      getQueryKey('chains', keyPrefix),
      chains?.types,
      chains?.allow,
      chains?.deny,
      chains?.from,
      chains?.to,
    ] as const,
    queryFn: async ({ queryKey: [, chainTypesConfig] }) => {
      const chainsConfigSets = getConfigItemSets(
        chainTypesConfig,
        (chains) => new Set(chains)
      )
      const chainTypesRequest = supportedChainTypes.filter((chainType) =>
        isItemAllowedForSets(chainType, chainsConfigSets)
      )

      let availableChains: ExtendedChain[] = []
      if (externalClient) {
        availableChains = await getChains(externalClient, {
          chainTypes: chainTypes || chainTypesRequest,
        })
      } else {
        availableChains = (await internalClient.getChains()).filter((chain) =>
          (chainTypes || chainTypesRequest)?.includes(chain.chainType)
        )
      }

      return availableChains
    },
    refetchInterval,
    staleTime: refetchInterval,
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
