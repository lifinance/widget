import type {
  ExtendedTransactionInfo,
  FullStatusData,
  Substatus,
} from '@lifi/sdk'
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
import { Link } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckoutStatusScreen } from '../../components/CheckoutStatusScreen.js'
import { useCheckoutStatusSources } from '../../hooks/useCheckoutStatusSources.js'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
import { usePendingCheckoutWriter } from '../../hooks/usePendingCheckoutWriter.js'
import { useResumeKey } from '../../hooks/useResumeKey.js'
import { useActiveOnRampDeposit } from '../../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { useCheckoutToastStore } from '../../stores/useCheckoutToastStore.js'
import {
  getReceivingTxHash,
  getReceivingTxLink,
} from '../../utils/depositAddressStatus.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { StatusCompleted } from './StatusCompleted.js'
import { StatusExecuting } from './StatusExecuting.js'
import { StatusWatching } from './StatusWatching.js'
import { resolveStatusVariant } from './statusVariants.js'

interface StatusSearch {
  transactionHash?: string
  depositAddress?: string
  fromChain?: number
  walletDisconnected?: boolean
  resumed?: string
}

// Minimum visible hold so fast-resolving txs still show the executing state.
const MIN_EXECUTING_MS = 2500

// Intent-retrying substatuses are intentionally NOT here — they stay on the
// normal executing status screen instead of a dedicated "retrying" screen.
const COMPACT_VARIANT_SUBSTATUSES = new Set<Substatus>([
  'REFUNDED',
  'PARTIAL',
  'REFUND_IN_PROGRESS',
])

export const CheckoutTransactionStatusPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { search } = useLocation() as { search: StatusSearch }
  const transactionHash = search.transactionHash ?? null
  const depositAddress = search.depositAddress ?? null
  const fromChain =
    typeof search.fromChain === 'number' ? search.fromChain : null
  const walletDisconnected = search.walletDisconnected === true

  // Active deposit session for the current funding source. The provider may
  // surface a terminal pre-hash failure (rendered below) or a cancellation
  // (redirected to amount entry). On-ramp deposits are tracked purely by
  // polling the status endpoint with the deposit address — the provider's own
  // hash, if any, is the funding tx and not the LI.FI-tracked transfer.
  const deposit = useActiveOnRampDeposit()
  const providerName = deposit?.providerName ?? ''
  // Active across both the session fetch and the open modal — nothing is
  // deposited until it ends, so the page holds the loader and pauses polling.
  const isOnRampActive = deposit?.isOpen === true || deposit?.isLoading === true
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const isTransferFlow = fundingSource === 'transfer'

  const { frozenRoute, recipientAddress } = useCheckoutStatusSources()

  const { status, phase, isLoading, notFound } = useCheckoutTransactionStatus({
    transactionHash,
    depositAddress,
    fromChain,
    pauseDepositPoll: isOnRampActive,
  })

  const isRefundInProgress = status?.substatus === 'REFUND_IN_PROGRESS'
  const isRefunded = status?.substatus === 'REFUNDED'

  const resumeKey = useResumeKey()
  const { clearForKey, markFailed } = usePendingCheckoutWriter()
  // A settled refund is terminal for resume purposes — the deposit is no
  // longer pending even if the status value isn't DONE. An in-progress
  // refund stays resumable so a reload can keep tracking it. A failure is
  // kept (marked) rather than cleared so it surfaces as a failed activity card.
  useEffect(() => {
    if (phase === 'done' || isRefunded) {
      clearForKey(resumeKey)
    } else if (phase === 'failed' && resumeKey) {
      markFailed(resumeKey)
    }
  }, [phase, isRefunded, resumeKey, clearForKey, markFailed])

  // A cancelled on-ramp deposit (user closed the provider modal before
  // depositing) is not an error — return to amount entry instead of showing
  // the error screen. Only genuine failures fall through to the error branch.
  const depositCancelled = deposit?.failure?.kind === 'cancelled'
  useEffect(() => {
    if (!depositCancelled) {
      return
    }
    clearForKey(resumeKey)
    navigate({ to: checkoutNavigationRoutes.enterAmount, replace: true })
  }, [depositCancelled, clearForKey, resumeKey, navigate])

  const isResumed = search.resumed === '1'
  const showToast = useCheckoutToastStore((s) => s.show)
  const notFoundHandledRef = useRef(false)
  useEffect(() => {
    // With a known tx hash the deposit was funded — NOT_FOUND only means the
    // deposit isn't indexed yet, so keep watching instead of bailing out.
    if (
      notFound &&
      isResumed &&
      !transactionHash &&
      !notFoundHandledRef.current
    ) {
      notFoundHandledRef.current = true
      clearForKey(resumeKey)
      showToast('resumeNotFound')
      navigate({ to: checkoutNavigationRoutes.enterAmount, replace: true })
    }
  }, [
    notFound,
    isResumed,
    transactionHash,
    resumeKey,
    clearForKey,
    showToast,
    navigate,
  ])

  // Track when executing first becomes visible so we can hold it briefly
  // before swapping to the success view.
  const [minHoldElapsed, setMinHoldElapsed] = useState(false)
  const inExecutingState = (transactionHash || status) && phase !== 'failed'
  useEffect(() => {
    if (!inExecutingState) {
      setMinHoldElapsed(false)
      return
    }
    setMinHoldElapsed(false)
    const id = setTimeout(() => setMinHoldElapsed(true), MIN_EXECUTING_MS)
    return () => clearTimeout(id)
  }, [inExecutingState])

  const detailsTxHash = transactionHash ?? getReceivingTxHash(status) ?? null
  const handleContactSupport = useContactSupport(detailsTxHash ?? undefined)
  const { getTransactionLink } = useExplorer()

  // Refund subject ("100 USDC on Arbitrum") describes the deposited source that
  // is being returned. Prefer the live status, fall back to the frozen quote.
  const refundSending = status?.sending as ExtendedTransactionInfo | undefined
  const refundToken = refundSending?.token ?? frozenRoute?.fromToken
  const refundAmountRaw = refundSending?.amount ?? frozenRoute?.fromAmount
  const refundChainId =
    (typeof refundSending?.chainId === 'number'
      ? refundSending.chainId
      : undefined) ?? frozenRoute?.fromChainId
  const { chain: refundChain } = useChain(refundChainId)
  const refundAmount =
    refundToken && refundAmountRaw
      ? formatTokenAmount(BigInt(refundAmountRaw), refundToken.decimals)
      : ''
  const refundParams = {
    amount: refundAmount,
    symbol: refundToken?.symbol ?? '',
    chain: refundChain?.name ?? '',
  }

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
    clearForKey(resumeKey)
    navigate({
      to: checkoutNavigationRoutes.enterAmount,
      replace: true,
    })
  }

  const goToDetails = (): void => {
    if (!detailsTxHash) {
      return
    }
    navigate({
      to: `/${navigationRoutes.transactionExecution}/${navigationRoutes.transactionDetails}`,
      search: { transactionHash: detailsTxHash },
    })
  }

  const goHome = (): void => {
    navigate({ to: navigationRoutes.home })
  }

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

  if (walletDisconnected) {
    const variant = resolveStatusVariant({ fundingSource, walletDisconnected })
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={variant}
          primaryAction={{ tryAgain: goToEnterAmount }}
          secondaryAction={{ contactSupport: handleContactSupport }}
        />
      </PageContainer>
    )
  }

  if (!transactionHash && !status) {
    return (
      <PageContainer bottomGutters>
        {frozenRoute && !isOnRampActive ? (
          <StatusExecuting
            status={undefined}
            frozenRoute={frozenRoute}
            recipientAddress={recipientAddress}
            watching
          />
        ) : (
          <StatusWatching />
        )}
      </PageContainer>
    )
  }

  if (phase === 'failed') {
    const variant = resolveStatusVariant({
      status,
      substatus: status?.substatus,
      fundingSource,
    })
    const description = isTransferFlow
      ? t('checkout.onramp.failure.transferDescription')
      : (status?.substatusMessage ??
        t(variant.descriptionKey, { providerName }))
    const title = isTransferFlow
      ? t('checkout.onramp.failure.transferTitle')
      : undefined
    // Figma places the "View transaction details" affordance as an inline
    // link inside the description block, not as a secondary CTA. Only render
    // it when we have a hash to deep-link to.
    const descriptionAddon = detailsTxHash ? (
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
          primaryAction={{ tryAgain: goToEnterAmount }}
          secondaryAction={{ contactSupport: handleContactSupport }}
        />
      </PageContainer>
    )
  }

  // Refund substatuses render the compact status screen with their own copy
  // and tone — StatusCompleted / StatusExecuting hardcode their copy and would
  // otherwise mask it. Intent-retrying substatuses are excluded from the set
  // above and stay on the executing screen.
  if (status?.substatus && COMPACT_VARIANT_SUBSTATUSES.has(status.substatus)) {
    const variant = resolveStatusVariant({
      status,
      substatus: status.substatus,
      fundingSource,
    })
    const description = isRefundInProgress
      ? t('checkout.refund.inProgressDescription', refundParams)
      : isRefunded
        ? t('checkout.refund.completeDescription', refundParams)
        : undefined
    // The refund transaction is the status payload's receiving tx; prefer it
    // over the URL hash (which is the original deposit tx for wallet flows).
    const refundTxHash = getReceivingTxHash(status) ?? detailsTxHash
    const refundTxLink =
      getReceivingTxLink(status) ??
      (refundTxHash
        ? getTransactionLink({ txHash: refundTxHash, chain: refundChainId })
        : undefined)
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
            done: goHome,
            viewDetails: goToDetails,
            tryAgain: goToEnterAmount,
            contactSupport: handleContactSupport,
            retry: goToEnterAmount,
          }}
          secondaryAction={{
            done: goHome,
            viewDetails: goToDetails,
            contactSupport: handleContactSupport,
          }}
        />
      </PageContainer>
    )
  }

  if (phase === 'done' && minHoldElapsed && status) {
    return (
      <PageContainer bottomGutters>
        <StatusCompleted
          status={status as FullStatusData}
          onSeeDetails={goToDetails}
          onDone={goHome}
          frozenRoute={frozenRoute}
          recipientAddress={recipientAddress}
        />
      </PageContainer>
    )
  }

  if (isLoading && !status) {
    return (
      <PageContainer bottomGutters>
        <StatusExecuting
          status={undefined}
          frozenRoute={frozenRoute}
          recipientAddress={recipientAddress}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer bottomGutters>
      <StatusExecuting
        status={status}
        frozenRoute={frozenRoute}
        recipientAddress={recipientAddress}
      />
    </PageContainer>
  )
}
