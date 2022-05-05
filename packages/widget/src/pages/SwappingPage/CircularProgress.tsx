import { Status } from '@lifinance/sdk';
import {
  Done as DoneIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  CircularProgress as CircularProgressStyled,
  CircularProgressPending,
} from './CircularProgress.style';

export function CircularProgress({ status }: { status: Status }) {
  return (
    <Box
      sx={{
        display: 'grid',
        position: 'relative',
        placeItems: 'center',
      }}
    >
      <CircularProgressStyled
        variant="determinate"
        status={status}
        size={32}
        thickness={3}
        value={100}
      />
      {status === 'PENDING' ? (
        <CircularProgressPending color="primary" size={32} thickness={3} />
      ) : null}
      {status === 'ACTION_REQUIRED' ? (
        <InfoIcon
          color="primary"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
      {status === 'DONE' ? (
        <DoneIcon
          color="success"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
      {status === 'FAILED' ? (
        <WarningIcon
          color="error"
          sx={{
            position: 'absolute',
            fontSize: '1rem',
          }}
        />
      ) : null}
    </Box>
  );
}
