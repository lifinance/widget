import { type BaseToken, ChainType, getTokens, type Token } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import {
  getConfigItemSets,
  isFormItemAllowed,
  isItemAllowed,
  isItemAllowedForSets,
} from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'

export const useTokens = (formType?: FormType) => {
  const {
    tokens: configTokens,
    chains: chainsConfig,
    keyPrefix,
  } = useWidgetConfig()

  const chainTypes = useMemo(() => {
    return [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM].filter(
      (chainType) => isItemAllowed(chainType, chainsConfig?.types)
    )
  }, [chainsConfig?.types])

  const { data, isLoading } = useQuery({
    queryKey: [getQueryKey('tokens', keyPrefix)],
    queryFn: () =>
      getTokens({
        chainTypes,
      }),
    refetchInterval: 3_600_000,
    staleTime: 3_600_000,
  })

  const allAllowedTokens = useMemo(() => {
    if (!data?.tokens) {
      return
    }

    const includedTokens = configTokens?.include || []
    const allChainIds = Array.from(
      new Set([
        ...includedTokens.map((t) => t.chainId),
        ...Object.keys(data.tokens),
      ])
    ).map((chainId) => Number(chainId))

    const configChainIdsSet = getConfigItemSets(
      chainsConfig,
      (chainIds) => new Set(chainIds),
      formType
    )
    const allowedChainIds = configChainIdsSet
      ? allChainIds.filter((chainId) =>
          isItemAllowedForSets(chainId, configChainIdsSet)
        )
      : allChainIds

    const allowedTokensByChain: { [chainId: number]: Token[] } = {}
    for (const chainId of allowedChainIds) {
      const chainTokens = [
        ...data.tokens[chainId],
        ...includedTokens.filter((t) => Number(t.chainId) === chainId),
      ]

      const allowedAddresses = getConfigItemSets(
        configTokens,
        (tokens: BaseToken[]) =>
          new Set(
            tokens
              .filter((t) => Number(t.chainId) === chainId)
              .map((t) => t.address)
          ),
        formType
      )

      const filtered = chainTokens.filter((token) =>
        isFormItemAllowed(token, allowedAddresses, formType, (t) => t.address)
      )

      allowedTokensByChain[chainId] = filtered
    }

    return allowedTokensByChain
  }, [data?.tokens, configTokens, chainsConfig, formType])

  return {
    tokens: allAllowedTokens,
    isLoading,
  }
}
