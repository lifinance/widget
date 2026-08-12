// @vitest-environment happy-dom

import type { OnRampSession } from '@lifi/widget-provider/checkout'
import {
  createOnRampSessionsStore,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))
vi.mock('@lifi/widget/shared', () => ({
  useSDKClient: () => ({ config: {} }),
}))
vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getFundingOrder: vi.fn(),
}))

import { getFundingOrder } from '@lifi/sdk'
import { CheckoutModal, useCheckoutModal } from './CheckoutModal.js'
import { useFundingOrderStore } from './stores/useFundingOrderStore.js'
import { renderWithI18n } from './test/renderWithI18n.js'

function makeSession(isOpen: boolean): OnRampSession {
  return {
    isOpen,
    isLoading: false,
    error: null,
    failure: null,
    depositTxHash: null,
    open: () => {},
    close: () => {},
    acknowledgeDepositTxHash: () => {},
    mountTargetId: null,
  } as unknown as OnRampSession
}

function order(
  orderId: string,
  status: 'PENDING' | 'DONE' | 'FAILED',
  substatus?: string
) {
  return {
    orderId,
    partnerOrderId: `p-${orderId}`,
    type: 'SMART_DEPOSIT' as const,
    status,
    substatus,
    destination: { toChainId: 8453, toTokenAddress: '0x1', toAddress: '0x2' },
    createdAt: '',
    updatedAt: '',
  }
}

function withProvider(store: OnRampSessionsStore, client?: QueryClient) {
  const queryClient =
    client ?? new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <OnRampSessionsContext.Provider value={store}>
        {children}
      </OnRampSessionsContext.Provider>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  useFundingOrderStore.getState().clearAll()
})

function TriggerConfirmation() {
  const ctx = useCheckoutModal()
  return (
    <button type="button" onClick={() => ctx?.openCloseConfirmation()}>
      trigger-confirm
    </button>
  )
}

describe('CheckoutModal close guard', () => {
  it('ignores backdrop clicks while busy', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop as Element)
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('ignores ESC while busy', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('closes on backdrop click when idle', () => {
    const store = createOnRampSessionsStore()
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    fireEvent.click(backdrop as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('confirmation "Close checkout" calls closePanel; "Cancel" does not', async () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <TriggerConfirmation />
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    fireEvent.click(screen.getByText('trigger-confirm'))
    expect(screen.queryByText('Leave checkout?')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(screen.queryByText('Leave checkout?')).toBeNull()
    )

    // Re-open and confirm
    fireEvent.click(screen.getByText('trigger-confirm'))
    fireEvent.click(screen.getByRole('button', { name: 'Close checkout' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('CheckoutModal close guard — after funds are sent', () => {
  // After TRANSAK_ORDER_SUCCESSFUL the provider session closes and the
  // still-pending tracked order is what keeps the modal blocked while the
  // deposit resolves server-side.
  it('ignores backdrop clicks with a pending tracked order and no open session', async () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockResolvedValue(order('o-1', 'PENDING') as any)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store, client) }
    )
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop as Element)
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('ignores ESC with a pending tracked order and no open session', async () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockResolvedValue(order('o-1', 'PENDING') as any)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store, client) }
    )
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('closes on backdrop click once the tracked order resolves to terminal', async () => {
    const store = createOnRampSessionsStore()
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'cash',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockResolvedValue(order('o-1', 'DONE') as any)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store, client) }
    )
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    fireEvent.click(backdrop as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on backdrop click for a tracked order that was created but never funded', async () => {
    // A transfer order the user abandoned before sending the deposit stays
    // tracked (and PENDING server-side) for up to 7 days — it must not block
    // the close guard for that whole window.
    const store = createOnRampSessionsStore()
    useFundingOrderStore.getState().track({
      orderId: 'o-1',
      fundingSource: 'transfer',
      createdAt: Date.now(),
    })
    vi.mocked(getFundingOrder).mockResolvedValue(
      order('o-1', 'PENDING', 'INTENT_AWAITING_FUNDS') as any
    )
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store, client) }
    )
    await waitFor(() =>
      expect(client.getQueryData(['funding-order', 'o-1'])).toBeDefined()
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    fireEvent.click(backdrop as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
