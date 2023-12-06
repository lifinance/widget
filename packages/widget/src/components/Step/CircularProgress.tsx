import type { Process } from '@lifi/sdk';
import DoneIcon from '@mui/icons-material/Done';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { darken } from '@mui/material/styles';
import {
  CircularIcon,
  CircularProgressPending,
} from './CircularProgress.style';

export function CircularProgress({ process }: { process: Process }) {
  return (
    <CircularIcon status={process.status} substatus={process.substatus}>
      {process.status === 'STARTED' || process.status === 'PENDING' ? (
        <CircularProgressPending size={32} thickness={3} />
      ) : null}
      {process.status === 'ACTION_REQUIRED' ? (
        <InfoRoundedIcon
          color="info"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
      {process.status === 'DONE' &&
      (process.substatus === 'PARTIAL' || process.substatus === 'REFUNDED') ? (
        <WarningRoundedIcon
          sx={(theme) => ({
            position: 'absolute',
            fontSize: '1rem',
            color: darken(theme.palette.warning.main, 0.32),
          })}
        />
      ) : process.status === 'DONE' ? (
        <DoneIcon
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
      {process.status === 'FAILED' ? (
        <ErrorRoundedIcon
          color="error"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
    </CircularIcon>
  );
}
