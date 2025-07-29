import { useAccount } from '@lifi/wallet-management'
import { Box } from '@mui/material'
import { type FC, useEffect, useMemo } from 'react'
import { formatUnits } from 'viem'
import { useChain } from '../../hooks/useChain.js'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useTokenSearch } from '../../hooks/useTokenSearch.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import type { TokenAmount } from '../../types/token.js'
import { TokenNotFound } from './TokenNotFound.js'
import type { TokenListProps } from './types.js'
import { useTokenSelect } from './useTokenSelect.js'
import { filteredTokensComparator } from './utils.js'
import { VirtualizedTokenList } from './VirtualizedTokenList.js'

const sortFn = (a: TokenAmount, b: TokenAmount) =>
  Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
    Number.parseFloat(b.priceUSD ?? '0') -
  Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
    Number.parseFloat(a.priceUSD ?? '0')

export const TokenList: FC<TokenListProps> = ({
  formType,
  parentRef,
  height,
  onClick,
}) => {
  const emitter = useWidgetEvents()
  const [selectedChainId, selectedTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )
  const isAllNetworks = useChainOrderStore((state) => state.isAllNetworks)

  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    320,
    'tokenSearchFilter'
  )

  const { chain: selectedChain, isLoading: isSelectedChainLoading } =
    useChain(selectedChainId)
  const { account } = useAccount({
    chainType: selectedChain?.chainType,
  })

  const {
    tokens: tokensPerChain,
    isLoading: isTokensLoading,
    isBalanceLoading,
  } = useTokenBalances(selectedChainId, formType, isAllNetworks)

  const { tokens: configTokens } = useWidgetConfig()

  const [sortedTokens, popularTokens, featuredTokens] = useMemo(() => {
    const tokens = (tokensPerChain ?? []) as TokenAmount[]

    if (isAllNetworks) {
      const tokensWithAmount: TokenAmount[] = []
      const otherTokens: TokenAmount[] = []

      for (const token of tokens) {
        if (token.amount) {
          tokensWithAmount.push(token)
        } else {
          otherTokens.push(token)
        }
      }

      tokensWithAmount.sort(sortFn)

      const sortedTokens = [...tokensWithAmount, ...otherTokens]

      return [sortedTokens, [], []]
    } else {
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

      const tokensWithAmount: TokenAmount[] = []
      const otherTokens: TokenAmount[] = []

      for (const token of remainingTokens) {
        if (token.featured) {
          featuredTokensFromConfig.push(token)
        } else if (token.amount) {
          tokensWithAmount.push(token)
        } else if (token.popular) {
          popularTokensFromConfig.push(token)
        } else {
          otherTokens.push(token)
        }
      }

      tokensWithAmount.sort(sortFn)

      const sortedTokens = [
        ...featuredTokensFromConfig,
        ...tokensWithAmount,
        ...popularTokensFromConfig,
        ...otherTokens,
      ]

      return [sortedTokens, popularTokensFromConfig, featuredTokensFromConfig]
    }
  }, [tokensPerChain, selectedChainId, configTokens, isAllNetworks])

  const normalizedSearchFilter = tokenSearchFilter?.replaceAll('$', '')
  const searchFilter = normalizedSearchFilter?.toUpperCase() ?? ''

  const filteredTokens = tokenSearchFilter
    ? sortedTokens
        .filter(
          (token) =>
            token.name?.toUpperCase().includes(searchFilter) ||
            token.symbol
              .toUpperCase()
              // Replace ₮ with T for USD₮0
              .replaceAll('₮', 'T')
              .includes(searchFilter) ||
            token.address.toUpperCase().includes(searchFilter)
        )
        .sort(filteredTokensComparator(searchFilter))
    : sortedTokens

  const tokenSearchEnabled =
    !isTokensLoading &&
    !filteredTokens.length &&
    !!tokenSearchFilter &&
    !!selectedChainId

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(
      selectedChainId,
      normalizedSearchFilter,
      tokenSearchEnabled,
      formType
    )

  const isLoading =
    isTokensLoading ||
    isSelectedChainLoading ||
    (tokenSearchEnabled && isSearchedTokenLoading)

  const tokens = filteredTokens.length
    ? filteredTokens
    : searchedToken
      ? [searchedToken]
      : filteredTokens

  const handleTokenClick = useTokenSelect(formType, onClick)
  const showCategories =
    Boolean(featuredTokens?.length || popularTokens?.length) &&
    !tokenSearchFilter &&
    !isAllNetworks

  // biome-ignore lint/correctness/useExhaustiveDependencies: Should fire only when search filter changes
  useEffect(() => {
    if (normalizedSearchFilter) {
      emitter.emit(WidgetEvent.TokenSearch, {
        value: normalizedSearchFilter,
        tokens,
      })
    }
  }, [normalizedSearchFilter, emitter])

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!tokens.length && !isLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        account={account}
        tokens={tokens}
        scrollElementRef={parentRef}
        chainId={selectedChainId}
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showCategories={showCategories}
        onClick={handleTokenClick}
        selectedTokenAddress={selectedTokenAddress}
        isAllNetworks={isAllNetworks}
      />
    </Box>
  )
}
