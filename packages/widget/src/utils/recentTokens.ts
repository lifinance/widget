import type { BaseToken } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { RecentToken } from '../stores/recentTokens/types.js'
import type { TokenAmount } from '../types/token.js'
import type { WidgetTokens } from '../types/widget.js'
import { getConfigItemSets, isFormItemAllowed } from './item.js'
import { isHoistableNative } from './tokenList.js'

export const collapsedRecentCount = 4
const expandedRecentCount = 10

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
    recentStartIndex,
    recentCount: 0,
    totalRecentCount: 0,
    nativeHoisted,
  }

  if (disabled || !recentTokens.length) {
    return inactive
  }

  const candidates = recentTokens.filter(
    (recent) =>
      (isAllNetworks || recent.chainId === selectedChainId) &&
      (!availableChainIds.size || availableChainIds.has(recent.chainId))
  )

  if (!candidates.length) {
    return inactive
  }

  const wanted = new Set(
    candidates.map((recent) => tokenKey(recent.chainId, recent.address))
  )
  const fresh = new Map<string, TokenAmount>()
  for (const token of tokens) {
    const key = tokenKey(token.chainId, token.address)
    if (wanted.has(key)) {
      fresh.set(key, token)
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
                .filter((item) => item.chainId === chainId)
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
  for (const recent of candidates) {
    const key = tokenKey(recent.chainId, recent.address)
    if (key === hoistedKey) {
      continue
    }
    const resolved =
      fresh.get(key) ?? ({ ...recent, priceUSD: '' } as TokenAmount)
    if (resolved.pinned) {
      continue
    }
    if (
      !isFormItemAllowed(resolved, allowedFor(recent.chainId), formType, (t) =>
        t.address.toLowerCase()
      )
    ) {
      continue
    }
    rows.push({ ...resolved, recent: true })
  }

  if (!rows.length) {
    return inactive
  }

  const visible = rows.slice(
    0,
    expanded ? expandedRecentCount : collapsedRecentCount
  )

  return {
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
