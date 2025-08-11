import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'
import { useChain } from './useChain.js'
import { useToken } from './useToken.js'
import { useTokenBalance } from './useTokenBalance.js'

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string
) => {
  const { chain, isLoading: isChainLoading } = useChain(chainId)
  const { account } = useAccount({ chainType: chain?.chainType })
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress)

  const accountAddress = useMemo(() => account?.address, [account?.address])

  const {
    token: tokenBalance,
    isLoading: isBalanceLoading,
    refetch,
  } = useTokenBalance(accountAddress, token)

  const result = useMemo(
    () => ({
      token: tokenBalance,
      chain,
      isLoading: isBalanceLoading || isChainLoading || isTokenLoading,
      refetch,
    }),
    [
      tokenBalance,
      chain,
      isBalanceLoading,
      refetch,
      isChainLoading,
      isTokenLoading,
    ]
  )

  return result
}
