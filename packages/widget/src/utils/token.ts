import type { BaseToken, Token, TokenExtended } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { TokensByChain } from '../types/token.js'
import type { WidgetChains, WidgetTokens } from '../types/widget.js'
import { getConfigItemSets, isFormItemAllowed } from './item.js'

/**
 * Merges verified tokens with search tokens.
 * Verified tokens take priority - search tokens are only added if they don't already exist.
 */
export const mergeVerifiedWithSearchTokens = (
  verifiedTokens?: TokensByChain,
  searchTokens?: TokensByChain
): TokensByChain | undefined => {
  if (!verifiedTokens) {
    return searchTokens
  }
  if (!searchTokens) {
    return verifiedTokens
  }

  const result = { ...verifiedTokens }

  for (const [chainId, tokens] of Object.entries(searchTokens)) {
    const chainIdNum = Number(chainId)
    const existingTokens = result[chainIdNum] || []
    const existingAddresses = new Set(
      existingTokens.map((t) => t.address.toLowerCase())
    )

    const newTokens = tokens.filter(
      (t) => !existingAddresses.has(t.address.toLowerCase())
    )

    if (newTokens.length) {
      result[chainIdNum] = [...existingTokens, ...newTokens]
    }
  }

  return result
}

/**
 * Updates a token in the cache by chainId and address.
 * Returns a new cache object with the token updated, or the original if not found.
 */
export const updateTokenInCache = (
  data: TokensByChain | undefined,
  token: Token
): TokensByChain | undefined => {
  if (!data) {
    return data
  }
  const chainTokens = data[token.chainId]
  if (!chainTokens) {
    return data
  }
  const index = chainTokens.findIndex((t) => t.address === token.address)
  if (index < 0) {
    return data
  }
  return {
    ...data,
    [token.chainId]: chainTokens.map((t, i) =>
      i === index ? { ...t, ...token } : t
    ),
  }
}

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
        isFormItemAllowed(chainId, configChainIdsSet, formType)
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
