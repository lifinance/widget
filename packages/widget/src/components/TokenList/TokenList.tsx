import { useAccount } from '@lifi/wallet-management'
import { Box } from '@mui/material'
import type { FC } from 'react'
import { useChain } from '../../hooks/useChain.js'
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js'
import { useTokenBalances } from '../../hooks/useTokenBalances.js'
import { useTokenSearch } from '../../hooks/useTokenSearch.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import type { TokenAmount } from '../../types/token.js'
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
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType))
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

  let filteredTokens = (tokensWithBalance ?? chainTokens ?? []) as TokenAmount[]
  const normalizedSearchFilter = tokenSearchFilter?.replaceAll('$', '')
  const searchFilter = normalizedSearchFilter?.toUpperCase() ?? ''

  filteredTokens = tokenSearchFilter
    ? filteredTokens
        .filter(
          (token) =>
            token.name?.toUpperCase().includes(searchFilter) ||
            token.symbol.toUpperCase().includes(searchFilter) ||
            token.address.toUpperCase().includes(searchFilter)
        )
        .sort(filteredTokensComparator(searchFilter))
    : filteredTokens

  const tokenSearchEnabled =
    !isTokensLoading &&
    !filteredTokens.length &&
    !!tokenSearchFilter &&
    !!selectedChainId

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(selectedChainId, normalizedSearchFilter, tokenSearchEnabled)

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

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!tokens.length && !isLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        account={account}
        tokens={tokens}
        scrollElementRef={parentRef}
        chainId={selectedChainId}
        chain={selectedChain}
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showCategories={showCategories}
        onClick={handleTokenClick}
      />
    </Box>
  )
}
