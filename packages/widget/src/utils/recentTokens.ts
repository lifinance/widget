import type { BaseToken } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type {
  RecentToken,
  RecentTokenId,
} from '../stores/recentTokens/types.js'
import type { TokenAmount } from '../types/token.js'
import type { WidgetTokens } from '../types/widget.js'
import { getConfigItemSets, isFormItemAllowed } from './item.js'
import { isHoistableNative } from './tokenList.js'

export const collapsedRecentCount = 4

export interface ResolveRecentTokensParams {
  recentTokens: RecentToken[]
  availableChainIds: Set<number>
  configTokens: WidgetTokens | undefined
  formType: FormType
  selectedChainId?: number
  isAllNetworks?: boolean
  search?: string
  expanded: boolean
  disabled: boolean
}

export interface RecentTokensResult {
  tokens: TokenAmount[]
  /** Every entry this band owns, including rows hidden behind the toggle. */
  bandEntries: RecentTokenId[]
  recentStartIndex: number
  recentCount: number
  totalRecentCount: number
  nativeHoisted: boolean
}

const tokenKey = (chainId: number, address: string) =>
  `${chainId}-${address.toLowerCase()}`

export const resolveRecentTokens = (
  tokens: TokenAmount[],
  {
    recentTokens,
    availableChainIds,
    configTokens,
    formType,
    selectedChainId,
    isAllNetworks,
    search,
    expanded,
    disabled,
  }: ResolveRecentTokensParams
): RecentTokensResult => {
  // hoistNativeToken only runs for a single chain with no search, so tokens[0]
  // alone cannot say whether the hoist happened.
  const nativeHoisted =
    !isAllNetworks && !search && isHoistableNative(tokens[0], selectedChainId)

  let recentStartIndex = nativeHoisted ? 1 : 0
  while (tokens[recentStartIndex]?.pinned) {
    recentStartIndex++
  }

  const inactive: RecentTokensResult = {
    tokens,
    bandEntries: [],
    recentStartIndex,
    recentCount: 0,
    totalRecentCount: 0,
    nativeHoisted,
  }

  if (disabled || !recentTokens.length || !tokens.length) {
    return inactive
  }

  const candidates = recentTokens.filter(
    (recent) =>
      (isAllNetworks || recent.chainId === selectedChainId) &&
      availableChainIds.has(recent.chainId)
  )

  if (!candidates.length) {
    return inactive
  }

  const wanted = new Set(
    candidates.map((recent) => tokenKey(recent.chainId, recent.address))
  )
  // An integer test first: in all-networks most rows are on a chain no
  // recent uses, and those never need a key string built for them.
  const wantedChains = new Set(candidates.map((recent) => recent.chainId))
  // At most ten matches in a list that all-networks fills with tens of
  // thousands of rows. The break helps only when every recent is listed; a
  // searched-only recent never matches, so that scan still runs to the end.
  const fresh = new Map<string, TokenAmount>()
  for (const token of tokens) {
    if (!wantedChains.has(token.chainId)) {
      continue
    }
    const key = tokenKey(token.chainId, token.address)
    if (wanted.has(key) && !fresh.has(key)) {
      fresh.set(key, token)
      if (fresh.size === wanted.size) {
        break
      }
    }
  }

  const allowedByChain = new Map<number, ReturnType<typeof getConfigItemSets>>()
  const allowedFor = (chainId: number) => {
    if (!allowedByChain.has(chainId)) {
      allowedByChain.set(
        chainId,
        getConfigItemSets(
          configTokens,
          (items: BaseToken[]) =>
            new Set(
              items
                // Coerced like utils/token.ts: an integrator calling from
                // plain JS can pass chainId as a string.
                .filter((item) => Number(item.chainId) === chainId)
                .map((item) => item.address.toLowerCase())
            ),
          formType
        )
      )
    }
    return allowedByChain.get(chainId)
  }

  const hoistedKey = nativeHoisted
    ? tokenKey(tokens[0].chainId, tokens[0].address)
    : undefined

  const rows: TokenAmount[] = []
  const bandEntries: RecentTokenId[] = []
  for (const recent of candidates) {
    const key = tokenKey(recent.chainId, recent.address)
    const resolved =
      fresh.get(key) ??
      ({ ...recent, priceUSD: '', unresolved: true } as TokenAmount)
    if (
      !isFormItemAllowed(resolved, allowedFor(recent.chainId), formType, (t) =>
        t.address.toLowerCase()
      )
    ) {
      // Out of this band's scope: the opposite side may still legitimately
      // show it, so Clear here must leave it alone.
      continue
    }
    // In scope, so Clear owns it even when a promotion displaces its row.
    // Otherwise a pinned or hoisted entry survives Clear invisibly and
    // reappears the moment the promotion goes away.
    bandEntries.push({ chainId: recent.chainId, address: recent.address })
    if (key === hoistedKey || resolved.pinned) {
      continue
    }
    rows.push({ ...resolved, recent: true })
  }

  if (!rows.length) {
    return inactive
  }

  // Expanded shows everything kept; the store owns the storage cap.
  const visible = expanded ? rows : rows.slice(0, collapsedRecentCount)

  return {
    bandEntries,
    tokens: [
      ...tokens.slice(0, recentStartIndex),
      ...visible,
      ...tokens.slice(recentStartIndex),
    ],
    recentStartIndex,
    recentCount: visible.length,
    totalRecentCount: rows.length,
    nativeHoisted,
  }
}
