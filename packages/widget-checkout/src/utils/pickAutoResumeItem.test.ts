import { describe, expect, it } from 'vitest'
import type { ActivityItem } from '../hooks/useCheckoutActivity.js'
import { pickAutoResumeItem } from './pickAutoResumeItem.js'

function item(
  orderId: string,
  phase: ActivityItem['phase'],
  fundingSource: ActivityItem['fundingSource'] = 'transfer'
): ActivityItem {
  return { orderId, fundingSource, order: undefined, phase }
}

describe('pickAutoResumeItem', () => {
  it('returns the lone pending item', () => {
    const target = item('a', 'pending')
    expect(pickAutoResumeItem([target])).toBe(target)
  })

  it('returns the lone item whose phase has not resolved yet', () => {
    const target = item('a', undefined)
    expect(pickAutoResumeItem([target])).toBe(target)
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
})
