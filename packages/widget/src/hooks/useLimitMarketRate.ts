import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useToken } from './useToken.js'

/**
 * Canonical limit-order market rate (receive token per send token), derived
 * from the tokens' USD prices: 1 send token ≈ sendPrice / receivePrice receive
 * tokens. This is the spot ratio — what the price card's "Market" reference and
 * proximity indicator compare against. Returns `undefined` until both token
 * prices are known.
 */
export const useLimitMarketRate = (): number | undefined => {
  const [fromChainId, fromTokenAddress, toChainId, toTokenAddress] =
    useFieldValues(
      FormKeyHelper.getChainKey('from'),
      FormKeyHelper.getTokenKey('from'),
      FormKeyHelper.getChainKey('to'),
      FormKeyHelper.getTokenKey('to')
    )
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress)
  const { token: toToken } = useToken(toChainId, toTokenAddress)

  const fromPrice = Number(fromToken?.priceUSD)
  const toPrice = Number(toToken?.priceUSD)

  if (
    !fromPrice ||
    !toPrice ||
    Number.isNaN(fromPrice) ||
    Number.isNaN(toPrice)
  ) {
    return undefined
  }

  return fromPrice / toPrice
}
