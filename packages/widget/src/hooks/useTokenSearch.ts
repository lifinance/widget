import { type ChainId, type TokensResponse, getToken } from '@lifi/sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { TokenAmount } from '../types/token.js'
import { isItemAllowed } from '../utils/item.js'
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
        // Filter config tokens by chain before checking if token is allowed
        const filteredConfigTokens = {
          ...configTokens,
          allow: configTokens?.allow?.filter(
            (t) => t.chainId === token.chainId
          ),
          deny: configTokens?.deny?.filter((t) => t.chainId === token.chainId),
          ...(formType && {
            [formType]: {
              ...configTokens?.[formType],
              allow: configTokens?.[formType]?.allow?.filter(
                (t) => t.chainId === token.chainId
              ),
              deny: configTokens?.[formType]?.deny?.filter(
                (t) => t.chainId === token.chainId
              ),
            },
          }),
        }

        // Return undefined if the token is denied
        const isTokenAllowed =
          isItemAllowed(token, filteredConfigTokens) &&
          (formType
            ? isItemAllowed(token, filteredConfigTokens?.[formType])
            : true)
        if (!isTokenAllowed) {
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
