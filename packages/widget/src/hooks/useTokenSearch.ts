import {
  type BaseToken,
  type ChainId,
  getToken,
  type TokenExtended,
  type TokensResponse,
} from '@lifi/sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { getConfigItemSets, isFormItemAllowed } from '../utils/item.js'
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
        const filteredConfigTokens = getConfigItemSets(
          configTokens,
          (tokens: BaseToken[]) =>
            new Set(
              tokens
                .filter((t) => t.chainId === token.chainId)
                .map((t) => t.address)
            ),
          formType
        )

        // Return undefined if the token is denied
        if (
          !isFormItemAllowed(
            token,
            filteredConfigTokens,
            formType,
            (t) => t.address
          )
        ) {
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
              clonedData.tokens[chainId as number]?.push(token as TokenExtended)
              return clonedData
            }
          }
        )
      }
      return token as TokenExtended
    },

    enabled: Boolean(chainId && tokenQuery && enabled),
    retry: false,
  })
  return {
    token: data,
    isLoading,
  }
}
