// @vitest-environment happy-dom

import type { RouteExtended } from '@lifi/sdk'
import { fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

const { execution, RouteExecutionStatus } = vi.hoisted(() => ({
  execution: {
    route: undefined as unknown,
    status: undefined as number | undefined,
    callBundleNotFound: false,
    restartRoute: (() => {}) as () => void,
    deleteRoute: (() => {}) as () => void,
  },
  RouteExecutionStatus: { Idle: 1 << 0, Done: 1 << 2, Failed: 1 << 3 },
}))

vi.mock('@lifi/widget/shared', () => {
  const Children = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  )
  const Empty = () => null
  return {
    Card: Children,
    ConfirmToAddressSheet: Empty,
    ContractComponent: Children,
    calculateValueLossPercentage: () => 0,
    ExchangeRateBottomSheet: Empty,
    getAccumulatedFeeCostsBreakdown: () => ({ gasCostUSD: 0, feeCostUSD: 0 }),
    getSourceTxHash: () => undefined,
    getTokenValueLossThreshold: () => false,
    hasEnumFlag: (flags: number, flag: number) => (flags & flag) === flag,
    // The widget's own tests cover the detection; this page only wires it in.
    isCallBundleNotFound: () => execution.callBundleNotFound,
    navigationRoutes: { home: '/', transactionExecution: 'transaction' },
    PageContainer: Children,
    RouteExecutionStatus,
    RouteTokens: Empty,
    RouteTracker: Empty,
    StartTransactionButton: ({
      text,
      onClick,
    }: {
      text?: string
      onClick?: () => void
    }) => (
      <button type="button" onClick={onClick}>
        {text}
      </button>
    ),
    TokenValueBottomSheet: Empty,
    TransactionDoneButtons: Empty,
    useAddressActivity: () => ({
      toAddress: undefined,
      hasActivity: true,
      isLoading: false,
      isFetched: true,
    }),
    useFieldActions: () => ({ setFieldValue: () => {} }),
    useHeader: () => {},
    useHeaderStore: (
      selector: (state: { setBackAction: () => void }) => unknown
    ) => selector({ setBackAction: () => {} }),
    useNavigateBack: () => () => {},
    useRouteExecution: () => ({
      route: execution.route,
      status: execution.status,
      executeRoute: () => {},
      restartRoute: execution.restartRoute,
      deleteRoute: execution.deleteRoute,
    }),
    useWidgetConfig: () => ({
      mode: 'custom',
      modeOptions: { custom: { type: 'deposit' } },
      hiddenUI: {},
      defaultUI: {},
    }),
    useWidgetEvents: () => ({ emit: () => {} }),
    WarningMessages: Empty,
    WidgetEvent: {},
  }
})

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: { routeId: 'r1' } }),
  useNavigate: () => () => {},
}))

vi.mock('../components/CheckoutExecutionProgress.js', () => ({
  CheckoutExecutionProgress: () => null,
}))

vi.mock('../hooks/useFrozenQuote.js', () => ({
  FROZEN_QUOTE_TTL_MS: 0,
  useFrozenQuote: () => ({ freeze: () => {} }),
}))

vi.mock('../hooks/usePendingCheckoutWriter.js', () => ({
  usePendingCheckoutWriter: () => ({ writeWallet: () => {} }),
}))

import { CheckoutTransactionPage } from './CheckoutTransactionPage.js'

const route = {
  id: 'r1',
  fromChainId: 1,
  toChainId: 8453,
  fromAmountUSD: '1',
  toAmountUSD: '1',
  steps: [{ id: 'step-0' }],
} as unknown as RouteExtended

const buttonTexts = () =>
  screen.getAllByRole('button').map((button) => button.textContent)

const deleteIcon = () =>
  document.querySelector('[aria-label="button.clearTransaction"]')

describe('CheckoutTransactionPage — buttons', () => {
  beforeEach(() => {
    execution.route = route
    execution.callBundleNotFound = false
    execution.restartRoute = vi.fn()
    execution.deleteRoute = vi.fn()
  })

  it('shows only Delete for a call bundle the wallet has no record of', () => {
    execution.callBundleNotFound = true
    execution.status = RouteExecutionStatus.Failed
    renderWithI18n(<CheckoutTransactionPage />)

    expect(buttonTexts()).toEqual(['button.delete'])
    expect(deleteIcon()).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'button.delete' }))
    expect(execution.deleteRoute).toHaveBeenCalledOnce()
    expect(execution.restartRoute).not.toHaveBeenCalled()
  })

  it('shows Try again and the delete icon for other errors', () => {
    execution.status = RouteExecutionStatus.Failed
    renderWithI18n(<CheckoutTransactionPage />)

    expect(buttonTexts()).toContain('button.tryAgain')
    expect(buttonTexts()).not.toContain('button.delete')
    expect(deleteIcon()).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'button.tryAgain' }))
    expect(execution.restartRoute).toHaveBeenCalledOnce()
  })

  it('shows the start button for an idle route', () => {
    execution.status = RouteExecutionStatus.Idle
    renderWithI18n(<CheckoutTransactionPage />)

    expect(buttonTexts()).toEqual(['button.pay'])
  })
})
