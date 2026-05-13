import type { FullStatusData, StatusResponse } from '@lifi/sdk'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../../components/PageContainer.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { navigationRoutes } from '../../../utils/navigationRoutes.js'
import { OnRampFailureScreen } from '../../components/OnRampFailureScreen.js'
import { useCheckoutTransactionStatus } from '../../hooks/useCheckoutTransactionStatus.js'
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

  useHeader(t('checkout.transactionStatus.detailsTitle'))

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
        {/* TODO(checkout-failure-provider): thread the actual funding-source
            provider through to this page; hardcoding "Mesh" preserves prior
            copy but reads wrong for non-Mesh deposits. */}
        <OnRampFailureScreen
          kind="withdrawal"
          providerName="Mesh"
          description={
            (status as StatusResponse | undefined)?.substatusMessage ??
            t('checkout.onramp.failure.withdrawalDescription', {
              providerName: 'Mesh',
            })
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
