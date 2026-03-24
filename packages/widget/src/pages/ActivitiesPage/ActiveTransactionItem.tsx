import type { TokenAmount } from '@lifi/sdk'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import { Box, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { Card } from '../../components/Card/Card.js'
import { CircularProgressPending } from '../../components/Step/CircularProgress.style.js'
import {
  ExecutionTimer,
  getExpiryTimestamp,
} from '../../components/Timer/StepTimer.js'
import { Token } from '../../components/Token/Token.js'
import { TokenDivider } from '../../components/Token/Token.style.js'
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
  const navigate = useNavigate()
  const { route, status, deleteRoute } = useRouteExecution({
    routeId,
    executeInBackground: true,
  })

  const lastActiveStep = route?.steps.findLast((step) => step.execution)
  const lastActiveAction = lastActiveStep?.execution?.actions?.at(-1)

  const { title } = useActionMessage(lastActiveStep, lastActiveAction)

  if (!route || !lastActiveStep) {
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

  const fromToken: TokenAmount = {
    ...route.fromToken,
    amount: BigInt(route.fromAmount ?? '0'),
    priceUSD: route.fromToken.priceUSD ?? '0',
    symbol: route.fromToken.symbol ?? '',
    decimals: route.fromToken.decimals ?? 0,
    name: route.fromToken.name ?? '',
    chainId: route.fromToken.chainId,
  }

  const toToken: TokenAmount = {
    ...route.toToken,
    amount: BigInt(route.toAmount ?? '0'),
    priceUSD: route.toToken.priceUSD ?? '0',
    symbol: route.toToken.symbol ?? '',
    decimals: route.toToken.decimals ?? 0,
    name: route.toToken.name ?? '',
    chainId: route.toToken.chainId,
  }

  return (
    <Card onClick={handleClick} indented>
      <StatusRow sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {statusIcon}
          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
        {isFailed ? (
          <DeleteButton size="small" onClick={handleDelete}>
            <DeleteOutline sx={{ fontSize: 16 }} />
          </DeleteButton>
        ) : lastActiveStep?.execution?.signedAt ? (
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            <ExecutionTimer
              expiryTimestamp={getExpiryTimestamp(lastActiveStep)}
              hideInProgress
            />
          </Typography>
        ) : null}
      </StatusRow>
      <Box>
        <Token token={fromToken} />
        <Box sx={{ pl: 2.375, py: 0.5 }}>
          <TokenDivider />
        </Box>
        <Token token={toToken} />
      </Box>
    </Card>
  )
}
