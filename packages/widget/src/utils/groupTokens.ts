import type { ExtendedChain } from '@lifi/sdk'
import type { NetworkAmount, TokenAmount } from '../types/token'

export const groupTokens = (
  tokens: TokenAmount[],
  chains: ExtendedChain[]
): NetworkAmount[] => {
  const map = new Map<string, TokenAmount[]>()
  const symbolOrder: string[] = []

  for (const item of tokens) {
    if (!map.has(item.symbol)) {
      map.set(item.symbol, [])
      symbolOrder.push(item.symbol)
    }
    map.get(item.symbol)!.push(item)
  }

  const result: NetworkAmount[] = []

  for (const symbol of symbolOrder) {
    const group = map.get(symbol)!
    const chainIds = new Set(group.map((token) => token.chainId))
    const wrapperObj: NetworkAmount = {
      symbol,
      address: group[0].address,
      coinKey: group[0].coinKey,
      chains: Array.from(chainIds)
        .map((chainId) => chains?.find((chain) => chain.id === chainId))
        .filter(Boolean) as ExtendedChain[],
      tokens: group,
      logoURI: group[0].logoURI,
      decimals: group[0].decimals,
      priceUSD: group[0].priceUSD,
      name: group[0].name,
    }
    result.push(wrapperObj)
  }

  return result
}
