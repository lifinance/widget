// @vitest-environment happy-dom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/widget/shared', () => ({
  useSDKClient: () => ({}),
}))

const getStatus = vi.fn()
vi.mock('@lifi/sdk', () => ({
  getStatus: (...args: unknown[]) => getStatus(...args),
}))

const getDepositAddressStatus = vi.fn()
vi.mock('../utils/depositAddressStatus.js', () => ({
  getDepositAddressStatus: (...args: unknown[]) =>
    getDepositAddressStatus(...args),
}))

import { useCheckoutTransactionStatus } from './useCheckoutTransactionStatus.js'

function wrap() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCheckoutTransactionStatus — pauseDepositPoll', () => {
  beforeEach(() => {
    getStatus.mockReset()
    getDepositAddressStatus.mockReset()
    getDepositAddressStatus.mockResolvedValue({ status: 'NOT_FOUND' })
    getStatus.mockResolvedValue({ status: 'PENDING' })
  })

  it('does not poll the deposit address while paused', async () => {
    renderHook(
      () =>
        useCheckoutTransactionStatus({
          depositAddress: '0xdeposit',
          fromChain: 1,
          pauseDepositPoll: true,
        }),
      { wrapper: wrap() }
    )
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(getDepositAddressStatus).not.toHaveBeenCalled()
    expect(getStatus).not.toHaveBeenCalled()
  })

  it('starts polling once unpaused', async () => {
    const { result, rerender } = renderHook(
      ({ paused }: { paused: boolean }) =>
        useCheckoutTransactionStatus({
          depositAddress: '0xdeposit',
          fromChain: 1,
          pauseDepositPoll: paused,
        }),
      { wrapper: wrap(), initialProps: { paused: true } }
    )
    expect(getDepositAddressStatus).not.toHaveBeenCalled()
    rerender({ paused: false })
    await waitFor(() => expect(getDepositAddressStatus).toHaveBeenCalled())
    await waitFor(() => expect(result.current.notFound).toBe(true))
    expect(result.current.status).toBeUndefined()
  })

  it('polls by deposit address when not paused', async () => {
    renderHook(
      () =>
        useCheckoutTransactionStatus({
          depositAddress: '0xdeposit',
          fromChain: 1,
        }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(getDepositAddressStatus).toHaveBeenCalled())
    expect(getStatus).not.toHaveBeenCalled()
  })

  it('hash-only polling is unaffected by pause', async () => {
    renderHook(
      () =>
        useCheckoutTransactionStatus({
          transactionHash: '0xhash',
          pauseDepositPoll: true,
        }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(getStatus).toHaveBeenCalled())
    expect(getDepositAddressStatus).not.toHaveBeenCalled()
  })
})

describe('useCheckoutTransactionStatus — poll errors', () => {
  beforeEach(() => {
    getStatus.mockReset()
    getDepositAddressStatus.mockReset()
  })

  it('surfaces isError while keeping the latched status on the deposit path', async () => {
    getDepositAddressStatus.mockResolvedValue({ status: 'PENDING' })
    const { result } = renderHook(
      () =>
        useCheckoutTransactionStatus({
          depositAddress: '0xdeposit',
          fromChain: 1,
        }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(result.current.status).toBeDefined())
    expect(result.current.isError).toBe(false)

    getDepositAddressStatus.mockRejectedValue(new Error('network down'))
    result.current.refetch()
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.status).toEqual({ status: 'PENDING' })
    expect(result.current.phase).toBe('pending')
  })

  it('clears isError and resumes updating status after a successful refetch', async () => {
    getDepositAddressStatus.mockResolvedValue({ status: 'PENDING' })
    const { result } = renderHook(
      () =>
        useCheckoutTransactionStatus({
          depositAddress: '0xdeposit',
          fromChain: 1,
        }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(result.current.status).toBeDefined())

    getDepositAddressStatus.mockRejectedValue(new Error('network down'))
    result.current.refetch()
    await waitFor(() => expect(result.current.isError).toBe(true))

    getDepositAddressStatus.mockResolvedValue({
      status: 'PENDING',
      substatus: 'WAIT_DESTINATION_TRANSACTION',
    })
    result.current.refetch()
    await waitFor(() => expect(result.current.isError).toBe(false))
    expect(result.current.status).toEqual({
      status: 'PENDING',
      substatus: 'WAIT_DESTINATION_TRANSACTION',
    })
  })
})
