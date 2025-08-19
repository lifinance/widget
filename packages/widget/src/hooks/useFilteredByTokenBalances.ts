import { ChainType } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { TokenAmount } from '../types/token.js'

const fetchExistingBalances = async (address: string) => {
  try {
    const res = await fetch(
      `https://develop.li.quest/v1/wallets/${address}/balances`
    )
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }
    const data = await res.json()
    return data?.balances
  } catch {
    return undefined
  }
}

export const useFilteredTokensByBalance = (
  accountsWithTokens?: Record<
    string,
    { chainType: ChainType; tokens: Record<number, TokenAmount[]> }
  >
) => {
  const evmAddress = useMemo(() => {
    const evmAccount = Object.entries(accountsWithTokens ?? {}).find(
      ([_, { chainType }]) => chainType === ChainType.EVM
    )
    return evmAccount?.[0]
  }, [accountsWithTokens])

  const { data: existingBalances, isLoading } = useQuery({
    queryKey: ['existing-evm-balances', evmAddress],
    queryFn: () => {
      if (evmAddress) {
        return fetchExistingBalances(evmAddress) ?? null
      }
      return null
    },
    enabled: !!evmAddress,
    refetchInterval: 30_000, // 30 seconds
  })

  const accountsWithFilteredTokens = useMemo(() => {
    if (!accountsWithTokens) {
      return undefined
    }

    // Early return if no existing balances - return all tokens
    const result: Record<string, Record<number, TokenAmount[]>> = {}
    if (!existingBalances) {
      for (const [address, { tokens }] of Object.entries(accountsWithTokens)) {
        result[address] = tokens
      }
      return result
    }

    for (const [address, { tokens }] of Object.entries(accountsWithTokens)) {
      result[address] = {}

      for (const [chainIdStr, chainTokens] of Object.entries(tokens)) {
        const balances = existingBalances?.[chainIdStr]

        const chainId = Number(chainIdStr)
        // If no balances, RPC all tokens of the chain
        if (!balances) {
          if (chainTokens.length) {
            result[address][chainId] = chainTokens
          }
          continue
        }

        // Optimize token matching with Set for O(1) lookup
        const balanceSet = new Set(
          balances.map((balance: TokenAmount) => balance.address.toLowerCase())
        )

        // Get tokens that are in chainTokens and have balances
        const filteredTokens = chainTokens.filter((token) => {
          const tokenKey = token.address.toLowerCase()
          return balanceSet.has(tokenKey)
        })

        // Get tokens that are in balances but not in chainTokens
        const chainTokenSet = new Set(
          chainTokens.map((token) => token.address.toLowerCase())
        )
        const additionalTokens = balances.filter((balance: TokenAmount) => {
          const balanceKey = balance.address.toLowerCase()
          return !chainTokenSet.has(balanceKey)
        })

        // Combine both sets of tokens
        const allTokens = [...filteredTokens, ...additionalTokens]

        if (allTokens.length) {
          result[address][chainId] = allTokens
        }
      }
    }

    return result
  }, [accountsWithTokens, existingBalances])

  return { data: accountsWithFilteredTokens, isLoading }
}
