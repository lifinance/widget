import { ChainType } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { TokenAmount } from '../types/token'

const fetchExistingBalances = async (address: string) => {
  try {
    const res = await fetch(
      `https://develop.li.quest/v1/wallets/${address}/balances`
    )
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }

    const data = await res.json()

    const balanceMap: Record<number, TokenAmount[]> = {}

    for (const balance of data?.balances || []) {
      const tokensWithAmount = balance.tokens.filter((t: any) => t.amount > 0)
      const chainId = Number(balance.chainId)
      if (balanceMap[chainId]) {
        balanceMap[chainId].push(...tokensWithAmount)
      } else {
        balanceMap[chainId] = tokensWithAmount
      }
    }

    return balanceMap
  } catch {
    return {}
  }
}

const matchToken = (balance: any, token: TokenAmount) => {
  return balance.tokenAddress === 'native'
    ? token.symbol === balance.symbol
    : token.address.toLowerCase() === balance.tokenAddress.toLowerCase()
}

export const useFilteredTokensByBalance = (
  accountAddress?: string,
  chainType?: ChainType,
  allTokens?: Record<number, TokenAmount[]>
) => {
  const { data: existingBalances } = useQuery({
    queryKey: ['existing-balances', accountAddress, chainType],
    queryFn: () => {
      if (chainType === ChainType.EVM && accountAddress) {
        return fetchExistingBalances(accountAddress)
      }
      return undefined
    },
    enabled: Boolean(accountAddress && chainType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const filteredByBalance = useMemo(() => {
    if (!allTokens) {
      return undefined
    }

    if (!existingBalances) {
      return allTokens
    }

    const result: Record<number, TokenAmount[]> = {}

    for (const [chainIdStr, tokens] of Object.entries(allTokens)) {
      const chainId = Number(chainIdStr)
      const balances = existingBalances[chainId]
      // If no balances, RPC all tokens of the chain
      if (!balances) {
        if (tokens.length) {
          result[chainId] = tokens
        }
        continue
      }
      // If there are balances, RPC only tokens that have balances
      const filteredTokens = tokens.filter((token) =>
        balances.some((balance) => matchToken(balance, token))
      )
      if (filteredTokens.length) {
        result[chainId] = filteredTokens
      }
    }
    return result
  }, [allTokens, existingBalances])

  return filteredByBalance
}
