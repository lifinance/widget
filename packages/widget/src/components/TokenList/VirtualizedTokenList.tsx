import { Typography } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { FC } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { TokenAmount } from '../../types/token.js'
import { TokenDetailsSheet } from './TokenDetailsSheet.js'
import { List } from './TokenList.style.js'
import { TokenListItem, TokenListItemSkeleton } from './TokenListItem.js'
import type {
  TokenDetailsSheetBase,
  VirtualizedTokenListProps,
} from './types.js'

export const VirtualizedTokenList: FC<VirtualizedTokenListProps> = ({
  account,
  tokens,
  scrollElementRef,
  chainId,
  chain,
  selectedTokenAddress,
  isLoading,
  isBalanceLoading,
  showCategories,
  onClick,
}) => {
  const { t } = useTranslation()

  const tokenDetailsSheetRef = useRef<TokenDetailsSheetBase>(null)

  const onShowTokenDetails = useCallback(
    (tokenAddress: string, noContractAddress: boolean) => {
      tokenDetailsSheetRef.current?.open(tokenAddress, noContractAddress)
    },
    []
  )

  const getItemKey = useCallback(
    (index: number) => {
      return `${tokens[index].address}-${index}`
    },
    [tokens]
  )

  const { getVirtualItems, getTotalSize, scrollToIndex } = useVirtualizer({
    count: tokens.length,
    overscan: 5,
    paddingEnd: 12,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: (index) => {
      // Base size for TokenListItem
      let size = 64
      // Early return if categories are not shown
      if (!showCategories) {
        return size
      }

      const currentToken = tokens[index]
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
    getItemKey,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when chainId changes
  useEffect(() => {
    // Scroll to the top of the list when switching the chains
    if (getVirtualItems().length) {
      scrollToIndex(0, { align: 'start' })
    }
    // Close the token details sheet when switching the chains
    tokenDetailsSheetRef.current?.close()
  }, [scrollToIndex, chainId, getVirtualItems])

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

          const startAdornmentLabel = showCategories
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

          return (
            <TokenListItem
              key={item.key}
              onClick={onClick}
              size={item.size}
              start={item.start}
              token={currentToken}
              chain={chain}
              selected={currentToken.address === selectedTokenAddress}
              onShowTokenDetails={onShowTokenDetails}
              isBalanceLoading={isBalanceLoading}
              accountAddress={account.address}
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
      <TokenDetailsSheet ref={tokenDetailsSheetRef} chainId={chainId} />
    </>
  )
}
