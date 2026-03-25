import {
  FormKeyHelper,
  type FormType,
  TokenNotFound,
  useChainOrderStore,
  useDebouncedWatch,
  useFieldValues,
  useListHeight,
  useTokenBalances,
  useTokenSelect,
  useWidgetEvents,
  VirtualizedTokenList,
  WidgetEvent,
} from '@lifi/widget'
import { Box } from '@mui/material'
import type { RefObject } from 'react'
import { type FC, memo, useEffect, useRef } from 'react'

export interface SelectDepositTokenListProps {
  formType: FormType
  headerRef: RefObject<HTMLElement | null>
  afterTokenSelect: () => void
}

/** Token list with checkout navigation after selection (widget `TokenList` uses internal back navigation). */
export const SelectDepositTokenList: FC<SelectDepositTokenListProps> = memo(
  ({ formType, headerRef, afterTokenSelect }) => {
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

    const handleTokenClick = useTokenSelect(formType, afterTokenSelect)

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
  }
)
