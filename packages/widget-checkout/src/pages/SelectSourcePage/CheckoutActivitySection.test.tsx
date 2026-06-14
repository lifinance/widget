// @vitest-environment happy-dom

import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  PendingActivityItem,
  PendingActivityState,
} from '../../hooks/useCheckoutPendingRecords.js'
import { renderWithI18n } from '../../test/renderWithI18n.js'

let mockItems: PendingActivityItem[] = []
const resumeSpy = vi.fn()
const clearSpy = vi.fn()

vi.mock('../../hooks/useCheckoutPendingRecords.js', () => ({
  useCheckoutPendingRecords: () => mockItems,
}))
vi.mock('../../hooks/useResumeCheckout.js', () => ({
  useResumeCheckout: () => resumeSpy,
}))
vi.mock('../../stores/usePendingCheckoutStore.js', () => ({
  usePendingCheckoutStore: (selector: (s: unknown) => unknown) =>
    selector({ clearForKey: clearSpy }),
}))
vi.mock('@lifi/widget/shared', () => ({
  formatTokenAmount: () => '100',
  useChain: () => ({ chain: { name: 'Arbitrum' } }),
}))

import { CheckoutActivitySection } from './CheckoutActivitySection.js'

function item(
  key: string,
  state: PendingActivityState,
  depositDetected = false,
  symbol = 'USDC'
): PendingActivityItem {
  return {
    key,
    state,
    depositDetected,
    record: {
      fromAmount: '100000000',
      tokenDecimals: 6,
      tokenSymbol: symbol,
      fromChain: 42161,
    } as never,
  }
}

describe('CheckoutActivitySection', () => {
  beforeEach(() => {
    mockItems = []
    resumeSpy.mockReset()
    clearSpy.mockReset()
  })

  it('renders nothing when there are no items', () => {
    const { container } = renderWithI18n(<CheckoutActivitySection />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a compact badge for a single deposit in progress', () => {
    mockItems = [item('int:a', 'deposit')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Deposit in progress')).toBeTruthy()
    expect(screen.queryByText('Activity')).toBeNull()
  })

  it('renders "Refund in progress" for a single refunding deposit', () => {
    mockItems = [item('int:a', 'refund')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Refund in progress')).toBeTruthy()
  })

  it('renders the failed badge for a single failed deposit', () => {
    mockItems = [item('int:a', 'failed')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Deposit failed. Please resolve')).toBeTruthy()
  })

  it('renders a labelled card list and resumes with the detected flag on tap', () => {
    mockItems = [item('int:a', 'deposit', true), item('int:b', 'failed')]
    renderWithI18n(<CheckoutActivitySection />)
    expect(screen.getByText('Activity')).toBeTruthy()
    const titles = screen.getAllByText('100 USDC on Arbitrum')
    expect(titles).toHaveLength(2)
    fireEvent.click(titles[0] as HTMLElement)
    expect(resumeSpy).toHaveBeenCalledWith(mockItems[0]?.record, true)
  })

  it('dismisses only the failed card without resuming', () => {
    mockItems = [item('int:a', 'deposit'), item('int:b', 'failed')]
    renderWithI18n(<CheckoutActivitySection />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(clearSpy).toHaveBeenCalledWith('int:b')
    expect(resumeSpy).not.toHaveBeenCalled()
  })
})
