import type { StatusMessage, StatusResponse, Substatus } from '@lifi/sdk'
import {
  formatTokenAmount,
  navigationRoutes,
  PageContainer,
  useChain,
  useContactSupport,
  useExplorer,
  useHeader,
} from '@lifi/widget/shared'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { Link, Typography } from '@mui/material'
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { type JSX, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckoutStatusScreen } from '../../components/CheckoutStatusScreen.js'
import { formatOnRampError } from '../../components/formatOnRampError.js'
import { useFundingOrder } from '../../hooks/useFundingOrder.js'
import { useFundingOrderCompletion } from '../../hooks/useFundingOrderCompletion.js'
import { useActiveOnRampDeposit } from '../../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { useFundingOrderStore } from '../../stores/useFundingOrderStore.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import type { OrderStatusPhase } from '../../utils/orderStatusView.js'
import { orderStatusView } from '../../utils/orderStatusView.js'
import { StatusCompleted } from './StatusCompleted.js'
import { StatusExecuting } from './StatusExecuting.js'
import { StatusWatching } from './StatusWatching.js'
import { resolveStatusVariant, type StatusVariant } from './statusVariants.js'

// Minimum visible hold so fast-resolving orders still show the executing state.
const MIN_EXECUTING_MS = 2500

const ERROR_VARIANT: StatusVariant = {
  tone: 'error',
  icon: 'error',
  titleKey: 'checkout.status.errorFailed.title',
  descriptionKey: 'checkout.status.errorFailed.description',
  primaryAction: 'tryAgain',
  secondaryAction: 'contactSupport',
}

// Intent-retrying substatuses are intentionally NOT here — they stay on the
// normal executing status screen instead of a dedicated "retrying" screen.
const COMPACT_VARIANT_SUBSTATUSES = new Set<string>([
  'REFUNDED',
  'PARTIAL',
  'REFUND_IN_PROGRESS',
])

function statusMessageForPhase(phase: OrderStatusPhase): StatusMessage {
  if (phase === 'done') {
    return 'DONE'
  }
  if (phase === 'failed') {
    return 'FAILED'
  }
  return 'PENDING'
}

export const CheckoutTransactionStatusPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const router = useRouter()
  const { orderId } = useSearch({ strict: false }) as { orderId?: string }

  // Active deposit session for the current funding source. The provider may
  // surface a terminal pre-hash failure (rendered below) or a cancellation
  // (redirected to amount entry) before a funding order even exists to poll.
  const deposit = useActiveOnRampDeposit()
  const providerName = deposit?.providerName ?? ''
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const isTransferFlow = fundingSource === 'transfer'

  const { order, isError, refetch } = useFundingOrder(orderId ?? null)
  const view = useMemo(() => orderStatusView(order), [order])
  // Reads `fundingSource` for its `provider` field — must run every render so
  // the terminal order is observed before anything resets the flow store.
  useFundingOrderCompletion(order)
  const acknowledge = useFundingOrderStore((s) => s.acknowledge)

  const recipientAddress = order?.destination.toAddress ?? null
  const fiatOrigin = order?.onramp
    ? { currency: order.onramp.fiatCurrency, amount: order.onramp.fiatAmount }
    : undefined

  // A cancelled on-ramp deposit (user closed the provider modal before
  // depositing) is not an error — return to amount entry instead of showing
  // the error screen. The underlying order, if any, stays tracked/resumable.
  const depositCancelled = deposit?.failure?.kind === 'cancelled'
  useEffect(() => {
    if (!depositCancelled) {
      return
    }
    // Replace-navigating would stack a duplicate enter-amount, so Back looks dead.
    if (router.history.length > 1) {
      router.history.go(-1)
    } else {
      navigate({ to: checkoutNavigationRoutes.enterAmount, replace: true })
    }
  }, [depositCancelled, navigate, router])

  // Track when executing first becomes visible so we can hold it briefly
  // before swapping to the success view.
  const [minHoldElapsed, setMinHoldElapsed] = useState(false)
  const inExecutingState = view.phase === 'pending' || view.phase === 'done'
  useEffect(() => {
    if (!inExecutingState) {
      setMinHoldElapsed(false)
      return
    }
    setMinHoldElapsed(false)
    const id = setTimeout(() => setMinHoldElapsed(true), MIN_EXECUTING_MS)
    return () => clearTimeout(id)
  }, [inExecutingState])

  // The details page and the support form both resolve a transfer by its
  // *source* hash (`getStatus({ txHash })`), so prefer it and only fall back
  // to the destination hash. Destination-oriented uses below stay on toTxHash.
  const sourceTxHash = view.fromTxHash ?? view.toTxHash

  const handleContactSupport = useContactSupport(sourceTxHash)
  const { getTransactionLink } = useExplorer()

  // Refund subject ("100 USDC on Arbitrum") describes the deposited source
  // that is being returned, read from the committed quote's display route.
  const { chain: refundChain } = useChain(view.displayRoute?.fromChainId)
  const refundAmount =
    view.displayRoute?.fromToken && view.displayRoute.fromAmount
      ? formatTokenAmount(
          BigInt(view.displayRoute.fromAmount),
          view.displayRoute.fromToken.decimals
        )
      : ''
  const refundParams = {
    amount: refundAmount,
    symbol: view.displayRoute?.fromToken.symbol ?? '',
    chain: refundChain?.name ?? '',
  }

  const isRefundInProgress = view.substatus === 'REFUND_IN_PROGRESS'
  const isRefunded = view.substatus === 'REFUNDED'

  // Refund screens read "Refund"; on-ramp failure reads "Deposit"; standard
  // transaction-status title otherwise.
  useHeader(
    isRefundInProgress || isRefunded
      ? t('checkout.refund.title')
      : deposit?.failure
        ? t('header.checkout')
        : t('checkout.transactionStatus.detailsTitle')
  )

  const goToEnterAmount = (): void => {
    navigate({ to: checkoutNavigationRoutes.enterAmount, replace: true })
  }

  const goToDetails = (): void => {
    if (!sourceTxHash) {
      return
    }
    navigate({
      to: `/${navigationRoutes.transactionExecution}/${navigationRoutes.transactionDetails}`,
      search: { transactionHash: sourceTxHash },
    })
  }

  const goHome = (): void => {
    navigate({ to: navigationRoutes.home })
  }

  // Acknowledgment retires the order from the tracked/activity list — only
  // fired when the order display is actually being dismissed (Done, or a
  // retry that starts a brand-new order), not on lateral actions like
  // viewing details or contacting support.
  const acknowledgeAndGoHome = (): void => {
    if (orderId) {
      acknowledge(orderId)
    }
    goHome()
  }

  // Retry = a new order, per the backend's one-order-one-execution rule.
  const acknowledgeAndGoToEnterAmount = (): void => {
    if (orderId) {
      acknowledge(orderId)
    }
    goToEnterAmount()
  }

  const retryStatus = (): void => {
    refetch()
  }

  const lateDeliveryCaption = view.lateDelivery ? (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ textAlign: 'center', mt: 1, display: 'block' }}
    >
      {t('checkout.transactionStatus.lateDelivery')}
    </Typography>
  ) : null

  // Pre-hash provider failure preempts any other status state because
  // polling can't have started without a hash. Cancellations are handled by
  // the redirect effect above, so they skip the error screen here.
  if (deposit?.failure && !depositCancelled) {
    const variant = resolveStatusVariant({
      fundingSource,
      onRampFailureKind: deposit.failure.kind,
    })
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={variant}
          description={deposit.failure.message}
          primaryAction={{ tryAgain: deposit.failure.retry }}
          secondaryAction={{ contactSupport: handleContactSupport }}
        />
      </PageContainer>
    )
  }

  // A pre-open session error sets `error`, not `failure`, and never opens the modal.
  if (deposit?.error && !depositCancelled) {
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={ERROR_VARIANT}
          description={
            formatOnRampError(deposit.error, providerName, t) ?? undefined
          }
          primaryAction={{ tryAgain: goToEnterAmount }}
          secondaryAction={{ contactSupport: handleContactSupport }}
        />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={ERROR_VARIANT}
          primaryAction={{ tryAgain: retryStatus }}
          secondaryAction={{ contactSupport: handleContactSupport }}
        />
      </PageContainer>
    )
  }

  if (view.phase === 'watching') {
    return (
      <PageContainer bottomGutters>
        <StatusWatching />
        {lateDeliveryCaption}
      </PageContainer>
    )
  }

  if (view.phase === 'failed') {
    const variant = resolveStatusVariant({
      status: { status: statusMessageForPhase(view.phase) } as StatusResponse,
      substatus: view.substatus as Substatus,
      fundingSource,
    })
    const description = isTransferFlow
      ? t('checkout.onramp.failure.transferDescription')
      : t(variant.descriptionKey, { providerName })
    const title = isTransferFlow
      ? t('checkout.onramp.failure.transferTitle')
      : undefined
    // Figma places the "View transaction details" affordance as an inline
    // link inside the description block, not as a secondary CTA. Only render
    // it when we have a hash to deep-link to.
    const descriptionAddon = view.toTxHash ? (
      <Link
        component="button"
        type="button"
        onClick={goToDetails}
        underline="hover"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.875rem',
        }}
      >
        {t('checkout.transactionStatus.seeDetails')}
        <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
      </Link>
    ) : null
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={variant}
          title={title}
          description={description}
          descriptionAddon={descriptionAddon}
          primaryAction={{ tryAgain: acknowledgeAndGoToEnterAmount }}
          secondaryAction={{ contactSupport: handleContactSupport }}
        />
        {lateDeliveryCaption}
      </PageContainer>
    )
  }

  // Refund substatuses render the compact status screen with their own copy
  // and tone — StatusCompleted / StatusExecuting hardcode their copy and would
  // otherwise mask it. Intent-retrying substatuses are excluded from the set
  // above and stay on the executing screen. Must run before the done/pending
  // branches below: REFUNDED arrives on a DONE order and REFUND_IN_PROGRESS
  // on a PENDING one.
  if (view.substatus && COMPACT_VARIANT_SUBSTATUSES.has(view.substatus)) {
    const variant = resolveStatusVariant({
      status: { status: statusMessageForPhase(view.phase) } as StatusResponse,
      substatus: view.substatus as Substatus,
      fundingSource,
    })
    const description = isRefundInProgress
      ? t('checkout.refund.inProgressDescription', refundParams)
      : isRefunded
        ? t('checkout.refund.completeDescription', refundParams)
        : undefined
    const refundTxLink = view.toTxHash
      ? getTransactionLink({
          txHash: view.toTxHash,
          chain: view.displayRoute?.toChainId ?? order?.destination.toChainId,
        })
      : undefined
    // Figma places "View transaction" as an inline link under the refund-
    // complete copy (not a button) — it opens the explorer in a new tab.
    const descriptionAddon =
      isRefunded && refundTxLink ? (
        <Link
          href={refundTxLink}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.875rem',
          }}
        >
          {t('checkout.refund.viewTransaction')}
          <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
        </Link>
      ) : undefined
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={variant}
          description={description}
          descriptionAddon={descriptionAddon}
          primaryAction={{
            done: acknowledgeAndGoHome,
            viewDetails: goToDetails,
            tryAgain: acknowledgeAndGoToEnterAmount,
            contactSupport: handleContactSupport,
            retry: acknowledgeAndGoToEnterAmount,
          }}
          secondaryAction={{
            done: acknowledgeAndGoHome,
            viewDetails: goToDetails,
            contactSupport: handleContactSupport,
          }}
        />
        {lateDeliveryCaption}
      </PageContainer>
    )
  }

  if (view.phase === 'done' && minHoldElapsed) {
    return (
      <PageContainer bottomGutters>
        <StatusCompleted
          toAmount={view.toAmount}
          toTxHash={view.toTxHash}
          toChainId={order?.destination.toChainId}
          onSeeDetails={goToDetails}
          onDone={acknowledgeAndGoHome}
          frozenRoute={view.displayRoute}
          recipientAddress={recipientAddress}
        />
        {lateDeliveryCaption}
      </PageContainer>
    )
  }

  // `pending`, or `done` while still holding the minimum executing display.
  return (
    <PageContainer bottomGutters>
      <StatusExecuting
        status={undefined}
        frozenRoute={view.displayRoute}
        recipientAddress={recipientAddress}
        fiatOrigin={fiatOrigin}
      />
      {lateDeliveryCaption}
    </PageContainer>
  )
}
