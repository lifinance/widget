import type {
  BaseToken,
  ExtendedChain,
  RouteExtended,
  StaticToken,
  Token,
  TokenAmount,
} from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { TokensByChain, TokenWithFlags } from '../types/token.js'
import type { WidgetChains, WidgetTokens } from '../types/widget.js'
import { getConfigItemSets, isFormItemAllowed } from './item.js'

/**
 * Builds per-chain sets of lowercase token addresses from the
 * `tokens.verified` config allowlist.
 */
export const getVerifiedTokensSets = (
  configTokens?: WidgetTokens
): Map<number, Set<string>> | undefined => {
  if (!configTokens?.verified?.length) {
    return undefined
  }
  const sets = new Map<number, Set<string>>()
  for (const token of configTokens.verified) {
    const chainId = Number(token.chainId)
    let addresses = sets.get(chainId)
    if (!addresses) {
      addresses = new Set()
      sets.set(chainId, addresses)
    }
    addresses.add(token.address.toLowerCase())
  }
  return sets
}

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
  dataTokens: TokensByChain | undefined,
  configTokens?: WidgetTokens,
  chainsConfig?: WidgetChains,
  formType?: FormType,
  nativeTokenAddresses?: Map<number, string>
): TokensByChain | undefined => {
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

  const verifiedTokensSets = getVerifiedTokensSets(configTokens)

  const allowedTokensByChain: TokensByChain = {}
  for (const chainId of allowedChainIds) {
    const chainIncludedTokens = includedTokens.filter(
      (t) => Number(t.chainId) === chainId
    )
    const includedAddresses = new Set(
      chainIncludedTokens.map((t) => t.address.toLowerCase())
    )

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

    const verifiedAddresses = verifiedTokensSets?.get(chainId)
    const nativeAddress = nativeTokenAddresses?.get(chainId)?.toLowerCase()

    const chainTokens: TokenWithFlags[] = [
      ...(dataTokens[chainId] ?? []),
      ...chainIncludedTokens,
    ]

    const filtered: TokenWithFlags[] = []
    const seenAddresses = new Set<string>()
    for (const token of chainTokens) {
      const address = token.address.toLowerCase()
      // Data tokens come first and win over include duplicates,
      // keeping their extended data
      if (seenAddresses.has(address)) {
        continue
      }
      seenAddresses.add(address)
      if (
        !isFormItemAllowed(token, allowedAddresses, formType, (t) =>
          t.address.toLowerCase()
        )
      ) {
        continue
      }
      // Include and verified-allowlist tokens are explicitly set by the
      // integrator, mark them as verified. The chain's native token is
      // marked here too, so every consumer reads `token.native` instead of
      // resolving the chain again. A flag is only ever set to true: a token
      // that earns none keeps its cached object rather than being cloned.
      const markVerified =
        !token.verified &&
        (includedAddresses.has(address) || verifiedAddresses?.has(address))
      const markNative = !!nativeAddress && nativeAddress === address
      if (markVerified || markNative) {
        filtered.push({
          ...token,
          ...(markVerified ? { verified: true } : {}),
          ...(markNative ? { native: true } : {}),
        })
      } else {
        filtered.push(token)
      }
    }

    allowedTokensByChain[chainId] = filtered
  }

  return allowedTokensByChain
}

/**
 * True when `tokenAddress` is the chain's native/gas token address.
 * Hypernative flags this address as a scam on some chains even though
 * it's just the widget's native-token convention (e.g. the EVM zero
 * address), so this check suppresses that specific false positive.
 */
export const isNativeToken = (
  tokenAddress: string,
  chain: Pick<ExtendedChain, 'nativeToken'> | undefined
): boolean => chain?.nativeToken.address === tokenAddress

export const getExecutionToToken = (route: RouteExtended): TokenAmount => ({
  ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
  amount: BigInt(
    route.steps.at(-1)?.execution?.toAmount ??
      route.steps.at(-1)?.estimate.toAmount ??
      route.toAmount
  ),
})

/**
 * Returns the capitalized name of the first provider that verified the token.
 * Providers are stored lowercase (e.g. `hypernative`), so the name is
 * capitalized for display in the verified token tooltip.
 */
export const getTokenVerificationProvider = (
  token: Pick<StaticToken, 'verificationStatusBreakdown'>
): string | undefined => {
  const provider = token.verificationStatusBreakdown?.find(
    (entry) => entry.result === 'verified'
  )?.provider
  return provider
    ? `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`
    : undefined
}
