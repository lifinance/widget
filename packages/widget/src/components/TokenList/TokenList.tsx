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
  } = useTokenBalances(
    selectedChainId,
    formType,
    isAllNetworks,
    tokenSearchFilter
  )

  const [recentExpanded, setRecentExpanded] = useState(false)

  const {
    tokens: tokensWithRecent,
    recentStartIndex,
    recentCount,
    totalRecentCount,
    nativeHoisted,
  } = useRecentTokens(tokens, {
    selectedChainId,
    isAllNetworks,
    search: tokenSearchFilter,
    expanded: recentExpanded,
    formType,
    isTokensLoading,
  })

  const selectToken = useTokenSelect(formType, navigateBack)
  const [addRecentToken, isRecentToken] = useRecentTokensStore((state) => [
    state.addRecentToken,
    state.isRecentToken,
  ])

  // onClick reaches every memoized row, so it must not depend on values that
  // change on each balance refetch or keystroke.
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
        // The live row wins over an injected recent copy, so bumping an entry
        // refreshes its snapshot.
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
      // Prefer the live row's address so the form always carries the token's
      // canonical casing, whichever copy the user clicked.
      selectToken(token?.address ?? address, chainId)
    },
    [addRecentToken, isRecentToken, selectToken, hiddenUI?.recentSearches]
  )

  const toggleRecentExpanded = useCallback(
    () => setRecentExpanded((value) => !value),
    []
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
      {!tokensWithRecent.length && !isTokensLoading && !isSearchLoading ? (
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
        nativeHoisted={nativeHoisted}
        recentStartIndex={recentStartIndex}
        recentCount={recentCount}
        hiddenRecentCount={totalRecentCount - recentCount}
        recentExpanded={recentExpanded}
        onToggleRecent={
          totalRecentCount > collapsedRecentCount
            ? toggleRecentExpanded
            : undefined
        }
      />
    </Box>
  )
})
