import DeleteIcon from '@mui/icons-material/Delete'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionRow } from '../../components/ActionRow/ActionRow.js'
import { Card } from '../../components/Card/Card.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { StepTimer } from '../../components/Timer/StepTimer.js'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  DeleteButton,
  RetryButton,
  TimerText,
} from './ActiveTransactionCard.style.js'

export const ActiveTransactionCard: React.FC<{
  routeId: string
}> = ({ routeId }) => {
  const { t } = useTranslation()
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

  const handleRetry = (e: MouseEvent) => {
    e.stopPropagation()
    restartRoute()
  }

  return (
    <Card onClick={handleClick} sx={{ mb: 1.5 }} indented>
      <Box sx={{ mb: 2 }}>
        {isFailed ? (
          <ActionRow
            variant="error"
            message={t('error.title.transactionFailed')}
            endAdornment={
              <>
                <DeleteButton size="small" onClick={handleDelete}>
                  <DeleteIcon sx={{ fontSize: 12 }} />
                </DeleteButton>
                <RetryButton size="small" variant="text" onClick={handleRetry}>
                  {t('button.retry')}
                </RetryButton>
              </>
            }
          />
        ) : undefined}
        {!isFailed && title ? (
          <ActionRow
            variant="pending"
            message={title}
            endAdornment={
              lastStep ? (
                <TimerText>
                  <StepTimer step={lastStep} />
                </TimerText>
              ) : undefined
            }
          />
        ) : undefined}
      </Box>
      <RouteTokens route={route} />
    </Card>
  )
}
