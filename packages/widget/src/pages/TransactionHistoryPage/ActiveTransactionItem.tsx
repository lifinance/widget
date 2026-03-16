import type { LiFiStepExtended } from '@lifi/sdk'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionRow } from '../../components/ActionRow/ActionRow.js'
import { Card } from '../../components/Card/Card.js'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { TimerRing } from '../../components/Timer/StepStatusTimer.js'
import { StepTimer } from '../../components/Timer/StepTimer.js'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { DeleteButton, RetryButton } from './ActiveTransactionItem.style.js'

export const ActiveTransactionItem: React.FC<{ routeId: string }> = memo(
  ({ routeId }) => {
    const navigate = useNavigate()
    const { route, status, restartRoute, deleteRoute } = useRouteExecution({
      routeId,
      executeInBackground: true,
    })

    const lastStep = route?.steps.findLast((step) => step.execution)
    const lastAction = lastStep?.execution?.actions?.at(-1)
    const { title } = useActionMessage(lastStep, lastAction)

    if (!route) {
      return null
    }

    const isFailed = status === RouteExecutionStatus.Failed

    const handleClick = () => {
      navigate({
        to: navigationRoutes.transactionExecution,
        search: { routeId },
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

    return (
      <Card onClick={handleClick} indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {isFailed ? (
            <FailedTransactionRow
              onRetry={handleRetry}
              onDelete={handleDelete}
            />
          ) : (
            <PendingTransactionRow step={lastStep} title={title} />
          )}
          <RouteTokens route={route} />
        </Box>
      </Card>
    )
  }
)

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
  if (!title) {
    return null
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
