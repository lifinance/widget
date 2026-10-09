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
  receiverRequired: false,
  spendable: undefined,
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

  // Reported in review: with no reported figure and no stated bar, the number is
  // the invented one-dollar floor, so the card must not call it an observed
  // minimum. USDC at $1 puts that floor above the 0.2 sent here.
  it('advises rather than reports when the figure is invented', () => {
    const card = buildRouteIssueCard(issue('amountTooLow', 200_000n), deps())
    expect(card.action).toBeDefined()
    expect(card.description).toBe(
      'info.routeIssue.amountTooLow.descriptionEstimated'
    )
  })

  // Reported in review: a bar under the one-dollar floor is raised to it, and
  // quoting the raised figure claimed the tool asked for $1 when it asked for
  // less. That case now advises instead of quoting anything.
  it('never quotes a bar the tool did not state', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { minUsd: 0.5 }),
      deps()
    )
    expect(card.description).toBe(
      'info.routeIssue.amountTooLow.descriptionEstimated'
    )
  })

  // Reported in review: gating the quote must not also change which amount is
  // suggested. A tool asking 0.5 is reachable at the 1 floor, so the gentler
  // figure still wins over another tool's 5 — the card just does not name it.
  it('still suggests the gentler amount when the bar is below the floor', () => {
    const applyAmount = vi.fn()
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, {
        requiredFromAmount: 5_000_000n,
        minUsd: 0.5,
      }),
      deps({ applyAmount })
    )
    card.action?.run()
    // The one-dollar floor, moved 2% clear of the bar and rounded up.
    expect(applyAmount).toHaveBeenCalledWith('1.1')
    expect(card.description).toBe(
      'info.routeIssue.amountTooLow.descriptionEstimated'
    )
  })

  it('quotes a bar at or above the floor', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { minUsd: 2 }),
      deps()
    )
    expect(card.description).toBe('info.routeIssue.amountTooLow.descriptionUsd')
  })

  // Reported in review: the gasless rule scales the user's own amount by a USD
  // ratio, so that figure is the widget's arithmetic, not a stated minimum.
  it('advises rather than reports a scaled requirement', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, {
        requiredFromAmount: 2_000_000n,
        estimated: true,
      }),
      deps()
    )
    expect(card.description).toBe(
      'info.routeIssue.amountTooLow.descriptionEstimated'
    )
  })

  // A figure a tool actually stated is reported as observed.
  it('reports a minimum a tool stated', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 5_000_000n }),
      deps()
    )
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

  // Reported in review: the tool named a dollar ceiling, so the token figure is
  // a price conversion. The card quotes what was actually said.
  it('quotes a dollar ceiling the tool stated', () => {
    const card = buildRouteIssueCard(
      issue('amountTooHigh', 100_000_000n, { maxUsd: 40 }),
      deps()
    )
    expect(card.description).toBe(
      'info.routeIssue.amountTooHigh.descriptionUsd'
    )
  })

  // A token figure a tool named needs no conversion, so it is reported plainly.
  it('reports a token maximum a tool stated', () => {
    const card = buildRouteIssueCard(
      issue('amountTooHigh', 100_000_000n, {
        requiredFromAmount: 50_000_000n,
        direction: 'lower',
      }),
      deps()
    )
    expect(card.description).toBe('info.routeIssue.amountTooHigh.description')
  })

  // Reported in review: one tool capping at 50 tokens and another at $100 both
  // fold into one issue. Clearing either cap is enough, so the card must aim
  // for the higher one rather than advise less than any tool asked for.
  it('prefers a higher dollar ceiling over a lower token one', () => {
    const applyAmount = vi.fn()
    const card = buildRouteIssueCard(
      issue('amountTooHigh', 200_000_000n, {
        requiredFromAmount: 50_000_000n,
        direction: 'lower',
        maxUsd: 100,
      }),
      deps({ applyAmount })
    )
    card.action?.run()
    // The $100 ceiling, moved 2% under the bar.
    expect(applyAmount).toHaveBeenCalledWith('98')
    expect(card.description).toBe(
      'info.routeIssue.amountTooHigh.descriptionUsd'
    )
  })

  // Reported in review: a dollar cap converts at the widget's own price and can
  // land at or above what the user sent. Taking it then left no suggestion at
  // all, where the reported cap still worked.
  it('ignores a converted ceiling that would not move the amount', () => {
    const applyAmount = vi.fn()
    const card = buildRouteIssueCard(
      issue('amountTooHigh', 100_000_000n, {
        requiredFromAmount: 50_000_000n,
        direction: 'lower',
        maxUsd: 500,
      }),
      deps({ applyAmount })
    )
    card.action?.run()
    expect(applyAmount).toHaveBeenCalledWith('49')
    expect(card.description).toBe('info.routeIssue.amountTooHigh.description')
  })

  // Reported in review: raising past the balance only swaps "no routes" for
  // "insufficient funds", so the figure stays and the button goes.
  it('keeps the button away when the wallet cannot fund the suggestion', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps({ spendable: 400_000n })
    )
    expect(card.action).toBeUndefined()
    expect(card.description).toBe('info.routeIssue.amountTooLow.description')
  })

  it('offers the button when the wallet can fund it', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps({ spendable: 9_000_000n })
    )
    expect(card.action).toBeDefined()
  })

  // No wallet, or balances still loading: nothing says the wallet cannot fund it.
  it('still offers the button when the balance is unknown', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps({ spendable: undefined })
    )
    expect(card.action).toBeDefined()
  })

  // Reported in QA: an empty wallet kept the button that a wallet holding a
  // little less than the suggestion lost. Zero is a known balance, not unknown.
  it('keeps the button away from an empty wallet', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps({ spendable: 0n })
    )
    expect(card.action).toBeUndefined()
    expect(card.description).toBe('info.routeIssue.amountTooLow.description')
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

  // Reported in review: with requiredUI toAddress, or a contract wallet on a
  // cross-chain pair, clearing the receiver destroys an address the widget
  // needs — so the next quote that does find a route cannot be executed.
  it('does not offer to clear a receiver the widget requires', () => {
    const card = buildRouteIssueCard(
      issue('recipientNotSupported', 5_000_000n),
      deps({
        toAddress: '0xOTHER',
        sameEcosystem: true,
        receiverRequired: true,
      })
    )
    expect(card.action).toBeUndefined()
  })

  it('leaves a pair it cannot fix without an action', () => {
    const card = buildRouteIssueCard(
      issue('pairNotSupported', 5_000_000n),
      deps()
    )
    expect(card.action).toBeUndefined()
  })
})

describe('a card the user cannot act on', () => {
  // The button already withdraws; the sentence must not ask for the change
  // either, because the app has locked it.
  it.each(['amountTooLow', 'amountTooHigh'] as const)(
    'says the app set a locked %s',
    (bucket) => {
      const card = buildRouteIssueCard(
        issue(bucket, 5_000_000n, { requiredFromAmount: 2_000_000n }),
        deps({ amountLocked: true })
      )
      expect(card.description).toBe(
        `info.routeIssue.${bucket}.descriptionLocked`
      )
      expect(card.action).toBeUndefined()
    }
  )

  it.each([
    ['a hidden receiver', { receiverHidden: true }],
    ['a required receiver', { receiverRequired: true }],
    ['another ecosystem', { sameEcosystem: false }],
  ] as const)('asks for no address change with %s', (_label, override) => {
    const card = buildRouteIssueCard(
      issue('recipientNotSupported', 1n),
      deps({ toAddress: '0xreceiver', ...override })
    )
    expect(card.description).toBe(
      'info.routeIssue.recipientNotSupported.descriptionNoAction'
    )
    expect(card.action).toBeUndefined()
  })

  it('keeps the address advice where clearing it helps', () => {
    const card = buildRouteIssueCard(
      issue('recipientNotSupported', 1n),
      deps({ toAddress: '0xreceiver' })
    )
    expect(card.description).toBe(
      'info.routeIssue.recipientNotSupported.description'
    )
    expect(card.action?.label).toBe(
      'info.routeIssue.recipientNotSupported.action'
    )
  })

  // In limit mode the slippage row is hidden, so a value set from the card
  // could be neither seen nor undone there.
  it.each([
    ['slippageTooTight', 0.02],
    ['slippageTooLoose', 0.005],
  ] as const)(
    'offers no slippage change for %s when it is hidden',
    (bucket, required) => {
      const card = buildRouteIssueCard(
        issue(bucket, 1n, { requiredSlippage: required }),
        deps({ slippage: '1', slippageHidden: true })
      )
      expect(card.description).toBe(
        `info.routeIssue.${bucket}.descriptionHidden`
      )
      expect(card.action).toBeUndefined()
    }
  )

  it('says why the figure has no button when the wallet cannot send it', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps({ spendable: 1_000_000n })
    )
    expect(card.action).toBeUndefined()
    expect(card.note).toBe('info.routeIssue.unaffordable')
  })
})

describe('copy for the exact cause', () => {
  it('names gas costs rather than a busy provider', () => {
    const card = buildRouteIssueCard(
      { bucket: 'temporary', ruleId: 'gasCostsExceedLimit', fromAmount: 1n },
      deps()
    )
    expect(card.description).toBe('info.routeIssue.temporary.descriptionGas')
  })

  it.each([
    ['stellarUnfunded', 'descriptionStellarUnfunded'],
    ['stellarTrustline', 'descriptionStellarTrustline'],
    ['stellarReserve', 'descriptionStellarReserve'],
    ['lighterAccount', 'descriptionLighterAccount'],
    ['seiLink', 'descriptionSeiLink'],
    ['solAccountRent', 'descriptionSolAccountRent'],
    ['somethingNew', 'description'],
  ])('names the step for %s', (ruleId, key) => {
    const card = buildRouteIssueCard(
      { bucket: 'destinationAccountNotReady', ruleId, fromAmount: 1n },
      deps()
    )
    expect(card.description).toBe(
      `info.routeIssue.destinationAccountNotReady.${key}`
    )
  })
})

describe('buttons', () => {
  // "Apply suggestion" named no object, and the slippage one replaces Auto in
  // the saved settings, so each label says what it sets.
  it('names the amount it uses', () => {
    const card = buildRouteIssueCard(
      issue('amountTooLow', 200_000n, { requiredFromAmount: 2_000_000n }),
      deps()
    )
    expect(card.action?.label).toBe('info.routeIssue.useAmount')
  })

  it('names the slippage it sets', () => {
    const card = buildRouteIssueCard(
      issue('slippageTooTight', 1n, { requiredSlippage: 0.008 }),
      deps({ slippage: '0.5' })
    )
    expect(card.action?.label).toBe('info.routeIssue.setSlippage')
  })

  // A second press while the first quote runs changes nothing, so the button
  // says it is already checking.
  it('shows a retry already under way', () => {
    const card = buildRouteIssueCard(
      issue('temporary', 1n),
      deps({ isFetching: true })
    )
    expect(card.action?.disabled).toBe(true)
    expect(card.action?.label).toBe('info.routeIssue.temporary.busy')
  })

  it('offers a retry when nothing is running', () => {
    const card = buildRouteIssueCard(issue('temporary', 1n), deps())
    expect(card.action?.disabled).toBeFalsy()
    expect(card.action?.label).toBe('info.routeIssue.temporary.action')
  })
})
