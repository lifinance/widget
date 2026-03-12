import type { RouteExtended } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { StatusBottomSheet } from '../../pages/TransactionPage/StatusBottomSheet.js'
import type { RouteExecutionStatus } from '../../stores/routes/types.js'
import { StepStatusIndicator } from './StepStatusIndicator.js'

export const ExecutionProgress: React.FC<{
  route: RouteExtended
  status: RouteExecutionStatus
}> = ({ route, status }) => {
  const lastStep = route.steps.at(-1)
  const lastAction = lastStep?.execution?.actions?.at(-1)
  const { title, message } = useActionMessage(lastStep, lastAction)

  if (!lastStep || !lastAction) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <StepStatusIndicator step={lastStep} />
      </Box>
      <Typography
        sx={{
          fontSize: lastAction.status === 'FAILED' ? 18 : 14,
          fontWeight: lastAction.status === 'FAILED' ? 700 : 500,
          color: 'text.primary',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      {message ? (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          {message}
        </Typography>
      ) : null}
      {/* TODO: Remove this once the logic is merged */}
      <StatusBottomSheet route={route} status={status} />
    </Box>
  )
}
