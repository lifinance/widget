import type { Process } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import {
  CircularIcon,
  CircularProgressPending,
} from './CircularProgress.style.js'

export function CircularProgress({ process }: { process: Process }) {
  return (
    <CircularIcon status={process.status} substatus={process.substatus}>
      {process.status === 'STARTED' || process.status === 'PENDING' ? (
        <CircularProgressPending size={40} />
      ) : null}
      {process.status === 'ACTION_REQUIRED' ||
      process.status === 'MESSAGE_REQUIRED' ? (
        <InfoRounded
          color="info"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {process.status === 'DONE' &&
      (process.substatus === 'PARTIAL' || process.substatus === 'REFUNDED') ? (
        <WarningRounded
          sx={(theme) => ({
            position: 'absolute',
            fontSize: '1.5rem',
            color: `color-mix(in srgb, ${theme.vars.palette.warning.main} 68%, black)`,
          })}
        />
      ) : process.status === 'DONE' ? (
        <Done
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1.5rem',
          }}
        />
      ) : null}
      {process.status === 'FAILED' ? (
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
