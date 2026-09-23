// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

interface MockAccount {
  isConnected: boolean
  address?: string
  chainType: string
}

let mockAccounts: MockAccount[] = []
let mockFundingSource: string | null = 'wallet'
let mockDestinationChain: { id: number; chainType: string } = {
  id: 1,
  chainType: 'EVM',
}
// EVM chains take 0x addresses; ZEC takes t1 addresses only.
const mockIsAddressForChain = (
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
}
let mockResolved: {
  isUserSettable: boolean
  isUserSet: boolean
  setUserRecipient: typeof setUserRecipient
}

const setUserRecipient = vi.fn()

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: mockAccounts }),
}))
vi.mock('@lifi/widget/shared', () => ({
  useWidgetConfig: () => ({ toChain: 1 }),
  useChain: () => ({ chain: mockDestinationChain }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({ isAddressForChain: mockIsAddressForChain }),
}))
vi.mock('../stores/useCheckoutFlowStore.js', () => ({
  useCheckoutFlowStore: (
    selector: (s: { fundingSource: string | null }) => unknown
  ) => selector({ fundingSource: mockFundingSource }),
}))
vi.mock('./useResolvedCheckoutRecipient.js', () => ({
  useResolvedCheckoutRecipient: () => mockResolved,
}))

import { useDefaultWalletRecipient } from './useDefaultWalletRecipient.js'

describe('useDefaultWalletRecipient', () => {
  beforeEach(() => {
    setUserRecipient.mockReset()
    mockAccounts = [{ isConnected: true, address: '0xabc', chainType: 'EVM' }]
    mockFundingSource = 'wallet'
    mockDestinationChain = { id: 1, chainType: 'EVM' }
    mockResolved = { isUserSettable: true, isUserSet: false, setUserRecipient }
  })

  it('seeds the connected wallet as recipient in the wallet flow', () => {
    renderHook(() => useDefaultWalletRecipient())
    expect(setUserRecipient).toHaveBeenCalledWith({
      address: '0xabc',
      chainType: 'EVM',
    })
  })

  it('does not seed in a deposit flow', () => {
    mockFundingSource = 'transfer'
    renderHook(() => useDefaultWalletRecipient())
    expect(setUserRecipient).not.toHaveBeenCalled()
  })

  it('does not seed when the integrator fixed the recipient', () => {
    mockResolved = { isUserSettable: false, isUserSet: false, setUserRecipient }
    renderHook(() => useDefaultWalletRecipient())
    expect(setUserRecipient).not.toHaveBeenCalled()
  })

  it('does not overwrite a recipient the user already set', () => {
    mockResolved = { isUserSettable: true, isUserSet: true, setUserRecipient }
    renderHook(() => useDefaultWalletRecipient())
    expect(setUserRecipient).not.toHaveBeenCalled()
  })

  it('falls back to the manual field when no account matches the destination ecosystem', () => {
    mockAccounts = [{ isConnected: true, address: 'Sol111', chainType: 'SVM' }]
    renderHook(() => useDefaultWalletRecipient())
    expect(setUserRecipient).not.toHaveBeenCalled()
  })

  it('does not seed a Bitcoin wallet for a ZEC destination', () => {
    mockDestinationChain = { id: 20000000000005, chainType: 'UTXO' }
    mockAccounts = [
      {
        isConnected: true,
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        chainType: 'UTXO',
      },
    ]
    renderHook(() => useDefaultWalletRecipient())
    expect(setUserRecipient).not.toHaveBeenCalled()
  })
})
