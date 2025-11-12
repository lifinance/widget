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
  showPinnedTokens,
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
      const previousToken = tokens[index - 1]
      let size = tokenItemHeight

      // Pinned tokens (always shown, even in all networks mode)
      if (currentToken.pinned && index === 0) {
        size += 24
      }
      if (previousToken?.pinned && !currentToken.pinned) {
        size += 32
      }

      if (!showCategories) {
        return size
      }

      if (currentToken.featured && !currentToken.pinned && index === 0) {
        size += 24
      }

      // Category transition (excluding pinned tokens)
      const isNotPinned = !currentToken.pinned && !previousToken?.pinned
      if (
        isNotPinned &&
        ((previousToken?.amount && !currentToken.amount) ||
          (previousToken?.featured && !currentToken.featured) ||
          (previousToken?.popular && !currentToken.popular))
      ) {
        size += 32
      }

      return size
    },
    [tokens, showCategories]
  )

  const virtualizerConfig = useMemo(
    () => ({
      count: tokens.length,
      overscan: 5,
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

          const isNotPinned = !currentToken.pinned
          const isFirstPinnedToken = currentToken.pinned && item.index === 0
          const isTransitionFromPinned = previousToken?.pinned && isNotPinned

          // Category transitions (excluding pinned)
          const isTransitionFromFeatured =
            previousToken?.featured && !currentToken.featured && isNotPinned
          const isTransitionFromMyTokens =
            previousToken?.amount && !currentToken.amount && isNotPinned
          const isTransitionFromPopular =
            previousToken?.popular && !currentToken.popular && isNotPinned

          // Determine which category label to show
          const startAdornmentLabel = (() => {
            if (showPinnedTokens && isFirstPinnedToken) {
              return t('main.pinnedTokens')
            }
            if (showPinnedTokens && !showCategories && isTransitionFromPinned) {
              return t('main.allTokens')
            }
            if (!showCategories) {
              return null
            }

            if (
              (isTransitionFromPinned && currentToken.featured) ||
              (currentToken.featured && isNotPinned && item.index === 0)
            ) {
              return t('main.featuredTokens')
            }
            if (
              (isTransitionFromFeatured || isTransitionFromPinned) &&
              currentToken.amount &&
              isNotPinned
            ) {
              return t('main.myTokens')
            }
            if (
              (isTransitionFromFeatured ||
                isTransitionFromMyTokens ||
                isTransitionFromPinned) &&
              currentToken.popular &&
              isNotPinned
            ) {
              return t('main.popularTokens')
            }
            if (
              isTransitionFromMyTokens ||
              isTransitionFromFeatured ||
              isTransitionFromPinned ||
              isTransitionFromPopular
            ) {
              return t('main.allTokens')
            }
            return null
          })()

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
                      pt:
                        isFirstPinnedToken ||
                        (currentToken.featured &&
                          isNotPinned &&
                          item.index === 0)
                          ? 0
                          : 1,
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
      {isLoading && (
        <List disablePadding sx={{ cursor: 'default' }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <TokenListItemSkeleton key={index} />
          ))}
        </List>
      )}
    </>
  )
}
