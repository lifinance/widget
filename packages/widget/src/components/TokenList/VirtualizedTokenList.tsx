import { Typography } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import type { TokenAmount } from '../../types/token.js'
import { TokenDetailsSheet } from './TokenDetailsSheet.js'
import { List } from './TokenList.style.js'
import { TokenListItem, TokenListItemSkeleton } from './TokenListItem.js'
import type {
  TokenDetailsSheetBase,
  VirtualizedTokenListProps,
} from './types.js'

const tokenItemHeight = 64 // 60 + 4px margin-bottom

export const VirtualizedTokenList: FC<VirtualizedTokenListProps> = ({
  tokens,
  scrollElementRef,
  chainId,
  selectedTokenAddress,
  isLoading,
  isBalanceLoading,
  showCategories,
  onClick,
  isAllNetworks,
}) => {
  const { t } = useTranslation()

  const { chains } = useAvailableChains()

  // Create Set for O(1) chain lookup instead of O(n) find
  const chainsSet = useMemo(() => {
    if (!chains) {
      return undefined
    }
    return new Map(chains.map((chain) => [chain.id, chain]))
  }, [chains])

  const tokenDetailsSheetRef = useRef<TokenDetailsSheetBase>(null)

  const onShowTokenDetails = useCallback(
    (tokenAddress: string, noContractAddress: boolean, chainId: number) => {
      tokenDetailsSheetRef.current?.open(
        tokenAddress,
        noContractAddress,
        chainId
      )
    },
    []
  )

  const getItemKey = useCallback(
    (index: number) => {
      const token = tokens[index]
      return `${token.chainId}-${token.address}-${index}`
    },
    [tokens]
  )

  const estimateSize = useCallback(
    (index: number) => {
      const currentToken = tokens[index]

      // Base size for TokenListItem
      let size = tokenItemHeight

      // Early return if categories are not shown
      if (!showCategories) {
        return size
      }

      const previousToken = tokens[index - 1]

      // Adjust size for the first featured token
      if (currentToken.featured && index === 0) {
        size += 24
      }

      // Adjust size based on changes between the current and previous tokens
      const isCategoryChanged =
        (previousToken?.amount && !currentToken.amount) ||
        (previousToken?.featured && !currentToken.featured) ||
        (previousToken?.popular && !currentToken.popular)

      if (isCategoryChanged) {
        size += 32
      }

      return size
    },
    [tokens, showCategories]
  )

  // Chunk the tokens for infinite loading simulation
  const virtualizerConfig = useMemo(
    () => ({
      count: tokens.length,
      overscan: 5,
      paddingEnd: 12,
      getScrollElement: () => scrollElementRef.current,
      estimateSize,
      getItemKey,
    }),
    [tokens.length, estimateSize, getItemKey, scrollElementRef]
  )

  const { getVirtualItems, getTotalSize, scrollToIndex, measure } =
    useVirtualizer(virtualizerConfig)

  // Address the issue of disappearing tokens on rerender
  useEffect(() => {
    if (scrollElementRef.current) {
      measure()
    }
  }, [measure, scrollElementRef.current])

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when chainId changes
  useEffect(() => {
    // Scroll to the top of the list when switching the chains
    if (getVirtualItems().length) {
      scrollToIndex(0, { align: 'start' })
    }
    // Close the token details sheet when switching the chains
    tokenDetailsSheetRef.current?.close()
  }, [scrollToIndex, isAllNetworks, chainId, getVirtualItems])

  if (isLoading) {
    return (
      <List disablePadding>
        {Array.from({ length: 3 }).map((_, index) => (
          <TokenListItemSkeleton key={index} />
        ))}
      </List>
    )
  }

  return (
    <>
      <List
        className="long-list"
        style={{ height: getTotalSize() }}
        disablePadding
      >
        {getVirtualItems().map((item) => {
          const currentToken = tokens[item.index]
          const previousToken: TokenAmount | undefined = tokens[item.index - 1]

          const chain = chainsSet?.get(currentToken.chainId)

          const isFirstFeaturedToken = currentToken.featured && item.index === 0

          const isTransitionFromFeaturedTokens =
            previousToken?.featured && !currentToken.featured

          const isTransitionFromMyTokens =
            previousToken?.amount && !currentToken.amount

          const isTransitionToMyTokens =
            isTransitionFromFeaturedTokens && currentToken.amount

          const isTransitionToPopularTokens =
            (isTransitionFromFeaturedTokens || isTransitionFromMyTokens) &&
            currentToken.popular

          const shouldShowAllTokensCategory =
            isTransitionFromMyTokens ||
            isTransitionFromFeaturedTokens ||
            (previousToken?.popular && !currentToken.popular)

          const startAdornmentLabel =
            !isAllNetworks && showCategories
              ? (() => {
                  if (isFirstFeaturedToken) {
                    return t('main.featuredTokens')
                  }
                  if (isTransitionToMyTokens) {
                    return t('main.myTokens')
                  }
                  if (isTransitionToPopularTokens) {
                    return t('main.popularTokens')
                  }
                  if (shouldShowAllTokensCategory) {
                    return t('main.allTokens')
                  }
                  return null
                })()
              : null

          const isSelected =
            selectedTokenAddress === currentToken.address &&
            chainId === currentToken.chainId

          return (
            <TokenListItem
              key={item.key}
              onClick={onClick}
              size={item.size}
              start={item.start}
              token={currentToken}
              chain={isAllNetworks ? chain : undefined}
              selected={isSelected}
              onShowTokenDetails={onShowTokenDetails}
              isBalanceLoading={isBalanceLoading}
              startAdornment={
                startAdornmentLabel ? (
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: '16px',
                      px: 1.5,
                      pt: isFirstFeaturedToken ? 0 : 1,
                      pb: 1,
                    }}
                  >
                    {startAdornmentLabel}
                  </Typography>
                ) : null
              }
            />
          )
        })}
      </List>
      <TokenDetailsSheet ref={tokenDetailsSheetRef} />
    </>
  )
}
