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
  /** Everything Clear removes, including toggled-away and displaced rows. */
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
  // The hoist is skipped in all-networks and search; tokens[0] alone can't tell.
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
  // All-networks holds tens of thousands of rows: test the chain before the key.
  const wantedChains = new Set(candidates.map((recent) => recent.chainId))
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
                // Plain-JS integrators may pass chainId as a string.
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
      fresh.get(key) ?? ({ ...recent, priceUSD: '' } as TokenAmount)
    if (
      !isFormItemAllowed(resolved, allowedFor(recent.chainId), formType, (t) =>
        t.address.toLowerCase()
      )
    ) {
      // Denied on this side only, so Clear must leave it for the other side.
      continue
    }
    // Clear owns displaced entries too, or they reappear once unpinned.
    bandEntries.push({ chainId: recent.chainId, address: recent.address })
    if (key === hoistedKey || resolved.pinned) {
      continue
    }
    rows.push({ ...resolved, recent: true })
  }

  if (!rows.length) {
    return inactive
  }

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
