import { type ChainId, type TokensResponse, getToken } from '@lifi/sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { getQueryKey } from '../utils/queries.js'

export const useTokenSearch = (
  chainId?: number,
  tokenQuery?: string,
  enabled?: boolean,
  formType?: FormType
) => {
  const queryClient = useQueryClient()
  const { tokens: configTokens, keyPrefix } = useWidgetConfig()

  const { data, isLoading } = useQuery({
    queryKey: [getQueryKey('token-search', keyPrefix), chainId, tokenQuery],
    queryFn: async ({ queryKey: [, chainId, tokenQuery], signal }) => {
      const token = await getToken(chainId as ChainId, tokenQuery as string, {
        signal,
      })

      if (token) {
        // Check if the token is in the denied list for the current form type
        const formTypeConfig = formType ? configTokens?.[formType] : undefined
        const globalConfig = configTokens

        const deniedTokenAddressesSet = new Set(
          [...(formTypeConfig?.deny || []), ...(globalConfig?.deny || [])]
            .filter((t) => t.chainId === chainId)
            .map((t) => t.address)
        )

        // If the token is in the denied list, return null
        if (deniedTokenAddressesSet.has(token.address)) {
          return undefined
        }

        queryClient.setQueriesData<TokensResponse>(
          { queryKey: [getQueryKey('tokens', keyPrefix)] },
          (data) => {
            if (
              data &&
              !data.tokens[chainId as number]?.some(
                (t) => t.address === token.address
              )
            ) {
              const clonedData = { ...data }
              clonedData.tokens[chainId as number]?.push(token as TokenAmount)
              return clonedData
            }
          }
        )
      }
      return token as TokenAmount
    },

    enabled: Boolean(chainId && tokenQuery && enabled),
    retry: false,
  })
  return {
    token: data,
    isLoading,
  }
}
