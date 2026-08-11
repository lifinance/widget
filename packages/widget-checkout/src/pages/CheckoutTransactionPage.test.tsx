// @vitest-environment happy-dom

import type { RouteExtended } from '@lifi/sdk'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

const useHeaderMock = vi.fn()
const routeExecutionMock = vi.fn()

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
    hasEnumFlag: () => false,
    navigationRoutes: { home: '/', transactionExecution: 'transaction' },
    PageContainer: () => null,
    RouteExecutionStatus,
    RouteTokens: () => null,
    // Not rendered: `useHeader` below only records the element, it never
    // mounts it, so this stub is never invoked — its identity doesn't matter.
    RouteTracker: () => null,
    StartTransactionButton: () => null,
    TokenValueBottomSheet: () => null,
    TransactionDoneButtons: () => null,
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
  useNavigate: () => () => {},
}))

const allowExchangesMock = vi.fn()
vi.mock('../hooks/useCheckoutAllowExchanges.js', () => ({
  useCheckoutAllowExchanges: () => allowExchangesMock(),
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
  routeExecutionMock.mockReturnValue({
    ...baseRouteExecution,
    route: undefined,
  })
})

describe('CheckoutTransactionPage — RouteTracker exchange-filter wiring', () => {
  // Covers the render site, which is where the review found the bug: the
  // filter reached `useCheckoutRoutes` (see useCheckoutRoutes.test.tsx) but
  // never reached `RouteTracker`'s `useRoutes` call because this page wasn't
  // forwarding it. `RouteTracker` itself is a one-line pass-through
  // (`useRoutes({ observableRoute, allowExchanges })`) verified by reading
  // packages/widget/src/pages/TransactionPage/RouteTracker.tsx; widget-core
  // has no component-test infra (no @testing-library/react, no happy-dom, no
  // vitest.config.ts) to exercise it directly without adding one for a
  // single test.
  it('forwards useCheckoutAllowExchanges() into RouteTracker for a non-wallet funding source', () => {
    allowExchangesMock.mockReturnValue(['smartDeposits'])
    renderWithI18n(<CheckoutTransactionPage />)
    expect(lastRouteTrackerAllowExchanges()).toEqual(['smartDeposits'])
  })

  it('omits allowExchanges when useCheckoutAllowExchanges() returns undefined (wallet funding)', () => {
    allowExchangesMock.mockReturnValue(undefined)
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
    allowExchangesMock.mockReturnValue(undefined)
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
