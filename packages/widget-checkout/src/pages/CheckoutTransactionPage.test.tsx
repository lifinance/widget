// @vitest-environment happy-dom

import type { RouteExtended } from '@lifi/sdk'
import type { ReactElement, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

const useHeaderMock = vi.fn()
const routeExecutionMock = vi.fn()
const navigateMock = vi.fn()
const startButtonMock = vi.fn<(props: { onClick: () => void }) => void>()
const doneButtonsMock = vi.fn<(props: { onDone?: () => void }) => void>()
const acknowledgeMock = vi.fn()
// Default: not done. The done-branch tests flip it on.
const hasEnumFlagMock = vi.fn<(status: number, flag: number) => boolean>(
  () => false
)

// Kept separate from the identical enum declared inside the vi.mock factory
// below: a top-level const referenced directly inside the factory body
// (rather than through a nested closure like `useRouteExecution: () =>
// routeExecutionMock()`) hits the factory before its own module-scope
// initializer runs, because static `import` evaluation is hoisted ahead of
// this file's own top-level statements.
const mockRouteExecutionStatus = {
  Idle: 1 << 0,
  Pending: 1 << 1,
  Done: 1 << 2,
  Failed: 1 << 3,
  Partial: 1 << 4,
  Refunded: 1 << 5,
}

vi.mock('@lifi/widget/shared', () => {
  const RouteExecutionStatus = {
    Idle: 1 << 0,
    Pending: 1 << 1,
    Done: 1 << 2,
    Failed: 1 << 3,
    Partial: 1 << 4,
    Refunded: 1 << 5,
  }
  return {
    Card: () => null,
    ConfirmToAddressSheet: () => null,
    ContractComponent: () => null,
    calculateValueLossPercentage: () => 0,
    ExchangeRateBottomSheet: () => null,
    getAccumulatedFeeCostsBreakdown: () => ({ gasCostUSD: 0, feeCostUSD: 0 }),
    getSourceTxHash: () => undefined,
    getTokenValueLossThreshold: () => false,
    hasEnumFlag: (status: number, flag: number) =>
      hasEnumFlagMock(status, flag),
    navigationRoutes: { home: '/', transactionExecution: 'transaction' },
    // Renders children: the CTA under test lives inside it.
    PageContainer: ({ children }: { children: ReactNode }) => children,
    RouteExecutionStatus,
    RouteTokens: () => null,
    // Not rendered: `useHeader` below only records the element, it never
    // mounts it, so this stub is never invoked — its identity doesn't matter.
    RouteTracker: () => null,
    StartTransactionButton: (props: { onClick: () => void }) => {
      startButtonMock(props)
      return null
    },
    TokenValueBottomSheet: () => null,
    TransactionDoneButtons: (props: { onDone?: () => void }) => {
      doneButtonsMock(props)
      return null
    },
    useAddressActivity: () => ({
      toAddress: undefined,
      hasActivity: false,
      isLoading: false,
      isFetched: false,
    }),
    useFieldActions: () => ({ setFieldValue: () => {} }),
    useHeader: (title: unknown, action: unknown) =>
      useHeaderMock(title, action),
    useHeaderStore: () => () => {},
    useNavigateBack: () => () => {},
    useRouteExecution: () => routeExecutionMock(),
    useWidgetConfig: () => ({
      mode: undefined,
      modeOptions: undefined,
      contractSecondaryComponent: undefined,
      hiddenUI: undefined,
      defaultUI: undefined,
    }),
    useWidgetEvents: () => ({ emit: () => {} }),
    WarningMessages: () => null,
    WidgetEvent: {},
  }
})

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: {} }),
  useNavigate: () => navigateMock,
}))

// Non-Idle statuses render it; it pulls widget-core hooks this file doesn't stub.
vi.mock('../components/CheckoutExecutionProgress.js', () => ({
  CheckoutExecutionProgress: () => null,
}))

const toolFilterMock = vi.fn()
vi.mock('../hooks/useCheckoutToolFilter.js', () => ({
  useCheckoutToolFilter: () => toolFilterMock(),
}))

vi.mock('../stores/useFundingOrderStore.js', () => ({
  useFundingOrderStore: (selector: (state: unknown) => unknown) =>
    selector({ acknowledge: acknowledgeMock }),
}))

import { CheckoutTransactionPage } from './CheckoutTransactionPage.js'

function lastHeaderAction():
  | ReactElement<{ allowExchanges?: string[] }>
  | undefined {
  const lastCall = useHeaderMock.mock.calls.at(-1) as
    | [unknown, ReactElement<{ allowExchanges?: string[] }> | undefined]
    | undefined
  return lastCall?.[1]
}

function lastRouteTrackerAllowExchanges(): string[] | undefined {
  return lastHeaderAction()?.props.allowExchanges
}

const baseRouteExecution = {
  status: mockRouteExecutionStatus.Idle,
  executeRoute: () => {},
  restartRoute: () => {},
  deleteRoute: () => {},
}

beforeEach(() => {
  navigateMock.mockClear()
  startButtonMock.mockClear()
  doneButtonsMock.mockClear()
  acknowledgeMock.mockClear()
  hasEnumFlagMock.mockReset()
  hasEnumFlagMock.mockReturnValue(false)
  routeExecutionMock.mockReturnValue({
    ...baseRouteExecution,
    route: undefined,
  })
})

function clickStartButton(): void {
  const props = startButtonMock.mock.calls.at(-1)?.[0]
  if (!props) {
    throw new Error('StartTransactionButton was never rendered')
  }
  props.onClick()
}

describe('CheckoutTransactionPage — RouteTracker exchange-filter wiring', () => {
  // Covers the render site, which is where the review found the bug: the
  // filter reached `useCheckoutRoutes` (see useCheckoutRoutes.test.tsx) but
  // never reached `RouteTracker`'s `useRoutes` call because this page wasn't
  // forwarding it. On the reader side the values do not filter the re-quote —
  // `useRoutes` derives that from `observableRoute.steps`, which RouteTracker
  // always sets — they keep this reader's routes query key equal to the key
  // the writer seeded the reviewable route under. `RouteTracker` itself is a
  // one-line pass-through verified by reading
  // packages/widget/src/pages/TransactionPage/RouteTracker.tsx; widget-core
  // has no component-test infra (no @testing-library/react, no happy-dom, no
  // vitest.config.ts) to exercise it directly without adding one for a
  // single test.
  it('forwards useCheckoutToolFilter() into RouteTracker for a non-wallet funding source', () => {
    toolFilterMock.mockReturnValue({
      allowBridges: ['smartDeposits'],
      allowExchanges: ['smartDeposits'],
    })
    renderWithI18n(<CheckoutTransactionPage />)
    expect(lastRouteTrackerAllowExchanges()).toEqual(['smartDeposits'])
  })

  it('omits allowExchanges when useCheckoutToolFilter() returns undefined (wallet funding)', () => {
    toolFilterMock.mockReturnValue({})
    renderWithI18n(<CheckoutTransactionPage />)
    expect(lastRouteTrackerAllowExchanges()).toBeUndefined()
  })
})

describe('CheckoutTransactionPage — RouteTracker must never re-quote an order route', () => {
  // An order route (created via createFundingOrder) is a commitment with no
  // re-quote endpoint. Mounting RouteTracker on it lets its useRoutes call
  // resolve a NORMAL quote and silently evict the seeded order route (see
  // task-7-report.md fix addendum). This exercises the render site's guard;
  // `isFundingOrderStep` itself runs unmocked (real @lifi/sdk import).
  beforeEach(() => {
    toolFilterMock.mockReturnValue({})
  })

  it('renders RouteTracker in the header for a plain (non-order) route — positive control', () => {
    routeExecutionMock.mockReturnValue({
      ...baseRouteExecution,
      route: {
        id: 'route-1',
        fromChainId: 1,
        toChainId: 10,
        steps: [{ id: 'step-1' }],
      } as unknown as RouteExtended,
    })
    renderWithI18n(<CheckoutTransactionPage />)
    expect(lastHeaderAction()).toBeDefined()
  })

  it('omits RouteTracker from the header when the tracked route carries a fundingOrderId marker', () => {
    routeExecutionMock.mockReturnValue({
      ...baseRouteExecution,
      route: {
        id: 'order-1',
        fromChainId: 1,
        toChainId: 10,
        steps: [{ id: 'step-1', fundingOrderId: 'order-1' }],
      } as unknown as RouteExtended,
    })
    renderWithI18n(<CheckoutTransactionPage />)
    expect(lastHeaderAction()).toBeUndefined()
  })
})

describe('CheckoutTransactionPage — retry after a failed execution', () => {
  // An order is a one-shot commitment: `restartRoute()` on an order route
  // re-runs the same committed order, which the SDK re-polls as FAILED. Retry
  // must mint a new order, so the page sends the user back to amount entry.
  beforeEach(() => {
    toolFilterMock.mockReturnValue({})
  })

  it('navigates to enter-amount instead of restarting when a failed route is an order route', () => {
    const restartRoute = vi.fn()
    routeExecutionMock.mockReturnValue({
      ...baseRouteExecution,
      status: mockRouteExecutionStatus.Failed,
      restartRoute,
      route: {
        id: 'order-1',
        fromChainId: 1,
        toChainId: 10,
        steps: [{ id: 'step-1', fundingOrderId: 'order-1' }],
      } as unknown as RouteExtended,
    })
    renderWithI18n(<CheckoutTransactionPage />)

    clickStartButton()

    expect(restartRoute).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/enter-amount',
      replace: true,
    })
  })

  it('restarts the route for a failed plain swap route — negative control', () => {
    const restartRoute = vi.fn()
    routeExecutionMock.mockReturnValue({
      ...baseRouteExecution,
      status: mockRouteExecutionStatus.Failed,
      restartRoute,
      route: {
        id: 'route-1',
        fromChainId: 1,
        toChainId: 10,
        steps: [{ id: 'step-1' }],
      } as unknown as RouteExtended,
    })
    renderWithI18n(<CheckoutTransactionPage />)

    clickStartButton()

    expect(restartRoute).toHaveBeenCalledTimes(1)
    expect(navigateMock).not.toHaveBeenCalled()
  })
})

// The wallet flow finishes here, never on CheckoutTransactionStatusPage, so
// this is the only place its order can be retired from the activity list.
// Without it a completed wallet deposit keeps reading "Deposit in progress".
describe('CheckoutTransactionPage — Done retires the funding order', () => {
  beforeEach(() => {
    toolFilterMock.mockReturnValue({})
    hasEnumFlagMock.mockReturnValue(true)
  })

  it('acknowledges the order the route was created from', () => {
    routeExecutionMock.mockReturnValue({
      ...baseRouteExecution,
      status: mockRouteExecutionStatus.Done,
      route: {
        id: 'order-1',
        fromChainId: 1,
        toChainId: 10,
        steps: [{ id: 'step-1', fundingOrderId: 'order-1' }],
      } as unknown as RouteExtended,
    })
    renderWithI18n(<CheckoutTransactionPage />)

    const onDone = doneButtonsMock.mock.calls.at(-1)?.[0].onDone
    expect(onDone).toBeTypeOf('function')
    onDone?.()
    expect(acknowledgeMock).toHaveBeenCalledWith('order-1')
  })

  it('passes no onDone for a plain swap route — nothing to acknowledge', () => {
    routeExecutionMock.mockReturnValue({
      ...baseRouteExecution,
      status: mockRouteExecutionStatus.Done,
      route: {
        id: 'route-1',
        fromChainId: 1,
        toChainId: 10,
        steps: [{ id: 'step-1' }],
      } as unknown as RouteExtended,
    })
    renderWithI18n(<CheckoutTransactionPage />)

    expect(doneButtonsMock.mock.calls.at(-1)?.[0].onDone).toBeUndefined()
  })
})
