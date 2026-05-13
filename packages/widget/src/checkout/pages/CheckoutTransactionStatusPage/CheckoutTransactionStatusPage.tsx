import type { FullStatusData, StatusResponse } from '@lifi/sdk'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../../components/PageContainer.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { navigationRoutes } from '../../../utils/navigationRoutes.js'
import { OnRampFailureScreen } from '../../components/OnRampFailureScreen.js'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
import { useActiveOnRampDeposit } from '../../providers/OnRampProvider/OnRampProvider.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { isTransactionStatusSimulationKind } from '../../utils/transactionStatusSimulation.js'
import { StatusCompleted } from './StatusCompleted.js'
import { StatusExecuting } from './StatusExecuting.js'
import { StatusWatching } from './StatusWatching.js'

interface StatusSearch {
  transactionHash?: string
  simulateTransactionStatus?: string
}

/**
 * Hold the executing screen for a minimum duration so the user actually
 * registers it. Without this, fast-resolving txs (or the dev simulation)
 * jump straight from "watching" to "successful" and the in-flight state
 * is never visible.
 */
const MIN_EXECUTING_MS = 2500

export const CheckoutTransactionStatusPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { search } = useLocation() as { search: StatusSearch }
  const transactionHash = search.transactionHash ?? null
  const simulate = isTransactionStatusSimulationKind(
    search.simulateTransactionStatus
  )
    ? search.simulateTransactionStatus
    : null

  // Active deposit session for the current funding source. The provider
  // may emit a real on-chain hash (driving polling) or a terminal
  // pre-hash failure (rendered below). Null for `wallet` / `transfer` /
  // no registered provider.
  const deposit = useActiveOnRampDeposit()
  const providerName = deposit?.providerName ?? ''

  // Title is "deposit" while we're showing the on-ramp failure screen,
  // otherwise the standard transaction-status title.
  useHeader(
    deposit?.failure
      ? t('checkout.deposit')
      : t('checkout.transactionStatus.detailsTitle')
  )

  // Pull the on-chain hash emitted by the provider into the URL so polling
  // kicks in. `acknowledge` clears it on the provider side so re-renders
  // don't loop.
  useEffect(() => {
    if (!deposit?.depositTxHash) {
      return
    }
    navigate({
      to: `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`,
      search: { transactionHash: deposit.depositTxHash },
    })
    deposit.acknowledgeDepositTxHash()
  }, [deposit, navigate])

  const { status, phase, isLoading } = useCheckoutTransactionStatus(
    transactionHash,
    simulate
  )

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

  // Pre-hash provider failure preempts any other status state because
  // polling can't have started without a hash.
  if (deposit?.failure) {
    return (
      <PageContainer bottomGutters>
        <OnRampFailureScreen
          kind={deposit.failure.kind}
          providerName={providerName}
          description={deposit.failure.message}
          onRetry={deposit.failure.retry}
        />
      </PageContainer>
    )
  }

  if (simulate === 'watching' || (!transactionHash && !status)) {
    return (
      <PageContainer bottomGutters>
        <StatusWatching />
      </PageContainer>
    )
  }

  if (phase === 'failed') {
    return (
      <PageContainer bottomGutters>
        <OnRampFailureScreen
          kind="withdrawal"
          providerName={providerName}
          description={
            (status as StatusResponse | undefined)?.substatusMessage ??
            t('checkout.onramp.failure.withdrawalDescription', { providerName })
          }
          onRetry={() => window.history.back()}
        />
      </PageContainer>
    )
  }

  if (phase === 'done' && minHoldElapsed && status) {
    const goToDetails = () => {
      if (!transactionHash) {
        return
      }
      navigate({
        to: `/${navigationRoutes.transactionExecution}/${navigationRoutes.transactionDetails}`,
        search: { transactionHash },
      })
    }
    const goHome = () => {
      navigate({ to: navigationRoutes.home })
    }
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
