import { useMemo } from 'react'
import type { TokenAmount } from '../types/token.js'
import { useTokenBalances } from './useTokenBalances.js'

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string
) => {
  const { tokens, tokensWithBalance, chain, isBalanceLoading, refetch } =
    useTokenBalances(chainId)

  const token = useMemo(() => {
    if (tokenAddress && chainId) {
      let token = tokensWithBalance?.find(
        (token) => token.address === tokenAddress && token.chainId === chainId
      )
      if (!token) {
        token = tokens?.find(
          (token) => token.address === tokenAddress && token.chainId === chainId
        )
      }
      return token as TokenAmount
    }
  }, [chainId, tokenAddress, tokens, tokensWithBalance])

  return {
    token,
    chain,
    isLoading: isBalanceLoading,
    refetch,
  }
}
