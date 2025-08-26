import { ChainType, getTokens, type TokensResponse } from '@lifi/sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { isItemAllowed } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'
import { filterAllowedTokens } from '../utils/token.js'

export const useTokens = (formType?: FormType, search?: string) => {
  const {
    tokens: configTokens,
    chains: chainsConfig,
    keyPrefix,
  } = useWidgetConfig()

  const queryClient = useQueryClient()

  const chainTypes = useMemo(() => {
    return [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM].filter(
      (chainType) => isItemAllowed(chainType, chainsConfig?.types)
    )
  }, [chainsConfig?.types])

  const { data, isLoading } = useQuery({
    queryKey: search
      ? [getQueryKey('tokens', keyPrefix), search]
      : [getQueryKey('tokens', keyPrefix)],
    queryFn: async ({ queryKey }) => {
      const [, searchQuery] = queryKey
      const tokensResponse = await getTokens({
        chainTypes,
        orderBy: 'volumeUSD24H',
        extended: true,
        ...(searchQuery && { search: searchQuery }),
        limit: 1000,
      })

      // Merge search results into main tokens cache
      if (searchQuery) {
        queryClient.setQueriesData<TokensResponse>(
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
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

  const displayedTokens = useMemo(() => {
    return filterAllowedTokens(
      data?.tokens,
      configTokens,
      chainsConfig,
      formType
    )
  }, [data?.tokens, configTokens, chainsConfig, formType])

  const cachedAllTokens = queryClient.getQueryData<TokensResponse>([
    getQueryKey('tokens', keyPrefix),
  ])?.tokens

  const allTokens = useMemo(() => {
    return filterAllowedTokens(
      cachedAllTokens,
      configTokens,
      chainsConfig,
      formType
    )
  }, [cachedAllTokens, configTokens, chainsConfig, formType])

  return {
    allTokens,
    displayedTokens,
    isLoading,
  }
}
