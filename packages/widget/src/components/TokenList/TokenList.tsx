import { Box } from '@mui/material'
import { type FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useRecentTokens } from '../../hooks/useRecentTokens.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useRecentTokensStore } from '../../stores/recentTokens/RecentTokensStore.js'
import { toRecentToken } from '../../stores/recentTokens/utils.js'
import { WidgetEvent } from '../../types/events.js'
import type { TokenAmount } from '../../types/token.js'
import { collapsedRecentCount } from '../../utils/recentTokens.js'
import { TokenNotFound } from './TokenNotFound.js'
import type { TokenListProps } from './types.js'
import { useTokenSelect } from './useTokenSelect.js'
import { VirtualizedTokenList } from './VirtualizedTokenList.js'

export const TokenList: FC<TokenListProps> = memo(({ formType, headerRef }) => {
  const { hiddenUI } = useWidgetConfig()
  const navigateBack = useNavigateBack()
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { listHeight } = useListHeight({
    listParentRef,
    headerRef,
  })

  const emitter = useWidgetEvents()

  const [selectedChainId, selectedTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )

  const isAllNetworks = useChainOrderStore(
    (state) => state[`${formType}IsAllNetworks`]
  )

  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    320,
    'tokenSearchFilter'
  )

  const {
    tokens,
    withCategories,
    withPinnedTokens,
    isTokensLoading,
    isBalanceLoading,
    isSearchLoading,
    nativeHoisted,
  } = useTokenBalances(
    selectedChainId,
    formType,
    isAllNetworks,
    tokenSearchFilter
  )

  const [recentExpanded, setRecentExpanded] = useState(false)

  const {
    tokens: tokensWithRecent,
    bandEntries,
    recentStartIndex,
    recentCount,
    totalRecentCount,
  } = useRecentTokens(tokens, {
    selectedChainId,
    isAllNetworks,
    search: tokenSearchFilter,
    expanded: recentExpanded,
    formType,
    isTokensLoading,
    nativeHoisted: !!nativeHoisted,
  })

  const selectToken = useTokenSelect(formType, navigateBack)
  const [addRecentToken, isRecentToken, clearRecentTokens] =
    useRecentTokensStore((state) => [
      state.addRecentToken,
      state.isRecentToken,
      state.clearRecentTokens,
    ])

  // Refs keep onClick stable across refetches and keystrokes for memoized rows.
  const tokensRef = useRef(tokensWithRecent)
  tokensRef.current = tokensWithRecent
  const searchRef = useRef(tokenSearchFilter)
  searchRef.current = tokenSearchFilter

  const handleTokenClick = useCallback(
    (address: string, chainId?: number) => {
      const lower = address.toLowerCase()
      let token: TokenAmount | undefined
      for (const item of tokensRef.current) {
        if (item.chainId !== chainId || item.address.toLowerCase() !== lower) {
          continue
        }
        // Prefer the live row, so a bump refreshes the stored snapshot.
        if (!item.recent) {
          token = item
          break
        }
        token ??= item
      }
      if (
        token &&
        chainId &&
        !hiddenUI?.recentSearches &&
        (searchRef.current || isRecentToken(chainId, address))
      ) {
        addRecentToken(toRecentToken(token))
      }
      // The live row's address carries the canonical casing.
      selectToken(token?.address ?? address, chainId)
    },
    [addRecentToken, isRecentToken, selectToken, hiddenUI?.recentSearches]
  )

  const toggleRecentExpanded = useCallback(
    () => setRecentExpanded((value) => !value),
    []
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: collapse the band when the chain scope changes
  useEffect(() => {
    setRecentExpanded(false)
  }, [selectedChainId, isAllNetworks])

  // Collapse once the toggle is gone, or the next recent reopens it expanded.
  useEffect(() => {
    if (totalRecentCount <= collapsedRecentCount) {
      setRecentExpanded(false)
    }
  }, [totalRecentCount])

  // The band filters on chain, config and pins; Clear takes its exact entries.
  const bandEntriesRef = useRef(bandEntries)
  bandEntriesRef.current = bandEntries
  const clearRecentBand = useCallback(
    () => clearRecentTokens(bandEntriesRef.current),
    [clearRecentTokens]
  )

  const showCategories = withCategories && !tokenSearchFilter && !isAllNetworks

  useEffect(() => {
    const normalizedSearchFilter = tokenSearchFilter?.replaceAll('$', '')
    if (normalizedSearchFilter) {
      emitter.emit(WidgetEvent.TokenSearch, {
        value: normalizedSearchFilter,
        tokens,
      })
    }
  }, [tokenSearchFilter, tokens, emitter])

  return (
    <Box ref={listParentRef} style={{ height: listHeight, overflow: 'auto' }}>
      {!tokens.length && !isTokensLoading && !isSearchLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        tokens={tokensWithRecent}
        scrollElementRef={listParentRef}
        chainId={selectedChainId}
        isLoading={isTokensLoading || isSearchLoading}
        isBalanceLoading={isBalanceLoading}
        showCategories={showCategories}
        showPinnedTokens={withPinnedTokens}
        onClick={handleTokenClick}
        selectedTokenAddress={selectedTokenAddress}
        isAllNetworks={isAllNetworks}
        nativeHoisted={!!nativeHoisted}
        recentStartIndex={recentStartIndex}
        recentCount={recentCount}
        hiddenRecentCount={totalRecentCount - recentCount}
        recentExpanded={recentExpanded}
        onToggleRecent={
          totalRecentCount > collapsedRecentCount
            ? toggleRecentExpanded
            : undefined
        }
        onClearRecent={clearRecentBand}
      />
    </Box>
  )
})
