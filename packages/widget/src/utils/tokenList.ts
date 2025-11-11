import type { TokenExtended, WalletTokenExtended } from '@lifi/sdk'
import { formatUnits } from 'viem'
import type { TokenAmount, TokenAmountExtended } from '../types/token.js'
import type { WidgetTokens } from '../types/widget.js'

const sortByBalances = (a: TokenAmount, b: TokenAmount) =>
  Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
    Number.parseFloat(b.priceUSD ?? '0') -
  Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
    Number.parseFloat(a.priceUSD ?? '0')

const sortByVolume = (a: TokenExtended, b: TokenExtended) =>
  (b.volumeUSD24H ?? 0) - (a.volumeUSD24H ?? 0)

export const processTokenBalances = (
  isBalanceLoading: boolean,
  noCategories: boolean,
  configTokens?: WidgetTokens,
  selectedChainId?: number,
  tokens?: TokenExtended[],
  tokensWithBalances?: TokenAmount[],
  isPinnedToken?: (chainId: number, tokenAddress: string) => boolean
) => {
  if (isBalanceLoading) {
    if (noCategories) {
      const sortedTokens = [...(tokens ?? [])].sort(sortByVolume)
      // Separate pinned tokens if we have the function
      if (isPinnedToken) {
        const pinned: TokenAmount[] = []
        const notPinned: TokenAmount[] = []
        for (const token of sortedTokens) {
          if (isPinnedToken(token.chainId, token.address)) {
            const pinnedToken = { ...token, pinned: true } as TokenAmount
            pinned.push(pinnedToken)
          } else {
            notPinned.push(token)
          }
        }
        return {
          processedTokens: [...pinned, ...notPinned],
          withCategories: pinned.length > 0,
        }
      }
      return {
        processedTokens: sortedTokens,
        withCategories: false,
      }
    } else {
      return processedTypedTokens(
        tokens ?? [],
        [],
        selectedChainId,
        configTokens,
        isPinnedToken
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

  if (noCategories) {
    // Separate pinned tokens if we have the function
    if (isPinnedToken) {
      const pinnedWithBalances: TokenAmount[] = []
      const notPinnedWithBalances: TokenAmount[] = []
      const pinnedWithoutBalances: TokenAmount[] = []
      const notPinnedWithoutBalances: TokenAmount[] = []

      for (const token of sortedTokensWithBalances) {
        if (isPinnedToken(token.chainId, token.address)) {
          const pinnedToken = { ...token, pinned: true } as TokenAmount
          pinnedWithBalances.push(pinnedToken)
        } else {
          notPinnedWithBalances.push(token)
        }
      }

      for (const token of tokensWithoutBalances) {
        if (isPinnedToken(token.chainId, token.address)) {
          const pinnedToken = { ...token, pinned: true } as TokenAmount
          pinnedWithoutBalances.push(pinnedToken)
        } else {
          notPinnedWithoutBalances.push(token)
        }
      }

      return {
        processedTokens: [
          ...pinnedWithBalances,
          ...pinnedWithoutBalances,
          ...notPinnedWithBalances,
          ...notPinnedWithoutBalances,
        ],
        withCategories:
          pinnedWithBalances.length > 0 || pinnedWithoutBalances.length > 0,
      }
    }
    return {
      processedTokens: [...sortedTokensWithBalances, ...tokensWithoutBalances],
      withCategories: false,
    }
  } else {
    return processedTypedTokens(
      tokensWithoutBalances,
      sortedTokensWithBalances,
      selectedChainId,
      configTokens,
      isPinnedToken
    )
  }
}

// NB: only for non-all-networks
const processedTypedTokens = (
  tokens: TokenAmount[],
  tokensWithBalances: TokenAmount[],
  selectedChainId?: number,
  configTokens?: WidgetTokens,
  isPinnedToken?: (chainId: number, tokenAddress: string) => boolean
) => {
  const filteredTokensMap = new Map(
    tokens.map((token) => [token.address, token])
  )

  const pinnedTokens: TokenAmount[] = []
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
    [...popularTokensFromConfig, ...featuredTokensFromConfig].map((t) =>
      t.address.toLowerCase()
    )
  )

  const remainingTokens = tokens.filter(
    (token) => !configTokenAddresses.has(token.address.toLowerCase())
  )

  const otherTokens: TokenAmount[] = []

  // Separate pinned tokens and categorize remaining tokens
  for (const token of remainingTokens) {
    const isPinned =
      isPinnedToken && selectedChainId
        ? isPinnedToken(selectedChainId, token.address)
        : false

    if (isPinned) {
      const pinnedToken = { ...token, pinned: true } as TokenAmount
      pinnedTokens.push(pinnedToken)
    } else if (token.featured) {
      featuredTokensFromConfig.push(token)
    } else if (token.popular) {
      popularTokensFromConfig.push(token)
    } else {
      otherTokens.push(token)
    }
  }

  // Also check tokens with balances for pinned status
  const pinnedTokensWithBalances: TokenAmount[] = []
  const nonPinnedTokensWithBalances: TokenAmount[] = []

  if (isPinnedToken && selectedChainId) {
    for (const token of tokensWithBalances) {
      if (isPinnedToken(selectedChainId, token.address)) {
        const pinnedToken = { ...token, pinned: true } as TokenAmount
        pinnedTokensWithBalances.push(pinnedToken)
      } else {
        nonPinnedTokensWithBalances.push(token)
      }
    }
  } else {
    nonPinnedTokensWithBalances.push(...tokensWithBalances)
  }

  const sortedPinnedTokens = [
    ...pinnedTokens,
    ...pinnedTokensWithBalances,
  ].sort(sortByVolume)
  const sortedFeaturedTokens = [...featuredTokensFromConfig].sort(sortByVolume)
  const sortedPopularTokens = [...popularTokensFromConfig].sort(sortByVolume)
  const sortedOtherTokens = [...otherTokens].sort(sortByVolume)

  return {
    processedTokens: [
      ...sortedPinnedTokens,
      ...sortedFeaturedTokens,
      ...nonPinnedTokensWithBalances,
      ...sortedPopularTokens,
      ...sortedOtherTokens,
    ],
    withCategories: Boolean(
      sortedPinnedTokens?.length ||
        featuredTokensFromConfig?.length ||
        popularTokensFromConfig?.length
    ),
  }
}

export const isSearchMatch = (
  token: TokenExtended | TokenAmountExtended,
  search?: string
) => {
  if (!search) {
    return true
  }

  const searchLowerCase = search.toLowerCase()
  return (
    token.name?.toLowerCase().includes(searchLowerCase) ||
    token.symbol
      ?.replaceAll('₮', 'T')
      .toLowerCase()
      .includes(searchLowerCase) ||
    token.address?.toLowerCase().includes(searchLowerCase)
  )
}

export const isSupportedToken = (token: WalletTokenExtended) => {
  return token.name && token.symbol && token.priceUSD && token.chainId
}
