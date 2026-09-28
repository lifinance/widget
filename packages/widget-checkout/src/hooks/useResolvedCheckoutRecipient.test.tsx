// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let mockSavedRecipient: { address: string; chainType: string } | undefined

vi.mock('@lifi/widget/shared', () => ({
  useWidgetConfig: () => ({ toChain: 20000000000005 }),
  useChain: () => ({ chain: { id: 20000000000005, chainType: 'UTXO' } }),
}))
vi.mock('@lifi/widget-provider/checkout', () => ({
  useCheckoutConfig: () => ({
    integrator: 'test',
    allowUserDestinationAddress: true,
  }),
}))
vi.mock('@lifi/widget-provider', () => ({
  useAddressForChain: () => ({
    isAddressForChain: (address: string) => address.startsWith('t1'),
  }),
}))
vi.mock('../stores/useCheckoutRecipientStore.js', () => ({
  useCheckoutRecipientStore: (selector: (state: unknown) => unknown) =>
    selector({
      recipients: { test: mockSavedRecipient },
      setRecipient: vi.fn(),
      clearRecipient: vi.fn(),
    }),
}))

import { useResolvedCheckoutRecipient } from './useResolvedCheckoutRecipient.js'

describe('useResolvedCheckoutRecipient', () => {
  beforeEach(() => {
    mockSavedRecipient = undefined
  })

  it('drops a saved Bitcoin recipient for a ZEC destination', () => {
    mockSavedRecipient = {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      chainType: 'UTXO',
    }
    const { result } = renderHook(() => useResolvedCheckoutRecipient())
    expect(result.current.recipient).toBeNull()
    expect(result.current.isUserSet).toBe(false)
  })

  it('keeps a saved Zcash recipient for a ZEC destination', () => {
    mockSavedRecipient = {
      address: 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC',
      chainType: 'UTXO',
    }
    const { result } = renderHook(() => useResolvedCheckoutRecipient())
    expect(result.current.recipient?.address).toBe(
      't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'
    )
  })
})
