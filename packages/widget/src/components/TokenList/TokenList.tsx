import { Box } from '@mui/material'
import { type FC, memo, useEffect, useMemo } from 'react'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useTokenSearch } from '../../hooks/useTokenSearch.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import { TokenNotFound } from './TokenNotFound.js'
import type { TokenListProps } from './types.js'
import { useTokenSelect } from './useTokenSelect.js'
import { filteredTokensComparator } from './utils.js'
import { VirtualizedTokenList } from './VirtualizedTokenList.js'

export const TokenList: FC<TokenListProps> = memo(
  ({ formType, parentRef, height, onClick }) => {
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

    const {
      tokens: sortedTokens,
      withCategories,
      isTokensLoading,
      isBalanceLoading,
    } = useTokenBalances(selectedChainId, formType, isAllNetworks)

    const normalizedSearchFilter = useMemo(
      () => tokenSearchFilter?.replaceAll('$', ''),
      [tokenSearchFilter]
    )

    const searchFilter = useMemo(
      () => normalizedSearchFilter?.toUpperCase() ?? '',
      [normalizedSearchFilter]
    )

    const filteredTokens = useMemo(() => {
      if (!tokenSearchFilter) {
        return sortedTokens
      }
      return sortedTokens
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
    }, [sortedTokens, tokenSearchFilter, searchFilter])

    const tokenSearchEnabled = useMemo(
      () =>
        !isTokensLoading &&
        !filteredTokens.length &&
        !!tokenSearchFilter &&
        !!selectedChainId,
      [
        isTokensLoading,
        filteredTokens.length,
        tokenSearchFilter,
        selectedChainId,
      ]
    )

    const { token: searchedToken, isLoading: isSearchedTokenLoading } =
      useTokenSearch(
        selectedChainId,
        normalizedSearchFilter,
        tokenSearchEnabled,
        formType
      )

    const isLoading = useMemo(
      () => isTokensLoading || (tokenSearchEnabled && isSearchedTokenLoading),
      [isTokensLoading, tokenSearchEnabled, isSearchedTokenLoading]
    )

    const tokens = useMemo(() => {
      if (filteredTokens.length) {
        return filteredTokens
      }
      if (searchedToken) {
        return [searchedToken]
      }
      return filteredTokens
    }, [filteredTokens, searchedToken])

    const handleTokenClick = useTokenSelect(formType, onClick)

    const showCategories = useMemo(
      () => withCategories && !tokenSearchFilter && !isAllNetworks,
      [withCategories, tokenSearchFilter, isAllNetworks]
    )

    useEffect(() => {
      if (normalizedSearchFilter) {
        emitter.emit(WidgetEvent.TokenSearch, {
          value: normalizedSearchFilter,
          tokens,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedSearchFilter, tokens, emitter])

    return (
      <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
        {!tokens.length && !isLoading ? (
          <TokenNotFound formType={formType} />
        ) : null}
        <VirtualizedTokenList
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
)
