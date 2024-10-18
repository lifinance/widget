import type { Token } from '@lifi/sdk'
import { formatTokenAmount, formatTokenPrice } from './format.js'

interface GetPriceImpractProps {
  fromToken: Token
  toToken: Token
  fromAmount?: bigint
  toAmount?: bigint
}

export const getPriceImpact = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}: GetPriceImpractProps) => {
  const fromTokenAmount = formatTokenAmount(fromAmount, fromToken.decimals)
  const fromTokenPrice = formatTokenPrice(fromTokenAmount, fromToken.priceUSD)

  const toTokenAmount = formatTokenAmount(toAmount, toToken.decimals)
  const toTokenPrice = formatTokenPrice(toTokenAmount, toToken.priceUSD) || 0.01

  const priceImpact = toTokenPrice / fromTokenPrice - 1

  return Number(priceImpact)
}
