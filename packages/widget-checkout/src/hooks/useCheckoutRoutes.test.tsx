// @vitest-environment happy-dom

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useRoutesMock = vi.fn((_args: unknown) => ({}) as unknown)
const useFieldValuesMock = vi.fn()
const useChainMock = vi.fn()

vi.mock('@lifi/widget/shared', () => ({
  useRoutes: (args: unknown) => useRoutesMock(args),
  useFieldValues: (...keys: string[]) => useFieldValuesMock(...keys),
  useChain: (id?: number) => useChainMock(id),
}))

import { useCheckoutRoutes } from './useCheckoutRoutes.js'

const EVM_CHAIN = 1
const SVM_CHAIN = 1151111081099710
const RECIPIENT = '0x1111111111111111111111111111111111111111'

function chainFor(id?: number) {
  if (id === EVM_CHAIN) {
    return { chain: { chainType: 'EVM' } }
  }
  if (id === SVM_CHAIN) {
    return { chain: { chainType: 'SVM' } }
  }
  return { chain: undefined }
}

function lastQuoteFromAddress(): string | undefined {
  const lastCall = useRoutesMock.mock.calls.at(-1)?.[0] as
    | { quoteFromAddress?: string }
    | undefined
  return lastCall?.quoteFromAddress
}

describe('useCheckoutRoutes', () => {
  beforeEach(() => {
    useRoutesMock.mockClear()
    useChainMock.mockImplementation(chainFor)
  })

  it('passes the destination as quoteFromAddress when ecosystems match', () => {
    useFieldValuesMock.mockReturnValue([RECIPIENT, EVM_CHAIN, EVM_CHAIN])
    renderHook(() => useCheckoutRoutes())
    expect(lastQuoteFromAddress()).toBe(RECIPIENT)
  })

  it('omits quoteFromAddress across ecosystems (EVM source, SVM destination)', () => {
    useFieldValuesMock.mockReturnValue([RECIPIENT, EVM_CHAIN, SVM_CHAIN])
    renderHook(() => useCheckoutRoutes())
    expect(lastQuoteFromAddress()).toBeUndefined()
  })

  it('omits quoteFromAddress when no destination is set', () => {
    useFieldValuesMock.mockReturnValue([undefined, EVM_CHAIN, EVM_CHAIN])
    renderHook(() => useCheckoutRoutes())
    expect(lastQuoteFromAddress()).toBeUndefined()
  })

  it('omits quoteFromAddress before the chains have loaded', () => {
    useFieldValuesMock.mockReturnValue([RECIPIENT, undefined, undefined])
    renderHook(() => useCheckoutRoutes())
    expect(lastQuoteFromAddress()).toBeUndefined()
  })
})
