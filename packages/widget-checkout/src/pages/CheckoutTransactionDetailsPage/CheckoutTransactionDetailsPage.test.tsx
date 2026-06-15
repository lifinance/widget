// @vitest-environment happy-dom

import type { Route } from '@lifi/sdk'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../test/renderWithI18n.js'

vi.mock('@lifi/widget/shared', () => ({
  buildRouteFromTxHistory: () => undefined,
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
  useTools: () => ({ tools: undefined }),
}))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: { transactionHash: '0xhash' } }),
  useNavigate: () => vi.fn(),
}))

// Status stays NOT_FOUND — the hook surfaces it as "no status yet".
vi.mock('../../hooks/useCheckoutTransactionStatus.js', () => ({
  useCheckoutTransactionStatus: () => ({
    status: undefined,
    phase: undefined,
    isLoading: false,
    notFound: true,
  }),
}))

const sources: { frozenRoute: Route | undefined } = { frozenRoute: undefined }
vi.mock('../../hooks/useCheckoutStatusSources.js', () => ({
  useCheckoutStatusSources: () => ({
    frozenRoute: sources.frozenRoute,
    recipientAddress: null,
  }),
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

describe('CheckoutTransactionDetailsPage — NOT_FOUND fallback', () => {
  it('renders details from the frozen route when status is NOT_FOUND', () => {
    sources.frozenRoute = {
      id: 'route-1',
      steps: [{}],
      toAddress: '0xto',
    } as unknown as Route
    renderWithI18n(<CheckoutTransactionDetailsPage />)
    expect(screen.queryByTestId('skeleton')).toBeNull()
    expect(screen.queryByTestId('route-tokens')).not.toBeNull()
    expect(screen.queryByTestId('step-actions')).not.toBeNull()
    // No execution yet — the started-at block is omitted (no epoch-0 date).
    expect(screen.queryByTestId('date-label')).toBeNull()
    // The URL hash is the support id until the live status lands.
    expect(screen.queryByTestId('transfer-id')?.textContent).toBe('0xhash')
  })

  it('keeps the skeleton when there is no status and no frozen route', () => {
    sources.frozenRoute = undefined
    renderWithI18n(<CheckoutTransactionDetailsPage />)
    expect(screen.queryByTestId('skeleton')).not.toBeNull()
    expect(screen.queryByTestId('route-tokens')).toBeNull()
  })
})
