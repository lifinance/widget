import { getTokenBalances, type Token, type TokenAmount } from '@lifi/sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { getQueryKey } from '../utils/queries.js'

const defaultRefetchInterval = 30_000

export const useTokenBalance = (accountAddress?: string, token?: Token) => {
  const queryClient = useQueryClient()
  const { keyPrefix } = useWidgetConfig()

  const tokenBalanceQueryKey = useMemo(
    () =>
      [
        getQueryKey('token-balance', keyPrefix),
        accountAddress,
        token?.chainId,
        token?.address,
      ] as const,
    [token?.address, token?.chainId, accountAddress, keyPrefix]
  )

  const { data, isLoading, refetch } = useQuery({
    queryKey: tokenBalanceQueryKey,
    queryFn: async ({
      queryKey: [, accountAddress, tokenChainId, tokenAddress],
    }) => {
      const tokenBalances = await getTokenBalancesWithRetry(
        accountAddress as string,
        [token!]
      )

      if (!tokenBalances?.length) {
        throw new Error('Could not get tokens balance.')
      }

      const cachedTokenAmount =
        queryClient.getQueryData<TokenAmount>(tokenBalanceQueryKey)

      const tokenAmount = tokenBalances[0].amount

      if (cachedTokenAmount?.amount !== tokenAmount) {
        queryClient.setQueryDefaults(tokenBalanceQueryKey, {
          refetchInterval: defaultRefetchInterval,
          staleTime: defaultRefetchInterval,
        })
      }

      queryClient.setQueriesData<TokenAmount[]>(
        {
          queryKey: [
            getQueryKey('token-balances', keyPrefix),
            accountAddress,
            tokenChainId,
          ],
        },
        (data) => {
          if (data) {
            const clonedData = [...data]
            const index = clonedData.findIndex(
              (dataToken) => dataToken.address === tokenAddress
            )
            clonedData[index] = {
              ...clonedData[index],
              amount: tokenAmount,
            }
            return clonedData
          }
        }
      )

      return {
        ...tokenBalances[0],
        amount: tokenAmount,
      } as TokenAmount
    },

    enabled: Boolean(accountAddress && token),
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  })

  const refetchNewBalance = useCallback(() => {
    queryClient.setQueryDefaults(tokenBalanceQueryKey, {
      refetchInterval: 250,
      staleTime: 250,
    })
  }, [queryClient, tokenBalanceQueryKey])

  return {
    token: data,
    isLoading,
    refetch,
    refetchNewBalance,
    getTokenBalancesWithRetry,
  }
}

export const getTokenBalancesWithRetry = async (
  accountAddress: string,
  tokens: Token[],
  depth = 0
): Promise<TokenAmount[] | undefined> => {
  try {
    const tokenBalances = await getTokenBalances(
      accountAddress as string,
      tokens
    )
    if (!tokenBalances.every((token) => token.blockNumber)) {
      if (depth > 10) {
        console.warn('Token balance backoff depth exceeded.')
        return undefined
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 1.5 ** depth * 100)
      })
      return getTokenBalancesWithRetry(accountAddress, tokens, depth + 1)
    }
    return tokenBalances
  } catch (_error) {
    //
  }
}
