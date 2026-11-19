import type { ExtendedChain } from '@lifi/sdk'
import { describe, expect, it } from 'vitest'
import type { ChainLabel, PinnedChain } from '../types/widget.js'
import {
  getConfigPinnedChains,
  getGridChains,
  isShortChainLabel,
  isVisibleChainLabel,
  sortChainsByPins,
} from './pinnedChains.js'

const chain = (id: number) =>
  ({ id, name: `Chain ${id}` }) as unknown as ExtendedChain

const chainsOf = (ids: number[]): ExtendedChain[] => ids.map(chain)

const ids = (chains: ExtendedChain[]): number[] => chains.map((c) => c.id)

const pinsOf = (chainIds: number[]): Map<number, PinnedChain> =>
  new Map(chainIds.map((chainId) => [chainId, { chainId }]))

describe('isVisibleChainLabel', () => {
  it('returns false for a missing label', () => {
    expect(isVisibleChainLabel(undefined)).toBe(false)
  })

  it('returns false for an empty text', () => {
    expect(isVisibleChainLabel({ text: '' })).toBe(false)
  })

  it('returns false for a whitespace-only text', () => {
    expect(isVisibleChainLabel({ text: '   ' })).toBe(false)
  })

  it('returns true for a text', () => {
    expect(isVisibleChainLabel({ text: 'NEW' })).toBe(true)
  })

  it('returns false for a malformed label', () => {
    expect(isVisibleChainLabel('NEW' as unknown as ChainLabel)).toBe(false)
    expect(isVisibleChainLabel({} as ChainLabel)).toBe(false)
    expect(isVisibleChainLabel({ text: 5 } as unknown as ChainLabel)).toBe(
      false
    )
    expect(isVisibleChainLabel(null as unknown as ChainLabel)).toBe(false)
  })
})

describe('isShortChainLabel', () => {
  it('returns true for a text of 4 or fewer characters', () => {
    expect(isShortChainLabel({ text: 'NEW' })).toBe(true)
    expect(isShortChainLabel({ text: 'BETA' })).toBe(true)
  })

  it('trims the text', () => {
    expect(isShortChainLabel({ text: 'HOT ' })).toBe(true)
  })

  it('returns false for a longer, empty or missing label', () => {
    expect(isShortChainLabel({ text: 'Promo' })).toBe(false)
    expect(isShortChainLabel({ text: '' })).toBe(false)
    expect(isShortChainLabel(undefined)).toBe(false)
  })

  it('counts code points, not UTF-16 units', () => {
    expect(isShortChainLabel({ text: 'Ünï' })).toBe(true)
    expect(isShortChainLabel({ text: '🔥🔥🔥🔥' })).toBe(true)
    expect(isShortChainLabel({ text: '🔥🔥🔥🔥🔥' })).toBe(false)
  })

  it('returns false for a malformed label', () => {
    expect(isShortChainLabel('NEW' as unknown as ChainLabel)).toBe(false)
    expect(isShortChainLabel({} as ChainLabel)).toBe(false)
    expect(isShortChainLabel({ text: 5 } as unknown as ChainLabel)).toBe(false)
  })
})

describe('getConfigPinnedChains', () => {
  const allChains = chainsOf([1, 10, 56, 137, 8453, 42161])

  it('returns an empty Map without pins', () => {
    expect(getConfigPinnedChains(undefined, allChains, 'from').size).toBe(0)
    expect(getConfigPinnedChains([], allChains, 'from').size).toBe(0)
  })

  it('keeps the config order', () => {
    const result = getConfigPinnedChains(
      [{ chainId: 137 }, { chainId: 1 }],
      chainsOf([1, 137, 56]),
      'from'
    )
    expect([...result.keys()]).toEqual([137, 1])
  })

  it('filters the pins by side', () => {
    const pinned: PinnedChain[] = [
      { chainId: 1, side: 'from' },
      { chainId: 137, side: 'to' },
      { chainId: 56 },
    ]
    expect([
      ...getConfigPinnedChains(pinned, allChains, 'from').keys(),
    ]).toEqual([1, 56])
    expect([...getConfigPinnedChains(pinned, allChains, 'to').keys()]).toEqual([
      137, 56,
    ])
  })

  it('treats an unknown side value as no side', () => {
    // Untyped config (plain JS, postMessage) can pass any value.
    const pinned = [{ chainId: 1, side: 'both' }] as unknown as PinnedChain[]
    expect([
      ...getConfigPinnedChains(pinned, allChains, 'from').keys(),
    ]).toEqual([1])
    expect([...getConfigPinnedChains(pinned, allChains, 'to').keys()]).toEqual([
      1,
    ])
  })

  it('drops the pins that are not in the chains', () => {
    const result = getConfigPinnedChains(
      [{ chainId: 999 }, { chainId: 1 }],
      chainsOf([1, 137]),
      'from'
    )
    expect([...result.keys()]).toEqual([1])
  })

  it('keeps the first entry of a duplicate chainId', () => {
    const result = getConfigPinnedChains(
      [
        { chainId: 1, label: { text: 'A' } },
        { chainId: 1, label: { text: 'B' } },
      ],
      allChains,
      'from'
    )
    expect(result.size).toBe(1)
    expect(result.get(1)?.label?.text).toBe('A')
  })

  it('keeps one entry for each side of the same chain', () => {
    const pinned: PinnedChain[] = [
      { chainId: 1, side: 'from', label: { text: 'A' } },
      { chainId: 1, side: 'to', label: { text: 'B' } },
    ]
    expect(
      getConfigPinnedChains(pinned, allChains, 'from').get(1)?.label?.text
    ).toBe('A')
    expect(
      getConfigPinnedChains(pinned, allChains, 'to').get(1)?.label?.text
    ).toBe('B')
  })

  describe('with malformed entries from untyped config', () => {
    const resolve = (pinned: unknown[]): Map<number, PinnedChain> =>
      getConfigPinnedChains(pinned as PinnedChain[], allChains, 'from')

    it('skips a null entry', () => {
      expect([...resolve([null, { chainId: 1 }]).keys()]).toEqual([1])
    })

    it('skips an undefined entry', () => {
      expect([...resolve([undefined, { chainId: 1 }]).keys()]).toEqual([1])
    })

    it('skips an entry with a string chainId', () => {
      expect([...resolve([{ chainId: '137' }, { chainId: 1 }]).keys()]).toEqual(
        [1]
      )
    })

    it('keeps the pin without a label for a string label', () => {
      const result = resolve([{ chainId: 137, label: 'NEW' }])
      expect([...result.keys()]).toEqual([137])
      expect(result.get(137)?.label).toBeUndefined()
    })

    it('keeps the pin without a label for a label without text', () => {
      const result = resolve([{ chainId: 137, label: {} }])
      expect([...result.keys()]).toEqual([137])
      expect(result.get(137)?.label).toBeUndefined()
    })

    it('keeps the pin without a label for a label with a number text', () => {
      const result = resolve([{ chainId: 137, label: { text: 5 } }])
      expect([...result.keys()]).toEqual([137])
      expect(result.get(137)?.label).toBeUndefined()
    })

    it('keeps the pin without a label for a whitespace-only text', () => {
      const result = resolve([{ chainId: 137, label: { text: '   ' } }])
      expect([...result.keys()]).toEqual([137])
      expect(result.get(137)?.label).toBeUndefined()
    })

    it('keeps a valid label', () => {
      const result = resolve([{ chainId: 137, label: { text: 'NEW' } }])
      expect(result.get(137)?.label).toEqual({ text: 'NEW' })
    })

    it('keeps a trimmed tooltip', () => {
      const result = resolve([{ chainId: 137, tooltip: '  Promoted  ' }])
      expect(result.get(137)?.tooltip).toBe('Promoted')
    })

    it('drops a whitespace-only or a non-string tooltip', () => {
      expect(
        resolve([{ chainId: 137, tooltip: '   ' }]).get(137)?.tooltip
      ).toBeUndefined()
      expect(
        resolve([{ chainId: 137, tooltip: 42 }]).get(137)?.tooltip
      ).toBeUndefined()
    })
  })
})

describe('sortChainsByPins', () => {
  const chains = chainsOf([1, 10, 56, 137, 8453])

  it('keeps the order without pins', () => {
    expect(ids(sortChainsByPins(chains, new Map(), []))).toEqual([
      1, 10, 56, 137, 8453,
    ])
  })

  it('puts the config pins first, then the user pins, then the rest', () => {
    expect(ids(sortChainsByPins(chains, pinsOf([8453]), [56, 1]))).toEqual([
      8453, 56, 1, 10, 137,
    ])
  })

  it('shows a chain that is a config pin and a user pin one time', () => {
    expect(ids(sortChainsByPins(chains, pinsOf([1]), [1, 56]))).toEqual([
      1, 56, 10, 137, 8453,
    ])
  })

  it('skips a user pin that is not in the chains', () => {
    expect(
      ids(sortChainsByPins(chainsOf([1, 10]), new Map(), [56, 10]))
    ).toEqual([10, 1])
  })

  it('skips a config pin that is not in the chains', () => {
    const configPins = getConfigPinnedChains(
      [{ chainId: 8453 }, { chainId: 10 }],
      chains,
      'from'
    )
    expect(
      ids(sortChainsByPins(chainsOf([1, 10, 56]), configPins, []))
    ).toEqual([10, 1, 56])
  })
})

describe('getGridChains', () => {
  // Base chains b0..b11 use IDs 100..111, pins P1..P9 use IDs 1..9, S uses 500.
  const b = (index: number): ExtendedChain => chain(100 + index)
  const bases = (count: number): ExtendedChain[] =>
    Array.from({ length: count }, (_, index) => b(index))
  const P = (index: number): ExtendedChain => chain(index)
  const pins = (count: number): ExtendedChain[] =>
    Array.from({ length: count }, (_, index) => P(index + 1))
  const S = chain(500)

  it('returns the base window without pins when it shows the selected chain', () => {
    const chains = bases(12)
    const baseOrder = bases(8)
    const result = getGridChains({
      chains,
      baseOrder,
      configPins: new Map(),
      selectedChainId: 103,
      tileCount: 8,
    })
    expect(ids(result)).toEqual(ids(baseOrder.slice(0, 8)))
  })

  it('puts a hidden selected chain first without pins', () => {
    const baseOrder = [...bases(11), S]
    const result = getGridChains({
      chains: baseOrder,
      baseOrder,
      configPins: new Map(),
      selectedChainId: S.id,
      tileCount: 9,
    })
    expect(ids(result)).toEqual([S.id, ...ids(bases(8))])
  })

  it('keeps a visible selected chain at its position without pins', () => {
    const baseOrder = [b(0), b(1), b(2), S, b(4), b(5), b(6), b(7)]
    const result = getGridChains({
      chains: [...baseOrder, b(8), b(9)],
      baseOrder,
      configPins: new Map(),
      selectedChainId: S.id,
      tileCount: 8,
    })
    expect(ids(result)).toEqual(ids(baseOrder))
    expect(result[3].id).toBe(S.id)
  })

  it('puts the selected chain after the pins and drops the last base tile', () => {
    const baseOrder = [...bases(7), S]
    const result = getGridChains({
      chains: [P(1), ...baseOrder, b(8)],
      baseOrder,
      configPins: pinsOf([1]),
      selectedChainId: S.id,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([1, S.id, ...ids(bases(6))])
  })

  it('drops no tile when the base order is short', () => {
    const baseOrder = bases(5)
    const result = getGridChains({
      chains: [P(1), S, ...bases(10)],
      baseOrder,
      configPins: pinsOf([1]),
      selectedChainId: S.id,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([1, S.id, ...ids(bases(5))])
  })

  it('does not duplicate a pin that is also in the base order', () => {
    const baseOrder = [b(0), b(1), P(1), b(2), b(3), b(4), b(5), b(6)]
    const result = getGridChains({
      chains: [...baseOrder, b(7), b(8)],
      baseOrder,
      configPins: pinsOf([1]),
      selectedChainId: 100,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([1, ...ids(bases(7))])
  })

  it('replaces the last cut pin with a selected chain that is not a pin', () => {
    const result = getGridChains({
      chains: [...pins(9), S, ...bases(4)],
      baseOrder: bases(4),
      configPins: pinsOf(ids(pins(9))),
      selectedChainId: S.id,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([...ids(pins(7)), S.id])
  })

  it('keeps the pins when the selected chain is a visible pin', () => {
    const result = getGridChains({
      chains: [...pins(9), ...bases(4)],
      baseOrder: bases(4),
      configPins: pinsOf(ids(pins(9))),
      selectedChainId: 2,
      tileCount: 8,
    })
    expect(ids(result)).toEqual(ids(pins(8)))
  })

  it('replaces the last pin with a selected pin that the cut removed', () => {
    const result = getGridChains({
      chains: [...pins(9), ...bases(4)],
      baseOrder: [P(9), ...bases(4)],
      configPins: pinsOf(ids(pins(9))),
      selectedChainId: 9,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([...ids(pins(7)), 9])
  })

  it('inserts no chain when no chain is selected', () => {
    const result = getGridChains({
      chains: [P(1), ...bases(12)],
      baseOrder: bases(8),
      configPins: pinsOf([1]),
      selectedChainId: undefined,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([1, ...ids(bases(7))])
  })

  it('inserts no chain when the selected chain is not in the chains', () => {
    const result = getGridChains({
      chains: [P(1), ...bases(12)],
      baseOrder: bases(8),
      configPins: pinsOf([1]),
      selectedChainId: 500,
      tileCount: 8,
    })
    expect(ids(result)).toEqual([1, ...ids(bases(7))])
  })

  it('shows all chains with the pin first when all chains fit', () => {
    const chains = [b(0), b(1), P(1), b(2), b(3)]
    const result = getGridChains({
      chains,
      baseOrder: chains,
      configPins: pinsOf([1]),
      selectedChainId: 101,
      tileCount: chains.length,
    })
    expect(ids(result)).toEqual([1, 100, 101, 102, 103])
  })
})
