import type { ChainType, ExtendedChain } from '@lifi/sdk'
import { createClient } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import {
  getChainsQueryOptions,
  supportedChainTypes,
} from '../queries/getChains.js'
import type { WidgetConfig } from '../types/widget.js'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item.js'
import { resolveQueryScopeKey } from '../utils/scopeKeys.js'

type GetChainById = (
  chainId?: number,
  chains?: ExtendedChain[]
) => ExtendedChain | undefined

const refetchInterval = 300_000

export const useAvailableChains = (
  chainTypes?: ChainType[],
  widgetConfig?: WidgetConfig
): {
  chains: ExtendedChain[] | undefined
  getChainById: GetChainById
  isLoading: boolean
} => {
  const { chains: internalChains, queryScopeKey: internalQueryScopeKey } =
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
  const client = externalClient ?? internalClient
  const chains = widgetConfig?.chains ?? internalChains
  const queryScopeKey = widgetConfig
    ? resolveQueryScopeKey(widgetConfig)
    : internalQueryScopeKey

  const typeSets = getConfigItemSets(chains?.types, (types) => new Set(types))
  const requestedTypes =
    chainTypes ??
    supportedChainTypes.filter((type) => isItemAllowedForSets(type, typeSets))

  const { data, dataUpdatedAt, isLoading } = useQuery(
    getChainsQueryOptions(client, {
      chainTypes: requestedTypes,
      scopeKey: queryScopeKey,
      query: { refetchInterval, staleTime: refetchInterval },
    })
  )

  // A host may fill the entry; key on dataUpdatedAt, as a refetch keeps data.
  useEffect(() => {
    if (data && dataUpdatedAt) {
      client.setChains(data)
    }
  }, [data, dataUpdatedAt, client])

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
