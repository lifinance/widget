// @vitest-environment happy-dom

import type { FundingOrder } from '@lifi/sdk'
import { fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../test/renderWithI18n.js'

const contactSupportMock = vi.fn()
const useHeaderMock = vi.fn()
vi.mock('@lifi/widget/shared', () => ({
  Card: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  CardIconButton: ({ children }: { children?: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  formatTokenAmount: (amount: bigint) => amount.toString(),
  // navigationRoutes feeds utils/navigationRoutes.ts at module scope.
  navigationRoutes: { transactionExecution: 'transaction-execution' },
  PageContainer: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  shortenAddress: (address: string) => address,
  useChain: () => ({ chain: { name: 'Arbitrum' } }),
  useContactSupport: () => contactSupportMock,
  useHeader: (title: unknown) => useHeaderMock(title),
}))

const navigateMock = vi.fn()
let searchState: { orderId?: string } = {}
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  useSearch: () => searchState,
}))

let fundingOrderState: {
  order: FundingOrder | undefined
  phase: 'pending' | 'done' | 'failed' | undefined
  isError: boolean
  refetch: () => void
}
const refetchMock = vi.fn()
vi.mock('../../hooks/useFundingOrder.js', () => ({
  useFundingOrder: () => fundingOrderState,
}))

vi.mock('../DepositErrorPages/DepositErrorPages.js', () => ({
  DepositUnexpectedPage: () => <div data-testid="deposit-unexpected" />,
}))
vi.mock('./DepositDetails.js', () => ({
  DepositDetails: () => null,
}))
vi.mock('qrcode.react', () => ({
  QRCodeSVG: () => <div data-testid="qr" />,
}))
vi.mock('@lifi/sdk', () => ({
  convertQuoteToRoute: (quote: { fromAmount: string }) => ({
    fromAmount: quote.fromAmount,
    fromChainId: 42161,
    fromToken: { symbol: 'USDC', decimals: 6, logoURI: undefined },
  }),
}))

import { TransferDepositPage } from './TransferDepositPage.js'

function buildOrder(overrides: Partial<FundingOrder> = {}): FundingOrder {
  return {
    orderId: 'o-1',
    partnerOrderId: 'p-1',
    type: 'SMART_DEPOSIT',
    status: 'PENDING',
    substatus: 'INTENT_AWAITING_FUNDS',
    depositAddress: '0xDeposit',
    destination: { toChainId: 8453, toTokenAddress: '0xT', toAddress: '0xA' },
    quote: { fromAmount: '1000000' },
    createdAt: '',
    updatedAt: '',
    ...overrides,
  } as FundingOrder
}

beforeEach(() => {
  vi.clearAllMocks()
  searchState = { orderId: 'o-1' }
  fundingOrderState = {
    order: undefined,
    phase: undefined,
    isError: false,
    refetch: refetchMock,
  }
})

// Before this, both cases fell through to `if (!order) return
// <DepositLoadingState />` — an unbreakable spinner on a page whose Back
// button abandons the transfer.
describe('TransferDepositPage — unresolvable deposits get an actionable screen', () => {
  it('offers a retry that refetches when the order poll errored', () => {
    fundingOrderState.isError = true
    renderWithI18n(<TransferDepositPage />)

    expect(screen.getByText('checkout.status.errorFailed.title')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'button.tryAgain' }))
    expect(refetchMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('offers a fresh deposit when there is no orderId to poll (refetch would be a no-op)', () => {
    searchState = {}
    renderWithI18n(<TransferDepositPage />)

    expect(screen.getByText('checkout.status.errorFailed.title')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'button.tryAgain' }))
    expect(refetchMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/enter-amount',
      replace: true,
    })
  })

  it('reaches contact support from the error screen', () => {
    fundingOrderState.isError = true
    renderWithI18n(<TransferDepositPage />)
    fireEvent.click(
      screen.getByRole('button', { name: 'button.contactSupport' })
    )
    expect(contactSupportMock).toHaveBeenCalledTimes(1)
  })

  it('titles the error screen as checkout, not "Deposit address"', () => {
    fundingOrderState.isError = true
    renderWithI18n(<TransferDepositPage />)
    expect(useHeaderMock).toHaveBeenLastCalledWith('header.checkout')
  })

  it('keeps the deposit screen when a poll fails after the order loaded', () => {
    fundingOrderState = {
      order: buildOrder(),
      phase: 'pending',
      isError: true,
      refetch: refetchMock,
    }
    renderWithI18n(<TransferDepositPage />)

    expect(screen.getByTestId('qr')).toBeTruthy()
    expect(screen.queryByText('checkout.status.errorFailed.title')).toBeNull()
  })

  it('still spins while the first poll is genuinely in flight', () => {
    const { container } = renderWithI18n(<TransferDepositPage />)
    expect(screen.queryByText('checkout.status.errorFailed.title')).toBeNull()
    expect(container.querySelector('.MuiCircularProgress-root')).toBeTruthy()
  })
})
