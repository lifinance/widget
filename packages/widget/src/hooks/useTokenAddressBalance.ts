import { useMemo } from 'react'
import type { TokenAmount } from '../types/token.js'
import { useTokenBalances } from './useTokenBalances.js'

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string
) => {
  const { tokens, chain, isBalanceLoading, refetch } = useTokenBalances(chainId)

  const token = useMemo(() => {
    if (tokenAddress && chainId) {
      const token = tokens?.find(
        (token) => token.address === tokenAddress && token.chainId === chainId
      )
      return token as TokenAmount
    }
  }, [chainId, tokenAddress, tokens])

  return {
    token,
    chain,
    isLoading: isBalanceLoading,
    refetch,
  }
}
