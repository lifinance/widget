import { useMemo } from 'react'
import { useTokenSearch } from './useTokenSearch.js'
import { useTokens } from './useTokens.js'

export const useToken = (chainId?: number, tokenAddress?: string) => {
  const { tokens: allTokens, isLoading } = useTokens()

  const tokensForChain = useMemo(
    () => (chainId ? allTokens?.[chainId] : undefined),
    [allTokens, chainId]
  )

  const token = useMemo(() => {
    return tokensForChain?.find((token) => token.address === tokenAddress)
  }, [tokenAddress, tokensForChain])

  const tokenSearchEnabled = !isLoading && !token
  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(chainId, tokenAddress, tokenSearchEnabled)

  return {
    token: token ?? searchedToken,
    isLoading: isLoading || (tokenSearchEnabled && isSearchedTokenLoading),
  }
}
