import type { StatusResponse, Substatus } from '@lifi/sdk'
import type { OnRampFailureKind } from '@lifi/widget-provider/checkout'
import { describe, expect, it } from 'vitest'
import type { CheckoutFundingSource } from '../../stores/useCheckoutFlowStore.js'
import { resolveStatusVariant } from './statusVariants.js'

function statusOf(status: StatusResponse['status']): StatusResponse {
  return { status } as StatusResponse
}

describe('resolveStatusVariant — preempt branches', () => {
  it('walletDisconnected takes precedence over status/substatus', () => {
    const variant = resolveStatusVariant({
      walletDisconnected: true,
      fundingSource: 'wallet',
      status: statusOf('DONE'),
      substatus: 'COMPLETED',
    })
    expect(variant).toEqual({
      tone: 'error',
      icon: 'error',
      titleKey: 'checkout.status.walletDisconnected.title',
      descriptionKey: 'checkout.status.walletDisconnected.description',
      primaryAction: 'tryAgain',
      secondaryAction: 'contactSupport',
    })
  })

  it('onRampFailureKind takes precedence over status/substatus when no walletDisconnect', () => {
    const variant = resolveStatusVariant({
      onRampFailureKind: 'withdrawal',
      fundingSource: 'cash',
      status: statusOf('DONE'),
      substatus: 'COMPLETED',
    })
    expect(variant.titleKey).toBe('checkout.status.errorWithdrawal.cash.title')
    expect(variant.primaryAction).toBe('tryAgain')
    expect(variant.secondaryAction).toBe('contactSupport')
  })
})

describe('resolveStatusVariant — onRampFailureKind table', () => {
  const cases: Array<{
    kind: OnRampFailureKind
    fundingSource: CheckoutFundingSource | null
    expectedTitleKey: string
    expectedPrimary: string
    expectedSecondary?: string
  }> = [
    {
      kind: 'withdrawal',
      fundingSource: 'cash',
      expectedTitleKey: 'checkout.status.errorWithdrawal.cash.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
    {
      kind: 'withdrawal',
      fundingSource: 'exchange',
      expectedTitleKey: 'checkout.status.errorWithdrawal.exchange.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
    {
      kind: 'withdrawal',
      fundingSource: 'wallet',
      expectedTitleKey: 'checkout.status.errorWithdrawal.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
    {
      kind: 'cancelled',
      fundingSource: 'cash',
      expectedTitleKey: 'checkout.status.errorCancelled.cash.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: undefined,
    },
    {
      kind: 'cancelled',
      fundingSource: 'exchange',
      expectedTitleKey: 'checkout.status.errorCancelled.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: undefined,
    },
    {
      kind: 'unavailable',
      fundingSource: 'cash',
      expectedTitleKey: 'checkout.status.errorUnavailable.cash.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
    {
      kind: 'unavailable',
      fundingSource: 'exchange',
      expectedTitleKey: 'checkout.status.errorUnavailable.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
    {
      kind: 'connection',
      fundingSource: 'exchange',
      expectedTitleKey: 'checkout.status.errorConnection.exchange.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
    {
      kind: 'connection',
      fundingSource: 'cash',
      expectedTitleKey: 'checkout.status.errorConnection.title',
      expectedPrimary: 'tryAgain',
      expectedSecondary: 'contactSupport',
    },
  ]

  for (const c of cases) {
    it(`${c.kind} on fundingSource=${c.fundingSource ?? 'null'} → ${c.expectedTitleKey}`, () => {
      const variant = resolveStatusVariant({
        onRampFailureKind: c.kind,
        fundingSource: c.fundingSource,
      })
      expect(variant.titleKey).toBe(c.expectedTitleKey)
      expect(variant.primaryAction).toBe(c.expectedPrimary)
      expect(variant.secondaryAction).toBe(c.expectedSecondary)
      expect(variant.tone === 'error' || variant.tone === 'warning').toBe(true)
    })
  }
})

describe('resolveStatusVariant — DONE branch', () => {
  it('DONE + COMPLETED → success-completed', () => {
    const variant = resolveStatusVariant({
      status: statusOf('DONE'),
      substatus: 'COMPLETED',
      fundingSource: 'wallet',
    })
    expect(variant).toEqual({
      tone: 'success',
      icon: 'check',
      titleKey: 'checkout.status.successCompleted.title',
      descriptionKey: 'checkout.status.successCompleted.description',
      primaryAction: 'done',
      secondaryAction: 'viewDetails',
    })
  })

  it('DONE + PARTIAL maps to its own success-partial variant', () => {
    const variant = resolveStatusVariant({
      status: statusOf('DONE'),
      substatus: 'PARTIAL' as Substatus,
      fundingSource: 'transfer',
    })
    expect(variant.tone).toBe('success')
    expect(variant.icon).toBe('check')
    expect(variant.titleKey).toBe('checkout.status.successPartial.title')
    // Lead with "view details" so the user can inspect what actually landed
    // (different token / partial amount), with "done" as the dismiss path.
    expect(variant.primaryAction).toBe('viewDetails')
    expect(variant.secondaryAction).toBe('done')
  })

  it('DONE + REFUNDED → success-refund (wallet copy)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('DONE'),
      substatus: 'REFUNDED',
      fundingSource: 'wallet',
    })
    expect(variant.titleKey).toBe('checkout.status.walletSuccessRefund.title')
    expect(variant.primaryAction).toBe('done')
    expect(variant.secondaryAction).toBe('viewDetails')
    expect(variant.icon).toBe('check')
  })

  it('DONE + REFUNDED → success-refund (non-wallet copy)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('DONE'),
      substatus: 'REFUNDED',
      fundingSource: 'exchange',
    })
    expect(variant.titleKey).toBe('checkout.status.successRefund.title')
    expect(variant.primaryAction).toBe('done')
  })
})

describe('resolveStatusVariant — PENDING branch', () => {
  it('PENDING + REFUND_IN_PROGRESS → pending-refund (wallet)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('PENDING'),
      substatus: 'REFUND_IN_PROGRESS',
      fundingSource: 'wallet',
    })
    expect(variant.titleKey).toBe('checkout.status.walletPendingRefund.title')
    expect(variant.tone).toBe('warning')
    expect(variant.icon).toBe('spinner')
    expect(variant.primaryAction).toBe('viewDetails')
  })

  it('PENDING + REFUND_IN_PROGRESS → pending-refund (non-wallet)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('PENDING'),
      substatus: 'REFUND_IN_PROGRESS',
      fundingSource: 'cash',
    })
    expect(variant.titleKey).toBe('checkout.status.pendingRefund.title')
  })

  it.each([
    'INTENT_FAILED_RETRYABLE',
    'INTENT_SIMULATION_FAILURE',
  ] as const)('PENDING + %s → pending-retrying', (substatus) => {
    const variant = resolveStatusVariant({
      status: statusOf('PENDING'),
      substatus,
      fundingSource: 'wallet',
    })
    expect(variant.tone).toBe('warning')
    expect(variant.icon).toBe('spinner')
    expect(variant.titleKey).toBe('checkout.status.pendingRetrying.title')
  })

  it.each([
    'INTENT_AWAITING_FUNDS',
    'INTENT_READY',
    'INTENT_EXECUTING',
  ] as const)('PENDING + %s → pending-default', (substatus) => {
    const variant = resolveStatusVariant({
      status: statusOf('PENDING'),
      substatus,
      fundingSource: 'transfer',
    })
    expect(variant.tone).toBe('pending')
    expect(variant.icon).toBe('spinner')
    expect(variant.titleKey).toBe('checkout.status.pendingDefault.title')
  })

  it('PENDING with no substatus → pending-default', () => {
    const variant = resolveStatusVariant({
      status: statusOf('PENDING'),
      fundingSource: null,
    })
    expect(variant.titleKey).toBe('checkout.status.pendingDefault.title')
  })
})

describe('resolveStatusVariant — FAILED / INVALID branch', () => {
  it('FAILED + EXPIRED → error-expired (wallet copy)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('FAILED'),
      substatus: 'EXPIRED',
      fundingSource: 'wallet',
    })
    expect(variant.titleKey).toBe('checkout.status.walletErrorExpired.title')
    expect(variant.primaryAction).toBe('tryAgain')
    expect(variant.secondaryAction).toBe('contactSupport')
  })

  it('FAILED + EXPIRED → error-expired (non-wallet copy)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('FAILED'),
      substatus: 'EXPIRED',
      fundingSource: 'transfer',
    })
    expect(variant.titleKey).toBe('checkout.status.errorExpired.title')
  })

  it('FAILED + UNKNOWN_FAILED_ERROR → error-failed with contactSupport secondary (wallet)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('FAILED'),
      substatus: 'UNKNOWN_FAILED_ERROR',
      fundingSource: 'wallet',
    })
    expect(variant.titleKey).toBe('checkout.status.walletErrorFailed.title')
    expect(variant.primaryAction).toBe('tryAgain')
    // Wallet failed: viewDetails is an inline link (descriptionAddon), not a
    // secondary button — the variant's secondary action stays contactSupport.
    expect(variant.secondaryAction).toBe('contactSupport')
  })

  it('FAILED + UNKNOWN_FAILED_ERROR → error-failed with contactSupport secondary (non-wallet)', () => {
    const variant = resolveStatusVariant({
      status: statusOf('FAILED'),
      substatus: 'UNKNOWN_FAILED_ERROR',
      fundingSource: 'exchange',
    })
    expect(variant.titleKey).toBe('checkout.status.errorFailed.title')
    expect(variant.secondaryAction).toBe('contactSupport')
  })

  it('INVALID without substatus is treated as error-failed', () => {
    const variant = resolveStatusVariant({
      status: statusOf('INVALID'),
      fundingSource: 'wallet',
    })
    expect(variant.tone).toBe('error')
    expect(variant.titleKey).toBe('checkout.status.walletErrorFailed.title')
  })

  it('INVALID + EXPIRED is treated as error-expired', () => {
    const variant = resolveStatusVariant({
      status: statusOf('INVALID'),
      substatus: 'EXPIRED',
      fundingSource: 'cash',
    })
    expect(variant.titleKey).toBe('checkout.status.errorExpired.title')
  })
})

describe('resolveStatusVariant — fallback', () => {
  it('no status and no flags → pending-default', () => {
    const variant = resolveStatusVariant({
      fundingSource: null,
    })
    expect(variant.tone).toBe('pending')
    expect(variant.icon).toBe('spinner')
    expect(variant.titleKey).toBe('checkout.status.pendingDefault.title')
  })

  it('unrecognised status string falls through to pending-default', () => {
    const variant = resolveStatusVariant({
      status: { status: 'NOT_FOUND' } as unknown as StatusResponse,
      fundingSource: 'wallet',
    })
    expect(variant.titleKey).toBe('checkout.status.pendingDefault.title')
  })
})
