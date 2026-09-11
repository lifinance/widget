import {
  ChainType,
  getToken,
  getTokens,
  type TokenExtended,
  type TokensExtendedResponse,
} from '@lifi/sdk'
import { useChainTypeFromAddress } from '@lifi/widget-provider'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokensByChain } from '../types/token.js'
import { isAddressQuery } from '../utils/address.js'
import { defaultChainIdsByType } from '../utils/chainType.js'
import { isItemAllowed } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'
import {
  filterAllowedTokens,
  getNativeTokenAddresses,
  mergeVerifiedWithSearchTokens,
} from '../utils/token.js'
import { useAvailableChains } from './useAvailableChains.js'

const refetchInterval = 300_000

export const useTokens = (
  formType?: FormType,
  search?: string,
  chainId?: number
): {
  allTokens: Record<number, TokenExtended[]> | undefined
  isLoading: boolean
  isSearchLoading: boolean
  /** The search is a contract address, so only the token at that address matches. */
  isAddressSearch: boolean
} => {
  const {
    tokens: configTokens,
    chains: chainsConfig,
    keyPrefix,
  } = useWidgetConfig()
  const sdkClient = useSDKClient()
  const { getChainTypeFromTokenAddress } = useChainTypeFromAddress()
  // A pasted address often carries a trailing space or newline, which the
  // API rejects. Trim once so the key, the requests and the checks agree.
  const trimmedSearch = search?.trim()
  // Keep this memoized, and out of any per-token loop: a provider validates by
  // parsing, which costs microseconds per call rather than nanoseconds.
  const isAddressSearch = useMemo(
    () => isAddressQuery(trimmedSearch, getChainTypeFromTokenAddress),
    [trimmedSearch, getChainTypeFromTokenAddress]
  )

  // Main tokens cache - verified tokens from API
  const { data: verifiedTokens, isLoading } = useQuery({
    queryKey: [getQueryKey('tokens', keyPrefix)],
    queryFn: async ({ signal }) => {
      const chainTypes = [
        ChainType.EVM,
        ChainType.SVM,
        ChainType.UTXO,
        ChainType.MVM,
        ChainType.TVM,
        ChainType.STL,
      ].filter((chainType) => isItemAllowed(chainType, chainsConfig?.types))

      const tokensResponse: TokensExtendedResponse = await getTokens(
        sdkClient,
        {
          chainTypes,
          orderBy: 'volumeUSD24H',
          extended: true,
          limit: 1000,
          minPriceUSD: 0.000001,
        },
        { signal }
      )

      // `listed` tells a main-list token from a searched one
      const tokens: TokensByChain = Object.fromEntries(
        Object.entries(tokensResponse.tokens).map(([chainId, tokens]) => [
          chainId,
          tokens.map((token) => ({ ...token, listed: true })),
        ])
      )

      return tokens
    },
    refetchInterval,
    staleTime: refetchInterval,
  })

  // Search tokens cache - unverified tokens from search
  const { data: searchTokens, isLoading: isSearchLoading } = useQuery({
    queryKey: [
      getQueryKey('tokens-search', keyPrefix),
      trimmedSearch,
      chainId,
      isAddressSearch,
    ] as const,
    queryFn: async ({ queryKey, signal }) => {
      const [, searchQuery, searchChainId, addressSearch] = queryKey
      const chainTypes = [
        ChainType.EVM,
        ChainType.SVM,
        ChainType.UTXO,
        ChainType.MVM,
        ChainType.TVM,
        ChainType.STL,
      ].filter((chainType) => isItemAllowed(chainType, chainsConfig?.types))

      const tokensResponse: TokensExtendedResponse = await getTokens(
        sdkClient,
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

      // Fallback: fetch a single token from the /token endpoint when the
      // search did not deliver one. Look it up on the selected chain, or
      // without one on the default chain of the address format.
      if (searchQuery) {
        const chainType = getChainTypeFromTokenAddress(searchQuery)
        const lookupChainId =
          searchChainId ??
          (chainType ? defaultChainIdsByType[chainType] : undefined)
        if (lookupChainId) {
          const existingTokens = tokensResponse.tokens[lookupChainId] ?? []
          // The search index also matches names, so for an address query
          // impersonators that embed the address can fill the list while the
          // token at that address is missing. Without a selected chain the
          // token can sit on any chain of the response.
          const hasTokenAtAddress = () => {
            const address = searchQuery.toLowerCase()
            const candidates = searchChainId
              ? [existingTokens]
              : Object.values(tokensResponse.tokens)
            return candidates.some((tokens) =>
              tokens.some((token) => token.address?.toLowerCase() === address)
            )
          }
          const isTokenMissing = addressSearch
            ? !hasTokenAtAddress()
            : !existingTokens.length
          if (isTokenMissing) {
            try {
              const token = await getToken(
                sdkClient,
                lookupChainId,
                searchQuery,
                { signal }
              )
              if (token) {
                tokensResponse.tokens[lookupChainId] = [
                  ...existingTokens,
                  token,
                ]
              }
            } catch (error) {
              // A guessed chain may not hold the token (HTTP 400). Keep the
              // search results instead of failing the whole query.
              if (signal.aborted) {
                throw error
              }
            }
          }
        }
      }

      return tokensResponse.tokens as TokensByChain
    },
    enabled: !!trimmedSearch,
    refetchInterval,
    staleTime: refetchInterval,
  })

  const { chains } = useAvailableChains()
  const nativeTokenAddresses = useMemo(
    () => getNativeTokenAddresses(chains),
    [chains]
  )

  // Merge tokens at read time - single place where caches are combined
  const allTokens = useMemo(() => {
    const merged = mergeVerifiedWithSearchTokens(verifiedTokens, searchTokens)
    return filterAllowedTokens(
      merged,
      configTokens,
      chainsConfig,
      formType,
      nativeTokenAddresses
    )
  }, [
    verifiedTokens,
    searchTokens,
    configTokens,
    chainsConfig,
    formType,
    nativeTokenAddresses,
  ])

  return {
    allTokens,
    isLoading,
    isSearchLoading,
    isAddressSearch,
  }
}
