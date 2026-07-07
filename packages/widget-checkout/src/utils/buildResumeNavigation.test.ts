// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import {
  buildPendingRecord,
  type PendingRecord,
} from '../stores/usePendingCheckoutStore.js'
import { buildResumeNavigation } from './buildResumeNavigation.js'

const STATUS_PATH = '/transaction-execution/transaction-status'

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

describe('buildResumeNavigation', () => {
  it('wallet record → status page with depositAddress, fromChain, hash, resumed', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'wallet',
        transactionHash: '0xabc',
        depositAddress: '0xdep',
        fromChain: 1,
      })
    )
    expect(nav.to).toBe(STATUS_PATH)
    expect(nav.search).toEqual({
      depositAddress: '0xdep',
      fromChain: 1,
      transactionHash: '0xabc',
      resumed: '1',
    })
  })

  it('wallet record without depositAddress → "/"', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'wallet',
        transactionHash: '0xabc',
        fromChain: 1,
      })
    )
    expect(nav.to).toBe('/')
  })

  it('transfer record (stale quote) → status page', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep',
        fromChain: 137,
      })
    )
    expect(nav.to).toBe(STATUS_PATH)
    expect(nav.search.depositAddress).toBe('0xdep')
    expect(nav.search.fromChain).toBe(137)
  })

  it('cash record → status page', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'cash',
        provider: 'transak',
        depositAddress: '0xdep2',
        fromChain: 8453,
      })
    )
    expect(nav.to).toBe(STATUS_PATH)
    expect(nav.search.depositAddress).toBe('0xdep2')
    expect(nav.search.fromChain).toBe(8453)
  })

  it('falls back to "/" when neither hash nor depositAddress is present', () => {
    const nav = buildResumeNavigation(fakeRecord({ fundingSource: 'wallet' }))
    expect(nav.to).toBe('/')
  })

  it('transfer + fresh frozen quote → /transfer-deposit', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep',
        fromChain: 137,
        frozenQuote: {
          id: 'r1',
          route: {} as never,
          expiresAt: Date.now() + 60_000,
        },
      }),
      { frozenQuoteFresh: true }
    )
    expect(nav.to).toBe('/transfer-deposit')
    expect(nav.search).toEqual({ resumed: '1' })
  })

  it('transfer + stale frozen quote → status page fallback', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'transfer',
        depositAddress: '0xdep',
        fromChain: 137,
        frozenQuote: {
          id: 'r1',
          route: {} as never,
          expiresAt: Date.now() - 1,
        },
      }),
      { frozenQuoteFresh: false }
    )
    expect(nav.to).toBe(STATUS_PATH)
    expect(nav.search.depositAddress).toBe('0xdep')
  })

  it('cash + frozenQuoteFresh is ignored (cash never uses transfer-deposit)', () => {
    const nav = buildResumeNavigation(
      fakeRecord({
        fundingSource: 'cash',
        provider: 'transak',
        depositAddress: '0xdep2',
        fromChain: 8453,
        frozenQuote: {
          id: 'r1',
          route: {} as never,
          expiresAt: Date.now() + 60_000,
        },
      }),
      { frozenQuoteFresh: true }
    )
    expect(nav.to).toBe(STATUS_PATH)
  })
})
