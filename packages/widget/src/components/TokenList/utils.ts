import type { TokenExtended } from '@lifi/sdk'
import { formatUnits } from 'viem'
import type { TokenAmount } from '../../types/token.js'
import type { WidgetTokens } from '../../types/widget.js'

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
  configTokens?: WidgetTokens,
  selectedChainId?: number,
  tokens?: TokenExtended[],
  tokensWithBalances?: TokenAmount[]
) => {
  if (isBalanceLoading) {
    if (isAllNetworks) {
      const sortedTokens = [...(tokens ?? [])].sort(sortByVolume)
      return {
        processedTokens: sortedTokens,
        withCategories: false,
      }
    } else {
      return processedTypedTokens(
        tokens ?? [],
        [],
        selectedChainId,
        configTokens
      )
    }
  }

  const sortedTokensWithBalances = [...(tokensWithBalances ?? [])].sort(
    sortByBalances
  )

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
    return processedTypedTokens(
      tokensWithoutBalances,
      sortedTokensWithBalances,
      selectedChainId,
      configTokens
    )
  }
}

// NB: only for non-all-networks
export const processedTypedTokens = (
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
