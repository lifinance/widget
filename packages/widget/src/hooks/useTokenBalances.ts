import { getTokenBalances } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'
import { useChains } from './useChains.js'
import { useTokens } from './useTokens.js'

const defaultRefetchInterval = 32_000

const fetchExistingBalances = async (address: string) => {
  try {
    const res = await fetch(
      `https://develop.li.quest/v1/wallets/${address}/balances`
    )
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }

    const data = await res.json()

    const balanceMap = new Map<number, TokenAmount[]>()

    for (const balance of data?.balances || []) {
      const tokensWithAmount = balance.tokens.filter((t: any) => t.amount > 0)
      const chainId = Number(balance.chainId)
      if (balanceMap.has(chainId)) {
        balanceMap.get(chainId)!.push(...tokensWithAmount)
      } else {
        balanceMap.set(chainId, tokensWithAmount)
      }
    }

    return balanceMap
  } catch {
    return new Map<number, TokenAmount[]>()
  }
}

export const useTokenBalances = (
  selectedChainId?: number,
  formType?: FormType
) => {
  const { tokens: allTokens, isLoading } = useTokens(formType)

  const {
    chains,
    isLoading: isSupportedChainsLoading,
    getChainById,
  } = useChains()
  const chain = getChainById(selectedChainId, chains)

  const { account } = useAccount({ chainType: chain?.chainType })

  const [existingBalances, setExistingBalances] = useState(
    new Map<number, TokenAmount[]>()
  )

  // Fetch cached balances from backend
  useEffect(() => {
    if (!account.address) {
      return
    }

    fetchExistingBalances(account.address).then(setExistingBalances)
  }, [account.address])

  // Filter allTokens by what's available in existingBalances
  const filteredByBalance = useMemo(() => {
    if (!allTokens || !existingBalances) {
      return new Map<number, TokenAmount[]>()
    }

    const result = new Map<number, TokenAmount[]>()

    for (const [chainId, tokens] of allTokens.entries()) {
      const balances = existingBalances.get(Number(chainId))
      if (!balances) {
        result.set(Number(chainId), tokens)
        continue
      }

      const tokensWithMatch = balances
        .map((balance: any) => {
          return tokens.find((token) =>
            balance.tokenAddress === 'native'
              ? token.symbol === balance.symbol
              : token.address.toLowerCase() ===
                balance.tokenAddress.toLowerCase()
          )
        })
        .filter(Boolean) as TokenAmount[]

      result.set(chainId, tokensWithMatch)
    }

    return result
  }, [allTokens, existingBalances])

  const isBalanceLoadingEnabled =
    Boolean(account.address) &&
    Boolean(filteredByBalance) &&
    !isSupportedChainsLoading

  const { keyPrefix } = useWidgetConfig()

  const {
    data: allTokensWithBalances,
    isLoading: isBalanceLoading,
    refetch,
  } = useQuery({
    queryKey: [getQueryKey('token-balances', keyPrefix), account.address],
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      const tokens = Array.from(filteredByBalance?.values() ?? []).flat()

      const tokensWithBalance: TokenAmount[] = await getTokenBalances(
        accountAddress as string,
        tokens!
      )

      if (!tokensWithBalance?.length) {
        return tokens as TokenAmount[]
      }

      return tokensWithBalance
    },
    enabled: isBalanceLoadingEnabled,
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  })

  const chainTokens = useMemo(() => {
    if (!selectedChainId) {
      return undefined
    }

    const tokensWithBalances = [
      ...(allTokensWithBalances?.filter(
        (token) => token.chainId === selectedChainId
      ) ?? []),
      ...(allTokens
        ?.get(selectedChainId)
        ?.filter(
          (token) =>
            !allTokensWithBalances?.some((t) => t.address === token.address)
        ) ?? []),
    ]

    return tokensWithBalances ?? allTokens?.get(selectedChainId)
  }, [allTokensWithBalances, allTokens, selectedChainId])

  return {
    tokens: chainTokens,
    chain,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    refetch,
  }
}
