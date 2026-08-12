// @vitest-environment happy-dom

import type { Route } from '@lifi/sdk'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

let fieldValues: Record<string, unknown> = {}
function resetFieldValues(): void {
  fieldValues = {
    cashFiatAmount: '',
    fromAmount: '',
    toChain: 137,
    toToken: '0xTo',
  }
}
resetFieldValues()

const setFieldValueMock = vi.fn()

vi.mock('@lifi/widget/shared', () => ({
  AvatarBadgedDefault: () => null,
  ChainAvatar: () => null,
  FeeBreakdownTooltip: ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  ),
  FormKeyHelper: {
    getChainKey: (formType: string) => `${formType}Chain`,
    getTokenKey: (formType: string) => `${formType}Token`,
    getAmountKey: (formType: string) => `${formType}Amount`,
  },
  formatDuration: () => '0s',
  formatInputAmount: (value: string) => value,
  formatTokenAmount: (value: bigint) => value.toString(),
  formatTokenPrice: () => '0',
  getAccumulatedFeeCostsBreakdown: () => ({
    gasCosts: [],
    feeCosts: [],
    combinedFeesUSD: 0,
  }),
  getPriceImpact: () => 0,
  IconTypography: ({ children }: { children?: ReactNode }) => <>{children}</>,
  ProgressToNextUpdate: () => null,
  RouteDetails: () => null,
  TokenAvatar: () => null,
  TokenRate: () => null,
  useChain: () => ({ chain: undefined }),
  useFieldActions: () => ({ setFieldValue: setFieldValueMock }),
  useFieldValues: (...names: string[]) =>
    names.map((name) => fieldValues[name]),
  useToken: () => ({ token: undefined }),
}))

vi.mock('../hooks/useCheckoutToolFilter.js', () => ({
  useCheckoutToolFilter: () => ({}),
}))

const mockRoute = {
  id: 'route-1',
  fromChainId: 1,
  fromToken: { address: '0xFrom', symbol: 'USDC', decimals: 6, priceUSD: '1' },
  fromAmount: '1000000',
  fromAddress: '0xSender',
  toChainId: 137,
  toToken: { address: '0xTo', symbol: 'USDT', decimals: 6, priceUSD: '1' },
  toAmount: '999000',
  toAmountMin: '990000',
  toAddress: '0xReceiver',
  steps: [],
} as unknown as Route

let checkoutRoutesState: {
  routes: Route[] | undefined
  isLoading: boolean
  isFetching: boolean
  isFetched: boolean
  dataUpdatedAt: number
  refetchTime: number
}
function resetCheckoutRoutesState(): void {
  checkoutRoutesState = {
    routes: [mockRoute],
    isLoading: false,
    isFetching: false,
    isFetched: true,
    dataUpdatedAt: Date.now(),
    refetchTime: 60_000,
  }
}
resetCheckoutRoutesState()
vi.mock('../hooks/useCheckoutRoutes.js', () => ({
  useCheckoutRoutes: () => ({
    ...checkoutRoutesState,
    refetch: vi.fn(),
  }),
}))

let checkoutFlowQuoteState: {
  depositAddress: string | null
  isLoading: boolean
  isFetching: boolean
  isFetched: boolean
  isError: boolean
}
function resetCheckoutFlowQuoteState(): void {
  checkoutFlowQuoteState = {
    depositAddress: null,
    isLoading: false,
    isFetching: false,
    isFetched: true,
    isError: false,
  }
}
resetCheckoutFlowQuoteState()
vi.mock('../hooks/useCheckoutFlowQuote.js', () => ({
  useCheckoutFlowQuote: () => ({ ...checkoutFlowQuoteState }),
}))

let onRampQuoteState: {
  data: unknown
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  isReady: boolean
  isDebouncePending: boolean
}
function resetOnRampQuoteState(): void {
  onRampQuoteState = {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    isReady: false,
    isDebouncePending: false,
  }
}
resetOnRampQuoteState()
vi.mock('../hooks/useOnRampQuote.js', () => ({
  useOnRampQuote: () => ({ ...onRampQuoteState, refetch: vi.fn() }),
}))

const flowState = {
  fundingSource: 'transfer' as string | null,
}
vi.mock('../stores/useCheckoutFlowStore.js', () => ({
  useCheckoutFlowStore: (selector: (state: unknown) => unknown) =>
    selector(flowState),
}))

vi.mock('./CheckoutRouteNotFound.js', () => ({
  CheckoutRouteNotFound: () => <div data-testid="route-not-found" />,
}))

vi.mock('./TermsDisclaimer.js', () => ({
  TermsDisclaimer: () => null,
}))

import { CheckoutReceiveCard } from './CheckoutReceiveCard.js'

beforeEach(() => {
  vi.clearAllMocks()
  flowState.fundingSource = 'transfer'
  resetFieldValues()
  resetCheckoutRoutesState()
  resetCheckoutFlowQuoteState()
  resetOnRampQuoteState()
})

describe('CheckoutReceiveCard — cash gates on the fiat quote, not a crypto deposit route', () => {
  beforeEach(() => {
    flowState.fundingSource = 'cash'
    fieldValues.cashFiatAmount = '100'
    onRampQuoteState.isReady = true
    onRampQuoteState.data = {
      funding: { estimatedAmount: '99.5' },
      fees: { currency: 'USD', total: { amount: '0.5' } },
    }
  })

  it('does not show CheckoutRouteNotFound when the route carries no deposit address but the fiat quote is good', () => {
    checkoutFlowQuoteState.depositAddress = null
    renderWithI18n(<CheckoutReceiveCard />)

    expect(screen.queryByTestId('route-not-found')).toBeNull()
  })

  it('does not show CheckoutRouteNotFound when there is no crypto route at all but the fiat quote is good', () => {
    fieldValues.fromAmount = '99.5'
    checkoutRoutesState.routes = undefined
    checkoutFlowQuoteState.depositAddress = null
    renderWithI18n(<CheckoutReceiveCard />)

    expect(screen.queryByTestId('route-not-found')).toBeNull()
  })
})

describe('CheckoutReceiveCard — transfer/exchange still gate on the deposit address', () => {
  beforeEach(() => {
    flowState.fundingSource = 'transfer'
    fieldValues.fromAmount = '10'
  })

  it('shows CheckoutRouteNotFound for transfer when the route has no deposit address', () => {
    checkoutFlowQuoteState.depositAddress = null
    renderWithI18n(<CheckoutReceiveCard />)

    expect(screen.queryByTestId('route-not-found')).not.toBeNull()
  })

  it('does not show CheckoutRouteNotFound for transfer once a deposit address resolves', () => {
    checkoutFlowQuoteState.depositAddress = '0xDepositAddress'
    renderWithI18n(<CheckoutReceiveCard />)

    expect(screen.queryByTestId('route-not-found')).toBeNull()
  })

  it('shows CheckoutRouteNotFound for exchange when the route has no deposit address', () => {
    flowState.fundingSource = 'exchange'
    checkoutFlowQuoteState.depositAddress = null
    renderWithI18n(<CheckoutReceiveCard />)

    expect(screen.queryByTestId('route-not-found')).not.toBeNull()
  })
})
