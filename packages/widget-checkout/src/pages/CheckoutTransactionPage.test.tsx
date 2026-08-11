// @vitest-environment happy-dom

import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

const useHeaderMock = vi.fn()

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
    useRouteExecution: () => ({
      route: undefined,
      status: RouteExecutionStatus.Idle,
      executeRoute: () => {},
      restartRoute: () => {},
      deleteRoute: () => {},
    }),
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

function lastRouteTrackerAllowExchanges(): string[] | undefined {
  const lastCall = useHeaderMock.mock.calls.at(-1) as
    | [unknown, ReactElement<{ allowExchanges?: string[] }> | undefined]
    | undefined
  return lastCall?.[1]?.props.allowExchanges
}

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
