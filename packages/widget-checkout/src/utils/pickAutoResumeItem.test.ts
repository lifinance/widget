import { describe, expect, it } from 'vitest'
import type { PendingActivityItem } from '../hooks/useCheckoutPendingRecords.js'
import type { PendingRecord } from '../stores/usePendingCheckoutStore.js'
import { pickAutoResumeItem } from './pickAutoResumeItem.js'

function item(
  key: string,
  state: PendingActivityItem['state'],
  record: Partial<PendingRecord>
): PendingActivityItem {
  return {
    key,
    state,
    depositDetected: false,
    record: { fundingSource: 'transfer', ...record } as PendingRecord,
  }
}

describe('pickAutoResumeItem', () => {
  it('returns the lone in-progress deposit', () => {
    const target = item('a', 'deposit', {
      depositAddress: '0xdep',
      fromChain: 1,
    })
    expect(pickAutoResumeItem([target])).toBe(target)
  })

  it('resumes a tx-hash record without a deposit address', () => {
    const target = item('a', 'deposit', {
      transactionHash: '0xhash',
      fromChain: 1,
    })
    expect(pickAutoResumeItem([target])).toBe(target)
  })

  it('returns null when the only record is failed', () => {
    const failed = item('a', 'failed', {
      depositAddress: '0xdep',
      fromChain: 1,
    })
    expect(pickAutoResumeItem([failed])).toBeNull()
  })

  it('returns null when there are no records', () => {
    expect(pickAutoResumeItem([])).toBeNull()
  })

  it('returns null when multiple in-progress deposits are present', () => {
    const a = item('a', 'deposit', { depositAddress: '0xa', fromChain: 1 })
    const b = item('b', 'deposit', { depositAddress: '0xb', fromChain: 1 })
    expect(pickAutoResumeItem([a, b])).toBeNull()
  })

  it('ignores failed records when picking the single in-progress one', () => {
    const live = item('a', 'deposit', { depositAddress: '0xa', fromChain: 1 })
    const failed = item('b', 'failed', { depositAddress: '0xb', fromChain: 1 })
    expect(pickAutoResumeItem([live, failed])).toBe(live)
  })

  it('returns null for an in-progress record with no resumable identifier', () => {
    const degenerate = item('a', 'deposit', {})
    expect(pickAutoResumeItem([degenerate])).toBeNull()
  })
})
