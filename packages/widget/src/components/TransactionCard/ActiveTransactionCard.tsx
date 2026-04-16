import type { RouteExtended } from '@lifi/sdk'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import { Box, Tooltip, Typography } from '@mui/material'
import type { JSX, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { getExpiryTimestamp } from '../../utils/timer.js'
import { ActionRow } from '../ActionRow/ActionRow.js'
import { Card } from '../Card/Card.js'
import { IconCircle } from '../IconCircle/IconCircle.js'
import { RouteTokens } from '../RouteCard/RouteTokens.js'
import { ExecutionTimerText } from '../Timer/ExecutionTimerText.js'
import { CircularProgressPending } from '../Timer/StepStatusTimer.style.js'
import {
  DeleteButton,
  PendingCircle,
  RetryButton,
} from './ActiveTransactionCard.style.js'

interface ActiveTransactionCardProps {
  route: RouteExtended
  status?: RouteExecutionStatus
  onClick: () => void
  onDelete: (e: MouseEvent) => void
  onRetry?: () => void
}

export const ActiveTransactionCard = ({
  route,
  status,
  onClick,
  onDelete,
  onRetry,
}: ActiveTransactionCardProps): JSX.Element => {
  const { t } = useTranslation()

  const lastActiveStep = route.steps.findLast((step) => step.execution)
  const lastActiveAction = lastActiveStep?.execution?.actions?.at(-1)
  const { title } = useActionMessage(lastActiveStep, lastActiveAction)

  const isFailed = status === RouteExecutionStatus.Failed

  const statusIcon = (() => {
    if (isFailed) {
      return <IconCircle status="error" size={24} />
    }
    if (
      ['ACTION_REQUIRED', 'MESSAGE_REQUIRED', 'RESET_REQUIRED'].includes(
        lastActiveAction?.status ?? ''
      )
    ) {
      return <IconCircle status="info" size={24} />
    }
    return (
      <PendingCircle>
        <CircularProgressPending size={24} sx={{ top: -2, left: -2 }} />
      </PendingCircle>
    )
  })()

  return (
    <Card onClick={onClick} indented>
      <ActionRow
        sx={{ mb: 1.5 }}
        startAdornment={statusIcon}
        message={title ?? ''}
        endAdornment={
          isFailed ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onRetry ? (
                <RetryButton size="small" onClick={onRetry}>
                  {t('button.tryAgain')}
                </RetryButton>
              ) : null}
              <Tooltip title={t('button.clearTransaction')}>
                <DeleteButton size="small" onClick={onDelete}>
                  <DeleteOutline sx={{ fontSize: 16 }} />
                </DeleteButton>
              </Tooltip>
            </Box>
          ) : lastActiveStep?.execution?.signedAt ? (
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
              <ExecutionTimerText
                expiryTimestamp={getExpiryTimestamp(lastActiveStep)}
              />
            </Typography>
          ) : undefined
        }
      />
      <RouteTokens route={route} />
    </Card>
  )
}
