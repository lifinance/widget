import type { TokenAmount } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
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

  const {
    token: tokenBalance,
    isLoading: isBalanceLoading,
    refetch,
  } = useTokenBalance(account?.address, token)

  return {
    token: tokenBalance ?? (token as TokenAmount),
    chain,
    isLoading: isBalanceLoading || isChainLoading || isTokenLoading,
    refetch,
  }
}
