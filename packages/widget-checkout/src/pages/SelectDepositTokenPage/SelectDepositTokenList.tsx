import type { FormType } from '@lifi/widget/shared'
import {
  FormKeyHelper,
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
} from '@lifi/widget/shared'
import { Box } from '@mui/material'
import type { RefObject } from 'react'
import { type FC, memo, useEffect, useMemo, useRef } from 'react'

export interface SelectDepositTokenListProps {
  formType: FormType
  headerRef: RefObject<HTMLElement | null>
  afterTokenSelect: () => void
  /**
   * When provided, restrict the rendered token list to these symbols
   * (case-insensitive). Categories and pinned sections are suppressed so
   * the curated set renders as a flat list.
   */
  allowedSymbols?: ReadonlySet<string>
}

/** Token list with checkout navigation after selection (widget `TokenList` uses internal back navigation). */
export const SelectDepositTokenList: FC<SelectDepositTokenListProps> = memo(
  ({ formType, headerRef, afterTokenSelect, allowedSymbols }) => {
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

    // Strip on-wallet balance fields so the curated CEX list doesn't suggest
    // self-custody amounts — the user funds from an exchange, not their wallet.
    const filteredTokens = useMemo(() => {
      if (!allowedSymbols || allowedSymbols.size === 0) {
        return tokens
      }
      return tokens
        .filter((token) => allowedSymbols.has(token.symbol.toUpperCase()))
        .map((token) => ({ ...token, amount: undefined }))
    }, [tokens, allowedSymbols])

    const showCategories =
      !allowedSymbols && withCategories && !tokenSearchFilter && !isAllNetworks
    const showPinnedTokens = allowedSymbols ? false : withPinnedTokens
    const balanceLoading = allowedSymbols ? false : isBalanceLoading

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
        {!filteredTokens.length && !isTokensLoading && !isSearchLoading ? (
          <TokenNotFound formType={formType} />
        ) : null}
        <VirtualizedTokenList
          tokens={filteredTokens}
          scrollElementRef={listParentRef}
          chainId={selectedChainId}
          isLoading={isTokensLoading || isSearchLoading}
          isBalanceLoading={balanceLoading}
          showCategories={showCategories}
          showPinnedTokens={showPinnedTokens}
          onClick={handleTokenClick}
          selectedTokenAddress={selectedTokenAddress}
          isAllNetworks={isAllNetworks}
        />
      </Box>
    )
  }
)
