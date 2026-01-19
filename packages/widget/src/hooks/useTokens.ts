import {
  ChainType,
  getToken,
  getTokens,
  type TokensExtendedResponse,
} from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokensByChain } from '../types/token.js'
import {
  defaultChainIdsByType,
  getChainTypeFromAddress,
} from '../utils/chainType.js'
import { isItemAllowed } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'
import {
  filterAllowedTokens,
  mergeVerifiedWithSearchTokens,
} from '../utils/token.js'

const refetchInterval = 300_000

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

  // Main tokens cache - verified tokens from API
  const { data: verifiedTokens, isLoading } = useQuery({
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
          minPriceUSD: 0.000001,
        },
        { signal }
      )

      // Mark all tokens as verified
      const tokens: TokensByChain = Object.fromEntries(
        Object.entries(tokensResponse.tokens).map(([chainId, tokens]) => [
          chainId,
          tokens.map((token) => ({ ...token, verified: true })),
        ])
      )

      return tokens
    },
    refetchInterval,
    staleTime: refetchInterval,
  })

  // Search tokens cache - unverified tokens from search
  const { data: searchTokens, isLoading: isSearchLoading } = useQuery({
    queryKey: [getQueryKey('tokens-search', keyPrefix), search, chainId],
    queryFn: async ({ queryKey, signal }) => {
      const [, searchQuery, searchChainId] = queryKey as [
        string,
        string,
        number,
      ]
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
          minPriceUSD: 0.000001,
        },
        { signal }
      )

      // If the chainId is not provided, try to get it from the search query
      let _chainId = searchChainId
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

      // Mark all search tokens as unverified
      const tokens: TokensByChain = Object.fromEntries(
        Object.entries(tokensResponse.tokens).map(([chainId, tokens]) => [
          chainId,
          tokens.map((token) => ({ ...token, verified: false })),
        ])
      )

      return tokens
    },
    enabled: !!search,
    refetchInterval,
    staleTime: refetchInterval,
  })

  // Merge tokens at read time - single place where caches are combined
  const allTokens = useMemo(() => {
    const merged = mergeVerifiedWithSearchTokens(verifiedTokens, searchTokens)
    return filterAllowedTokens(merged, configTokens, chainsConfig, formType)
  }, [verifiedTokens, searchTokens, configTokens, chainsConfig, formType])

  return {
    allTokens,
    isLoading,
    isSearchLoading,
  }
}
