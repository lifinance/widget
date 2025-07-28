import {
  type BaseToken,
  type ChainId,
  ChainType,
  getTokens,
  type Token,
} from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { getConfigItemSets, isFormItemAllowed } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'

export const useTokens = (formType?: FormType) => {
  const { tokens: configTokens, keyPrefix } = useWidgetConfig()

  const { data, isLoading } = useQuery({
    queryKey: [getQueryKey('tokens', keyPrefix)],
    queryFn: () =>
      getTokens({
        chainTypes: [
          ChainType.EVM,
          ChainType.SVM,
          ChainType.UTXO,
          ChainType.MVM,
        ],
      }),
    refetchInterval: 3_600_000,
    staleTime: 3_600_000,
  })

  const allAllowedTokens = useMemo(() => {
    if (!data?.tokens) {
      return
    }

    const tokens = Object.values(data.tokens).flat()
    const includedTokens = configTokens?.include || []
    const allTokens = [...includedTokens, ...tokens]

    const chainIds = new Set(allTokens.map((t) => t.chainId))

    const allowedTokensByChain = new Map<ChainId, Token[]>()

    for (const chainId of chainIds) {
      const chainTokens = data.tokens[chainId]

      const allowedAddresses = getConfigItemSets(
        configTokens,
        (tokens: BaseToken[]) =>
          new Set(
            tokens.filter((t) => t.chainId === chainId).map((t) => t.address)
          ),
        formType
      )

      const filtered = chainTokens.filter((token) =>
        isFormItemAllowed(token, allowedAddresses, formType, (t) => t.address)
      )

      allowedTokensByChain.set(chainId, filtered)
    }

    return allowedTokensByChain
  }, [data?.tokens, configTokens, formType])

  return {
    tokens: allAllowedTokens,
    isLoading,
  }
}
