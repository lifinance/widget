import type { StatusResponse, Substatus } from '@lifi/sdk'
import type { OnRampFailureKind } from '@lifi/widget-provider/checkout'
import type { CheckoutFundingSource } from '../../stores/useCheckoutFlowStore.js'

export type StatusVariantTone = 'success' | 'pending' | 'error' | 'warning'
export type StatusVariantIcon = 'check' | 'spinner' | 'error'
export type StatusVariantPrimaryAction =
  | 'tryAgain'
  | 'viewDetails'
  | 'done'
  | 'contactSupport'
  | 'viewRefund'
export type StatusVariantSecondaryAction =
  | 'contactSupport'
  | 'done'
  | 'viewDetails'

export interface StatusVariant {
  tone: StatusVariantTone
  icon: StatusVariantIcon
  titleKey: string
  descriptionKey: string
  primaryAction: StatusVariantPrimaryAction
  secondaryAction?: StatusVariantSecondaryAction
}

export interface ResolveStatusVariantArgs {
  status?: StatusResponse
  substatus?: Substatus
  fundingSource: CheckoutFundingSource | null
  onRampFailureKind?: OnRampFailureKind
  /** Wallet was disconnected mid-execution; maps to error-connection with wallet-disconnect copy. */
  walletDisconnected?: boolean
}

/**
 * Maps (status, substatus, fundingSource, onRampFailureKind) to a deterministic
 * StatusVariant that CheckoutStatusScreen can render without any branching logic.
 *
 * Variant table:
 *   DONE + COMPLETED             → success-completed
 *   DONE + PARTIAL               → success-partial
 *   DONE + REFUNDED              → success-refund
 *   PENDING + REFUND_IN_PROGRESS → pending-refund
 *   PENDING + INTENT_AWAITING_FUNDS | INTENT_READY | INTENT_EXECUTING → pending-default
 *   PENDING + INTENT_FAILED_RETRYABLE | INTENT_SIMULATION_FAILURE     → pending-retrying
 *   FAILED + EXPIRED             → error-expired
 *   FAILED + UNKNOWN_FAILED_ERROR / anything else → error-failed
 *   INVALID                      → error-failed
 *   pre-hash OnRampFailureKind   → error-{kind}
 */
export function resolveStatusVariant({
  status,
  substatus,
  fundingSource,
  onRampFailureKind,
  walletDisconnected,
}: ResolveStatusVariantArgs): StatusVariant {
  const isWallet = fundingSource === 'wallet'

  // Only meaningful for wallet flow; non-wallet falls through to status logic.
  if (walletDisconnected && isWallet) {
    return {
      tone: 'error',
      icon: 'error',
      titleKey: 'checkout.status.walletDisconnected.title',
      descriptionKey: 'checkout.status.walletDisconnected.description',
      primaryAction: 'tryAgain',
      secondaryAction: 'contactSupport',
    }
  }

  // Pre-hash provider failure takes priority — polling hasn't started yet.
  if (onRampFailureKind) {
    return resolveOnRampFailureVariant(onRampFailureKind, fundingSource)
  }

  const rawStatus = status?.status

  if (rawStatus === 'DONE') {
    if (substatus === 'REFUNDED') {
      return {
        tone: 'success',
        icon: 'check',
        titleKey: isWallet
          ? 'checkout.status.walletSuccessRefund.title'
          : 'checkout.status.successRefund.title',
        descriptionKey: isWallet
          ? 'checkout.status.walletSuccessRefund.description'
          : 'checkout.status.successRefund.description',
        primaryAction: 'done',
        secondaryAction: 'viewDetails',
      }
    }
    if (substatus === 'PARTIAL') {
      return {
        tone: 'success',
        icon: 'check',
        titleKey: 'checkout.status.successPartial.title',
        descriptionKey: 'checkout.status.successPartial.description',
        primaryAction: 'viewDetails',
        secondaryAction: 'done',
      }
    }
    return {
      tone: 'success',
      icon: 'check',
      titleKey: 'checkout.status.successCompleted.title',
      descriptionKey: 'checkout.status.successCompleted.description',
      primaryAction: 'done',
      secondaryAction: 'viewDetails',
    }
  }

  if (rawStatus === 'PENDING') {
    if (substatus === 'REFUND_IN_PROGRESS') {
      return {
        tone: 'warning',
        icon: 'spinner',
        titleKey: isWallet
          ? 'checkout.status.walletPendingRefund.title'
          : 'checkout.status.pendingRefund.title',
        descriptionKey: isWallet
          ? 'checkout.status.walletPendingRefund.description'
          : 'checkout.status.pendingRefund.description',
        primaryAction: 'viewDetails',
      }
    }
    if (
      substatus === 'INTENT_FAILED_RETRYABLE' ||
      substatus === 'INTENT_SIMULATION_FAILURE'
    ) {
      return {
        tone: 'warning',
        icon: 'spinner',
        titleKey: 'checkout.status.pendingRetrying.title',
        descriptionKey: 'checkout.status.pendingRetrying.description',
        primaryAction: 'contactSupport',
      }
    }
    // INTENT_AWAITING_FUNDS | INTENT_READY | INTENT_EXECUTING or generic PENDING
    return {
      tone: 'pending',
      icon: 'spinner',
      titleKey: 'checkout.status.pendingDefault.title',
      descriptionKey: 'checkout.status.pendingDefault.description',
      primaryAction: 'contactSupport',
    }
  }

  if (rawStatus === 'FAILED' || rawStatus === 'INVALID') {
    if (substatus === 'EXPIRED') {
      return {
        tone: 'error',
        icon: 'error',
        titleKey: isWallet
          ? 'checkout.status.walletErrorExpired.title'
          : 'checkout.status.errorExpired.title',
        descriptionKey: isWallet
          ? 'checkout.status.walletErrorExpired.description'
          : 'checkout.status.errorExpired.description',
        primaryAction: 'tryAgain',
        secondaryAction: 'contactSupport',
      }
    }
    // UNKNOWN_FAILED_ERROR or any other failed/invalid substatus.
    // View-transaction-details renders as an inline link inside the
    // description (see CheckoutStatusScreen.descriptionAddon), not as a
    // secondary CTA.
    return {
      tone: 'error',
      icon: 'error',
      titleKey: isWallet
        ? 'checkout.status.walletErrorFailed.title'
        : 'checkout.status.errorFailed.title',
      descriptionKey: isWallet
        ? 'checkout.status.walletErrorFailed.description'
        : 'checkout.status.errorFailed.description',
      primaryAction: 'tryAgain',
      secondaryAction: 'contactSupport',
    }
  }

  // Fallback: no status yet or unrecognised value — treat as pending
  return {
    tone: 'pending',
    icon: 'spinner',
    titleKey: 'checkout.status.pendingDefault.title',
    descriptionKey: 'checkout.status.pendingDefault.description',
    primaryAction: 'contactSupport',
  }
}

function pickCopy(
  baseKey: string,
  fundingSource: CheckoutFundingSource | null,
  overrides: Partial<Record<CheckoutFundingSource, true>>,
  suffix: 'title' | 'description'
): string {
  if (fundingSource && overrides[fundingSource]) {
    return `${baseKey}.${fundingSource}.${suffix}`
  }
  return `${baseKey}.${suffix}`
}

interface OnRampVariantSpec {
  base: string
  tone: StatusVariantTone
  overrides: Partial<Record<CheckoutFundingSource, true>>
  secondaryAction?: StatusVariantSecondaryAction
}

const ON_RAMP_SPECS: Record<OnRampFailureKind, OnRampVariantSpec> = {
  withdrawal: {
    base: 'checkout.status.errorWithdrawal',
    tone: 'error',
    overrides: { cash: true, exchange: true },
    secondaryAction: 'contactSupport',
  },
  cancelled: {
    base: 'checkout.status.errorCancelled',
    tone: 'warning',
    overrides: { cash: true },
  },
  unavailable: {
    base: 'checkout.status.errorUnavailable',
    tone: 'error',
    overrides: { cash: true },
    secondaryAction: 'contactSupport',
  },
  connection: {
    base: 'checkout.status.errorConnection',
    tone: 'error',
    overrides: { exchange: true },
    secondaryAction: 'contactSupport',
  },
}

function resolveOnRampFailureVariant(
  kind: OnRampFailureKind,
  fundingSource: CheckoutFundingSource | null
): StatusVariant {
  const spec = ON_RAMP_SPECS[kind] ?? ON_RAMP_SPECS.connection
  return {
    tone: spec.tone,
    icon: 'error',
    titleKey: pickCopy(spec.base, fundingSource, spec.overrides, 'title'),
    descriptionKey: pickCopy(
      spec.base,
      fundingSource,
      spec.overrides,
      'description'
    ),
    primaryAction: 'tryAgain',
    secondaryAction: spec.secondaryAction,
  }
}
