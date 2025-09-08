import { useMemo } from 'react'
import { useTokenSearch } from './useTokenSearch.js'
import { useTokens } from './useTokens.js'

export const useToken = (
  chainId?: number,
  tokenAddress?: string,
  latest?: boolean
) => {
  const { allTokens, isLoading: isTokensLoading } = useTokens()

  const token = useMemo(
    () =>
      chainId && tokenAddress
        ? allTokens?.[chainId]?.find(
            (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
          )
        : undefined,
    [allTokens, chainId, tokenAddress]
  )

  const tokenSearchEnabled =
    !!chainId && !!tokenAddress && (latest || (!isTokensLoading && !token))

  const { token: searchedToken, isLoading: isSearchLoading } = useTokenSearch(
    chainId,
    tokenAddress,
    tokenSearchEnabled
  )

  const resolvedToken = latest
    ? (searchedToken ?? token)
    : (token ?? searchedToken)

  return {
    token: resolvedToken,
    isLoading:
      !resolvedToken &&
      (isTokensLoading || (tokenSearchEnabled && isSearchLoading)),
  }
}
