import type { ExtendedChain } from '@lifi/sdk'
import type { FormType } from '../stores/form/types.js'
import type { ChainLabel, PinnedChain } from '../types/widget.js'

export const maxGridLabelLength = 4

export const isVisibleChainLabel = (
  label: ChainLabel | undefined
): label is ChainLabel => Boolean(label?.text.trim())

export const isShortChainLabel = (label: ChainLabel | undefined): boolean => {
  if (!isVisibleChainLabel(label)) {
    return false
  }
  // Array.from counts code points, not UTF-16 units.
  return Array.from(label.text.trim()).length <= maxGridLabelLength
}

export const getConfigPinnedChains = (
  pinned: PinnedChain[] | undefined,
  chains: ExtendedChain[],
  side: FormType
): Map<number, PinnedChain> => {
  const configPins = new Map<number, PinnedChain>()
  if (!pinned?.length) {
    return configPins
  }
  const chainIds = new Set(chains.map((chain) => chain.id))
  for (const pin of pinned) {
    if (
      (pin.side && pin.side !== side) ||
      !chainIds.has(pin.chainId) ||
      configPins.has(pin.chainId)
    ) {
      continue
    }
    configPins.set(pin.chainId, pin)
  }
  return configPins
}

export const sortChainsByPins = (
  chains: ExtendedChain[],
  configPins: Map<number, PinnedChain>,
  userPinnedChainIds: number[]
): ExtendedChain[] => {
  if (!configPins.size && !userPinnedChainIds.length) {
    return chains
  }
  const chainById = new Map(chains.map((chain) => [chain.id, chain]))
  const sorted: ExtendedChain[] = []
  const added = new Set<number>()
  for (const chainId of [...configPins.keys(), ...userPinnedChainIds]) {
    const chain = chainById.get(chainId)
    if (chain && !added.has(chainId)) {
      sorted.push(chain)
      added.add(chainId)
    }
  }
  for (const chain of chains) {
    if (!added.has(chain.id)) {
      sorted.push(chain)
    }
  }
  return sorted
}

export interface GetGridChainsParams {
  chains: ExtendedChain[]
  baseOrder: ExtendedChain[]
  configPins: Map<number, PinnedChain>
  selectedChainId: number | undefined
  tileCount: number
}

export const getGridChains = ({
  chains,
  baseOrder,
  configPins,
  selectedChainId,
  tileCount,
}: GetGridChainsParams): ExtendedChain[] => {
  const pins = [...configPins.keys()]
    .map((id) => chains.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, tileCount) as ExtendedChain[]
  // Filter with all config pins: a pin that the cut removed must not come back as a base tile.
  const rest = baseOrder
    .filter((c) => !configPins.has(c.id))
    .slice(0, Math.max(tileCount - pins.length, 0))
  const tiles = [...pins, ...rest]
  const selected =
    selectedChainId === undefined
      ? undefined
      : chains.find((c) => c.id === selectedChainId)
  if (!selected || tiles.some((c) => c.id === selected.id) || tileCount < 1) {
    return tiles
  }
  if (tiles.length < tileCount) {
    // A short base order (stored recent chains that a filter now removes) leaves room.
    return [...pins, selected, ...rest]
  }
  if (rest.length) {
    return [...pins, selected, ...rest.slice(0, -1)]
  }
  return [...pins.slice(0, -1), selected]
}
