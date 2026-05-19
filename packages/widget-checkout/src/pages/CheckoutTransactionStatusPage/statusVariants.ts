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
  /** Wallet was disconnected mid-execution; maps to error-connection with wallet-disconnect copy. */
  walletDisconnected?: boolean
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
  fundingSource,
  onRampFailureKind,
  walletDisconnected,
}: ResolveStatusVariantArgs): StatusVariant {
  const isWallet = fundingSource === 'wallet'

  // Wallet disconnect during execution — surfaces before any status check.
  if (walletDisconnected) {
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
        icon: 'refund',
        titleKey: isWallet
          ? 'checkout.status.walletSuccessRefund.title'
          : 'checkout.status.successRefund.title',
        descriptionKey: isWallet
          ? 'checkout.status.walletSuccessRefund.description'
          : 'checkout.status.successRefund.description',
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
        titleKey: isWallet
          ? 'checkout.status.walletPendingRefund.title'
          : 'checkout.status.pendingRefund.title',
        descriptionKey: isWallet
          ? 'checkout.status.walletPendingRefund.description'
          : 'checkout.status.pendingRefund.description',
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
    // UNKNOWN_FAILED_ERROR or any other failed/invalid substatus
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
      secondaryAction: isWallet ? 'viewDetails' : 'contactSupport',
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

function resolveOnRampFailureVariant(
  kind: OnRampFailureKind,
  fundingSource: CheckoutFundingSource | null
): StatusVariant {
  const isCash = fundingSource === 'cash'
  switch (kind) {
    case 'withdrawal':
      return {
        tone: 'error',
        icon: 'error',
        titleKey: isCash
          ? 'checkout.status.errorWithdrawal.cash.title'
          : 'checkout.status.errorWithdrawal.title',
        descriptionKey: isCash
          ? 'checkout.status.errorWithdrawal.cash.description'
          : 'checkout.status.errorWithdrawal.description',
        primaryAction: 'tryAgain',
        secondaryAction: 'contactSupport',
      }
    case 'cancelled':
      return {
        tone: 'warning',
        icon: 'error',
        titleKey: isCash
          ? 'checkout.status.errorCancelled.cash.title'
          : 'checkout.status.errorCancelled.title',
        descriptionKey: isCash
          ? 'checkout.status.errorCancelled.cash.description'
          : 'checkout.status.errorCancelled.description',
        primaryAction: 'tryAgain',
      }
    case 'unavailable':
      return {
        tone: 'error',
        icon: 'error',
        titleKey: isCash
          ? 'checkout.status.errorUnavailable.cash.title'
          : 'checkout.status.errorUnavailable.title',
        descriptionKey: isCash
          ? 'checkout.status.errorUnavailable.cash.description'
          : 'checkout.status.errorUnavailable.description',
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
