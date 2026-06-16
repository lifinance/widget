// @vitest-environment happy-dom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/widget/shared', () => ({ useSDKClient: () => ({}) }))
vi.mock('@lifi/widget-provider/checkout', () => ({
  useCheckoutConfig: () => ({ integrator: 'int' }),
}))

const getDepositAddressStatus = vi.fn()
vi.mock('../utils/depositAddressStatus.js', () => ({
  getDepositAddressStatus: (...args: unknown[]) =>
    getDepositAddressStatus(...args),
}))

const getStatus = vi.fn()
vi.mock('@lifi/sdk', () => ({
  getStatus: (...args: unknown[]) => getStatus(...args),
}))

import {
  buildPendingRecord,
  buildResumeKey,
  type PendingRecord,
  usePendingCheckoutStore,
} from '../stores/usePendingCheckoutStore.js'
import { useCheckoutPendingRecords } from './useCheckoutPendingRecords.js'

function wrap() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

function seed(key: string, overrides: Partial<PendingRecord> = {}): void {
  usePendingCheckoutStore.getState().write(
    key,
    buildPendingRecord({
      fundingSource: 'transfer',
      depositAddress: '0xdep',
      fromChain: 1,
      status: 'pending',
      ...overrides,
    })
  )
}

describe('useCheckoutPendingRecords', () => {
  beforeEach(() => {
    getDepositAddressStatus.mockReset()
    getDepositAddressStatus.mockResolvedValue({ status: 'PENDING' })
    getStatus.mockReset()
    getStatus.mockResolvedValue({ status: 'PENDING' })
    usePendingCheckoutStore.getState().clearAll()
  })

  it('maps only this integrator’s live records into items', () => {
    seed(buildResumeKey('int', 'd1'), { depositAddress: '0xd1' })
    seed(buildResumeKey('other', 'd2'), { depositAddress: '0xd2' })
    const { result } = renderHook(() => useCheckoutPendingRecords(), {
      wrapper: wrap(),
    })
    expect(result.current).toHaveLength(1)
    expect(result.current[0]?.key).toBe('int:d1')
    expect(result.current[0]?.state).toBe('deposit')
  })

  it('clears a record when its poll returns DONE', async () => {
    getDepositAddressStatus.mockResolvedValue({ status: 'DONE' })
    seed(buildResumeKey('int', 'd1'), { depositAddress: '0xd1' })
    renderHook(() => useCheckoutPendingRecords(), { wrapper: wrap() })
    await waitFor(() =>
      expect(
        usePendingCheckoutStore.getState().records['int:d1']
      ).toBeUndefined()
    )
  })

  it('clears a record on a settled refund', async () => {
    getDepositAddressStatus.mockResolvedValue({
      status: 'PENDING',
      substatus: 'REFUNDED',
    })
    seed(buildResumeKey('int', 'd1'), { depositAddress: '0xd1' })
    renderHook(() => useCheckoutPendingRecords(), { wrapper: wrap() })
    await waitFor(() =>
      expect(
        usePendingCheckoutStore.getState().records['int:d1']
      ).toBeUndefined()
    )
  })

  it('marks a record failed when its poll returns FAILED', async () => {
    getDepositAddressStatus.mockResolvedValue({ status: 'FAILED' })
    seed(buildResumeKey('int', 'd1'), { depositAddress: '0xd1' })
    const { result } = renderHook(() => useCheckoutPendingRecords(), {
      wrapper: wrap(),
    })
    await waitFor(() =>
      expect(usePendingCheckoutStore.getState().records['int:d1']?.status).toBe(
        'failed'
      )
    )
    await waitFor(() => expect(result.current[0]?.state).toBe('failed'))
  })

  it('reports state "refund" while a refund is in progress (kept live)', async () => {
    getDepositAddressStatus.mockResolvedValue({
      status: 'PENDING',
      substatus: 'REFUND_IN_PROGRESS',
    })
    seed(buildResumeKey('int', 'd1'), { depositAddress: '0xd1' })
    const { result } = renderHook(() => useCheckoutPendingRecords(), {
      wrapper: wrap(),
    })
    await waitFor(() => expect(result.current[0]?.state).toBe('refund'))
    // Not cleared and not marked failed — it stays a live "refund in progress" card.
    expect(usePendingCheckoutStore.getState().records['int:d1']?.status).toBe(
      'pending'
    )
  })

  it('does not poll a record already marked failed', async () => {
    seed(buildResumeKey('int', 'd1'), {
      depositAddress: '0xd1',
      status: 'failed',
    })
    renderHook(() => useCheckoutPendingRecords(), { wrapper: wrap() })
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(getDepositAddressStatus).not.toHaveBeenCalled()
  })

  it('polls a deposit-address-less wallet record by tx hash and clears it on DONE', async () => {
    getStatus.mockResolvedValue({ status: 'DONE' })
    usePendingCheckoutStore.getState().write(
      buildResumeKey('int', 'h1'),
      buildPendingRecord({
        fundingSource: 'wallet',
        transactionHash: '0xhash',
        fromChain: 1,
        status: 'pending',
      })
    )
    renderHook(() => useCheckoutPendingRecords(), { wrapper: wrap() })
    await waitFor(() => expect(getStatus).toHaveBeenCalled())
    expect(getStatus.mock.calls[0]?.[1]).toMatchObject({ txHash: '0xhash' })
    expect(getDepositAddressStatus).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(
        usePendingCheckoutStore.getState().records['int:h1']
      ).toBeUndefined()
    )
  })

  it('polls an IF wallet record (deposit + hash) by deposit address, never by hash', async () => {
    usePendingCheckoutStore.getState().write(
      buildResumeKey('int', 'd1'),
      buildPendingRecord({
        fundingSource: 'wallet',
        depositAddress: '0xdep',
        transactionHash: '0xhash',
        fromChain: 1,
        status: 'pending',
      })
    )
    renderHook(() => useCheckoutPendingRecords(), { wrapper: wrap() })
    await waitFor(() => expect(getDepositAddressStatus).toHaveBeenCalled())
    expect(getStatus).not.toHaveBeenCalled()
  })
})
