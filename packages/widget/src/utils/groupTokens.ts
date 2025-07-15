import type { ExtendedChain } from '@lifi/sdk'
import type { NetworkAmount, TokenAmount } from '../types/token'
import { formatTokenPrice } from './format'

export const groupTokens = (
  tokens: TokenAmount[],
  chains: ExtendedChain[]
): (NetworkAmount | TokenAmount)[] => {
  const map = new Map<string, TokenAmount[]>()
  const symbolOrder: string[] = []

  for (const item of tokens) {
    if (!map.has(item.symbol)) {
      map.set(item.symbol, [])
      symbolOrder.push(item.symbol)
    }
    map.get(item.symbol)!.push(item)
  }

  const result: (NetworkAmount | TokenAmount)[] = []

  for (const symbol of symbolOrder) {
    const group = map.get(symbol)!
    if (group.length === 1) {
      result.push(group[0])
    } else if (group.length > 1) {
      const chainIds = new Set(group.map((token) => token.chainId))
      const wrapperObj: NetworkAmount = {
        symbol,
        logoURI: group[0].logoURI,
        chains: Array.from(chainIds)
          .map((chainId) => chains?.find((chain) => chain.id === chainId))
          .filter(Boolean) as ExtendedChain[],
        tokens: group,
        //featured: group.some((token) => token.featured), // TODO: what to do with it?
        //popular: group.some((token) => token.popular), // TODO: what to do with it?
        amount: group.reduce((acc, token) => {
          const tokenAmount =
            typeof token.amount === 'bigint'
              ? token.amount
              : BigInt(token.amount || 0)
          return acc + tokenAmount
        }, BigInt(0)),
        priceUSD: group
          .reduce(
            (acc, token) =>
              acc +
              Number(
                formatTokenPrice(token.amount, token.priceUSD, token.decimals)
              ),
            0
          )
          .toString(),
        decimals: group[0].decimals,
      }
      result.push(wrapperObj)
    }
  }

  return result
}
