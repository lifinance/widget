// @vitest-environment happy-dom

import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ActivityItem } from '../../hooks/useCheckoutActivity.js'
import { renderWithI18n } from '../../test/renderWithI18n.js'

let mockItems: ActivityItem[] = []
const resumeSpy = vi.fn()
const acknowledgeSpy = vi.fn()

vi.mock('../../hooks/useCheckoutActivity.js', () => ({
  useCheckoutActivity: () => mockItems,
}))
vi.mock('../../hooks/useResumeCheckout.js', () => ({
  useResumeCheckout: () => resumeSpy,
}))
vi.mock('../../stores/useFundingOrderStore.js', () => ({
  useFundingOrderStore: (selector: (s: unknown) => unknown) =>
    selector({ acknowledge: acknowledgeSpy }),
}))
vi.mock('@lifi/widget/shared', () => ({
  formatTokenAmount: () => '100',
  useChain: () => ({ chain: { name: 'Arbitrum' } }),
}))
vi.mock('@lifi/sdk', () => ({
  convertQuoteToRoute: (quote: { fromAmount: string }) => ({
    fromAmount: quote.fromAmount,
    fromChainId: 42161,
    fromToken: { symbol: 'USDC', decimals: 6 },
  }),
}))

import { CheckoutActivitySection } from './CheckoutActivitySection.js'

function item(
  orderId: string,
  phase: ActivityItem['phase'],
  options: { hasQuote?: boolean; substatus?: string } = {}
): ActivityItem {
  const { hasQuote = true, substatus } = options
  const status =
    phase === 'done' ? 'DONE' : phase === 'failed' ? 'FAILED' : 'PENDING'
  return {
    orderId,
    fundingSource: 'transfer',
    phase,
    createdAt: Date.now(),
    order: {
      orderId,
      partnerOrderId: `p-${orderId}`,
      type: 'SMART_DEPOSIT',
      status,
      substatus,
      destination: { toChainId: 8453, toTokenAddress: '0x1', toAddress: '0x2' },
      quote: hasQuote ? { fromAmount: '100000000' } : undefined,
      createdAt: '',
      updatedAt: '',
    } as never,
  }
}

describe('CheckoutActivitySection', () => {
  beforeEach(() => {
    mockItems = []
    resumeSpy.mockReset()
    acknowledgeSpy.mockReset()
  })

  it('renders nothing when there are no items', () => {
    const { container } = renderWithI18n(<CheckoutActivitySection />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a compact badge for a single deposit in progress', () => {
    mockItems = [item('a', 'pending')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Deposit in progress')).toBeTruthy()
    expect(screen.queryByText('Activity')).toBeNull()
  })

  it('renders "Refund in progress" for a single refunding deposit', () => {
    mockItems = [item('a', 'pending', { substatus: 'REFUND_IN_PROGRESS' })]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Refund in progress')).toBeTruthy()
  })

  it('renders the failed badge for a single failed deposit', () => {
    mockItems = [item('a', 'failed')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Deposit failed. Please resolve')).toBeTruthy()
  })

  it('renders a labelled card list and resumes the tapped item', () => {
    mockItems = [item('a', 'pending'), item('b', 'failed')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Activity')).toBeTruthy()
    const titles = screen.getAllByText('100 USDC on Arbitrum')
    expect(titles).toHaveLength(2)
    fireEvent.click(titles[0] as HTMLElement)
    expect(resumeSpy).toHaveBeenCalledWith(mockItems[0])
  })

  it('falls back to the generic label when the order has no quote', () => {
    mockItems = [
      item('a', 'pending', { hasQuote: false }),
      item('b', 'failed', { hasQuote: false }),
    ]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getAllByText('Deposit')).toHaveLength(2)
  })

  it('dismisses (acknowledges) only the failed card without resuming', () => {
    mockItems = [item('a', 'pending'), item('b', 'failed')]
    renderWithI18n(<CheckoutActivitySection />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(acknowledgeSpy).toHaveBeenCalledWith('b')
    expect(resumeSpy).not.toHaveBeenCalled()
  })
})
