import { Box } from '@mui/material'
import { type FC, memo, useEffect } from 'react'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import { TokenNotFound } from './TokenNotFound.js'
import type { TokenListProps } from './types.js'
import { useTokenSelect } from './useTokenSelect.js'
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
      tokens,
      withCategories,
      isTokensLoading,
      isBalanceLoading,
      isSearchLoading,
    } = useTokenBalances(
      selectedChainId,
      formType,
      isAllNetworks,
      tokenSearchFilter
    )

    const handleTokenClick = useTokenSelect(formType, onClick)

    const showCategories =
      withCategories && !tokenSearchFilter && !isAllNetworks

    useEffect(() => {
      const normalizedSearchFilter = tokenSearchFilter?.replaceAll('$', '')
      if (normalizedSearchFilter) {
        emitter.emit(WidgetEvent.TokenSearch, {
          value: normalizedSearchFilter,
          tokens,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenSearchFilter, tokens, emitter])

    return (
      <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
        {!tokens.length && !isTokensLoading && !isSearchLoading ? (
          <TokenNotFound formType={formType} />
        ) : null}
        <VirtualizedTokenList
          tokens={tokens}
          scrollElementRef={parentRef}
          chainId={selectedChainId}
          isLoading={isTokensLoading || isSearchLoading}
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
