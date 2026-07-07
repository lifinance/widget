import type { FormType } from '@lifi/widget/shared'
import {
  FormKeyHelper,
  TokenNotFound,
  useChainOrderStore,
  useDebouncedWatch,
  useFieldValues,
  useListHeight,
  useTokenBalances,
  useTokenList,
  useTokenSelect,
  useWidgetEvents,
  VirtualizedTokenList,
  WidgetEvent,
} from '@lifi/widget/shared'
import { Box } from '@mui/material'
import type { RefObject } from 'react'
import { type FC, memo, useEffect, useMemo, useRef } from 'react'

export interface SelectTokenListProps {
  formType: FormType
  headerRef: RefObject<HTMLElement | null>
  afterTokenSelect: () => void
  // Only wallet-funded flows fetch balances; transfer/exchange/cash render a
  // balance-free list without a connected wallet.
  isWalletFunded: boolean
  /**
   * When provided, restrict the rendered token list to these symbols
   * (case-insensitive). Categories and pinned sections are suppressed so
   * the curated set renders as a flat list.
   */
  allowedSymbols?: ReadonlySet<string>
}

type SharedListProps = Omit<SelectTokenListProps, 'isWalletFunded'> & {
  selectedChainId?: number
  selectedTokenAddress?: string
  isAllNetworks: boolean
  tokenSearchFilter?: string
}

type TokenListResult = ReturnType<typeof useTokenBalances>

const TokenListView: FC<SharedListProps & TokenListResult> = ({
  formType,
  headerRef,
  afterTokenSelect,
  allowedSymbols,
  selectedChainId,
  selectedTokenAddress,
  isAllNetworks,
  tokenSearchFilter,
  tokens,
  withCategories,
  withPinnedTokens,
  isTokensLoading,
  isSearchLoading,
  isBalanceLoading,
}) => {
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { listHeight } = useListHeight({ listParentRef, headerRef })
  const emitter = useWidgetEvents()
  const handleTokenClick = useTokenSelect(formType, afterTokenSelect)

  const filteredTokens = useMemo(() => {
    if (!allowedSymbols || allowedSymbols.size === 0) {
      return tokens
    }
    // Strip on-wallet amounts — the curated list funds from an exchange,
    // not the connected wallet — regardless of which hook fed the list.
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

const WalletTokenList: FC<SharedListProps> = (props) => {
  const result = useTokenBalances(
    props.selectedChainId,
    props.formType,
    props.isAllNetworks,
    props.tokenSearchFilter
  )
  return <TokenListView {...props} {...result} />
}

const PlainTokenList: FC<SharedListProps> = (props) => {
  const result = useTokenList(
    props.selectedChainId,
    props.formType,
    props.isAllNetworks,
    props.tokenSearchFilter
  )
  return <TokenListView {...props} {...result} isBalanceLoading={false} />
}

export const SelectTokenList: FC<SelectTokenListProps> = memo(
  ({
    formType,
    headerRef,
    afterTokenSelect,
    isWalletFunded,
    allowedSymbols,
  }) => {
    const [selectedChainId, selectedTokenAddress] = useFieldValues(
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType)
    )

    // The curated CEX list is pinned to a single chain (mainnet) — never span
    // networks, even if an "all networks" toggle was left on by a prior flow.
    const isAllNetworks =
      useChainOrderStore((state) => state[`${formType}IsAllNetworks`]) &&
      !allowedSymbols

    const [tokenSearchFilter]: string[] = useDebouncedWatch(
      320,
      'tokenSearchFilter'
    )

    const shared: SharedListProps = {
      formType,
      headerRef,
      afterTokenSelect,
      allowedSymbols,
      selectedChainId,
      selectedTokenAddress,
      isAllNetworks,
      tokenSearchFilter,
    }

    return isWalletFunded ? (
      <WalletTokenList {...shared} />
    ) : (
      <PlainTokenList {...shared} />
    )
  }
)
