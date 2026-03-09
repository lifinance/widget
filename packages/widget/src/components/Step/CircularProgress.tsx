import type { LiFiStepExtended } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { useTheme } from '@mui/material'
import { getStatusColor } from '../../utils/getStatusColor.js'
import { StatusCircle } from './CircularProgress.style.js'
import { IndeterminateRing, TimerRing } from './CircularProgressTimer.js'

interface CircularProgressProps {
  step: LiFiStepExtended
}

const iconSx = { fontSize: 48 }

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

  if (withTimer) {
    if (!step.execution?.signedAt) {
      return <IndeterminateRing />
    }
    return <TimerRing step={step} />
  }

  const backgroundColor = getStatusColor(theme, status, substatus)

  if (actionRequired) {
    return (
      <StatusCircle sx={{ backgroundColor }}>
        <InfoRounded color="info" sx={iconSx} />
      </StatusCircle>
    )
  }

  switch (status) {
    case 'DONE':
      if (substatus === 'PARTIAL' || substatus === 'REFUNDED') {
        return (
          <StatusCircle sx={{ backgroundColor }}>
            <WarningRounded color="warning" sx={iconSx} />
          </StatusCircle>
        )
      }
      return (
        <StatusCircle sx={{ backgroundColor }}>
          <Done color="success" sx={iconSx} />
        </StatusCircle>
      )
    case 'FAILED':
      return (
        <StatusCircle sx={{ backgroundColor }}>
          <ErrorRounded color="error" sx={iconSx} />
        </StatusCircle>
      )
  }
}
