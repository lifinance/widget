import type { Token } from '@lifi/sdk'
import { formatTokenPrice } from './format.js'

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
  const fromTokenPrice = formatTokenPrice(
    fromAmount,
    fromToken.priceUSD,
    fromToken.decimals
  )
  const toTokenPrice = formatTokenPrice(
    toAmount,
    toToken.priceUSD,
    toToken.decimals
  )

  if (!fromTokenPrice) {
    return 0
  }

  const priceImpact = toTokenPrice / fromTokenPrice - 1

  return priceImpact
}
