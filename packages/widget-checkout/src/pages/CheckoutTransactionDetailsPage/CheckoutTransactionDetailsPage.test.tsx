// @vitest-environment happy-dom

import type { Route } from '@lifi/sdk'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../test/renderWithI18n.js'

const builtRoute: { route: Route | undefined } = { route: undefined }
vi.mock('@lifi/widget/shared', () => ({
  buildRouteFromTxHistory: () =>
    builtRoute.route ? { route: builtRoute.route } : undefined,
  Card: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  DateLabelContainer: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  DateLabelText: ({ children }: { children?: ReactNode }) => (
    <span data-testid="date-label">{children}</span>
  ),
  getSourceTxHash: () => undefined,
  navigationRoutes: { home: '/' },
  PageContainer: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  RouteTokens: () => <div data-testid="route-tokens" />,
  StepActionsList: () => <div data-testid="step-actions" />,
  useExplorer: () => ({ getTransactionLink: () => undefined }),
  useHeader: () => {},
  useTools: () => ({ tools: {} }),
}))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: { transactionHash: '0xhash' } }),
  useNavigate: () => vi.fn(),
}))

const statusState: { status: unknown } = { status: undefined }
vi.mock('../../hooks/useCheckoutTransactionStatus.js', () => ({
  useCheckoutTransactionStatus: () => ({
    status: statusState.status,
    phase: undefined,
    isLoading: false,
    notFound: statusState.status === undefined,
  }),
}))

vi.mock('../../hooks/useCheckoutToAddress.js', () => ({
  useCheckoutToAddress: () => null,
}))

vi.mock('./CheckoutTransactionDetailsSkeleton.js', () => ({
  CheckoutTransactionDetailsSkeleton: () => <div data-testid="skeleton" />,
}))

vi.mock('./CheckoutTransferIdCard.js', () => ({
  CheckoutTransferIdCard: ({ transferId }: { transferId: string }) => (
    <div data-testid="transfer-id">{transferId}</div>
  ),
}))

import { CheckoutTransactionDetailsPage } from './CheckoutTransactionDetailsPage.js'

describe('CheckoutTransactionDetailsPage', () => {
  it('renders details once the status-built route is available', () => {
    statusState.status = { status: 'DONE' }
    builtRoute.route = {
      id: 'route-1',
      steps: [{}],
      toAddress: '0xto',
    } as unknown as Route
    renderWithI18n(<CheckoutTransactionDetailsPage />)
    expect(screen.queryByTestId('skeleton')).toBeNull()
    expect(screen.queryByTestId('route-tokens')).not.toBeNull()
    expect(screen.queryByTestId('step-actions')).not.toBeNull()
    // No execution timestamp on the mocked route — the started-at block is omitted.
    expect(screen.queryByTestId('date-label')).toBeNull()
    // The URL hash is the support id until a source tx hash resolves.
    expect(screen.queryByTestId('transfer-id')?.textContent).toBe('0xhash')
  })

  it('keeps the skeleton while there is no status-built route yet', () => {
    statusState.status = undefined
    builtRoute.route = undefined
    renderWithI18n(<CheckoutTransactionDetailsPage />)
    expect(screen.queryByTestId('skeleton')).not.toBeNull()
    expect(screen.queryByTestId('route-tokens')).toBeNull()
  })
})
