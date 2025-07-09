import { useAccount } from '@lifi/wallet-management'
import { Box } from '@mui/material'
import { type FC, useEffect } from 'react'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useChain } from '../../hooks/useChain.js'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useTokenSearch } from '../../hooks/useTokenSearch.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import type { TokenAmount } from '../../types/token.js'
import { groupTokens } from '../../utils/groupTokens.js'
import { TokenNotFound } from './TokenNotFound.js'
import { VirtualizedTokenList } from './VirtualizedTokenList.js'
import type { TokenListProps } from './types.js'
import { useTokenSelect } from './useTokenSelect.js'
import { filteredTokensComparator } from './utils.js'

export const TokenList: FC<TokenListProps> = ({
  formType,
  parentRef,
  height,
  onClick,
}) => {
  const emitter = useWidgetEvents()
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType))
  const [selectedTokenAddress] = useFieldValues(
    FormKeyHelper.getTokenKey(formType)
  )
  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    320,
    'tokenSearchFilter'
  )

  const { chain: selectedChain, isLoading: isSelectedChainLoading } =
    useChain(selectedChainId)
  const { account } = useAccount({
    chainType: selectedChain?.chainType,
  })

  const {
    tokens: chainTokens,
    tokensWithBalance,
    isLoading: isTokensLoading,
    isBalanceLoading,
    featuredTokens,
    popularTokens,
  } = useTokenBalances(selectedChainId)

  const { chains } = useAvailableChains()

  let filteredTokens = (tokensWithBalance ?? chainTokens ?? []) as TokenAmount[]
  const normalizedSearchFilter = tokenSearchFilter?.replaceAll('$', '')
  const searchFilter = normalizedSearchFilter?.toUpperCase() ?? ''

  filteredTokens = tokenSearchFilter
    ? filteredTokens
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
    : filteredTokens

  const tokenSearchEnabled =
    !isTokensLoading &&
    !filteredTokens.length &&
    !!tokenSearchFilter &&
    !!selectedChainId // TODO: getToken needs chainId

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(selectedChainId, normalizedSearchFilter, tokenSearchEnabled) // TODO: getToken needs chainId

  const isLoading =
    isTokensLoading ||
    isSelectedChainLoading ||
    (tokenSearchEnabled && isSearchedTokenLoading)

  const tokens = filteredTokens.length
    ? filteredTokens
    : searchedToken
      ? [searchedToken]
      : filteredTokens

  const handleTokenClick = useTokenSelect(formType, onClick)
  const showCategories =
    Boolean(featuredTokens?.length || popularTokens?.length) &&
    !tokenSearchFilter

  // biome-ignore lint/correctness/useExhaustiveDependencies: Should fire only when search filter changes
  useEffect(() => {
    if (normalizedSearchFilter) {
      emitter.emit(WidgetEvent.TokenSearch, {
        value: normalizedSearchFilter,
        tokens,
      })
    }
  }, [normalizedSearchFilter, emitter])

  const networksOrTokens = selectedChainId
    ? tokens
    : groupTokens(tokens, chains ?? [])

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!networksOrTokens.length && !isLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        account={account}
        tokens={networksOrTokens}
        scrollElementRef={parentRef}
        chainId={selectedChainId}
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showCategories={showCategories}
        onClick={handleTokenClick}
        selectedTokenAddress={selectedTokenAddress}
      />
    </Box>
  )
}
