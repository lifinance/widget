import type { BaseToken, TokenExtended } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { WidgetChains, WidgetTokens } from '../types/widget.js'
import {
  getConfigItemSets,
  isFormItemAllowed,
  isItemAllowedForSets,
} from './item.js'

export const filterAllowedTokens = (
  dataTokens: { [chainId: number]: TokenExtended[] } | undefined,
  configTokens?: WidgetTokens,
  chainsConfig?: WidgetChains,
  formType?: FormType
): { [chainId: number]: TokenExtended[] } | undefined => {
  if (!dataTokens) {
    return
  }

  const includedTokens = configTokens?.include || []
  const allChainIds = Array.from(
    new Set([
      ...includedTokens.map((t) => t.chainId),
      ...Object.keys(dataTokens),
    ])
  ).map((chainId) => Number(chainId))

  const configChainIdsSet = getConfigItemSets(
    chainsConfig,
    (chainIds: number[]) => new Set(chainIds),
    formType
  )
  const allowedChainIds = configChainIdsSet
    ? allChainIds.filter((chainId) =>
        isItemAllowedForSets(chainId, configChainIdsSet)
      )
    : allChainIds

  const allowedTokensByChain: { [chainId: number]: TokenExtended[] } = {}
  for (const chainId of allowedChainIds) {
    const chainTokens = [
      ...dataTokens[chainId],
      ...includedTokens.filter((t) => Number(t.chainId) === chainId),
    ]

    const allowedAddresses = getConfigItemSets(
      configTokens,
      (tokens: BaseToken[]) =>
        new Set(
          tokens
            .filter((t) => Number(t.chainId) === chainId)
            .map((t) => t.address.toLowerCase())
        ),
      formType
    )

    const filtered = chainTokens.filter((token) =>
      isFormItemAllowed(token, allowedAddresses, formType, (t) =>
        t.address.toLowerCase()
      )
    )

    allowedTokensByChain[chainId] = filtered
  }

  return allowedTokensByChain
}
