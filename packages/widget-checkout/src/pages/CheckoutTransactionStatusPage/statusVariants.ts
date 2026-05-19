import type { StatusResponse, Substatus } from '@lifi/sdk'
import type { OnRampFailureKind } from '@lifi/widget-provider/checkout'
import type { CheckoutFundingSource } from '../../stores/useCheckoutFlowStore.js'

export type StatusVariantTone = 'success' | 'pending' | 'error' | 'warning'
export type StatusVariantIcon = 'check' | 'spinner' | 'error' | 'refund'
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
}

/**
 * Maps (status, substatus, fundingSource, onRampFailureKind) to a deterministic
 * StatusVariant that CheckoutStatusScreen can render without any branching logic.
 *
 * Variant table:
 *   DONE + COMPLETED             → success-completed
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
  fundingSource: _fundingSource,
  onRampFailureKind,
}: ResolveStatusVariantArgs): StatusVariant {
  // Pre-hash provider failure takes priority — polling hasn't started yet.
  if (onRampFailureKind) {
    return resolveOnRampFailureVariant(onRampFailureKind)
  }

  const rawStatus = status?.status

  if (rawStatus === 'DONE') {
    if (substatus === 'REFUNDED') {
      return {
        tone: 'success',
        icon: 'refund',
        titleKey: 'checkout.status.successRefund.title',
        descriptionKey: 'checkout.status.successRefund.description',
        primaryAction: 'viewRefund',
        secondaryAction: 'done',
      }
    }
    // COMPLETED or PARTIAL — treat PARTIAL as success
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
        tone: 'pending',
        icon: 'refund',
        titleKey: 'checkout.status.pendingRefund.title',
        descriptionKey: 'checkout.status.pendingRefund.description',
        primaryAction: 'contactSupport',
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
        titleKey: 'checkout.status.errorExpired.title',
        descriptionKey: 'checkout.status.errorExpired.description',
        primaryAction: 'tryAgain',
        secondaryAction: 'contactSupport',
      }
    }
    // UNKNOWN_FAILED_ERROR or any other failed/invalid substatus
    return {
      tone: 'error',
      icon: 'error',
      titleKey: 'checkout.status.errorFailed.title',
      descriptionKey: 'checkout.status.errorFailed.description',
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

function resolveOnRampFailureVariant(kind: OnRampFailureKind): StatusVariant {
  switch (kind) {
    case 'withdrawal':
      return {
        tone: 'error',
        icon: 'error',
        titleKey: 'checkout.status.errorWithdrawal.title',
        descriptionKey: 'checkout.status.errorWithdrawal.description',
        primaryAction: 'tryAgain',
        secondaryAction: 'contactSupport',
      }
    case 'cancelled':
      return {
        tone: 'warning',
        icon: 'error',
        titleKey: 'checkout.status.errorCancelled.title',
        descriptionKey: 'checkout.status.errorCancelled.description',
        primaryAction: 'tryAgain',
      }
    case 'unavailable':
      return {
        tone: 'error',
        icon: 'error',
        titleKey: 'checkout.status.errorUnavailable.title',
        descriptionKey: 'checkout.status.errorUnavailable.description',
        primaryAction: 'tryAgain',
        secondaryAction: 'contactSupport',
      }
    default:
      return {
        tone: 'error',
        icon: 'error',
        titleKey: 'checkout.status.errorConnection.title',
        descriptionKey: 'checkout.status.errorConnection.description',
        primaryAction: 'tryAgain',
        secondaryAction: 'contactSupport',
      }
  }
}
