import { ChainType, type ExtendedChain } from '@lifi/sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToAddressReset } from './useToAddressReset.js'

const mocks = vi.hoisted(() => ({
  setFieldValue: vi.fn(),
  setSelectedBookmark: vi.fn(),
  state: {
    requiredToAddress: false,
    selectedBookmark: undefined as
      | { address: string; chainType: string }
      | undefined,
  },
  isAddressForChain: (
    address: string,
    chain: { id: number; chainType: string }
  ) => {
    if (chain.chainType === 'EVM') {
      return address.startsWith('0x')
    }
    if (chain.id === 20000000000005) {
      return address.startsWith('t1')
    }
    return address.startsWith('bc1')
  },
}))

vi.mock('react', () => ({ useCallback: <T>(callback: T) => callback }))
vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({
    requiredUI: { toAddress: mocks.state.requiredToAddress },
  }),
}))
vi.mock('../stores/form/useFieldActions.js', () => ({
  useFieldActions: () => ({ setFieldValue: mocks.setFieldValue }),
}))
vi.mock('../stores/bookmarks/useBookmarks.js', () => ({
  useBookmarks: () => ({ selectedBookmark: mocks.state.selectedBookmark }),
}))
vi.mock('../stores/bookmarks/useBookmarkActions.js', () => ({
  useBookmarkActions: () => ({
    setSelectedBookmark: mocks.setSelectedBookmark,
  }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({ isAddressForChain: mocks.isAddressForChain }),
}))

const zcash = {
  id: 20000000000005,
  chainType: ChainType.UTXO,
} as ExtendedChain
const arbitrum = { id: 42161, chainType: ChainType.EVM } as ExtendedChain

describe('useToAddressReset', () => {
  beforeEach(() => {
    mocks.setFieldValue.mockReset()
    mocks.setSelectedBookmark.mockReset()
    mocks.state.requiredToAddress = false
  })

  it('clears a Bitcoin receiver when the destination becomes ZEC', () => {
    mocks.state.selectedBookmark = {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      chainType: 'UTXO',
    }
    useToAddressReset().tryResetToAddress(zcash)

    expect(mocks.setFieldValue).toHaveBeenCalledWith('toAddress', '', {
      isTouched: true,
    })
    expect(mocks.setSelectedBookmark).toHaveBeenCalledWith()
  })

  it('keeps an EVM receiver across EVM chains', () => {
    mocks.state.selectedBookmark = {
      address: '0xB095274743941e953c746F9C228DA9c18Bb6ec29',
      chainType: 'EVM',
    }
    useToAddressReset().tryResetToAddress(arbitrum)

    expect(mocks.setFieldValue).not.toHaveBeenCalled()
  })

  it('never clears a receiver the integrator requires', () => {
    mocks.state.requiredToAddress = true
    mocks.state.selectedBookmark = undefined
    useToAddressReset().tryResetToAddress(zcash)

    expect(mocks.setFieldValue).not.toHaveBeenCalled()
  })
})
