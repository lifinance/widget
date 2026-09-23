import type { TokenAmount } from '../types/token.js'

const bandHeaderAtListStart = 24
const bandHeaderAfterBand = 32
const toggleRowHeight = 32

type BandLabelKey =
  | 'main.pinnedTokens'
  | 'main.featuredTokens'
  | 'main.myTokens'
  | 'main.popularTokens'
  | 'main.allTokens'

export type BandLabel =
  | { kind: 'text'; key: BandLabelKey; atListStart: boolean }
  | { kind: 'recent'; atListStart: boolean }

export interface BandResolverOptions {
  showCategories: boolean
  showPinnedTokens: boolean
  nativeHoisted: boolean
  /** Index of the first recent row. Ignored while `recentCount` is 0. */
  recentStartIndex: number
  recentCount: number
  showRecentToggle: boolean
}

export interface BandResolver {
  /** Called for every index by the virtualizer, so it allocates nothing. */
  getRowExtraHeight: (index: number) => number
  /** Called for visible rows only, so the label may be resolved lazily. */
  getRowBandLabel: (index: number) => BandLabel | undefined
  /** The row the toggle hangs below. Shares one definition with the height. */
  isToggleRow: (index: number) => boolean
}

// Pinned and recent rows sit above the categories; transitions ignore both.
const isPromoted = (token: TokenAmount | undefined): boolean =>
  !!token?.pinned || !!token?.recent

export const createBandResolver = (
  tokens: TokenAmount[],
  {
    showCategories,
    showPinnedTokens,
    nativeHoisted,
    recentStartIndex,
    recentCount,
    showRecentToggle,
  }: BandResolverOptions
): BandResolver => {
  const listStartIndex = nativeHoisted ? 1 : 0
  const recentEndIndex = recentStartIndex + recentCount - 1

  const isFirstPinned = (index: number) =>
    !!tokens[index]?.pinned && index === listStartIndex
  const isFirstRecent = (index: number) =>
    recentCount > 0 && index === recentStartIndex && !!tokens[index]?.recent
  const isLastRecent = (index: number) =>
    recentCount > 0 && index === recentEndIndex && !!tokens[index]?.recent
  const isTransitionFromPromoted = (index: number) =>
    isPromoted(tokens[index - 1]) && !isPromoted(tokens[index])

  const getRowExtraHeight = (index: number): number => {
    const current = tokens[index]
    const previous = tokens[index - 1]
    let extra = 0

    if (showPinnedTokens && isFirstPinned(index)) {
      extra += bandHeaderAtListStart
    }

    if (isFirstRecent(index)) {
      extra +=
        index === listStartIndex ? bandHeaderAtListStart : bandHeaderAfterBand
    }

    if (showRecentToggle && isLastRecent(index)) {
      extra += toggleRowHeight
    }

    // The recent band needs its own term: all-networks has no categories.
    if (
      (showPinnedTokens || showCategories || recentCount > 0) &&
      isTransitionFromPromoted(index)
    ) {
      extra += bandHeaderAfterBand
    }

    if (!showCategories) {
      return extra
    }

    if (current?.featured && !isPromoted(current) && index === listStartIndex) {
      extra += bandHeaderAtListStart
    }

    const isNotPromoted = !isPromoted(current) && !isPromoted(previous)
    if (
      index !== listStartIndex &&
      isNotPromoted &&
      ((previous?.amount && !current?.amount) ||
        (previous?.featured && !current?.featured) ||
        (previous?.popular && !current?.popular))
    ) {
      extra += bandHeaderAfterBand
    }

    return extra
  }

  const getRowBandLabel = (index: number): BandLabel | undefined => {
    const current = tokens[index]
    const previous = tokens[index - 1]
    const isListStart = index === listStartIndex
    const notPromoted = !isPromoted(current)
    const fromPromoted = isPromoted(previous) && notPromoted

    if (showPinnedTokens && isFirstPinned(index)) {
      return { kind: 'text', key: 'main.pinnedTokens', atListStart: true }
    }
    if (isFirstRecent(index)) {
      return { kind: 'recent', atListStart: isListStart }
    }
    if (
      (showPinnedTokens || recentCount > 0) &&
      !showCategories &&
      fromPromoted
    ) {
      return { kind: 'text', key: 'main.allTokens', atListStart: false }
    }
    if (!showCategories) {
      return undefined
    }

    const fromFeatured =
      !!previous?.featured && !current?.featured && notPromoted
    const fromMyTokens = !!previous?.amount && !current?.amount && notPromoted
    const fromPopular = !!previous?.popular && !current?.popular && notPromoted

    if (
      (fromPromoted && current?.featured) ||
      (current?.featured && notPromoted && isListStart)
    ) {
      return {
        kind: 'text',
        key: 'main.featuredTokens',
        atListStart: isListStart,
      }
    }
    if ((fromFeatured || fromPromoted) && current?.amount && notPromoted) {
      return { kind: 'text', key: 'main.myTokens', atListStart: false }
    }
    if (
      (fromFeatured || fromMyTokens || fromPromoted) &&
      current?.popular &&
      notPromoted
    ) {
      return { kind: 'text', key: 'main.popularTokens', atListStart: false }
    }
    if (fromMyTokens || fromFeatured || fromPromoted || fromPopular) {
      return { kind: 'text', key: 'main.allTokens', atListStart: false }
    }
    return undefined
  }

  const isToggleRow = (index: number): boolean =>
    showRecentToggle && isLastRecent(index)

  return { getRowExtraHeight, getRowBandLabel, isToggleRow }
}
