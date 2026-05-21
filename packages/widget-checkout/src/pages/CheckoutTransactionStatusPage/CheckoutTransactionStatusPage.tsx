import type { FullStatusData, Substatus } from '@lifi/sdk'
import {
  navigationRoutes,
  PageContainer,
  shortenAddress,
  useChain,
  useContactSupport,
  useFieldValues,
  useHeader,
  useToken,
} from '@lifi/widget/shared'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { Link, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckoutStatusScreen } from '../../components/CheckoutStatusScreen.js'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
import { useActiveOnRampDeposit } from '../../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { getReceivingTxHash } from '../../utils/depositAddressStatus.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import {
  getPendingSimulationDuration,
  getSimulatedFundingSource,
  getSimulatedOnRampFailure,
  getSimulatedSubstatus,
  getWatchingSimulationDuration,
  isTransactionStatusSimulationKind,
} from '../../utils/transactionStatusSimulation.js'
import { StatusCompleted } from './StatusCompleted.js'
import { StatusExecuting } from './StatusExecuting.js'
import { StatusWatching } from './StatusWatching.js'
import { resolveStatusVariant } from './statusVariants.js'

interface StatusSearch {
  transactionHash?: string
  depositAddress?: string
  fromChain?: number
  simulateTransactionStatus?: string
  walletDisconnected?: boolean
}

/**
 * Hold the executing screen for a minimum duration so the user actually
 * registers it. Without this, fast-resolving txs (or the dev simulation)
 * jump straight from "watching" to "successful" and the in-flight state
 * is never visible.
 */
const MIN_EXECUTING_MS = 2500

/**
 * Substatuses that need the compact CheckoutStatusScreen treatment rather
 * than the rich StatusCompleted / StatusExecuting templates. These are the
 * variants `resolveStatusVariant` returns dedicated copy + tone for —
 * refund states, intent retrying — and rendering them with the default
 * "transaction successful" / "executing" templates loses the distinction.
 */
const COMPACT_VARIANT_SUBSTATUSES = new Set<Substatus>([
  'REFUNDED',
  'PARTIAL',
  'REFUND_IN_PROGRESS',
  'INTENT_FAILED_RETRYABLE',
  'INTENT_SIMULATION_FAILURE',
])

export const CheckoutTransactionStatusPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { search } = useLocation() as { search: StatusSearch }
  const transactionHash = search.transactionHash ?? null
  const depositAddress = search.depositAddress ?? null
  const fromChain =
    typeof search.fromChain === 'number' ? search.fromChain : null
  const simulate = isTransactionStatusSimulationKind(
    search.simulateTransactionStatus
  )
    ? search.simulateTransactionStatus
    : null
  const walletDisconnected = search.walletDisconnected === true

  // Dev-only URL-driven overrides for status simulation.
  const simulatedSubstatus = getSimulatedSubstatus()
  const simulatedOnRampFailure = getSimulatedOnRampFailure()
  const simulatedFundingSource = getSimulatedFundingSource()

  // Active deposit session for the current funding source. The provider
  // may emit a real on-chain hash (driving polling) or a terminal
  // pre-hash failure (rendered below). Null for `wallet` / `transfer` /
  // no registered provider.
  const deposit = useActiveOnRampDeposit()
  const providerName = deposit?.providerName ?? ''
  const storeFundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const fundingSource = simulatedFundingSource ?? storeFundingSource
  const isTransferFlow = fundingSource === 'transfer'

  // Pull the on-chain hash emitted by the provider into the URL so polling
  // kicks in. `acknowledge` clears it on the provider side so re-renders
  // don't loop. When a simulation is active, the hash arrival also marks the
  // end of "watching" — flip the simulation to `pending` so the page walks
  // through the executing screen instead of jumping straight to done.
  const depositTxHash = deposit?.depositTxHash ?? null
  const acknowledgeDepositTxHash = deposit?.acknowledgeDepositTxHash
  useEffect(() => {
    if (!depositTxHash) {
      return
    }
    const nextSimulate = simulate === 'watching' ? 'pending' : simulate
    navigate({
      to: `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`,
      search: {
        transactionHash: depositTxHash,
        ...(nextSimulate ? { simulateTransactionStatus: nextSimulate } : {}),
      },
    })
    acknowledgeDepositTxHash?.()
  }, [depositTxHash, acknowledgeDepositTxHash, navigate, simulate])

  // Dev-only: on-ramp providers (e.g. Transak) never deliver an on-chain
  // hash through the SDK. Once the provider's modal opens then closes
  // cleanly (no failure → user completed the card charge) we treat that
  // as the cue to advance the watching → pending simulation after a hold.
  // Tracking the open→close transition guards against a race on first
  // mount where the store hasn't yet committed isOpen=true.
  const depositModalOpen = deposit?.isOpen ?? false
  const depositFailure = deposit?.failure ?? null
  const [sawModalOpen, setSawModalOpen] = useState(false)
  useEffect(() => {
    if (depositModalOpen && !sawModalOpen) {
      setSawModalOpen(true)
    }
  }, [depositModalOpen, sawModalOpen])
  const cardChargeAccepted =
    sawModalOpen && !depositModalOpen && !depositFailure
  useEffect(() => {
    if (simulate !== 'watching') {
      return
    }
    if (!cardChargeAccepted) {
      return
    }
    const delayMs = getWatchingSimulationDuration()
    if (delayMs === null) {
      return
    }
    const id = setTimeout(() => {
      navigate({
        to: `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`,
        search: (prev: StatusSearch) => ({
          ...prev,
          simulateTransactionStatus: 'pending',
        }),
      })
    }, delayMs)
    return () => clearTimeout(id)
  }, [simulate, cardChargeAccepted, navigate])

  // Dev-only: after `simulate=pending`, auto-advance to `done`.
  useEffect(() => {
    if (simulate !== 'pending') {
      return
    }
    const delayMs = getPendingSimulationDuration()
    if (delayMs === null) {
      return
    }
    const id = setTimeout(() => {
      navigate({
        to: `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`,
        search: (prev: StatusSearch) => ({
          ...prev,
          simulateTransactionStatus: 'done',
        }),
      })
    }, delayMs)
    return () => clearTimeout(id)
  }, [simulate, navigate])

  const [formFromChainId, formFromTokenAddress] = useFieldValues(
    'fromChain',
    'fromToken'
  )
  const [formToChainId, formToTokenAddress] = useFieldValues(
    'toChain',
    'toToken'
  )
  const [formFromAmount] = useFieldValues('fromAmount')
  const { token: formFromToken } = useToken(
    formFromChainId,
    formFromTokenAddress
  )
  const { token: formToToken } = useToken(formToChainId, formToTokenAddress)

  const simulateTokenOverrides = simulate
    ? {
        fromToken: formFromToken ?? null,
        toToken: formToToken ?? null,
        fromAmount: typeof formFromAmount === 'string' ? formFromAmount : null,
      }
    : undefined

  const { status, phase, isLoading } = useCheckoutTransactionStatus({
    transactionHash,
    depositAddress,
    fromChain,
    simulate,
    simulateSubstatus: simulatedSubstatus,
    simulateTokenOverrides,
  })

  // Track when executing first becomes visible so we can hold it briefly
  // before swapping to the success view.
  const [minHoldElapsed, setMinHoldElapsed] = useState(false)
  const inExecutingState =
    simulate !== 'watching' && (transactionHash || status) && phase !== 'failed'
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

  const refundChainId =
    typeof status?.sending?.chainId === 'number'
      ? status.sending.chainId
      : undefined
  const { chain: refundChain } = useChain(refundChainId)

  // Header reads "Deposit" for on-ramp failure and refund-in-progress
  // screens (per Figma); standard transaction-status title otherwise.
  const isRefundInProgress =
    simulatedSubstatus === 'REFUND_IN_PROGRESS' ||
    status?.substatus === 'REFUND_IN_PROGRESS'
  useHeader(
    deposit?.failure || isRefundInProgress
      ? t('checkout.deposit')
      : t('checkout.transactionStatus.detailsTitle')
  )

  const goToEnterAmount = (): void => {
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
  // polling can't have started without a hash.
  if (deposit?.failure) {
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

  // Dev-only: URL-driven on-ramp failure simulation. Mirrors the real
  // `deposit.failure` branch above so every OnRampFailureKind variant is
  // reachable without running the actual provider flow.
  if (simulatedOnRampFailure) {
    const variant = resolveStatusVariant({
      fundingSource,
      onRampFailureKind: simulatedOnRampFailure,
    })
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

  if (simulate === 'watching' || (!simulate && !transactionHash && !status)) {
    return (
      <PageContainer bottomGutters>
        <StatusWatching />
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

  // Refund / intent-retrying substatuses render the compact variant screen
  // so the dedicated copy + tone (amber spinner for refund-in-progress,
  // green check for refunded) actually surfaces — StatusCompleted /
  // StatusExecuting hardcode their own copy and would otherwise mask it.
  if (status?.substatus && COMPACT_VARIANT_SUBSTATUSES.has(status.substatus)) {
    const variant = resolveStatusVariant({
      status,
      substatus: status.substatus,
      fundingSource,
    })
    const isRefundProgress = status.substatus === 'REFUND_IN_PROGRESS'
    const refundAddress =
      (status as { fromAddress?: string }).fromAddress ?? null
    const refundShort = refundAddress
      ? (shortenAddress(refundAddress) ?? refundAddress)
      : null
    const sentToLabel =
      fundingSource === 'wallet'
        ? t('checkout.status.walletPendingRefund.sentToWallet')
        : t('checkout.status.pendingRefund.sentTo')
    const descriptionAddon =
      isRefundProgress && refundShort ? (
        <Stack spacing={0.5} sx={{ alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {sentToLabel}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {refundChain?.name
              ? `${refundShort} on ${refundChain.name}`
              : refundShort}
          </Typography>
        </Stack>
      ) : undefined
    return (
      <PageContainer bottomGutters>
        <CheckoutStatusScreen
          variant={variant}
          descriptionAddon={descriptionAddon}
          primaryAction={{
            done: goHome,
            viewDetails: goToDetails,
            tryAgain: goToEnterAmount,
            contactSupport: handleContactSupport,
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
        />
      </PageContainer>
    )
  }

  if (isLoading && !status) {
    return (
      <PageContainer bottomGutters>
        <StatusExecuting status={undefined} />
      </PageContainer>
    )
  }

  return (
    <PageContainer bottomGutters>
      <StatusExecuting status={status} />
    </PageContainer>
  )
}
