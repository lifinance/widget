import { Typography } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { isHoistableNative } from '../../utils/tokenList.js'
import { createBandResolver } from '../../utils/tokenListBands.js'
import { RecentTokensHeader } from './RecentTokensHeader.js'
import { RecentTokensToggle } from './RecentTokensToggle.js'
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
  recentStartIndex = 0,
  recentCount = 0,
  hiddenRecentCount = 0,
  recentExpanded = false,
  onToggleRecent,
  nativeHoisted,
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

  const resolvedNativeHoisted = useMemo(
    () => nativeHoisted ?? isHoistableNative(tokens[0]),
    [nativeHoisted, tokens]
  )

  const showRecentToggle = recentCount > 0 && !!onToggleRecent

  const bands = useMemo(
    () =>
      createBandResolver(tokens, {
        showCategories: !!showCategories,
        showPinnedTokens: !!showPinnedTokens,
        nativeHoisted: resolvedNativeHoisted,
        recentStartIndex,
        recentCount,
        showRecentToggle,
      }),
    [
      tokens,
      showCategories,
      showPinnedTokens,
      resolvedNativeHoisted,
      recentStartIndex,
      recentCount,
      showRecentToggle,
    ]
  )

  const estimateSize = useCallback(
    (index: number) => tokenItemHeight + bands.getRowExtraHeight(index),
    [bands]
  )

  const virtualizerConfig = useMemo(
    () => ({
      count: tokens.length,
      overscan: 5,
      getScrollElement: () => scrollElementRef.current,
      estimateSize,
      getItemKey,
      paddingEnd: 8,
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

  // Expanding moves the toggle row's extra height from the 4th recent row to
  // the 10th without a count change the virtualizer would notice on its own.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when the band expands
  useEffect(() => {
    measure()
  }, [recentExpanded, measure])

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
          const chain = chainsSet?.get(currentToken.chainId)
          const band = bands.getRowBandLabel(item.index)

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
              chainName={chain?.name}
              selected={isSelected}
              onShowTokenDetails={onShowTokenDetails}
              isBalanceLoading={isBalanceLoading}
              startAdornment={
                band?.kind === 'recent' ? (
                  <RecentTokensHeader atListStart={band.atListStart} />
                ) : band?.kind === 'text' ? (
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: '16px',
                      px: 1.5,
                      pt: band.atListStart ? 0 : 1,
                      pb: 1,
                    }}
                  >
                    {t(band.key)}
                  </Typography>
                ) : null
              }
              endAdornment={
                onToggleRecent &&
                recentCount > 0 &&
                item.index === recentStartIndex + recentCount - 1 ? (
                  <RecentTokensToggle
                    expanded={recentExpanded}
                    hiddenCount={hiddenRecentCount}
                    onToggle={onToggleRecent}
                  />
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
