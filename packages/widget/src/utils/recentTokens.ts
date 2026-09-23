import type { FormType } from '../stores/form/types.js'
import type {
  RecentToken,
  RecentTokenId,
} from '../stores/recentTokens/types.js'
import { getTokenKey } from '../stores/recentTokens/utils.js'
import type { TokenAmount } from '../types/token.js'
import type { AllowDenySets, WidgetTokens } from '../types/widget.js'
import { isFormItemAllowed } from './item.js'
import { getChainTokenAllowSets } from './token.js'

export const collapsedRecentCount = 4

export interface ResolveRecentRowsParams {
  recentTokens: RecentToken[]
  availableChainIds: Set<number>
  configTokens: WidgetTokens | undefined
  formType: FormType
  selectedChainId?: number
  isAllNetworks?: boolean
  nativeHoisted: boolean
  disabled: boolean
}

export interface RecentRows {
  /** Every row the band shows when expanded; empty when the band is inactive. */
  rows: TokenAmount[]
  /** Everything Clear removes, including toggled-away and displaced rows. */
  bandEntries: RecentTokenId[]
  recentStartIndex: number
}

export interface RecentTokensResult {
  tokens: TokenAmount[]
  recentCount: number
  totalRecentCount: number
}

// A stale flag can only over-warn, so it is the one verdict worth keeping.
const toSnapshotRow = ({ flagged, ...recent }: RecentToken): TokenAmount =>
  ({
    ...recent,
    priceUSD: '',
    verificationStatus: flagged ? 'flagged' : undefined,
  }) as TokenAmount

export const resolveRecentRows = (
  tokens: TokenAmount[],
  {
    recentTokens,
    availableChainIds,
    configTokens,
    formType,
    selectedChainId,
    isAllNetworks,
    nativeHoisted,
    disabled,
  }: ResolveRecentRowsParams
): RecentRows => {
  let recentStartIndex = nativeHoisted ? 1 : 0
  while (tokens[recentStartIndex]?.pinned) {
    recentStartIndex++
  }

  const inactive: RecentRows = { rows: [], bandEntries: [], recentStartIndex }

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
    candidates.map((recent) => getTokenKey(recent.chainId, recent.address))
  )
  // All-networks holds tens of thousands of rows: test the chain before the key.
  const wantedChains = new Set(candidates.map((recent) => recent.chainId))
  const fresh = new Map<string, TokenAmount>()
  for (const token of tokens) {
    if (!wantedChains.has(token.chainId)) {
      continue
    }
    const key = getTokenKey(token.chainId, token.address)
    if (wanted.has(key) && !fresh.has(key)) {
      fresh.set(key, token)
      if (fresh.size === wanted.size) {
        break
      }
    }
  }

  const allowedByChain = new Map<number, AllowDenySets | undefined>()
  const allowedFor = (chainId: number) => {
    if (!allowedByChain.has(chainId)) {
      allowedByChain.set(
        chainId,
        getChainTokenAllowSets(configTokens, chainId, formType)
      )
    }
    return allowedByChain.get(chainId)
  }

  const hoistedKey = nativeHoisted
    ? getTokenKey(tokens[0].chainId, tokens[0].address)
    : undefined

  const rows: TokenAmount[] = []
  const bandEntries: RecentTokenId[] = []
  for (const recent of candidates) {
    const key = getTokenKey(recent.chainId, recent.address)
    const resolved = fresh.get(key) ?? toSnapshotRow(recent)
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

  return { rows, bandEntries, recentStartIndex }
}

export const spliceRecentRows = (
  tokens: TokenAmount[],
  { rows, recentStartIndex }: RecentRows,
  expanded: boolean
): RecentTokensResult => {
  if (!rows.length) {
    return { tokens, recentCount: 0, totalRecentCount: 0 }
  }

  const visible = expanded ? rows : rows.slice(0, collapsedRecentCount)

  return {
    tokens: [
      ...tokens.slice(0, recentStartIndex),
      ...visible,
      ...tokens.slice(recentStartIndex),
    ],
    recentCount: visible.length,
    totalRecentCount: rows.length,
  }
}
