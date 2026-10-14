import { describe, expect, it, vi } from 'vitest'
import { useTokenSelect } from './useTokenSelect.js'

const ETHEREUM = 1
const ARBITRUM = 42161
const ZCASH = 20000000000005

const mocks = vi.hoisted(() => {
  const formValues = new Map<string, unknown>()
  return {
    formValues,
    setFieldValue: vi.fn((key: string, value: unknown) =>
      formValues.set(key, value)
    ),
    tryResetToAddress: vi.fn(),
  }
})

vi.mock('react', () => ({ useCallback: <T>(callback: T) => callback }))
vi.mock('../../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({
    mode: undefined,
    chains: { from: { deny: [20000000000005] } },
  }),
}))
vi.mock('../../stores/navigationTabs/useNavigationTabsStore.js', () => ({
  useSplitMode: () => undefined,
}))
vi.mock('../../hooks/useWidgetEvents.js', () => ({
  useWidgetEvents: () => ({ emit: () => {} }),
}))
vi.mock('../../hooks/useToAddressAutoPopulate.js', () => ({
  useToAddressAutoPopulate: () => () => {},
}))
vi.mock('../../hooks/useToAddressReset.js', () => ({
  useToAddressReset: () => ({ tryResetToAddress: mocks.tryResetToAddress }),
}))
vi.mock('../../hooks/useAvailableChains.js', () => ({
  useAvailableChains: () => ({
    getChainById: (chainId?: number) => (chainId ? { id: chainId } : undefined),
  }),
}))
vi.mock('../../stores/chains/ChainOrderStore.js', () => ({
  useChainOrderStore: () => [() => {}, () => {}],
}))
vi.mock('../../stores/form/useFieldActions.js', () => ({
  useFieldActions: () => ({
    setFieldValue: mocks.setFieldValue,
    getFieldValues: (...keys: string[]) =>
      keys.map((key) => mocks.formValues.get(key)),
  }),
}))

describe('useTokenSelect receiver reset', () => {
  const pick = (formType: 'from' | 'to', chainId: number) => {
    mocks.tryResetToAddress.mockClear()
    mocks.formValues.clear()
    mocks.formValues.set('fromChain', ETHEREUM)
    mocks.formValues.set('toChain', ETHEREUM)
    useTokenSelect(formType)('0xdef', chainId)
  }

  it('resets the receiver when a destination token moves the destination chain', () => {
    pick('to', ZCASH)

    expect(mocks.tryResetToAddress).toHaveBeenCalledWith({ id: ZCASH })
  })

  it('resets the receiver when a source token moves the destination chain with it', () => {
    pick('from', ARBITRUM)

    expect(mocks.formValues.get('toChain')).toBe(ARBITRUM)
    expect(mocks.tryResetToAddress).toHaveBeenCalledWith({ id: ARBITRUM })
  })

  it('keeps the receiver when the destination chain stays', () => {
    pick('to', ETHEREUM)

    expect(mocks.tryResetToAddress).not.toHaveBeenCalled()
  })
})
