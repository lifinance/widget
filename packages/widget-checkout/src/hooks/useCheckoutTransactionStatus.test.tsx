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

import { useCheckoutTransactionStatus } from './useCheckoutTransactionStatus.js'

function wrap() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCheckoutTransactionStatus', () => {
  beforeEach(() => {
    getStatus.mockReset()
  })

  it('does not poll when there is no transaction hash', async () => {
    renderHook(() => useCheckoutTransactionStatus({}), { wrapper: wrap() })
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(getStatus).not.toHaveBeenCalled()
  })

  it('polls getStatus by transaction hash once one is available', async () => {
    getStatus.mockResolvedValue({ status: 'PENDING' })
    const { result } = renderHook(
      () => useCheckoutTransactionStatus({ transactionHash: '0xhash' }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(getStatus).toHaveBeenCalled())
    const [, args] = getStatus.mock.calls[0] ?? []
    expect(args).toMatchObject({ txHash: '0xhash' })
    await waitFor(() => expect(result.current.status).toBeDefined())
    expect(result.current.phase).toBe('pending')
  })

  it('reports notFound and an undefined status while NOT_FOUND', async () => {
    getStatus.mockResolvedValue({ status: 'NOT_FOUND' })
    const { result } = renderHook(
      () => useCheckoutTransactionStatus({ transactionHash: '0xhash' }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(result.current.notFound).toBe(true))
    expect(result.current.status).toBeUndefined()
  })

  it('resolves done/failed phases from a terminal status', async () => {
    getStatus.mockResolvedValue({ status: 'DONE' })
    const { result } = renderHook(
      () => useCheckoutTransactionStatus({ transactionHash: '0xhash' }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(result.current.phase).toBe('done'))
  })

  it('surfaces isError and clears it after a successful refetch', async () => {
    getStatus.mockResolvedValue({ status: 'PENDING' })
    const { result } = renderHook(
      () => useCheckoutTransactionStatus({ transactionHash: '0xhash' }),
      { wrapper: wrap() }
    )
    await waitFor(() => expect(result.current.status).toBeDefined())
    expect(result.current.isError).toBe(false)

    getStatus.mockRejectedValue(new Error('network down'))
    result.current.refetch()
    await waitFor(() => expect(result.current.isError).toBe(true))

    getStatus.mockResolvedValue({ status: 'PENDING' })
    result.current.refetch()
    await waitFor(() => expect(result.current.isError).toBe(false))
  })
})
