// @vitest-environment happy-dom

import type { FundingOrder, Route } from '@lifi/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  convertOrderToRoute: vi.fn(),
  createFundingOrder: vi.fn(),
}))

const walletAccount = { address: '0xWalletAddress' as string | undefined }
vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ account: walletAccount }),
}))

const setExecutableRouteMock = vi.fn()
const emitMock = vi.fn()
vi.mock('@lifi/widget/shared', () => ({
  BaseTransactionButton: ({
    text,
    onClick,
    disabled,
  }: {
    text: string
    onClick: () => void
    disabled?: boolean
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  ),
  formatTokenAmount: (amount: bigint) => amount.toString(),
  navigationRoutes: { transactionExecution: 'transaction-execution' },
  useFieldValues: () => [''],
  useRouteExecutionStoreContext: () => ({
    getState: () => ({ setExecutableRoute: setExecutableRouteMock }),
  }),
  useSDKClient: () => ({ id: 'sdk-client' }),
  useToAddressRequirements: () => ({
    toAddress: undefined,
    requiredToAddress: false,
  }),
  useWidgetEvents: () => ({ emit: emitMock }),
  WidgetEvent: { RouteSelected: 'route-selected' },
}))

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

const mockRoute = {
  id: 'route-1',
  fromChainId: 1,
  fromToken: { address: '0xFrom', symbol: 'USDC', decimals: 6 },
  fromAmount: '1000000',
  fromAddress: '0xSender',
  toChainId: 137,
  toToken: { address: '0xTo', symbol: 'USDT', decimals: 6 },
  toAddress: '0xReceiver',
} as unknown as Route

const refetchMock = vi.fn()
vi.mock('../hooks/useCheckoutFlowQuote.js', () => ({
  useCheckoutFlowQuote: () => ({
    route: mockRoute,
    routes: [mockRoute],
    depositAddress: '0xDepositAddress',
    isError: false,
    refetch: refetchMock,
    setReviewableRoute: vi.fn(),
  }),
}))

vi.mock('../hooks/useFrozenQuote.js', () => ({
  useFrozenQuote: () => ({ freeze: vi.fn(), clear: vi.fn() }),
}))

const onRampRefetchMock = vi.fn()
vi.mock('../hooks/useOnRampQuote.js', () => ({
  useOnRampQuote: () => ({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    isReady: false,
    isDebouncePending: false,
    error: null,
    debouncedFiatAmount: '',
    refetch: onRampRefetchMock,
  }),
}))

vi.mock('../hooks/useResolvedCheckoutRecipient.js', () => ({
  useResolvedCheckoutRecipient: () => ({
    recipient: { address: '0xReceiver' },
    isUserSettable: false,
    isUserSet: false,
    setUserRecipient: vi.fn(),
    clearUserRecipient: vi.fn(),
  }),
}))

vi.mock('../providers/OnRampProvider/OnRampProvider.js', () => ({
  useOnRampSessionByCategory: () => null,
}))

vi.mock('../stores/useFiatCurrencyStore.js', () => ({
  useFiatCurrencyStore: (selector: (state: unknown) => unknown) =>
    selector({ currency: 'USD', paymentMethod: null }),
}))

const trackOrderMock = vi.fn()
vi.mock('../stores/useFundingOrderStore.js', () => ({
  useFundingOrderStore: (selector: (state: unknown) => unknown) =>
    selector({ track: trackOrderMock }),
}))

const flowState = {
  fundingSource: 'transfer' as string | null,
  setFrozenRouteId: vi.fn(),
  selectedExchangeAccount: null,
}
vi.mock('../stores/useCheckoutFlowStore.js', () => ({
  useCheckoutFlowStore: (selector: (state: unknown) => unknown) =>
    selector(flowState),
}))

import { convertOrderToRoute, createFundingOrder } from '@lifi/sdk'
import { CheckoutFlowCtaButton } from './CheckoutFlowCtaButton.js'

function buildOrder(overrides?: Partial<FundingOrder>): FundingOrder {
  return {
    orderId: 'order-1',
    partnerOrderId: 'p-1',
    type: 'SMART_DEPOSIT',
    status: 'PENDING',
    destination: {
      toChainId: 137,
      toTokenAddress: '0xTo',
      toAddress: '0xReceiver',
    },
    createdAt: '',
    updatedAt: '',
    ...overrides,
  }
}

function wrap({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
  flowState.fundingSource = 'transfer'
})

describe('CheckoutFlowCtaButton — transfer flow creates a SMART_DEPOSIT order', () => {
  it('builds the SMART_DEPOSIT request from the route, tracks the order, and navigates with the orderId', async () => {
    vi.mocked(createFundingOrder).mockResolvedValue(buildOrder())

    renderWithI18n(<CheckoutFlowCtaButton />, { wrapper: wrap })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(createFundingOrder).toHaveBeenCalledTimes(1))
    const [, request] = vi.mocked(createFundingOrder).mock.calls[0] ?? []
    expect(request).toMatchObject({
      type: 'SMART_DEPOSIT',
      toChainId: 137,
      toTokenAddress: '0xTo',
      toAddress: '0xReceiver',
      fromChainId: 1,
      fromTokenAddress: '0xFrom',
      fromAmount: '1000000',
      // refundAddress mirrors the destination toAddress (buildOrderRequest.ts).
      refundAddress: '0xReceiver',
    })

    await waitFor(() =>
      expect(trackOrderMock).toHaveBeenCalledWith({
        orderId: 'order-1',
        fundingSource: 'transfer',
        createdAt: expect.any(Number),
      })
    )
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transfer-deposit',
      search: { orderId: 'order-1' },
    })
  })

  it('disables the CTA while the order is being created', async () => {
    let resolveOrder: (order: FundingOrder) => void = () => {}
    vi.mocked(createFundingOrder).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOrder = resolve
        })
    )

    renderWithI18n(<CheckoutFlowCtaButton />, { wrapper: wrap })
    const button = screen.getByRole('button') as HTMLButtonElement
    fireEvent.click(button)

    await waitFor(() => expect(button.disabled).toBe(true))
    resolveOrder(buildOrder({ orderId: 'order-2' }))
    await waitFor(() => expect(button.disabled).toBe(false))
  })

  it('resets the mutation error on retry so the CTA can be tried again', async () => {
    vi.mocked(createFundingOrder)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(buildOrder({ orderId: 'order-3' }))

    renderWithI18n(<CheckoutFlowCtaButton />, { wrapper: wrap })
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(createFundingOrder).toHaveBeenCalledTimes(1))

    // Mutation is now in an error state — the try-again button renders and,
    // without resetting, would strand the CTA on the error branch forever.
    fireEvent.click(screen.getByRole('button'))
    expect(refetchMock).toHaveBeenCalledTimes(1)
    expect(onRampRefetchMock).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(
        false
      )
    )

    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(createFundingOrder).toHaveBeenCalledTimes(2))
  })
})

describe('CheckoutFlowCtaButton — wallet flow executes STANDARD funding orders', () => {
  beforeEach(() => {
    flowState.fundingSource = 'wallet'
  })

  it('builds the STANDARD request with the connected account, seeds the executable route, tracks the order, and navigates to transaction-execution', async () => {
    vi.mocked(createFundingOrder).mockResolvedValue(
      buildOrder({ orderId: 'order-wallet-1', type: 'STANDARD' })
    )
    const orderRoute = {
      ...mockRoute,
      id: 'order-wallet-1',
    } as unknown as Route
    vi.mocked(convertOrderToRoute).mockReturnValue(orderRoute)

    renderWithI18n(<CheckoutFlowCtaButton />, { wrapper: wrap })
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(createFundingOrder).toHaveBeenCalledTimes(1))
    const [, request] = vi.mocked(createFundingOrder).mock.calls[0] ?? []
    expect(request).toMatchObject({
      type: 'STANDARD',
      toChainId: 137,
      toTokenAddress: '0xTo',
      toAddress: '0xReceiver',
      fromChainId: 1,
      fromTokenAddress: '0xFrom',
      fromAmount: '1000000',
      // fromAddress carries the connected wallet account, not the route's fromAddress.
      fromAddress: '0xWalletAddress',
    })

    await waitFor(() =>
      expect(setExecutableRouteMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'order-wallet-1' })
      )
    )
    expect(trackOrderMock).toHaveBeenCalledWith({
      orderId: 'order-wallet-1',
      fundingSource: 'wallet',
      createdAt: expect.any(Number),
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/transaction-execution',
      search: { routeId: 'order-wallet-1', checkoutAutoDeposit: true },
    })
    expect(emitMock).toHaveBeenCalledWith('route-selected', {
      route: orderRoute,
      routes: [orderRoute],
    })
  })

  it('disables the CTA while the order is being created', async () => {
    let resolveOrder: (order: FundingOrder) => void = () => {}
    vi.mocked(createFundingOrder).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOrder = resolve
        })
    )
    vi.mocked(convertOrderToRoute).mockReturnValue({
      ...mockRoute,
      id: 'order-wallet-2',
    } as unknown as Route)

    renderWithI18n(<CheckoutFlowCtaButton />, { wrapper: wrap })
    const button = screen.getByRole('button') as HTMLButtonElement
    fireEvent.click(button)

    await waitFor(() => expect(button.disabled).toBe(true))
    resolveOrder(buildOrder({ orderId: 'order-wallet-2', type: 'STANDARD' }))
    await waitFor(() => expect(button.disabled).toBe(false))
  })

  it('resets the mutation error on retry so the CTA can be tried again', async () => {
    vi.mocked(createFundingOrder)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(
        buildOrder({ orderId: 'order-wallet-3', type: 'STANDARD' })
      )
    vi.mocked(convertOrderToRoute).mockReturnValue({
      ...mockRoute,
      id: 'order-wallet-3',
    } as unknown as Route)

    renderWithI18n(<CheckoutFlowCtaButton />, { wrapper: wrap })
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(createFundingOrder).toHaveBeenCalledTimes(1))

    // Mutation is now in an error state — the try-again button renders and,
    // without resetting, would strand the CTA on the error branch forever.
    fireEvent.click(screen.getByRole('button'))
    expect(refetchMock).toHaveBeenCalledTimes(1)
    expect(onRampRefetchMock).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(
        false
      )
    )

    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(createFundingOrder).toHaveBeenCalledTimes(2))
  })
})
