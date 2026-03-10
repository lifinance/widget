import DeleteIcon from '@mui/icons-material/Delete'
import { Button, CircularProgress, IconButton } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { StepTimer } from '../../components/Timer/StepTimer.js'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  CardContent,
  StatusBar,
  StatusMessage,
  StatusTitle,
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
    <Card onClick={handleClick} sx={{ mb: 1.5 }}>
      <CardContent>
        {isFailed ? (
          <StatusBar>
            <IconCircle status="error" size={24} />
            <StatusTitle>{t('error.title.transactionFailed')}</StatusTitle>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                p: 0.5,
                backgroundColor: 'background.paper',
                width: 24,
                height: 24,
              }}
            >
              <DeleteIcon sx={{ fontSize: 12 }} />
            </IconButton>
            <Button
              size="small"
              variant="text"
              onClick={handleRetry}
              sx={{
                fontWeight: 700,
                fontSize: 10,
                height: 24,
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                color: 'text.primary',
                backgroundColor: 'background.paper',
              }}
            >
              {t('button.retry')}
            </Button>
          </StatusBar>
        ) : null}
        {!isFailed && title ? (
          <StatusBar>
            <CircularProgress size={20} />
            <StatusMessage>{title}</StatusMessage>
            {lastStep ? (
              <TimerText>
                <StepTimer step={lastStep} />
              </TimerText>
            ) : null}
          </StatusBar>
        ) : null}
        <RouteTokens route={route} />
      </CardContent>
    </Card>
  )
}
