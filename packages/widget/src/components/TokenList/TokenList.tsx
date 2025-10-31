import { Box } from '@mui/material'
import { type FC, memo, useEffect, useRef } from 'react'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
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

export const TokenList: FC<TokenListProps> = memo(({ formType, headerRef }) => {
  const { navigateBack } = useNavigateBack()
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
    isTokensLoading,
    isBalanceLoading,
    isSearchLoading,
  } = useTokenBalances(
    selectedChainId,
    formType,
    isAllNetworks,
    tokenSearchFilter
  )

  const handleTokenClick = useTokenSelect(formType, navigateBack)

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
        onClick={handleTokenClick}
        selectedTokenAddress={selectedTokenAddress}
        isAllNetworks={isAllNetworks}
      />
    </Box>
  )
})
