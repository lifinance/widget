import type { ExtendedChain } from '@lifi/sdk'
import { ChainType, createClient, getChains } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
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
  widgetConfig?: WidgetConfig
) => {
  const { chains: internalChains, keyPrefix: internalKeyPrefix } =
    useWidgetConfig()
  const internalClient = useSDKClient()

  const externalClient = useMemo(() => {
    if (!widgetConfig) {
      return undefined
    }
    return createClient({
      ...widgetConfig.sdkConfig,
      apiKey: widgetConfig.apiKey,
      integrator: widgetConfig.integrator ?? window?.location.hostname,
    })
  }, [widgetConfig])

  // Overwrite widget config if passed as param
  const keyPrefix = widgetConfig?.keyPrefix ?? internalKeyPrefix
  const chains = widgetConfig?.chains ?? internalChains

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
      const client = externalClient ?? internalClient
      const availableChains = await getChains(client, {
        chainTypes: chainTypes || chainTypesRequest,
      })
      client.setChains(availableChains)
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
