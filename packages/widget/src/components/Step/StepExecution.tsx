import type { LiFiStepExtended } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useExecutionMessage } from '../../hooks/useExecutionMessage.js'
import { CircularProgress } from './CircularProgress.js'

export const StepExecution: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  const { title, message } = useExecutionMessage(step)

  if (!step.execution || step.execution.status === 'DONE') {
    return null
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularProgress
          status={step.execution.status}
          substatus={step.execution.substatus}
        />
        <Typography
          sx={{
            marginLeft: 2,
            marginRight: 0.5,
            flex: 1,
            fontSize: 14,
            fontWeight: step.execution?.error ? 600 : 400,
          }}
        >
          {title}
        </Typography>
      </Box>
      {message ? (
        <Typography
          sx={{
            ml: 7,
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}
