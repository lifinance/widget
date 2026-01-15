import type { LiFiStepExtended } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, useTheme } from '@mui/material'
import type React from 'react'
import { getStatusColor } from '../../utils/getStatusColor.js'
import { ExecutionTimer } from '../Timer/ExecutionTimer.js'

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

  if (!step.execution) {
    return null
  }

  const status = step.execution?.status
  const substatus = step.execution?.substatus

  const withTimer = status === 'STARTED' || status === 'PENDING'
  const actionRequired =
    status === 'ACTION_REQUIRED' ||
    status === 'MESSAGE_REQUIRED' ||
    status === 'RESET_REQUIRED'

  if (withTimer || actionRequired) {
    return <ExecutionTimer step={step} />
  }

  const backgroundColor =
    getStatusColor(theme, status, substatus) || 'transparent'

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
