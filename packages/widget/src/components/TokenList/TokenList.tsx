import { Box } from '@mui/material'
import { type FC, memo, useEffect, useRef } from 'react'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch'
import { useListHeight } from '../../hooks/useListHeight'
import { useNavigateBack } from '../../hooks/useNavigateBack'
import { useTokenBalances } from '../../hooks/useTokenBalances'
import { useWidgetEvents } from '../../hooks/useWidgetEvents'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore'
import { FormKeyHelper } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { WidgetEvent } from '../../types/events'
import { TokenNotFound } from './TokenNotFound'
import type { TokenListProps } from './types'
import { useTokenSelect } from './useTokenSelect'
import { VirtualizedTokenList } from './VirtualizedTokenList'

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
