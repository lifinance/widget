import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToAddressAutoPopulate } from './useToAddressAutoPopulate.js'

const mocks = vi.hoisted(() => {
  const btc = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  const zec = 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'
  return {
    btc,
    zec,
    setFieldValue: vi.fn(),
    setSelectedBookmark: vi.fn(),
    chains: {
      1: { id: 1, chainType: 'EVM' },
      20000000000001: { id: 20000000000001, chainType: 'UTXO' },
      20000000000005: { id: 20000000000005, chainType: 'UTXO' },
    } as Record<number, { id: number; chainType: string }>,
    isAddressForChain: (address: string, chain: { id: number }) =>
      chain.id === 20000000000005 ? address === zec : address === btc,
  }
})

vi.mock('react', () => ({ useCallback: <T>(callback: T) => callback }))
vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({
    accounts: [
      {
        address: mocks.btc,
        chainType: 'UTXO',
        isConnected: true,
        connector: { name: 'Xverse' },
      },
    ],
  }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({ isAddressForChain: mocks.isAddressForChain }),
}))
vi.mock('../stores/form/useFieldActions.js', () => ({
  useFieldActions: () => ({ setFieldValue: mocks.setFieldValue }),
}))
vi.mock('../stores/bookmarks/useBookmarkActions.js', () => ({
  useBookmarkActions: () => ({
    setSelectedBookmark: mocks.setSelectedBookmark,
  }),
}))
vi.mock('./useAvailableChains.js', () => ({
  useAvailableChains: () => ({
    getChainById: (chainId: number) => mocks.chains[chainId],
  }),
}))

const populate = (destination: number, selectedToAddress?: string) =>
  useToAddressAutoPopulate()({
    formType: 'to',
    selectedChainId: destination,
    selectedOppositeChainId: 1,
    selectedOppositeTokenAddress: '0x0000000000000000000000000000000000000000',
    selectedToAddress,
  })

describe('useToAddressAutoPopulate', () => {
  beforeEach(() => {
    mocks.setFieldValue.mockReset()
    mocks.setSelectedBookmark.mockReset()
  })

  it('does not fill a Bitcoin address as the ZEC receiver', () => {
    expect(populate(20000000000005)).toBeUndefined()
    expect(mocks.setFieldValue).not.toHaveBeenCalled()
  })

  it('still fills the Bitcoin wallet for a BTC destination', () => {
    expect(populate(20000000000001)).toBe(mocks.btc)
    expect(mocks.setFieldValue).toHaveBeenCalledWith('toAddress', mocks.btc, {
      isDirty: false,
      isTouched: true,
    })
  })

  it('keeps a Zcash receiver the user already chose', () => {
    expect(populate(20000000000005, mocks.zec)).toBeUndefined()
    expect(mocks.setFieldValue).not.toHaveBeenCalled()
  })
})
