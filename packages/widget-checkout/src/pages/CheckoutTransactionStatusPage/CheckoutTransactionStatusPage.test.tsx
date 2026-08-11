// @vitest-environment happy-dom

import type { FundingOrder } from '@lifi/sdk'
import { act, fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../test/renderWithI18n.js'

vi.mock('@lifi/widget/shared', () => ({
  formatTokenAmount: (amount: bigint) => amount.toString(),
  navigationRoutes: {
    home: '/',
    transactionExecution: 'transaction-execution',
    transactionDetails: 'transaction-details',
  },
  PageContainer: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  useChain: () => ({ chain: undefined }),
  useContactSupport: () => () => {},
  useExplorer: () => ({
    getTransactionLink: ({ txHash }: { txHash?: string }) =>
      txHash ? `https://scan/tx/${txHash}` : undefined,
  }),
  useHeader: () => {},
}))

const navigateMock = vi.fn()
const historyGoMock = vi.fn()
let historyLength = 1
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  useRouter: () => ({ history: { length: historyLength, go: historyGoMock } }),
  useSearch: () => searchState,
}))

let searchState: { orderId?: string } = {}

let fundingOrderState: {
  order: FundingOrder | undefined
  isError: boolean
  refetch: () => void
}
const refetchMock = vi.fn()
vi.mock('../../hooks/useFundingOrder.js', () => ({
  useFundingOrder: () => fundingOrderState,
}))

const completionMock = vi.fn()
vi.mock('../../hooks/useFundingOrderCompletion.js', () => ({
  useFundingOrderCompletion: (order: unknown) => completionMock(order),
}))

let depositState: Record<string, unknown> | null = null
vi.mock('../../providers/OnRampProvider/OnRampProvider.js', () => ({
  useActiveOnRampDeposit: () => depositState,
}))

const flowState = { fundingSource: 'transfer' as string | null }
vi.mock('../../stores/useCheckoutFlowStore.js', () => ({
  useCheckoutFlowStore: (selector: (state: unknown) => unknown) =>
    selector(flowState),
}))

const acknowledgeMock = vi.fn()
vi.mock('../../stores/useFundingOrderStore.js', () => ({
  useFundingOrderStore: (selector: (state: unknown) => unknown) =>
    selector({ acknowledge: acknowledgeMock }),
}))

vi.mock('./StatusWatching.js', () => ({
  StatusWatching: () => <div data-testid="status-watching" />,
}))
vi.mock('./StatusExecuting.js', () => ({
  StatusExecuting: ({ frozenRoute }: { frozenRoute?: { id: string } }) => (
    <div data-testid="status-executing" data-route={frozenRoute?.id ?? ''} />
  ),
}))
vi.mock('./StatusCompleted.js', () => ({
  StatusCompleted: ({ onDone }: { onDone: () => void }) => (
    <div data-testid="status-completed">
      <button type="button" onClick={onDone}>
        Done
      </button>
    </div>
  ),
}))

import { CheckoutTransactionStatusPage } from './CheckoutTransactionStatusPage.js'

function buildOrder(overrides: Partial<FundingOrder>): FundingOrder {
  return {
    orderId: 'o-1',
    partnerOrderId: 'p-1',
    type: 'SMART_DEPOSIT',
    status: 'PENDING',
    destination: { toChainId: 8453, toTokenAddress: '0xT', toAddress: '0xA' },
    createdAt: '',
    updatedAt: '',
    ...overrides,
  } as FundingOrder
}

beforeEach(() => {
  searchState = { orderId: 'o-1' }
  depositState = null
  flowState.fundingSource = 'transfer'
  historyLength = 1
  fundingOrderState = { order: undefined, isError: false, refetch: refetchMock }
})

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe('CheckoutTransactionStatusPage — phase routing', () => {
  it('shows StatusWatching when there is no order yet, and still calls useFundingOrderCompletion unconditionally (rules-of-hooks placement, before any early return)', () => {
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.getByTestId('status-watching')).toBeTruthy()
    expect(completionMock).toHaveBeenCalledWith(undefined)
  })

  it('shows StatusWatching while an order awaits funds', () => {
    fundingOrderState.order = buildOrder({
      status: 'PENDING',
      substatus: 'INTENT_AWAITING_FUNDS',
    })
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.getByTestId('status-watching')).toBeTruthy()
  })

  it('shows StatusExecuting once the deposit is in flight (pending, not one of the awaiting substatuses)', () => {
    fundingOrderState.order = buildOrder({
      status: 'PENDING',
      substatus: 'WAIT_DESTINATION_TRANSACTION',
    })
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.getByTestId('status-executing')).toBeTruthy()
  })

  it('shows the generic error screen and retries via refetch() when the order fetch itself errors', () => {
    fundingOrderState = {
      order: undefined,
      isError: true,
      refetch: refetchMock,
    }
    renderWithI18n(<CheckoutTransactionStatusPage />)
    const tryAgain = screen.getByRole('button', { name: 'button.tryAgain' })
    fireEvent.click(tryAgain)
    expect(refetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('CheckoutTransactionStatusPage — terminal acknowledgment', () => {
  it('holds the executing screen for MIN_EXECUTING_MS before swapping to StatusCompleted, then acknowledges + goes home on Done', () => {
    vi.useFakeTimers()
    fundingOrderState.order = buildOrder({
      status: 'DONE',
      result: { toTxHash: '0xd', toAmount: '9' },
    })
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.getByTestId('status-executing')).toBeTruthy()
    // The task's single wiring point for useFundingOrderCompletion — this is
    // the case that matters: the terminal order must reach it every render,
    // even while the page itself is still showing StatusExecuting (holding).
    expect(completionMock).toHaveBeenCalledWith(fundingOrderState.order)

    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByTestId('status-completed')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(acknowledgeMock).toHaveBeenCalledWith('o-1')
    expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
  })

  it('acknowledges + navigates to enter-amount from the failed screen primary action', () => {
    fundingOrderState.order = buildOrder({
      status: 'FAILED',
      substatus: 'UNKNOWN_FAILED_ERROR',
    })
    flowState.fundingSource = 'wallet'
    renderWithI18n(<CheckoutTransactionStatusPage />)
    const tryAgain = screen.getByRole('button', { name: 'button.tryAgain' })
    fireEvent.click(tryAgain)
    expect(acknowledgeMock).toHaveBeenCalledWith('o-1')
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/enter-amount',
      replace: true,
    })
  })
})

describe('CheckoutTransactionStatusPage — refund substatuses map through resolveStatusVariant', () => {
  it('renders the pending-refund compact screen with no CTA for REFUND_IN_PROGRESS', () => {
    fundingOrderState.order = buildOrder({
      status: 'PENDING',
      substatus: 'REFUND_IN_PROGRESS',
    })
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.queryByTestId('status-executing')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('renders the success-refund compact screen (not StatusCompleted) for a DONE+REFUNDED order and acknowledges on retry', () => {
    fundingOrderState.order = buildOrder({
      status: 'DONE',
      substatus: 'REFUNDED',
      result: { toTxHash: '0xrefund', toAmount: '5' },
    })
    flowState.fundingSource = 'wallet'
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.queryByTestId('status-completed')).toBeNull()
    const retry = screen.getByRole('button', { name: 'button.tryAgain' })
    fireEvent.click(retry)
    expect(acknowledgeMock).toHaveBeenCalledWith('o-1')
  })
})

describe('CheckoutTransactionStatusPage — pre-order provider branches still take precedence', () => {
  it('renders the on-ramp failure screen instead of any order-phase screen', () => {
    depositState = {
      failure: { kind: 'unavailable', message: 'nope', retry: vi.fn() },
      error: null,
      providerName: 'Transak',
    }
    fundingOrderState.order = buildOrder({ status: 'PENDING' })
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.queryByTestId('status-executing')).toBeNull()
    expect(screen.queryByTestId('status-watching')).toBeNull()
  })
})

describe('CheckoutTransactionStatusPage — lateDelivery is informational only', () => {
  it('renders the lateDelivery caption alongside StatusExecuting without changing phase', () => {
    fundingOrderState.order = buildOrder({
      status: 'PENDING',
      substatus: 'WAIT_DESTINATION_TRANSACTION',
      lateDelivery: { detectedAt: '2024-01-01T00:00:00Z' },
    })
    renderWithI18n(<CheckoutTransactionStatusPage />)
    expect(screen.getByTestId('status-executing')).toBeTruthy()
    expect(
      screen.getByText('checkout.transactionStatus.lateDelivery')
    ).toBeTruthy()
  })
})
