import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import type { JSX } from 'react'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { TransactionStatusCard } from '../../components/TransactionStatusCard/index.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { TransactionDoneButtons } from './TransactionDoneButtons.js'
import { TransactionFailedButtons } from './TransactionFailedButtons.js'

export interface TransactionExecutionContentProps {
  route: RouteExtended
  status: RouteExecutionStatus
  restartRoute: () => void
  deleteRoute: () => void
}

/**
 * Execution-phase content block for the Transaction page.
 *
 * Groups the status card with its warning messages and the terminal
 * button group (Done or Failed). Rendered once `status` has left Idle —
 * the Idle branch of {@link TransactionContent} handles the review step
 * separately.
 */
export const TransactionExecutionContent: React.FC<
  TransactionExecutionContentProps
> = ({ route, status, restartRoute, deleteRoute }): JSX.Element => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TransactionStatusCard route={route} status={status} />
      <WarningMessages route={route} allowInteraction />
      {status === RouteExecutionStatus.Failed ? (
        <TransactionFailedButtons
          route={route}
          restartRoute={restartRoute}
          deleteRoute={deleteRoute}
        />
      ) : hasEnumFlag(status, RouteExecutionStatus.Done) ? (
        <TransactionDoneButtons route={route} status={status} />
      ) : null}
    </Box>
  )
}
