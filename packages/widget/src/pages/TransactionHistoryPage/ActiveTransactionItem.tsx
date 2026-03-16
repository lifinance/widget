import type { LiFiStepExtended, RouteExtended } from '@lifi/sdk'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionRow } from '../../components/ActionRow/ActionRow.js'
import { Card } from '../../components/Card/Card.js'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { TimerRing } from '../../components/Timer/StepStatusTimer.js'
import { StepTimer } from '../../components/Timer/StepTimer.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { useRouteExecutionMessage } from '../../hooks/useRouteExecutionMessage.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { DeleteButton, RetryButton } from './ActiveTransactionItem.style.js'

export const ActiveTransactionItem: React.FC<{ routeId: string }> = memo(
  ({ routeId }) => {
    const { route, status, restartRoute, deleteRoute } = useRouteExecution({
      routeId,
      executeInBackground: true,
    })

    if (!route) {
      return null
    }

    return (
      <ActiveTransactionItemContent
        route={route}
        status={status}
        restartRoute={restartRoute}
        deleteRoute={deleteRoute}
      />
    )
  }
)

const ActiveTransactionItemContent: React.FC<{
  route: RouteExtended
  status: RouteExecutionStatus | undefined
  restartRoute: () => void
  deleteRoute: () => void
}> = ({ route, status, restartRoute, deleteRoute }) => {
  const navigate = useNavigate()
  const lastStep = route.steps.at(-1)
  const { title } = useRouteExecutionMessage(
    route,
    status ?? RouteExecutionStatus.Pending
  )

  const handleClick = () => {
    navigate({
      to: navigationRoutes.transactionExecution,
      search: { routeId: route.id },
    })
  }

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    deleteRoute()
  }

  const handleRetry = () => {
    // NB: Do not stop propagation here:
    // open the transaction execution page and retry the transaction simultaneously
    restartRoute()
  }

  const isFailed = status === RouteExecutionStatus.Failed

  return (
    <Card onClick={handleClick} indented>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {isFailed ? (
          <FailedTransactionRow onRetry={handleRetry} onDelete={handleDelete} />
        ) : (
          <PendingTransactionRow step={lastStep} title={title} />
        )}
        <RouteTokens route={route} />
      </Box>
    </Card>
  )
}

const FailedTransactionRow: React.FC<{
  onRetry: () => void
  onDelete: (e: MouseEvent) => void
}> = ({ onRetry, onDelete }) => {
  const { t } = useTranslation()
  return (
    <ActionRow
      startAdornment={<IconCircle status="error" size={24} />}
      message={t('error.title.transactionFailed')}
      endAdornment={
        <>
          <RetryButton size="small" onClick={onRetry}>
            {t('button.retry')}
          </RetryButton>
          <DeleteButton size="small" onClick={onDelete}>
            <DeleteOutline sx={{ fontSize: 16 }} />
          </DeleteButton>
        </>
      }
    />
  )
}

const PendingTransactionRow: React.FC<{
  step: LiFiStepExtended | undefined
  title: string | undefined
}> = ({ step, title }) => {
  if (!title || step?.execution?.status === 'DONE') {
    return null
  }

  const isActionRequired = step?.execution?.status === 'ACTION_REQUIRED'
  if (isActionRequired) {
    return (
      <ActionRow
        startAdornment={<IconCircle status="info" size={24} />}
        message={title}
      />
    )
  }

  return (
    <ActionRow
      startAdornment={
        step ? (
          <TimerRing step={step} size={24} thickness={4} showLabel={false} />
        ) : undefined
      }
      message={title}
      endAdornment={step ? <StepTimer step={step} /> : undefined}
    />
  )
}
