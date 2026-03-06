import type { LiFiStepExtended } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, useTheme } from '@mui/material'
import type React from 'react'
import { getStatusColor } from '../../utils/getStatusColor.js'
import { StepTimer } from '../Timer/StepTimer.js'

interface CircularProgressProps {
  step: LiFiStepExtended
}

const commonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 96,
  height: 96,
  border: '3px solid',
  borderRadius: '50%',
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ step }) => {
  const theme = useTheme()

  const lastAction = step.execution?.actions?.at(-1)

  if (!step.execution || !lastAction) {
    return null
  }

  const status = lastAction?.status
  const substatus = lastAction?.substatus

  const withTimer = status === 'STARTED' || status === 'PENDING'
  const actionRequired =
    status === 'ACTION_REQUIRED' ||
    status === 'MESSAGE_REQUIRED' ||
    status === 'RESET_REQUIRED'

  if (withTimer || actionRequired) {
    return <StepTimer step={step} />
  }

  const backgroundColor = getStatusColor(theme, status, substatus)

  switch (status) {
    case 'DONE':
      if (substatus === 'PARTIAL' || substatus === 'REFUNDED') {
        return (
          <Box
            sx={{
              ...commonStyles,
              borderColor: 'warning.main',
              backgroundColor,
            }}
          >
            <WarningRounded
              color="warning"
              sx={{
                fontSize: 48,
              }}
            />
          </Box>
        )
      }

      return (
        <Box
          sx={{
            ...commonStyles,
            borderColor: 'success.main',
            backgroundColor,
          }}
        >
          <Done
            color="success"
            sx={{
              fontSize: 48,
            }}
          />
        </Box>
      )
    case 'FAILED':
      return (
        <Box
          sx={{
            ...commonStyles,
            borderColor: 'error.main',
            backgroundColor,
          }}
        >
          <ErrorRounded
            color="error"
            sx={{
              fontSize: 48,
            }}
          />
        </Box>
      )
  }
}
