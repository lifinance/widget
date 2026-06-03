import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { domMax, LazyMotion, MotionConfig } from 'motion/react'
import type React from 'react'
import type { JSX } from 'react'
import { Card } from '../../components/Card/Card.js'
import { ExecutionStatusCard } from '../../components/ExecutionStatusCard/ExecutionStatusCard.js'
import { StatusIcon } from '../../components/ExecutionStatusCard/StatusIcon.js'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { useExecutionRows } from '../../components/StepActions/executionRows.js'
import { useRouteExecutionMessage } from '../../hooks/useRouteExecutionMessage.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { ExecutionDoneCard } from './ExecutionDoneCard.js'
import { TransactionDoneButtons } from './TransactionDoneButtons.js'
import { TransactionFailedButtons } from './TransactionFailedButtons.js'

export interface TransactionExecutionContentProps {
  route: RouteExtended
  status: RouteExecutionStatus
  restartRoute: () => void
  deleteRoute: () => void
}

/**
 * Execution-phase layout for the Transaction page.
 * Renders the {@link ExecutionStatusCard}, warning messages,
 * and terminal action buttons.
 */
export const TransactionExecutionContent: React.FC<
  TransactionExecutionContentProps
> = ({ route, status, restartRoute, deleteRoute }): JSX.Element => {
  const { title, message } = useRouteExecutionMessage(route, status)
  const {
    mode,
    contractCompactComponent,
    contractSecondaryComponent,
    defaultUI,
  } = useWidgetConfig()

  const isDone = hasEnumFlag(status, RouteExecutionStatus.Done)
  const rows = useExecutionRows(route, isDone ? route.toAddress : undefined)

  const showContract =
    mode === 'custom' &&
    isDone &&
    !!(contractCompactComponent || contractSecondaryComponent)

  const iconSlot = showContract ? (
    contractCompactComponent || contractSecondaryComponent
  ) : (
    <StatusIcon route={route} status={status} />
  )

  const footerSlot = isDone ? (
    <ExecutionDoneCard route={route} status={status} />
  ) : (
    <Card type="default" indented>
      <RouteTokens
        route={route}
        defaultExpanded={defaultUI?.transactionDetailsExpanded}
      />
    </Card>
  )

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ExecutionStatusCard
            title={title}
            description={message}
            rows={rows}
            iconSlot={iconSlot}
            footerSlot={footerSlot}
          />
          <WarningMessages route={route} allowInteraction />
          {status === RouteExecutionStatus.Failed ? (
            <TransactionFailedButtons
              route={route}
              restartRoute={restartRoute}
              deleteRoute={deleteRoute}
            />
          ) : isDone ? (
            <TransactionDoneButtons route={route} status={status} />
          ) : null}
        </Box>
      </MotionConfig>
    </LazyMotion>
  )
}
