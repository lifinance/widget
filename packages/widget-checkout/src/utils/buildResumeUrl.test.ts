// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import {
  buildPendingRecord,
  type PendingRecord,
} from '../stores/usePendingCheckoutStore.js'
import { buildResumeUrl } from './buildResumeUrl.js'

function fakeRecord(overrides: Partial<PendingRecord>): PendingRecord {
  return {
    ...buildPendingRecord({
      fundingSource: 'wallet',
      status: 'pending',
      ...overrides,
    }),
    ...overrides,
  }
}

describe('buildResumeUrl', () => {
  it('wallet record → depositAddress + fromChain + resumed=1', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'wallet',
        transactionHash: '0xabc',
        depositAddress: '0xdep',
        fromChain: 1,
      })
    )
    expect(url).toContain('depositAddress=0xdep')
    expect(url).toContain('fromChain=1')
    expect(url).toContain('resumed=1')
    // Display/details-only on the status page — never polled.
    expect(url).toContain('transactionHash=0xabc')
  })

  it('wallet record without depositAddress → "/"', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'wallet',
        transactionHash: '0xabc',
        fromChain: 1,
      })
    )
    expect(url).toBe('/')
  })

  it('transfer record → depositAddress + fromChain + resumed=1', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep',
        fromChain: 137,
      })
    )
    expect(url).toContain('depositAddress=0xdep')
    expect(url).toContain('fromChain=137')
    expect(url).toContain('resumed=1')
  })

  it('cash record → depositAddress + fromChain + resumed=1', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'cash',
        provider: 'transak',
        depositAddress: '0xdep2',
        fromChain: 8453,
      })
    )
    expect(url).toContain('depositAddress=0xdep2')
    expect(url).toContain('fromChain=8453')
    expect(url).toContain('resumed=1')
  })

  it('falls back to "/" when neither hash nor depositAddress is present', () => {
    const url = buildResumeUrl(fakeRecord({ fundingSource: 'wallet' }))
    expect(url).toBe('/')
  })

  it('transfer + fresh frozen quote → /transfer-deposit?resumed=1', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep',
        fromChain: 137,
        frozenQuote: {
          id: 'r1',
          route: {} as any,
          expiresAt: Date.now() + 60_000,
        },
      }),
      { frozenQuoteFresh: true }
    )
    expect(url).toBe('/transfer-deposit?resumed=1')
  })

  it('transfer + stale frozen quote → status page fallback', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep',
        fromChain: 137,
        frozenQuote: { id: 'r1', route: {} as any, expiresAt: Date.now() - 1 },
      }),
      { frozenQuoteFresh: false }
    )
    expect(url).toContain('depositAddress=0xdep')
    expect(url).toContain('fromChain=137')
    expect(url).toContain('transaction-status')
  })

  it('cash + frozenQuoteFresh option is ignored (cash never uses transfer-deposit)', () => {
    const url = buildResumeUrl(
      fakeRecord({
        fundingSource: 'cash',
        provider: 'transak',
        depositAddress: '0xdep2',
        fromChain: 8453,
        frozenQuote: {
          id: 'r1',
          route: {} as any,
          expiresAt: Date.now() + 60_000,
        },
      }),
      { frozenQuoteFresh: true }
    )
    expect(url).not.toContain('transfer-deposit')
    expect(url).toContain('transaction-status')
  })
})
