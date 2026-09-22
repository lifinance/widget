import { Box } from '@mui/material'
import { type FC, memo, useCallback, useEffect, useRef } from 'react'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useRecentTokensStore } from '../../stores/recentTokens/RecentTokensStore.js'
import { toRecentToken } from '../../stores/recentTokens/utils.js'
import { WidgetEvent } from '../../types/events.js'
import type { TokenAmount } from '../../types/token.js'
import { TokenNotFound } from './TokenNotFound.js'
import type { TokenListProps } from './types.js'
import { useTokenSelect } from './useTokenSelect.js'
import { VirtualizedTokenList } from './VirtualizedTokenList.js'

export const TokenList: FC<TokenListProps> = memo(({ formType, headerRef }) => {
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

  const selectToken = useTokenSelect(formType, navigateBack)
  const [addRecentToken, isRecentToken] = useRecentTokensStore((state) => [
    state.addRecentToken,
    state.isRecentToken,
  ])

  // onClick reaches every memoized row, so it must not depend on values that
  // change on each balance refetch or keystroke.
  const tokensRef = useRef(tokens)
  tokensRef.current = tokens
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
        (searchRef.current || isRecentToken(chainId, address))
      ) {
        addRecentToken(toRecentToken(token))
      }
      selectToken(address, chainId)
    },
    [addRecentToken, isRecentToken, selectToken]
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
        tokens={tokens}
        scrollElementRef={listParentRef}
        chainId={selectedChainId}
        isLoading={isTokensLoading || isSearchLoading}
        isBalanceLoading={isBalanceLoading}
        showCategories={showCategories}
        showPinnedTokens={withPinnedTokens}
        onClick={handleTokenClick}
        selectedTokenAddress={selectedTokenAddress}
        isAllNetworks={isAllNetworks}
      />
    </Box>
  )
})
