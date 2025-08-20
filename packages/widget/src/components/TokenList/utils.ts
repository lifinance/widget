import type { TokenExtended } from '@lifi/sdk'
import { formatUnits } from 'viem'
import type { TokenAmount } from '../../types/token.js'
import type { WidgetTokens } from '../../types/widget.js'

export const filteredTokensComparator = (searchFilter: string) => {
  const isExactMatch = (token: TokenAmount) => {
    return (
      token.name?.toUpperCase() === searchFilter ||
      token.symbol.toUpperCase() === searchFilter ||
      token.address.toUpperCase() === searchFilter
    )
  }
  return (tokenA: TokenAmount, tokenB: TokenAmount) => {
    const isExactMatchA = isExactMatch(tokenA)
    const isExactMatchB = isExactMatch(tokenB)

    // Exact match with logo
    if (isExactMatchB && tokenB.logoURI) {
      return 1
    }
    if (isExactMatchA && tokenA.logoURI) {
      return -1
    }

    // Any token with a logo (exact match or not)
    if (tokenB.logoURI && !tokenA.logoURI) {
      return 1
    }
    if (tokenA.logoURI && !tokenB.logoURI) {
      return -1
    }

    // Exact match without logo
    if (isExactMatchB && !tokenB.logoURI) {
      return 1
    }
    if (isExactMatchA && !tokenA.logoURI) {
      return -1
    }

    // All other tokens are considered equal in sorting priority
    return 0
  }
}

const sortByBalances = (a: TokenAmount, b: TokenAmount) =>
  Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
    Number.parseFloat(b.priceUSD ?? '0') -
  Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
    Number.parseFloat(a.priceUSD ?? '0')

const sortByVolume = (a: TokenExtended, b: TokenExtended) =>
  (b.volumeUSD24H ?? 0) - (a.volumeUSD24H ?? 0)

export const processTokenBalances = (
  isBalanceLoading: boolean,
  isAllNetworks: boolean,
  configTokens: any,
  selectedChainId?: number,
  allTokens?: Record<number, TokenAmount[]>,
  allTokensWithBalances?: TokenAmount[]
) => {
  const tokens = isAllNetworks
    ? Object.values(allTokens ?? {}).flat()
    : selectedChainId
      ? allTokens?.[selectedChainId]
      : undefined

  if (isBalanceLoading) {
    if (isAllNetworks) {
      const sortedTokens = [...(tokens ?? [])].sort(sortByVolume)
      return {
        processedTokens: sortedTokens,
        withCategories: false,
      }
    } else {
      return mapAndSortTokens(tokens ?? [], [], selectedChainId, configTokens)
    }
  }

  const tokensWithBalances =
    (isAllNetworks
      ? allTokensWithBalances
      : allTokensWithBalances?.filter(
          (token) => token.chainId === selectedChainId
        )) ?? []
  const sortedTokensWithBalances = [...tokensWithBalances].sort(sortByBalances)

  const tokensWithBalancesSet = new Set(
    sortedTokensWithBalances.map(
      (token) => `${token.chainId}-${token.address.toLowerCase()}`
    )
  )
  const tokensWithoutBalances =
    tokens
      ?.filter((token) => {
        const tokenKey = `${token.chainId}-${token.address.toLowerCase()}`
        return !tokensWithBalancesSet.has(tokenKey)
      })
      .sort(sortByVolume) ?? []

  if (isAllNetworks) {
    return {
      processedTokens: [...sortedTokensWithBalances, ...tokensWithoutBalances],
      withCategories: false,
    }
  } else {
    return mapAndSortTokens(
      tokensWithoutBalances,
      sortedTokensWithBalances,
      selectedChainId,
      configTokens
    )
  }
}

export const mapAndSortTokens = (
  tokens: TokenAmount[],
  tokensWithBalances: TokenAmount[],
  selectedChainId?: number,
  configTokens?: WidgetTokens
) => {
  const filteredTokensMap = new Map(
    tokens.map((token) => [token.address, token])
  )

  const featuredTokensFromConfig: TokenAmount[] = []
  const popularTokensFromConfig: TokenAmount[] = []

  ;(['popular', 'featured'] as const).forEach((tokenType) => {
    const typedTokens = configTokens?.[tokenType]?.filter(
      (token) => token.chainId === selectedChainId
    )

    typedTokens?.forEach((token) => {
      const tokenAmount = { ...token } as TokenAmount
      tokenAmount[tokenType] = true

      const match = filteredTokensMap.get(token.address)
      if (match?.priceUSD) {
        tokenAmount.priceUSD = match.priceUSD
      }
      if (!token.logoURI && match?.logoURI) {
        tokenAmount.logoURI = match.logoURI
      }

      if (tokenType === 'popular') {
        popularTokensFromConfig.push(tokenAmount)
      } else {
        featuredTokensFromConfig.push(tokenAmount)
      }
    })
  })

  // Filter out config-added tokens from main list
  const configTokenAddresses = new Set(
    [...popularTokensFromConfig, ...featuredTokensFromConfig].map(
      (t) => t.address
    )
  )

  const remainingTokens = tokens.filter(
    (token) => !configTokenAddresses.has(token.address)
  )

  const otherTokens: TokenAmount[] = []

  for (const token of remainingTokens) {
    if (token.featured) {
      featuredTokensFromConfig.push(token)
    } else if (token.popular) {
      popularTokensFromConfig.push(token)
    } else {
      otherTokens.push(token)
    }
  }

  const sortedFeaturedTokens = [...featuredTokensFromConfig].sort(sortByVolume)
  const sortedPopularTokens = [...popularTokensFromConfig].sort(sortByVolume)
  const sortedOtherTokens = [...otherTokens].sort(sortByVolume)

  return {
    processedTokens: [
      ...sortedFeaturedTokens,
      ...tokensWithBalances,
      ...sortedPopularTokens,
      ...sortedOtherTokens,
    ],
    withCategories: Boolean(
      featuredTokensFromConfig?.length || popularTokensFromConfig?.length
    ),
  }
}
