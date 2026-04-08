import DeleteOutline from '@mui/icons-material/DeleteOutline'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import { Box, Tooltip, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { CircularProgressPending } from '../../components/Step/CircularProgress.style.js'
import {
  ExecutionTimerText,
  getExpiryTimestamp,
} from '../../components/Timer/StepTimer.js'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  DeleteButton,
  PendingCircle,
  StatusIconCircle,
  StatusRow,
} from './ActiveTransactionItem.style.js'

export const ActiveTransactionItem: React.FC<{ routeId: string }> = ({
  routeId,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { route, status, deleteRoute } = useRouteExecution({
    routeId,
    executeInBackground: true,
  })

  const lastActiveStep = route?.steps.findLast((step) => step.execution)
  const lastActiveAction = lastActiveStep?.execution?.actions?.at(-1)

  const { title } = useActionMessage(lastActiveStep, lastActiveAction)

  if (!route || !lastActiveStep) {
    // TODO: there should not be return null
    return null
  }

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

  const isFailed = status === RouteExecutionStatus.Failed

  const statusIcon = (() => {
    if (isFailed) {
      return (
        <StatusIconCircle color="error">
          <ErrorRounded />
        </StatusIconCircle>
      )
    }

    if (
      ['ACTION_REQUIRED', 'MESSAGE_REQUIRED', 'RESET_REQUIRED'].includes(
        lastActiveAction?.status ?? ''
      )
    ) {
      return (
        <StatusIconCircle color="info">
          <InfoRounded />
        </StatusIconCircle>
      )
    }

    return (
      <PendingCircle>
        <CircularProgressPending size={24} sx={{ top: -2, left: -2 }} />
      </PendingCircle>
    )
  })()

  return (
    <Card onClick={handleClick} indented>
      <StatusRow sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {statusIcon}
          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
        {isFailed ? (
          <Tooltip title={t('button.clearTransaction')}>
            <DeleteButton size="small" onClick={handleDelete}>
              <DeleteOutline sx={{ fontSize: 16 }} />
            </DeleteButton>
          </Tooltip>
        ) : lastActiveStep?.execution?.signedAt ? (
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            <ExecutionTimerText
              expiryTimestamp={getExpiryTimestamp(lastActiveStep)}
            />
          </Typography>
        ) : null}
      </StatusRow>
      <RouteTokens route={route} />
    </Card>
  )
}
