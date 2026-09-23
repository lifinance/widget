import { describe, expect, it, vi } from 'vitest'
import { useChains } from './useChains.js'

const mocks = vi.hoisted(() => ({
  chains: [
    { id: 1, chainType: 'EVM' },
    { id: 20000000000001, chainType: 'UTXO' },
    { id: 20000000000005, chainType: 'UTXO' },
  ],
}))

vi.mock('react', () => ({
  useMemo: <T>(factory: () => T) => factory(),
}))
vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({}),
}))
vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => ({
    chains: mocks.chains,
    isLoading: false,
    getChainById: () => undefined,
  }),
}))

const ids = (type?: 'from' | 'to') =>
  useChains(type).chains?.map((chain) => chain.id)

describe('useChains', () => {
  it('leaves ZEC out of the source chains', () => {
    expect(ids('from')).toEqual([1, 20000000000001])
  })

  it('keeps ZEC as a destination and in the unfiltered list', () => {
    expect(ids('to')).toContain(20000000000005)
    expect(ids()).toContain(20000000000005)
  })
})
