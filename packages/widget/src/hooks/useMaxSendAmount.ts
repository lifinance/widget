import { useGasRecommendation } from './useGasRecommendation.js'
import { useTokenAddressBalance } from './useTokenAddressBalance.js'

// Largest amount of the token the wallet can send: for the native token that is
// the balance less the gas the chain recommends keeping back.
export const useMaxSendAmount = (
  chainId?: number,
  tokenAddress?: string
): bigint => {
  const { token, chain } = useTokenAddressBalance(chainId, tokenAddress)
  const { data } = useGasRecommendation(chainId)

  if (!token?.amount) {
    return 0n
  }
  if (chain?.nativeToken.address !== tokenAddress) {
    return token.amount
  }
  const reserved = BigInt(data?.recommended?.amount ?? 0)
  return token.amount > reserved ? token.amount - reserved : token.amount
}
