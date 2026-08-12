import { describe, expect, it } from 'vitest'
import type { ActivityItem } from '../hooks/useCheckoutActivity.js'
import { pickAutoResumeItem } from './pickAutoResumeItem.js'

function item(
  orderId: string,
  phase: ActivityItem['phase'],
  fundingSource: ActivityItem['fundingSource'] = 'transfer'
): ActivityItem {
  return {
    orderId,
    fundingSource,
    order: undefined,
    phase,
    createdAt: Date.now(),
  }
}

function awaitingItem(
  orderId: string,
  substatus: string,
  fundingSource: ActivityItem['fundingSource'] = 'transfer'
): ActivityItem {
  return {
    ...item(orderId, 'pending', fundingSource),
    order: { status: 'PENDING', substatus } as never,
  }
}

describe('pickAutoResumeItem', () => {
  it('returns the lone pending item', () => {
    const target = item('a', 'pending')
    expect(pickAutoResumeItem([target])).toBe(target)
  })

  it('returns null for a lone item whose phase has not resolved yet', () => {
    expect(pickAutoResumeItem([item('a', undefined)])).toBeNull()
  })

  it('returns null when the only item is terminal (done)', () => {
    expect(pickAutoResumeItem([item('a', 'done')])).toBeNull()
  })

  it('returns null when the only item is terminal (failed)', () => {
    expect(pickAutoResumeItem([item('a', 'failed')])).toBeNull()
  })

  it('returns null when there are no items', () => {
    expect(pickAutoResumeItem([])).toBeNull()
  })

  it('returns null when multiple items are pending', () => {
    const a = item('a', 'pending')
    const b = item('b', 'pending')
    expect(pickAutoResumeItem([a, b])).toBeNull()
  })

  it('ignores terminal items when picking the single pending one', () => {
    const live = item('a', 'pending')
    const done = item('b', 'done')
    expect(pickAutoResumeItem([live, done])).toBe(live)
  })

  it('returns null while a sibling item is still loading, even with a lone pending item', () => {
    const pending = item('a', 'pending')
    const loading = item('b', undefined)
    expect(pickAutoResumeItem([pending, loading])).toBeNull()
  })

  it('resumes the lone pending item once the sibling finishes loading', () => {
    const pending = item('a', 'pending')
    const doneNow = item('b', 'done')
    expect(pickAutoResumeItem([pending, doneNow])).toBe(pending)
  })

  // An awaiting-user-action order resumes onto a progress screen with no
  // actions, and transaction-status is not in backButtonRoutes — a dead end.
  // It stays tappable in the activity list instead.
  it('returns null for a lone unpaid cash order (ONRAMP_AWAITING_PAYMENT)', () => {
    expect(
      pickAutoResumeItem([awaitingItem('a', 'ONRAMP_AWAITING_PAYMENT', 'cash')])
    ).toBeNull()
  })

  it('returns null for a lone unsent crypto deposit (INTENT_AWAITING_FUNDS)', () => {
    expect(
      pickAutoResumeItem([awaitingItem('a', 'INTENT_AWAITING_FUNDS')])
    ).toBeNull()
  })

  it('still resumes a lone genuinely in-flight pending order', () => {
    const live = awaitingItem('a', 'WAIT_DESTINATION_TRANSACTION')
    expect(pickAutoResumeItem([live])).toBe(live)
  })

  it('picks the in-flight order over an awaiting-action sibling', () => {
    const live = awaitingItem('a', 'WAIT_DESTINATION_TRANSACTION')
    const awaiting = awaitingItem('b', 'INTENT_AWAITING_FUNDS')
    expect(pickAutoResumeItem([live, awaiting])).toBe(live)
  })
})
