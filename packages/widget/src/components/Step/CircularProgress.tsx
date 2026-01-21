import type { ExecutionStatus, Substatus } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import {
  CircularIcon,
  CircularProgressPending,
} from './CircularProgress.style.js'

export function CircularProgress({
  status,
  substatus,
}: {
  status: ExecutionStatus
  substatus?: Substatus
}) {
  return (
    <CircularIcon status={status} substatus={substatus}>
      {status === 'STARTED' || status === 'PENDING' ? (
        <CircularProgressPending size={40} />
      ) : null}
      {status === 'ACTION_REQUIRED' ||
      status === 'MESSAGE_REQUIRED' ||
      status === 'RESET_REQUIRED' ? (
        <InfoRounded
          color="info"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {status === 'DONE' &&
      (substatus === 'PARTIAL' || substatus === 'REFUNDED') ? (
        <WarningRounded
          sx={(theme) => ({
            position: 'absolute',
            fontSize: '1.5rem',
            color: `color-mix(in srgb, ${theme.vars.palette.warning.main} 68%, black)`,
          })}
        />
      ) : status === 'DONE' ? (
        <Done
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {status === 'FAILED' ? (
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
