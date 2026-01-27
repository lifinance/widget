import type { ExecutionAction } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import {
  CircularIcon,
  CircularProgressPending,
} from './CircularProgress.style.js'

export function CircularProgress({ action }: { action: ExecutionAction }) {
  return (
    <CircularIcon status={action.status} substatus={action.substatus}>
      {action.status === 'STARTED' || action.status === 'PENDING' ? (
        <CircularProgressPending size={40} />
      ) : null}
      {action.status === 'ACTION_REQUIRED' ||
      action.status === 'MESSAGE_REQUIRED' ||
      action.status === 'RESET_REQUIRED' ? (
        <InfoRounded
          color="info"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {action.status === 'DONE' &&
      (action.substatus === 'PARTIAL' || action.substatus === 'REFUNDED') ? (
        <WarningRounded
          sx={(theme) => ({
            position: 'absolute',
            fontSize: '1.5rem',
            color: `color-mix(in srgb, ${theme.vars.palette.warning.main} 68%, black)`,
          })}
        />
      ) : action.status === 'DONE' ? (
        <Done
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {action.status === 'FAILED' ? (
        <ErrorRounded
          color="error"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
    </CircularIcon>
  )
}
