import type { Token } from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { describe, expect, it, vi } from 'vitest'
import type { RouteIssueCardDeps } from './card.js'
import { buildRouteIssueCard } from './card.js'
import type { RouteIssue, RouteIssueEvidence } from './types.js'

// The key is what identifies the sentence; the copy itself is asserted by the
// translations, not here.
const t = ((key: string) => key) as unknown as TFunction

const usdc = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  chainId: 42161,
  symbol: 'USDC',
  decimals: 6,
  priceUSD: '1',
} as Token

const deps = (
  overrides: Partial<RouteIssueCardDeps> = {}
): RouteIssueCardDeps => ({
  t,
  token: usdc,
  slippage: undefined,
  amountLocked: false,
  receiverHidden: false,
  toAddress: undefined,
  sameEcosystem: true,
  applyAmount: vi.fn(),
  applySlippage: vi.fn(),
  clearReceiver: vi.fn(),
  retry: vi.fn(),
  ...overrides,
})

const issue = (
  bucket: RouteIssue['bucket'],
  fromAmount: bigint,
  evidence?: RouteIssueEvidence
): RouteIssue => ({ bucket, ruleId: 'test', fromAmount, evidence })

describe('amount suggestions', () => {
  it('raises to the reported minimum', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps()
    )
    expect(card.action).toBeDefined()
    card.action?.run()
    expect(card.description).toBe('info.routeIssue.amountTooLow.description')
  })

  // The card must never offer a figure that leaves the amount where it is.
  it('offers nothing when the suggestion would not move the amount', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 5_000_000n, undefined),
      deps()
    )
    expect(card.action).toBeUndefined()
    expect(card.description).toBe(
      'info.routeIssue.amountTooLow.descriptionNoAmount'
    )
  })

  // Measured against the live API: a maximum the backend named was accepted,
  // while halving what the user sent was refused again — and the refusal
  // carried no figure either, so the card just halved once more.
  it('offers nothing when no maximum was reported', () => {
    const card = buildRouteIssueCard(
      issue('amountTooHigh', 100_000_000_000_000n, undefined),
      deps()
    )
    expect(card.action).toBeUndefined()
    expect(card.description).toBe(
      'info.routeIssue.amountTooHigh.descriptionNoAmount'
    )
  })

  it('keeps the button away while the amount field is locked', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps({ amountLocked: true })
    )
    expect(card.action).toBeUndefined()
  })

  it('lowers a too-high amount', () => {
    const card = buildRouteIssueCard(
      issue('amountTooHigh', 100_000_000n, {
        requiredFromAmount: 50_000_000n,
        direction: 'lower',
      }),
      deps()
    )
    expect(card.action).toBeDefined()
  })

  // A contract-call quote has no send amount, so any figure would be invented.
  it('says nothing about an amount it does not have', () => {
    const card = buildRouteIssueCard(issue('amountTooLow', 0n), deps())
    expect(card.action).toBeUndefined()
    expect(card.description).toBe(
      'info.routeIssue.amountTooLow.descriptionNoAmount'
    )
  })
})

describe('slippage suggestions', () => {
  it('offers the cap when the applied slippage sits above it', () => {
    const applySlippage = vi.fn()
    const card = buildRouteIssueCard(
      issue('slippageTooLoose', 5_000_000n, { requiredSlippage: 0.03 }),
      deps({ slippage: '5', applySlippage })
    )
    card.action?.run()
    expect(applySlippage).toHaveBeenCalledWith('3')
  })

  // Applying it must settle: the same card may still render, but the button
  // that would write the same value again must not.
  it('withdraws the button once the cap is applied', () => {
    const card = buildRouteIssueCard(
      issue('slippageTooLoose', 5_000_000n, { requiredSlippage: 0.03 }),
      deps({ slippage: '3' })
    )
    expect(card.action).toBeUndefined()
  })

  // On a resolved auto value there is no setting of the user's own to lower.
  it('offers nothing to lower when no slippage is set', () => {
    const card = buildRouteIssueCard(
      issue('slippageTooLoose', 5_000_000n, { requiredSlippage: 0.03 }),
      deps({ slippage: undefined })
    )
    expect(card.action).toBeUndefined()
  })

  it('never offers a slippage above what the widget recommends', () => {
    const card = buildRouteIssueCard(
      issue('slippageTooTight', 5_000_000n, { requiredSlippage: 0.9 }),
      deps({ slippage: '0.5' })
    )
    expect(card.action).toBeUndefined()
  })
})

describe('other buckets', () => {
  it('always offers a retry for a busy tool', () => {
    const retry = vi.fn()
    const card = buildRouteIssueCard(
      issue('temporary', 5_000_000n),
      deps({ retry })
    )
    card.action?.run()
    expect(retry).toHaveBeenCalled()
  })

  // Clearing the receiver only leaves a valid request within one ecosystem.
  it('does not offer to clear a receiver across ecosystems', () => {
    const card = buildRouteIssueCard(
      issue('recipientNotSupported', 5_000_000n),
      deps({ toAddress: '0xOTHER', sameEcosystem: false })
    )
    expect(card.action).toBeUndefined()
  })

  it('offers to clear a receiver within one ecosystem', () => {
    const clearReceiver = vi.fn()
    const card = buildRouteIssueCard(
      issue('recipientNotSupported', 5_000_000n),
      deps({ toAddress: '0xOTHER', sameEcosystem: true, clearReceiver })
    )
    card.action?.run()
    expect(clearReceiver).toHaveBeenCalled()
  })

  it('leaves a pair it cannot fix without an action', () => {
    const card = buildRouteIssueCard(
      issue('pairNotSupported', 5_000_000n),
      deps()
    )
    expect(card.action).toBeUndefined()
  })
})
