import {
  ChainType,
  getToken,
  getTokens,
  type TokensExtendedResponse,
} from '@lifi/sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import {
  defaultChainIdsByType,
  getChainTypeFromAddress,
} from '../utils/chainType.js'
import { isItemAllowed } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'
import { filterAllowedTokens } from '../utils/token.js'

export const useTokens = (
  formType?: FormType,
  search?: string,
  chainId?: number
) => {
  const {
    tokens: configTokens,
    chains: chainsConfig,
    keyPrefix,
  } = useWidgetConfig()

  const { isLoading: isSearchLoading } = useBackgroundTokenSearch(
    search,
    chainId
  )

  const { data, isLoading } = useQuery({
    queryKey: [getQueryKey('tokens', keyPrefix)],
    queryFn: async ({ signal }) => {
      const chainTypes = [
        ChainType.EVM,
        ChainType.SVM,
        ChainType.UTXO,
        ChainType.MVM,
      ].filter((chainType) => isItemAllowed(chainType, chainsConfig?.types))
      const tokensResponse: TokensExtendedResponse = await getTokens(
        {
          chainTypes,
          orderBy: 'volumeUSD24H',
          extended: true,
          limit: 1000,
        },
        { signal }
      )
      return tokensResponse
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

  const allTokens = useMemo(() => {
    return filterAllowedTokens(
      data?.tokens,
      configTokens,
      chainsConfig,
      formType
    )
  }, [data?.tokens, configTokens, chainsConfig, formType])

  return {
    allTokens,
    isLoading,
    isSearchLoading,
  }
}

// This hook is used to search for tokens in the background.
// It updates the main tokens cache with the search results,
// if any of the tokens are not already in the cache.
const useBackgroundTokenSearch = (search?: string, chainId?: number) => {
  const { chains: chainsConfig, keyPrefix } = useWidgetConfig()
  const queryClient = useQueryClient()

  const { isLoading: isSearchLoading } = useQuery({
    queryKey: [getQueryKey('tokens-search', keyPrefix), search, chainId],
    queryFn: async ({ queryKey, signal }) => {
      const [, searchQuery, chainId] = queryKey as [string, string, number]
      const chainTypes = [
        ChainType.EVM,
        ChainType.SVM,
        ChainType.UTXO,
        ChainType.MVM,
      ].filter((chainType) => isItemAllowed(chainType, chainsConfig?.types))
      const tokensResponse: TokensExtendedResponse = await getTokens(
        {
          chainTypes,
          orderBy: 'volumeUSD24H',
          extended: true,
          search: searchQuery,
          limit: 1000,
        },
        { signal }
      )

      // If the chainId is not provided, try to get it from the search query
      let _chainId = chainId
      if (!_chainId) {
        const chainType = getChainTypeFromAddress(searchQuery)
        if (chainType) {
          _chainId = defaultChainIdsByType[chainType]
        }
      }

      // Fallback: If the main search returned no tokens for the specific chainId,
      // fetch a single token using the /token endpoint
      if (_chainId && searchQuery) {
        const existingTokens = tokensResponse.tokens[_chainId] || []
        if (!existingTokens.length) {
          const token = await getToken(_chainId, searchQuery, { signal })
          if (token) {
            tokensResponse.tokens[_chainId] = [token]
          }
        }
      }

      // Merge search results into main tokens cache
      if (searchQuery) {
        queryClient.setQueriesData<TokensExtendedResponse>(
          { queryKey: [getQueryKey('tokens', keyPrefix)] },
          (data) => {
            if (!data) {
              return data
            }

            const clonedData = { ...data, tokens: { ...data.tokens } }

            Object.entries(tokensResponse.tokens).forEach(
              ([chainId, searchTokens]) => {
                const chainIdNum = Number(chainId)
                const existingTokens = clonedData.tokens[chainIdNum] || []

                const existingTokenAddresses = new Set(
                  existingTokens.map((token) => token.address.toLowerCase())
                )

                // Find tokens in search results that don't exist in the main list
                const newTokens = searchTokens.filter(
                  (searchToken) =>
                    !existingTokenAddresses.has(
                      searchToken.address.toLowerCase()
                    )
                )

                // Add new tokens to the main list
                if (newTokens.length > 0) {
                  clonedData.tokens[chainIdNum] = [
                    ...existingTokens,
                    ...newTokens,
                  ]
                }
              }
            )

            return clonedData
          }
        )
      }

      return tokensResponse
    },
    enabled: !!search,
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

  return {
    isLoading: isSearchLoading,
  }
}
